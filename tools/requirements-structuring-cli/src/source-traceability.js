// Require absolute end of input, including when the next character is a line terminator.
const ID = /^[A-Za-z][A-Za-z0-9_-]*(?![\s\S])/;

function sourceMap(entries) {
  if (!Array.isArray(entries) || !entries.length) {
    throw new Error('Source traceability: sourceRequirements must be a non-empty catalog. Re-run structure from source Markdown.');
  }
  const map = new Map();
  for (const entry of entries) {
    if (!entry || typeof entry.id !== 'string' || !ID.test(entry.id)
      || typeof entry.originalText !== 'string' || !entry.originalText.trim() || map.has(entry.id)) {
      throw new Error('Source traceability: invalid or duplicate source catalog entry. Re-run structure from source Markdown.');
    }
    map.set(entry.id, entry.originalText);
  }
  return map;
}

function stepsOf(document, kind, stage) {
  const steps = kind === 'structured' ? document?.steps : document?.basicFlow?.steps;
  if (!Array.isArray(steps) || !steps.length) throw new Error(`${stage}: expected non-empty steps for source traceability.`);
  const result = [...steps];
  if (kind === 'ucs') {
    for (const key of ['alternativeFlows', 'exceptionFlows']) {
      if (document[key] === undefined) continue;
      if (!Array.isArray(document[key])) throw new Error(`${stage}: ${key} must be an array.`);
      for (const flow of document[key]) {
        if (!Array.isArray(flow?.steps) || !flow.steps.length) throw new Error(`${stage}: ${key} flow must contain steps.`);
        result.push(...flow.steps);
      }
    }
  }
  return result;
}

/** The map comes from parser-owned input, never from this model response.
 * Membership cannot detect a wrong-but-valid ID (FR3 echoed for an FR4 step).
 * Nor does membership prove that every source requirement was represented. */
function attachSources(document, map, kind, stage) {
  const steps = stepsOf(document, kind, stage);
  steps.forEach((step, index) => {
    if (!step || typeof step !== 'object' || Array.isArray(step)) throw new Error(`${stage}: invalid step at index ${index}.`);
    // Legacy artifacts remain usable, but a model cannot invent provenance for them.
    if (map === undefined) {
      delete step.sourceRequirementId;
      delete step.sourceText;
      return;
    }
    const id = step.sourceRequirementId;
    if (typeof id !== 'string' || !ID.test(id) || !map.has(id)) {
      const shown = id === undefined ? '<missing>' : JSON.stringify(id).slice(0, 120);
      throw new Error(`${stage}: step ${JSON.stringify(step.stepId ?? index)} has missing, malformed, or unknown sourceRequirementId ${shown}. Echo an ID from the supplied source catalog; re-run from the original Markdown.`);
    }
    step.sourceText = map.get(id);
  });
  if (map === undefined) delete document.sourceRequirements;
  else document.sourceRequirements = [...map].map(([id, originalText]) => ({ id, originalText }));
  return document;
}

module.exports = { sourceMap, attachSources };
