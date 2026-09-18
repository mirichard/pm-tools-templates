#!/usr/bin/env node
/*
Validates canonical_path and alternate_paths in templates/templates.json.
- Ensures canonical_path exists on disk when present
- Ensures each alternate path exists
- Warns when path differs from canonical_path
- Optionally can print a summary for TEMPLATE_INDEX.md maintenance

Usage:
  node scripts/validate-canonical-paths.js [--strict]

Exit codes:
  0 = ok
  1 = validation errors
*/
const fs = require('fs');
const path = require('path');

const STRICT = process.argv.includes('--strict');

function loadJson(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read ${file}:`, e.message);
    process.exit(1);
  }
}

function exists(fp) {
  try {
    return fs.existsSync(fp);
  } catch {
    return false;
  }
}

function main() {
  const jsonPath = path.resolve('templates/templates.json');
  if (!exists(jsonPath)) {
    console.error('templates/templates.json not found');
    process.exit(1);
  }
  const db = loadJson(jsonPath);
  const list = Array.isArray(db) ? db : (db.templates || []);
  const errors = [];
  const warnings = [];

  for (const t of list) {
    const id = t.title || t.name || t.path || 'unknown';
    const canonical = t.canonical_path || null;
    const alt = Array.isArray(t.alternate_paths) ? t.alternate_paths : [];
    const primaryPath = canonical || t.path;

    if (!primaryPath) {
      warnings.push(`[WARN] ${id}: no path nor canonical_path`);
      continue;
    }

    if (canonical) {
      if (!exists(path.resolve(canonical))) {
        errors.push(`[ERROR] ${id}: canonical_path not found: ${canonical}`);
      }
      // If both path and canonical_path present but differ, warn
      if (t.path && t.path !== canonical) {
        warnings.push(`[WARN] ${id}: path differs from canonical_path (path=${t.path}, canonical=${canonical})`);
      }
    } else if (!exists(path.resolve(primaryPath))) {
      errors.push(`[ERROR] ${id}: path not found: ${primaryPath}`);
    }

    for (const a of alt) {
      if (!exists(path.resolve(a))) {
        warnings.push(`[WARN] ${id}: alternate path not found: ${a}`);
      }
    }
  }

  // Output report
  console.log('Canonical Path Validation Report');
  console.log('================================');
  console.log(`Total entries: ${list.length}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);

  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(' - ' + e));
  }
  if (warnings.length) {
    console.log('\nWarnings:');
    warnings.forEach(w => console.log(' - ' + w));
  }

  if (STRICT && errors.length) process.exit(1);
  process.exit(0);
}

main();

