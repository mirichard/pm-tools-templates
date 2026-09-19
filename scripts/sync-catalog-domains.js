#!/usr/bin/env node
// Export primary domains without inferring classification from directory names.
const fs = require('node:fs');
const path = require('node:path');

const DOMAINS = new Set(['Stakeholder', 'Team', 'Delivery', 'Planning', 'Uncertainty', 'Measurement']);

function domainResolver(root) {
  const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const mappings = new Map();
  for (const item of read('meta/domain-mapping.json').mappings) {
    if (mappings.has(item.path)) throw new Error(`Duplicate domain mapping: ${item.path}`);
    mappings.set(item.path, item.domain.primary);
  }
  for (const item of read('meta/domain-review-decisions.json').decisions) {
    mappings.set(item.path, item.primary);
  }
  for (const [file, domain] of mappings) {
    if (!DOMAINS.has(domain)) throw new Error(`Invalid mapped domain for ${file}: ${domain}`);
  }

  return item => {
    const paths = [...new Set([item.path, item.canonical_path, ...(item.alternate_paths || [])].filter(Boolean))];
    const matches = new Set(paths.filter(file => mappings.has(file)).map(file => mappings.get(file)));
    if (matches.size > 1) throw new Error(`Conflicting domain mappings for ${item.path}`);
    if (matches.size === 1) return [...matches][0];

    // Unmapped additions must explicitly declare a simple top-level domain scalar.
    const file = item.canonical_path || item.path;
    if (typeof file !== 'string') throw new Error('Catalog entry has no path');
    const absolute = path.resolve(root, file);
    const relative = path.relative(root, absolute);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Path escapes repository: ${file}`);
    const content = fs.readFileSync(absolute, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
    const declarations = frontmatter ? frontmatter[1].split('\n').filter(line => /^domain\s*:/.test(line)) : [];
    const match = declarations.length === 1 && declarations[0].match(/^domain\s*:\s*(?:"([A-Za-z]+)"|'([A-Za-z]+)'|([A-Za-z]+))\s*(?:#.*)?$/);
    const domain = match && (match[1] || match[2] || match[3]);
    if (!DOMAINS.has(domain)) throw new Error(`Missing or invalid explicit domain for ${file}; add a reviewed mapping or domain front matter`);
    return domain;
  };
}

function sync(root, check = false) {
  const file = path.join(root, 'templates/templates.json');
  const original = fs.readFileSync(file, 'utf8');
  const catalog = JSON.parse(original);
  const entries = Array.isArray(catalog) ? catalog : catalog.templates;
  if (!Array.isArray(entries)) throw new Error('Catalog must contain a templates array');
  const resolve = domainResolver(root);
  let changed = 0;
  for (const item of entries) {
    const domain = resolve(item);
    if (item.domain !== domain) {
      changed++;
      item.domain = domain;
    }
  }
  if (check && changed) throw new Error(`${changed} missing or stale catalog domains; run node scripts/sync-catalog-domains.js`);
  if (!check && changed) fs.writeFileSync(file, JSON.stringify(catalog, null, 2) + (original.endsWith('\n') ? '\n' : ''));
  return { total: entries.length, changed };
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--check')) throw new Error('Usage: node scripts/sync-catalog-domains.js [--check]');
    const result = sync(process.cwd(), args.includes('--check'));
    console.log(`Catalog domains: ${result.total} verified, ${result.changed} updated`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { domainResolver, sync };
