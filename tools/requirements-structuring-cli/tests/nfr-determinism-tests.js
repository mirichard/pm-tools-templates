/**
 * #1113 (added AC, "gap review"): verify generate-nfr produces stable output across repeated
 * runs with fixed prompt+params -- the reproducibility claim from docs/nfr-generation.md
 * ("Rendering the same classification/library/overlay produces identical candidates").
 *
 * This closes a real gap distinct from what already existed before this story: nfr-generation-
 * tests.js's "rendering is identical twice and never mutates its handoff" test only calls the
 * pure generateCandidates() function twice in-memory: it never exercises NFRGenerator.run()'s
 * full orchestration (classification handoff, confidenceSummary computation, report formatting,
 * and all four file writes through the safe-I/O layer) across two genuinely separate process
 * invocations with fixed params. verify-regeneration.cjs (#1116) is also not this check: it
 * hand-builds an equivalent result object rather than calling run(), and never compares the
 * candidates JSON output at all.
 *
 * Tolerance definition (the issue AC asks for one explicitly): zero drift is required -- every
 * byte of every written artifact must be identical across the two runs. Generation is documented
 * as deterministic template substitution with no generation-time LLM call; classification here is
 * pinned to a fixed mock via tests/nfr-classification-preload.js so this test isolates rendering
 * determinism from live-provider nondeterminism (which is explicitly out of scope -- see that
 * doc's own "Live source-to-classification determinism is not claimed" note).
 */
const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const { spawnSync } = require('child_process');

module.exports = async function testNFRDeterminism(runner) {
  const root = path.resolve(__dirname, '..');
  const test = (description, fn) => runner.test(description, async () => { await fn(); return true; });
  const temp = await fs.mkdtemp(path.join(__dirname, '.nfr-determinism-test-'));

  try {
    const fixture = require('./fixtures/nfr-classification.json');
    const inputPath = path.join(temp, 'input.json');
    await fs.writeJSON(inputPath, fixture.input);

    const runGenerateNFR = (outputDir) => {
      const env = { ...process.env, LLM_PROVIDER: '', LLM_MODEL: '', LLM_API_KEY: '',
        GEMINI_API_KEY: '', ANTHROPIC_API_KEY: '', OPENAI_API_KEY: '', SAVE_LLM_TRACES: 'false',
        NFR_ATTRIBUTES: '', NFR_TEST_CONFIDENCE: '0.85' };
      const child = spawnSync(process.execPath,
        ['--require', path.join(__dirname, 'nfr-pipeline-fixture.js'), path.join(root, 'src/index.js'),
          'generate-nfr', inputPath, '-o', outputDir],
        { cwd: temp, env, encoding: 'utf8', timeout: 15000 });
      if (child.error) throw child.error;
      assert.strictEqual(child.status, 0, (child.stdout || '') + (child.stderr || ''));
    };

    await test('NFR determinism (#1113): generate-nfr run twice with fixed params writes byte-identical artifacts', async () => {
      const outputA = path.join(temp, 'run-a');
      const outputB = path.join(temp, 'run-b');
      runGenerateNFR(outputA);
      runGenerateNFR(outputB);
      // baseName defaults to the input file's own basename (no extension) -- input.json here.
      const artifacts = ['input-nfr-report.md', 'input-nfr-classifications.json',
        'input-nfr-candidates.json', 'input-nfr.feature'];
      for (const name of artifacts) {
        const contentA = await fs.readFile(path.join(outputA, name), 'utf8');
        const contentB = await fs.readFile(path.join(outputB, name), 'utf8');
        assert.strictEqual(contentA, contentB, `${name} drifted between two runs with identical fixed params`);
      }
    });

    await test('NFR determinism (#1113): a third run with different params (confidence) intentionally drifts, proving the check is not vacuously true', async () => {
      const outputA = path.join(temp, 'run-drift-a');
      const outputC = path.join(temp, 'run-drift-c');
      runGenerateNFR(outputA);
      const env = { ...process.env, LLM_PROVIDER: '', LLM_MODEL: '', LLM_API_KEY: '',
        GEMINI_API_KEY: '', ANTHROPIC_API_KEY: '', OPENAI_API_KEY: '', SAVE_LLM_TRACES: 'false',
        NFR_ATTRIBUTES: '', NFR_TEST_CONFIDENCE: '0.2' };
      const child = spawnSync(process.execPath,
        ['--require', path.join(__dirname, 'nfr-pipeline-fixture.js'), path.join(root, 'src/index.js'),
          'generate-nfr', inputPath, '-o', outputC],
        { cwd: temp, env, encoding: 'utf8', timeout: 15000 });
      assert.strictEqual(child.status, 0, (child.stdout || '') + (child.stderr || ''));
      const reportA = await fs.readFile(path.join(outputA, 'input-nfr-report.md'), 'utf8');
      const reportC = await fs.readFile(path.join(outputC, 'input-nfr-report.md'), 'utf8');
      assert.notStrictEqual(reportA, reportC,
        'a genuinely different confidenceThreshold-affecting param must change the report -- '
        + 'otherwise the determinism check above could pass vacuously against a run() that ignores params entirely');
    });
  } finally {
    await fs.remove(temp);
  }
};
