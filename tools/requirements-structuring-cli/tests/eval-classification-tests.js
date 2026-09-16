/**
 * #1113 -- unit tests for scripts/eval-classification.js's categorization logic, independent of
 * whatever the real golden-fixture comparison happens to score. This is deliberate: the labeled
 * set in examples/fixtures/nfr-golden/eval-labels.json happens to score mostly exact-match against
 * the real classifier output (see that file's own "orderOfOperationsCaveat"), so these synthetic
 * cases are what actually prove near-miss and mismatch detection work, not the real-data run.
 */
const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs-extra');
const { categorize, evaluateVariant, summarize } = require('../scripts/eval-classification');

module.exports = async function testEvalClassification(runner) {
  const test = (description, fn) => runner.test(`eval-classification: ${description}`, async () => { await fn(); return true; });
  const root = path.resolve(__dirname, '..');

  await test('categorize: exact-match when the tool assigned the exact subCharacteristic', () => {
    const toolAttributes = [{ characteristic: 'security', subCharacteristic: 'confidentiality' }];
    const label = { characteristic: 'security', subCharacteristic: 'confidentiality' };
    assert.strictEqual(categorize(toolAttributes, label), 'exact-match');
  });

  await test('categorize: near-miss when the tool assigned a different subCharacteristic under the same characteristic', () => {
    const toolAttributes = [{ characteristic: 'security', subCharacteristic: 'integrity' }];
    const label = { characteristic: 'security', subCharacteristic: 'confidentiality' };
    assert.strictEqual(categorize(toolAttributes, label), 'near-miss');
  });

  await test('categorize: mismatch when the tool assigned nothing under that characteristic at all', () => {
    const toolAttributes = [{ characteristic: 'reliability', subCharacteristic: 'availability' }];
    const label = { characteristic: 'security', subCharacteristic: 'confidentiality' };
    assert.strictEqual(categorize(toolAttributes, label), 'mismatch');
  });

  await test('categorize: mismatch when the tool assigned nothing at all (empty attributes)', () => {
    const label = { characteristic: 'security', subCharacteristic: 'confidentiality' };
    assert.strictEqual(categorize([], label), 'mismatch');
  });

  await test('evaluateVariant: a requirement missing from the classification entirely scores as mismatch for every labeled attribute, not a thrown error', () => {
    const classification = { requirements: [] };
    const labelSet = { labels: [{ sourcePath: '/basicFlow/steps/0', requirementRef: 'FR1',
      attributes: [{ characteristic: 'security', subCharacteristic: 'confidentiality' },
        { characteristic: 'reliability', subCharacteristic: 'availability' }] }] };
    const rows = evaluateVariant(classification, labelSet, 'synthetic');
    assert.strictEqual(rows.length, 2);
    assert(rows.every((r) => r.category === 'mismatch'));
  });

  await test('evaluateVariant: joins by source.path, not by array position or requirementRef', () => {
    const classification = { requirements: [
      { source: { path: '/basicFlow/steps/9' }, attributes: [{ characteristic: 'security', subCharacteristic: 'confidentiality' }] },
      { source: { path: '/basicFlow/steps/0' }, attributes: [{ characteristic: 'reliability', subCharacteristic: 'availability' }] },
    ] };
    const labelSet = { labels: [{ sourcePath: '/basicFlow/steps/0', requirementRef: 'FR1',
      attributes: [{ characteristic: 'reliability', subCharacteristic: 'availability' }] }] };
    const rows = evaluateVariant(classification, labelSet, 'synthetic');
    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].category, 'exact-match');
  });

  await test('summarize: counts and rates are correct across all three categories', () => {
    const rows = [{ category: 'exact-match' }, { category: 'exact-match' }, { category: 'near-miss' }, { category: 'mismatch' }];
    const { total, counts, rates } = summarize(rows);
    assert.strictEqual(total, 4);
    assert.deepStrictEqual(counts, { 'exact-match': 2, 'near-miss': 1, mismatch: 1 });
    assert.strictEqual(rates['exact-match'], 0.5);
    assert.strictEqual(rates['near-miss'], 0.25);
    assert.strictEqual(rates.mismatch, 0.25);
  });

  await test('summarize: an empty row set reports zero rates, not NaN or a division error', () => {
    const { total, counts, rates } = summarize([]);
    assert.strictEqual(total, 0);
    assert.deepStrictEqual(counts, { 'exact-match': 0, 'near-miss': 0, mismatch: 0 });
    assert.deepStrictEqual(rates, { 'exact-match': 0, 'near-miss': 0, mismatch: 0 });
  });

  // ─── Real golden-fixture run: proves the harness's wiring against real data, without pinning
  // the exact split. The exact counts depend on the classifier's model behavior and this label
  // set's judgments, not on this codebase's correctness -- the README documents those numbers as
  // reported, not asserted, so npm test (which is part of this project's own correctness gate)
  // must not fail because a legitimate future golden-fixture recapture or label revision changed
  // them. Structural invariants only; the specific 20/2/2 split is demonstrated by actually
  // running the script (see below), not pinned here.
  await test('real golden fixture (both variants): runs without error and partitions all 24 labeled attributes across the three categories', () => {
    const labelSet = require('../examples/fixtures/nfr-golden/eval-labels.json');
    const neutral = require('../examples/fixtures/nfr-golden/neutral/password-reset-input-nfr-classifications.json');
    const pciDss = require('../examples/fixtures/nfr-golden/pci-dss/password-reset-input-nfr-classifications.json');
    const rows = [...evaluateVariant(neutral, labelSet, 'neutral'), ...evaluateVariant(pciDss, labelSet, 'pci-dss')];
    const { total, counts } = summarize(rows);
    assert.strictEqual(total, 24, 'structural: 5 labeled units x 12 attributes-per-variant x 2 variants');
    assert(rows.every((r) => ['exact-match', 'near-miss', 'mismatch'].includes(r.category)));
    assert.strictEqual(counts['exact-match'] + counts['near-miss'] + counts.mismatch, total);
  });

  // ─── CLI-level wiring ──────────────────────────────────────────────────────────────────────
  const runScript = (args) => {
    const child = spawnSync(process.execPath, [path.join(root, 'scripts/eval-classification.js'), ...args],
      { cwd: root, encoding: 'utf8', timeout: 15000 });
    if (child.error) throw child.error;
    return { status: child.status, stdout: child.stdout, stderr: child.stderr };
  };

  await test('CLI: default invocation (no live calls) exits 0 and reports the overall split', () => {
    const result = runScript([]);
    assert.strictEqual(result.status, 0, result.stderr);
    // Structural pattern only (see the real-golden-fixture test above for why the exact split
    // isn't pinned): total of 24 across all three categories, each reported as count/24 (rate%).
    assert.match(result.stdout, /overall: exact-match \d+\/24 \(\d+\.\d%\), near-miss \d+\/24 \(\d+\.\d%\), mismatch \d+\/24 \(\d+\.\d%\)/);
  });

  await test('CLI: --live with --variant both is rejected before any provider call, staying under the 15-call eval cap', () => {
    const result = runScript(['--live', '--variant', 'both']);
    assert.notStrictEqual(result.status, 0);
    assert.match(result.stderr, /15-call live-eval cap/);
  });

  await test('CLI: rejects an unknown --variant value', () => {
    const result = runScript(['--variant', 'bogus']);
    assert.notStrictEqual(result.status, 0);
    assert.match(result.stderr, /--variant must be one of/);
  });

  await test('CLI: --output as the final argument (missing its value) errors instead of silently writing nothing', () => {
    const result = runScript(['--output']);
    assert.notStrictEqual(result.status, 0);
    assert.match(result.stderr, /--output requires a value/);
  });

  await test('CLI: --variant as the final argument (missing its value) errors', () => {
    const result = runScript(['--variant']);
    assert.notStrictEqual(result.status, 0);
    assert.match(result.stderr, /--variant requires a value/);
  });

  await test('CLI: --output followed by another flag (e.g. --output --force) rejects the flag as a path instead of using it', () => {
    const result = runScript(['--output', '--force']);
    assert.notStrictEqual(result.status, 0, 'must not silently treat --force as the output directory');
    assert.match(result.stderr, /--output requires a value/);
  });

  await test('--live loads the package .env like the main CLI, not just manually exported vars', async () => {
    const envPath = path.join(root, '.env');
    const existed = await fs.pathExists(envPath);
    const backup = existed ? await fs.readFile(envPath, 'utf8') : null;
    await fs.writeFile(envPath, 'EVAL_DOTENV_PROBE=loaded\n');
    delete process.env.EVAL_DOTENV_PROBE;
    const scriptPath = require.resolve('../scripts/eval-classification');
    delete require.cache[scriptPath];
    try {
      require('../scripts/eval-classification');
      assert.strictEqual(process.env.EVAL_DOTENV_PROBE, 'loaded',
        'scripts/eval-classification.js must load the package .env via dotenv (same as src/index.js), '
        + 'so --live works with the documented `cp .env.example .env` setup instead of requiring manually exported vars');
    } finally {
      if (existed) await fs.writeFile(envPath, backup); else await fs.remove(envPath);
      delete process.env.EVAL_DOTENV_PROBE;
      delete require.cache[scriptPath];
    }
  });

  await test('CLI: prints the labeled set\'s non-expert-verified warning on every run', () => {
    const result = runScript([]);
    assert.match(result.stdout, /NOT independently expert-verified/);
  });

  const temp = await fs.mkdtemp(path.join(__dirname, '.eval-classification-test-'));
  try {
    await test('CLI: --output writes results via the safe-I/O layer, exclusive-create by default', () => {
      const outDir = path.join(temp, 'out');
      const first = runScript(['--output', outDir]);
      assert.strictEqual(first.status, 0, first.stderr);
      const resultsPath = path.join(outDir, 'eval-classification-results.json');
      assert(fs.existsSync(resultsPath));
      const written = fs.readJsonSync(resultsPath);
      assert.strictEqual(written.overall.total, 24);
      assert.strictEqual(written.labelSetExpertVerified, false);
      // The persisted file must carry its own honesty caveat, not just stdout -- a consumer who
      // keeps only this JSON must still be able to see why the rates aren't accuracy.
      assert.match(written.labelSetWarning, /NOT independently expert-verified/);
      assert.match(written.labelSetOrderOfOperationsCaveat, /order-of-operations|blind independent validation/i);
      assert.match(written.labelSetTaxonomyAccuracyCaveat, /reconstructed from secondary/i);

      const second = runScript(['--output', outDir]);
      assert.notStrictEqual(second.status, 0, 'a second run without --force must not silently overwrite results');
      assert.match(second.stderr, /already exists/);
    });

    await test('CLI: --output --force overwrites an existing results file', () => {
      const outDir = path.join(temp, 'out-force');
      assert.strictEqual(runScript(['--output', outDir]).status, 0);
      const forced = runScript(['--output', outDir, '--force']);
      assert.strictEqual(forced.status, 0, forced.stderr);
    });
  } finally {
    await fs.remove(temp);
  }
};
