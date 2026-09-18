const fs = require('fs');
const { validateDocumentContent } = require('./security');

// The whole safe-I/O contract below rests on these flags actually being the numbers they claim
// to be. `fs.constants` is platform-dependent (e.g. not every flag exists on every OS Node
// supports); if one were ever missing, `undefined | otherFlag` would silently coerce to 0 via
// JS's bitwise-OR ToInt32 conversion, and every open() below would silently drop that
// protection instead of failing. Fail loudly and immediately at module load instead of ever
// letting that happen unnoticed.
for (const flagName of ['O_WRONLY', 'O_RDONLY', 'O_RDWR', 'O_CREAT', 'O_EXCL', 'O_TRUNC', 'O_APPEND', 'O_NOFOLLOW', 'O_NONBLOCK']) {
  if (typeof fs.constants[flagName] !== 'number') {
    throw new Error(`nfr-output.js requires fs.constants.${flagName}, which is not defined on this platform/Node version -- refusing to silently downgrade file-write safety guarantees.`);
  }
}

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

// A hard link is a second directory entry for the exact same inode -- an entirely ordinary
// regular file by every check above (O_NOFOLLOW doesn't apply; isFile() is true), so without
// this check, writing to a hard-linked NFR output would silently also modify whatever other
// path an attacker (or a stray backup/dedup tool) linked to the same inode. nlink === 1 means
// this path is the only name for this inode.
function assertSingleHardLink(file, stat) {
  if (stat.nlink > 1) throw new Error(`Unsafe NFR output: ${file}`);
}

function assertGenerationOutputAvailable(file, force = false) {
  try {
    const stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Unsafe NFR output: ${file}`);
    assertSingleHardLink(file, stat);
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
 *
 * On a non-force call, O_EXCL means a successful open() is proof this call alone just created
 * `file` -- nothing else could have raced it, since O_EXCL would have failed with EEXIST
 * otherwise. A force call needs the same proof before it can safely self-clean on failure, so it
 * doesn't just infer non-existence from a separate `lstat` (a plain pre-check can't establish
 * ownership: another process could create the file in the gap between that check and the open,
 * and this call would then open, self-clean, and delete *their* file on a later failure, having
 * never actually created anything itself). Instead, a force call first attempts the exact same
 * O_EXCL open non-force uses: if that succeeds, this call has the same airtight proof of
 * ownership non-force gets, and behaves identically from here (self-cleans on failure). Only if
 * O_EXCL fails with EEXIST -- meaning the file provably already existed at that exact moment --
 * does it fall back to a plain O_TRUNC open to perform the actual overwrite, with no self-clean
 * registered: this call never created that content and has no right to remove it on a failed
 * overwrite. (The two-open fallback still has its own narrow window -- the file could be removed
 * between the failed O_EXCL and the O_TRUNC open, which would then recreate it -- but that
 * window no longer causes ownership to be misattributed: the O_TRUNC path unconditionally
 * declines to self-clean, so at worst it fails to clean up a file it happened to (re)create,
 * never deletes one it didn't.)
 *
 * On any call that does hold self-clean rights, if the write or the post-write stat() then fails
 * (e.g. ENOSPC mid-write), this function removes that file before rethrowing -- verifying
 * identity first (via removeIfSameFile, the same check the caller's own rollback uses) rather
 * than an unchecked pathname unlink, so a replacement another process put at this path in the
 * interim isn't deleted -- rather than leaving an orphaned partial file that no caller-side
 * rollback could ever find (the caller only learns a file's identity from a *fulfilled* call, so
 * a rejected one never gets registered for removeIfSameFile there).
 */
async function writeSafe(file, text, force = false) {
  const validated = validateDocumentContent(text);
  const exclusiveFlags = fs.constants.O_WRONLY | fs.constants.O_CREAT | NOFOLLOW_NONBLOCK | fs.constants.O_EXCL;
  let handle;
  let selfCleanAllowed = !force;
  let needsExplicitTruncate = false;
  try {
    try {
      handle = await fs.promises.open(file, exclusiveFlags, 0o600);
      selfCleanAllowed = true;
    } catch (openError) {
      if (!force || openError.code !== 'EEXIST') throw openError;
      // Deliberately NOT O_TRUNC here: O_TRUNC truncates as part of open() itself, before this
      // function ever gets a chance to check isFile()/hard-link status on what it opened --
      // by the time such a check could run, a hard-linked or otherwise unsafe target would
      // already have been destroyed. Opening O_RDWR instead defers the truncate to an explicit,
      // separate handle.truncate(0) call below, made only after the checks below pass.
      const overwriteFlags = fs.constants.O_WRONLY | fs.constants.O_CREAT | NOFOLLOW_NONBLOCK;
      handle = await fs.promises.open(file, overwriteFlags, 0o600);
      needsExplicitTruncate = true;
    }
    let createdIdentity = null;
    if (selfCleanAllowed) {
      const created = await handle.stat();
      createdIdentity = { path: file, dev: created.dev, ino: created.ino };
    }
    try {
      const preWriteStat = await handle.stat();
      if (!preWriteStat.isFile()) throw new Error(`Unsafe NFR output: ${file}`);
      if (!selfCleanAllowed) assertSingleHardLink(file, preWriteStat);
      if (needsExplicitTruncate) await handle.truncate(0);
      await handle.writeFile(validated, 'utf8');
      const written = await handle.stat();
      return { path: file, dev: written.dev, ino: written.ino };
    } catch (error) {
      if (createdIdentity) {
        try { await removeIfSameFile(createdIdentity); } catch (_) { /* best-effort self-cleanup */ }
      }
      throw error;
    }
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
 *
 * writeFile() is not failure-atomic: a mid-write error (e.g. ENOSPC) can leave a prefix of
 * `section` appended -- possibly including `marker` itself, which would make a later run's own
 * marker check believe a truncated section is already complete. On a write failure this
 * function truncates the file back to the length observed just before the write, so a failed
 * append never leaves that corrupt partial section behind (this run's own caller, in
 * nfr-generator.js, doesn't roll this back either, since it modifies a pre-existing file rather
 * than creating one -- recovery has to happen here).
 *
 * Residual, not closed by this recovery: `stat.size` is a snapshot taken before the read and
 * write. If another process also appends to this exact file in the narrow window between that
 * snapshot and this call's own write failing, the truncate-back uses the stale, smaller size and
 * discards that other process's bytes too, not just this call's own partial write. Closing this
 * fully needs the same inter-process coordination already declined for the marker-check race
 * above (see writeNFRGherkinScenarios's doc in nfr-generator.js) -- a genuine disk-full/ENOSPC
 * condition also generally prevents any other writer from succeeding at the same moment, which
 * bounds how often this compound scenario can actually arise in practice.
 */
async function appendSectionIfMissing(file, marker, section) {
  const validated = validateDocumentContent(section);
  const flags = fs.constants.O_RDWR | fs.constants.O_APPEND | NOFOLLOW_NONBLOCK;
  let handle;
  try {
    handle = await fs.promises.open(file, flags);
    const stat = await handle.stat();
    if (!stat.isFile()) throw new Error(`Unsafe NFR output: ${file}`);
    assertSingleHardLink(file, stat);
    const current = await handle.readFile('utf8');
    if (current.includes(marker)) return false;
    try {
      await handle.writeFile(validated, 'utf8');
    } catch (writeError) {
      try { await handle.truncate(stat.size); } catch (_) { /* best-effort recovery */ }
      throw writeError;
    }
    return true;
  } catch (error) {
    throw translateOpenError(file, error);
  } finally {
    if (handle) await handle.close();
  }
}

/**
 * Rebuild-in-place counterpart to appendSectionIfMissing, for the force+marker-already-present
 * branch of writeNFRGherkinScenarios: re-reads the file on this same descriptor and re-finds
 * `marker` in that fresh content, rather than trusting the prefix an earlier, separate
 * readSafeIfExists() call computed -- closing the same read-then-later-write gap
 * appendSectionIfMissing closes for the marker-absent case, here for the marker-present/force
 * case (a concurrent edit to the file's prefix, or to the section itself, between that earlier
 * read and this call is no longer silently discarded by a stale-prefix O_TRUNC rewrite). Trims
 * trailing newlines from the prefix exactly as the caller's own trim did, computes its UTF-8
 * byte length (not `.length`, which counts JS characters, not bytes -- multi-byte prefix content
 * would otherwise truncate at the wrong offset), truncates to that offset, and writes `section`
 * at that exact position. If the marker is no longer present on this fresh read (the file
 * changed in a way this caller didn't anticipate since its own read), throws rather than
 * guessing what to rebuild.
 *
 * This still does not make the marker-check-and-replace sequence atomic across two genuinely
 * concurrent process invocations (two callers could both open, both find the marker, and both
 * truncate/write) -- see writeNFRGherkinScenarios's own doc in nfr-generator.js for why this
 * redesign accepts that residual rather than adding inter-process locking.
 *
 * `write()` can complete with fewer bytes than requested even without throwing (POSIX permits a
 * short write for a regular file, though it is rare); checking `bytesWritten` against the
 * requested length turns that into a loud failure instead of a silently truncated `.feature`
 * that a later run's marker check might still (wrongly) treat as complete. And, symmetric with
 * appendSectionIfMissing's own recovery: if the truncate succeeds but the write then fails or is
 * short, this function restores the exact original bytes it just truncated away (captured before
 * truncating) rather than leaving the file mid-rebuild -- a failed rebuild must leave the file
 * exactly as it was, not truncated or partially rewritten.
 */
async function rebuildSectionSafe(file, marker, section) {
  const validated = validateDocumentContent(section);
  let handle;
  try {
    handle = await fs.promises.open(file, fs.constants.O_RDWR | NOFOLLOW_NONBLOCK);
    const stat = await handle.stat();
    if (!stat.isFile()) throw new Error(`Unsafe NFR output: ${file}`);
    assertSingleHardLink(file, stat);
    const current = await handle.readFile('utf8');
    const markerIndex = current.indexOf(marker);
    if (markerIndex === -1) {
      throw new Error(`NFR output changed since it was last read: ${file}. Re-run to pick up the current content.`);
    }
    const prefix = current.slice(0, markerIndex).replace(/\n+$/, '');
    const prefixBytes = Buffer.byteLength(prefix, 'utf8');
    const originalSuffix = Buffer.from(current, 'utf8').subarray(prefixBytes);
    await handle.truncate(prefixBytes);
    const sectionBytes = Buffer.from(validated, 'utf8');
    try {
      const { bytesWritten } = await handle.write(sectionBytes, 0, sectionBytes.length, prefixBytes);
      if (bytesWritten !== sectionBytes.length) {
        throw new Error(`Incomplete write to NFR output: ${file} (wrote ${bytesWritten} of ${sectionBytes.length} bytes).`);
      }
    } catch (writeError) {
      try {
        await handle.truncate(prefixBytes);
        // Restore in a loop, not a single unchecked write: the restoration write is just as
        // subject to a short write as the original one was, and silently accepting a partial
        // restore would leave the file corrupted while only ever reporting the *original*
        // error below.
        let restored = 0;
        while (restored < originalSuffix.length) {
          const { bytesWritten } = await handle.write(originalSuffix, restored, originalSuffix.length - restored, prefixBytes + restored);
          if (bytesWritten === 0) break;
          restored += bytesWritten;
        }
      } catch (_) { /* best-effort recovery */ }
      throw writeError;
    }
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
  rebuildSectionSafe,
  readSafeIfExists,
  removeIfSameFile,
};
