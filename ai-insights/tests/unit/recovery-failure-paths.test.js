import { jest } from '@jest/globals';
import { useAIInsights, AIInsightsClient } from '../../src/dashboard/aiInsightsClient.js';
import { AIInsightsEngine } from '../../src/services/AIInsightsEngine.js';
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
function dashboard(client) {
  const values = [];
  const hooks = {
    useState(initial) {
      const index = values.length;
      values.push(initial);
      return [initial, value => { values[index] = value; }];
    },
    useRef: initial => ({ current: initial }),
    useCallback: callback => callback,
  };
  return { state: useAIInsights(client, hooks), values };
}
function engineWith(predict) {
  const engine = new AIInsightsEngine();
  engine.isInitialized = true;
  engine.models.riskPrediction = { predict };
  return engine;
}
afterEach(() => jest.restoreAllMocks());

test('failed refresh clears previously successful dashboard results', async () => {
  const client = { generateInsights: jest.fn().mockResolvedValueOnce({ id: 'old' }).mockRejectedValueOnce(new Error('offline')) };
  const { state, values } = dashboard(client);
  await state.generateInsights({ name: 'old' });
  await expect(state.generateInsights({ name: 'new' })).rejects.toThrow('offline');
  expect(values).toEqual([false, expect.any(Error), null]);
});
test('older success cannot overwrite a newer request or its loading state', async () => {
  const old = deferred(), latest = deferred();
  const { state, values } = dashboard({ generateInsights: jest.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(latest.promise) });
  const a = state.generateInsights({ name: 'A' });
  const b = state.generateInsights({ name: 'B' });
  old.resolve({ id: 'A' });
  await a;
  expect(values).toEqual([true, null, null]);
  latest.resolve({ id: 'B' });
  await b;
  expect(values).toEqual([false, null, { id: 'B' }]);
});
test('older failure cannot replace a newer success', async () => {
  const old = deferred();
  const { state, values } = dashboard({ generateInsights: jest.fn().mockReturnValueOnce(old.promise).mockResolvedValueOnce({ id: 'B' }) });
  const a = state.generateInsights({ name: 'A' });
  const rejected = expect(a).rejects.toThrow('late failure');
  await state.generateInsights({ name: 'B' });
  old.reject(new Error('late failure'));
  await rejected;
  expect(values).toEqual([false, null, { id: 'B' }]);
});
test('clearing results invalidates an outstanding request', async () => {
  const pending = deferred();
  const { state, values } = dashboard({ generateInsights: () => pending.promise });
  const request = state.generateInsights({ name: 'A' });
  state.clearInsights();
  pending.resolve({ id: 'A' });
  await request;
  expect(values).toEqual([false, null, null]);
});
test('cache clear during inference prevents stale repopulation', async () => {
  const pending = deferred();
  const predict = jest.fn().mockReturnValueOnce(pending.promise).mockResolvedValue({ id: 'fresh' });
  const engine = engineWith(predict);
  const a = engine.predictRisk({ name: 'A' });
  engine.clearCache();
  pending.resolve({ id: 'old' });
  await a;
  expect(await engine.predictRisk({ name: 'A' })).toEqual({ id: 'fresh' });
  expect(predict).toHaveBeenCalledTimes(2);
});
test('caller mutation cannot corrupt cached prediction', async () => {
  const engine = engineWith(jest.fn().mockResolvedValue({ nested: { value: 1 } }));
  const first = await engine.predictRisk({ name: 'A' });
  first.nested.value = 99;
  const cached = await engine.predictRisk({ name: 'A' });
  expect(cached.nested.value).toBe(1);
  cached.nested.value = 42;
  expect((await engine.predictRisk({ name: 'A' })).nested.value).toBe(1);
});
test('failed inference is not cached and concurrent projects retain association', async () => {
  const a = deferred(), b = deferred();
  const predict = jest.fn().mockImplementation(input => input.name === 'A' ? a.promise : b.promise);
  const engine = engineWith(predict);
  const first = engine.predictRisk({ name: 'A' });
  const failure = expect(first).rejects.toThrow('inference failed');
  const second = engine.predictRisk({ name: 'B' });
  b.resolve({ id: 'B' });
  a.reject(new Error('inference failed'));
  await failure;
  expect(await second).toEqual({ id: 'B' });
  predict.mockResolvedValue({ id: 'A' });
  expect(await engine.predictRisk({ name: 'A' })).toEqual({ id: 'A' });
  expect(await engine.predictRisk({ name: 'B' })).toEqual({ id: 'B' });
  expect(predict).toHaveBeenCalledTimes(3);
});
test('native fetch network failures are retried', async () => {
  const fetch = jest.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Failed to fetch')).mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
  const client = new AIInsightsClient({ retries: 2, retryDelay: 1 });
  await expect(client.makeRequest('/test')).resolves.toEqual({ success: true });
  expect(fetch).toHaveBeenCalledTimes(2);
});
test('request timeout covers response body consumption', async () => {
  jest.spyOn(globalThis, 'fetch').mockImplementation(async (_url, { signal }) => ({
    ok: true,
    json: () => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })))),
  }));
  const client = new AIInsightsClient({ retries: 1, timeout: 10 });
  await expect(client.makeRequest('/test')).rejects.toMatchObject({ name: 'AbortError' });
}, 300);

test.each([{ success: false, data: {} }, { success: true }, { success: true, data: [] }])(
  'malformed success envelope is rejected: %j', async envelope => {
    const client = new AIInsightsClient();
    jest.spyOn(client, 'makeRequest').mockResolvedValue(envelope);
    await expect(client.generateInsights({ teamSize: 4 })).rejects.toThrow('Invalid insights response');
  },
);
