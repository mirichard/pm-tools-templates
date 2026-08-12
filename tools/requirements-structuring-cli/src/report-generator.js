/**
 * Report Generator
 *
 * Converts JSON pipeline artifacts into human-readable Markdown documents
 * for engineers, BAs, and stakeholders who need to review, validate, and
 * implement the system.
 */

const fs = require('fs-extra');
const path = require('path');
const { safeWriteText, buildSafeOutputPath, buildContainedChildPath } = require('./security');

class ReportGenerator {
  /**
   * Generate all Markdown reports from pipeline artifacts
   * @param {object} opts
   * @param {object} opts.ucs - UCS JSON
   * @param {Array}  opts.testCases - Test cases array
   * @param {object} [opts.validationResults] - Consistency check results
   * @param {object} [opts.refinedUcs] - Refined UCS after feedback loop
   * @param {string} opts.outputDir - Directory to write reports
   * @param {string} opts.baseName - Base filename
   */
  async generateAll(opts) {
    const { ucs, testCases, validationResults, refinedUcs, outputDir, baseName } = opts;
    await fs.ensureDir(outputDir);

    const files = [];

    const safeOutputDir = buildSafeOutputPath(outputDir);

    // Use Case Specification
    const ucsDoc = this.formatUCS(refinedUcs || ucs);
    const ucsPath = buildContainedChildPath(safeOutputDir, `${baseName}-use-case-spec.md`);
    await safeWriteText(ucsPath, ucsDoc, 'utf8', { rootDir: safeOutputDir });
    files.push(ucsPath);

    // Test Cases
    const testDoc = this.formatTestCases(testCases, ucs);
    const testPath = buildContainedChildPath(safeOutputDir, `${baseName}-test-cases.md`);
    await safeWriteText(testPath, testDoc, 'utf8', { rootDir: safeOutputDir });
    files.push(testPath);

    // Validation Report (if available)
    if (validationResults) {
      const valDoc = this.formatValidationReport(validationResults, ucs);
      const valPath = buildContainedChildPath(safeOutputDir, `${baseName}-validation-report.md`);
      await safeWriteText(valPath, valDoc, 'utf8', { rootDir: safeOutputDir });
      files.push(valPath);
    }

    // Pipeline Summary
    const summaryDoc = this.formatSummary(opts);
    const summaryPath = buildContainedChildPath(safeOutputDir, `${baseName}-summary.md`);
    await safeWriteText(summaryPath, summaryDoc, 'utf8', { rootDir: safeOutputDir });
    files.push(summaryPath);

    return files;
  }

  // ─── Use Case Specification ──────────────────────────────────────────────
  formatUCS(ucs) {
    const lines = [];

    lines.push(`# Use Case Specification: ${ucs.useCaseId}`);
    lines.push('');
    lines.push(`**Use Case:** ${ucs.useCaseName || ucs.intent || ucs.useCaseId}`);
    lines.push('');
    if (ucs.intent) {
      lines.push(`**Intent:** ${ucs.intent}`);
      lines.push('');
    }
    lines.push(`**Primary Actor:** ${ucs.role || 'Not specified'}`);
    lines.push('');

    // Preconditions
    lines.push('## Preconditions');
    lines.push('');
    if (ucs.preconditions && ucs.preconditions.length) {
      for (const pre of ucs.preconditions) {
        lines.push(`- ${pre}`);
      }
    } else {
      lines.push('- None specified');
    }
    lines.push('');

    // Postconditions
    lines.push('## Postconditions');
    lines.push('');
    if (ucs.postconditions && ucs.postconditions.length) {
      for (const post of ucs.postconditions) {
        lines.push(`- ${post}`);
      }
    } else {
      lines.push('- None specified');
    }
    lines.push('');

    // Basic Flow
    lines.push('## Basic Flow (Happy Path)');
    lines.push('');
    if (ucs.basicFlow && ucs.basicFlow.steps) {
      for (const step of ucs.basicFlow.steps) {
        const desc = step.description || `${step.actor} ${step.action} ${step.businessObject}`;
        lines.push(`**Step ${step.stepId}.** ${desc}`);
        if (step.precondition) {
          lines.push(`  - *Precondition:* ${step.precondition}`);
        }
        if (step.postcondition || step.expectedResult) {
          lines.push(`  - *Expected Result:* ${step.postcondition || step.expectedResult}`);
        }
        lines.push('');
      }
    }

    // Alternative Flows
    if (ucs.alternativeFlows && ucs.alternativeFlows.length) {
      lines.push('## Alternative Flows');
      lines.push('');
      for (const flow of ucs.alternativeFlows) {
        lines.push(`### ${flow.flowId}: ${flow.triggerCondition}`);
        lines.push('');
        lines.push(`> Branches from Step ${flow.deviationPoint}${flow.rejoinPoint ? `, rejoins at Step ${flow.rejoinPoint}` : ''}`);
        lines.push('');
        for (const step of flow.steps) {
          const desc = step.description || `${step.actor} ${step.action} ${step.businessObject}`;
          lines.push(`**Step ${step.stepId}.** ${desc}`);
          if (step.postcondition || step.expectedResult) {
            lines.push(`  - *Expected Result:* ${step.postcondition || step.expectedResult}`);
          }
          lines.push('');
        }
      }
    }

    // Exception Flows
    if (ucs.exceptionFlows && ucs.exceptionFlows.length) {
      lines.push('## Exception Flows');
      lines.push('');
      for (const flow of ucs.exceptionFlows) {
        lines.push(`### ${flow.flowId}: ${flow.triggerCondition}`);
        lines.push('');
        lines.push(`> Branches from Step ${flow.deviationPoint}`);
        lines.push('');
        for (const step of flow.steps) {
          const desc = step.description || `${step.actor} ${step.action} ${step.businessObject}`;
          lines.push(`**Step ${step.stepId}.** ${desc}`);
          if (step.postcondition || step.expectedResult) {
            lines.push(`  - *Expected Result:* ${step.postcondition || step.expectedResult}`);
          }
          lines.push('');
        }
      }
    }

    // Business Objects
    if (ucs.businessObjects && ucs.businessObjects.length) {
      lines.push('## Business Objects');
      lines.push('');
      for (const bo of ucs.businessObjects) {
        lines.push(`- **${bo}**`);
      }
      lines.push('');
    }

    // Related Use Cases
    if (ucs.relatedUseCases && ucs.relatedUseCases.length) {
      lines.push('## Related Use Cases');
      lines.push('');
      for (const uc of ucs.relatedUseCases) {
        lines.push(`- ${uc}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  // ─── Test Cases ──────────────────────────────────────────────────────────
  formatTestCases(testCases, ucs) {
    const lines = [];

    lines.push(`# Test Cases: ${ucs.useCaseId}`);
    lines.push('');
    lines.push(`Generated from Use Case: **${ucs.useCaseName || ucs.intent || ucs.useCaseId}**`);
    lines.push('');
    lines.push(`Total test cases: **${testCases.length}**`);
    lines.push('');

    // Summary table
    lines.push('## Overview');
    lines.push('');
    for (const tc of testCases) {
      const icon = tc.type === 'basic' ? '✅' : tc.type === 'alternative' ? '🔀' : '⚠️';
      lines.push(`- ${icon} **${tc.testCaseId}** — ${tc.triggerCondition || 'Happy Path'} *(${tc.type})*`);
    }
    lines.push('');

    // Detailed test cases
    lines.push('---');
    lines.push('');

    for (const tc of testCases) {
      lines.push(`## ${tc.testCaseId}: ${tc.triggerCondition || 'Basic Flow (Happy Path)'}`);
      lines.push('');
      lines.push(`**Type:** ${tc.type.charAt(0).toUpperCase() + tc.type.slice(1)}`);
      if (tc.triggerCondition) {
        lines.push(`**Trigger:** ${tc.triggerCondition}`);
      }
      if (tc.deviationPoint) {
        lines.push(`**Deviation Point:** Step ${tc.deviationPoint}`);
      }
      lines.push('');

      // Preconditions
      if (tc.preconditions && tc.preconditions.length) {
        lines.push('**Preconditions:**');
        for (const pre of tc.preconditions) {
          lines.push(`- ${pre}`);
        }
        lines.push('');
      }

      // Steps
      lines.push('**Steps:**');
      lines.push('');
      for (let i = 0; i < tc.steps.length; i++) {
        const step = tc.steps[i];
        const desc = step.description || `${step.actor} ${step.action} ${step.businessObject}`;
        lines.push(`${i + 1}. ${desc}`);
        if (step.expectedResult) {
          lines.push(`   - **Expected:** ${step.expectedResult}`);
        }
      }
      lines.push('');

      // Postconditions
      if (tc.expectedPostconditions && tc.expectedPostconditions.length) {
        lines.push('**Expected Postconditions:**');
        for (const post of tc.expectedPostconditions) {
          lines.push(`- ${post}`);
        }
        lines.push('');
      }

      lines.push('---');
      lines.push('');
    }

    return lines.join('\n');
  }

  // ─── Validation Report ───────────────────────────────────────────────────
  formatValidationReport(results, ucs) {
    const lines = [];

    lines.push(`# Consistency Validation Report: ${ucs.useCaseId}`);
    lines.push('');

    const total = results.totalViolations || 0;
    if (total === 0) {
      lines.push('**Status: ✅ All consistency checks passed**');
    } else {
      lines.push(`**Status: ⚠️ ${total} violation(s) found — review recommended**`);
    }
    lines.push('');

    // Process validation (Rules 1 & 2)
    if (results.processResult) {
      lines.push('## Activity Diagram Consistency (Rules 1 & 2)');
      lines.push('');
      lines.push('These rules verify that the UCS is consistent with the business process (activity diagram).');
      lines.push('');

      if (results.processResult.violations.length === 0) {
        lines.push('✅ No violations found.');
      } else {
        for (const v of results.processResult.violations) {
          lines.push(`### ⚠️ Rule ${v.rule} Violation`);
          lines.push('');
          lines.push(`**Issue:** ${v.message}`);
          lines.push('');
          if (v.rule === 1) {
            lines.push(`**What this means:** The business object **${v.businessObject}** appears in the activity diagram but is never referenced in the UCS. This may indicate a missing requirement.`);
            lines.push('');
            lines.push(`**Recommendation:** Add steps to the UCS that address how **${v.businessObject}** is created, used, or managed. Confirm with the business analyst whether this object is in scope.`);
          } else if (v.rule === 2) {
            lines.push('**What this means:** The ordering of business objects in the UCS steps does not match the input/output flow defined in the activity diagram.');
            lines.push('');
            lines.push('**Recommendation:** Review the step ordering and ensure input objects are used before output objects are produced, matching the process flow.');
          }
          lines.push('');
        }
      }
      lines.push('');
    }

    // State validation (Rule 3)
    if (results.stateResults && results.stateResults.length) {
      lines.push('## State Machine Consistency (Rule 3)');
      lines.push('');
      lines.push('This rule verifies that actions in the UCS respect the state transition ordering of each business object.');
      lines.push('');

      for (const sr of results.stateResults) {
        lines.push(`### ${sr.businessObjectName}`);
        lines.push('');
        if (sr.violations.length === 0) {
          lines.push('✅ No violations found.');
        } else {
          for (const v of sr.violations) {
            lines.push(`- ⚠️ ${v.message}`);
          }
        }
        lines.push('');
      }
    }

    // Action items
    if (total > 0) {
      lines.push('## Recommended Actions');
      lines.push('');
      lines.push('1. Review each violation above with the business analyst or product owner.');
      lines.push('2. Update the UCS to address missing business objects or ordering issues.');
      lines.push('3. Re-run validation after changes: `npm start validate <ucs-file> --activity <file> --state <file>`');
      lines.push('');
    }

    return lines.join('\n');
  }

  // ─── Pipeline Summary ────────────────────────────────────────────────────
  formatSummary(opts) {
    const { ucs, testCases, validationResults, refinedUcs, baseName } = opts;
    const lines = [];

    lines.push(`# Requirements Analysis Summary: ${ucs.useCaseId}`);
    lines.push('');
    lines.push(`**Use Case:** ${ucs.useCaseName || ucs.intent || ucs.useCaseId}`);
    lines.push(`**Generated:** ${new Date().toISOString().split('T')[0]}`);
    lines.push('');

    // Overview
    lines.push('## What Was Done');
    lines.push('');
    lines.push('This report was generated by analyzing natural language business requirements');
    lines.push('and converting them into formal, validated specifications using the Li & Zheng (2025)');
    lines.push('framework for structured requirements formalization.');
    lines.push('');
    lines.push('The following artifacts were produced:');
    lines.push('');
    lines.push(`1. **Use Case Specification** — \`${baseName}-use-case-spec.md\``);
    lines.push('   Formal specification with basic flow, alternative flows, and exception flows.');
    lines.push('');
    lines.push(`2. **Test Cases** — \`${baseName}-test-cases.md\``);
    lines.push(`   ${testCases.length} test case(s) covering all flow paths.`);
    lines.push('');
    if (validationResults) {
      lines.push(`3. **Validation Report** — \`${baseName}-validation-report.md\``);
      lines.push('   Consistency checks against activity diagrams and state machines.');
      lines.push('');
    }

    // Key metrics
    lines.push('## Key Metrics');
    lines.push('');

    const basicSteps = ucs.basicFlow ? ucs.basicFlow.steps.length : 0;
    const altFlows = ucs.alternativeFlows ? ucs.alternativeFlows.length : 0;
    const excFlows = ucs.exceptionFlows ? ucs.exceptionFlows.length : 0;
    const bos = ucs.businessObjects ? ucs.businessObjects.length : 0;

    lines.push(`- **Basic flow steps:** ${basicSteps}`);
    lines.push(`- **Alternative flows:** ${altFlows}`);
    lines.push(`- **Exception flows:** ${excFlows}`);
    lines.push(`- **Business objects identified:** ${bos}`);
    lines.push(`- **Test cases generated:** ${testCases.length}`);

    if (validationResults) {
      const violations = validationResults.totalViolations || 0;
      lines.push(`- **Consistency violations:** ${violations}`);
    }
    lines.push('');

    // Business objects
    if (ucs.businessObjects && ucs.businessObjects.length) {
      lines.push('## Business Objects');
      lines.push('');
      lines.push('These are the key domain objects identified in the requirements. Engineers should');
      lines.push('ensure the system data model accounts for each:');
      lines.push('');
      for (const bo of ucs.businessObjects) {
        lines.push(`- **${bo}**`);
      }
      lines.push('');
    }

    // Consistency status
    if (validationResults) {
      lines.push('## Consistency Status');
      lines.push('');
      const total = validationResults.totalViolations || 0;
      if (total === 0) {
        lines.push('✅ The use case specification is fully consistent with the provided UML diagrams.');
      } else {
        lines.push(`⚠️ **${total} inconsistency issue(s) found** between the UCS and the UML diagrams.`);
        lines.push('See the Validation Report for details and recommended actions.');
      }
      lines.push('');
    }

    // Next steps for engineers
    lines.push('## Next Steps for Engineers');
    lines.push('');
    lines.push('1. **Review the Use Case Specification** — Validate that the flows match your understanding of the business requirements. Flag any gaps or ambiguities.');
    lines.push('2. **Review Test Cases** — These define the acceptance criteria. Each test case is a distinct scenario the system must handle.');
    lines.push('3. **Address Validation Findings** — If violations were found, work with the BA/PO to clarify the intended behavior and update the requirements.');
    lines.push('4. **Use as Design Input** — The structured flows and business objects can directly inform your system architecture, API design, and data model.');
    lines.push('5. **Automate Tests** — The test cases can be translated into automated acceptance tests in your test framework of choice.');
    lines.push('');

    return lines.join('\n');
  }
}

module.exports = ReportGenerator;
