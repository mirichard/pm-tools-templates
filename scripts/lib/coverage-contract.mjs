// Shared contract for .github/ci-coverage.json: schema validation for the
// whole file (not just exception metadata) and the evaluation logic for a
// single check's outcome, including exception/waiver matching. Imported by
// scripts/run-app-check.mjs (local + CI execution) and scripts/ci-gate.mjs
// (aggregation), so the two can never diverge on what counts as valid or
// tolerated the way they did before (round-5 QA finding F2: the runner
// didn't apply expiry at all; only the gate did).
//
// Two distinct exception/waiver types exist, deliberately, rather than one
// generic "exception" shape (round-5 QA finding F1):
//
// - "waiver": for a check that cannot execute meaningfully as a whole (the
//   tool errors out before producing any per-item result: no config file,
//   no such module, zero matching test files, etc). Declares that fact
//   explicitly via `execution` ("skipped" or "diagnostic-only") and a
//   `scope_statement` - it does NOT claim to protect against regressions
//   within the check, because there is no meaningful per-item result to
//   protect. `failure_signature` is still required and still checked, but
//   only as a sanity check that the waiver still describes the real,
//   current failure - not as a claim that a different failure containing
//   the same signature would somehow be "the same known issue" at the
//   granularity of an individual test. All 7 of this repo's exceptions as
//   of 2026-09-21 are this type: every one is a whole-command, no-partial-
//   result failure (missing config, missing module, zero matching tests).
//
// - "signature": for a check with genuinely independent, individually
//   attributable sub-results (a Jest suite with multiple tests). Requires
//   the COMPLETE set of reported failures to match a permitted list of
//   {testName, normalizedMessage} pairs - not just "the output contains
//   this substring somewhere", which is exactly what let a known failure
//   mask an unrelated new one in the same suite. No current exception in
//   this repo uses this type (none of the 7 are partial-failure cases);
//   it exists so a future case like this doesn't repeat the F1 mistake.

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISSUE_URL_RE = /^https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/\d+$/;

function nonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validDate(v) {
  if (!ISO_DATE_RE.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

// Validates one exception/waiver object. Returns an array of problem
// strings (empty = valid). `context` is a human-readable "app/check" label
// used to prefix messages.
export function validateExceptionObject(exc, context) {
  const problems = [];
  if (exc == null || typeof exc !== 'object') {
    return [`${context}: exception must be an object`];
  }
  if (!nonEmptyString(exc.issue) || !ISSUE_URL_RE.test(exc.issue)) {
    problems.push(`${context}: exception.issue must be a full https://github.com/<owner>/<repo>/issues/<n> URL`);
  }
  if (!nonEmptyString(exc.owner)) problems.push(`${context}: exception.owner is required`);
  if (!nonEmptyString(exc.recorded) || !validDate(exc.recorded)) {
    problems.push(`${context}: exception.recorded must be a valid YYYY-MM-DD date`);
  }
  if (!nonEmptyString(exc.expires) || !validDate(exc.expires)) {
    problems.push(`${context}: exception.expires must be a valid YYYY-MM-DD date`);
  } else if (nonEmptyString(exc.recorded) && validDate(exc.recorded) && exc.expires <= exc.recorded) {
    problems.push(`${context}: exception.expires (${exc.expires}) must be after exception.recorded (${exc.recorded})`);
  }
  if (!nonEmptyString(exc.removal_condition)) {
    problems.push(`${context}: exception.removal_condition is required`);
  }

  const type = exc.type || 'waiver'; // default for backward compatibility within this repo's own data
  if (type === 'waiver') {
    if (exc.execution !== 'skipped' && exc.execution !== 'diagnostic-only') {
      problems.push(`${context}: waiver.execution must be "skipped" or "diagnostic-only"`);
    }
    if (!nonEmptyString(exc.scope_statement)) {
      problems.push(`${context}: waiver.scope_statement is required (what, exactly, is not covered)`);
    }
    if (!nonEmptyString(exc.failure_signature)) {
      problems.push(`${context}: waiver.failure_signature is required (sanity check that the waiver still applies)`);
    }
  } else if (type === 'signature') {
    if (!Array.isArray(exc.permitted_failures) || exc.permitted_failures.length === 0) {
      problems.push(`${context}: signature.permitted_failures must be a non-empty array`);
    } else {
      for (const [i, pf] of exc.permitted_failures.entries()) {
        if (!nonEmptyString(pf?.testName)) problems.push(`${context}: permitted_failures[${i}].testName is required`);
        if (!nonEmptyString(pf?.normalizedMessage)) problems.push(`${context}: permitted_failures[${i}].normalizedMessage is required`);
      }
    }
  } else {
    problems.push(`${context}: exception.type must be "waiver" or "signature", got ${JSON.stringify(type)}`);
  }
  return problems;
}

// Validates one check entry ({command, required, exception?, ...}).
// checkName === 'audit' is structurally different from lint/build/test: its
// real command is always the fixed `check-workflow-health.sh audit <path>`
// delegation applied by run-app-check.mjs, never stored per-app, so it has
// no `command` field to validate the shape of - only `required`.
export function validateCheckObject(check, context, checkName) {
  const problems = [];
  if (check == null || typeof check !== 'object') {
    return [`${context}: check must be an object`];
  }
  if (typeof check.required !== 'boolean') {
    problems.push(`${context}: check.required must be a boolean`);
  }
  if (checkName !== 'audit') {
    if (check.command === null) {
      if (check.required !== false) {
        problems.push(`${context}: check.command is null but required is not false`);
      }
      if (check.status !== 'not_implemented') {
        problems.push(`${context}: check.command is null but status is not "not_implemented"`);
      }
    } else if (!nonEmptyString(check.command)) {
      problems.push(`${context}: check.command must be a non-empty string or null`);
    }
  }
  if (check.exception !== undefined) {
    problems.push(...validateExceptionObject(check.exception, context));
  }
  return problems;
}

// Validates the whole ci-coverage.json object. Returns an array of problem
// strings (empty = valid).
export function validateContract(coverage) {
  const problems = [];
  if (!nonEmptyString(coverage.node_version)) problems.push('node_version is required');
  if (!Array.isArray(coverage.shared_paths) || coverage.shared_paths.length === 0) {
    problems.push('shared_paths must be a non-empty array');
  }

  const seenPaths = new Map(); // path -> where first seen, to catch duplicates across apps/elsewhere/excluded
  function notePath(path, where) {
    if (seenPaths.has(path)) {
      problems.push(`Duplicate path "${path}": listed in both ${seenPaths.get(path)} and ${where}`);
    } else {
      seenPaths.set(path, where);
    }
  }

  if (coverage.apps == null || typeof coverage.apps !== 'object') {
    problems.push('apps must be an object');
  } else {
    for (const [key, app] of Object.entries(coverage.apps)) {
      if (!nonEmptyString(app?.path)) {
        problems.push(`apps.${key}: path is required`);
        continue;
      }
      notePath(app.path, `apps.${key}`);
      if (app.checks == null || typeof app.checks !== 'object') {
        problems.push(`apps.${key}: checks must be an object`);
        continue;
      }
      const expectedChecks = ['lint', 'build', 'test', 'audit'];
      for (const checkName of expectedChecks) {
        if (!(checkName in app.checks)) {
          problems.push(`apps.${key}.checks.${checkName} is missing`);
          continue;
        }
        problems.push(...validateCheckObject(app.checks[checkName], `apps.${key}.checks.${checkName}`, checkName));
      }
    }
  }

  for (const [listName] of [['covered_elsewhere'], ['excluded']]) {
    const list = coverage[listName];
    if (!Array.isArray(list)) {
      problems.push(`${listName} must be an array`);
      continue;
    }
    for (const [i, entry] of list.entries()) {
      if (!nonEmptyString(entry?.path)) {
        problems.push(`${listName}[${i}].path is required`);
        continue;
      }
      notePath(entry.path, `${listName}[${i}]`);
      if (!nonEmptyString(entry?.reason)) {
        problems.push(`${listName}[${i}] (${entry.path}): reason is required`);
      }
    }
  }

  return problems;
}

// Decides whether a failed check's captured output/exit is tolerated by its
// exception/waiver, and how. `result` is { exitCode, output, processError }
// where processError is set for a spawn/signal failure (never eligible for
// tolerance - see F6). `structuredFailures`, if provided, is an array of
// {testName, normalizedMessage} the tool actually reported (only meaningful
// for "signature"-type exceptions).
//
// Returns one of:
//   { outcome: 'passed' }
//   { outcome: 'failed', reason }
//   { outcome: 'waived', exception }        -- waiver type, signature still matches
//   { outcome: 'tolerated', exception }     -- signature type, failure set matches exactly
export function evaluateCheckResult(check, result, structuredFailures) {
  if (result.processError) {
    return { outcome: 'failed', reason: `runner/process error, not an application failure: ${result.processError}` };
  }
  if (result.exitCode === 0) {
    return { outcome: 'passed' };
  }
  const exc = check.exception;
  if (!exc) {
    return { outcome: 'failed', reason: `exit code ${result.exitCode}, no exception on record` };
  }
  const type = exc.type || 'waiver';
  if (type === 'waiver') {
    if (result.output.includes(exc.failure_signature)) {
      return { outcome: 'waived', exception: exc };
    }
    return { outcome: 'failed', reason: 'failure does not match the recorded waiver signature - this is a different failure than the one waived' };
  }
  if (type === 'signature') {
    if (!Array.isArray(structuredFailures)) {
      return { outcome: 'failed', reason: 'signature-type exception requires structured failure data, none was captured' };
    }
    const permitted = new Set(exc.permitted_failures.map((pf) => `${pf.testName}\u0000${pf.normalizedMessage}`));
    const actual = new Set(structuredFailures.map((f) => `${f.testName}\u0000${f.normalizedMessage}`));
    if (actual.size !== permitted.size) {
      return { outcome: 'failed', reason: `reported failure count (${actual.size}) does not match permitted count (${permitted.size})` };
    }
    for (const key of actual) {
      if (!permitted.has(key)) {
        return { outcome: 'failed', reason: `unexpected failure not in the permitted set: ${key.split('\u0000')[0]}` };
      }
    }
    return { outcome: 'tolerated', exception: exc };
  }
  return { outcome: 'failed', reason: `unknown exception type ${JSON.stringify(type)}` };
}

export function isExpired(exception, today) {
  return nonEmptyString(exception?.expires) && exception.expires < today;
}
