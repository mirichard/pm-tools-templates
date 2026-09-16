#!/usr/bin/env node
/**
 * #1113: classification accuracy eval -- exact-match / near-miss / mismatch vs. a small,
 * honestly-sourced labeled set (examples/fixtures/nfr-golden/eval-labels.json; read that file's
 * own "warning" field before trusting this script's numbers as more than a limited check).
 *
 * Definitions (this script's own, not borrowed from any external methodology): for each labeled
 * (requirement, subCharacteristic) judgment, look at what the tool actually assigned to that same
 * requirement (joined by source.path, per docs/nfr-golden-example.md -- not by stepId alone):
 *   - exact-match: the tool assigned that exact subCharacteristic to the requirement.
 *   - near-miss: the tool assigned a *different* subCharacteristic under the *same* top-level
 *     characteristic, but not this one -- the tool got the general quality area right, not the
 *     specific one.
 *   - mismatch: the tool assigned nothing at all under that characteristic for the requirement.
 * A label set is small and non-exhaustive: only labeled pairs are scored. The tool is never
 * penalized for assignments outside the labeled set, and no "extra assignment" category exists.
 *
 * No live LLM calls by default: compares each variant's already-committed
 * `-nfr-classifications.json` (from examples/fixtures/nfr-golden/) against the labeled set. Pass
 * --live to re-classify a single variant against a configured LLM provider instead (see --help);
 * that mode makes exactly as many provider calls as the golden UCS has requirement units (10),
 * well under this project's 15-call live-eval cap, and is opt-in only.
 */
const path = require('path');
// Same package-relative .env loading as src/index.js, so --live works with the documented
// `cp .env.example .env` setup instead of requiring manually exported environment variables.
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const LLMClient = require('../src/llm-client');
const { NFRClassifier } = require('../src/nfr-classifier');
const { buildSafeOutputPath, buildContainedChildPath, validateAndSerializeJSON, sanitizeTerminalValue } = require('../src/security');
const { writeSafe } = require('../src/nfr-output');

const GOLDEN_DIR = path.join(__dirname, '..', 'examples/fixtures/nfr-golden');
const VARIANTS = ['neutral', 'pci-dss'];

function requireValue(argv, i, flag) {
  const value = argv[i + 1];
  // Reject a missing value AND an option-looking token (e.g. `--output --force` must not treat
  // "--force" as the output path) -- neither this flag nor any other in parseArgs takes a value
  // that legitimately starts with "-", so this is a safe, unambiguous rejection.
  if (value === undefined || value.startsWith('-')) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}

function parseArgs(argv) {
  const args = { variant: 'both', live: false, output: null, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') { args.help = true; }
    else if (arg === '--live') { args.live = true; }
    else if (arg === '--force') { args.force = true; }
    else if (arg === '--variant') { args.variant = requireValue(argv, i, '--variant'); i += 1; }
    else if (arg === '--output') { args.output = requireValue(argv, i, '--output'); i += 1; }
    else throw new Error(`Unknown argument: ${arg}. Run with --help for usage.`);
  }
  return args;
}

function printHelp() {
  process.stdout.write(`Usage: node scripts/eval-classification.js [options]

  --variant <neutral|pci-dss|both>   Which golden-fixture capture(s) to evaluate (default: both).
  --live                             Re-classify from the UCS input via a configured LLM provider
                                      instead of reading the committed classification JSON.
                                      Requires --variant to name exactly one variant (not "both"):
                                      one live run already makes 10 provider calls (one per golden
                                      UCS requirement unit), and this project caps eval live calls
                                      at 15 total. Uses the same LLM_* / *_API_KEY env vars as the
                                      rest of this CLI (see README.md).
  --output <dir>                     Write eval-classification-results.json into this directory
                                      (via the same safe-I/O primitives as generate-nfr) in
                                      addition to the stdout report. Not written by default.
  --force                            Allow --output to overwrite an existing results file.
  --help                             Show this message.
`);
}

function categorize(toolAttributes, label) {
  if (toolAttributes.some((a) => a.subCharacteristic === label.subCharacteristic)) return 'exact-match';
  if (toolAttributes.some((a) => a.characteristic === label.characteristic)) return 'near-miss';
  return 'mismatch';
}

function evaluateVariant(classification, labelSet, variant) {
  const rows = [];
  for (const unit of labelSet.labels) {
    const requirement = classification.requirements.find((r) => r.source.path === unit.sourcePath);
    const toolAttributes = requirement ? requirement.attributes : [];
    for (const attribute of unit.attributes) {
      rows.push({
        variant, sourcePath: unit.sourcePath, requirementRef: unit.requirementRef,
        characteristic: attribute.characteristic, subCharacteristic: attribute.subCharacteristic,
        category: categorize(toolAttributes, attribute),
      });
    }
  }
  return rows;
}

function summarize(rows) {
  const total = rows.length;
  const counts = { 'exact-match': 0, 'near-miss': 0, mismatch: 0 };
  for (const row of rows) counts[row.category] += 1;
  const rates = Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, total ? v / total : 0]));
  return { total, counts, rates };
}

async function loadCommittedClassification(variant) {
  return require(path.join(GOLDEN_DIR, variant, 'password-reset-input-nfr-classifications.json'));
}

async function loadLiveClassification(variant) {
  const ucsInput = require(path.join(GOLDEN_DIR, variant, 'password-reset-input-ucs.json'));
  const llm = new LLMClient();
  if (!llm.provider) {
    throw new Error('--live requires a configured LLM provider (see README.md for LLM_PROVIDER / '
      + '*_API_KEY); none was found in the environment.');
  }
  process.stderr.write(`--live: making up to 10 real ${llm.provider}/${llm.model} classification calls `
    + `for the "${variant}" variant...\n`);
  return new NFRClassifier({ llm }).classify(ucsInput);
}

function formatPercent(rate) {
  return `${(rate * 100).toFixed(1)}%`;
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) { printHelp(); return; }
  if (args.variant !== 'both' && !VARIANTS.includes(args.variant)) {
    throw new Error(`--variant must be one of: neutral, pci-dss, both (got "${args.variant}")`);
  }
  if (args.live && args.variant === 'both') {
    throw new Error('--live requires --variant neutral or --variant pci-dss (not "both") to stay '
      + 'under this project\'s 15-call live-eval cap.');
  }
  const labelSet = require(path.join(GOLDEN_DIR, 'eval-labels.json'));
  process.stdout.write(`Labeled set provenance: ${labelSet.provenance} (expertVerified: `
    + `${labelSet.expertVerified}). ${labelSet.warning}\n\n`);

  const variants = args.variant === 'both' ? VARIANTS : [args.variant];
  const allRows = [];
  for (const variant of variants) {
    const classification = args.live ? await loadLiveClassification(variant) : await loadCommittedClassification(variant);
    const rows = evaluateVariant(classification, labelSet, variant);
    allRows.push(...rows);
    const { total, counts, rates } = summarize(rows);
    process.stdout.write(`${variant} (source: ${args.live ? 'live classification' : 'committed golden fixture'}):\n`);
    process.stdout.write(`  exact-match: ${counts['exact-match']}/${total} (${formatPercent(rates['exact-match'])})\n`);
    process.stdout.write(`  near-miss:   ${counts['near-miss']}/${total} (${formatPercent(rates['near-miss'])})\n`);
    process.stdout.write(`  mismatch:    ${counts.mismatch}/${total} (${formatPercent(rates.mismatch)})\n`);
    for (const row of rows) {
      if (row.category !== 'exact-match') {
        process.stdout.write(`    ${row.category}: ${row.requirementRef} ${row.sourcePath} -> `
          + `expected ${row.subCharacteristic} (${row.characteristic})\n`);
      }
    }
    process.stdout.write('\n');
  }

  const overall = summarize(allRows);
  process.stdout.write(`overall: exact-match ${overall.counts['exact-match']}/${overall.total} `
    + `(${formatPercent(overall.rates['exact-match'])}), near-miss ${overall.counts['near-miss']}/${overall.total} `
    + `(${formatPercent(overall.rates['near-miss'])}), mismatch ${overall.counts.mismatch}/${overall.total} `
    + `(${formatPercent(overall.rates.mismatch)})\n`);

  if (args.output) {
    const outputDir = buildSafeOutputPath(args.output);
    const fs = require('fs-extra');
    await fs.ensureDir(outputDir);
    const resultsPath = buildContainedChildPath(outputDir, 'eval-classification-results.json');
    const results = { generatedAt: new Date().toISOString(), labelSetProvenance: labelSet.provenance,
      labelSetExpertVerified: labelSet.expertVerified, labelSetWarning: labelSet.warning,
      labelSetOrderOfOperationsCaveat: labelSet.orderOfOperationsCaveat,
      labelSetTaxonomyAccuracyCaveat: labelSet.taxonomyAccuracyCaveat,
      variants, live: args.live, rows: allRows, overall };
    try {
      await writeSafe(resultsPath, validateAndSerializeJSON(results), args.force);
    } catch (error) {
      // writeSafe's own message hard-codes "generate-nfr --force" (it's shared across every NFR
      // output writer); translate it here so this script's own users get the right command name.
      throw new Error(error.message.replace(/generate-nfr --force/g, 'eval-classification --force'));
    }
    process.stdout.write(`\nResults written to ${resultsPath}\n`);
  }
}

if (require.main === module) {
  main(process.argv.slice(2)).catch((error) => {
    // --output accepts an arbitrary user-supplied path, which can end up quoted back in a thrown
    // error message; sanitize before writing to the terminal, same as the main CLI's
    // terminalError/spinnerFail, so a crafted path can't inject ANSI/control sequences into stderr.
    process.stderr.write(`${sanitizeTerminalValue(error.message)}\n`);
    process.exitCode = 1;
  });
}

module.exports = { categorize, evaluateVariant, summarize };
