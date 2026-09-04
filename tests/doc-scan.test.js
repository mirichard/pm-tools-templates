const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const scanner = path.join(repoRoot, 'scripts', 'doc-scan.js');

function fixture(files, setup) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-scan-'));
  for (const [relativePath, content] of Object.entries(files)) {
    const target = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  if (setup) setup(root);
  return root;
}

function run(root) {
  const result = spawnSync(process.execPath, [scanner], {
    cwd: root,
    encoding: 'utf8'
  });
  const statsPath = path.join(root, 'scan-stats.json');
  const sarifPath = path.join(root, 'doc-scan.sarif');
  return {
    ...result,
    stats: fs.existsSync(statsPath) ? JSON.parse(fs.readFileSync(statsPath, 'utf8')) : null,
    sarif: fs.existsSync(sarifPath) ? JSON.parse(fs.readFileSync(sarifPath, 'utf8')) : null
  };
}

test('scans a known-safe source fixture and writes evidence', t => {
  const root = fixture({ 'guide.md': '# Project management template\nSafe guidance.\n' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const result = run(root);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.stats.filesScanned, 1);
  assert.equal(result.stats.scanErrors, 0);
  assert.deepEqual(result.sarif.runs[0].results, []);
});

test('reports security findings with a deterministic exit', t => {
  const root = fixture({ 'guide.md': '# Project management template\nConnect to 192.168.1.42.\n' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const result = run(root);
  assert.equal(result.status, 3, result.stderr || result.stdout);
  assert.equal(result.stats.securityIssues, 1);
  assert.equal(result.stats.relevanceIssues, 0);
  assert.equal(result.sarif.runs[0].results[0].ruleId, 'doc-sec-privateIP');
});

test('returns a mixed-findings exit when both classes are present', t => {
  const root = fixture({ 'notes.md': '# Notes\nConnect to 192.168.1.42.\n' });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const result = run(root);
  assert.equal(result.status, 4, result.stderr || result.stdout);
  assert.equal(result.stats.securityIssues, 1);
  assert.equal(result.stats.relevanceIssues, 1);
});

test('excludes generated test artifacts and file-shaped directories', t => {
  const root = fixture({
    'guide.md': '# Project management template\nSafe guidance.\n',
    'cypress/screenshots/generated.md': 'password=exposed\n'
  }, fixtureRoot => {
    fs.mkdirSync(path.join(fixtureRoot, 'cypress', 'screenshots', 'cross-browser.cy.js'));
  });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const result = run(root);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(result.stats.filesScanned, 1);
  assert.doesNotMatch(result.stderr, /EISDIR|Error scanning/);
});

test('returns scanner-error exit for invalid scanner configuration', t => {
  const root = fixture({
    'guide.md': '# Project management template\nSafe guidance.\n',
    'doc-sec-allowlist.txt': '[invalid-regex'
  });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Fatal error/);
  assert.equal(result.sarif, null);
});
