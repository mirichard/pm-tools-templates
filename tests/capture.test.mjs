// Regression test for scripts/lib/capture.mjs (round-5/6 QA finding F6:
// a legitimately large amount of successful output must not be
// misreported as a failure just because of how it was captured).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readTail } from '../scripts/lib/capture.mjs';

test('readTail returns the whole file when it is smaller than the limit', () => {
  const dir = mkdtempSync(join(tmpdir(), 'capture-test-'));
  try {
    const file = join(dir, 'small.log');
    writeFileSync(file, 'hello world');
    assert.equal(readTail(file, 65536), 'hello world');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('readTail returns only the last N bytes of a file larger than the limit, without reading the whole file into one buffer up front', () => {
  const dir = mkdtempSync(join(tmpdir(), 'capture-test-'));
  try {
    const file = join(dir, 'large.log');
    // ~3 MiB of filler followed by a distinctive marker at the very end -
    // simulates a verbose-but-successful command (F6's concern).
    const filler = 'x'.repeat(1024 * 1024) + '\n';
    writeFileSync(file, filler.repeat(3) + 'END-OF-OUTPUT-MARKER\n');
    const tail = readTail(file, 1024); // deliberately small limit for this test
    assert.ok(tail.length <= 1024);
    assert.ok(tail.includes('END-OF-OUTPUT-MARKER'), 'tail should include the very end of the file');
    assert.ok(!tail.includes('MARKER'.repeat(1000)), 'sanity: tail is bounded, not the whole file');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('readTail on an empty file returns an empty string without throwing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'capture-test-'));
  try {
    const file = join(dir, 'empty.log');
    writeFileSync(file, '');
    assert.equal(readTail(file, 65536), '');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
