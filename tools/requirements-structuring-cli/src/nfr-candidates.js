const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { loadNFRLibrary } = require('./nfr-library');
const { validateStructuredResponse } = require('./security');

function validateHandoff(value, library) {
  const data = validateStructuredResponse(JSON.stringify(value), { expectedRoot: 'object' });
  const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, '../data/nfr/taxonomy.json'), 'utf8')).digest('hex');
  if (data.schemaVersion !== '1.0.0' || data.sourceTaxonomyVersion !== '0.1.0'
    || data.taxonomySha256 !== hash || data.standardEdition !== library.taxonomy.standardEdition
    || typeof data.useCaseId !== 'string' || !['structured', 'ucs'].includes(data.inputKind)
    || !Array.isArray(data.requirements) || !Array.isArray(data.characteristics)) throw new Error('Invalid generation classification handoff or taxonomy revision.');
  const parents = new Map(library.taxonomy.characteristics.flatMap(c => c.subCharacteristics.map(s => [s.id, c.id])));
  const known = new Set(library.taxonomy.characteristics.map(c => c.id));
  if (data.characteristics.some(c => !known.has(c))) throw new Error('Invalid considered characteristic.');
  const paths = new Set();
  for (const r of data.requirements) {
    if (!r.source || r.source.kind !== data.inputKind || typeof r.source.stepId !== 'string'
      || !/^\/(steps\/\d+|basicFlow\/steps\/\d+|(?:alternativeFlows|exceptionFlows)\/\d+\/steps\/\d+)$/.test(r.source.path)
      || paths.has(r.source.path) || !Array.isArray(r.attributes)
      || r.status !== (r.attributes.length ? 'classified' : 'unmapped')) throw new Error('Invalid generation source or assignments.');
    paths.add(r.source.path);
    const ids = new Set();
    for (const a of r.attributes) {
      if (parents.get(a.subCharacteristic) !== a.characteristic || !data.characteristics.includes(a.characteristic)
        || a.sourceTaxonomyVersion !== data.sourceTaxonomyVersion || !Number.isFinite(a.confidence)
        || a.confidence < 0 || a.confidence > 1 || ids.has(a.subCharacteristic)) throw new Error('Invalid generation attribute assignment.');
      ids.add(a.subCharacteristic);
    }
  }
  return data;
}

// Stable lexical ID order; retain all matches rather than silently dropping alternatives.
function matchingPatterns(patterns, subCharacteristic) {
  return patterns.filter(p => p.subCharacteristic === subCharacteristic).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

function selectPairs(handoff) {
  const library = loadNFRLibrary();
  const data = validateHandoff(handoff, library);
  const pairs = data.requirements.flatMap(r => r.attributes.map(attribute => ({
    source: r.source, attribute, patterns: matchingPatterns(library.patterns, attribute.subCharacteristic),
  })));
  return { library, data, pairs };
}
module.exports = { validateHandoff, matchingPatterns, selectPairs };
