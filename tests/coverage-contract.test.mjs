// Regression tests for scripts/lib/coverage-contract.mjs (round-5/6 QA
// findings F1/F2). Run via `node --test tests/coverage-contract.test.mjs`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateExceptionObject,
  validateCheckObject,
  validateContract,
  evaluateCheckResult,
  isExpired,
} from '../scripts/lib/coverage-contract.mjs';

const VALID_WAIVER = {
  type: 'waiver',
  execution: 'diagnostic-only',
  scope_statement: 'the tool cannot run at all',
  issue: 'https://github.com/mirichard/pm-tools-templates/issues/1292',
  owner: 'mirichard',
  recorded: '2026-09-21',
  expires: '2026-12-21',
  failure_signature: 'boom',
  removal_condition: 'fix the root cause',
};

test('validateExceptionObject rejects the exact prior-review fixture (only failure_signature set)', () => {
  const problems = validateExceptionObject({ failure_signature: 'x' }, 'app/check');
  assert.ok(problems.length >= 6, `expected several problems, got ${problems.length}`);
  assert.ok(problems.some((p) => p.includes('exception.issue')));
  assert.ok(problems.some((p) => p.includes('exception.owner')));
  assert.ok(problems.some((p) => p.includes('exception.expires')));
});

test('validateExceptionObject accepts a well-formed waiver', () => {
  assert.deepEqual(validateExceptionObject(VALID_WAIVER, 'app/check'), []);
});

test('validateExceptionObject rejects expires before recorded', () => {
  const problems = validateExceptionObject({ ...VALID_WAIVER, expires: '2020-01-01' }, 'app/check');
  assert.ok(problems.some((p) => p.includes('must be after')));
});

test('validateExceptionObject rejects a malformed date', () => {
  const problems = validateExceptionObject({ ...VALID_WAIVER, expires: '12/21/2026' }, 'app/check');
  assert.ok(problems.some((p) => p.includes('exception.expires')));
});

test('validateExceptionObject requires signature-type to have a non-empty permitted_failures set', () => {
  const problems = validateExceptionObject({
    ...VALID_WAIVER, type: 'signature', permitted_failures: [],
  }, 'app/check');
  assert.ok(problems.some((p) => p.includes('permitted_failures')));
});

test('validateCheckObject treats the audit check specially (no command field required)', () => {
  assert.deepEqual(validateCheckObject({ required: true }, 'apps.x.checks.audit', 'audit'), []);
});

test('validateCheckObject requires command shape for non-audit checks', () => {
  const problems = validateCheckObject({ required: true }, 'apps.x.checks.lint', 'lint');
  assert.ok(problems.some((p) => p.includes('command')));
});

test('validateContract passes for a minimal well-formed contract', () => {
  const contract = {
    node_version: '24',
    shared_paths: ['x'],
    apps: {
      demo: {
        path: 'demo',
        checks: {
          lint: { command: null, required: false, status: 'not_implemented' },
          build: { command: null, required: false, status: 'not_implemented' },
          test: { command: 'npm test', required: true },
          audit: { required: true },
        },
      },
    },
    covered_elsewhere: [],
    excluded: [],
  };
  assert.deepEqual(validateContract(contract), []);
});

test('validateContract catches a duplicate path across apps and excluded', () => {
  const contract = {
    node_version: '24',
    shared_paths: ['x'],
    apps: {
      demo: {
        path: 'demo',
        checks: {
          lint: { command: null, required: false, status: 'not_implemented' },
          build: { command: null, required: false, status: 'not_implemented' },
          test: { command: null, required: false, status: 'not_implemented' },
          audit: { required: true },
        },
      },
    },
    covered_elsewhere: [],
    excluded: [{ path: 'demo', reason: 'oops, duplicate' }],
  };
  const problems = validateContract(contract);
  assert.ok(problems.some((p) => p.includes('Duplicate path')));
});

test('evaluateCheckResult: passing command', () => {
  const result = evaluateCheckResult({}, { exitCode: 0, output: '' });
  assert.equal(result.outcome, 'passed');
});

test('evaluateCheckResult: failure with no exception on record', () => {
  const result = evaluateCheckResult({}, { exitCode: 1, output: 'anything' });
  assert.equal(result.outcome, 'failed');
});

test('evaluateCheckResult: waiver matches its signature', () => {
  const check = { exception: VALID_WAIVER };
  const result = evaluateCheckResult(check, { exitCode: 1, output: 'a boom happened' });
  assert.equal(result.outcome, 'waived');
});

test('evaluateCheckResult: waiver does NOT match a different failure (F1 - a different failure is never the same waived issue)', () => {
  const check = { exception: VALID_WAIVER };
  const result = evaluateCheckResult(check, { exitCode: 1, output: 'a totally different crash' });
  assert.equal(result.outcome, 'failed');
});

test('evaluateCheckResult: process error is never tolerated, even with a matching signature in the output', () => {
  const check = { exception: VALID_WAIVER };
  const result = evaluateCheckResult(check, { exitCode: 1, output: 'boom', processError: 'ENOBUFS' });
  assert.equal(result.outcome, 'failed');
  assert.match(result.reason, /runner\/process error/);
});

test('evaluateCheckResult: signature type tolerates an exact permitted-failure-set match', () => {
  const check = {
    exception: {
      ...VALID_WAIVER,
      type: 'signature',
      permitted_failures: [{ testName: 'a', normalizedMessage: 'known issue' }],
    },
  };
  const result = evaluateCheckResult(
    check,
    { exitCode: 1, output: 'n/a' },
    [{ testName: 'a', normalizedMessage: 'known issue' }],
  );
  assert.equal(result.outcome, 'tolerated');
});

test('evaluateCheckResult: signature type rejects a mixed known+unrelated-new failure (round-5 QA reproduction)', () => {
  const check = {
    exception: {
      ...VALID_WAIVER,
      type: 'signature',
      permitted_failures: [{ testName: 'a', normalizedMessage: 'known issue' }],
    },
  };
  const result = evaluateCheckResult(
    check,
    { exitCode: 1, output: 'n/a' },
    [
      { testName: 'a', normalizedMessage: 'known issue' },
      { testName: 'b', normalizedMessage: 'brand new unrelated regression' },
    ],
  );
  assert.equal(result.outcome, 'failed');
  assert.match(result.reason, /unexpected failure|does not match permitted count/);
});

test('evaluateCheckResult: signature type rejects when a permitted failure is missing (fewer failures than expected is also a mismatch)', () => {
  const check = {
    exception: {
      ...VALID_WAIVER,
      type: 'signature',
      permitted_failures: [
        { testName: 'a', normalizedMessage: 'known issue' },
        { testName: 'b', normalizedMessage: 'also known' },
      ],
    },
  };
  const result = evaluateCheckResult(
    check,
    { exitCode: 1, output: 'n/a' },
    [{ testName: 'a', normalizedMessage: 'known issue' }],
  );
  assert.equal(result.outcome, 'failed');
});

test('isExpired: before and after the boundary date', () => {
  assert.equal(isExpired({ expires: '2026-12-21' }, '2026-09-21'), false);
  assert.equal(isExpired({ expires: '2020-01-01' }, '2026-09-21'), true);
  assert.equal(isExpired({ expires: '2026-09-21' }, '2026-09-21'), false); // expires ON today is not yet expired
});
