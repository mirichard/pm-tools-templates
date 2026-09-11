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
module.exports = { assertGenerationOutputAvailable, writeGenerationReport };
