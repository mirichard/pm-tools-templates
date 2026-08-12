const { EventEmitter } = require('events');

describe('webhook logging boundary', () => {
  test('neutralizes control characters from route and header values', async () => {
    const { logger } = await import('../src/middleware/logger.mjs');
    const response = new EventEmitter();
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger({ params: { provider: 'jira\nforged' }, headers: { 'x-github-event': 'push\rforged' } }, response, () => {});
    response.emit('finish');
    expect(spy).toHaveBeenCalledWith(expect.not.stringContaining('forged'));
    spy.mockRestore();
  });
});
