#!/usr/bin/env node
// Single consumer/producer for .github/ci-coverage.json. See that file's _readme
// for the coverage-contract shape. Subcommands:
//   list-apps            -> JSON array of app keys, for the sub-app-checks matrix
//   app-config <key>     -> JSON config for one app (path + checks)
//   validate-inventory   -> discovers package.json manifests on disk and reconciles
//                           them against apps / covered_elsewhere / excluded in the
//                           coverage file; exits non-zero on any unreconciled manifest
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const coveragePath = join(repoRoot, '.github', 'ci-coverage.json');
const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'coverage',
  'health-reports', '.astro', 'test-results', 'playwright-report',
]);

function discoverManifests(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      discoverManifests(full, out);
    } else if (entry.isFile() && entry.name === 'package.json') {
      out.push(relative(repoRoot, dir) || '.');
    }
  }
  return out;
}

function coveredPaths() {
  const apps = Object.values(coverage.apps).map((a) => a.path);
  const elsewhere = coverage.covered_elsewhere.map((e) => e.path);
  const excluded = coverage.excluded.map((e) => e.path);
  return { apps, elsewhere, excluded };
}

function yamlQuote(str) {
  return `'${str.replace(/'/g, "''")}'`;
}

const [, , cmd, arg] = process.argv;

if (cmd === 'list-apps') {
  console.log(JSON.stringify(Object.keys(coverage.apps)));
} else if (cmd === 'gen-path-filters') {
  // Emits dorny/paths-filter YAML filter definitions, single-sourced from
  // ci-coverage.json's app paths and shared_paths, so the matrix's app list
  // and the change-detection filters can never drift apart.
  const lines = [];
  for (const [key, app] of Object.entries(coverage.apps)) {
    lines.push(`${key}: [ ${yamlQuote(`${app.path}/**`)} ]`);
  }
  const sharedList = coverage.shared_paths.map(yamlQuote).join(', ');
  lines.push(`shared: [ ${sharedList} ]`);
  console.log(lines.join('\n'));
} else if (cmd === 'app-path') {
  const app = coverage.apps[arg];
  if (!app) {
    console.error(`Unknown app key: ${arg}`);
    process.exit(1);
  }
  console.log(app.path);
} else if (cmd === 'app-config') {
  const app = coverage.apps[arg];
  if (!app) {
    console.error(`Unknown app key: ${arg}`);
    process.exit(1);
  }
  console.log(JSON.stringify({ key: arg, node_version: coverage.node_version, ...app }));
} else if (cmd === 'validate-inventory') {
  const discovered = discoverManifests(repoRoot).filter((p) => p !== '.');
  const { apps, elsewhere, excluded } = coveredPaths();
  const known = new Set([...apps, ...elsewhere, ...excluded]);
  const unreconciled = discovered.filter((p) => !known.has(p));

  // Also detect the inverse drift: an "apps" entry pointing at a path that no
  // longer has a package.json on disk (stale coverage entry). covered_elsewhere
  // entries are not checked here: they may legitimately point at a path with
  // no package.json (e.g. integrations/webhook-framework, tested from the repo
  // root per CLAUDE.md) or be covered by a mechanism outside this scan.
  const discoveredSet = new Set(discovered);
  const stale = apps.filter((p) => !discoveredSet.has(p));

  if (unreconciled.length > 0 || stale.length > 0) {
    if (unreconciled.length > 0) {
      console.error('Discovered package.json manifests with no coverage mapping or documented exclusion:');
      for (const p of unreconciled) console.error(`  - ${p}`);
    }
    if (stale.length > 0) {
      console.error('Coverage entries pointing at a path with no package.json on disk (stale entry):');
      for (const p of stale) console.error(`  - ${p}`);
    }
    console.error('\nEvery code project must be added to "apps", "covered_elsewhere", or "excluded" in .github/ci-coverage.json (with a reason), and every entry must point at a real, current path.');
    process.exit(1);
  }
  console.log(`Inventory validated: ${discovered.length} manifests, all reconciled (apps=${apps.length}, covered_elsewhere=${elsewhere.length}, excluded=${excluded.length}).`);
} else {
  console.error('Usage: ci-coverage.mjs {list-apps|gen-path-filters|app-path <key>|app-config <key>|validate-inventory}');
  process.exit(2);
}
