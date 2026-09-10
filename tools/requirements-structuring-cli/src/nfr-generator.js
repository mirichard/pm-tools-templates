/**
 * NFR command skeleton (#1112).
 * Classification (#1108) and generation (#1109) are not yet implemented.
 */
const LLMClient = require('./llm-client');
const { validateNFRInput } = require('./nfr-input');
const { normalizeNFROptions } = require('./nfr-options');
const ReportGenerator = require('./report-generator');

class NFRGenerator {
  async run(input, options = {}) {
    const { kind, data } = validateNFRInput(input);
    const llm = new LLMClient();
    const result = {
      status: 'not-implemented',
      notice: 'NFR generation not yet implemented (#1108/#1109)',
      input: data,
      inputKind: kind,
      options: { ...normalizeNFROptions(options), provider: llm.provider, model: llm.model },
    };
    const reportGenerator = new ReportGenerator();
    result.reportPath = await reportGenerator.generateNFRReport(result, {
      outputDir: options.output || './output',
      baseName: options.baseName || 'requirements',
    });
    return result;
  }
}

module.exports = NFRGenerator;
