/** Classification and placeholder candidate generation orchestration. */
const fs = require('fs-extra');
const LLMClient = require('./llm-client');
const { validateNFRInput } = require('./nfr-input');
const { normalizeNFROptions } = require('./nfr-options');
const { NFRClassifier } = require('./nfr-classifier');
const { buildSafeOutputPath, buildContainedChildPath, validateAndSerializeJSON } = require('./security');
const ReportGenerator = require('./report-generator');
const { generateCandidates } = require('./nfr-candidates');
const { formatCandidateReport } = require('./nfr-candidate-report');
const {
  assertGenerationOutputAvailable,
  writeSafe,
  appendSectionIfMissing,
  rebuildSectionSafe,
  readSafeIfExists,
  removeIfSameFile,
} = require('./nfr-output');
const GherkinGenerator = require('./gherkin-generator');

/**
 * #1110: wire the NFR acceptance-criterion scaffold into Gherkin. If the pipeline's own
 * `<base>.feature` already exists (it does by the time this phase runs — see src/index.js),
 * append the NFR scenarios to it, once (idempotent via GherkinGenerator.NFR_SECTION_MARKER —
 * re-running without --force doesn't duplicate the section; with --force, the marked section
 * is rebuilt in place so it can't go stale against fresh classification/candidate output,
 * while the UCS-generated prefix before the marker is preserved untouched). If no base
 * .feature exists (e.g. standalone `generate-nfr` without ever running
 * `generate-gherkin`/`pipeline`), write it to its own sibling `<base>-nfr.feature` file so the
 * scaffold is never silently dropped. All reads/writes go through the shared primitives in
 * nfr-output.js, which carry the same symlink/non-regular-file protection as the
 * report/classification/candidates JSON outputs.
 *
 * appendSectionIfMissing and rebuildSectionSafe each independently re-verify the marker on
 * their own freshly-opened descriptor immediately before writing, rather than trusting the
 * `existing` snapshot this function read earlier -- so a concurrent edit to the file made after
 * that read but before the actual write is never silently discarded. That still falls short of
 * making the whole read-decide-write sequence atomic across two genuinely concurrent process
 * invocations of this tool (two callers could both open, both observe the same marker state,
 * and both act on it): closing that fully would need an inter-process lock. Deliberately not
 * added here: a lock file would introduce a new failure mode (a crashed process leaving a stale
 * lock that blocks every future run against this output directory until manually cleared) that
 * is a worse outcome, for this single-invocation CLI tool's realistic usage, than the narrow
 * residual race it would close. The threat model this redesign targets -- a malicious symlink
 * or FIFO swapped in by an attacker -- is fully closed regardless; this residual is about two
 * legitimate, benign runs overlapping by coincidence.
 */
async function writeNFRGherkinScenarios(outputDir, baseName, candidates, useCaseId, force = false) {
  const section = new GherkinGenerator().generateNFRScenarios(candidates, useCaseId);
  const featurePath = buildContainedChildPath(outputDir, `${baseName}.feature`);
  const existing = await readSafeIfExists(featurePath);
  if (existing === null) {
    // No base .feature to append to: this file has to be valid Gherkin on its own, so it
    // needs its own Feature: header (generateNFRScenarios deliberately omits one — the
    // append case below already has the base file's). Owned entirely by generate-nfr, so it
    // gets the same exclusive-create-or-force contract as the report/classification/candidates
    // JSON outputs, not the pipeline .feature file's idempotent-append semantics.
    // Fast-fail pre-check (redundant with, but not a substitute for, the atomic O_EXCL inside
    // writeSafe below).
    const standalonePath = buildContainedChildPath(outputDir, `${baseName}-nfr.feature`);
    assertGenerationOutputAvailable(standalonePath, force);
    const standaloneFeature = `Feature: ${GherkinGenerator.sanitizeGherkinLine(useCaseId)} — NFR acceptance-criteria scaffolds\n`
      + section.replace(/^\n+/, '');
    // force is threaded through here (unlike the append/rebuild branches below) because this
    // path owns the exclusive-create-or-force contract: without it, O_EXCL makes file creation
    // itself atomically fail if the target now exists, closing the TOCTOU gap the pre-check
    // alone cannot close. Re-derive the path fresh (rather than reuse one computed earlier) so
    // any ancestor-directory swap since that computation is caught by buildContainedChildPath's
    // own realpath check as close to the write as possible.
    await writeSafe(buildContainedChildPath(outputDir, `${baseName}-nfr.feature`), standaloneFeature, force);
    return { path: standalonePath, mode: 'standalone' };
  }
  const markerIndex = existing.indexOf(GherkinGenerator.NFR_SECTION_MARKER);
  if (markerIndex === -1) {
    // appendSectionIfMissing re-checks the marker on its own freshly-opened descriptor
    // immediately before writing, independent of the `existing` read above (which only decides
    // which branch of this function to take) -- so two concurrent callers that both observed
    // the marker absent don't both append a duplicate section, and a concurrent edit to the
    // file's other content survives (O_APPEND never reconstructs from `existing`).
    const appended = await appendSectionIfMissing(
      buildContainedChildPath(outputDir, `${baseName}.feature`), GherkinGenerator.NFR_SECTION_MARKER, section,
    );
    return { path: featurePath, mode: appended ? 'appended' : 'already-present' };
  }
  if (!force) return { path: featurePath, mode: 'already-present' };
  // rebuildSectionSafe re-reads the file and re-finds the marker on its own descriptor, rather
  // than reusing the prefix computed from `existing` above, so a concurrent edit to the file's
  // prefix (or the section itself) since that earlier read is not silently discarded by a
  // stale-content O_TRUNC rewrite.
  await rebuildSectionSafe(
    buildContainedChildPath(outputDir, `${baseName}.feature`), GherkinGenerator.NFR_SECTION_MARKER, section,
  );
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
    // #1110 finding 1: preflight the Gherkin destination too, before the classification call
    // and the 3 writes below run — a run that's going to fail on the standalone .feature
    // contract now fails immediately instead of after those side effects. This is a fast-fail
    // optimization only, not the correctness mechanism: writeSafe's own O_EXCL still closes the
    // real race (a file created in the window between this check and the actual write further
    // down), and the identity-based rollback below still covers whatever slips past it.
    const featurePath = buildContainedChildPath(outputDir, `${baseName}.feature`);
    const standalonePath = buildContainedChildPath(outputDir, `${baseName}-nfr.feature`);
    let baseFeatureExists;
    try {
      const stat = fs.lstatSync(featurePath);
      // A symlink, FIFO, directory, or other non-regular file at the base .feature path is not
      // "absent" -- readSafeIfExists will refuse it later regardless, but only after
      // classification and 3 writes have already run. Reject it here too, so an unsafe base
      // destination fails before those side effects instead of being mistaken for "no base
      // .feature, fall back to standalone".
      if (!stat.isFile()) throw new Error(`Unsafe NFR output: ${featurePath}`);
      baseFeatureExists = true;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      baseFeatureExists = false;
    }
    if (!baseFeatureExists) assertGenerationOutputAvailable(standalonePath, force);
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
    // #1110: on a non-force run, each write below is individually guaranteed (by the
    // pre-checks above plus writeSafe's own O_EXCL) to have created a file that did not exist
    // before this run started -- so if a later step in this same run fails (most concretely:
    // the standalone .feature path's own exclusive-create rejecting a pre-existing
    // <base>-nfr.feature), roll back only those freshly-created files, leaving a clean output
    // directory rather than a partial one, and never touch anything that pre-existed. Rollback
    // is identity-based (device+inode captured by writeSafe, not the bare path) -- see
    // removeIfSameFile -- so a file some other process put at one of these paths after this run
    // created it, but before this cleanup runs, is never collaterally deleted. A force run is
    // deliberately excluded: force intentionally overwrites pre-existing content this run
    // didn't back up, so "restore the prior state" isn't a well-defined rollback there -- and
    // force bypasses the exclusive-create check that causes this failure mode in the first place.
    const createdByThisRun = [];
    try {
      // Each path is re-derived via buildContainedChildPath immediately before its write
      // (rather than reusing reportPath/classificationPath/candidatesPath, computed above
      // before the classification call) so an ancestor-directory swap during that call is
      // still caught by buildContainedChildPath's own realpath containment check, as close to
      // the write as this layer can get without directory-fd-based path resolution (see
      // writeSafe's doc in nfr-output.js for why that residual can't be fully closed here).
      // Exclusive creation protects manual report edits even if another run races us.
      createdByThisRun.push(await writeSafe(buildContainedChildPath(outputDir, `${baseName}-nfr-report.md`), report, force));
      createdByThisRun.push(await writeSafe(
        buildContainedChildPath(outputDir, `${baseName}-nfr-classifications.json`), validateAndSerializeJSON(classifications), force,
      ));
      // #1110: the rendered candidates (with the structured acceptanceCriterion scaffold) as
      // their own machine-consumable artifact — distinct from the classifier's raw handoff above.
      createdByThisRun.push(await writeSafe(
        buildContainedChildPath(outputDir, `${baseName}-nfr-candidates.json`), validateAndSerializeJSON(generation), force,
      ));
      const gherkinResult = await writeNFRGherkinScenarios(outputDir, baseName, generation.candidates, generation.useCaseId, force);
      result.gherkinPath = gherkinResult.path;
      result.gherkinMode = gherkinResult.mode;
    } catch (error) {
      if (!force) {
        for (const identity of createdByThisRun) {
          try { await removeIfSameFile(identity); } catch (_) { /* best-effort rollback */ }
        }
      }
      throw error;
    }
    return result;
  }
}

module.exports = NFRGenerator;
module.exports.writeNFRGherkinScenarios = writeNFRGherkinScenarios;
