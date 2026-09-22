import { AIInsightsResult } from '../../src/dashboard/aiInsightsClient.js';

describe('AIInsightsResult security boundaries', () => {
  test('escapes markup and drops prototype mutation keys recursively', () => {
    const input = JSON.parse('{"safe":"<img src=x onerror=alert(1)>","__proto__":{"polluted":true}}');
    const result = new AIInsightsResult(input);
    expect(result.data.safe).toBe('&lt;img src=x onerror=alert(1)&gt;');
    expect(Object.prototype.hasOwnProperty.call(result.data, '__proto__')).toBe(false);
    expect({}.polluted).toBeUndefined();
  });
});
