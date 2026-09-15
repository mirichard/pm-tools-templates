/** Classification and placeholder candidate generation orchestration. */
const fs = require('fs-extra');
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

/** Read a path expected to be a plain file, refusing a symlink or other non-regular file
 * exactly like assertGenerationOutputAvailable does for the other NFR outputs. Returns null
 * if the path doesn't exist. */
async function readSafeIfExists(file) {
  let stat;
  try {
    stat = await fs.lstat(file);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`Unsafe NFR output: ${file}`);
  return fs.readFile(file, 'utf8');
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
    assertGenerationOutputAvailable(standalonePath, force);
    const standaloneFeature = `Feature: ${useCaseId} — NFR acceptance-criteria scaffolds\n` + section.replace(/^\n+/, '');
    await writeSafeOverwrite(standalonePath, standaloneFeature);
    return { path: standalonePath, mode: 'standalone' };
  }
  const markerIndex = existing.indexOf(GherkinGenerator.NFR_SECTION_MARKER);
  if (markerIndex === -1) {
    await writeSafeOverwrite(featurePath, existing + section);
    return { path: featurePath, mode: 'appended' };
  }
  if (!force) return { path: featurePath, mode: 'already-present' };
  const prefix = existing.slice(0, markerIndex).replace(/\n+$/, '');
  await writeSafeOverwrite(featurePath, prefix + section);
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
    // Exclusive creation protects manual report edits even if another run races us.
    await writeGenerationReport(reportPath, report, force);
    await safeWriteJSON(classificationPath, classifications, { rootDir: outputDir });
    // #1110: the rendered candidates (with the structured acceptanceCriterion scaffold) as
    // their own machine-consumable artifact — distinct from the classifier's raw handoff above.
    await safeWriteJSON(candidatesPath, generation, { rootDir: outputDir });
    const gherkinResult = await writeNFRGherkinScenarios(outputDir, baseName, generation.candidates, generation.useCaseId, force);
    result.gherkinPath = gherkinResult.path;
    result.gherkinMode = gherkinResult.mode;
    return result;
  }
}

module.exports = NFRGenerator;
module.exports.writeNFRGherkinScenarios = writeNFRGherkinScenarios;
