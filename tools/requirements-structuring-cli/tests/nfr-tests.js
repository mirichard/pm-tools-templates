const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const { spawnSync } = require('child_process');
const { Command } = require('commander');
const { UCSTemplate } = require('../src/ucs-template');
const { validateNFRInput } = require('../src/nfr-input');
const { addNFROptions, normalizeNFROptions, configureNFRProvider } = require('../src/nfr-options');
const { listOverlays } = require('../src/nfr-overlays');
const LLMClient = require('../src/llm-client');
const TestGenerator = require('../src/test-generator');
const GherkinGenerator = require('../src/gherkin-generator');

module.exports = async function testNFR(runner) {
  const root = path.resolve(__dirname, '..');
  const temp = await fs.mkdtemp(path.join(__dirname, '.nfr-test-'));
  const sample = await fs.readJSON(path.join(root, 'examples/web-store-ucs.json'));
  const runtime = UCSTemplate.fromJSON(sample).toJSON();
  const structured = { useCaseId: 'UC-01', useCaseName: 'Checkout', steps: sample.basicFlow.steps };
  const runtimePath = path.join(temp, 'runtime-ucs.json');
  const structuredPath = path.join(temp, 'formal-structured.json');
  await fs.writeJSON(runtimePath, runtime);
  await fs.writeJSON(structuredPath, structured);
  const test = (description, fn) => runner.test(description, async () => { await fn(); return true; });
  const copy = (data) => JSON.parse(JSON.stringify(data));
  const parse = (args) => {
    const command = addNFROptions(new Command()).exitOverride().configureOutput({ writeErr() {} });
    command.parse(args, { from: 'user' });
    return normalizeNFROptions(command.opts());
  };
  const cli = (args, extra = {}) => {
    const env = { ...process.env, LLM_PROVIDER: '', LLM_MODEL: '', LLM_API_KEY: '',
      GEMINI_API_KEY: '', ANTHROPIC_API_KEY: '', OPENAI_API_KEY: '', SAVE_LLM_TRACES: 'false', NFR_ATTRIBUTES: '',
      ...extra.env };
    const child = spawnSync(process.execPath,
      [...(extra.preload ? ['--require', path.join(__dirname, 'nfr-pipeline-fixture.js')]
        : extra.classify ? ['--require', path.join(__dirname, 'nfr-classification-preload.js')] : []),
        path.join(root, 'src/index.js'), ...args],
      { cwd: temp, env, encoding: 'utf8', timeout: 15000 });
    if (child.error) throw child.error;
    return { ...child, text: child.stdout + child.stderr };
  };
  const failedCLI = async (name, payload, pattern) => {
    const input = path.join(temp, `${name}.json`);
    const output = path.join(temp, `${name}-output`);
    await fs.writeJSON(input, payload);
    const result = cli(['generate-nfr', input, '-o', output]);
    assert.strictEqual(result.status, 1, result.text);
    assert.match(result.text, pattern);
    assert.strictEqual(await fs.pathExists(output), false);
  };
  try {
    await test('NFR command and all pre-existing commands remain registered', () => {
      const result = cli(['--help']);
      assert.strictEqual(result.status, 0, result.text);
      for (const name of ['init', 'detect', 'structure', 'transform', 'generate-tests', 'validate',
        'review', 'generate-gherkin', 'generate-nfr', 'pipeline']) assert.ok(result.stdout.includes(name));
    });
    await test('NFR help exposes all requested flags', () => {
      const result = cli(['generate-nfr', '--help']);
      assert.strictEqual(result.status, 0, result.text);
      for (const flag of ['--provider', '--model', '--attributes', '--confidence-threshold',
        '--profile', '--overlay', '--list-overlays', '--output']) assert.ok(result.stdout.includes(flag));
    });
    await test('NFR parses and stores provider, model, attributes, threshold and aliases', () => {
      const options = parse(['--provider', 'GEMINI', '--model', 'custom-model', '--attributes', 'reliability, security,reliability',
        '--confidence-threshold', '0.75', '--profile', 'neutral', '--overlay', 'neutral']);
      assert.strictEqual(options.provider, 'gemini');
      assert.strictEqual(options.model, 'custom-model');
      assert.deepStrictEqual(options.attributes, ['reliability', 'security']);
      assert.strictEqual(options.confidenceThreshold, 0.75);
      assert.strictEqual(options.overlay, 'neutral');
    });
    await test('NFR defaults to neutral without inventing attributes or scores', () => {
      const options = parse([]);
      assert.strictEqual(options.overlay, 'neutral');
      assert.deepStrictEqual(options.attributes, []);
      assert.strictEqual(options.confidenceThreshold, null);
      assert.strictEqual(options.provider, undefined);
    });
    await test('NFR rejects malformed attributes, thresholds, providers and empty models', () => {
      for (const args of [ ['--attributes', 'a,,b'], ['--attributes', ' '],
        ['--confidence-threshold', 'NaN'], ['--confidence-threshold', 'Infinity'],
        ['--confidence-threshold', '-0.1'], ['--confidence-threshold', '1.1'],
        ['--confidence-threshold', ' '], ['--provider', 'unsupported'], ['--model', ' ']]) {
        assert.throws(() => parse(args));
      }
      assert.strictEqual(parse(['--confidence-threshold', '0']).confidenceThreshold, 0);
      assert.strictEqual(parse(['--confidence-threshold', '1']).confidenceThreshold, 1);
    });
    await test('NFR rejects conflicting or unknown profiles including inherited object keys', () => {
      assert.throws(() => parse(['--profile', 'neutral', '--overlay', 'other']), /must select the same/);
      for (const flag of ['--profile', '--overlay']) {
        for (const name of ['unknown', 'constructor', '__proto__', 'toString']) {
          assert.throws(() => parse([flag, name]), /Unknown NFR overlay/);
        }
      }
    });
    await test('NFR provider overrides reuse LLMClient and restore environment', () => {
      const previous = { provider: process.env.LLM_PROVIDER, model: process.env.LLM_MODEL };
      const restore = configureNFRProvider({ provider: 'anthropic', model: 'fixture-model' });
      try {
        const llm = new LLMClient();
        assert.strictEqual(llm.provider, 'anthropic');
        assert.strictEqual(llm.model, 'fixture-model');
      } finally { restore(); }
      assert.strictEqual(process.env.LLM_PROVIDER, previous.provider);
      assert.strictEqual(process.env.LLM_MODEL, previous.model);
    });
    await test('NFR accepts existing structured data without adding version markers', () => {
      const result = validateNFRInput(structured);
      assert.strictEqual(result.kind, 'structured');
      assert.deepStrictEqual(result.data, structured);
      assert.strictEqual(Object.prototype.hasOwnProperty.call(result.data, 'version'), false);
    });
    await test('NFR accepts real runtime UCS without useCaseName or version', () => {
      assert.strictEqual(Object.prototype.hasOwnProperty.call(runtime, 'useCaseName'), false);
      assert.deepStrictEqual(validateNFRInput(runtime).data, runtime);
      assert.strictEqual(validateNFRInput(sample).kind, 'ucs');
    });
    await test('NFR validates nested steps and optional fields across both artifacts', () => {
      const badStep = copy(runtime); delete badStep.basicFlow.steps[0].action;
      assert.throws(() => validateNFRInput(badStep), /basicFlow.steps\[0\].action/);
      const badFlow = copy(runtime); badFlow.exceptionFlows[0].steps = [];
      assert.throws(() => validateNFRInput(badFlow), /exceptionFlows\[0\].steps/);
      const badCondition = copy(runtime); badCondition.preconditions = 'logged in';
      assert.throws(() => validateNFRInput(badCondition), /preconditions/);
      const badObjects = copy(structured); badObjects.businessObjects = [123];
      assert.throws(() => validateNFRInput(badObjects), /businessObjects/);
      const badType = copy(structured); badType.steps[0].flowType = 'other';
      assert.throws(() => validateNFRInput(badType), /flowType/);
      const noName = copy(structured); delete noName.useCaseName;
      assert.throws(() => validateNFRInput(noName), /useCaseName/);
    });
    await test('NFR rejects ambiguous artifacts, unsafe roots and prohibited keys', () => {
      assert.throws(() => validateNFRInput({ ...runtime, steps: [] }), /both structured and UCS/);
      for (const data of [null, [], 'text', JSON.parse('{"__proto__":{}}')]) {
        assert.throws(() => validateNFRInput(data), /Invalid NFR input/);
      }
    });
    await test('NFR detects concrete pre-contract step-container shapes', () => {
      const cases = [ { useCaseId: 'UC-01', useCaseName: 'Old' },
        { useCaseId: 'UC-01', intent: 'Old', role: 'User' },
        { ...runtime, basicFlow: {} }, { ...runtime, basicFlow: runtime.basicFlow.steps } ];
      for (const data of cases) assert.throws(() => validateNFRInput(data), /Legacy\/incomplete NFR input.*Re-run structure/);
    });
    await test('NFR distinguishes invalid present fields from legacy missing containers', () => {
      assert.throws(() => validateNFRInput({ ...structured, steps: null }), /^Error: Invalid NFR input/);
      assert.throws(() => validateNFRInput({ ...runtime, basicFlow: { steps: [] } }), /^Error: Invalid NFR input/);
      const before = JSON.stringify(runtime);
      validateNFRInput(runtime);
      assert.strictEqual(JSON.stringify(runtime), before);
    });
    await test('NFR overlay registry lists opt-in candidates and keeps neutral default', async () => {
      assert.deepStrictEqual(listOverlays().map((entry) => entry.name),
        ['neutral', 'fda-21-cfr-11', 'hipaa', 'pci-dss', 'wcag-22', 'section-508']);
      const output = path.join(temp, 'list-output');
      const result = cli(['generate-nfr', '--list-overlays', '-o', output]);
      assert.strictEqual(result.status, 0, result.text);
      assert.strictEqual(result.stdout.split('\n').filter((line) => line.includes('(default)')).join(''), 'neutral core (default)');
      for (const overlay of listOverlays()) assert.ok(result.stdout.includes(overlay.label), overlay.name);
      assert.strictEqual(await fs.pathExists(output), false);
    });
    await test('NFR standalone classifies runtime UCS through an offline provider fixture', async () => {
      const output = path.join(temp, 'standalone');
      const result = cli(['generate-nfr', runtimePath, '--attributes', 'security,reliability',
        '--confidence-threshold', '0.8', '--profile', 'neutral', '--provider', 'openai', '--model', 'fixture-model', '--output', output], { classify: true });
      assert.strictEqual(result.status, 0, result.text);
      const report = await fs.readFile(path.join(output, 'runtime-nfr-report.md'), 'utf8');
      for (const fragment of ['NFR generation not yet implemented (#1109)', 'Artifact: ucs',
        'security, reliability', '0.8', 'openai', 'fixture-model', 'neutral', 'No NFR candidates']) {
        assert.ok(report.includes(fragment), fragment);
      }
      assert.deepStrictEqual(await fs.readJSON(runtimePath), runtime);
    });
    await test('NFR explicit overlay records selection without generating NFR candidates', async () => {
      const output = path.join(temp, 'overlay-selection');
      const result = cli(['generate-nfr', structuredPath, '--overlay', 'wcag-22', '-o', output], { classify: true });
      assert.strictEqual(result.status, 0, result.text);
      const report = await fs.readFile(path.join(output, 'formal-nfr-report.md'), 'utf8');
      assert.match(report, /wcag-22 \(selection recorded; no patterns generated\)/);
      assert.match(report, /No NFR candidates/);
      assert.match(report, /requiring human verification/);
      assert.doesNotMatch(report, /neutral core; no overlay content/);
    });
    await test('NFR standalone also consumes the formal structure artifact', async () => {
      const output = path.join(temp, 'formal');
      const result = cli(['generate-nfr', structuredPath, '--overlay', 'neutral', '-o', output], { classify: true });
      assert.strictEqual(result.status, 0, result.text);
      assert.match(await fs.readFile(path.join(output, 'formal-nfr-report.md'), 'utf8'), /Artifact: structured/);
    });
    await test('NFR without credentials fails through the real provider path without artifacts', async () => {
      const output = path.join(temp, 'no-credentials-output');
      const before = (await fs.readdir(temp)).sort();
      // No preload; empty credentials also prevent dotenv from filling these keys.
      const result = cli(['generate-nfr', structuredPath, '--output', output], {
        env: { NODE_OPTIONS: '', LLM_PROVIDER: '', LLM_API_KEY: '',
          GEMINI_API_KEY: '', ANTHROPIC_API_KEY: '', OPENAI_API_KEY: '' },
      });
      assert.strictEqual(result.status, 1, result.text);
      assert.match(result.text, /No LLM provider configured\. Set one of these in your \.env file:/);
      for (const key of ['GEMINI_API_KEY', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'LLM_API_KEY']) {
        assert.ok(result.text.includes(key), key);
      }
      assert.strictEqual(await fs.pathExists(output), false);
      assert.deepStrictEqual((await fs.readdir(temp)).sort(), before);
    });
    await test('NFR missing argument or file fails non-zero with an actionable message', () => {
      for (const args of [[], [path.join(temp, 'absent.json')]]) {
        const result = cli(['generate-nfr', ...args]);
        assert.strictEqual(result.status, 1, result.text);
        assert.match(result.text, /Missing NFR input.*(Run|run) structure/);
      }
    });
    await test('NFR malformed JSON fails clearly before writing a report', async () => {
      const input = path.join(temp, 'malformed.json');
      await fs.writeFile(input, '{bad');
      const result = cli(['generate-nfr', input]);
      assert.strictEqual(result.status, 1, result.text);
      assert.match(result.text, /Unable to read NFR input as JSON/);
    });
    await test('NFR invalid schema fails non-zero without output', async () => {
      await failedCLI('invalid', { ...structured, steps: [] }, /Invalid NFR input: steps/);
    });
    await test('NFR legacy shape fails non-zero with re-structuring instructions', async () => {
      await failedCLI('legacy', { useCaseId: 'UC-01', useCaseName: 'Old' }, /Legacy\/incomplete NFR input.*Re-run structure/);
    });
    await test('NFR invalid flags fail non-zero before reading input', () => {
      for (const args of [['--confidence-threshold', '2'], ['--provider', 'invalid'],
        ['--profile', 'unknown'], ['--profile', 'neutral', '--overlay', 'other']]) {
        const result = cli(['generate-nfr', ...args]);
        assert.strictEqual(result.status, 1, result.text);
        assert.doesNotMatch(result.text, /Missing NFR input/);
      }
    });
    await test('NFR pipeline runs after UCS/tests/Gherkin and preserves subsequent phases', async () => {
      const output = path.join(temp, 'pipeline');
      const eventsPath = path.join(temp, 'events.jsonl');
      const result = cli(['pipeline', path.join(root, 'examples/web-store-input.md'),
        '--activity', path.join(root, 'examples/web-store-activity.json'),
        '--state', path.join(root, 'examples/web-store-state.json'),
        '--provider', 'gemini', '--model', 'pipeline-fixture', '--attributes', 'security',
        '--confidence-threshold', '0.6', '--overlay', 'neutral', '--output', output],
      { preload: true, env: { NFR_TEST_EVENTS: eventsPath } });
      assert.strictEqual(result.status, 0, result.text);
      assert.match(result.text, /Pipeline complete/);
      const events = (await fs.readFile(eventsPath, 'utf8')).trim().split('\n').map(JSON.parse);
      assert.deepStrictEqual(events.map((entry) => entry.event),
        ['ambiguity', 'structure', 'gate', 'ucs', 'tests', 'gherkin', 'nfr', 'gate', 'feedback', 'activity', 'state', 'activity', 'state']);
      assert.deepStrictEqual(events.find((entry) => entry.event === 'structure'),
        { event: 'structure', provider: 'gemini', model: 'pipeline-fixture' });
      assert.deepStrictEqual(events.find((entry) => entry.event === 'nfr'),
        { event: 'nfr', hasUseCaseName: false, attributes: ['security'], threshold: 0.6, overlay: 'neutral' });
      const base = path.join(output, 'web-store-input');
      assert.deepStrictEqual(await fs.readJSON(base + '-ucs.json'), runtime);
      const expectedTests = new TestGenerator().generate(runtime);
      assert.deepStrictEqual(await fs.readJSON(base + '-tests.json'), expectedTests);
      assert.strictEqual(await fs.readFile(base + '.feature', 'utf8'), new GherkinGenerator().generate(expectedTests, runtime));
      for (const suffix of ['-ambiguity-report.md', '-use-case-spec.md', '-test-cases.md', '-summary.md', '-validation-report.md', '-nfr-report.md']) {
        assert.ok(await fs.pathExists(base + suffix), suffix);
      }
    });
    await test('NFR insertion preserves all existing early-exit review gates', async () => {
      for (const gate of ['not_ready', 'clarification', 'phase1', 'phase2']) {
        const output = path.join(temp, 'gate-' + gate);
        const eventsPath = path.join(temp, gate + '.jsonl');
        const result = cli(['pipeline', path.join(root, 'examples/web-store-input.md'), '-o', output],
          { preload: true, env: { NFR_TEST_EVENTS: eventsPath, NFR_TEST_GATE: gate } });
        assert.strictEqual(result.status, 0, result.text);
        const events = (await fs.readFile(eventsPath, 'utf8')).trim().split('\n').map(JSON.parse);
        assert.strictEqual(events.some((entry) => entry.event === 'feedback'), false);
        assert.strictEqual(events.some((entry) => entry.event === 'nfr'), gate === 'phase2');
        if (['not_ready', 'clarification'].includes(gate)) assert.strictEqual(events.some((entry) => entry.event === 'structure'), false);
      }
    });
    await test('Pipeline validates overlay selection before any upstream LLM stage', async () => {
      const output = path.join(temp, 'unknown-pipeline');
      const result = cli(['pipeline', path.join(root, 'examples/web-store-input.md'), '--overlay', 'unknown', '-o', output]);
      assert.strictEqual(result.status, 1, result.text);
      assert.match(result.text, /Unknown NFR overlay/);
      assert.strictEqual(await fs.pathExists(output), false);
    });
  } finally {
    await fs.remove(temp);
  }
};
