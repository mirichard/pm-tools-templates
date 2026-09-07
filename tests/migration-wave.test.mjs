import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildWavePlan, validateWavePlan } from '../scripts/lib/migration-wave.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'migration-wave-'));
  fs.mkdirSync(path.join(root, 'legacy'), { recursive: true });
  fs.writeFileSync(path.join(root, 'legacy/a.md'), '# A\n');
  fs.writeFileSync(path.join(root, 'legacy/b.md'), '# B\n');
  const inventory = {
    generated: '2026-09-07',
    moves: [
      { source: 'legacy/a.md', destination: 'domains/stakeholder/legacy/a.md', primary_domain: 'Stakeholder', secondary_domains: [], dependencies: [], batch: 1, legacy_strategy: 'pointer', action: 'planned-move-not-executed' },
      { source: 'legacy/b.md', destination: 'domains/stakeholder/legacy/b.md', primary_domain: 'Stakeholder', secondary_domains: [], dependencies: ['legacy/a.md'], batch: 1, legacy_strategy: 'pointer', action: 'planned-move-not-executed' }
    ]
  };
  return { root, inventory };
}

test('builds and validates a deterministic dependency-aware wave', () => {
  const { root, inventory } = fixture();
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha: 'a'.repeat(40), rollbackOwner: 'owner' });
  assert.equal(plan.asset_count, 2);
  assert.equal(plan.assets[0].source, 'legacy/a.md');
  assert.equal(plan.assets[1].dependencies[0].status, 'same-wave');
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
});

test('rejects wave sizes above the safety ceiling', () => {
  const { root, inventory } = fixture();
  assert.throws(() => buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 16, preBatchSha: 'a'.repeat(40), rollbackOwner: 'owner' }), /between 1 and 15/);
});

test('detects source drift after the plan is generated', () => {
  const { root, inventory } = fixture();
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha: 'a'.repeat(40), rollbackOwner: 'owner' });
  fs.appendFileSync(path.join(root, 'legacy/a.md'), 'changed\n');
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /source hash mismatch/);
});

test('detects inventory snapshot drift after the plan is generated', () => {
  const { root, inventory } = fixture();
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha: 'a'.repeat(40), rollbackOwner: 'owner' });
  inventory.generated = '2026-09-08';
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /inventory_generated does not match migration inventory snapshot/);
});

test('validates the same manifest after an executed move', () => {
  const { root, inventory } = fixture();
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 1, preBatchSha: 'a'.repeat(40), rollbackOwner: 'owner' });
  const move = inventory.moves[0];
  fs.mkdirSync(path.join(root, 'domains/stakeholder/legacy'), { recursive: true });
  fs.renameSync(path.join(root, move.source), path.join(root, move.destination));
  fs.writeFileSync(path.join(root, move.source), '# Moved\n\n[Canonical location](../domains/stakeholder/legacy/a.md)\n');
  move.action = 'executed-move-with-legacy-pointer';
  move.execution = { batch_id: 'B1F' };
  plan.phase = 'executed';
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
});
