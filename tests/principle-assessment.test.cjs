const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {principles, score} = require('../docs/principles/self-assessment.js');

test('questions cover the approved taxonomy and link to real tools', () => {
  const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '../schemas/principle-annotation.schema.json')));
  assert.deepEqual(principles.map(p => p.id).sort(), [...schema.$defs.principle.enum].sort());
  for (const p of principles) {
    assert.equal(p.questions.length, 3);
    assert.equal(new Set(p.questions).size, 3);
    assert.ok(p.templates.length > 0);
    for (const tool of p.templates) assert.ok(fs.existsSync(path.resolve(__dirname, '../docs/principles', tool.path)));
  }
});
test('unanswered questions never produce a complete overall score', () => {
  const answers = Array(30).fill(5); answers[29] = null;
  const result = score(answers);
  assert.equal(result.completed, 29);
  assert.equal(result.overall, null);
  assert.equal(result.results[9].mean, null);
  assert.equal(score(Array(30).fill(null)).completed, 0);
});
test('score preserves the full 1–5 range and equal principle weights', () => {
  assert.equal(score(Array(30).fill(1)).overall, 1);
  assert.equal(score(Array(30).fill(5)).overall, 5);
  const answers = Array(30).fill(3); answers.splice(0, 3, 1, 3, 5);
  assert.equal(score(answers).results[0].mean, 3);
  assert.equal(score(answers).overall, 3);
});
test('invalid and malformed responses are rejected', () => {
  for (const bad of [0, 6, -1, 1.5, '3', undefined, NaN]) {
    const answers = Array(30).fill(3); answers[0] = bad;
    assert.throws(() => score(answers), RangeError);
  }
  assert.throws(() => score([]), TypeError);
});
