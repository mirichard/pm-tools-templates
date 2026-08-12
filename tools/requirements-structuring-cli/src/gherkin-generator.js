/**
 * Gherkin Generator
 *
 * Converts structured test cases into Gherkin .feature files that can be
 * wired into automated test frameworks (Cucumber, pytest-bdd, SpecFlow, etc.).
 *
 * Each test case becomes a Scenario with Given/When/Then steps derived from
 * the UCS step structure: preconditions → Given, actor actions → When,
 * expected results → Then.
 */

const fs = require('fs-extra');
const path = require('path');
const { buildSafeOutputPath, safeWriteText } = require('./security');

class GherkinGenerator {
  /**
   * Generate a .feature file from test cases
   * @param {Array} testCases - Test cases JSON array
   * @param {object} ucs - UCS JSON for metadata
   * @returns {string} Gherkin feature file content
   */
  generate(testCases, ucs) {
    const lines = [];
    const featureName = ucs.useCaseName || ucs.intent || ucs.useCaseId;

    lines.push(`Feature: ${ucs.useCaseId} — ${featureName}`);
    lines.push(`  ${ucs.intent || featureName}`);
    lines.push('');

    // Background: shared preconditions
    if (ucs.preconditions && ucs.preconditions.length > 0) {
      lines.push('  Background:');
      for (const pre of ucs.preconditions) {
        lines.push(`    Given ${this._normalizeGiven(pre)}`);
      }
      lines.push('');
    }

    // Each test case → Scenario
    for (const tc of testCases) {
      const scenarioName = tc.triggerCondition
        ? `${tc.triggerCondition}`
        : 'Happy Path — Basic Flow';

      lines.push(`  Scenario: ${scenarioName}`);

      // Additional preconditions specific to this test case (beyond background)
      const backgroundPres = (ucs.preconditions || []).map((p) => p.toLowerCase());
      const extraPres = (tc.preconditions || []).filter(
        (p) => !backgroundPres.includes(p.toLowerCase())
      );
      for (const pre of extraPres) {
        lines.push(`    Given ${this._normalizeGiven(pre)}`);
      }

      // Convert steps to When/Then pairs
      for (const step of tc.steps) {
        const actor = step.actor || 'the system';
        const action = step.action || 'performs action';
        const bo = step.businessObject || '';
        const desc = step.description || '';

        if (this._isActorAction(actor)) {
          // User-driven action → When
          lines.push(`    When ${this._normalizeWhen(actor, action, bo, desc)}`);
        } else {
          // System response → Then
          lines.push(`    Then ${this._normalizeThen(actor, action, bo, desc)}`);
        }

        // Expected result as additional Then
        if (step.expectedResult && !this._isActorAction(actor)) {
          // Already covered by the Then above
        } else if (step.expectedResult) {
          lines.push(`    Then ${this._normalizeExpected(step.expectedResult)}`);
        }
      }

      // Final postconditions
      if (tc.expectedPostconditions && tc.expectedPostconditions.length > 0) {
        for (const post of tc.expectedPostconditions) {
          lines.push(`    Then ${this._normalizeExpected(post)}`);
        }
      }

      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Generate and save .feature file
   * @param {Array} testCases - Test cases array
   * @param {object} ucs - UCS JSON
   * @param {string} outputPath - Path to write the .feature file
   * @returns {string} The output path
   */
  async generateFile(testCases, ucs, outputPath) {
    const content = this.generate(testCases, ucs);
    const safeOutput = buildSafeOutputPath(outputPath, { rootDir: process.cwd(), allowAbsolute: true });
    await safeWriteText(safeOutput, content);
    return safeOutput;
  }

  // ─── Step normalization helpers ──────────────────────────────────────────

  _isActorAction(actor) {
    const systemActors = ['system', 'the system', 'application', 'server', 'api'];
    return !systemActors.includes((actor || '').toLowerCase());
  }

  _normalizeGiven(precondition) {
    // Remove leading "The" for cleaner Gherkin
    let text = precondition.replace(/^the\s+/i, '');
    // Ensure it reads as a state
    if (!/^(a |an |the |there )/.test(text.toLowerCase())) {
      text = 'the ' + this._lowerFirst(text);
    } else {
      text = this._lowerFirst(text);
    }
    return text;
  }

  _normalizeWhen(actor, action, businessObject, description) {
    if (description) {
      // Use description but ensure it starts with "the"
      let text = description.replace(/^The\s+/, 'the ');
      if (!/^the\s/i.test(text)) {
        text = 'the ' + text;
      }
      return text;
    }
    return `the ${actor} ${action} ${businessObject}`.trim();
  }

  _normalizeThen(actor, action, businessObject, description) {
    if (description) {
      let text = description.replace(/^The\s+/, 'the ');
      if (!/^the\s/i.test(text)) {
        text = 'the ' + text;
      }
      return text;
    }
    return `the ${actor} ${action} ${businessObject}`.trim();
  }

  _normalizeExpected(result) {
    let text = result.replace(/^The\s+/, 'the ');
    if (!/^the\s/i.test(text)) {
      text = 'the ' + this._lowerFirst(text);
    }
    return text;
  }

  _lowerFirst(str) {
    if (!str) return str;
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
}

module.exports = GherkinGenerator;
