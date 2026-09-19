const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { sync } = require('../scripts/sync-catalog-domains.js');

function fixture(t, entries, mappings = [], decisions = []) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-domains-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, data) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  };
  write('templates/templates.json', { generated: 'preserve', templates: entries });
  write('meta/domain-mapping.json', { mappings });
  write('meta/domain-review-decisions.json', { decisions });
  return { root, write, read: () => JSON.parse(fs.readFileSync(path.join(root, 'templates/templates.json'), 'utf8')) };
}

test('reviewed domains override old directory and mapping classifications; paths remain intact', t => {
  const entry = { path: 'domains/delivery/problem.md', canonical_path: 'legacy/problem.md', title: 'Problem', domain: 'Delivery' };
  const f = fixture(t, [entry], [{ path: entry.path, domain: { primary: 'Delivery' } }], [{ path: entry.path, primary: 'Uncertainty' }]);
  assert.throws(() => sync(f.root, true), /missing or stale/);
  assert.equal(sync(f.root).changed, 1);
  assert.deepEqual(f.read(), { generated: 'preserve', templates: [{ ...entry, domain: 'Uncertainty' }] });
  const first = fs.readFileSync(path.join(f.root, 'templates/templates.json'), 'utf8');
  assert.equal(sync(f.root).changed, 0);
  assert.equal(fs.readFileSync(path.join(f.root, 'templates/templates.json'), 'utf8'), first);
});

test('unmapped additions use explicit front matter without assuming a directory domain', t => {
  const f = fixture(t, [{ path: 'templates/benefits.md' }]);
  f.write('templates/benefits.md', '---\ndomain: "Measurement"\n---\n# Benefits');
  sync(f.root);
  assert.equal(f.read().templates[0].domain, 'Measurement');
  assert.doesNotThrow(() => sync(f.root, true));
});

test('unknown or duplicate front-matter domains fail without partial writes', t => {
  const f = fixture(t, [{ path: 'templates/good.md' }, { path: 'templates/bad.md' }]);
  f.write('templates/good.md', '---\ndomain: Planning\n---\n');
  for (const header of ['domain: Unknown', 'domain: Team\ndomain: Delivery', 'title: Missing']) {
    f.write('templates/bad.md', `---\n${header}\n---\n`);
    assert.throws(() => sync(f.root), /Missing or invalid explicit domain/);
    assert.equal(f.read().templates[0].domain, undefined);
  }
});

test('conflicting alias mappings are rejected', t => {
  const f = fixture(t, [{ path: 'a.md', canonical_path: 'b.md' }], [
    { path: 'a.md', domain: { primary: 'Team' } },
    { path: 'b.md', domain: { primary: 'Delivery' } }
  ]);
  assert.throws(() => sync(f.root), /Conflicting domain mappings/);
});
