/**
 * NFR command skeleton (#1112).
 * Classification (#1108) and generation (#1109) are not yet implemented.
 */
const LLMClient = require('./llm-client');

class NFRGenerator {
  async run(input, options = {}) {
    const llm = new LLMClient();
    return {
      status: 'not-implemented',
      notice: 'NFR generation not yet implemented (#1108/#1109)',
      input,
      options: { ...options, provider: llm.provider, model: llm.model },
    };
  }
}

module.exports = NFRGenerator;
