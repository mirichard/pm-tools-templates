import { ActionRegistry, ConditionEvaluator, ExecutionContext, WorkflowEngine, WorkflowValidator } from '../src/index.js';
import { jest } from '@jest/globals';

const definition = (steps) => ({ id: 'test', name: 'Test workflow', version: '1.0.0', steps });
const step = (name, extra = {}) => ({ name, type: 'log-message', parameters: {}, ...extra });
const context = () => new ExecutionContext({ executionId: 'execution', workflowId: 'workflow' });
let engine;
beforeEach(async () => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  engine = new WorkflowEngine();
  await engine.initialize();
});
afterEach(async () => { await engine.shutdown(); jest.restoreAllMocks(); });

test('initializes the three implemented built-in actions', () => {
  expect(engine.actionRegistry.getActionTypes().sort()).toEqual(['delay', 'http-request', 'log-message']);
});
test('executes steps in order and interpolates output into the next step', async () => {
  const execute = jest.fn(async (parameters) => parameters.message);
  engine.actionRegistry.register('log-message', { execute });
  const result = await engine.executeWorkflow(definition([
    step('first', { parameters: { message: 'hello' }, outputVariable: 'greeting' }),
    step('second', { parameters: { message: '{{greeting}} world' } }),
  ]));
  expect(result.result).toEqual(['hello', 'hello world']);
  expect(result.stepsExecuted).toBe(2);
  expect(engine.getExecutionStatus(result.executionId).status).toBe('completed');
  expect(engine.getMetrics()).toMatchObject({ activeCount: 0, successfulExecutions: 1 });
});
test('skips a false condition without invoking its action', async () => {
  const execute = jest.fn(async () => 'ran');
  engine.actionRegistry.register('log-message', { execute });
  const result = await engine.executeWorkflow(definition([step('skip', { condition: 'false' }), step('run')]));
  expect(execute).toHaveBeenCalledTimes(1);
  expect(engine.getExecutionStatus(result.executionId).steps[0].status).toBe('skipped');
});
test('executes the matching branch only', async () => {
  const execute = jest.fn(async p => p.message);
  engine.actionRegistry.register('log-message', { execute });
  const result = await engine.executeWorkflow(definition([{ name: 'choose', type: 'branch', branches: [
    { condition: 'false', steps: [step('no')] },
    { condition: 'true', steps: [step('yes', { parameters: { message: 'selected' } })] },
  ] }]));
  expect(result.result).toEqual([['selected']]);
  expect(execute).toHaveBeenCalledTimes(1);
});
test('executes parallel steps and retains their definition order', async () => {
  engine.actionRegistry.register('log-message', { execute: async p => p.message });
  const result = await engine.executeWorkflow(definition([{ name: 'both', type: 'parallel', parallel: [
    step('a', { parameters: { message: 'a' } }), step('b', { parameters: { message: 'b' } }),
  ] }]));
  expect(result.result).toEqual([['a', 'b']]);
});
test('retries a transient step failure', async () => {
  const execute = jest.fn().mockRejectedValueOnce(new Error('temporary')).mockResolvedValue('recovered');
  engine.actionRegistry.register('log-message', { execute });
  const result = await engine.executeWorkflow(definition([step('retry', { retryCount: 1 })]));
  expect(result.result).toEqual(['recovered']);
  expect(execute).toHaveBeenCalledTimes(2);
});
test('rejects exhausted retries and clears active executions', async () => {
  const execute = jest.fn().mockRejectedValue(new Error('unavailable'));
  engine.actionRegistry.register('log-message', { execute });
  await expect(engine.executeWorkflow(definition([step('retry', { retryCount: 2 })])))
    .rejects.toThrow('Step failed after 2 retries');
  expect(execute).toHaveBeenCalledTimes(3);
  expect(engine.getMetrics()).toMatchObject({ activeCount: 0, failedExecutions: 1 });
});
test('continues after a failure only when requested', async () => {
  engine.actionRegistry.register('log-message', { execute: jest.fn().mockRejectedValueOnce(new Error('failed')).mockResolvedValue('next') });
  const result = await engine.executeWorkflow(definition([step('failure', { continueOnError: true }), step('next')]));
  expect(result.result).toEqual([{ error: 'failed', continued: true }, 'next']);
});
test.each([null, {}, definition([]), definition([step('same'), step('same')])])('rejects invalid workflow %j', async value => {
  await expect(engine.executeWorkflow(value)).rejects.toThrow('Invalid workflow');
  expect(engine.activeWorkflows.size).toBe(0);
});
test('validates numeric and string bounds without a ReferenceError', () => {
  const registry = new ActionRegistry();
  expect(registry.validateParametersAgainstSchema({ count: 0, label: 'x' }, [
    { name: 'count', type: 'number', min: 1 }, { name: 'label', type: 'string', minLength: 2 },
  ])).toMatchObject({ valid: false, errors: ['Parameter count must be at least 1', 'Parameter label must be at least 2 characters'] });
  expect(registry.validateParametersAgainstSchema({ count: 3 }, [{ name: 'count', min: 1, max: 4 }]).valid).toBe(true);
});
test('rejects an action without an execute method', () => {
  expect(() => new ActionRegistry().register('invalid', {})).toThrow('execute');
});
test('validates condition objects that shadow hasOwnProperty', () => {
  expect(new ConditionEvaluator().validateCondition({ operator: '===', left: 1, right: 1, hasOwnProperty: null }).valid).toBe(true);
});
test('evaluates comparisons and logical conditions', async () => {
  const evaluator = new ConditionEvaluator(); const ctx = context(); ctx.setVariable('score', 90);
  expect(await evaluator.evaluate({ and: [{ operator: '>', left: '{{score}}', right: 80 }, true] }, ctx)).toBe(true);
  expect(await evaluator.evaluate({ or: [false, false] }, ctx)).toBe(false);
});
test('clones input context and resolves nested values', () => {
  const ctx = context(); const input = { value: 1 }; ctx.setVariable('item', input); input.value = 2;
  expect(ctx.getVariable('item.value')).toBe(1);
});
test('rejects missing HTTP action parameters during workflow validation', async () => {
  expect((await new WorkflowValidator().validate(definition([{ name: 'get', type: 'http-request' }]))).valid).toBe(false);
});
