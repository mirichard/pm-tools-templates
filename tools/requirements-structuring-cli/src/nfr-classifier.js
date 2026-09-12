const LLMClient = require('./llm-client');
const { validateNFRInput } = require('./nfr-input');
const { validateStructuredResponse } = require('./security');
const { loadClassificationTaxonomy } = require('./nfr-classification-taxonomy');

const PROMPT_FILE = '08-classify-quality-attributes-v1.md';
const PROMPT_VERSION = '1.0.1';

function requirementUnits(kind, data) {
  if (kind === 'structured') {
    return data.steps.map((step, index) => ({ path: `/steps/${index}`, step, flow: null }));
  }
  const units = data.basicFlow.steps.map((step, index) => ({ path: `/basicFlow/steps/${index}`, step, flow: null }));
  for (const key of ['alternativeFlows', 'exceptionFlows']) {
    (data[key] || []).forEach((flow, index) => {
      flow.steps.forEach((step, stepIndex) => units.push({
        path: `/${key}/${index}/steps/${stepIndex}`, step,
        flow: { flowId: flow.flowId, deviationPoint: flow.deviationPoint,
          triggerCondition: flow.triggerCondition, ...(flow.rejoinPoint === undefined ? {} : { rejoinPoint: flow.rejoinPoint }) },
      }));
    });
  }
  return units;
}

function selectCharacteristics(taxonomy, attributes) {
  if (!Array.isArray(attributes) || attributes.some((name) => typeof name !== 'string')) {
    throw new Error('Classification attributes must be an array of characteristic names or IDs.');
  }
  const configured = attributes.length ? attributes : (process.env.NFR_ATTRIBUTES || '').trim()
    ? process.env.NFR_ATTRIBUTES.split(',') : [];
  const requested = new Set(configured.map((name) => name.trim().toLowerCase().replace(/\s+/g, '-')));
  const known = new Set(taxonomy.characteristics.map((entry) => entry.id));
  if ([...requested].some((id) => !known.has(id))) {
    throw new Error('Unknown classification characteristic in --attributes or NFR_ATTRIBUTES; use top-level taxonomy names or IDs.');
  }
  return taxonomy.characteristics.filter((entry) => !requested.size || requested.has(entry.id));
}

class NFRClassifier {
  constructor({ llm = new LLMClient(), taxonomyPath } = {}) {
    this.llm = llm;
    this.taxonomyPath = taxonomyPath;
  }

  async classify(input, { attributes = [] } = {}) {
    const { kind, data } = validateNFRInput(input);
    const { taxonomy, sha256 } = loadClassificationTaxonomy(this.taxonomyPath);
    const characteristics = selectCharacteristics(taxonomy, attributes);
    const parents = new Map(characteristics.flatMap((c) => c.subCharacteristics.map((s) => [s.id, c.id])));
    const systemPrompt = await this.llm.loadPrompt(PROMPT_FILE);
    const context = { useCaseId: data.useCaseId, useCaseName: data.useCaseName,
      intent: data.intent, role: data.role, preconditions: data.preconditions,
      postconditions: data.postconditions, businessObjects: data.businessObjects };
    const requirements = [];
    for (const unit of requirementUnits(kind, data)) {
      const raw = await this.llm.chatJSON({
        systemPrompt,
        userPrompt: JSON.stringify({ context, requirement: unit,
          taxonomy: { revision: taxonomy.revision, standardEdition: taxonomy.standardEdition,
            accuracyNotice: taxonomy.accuracyNotice, characteristics } }),
        mode: 'structure',
        // Validate either JSON root here; assignment validation below stays strict.
        expectedRoot: 'any',
      });
      let response;
      try {
        const parsed = validateStructuredResponse(JSON.stringify(raw), {
          expectedRoot: Array.isArray(raw) ? 'array' : 'object',
        });
        response = Array.isArray(parsed) ? { assignments: parsed } : parsed;
      } catch {
        throw new Error(`Invalid classification response for ${unit.path}: expected safe JSON object or assignment array.`);
      }
      if (Object.keys(response).length !== 1 || !Array.isArray(response.assignments)) {
        throw new Error(`Invalid classification response for ${unit.path}: expected assignments array only.`);
      }
      const attributes = response.assignments.map((assignment) => {
        if (!assignment || typeof assignment !== 'object' || Array.isArray(assignment)
          || Object.keys(assignment).some((key) => !['subCharacteristic', 'confidence'].includes(key))
          || !parents.has(assignment.subCharacteristic)) {
          throw new Error(`Invalid classification assignment for ${unit.path}: expected a supplied sub-characteristic, without additional fields.`);
        }
        if (typeof assignment.confidence !== 'number' || !Number.isFinite(assignment.confidence)
          || assignment.confidence < 0 || assignment.confidence > 1) {
          throw new Error(`Invalid classification assignment for ${unit.path}: confidence must be a finite number from 0 to 1.`);
        }
        return { characteristic: parents.get(assignment.subCharacteristic), subCharacteristic: assignment.subCharacteristic,
          confidence: assignment.confidence, sourceTaxonomyVersion: taxonomy.revision };
      });
      const assigned = new Set(attributes.map((attribute) => attribute.subCharacteristic));
      if (assigned.size !== attributes.length) {
        throw new Error(`Invalid classification response for ${unit.path}: duplicate sub-characteristic assignments.`);
      }
      const order = [...parents.keys()];
      attributes.sort((a, b) => order.indexOf(a.subCharacteristic) - order.indexOf(b.subCharacteristic));
      requirements.push({ status: attributes.length ? 'classified' : 'unmapped', source: { kind, path: unit.path, stepId: unit.step.stepId,
        ...(unit.flow ? { flowId: unit.flow.flowId } : {}) }, attributes });
    }
    return { schemaVersion: '1.0.0', useCaseId: data.useCaseId, inputKind: kind,
      sourceTaxonomyVersion: taxonomy.revision, taxonomySha256: sha256,
      standardEdition: taxonomy.standardEdition, taxonomyReleaseStatus: taxonomy.releaseStatus,
      accuracyNotice: taxonomy.accuracyNotice, promptVersion: PROMPT_VERSION,
      characteristics: characteristics.map((entry) => entry.id), requirements };
  }
}

module.exports = { NFRClassifier, PROMPT_FILE, PROMPT_VERSION };
