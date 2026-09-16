const fs = require('fs');
const { validateDocumentContent } = require('./security');

// Every open() below ORs this in. O_NOFOLLOW refuses a symlinked destination outright rather
// than writing/reading through it. O_NONBLOCK stops an open() on a FIFO with no counterpart
// from hanging indefinitely (read side: never blocks with O_NONBLOCK; write side: fails fast
// with ENXIO if nothing has it open for reading) -- it is a documented no-op for a regular
// file, so it is always safe to include unconditionally.
const NOFOLLOW_NONBLOCK = fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK;

function translateOpenError(file, error) {
  if (error.code === 'ELOOP' || error.code === 'ENXIO') return new Error(`Unsafe NFR output: ${file}`);
  if (error.code === 'EEXIST') return new Error(`NFR output already exists: ${file}. Use generate-nfr --force to overwrite.`);
  return error;
}

function assertGenerationOutputAvailable(file, force = false) {
  try {
    const stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Unsafe NFR output: ${file}`);
    if (!force) throw new Error(`NFR output already exists: ${file}. Preserve your edits or use generate-nfr --force to overwrite.`);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}

/**
 * Single safe-write primitive for every NFR output (report, classification/candidates JSON,
 * standalone/rebuilt .feature). A single open() call establishes the file's existence/type
 * guarantee (O_EXCL fails atomically with EEXIST if the target now exists; O_TRUNC overwrites
 * in place); the subsequent stat() and writeFile() both operate on that same already-open
 * descriptor, with no path relookup in between, so nothing can swap the target between the
 * open() and the write. `force` selects O_TRUNC (overwrite in place, for a caller that has
 * already read the file and is intentionally replacing its content, e.g. a force rebuild) or
 * O_EXCL (atomic create-or-fail) -- the exclusive-create-or-force contract every non-force NFR
 * output shares. The post-open stat() check rejects a non-regular target (this also covers a
 * FIFO that a write-side open managed to complete on, e.g. because a reader was already
 * attached) before any bytes are written. Returns the identity (device + inode) of the file
 * this call just wrote, captured from the same descriptor used to write it -- see
 * removeIfSameFile for why identity, not path, matters for rollback.
 *
 * Residual, not closed by this primitive: O_NOFOLLOW governs only the final path component. If
 * an ancestor directory of `file` is replaced with a symlink between path construction
 * (buildContainedChildPath's containment check, in nfr-generator.js) and this open(), the open
 * follows that ancestor. Closing that fully would need directory-fd/openat-style resolution of
 * every path segment, which Node's fs module does not expose portably; callers narrow (not
 * eliminate) the window by re-deriving the path via buildContainedChildPath immediately before
 * calling this function, rather than reusing a path computed long before the write.
 */
async function writeSafe(file, text, force = false) {
  const validated = validateDocumentContent(text);
  const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | NOFOLLOW_NONBLOCK
    | (force ? fs.constants.O_TRUNC : fs.constants.O_EXCL);
  let handle;
  try {
    handle = await fs.promises.open(file, flags, 0o600);
    const preWriteStat = await handle.stat();
    if (!preWriteStat.isFile()) throw new Error(`Unsafe NFR output: ${file}`);
    await handle.writeFile(validated, 'utf8');
    const written = await handle.stat();
    return { path: file, dev: written.dev, ino: written.ino };
  } catch (error) {
    throw translateOpenError(file, error);
  } finally {
    if (handle) await handle.close();
  }
}

/**
 * Append-only counterpart to writeSafe, for the one case that must never re-truncate a file it
 * already read moments earlier: adding the NFR Gherkin section to an existing base `.feature`
 * file (see writeNFRGherkinScenarios's marker-absent branch in nfr-generator.js). Opens
 * O_RDWR (not O_WRONLY) so the marker presence re-check below reads through the very same
 * descriptor the append then writes through, rather than trusting a marker-absence decision an
 * earlier, separate readSafeIfExists() call made -- that earlier read only decides which branch
 * of writeNFRGherkinScenarios to take; this call independently re-verifies the marker is still
 * absent on freshly-read content immediately before writing, so two concurrent callers that
 * both observed the marker absent no longer both append a duplicate section (the second one to
 * reach this open() sees the first one's marker and reports `false` instead). Returns `true` if
 * it appended, `false` if the marker was already present (nothing written). O_APPEND makes the
 * write itself a single seek-to-end-and-write, so it never depends on -- and can never stomp --
 * whatever the file's content was when read, a moment earlier, by this same call; a concurrent
 * editor's unrelated change still survives, with this section landing after it. No
 * O_CREAT/O_EXCL/O_TRUNC: the caller has already confirmed the file exists (via
 * readSafeIfExists), and this primitive intentionally cannot create one.
 */
async function appendSectionIfMissing(file, marker, section) {
  const validated = validateDocumentContent(section);
  const flags = fs.constants.O_RDWR | fs.constants.O_APPEND | NOFOLLOW_NONBLOCK;
  let handle;
  try {
    handle = await fs.promises.open(file, flags);
    const stat = await handle.stat();
    if (!stat.isFile()) throw new Error(`Unsafe NFR output: ${file}`);
    const current = await handle.readFile('utf8');
    if (current.includes(marker)) return false;
    await handle.writeFile(validated, 'utf8');
    return true;
  } catch (error) {
    throw translateOpenError(file, error);
  } finally {
    if (handle) await handle.close();
  }
}

/**
 * Read a path expected to be a plain file, refusing a symlink or other non-regular file. Opens
 * with O_NOFOLLOW and stats/reads that same open file descriptor, rather than a separate
 * lstat-then-read (a TOCTOU race: the path could be replaced with a symlink between the check
 * and the read). Returns null if the path doesn't exist.
 */
async function readSafeIfExists(file) {
  let handle;
  try {
    handle = await fs.promises.open(file, fs.constants.O_RDONLY | NOFOLLOW_NONBLOCK);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw translateOpenError(file, error);
  }
  try {
    const stat = await handle.stat();
    if (!stat.isFile()) throw new Error(`Unsafe NFR output: ${file}`);
    return await handle.readFile('utf8');
  } finally {
    await handle.close();
  }
}

/**
 * Undo a writeSafe() call this run made, but only if `identity.path` still refers to the exact
 * inode that call created -- an identity check (device + inode captured at write time), not a
 * bare path removal, so a file some other process put at this path afterward (e.g. it recreated
 * the path after this run's failure but before this cleanup ran) is, in the overwhelmingly
 * common case, not collaterally deleted. A plain `fs.remove(path)` cleanup has no such check at
 * all; this narrows that gap to the width of the lstat()-then-unlink() pair below.
 *
 * Residual, not closed by this function: lstat() and unlink() are still two separate
 * path-based syscalls, so a replacement file created between them that happens to land on the
 * same (device, inode) -- only possible via inode reuse after this run's own file was itself
 * removed and re-created at this exact path in that same narrow window -- would still be
 * deleted. Fully closing this would need an atomic compare-and-unlink (e.g. holding this run's
 * own file descriptor open and unlinking via a Linux-specific /proc/self/fd path trick, or a
 * native openat2/RESOLVE_NO_SYMLINKS-style call), neither of which Node's fs module exposes
 * portably. Left as an accepted, documented residual rather than a silent gap.
 */
async function removeIfSameFile(identity) {
  if (!identity) return;
  let stat;
  try {
    stat = await fs.promises.lstat(identity.path);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  if (stat.dev === identity.dev && stat.ino === identity.ino) {
    await fs.promises.unlink(identity.path);
  }
}

module.exports = {
  assertGenerationOutputAvailable,
  writeSafe,
  appendSectionIfMissing,
  readSafeIfExists,
  removeIfSameFile,
};
