const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const TestGenerator = require('../src/test-generator');
const GherkinGenerator = require('../src/gherkin-generator');

// Regression coverage for the finding-2 defect surfaced by PR #1128's Copilot
// review: negative (alternative/exception) scenarios whose only branch step is
// the system's reaction never showed the actor performing the action that
// actually triggers it — e.g. asserting a password-rejection Then without ever
// submitting the rejected password, or an expired-link error without ever
// clicking the link. Root cause: TestGenerator recorded each flow's own
// triggerCondition on the test case for its name only, never rendered it as a
// Given, and never re-asserted the deviation-point action before the branch's
// reactive step. Fixed by: (1) carrying triggerCondition into the test case's
// own preconditions so GherkinGenerator's existing extraPres handling renders
// it as a Given, and (2) synthesizing a When step (actor/action/businessObject
// only, not the happy-path description/postcondition, which would contradict
// the branch's own outcome) reusing the deviation-point step's own fields,
// exactly when that step is actor-driven and the branch's own first step is
// the system's reaction.
module.exports = async function testNegativeScenarioTriggers(runner) {
  const test = (description, fn) => runner.test(description, async () => { await fn(); return true; });

  const ucsFixturePath = path.resolve(__dirname, 'fixtures/pr-1128-ucs-artifact.json');
  const pr1128UCS = await fs.readJSON(ucsFixturePath);
  const generator = new TestGenerator();
  const gherkin = new GherkinGenerator();
  const testCases = generator.generate(pr1128UCS);
  const byFlow = (flowId) => testCases.find((tc) => tc.name.includes(`${flowId}:`));

  await test('finding-2: PR #1128\'s actual "invalid password" scenario (4a) now submits before asserting rejection', () => {
    const tc = byFlow('4a');
    assert.ok(tc, 'expected a test case for flow 4a');
    assert.deepStrictEqual(tc.steps.map((s) => s.stepId), ['1', '2', '3', '4-4a', '4a1', '3', '4', '5', '5.1', '5.2']);
    assert.strictEqual(tc.steps[3].actor, 'User');
    assert.strictEqual(tc.steps[3].action, 'submit');
    assert.ok(tc.preconditions.includes('User enters a new Password that does not meet rules'),
      'triggerCondition must be carried as a scenario-specific precondition');
    const feature = gherkin.generate([tc], pr1128UCS);
    const lines = feature.split('\n').map((l) => l.trim()).filter(Boolean);
    const whenIndex = lines.findIndex((l) => l === 'When the User submit Account');
    const thenIndex = lines.findIndex((l) => l.startsWith('Then the System rejects the new password'));
    assert.ok(whenIndex >= 0 && whenIndex < thenIndex, 'the submission must appear before the rejection is asserted');
    assert.ok(lines.includes('Given the user enters a new Password that does not meet rules'));
  });

  await test('finding-2: PR #1128\'s actual "expired link" scenario (3b) now accesses the link before asserting the error', () => {
    const tc = byFlow('3b');
    assert.ok(tc, 'expected a test case for flow 3b');
    assert.deepStrictEqual(tc.steps.map((s) => s.stepId), ['1', '2', '3-3b', '3b1', '1', '2', '3', '4', '5', '5.1', '5.2']);
    assert.strictEqual(tc.steps[2].actor, 'User');
    assert.strictEqual(tc.steps[2].action, 'access');
    const feature = gherkin.generate([tc], pr1128UCS);
    const lines = feature.split('\n').map((l) => l.trim()).filter(Boolean);
    const whenIndex = lines.findIndex((l) => l === 'When the User access Account');
    const thenIndex = lines.findIndex((l) => l.startsWith('Then the System shows an error message'));
    assert.ok(whenIndex >= 0 && whenIndex < thenIndex, 'accessing the (expired) link must appear before the error is asserted');
    assert.ok(lines.includes('Given the password Reset Link is expired or already used'));
  });

  await test('finding-2: unaffected branch (2a) deviates from a system step, so no synthesized action is added', () => {
    const tc = byFlow('2a');
    assert.ok(tc, 'expected a test case for flow 2a');
    // Deviation point 2 ("System send") is not user-driven, so there is no
    // user action to re-assert — only the flow's own reactive step follows
    // the pre-deviation basic steps.
    assert.deepStrictEqual(tc.steps.map((s) => s.stepId), ['1', '2a1']);
    assert.ok(tc.preconditions.includes('Email does not match any registered account'));
  });

  await test('finding-2: no duplicate synthesis when the branch already opens with an actor-driven step', () => {
    const ucs = {
      useCaseId: 'UC-01', intent: 'Test', role: 'User',
      preconditions: [], postconditions: [],
      basicFlow: { steps: [
        { stepId: '1', actor: 'User', action: 'starts', businessObject: 'Process' },
        { stepId: '2', actor: 'System', action: 'confirms', businessObject: 'Process' },
      ]},
      alternativeFlows: [{
        flowId: '1a', deviationPoint: '1', triggerCondition: 'User retries immediately',
        // This branch's own first step is already actor-driven, so nothing
        // should be synthesized ahead of it.
        steps: [
          { stepId: '1a1', actor: 'User', action: 'retries', businessObject: 'Process' },
          { stepId: '1a2', actor: 'System', action: 'confirms', businessObject: 'Process' },
        ],
      }],
      exceptionFlows: [],
    };
    const tcs = new TestGenerator().generate(ucs);
    assert.deepStrictEqual(tcs[1].steps.map((s) => s.stepId), ['1a1', '1a2']);
  });
};
