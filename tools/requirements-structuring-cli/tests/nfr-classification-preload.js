/** Offline provider boundary: real classifier, prompt loading and chatJSON parsing. */
const assert = require('assert');
const LLMClient = require('../src/llm-client');

LLMClient.prototype.chat = async function ({ systemPrompt, userPrompt, mode }) {
  assert.match(systemPrompt, /Prompt contract version: 1\.0\.0/);
  assert.strictEqual(mode, 'structure');
  const input = JSON.parse(userPrompt);
  assert.ok(input.requirement.step.action);
  const subCharacteristic = input.taxonomy.characteristics[0].subCharacteristics[0].id;
  return JSON.stringify({ assignments: [{ subCharacteristic, confidence: 0.85 }] });
};
