#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function loadIndex(root) {
  const idxPath = path.join(root, 'templates', 'templates.json');
  const raw = fs.readFileSync(idxPath, 'utf-8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.templates)) throw new Error('Invalid templates.json: missing templates array');
  return data.templates;
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.split('=');
      const key = k.replace(/^--/, '');
      if (typeof v === 'undefined') {
        // flags without equals consume next token if present and not another flag
        if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
          args[key] = argv[++i];
        } else {
          args[key] = true;
        }
      } else {
        args[key] = v;
      }
    }
  }
  return args;
}

function filterTemplates(list, filters) {
  let out = list;
  const q = (filters.search || '').toLowerCase();
  const meth = (filters.methodology || '').toLowerCase();
  const comp = (filters.complexity || '').toLowerCase();
  const tagf = (filters.tags || '').toLowerCase();

  if (q) {
    out = out.filter(t =>
      (t.title || '').toLowerCase().includes(q) ||
      (t.path || '').toLowerCase().includes(q)
    );
  }
  if (meth) {
    out = out.filter(t => (t.methodology || '').toLowerCase() === meth);
  }
  if (comp) {
    out = out.filter(t => (t.complexity || '').toLowerCase() === comp);
  }
  if (tagf) {
    out = out.filter(t => Array.isArray(t.tags) && t.tags.some(tag => String(tag).toLowerCase().includes(tagf)));
  }
  return out;
}

function printList(list, root) {
  if (!list.length) {
    console.log('No templates matched.');
    return;
  }
  for (const t of list) {
    const cols = [
      t.title || '(Untitled)',
      t.methodology || 'universal',
      t.complexity || 'n/a',
      t.updated || 'n/a',
      t.path,
    ];
    console.log(cols.join(' | '));
  }
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function injectFrontMatter(srcContent, kvPairs) {
  // kvPairs is { key: value }
  if (!kvPairs || Object.keys(kvPairs).length === 0) return srcContent;
  const yamlBlock = Object.entries(kvPairs)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  if (srcContent.startsWith('---\n')) {
    // Insert before existing closing ---
    const end = srcContent.indexOf('\n---', 4);
    if (end !== -1) {
      const head = srcContent.slice(0, end);
      const tail = srcContent.slice(end);
      return `${head}\n${yamlBlock}${tail}`;
    }
  }
  // Prepend a new YAML front matter block
  return `---\n${yamlBlock}\n---\n\n${srcContent}`;
}

function parseInjection(str) {
  // format: key=value,key2=value2
  const obj = {};
  if (!str) return obj;
  const parts = str.split(',');
  for (const p of parts) {
    const [k, ...rest] = p.split('=');
    if (!k) continue;
    obj[k.trim()] = rest.join('=').trim();
  }
  return obj;
}

function main() {
  const root = process.cwd();
  const args = parseArgs(process.argv);
  const list = loadIndex(root);
  const filtered = filterTemplates(list, args);

  if (args.list || (!args.copy && !args.title)) {
    console.log('Title | Methodology | Complexity | Updated | Path');
    console.log('----- | ----------- | ---------- | ------- | ----');
    return printList(filtered, root);
  }

  // Copy mode: --title="Exact Title" --dest=./out --inject="project_name=Acme,owner=Jane Doe"
  const title = args.title;
  const dest = args.dest || '.';
  if (!title) {
    console.error('Error: --title is required for copy mode');
    process.exit(1);
  }
  const matches = filtered.filter(t => (t.title || '').toLowerCase() === String(title).toLowerCase());
  if (!matches.length) {
    console.error('No template found with title:', title);
    process.exit(2);
  }
  // Prefer canonical path like earlier generator priority
  const ordered = matches.sort((a, b) => {
    const rank = p => (/^templates\//i.test(p) ? 0 : /^role-based-toolkits\//i.test(p) ? 1 : /^project-lifecycle\//i.test(p) ? 2 : /^methodology-frameworks\//i.test(p) ? 3 : 9);
    return rank(a.path) - rank(b.path) || a.path.localeCompare(b.path);
  });
  const choice = ordered[0];
  const srcPath = path.join(root, choice.path);
  if (!fs.existsSync(srcPath)) {
    console.error('Source file not found:', srcPath);
    process.exit(3);
  }
  const baseName = path.basename(srcPath);
  const dstDir = path.resolve(dest);
  ensureDir(dstDir);
  const dstPath = path.join(dstDir, baseName);
  let content = fs.readFileSync(srcPath, 'utf-8');
  const injectObj = parseInjection(args.inject || '');
  if (Object.keys(injectObj).length) {
    content = injectFrontMatter(content, injectObj);
  }
  fs.writeFileSync(dstPath, content, 'utf-8');
  console.log('Copied:', choice.title, '\nFrom:', choice.path, '\nTo  :', dstPath);
}

try { main(); } catch (err) {
  console.error('template-selector error:', err);
  process.exit(1);
}

