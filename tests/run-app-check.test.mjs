// Integration tests for scripts/run-app-check.mjs's deterministic paths
// (argument handling, unknown app/check, not_implemented). Run via
// subprocess against the real repo's .github/ci-coverage.json, since the
// script is a CLI entrypoint, not (yet) a library - the app/check-specific
// pass/fail/waiver decision logic itself is covered directly by
// tests/coverage-contract.test.mjs, which does not depend on the
// environment having a given app's dependencies installed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync, mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repoRoot = new URL('..', import.meta.url).pathname;
const script = join(repoRoot, 'scripts', 'run-app-check.mjs');

function run(args, extraEnv = {}) {
  const resultsDir = mkdtempSync(join(tmpdir(), 'rac-results-'));
  const logsDir = mkdtempSync(join(tmpdir(), 'rac-logs-'));
  let status = 0;
  let stdout = '';
  let stderr = '';
  try {
    stdout = execFileSync('node', [script, ...args], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, CHECK_RESULTS_DIR: resultsDir, CHECK_LOGS_DIR: logsDir, ...extraEnv },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    status = err.status ?? 1;
    stdout = err.stdout || '';
    stderr = err.stderr || '';
  }
  return { status, stdout, stderr, resultsDir, logsDir };
}

test('missing arguments exits with usage error (2), no result file written', () => {
  const { status, stderr, resultsDir } = run([]);
  assert.equal(status, 2);
  assert.match(stderr, /Usage/);
  rmSync(resultsDir, { recursive: true, force: true });
});

test('unknown app key exits with error (2)', () => {
  const { status, stderr, resultsDir } = run(['definitely-not-a-real-app', 'lint']);
  assert.equal(status, 2);
  assert.match(stderr, /Unknown app key/);
  rmSync(resultsDir, { recursive: true, force: true });
});

test('unknown check name for a real app exits with error (2)', () => {
  const { status, stderr, resultsDir } = run(['backend', 'not-a-real-check']);
  assert.equal(status, 2);
  assert.match(stderr, /Unknown check/);
  rmSync(resultsDir, { recursive: true, force: true });
});

test('a not_implemented check records status not_implemented and exits 0', () => {
  const { status, resultsDir } = run(['backend', 'lint']);
  assert.equal(status, 0);
  const resultFile = join(resultsDir, 'backend__lint.json');
  assert.ok(existsSync(resultFile));
  const result = JSON.parse(readFileSync(resultFile, 'utf8'));
  assert.equal(result.status, 'not_implemented');
  assert.equal(result.required, false);
  rmSync(resultsDir, { recursive: true, force: true });
});


test('local execution rejects invalid contracts before running checks', () => {
  const root = mkdtempSync(join(tmpdir(), 'runner-contract-'));
  try {
    cpSync(join(repoRoot, 'scripts'), join(root, 'scripts'), {recursive: true});
    mkdirSync(join(root, '.github'));
    const coverage = JSON.parse(readFileSync(join(repoRoot, '.github/ci-coverage.json')));
    coverage.apps.backend.checks.audit.required = 'yes';
    writeFileSync(join(root, '.github/ci-coverage.json'), JSON.stringify(coverage));
    assert.throws(() => execFileSync('node', [join(root, 'scripts/run-app-check.mjs'), 'backend', 'audit'], {stdio: 'pipe'}), error => error.status === 2 && /Invalid coverage contract/.test(error.stderr));
  } finally { rmSync(root, {recursive: true, force: true}); }
});

test('audit operational failures retain a distinct recorded status', () => {
  const bin = mkdtempSync(join(tmpdir(), 'runner-npm-'));
  let result;
  try {
    writeFileSync(join(bin, 'npm'), `#!/bin/sh\necho '{"auditReportVersion":"invalid","vulnerabilities":null,"error":{}}'\nexit 0\n`, {mode: 0o755});
    result = run(['backend', 'audit'], {PATH: `${bin}:${process.env.PATH}`});
    assert.equal(result.status, 1);
    assert.equal(JSON.parse(readFileSync(join(result.resultsDir, 'backend__audit.json'))).status, 'operational_error');
  } finally {
    rmSync(bin, {recursive: true, force: true});
    if (result) for (const path of [result.resultsDir, result.logsDir]) rmSync(path, {recursive: true, force: true});
  }
});
