#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const errors = [];
const notes = [];
const fail = message => errors.push(message);
const assert = (condition, message) => { if (!condition) fail(message); };
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const json = file => JSON.parse(read(file));
const exists = file => fs.existsSync(path.join(root, file));
const normalize = value => value.replaceAll('\\', '/');
const hashSha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalizeContent = value => value.replace(/\s+/g, ' ').trim();

function frontmatter(file) {
  const content = read(file);
  assert(content.startsWith('---\n'), `${file}: missing YAML frontmatter`);
  const end = content.indexOf('\n---', 4);
  assert(end > 0, `${file}: unterminated YAML frontmatter`);
  if (end < 0) return {};
  const parsed = {};
  for (const line of content.slice(4, end).split('\n')) {
    const match = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (raw.startsWith('[') && raw.endsWith(']')) {
      parsed[key] = raw.slice(1, -1).split(',').map(value => value.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    } else {
      parsed[key] = raw.trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return parsed;
}

function stripFrontmatter(content) {
  if (!content.startsWith('---\n')) return content;
  const end = content.indexOf('\n---', 4);
  return end > 0 ? content.slice(end + 4) : content;
}

function validateLinks(file) {
  const content = read(file);
  const linkPattern = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of content.matchAll(linkPattern)) {
    const target = match[1].split('#')[0].trim().replace(/^<|>$/g, '');
    if (!target || /^(https?:|mailto:)/.test(target)) continue;
    const resolved = path.resolve(root, path.dirname(file), target);
    assert(resolved.startsWith(root), `${file}: link escapes repository: ${target}`);
    assert(fs.existsSync(resolved), `${file}: broken relative link: ${target}`);
  }
}

const evidenceFiles = [
  'docs/vnext/sprint-10/baseline-and-traceability.md',
  'docs/vnext/sprint-10/asset-migration-plan.md',
  'docs/vnext/sprint-10/benefits-validation.md',
  'docs/vnext/sprint-10/phase-gate-2-evidence.md',
  'docs/vnext/sprint-10/sprint-review.md',
  'docs/vnext/sprint-11/b1a-migration-record.md',
  'docs/benefits/benefits-review-process.md',
  'templates/universal/benefits-review-template.md',
  'templates/universal/benefits-variance-analysis-template.md',
  'examples/benefits-review/service-centre-day-60-review.md',
  'docs/principles/principle-taxonomy.md',
  'docs/principles/anti-patterns.md',
  'docs/principles/self-assessment.md',
  'docs/principles/top-20-selection.md'
];
evidenceFiles.forEach(file => {
  assert(exists(file), `${file}: required evidence missing`);
  if (exists(file)) validateLinks(file);
});

for (const file of ['templates/universal/benefits-review-template.md', 'templates/universal/benefits-variance-analysis-template.md']) {
  const fm = frontmatter(file);
  ['title', 'methodology', 'complexity', 'owner', 'updated', 'domain', 'tags'].forEach(key => assert(fm[key], `${file}: missing ${key}`));
  assert(/## When to use/i.test(read(file)), `${file}: missing when-to-use guidance`);
  assert(/## When not to use/i.test(read(file)), `${file}: missing when-not-to-use guidance`);
}

const fixture = json('examples/benefits-review/service-centre-day-60.json');
for (const benefit of fixture.benefits) {
  const achievement = benefit.direction === 'higher'
    ? (benefit.actual - benefit.baseline) / (benefit.target - benefit.baseline) * 100
    : (benefit.baseline - benefit.actual) / (benefit.baseline - benefit.target) * 100;
  const variance = achievement - benefit.expected_achievement_percent;
  const status = variance < -15 ? 'RED' : variance < -5 ? 'AMBER' : 'GREEN';
  assert(Number(achievement.toFixed(2)) === benefit.expected_actual_achievement_percent, `${benefit.id}: achievement calculation mismatch`);
  assert(Number(variance.toFixed(2)) === benefit.expected_variance_points, `${benefit.id}: variance calculation mismatch`);
  assert(status === benefit.expected_status, `${benefit.id}: threshold mismatch`);
}

const templateDb = json('templates/templates.json');
for (const title of ['Benefits Review Template', 'Benefits Variance Analysis Template']) {
  const record = templateDb.templates.find(item => item.title === title);
  assert(record, `Decision-engine catalog cannot discover ${title}`);
  if (record) assert(exists(record.path), `Catalog path missing for ${title}`);
}

const migration = json('meta/migration-inventory.json');
const domainMap = json('meta/domain-mapping.json');
const cross = json('meta/cross-references.json');
const executedActionSet = new Set(['executed-move-with-legacy-pointer']);
const canonicalMovePath = move => executedActionSet.has(move.action) ? move.destination : move.source;
assert(migration.total === domainMap.mappings.length, 'Migration inventory does not cover the domain-map denominator');
assert(new Set(migration.moves.map(item => item.source)).size === migration.total, 'Migration inventory has duplicate sources');
assert(new Set(migration.moves.map(item => item.destination)).size === migration.total, 'Migration inventory has destination collisions');
const executedMoves = migration.moves.filter(move => executedActionSet.has(move.action));
for (const move of migration.moves) {
  const validAction = move.action === 'planned-move-not-executed' || executedActionSet.has(move.action);
  assert(validAction, `${move.source}: unsupported migration action ${move.action}`);
}
const executedBatchRecords = (migration.batch_execution_records || []).filter(record => record.status === 'executed');
const migrationBySource = new Map(migration.moves.map(item => [item.source, item]));
const migrationByDestination = new Map(migration.moves.map(item => [item.destination, item]));
assert(typeof migration.physical_moves_executed === 'boolean', 'Migration inventory physical_moves_executed must be boolean');
const expectedPhysicalMovesFlag = executedMoves.length > 0;
assert(migration.physical_moves_executed === expectedPhysicalMovesFlag, 'Migration inventory physical_moves_executed does not match execution metadata/records');
if (migration.physical_moves_executed) assert(executedMoves.length > 0, 'Migration inventory marks physical moves executed but no move is marked executed');
for (const record of executedBatchRecords) {
  assert(executedMoves.some(move => move.execution?.batch_id === record.batch_id), `Executed batch record ${record.batch_id} has no executed move`);
  const executedCount = executedMoves.filter(move => move.execution?.batch_id === record.batch_id).length;
  assert(record.asset_count === executedCount, `Executed batch record ${record.batch_id} asset_count ${record.asset_count} does not match executed moves ${executedCount}`);
}
for (const move of executedMoves) {
  assert(executedBatchRecords.some(record => record.batch_id === move.execution?.batch_id), `${move.source}: executed move batch_id is missing from batch_execution_records`);
}
for (const move of migration.moves) {
  assert(exists(move.source), `Migration source missing: ${move.source}`);
  assert(move.destination.startsWith('domains/'), `Migration target outside domain layer: ${move.destination}`);
  assert(Number.isInteger(move.batch), `Migration batch missing: ${move.source}`);
  for (const dependency of move.dependencies) {
    if (exists(dependency)) continue;
    const linkedMove = migrationBySource.get(dependency) || migrationByDestination.get(dependency);
    const linkedCanonicalPath = linkedMove ? canonicalMovePath(linkedMove) : null;
    assert(Boolean(linkedCanonicalPath) && exists(linkedCanonicalPath), `Migration dependency missing: ${dependency}`);
  }
  for (const inbound of move.affected_internal_references) assert(exists(inbound), `Inbound reference file missing: ${inbound}`);
  const canonicalPath = move.action === 'planned-move-not-executed' ? move.source : move.destination;
  assert(exists(canonicalPath), `Canonical migration path missing: ${canonicalPath}`);
}

const catalogByCanonical = new Map();
const catalogByPath = new Map();
for (const item of templateDb.templates) {
  if (item.canonical_path) catalogByCanonical.set(normalize(item.canonical_path), item);
  if (item.path) catalogByPath.set(normalize(item.path), item);
}

for (const move of executedMoves) {
  assert(exists(move.destination), `Executed migration destination missing: ${move.destination}`);
  assert(typeof move.execution?.pre_move_source_sha256 === 'string' && move.execution.pre_move_source_sha256.length > 10, `${move.source}: missing pre_move_source_sha256`);
  if (exists(move.destination) && move.execution?.pre_move_source_sha256) {
    const destinationRawHash = hashSha256(read(move.destination));
    const destinationNormalizedHash = hashSha256(normalizeContent(read(move.destination)));
    assert(
      move.execution.pre_move_source_sha256 === destinationRawHash || move.execution.pre_move_source_sha256 === destinationNormalizedHash,
      `${move.source}: destination hash does not match pre-move source hash`
    );
  }
  const legacyContent = read(move.source);
  const pointerBody = stripFrontmatter(legacyContent);
  const pointerMatch = pointerBody.match(/^\s*\*{0,2}Canonical location:?\*{0,2}\s*\[[^\]]+\]\(([^)]+)\)/im);
  assert(Boolean(pointerMatch?.[1]), `${move.source}: legacy pointer must contain a canonical location link`);
  if (pointerMatch?.[1]) {
    const resolved = normalize(path.relative(root, path.resolve(root, path.dirname(move.source), pointerMatch[1].split('#')[0].trim().replace(/^<|>$/g, ''))));
    assert(resolved === move.destination, `${move.source}: legacy pointer must resolve to canonical destination`);
  }
  assert(/moved|canonical/i.test(legacyContent), `${move.source}: legacy pointer must describe moved canonical location`);
  assert(legacyContent.length <= 1200, `${move.source}: legacy pointer contains unexpected non-navigation content`);
  assert(domainMap.mappings.some(item => item.path === move.destination), `${move.source}: domain map must point to canonical destination`);
  assert(cross.records.some(item => item.path === move.destination), `${move.source}: cross-reference record missing canonical destination`);
  assert(!cross.records.some(item => item.path === move.source), `${move.source}: cross-reference should not keep legacy path as canonical record`);
  const canonicalMatch = catalogByCanonical.get(move.destination);
  const pathMatch = catalogByPath.get(move.destination);
  if (canonicalMatch && pathMatch) {
    assert(canonicalMatch === pathMatch, `${move.source}: canonical destination matches multiple catalog records`);
  }
  const catalogRecord = canonicalMatch || pathMatch;
  assert(Boolean(catalogRecord), `${move.source}: template catalog must include canonical destination`);
  if (catalogRecord) {
    const alternates = Array.isArray(catalogRecord.alternate_paths) ? catalogRecord.alternate_paths.map(normalize) : [];
    assert(alternates.includes(move.source), `${move.source}: template catalog alternate_paths must keep legacy source path`);
  }
  assert(typeof move.execution?.evidence_file === 'string' && move.execution.evidence_file.length > 0, `${move.source}: missing execution evidence file`);
  if (move.execution?.evidence_file) assert(exists(move.execution.evidence_file), `${move.source}: execution evidence file missing`);
}

assert(cross.denominator === domainMap.mappings.length, 'Cross-reference denominator mismatch');
assert(cross.coverage_percent >= 80, `Cross-reference coverage ${cross.coverage_percent}% is below 80%`);
const crossByPath = new Map(cross.records.map(item => [item.path, item]));
for (const record of cross.records) {
  assert(exists(record.path), `Cross-reference source missing: ${record.path}`);
  for (const field of ['prerequisites', 'related_assets', 'complementary_assets']) {
    assert(Array.isArray(record[field]), `${record.path}: ${field} must be an array`);
    for (const target of record[field]) assert(exists(target), `${record.path}: broken ${field} target ${target}`);
  }
  if (record.next_workflow_step) {
    assert(exists(record.next_workflow_step), `${record.path}: next step missing`);
    assert(crossByPath.get(record.next_workflow_step)?.previous_workflow_step === record.path, `${record.path}: next/previous navigation is not bidirectional`);
  }
  if (record.previous_workflow_step) {
    assert(crossByPath.get(record.previous_workflow_step)?.next_workflow_step === record.path, `${record.path}: previous/next navigation is not bidirectional`);
  }
  for (const target of record.related_assets) assert(crossByPath.get(target)?.related_assets.includes(record.path), `${record.path}: asymmetric related asset ${target}`);
}

const principleSchema = json('schemas/principle-annotation.schema.json');
const allowed = principleSchema.$defs.principle.enum;
assert(allowed.length >= 8 && allowed.length <= 12, `Principle count ${allowed.length} is outside 8–12`);
assert(new Set(allowed).size === allowed.length, 'Principle identifiers are duplicated');
const taxonomy = read('docs/principles/principle-taxonomy.md');
allowed.forEach(id => assert(taxonomy.includes(`(\`${id}\`)`), `Taxonomy does not define ${id}`));

const selected = templateDb.templates.slice(0, 20).map(item => item.canonical_path || item.path);
assert(selected.length === 20 && new Set(selected).size === 20, 'Top-20 selection is not 20 unique catalog records');
selected.forEach(file => assert(exists(file), `Top-20 selected path missing: ${file}`));

if (process.argv.includes('--require-annotations')) {
  for (const file of selected) {
    const fm = frontmatter(file);
    const annotationLines = read(file).split('\n').filter(line => /^(primary_principles|secondary_principles|principle_rationale):/.test(line));
    assert(annotationLines.length === 3 && annotationLines.length <= 10, `${file}: annotation block must have 3 and at most 10 lines`);
    assert(Array.isArray(fm.primary_principles) && fm.primary_principles.length, `${file}: primary principles missing`);
    assert(Array.isArray(fm.secondary_principles), `${file}: secondary principles missing`);
    [...(fm.primary_principles || []), ...(fm.secondary_principles || [])].forEach(id => assert(allowed.includes(id), `${file}: unknown principle ${id}`));
    assert(typeof fm.principle_rationale === 'string' && fm.principle_rationale.length >= 10, `${file}: rationale missing or too short`);
  }
} else {
  notes.push('Top-20 annotations not required: #741 independent approval gate is still open.');
}

const newTemplateHashes = new Map();
for (const file of ['templates/universal/benefits-review-template.md', 'templates/universal/benefits-variance-analysis-template.md']) {
  const hash = hashSha256(normalizeContent(read(file)));
  assert(!newTemplateHashes.has(hash), `${file}: duplicates ${newTemplateHashes.get(hash)}`);
  newTemplateHashes.set(hash, file);
}

const baselineCanonicalHashes = new Map();
for (const move of migration.moves.filter(item => item.action === 'planned-move-not-executed')) {
  if (!exists(move.source)) continue;
  const hash = hashSha256(normalizeContent(read(move.source)));
  const existing = baselineCanonicalHashes.get(hash) || new Set();
  existing.add(move.source);
  baselineCanonicalHashes.set(hash, existing);
}

const executedCanonicalHashes = new Map();
for (const move of executedMoves) {
  if (!exists(move.destination)) continue;
  const hash = hashSha256(normalizeContent(read(move.destination)));
  assert(!executedCanonicalHashes.has(hash), `${move.destination}: executed canonical duplicate of ${executedCanonicalHashes.get(hash)}`);
  executedCanonicalHashes.set(hash, move.destination);
  const baselineMatches = [...(baselineCanonicalHashes.get(hash) || [])].filter(pathValue => pathValue !== move.source);
  assert(baselineMatches.length === 0, `${move.destination}: migration-created canonical duplicate of ${baselineMatches[0]}`);
}

notes.forEach(note => console.log(`NOTE: ${note}`));
if (errors.length) {
  errors.forEach(error => console.error(`FAIL: ${error}`));
  console.error(`Sprint 10 validation failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`PASS: Sprint 10 author validation (${cross.covered}/${cross.denominator}, ${cross.coverage_percent}% cross-reference coverage).`);
