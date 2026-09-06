#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const normalize = value => value.replaceAll('\\', '/');
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const migrationInventoryPath = path.join(root, 'meta/migration-inventory.json');
const existingInventory = fs.existsSync(migrationInventoryPath) ? JSON.parse(fs.readFileSync(migrationInventoryPath, 'utf8')) : null;
const existingMoves = existingInventory?.moves || [];
const existingBySource = new Map(existingMoves.map(item => [item.source, item]));
const existingByDestination = new Map(existingMoves.map(item => [item.destination, item]));
const crossReferencesPath = path.join(root, 'meta/cross-references.json');
const existingCrossReferences = fs.existsSync(crossReferencesPath) ? JSON.parse(fs.readFileSync(crossReferencesPath, 'utf8')) : null;
// Preserve the recorded generation date so repeated generation is deterministic.
// Set a new date only when neither generated artifact exists yet.
const generatedDate = existingInventory?.generated || existingCrossReferences?.generated || new Date().toISOString().slice(0, 10);
const existingCrossByPath = new Map((existingCrossReferences?.records || []).map(item => [item.path, item]));

const domainMap = readJson('meta/domain-mapping.json');
const templateDb = readJson('templates/templates.json');
const mappings = domainMap.mappings.filter(item => fs.existsSync(path.join(root, item.path)));
const byPath = new Map(templateDb.templates.map(item => [normalize(item.canonical_path || item.path), item]));

const textFiles = [];
const ignored = new Set(['.git', 'node_modules', 'coverage', 'dist', 'build']);
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (/\.(md|json|ya?ml|js|mjs|ts|tsx|html)$/i.test(entry.name)) textFiles.push(absolute);
  }
}
walk(root);

function inboundLinks(assetPath) {
  const base = path.basename(assetPath);
  return textFiles
    .filter(file => normalize(path.relative(root, file)) !== assetPath)
    .filter(file => fs.readFileSync(file, 'utf8').includes(base))
    .map(file => normalize(path.relative(root, file)))
    .sort();
}

// Resolve an item's pre-migration source path. For an item whose domain-mapping `path` is
// already the canonical destination (an executed move), this is the original legacy path;
// otherwise it's the path unchanged. Used both for the migration record and as a stable sort
// key so that executing a move doesn't shift a template's alphabetical position within its
// domain group and cascade into unrelated neighbors' previous/next/related_assets fields.
function resolveSource(item) {
  const canonicalPrefix = `domains/${slug(item.domain.primary)}/`;
  const isCanonicalPath = item.path.startsWith(canonicalPrefix);
  return isCanonicalPath ? (existingByDestination.get(item.path)?.source || item.path) : item.path;
}

const migration = mappings.map(item => {
  const canonicalPrefix = `domains/${slug(item.domain.primary)}/`;
  const isCanonicalPath = item.path.startsWith(canonicalPrefix);
  const existingMove = isCanonicalPath
    ? (existingByDestination.get(item.path) || {})
    : (existingBySource.get(item.path) || existingByDestination.get(item.path) || {});
  const resolvedSource = resolveSource(item);
  const resolvedDestination = isCanonicalPath
    ? item.path
    : `domains/${slug(item.domain.primary)}/${item.path}`;
  const relationshipSeed = byPath.get(item.path) || byPath.get(resolvedSource);
  const isExecutedMove = existingMove.action && existingMove.action !== 'planned-move-not-executed';
  return {
    ...existingMove,
    source: resolvedSource,
    destination: resolvedDestination,
    primary_domain: item.domain.primary,
    secondary_domains: item.domain.secondary,
    dependencies: (relationshipSeed?.relatedTemplates || []).slice(0, 3).map(value => normalize(value.path)),
    affected_internal_references: isExecutedMove
      ? (existingMove.affected_internal_references || [])
      : inboundLinks(resolvedSource),
    batch: ({ Planning: 1, Stakeholder: 1, Team: 2, Uncertainty: 2, Delivery: 3, Measurement: 4 })[item.domain.primary],
    legacy_strategy: 'replace-source-with-relative-pointer-after-approved-move',
    action: existingMove.action || 'planned-move-not-executed'
  };
});

for (const executedMove of migration.filter(item => item.action === 'executed-move-with-legacy-pointer')) {
  const rewriteDependency = value => value === executedMove.source || value === executedMove.destination ? executedMove.destination : value;
  for (const move of migration) {
    move.dependencies = [...new Set((move.dependencies || []).map(rewriteDependency))];
  }
}

const ordered = [...mappings].sort((a, b) => a.path.localeCompare(b.path));
// Domain-group neighbors (previous/next/related_assets) are computed from this separately
// sorted list so that an executed move's shift in `item.path` doesn't change its alphabetical
// position relative to domain siblings, which would otherwise cascade unrelated previous/next
// changes into every neighbor's record on regeneration.
const stableOrder = [...mappings].sort((a, b) => resolveSource(a).localeCompare(resolveSource(b)));
const crossReferences = ordered.map(item => {
  const indexed = byPath.get(item.path);
  const indexedRelated = (indexed?.relatedTemplates || [])
    .map(value => normalize(value.path))
    .filter(target => fs.existsSync(path.join(root, target)));
  const sameDomain = ordered.filter(candidate => candidate.path !== item.path && candidate.domain.primary === item.domain.primary).map(candidate => candidate.path);
  const domainGroup = stableOrder.filter(candidate => candidate.domain.primary === item.domain.primary);
  const domainIndex = domainGroup.findIndex(candidate => candidate.path === item.path);
  const previous = domainGroup.length > 1 ? domainGroup[(domainIndex - 1 + domainGroup.length) % domainGroup.length].path : null;
  const next = domainGroup.length > 1 ? domainGroup[(domainIndex + 1) % domainGroup.length].path : null;
  const relatedAssets = [...new Set([previous, next].filter(Boolean))];
  const complementary = [...new Set(indexedRelated.filter(target => !relatedAssets.includes(target)).slice(0, 2))];
  return {
    path: item.path,
    domain: item.domain,
    prerequisites: indexedRelated.slice(0, 1),
    related_assets: relatedAssets,
    complementary_assets: complementary,
    previous_workflow_step: previous,
    next_workflow_step: next
  };
});

for (const move of migration.filter(item => item.action !== 'planned-move-not-executed')) {
  const rewrite = value => value === move.source ? move.destination : value;
  for (const record of crossReferences) {
    record.prerequisites = (record.prerequisites || []).map(rewrite);
    record.related_assets = (record.related_assets || []).map(rewrite);
    record.complementary_assets = (record.complementary_assets || []).map(rewrite);
    if (record.previous_workflow_step) record.previous_workflow_step = rewrite(record.previous_workflow_step);
    if (record.next_workflow_step) record.next_workflow_step = rewrite(record.next_workflow_step);
  }
  const legacyIndex = crossReferences.findIndex(item => item.path === move.source);
  if (legacyIndex >= 0) crossReferences.splice(legacyIndex, 1);
  const legacyRecord = existingCrossByPath.get(move.source);
  if (!legacyRecord) continue;
  const replacement = {
    ...legacyRecord,
    path: move.destination,
    prerequisites: (legacyRecord.prerequisites || []).map(rewrite),
    related_assets: (legacyRecord.related_assets || []).map(rewrite),
    complementary_assets: (legacyRecord.complementary_assets || []).map(rewrite),
    previous_workflow_step: legacyRecord.previous_workflow_step ? rewrite(legacyRecord.previous_workflow_step) : null,
    next_workflow_step: legacyRecord.next_workflow_step ? rewrite(legacyRecord.next_workflow_step) : null
  };
  const index = crossReferences.findIndex(item => item.path === move.destination);
  if (index >= 0) crossReferences[index] = replacement;
  else crossReferences.push(replacement);
}

const covered = crossReferences.filter(item =>
  item.prerequisites.length || item.related_assets.length || item.complementary_assets.length || item.previous_workflow_step || item.next_workflow_step
).length;

const preservedTopLevel = Object.fromEntries(
  Object.entries(existingInventory || {}).filter(([key]) =>
    !['generated', 'source', 'physical_moves_executed', 'total', 'moves'].includes(key)
  )
);
if (!('batch_execution_records' in preservedTopLevel)) preservedTopLevel.batch_execution_records = [];

fs.writeFileSync(path.join(root, 'meta/migration-inventory.json'), JSON.stringify({
  ...preservedTopLevel,
  generated: generatedDate,
  source: 'meta/domain-mapping.json',
  physical_moves_executed: migration.some(move => move.action === 'executed-move-with-legacy-pointer'),
  total: migration.length,
  moves: migration
}, null, 2) + '\n');

fs.writeFileSync(path.join(root, 'meta/cross-references.json'), JSON.stringify({
  generated: generatedDate,
  denominator_definition: 'Unique existing paths in meta/domain-mapping.json',
  denominator: crossReferences.length,
  covered,
  coverage_percent: Number((covered / crossReferences.length * 100).toFixed(1)),
  records: crossReferences
}, null, 2) + '\n');

console.log(`Generated ${migration.length} migration records and ${covered}/${crossReferences.length} covered cross-reference records.`);
