const fs = require('fs-extra');
const path = require('path');
const { validateStructuredResponse } = require('./security');

const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function invalid(field, expectation) {
  throw new Error(`Invalid NFR input: ${field} ${expectation}. Re-run structure and transform (or pipeline) from the original requirements; see docs/nfr-input-contract.md.`);
}

function text(value, field) {
  if (typeof value !== 'string' || !value.trim()) invalid(field, 'must be a non-empty string');
}

function strings(value, field) {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    invalid(field, 'must be an array of strings');
  }
}

function guardLegacyShape(data) {
  if (typeof data.useCaseId !== 'string' || !data.useCaseId.trim()) return;
  const isUCS = own(data, 'basicFlow') || own(data, 'intent') || own(data, 'role');
  let missing;
  if (isUCS && !own(data, 'steps')) {
    if (!own(data, 'basicFlow')) missing = 'basicFlow.steps is missing';
    else if (Array.isArray(data.basicFlow)) missing = 'basicFlow is a bare array instead of an object with steps';
    else if (object(data.basicFlow) && !own(data.basicFlow, 'steps')) missing = 'basicFlow.steps is missing';
  } else if (!isUCS && own(data, 'useCaseName') && !own(data, 'steps')) {
    missing = 'structured steps is missing';
  }
  if (missing) {
    throw new Error(`Legacy/incomplete NFR input (pre-contract shape): ${missing}. Re-run structure and transform (or pipeline) from the original requirements; do not add a version marker. See docs/nfr-input-contract.md.`);
  }
}

function steps(value, field, structured = false) {
  if (!Array.isArray(value) || !value.length) invalid(field, 'must be a non-empty array');
  value.forEach((step, index) => {
    const location = `${field}[${index}]`;
    if (!object(step)) invalid(location, 'must be an object');
    for (const key of ['stepId', 'actor', 'action', 'businessObject']) text(step[key], `${location}.${key}`);
    for (const key of ['toActor', 'precondition', 'postcondition', 'refUseCaseId', 'description',
      ...(structured ? ['previousStep', 'deviationPoint', 'rejoinPoint'] : [])]) {
      if (own(step, key) && typeof step[key] !== 'string') invalid(`${location}.${key}`, 'must be a string');
    }
    if (structured && own(step, 'flowType') && !['basic', 'alternative', 'exception'].includes(step.flowType)) {
      invalid(`${location}.flowType`, 'must be basic, alternative, or exception');
    }
  });
}

function validateNFRInput(input) {
  let data;
  try {
    // Reuse the CLI's JSON safety boundary before interpreting domain fields.
    data = validateStructuredResponse(JSON.stringify(input), { expectedRoot: 'object' });
  } catch {
    invalid('document', 'must be a safe JSON object within the existing CLI size/depth limits');
  }
  guardLegacyShape(data);
  text(data.useCaseId, 'useCaseId');
  const isUCS = own(data, 'basicFlow') || own(data, 'intent') || own(data, 'role');
  if (isUCS && own(data, 'steps')) invalid('document', 'must contain one artifact, not both structured and UCS shapes');

  if (isUCS) {
    text(data.intent, 'intent');
    text(data.role, 'role');
    if (own(data, 'useCaseName')) text(data.useCaseName, 'useCaseName');
    strings(data.preconditions, 'preconditions');
    strings(data.postconditions, 'postconditions');
    if (!object(data.basicFlow)) invalid('basicFlow', 'must be an object containing steps');
    steps(data.basicFlow.steps, 'basicFlow.steps');
    for (const key of ['alternativeFlows', 'exceptionFlows']) {
      if (!own(data, key)) continue;
      if (!Array.isArray(data[key])) invalid(key, 'must be an array');
      data[key].forEach((flow, index) => {
        const location = `${key}[${index}]`;
        if (!object(flow)) invalid(location, 'must be an object');
        for (const field of ['flowId', 'deviationPoint', 'triggerCondition']) text(flow[field], `${location}.${field}`);
        steps(flow.steps, `${location}.steps`);
        if (own(flow, 'rejoinPoint') && typeof flow.rejoinPoint !== 'string') invalid(`${location}.rejoinPoint`, 'must be a string');
      });
    }
    if (own(data, 'relatedUseCases')) strings(data.relatedUseCases, 'relatedUseCases');
  } else {
    text(data.useCaseName, 'useCaseName');
    steps(data.steps, 'steps', true);
  }
  if (own(data, 'businessObjects')) strings(data.businessObjects, 'businessObjects');
  return { kind: isUCS ? 'ucs' : 'structured', data };
}

async function loadNFRInput(inputFile) {
  if (!inputFile) {
    throw new Error('Missing NFR input: provide a structured or UCS JSON file. Run structure and transform (or pipeline) first.');
  }
  let input;
  try {
    input = await fs.readJSON(path.resolve(inputFile));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Missing NFR input file. Check the path and run structure and transform (or pipeline) first.');
    }
    throw new Error('Unable to read NFR input as JSON. Check file permissions and use a structured or UCS JSON artifact; see docs/nfr-input-contract.md.');
  }
  validateNFRInput(input);
  return input;
}

module.exports = { validateNFRInput, loadNFRInput };
