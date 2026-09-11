const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });
const validateTaxonomy = ajv.compile(require('../schemas/nfr-taxonomy.schema.json'));
const validatePatterns = ajv.compile(require('../schemas/nfr-patterns.schema.json'));
const validateOverlays = ajv.compile(require('../schemas/nfr-overlays.schema.json'));

function ensure(condition, message) {
  if (!condition) throw new Error(`Invalid NFR library: ${message}`);
}

function schemaCheck(validate, data, label) {
  ensure(validate(data), `${label}: ${ajv.errorsText(validate.errors)}`);
}

function unique(items, label) {
  const ids = items.map((item) => item.id);
  ensure(new Set(ids).size === ids.length, `duplicate ${label} id`);
  return new Set(ids);
}

/** Validate schemas plus relationships that JSON Schema cannot express. No network or LLM calls. */
function validateLibraryData(taxonomy, core, overlays) {
  schemaCheck(validateTaxonomy, taxonomy, 'taxonomy');
  schemaCheck(validatePatterns, core, 'patterns');
  schemaCheck(validateOverlays, overlays, 'overlays');
  ensure(core.taxonomyRevision === taxonomy.revision && overlays.taxonomyRevision === taxonomy.revision,
    'taxonomy revision mismatch');
  ensure(core.revision === overlays.revision, 'core/overlay revision mismatch');
  const sources = unique(taxonomy.sources, 'taxonomy source');
  const frameworks = unique(core.frameworks, 'framework');
  unique(taxonomy.characteristics, 'characteristic');
  const entries = taxonomy.characteristics.flatMap((entry) => entry.subCharacteristics);
  unique(entries, 'sub-characteristic');
  const parents = new Map();
  for (const characteristic of taxonomy.characteristics) {
    for (const entry of [characteristic, ...characteristic.subCharacteristics]) {
      ensure(entry.sources.every((id) => sources.has(id)), `unknown taxonomy source for ${entry.id}`);
    }
    for (const entry of characteristic.subCharacteristics) parents.set(entry.id, characteristic.id);
  }
  const overlayIds = unique(overlays.overlays, 'overlay');
  ensure(!overlayIds.has('neutral') && !overlayIds.has('core'), 'reserved overlay id');
  const allPatterns = [...core.patterns, ...overlays.overlays.flatMap((overlay) => overlay.patterns)];
  unique(allPatterns, 'pattern');
  const covered = core.patterns.map((pattern) => pattern.subCharacteristic);
  ensure(covered.length === parents.size && new Set(covered).size === parents.size
    && covered.every((id) => parents.has(id)), 'core must cover each sub-characteristic exactly once');
  const units = {
    coverage: ['percent'], 'success-rate': ['percent'], count: ['actions', 'sessions', 'components', 'contexts', 'environments', 'records'],
    duration: ['milliseconds', 'minutes'], utilization: ['percent'], degradation: ['percent'],
    availability: ['percent'], effort: ['person-hours'], growth: ['percent'],
  };
  for (const [prefix, patterns] of [['core', core.patterns], ...overlays.overlays.map((o) => [o.id, o.patterns])]) {
    for (const pattern of patterns) {
      const label = pattern.id;
      ensure(label === `${prefix}.${pattern.subCharacteristic}`, `${label}: pattern namespace mismatch`);
      ensure(parents.get(pattern.subCharacteristic) === pattern.characteristic, `${label}: unknown or mismatched taxonomy parent`);
      ensure(pattern.provenance.subCharacteristic === pattern.subCharacteristic, `${label}: provenance mismatch`);
      ensure(pattern.provenance.frameworks.every((ref) => frameworks.has(ref.id)), `${label}: unknown framework`);
      unique(pattern.provenance.frameworks, `${label} framework reference`);
      const tokens = [...pattern.template.matchAll(/\{\{([a-z][a-zA-Z0-9]*)\}\}/g)].map((match) => match[1]);
      const residual = pattern.template.replace(/\{\{[a-z][a-zA-Z0-9]*\}\}/g, '');
      ensure(!/[{}\r\n]/.test(residual), `${label}: malformed template placeholder`);
      ensure(pattern.template.startsWith('{{system}} shall ') && (pattern.template.match(/\bshall\b/g) || []).length === 1,
        `${label}: expected one requirement statement`);
      const metric = pattern.metric;
      ensure(tokens.includes(metric.targetParameter),
        `${label}: metric target reference {{${metric.targetParameter}}} is missing from template`);
      const names = Object.keys(pattern.parameters);
      ensure(tokens.length > 0 && names.every((name) => tokens.includes(name))
        && tokens.every((name) => Object.prototype.hasOwnProperty.call(pattern.parameters, name)), `${label}: parameter/placeholder mismatch`);
      for (const name of ['system', 'scope', 'conditions']) {
        ensure(pattern.parameters[name]?.type === 'string', `${label}: ${name} must be an explicit string parameter`);
      }
      for (const [name, parameter] of Object.entries(pattern.parameters)) {
        ensure(parameter.type === 'number' || (parameter.minimum === undefined && parameter.maximum === undefined),
          `${label}: numeric bounds on string parameter ${name}`);
        ensure(parameter.minimum === undefined || parameter.maximum === undefined || parameter.minimum <= parameter.maximum,
          `${label}: inverted parameter bounds`);
      }
      const target = pattern.parameters[metric.targetParameter];
      ensure(target?.type === 'number' && target.minimum !== undefined && target.minimum >= 0,
        `${label}: metric target must have a nonnegative numeric bound`);
      ensure(units[metric.type].includes(metric.unit), `${label}: metric type/unit mismatch`);
      if (metric.unit === 'percent' && !['growth', 'degradation'].includes(metric.type)) {
        ensure(target.maximum !== undefined && target.maximum <= 100, `${label}: percentage must be bounded by 100`);
      }
    }
  }
  return { characteristics: taxonomy.characteristics.length, subCharacteristics: parents.size,
    corePatterns: core.patterns.length, overlays: overlays.overlays.length,
    overlayPatterns: allPatterns.length - core.patterns.length };
}

function readBundle() {
  const read = (name) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'nfr', `${name}.json`), 'utf8'));
  const bundle = { taxonomy: read('taxonomy'), core: read('patterns'), overlays: read('overlays') };
  validateLibraryData(bundle.taxonomy, bundle.core, bundle.overlays);
  return bundle;
}

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

function listLibraryOverlays() {
  return [{ name: 'neutral', label: 'neutral core (default)' },
    ...readBundle().overlays.overlays.map((overlay) => ({ name: overlay.id, label: `${overlay.id}: ${overlay.label} (review candidate)` }))];
}

/** Return only neutral patterns plus the one explicitly selected additive overlay. */
function loadNFRLibrary({ overlay = 'neutral' } = {}) {
  const { taxonomy, core, overlays } = readBundle();
  const selected = overlays.overlays.find((entry) => entry.id === overlay);
  if (overlay !== 'neutral' && !selected) throw new Error(`Unknown NFR overlay: ${overlay}. Run generate-nfr --list-overlays.`);
  const patterns = [...core.patterns, ...(selected?.patterns || [])];
  const frameworkIds = new Set(patterns.flatMap((pattern) => pattern.provenance.frameworks.map((ref) => ref.id)));
  return deepFreeze({ revision: core.revision, releaseStatus: core.releaseStatus,
    accuracyNotice: taxonomy.accuracyNotice, taxonomy,
    frameworks: core.frameworks.filter((framework) => frameworkIds.has(framework.id)),
    overlay, applicability: selected?.applicability || 'Neutral core; review each pattern for applicability to the artifact.',
    patterns });
}

module.exports = { validateLibraryData, loadNFRLibrary, listLibraryOverlays };

if (require.main === module) {
  try {
    const { taxonomy, core, overlays } = readBundle();
    console.log(JSON.stringify(validateLibraryData(taxonomy, core, overlays)));
    console.log('Data validation passed; human ISO and framework review remains required.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
