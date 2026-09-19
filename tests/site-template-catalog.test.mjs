import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContentRepairs, contentHashMatches } from '../scripts/lib/content-repairs.mjs';
import { loadSiteTemplates } from '../scripts/lib/site-template-catalog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const inventory = JSON.parse(fs.readFileSync(new URL('../meta/migration-inventory.json', import.meta.url)));
const repairs = loadContentRepairs(root, inventory);
const templates = loadSiteTemplates();
const plan = JSON.parse(fs.readFileSync(new URL('../meta/migration-waves/b3e.json', import.meta.url)));

test('B3E browser, detail and download data use canonical bytes and stable IDs', () => {
  for (const asset of plan.assets) {
    const id = path.basename(asset.source, '.md');
    const matches = templates.filter(template => template.id === id);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].path, asset.destination);
    assert.ok(contentHashMatches(matches[0].content, asset.destination, asset.pre_move_sha256, repairs));
    assert.equal(matches[0].content, fs.readFileSync(path.join(root, asset.destination), 'utf8'));
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

test('all executed migrations expose exactly their recorded current bodies', () => {
  for (const move of inventory.moves.filter(move => move.action === 'executed-move-with-legacy-pointer')) {
    const matches = templates.filter(template => template.path === move.destination);
    assert.equal(matches.length, 1, move.destination);
    assert.ok(contentHashMatches(matches[0].content, move.destination,
      move.execution.pre_move_source_sha256, repairs), move.destination);
  }
});
