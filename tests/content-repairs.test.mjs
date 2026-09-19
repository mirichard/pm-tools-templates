import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { loadContentRepairs, contentHashMatches } from '../scripts/lib/content-repairs.mjs';

const hash = value => crypto.createHash('sha256').update(value).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'content-repairs-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'meta'));
  const inventory = { moves: [{ destination: 'domains/team/a.md', action: 'executed-move-with-legacy-pointer', execution: { pre_move_source_sha256: hash('original') } }] };
  const record = { path: 'domains/team/a.md', original_sha256: hash('original'), current_sha256: hash('repaired'), base_commit: 'a'.repeat(40), reason: 'Repair broken reference' };
  const write = records => fs.writeFileSync(path.join(root, 'meta/content-repairs.json'), JSON.stringify({ version: 1, repairs: records }));
  return { root, inventory, record, write };
}

test('only the exact documented repaired body passes while original evidence stays fixed', t => {
  const f = fixture(t); f.write([f.record]);
  const repairs = loadContentRepairs(f.root, f.inventory);
  assert.ok(contentHashMatches('repaired', f.record.path, hash('original'), repairs));
  assert.equal(contentHashMatches('tampered', f.record.path, hash('original'), repairs), false);
  assert.equal(contentHashMatches('original', f.record.path, hash('original'), repairs), false);
  assert.equal(contentHashMatches('repaired', f.record.path, hash('forged'), repairs), false);
  assert.equal(f.inventory.moves[0].execution.pre_move_source_sha256, hash('original'));
});

test('forged original hashes, missing reasons, unknown paths and duplicates fail closed', t => {
  const f = fixture(t);
  for (const records of [[{ ...f.record, original_sha256: hash('forged') }], [{ ...f.record, reason: '' }], [{ ...f.record, path: 'unknown.md' }], [f.record, f.record]]) {
    f.write(records);
    assert.throws(() => loadContentRepairs(f.root, f.inventory));
  }
});

test('unrepaired assets still require their original bytes', t => {
  const f = fixture(t);
  const repairs = loadContentRepairs(f.root, f.inventory);
  assert.ok(contentHashMatches('original', f.record.path, hash('original'), repairs));
  assert.equal(contentHashMatches('edited', f.record.path, hash('original'), repairs), false);
});
