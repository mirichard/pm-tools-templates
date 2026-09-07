import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { buildWavePlan, validateWavePlan } from '../scripts/lib/migration-wave.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'migration-wave-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
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
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['config', 'user.email', 'migration-wave-test@example.invalid'], { cwd: root });
  execFileSync('git', ['config', 'user.name', 'Migration Wave Test'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync('git', ['commit', '-qm', 'fixture'], { cwd: root });
  const preBatchSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  return { root, inventory, preBatchSha };
}

test('builds and validates a deterministic dependency-aware wave', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha, rollbackOwner: 'owner' });
  assert.equal(plan.asset_count, 2);
  assert.equal(plan.assets[0].source, 'legacy/a.md');
  assert.equal(plan.assets[1].dependencies[0].status, 'same-wave');
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
});

test('rejects wave sizes above the safety ceiling', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  assert.throws(() => buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 16, preBatchSha, rollbackOwner: 'owner' }), /between 1 and 15/);
});

test('detects source drift after the plan is generated', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha, rollbackOwner: 'owner' });
  fs.appendFileSync(path.join(root, 'legacy/a.md'), 'changed\n');
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /source hash mismatch/);
});

test('detects inventory snapshot drift after the plan is generated', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha, rollbackOwner: 'owner' });
  inventory.generated = '2026-09-08';
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /inventory_generated does not match migration inventory snapshot/);
});

test('validates the same manifest after an executed move', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  const move = inventory.moves[0];
  fs.mkdirSync(path.join(root, 'domains/stakeholder/legacy'), { recursive: true });
  fs.renameSync(path.join(root, move.source), path.join(root, move.destination));
  fs.writeFileSync(path.join(root, move.source), '# Moved\n\nCanonical location: [A](../domains/stakeholder/legacy/a.md)\n');
  move.action = 'executed-move-with-legacy-pointer';
  move.execution = { batch_id: 'B1F' };
  plan.phase = 'executed';
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
});

test('validates immutable same-wave dependency evidence after inventory paths normalize', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 2, preBatchSha, rollbackOwner: 'owner' });
  for (const move of inventory.moves) {
    fs.mkdirSync(path.dirname(path.join(root, move.destination)), { recursive: true });
    fs.renameSync(path.join(root, move.source), path.join(root, move.destination));
    const pointer = path.relative(path.dirname(move.source), move.destination).replaceAll('\\', '/');
    fs.mkdirSync(path.dirname(path.join(root, move.source)), { recursive: true });
    fs.writeFileSync(path.join(root, move.source), `# Moved\n\nCanonical location: [template](${pointer})\n`);
    move.action = 'executed-move-with-legacy-pointer';
    move.execution = { batch_id: 'B1F' };
  }
  inventory.moves[1].dependencies = [inventory.moves[0].destination];
  plan.phase = 'executed';
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
});

test('validates canonical location link when other links exist', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  const move = inventory.moves[0];
  fs.mkdirSync(path.join(root, 'domains/stakeholder/legacy'), { recursive: true });
  fs.renameSync(path.join(root, move.source), path.join(root, move.destination));
  fs.writeFileSync(
    path.join(root, move.source),
    '# Moved\n\n[Other](./README.md)\n\n**Canonical location:** [A](<../domains/stakeholder/legacy/a.md#section>)\n'
  );
  move.action = 'executed-move-with-legacy-pointer';
  move.execution = { batch_id: 'B1F' };
  plan.phase = 'executed';
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
});

test('rejects a fabricated rollback checkpoint commit', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha, rollbackOwner: 'owner' });
  plan.pre_batch_sha = 'f'.repeat(40);
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /does not resolve to a commit/);
});

test('rejects a rollback checkpoint outside the current history', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha, rollbackOwner: 'owner' });
  const emptyTree = execFileSync('git', ['mktree'], { cwd: root, input: '', encoding: 'utf8' }).trim();
  plan.pre_batch_sha = execFileSync('git', ['commit-tree', emptyTree, '-m', 'unrelated'], { cwd: root, encoding: 'utf8' }).trim();
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /is not an ancestor of HEAD/);
});

test('rejects incomplete checkpoints and rollback controls', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha, rollbackOwner: 'owner' });
  plan.checkpoints = [];
  plan.rollback.granularity = 'asset';
  const errors = validateWavePlan({ root, inventory, plan }).join('\n');
  assert.match(errors, /complete ordered checkpoint set/);
  assert.match(errors, /rollback granularity must be wave/);
});

test('rejects altered dependency status and resolved path', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 12, preBatchSha, rollbackOwner: 'owner' });
  plan.assets[1].dependencies[0].status = 'satisfied-existing-deferred';
  plan.assets[1].dependencies[0].resolved_path = plan.assets[1].dependencies[0].path;
  const errors = validateWavePlan({ root, inventory, plan }).join('\n');
  assert.match(errors, /dependency status mismatch/);
  assert.match(errors, /dependency resolved path mismatch/);
});
