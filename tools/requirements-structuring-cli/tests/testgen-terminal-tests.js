const assert = require('assert/strict');
const TestGenerator = require('../src/test-generator');

module.exports = async runner => {
  for (const key of ['alternativeFlows', 'exceptionFlows']) {
    for (const rejoin of [false, true]) {
      await runner.test(`TestGenerator: ${key} ${rejoin ? 'preserves explicit rejoin' : 'terminates without rejoin'}`, () => {
        const input = {
          useCaseId: 'UC-TERMINAL', intent: 'Terminal branch', role: 'User',
          preconditions: ['Request received'], postconditions: ['Success'],
          basicFlow: { steps: [1, 2, 3, 4, 5].map(n => ({
            stepId: String(n), actor: 'System', action: 'performs', businessObject: `step ${n}`,
          })) },
          alternativeFlows: [], exceptionFlows: [], businessObjects: [],
        };
        input[key] = [{
          flowId: key === 'alternativeFlows' ? '2a1' : '2b1', deviationPoint: '2',
          triggerCondition: 'Branch condition',
          steps: [{ stepId: 'branch', actor: 'System', action: 'shows', businessObject: 'confirmation' }],
          ...(rejoin ? { rejoinPoint: '4' } : {}),
        }];
        const original = JSON.stringify(input);
        const cases = new TestGenerator().generate(input);
        assert.deepEqual(cases[0].steps.map(s => s.stepId), ['1', '2', '3', '4', '5']);
        assert.deepEqual(cases[1].steps.map(s => s.stepId), rejoin ? ['1', 'branch', '4', '5'] : ['1', 'branch']);
        assert.deepEqual(cases[1].expectedPostconditions, rejoin ? ['Success'] : []);
        assert.equal(JSON.stringify(input), original);
        return true;
      });
    }
  }
};
