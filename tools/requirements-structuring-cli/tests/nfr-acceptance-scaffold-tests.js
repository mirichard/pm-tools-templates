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
const { execFileSync } = require('child_process');
const { generateCandidates, buildAcceptanceCriterion } = require('../src/nfr-candidates');
const GherkinGenerator = require('../src/gherkin-generator');
const NFRGenerator = require('../src/nfr-generator');
const { writeNFRGherkinScenarios } = require('../src/nfr-generator');
const { writeSafeOverwrite } = require('../src/nfr-output');
const TestGenerator = require('../src/test-generator');
const { UCSTemplate } = require('../src/ucs-template');
const classificationFixture = require('./fixtures/nfr-classification.json');

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

  await test('NFR acceptance scaffold: a useCaseId containing CR/LF cannot inject Gherkin lines', () => {
    // validateNFRInput only requires useCaseId to be a non-empty string -- it could contain
    // line breaks. Confirm they're collapsed rather than allowed to break out of the comment.
    const malicious = 'UC-01\nScenario: injected\n  Then the system is compromised';
    const section = new GherkinGenerator().generateNFRScenarios(generation.candidates.slice(0, 1), malicious);
    assert.doesNotMatch(section, /^Scenario: injected/m);
    assert.doesNotMatch(section, /^\s*Then the system is compromised/m);
    assert.equal(section.split('\n').filter(l => l.includes('Generated from')).length, 1);
    assert.match(section, /# Generated from UC-01\s+Scenario: injected\s+Then the system is compromised's NFR candidates/);
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

  await test('NFR acceptance scaffold: standalone .feature is valid Gherkin on its own (has a Feature: header) when no base .feature file exists', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-standalone-'));
    try {
      const result = await writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId);
      assert.equal(result.mode, 'standalone');
      assert.equal(path.basename(result.path), 'password-reset-input-nfr.feature');
      const content = await fs.readFile(result.path, 'utf8');
      assert.match(content, /^Feature: UC-PASSWORD-RESET — NFR acceptance-criteria scaffolds\n/);
      assert.match(content, /Scenario Outline: NFR —/);
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR acceptance scaffold: standalone .feature follows the same exclusive-create-or-force contract as the other NFR outputs', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-standalone-force-'));
    try {
      const first = await writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId, false);
      await assert.rejects(
        writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId, false),
        /NFR output already exists/,
      );
      const second = await writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates.slice(0, 3), generation.useCaseId, true);
      assert.equal(second.mode, 'standalone');
      const content = await fs.readFile(first.path, 'utf8');
      assert.equal((content.match(/Scenario Outline: NFR —/g) || []).length, 3);
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR acceptance scaffold: --force rebuilds the NFR section in place, preserving the UCS-generated prefix', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-force-'));
    try {
      const original = await fs.readFile(path.join(goldenDir, 'password-reset-input.feature'), 'utf8');
      await fs.copyFile(path.join(goldenDir, 'password-reset-input.feature'), path.join(temp, 'password-reset-input.feature'));
      await writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId, false);
      const rebuilt = await writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates.slice(0, 2), generation.useCaseId, true);
      assert.equal(rebuilt.mode, 'rebuilt');
      const content = await fs.readFile(rebuilt.path, 'utf8');
      assert.ok(content.startsWith(original), 'UCS-driven prefix must survive a force rebuild');
      assert.equal((content.match(/NFR acceptance-criteria scaffolds \(Story #1110\)/g) || []).length, 1,
        'force rebuild must not duplicate the marker');
      assert.equal((content.match(/Scenario Outline: NFR —/g) || []).length, 2,
        'force rebuild must reflect the fresh (smaller) candidate set, not the stale one');
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR acceptance scaffold: refuses to read or write through a symlinked .feature path', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-symlink-'));
    const secretFile = path.join(os.tmpdir(), `nfr-scaffold-secret-${Date.now()}.txt`);
    try {
      await fs.writeFile(secretFile, 'DO NOT OVERWRITE');
      await fs.symlink(secretFile, path.join(temp, 'password-reset-input.feature'));
      await assert.rejects(
        writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId),
        /Unsafe NFR output/,
      );
      assert.equal(await fs.readFile(secretFile, 'utf8'), 'DO NOT OVERWRITE');
    } finally {
      await fs.remove(temp);
      await fs.remove(secretFile);
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

  await test('NFR acceptance scaffold: cycle-4 finding 1 — an untrusted .feature path that is a FIFO is rejected without hanging', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-fifo-'));
    const fifoPath = path.join(temp, 'password-reset-input.feature');
    try {
      execFileSync('mkfifo', [fifoPath]);
      const withTimeout = (promise, ms) => {
        let timer;
        const timeout = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`TIMEOUT: did not return within ${ms}ms — HUNG`)), ms);
        });
        return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
      };
      await assert.rejects(
        withTimeout(writeNFRGherkinScenarios(temp, 'password-reset-input', generation.candidates, generation.useCaseId), 2000),
        /Unsafe NFR output/,
      );
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR acceptance scaffold: cycle-4 finding 2 — writeSafeOverwrite itself (not a prior check) rejects a pre-existing file without --force', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-toctou-'));
    try {
      const target = path.join(temp, 'password-reset-input-nfr.feature');
      // No assertGenerationOutputAvailable call at all here -- proves the write's own O_EXCL
      // is what rejects it, simulating a file created after a prior check would have passed.
      await fs.writeFile(target, 'Feature: pre-existing manual edit\n');
      await assert.rejects(
        writeSafeOverwrite(target, 'Feature: fresh content\n', false),
        /NFR output already exists/,
      );
      assert.equal(await fs.readFile(target, 'utf8'), 'Feature: pre-existing manual edit\n');
      await writeSafeOverwrite(target, 'Feature: forced overwrite\n', true);
      assert.equal(await fs.readFile(target, 'utf8'), 'Feature: forced overwrite\n');
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR acceptance scaffold: cycle-4 finding 3 — a non-force run rolls back its own writes on failure, leaving pre-existing files untouched', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-rollback-'));
    try {
      await fs.writeFile(path.join(temp, 'requirements-nfr.feature'), 'Feature: manually edited\n');
      let callIndex = 0;
      const stubLlm = {
        provider: 'fixture', model: 'offline-model',
        async loadPrompt(name) { return fs.readFile(path.join(root, 'prompts', name), 'utf8'); },
        async chatJSON() { return JSON.parse(JSON.stringify(classificationFixture.responses[callIndex++])); },
      };
      await assert.rejects(
        new NFRGenerator({ llm: stubLlm }).run(classificationFixture.input, { output: temp, force: false }),
        /NFR output already exists/,
      );
      const remaining = (await fs.readdir(temp)).sort();
      assert.deepEqual(remaining, ['requirements-nfr.feature'],
        'report/classification/candidates written during the failed run must be rolled back');
      assert.equal(await fs.readFile(path.join(temp, 'requirements-nfr.feature'), 'utf8'), 'Feature: manually edited\n',
        'the pre-existing standalone .feature must be untouched');
    } finally {
      await fs.remove(temp);
    }
  });
};
