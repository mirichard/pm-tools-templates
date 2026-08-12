/**
 * Feedback Loop
 *
 * Implements the paper's iterative refinement mechanism using three
 * distinct LLM analysis passes, then applies refinement:
 *
 * 1. Gap & contradiction analysis (prompt 04)
 * 2. Coverage expansion / suggest additional test cases (prompt 05)
 * 3. Implicit requirement discovery (prompt 06)
 * 4. Refinement from feedback (prompt 07)
 *
 * Each pass is interactive — suggestions are presented for user review.
 */

const LLMClient = require('./llm-client');
const inquirer = require('inquirer');
const chalk = require('chalk');
const { sanitizeTerminalValue } = require('./security');

class FeedbackLoop {
  constructor() {
    this.llm = new LLMClient();
  }

  /**
   * Run the full feedback loop
   * @param {object} ucsTemplate - Current UCS template (JSON)
   * @param {object[]} testCases - Generated test cases
   * @returns {object} { updatedUCS, newTestCases, suggestions }
   */
  async run(ucsTemplate, testCases) {
    const allSuggestions = [];

    // Pass 1: Gap & contradiction analysis
    console.log(sanitizeTerminalValue(chalk.yellow('\n🔍 Pass 1: Analyzing for gaps and contradictions...')));
    const gaps = await this._identifyGaps(ucsTemplate, testCases);
    if (gaps.length > 0) {
      const accepted = await this._reviewSuggestions(gaps, 'Gaps & Contradictions');
      allSuggestions.push(...accepted);
    } else {
      console.log(sanitizeTerminalValue(chalk.green('  ✓ No gaps or contradictions detected')));
    }

    // Pass 2: Coverage expansion
    console.log(sanitizeTerminalValue(chalk.yellow('\n🧪 Pass 2: Suggesting additional test cases...')));
    const additionalTests = await this._suggestTestCases(ucsTemplate, testCases);
    if (additionalTests.length > 0) {
      const accepted = await this._reviewSuggestions(additionalTests, 'Additional Test Cases');
      allSuggestions.push(...accepted);
    } else {
      console.log(sanitizeTerminalValue(chalk.green('  ✓ Coverage appears sufficient')));
    }

    // Pass 3: Implicit requirement discovery
    console.log(sanitizeTerminalValue(chalk.yellow('\n💡 Pass 3: Discovering implicit requirements...')));
    const implicitReqs = await this._discoverImplicit(ucsTemplate, testCases);
    if (implicitReqs.length > 0) {
      const accepted = await this._reviewSuggestions(implicitReqs, 'Implicit Requirements');
      allSuggestions.push(...accepted);
    } else {
      console.log(sanitizeTerminalValue(chalk.green('  ✓ No implicit requirements detected')));
    }

    // Apply accepted suggestions
    let updatedUCS = ucsTemplate;
    if (allSuggestions.length > 0) {
      console.log(sanitizeTerminalValue(chalk.yellow(`\n🔄 Applying ${allSuggestions.length} accepted suggestion(s)...`)));
      updatedUCS = await this._refineFromFeedback(ucsTemplate, allSuggestions);
    }

    return {
      updatedUCS,
      suggestions: allSuggestions,
      passResults: {
        gaps: gaps.length,
        additionalTests: additionalTests.length,
        implicitReqs: implicitReqs.length,
        accepted: allSuggestions.length,
      },
    };
  }

  /**
   * Pass 1: Identify gaps and contradictions
   */
  async _identifyGaps(ucsTemplate, testCases) {
    const prompt = await this.llm.loadPrompt('04-identify-gaps.md');
    const userContent = this._buildAnalysisInput(ucsTemplate, testCases);

    try {
      const result = await this.llm.chatJSON({
        systemPrompt: prompt,
        userPrompt: userContent,
        mode: 'creative',
      });
      return result.suggestions || [];
    } catch {
      return [];
    }
  }

  /**
   * Pass 2: Suggest additional test cases
   */
  async _suggestTestCases(ucsTemplate, testCases) {
    const prompt = await this.llm.loadPrompt('05-suggest-test-cases.md');
    const userContent = this._buildAnalysisInput(ucsTemplate, testCases);

    try {
      const result = await this.llm.chatJSON({
        systemPrompt: prompt,
        userPrompt: userContent,
        mode: 'creative',
      });
      return result.suggestions || [];
    } catch {
      return [];
    }
  }

  /**
   * Pass 3: Discover implicit requirements
   */
  async _discoverImplicit(ucsTemplate, testCases) {
    const prompt = await this.llm.loadPrompt('06-discover-implicit-reqs.md');
    const userContent = this._buildAnalysisInput(ucsTemplate, testCases);

    try {
      const result = await this.llm.chatJSON({
        systemPrompt: prompt,
        userPrompt: userContent,
        mode: 'creative',
      });
      return result.suggestions || [];
    } catch {
      return [];
    }
  }

  /**
   * Apply refinement based on accepted feedback
   */
  async _refineFromFeedback(ucsTemplate, suggestions) {
    const prompt = await this.llm.loadPrompt('07-refine-from-feedback.md');

    const userContent = [
      'Refine the following UCS template based on the accepted feedback.',
      '',
      '## Current UCS Template',
      '```json',
      JSON.stringify(ucsTemplate, null, 2),
      '```',
      '',
      '## Accepted Feedback',
      ...suggestions.map((s, i) => `${i + 1}. [${s.type}] ${s.description}`),
    ].join('\n');

    try {
      return await this.llm.chatJSON({
        systemPrompt: prompt,
        userPrompt: userContent,
        mode: 'structure',
      });
    } catch {
      // If refinement fails, return original
      return ucsTemplate;
    }
  }

  /**
   * Interactive review — present suggestions, let user accept/reject each
   */
  async _reviewSuggestions(suggestions, category) {
    const safeCategory = sanitizeTerminalValue(category);
    console.log(Buffer.from(chalk.cyan(`\n  Found ${suggestions.length} suggestion(s) in "${safeCategory}":`), 'utf8').toString('utf8'));

    const accepted = [];
    for (let i = 0; i < suggestions.length; i++) {
      const s = suggestions[i];
        const safeSuggestion = sanitizeTerminalValue(chalk.white(`\n  ${i + 1}. [${s.type || 'suggestion'}] ${s.description}`));
        console.log(Buffer.from(safeSuggestion, 'utf8').toString('utf8'));
      if (s.detail) {
          const safeDetail = sanitizeTerminalValue(chalk.dim(`     ${s.detail}`));
          console.log(Buffer.from(safeDetail, 'utf8').toString('utf8'));
      }

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Action:',
          choices: [
            { name: 'Accept', value: 'accept' },
            { name: 'Skip', value: 'skip' },
            { name: 'Accept all remaining', value: 'accept_all' },
            { name: 'Skip all remaining', value: 'skip_all' },
          ],
        },
      ]);

      if (action === 'accept') {
        accepted.push(s);
      } else if (action === 'accept_all') {
        accepted.push(s, ...suggestions.slice(i + 1));
        break;
      } else if (action === 'skip_all') {
        break;
      }
    }

    const safeSummary = sanitizeTerminalValue(chalk.green(`  → Accepted ${accepted.length} of ${suggestions.length}`));
    console.log(Buffer.from(safeSummary, 'utf8').toString('utf8'));
    return accepted;
  }

  /**
   * Build combined input for analysis prompts
   */
  _buildAnalysisInput(ucsTemplate, testCases) {
    return [
      '## UCS Template',
      '```json',
      JSON.stringify(ucsTemplate, null, 2),
      '```',
      '',
      '## Generated Test Cases',
      '```json',
      JSON.stringify(testCases, null, 2),
      '```',
    ].join('\n');
  }
}

module.exports = FeedbackLoop;
