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
  const reviewText = fs.readFileSync(path.join(root, 'meta/needs-review.md'), 'utf8');
  assert.match(reviewText, /\*\*Count:\*\* 3 of 3 \(value-flow review only; domain decisions accepted in #740\)/);
  assert.equal((reviewText.match(/Value flow remains auto-assigned; domain reviewed:/g) || []).length, 3);
  assert.doesNotMatch(reviewText, /Auto-assigned:/);
  assert.match(fs.readFileSync(path.join(root, 'meta/mapping-summary.md'), 'utf8'), /3 remaining review flags concern value flow only; their domain decisions were accepted in #740\./);
  const moves = decisions.map(d => ({
    source: d.path.replace('domains/delivery/', ''), destination: d.path,
    primary_domain: 'Delivery', secondary_domains: [], batch: 3,
    action: 'executed-move-with-legacy-pointer', dependencies: [], affected_internal_references: [],
    execution: { batch_id: 'original', pre_move_source_sha256: 'original-evidence' }
  }));
  write('meta/migration-inventory.json', { generated: '2026-09-14', moves });
  write('meta/cross-references.json', { records: decisions.map(d => ({
    path: d.path, domain: { primary: 'Delivery' }, prerequisites: [],
    related_assets: [decisions[0].path], complementary_assets: [], previous_workflow_step: decisions[0].path, next_workflow_step: decisions[0].path
  })) });
  const generator = path.join(repo, 'scripts/generate-sprint-10-metadata.mjs');
  for (let pass = 0; pass < 2; pass += 1) {
    execFileSync(process.execPath, [generator], { cwd: root });
    assert.deepEqual(read('meta/migration-inventory.json').moves, moves);
    for (const decision of decisions) {
      const record = read('meta/cross-references.json').records.find(r => r.path === decision.path);
      assert.equal(record.domain.primary, decision.primary);
      assert.deepEqual(record.related_assets, []);
      assert.equal(record.previous_workflow_step, null);
      assert.equal(record.next_workflow_step, null);
      assert.equal(fs.readFileSync(path.join(root, decision.path), 'utf8'), '# Original body\n');
    }
  }

  // New unreviewed assets must not inherit a blanket value-flow-only claim.
  templates.push({ path: 'new-unreviewed.md', title: 'Unreviewed asset', tags: [] });
  write('templates/templates.json', { templates });
  execFileSync('python3', ['scripts/map-assets.py'], { cwd: root });
  const mixedReview = fs.readFileSync(path.join(root, 'meta/needs-review.md'), 'utf8');
  assert.match(mixedReview, /\*\*Count:\*\* 4 of 4\n/);
  assert.match(mixedReview, /Auto-assigned: VF=activity-support, Domain=Delivery/);
  assert.equal((mixedReview.match(/Value flow remains auto-assigned; domain reviewed:/g) || []).length, 3);
  assert.match(fs.readFileSync(path.join(root, 'meta/mapping-summary.md'), 'utf8'), /3 remaining review flags concern value flow only/);
});
