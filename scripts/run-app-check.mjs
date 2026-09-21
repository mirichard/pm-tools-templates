#!/usr/bin/env node
// Runs one named check (lint/build/test/audit) for one app from
// .github/ci-coverage.json, and records a structured result for the ci-gate
// job to aggregate later (matrix jobs can't share job outputs directly, so
// each result is written to a file for actions/upload-artifact to carry).
//
// Exit code is 0 whenever the *step* should be treated as non-fatal to the
// rest of this matrix job (passed, not_implemented, or a tolerated/excepted
// failure) and 1 for a genuine failure — but the authoritative pass/fail
// decision for the whole workflow is made later by ci-gate.mjs from the
// recorded status, not from this exit code alone, so a job-level
// continue-on-error is never required here.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [, , appKey, checkName] = process.argv;
if (!appKey || !checkName) {
  console.error('Usage: run-app-check.mjs <appKey> <checkName>');
  process.exit(2);
}

const repoRoot = new URL('..', import.meta.url).pathname;
const coverage = JSON.parse(readFileSync(join(repoRoot, '.github', 'ci-coverage.json'), 'utf8'));
const app = coverage.apps[appKey];
if (!app) {
  console.error(`Unknown app key: ${appKey}`);
  process.exit(2);
}
const check = app.checks[checkName];
if (!check) {
  console.error(`Unknown check "${checkName}" for app "${appKey}"`);
  process.exit(2);
}

const resultsDir = process.env.CHECK_RESULTS_DIR || join(repoRoot, 'health-reports', 'check-results');
mkdirSync(resultsDir, { recursive: true });
const resultFile = join(resultsDir, `${appKey}__${checkName}.json`);

function record(status, extra = {}) {
  writeFileSync(resultFile, JSON.stringify({ app: appKey, check: checkName, status, ...extra }, null, 2));
}

if (checkName === 'audit') {
  // Not an npm script: delegates to the existing, already-tested audit
  // helper, which itself reads the app's package-lock.json directly and
  // does not require a prior `npm ci` to have succeeded.
  check.command = `bash scripts/check-workflow-health.sh audit "${app.path}"`;
}

if (!check.command) {
  console.log(`[${appKey}/${checkName}] not_implemented${check.note ? `: ${check.note}` : ''}`);
  record('not_implemented', { required: !!check.required, note: check.note });
  process.exit(0);
}

const cwd = checkName === 'audit' ? repoRoot : join(repoRoot, app.path);
if (!existsSync(cwd)) {
  console.error(`[${appKey}/${checkName}] app path does not exist: ${app.path}`);
  record('failed', { required: !!check.required, reason: 'app path missing on disk' });
  process.exit(1);
}

if (check.setup) {
  try {
    execSync(check.setup, { cwd, stdio: 'inherit' });
  } catch {
    console.error(`[${appKey}/${checkName}] setup command failed: ${check.setup}`);
    record('failed', { required: !!check.required, reason: 'setup command failed' });
    process.exit(1);
  }
}

let output = '';
let exitCode = 0;
try {
  output = execSync(check.command, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  process.stdout.write(output);
} catch (err) {
  output = `${err.stdout || ''}${err.stderr || ''}`;
  process.stdout.write(output);
  exitCode = typeof err.status === 'number' ? err.status : 1;
}

if (exitCode === 0) {
  console.log(`[${appKey}/${checkName}] passed`);
  record('passed', { required: !!check.required });
  process.exit(0);
}

const exception = check.exception;
if (exception && exception.failure_signature && output.includes(exception.failure_signature)) {
  console.log(`[${appKey}/${checkName}] failed, but matches tracked exception ${exception.issue}`);
  record('tolerated', {
    required: !!check.required,
    exit_code: exitCode,
    issue: exception.issue,
    expires: exception.expires,
  });
  process.exit(0);
}

console.error(`[${appKey}/${checkName}] failed (exit ${exitCode})${exception ? ' — did NOT match the tracked exception signature, treating as a real failure' : ''}`);
record('failed', { required: !!check.required, exit_code: exitCode });
process.exit(1);
