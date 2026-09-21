#!/usr/bin/env node
// The one required status check. Aggregates:
//  - the pass/fail result of the prerequisite jobs (changes, inventory,
//    build-test, sub-app-checks), read from `needs.<job>.result` via env vars
//  - every per-app/per-check result artifact written by run-app-check.mjs
// and fails the run on: a prerequisite job that didn't succeed, a required
// check with no result at all (missing/incomplete — e.g. cancelled or timed
// out mid-run), a required check that genuinely failed, or a tolerated
// failure whose exception has expired.
import { existsSync, readFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateContract, isExpired } from './lib/coverage-contract.mjs';

const repoRoot = new URL('..', import.meta.url).pathname;
const coverage = JSON.parse(readFileSync(join(repoRoot, '.github', 'ci-coverage.json'), 'utf8'));

const resultsDir = process.env.CHECK_RESULTS_DIR || join(repoRoot, 'health-reports', 'check-results');
const selectedApps = JSON.parse(process.env.SELECTED_APPS || '[]');
const today = process.env.CI_GATE_TODAY || new Date().toISOString().slice(0, 10);

const prereqJobs = {
  changes: process.env.CHANGES_RESULT,
  inventory: process.env.INVENTORY_RESULT,
  'build-test': process.env.BUILD_TEST_RESULT,
  'sub-app-checks': process.env.SUB_APP_CHECKS_RESULT,
};

const problems = [];
const summaryLines = ['# CI gate', ''];

// Defense in depth: the `inventory` job already runs the same validation,
// but the gate does not simply trust that a prior job passed - it
// independently re-validates the contract it is about to evaluate results
// against, per round-6 QA finding F2 ("adding expiry validation only to the
// runner does not fix the gate's trust in malformed artifacts").
const contractProblems = validateContract(coverage);
if (contractProblems.length > 0) {
  for (const p of contractProblems) problems.push(`ci-coverage.json contract: ${p}`);
}

for (const [job, result] of Object.entries(prereqJobs)) {
  const ok = result === 'success' || (job === 'sub-app-checks' && result === 'success');
  summaryLines.push(`- **${job}**: ${result || '(no result)'}`);
  if (!ok) {
    problems.push(`Prerequisite job "${job}" did not succeed (result: ${result || 'missing'}).`);
  }
}

summaryLines.push('', '## Per-app required checks', '');
summaryLines.push('| App | Check | Status |', '|---|---|---|');

for (const appKey of selectedApps) {
  const app = coverage.apps[appKey];
  if (!app) {
    problems.push(`Selected app "${appKey}" has no entry in ci-coverage.json (selection/coverage drift).`);
    continue;
  }
  for (const [checkName, check] of Object.entries(app.checks)) {
    const resultPath = join(resultsDir, `${appKey}__${checkName}.json`);
    if (!check.required) {
      if (existsSync(resultPath)) {
        const r = JSON.parse(readFileSync(resultPath, 'utf8'));
        summaryLines.push(`| ${appKey} | ${checkName} | ${r.status} (not required) |`);
      }
      continue;
    }
    if (!existsSync(resultPath)) {
      problems.push(`${appKey}/${checkName} is required but produced no result (missing, cancelled, or timed out).`);
      summaryLines.push(`| ${appKey} | ${checkName} | **missing** |`);
      continue;
    }
    const r = JSON.parse(readFileSync(resultPath, 'utf8'));
    if (r.status === 'passed') {
      summaryLines.push(`| ${appKey} | ${checkName} | passed |`);
    } else if (r.status === 'waived' || r.status === 'tolerated') {
      // run-app-check.mjs already rejects an expired match at the source
      // (never records 'waived'/'tolerated' for one), but the gate checks
      // again independently rather than trust that artifact's own status
      // field - see the contract re-validation above for the same reasoning.
      const expired = isExpired({ expires: r.expires }, today);
      if (expired) {
        problems.push(`${appKey}/${checkName}: ${r.status} exception ${r.issue} expired on ${r.expires} — no longer excused.`);
        summaryLines.push(`| ${appKey} | ${checkName} | **expired exception** (${r.issue}, expired ${r.expires}) |`);
      } else {
        summaryLines.push(`| ${appKey} | ${checkName} | ${r.status} (${r.issue}, expires ${r.expires}) |`);
      }
    } else {
      problems.push(`${appKey}/${checkName} is required and failed (status: ${r.status}).`);
      summaryLines.push(`| ${appKey} | ${checkName} | **failed** |`);
    }
  }
}

const summary = summaryLines.join('\n') + '\n';
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}
console.log(summary);

if (problems.length > 0) {
  console.error(`\nCI gate FAILED (${problems.length} problem(s)):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('CI gate passed: all prerequisite jobs succeeded and every required check passed or is validly excepted.');
