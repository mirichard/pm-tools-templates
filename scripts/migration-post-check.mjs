#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SUPPORTED_ACTIONS = new Set(['planned-move-not-executed', 'executed-move-with-legacy-pointer']);
const CATALOG_FILE = 'templates/templates.json';
const DEFAULT_POLICY = {
  historical_prefixes: [
    'meta/architecture-research/',
    'meta/migration-waves/',
    'docs/vnext/',
    'docs/archive/'
  ],
  intentional_exact_files: [
    'meta/migration-inventory.json',
    'templates/templates.proposed.json'
  ]
};

const normalize = value => String(value || '').replaceAll('\\', '/').replace(/^\.\//, '');
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function isProbablyTextFile(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const buffer = Buffer.alloc(8192);
    const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, 0);
    for (let index = 0; index < bytesRead; index += 1) {
      if (buffer[index] === 0) return false;
    }
    return true;
  } finally {
    fs.closeSync(fd);
  }
}

function walk(root, relative = '') {
  const current = path.join(root, relative);
  const entries = fs.readdirSync(current, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'coverage') continue;
    const rel = normalize(path.join(relative, entry.name));
    if (entry.isDirectory()) files.push(...walk(root, rel));
    else if (isProbablyTextFile(path.join(root, rel))) files.push(rel);
  }
  return files;
}

function isHistoricalOrIntentional(file, policy) {
  const normalized = normalize(file);
  if ((policy.intentional_exact_files || []).map(normalize).includes(normalized)) return true;
  return (policy.historical_prefixes || []).map(normalize).some(prefix => normalized.startsWith(prefix));
}

function readJson(root, relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
}

function containsPathReference(content, target) {
  const source = escapeRegex(normalize(target));
  const boundaryBefore = '(^|[\\s"\'`(<>=])';
  const optionalRelativePrefix = '(?:(?:\\.\\./)+|\\./|/)?';
  const boundaryAfter = '(?=$|[\\s"\'`)>,;:#?\\]\\}])';
  return new RegExp(`${boundaryBefore}${optionalRelativePrefix}${source}${boundaryAfter}`, 'm').test(content);
}

function validateCatalog(catalog, executed) {
  const errors = [];
  if (!Array.isArray(catalog?.templates)) {
    return [`${CATALOG_FILE}: templates must be an array`];
  }

  const executedBySource = new Map(executed.map(move => [normalize(move.source), move]));
  const catalogRecords = [];

  const inspectPaths = (value, context) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => inspectPaths(item, `${context}[${index}]`));
      return;
    }
    if (!value || typeof value !== 'object') return;

    for (const [key, child] of Object.entries(value)) {
      if (key === 'alternate_paths') continue;
      if ((key === 'path' || key === 'canonical_path') && typeof child === 'string') {
        const source = normalize(child);
        const move = executedBySource.get(source);
        if (move) errors.push(`${CATALOG_FILE}: ${context}.${key} still uses migrated legacy path ${source}; use ${normalize(move.destination)}`);
      }
      if (child && typeof child === 'object') inspectPaths(child, `${context}.${key}`);
    }
  };

  for (let index = 0; index < catalog.templates.length; index += 1) {
    const record = catalog.templates[index];
    catalogRecords.push(record);
    inspectPaths(record, `templates[${index}]`);
  }

  for (const move of executed) {
    const source = normalize(move.source);
    const destination = normalize(move.destination);
    const record = catalogRecords.find(item =>
      normalize(item?.path) === destination || normalize(item?.canonical_path) === destination
    );
    if (!record) {
      errors.push(`${CATALOG_FILE}: canonical destination ${destination} is missing for executed move ${source}`);
      continue;
    }
    const alternates = Array.isArray(record.alternate_paths) ? record.alternate_paths.map(normalize) : [];
    if (!alternates.includes(source)) {
      errors.push(`${CATALOG_FILE}: canonical destination ${destination} must retain legacy source ${source} in alternate_paths`);
    }
  }

  return errors;
}

export function validatePostMigrationState({ root, inventory, policy = DEFAULT_POLICY, files = null }) {
  const errors = [];
  if (!Array.isArray(inventory?.moves)) return ['meta/migration-inventory.json: moves must be an array'];

  const unsupported = inventory.moves.filter(move => !SUPPORTED_ACTIONS.has(move.action));
  for (const move of unsupported) errors.push(`${move.source}: unsupported migration action ${JSON.stringify(move.action)}`);

  const executed = inventory.moves.filter(move => move.action === 'executed-move-with-legacy-pointer');
  const executedBySource = new Map(executed.map(move => [normalize(move.source), move]));

  for (const move of inventory.moves) {
    const source = normalize(move.source);
    if (!fs.existsSync(path.join(root, source))) errors.push(`${source}: migration source file is missing`);
    for (const affected of move.affected_internal_references || []) {
      const file = normalize(affected);
      if (!fs.existsSync(path.join(root, file))) errors.push(`${file}: affected reference file is missing for ${source}`);
    }
    for (const dependency of move.dependencies || []) {
      const executedTarget = executedBySource.get(normalize(dependency));
      if (executedTarget) {
        errors.push(`${move.source}: dependency still targets migrated legacy path ${dependency}; use ${executedTarget.destination}`);
      }
    }
  }

  const catalogPath = path.join(root, CATALOG_FILE);
  if (!fs.existsSync(catalogPath)) errors.push(`${CATALOG_FILE}: required template catalog is missing`);
  else errors.push(...validateCatalog(readJson(root, CATALOG_FILE), executed));

  const scanFiles = files || walk(root);
  const textCache = new Map();
  const text = file => {
    if (!textCache.has(file)) textCache.set(file, fs.readFileSync(path.join(root, file), 'utf8'));
    return textCache.get(file);
  };

  for (const move of executed) {
    const source = normalize(move.source);
    const destination = normalize(move.destination);
    const sourcePath = path.join(root, source);
    const destinationPath = path.join(root, destination);

    if (!fs.existsSync(destinationPath)) errors.push(`${destination}: canonical destination is missing`);

    if (fs.existsSync(sourcePath)) {
      const pointer = fs.readFileSync(sourcePath, 'utf8').match(/^\s*\*{0,2}Canonical location:?\*{0,2}\s*\[[^\]]+\]\(([^)]+)\)/im);
      if (!pointer?.[1]) errors.push(`${source}: legacy pointer lacks Canonical location link`);
      else {
        const target = pointer[1].split('#')[0].trim().replace(/^<|>$/g, '');
        const resolved = normalize(path.relative(root, path.resolve(path.dirname(sourcePath), target)));
        if (resolved !== destination) errors.push(`${source}: legacy pointer resolves to ${resolved}, expected ${destination}`);
      }
    }

    for (const file of scanFiles) {
      if (file === source || file === CATALOG_FILE || isHistoricalOrIntentional(file, policy)) continue;
      if (containsPathReference(text(file), source)) {
        errors.push(`${file}: maintained reference still uses migrated legacy path ${source}`);
      }
    }

    for (const affected of move.affected_internal_references || []) {
      const file = normalize(affected);
      const fullPath = path.join(root, file);
      if (!fs.existsSync(fullPath) || isHistoricalOrIntentional(file, policy) || file === CATALOG_FILE) continue;
      const content = text(file);
      if (containsPathReference(content, source)) errors.push(`${file}: affected reference was not canonicalized from ${source}`);
      if (file === 'meta/needs-review.md' && !containsPathReference(content, destination)) {
        errors.push(`${file}: generated review index does not contain canonical path ${destination}`);
      }
    }
  }

  return [...new Set(errors)].sort();
}

function main() {
  const root = process.cwd();
  const inventory = readJson(root, 'meta/migration-inventory.json');
  const policyPath = path.join(root, 'meta/migration-reference-policy.json');
  const policy = fs.existsSync(policyPath) ? readJson(root, 'meta/migration-reference-policy.json') : DEFAULT_POLICY;
  const errors = validatePostMigrationState({ root, inventory, policy });
  if (errors.length) {
    console.error(`Migration post-check failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(` - ${error}`);
    process.exit(1);
  }
  const planned = inventory.moves.filter(move => move.action === 'planned-move-not-executed').length;
  const executed = inventory.moves.filter(move => move.action === 'executed-move-with-legacy-pointer').length;
  console.log(`PASS: migration post-check; executed=${executed}, remaining=${planned}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
