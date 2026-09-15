/** Classification and placeholder candidate generation orchestration. */
const fs = require('fs-extra');
const LLMClient = require('./llm-client');
const { validateNFRInput } = require('./nfr-input');
const { normalizeNFROptions } = require('./nfr-options');
const { NFRClassifier } = require('./nfr-classifier');
const { buildSafeOutputPath, buildContainedChildPath, safeWriteJSON, safeWriteText } = require('./security');
const ReportGenerator = require('./report-generator');
const { generateCandidates } = require('./nfr-candidates');
const { formatCandidateReport } = require('./nfr-candidate-report');
const { assertGenerationOutputAvailable, writeGenerationReport } = require('./nfr-output');
const GherkinGenerator = require('./gherkin-generator');

/**
 * #1110: wire the NFR acceptance-criterion scaffold into Gherkin. If the pipeline's own
 * `<base>.feature` already exists (it does by the time this phase runs — see src/index.js),
 * append the NFR scenarios to it, once (idempotent via GherkinGenerator.NFR_SECTION_MARKER,
 * so re-running doesn't duplicate the section). If no base .feature exists (e.g. standalone
 * `generate-nfr` without ever running `generate-gherkin`/`pipeline`), write it to its own
 * sibling `<base>-nfr.feature` file so the scaffold is never silently dropped.
 */
async function writeNFRGherkinScenarios(outputDir, baseName, candidates, useCaseId) {
  const section = new GherkinGenerator().generateNFRScenarios(candidates, useCaseId);
  const featurePath = buildContainedChildPath(outputDir, `${baseName}.feature`);
  const standalonePath = buildContainedChildPath(outputDir, `${baseName}-nfr.feature`);
  let existing = null;
  try {
    existing = await fs.readFile(featurePath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (existing === null) {
    await safeWriteText(standalonePath, section.replace(/^\n+/, ''), 'utf8', { rootDir: outputDir });
    return { path: standalonePath, mode: 'standalone' };
  }
  if (existing.includes(GherkinGenerator.NFR_SECTION_MARKER)) {
    return { path: featurePath, mode: 'already-present' };
  }
  await safeWriteText(featurePath, existing + section, 'utf8', { rootDir: outputDir });
  return { path: featurePath, mode: 'appended' };
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
    const gherkinResult = await writeNFRGherkinScenarios(outputDir, baseName, generation.candidates, generation.useCaseId);
    result.gherkinPath = gherkinResult.path;
    result.gherkinMode = gherkinResult.mode;
    return result;
  }
}

module.exports = NFRGenerator;
module.exports.writeNFRGherkinScenarios = writeNFRGherkinScenarios;
