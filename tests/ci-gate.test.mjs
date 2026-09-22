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
import { mkdtempSync, writeFileSync, rmSync, readFileSync, mkdirSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repoRoot = new URL('..', import.meta.url).pathname;
const coverage = JSON.parse(readFileSync(join(repoRoot, '.github/ci-coverage.json')));
const script = join(repoRoot, 'scripts', 'ci-gate.mjs');

const PASSING_PREREQS = {
  CHANGES_RESULT: 'success',
  INVENTORY_RESULT: 'success',
  BUILD_TEST_RESULT: 'success',
  SUB_APP_CHECKS_RESULT: 'success',
};

function run({ selectedApps = [], results = {}, env = {}, contract } = {}) {
  const resultsDir = mkdtempSync(join(tmpdir(), 'ci-gate-results-'));
  for (const [name, content] of Object.entries(results)) {
    writeFileSync(join(resultsDir, `${name}.json`), JSON.stringify({ app: name.split('__')[0], check: name.split('__')[1], ...content }));
  }
  // Exercise the real gate with an isolated contract when testing waivers.
  let gateScript = script;
  if (contract) {
    const fixtureRoot = join(resultsDir, 'repo');
    mkdirSync(join(fixtureRoot, '.github'), {recursive: true});
    cpSync(join(repoRoot, 'scripts'), join(fixtureRoot, 'scripts'), {recursive: true});
    writeFileSync(join(fixtureRoot, '.github/ci-coverage.json'), JSON.stringify(contract));
    gateScript = join(fixtureRoot, 'scripts/ci-gate.mjs');
  }
  let status = 0;
  let stdout = '';
  let stderr = '';
  try {
    stdout = execFileSync('node', [gateScript], {
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
  assert.match(stderr, /exception is not authorized/);
});

test('an invented unexpired exception fails the gate', () => {
  const { status, stderr } = run({
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
  assert.equal(status, 1);
  assert.match(stderr, /exception is not authorized/);
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


test('QA status-only waiver is rejected', () => {
  const result = run({selectedApps: ['backend'], results: {backend__audit: {status: 'waived', app: undefined, check: undefined}}});
  assert.equal(result.status, 1);
  assert.match(result.stderr, /exception is not authorized/);
});

function waiverFixture() {
  const contract = structuredClone(coverage);
  const appKey = 'backend';
  const app = contract.apps[appKey];
  app.checks.lint = {command: 'npm run lint', required: true, exception: {
    type: 'waiver', execution: 'diagnostic-only',
    scope_statement: 'fixture linter cannot run',
    issue: 'https://github.com/example/repo/issues/1', owner: 'fixture',
    recorded: '2026-06-01', expires: '2026-12-21',
    failure_signature: 'fixture failure', removal_condition: 'repair fixture linter',
  }};
  const results = {};
  for (const [name, check] of Object.entries(app.checks)) {
    if (check.required) results[`${appKey}__${name}`] = {status: 'passed', required: true};
  }
  const [name, check] = Object.entries(app.checks).find(([, check]) => check.exception);
  const result = {status: 'waived', required: check.required, exit_code: 1, issue: check.exception.issue, expires: check.exception.expires};
  results[`${appKey}__${name}`] = result;
  return {appKey, results, result, check, contract};
}

test('a current contract waiver passes and an expired contract waiver fails', () => {
  const f = waiverFixture();
  assert.equal(run({contract: f.contract, selectedApps: [f.appKey], results: f.results, env: {CI_GATE_TODAY: f.check.exception.recorded}}).status, 0);
  const expired = run({contract: f.contract, selectedApps: [f.appKey], results: f.results, env: {CI_GATE_TODAY: '2099-01-01'}});
  assert.equal(expired.status, 1);
  assert.match(expired.stderr, /contract exception expired/);
});

for (const patch of [{app: 'wrong'}, {check: 'wrong'}, {required: false}, {status: 'tolerated'}, {issue: 'invented'}, {expires: '2099-01-01'}, {exit_code: 0}]) {
  test(`reject inconsistent waiver ${JSON.stringify(patch)}`, () => {
    const f = waiverFixture();
    Object.assign(f.result, patch);
    assert.equal(run({contract: f.contract, selectedApps: [f.appKey], results: f.results}).status, 1);
  });
}

test('combined result/log artifact extracts to the gate lookup directory', () => {
  const root = mkdtempSync(join(tmpdir(), 'ci-layout-'));
  try {
    // upload-artifact preserves paths relative to the common parent.
    const workflow = readFileSync(join(repoRoot, '.github/workflows/ci.yml'), 'utf8');
    const uploadPaths = [...workflow.matchAll(/^            (health-reports\/check-(?:results|logs)\/)$/gm)].map(m => m[1]);
    assert.equal(uploadPaths.length, 2);
    const destination = workflow.match(/pattern: check-result-\*\n\s+path: (.+)/)[1].trim();
    for (const path of uploadPaths) {
      mkdirSync(join(root, 'artifact', path.replace('health-reports/', '')), {recursive: true});
    }
    writeFileSync(join(root, 'artifact/check-results/backend__audit.json'), JSON.stringify({app: 'backend', check: 'audit', required: true, status: 'passed'}));
    cpSync(join(root, 'artifact'), join(root, destination), {recursive: true});
    const output = execFileSync('node', [script], {encoding: 'utf8', env: {...process.env, ...PASSING_PREREQS, SELECTED_APPS: '["backend"]', CHECK_RESULTS_DIR: join(root, 'health-reports/check-results')}});
    assert.match(output, /CI gate passed/);
  } finally { rmSync(root, {recursive: true, force: true}); }
});
