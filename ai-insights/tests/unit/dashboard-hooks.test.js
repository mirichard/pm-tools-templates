import { jest } from '@jest/globals';
import { useAIInsights } from '../../src/dashboard/aiInsightsClient.js';

function createHooks() {
  const setters = [];
  return {
    setters,
    useState(initial) {
      const setter = jest.fn();
      setters.push(setter);
      return [initial, setter];
    },
    useCallback(callback) {
      return callback;
    },
  };
}

describe('dashboard React hook integration', () => {
  test('uses supplied host hooks and records a successful response', async () => {
    const hooks = createHooks();
    const result = { riskLevel: 'low' };
    const client = { generateInsights: jest.fn().mockResolvedValue(result) };
    const state = useAIInsights(client, hooks);
    const input = { teamSize: 4 };

    await expect(state.generateInsights(input)).resolves.toBe(result);
    expect(client.generateInsights).toHaveBeenCalledWith(input);
    expect(hooks.setters[0].mock.calls).toEqual([[true], [false]]);
    expect(hooks.setters[1]).toHaveBeenCalledWith(null);
    expect(hooks.setters[2]).toHaveBeenCalledWith(result);
    state.clearInsights();
    expect(hooks.setters[2]).toHaveBeenLastCalledWith(null);
  });

  test('propagates service errors and resets loading', async () => {
    const hooks = createHooks();
    const error = new Error('Service unavailable');
    const state = useAIInsights({ generateInsights: jest.fn().mockRejectedValue(error) }, hooks);

    await expect(state.generateInsights({ teamSize: 4 })).rejects.toBe(error);
    expect(hooks.setters[0]).toHaveBeenLastCalledWith(false);
    expect(hooks.setters[1]).toHaveBeenLastCalledWith(error);
    expect(hooks.setters[2]).not.toHaveBeenCalled();
  });

  test('supports the browser React global and rejects missing hooks clearly', () => {
    const previous = globalThis.React;
    try {
      globalThis.React = createHooks();
      expect(useAIInsights({}).loading).toBe(false);
      delete globalThis.React;
      expect(() => useAIInsights({})).toThrow('requires React useState and useCallback');
      expect(() => useAIInsights({}, {})).toThrow(TypeError);
    } finally {
      if (previous === undefined) delete globalThis.React;
      else globalThis.React = previous;
    }
  });
});
