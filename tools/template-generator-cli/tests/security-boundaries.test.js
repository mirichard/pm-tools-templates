const { UsageAnalyticsCollector } = require('../src/ecosystem-gateway');

describe('security boundaries', () => {
  test('session identifiers contain cryptographic hex entropy', () => {
    const collector = Object.create(UsageAnalyticsCollector.prototype);
    const first = collector.generateSessionId();
    const second = collector.generateSessionId();
    expect(first).toMatch(/^session-\d+-[0-9a-f]{16}$/);
    expect(second).not.toBe(first);
  });
});
