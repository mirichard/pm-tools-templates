import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadSiteTemplates } from '../scripts/lib/site-template-catalog.mjs';

const templates = loadSiteTemplates();
const plan = JSON.parse(fs.readFileSync(new URL('../meta/migration-waves/b3e.json', import.meta.url)));

test('B3E browser, detail and download data use canonical bytes and stable IDs', () => {
  for (const asset of plan.assets) {
    const id = path.basename(asset.source, '.md');
    const matches = templates.filter(template => template.id === id);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].path, asset.destination);
    assert.equal(crypto.createHash('sha256').update(matches[0].content).digest('hex'), asset.pre_move_sha256);
    assert.ok(matches[0].title);
    assert.ok(matches[0].methodology);
    assert.ok(!templates.some(template => template.path === asset.source));
  }
});

test('all catalog entries are served once, including unmigrated templates', () => {
  const catalog = JSON.parse(fs.readFileSync(new URL('../templates/templates.json', import.meta.url)));
  assert.equal(templates.length, catalog.templates.length);
  assert.equal(new Set(templates.map(template => template.id)).size, templates.length);
  assert.ok(templates.some(template => template.path.startsWith('templates/')));
});

for (const scenario of ['pointer', 'duplicate', 'escape', 'missing']) {
  test(`invalid ${scenario} catalog fails the build instead of silently serving bad content`, () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-catalog-'));
    try {
      fs.mkdirSync(path.join(root, 'templates'));
      fs.writeFileSync(path.join(root, 'templates/example.md'), scenario === 'pointer' ? '**Canonical location:** [Open](elsewhere.md)' : '# Example');
      const entries = [{ path: scenario === 'escape' ? '../example.md' : scenario === 'missing' ? 'templates/missing.md' : 'templates/example.md' }];
      if (scenario === 'duplicate') entries.push(entries[0]);
      fs.writeFileSync(path.join(root, 'templates/templates.json'), JSON.stringify({ templates: entries }));
      assert.throws(() => loadSiteTemplates(root));
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
  });
}

test('changelog regeneration selects the same canonical files as the browser', async () => {
  const { generateChangelogs } = await import('../scripts/generate-changelogs.mjs');
  const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'site-changelog-'));
  const queried = [];
  try {
    await generateChangelogs({ outputDirectory, history(file) { queried.push(file); return []; } });
    assert.deepEqual(queried, templates.map(template => template.path));
    assert.equal(fs.readdirSync(outputDirectory).length, templates.length);
    for (const template of templates) {
      const record = JSON.parse(fs.readFileSync(path.join(outputDirectory, `${template.id}.json`)));
      assert.equal(record.filePath, template.path);
    }
  } finally { fs.rmSync(outputDirectory, { recursive: true, force: true }); }
});
