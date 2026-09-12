import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validatePostMigrationState } from '../scripts/migration-post-check.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'migration-post-check-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'legacy'), { recursive: true });
  fs.mkdirSync(path.join(root, 'domains/delivery'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.mkdirSync(path.join(root, 'templates'), { recursive: true });
  fs.writeFileSync(path.join(root, 'domains/delivery/a.md'), '# A\n');
  fs.writeFileSync(path.join(root, 'legacy/a.md'), '# Moved\n\nCanonical location: [A](../domains/delivery/a.md)\n');
  fs.writeFileSync(path.join(root, 'legacy/b.md'), '# B\n');
  fs.writeFileSync(path.join(root, 'docs/current.md'), '[A](../domains/delivery/a.md)\n');
  fs.writeFileSync(path.join(root, 'templates/templates.json'), JSON.stringify({
    templates: [{
      path: 'domains/delivery/a.md',
      canonical_path: 'domains/delivery/a.md',
      alternate_paths: ['legacy/a.md'],
      relatedTemplates: [{ path: 'domains/delivery/a.md' }]
    }]
  }, null, 2));
  const inventory = {
    moves: [
      {
        source: 'legacy/a.md',
        destination: 'domains/delivery/a.md',
        action: 'executed-move-with-legacy-pointer',
        dependencies: [],
        affected_internal_references: ['docs/current.md', 'templates/templates.json']
      },
      {
        source: 'legacy/b.md',
        destination: 'domains/delivery/b.md',
        action: 'planned-move-not-executed',
        dependencies: ['domains/delivery/a.md'],
        affected_internal_references: []
      }
    ]
  };
  return { root, inventory };
}

test('passes when maintained references, catalog compatibility metadata, and dependencies are canonical', t => {
  const { root, inventory } = fixture(t);
  assert.deepEqual(validatePostMigrationState({ root, inventory }), []);
});

test('rejects a dependency that still targets an executed legacy source', t => {
  const { root, inventory } = fixture(t);
  inventory.moves[1].dependencies = ['legacy/a.md'];
  assert.match(validatePostMigrationState({ root, inventory }).join('\n'), /dependency still targets migrated legacy path legacy\/a\.md/);
});

test('rejects a maintained reference that still uses an executed legacy path', t => {
  const { root, inventory } = fixture(t);
  fs.writeFileSync(path.join(root, 'docs/current.md'), '[A](../legacy/a.md)\nlegacy/a.md\n');
  assert.match(validatePostMigrationState({ root, inventory }).join('\n'), /maintained reference still uses migrated legacy path legacy\/a\.md/);
});

test('rejects a maintained reference through multiple parent-directory segments', t => {
  const { root, inventory } = fixture(t);
  fs.writeFileSync(path.join(root, 'docs/current.md'), '[A](../../legacy/a.md)\n');
  assert.match(validatePostMigrationState({ root, inventory }).join('\n'), /maintained reference still uses migrated legacy path legacy\/a\.md/);
});

test('does not treat a legacy path suffix inside a canonical path as a stale reference', t => {
  const { root, inventory } = fixture(t);
  fs.writeFileSync(path.join(root, 'docs/current.md'), '[A](../domains/delivery/legacy/a.md)\n');
  inventory.moves[0].affected_internal_references = ['templates/templates.json'];
  assert.deepEqual(validatePostMigrationState({ root, inventory }), []);
});

test('allows explicitly historical evidence to retain legacy paths', t => {
  const { root, inventory } = fixture(t);
  fs.mkdirSync(path.join(root, 'meta/architecture-research'), { recursive: true });
  fs.writeFileSync(path.join(root, 'meta/architecture-research/evidence.md'), 'legacy/a.md\n');
  assert.deepEqual(validatePostMigrationState({ root, inventory }), []);
});

test('allows an explicitly classified proposal snapshot to retain legacy paths', t => {
  const { root, inventory } = fixture(t);
  fs.writeFileSync(path.join(root, 'templates/templates.proposed.json'), JSON.stringify({ path: 'legacy/a.md' }));
  const policy = {
    historical_prefixes: ['meta/architecture-research/'],
    intentional_exact_files: ['meta/migration-inventory.json', 'templates/templates.proposed.json']
  };
  assert.deepEqual(validatePostMigrationState({ root, inventory, policy }), []);
});

test('detects a stale generated needs-review path when listed as affected', t => {
  const { root, inventory } = fixture(t);
  fs.mkdirSync(path.join(root, 'meta'), { recursive: true });
  fs.writeFileSync(path.join(root, 'meta/needs-review.md'), 'legacy/a.md\n');
  inventory.moves[0].affected_internal_references.push('meta/needs-review.md');
  const errors = validatePostMigrationState({ root, inventory });
  assert.ok(errors.some(error => error.includes('meta/needs-review.md')));
});

test('rejects missing affected-reference files', t => {
  const { root, inventory } = fixture(t);
  inventory.moves[0].affected_internal_references.push('docs/missing.md');
  assert.match(validatePostMigrationState({ root, inventory }).join('\n'), /affected reference file is missing/);
});

test('scans HTML affected-reference files', t => {
  const { root, inventory } = fixture(t);
  fs.writeFileSync(path.join(root, 'docs/report.html'), '<a href="../legacy/a.md">A</a>\n');
  inventory.moves[0].affected_internal_references.push('docs/report.html');
  assert.match(validatePostMigrationState({ root, inventory }).join('\n'), /docs\/report\.html: maintained reference still uses migrated legacy path/);
});

test('rejects unsupported migration actions', t => {
  const { root, inventory } = fixture(t);
  inventory.moves[1].action = 'planned-move-not-excuted';
  assert.match(validatePostMigrationState({ root, inventory }).join('\n'), /unsupported migration action/);
});

test('permits legacy source only as catalog alternate path for its canonical destination', t => {
  const { root, inventory } = fixture(t);
  const catalogPath = path.join(root, 'templates/templates.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  catalog.templates[0].relatedTemplates[0].path = 'legacy/a.md';
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
  assert.match(validatePostMigrationState({ root, inventory }).join('\n'), /relatedTemplates.*still uses migrated legacy path/);
});
