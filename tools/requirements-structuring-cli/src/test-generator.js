/**
 * Test Case Generator
 *
 * Implements Algorithm 1 (GenTestCase) from Li & Zheng (2025).
 *
 * Given a UCS template, generates test cases by:
 * 1. Basic flow → first test case (happy path)
 * 2. For each step with an alternative/exception branch:
 *    - All steps before the deviation point
 *    - The full alternative/exception path
 *    - Rejoin to basic flow at defined point, otherwise terminate
 * 3. Each test case is a standalone start-to-finish scenario
 */

const { UCSTemplate } = require('./ucs-template');

class TestGenerator {
  /**
   * Generate test cases from a UCS template
   * Implements Algorithm 1: GenTestCase
   *
   * @param {UCSTemplate} ucsTemplate - The use case specification
   * @returns {object[]} Array of test cases
   */
  generate(ucsTemplate) {
    const ucs =
      ucsTemplate instanceof UCSTemplate
        ? ucsTemplate
        : UCSTemplate.fromJSON(ucsTemplate);

    const testCases = [];
    const basicSteps = ucs.basicFlow.steps;
    const n = basicSteps.length;

    // Line 2-3: mainTestCase ← BF; TestCaseSet ← {mainTestCase}
    testCases.push({
      testCaseId: `TC-${ucs.useCaseId}-01`,
      name: `${ucs.intent} - Basic Flow (Happy Path)`,
      useCaseId: ucs.useCaseId,
      type: 'basic',
      preconditions: ucs.preconditions,
      steps: basicSteps.map((s) => this._formatStep(s)),
      expectedPostconditions: ucs.postconditions,
    });

    let tcCounter = 2;

    // Line 4: for each step_i in BF (where 1 ≤ i ≤ n)
    for (let i = 0; i < n; i++) {
      const stepId = basicSteps[i].stepId;
      const branchingFlows = ucs.getFlowsAtStep(stepId);

      // Line 5: for each alternative flow altF_ij in altF_i
      for (const flow of branchingFlows) {
        const testCase = {
          testCaseId: `TC-${ucs.useCaseId}-${String(tcCounter).padStart(2, '0')}`,
          name: `${ucs.intent} - ${flow.flowId}: ${flow.triggerCondition}`,
          useCaseId: ucs.useCaseId,
          type: flow.flowId.includes('b') ? 'exception' : 'alternative',
          triggerCondition: flow.triggerCondition,
          deviationPoint: flow.deviationPoint,
          preconditions: ucs.preconditions,
          steps: [],
          expectedPostconditions: [],
        };

        // Line 6: testCase ← [step1, step2, ..., step_{i-1}]
        for (let j = 0; j < i; j++) {
          testCase.steps.push(this._formatStep(basicSteps[j]));
        }

        // Line 7: Append all steps from altF_ij to testCase
        for (const altStep of flow.steps) {
          testCase.steps.push(this._formatStep(altStep));
        }

        // A branch without an explicit rejoin terminates after its own steps.
        if (flow.rejoinPoint) {
          // Line 9: Append from rejoin point onward
          const rejoinIndex = basicSteps.findIndex(
            (s) => s.stepId === flow.rejoinPoint
          );
          if (rejoinIndex >= 0) {
            for (let j = rejoinIndex; j < n; j++) {
              testCase.steps.push(this._formatStep(basicSteps[j]));
            }
            testCase.expectedPostconditions = ucs.postconditions;
          }
        }

        testCases.push(testCase);
        tcCounter++;
      }
    }

    return testCases;
  }

  /**
   * Format a UCS step into a test case step
   */
  _formatStep(step) {
    return {
      stepId: step.stepId,
      description:
        step.description ||
        `${step.actor} ${step.action} ${step.businessObject}${step.toActor ? ` to ${step.toActor}` : ''}`,
      actor: step.actor,
      action: step.action,
      businessObject: step.businessObject,
      expectedResult: step.postcondition || null,
    };
  }

  /**
   * Format test cases as a readable summary
   */
  formatSummary(testCases) {
    const lines = [];
    for (const tc of testCases) {
      lines.push(`\n${tc.testCaseId}: ${tc.name}`);
      lines.push(`  Type: ${tc.type}`);
      if (tc.triggerCondition) {
        lines.push(`  Trigger: ${tc.triggerCondition}`);
      }
      lines.push(`  Steps:`);
      for (const step of tc.steps) {
        lines.push(`    ${step.stepId}. ${step.description}`);
      }
    }
    return lines.join('\n');
  }
}

module.exports = TestGenerator;
