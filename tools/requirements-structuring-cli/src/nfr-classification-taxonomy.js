const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Ajv = require('ajv');
const { validateStructuredResponse } = require('./security');

const TAXONOMY_VERSION = '0.1.0';
const TAXONOMY_PATH = path.join(__dirname, '..', 'data', 'nfr', 'taxonomy.json');
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(require('../schemas/nfr-taxonomy.schema.json'));

function loadClassificationTaxonomy(taxonomyPath = TAXONOMY_PATH) {
  let raw;
  try {
    raw = fs.readFileSync(taxonomyPath, 'utf8');
  } catch (error) {
    throw new Error(`Classification taxonomy ${error.code === 'ENOENT' ? 'missing' : 'unreadable'}: expected bundled revision ${TAXONOMY_VERSION}.`);
  }
  let taxonomy;
  try {
    taxonomy = validateStructuredResponse(raw, { expectedRoot: 'object' });
  } catch {
    throw new Error('Classification taxonomy malformed: expected safe JSON.');
  }
  if (!validate(taxonomy)) throw new Error(`Classification taxonomy malformed: ${ajv.errorsText(validate.errors)}`);
  if (taxonomy.revision !== TAXONOMY_VERSION) {
    throw new Error(`Classification taxonomy version mismatch: expected ${TAXONOMY_VERSION}, received ${taxonomy.revision}.`);
  }
  const sourceIds = new Set(taxonomy.sources.map((source) => source.id));
  const characteristicIds = new Set();
  const subIds = new Set();
  if (sourceIds.size !== taxonomy.sources.length) throw new Error('Classification taxonomy has duplicate source IDs.');
  for (const characteristic of taxonomy.characteristics) {
    if (characteristicIds.has(characteristic.id)) throw new Error('Classification taxonomy has duplicate characteristic IDs.');
    characteristicIds.add(characteristic.id);
    for (const entry of [characteristic, ...characteristic.subCharacteristics]) {
      if (entry.sources.some((id) => !sourceIds.has(id))) throw new Error('Classification taxonomy has an unresolved source reference.');
    }
    for (const sub of characteristic.subCharacteristics) {
      if (subIds.has(sub.id)) throw new Error('Classification taxonomy has duplicate sub-characteristic IDs.');
      subIds.add(sub.id);
    }
  }
  return { taxonomy, sha256: crypto.createHash('sha256').update(raw).digest('hex') };
}

module.exports = { loadClassificationTaxonomy, TAXONOMY_VERSION };
