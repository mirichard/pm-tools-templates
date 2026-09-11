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

function selectPairs(handoff, { overlay = 'neutral' } = {}) {
  const library = loadNFRLibrary({ overlay });
  const data = validateHandoff(handoff, library);
  const pairs = data.requirements.flatMap(r => r.attributes.map(attribute => ({
    source: r.source, attribute, patterns: matchingPatterns(library.patterns, attribute.subCharacteristic),
  })));
  return { library, data, pairs };
}
module.exports = { validateHandoff, matchingPatterns, selectPairs };

function generateCandidates(handoff, options = {}) {
  const { library, data, pairs } = selectPairs(handoff, options);
  const candidates = pairs.flatMap(pair => pair.patterns.map(pattern => {
    const bindings = Object.fromEntries(Object.keys(pattern.parameters).map(name => [name, `[NEEDS INPUT: ${name}]`]));
    return {
      id: `${data.useCaseId}:${pair.source.path}:${pattern.id}`,
      source: pair.source, characteristic: pair.attribute.characteristic,
      subCharacteristic: pair.attribute.subCharacteristic, confidence: pair.attribute.confidence,
      sourceTaxonomyVersion: pair.attribute.sourceTaxonomyVersion,
      patternId: pattern.id, libraryRevision: library.revision,
      text: pattern.template.replace(/\{\{([a-z][a-zA-Z0-9]*)\}\}/g, (_, name) => bindings[name]),
      bindings, unboundParameters: Object.keys(bindings), metric: pattern.metric,
      provenance: pattern.provenance,
      frameworks: pattern.provenance.frameworks.map(ref => ({ ...library.frameworks.find(f => f.id === ref.id), section: ref.section })),
      applicability: library.applicability, reviewStatus: 'needs-human-input',
    };
  }));
  return { rendererVersion: '1.0.0', useCaseId: data.useCaseId, overlay: library.overlay,
    accuracyNotice: library.accuracyNotice, candidates,
    missingPatterns: pairs.filter(p => !p.patterns.length).map(p => ({ source: p.source, subCharacteristic: p.attribute.subCharacteristic })),
    unmappedSources: data.requirements.filter(r => !r.attributes.length).map(r => r.source) };
}
module.exports.generateCandidates = generateCandidates;
