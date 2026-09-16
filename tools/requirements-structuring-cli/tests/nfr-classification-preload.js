/** Offline provider boundary: real classifier, prompt loading and chatJSON parsing. */
const assert = require('assert');
const LLMClient = require('../src/llm-client');

LLMClient.prototype.chat = async function ({ systemPrompt, userPrompt, mode }) {
  assert.match(systemPrompt, /Prompt contract version: 1\.0\.1/);
  assert.strictEqual(mode, 'structure');
  const input = JSON.parse(userPrompt);
  assert.ok(input.requirement.step.action);
  const subCharacteristic = input.taxonomy.characteristics[0].subCharacteristics[0].id;
  // #1111: overridable so gate-behavior tests can force every assignment uniformly above or
  // below --confidence-threshold; defaults to the existing fixed value so every test that
  // doesn't care about confidence keeps behaving exactly as before.
  const confidence = Number(process.env.NFR_TEST_CONFIDENCE ?? '0.85');
  return JSON.stringify({ assignments: [{ subCharacteristic, confidence }] });
};
