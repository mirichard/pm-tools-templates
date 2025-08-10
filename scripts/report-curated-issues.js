#!/usr/bin/env node
/*
Reports curated index issues without modifying files:
- Duplicate titles (with indexes, paths, methodologies)
- Non-standard methodologies with suggestions
*/
const fs = require('fs');
const path = require('path');

function main() {
  const root = process.cwd();
  const jsonPath = path.join(root, 'templates', 'templates.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('templates/templates.json not found');
    process.exit(1);
  }
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);
  const list = Array.isArray(data) ? data : (data.templates || []);
  const norm = (s) => String(s || '').trim().toLowerCase();
  const allowed = new Set(['agile', 'hybrid', 'traditional', 'universal']);

  // Collect duplicates
  const byTitle = new Map();
  list.forEach((t, i) => {
    const title = norm(t.title);
    if (!byTitle.has(title)) byTitle.set(title, []);
    byTitle.get(title).push({ i, path: t.canonical_path || t.path, methodology: t.methodology || '' });
  });
  const duplicates = Array.from(byTitle.entries()).filter(([, arr]) => arr.length > 1);

  // Collect non-standard methodologies
  const nonStandard = [];
  list.forEach((t, i) => {
    const m = typeof t.methodology === 'string' ? norm(t.methodology) : '';
    if (m && !allowed.has(m)) {
      let suggestion = '';
      if (m === 'scrum' || m === 'safe' || m === 'saFe') suggestion = 'agile';
      if (m === 'pmbok' || m === 'waterfall') suggestion = 'traditional';
      nonStandard.push({ i, value: t.methodology, suggestion });
    }
  });

  // Output report
  console.log('=== Curated Templates Report ===');
  console.log('Total entries:', list.length);
  console.log('\nDuplicate titles:', duplicates.length);
  duplicates.slice(0, 100).forEach(([title, arr]) => {
    console.log(`- ${title} (${arr.length})`);
    arr.forEach((e) => console.log(`  • [${e.i}] ${e.path} | methodology=${e.methodology || ''}`));
  });
  if (duplicates.length > 100) {
    console.log(`... and ${duplicates.length - 100} more`);
  }

  console.log('\nNon-standard methodologies:', nonStandard.length);
  nonStandard.forEach((n) => {
    console.log(`- [${n.i}] '${n.value}'${n.suggestion ? ` -> suggest: ${n.suggestion}` : ''}`);
  });
}

try { main(); } catch (e) { console.error('Failed to build report:', e.message); process.exit(1); }

