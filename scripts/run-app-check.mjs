#!/usr/bin/env node
// Runs one named check (lint/build/test/audit) for one app from
// .github/ci-coverage.json, and records a structured result for the ci-gate
// job to aggregate later (matrix jobs can't share job outputs directly, so
// each result is written to a file for actions/upload-artifact to carry).
//
// Output is captured to a file (fs.openSync + a raw fd passed to
// spawnSync's stdio), never buffered into a bounded JS string - a command
// that legitimately produces several MiB of output must not be
// misreported as a failure just because of how it was captured (round-5/6
// QA finding F6). Waiver/exception matching reads only the tail of that
// file, not the whole thing back into memory, since a failure signature is
// realistically near the end of output where a tool prints its final
// error - the full log stays on disk (and gets uploaded as an artifact) for
// a human to read in full if needed.
//
// Exit code is 0 whenever the *step* should be treated as non-fatal to the
// rest of this matrix job (passed, not_implemented, or a waived/tolerated
// failure) and 1 for a genuine failure - but the authoritative pass/fail
// decision for the whole workflow is made later by ci-gate.mjs from the
// recorded status, not from this exit code alone, so a job-level
// continue-on-error is never required here.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, openSync, closeSync } from 'node:fs';
import { join } from 'node:path';
import { evaluateCheckResult, isExpired, validateContract } from './lib/coverage-contract.mjs';
import { readTail } from './lib/capture.mjs';

const TAIL_BYTES = 65536; // read at most this much of a captured log for signature matching

const [, , appKey, checkName] = process.argv;
if (!appKey || !checkName) {
  console.error('Usage: run-app-check.mjs <appKey> <checkName>');
  process.exit(2);
}

const repoRoot = new URL('..', import.meta.url).pathname;
const coverage = JSON.parse(readFileSync(join(repoRoot, '.github', 'ci-coverage.json'), 'utf8'));
const contractProblems = validateContract(coverage);
if (contractProblems.length) {
  console.error(`Invalid coverage contract: ${contractProblems.join('; ')}`);
  process.exit(2);
}
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
const logsDir = process.env.CHECK_LOGS_DIR || join(repoRoot, 'health-reports', 'check-logs');
mkdirSync(resultsDir, { recursive: true });
mkdirSync(logsDir, { recursive: true });
const resultFile = join(resultsDir, `${appKey}__${checkName}.json`);
const logFile = join(logsDir, `${appKey}__${checkName}.log`);

function record(status, extra = {}) {
  writeFileSync(resultFile, JSON.stringify({ app: appKey, check: checkName, status, ...extra }, null, 2));
}

const today = process.env.CI_GATE_TODAY || new Date().toISOString().slice(0, 10);

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
  // stdio: 'inherit' streams straight to this process's own stdout/stderr,
  // which GitHub Actions (or a local terminal) captures on its own - never
  // buffered into a JS string, so it was never subject to the F6 problem.
  const setupResult = spawnSync(check.setup, { cwd, shell: true, stdio: 'inherit' });
  if (setupResult.error || setupResult.status !== 0) {
    console.error(`[${appKey}/${checkName}] setup command failed: ${check.setup}`);
    record('failed', { required: !!check.required, reason: 'setup command failed' });
    process.exit(1);
  }
}

const outFd = openSync(logFile, 'w');
let spawnResult;
try {
  spawnResult = spawnSync(check.command, {
    cwd,
    shell: true,
    stdio: ['ignore', outFd, outFd],
    env: { ...process.env, ...(check.env || {}) },
  });
} finally {
  closeSync(outFd);
}

if (spawnResult.error) {
  // A real runner/process error (spawn failure) - never eligible for any
  // exception/waiver, per F6: this is not the application failing, it's
  // the check not running at all.
  console.error(`[${appKey}/${checkName}] runner error: ${spawnResult.error.message}`);
  record('failed', { required: !!check.required, reason: `runner error: ${spawnResult.error.message}` });
  process.exit(1);
}
if (spawnResult.signal) {
  console.error(`[${appKey}/${checkName}] killed by signal ${spawnResult.signal}`);
  record('failed', { required: !!check.required, reason: `killed by signal ${spawnResult.signal}` });
  process.exit(1);
}

const exitCode = spawnResult.status ?? 1;
// Bounded tail, read once: echoed to the step's own log for quick inline
// visibility, and reused for waiver/signature matching. The full file (not
// this tail) is what gets uploaded and is authoritative.
const outputTail = readTail(logFile, TAIL_BYTES);
process.stdout.write(outputTail);

if (checkName === 'audit' && exitCode === 2) {
  record('operational_error', { required: check.required, exit_code: exitCode, reason: 'invalid audit report or tool/registry error' });
  process.exit(1);
}

const evaluation = evaluateCheckResult(
  check,
  { exitCode, output: outputTail },
  undefined, // no structured-failure extraction implemented for any current check; see coverage-contract.mjs
);

if (evaluation.outcome === 'passed') {
  console.log(`[${appKey}/${checkName}] passed`);
  record('passed', { required: !!check.required });
  process.exit(0);
}

if (evaluation.outcome === 'waived' || evaluation.outcome === 'tolerated') {
  const exc = evaluation.exception;
  const expired = isExpired(exc, today);
  if (expired) {
    console.error(`[${appKey}/${checkName}] failed; matches a waived/tolerated exception, but it expired on ${exc.expires} - no longer excused`);
    record('failed', { required: !!check.required, exit_code: exitCode, reason: `exception expired ${exc.expires}` });
    process.exit(1);
  }
  console.log(`[${appKey}/${checkName}] failed, but is a recorded ${evaluation.outcome} (${exc.issue}, expires ${exc.expires})`);
  record(evaluation.outcome, {
    required: !!check.required,
    exit_code: exitCode,
    issue: exc.issue,
    expires: exc.expires,
  });
  process.exit(0);
}

console.error(`[${appKey}/${checkName}] failed (exit ${exitCode}): ${evaluation.reason}`);
record('failed', { required: !!check.required, exit_code: exitCode, reason: evaluation.reason });
process.exit(1);
