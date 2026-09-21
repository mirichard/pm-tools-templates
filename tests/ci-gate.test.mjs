// Regression tests for scripts/ci-gate.mjs - the one required status check.
// Focused on negative paths: the specific conditions that must fail the gate
// (missing prerequisite job, missing/failed/expired required-check results,
// selection/coverage drift), plus one happy-path case for contrast. Run via
// subprocess against the real repo's .github/ci-coverage.json (the script is
// a CLI entrypoint, not a library), matching tests/run-app-check.test.mjs's
// convention. "backend" is used as the fixture app: it has exactly one
// required check (audit), which keeps each case's result-file setup minimal.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repoRoot = new URL('..', import.meta.url).pathname;
const script = join(repoRoot, 'scripts', 'ci-gate.mjs');

const PASSING_PREREQS = {
  CHANGES_RESULT: 'success',
  INVENTORY_RESULT: 'success',
  BUILD_TEST_RESULT: 'success',
  SUB_APP_CHECKS_RESULT: 'success',
};

function run({ selectedApps = [], results = {}, env = {} } = {}) {
  const resultsDir = mkdtempSync(join(tmpdir(), 'ci-gate-results-'));
  for (const [name, content] of Object.entries(results)) {
    writeFileSync(join(resultsDir, `${name}.json`), JSON.stringify(content));
  }
  let status = 0;
  let stdout = '';
  let stderr = '';
  try {
    stdout = execFileSync('node', [script], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        ...PASSING_PREREQS,
        CHECK_RESULTS_DIR: resultsDir,
        SELECTED_APPS: JSON.stringify(selectedApps),
        CI_GATE_TODAY: '2026-06-15',
        ...env,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    status = err.status ?? 1;
    stdout = err.stdout || '';
    stderr = err.stderr || '';
  }
  rmSync(resultsDir, { recursive: true, force: true });
  return { status, stdout, stderr };
}

test('happy path: no selected apps, all prerequisite jobs succeeded, passes', () => {
  const { status, stdout } = run({ selectedApps: [] });
  assert.equal(status, 0);
  assert.match(stdout, /CI gate passed/);
});

test('a prerequisite job that did not succeed fails the gate', () => {
  const { status, stderr } = run({ selectedApps: [], env: { BUILD_TEST_RESULT: 'failure' } });
  assert.equal(status, 1);
  assert.match(stderr, /Prerequisite job "build-test" did not succeed/);
});

test('a prerequisite job with no result at all fails the gate', () => {
  const { status, stderr } = run({ selectedApps: [], env: { INVENTORY_RESULT: '' } });
  assert.equal(status, 1);
  assert.match(stderr, /Prerequisite job "inventory" did not succeed \(result: missing\)/);
});

test('a required check with no result file (missing/cancelled/timed out) fails the gate', () => {
  const { status, stderr } = run({ selectedApps: ['backend'], results: {} });
  assert.equal(status, 1);
  assert.match(stderr, /backend\/audit is required but produced no result/);
});

test('a required check that genuinely failed fails the gate', () => {
  const { status, stderr } = run({
    selectedApps: ['backend'],
    results: { backend__audit: { status: 'failed', required: true } },
  });
  assert.equal(status, 1);
  assert.match(stderr, /backend\/audit is required and failed/);
});

test('a waived/tolerated result whose exception has expired fails the gate', () => {
  const { status, stderr } = run({
    selectedApps: ['backend'],
    results: {
      backend__audit: {
        status: 'waived',
        required: true,
        issue: 'https://github.com/example/repo/issues/1',
        expires: '2026-01-01',
      },
    },
  });
  assert.equal(status, 1);
  assert.match(stderr, /backend\/audit: waived exception .* expired on 2026-01-01/);
});

test('a waived/tolerated result whose exception has not expired passes the gate', () => {
  const { status, stdout } = run({
    selectedApps: ['backend'],
    results: {
      backend__audit: {
        status: 'tolerated',
        required: true,
        issue: 'https://github.com/example/repo/issues/1',
        expires: '2099-01-01',
      },
    },
  });
  assert.equal(status, 0);
  assert.match(stdout, /CI gate passed/);
});

test('a failed result for a non-required check does not fail the gate, but the required check still must pass', () => {
  const { status, stdout } = run({
    selectedApps: ['backend'],
    results: {
      backend__audit: { status: 'passed', required: true },
      backend__lint: { status: 'failed', required: false },
    },
  });
  assert.equal(status, 0);
  assert.match(stdout, /CI gate passed/);
});

test('a selected app with no entry in ci-coverage.json fails the gate (selection/coverage drift)', () => {
  const { status, stderr } = run({ selectedApps: ['definitely-not-a-real-app'] });
  assert.equal(status, 1);
  assert.match(stderr, /Selected app "definitely-not-a-real-app" has no entry in ci-coverage\.json/);
});

test('all required checks passed is a straightforward pass', () => {
  const { status, stdout } = run({
    selectedApps: ['backend'],
    results: { backend__audit: { status: 'passed', required: true } },
  });
  assert.equal(status, 0);
  assert.match(stdout, /CI gate passed/);
});
