import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateDomainNavigation } from '../scripts/validate-domain-navigation.mjs';

const domains = ['Stakeholder', 'Team', 'Delivery', 'Planning', 'Uncertainty', 'Measurement'];

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'domain-navigation-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const mappings = [];
  const records = [];
  const rootLinks = [];
  for (const domain of domains) {
    const slug = domain.toLowerCase();
    const dir = path.join(root, 'domains', slug);
    fs.mkdirSync(dir, { recursive: true });
    const links = [];
    for (let index = 1; index <= 3; index += 1) {
      const relative = `domains/${slug}/asset-${index}.md`;
      fs.writeFileSync(path.join(root, relative), `# ${domain} ${index}\n`);
      mappings.push({ path: relative, domain: { primary: domain } });
      records.push({ path: relative });
      links.push(`[Asset ${index}](asset-${index}.md)`);
    }
    fs.writeFileSync(path.join(dir, 'README.md'), `# ${domain}\n\n${links.join('\n')}\n`);
    rootLinks.push(`[${domain}](domains/${slug}/)`);
  }
  fs.writeFileSync(path.join(root, 'README.md'), rootLinks.join('\n'));
  fs.mkdirSync(path.join(root, 'meta'));
  fs.writeFileSync(path.join(root, 'meta/domain-mapping.json'), JSON.stringify({ mappings }));
  fs.writeFileSync(path.join(root, 'meta/cross-references.json'), JSON.stringify({ denominator: 18, covered: 18, records }));
  return root;
}

test('accepts six findable domains with three mapped starts each', t => {
  const root = fixture(t);
  assert.deepEqual(validateDomainNavigation(root).errors, []);
});

test('rejects missing landing pages and broken or cross-domain starts', t => {
  const root = fixture(t);
  fs.rmSync(path.join(root, 'domains/team/README.md'));
  fs.writeFileSync(path.join(root, 'domains/planning/README.md'), '# Planning\n\n[Wrong](../team/asset-1.md)\n[Missing](missing.md)\n');
  const errors = validateDomainNavigation(root).errors.join('\n');
  assert.match(errors, /Team: missing/);
  assert.match(errors, /Planning: broken/);
  assert.match(errors, /Planning: landing page links 0/);
});

test('rejects prose and malformed root links but accepts normalized hrefs', t => {
  const root = fixture(t);
  const file = path.join(root, 'README.md');
  const original = fs.readFileSync(file, 'utf8');
  for (const replacement of ['domains/stakeholder/', '[Stakeholder](domains/stakeholder/']) {
    fs.writeFileSync(file, original.replace('[Stakeholder](domains/stakeholder/)', replacement));
    assert.match(validateDomainNavigation(root).errors.join('\n'), /Stakeholder: root README does not link/);
  }
  fs.writeFileSync(file, original.replace('(domains/stakeholder/)', '(./domains/stakeholder/)'));
  assert.deepEqual(validateDomainNavigation(root).errors, []);
});

test('checks non-starting assets despite reported full coverage', t => {
  const root = fixture(t);
  const file = path.join(root, 'meta/domain-mapping.json');
  const mapping = JSON.parse(fs.readFileSync(file, 'utf8'));
  const asset = 'domains/team/asset-4.md';
  fs.writeFileSync(path.join(root, asset), '# Fourth team asset\n');
  mapping.mappings.push({ path: asset, domain: { primary: 'Team' } });
  fs.writeFileSync(file, JSON.stringify(mapping));
  const crossFile = path.join(root, 'meta/cross-references.json');
  const cross = JSON.parse(fs.readFileSync(crossFile, 'utf8'));
  cross.covered = cross.denominator = 19;
  fs.writeFileSync(crossFile, JSON.stringify(cross));
  assert.match(validateDomainNavigation(root).errors.join('\n'), /Mapped asset lacks workflow cross-reference: domains\/team\/asset-4.md/);
  cross.records.push({ path: 'unrelated.md' });
  fs.writeFileSync(crossFile, JSON.stringify(cross));
  assert.match(validateDomainNavigation(root).errors.join('\n'), /Workflow cross-reference has unmapped path: unrelated.md/);
  cross.records[cross.records.length - 1] = { path: `./${asset}` };
  fs.writeFileSync(crossFile, JSON.stringify(cross));
  assert.deepEqual(validateDomainNavigation(root).errors, []);
});
