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
const { isSystemActor } = require('./actor-role');

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
        // Retain constraints as source references, not invented executable assertions.
        if (typeof step.sourceText === 'string') {
          lines.push(`    # Source requirement ${step.sourceRequirementId || '(unlabeled)'}`);
          for (const sourceLine of step.sourceText.split(/\r?\n/)) {
            lines.push(`    # ${sourceLine}`);
          }
        }
        if (step.stepKind === 'given') {
          // A condition established at the deviation point itself (e.g. a
          // link expiring only after prior steps create it), not an upfront
          // scenario precondition — render it as a Given inline, in sequence.
          lines.push(`    Given ${this._normalizeGiven(step.description)}`);
          continue;
        }

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

  /**
   * #1110: render NFR candidates as executable-shaped Gherkin — a Scenario
   * Outline + Examples table per quantifiable candidate (the threshold cell
   * carries the same unbound `[NEEDS INPUT: <param>]` placeholder as the
   * candidate's own `bindings`, never a fabricated value), or a plain
   * Scenario with a `Then` step for a qualitative candidate. Entirely
   * separate from `generate()` — does not touch UCS test-case rendering or
   * the negative-scenario trigger-action placement fixed in #1168.
   * @param {Array} candidates - generateCandidates()'s `generation.candidates`
   * @param {string} useCaseId - for the section header only
   * @returns {string} Gherkin text to append to, or stand alone as, a .feature file
   */
  generateNFRScenarios(candidates, useCaseId) {
    // Gherkin injection guard: validateNFRInput only requires useCaseId to be a non-empty
    // string, so an untrusted value could contain CR/LF and break out of this `#` comment to
    // inject arbitrary Gherkin lines. Collapse line breaks before interpolating it anywhere.
    const safeUseCaseId = GherkinGenerator.sanitizeGherkinLine(useCaseId);
    const lines = [];
    lines.push('');
    lines.push(GherkinGenerator.NFR_SECTION_MARKER);
    lines.push(`  # Generated from ${safeUseCaseId}'s NFR candidates — every threshold below is`);
    lines.push('  # an explicit placeholder pending human input, never a fabricated value.');
    lines.push('');
    for (const candidate of candidates) {
      const title = `NFR — ${candidate.patternId} (${candidate.subCharacteristic}, ${candidate.source.path})`;
      if (candidate.acceptanceCriterion.kind === 'quantifiable') {
        const ac = candidate.acceptanceCriterion;
        lines.push(`  Scenario Outline: ${title}`);
        lines.push(`    # ${candidate.text}`);
        lines.push('    Then the measured <metric> shall be <operator> <threshold> <unit>');
        lines.push('');
        lines.push('    Examples:');
        lines.push('      | metric | operator | threshold | unit |');
        lines.push(`      | ${ac.metric} | ${ac.operator} | ${ac.threshold} | ${ac.unit} |`);
        lines.push('');
      } else {
        lines.push(`  Scenario: ${title}`);
        lines.push(`    # ${candidate.text}`);
        lines.push(`    Then ${candidate.acceptanceCriterion.criterion}`);
        lines.push('');
      }
    }
    return lines.join('\n');
  }

  // ─── Step normalization helpers ──────────────────────────────────────────

  _isActorAction(actor) {
    return !isSystemActor(actor);
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

// Marker guarding NFR-section appends from duplicating on repeated pipeline/generate-nfr runs.
GherkinGenerator.NFR_SECTION_MARKER = '  # ─── NFR acceptance-criteria scaffolds (Story #1110) ───';

// Collapse CR/LF so a value that reaches here only validated as "a non-empty string" (e.g.
// useCaseId) can never break out of a Gherkin `#` comment or `Feature:` line to inject
// arbitrary content. Reused by nfr-generator.js for the standalone .feature header.
GherkinGenerator.sanitizeGherkinLine = (value) => String(value).replace(/[\r\n]+/g, ' ');

module.exports = GherkinGenerator;
