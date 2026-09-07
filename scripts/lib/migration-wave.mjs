import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const MAX_WAVE_ASSETS = 15;
export const DEFAULT_WAVE_ASSETS = 12;

export function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

export function classifyDependency(root, dependency, inventoryByPath, selectedPaths) {
  const linked = inventoryByPath.get(dependency);
  if (linked?.action === 'executed-move-with-legacy-pointer') {
    return { path: dependency, status: 'satisfied-executed', resolved_path: linked.destination };
  }
  if (linked && (selectedPaths.has(linked.source) || selectedPaths.has(linked.destination))) {
    return { path: dependency, status: 'same-wave', resolved_path: linked.destination };
  }
  if (fs.existsSync(path.join(root, dependency))) {
    return { path: dependency, status: 'satisfied-existing-deferred', resolved_path: dependency };
  }
  return { path: dependency, status: 'blocked-missing', resolved_path: dependency };
}

function dependencyOrder(moves) {
  const selectedByPath = new Map(moves.flatMap(move => [[move.source, move], [move.destination, move]]));
  const remaining = new Set(moves);
  const ordered = [];
  while (remaining.size > 0) {
    const ready = [...remaining]
      .filter(move => (move.dependencies || []).every(dependency => {
        const prerequisite = selectedByPath.get(dependency);
        return !prerequisite || !remaining.has(prerequisite);
      }))
      .sort((a, b) => a.source.localeCompare(b.source));
    // A cycle can be migrated atomically in one wave. Break it deterministically
    // while retaining explicit same-wave dependency classifications.
    const next = ready[0] || [...remaining].sort((a, b) => a.source.localeCompare(b.source))[0];
    ordered.push(next);
    remaining.delete(next);
  }
  return ordered;
}

export function buildWavePlan({
  root,
  inventory,
  waveId,
  sourceBatch,
  primaryDomain,
  maxAssets = DEFAULT_WAVE_ASSETS,
  preBatchSha,
  rollbackOwner
}) {
  if (!Number.isInteger(maxAssets) || maxAssets < 1 || maxAssets > MAX_WAVE_ASSETS) {
    throw new Error(`max-assets must be between 1 and ${MAX_WAVE_ASSETS}`);
  }

  const candidates = inventory.moves
    .filter(move => move.action === 'planned-move-not-executed')
    .filter(move => move.batch === sourceBatch)
    .filter(move => !primaryDomain || move.primary_domain === primaryDomain)
    .sort((a, b) => a.source.localeCompare(b.source));

  if (candidates.length === 0) throw new Error('No planned moves match the requested batch/domain');
  const selected = dependencyOrder(candidates.slice(0, maxAssets));
  const selectedPaths = new Set(selected.flatMap(move => [move.source, move.destination]));
  const inventoryByPath = new Map(inventory.moves.flatMap(move => [[move.source, move], [move.destination, move]]));

  const assets = selected.map((move, index) => ({
    order: index + 1,
    source: move.source,
    destination: move.destination,
    primary_domain: move.primary_domain,
    secondary_domains: move.secondary_domains || [],
    pre_move_sha256: sha256File(path.join(root, move.source)),
    dependencies: (move.dependencies || []).map(dependency =>
      classifyDependency(root, dependency, inventoryByPath, selectedPaths)
    ),
    legacy_strategy: move.legacy_strategy
  }));

  const blocked = assets.flatMap(asset => asset.dependencies.filter(item => item.status === 'blocked-missing'));
  if (blocked.length > 0) {
    throw new Error(`Wave contains missing dependencies: ${blocked.map(item => item.path).join(', ')}`);
  }

  return {
    schema_version: 1,
    wave_id: waveId,
    phase: 'entry',
    source_batch: sourceBatch,
    primary_domain: primaryDomain || 'mixed',
    generated_from: 'meta/migration-inventory.json',
    inventory_generated: inventory.generated,
    pre_batch_sha: preBatchSha,
    rollback_owner: rollbackOwner,
    max_assets: maxAssets,
    asset_count: assets.length,
    assets,
    checkpoints: [
      'baseline-and-hashes',
      'canonical-moves',
      'legacy-pointers',
      'canonical-references',
      'affected-scope-validation',
      'reviewed-visual-regression',
      'post-merge-verification'
    ],
    validation_commands: [
      'node scripts/validate-migration-wave.mjs --manifest <manifest>',
      'node scripts/generate-sprint-10-metadata.mjs',
      'node scripts/validate-sprint-10.mjs --require-annotations',
      'node scripts/validate-curated-templates.js',
      'node scripts/validate-canonical-paths.js --strict',
      'python3 scripts/check_anchor_links_filtered.py',
      'npm run test:ci'
    ],
    rollback: {
      strategy: 'revert-wave-merge-commit',
      command: 'git revert <wave-merge-sha>',
      granularity: 'wave',
      asset_hashes_preserved: true
    }
  };
}

export function validateWavePlan({ root, inventory, plan }) {
  const errors = [];
  const fail = message => errors.push(message);
  if (plan.schema_version !== 1) fail('schema_version must be 1');
  if (!['entry', 'executed'].includes(plan.phase)) fail('phase must be entry or executed');
  if (!/^B\d+[A-Z]+$/.test(plan.wave_id || '')) fail('wave_id must look like B1F');
  if (!Number.isInteger(plan.max_assets) || plan.max_assets < 1 || plan.max_assets > MAX_WAVE_ASSETS) {
    fail(`max_assets must be between 1 and ${MAX_WAVE_ASSETS}`);
  }
  if (!Array.isArray(plan.assets) || plan.assets.length === 0) fail('assets must be a non-empty array');
  if (plan.assets?.length > plan.max_assets) fail('asset count exceeds max_assets');
  if (plan.asset_count !== plan.assets?.length) fail('asset_count does not match assets length');
  if (!/^[0-9a-f]{40}$/.test(plan.pre_batch_sha || '')) fail('pre_batch_sha must be a 40-character Git SHA');
  if (!plan.rollback_owner) fail('rollback_owner is required');
  if (plan.rollback?.command !== 'git revert <wave-merge-sha>') fail('rollback command is missing or unsupported');

  const bySource = new Map(inventory.moves.map(move => [move.source, move]));
  const sources = new Set();
  const destinations = new Set();
  for (const asset of plan.assets || []) {
    if (sources.has(asset.source)) fail(`duplicate source: ${asset.source}`);
    if (destinations.has(asset.destination)) fail(`duplicate destination: ${asset.destination}`);
    sources.add(asset.source);
    destinations.add(asset.destination);
    const move = bySource.get(asset.source);
    if (!move) {
      fail(`source is absent from migration inventory: ${asset.source}`);
      continue;
    }
    const expectedAction = plan.phase === 'executed'
      ? 'executed-move-with-legacy-pointer'
      : 'planned-move-not-executed';
    if (move.action !== expectedAction) fail(`source action does not match ${plan.phase} phase: ${asset.source}`);
    if (move.destination !== asset.destination) fail(`destination mismatch: ${asset.source}`);
    if (move.batch !== plan.source_batch) fail(`source batch mismatch: ${asset.source}`);
    if (plan.primary_domain !== 'mixed' && move.primary_domain !== plan.primary_domain) {
      fail(`primary domain mismatch: ${asset.source}`);
    }
    const sourcePath = path.join(root, asset.source);
    const destinationPath = path.join(root, asset.destination);
    if (!fs.existsSync(sourcePath)) fail(`source does not exist: ${asset.source}`);
    if (plan.phase === 'entry') {
      if (fs.existsSync(sourcePath) && sha256File(sourcePath) !== asset.pre_move_sha256) fail(`source hash mismatch: ${asset.source}`);
      if (fs.existsSync(destinationPath)) fail(`destination already exists: ${asset.destination}`);
    } else {
      if (!fs.existsSync(destinationPath)) fail(`executed destination does not exist: ${asset.destination}`);
      else if (sha256File(destinationPath) !== asset.pre_move_sha256) fail(`destination hash mismatch: ${asset.destination}`);
      if (move.execution?.batch_id !== plan.wave_id) fail(`execution batch_id mismatch: ${asset.source}`);
      if (fs.existsSync(sourcePath)) {
        const pointer = fs.readFileSync(sourcePath, 'utf8').match(/\[[^\]]+\]\(([^)]+)\)/);
        if (!pointer) fail(`legacy pointer is missing: ${asset.source}`);
        else {
          const resolved = path.resolve(path.dirname(sourcePath), pointer[1].split('#')[0]);
          if (resolved !== destinationPath) fail(`legacy pointer does not resolve to destination: ${asset.source}`);
        }
      }
    }
    for (const dependency of asset.dependencies || []) {
      if (dependency.status === 'blocked-missing') fail(`missing dependency: ${dependency.path}`);
    }
  }
  return errors;
}
