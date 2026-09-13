import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildWavePlan, validateWavePlan, compatibilityNavigation } from '../scripts/lib/migration-wave.mjs';

test('metadata regeneration preserves executed dependencies while canonicalizing paths', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'migration-metadata-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const destination = name => `domains/delivery/legacy/${name}.md`;
  const moves = ['a', 'b', 'c'].map(name => ({
    source: `legacy/${name}.md`, destination: destination(name),
    action: name === 'c' ? 'planned-move-not-executed' : 'executed-move-with-legacy-pointer',
    dependencies: name === 'b' ? ['legacy/a.md'] : [],
    affected_internal_references: []
  }));
  const mappings = moves.map(move => ({
    path: move.action === 'planned-move-not-executed' ? move.source : move.destination,
    domain: { primary: 'Delivery', secondary: [] }
  }));
  for (const mapping of mappings) {
    const file = path.join(root, mapping.path);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '# Fixture\n');
  }
  fs.mkdirSync(path.join(root, 'meta'), { recursive: true });
  fs.mkdirSync(path.join(root, 'templates'), { recursive: true });
  const writeJson = (file, data) => fs.writeFileSync(path.join(root, file), JSON.stringify(data));
  writeJson('meta/migration-inventory.json', { generated: '2026-09-12', moves });
  writeJson('meta/domain-mapping.json', { mappings });
  writeJson('templates/templates.json', { templates: mappings.map(mapping => ({
    path: mapping.path, relatedTemplates: [{ path: 'legacy/a.md' }, { path: 'legacy/c.md' }]
  })) });
  const generator = fileURLToPath(new URL('../scripts/generate-sprint-10-metadata.mjs', import.meta.url));
  execFileSync(process.execPath, [generator], { cwd: root });
  const inventoryPath = path.join(root, 'meta/migration-inventory.json');
  const first = fs.readFileSync(inventoryPath, 'utf8');
  const generated = JSON.parse(first).moves;
  assert.deepEqual(generated[0].dependencies, []);
  assert.deepEqual(generated[1].dependencies, [destination('a')]);
  assert.deepEqual(generated[2].dependencies, [destination('a'), 'legacy/c.md']);
  execFileSync(process.execPath, [generator], { cwd: root });
  const regenerated = JSON.parse(fs.readFileSync(inventoryPath, 'utf8')).moves;
  assert.deepEqual(regenerated.map(move => move.dependencies), generated.map(move => move.dependencies));
});

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
  move.execution = { batch_id: 'B1F', pre_batch_sha: plan.pre_batch_sha, pre_move_source_sha256: plan.assets.find(asset => asset.source === move.source).pre_move_sha256 };
  plan.phase = 'executed';
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
  move.execution.pre_batch_sha = '0'.repeat(40);
  move.execution.pre_move_source_sha256 = '0'.repeat(64);
  const errors = validateWavePlan({ root, inventory, plan }).join('\n');
  assert.match(errors, /execution checkpoint mismatch/);
  assert.match(errors, /execution source hash mismatch/);
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
    move.execution = { batch_id: 'B1F', pre_batch_sha: plan.pre_batch_sha, pre_move_source_sha256: plan.assets.find(asset => asset.source === move.source).pre_move_sha256 };
  }
  inventory.moves[1].dependencies = [inventory.moves[0].destination];
  plan.phase = 'executed';
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
});

test('validates immutable deferred dependency evidence after a later wave executes', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  inventory.moves[0].batch = 2;
  inventory.moves[1].dependencies = ['legacy/a.md'];
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  const selected = inventory.moves[1];
  fs.mkdirSync(path.dirname(path.join(root, selected.destination)), { recursive: true });
  fs.renameSync(path.join(root, selected.source), path.join(root, selected.destination));
  fs.writeFileSync(path.join(root, selected.source), '# Moved\n\nCanonical location: [B](../domains/stakeholder/legacy/b.md)\n');
  selected.action = 'executed-move-with-legacy-pointer';
  selected.execution = { batch_id: 'B1F', pre_batch_sha: plan.pre_batch_sha, pre_move_source_sha256: plan.assets.find(asset => asset.source === selected.source).pre_move_sha256 };
  plan.phase = 'executed';

  const later = inventory.moves[0];
  fs.mkdirSync(path.dirname(path.join(root, later.destination)), { recursive: true });
  fs.renameSync(path.join(root, later.source), path.join(root, later.destination));
  fs.writeFileSync(path.join(root, later.source), '# Moved\n\nCanonical location: [A](../domains/stakeholder/legacy/a.md)\n');
  later.action = 'executed-move-with-legacy-pointer';
  later.execution = { batch_id: 'B2A' };
  selected.dependencies = [later.destination];

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
  move.execution = { batch_id: 'B1F', pre_batch_sha: plan.pre_batch_sha, pre_move_source_sha256: plan.assets.find(asset => asset.source === move.source).pre_move_sha256 };
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

test('stops before a dependency cycle that would cross the wave limit', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  fs.writeFileSync(path.join(root, 'legacy/c.md'), '# C\n');
  inventory.moves[1].dependencies = ['legacy/c.md'];
  inventory.moves.push({
    source: 'legacy/c.md',
    destination: 'domains/stakeholder/legacy/c.md',
    primary_domain: 'Stakeholder',
    secondary_domains: [],
    dependencies: ['legacy/b.md'],
    batch: 1,
    legacy_strategy: 'pointer',
    action: 'planned-move-not-executed'
  });

  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 2, preBatchSha, rollbackOwner: 'owner' });
  assert.equal(plan.asset_count, 1);
  assert.deepEqual(plan.assets.map(asset => asset.source), ['legacy/a.md']);
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
});

test('rejects a manifest that splits a dependency cycle', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  fs.writeFileSync(path.join(root, 'legacy/c.md'), '# C\n');
  inventory.moves[1].dependencies = ['legacy/c.md'];
  inventory.moves.push({
    source: 'legacy/c.md',
    destination: 'domains/stakeholder/legacy/c.md',
    primary_domain: 'Stakeholder',
    secondary_domains: [],
    dependencies: ['legacy/b.md'],
    batch: 1,
    legacy_strategy: 'pointer',
    action: 'planned-move-not-executed'
  });

  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 3, preBatchSha, rollbackOwner: 'owner' });
  plan.assets = plan.assets.filter(asset => asset.source !== 'legacy/c.md');
  plan.asset_count = plan.assets.length;
  const errors = validateWavePlan({ root, inventory, plan }).join('\n');
  assert.match(errors, /wave splits dependency cycle/);
});

test('fails when the first atomic dependency cycle exceeds max-assets', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  inventory.moves[0].dependencies = ['legacy/b.md'];
  inventory.moves[1].dependencies = ['legacy/a.md'];
  assert.throws(
    () => buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, primaryDomain: 'Stakeholder', maxAssets: 1, preBatchSha, rollbackOwner: 'owner' }),
    /Next dependency cycle contains 2 assets, exceeding max-assets 1/
  );
});


test('replaces only checkpointed navigation and detects drift and forged evidence', t => {
  const { root, inventory } = fixture(t);
  const move = inventory.moves[0];
  const destination = path.join(root, move.destination);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const content = compatibilityNavigation('A', '../../../legacy/a.md');
  fs.writeFileSync(destination, content);
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync('git', ['commit', '-qm', 'navigation checkpoint'], { cwd: root });
  const preBatchSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
  fs.appendFileSync(destination, 'unexpected body');
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /replacement drift/);
  assert.throws(() => buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 1, preBatchSha, rollbackOwner: 'owner' }), /not verified compatibility/);
  fs.writeFileSync(destination, content);
  plan.assets[0].destination_replacement.sha256 = '0'.repeat(64);
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /invalid destination replacement evidence/);
  plan.assets[0].destination_replacement.sha256 = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 1, preBatchSha, rollbackOwner: 'owner' }).assets[0].destination_replacement.sha256;
  fs.copyFileSync(path.join(root, move.source), destination);
  fs.writeFileSync(path.join(root, move.source), '# Moved\nCanonical location: [A](../domains/stakeholder/legacy/a.md)\n');
  move.action = 'executed-move-with-legacy-pointer';
  move.execution = { batch_id: 'B1F', pre_batch_sha: plan.pre_batch_sha, pre_move_source_sha256: plan.assets.find(asset => asset.source === move.source).pre_move_sha256 };
  plan.phase = 'executed';
  assert.deepEqual(validateWavePlan({ root, inventory, plan }), []);
  delete plan.assets[0].destination_replacement;
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /requires replacement evidence/);
});

test('rejects wrong-target navigation, symlinks, and uncommitted replacement files', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const move = inventory.moves[0];
  const destination = path.join(root, move.destination);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const build = () => buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  fs.writeFileSync(destination, compatibilityNavigation('A', '../../../legacy/b.md'));
  assert.throws(build, /not verified compatibility/);
  fs.unlinkSync(destination);
  fs.symlinkSync(path.join(root, move.source), destination);
  assert.throws(build, /not verified compatibility/);
  fs.unlinkSync(destination);
  fs.symlinkSync(path.join(root, 'missing.md'), destination);
  assert.throws(build, /not verified compatibility/);
  fs.unlinkSync(destination);
  fs.writeFileSync(destination, compatibilityNavigation('A', '../../../legacy/a.md'));
  assert.match(validateWavePlan({ root, inventory, plan: build() }).join('\n'), /absent from checkpoint/);
});


test('anchors source hashes to the checkpoint before and after execution', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const move = inventory.moves[0];
  fs.appendFileSync(path.join(root, move.source), 'Uncommitted change\n');
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /checkpoint source hash mismatch/);
  fs.mkdirSync(path.dirname(path.join(root, move.destination)), { recursive: true });
  fs.renameSync(path.join(root, move.source), path.join(root, move.destination));
  fs.writeFileSync(path.join(root, move.source), '# Moved\nCanonical location: [A](../domains/stakeholder/legacy/a.md)\n');
  move.action = 'executed-move-with-legacy-pointer';
  move.execution = { batch_id: 'B1F', pre_batch_sha: plan.pre_batch_sha, pre_move_source_sha256: plan.assets.find(asset => asset.source === move.source).pre_move_sha256 };
  plan.phase = 'executed';
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /checkpoint source hash mismatch/);
});

test('rejects a source missing from the recorded checkpoint', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  inventory.moves[0].source = 'legacy/new.md';
  fs.writeFileSync(path.join(root, 'legacy/new.md'), '# New\n');
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 2, preBatchSha, rollbackOwner: 'owner' });
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /source is absent from checkpoint: legacy\/new.md/);
});

test('rejects executed symlinks even when their target has the correct body hash', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  const move = inventory.moves[0];
  const original = path.join(root, 'original.md');
  fs.renameSync(path.join(root, move.source), original);
  fs.mkdirSync(path.dirname(path.join(root, move.destination)), { recursive: true });
  fs.symlinkSync(original, path.join(root, move.destination));
  fs.writeFileSync(path.join(root, move.source), '# Moved\nCanonical location: [A](../domains/stakeholder/legacy/a.md)\n');
  move.action = 'executed-move-with-legacy-pointer';
  move.execution = { batch_id: 'B1F', pre_batch_sha: plan.pre_batch_sha, pre_move_source_sha256: plan.assets.find(asset => asset.source === move.source).pre_move_sha256 };
  plan.phase = 'executed';
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /executed destination is not a readable regular file/);
});


test('entry validation rejects a dangling destination introduced after planning', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  const destination = path.join(root, plan.assets[0].destination);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.symlinkSync(path.join(root, 'missing.md'), destination);
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /destination already exists/);
});

test('executed validation rejects symlink and directory legacy sources without throwing', t => {
  const { root, inventory, preBatchSha } = fixture(t);
  const plan = buildWavePlan({ root, inventory, waveId: 'B1F', sourceBatch: 1, maxAssets: 1, preBatchSha, rollbackOwner: 'owner' });
  const move = inventory.moves[0];
  const source = path.join(root, move.source);
  const destination = path.join(root, move.destination);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.renameSync(source, destination);
  const navigation = path.join(root, 'navigation.md');
  fs.writeFileSync(navigation, '# Moved\nCanonical location: [A](../domains/stakeholder/legacy/a.md)\n');
  fs.symlinkSync(navigation, source);
  move.action = 'executed-move-with-legacy-pointer';
  move.execution = { batch_id: 'B1F', pre_batch_sha: plan.pre_batch_sha, pre_move_source_sha256: plan.assets[0].pre_move_sha256 };
  plan.phase = 'executed';
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /legacy source is not a readable regular file/);
  fs.unlinkSync(source);
  fs.mkdirSync(source);
  assert.match(validateWavePlan({ root, inventory, plan }).join('\n'), /legacy source is not a readable regular file/);
});
