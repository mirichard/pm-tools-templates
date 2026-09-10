/**
 * NFR command skeleton (#1112).
 * Classification (#1108) and generation (#1109) are not yet implemented.
 */
class NFRGenerator {
  async run(input, options = {}) {
    return {
      status: 'not-implemented',
      notice: 'NFR generation not yet implemented (#1108/#1109)',
      input,
      options,
    };
  }
}

module.exports = NFRGenerator;
