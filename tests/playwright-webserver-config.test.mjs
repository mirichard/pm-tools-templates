// Structural regression test for demo/288 and demos/288-template-
// customization's playwright.config.ts (round-6 QA finding F4: neither app
// had any server-startup mechanism, and demo/288's test files read a
// BASE_URL that didn't match its own preview port).
//
// This does NOT launch a real browser or start a real server - that would
// require Chromium + a full build in this test run, which is disproportionate
// for a unit-test suite. It checks the structural properties that caused the
// original bug: a webServer block exists, its port matches what the app's
// own preview script and (where relevant) BASE_URL actually use, and
// reuseExistingServer is disabled under CI. A genuine browser-launch
// failure is exercised by the real sub-app-checks CI job for these two
// apps, not by this file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoRoot = new URL('..', import.meta.url).pathname;

function readConfig(relPath) {
  return readFileSync(join(repoRoot, relPath, 'playwright.config.ts'), 'utf8');
}

test('demo/288 playwright.config.ts has a webServer on port 5179 (matching its own preview script), not the old BASE_URL fallback of 5181', () => {
  const config = readConfig('demo/288');
  assert.match(config, /webServer/);
  assert.match(config, /port:\s*5179/);
  // The literal comment explaining *why* 5179 was chosen over the old 5181
  // fallback is fine to keep; what must not exist is 5181 as an actual
  // configured value anywhere (a `port:`/`baseURL:` line).
  assert.doesNotMatch(config, /port:\s*5181/);
  assert.doesNotMatch(config, /baseURL:.*5181/);
  assert.match(config, /reuseExistingServer:\s*!process\.env\.CI/);
});

test('demos/288-template-customization playwright.config.ts has a webServer on port 5179', () => {
  const config = readConfig('demos/288-template-customization');
  assert.match(config, /webServer/);
  assert.match(config, /port:\s*5179/);
  assert.match(config, /reuseExistingServer:\s*!process\.env\.CI/);
});

test('demo/288 preview script and playwright config agree on port 5179', () => {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'demo/288/package.json'), 'utf8'));
  assert.match(pkg.scripts.preview, /--port 5179/);
});

test('demos/288-template-customization preview script and playwright config agree on port 5179', () => {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'demos/288-template-customization/package.json'), 'utf8'));
  assert.match(pkg.scripts.preview, /--port 5179/);
});

test('ci-coverage.json sets BASE_URL for demo-288 (whose test files read that env var) but not for demos-288-template-customization (whose test files hardcode the correct port already)', () => {
  const coverage = JSON.parse(readFileSync(join(repoRoot, '.github/ci-coverage.json'), 'utf8'));
  assert.equal(coverage.apps['demo-288'].checks.test.env.BASE_URL, 'http://127.0.0.1:5179/');
  assert.equal(coverage.apps['demos-288-template-customization'].checks.test.env, undefined);
});
