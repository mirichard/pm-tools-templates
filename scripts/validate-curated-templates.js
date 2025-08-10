#!/usr/bin/env node
/*
 Validates templates/templates.json shape.
 Requirements:
 - File exists
 - templates is an array
 - Each item has required fields: path OR canonical_path, and title
 - Optional fields are type-checked when present
 Exits non-zero on failure with human-readable messages.
*/

const fs = require('fs');
const path = require('path');

function fail(msg) {
  console.error(`❌ templates.json validation failed: ${msg}`);
  process.exit(1);
}

function warn(msg) {
  console.warn(`⚠️  ${msg}`);
}

(function main() {
  const root = process.cwd();
  const jsonPath = path.join(root, 'templates', 'templates.json');
  if (!fs.existsSync(jsonPath)) {
    fail('templates/templates.json not found');
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } catch (e) {
    fail(`templates/templates.json is not valid JSON: ${e.message}`);
  }

  const list = Array.isArray(data) ? data : data.templates;
  if (!Array.isArray(list)) {
    fail('Missing templates array (expected either a top-level array or an object with a templates array)');
  }

  if (list.length === 0) {
    warn('templates array is empty');
  }

  // Validate each entry
  let errors = 0;
  const titleMap = new Map(); // normalized title -> [indexes]
  const allowedRoots = new Set([
    'templates',
    'role-based-toolkits',
    'project-lifecycle',
    'methodology-frameworks',
    'industry-specializations',
    'business-stakeholder-suite',
    'project-assessment-suite',
  ]);
  const rootDir = process.cwd();

  list.forEach((item, idx) => {
    const where = `templates[${idx}]`;
    if (typeof item !== 'object' || item === null) {
      console.error(`- ${where} is not an object`);
      errors++;
      return;
    }

    const pathField = item.canonical_path || item.path;
    if (!pathField || typeof pathField !== 'string') {
      console.error(`- ${where} missing required field: path or canonical_path (string)`);
      errors++;
    } else {
      const abs = path.resolve(rootDir, pathField);
      // Ensure no path traversal outside repo
      if (!abs.startsWith(rootDir)) {
        console.error(`- ${where} path escapes repository root: ${pathField}`);
        errors++;
      } else {
        if (!fs.existsSync(abs)) {
          console.error(`- ${where} path does not exist on disk: ${pathField}`);
          errors++;
        } else {
          const stat = fs.statSync(abs);
          if (!stat.isFile()) {
            console.error(`- ${where} path is not a file: ${pathField}`);
            errors++;
          }
        }
        // Check allowed roots
        const rel = path.relative(rootDir, abs).replace(/\\/g, '/');
        const top = rel.split('/')[0] || '';
        if (!allowedRoots.has(top)) {
          console.error(`- ${where} top-level folder "${top}" is not in allowed roots: ${Array.from(allowedRoots).join(', ')}`);
          errors++;
        }
      }
    }

    if (!item.title || typeof item.title !== 'string') {
      console.error(`- ${where} missing required field: title (string)`);
      errors++;
    } else {
      const title = String(item.title).trim();
      if (title.length < 3 || title.length > 120) {
        console.error(`- ${where} title length out of bounds (3-120): "${title}"`);
        errors++;
      }
      const normTitle = title.toLowerCase();
      if (!titleMap.has(normTitle)) titleMap.set(normTitle, []);
      titleMap.get(normTitle).push(idx);
    }

    if (item.tags && !Array.isArray(item.tags)) {
      console.error(`- ${where} has invalid tags: expected array of strings`);
      errors++;
    }

    if (item.tags && Array.isArray(item.tags)) {
      const bad = item.tags.find(t => typeof t !== 'string');
      if (bad !== undefined) {
        console.error(`- ${where} has non-string tag value`);
        errors++;
      }
    }

    if (item.methodology && typeof item.methodology !== 'string') {
      console.error(`- ${where} methodology must be a string when present`);
      errors++;
    } else if (typeof item.methodology === 'string') {
      const allowedMethods = new Set(['agile', 'hybrid', 'traditional', 'universal']);
      const m = item.methodology.trim().toLowerCase();
      if (!allowedMethods.has(m)) {
        console.error(`- ${where} methodology must be one of ${Array.from(allowedMethods).join(', ')} (got: ${item.methodology})`);
        errors++;
      }
    }

    if (item.updated && typeof item.updated !== 'string') {
      console.error(`- ${where} updated must be a string when present (YYYY-MM-DD)`);
      errors++;
    }

    if (item.lastModified && typeof item.lastModified !== 'string') {
      console.error(`- ${where} lastModified must be a string when present (YYYY-MM-DD)`);
      errors++;
    }

    if (item.size && typeof item.size !== 'number') {
      console.error(`- ${where} size must be a number when present (bytes)`);
      errors++;
    }

    if (item.qualityScore && typeof item.qualityScore !== 'number') {
      console.error(`- ${where} qualityScore must be a number when present`);
      errors++;
    }
  });

  // Duplicate title detection
  for (const [normTitle, indexes] of titleMap.entries()) {
    if (indexes.length > 1) {
      console.error(`- Duplicate title detected: "${normTitle}" at entries ${indexes.join(', ')}`);
      errors++;
    }
  }

  if (errors > 0) {
    fail(`${errors} error(s) found in templates entries`);
  }

  // Produce GitHub Actions job summary if available
  try {
    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryPath) {
      const byMethod = new Map();
      let unspecified = 0;
      for (const item of list) {
        let m = 'unspecified';
        if (item && typeof item.methodology === 'string' && item.methodology.trim()) {
          m = item.methodology.trim().toLowerCase();
        } else if (item && (item.methodology === '' || item.methodology === undefined)) {
          m = 'unspecified';
        }
        byMethod.set(m, (byMethod.get(m) || 0) + 1);
      }
      const total = list.length;
      const rows = Array.from(byMethod.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      let md = '';
      md += `## Curated Templates Summary\n`;
      md += `\n`;
      md += `Total templates: **${total}**\n`;
      md += `\n`;
      md += `| Methodology | Count |\n`;
      md += `|-------------|-------|\n`;
      for (const [method, count] of rows) {
        md += `| ${method} | ${count} |\n`;
      }
      md += `\n`;
      fs.appendFileSync(summaryPath, md, 'utf-8');
    }
  } catch (e) {
    // Non-fatal for summary failure
    console.warn(`⚠️  Failed to write GitHub Actions summary: ${e.message}`);
  }

  console.log(`✅ templates/templates.json is valid (${list.length} templates)`);
})();

