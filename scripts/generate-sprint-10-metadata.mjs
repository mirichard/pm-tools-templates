#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const normalize = value => value.replaceAll('\\', '/');
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

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

const migration = mappings.map(item => ({
  source: item.path,
  destination: `domains/${slug(item.domain.primary)}/${item.path}`,
  primary_domain: item.domain.primary,
  secondary_domains: item.domain.secondary,
  dependencies: (byPath.get(item.path)?.relatedTemplates || []).slice(0, 3).map(value => normalize(value.path)),
  affected_internal_references: inboundLinks(item.path),
  batch: ({ Planning: 1, Stakeholder: 1, Team: 2, Uncertainty: 2, Delivery: 3, Measurement: 4 })[item.domain.primary],
  legacy_strategy: 'replace-source-with-relative-pointer-after-approved-move',
  action: 'planned-move-not-executed'
}));

const ordered = [...mappings].sort((a, b) => a.path.localeCompare(b.path));
const crossReferences = ordered.map(item => {
  const indexed = byPath.get(item.path);
  const indexedRelated = (indexed?.relatedTemplates || [])
    .map(value => normalize(value.path))
    .filter(target => fs.existsSync(path.join(root, target)));
  const sameDomain = ordered.filter(candidate => candidate.path !== item.path && candidate.domain.primary === item.domain.primary).map(candidate => candidate.path);
  const domainGroup = ordered.filter(candidate => candidate.domain.primary === item.domain.primary);
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

const covered = crossReferences.filter(item =>
  item.prerequisites.length || item.related_assets.length || item.complementary_assets.length || item.previous_workflow_step || item.next_workflow_step
).length;

fs.writeFileSync(path.join(root, 'meta/migration-inventory.json'), JSON.stringify({
  generated: '2026-09-02',
  source: 'meta/domain-mapping.json',
  physical_moves_executed: false,
  total: migration.length,
  moves: migration
}, null, 2) + '\n');

fs.writeFileSync(path.join(root, 'meta/cross-references.json'), JSON.stringify({
  generated: '2026-09-02',
  denominator_definition: 'Unique existing paths in meta/domain-mapping.json',
  denominator: crossReferences.length,
  covered,
  coverage_percent: Number((covered / crossReferences.length * 100).toFixed(1)),
  records: crossReferences
}, null, 2) + '\n');

console.log(`Generated ${migration.length} migration records and ${covered}/${crossReferences.length} covered cross-reference records.`);
