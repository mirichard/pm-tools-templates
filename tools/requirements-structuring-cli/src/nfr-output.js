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
 * standalone/rebuilt .feature). One open() call performs both the existence/type check and the
 * write -- there is no separate stat-then-write, so nothing can change the target in the window
 * between them. `force` selects O_TRUNC (overwrite in place, for a caller that has already read
 * the file and is intentionally replacing its content, e.g. a force rebuild) or O_EXCL (atomic
 * create-or-fail: file creation itself fails with EEXIST if the target now exists) -- the
 * exclusive-create-or-force contract every non-force NFR output shares. The post-open stat()
 * check rejects a non-regular target (this also covers a FIFO that a write-side open managed to
 * complete on, e.g. because a reader was already attached) before any bytes are written.
 * Returns the identity (device + inode) of the file this call just wrote, captured from the
 * same descriptor used to write it -- see removeIfSameFile for why identity, not path, matters
 * for rollback.
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
 * file (see writeNFRGherkinScenarios's marker-absent branch in nfr-generator.js). O_APPEND makes
 * the kernel seek-to-end-and-write as a single atomic operation, so this call never depends on --
 * and can never stomp -- whatever the file's content was when it was last read; a concurrent
 * editor's own change survives, with this section landing after it rather than being silently
 * discarded by a read-modify-write-back. No O_CREAT/O_EXCL/O_TRUNC: the caller has already
 * confirmed the file exists (via readSafeIfExists), and this primitive intentionally cannot
 * create one.
 */
async function appendSafeExisting(file, text) {
  const validated = validateDocumentContent(text);
  const flags = fs.constants.O_WRONLY | fs.constants.O_APPEND | NOFOLLOW_NONBLOCK;
  let handle;
  try {
    handle = await fs.promises.open(file, flags);
    const stat = await handle.stat();
    if (!stat.isFile()) throw new Error(`Unsafe NFR output: ${file}`);
    await handle.writeFile(validated, 'utf8');
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
 * second path lookup, so a file some other process put at this path afterward (e.g. it
 * recreated the path after this run's failure but before this cleanup ran) is never
 * collaterally deleted. A plain `fs.remove(path)` cleanup is vulnerable to exactly that window;
 * this closes it by re-checking identity immediately before the unlink.
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
  appendSafeExisting,
  readSafeIfExists,
  removeIfSameFile,
};
