const fs = require('fs');
const { validateDocumentContent } = require('./security');

function assertGenerationOutputAvailable(file, force = false) {
  try {
    const stat = fs.lstatSync(file);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Unsafe NFR output: ${file}`);
    if (!force) throw new Error(`NFR output already exists: ${file}. Preserve your edits or use generate-nfr --force to overwrite.`);
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
}

async function writeGenerationReport(file, text, force = false) {
  const validated = validateDocumentContent(text);
  assertGenerationOutputAvailable(file, force);
  const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_NOFOLLOW
    | (force ? fs.constants.O_TRUNC : fs.constants.O_EXCL);
  let handle;
  try {
    handle = await fs.promises.open(file, flags, 0o600);
    await handle.writeFile(validated, 'utf8');
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`NFR output already exists: ${file}. Use generate-nfr --force to overwrite.`);
    throw error;
  } finally { if (handle) await handle.close(); }
}
/**
 * #1110: write text to a file, with the same symlink/non-regular-file protection as the
 * other NFR outputs above. `force` selects the same atomic-open-flag approach
 * writeGenerationReport already uses above: non-force uses O_EXCL, so file creation itself
 * atomically fails with EEXIST if the target now exists — the existence check and the write
 * are the same syscall, closing the TOCTOU gap between a separate pre-check (e.g.
 * assertGenerationOutputAvailable) and this call, exactly as ef23d47c closed the equivalent
 * gap on the read side (open once, act on that same descriptor, rather than check-then-act
 * across two calls). force uses O_TRUNC to overwrite unconditionally, for callers (like the
 * base .feature append/rebuild paths) that have already read the file and are intentionally
 * replacing its content — those are not subject to the exclusive-create-or-force contract.
 */
async function writeSafeOverwrite(file, text, force = false) {
  const validated = validateDocumentContent(text);
  const flags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_NOFOLLOW
    | (force ? fs.constants.O_TRUNC : fs.constants.O_EXCL);
  let handle;
  try {
    handle = await fs.promises.open(file, flags, 0o600);
    await handle.writeFile(validated, 'utf8');
  } catch (error) {
    if (error.code === 'ELOOP') throw new Error(`Unsafe NFR output: ${file}`);
    if (error.code === 'EEXIST') throw new Error(`NFR output already exists: ${file}. Use generate-nfr --force to overwrite.`);
    throw error;
  } finally { if (handle) await handle.close(); }
}

module.exports = { assertGenerationOutputAvailable, writeGenerationReport, writeSafeOverwrite };
