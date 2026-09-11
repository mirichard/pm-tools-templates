/** Classification consumer (#1108); NFR statement generation remains #1109. */
const fs = require('fs-extra');
const LLMClient = require('./llm-client');
const { validateNFRInput } = require('./nfr-input');
const { normalizeNFROptions } = require('./nfr-options');
const { NFRClassifier } = require('./nfr-classifier');
const { buildSafeOutputPath, buildContainedChildPath, safeWriteJSON } = require('./security');
const ReportGenerator = require('./report-generator');

class NFRGenerator {
  constructor({ llm } = {}) {
    this.llm = llm;
  }

  async run(input, options = {}) {
    const { kind, data } = validateNFRInput(input);
    const normalized = normalizeNFROptions(options);
    const llm = this.llm || new LLMClient();
    const classifications = await new NFRClassifier({ llm }).classify(data, normalized);
    const result = {
      status: 'classified',
      notice: 'NFR generation not yet implemented (#1109)',
      input: data,
      inputKind: kind,
      classifications,
      options: { ...normalized, provider: llm.provider, model: llm.model },
    };
    // #1109 consumes classifications; no pattern rendering or NFR generation here.
    const outputDir = buildSafeOutputPath(options.output || './output');
    const baseName = options.baseName || 'requirements';
    result.classificationPath = buildContainedChildPath(outputDir, `${baseName}-nfr-classifications.json`);
    await fs.ensureDir(outputDir);
    await safeWriteJSON(result.classificationPath, classifications, { rootDir: outputDir });
    const reportGenerator = new ReportGenerator();
    result.reportPath = await reportGenerator.generateNFRReport(result, { outputDir, baseName });
    return result;
  }
}

module.exports = NFRGenerator;
