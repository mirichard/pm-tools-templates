#!/usr/bin/env node
// Single consumer/producer for .github/ci-coverage.json. See that file's _readme
// for the coverage-contract shape. Subcommands:
//   list-apps            -> JSON array of app keys, for the sub-app-checks matrix
//   app-config <key>     -> JSON config for one app (path + checks)
//   validate-inventory   -> discovers package.json manifests on disk and reconciles
//                           them against apps / covered_elsewhere / excluded in the
//                           coverage file; exits non-zero on any unreconciled manifest
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { validateContract } from './lib/coverage-contract.mjs';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const coveragePath = join(repoRoot, '.github', 'ci-coverage.json');
const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));

// Discovers every *tracked* package.json (via `git ls-files`, NUL-delimited
// so paths containing spaces are handled correctly), not a filesystem walk
// with a name-based skip-list. A package.json only needs to be staged
// (`git add`) to be seen - it does not need to live outside any directory
// whose *name* happens to look generated. The tradeoff, deliberately
// accepted: an untracked manifest is invisible to this check. See
// CONTRIBUTING.md's coverage section.
//
// node_modules is excluded explicitly below, categorically, regardless of
// tracking status: npm's own dependency directory can never contain
// first-party code, by definition of what npm puts there. This is not the
// same kind of heuristic as excluding a directory because its *name* merely
// suggests generated output (e.g. a "build" or "dist" that might contain
// tracked source) - it is excluded on what the directory unambiguously *is*.
// It was tested, not assumed: workflow-orchestration/node_modules turned out
// to be tracked in git despite .gitignore (6,292 files - see #1303), which
// this discovery mechanism correctly surfaced before this exclusion was
// added, rather than silently hiding it the way the old skip-list did.
function discoverManifests() {
  const out = execFileSync('git', ['ls-files', '-z'], { cwd: repoRoot, encoding: 'utf8' });
  const files = out.split('\0').filter(Boolean);
  const manifestDirs = [];
  for (const file of files) {
    const parts = file.split('/');
    if (parts[parts.length - 1] !== 'package.json') continue;
    if (parts.includes('node_modules')) continue;
    manifestDirs.push(parts.length === 1 ? '.' : parts.slice(0, -1).join('/'));
  }
  return manifestDirs;
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
  // Two independent checks: (1) is the contract itself well-formed (every
  // check/exception has the fields it claims to - round-5 QA finding F2:
  // the gate used to trust an exception's metadata without validating it at
  // all), and (2) does the contract's app/covered_elsewhere/excluded list
  // actually reconcile against what's really tracked in git.
  const contractProblems = validateContract(coverage);
  if (contractProblems.length > 0) {
    console.error(`ci-coverage.json fails contract validation (${contractProblems.length} problem(s)):`);
    for (const p of contractProblems) console.error(`  - ${p}`);
    process.exit(1);
  }

  const discovered = discoverManifests();
  const { apps, elsewhere, excluded } = coveredPaths();
  const known = new Set([...apps, ...elsewhere, ...excluded]);
  const unreconciled = discovered.filter((p) => !known.has(p));

  // Also detect the inverse drift: an "apps" entry pointing at a path that no
  // longer has a package.json on disk (stale coverage entry). covered_elsewhere
  // and excluded entries are not checked here: they may legitimately point at
  // a path with no package.json at all (e.g. integrations/webhook-framework,
  // excluded because it has none) or one covered by a mechanism outside this
  // scan (e.g. the root package.json, covered by build-test).
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
