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
const { writeSafe, appendSectionIfMissing, removeIfSameFile } = require('../src/nfr-output');
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

  await test('NFR acceptance scaffold: cycle-4 finding 2 — writeSafe itself (not a prior check) rejects a pre-existing file without --force', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-scaffold-toctou-'));
    try {
      const target = path.join(temp, 'password-reset-input-nfr.feature');
      // No assertGenerationOutputAvailable call at all here -- proves the write's own O_EXCL
      // is what rejects it, simulating a file created after a prior check would have passed.
      await fs.writeFile(target, 'Feature: pre-existing manual edit\n');
      await assert.rejects(
        writeSafe(target, 'Feature: fresh content\n', false),
        /NFR output already exists/,
      );
      assert.equal(await fs.readFile(target, 'utf8'), 'Feature: pre-existing manual edit\n');
      await writeSafe(target, 'Feature: forced overwrite\n', true);
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

  // ─── Safe-I/O redesign (#1110 cycle-5 findings) ──────────────────────────

  await test('NFR safe-I/O review-round-2 — a non-regular base .feature (symlink) is rejected before classification runs, not mistaken for "absent"', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-basepreflight-'));
    const secretFile = path.join(os.tmpdir(), `nfr-safeio-basepreflight-secret-${Date.now()}.feature`);
    try {
      await fs.writeFile(secretFile, 'DO NOT OVERWRITE');
      await fs.symlink(secretFile, path.join(temp, 'requirements.feature'));
      let classifyCalls = 0;
      const stubLlm = {
        provider: 'fixture', model: 'offline-model',
        async loadPrompt(name) { return fs.readFile(path.join(root, 'prompts', name), 'utf8'); },
        async chatJSON() { classifyCalls++; return JSON.parse(JSON.stringify(classificationFixture.responses[0])); },
      };
      await assert.rejects(
        new NFRGenerator({ llm: stubLlm }).run(classificationFixture.input, { output: temp, force: false }),
        /Unsafe NFR output/,
      );
      assert.equal(classifyCalls, 0,
        'a symlinked base .feature must be rejected as unsafe before classification runs, not treated as "no base file, go standalone"');
      assert.equal(await fs.readFile(secretFile, 'utf8'), 'DO NOT OVERWRITE');
    } finally {
      await fs.remove(temp);
      await fs.remove(secretFile);
    }
  });

  await test('NFR safe-I/O finding 1 — the standalone Gherkin destination is preflighted before classification runs, not just before the write', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-preflight-'));
    try {
      await fs.writeFile(path.join(temp, 'requirements-nfr.feature'), 'Feature: pre-existing\n');
      let classifyCalls = 0;
      const stubLlm = {
        provider: 'fixture', model: 'offline-model',
        async loadPrompt(name) { return fs.readFile(path.join(root, 'prompts', name), 'utf8'); },
        async chatJSON() { classifyCalls++; return JSON.parse(JSON.stringify(classificationFixture.responses[0])); },
      };
      await assert.rejects(
        new NFRGenerator({ llm: stubLlm }).run(classificationFixture.input, { output: temp, force: false }),
        /NFR output already exists/,
      );
      assert.equal(classifyCalls, 0,
        'classification (and its provider calls) must never run once the standalone .feature destination is already known to conflict');
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR safe-I/O finding 2 — docs/nfr-generation.md reflects the shipped #1110 integration, not the stale "not implemented" note', () => {
    const doc = fs.readFileSync(path.join(root, 'docs/nfr-generation.md'), 'utf8');
    assert.doesNotMatch(doc, /No #1110 integration.*is implemented/i);
    assert.match(doc, /#1110 \(implemented\)/);
    assert.match(doc, /acceptanceCriterion/);
  });

  await test('NFR safe-I/O finding 3 — writeSafe itself (not just the run()-level preflight) refuses a symlinked target and enforces exclusive-create for JSON-shaped output', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-json-'));
    const secretFile = path.join(os.tmpdir(), `nfr-safeio-json-secret-${Date.now()}.json`);
    try {
      await fs.writeFile(secretFile, '{"do":"not overwrite"}');
      const link = path.join(temp, 'requirements-nfr-candidates.json');
      await fs.symlink(secretFile, link);
      // O_CREAT|O_EXCL rejects any existing path (symlink included) with EEXIST before
      // O_NOFOLLOW is ever consulted -- that's still a safe refusal (nothing is written through
      // the symlink), just a different error than the force/O_TRUNC branch below, where
      // O_NOFOLLOW is what does the rejecting since O_EXCL isn't in play.
      await assert.rejects(writeSafe(link, '{"ok":true}', false), /NFR output already exists/);
      await assert.rejects(writeSafe(link, '{"ok":true}', true), /Unsafe NFR output/);
      assert.equal(await fs.readFile(secretFile, 'utf8'), '{"do":"not overwrite"}');
      const target = path.join(temp, 'requirements-nfr-classifications.json');
      await writeSafe(target, '{"a":1}', false);
      await assert.rejects(writeSafe(target, '{"b":2}', false), /NFR output already exists/);
    } finally {
      await fs.remove(temp);
      await fs.remove(secretFile);
    }
  });

  await test('NFR safe-I/O finding 4 — rollback is identity-based: a file replaced after creation (a different inode at the same path) is never collaterally deleted', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-rollback-identity-'));
    try {
      const target = path.join(temp, 'requirements-nfr-classifications.json');
      const identity = await writeSafe(target, '{"first":true}', false);
      // Simulate another process replacing the path with a different file in the window between
      // this run's write and its own rollback, by exercising removeIfSameFile with a
      // deliberately wrong inode rather than relying on unlink+recreate (whose real inode number
      // a filesystem is free to reuse immediately, which would make this assertion flaky).
      const staleIdentity = { path: target, dev: identity.dev, ino: identity.ino + 1 };
      await removeIfSameFile(staleIdentity);
      assert.equal(await fs.readFile(target, 'utf8'), '{"first":true}',
        'a file whose inode does not match the identity passed to removeIfSameFile must survive');
      // Positive case: an untouched, correctly-identified file is still removed.
      const target2 = path.join(temp, 'requirements-nfr-candidates.json');
      const identity2 = await writeSafe(target2, '{"second":true}', false);
      await removeIfSameFile(identity2);
      assert.equal(fs.existsSync(target2), false,
        'a file whose identity is unchanged since this run created it must still be removed by rollback');
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR safe-I/O finding 6 — appending the NFR section never truncates or discards content written to the file after it was last read', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-append-'));
    try {
      const file = path.join(temp, 'requirements.feature');
      await fs.writeFile(file, 'Feature: original\n');
      // Simulate a concurrent editor appending content between this run's read of the file and
      // its own append -- appendSectionIfMissing must never reconstruct the file from what it
      // read earlier (an O_TRUNC-based read-modify-write-back would silently discard this), so
      // it must survive.
      await fs.appendFile(file, 'Scenario: concurrently added by another process\n');
      const appended = await appendSectionIfMissing(file, '# MARKER', '  # NFR section\n');
      assert.equal(appended, true);
      const content = await fs.readFile(file, 'utf8');
      assert.ok(content.startsWith('Feature: original\nScenario: concurrently added by another process\n'),
        'a concurrent edit made after this run last read the file must survive the append');
      assert.ok(content.endsWith('  # NFR section\n'), 'the new section must still land at the end');
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR safe-I/O finding 6b — appendSectionIfMissing re-checks the marker on its own descriptor, so two callers that both saw it absent do not both append', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-append-concurrent-'));
    try {
      const file = path.join(temp, 'requirements.feature');
      await fs.writeFile(file, 'Feature: original\n');
      const marker = '# MARKER';
      const first = await appendSectionIfMissing(file, marker, `${marker}\nsection one\n`);
      // Simulate a second caller that made its own "marker absent" decision from an earlier
      // read (before the first caller's append landed) reaching this primitive afterward --
      // it must still see the marker on its own fresh read and decline to append again.
      const second = await appendSectionIfMissing(file, marker, `${marker}\nsection two\n`);
      assert.equal(first, true, 'the first caller must append since the marker was genuinely absent');
      assert.equal(second, false, 'the second caller must decline once its own read finds the marker');
      const content = await fs.readFile(file, 'utf8');
      assert.equal((content.match(new RegExp(marker, 'g')) || []).length, 1,
        'the marker (and its section) must appear exactly once, not duplicated');
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR safe-I/O review-round-3 — appendSectionIfMissing truncates back to the pre-write length if the append itself fails partway through', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-append-partial-'));
    try {
      const file = path.join(temp, 'requirements.feature');
      const original = 'Feature: original\n';
      await fs.writeFile(file, original);
      const nativeFs = require('fs');
      const originalOpen = nativeFs.promises.open;
      nativeFs.promises.open = async (...args) => {
        const handle = await originalOpen(...args);
        // Real open()/read() run for real -- only the write step is faked, simulating a
        // mid-write failure (e.g. ENOSPC) that could otherwise leave a truncated, possibly
        // marker-containing prefix of the section appended.
        handle.writeFile = async () => { throw new Error('SIMULATED DISK FULL'); };
        return handle;
      };
      try {
        await assert.rejects(
          appendSectionIfMissing(file, '# MARKER', '# MARKER\nsection\n'),
          /SIMULATED DISK FULL/,
        );
      } finally {
        nativeFs.promises.open = originalOpen;
      }
      assert.equal(await fs.readFile(file, 'utf8'), original,
        'a failed append must leave the file at exactly its pre-write length and content, not a corrupt partial section');
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR safe-I/O review-round-2 — writeSafe self-cleans a file it just created if the write itself fails partway through', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-partial-write-'));
    const target = path.join(temp, 'requirements-nfr-candidates.json');
    const nativeFs = require('fs');
    const originalOpen = nativeFs.promises.open;
    nativeFs.promises.open = async (...args) => {
      const handle = await originalOpen(...args);
      // Real open()/O_EXCL runs for real -- only the write step is faked, simulating a
      // mid-write failure (e.g. ENOSPC) after the file has already been created.
      handle.writeFile = async () => { throw new Error('SIMULATED DISK FULL'); };
      return handle;
    };
    try {
      await assert.rejects(writeSafe(target, '{"a":1}', false), /SIMULATED DISK FULL/);
      assert.equal(fs.existsSync(target), false,
        'a file this call created but failed to finish writing must not survive as an orphan no rollback can find');
    } finally {
      nativeFs.promises.open = originalOpen;
      await fs.remove(temp);
    }
  });

  await test('NFR safe-I/O finding 7 — writeSafe force path (O_TRUNC) refuses a FIFO without hanging', async () => {
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-safeio-fifo-force-'));
    const fifoPath = path.join(temp, 'target.feature');
    try {
      execFileSync('mkfifo', [fifoPath]);
      const withTimeout = (promise, ms) => {
        let timer;
        const timeout = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`TIMEOUT: did not return within ${ms}ms — HUNG`)), ms);
        });
        return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
      };
      // Must assert the actual rejection reason, not just "rejects" -- assert.rejects with no
      // pattern would also pass if writeSafe hung and withTimeout's own TIMEOUT rejection fired
      // instead, which would silently stop this test from guarding the FIFO regression it names.
      await assert.rejects(withTimeout(writeSafe(fifoPath, 'Feature: x\n', true), 2000), /Unsafe NFR output/);
    } finally {
      await fs.remove(temp);
    }
  });

  await test('NFR safe-I/O structural guard: nfr-generator.js performs no raw fs opens/writes of its own, and every open() in nfr-output.js uses the shared O_NOFOLLOW|O_NONBLOCK flags', () => {
    const generatorSource = fs.readFileSync(path.join(root, 'src/nfr-generator.js'), 'utf8');
    assert.doesNotMatch(generatorSource, /\bfs\.promises\.open\(|\bfsNative\b|createWriteStream|writeFileSync/,
      'nfr-generator.js must route every read/write through the nfr-output.js primitives, never open a file descriptor itself');
    const outputSource = fs.readFileSync(path.join(root, 'src/nfr-output.js'), 'utf8');
    const openCalls = outputSource.match(/fs\.promises\.open\(/g) || [];
    const flagsReferences = outputSource.match(/NOFOLLOW_NONBLOCK/g) || [];
    assert.ok(openCalls.length >= 3, 'expected writeSafe, appendSafeExisting and readSafeIfExists to each open a descriptor');
    // +1 accounts for NOFOLLOW_NONBLOCK's own definition, which isn't itself an open() call site.
    assert.equal(flagsReferences.length, openCalls.length + 1,
      'every open() call in nfr-output.js must use the shared NOFOLLOW_NONBLOCK flags constant -- no ad hoc, unguarded open() calls allowed');
  });
};
