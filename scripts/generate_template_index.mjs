import fs from 'fs';
import path from 'path';

// Config
const ROOT = process.cwd();
const TEMPLATES_JSON = path.join(ROOT, 'templates', 'templates.json');
const OUTPUT = path.join(ROOT, 'TEMPLATE_INDEX.md');

function loadTemplates() {
  const raw = fs.readFileSync(TEMPLATES_JSON, 'utf-8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.templates)) {
    throw new Error('Invalid templates.json: missing templates array');
  }
  return data.templates;
}

function pickCanonicalPath(paths) {
  // Priority order for canonical path selection
  const priority = [
    /^templates\//i,
    /^role-based-toolkits\//i,
    /^project-lifecycle\//i,
    /^methodology-frameworks\//i,
  ];
  for (const re of priority) {
    const p = paths.find(p => re.test(p));
    if (p) return p;
  }
  return paths[0];
}

function groupByTitle(templates) {
  const map = new Map();
  for (const t of templates) {
    const key = String(t.title || '').trim().toLowerCase();
    if (!key) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(t);
  }
  return map;
}

function buildIndexRows(templatesByTitle) {
  const rows = [];
  const keys = Array.from(templatesByTitle.keys()).sort();
  for (const key of keys) {
    const list = templatesByTitle.get(key);
    // Select canonical entry
    const canonical = (() => {
      // sort by path priority
      const sorted = [...list].sort((a, b) => {
        const aP = a.path || '';
        const bP = b.path || '';
        const rank = p => (
          /^templates\//i.test(p) ? 0 :
          /^role-based-toolkits\//i.test(p) ? 1 :
          /^project-lifecycle\//i.test(p) ? 2 :
          /^methodology-frameworks\//i.test(p) ? 3 : 9
        );
        return rank(aP) - rank(bP) || aP.localeCompare(bP);
      });
      return sorted[0];
    })();
    const title = canonical.title || '(Untitled)';
    const methodology = (canonical.methodology || 'universal').toLowerCase();
    const complexity = (canonical.complexity || 'not specified').toLowerCase();
    const updated = canonical.updated || 'Not specified';
    const link = canonical.path;
    rows.push(`| ${title} | ${methodology} | ${complexity} | ${updated} | [View](${link}) |`);
  }
  return rows;
}

function generate() {
  const templates = loadTemplates();
  const byTitle = groupByTitle(templates);
  const header = [
    '# Template Index',
    '',
    '> A comprehensive directory of all project management templates in this repository.',
    '',
    'Note: Each entry links to the canonical template location. Where multiple variants exist, the canonical path is preferred; alternate variants may be listed in the template’s Related section.',
    '',
    '## 📋 All Templates',
    '',
    '| Template | Methodology | Complexity | Updated | Link |',
    '|----------|-------------|------------|---------|------|',
  ];
  const rows = buildIndexRows(byTitle);
  const content = header.concat(rows).join('\n') + '\n';
  fs.writeFileSync(OUTPUT, content, 'utf-8');
  console.log(`Generated ${OUTPUT} with ${rows.length} canonical entries.`);
}

try {
  generate();
} catch (err) {
  console.error('Failed to generate TEMPLATE_INDEX:', err);
  process.exit(1);
}

