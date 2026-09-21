// Regression tests for scripts/ci-coverage.mjs's discoverManifests (round-5/6
// QA finding F5). Uses a real temporary git repository with staged files,
// per the review's own instruction: "ignoring an untracked manifest is
// expected under the new tracked-only contract" - these tests confirm that
// is exactly what happens, and that nothing else slips through.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { discoverManifests } from '../scripts/ci-coverage.mjs';

function makeTempRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'ci-coverage-inventory-'));
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'Test'], { cwd: dir });
  return dir;
}

function stageAndCommit(dir, files) {
  for (const [relPath, content] of Object.entries(files)) {
    const full = join(dir, relPath);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, content);
  }
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', 'fixture'], { cwd: dir });
}

test('discoverManifests sees a tracked package.json in an ordinary directory', () => {
  const dir = makeTempRepo();
  try {
    stageAndCommit(dir, { 'my-app/package.json': '{}' });
    assert.deepEqual(discoverManifests(dir), ['my-app']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('discoverManifests ignores an UNTRACKED package.json (staged-only contract, not a gap)', () => {
  const dir = makeTempRepo();
  try {
    stageAndCommit(dir, { 'committed-app/package.json': '{}' });
    // Write a second manifest but deliberately do not `git add` it.
    mkdirSync(join(dir, 'untracked-app'), { recursive: true });
    writeFileSync(join(dir, 'untracked-app', 'package.json'), '{}');
    assert.deepEqual(discoverManifests(dir), ['committed-app']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('discoverManifests sees a tracked manifest under a dot-prefixed directory (old skip-list would have hidden this)', () => {
  const dir = makeTempRepo();
  try {
    stageAndCommit(dir, { '.hidden-app/package.json': '{}' });
    assert.deepEqual(discoverManifests(dir), ['.hidden-app']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('discoverManifests sees tracked source under a directory literally named "build" (old name-based skip-list would have hidden this)', () => {
  const dir = makeTempRepo();
  try {
    stageAndCommit(dir, { 'build/package.json': '{}' });
    assert.deepEqual(discoverManifests(dir), ['build']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('discoverManifests sees tracked source under a directory literally named "dist"', () => {
  const dir = makeTempRepo();
  try {
    stageAndCommit(dir, { 'dist/package.json': '{}' });
    assert.deepEqual(discoverManifests(dir), ['dist']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('discoverManifests excludes node_modules categorically, even if tracked (this repo\'s own workflow-orchestration/node_modules - see #1303)', () => {
  const dir = makeTempRepo();
  try {
    stageAndCommit(dir, {
      'my-app/package.json': '{}',
      'my-app/node_modules/some-dep/package.json': '{}',
    });
    assert.deepEqual(discoverManifests(dir), ['my-app']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('discoverManifests handles a root-level package.json as "."', () => {
  const dir = makeTempRepo();
  try {
    stageAndCommit(dir, { 'package.json': '{}' });
    assert.deepEqual(discoverManifests(dir), ['.']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('discoverManifests handles a path containing spaces', () => {
  const dir = makeTempRepo();
  try {
    stageAndCommit(dir, { 'My App Name/sub dir/package.json': '{}' });
    assert.deepEqual(discoverManifests(dir), ['My App Name/sub dir']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('discoverManifests against the real repo finds no untracked or node_modules manifests', () => {
  // Sanity check against the actual repo, not a fixture: every result must
  // be a real directory, and none may contain a node_modules segment.
  const repoRoot = new URL('..', import.meta.url).pathname;
  const found = discoverManifests(repoRoot);
  assert.ok(found.length > 15, `expected a substantial number of manifests, got ${found.length}`);
  for (const p of found) {
    assert.ok(!p.split('/').includes('node_modules'), `${p} should not contain node_modules`);
  }
});
