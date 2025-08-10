#!/usr/bin/env node
/*
Fixer (non-destructive):
- Normalizes methodology values (scrum/safe -> agile, pmbok/waterfall -> traditional, titlecase -> lowercase)
- De-duplicates entries by title, keeping a canonical entry using path priority
- Writes proposed result to templates/templates.proposed.json
- Prints a summary of changes
*/
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const INPUT = path.join(ROOT, 'templates', 'templates.json');
const OUTPUT = path.join(ROOT, 'templates', 'templates.proposed.json');

const allowedMethods = new Set(['agile', 'hybrid', 'traditional', 'universal']);
function normalizeMethod(m) {
  if (!m || typeof m !== 'string') return m;
  const s = m.trim().toLowerCase();
  if (s === 'scrum' || s === 'safe') return 'agile';
  if (s === 'pmbok' || s === 'waterfall') return 'traditional';
  if (allowedMethods.has(s)) return s;
  return s; // leave unknowns for validator to catch if still invalid
}

function rankPath(p) {
  const top = (p || '').split(/[\\/]/)[0].toLowerCase();
  if (top === 'templates') return 0;
  if (top === 'role-based-toolkits') return 1;
  if (top === 'project-lifecycle') return 2;
  if (top === 'methodology-frameworks') return 3;
  if (top === 'business-stakeholder-suite') return 4;
  if (top === 'industry-specializations') return 5;
  if (top === 'project-assessment-suite') return 6;
  return 9;
}

function pickCanonical(entries) {
  // prefer entry with canonical_path if present
  const withCanonical = entries.find(e => e.canonical_path);
  if (withCanonical) return withCanonical;
  // otherwise sort by path priority, then shorter path, then alphabetically
  const sorted = [...entries].sort((a, b) => {
    const ap = a.canonical_path || a.path || '';
    const bp = b.canonical_path || b.path || '';
    const ra = rankPath(ap);
    const rb = rankPath(bp);
    if (ra !== rb) return ra - rb;
    if (ap.length !== bp.length) return ap.length - bp.length;
    return ap.localeCompare(bp);
  });
  return sorted[0];
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('templates/templates.json not found');
    process.exit(1);
  }
  const raw = fs.readFileSync(INPUT, 'utf-8');
  const data = JSON.parse(raw);
  const list = Array.isArray(data) ? data : (data.templates || []);

  const changes = { methods: 0, duplicatesRemoved: 0 };

  // Normalize methodologies
  for (const t of list) {
    if (typeof t.methodology === 'string') {
      const before = t.methodology;
      const after = normalizeMethod(before);
      if (after !== before) {
        t.methodology = after;
        changes.methods++;
      }
    }
  }

  // De-duplicate by normalized title
  const byTitle = new Map();
  list.forEach((t) => {
    const key = String(t.title || '').trim().toLowerCase();
    if (!byTitle.has(key)) byTitle.set(key, []);
    byTitle.get(key).push(t);
  });

  const deduped = [];
  const removed = [];

  for (const [title, entries] of byTitle.entries()) {
    if (entries.length === 1) {
      deduped.push(entries[0]);
      continue;
    }
    const keep = pickCanonical(entries);
    deduped.push(keep);
    for (const e of entries) {
      if (e !== keep) removed.push({ title, path: e.canonical_path || e.path, kept: keep.canonical_path || keep.path });
    }
  }

  changes.duplicatesRemoved = removed.length;

  // Build output structure preserving top-level if present
  let out;
  if (Array.isArray(data)) {
    out = deduped;
  } else {
    out = { ...data, templates: deduped, totalTemplates: deduped.length };
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2), 'utf-8');

  // Summary
  console.log('=== Proposed Curated Fixes ===');
  console.log('Methodologies normalized:', changes.methods);
  console.log('Duplicate entries removed:', changes.duplicatesRemoved);
  if (removed.length) {
    console.log('\nRemoved entries (title | removed path -> kept path):');
    for (const r of removed) {
      console.log(`- ${r.title} | ${r.path} -> ${r.kept}`);
    }
  }
  console.log(`\nWrote proposed file: ${path.relative(ROOT, OUTPUT)}`);
}

try { main(); } catch (e) { console.error('Fixer failed:', e); process.exit(1); }

