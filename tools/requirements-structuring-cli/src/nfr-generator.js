/** Classification and placeholder candidate generation orchestration. */
const fs = require('fs-extra');
const fsNative = require('fs');
const LLMClient = require('./llm-client');
const { validateNFRInput } = require('./nfr-input');
const { normalizeNFROptions } = require('./nfr-options');
const { NFRClassifier } = require('./nfr-classifier');
const { buildSafeOutputPath, buildContainedChildPath, safeWriteJSON } = require('./security');
const ReportGenerator = require('./report-generator');
const { generateCandidates } = require('./nfr-candidates');
const { formatCandidateReport } = require('./nfr-candidate-report');
const { assertGenerationOutputAvailable, writeGenerationReport, writeSafeOverwrite } = require('./nfr-output');
const GherkinGenerator = require('./gherkin-generator');

/** Read a path expected to be a plain file, refusing a symlink or other non-regular file.
 * Opens with O_NOFOLLOW and stats/reads that same open file descriptor, rather than a
 * separate lstat-then-read (which CodeQL flagged as a TOCTOU race: the path could be
 * replaced with a symlink between the check and the read). O_NONBLOCK guards against an
 * untrusted path being a FIFO with no writer, which would otherwise hang this open() call
 * indefinitely; the stat() check below still rejects non-regular files (a FIFO included)
 * before any read is attempted, and the descriptor is reopened in blocking mode implicitly
 * once confirmed regular (opening a regular file with O_NONBLOCK has no effect on it).
 * Returns null if the path doesn't exist. */
async function readSafeIfExists(file) {
  let handle;
  try {
    handle = await fsNative.promises.open(file,
      fsNative.constants.O_RDONLY | fsNative.constants.O_NOFOLLOW | fsNative.constants.O_NONBLOCK);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    if (error.code === 'ELOOP') throw new Error(`Unsafe NFR output: ${file}`);
    throw error;
  }
  try {
    const stat = await handle.stat();
    if (!stat.isFile()) throw new Error(`Unsafe NFR output: ${file}`);
    return await handle.readFile('utf8');
  } finally {
    await handle.close();
  }
}

/**
 * #1110: wire the NFR acceptance-criterion scaffold into Gherkin. If the pipeline's own
 * `<base>.feature` already exists (it does by the time this phase runs — see src/index.js),
 * append the NFR scenarios to it, once (idempotent via GherkinGenerator.NFR_SECTION_MARKER —
 * re-running without --force doesn't duplicate the section; with --force, the marked section
 * is rebuilt in place so it can't go stale against fresh classification/candidate output,
 * while the UCS-generated prefix before the marker is preserved untouched). If no base
 * .feature exists (e.g. standalone `generate-nfr` without ever running
 * `generate-gherkin`/`pipeline`), write it to its own sibling `<base>-nfr.feature` file so the
 * scaffold is never silently dropped. Both writes go through the same symlink/non-regular-file
 * protection as the report/classification/candidates JSON outputs above.
 */
async function writeNFRGherkinScenarios(outputDir, baseName, candidates, useCaseId, force = false) {
  const section = new GherkinGenerator().generateNFRScenarios(candidates, useCaseId);
  const featurePath = buildContainedChildPath(outputDir, `${baseName}.feature`);
  const standalonePath = buildContainedChildPath(outputDir, `${baseName}-nfr.feature`);
  const existing = await readSafeIfExists(featurePath);
  if (existing === null) {
    // No base .feature to append to: this file has to be valid Gherkin on its own, so it
    // needs its own Feature: header (generateNFRScenarios deliberately omits one — the
    // append case above already has the base file's). Owned entirely by generate-nfr, so it
    // gets the same exclusive-create-or-force contract as the report/classification/candidates
    // JSON outputs, not the pipeline .feature file's idempotent-append semantics.
    // Fast-fail pre-check (redundant with, but not a substitute for, the atomic O_EXCL below
    // -- mirrors writeGenerationReport's own belt-and-suspenders pattern in this same file).
    assertGenerationOutputAvailable(standalonePath, force);
    const standaloneFeature = `Feature: ${GherkinGenerator.sanitizeGherkinLine(useCaseId)} — NFR acceptance-criteria scaffolds\n`
      + section.replace(/^\n+/, '');
    // force is threaded through here (unlike the two calls below) because this path owns the
    // exclusive-create-or-force contract: without it, O_EXCL makes file creation itself
    // atomically fail if the target now exists, closing the TOCTOU gap the pre-check alone
    // cannot close.
    await writeSafeOverwrite(standalonePath, standaloneFeature, force);
    return { path: standalonePath, mode: 'standalone' };
  }
  const markerIndex = existing.indexOf(GherkinGenerator.NFR_SECTION_MARKER);
  if (markerIndex === -1) {
    // Always an intentional overwrite: `existing` was just read from this same file, and we're
    // writing back its content plus the new section -- not subject to exclusive-create-or-force.
    await writeSafeOverwrite(featurePath, existing + section, true);
    return { path: featurePath, mode: 'appended' };
  }
  if (!force) return { path: featurePath, mode: 'already-present' };
  const prefix = existing.slice(0, markerIndex).replace(/\n+$/, '');
  await writeSafeOverwrite(featurePath, prefix + section, true);
  return { path: featurePath, mode: 'rebuilt' };
}

class NFRGenerator {
  constructor({ llm } = {}) {
    this.llm = llm;
  }

  async run(input, options = {}) {
    const { kind, data } = validateNFRInput(input);
    const normalized = normalizeNFROptions(options);
    const outputDir = buildSafeOutputPath(options.output || './output');
    const baseName = options.baseName || 'requirements';
    const reportPath = buildContainedChildPath(outputDir, `${baseName}-nfr-report.md`);
    const classificationPath = buildContainedChildPath(outputDir, `${baseName}-nfr-classifications.json`);
    const candidatesPath = buildContainedChildPath(outputDir, `${baseName}-nfr-candidates.json`);
    const force = options.force === true;
    assertGenerationOutputAvailable(reportPath, force);
    assertGenerationOutputAvailable(classificationPath, force);
    assertGenerationOutputAvailable(candidatesPath, force);
    const llm = this.llm || new LLMClient();
    const classifications = await new NFRClassifier({ llm }).classify(data, normalized);
    const generation = generateCandidates(classifications, normalized);
    const result = {
      status: 'generated',
      notice: 'NFR candidates generated; human input required for all unbound parameters.',
      generation,
      input: data,
      inputKind: kind,
      classifications,
      options: { ...normalized, provider: llm.provider, model: llm.model },
    };
    result.classificationPath = classificationPath;
    result.reportPath = reportPath;
    result.candidatesPath = candidatesPath;
    const reportGenerator = new ReportGenerator();
    const report = reportGenerator.formatNFRReport(result) + '\n' + formatCandidateReport(generation);
    await fs.ensureDir(outputDir);
    // #1110: on a non-force run, the three writes below are each individually guaranteed (by
    // the pre-checks above plus finding 2's O_EXCL fix) to have created a file that did not
    // exist before this run started -- so if a later step in this same run fails (most
    // concretely: the standalone .feature path's own exclusive-create rejecting a pre-existing
    // <base>-nfr.feature), roll back only those freshly-created files, leaving a clean output
    // directory rather than a partial one, and never touch anything that pre-existed. A force
    // run is deliberately excluded: force intentionally overwrites pre-existing content this
    // run didn't back up, so "restore the prior state" isn't a well-defined rollback there --
    // that's a distinct concern from this partial-directory finding, which only ever manifests
    // on a non-force run (force bypasses the exclusive-create check that causes it).
    const createdByThisRun = [];
    try {
      // Exclusive creation protects manual report edits even if another run races us.
      await writeGenerationReport(reportPath, report, force);
      createdByThisRun.push(reportPath);
      await safeWriteJSON(classificationPath, classifications, { rootDir: outputDir });
      createdByThisRun.push(classificationPath);
      // #1110: the rendered candidates (with the structured acceptanceCriterion scaffold) as
      // their own machine-consumable artifact — distinct from the classifier's raw handoff above.
      await safeWriteJSON(candidatesPath, generation, { rootDir: outputDir });
      createdByThisRun.push(candidatesPath);
      const gherkinResult = await writeNFRGherkinScenarios(outputDir, baseName, generation.candidates, generation.useCaseId, force);
      result.gherkinPath = gherkinResult.path;
      result.gherkinMode = gherkinResult.mode;
    } catch (error) {
      if (!force) {
        for (const createdPath of createdByThisRun) {
          try { await fs.remove(createdPath); } catch (_) { /* best-effort rollback */ }
        }
      }
      throw error;
    }
    return result;
  }
}

module.exports = NFRGenerator;
module.exports.writeNFRGherkinScenarios = writeNFRGherkinScenarios;
