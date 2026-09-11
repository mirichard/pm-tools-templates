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
const { assertGenerationOutputAvailable, writeGenerationReport } = require('./nfr-output');

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
    const force = options.force === true;
    assertGenerationOutputAvailable(reportPath, force);
    assertGenerationOutputAvailable(classificationPath, force);
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
    const reportGenerator = new ReportGenerator();
    const report = reportGenerator.formatNFRReport(result) + '\n' + formatCandidateReport(generation);
    await fs.ensureDir(outputDir);
    // Exclusive creation protects manual report edits even if another run races us.
    await writeGenerationReport(reportPath, report, force);
    await safeWriteJSON(classificationPath, classifications, { rootDir: outputDir });
    return result;
  }
}

module.exports = NFRGenerator;
