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
const { isSystemActor } = require('./actor-role');

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
        // A flow's triggerCondition is never safe as an upfront Given: even a
        // condition that looks pre-existing (e.g. #2a's "email does not match
        // any registered account") is only relevant once its deviation point
        // is reached, and a condition the deviation point itself produces
        // (e.g. #7a's "email delivery failure" from attempting to send) is
        // outright false before that point runs. Always assert it right after
        // the prefix steps, at the deviation point, never before them.
        const deviationStep = basicSteps[i];
        const branchOpensWithReaction = flow.steps.length > 0 && isSystemActor(flow.steps[0].actor);
        // A system-driven deviation point is ambiguous on its own: the branch
        // may replace it entirely (e.g. #2a shows a generic message *instead
        // of* sending a link — the send is never attempted, and the branch's
        // own step acts on a different business object) or it may react to
        // that step's own outcome (e.g. a web-store example's #7a, "Email
        // delivery failure" from attempting to send a confirmation — the
        // branch's own step acts on the *same* business object as the send).
        // Business-object identity is the structural signal that
        // distinguishes them without guessing at triggerCondition prose.
        const reactsToSameBusinessObject =
          branchOpensWithReaction && flow.steps[0].businessObject === deviationStep.businessObject;
        // Synthesize a re-assertion of the deviation-point action whenever the
        // branch's own steps open straight with a reaction and never show the
        // action that actually triggers it — either because it's user-driven
        // (asserting a rejection without ever submitting the rejected input),
        // or because it's a system action whose own attempt produced the
        // branch's trigger condition (asserting a delivery failure without
        // ever attempting the send).
        const synthesizesTrigger =
          branchOpensWithReaction && (!isSystemActor(deviationStep.actor) || reactsToSameBusinessObject);

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

        // Establish the branch's trigger condition at the deviation point,
        // after the prefix steps that make it possible (e.g. a reset link
        // must be created before it can be expired, or a send attempted
        // before it can fail), instead of asserting it as if it already held
        // at the start of the scenario.
        testCase.steps.push({
          stepKind: 'given',
          stepId: `${deviationStep.stepId}-${flow.flowId}-given`,
          description: flow.triggerCondition,
        });

        if (synthesizesTrigger) {
          // Reuse _formatStep so sourceRequirementId/sourceText (the traceability
          // contract requires generated tests/Gherkin retain them) are preserved
          // from the deviation-point step, then override the fields that must not
          // carry the happy-path narrative.
          testCase.steps.push({
            ...this._formatStep(deviationStep),
            stepId: `${deviationStep.stepId}-${flow.flowId}`,
            description: `${deviationStep.actor} ${deviationStep.action} ${deviationStep.businessObject}`,
            expectedResult: null,
          });
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
      ...(typeof step.sourceText === 'string' ? {
        sourceRequirementId: step.sourceRequirementId, sourceText: step.sourceText,
      } : {}),
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
        if (typeof step.sourceText === 'string') lines.push(`      Source requirement ${step.sourceRequirementId}: ${step.sourceText}`);
      }
    }
    return lines.join('\n');
  }
}

module.exports = TestGenerator;
