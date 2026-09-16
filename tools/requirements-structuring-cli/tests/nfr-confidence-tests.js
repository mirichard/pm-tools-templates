/**
 * #1111 — Confidence scoring + human-review gate.
 *
 * Pure computation tests run against real golden-fixture candidate data (with confidence
 * values adjusted via .map() to construct the NOT READY tier real data doesn't naturally
 * produce). CLI-level tests spawn the real CLI with tests/nfr-classification-preload.js
 * (confidence controllable via NFR_TEST_CONFIDENCE) and tests/nfr-pipeline-fixture.js
 * (inquirer mocked; confidence-gate decline controllable via NFR_TEST_GATE=confidence-decline),
 * mirroring exactly how Phase 0's own gates are tested end to end. Zero live LLM calls.
 */
const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const { spawnSync } = require('child_process');
const { Command } = require('commander');
const { computeConfidenceSummary, DEFAULT_CONFIDENCE_THRESHOLD } = require('../src/nfr-confidence');
const { addNFROptions, normalizeNFROptions } = require('../src/nfr-options');
const { generateCandidates } = require('../src/nfr-candidates');
const { gateOnConfidence } = require('../src/index');
const inquirer = require('inquirer');
const fixture = require('./fixtures/nfr-classification.json');

module.exports = async function testNFRConfidence(runner) {
  const root = path.resolve(__dirname, '..');
  const temp = await fs.mkdtemp(path.join(__dirname, '.nfr-confidence-test-'));
  const test = (description, fn) => runner.test(description, async () => { await fn(); return true; });

  const goldenDir = path.join(root, 'examples/fixtures/nfr-golden/neutral');
  const handoff = await fs.readJSON(path.join(goldenDir, 'password-reset-input-nfr-classifications.json'));
  const generation = generateCandidates(handoff, { overlay: 'neutral' });

  try {
    // ─── Pure computation: readiness label at all three tiers ────────────────
    await test('confidence summary: READY when every real candidate is at/above threshold', () => {
      // Real golden-fixture confidences range 0.6-0.98 (verified against examples/fixtures/
      // nfr-golden/neutral); 0.5 is below all of them.
      const summary = computeConfidenceSummary(generation.candidates, 0.5);
      assert.strictEqual(summary.readinessLabel, 'READY');
      assert.strictEqual(summary.review, 0);
      assert.strictEqual(summary.accepted, summary.total);
      assert.strictEqual(summary.total, generation.candidates.length);
      assert.deepStrictEqual(summary.belowThreshold, []);
    });

    await test('confidence summary: NEEDS CLARIFICATION for the real mixed set at the default threshold', () => {
      const summary = computeConfidenceSummary(generation.candidates, DEFAULT_CONFIDENCE_THRESHOLD);
      assert.strictEqual(summary.readinessLabel, 'NEEDS CLARIFICATION');
      assert.ok(summary.review > 0 && summary.review < summary.total,
        'a genuinely mixed real set must have some, not all or none, below threshold');
      assert.strictEqual(summary.accepted + summary.review, summary.total);
      assert.strictEqual(summary.belowThreshold.length, summary.review);
      assert.ok(summary.belowThreshold.every((c) => c.confidence < DEFAULT_CONFIDENCE_THRESHOLD));
    });

    await test('confidence summary: NOT READY when every candidate is constructed below threshold', () => {
      const allLow = generation.candidates.map((c) => ({ ...c, confidence: 0.3 }));
      const summary = computeConfidenceSummary(allLow, DEFAULT_CONFIDENCE_THRESHOLD);
      assert.strictEqual(summary.readinessLabel, 'NOT READY');
      assert.strictEqual(summary.accepted, 0);
      assert.strictEqual(summary.review, summary.total);
    });

    await test('confidence summary: an empty candidate set is READY (nothing to review)', () => {
      const summary = computeConfidenceSummary([], DEFAULT_CONFIDENCE_THRESHOLD);
      assert.strictEqual(summary.readinessLabel, 'READY');
      assert.strictEqual(summary.total, 0);
      assert.strictEqual(summary.accepted, 0);
      assert.strictEqual(summary.review, 0);
    });

    await test('confidence summary: a candidate exactly at the threshold is accepted, not flagged for review', () => {
      // computeConfidenceSummary uses confidence < threshold, so === threshold must accept.
      const summary = computeConfidenceSummary([{ confidence: 0.75 }], 0.75);
      assert.strictEqual(summary.readinessLabel, 'READY');
      assert.strictEqual(summary.accepted, 1);
      assert.strictEqual(summary.review, 0);
    });

    // ─── --confidence-threshold: the #1112 flag, reused not duplicated ───────
    await test('--confidence-threshold is the single #1112 flag, reused (not duplicated), with a real default', () => {
      const command = addNFROptions(new Command()).exitOverride().configureOutput({ writeErr() {} });
      const matching = command.options.filter((opt) => opt.long === '--confidence-threshold');
      assert.strictEqual(matching.length, 1, 'exactly one --confidence-threshold flag must be registered');
      command.parse([], { from: 'user' });
      const options = normalizeNFROptions(command.opts());
      assert.strictEqual(options.confidenceThreshold, DEFAULT_CONFIDENCE_THRESHOLD);
    });

    // ─── gateOnConfidence seam: prompt default at all three tiers ─────────────
    // Direct unit tests against src/index.js's gateOnConfidence, mocking inquirer.prompt
    // in-process to capture the exact `default` passed -- not just the accept/decline
    // behavior the CLI-level tests below exercise. This closes the gap the CLI-level tests
    // leave: they only exercise READY (no prompt at all) and an all-candidates-below-threshold
    // NOT READY set, never the middle NEEDS CLARIFICATION tier's `default: true` value.
    const withMockedPrompt = async (mockFn, fn) => {
      const original = inquirer.prompt;
      inquirer.prompt = mockFn;
      try {
        return await fn();
      } finally {
        inquirer.prompt = original;
      }
    };

    await test('gateOnConfidence: READY never calls inquirer.prompt', async () => {
      let called = false;
      await withMockedPrompt(async () => { called = true; return { proceedAnyway: true }; }, async () => {
        const proceed = await gateOnConfidence({ readinessLabel: 'READY', review: 0, total: 5, threshold: 0.75 });
        assert.strictEqual(proceed, true);
      });
      assert.strictEqual(called, false, 'READY must skip the prompt entirely');
    });

    await test('gateOnConfidence: NEEDS CLARIFICATION prompts with default: true (proceed)', async () => {
      let capturedDefault;
      await withMockedPrompt(async ([question]) => {
        capturedDefault = question.default;
        return { proceedAnyway: question.default };
      }, async () => {
        const proceed = await gateOnConfidence({ readinessLabel: 'NEEDS CLARIFICATION', review: 2, total: 5, threshold: 0.75 });
        assert.strictEqual(proceed, true);
      });
      assert.strictEqual(capturedDefault, true,
        'NEEDS CLARIFICATION must default to proceeding, mirroring Phase 0\'s warnings gate');
    });

    await test('gateOnConfidence: NOT READY prompts with default: false (decline)', async () => {
      let capturedDefault;
      await withMockedPrompt(async ([question]) => {
        capturedDefault = question.default;
        return { proceedAnyway: question.default };
      }, async () => {
        const proceed = await gateOnConfidence({ readinessLabel: 'NOT READY', review: 5, total: 5, threshold: 0.75 });
        assert.strictEqual(proceed, false);
      });
      assert.strictEqual(capturedDefault, false, 'NOT READY must default to declining');
    });

    // ─── CLI-level interactive gate ───────────────────────────────────────────
    const cli = (args, extra = {}) => {
      const env = { ...process.env, LLM_PROVIDER: '', LLM_MODEL: '', LLM_API_KEY: '',
        GEMINI_API_KEY: '', ANTHROPIC_API_KEY: '', OPENAI_API_KEY: '', SAVE_LLM_TRACES: 'false', NFR_ATTRIBUTES: '',
        ...extra.env };
      const child = spawnSync(process.execPath,
        ['--require', path.join(__dirname, 'nfr-pipeline-fixture.js'), path.join(root, 'src/index.js'), ...args],
        { cwd: temp, env, encoding: 'utf8', timeout: 15000 });
      if (child.error) throw child.error;
      return { status: child.status, stdout: child.stdout, stderr: child.stderr, text: (child.stdout || '') + (child.stderr || '') };
    };
    const readEvents = async (eventsPath) => (await fs.pathExists(eventsPath))
      ? (await fs.readFile(eventsPath, 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse) : [];
    const inputPath = path.join(temp, 'input.json');
    await fs.writeJSON(inputPath, fixture.input);

    await test('standalone generate-nfr: gate does not trigger when every candidate is above threshold', async () => {
      const output = path.join(temp, 'ready-output');
      const eventsPath = path.join(temp, 'ready-events.jsonl');
      const result = cli(['generate-nfr', inputPath, '-o', output],
        { env: { NFR_TEST_CONFIDENCE: '0.95', NFR_TEST_EVENTS: eventsPath } });
      assert.strictEqual(result.status, 0, result.text);
      const events = await readEvents(eventsPath);
      assert.strictEqual(events.some((e) => e.event === 'gate' && e.message.includes('confidence threshold')), false,
        'no gate prompt should fire when every candidate is already above threshold');
      assert.match(result.stdout, /Readiness: READY/);
    });

    await test('standalone generate-nfr: gate triggers and blocks (non-zero exit) when declined', async () => {
      const output = path.join(temp, 'notready-output');
      const eventsPath = path.join(temp, 'notready-events.jsonl');
      const result = cli(['generate-nfr', inputPath, '-o', output],
        { env: { NFR_TEST_CONFIDENCE: '0.3', NFR_TEST_GATE: 'confidence-decline', NFR_TEST_EVENTS: eventsPath } });
      assert.notStrictEqual(result.status, 0, 'declining the confidence gate must exit non-zero');
      const events = await readEvents(eventsPath);
      const gatePrompt = events.find((e) => e.event === 'gate' && e.message.includes('confidence threshold'));
      assert.ok(gatePrompt, 'the confidence gate prompt must fire when every candidate is below threshold');
      assert.match(gatePrompt.message, /NOT READY/);
      assert.match(result.text, /Declined/);
    });

    await test('standalone generate-nfr: gate triggers but proceeds (zero exit) when accepted', async () => {
      const output = path.join(temp, 'accept-output');
      const eventsPath = path.join(temp, 'accept-events.jsonl');
      // NFR_TEST_GATE left unset -- tests/nfr-pipeline-fixture.js's mock accepts by default.
      const result = cli(['generate-nfr', inputPath, '-o', output],
        { env: { NFR_TEST_CONFIDENCE: '0.3', NFR_TEST_EVENTS: eventsPath } });
      assert.strictEqual(result.status, 0, result.text);
      const events = await readEvents(eventsPath);
      assert.ok(events.some((e) => e.event === 'gate' && e.message.includes('confidence threshold')),
        'the confidence gate prompt must still fire even though this run accepts it');
      assert.match(result.stdout, /Readiness: NOT READY/);
    });

    await test('pipeline: the confidence gate fires at the NFR phase and, on decline, halts before Phase 3 (parity with standalone)', async () => {
      const output = path.join(temp, 'pipeline-notready');
      const eventsPath = path.join(temp, 'pipeline-notready-events.jsonl');
      const result = cli(['pipeline', path.join(root, 'examples/web-store-input.md'), '-o', output],
        { env: { NFR_TEST_CONFIDENCE: '0.3', NFR_TEST_GATE: 'confidence-decline', NFR_TEST_EVENTS: eventsPath } });
      assert.strictEqual(result.status, 0, result.text);
      const events = await readEvents(eventsPath);
      const nfrIndex = events.findIndex((e) => e.event === 'nfr');
      assert.ok(nfrIndex > -1, 'the NFR phase must have run');
      const gateAfterNFR = events.slice(nfrIndex + 1).find((e) => e.event === 'gate' && e.message.includes('confidence threshold'));
      assert.ok(gateAfterNFR, 'the confidence gate prompt must fire right after the NFR phase, same as standalone');
      assert.match(gateAfterNFR.message, /NOT READY/);
      assert.strictEqual(events.some((e) => e.event === 'feedback'), false,
        'declining the confidence gate must halt before Phase 3, same shape as every other early-exit gate');
    });

    await test('pipeline: the confidence gate does not trigger and Phase 3 still runs when every candidate is above threshold', async () => {
      const output = path.join(temp, 'pipeline-ready');
      const eventsPath = path.join(temp, 'pipeline-ready-events.jsonl');
      const result = cli(['pipeline', path.join(root, 'examples/web-store-input.md'), '-o', output],
        { env: { NFR_TEST_CONFIDENCE: '0.95', NFR_TEST_EVENTS: eventsPath } });
      assert.strictEqual(result.status, 0, result.text);
      const events = await readEvents(eventsPath);
      assert.strictEqual(events.some((e) => e.event === 'gate' && e.message.includes('confidence threshold')), false);
      assert.strictEqual(events.some((e) => e.event === 'feedback'), true, 'Phase 3 must still run when nothing needs review');
    });
  } finally {
    await fs.remove(temp);
  }
};
