const LLMClient = require('./llm-client');
const { validateNFRInput } = require('./nfr-input');
const { validateStructuredResponse } = require('./security');
const { loadClassificationTaxonomy } = require('./nfr-classification-taxonomy');

const PROMPT_FILE = '08-classify-quality-attributes-v1.md';
const PROMPT_VERSION = '1.0.0';

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

class NFRClassifier {
  constructor({ llm = new LLMClient(), taxonomyPath } = {}) {
    this.llm = llm;
    this.taxonomyPath = taxonomyPath;
  }

  async classify(input) {
    const { kind, data } = validateNFRInput(input);
    const { taxonomy, sha256 } = loadClassificationTaxonomy(this.taxonomyPath);
    const characteristics = taxonomy.characteristics;
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
      });
      let response;
      try {
        response = validateStructuredResponse(JSON.stringify(raw), { expectedRoot: 'object' });
      } catch {
        throw new Error(`Invalid classification response for ${unit.path}: expected safe JSON object.`);
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
        return { characteristic: parents.get(assignment.subCharacteristic), subCharacteristic: assignment.subCharacteristic };
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
