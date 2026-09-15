/**
 * #1110 — Measurable acceptance-criteria scaffolding.
 *
 * Verified against the real committed golden fixture (examples/fixtures/nfr-golden/) and the
 * real #1168 regression fixture (tests/fixtures/pr-1128-ucs-artifact.json). Zero live LLM calls.
 */
const assert = require('assert/strict');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { generateCandidates, buildAcceptanceCriterion } = require('../src/nfr-candidates');
const GherkinGenerator = require('../src/gherkin-generator');
const { writeNFRGherkinScenarios } = require('../src/nfr-generator');
const TestGenerator = require('../src/test-generator');
const { UCSTemplate } = require('../src/ucs-template');

const root = path.resolve(__dirname, '..');
const goldenDir = path.join(root, 'examples/fixtures/nfr-golden/neutral');

module.exports = async function testNFRAcceptanceScaffold(runner) {
  const test = (description, fn) => runner.test(description, async () => { await fn(); return true; });
  const handoff = await fs.readJSON(path.join(goldenDir, 'password-reset-input-nfr-classifications.json'));
  const generation = generateCandidates(handoff, { overlay: 'neutral' });

  await test('NFR acceptance scaffold: every real golden-fixture candidate is quantifiable with a placeholder threshold', () => {
    assert.equal(generation.candidates.length, 70);
    for (const candidate of generation.candidates) {
      assert.equal(candidate.acceptanceCriterion.kind, 'quantifiable');
      assert.equal(candidate.acceptanceCriterion.metric, candidate.metric.type);
      assert.equal(candidate.acceptanceCriterion.unit, candidate.metric.unit);
      assert.equal(candidate.acceptanceCriterion.operator, candidate.metric.operator);
      assert.equal(candidate.acceptanceCriterion.measurement, candidate.metric.measurement);
      // SC8: the threshold is still the same unbound placeholder as bindings — never a real number.
      assert.equal(candidate.acceptanceCriterion.threshold, candidate.bindings[candidate.metric.targetParameter]);
      assert.match(candidate.acceptanceCriterion.threshold, /^\[NEEDS INPUT: [a-z][a-zA-Z0-9]*\]$/);
    }
  });

  await test('NFR acceptance scaffold: qualitative branch (synthetic no-metric pattern — unreachable with real data today)', () => {
    const qualitativePattern = { template: '{{system}} shall provide clear, consistent terminology for {{scope}}.' };
    const bindings = { system: '[NEEDS INPUT: system]', scope: '[NEEDS INPUT: scope]' };
    const text = qualitativePattern.template.replace(/\{\{([a-z][a-zA-Z0-9]*)\}\}/g, (_, name) => bindings[name]);
    const scaffold = buildAcceptanceCriterion(qualitativePattern, bindings, text);
    assert.deepEqual(scaffold, { kind: 'qualitative', criterion: text });
    // No metric-shaped fields leak into the qualitative branch.
    assert.equal('threshold' in scaffold, false);
    assert.equal('unit' in scaffold, false);
  });

  await test('NFR acceptance scaffold: Gherkin Scenario Outline + Examples table for a real candidate', () => {
    const candidate = generation.candidates.find(c => c.patternId === 'core.functional-completeness');
    const section = new GherkinGenerator().generateNFRScenarios([candidate], generation.useCaseId);
    assert.match(section, /Scenario Outline: NFR — core\.functional-completeness \(functional-completeness, \/basicFlow\/steps\/0\)/);
    assert.match(section, /Then the measured <metric> shall be <operator> <threshold> <unit>/);
    assert.match(section, /\| coverage \| >= \| \[NEEDS INPUT: target\] \| percent \|/);
  });

  await test('NFR acceptance scaffold: qualitative candidate renders as a plain Scenario, not an Examples table', () => {
    const qualitativeCandidate = { ...generation.candidates[0], acceptanceCriterion: { kind: 'qualitative', criterion: 'the system provides consistent terminology.' } };
    const section = new GherkinGenerator().generateNFRScenarios([qualitativeCandidate], generation.useCaseId);
    assert.match(section, /^\s*Scenario: NFR —/m);
    assert.doesNotMatch(section, /Scenario Outline/);
    assert.doesNotMatch(section, /Examples:/);
    assert.match(section, /Then the system provides consistent terminology\./);
  });

  await test('NFR acceptance scaffold: appending to a real committed .feature file preserves it byte-for-byte as a prefix, and is idempotent', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-append-'));
    try {
      const original = await fs.readFile(path.join(goldenDir, 'password-reset-input.feature'), 'utf8');
      await fs.copyFile(path.join(goldenDir, 'password-reset-input.feature'), path.join(temp, 'password-reset-input.feature'));
      const first = await writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId);
      assert.equal(first.mode, 'appended');
      const afterFirst = await fs.readFile(first.path, 'utf8');
      assert.ok(afterFirst.startsWith(original));
      assert.match(afterFirst, /NFR acceptance-criteria scaffolds \(Story #1110\)/);
      const second = await writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId);
      assert.equal(second.mode, 'already-present');
      const afterSecond = await fs.readFile(first.path, 'utf8');
      assert.equal(afterSecond, afterFirst, 'a second run must not duplicate the NFR section');
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR acceptance scaffold: standalone .feature is written when no base .feature file exists', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-standalone-'));
    try {
      const result = await writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId);
      assert.equal(result.mode, 'standalone');
      assert.equal(path.basename(result.path), 'password-reset-input-nfr.feature');
      const content = await fs.readFile(result.path, 'utf8');
      assert.match(content, /Feature:|NFR acceptance-criteria scaffolds/);
      assert.match(content, /Scenario Outline: NFR —/);
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR acceptance scaffold: #1155 regression — sourceRequirementId/sourceText never reach the new candidates artifact', () => {
    const serialized = JSON.stringify(generation);
    assert.doesNotMatch(serialized, /sourceRequirementId/);
    assert.doesNotMatch(serialized, /sourceText/);
  });

  await test('NFR acceptance scaffold: #1168 regression — negative-scenario trigger-action placement is unchanged', () => {
    // Same real UCS artifact #1168 was fixed and verified against; generate()/TestGenerator
    // are untouched by this story, so this must reproduce the exact fixed shape.
    const ucsFixture = require('./fixtures/pr-1128-ucs-artifact.json');
    const ucs = UCSTemplate.fromJSON(ucsFixture);
    const testCases = new TestGenerator().generate(ucs);
    const feature = new GherkinGenerator().generate(testCases, ucs.toJSON ? ucs.toJSON() : ucsFixture);
    // 3b: expired reset link — Given at the deviation point, then the synthesized access
    // action, then the rejection — never the rejection with no preceding action (the original
    // #1168 defect).
    const givenExpired = feature.indexOf('Given the password Reset Link is expired or already used');
    const whenAccess = feature.indexOf('When the User access Account', givenExpired);
    const thenExpiredError = feature.indexOf('Then the System shows an error message to the User, informing them that the Password Reset Link is invalid', whenAccess);
    assert.ok(givenExpired > -1 && whenAccess > givenExpired && thenExpiredError > whenAccess,
      '#1168: expected Given (deviation) → When (synthesized action) → Then (rejection) ordering for the expired-link scenario');
    // 4a: invalid password — synthesized submission precedes the rejection.
    const givenInvalid = feature.indexOf('Given the user enters a new Password that does not meet rules');
    const whenSubmit = feature.indexOf('When the User submit Account', givenInvalid);
    const thenRejected = feature.indexOf('Then the System rejects the new password', whenSubmit);
    assert.ok(givenInvalid > -1 && whenSubmit > givenInvalid && thenRejected > whenSubmit,
      '#1168: expected Given (deviation) → When (synthesized action) → Then (rejection) ordering for the invalid-password scenario');
  });
};
