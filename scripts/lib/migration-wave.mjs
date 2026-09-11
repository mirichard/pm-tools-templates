import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const MAX_WAVE_ASSETS = 15;
export const DEFAULT_WAVE_ASSETS = 12;
export const REQUIRED_CHECKPOINTS = [
  'baseline-and-hashes',
  'canonical-moves',
  'legacy-pointers',
  'canonical-references',
  'affected-scope-validation',
  'reviewed-visual-regression',
  'post-merge-verification'
];

export function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

export function classifyDependency(root, dependency, inventoryByPath, selectedPaths) {
  const linked = inventoryByPath.get(dependency);
  if (linked && (selectedPaths.has(linked.source) || selectedPaths.has(linked.destination))) {
    return { path: dependency, status: 'same-wave', resolved_path: linked.destination };
  }
  if (linked?.action === 'executed-move-with-legacy-pointer') {
    return { path: dependency, status: 'satisfied-executed', resolved_path: linked.destination };
  }
  if (fs.existsSync(path.join(root, dependency))) {
    return { path: dependency, status: 'satisfied-existing-deferred', resolved_path: dependency };
  }
  return { path: dependency, status: 'blocked-missing', resolved_path: dependency };
}

function dependencyGraph(moves) {
  const byPath = new Map(moves.flatMap(move => [[move.source, move], [move.destination, move]]));
  return new Map(moves.map(move => [
    move.source,
    (move.dependencies || [])
      .map(dependency => byPath.get(dependency)?.source)
      .filter(Boolean)
  ]));
}

function stronglyConnectedComponents(moves) {
  const graph = dependencyGraph(moves);
  let nextIndex = 0;
  const indices = new Map();
  const lowLinks = new Map();
  const stack = [];
  const onStack = new Set();
  const components = [];

  function visit(source) {
    indices.set(source, nextIndex);
    lowLinks.set(source, nextIndex);
    nextIndex += 1;
    stack.push(source);
    onStack.add(source);

    for (const dependency of graph.get(source) || []) {
      if (!indices.has(dependency)) {
        visit(dependency);
        lowLinks.set(source, Math.min(lowLinks.get(source), lowLinks.get(dependency)));
      } else if (onStack.has(dependency)) {
        lowLinks.set(source, Math.min(lowLinks.get(source), indices.get(dependency)));
      }
    }

    if (lowLinks.get(source) === indices.get(source)) {
      const component = [];
      while (stack.length > 0) {
        const member = stack.pop();
        onStack.delete(member);
        component.push(member);
        if (member === source) break;
      }
      components.push(component.sort());
    }
  }

  for (const move of moves) {
    if (!indices.has(move.source)) visit(move.source);
  }
  return components;
}

function selectAtomicPrefix(candidates, maxAssets) {
  const components = stronglyConnectedComponents(candidates);
  const componentBySource = new Map();
  components.forEach((component, index) => {
    for (const source of component) componentBySource.set(source, index);
  });
  const bySource = new Map(candidates.map(move => [move.source, move]));
  const selectedSources = new Set();
  const selectedComponents = new Set();

  for (const move of candidates) {
    if (selectedSources.has(move.source)) continue;
    const componentIndex = componentBySource.get(move.source);
    if (selectedComponents.has(componentIndex)) continue;
    const component = components[componentIndex];
    if (selectedSources.size + component.length > maxAssets) break;
    selectedComponents.add(componentIndex);
    for (const source of component) selectedSources.add(source);
  }

  if (selectedSources.size === 0) {
    const first = candidates[0];
    const component = components[componentBySource.get(first.source)];
    throw new Error(
      `Next dependency cycle contains ${component.length} assets, exceeding max-assets ${maxAssets}: ${component.join(', ')}`
    );
  }

  return candidates.filter(move => selectedSources.has(move.source)).map(move => bySource.get(move.source));
}

function splitComponents(moves, selectedSources) {
  return stronglyConnectedComponents(moves).filter(component => {
    const selectedCount = component.filter(source => selectedSources.has(source)).length;
    return selectedCount > 0 && selectedCount < component.length;
  });
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
    // Cycles are selected atomically by selectAtomicPrefix. Break ordering ties
    // deterministically while retaining same-wave dependency classifications.
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
  const selected = dependencyOrder(selectAtomicPrefix(candidates, maxAssets));
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
    checkpoints: [...REQUIRED_CHECKPOINTS],
    validation_commands: [
      'node scripts/validate-migration-wave.mjs --manifest <manifest>',
      'node scripts/generate-sprint-10-metadata.mjs',
      'node scripts/validate-sprint-10.mjs --require-annotations',
      'node scripts/validate-curated-templates.js',
      'node scripts/validate-canonical-paths.js --strict',
      'python3 scripts/check_migration_links.py --manifest <manifest>',
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
  if (plan.generated_from !== 'meta/migration-inventory.json') {
    fail('generated_from must be meta/migration-inventory.json');
  }
  if (!plan.inventory_generated) fail('inventory_generated is required');
  else if (plan.inventory_generated !== inventory.generated) fail('inventory_generated does not match migration inventory snapshot');
  if (!/^[0-9a-f]{40}$/.test(plan.pre_batch_sha || '')) {
    fail('pre_batch_sha must be a 40-character Git SHA');
  } else {
    let checkpointExists = true;
    try {
      execFileSync('git', ['cat-file', '-e', `${plan.pre_batch_sha}^{commit}`], { cwd: root, stdio: 'ignore' });
    } catch {
      checkpointExists = false;
      fail('pre_batch_sha does not resolve to a commit');
    }
    if (checkpointExists) {
      try {
        execFileSync('git', ['merge-base', '--is-ancestor', plan.pre_batch_sha, 'HEAD'], { cwd: root, stdio: 'ignore' });
      } catch {
        fail('pre_batch_sha is not an ancestor of HEAD');
      }
    }
  }
  if (!plan.rollback_owner) fail('rollback_owner is required');
  if (JSON.stringify(plan.checkpoints) !== JSON.stringify(REQUIRED_CHECKPOINTS)) {
    fail('checkpoints must contain the complete ordered checkpoint set');
  }
  if (plan.rollback?.strategy !== 'revert-wave-merge-commit') fail('rollback strategy is missing or unsupported');
  if (plan.rollback?.command !== 'git revert <wave-merge-sha>') fail('rollback command is missing or unsupported');
  if (plan.rollback?.granularity !== 'wave') fail('rollback granularity must be wave');
  if (plan.rollback?.asset_hashes_preserved !== true) fail('rollback must preserve asset hashes');

  const bySource = new Map(inventory.moves.map(move => [move.source, move]));
  const inventoryByPath = new Map(inventory.moves.flatMap(move => [[move.source, move], [move.destination, move]]));
  const selectedPaths = new Set((plan.assets || []).flatMap(asset => [asset.source, asset.destination]));
  const selectedSources = new Set((plan.assets || []).map(asset => asset.source));
  const boundaryMoves = inventory.moves
    .filter(move => move.batch === plan.source_batch)
    .filter(move => plan.primary_domain === 'mixed' || move.primary_domain === plan.primary_domain)
    .filter(move => move.action === 'planned-move-not-executed' || move.execution?.batch_id === plan.wave_id)
    .sort((a, b) => a.source.localeCompare(b.source));
  for (const component of splitComponents(boundaryMoves, selectedSources)) {
    fail(`wave splits dependency cycle: ${component.join(', ')}`);
  }

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
        const pointer = fs.readFileSync(sourcePath, 'utf8')
          .match(/^\s*\*{0,2}Canonical location:?\*{0,2}\s*\[[^\]]+\]\(([^)]+)\)/im);
        if (!pointer?.[1]) fail(`legacy pointer is missing: ${asset.source}`);
        else {
          const target = pointer[1].split('#')[0].trim().replace(/^<|>$/g, '');
          const resolved = path.resolve(path.dirname(sourcePath), target);
          if (resolved !== destinationPath) fail(`legacy pointer does not resolve to destination: ${asset.source}`);
        }
      }
    }
    const recordedDependencies = Array.isArray(asset.dependencies) ? asset.dependencies : [];
    const expectedDependencyPaths = move.dependencies || [];
    if (recordedDependencies.length !== expectedDependencyPaths.length) {
      fail(`dependency count mismatch: ${asset.source}`);
    }
    for (let index = 0; index < expectedDependencyPaths.length; index += 1) {
      const dependencyPath = expectedDependencyPaths[index];
      const recorded = recordedDependencies[index];
      const recordedIdentity = inventoryByPath.get(recorded?.path)?.destination || recorded?.path;
      const expectedIdentity = inventoryByPath.get(dependencyPath)?.destination || dependencyPath;
      const expected = classifyDependency(root, recorded?.path || dependencyPath, inventoryByPath, selectedPaths);
      if (!recorded || recordedIdentity !== expectedIdentity) fail(`dependency path mismatch: ${asset.source}`);
      const laterExecutedDependency = recorded?.status === 'satisfied-existing-deferred'
        && expected.status === 'satisfied-executed'
        && recordedIdentity === expectedIdentity;
      if (!recorded || (recorded.status !== expected.status && !laterExecutedDependency)) {
        fail(`dependency status mismatch: ${asset.source} -> ${dependencyPath}`);
      }
      const recordedResolvedIdentity = inventoryByPath.get(recorded?.resolved_path)?.destination || recorded?.resolved_path;
      const expectedResolvedIdentity = inventoryByPath.get(expected.resolved_path)?.destination || expected.resolved_path;
      const resolvedPathMatches = laterExecutedDependency
        ? recordedResolvedIdentity === expectedResolvedIdentity
        : recorded?.resolved_path === expected.resolved_path;
      if (!recorded || !resolvedPathMatches) {
        fail(`dependency resolved path mismatch: ${asset.source} -> ${dependencyPath}`);
      }
      if (expected.status === 'blocked-missing') fail(`missing dependency: ${dependencyPath}`);
    }
  }
  return errors;
}
