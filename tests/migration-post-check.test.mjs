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
  fs.writeFileSync(path.join(root, 'domains/delivery/a.md'), '# A\n');
  fs.writeFileSync(path.join(root, 'legacy/a.md'), '# Moved\n\nCanonical location: [A](../domains/delivery/a.md)\n');
  fs.writeFileSync(path.join(root, 'legacy/b.md'), '# B\n');
  fs.writeFileSync(path.join(root, 'docs/current.md'), '[A](../domains/delivery/a.md)\n');
  const inventory = {
    moves: [
      {
        source: 'legacy/a.md',
        destination: 'domains/delivery/a.md',
        action: 'executed-move-with-legacy-pointer',
        dependencies: [],
        affected_internal_references: ['docs/current.md']
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

test('passes when maintained references and dependencies use canonical paths', t => {
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

test('allows explicitly historical evidence to retain legacy paths', t => {
  const { root, inventory } = fixture(t);
  fs.mkdirSync(path.join(root, 'meta/architecture-research'), { recursive: true });
  fs.writeFileSync(path.join(root, 'meta/architecture-research/evidence.md'), 'legacy/a.md\n');
  assert.deepEqual(validatePostMigrationState({ root, inventory }), []);
});

test('detects a stale generated needs-review path when listed as affected', t => {
  const { root, inventory } = fixture(t);
  fs.mkdirSync(path.join(root, 'meta'), { recursive: true });
  fs.writeFileSync(path.join(root, 'meta/needs-review.md'), 'legacy/a.md\n');
  inventory.moves[0].affected_internal_references.push('meta/needs-review.md');
  const errors = validatePostMigrationState({ root, inventory });
  assert.ok(errors.some(error => error.includes('meta/needs-review.md')));
});
