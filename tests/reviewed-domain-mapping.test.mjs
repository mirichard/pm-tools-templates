import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repo = fileURLToPath(new URL('../', import.meta.url));

test('reviewed classifications survive both generators without rewriting migration evidence', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'reviewed-domains-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const directory of ['meta', 'scripts', 'templates']) fs.mkdirSync(path.join(root, directory));
  const write = (file, value) => fs.writeFileSync(path.join(root, file), JSON.stringify(value));
  const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  fs.copyFileSync(path.join(repo, 'scripts/map-assets.py'), path.join(root, 'scripts/map-assets.py'));
  fs.copyFileSync(path.join(repo, 'meta/domain-review-decisions.json'), path.join(root, 'meta/domain-review-decisions.json'));
  const decisions = read('meta/domain-review-decisions.json').decisions;
  const templates = decisions.map(d => ({ path: d.path, title: path.basename(d.path), tags: [] }));
  write('templates/templates.json', { templates });
  for (const d of decisions) {
    const file = path.join(root, d.path);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '# Original body\n');
  }
  execFileSync('python3', ['scripts/map-assets.py'], { cwd: root });
  const mappings = read('meta/domain-mapping.json').mappings;
  assert.deepEqual(mappings.map(m => m.domain.primary), ['Delivery', 'Uncertainty', 'Measurement']);
  assert.ok(mappings.every(m => m.flags.needs_review), 'value-flow uncertainty remains visible');
  assert.match(fs.readFileSync(path.join(root, 'meta/needs-review.md'), 'utf8'), /value flow only/);
  const moves = decisions.map(d => ({
    source: d.path.replace('domains/delivery/', ''), destination: d.path,
    primary_domain: 'Delivery', secondary_domains: [], batch: 3,
    action: 'executed-move-with-legacy-pointer', dependencies: [], affected_internal_references: [],
    execution: { batch_id: 'original', pre_move_source_sha256: 'original-evidence' }
  }));
  write('meta/migration-inventory.json', { generated: '2026-09-14', moves });
  write('meta/cross-references.json', { records: decisions.map(d => ({
    path: d.path, domain: { primary: 'Delivery' }, prerequisites: [],
    related_assets: [], complementary_assets: [], previous_workflow_step: null, next_workflow_step: null
  })) });
  const generator = path.join(repo, 'scripts/generate-sprint-10-metadata.mjs');
  for (let pass = 0; pass < 2; pass += 1) {
    execFileSync(process.execPath, [generator], { cwd: root });
    assert.deepEqual(read('meta/migration-inventory.json').moves, moves);
    for (const decision of decisions) {
      const record = read('meta/cross-references.json').records.find(r => r.path === decision.path);
      assert.equal(record.domain.primary, decision.primary);
      assert.equal(fs.readFileSync(path.join(root, decision.path), 'utf8'), '# Original body\n');
    }
  }
});
