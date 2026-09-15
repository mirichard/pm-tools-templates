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
// reactive step. Fixed by: (1) always inserting the flow's triggerCondition as
// a `given` step immediately after the prefix steps (never as an upfront
// scenario precondition — a later Copilot pass on this same fix found that
// even a seemingly pre-existing condition like 2a's is only meaningful once
// its deviation point is reached, and a condition the deviation point itself
// produces, like a web-store example's 7a "email delivery failure" from
// attempting to send, is outright false before that point runs), and (2)
// synthesizing a step re-asserting the deviation-point action
// (actor/action/businessObject only, not the happy-path
// description/postcondition, which would contradict the branch's own
// outcome) whenever the branch's own steps open straight with a reaction and
// never otherwise show it, but only for a user-driven deviation point (2a's
// counterpart above). A later attempt to extend this to system-driven
// deviation points too (matching businessObject as a signal that the branch
// reacts to the deviation step's own outcome, e.g. 7a, rather than replacing
// it, e.g. 2a) was reverted: a follow-up Copilot review produced a
// same-businessObject counter-example ("System sends Confirmation" replaced
// by "System shows a generic error for Confirmation") that is structurally
// identical to 7a but a *replacement*, proving businessObject identity isn't
// a sound signal. System-driven branches only ever get the `given`, never a
// synthesized action — an accepted gap (the send attempt in a case like 7a
// stays implicit), not a defect to keep chasing with unsound heuristics. A
// separate attempt to skip synthesis whenever any later branch step matched
// the deviation action (to avoid a "duplicate" when the branch reacts then
// has the user retry) was also reverted: branchOpensWithReaction already
// guarantees the branch's first step is the reaction, so any such match is
// necessarily a retry AFTER it, not the trigger action shown BEFORE it —
// suppressing synthesis there just reintroduced the original #1168 defect.
// The synthesized action and a later identical-looking retry are distinct
// events, not a duplicate to eliminate.
module.exports = async function testNegativeScenarioTriggers(runner) {
  const test = (description, fn) => runner.test(description, async () => { await fn(); return true; });

  const ucsFixturePath = path.resolve(__dirname, 'fixtures/pr-1128-ucs-artifact.json');
  const pr1128UCS = await fs.readJSON(ucsFixturePath);
  const generator = new TestGenerator();
  const gherkin = new GherkinGenerator();
  const testCases = generator.generate(pr1128UCS);
  const byFlow = (flowId) => testCases.find((tc) => tc.name.includes(`${flowId}:`));

  const webStoreUCS = await fs.readJSON(path.resolve(__dirname, '../examples/web-store-ucs.json'));
  const webStoreTestCases = generator.generate(webStoreUCS);
  const byWebStoreFlow = (flowId) => webStoreTestCases.find((tc) => tc.name.includes(`${flowId}:`));

  await test('finding-2: PR #1128\'s actual "invalid password" scenario (4a) now submits before asserting rejection', () => {
    const tc = byFlow('4a');
    assert.ok(tc, 'expected a test case for flow 4a');
    assert.deepStrictEqual(tc.steps.map((s) => s.stepId),
      ['1', '2', '3', '4-4a-given', '4-4a', '4a1', '3', '4', '5', '5.1', '5.2']);
    assert.strictEqual(tc.steps[3].stepKind, 'given');
    assert.strictEqual(tc.steps[3].description, 'User enters a new Password that does not meet rules');
    assert.strictEqual(tc.steps[4].actor, 'User');
    assert.strictEqual(tc.steps[4].action, 'submit');
    assert.ok(!tc.preconditions.includes('User enters a new Password that does not meet rules'),
      'a triggerCondition only true at the deviation point must not be an upfront precondition (#1128 finding 2)');
    const feature = gherkin.generate([tc], pr1128UCS);
    const lines = feature.split('\n').map((l) => l.trim()).filter(Boolean);
    const accessIndex = lines.findIndex((l) => l === 'When the User accesses their Account via the System using the reset link, and is presented with a form to enter a new password.');
    const givenIndex = lines.findIndex((l) => l === 'Given the user enters a new Password that does not meet rules');
    const whenIndex = lines.findIndex((l) => l === 'When the User submit Account');
    const thenIndex = lines.findIndex((l) => l.startsWith('Then the System rejects the new password'));
    assert.ok(givenIndex >= 0, 'expected the trigger condition rendered as a Given');
    assert.ok(accessIndex < givenIndex, 'the Given must follow the steps that make the condition possible');
    assert.ok(givenIndex < whenIndex && whenIndex < thenIndex,
      'the Given must precede the submission, which must precede the rejection');
  });

  await test('finding-2: PR #1128\'s actual "expired link" scenario (3b) now accesses the link before asserting the error', () => {
    const tc = byFlow('3b');
    assert.ok(tc, 'expected a test case for flow 3b');
    assert.deepStrictEqual(tc.steps.map((s) => s.stepId),
      ['1', '2', '3-3b-given', '3-3b', '3b1', '1', '2', '3', '4', '5', '5.1', '5.2']);
    assert.strictEqual(tc.steps[2].stepKind, 'given');
    assert.strictEqual(tc.steps[2].description, 'Password Reset Link is expired or already used');
    assert.strictEqual(tc.steps[3].actor, 'User');
    assert.strictEqual(tc.steps[3].action, 'access');
    assert.ok(!tc.preconditions.includes('Password Reset Link is expired or already used'),
      'a triggerCondition only true once the link has been sent must not be an upfront precondition (#1128 finding 2)');
    const feature = gherkin.generate([tc], pr1128UCS);
    const lines = feature.split('\n').map((l) => l.trim()).filter(Boolean);
    const sendIndex = lines.findIndex((l) => l === "Then the System sends a Password Reset Link to the User's registered email address.");
    const givenIndex = lines.findIndex((l) => l === 'Given the password Reset Link is expired or already used');
    const whenIndex = lines.findIndex((l) => l === 'When the User access Account');
    const thenIndex = lines.findIndex((l) => l.startsWith('Then the System shows an error message'));
    assert.ok(givenIndex >= 0, 'expected the trigger condition rendered as a Given');
    assert.ok(sendIndex < givenIndex, 'the Given must follow the step that sends the link, not precede it');
    assert.ok(givenIndex < whenIndex && whenIndex < thenIndex,
      'the Given must precede accessing the (expired) link, which must precede the error');
  });

  await test('finding-2: unaffected branch (2a) deviates from a system step, so no synthesized action is added', () => {
    const tc = byFlow('2a');
    assert.ok(tc, 'expected a test case for flow 2a');
    // Deviation point 2 ("System send") is not user-driven, so there is no
    // user action to re-assert — only a `given` for the trigger condition,
    // then the flow's own reactive step, follow the pre-deviation basic steps.
    assert.deepStrictEqual(tc.steps.map((s) => s.stepId), ['1', '2-2a-given', '2a1']);
    assert.strictEqual(tc.steps[1].stepKind, 'given');
    assert.strictEqual(tc.steps[1].description, 'Email does not match any registered account');
    assert.ok(!tc.preconditions.includes('Email does not match any registered account'),
      'even a seemingly pre-existing trigger condition must not be an upfront precondition (#1128 finding 2 follow-up)');
  });

  await test('finding-2 follow-up: system-driven deviation points never get a synthesized re-assertion, even when the branch reacts to their own outcome', () => {
    const tc = byWebStoreFlow('7a');
    assert.ok(tc, 'expected a test case for flow 7a');
    // Deviation point 7 ("System sends confirmation email") is system-driven.
    // 7a's own first step reacts to that outcome ("Email delivery failure"),
    // but businessObject identity isn't a sound signal for that vs. an
    // outright replacement (see the module comment above) — so only the
    // `given` is added, never a synthesized re-assertion of the send.
    assert.deepStrictEqual(tc.steps.map((s) => s.stepId),
      ['1', '2', '3', '4', '5', '6', '7-7a-given', '7a1', '7a2']);
    assert.strictEqual(tc.steps[6].stepKind, 'given');
    assert.strictEqual(tc.steps[6].description, 'Email delivery failure');
    assert.ok(!tc.preconditions.includes('Email delivery failure'));
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
        // should be synthesized ahead of it — only the trigger's `given`.
        steps: [
          { stepId: '1a1', actor: 'User', action: 'retries', businessObject: 'Process' },
          { stepId: '1a2', actor: 'System', action: 'confirms', businessObject: 'Process' },
        ],
      }],
      exceptionFlows: [],
    };
    const tcs = new TestGenerator().generate(ucs);
    assert.deepStrictEqual(tcs[1].steps.map((s) => s.stepId), ['1-1a-given', '1a1', '1a2']);
    assert.strictEqual(tcs[1].steps[0].stepKind, 'given');
  });

  await test('finding-2 follow-up: a branch that reacts and then retries the identical action still gets the synthesized trigger, not a suppressed one', () => {
    // The branch opens with a system reaction and later includes the user
    // redoing the exact deviation action (same actor/action/businessObject)
    // — e.g. reject, then retry. A prior fix suppressed synthesis whenever
    // any later branch step matched the deviation action, reasoning it was
    // a duplicate; a Copilot review correctly pointed out that match is
    // necessarily AFTER the reaction (branchOpensWithReaction guarantees the
    // branch's first step is the reaction), so it's a distinct retry, not
    // evidence the *initial* (invalid) submission was ever shown. Suppressing
    // synthesis there reintroduced the #1168 defect (reject shown with no
    // prior submission). The synthesized action and the later retry are two
    // different events and both must appear.
    const ucs = {
      useCaseId: 'UC-01', intent: 'Test', role: 'User',
      preconditions: [], postconditions: [],
      basicFlow: { steps: [
        { stepId: '1', actor: 'User', action: 'submits', businessObject: 'Form' },
      ]},
      alternativeFlows: [{
        flowId: '1a', deviationPoint: '1', triggerCondition: 'Form is invalid',
        steps: [
          { stepId: '1a1', actor: 'System', action: 'rejects', businessObject: 'Form' },
          { stepId: '1a2', actor: 'User', action: 'submits', businessObject: 'Form' },
          { stepId: '1a3', actor: 'System', action: 'accepts', businessObject: 'Form' },
        ],
      }],
      exceptionFlows: [],
    };
    const tcs = new TestGenerator().generate(ucs);
    assert.deepStrictEqual(tcs[1].steps.map((s) => s.stepId), ['1-1a-given', '1-1a', '1a1', '1a2', '1a3']);
    assert.strictEqual(tcs[1].steps[0].stepKind, 'given');
    assert.strictEqual(tcs[1].steps[1].actor, 'User');
    assert.strictEqual(tcs[1].steps[1].action, 'submits');
  });
};
