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
assert(migration.total === domainMap.mappings.length, 'Migration inventory does not cover the domain-map denominator');
assert(new Set(migration.moves.map(item => item.source)).size === migration.total, 'Migration inventory has duplicate sources');
assert(new Set(migration.moves.map(item => item.destination)).size === migration.total, 'Migration inventory has destination collisions');
for (const move of migration.moves) {
  assert(exists(move.source), `Migration source missing: ${move.source}`);
  assert(move.destination.startsWith('domains/'), `Migration target outside domain layer: ${move.destination}`);
  assert(Number.isInteger(move.batch), `Migration batch missing: ${move.source}`);
  for (const dependency of move.dependencies) assert(exists(dependency), `Migration dependency missing: ${dependency}`);
  for (const inbound of move.affected_internal_references) assert(exists(inbound), `Inbound reference file missing: ${inbound}`);
}

const cross = json('meta/cross-references.json');
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
  const hash = crypto.createHash('sha256').update(read(file).replace(/\s+/g, ' ').trim()).digest('hex');
  assert(!newTemplateHashes.has(hash), `${file}: duplicates ${newTemplateHashes.get(hash)}`);
  newTemplateHashes.set(hash, file);
}

notes.forEach(note => console.log(`NOTE: ${note}`));
if (errors.length) {
  errors.forEach(error => console.error(`FAIL: ${error}`));
  console.error(`Sprint 10 validation failed with ${errors.length} error(s).`);
  process.exit(1);
}
console.log(`PASS: Sprint 10 author validation (${cross.covered}/${cross.denominator}, ${cross.coverage_percent}% cross-reference coverage).`);
