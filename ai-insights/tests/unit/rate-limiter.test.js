import { jest } from '@jest/globals';
import {
  defaultRateLimit,
  getRateLimiterStats,
  rateLimiterInstance,
  resetRateLimit,
} from '../../src/middleware/rateLimiter.js';

const request = { ip: '127.0.0.1', get: () => 'rate-limiter-test' };

beforeEach(() => rateLimiterInstance.cache.flushAll());
afterAll(() => rateLimiterInstance.cache.close());

test('middleware and statistics use the same limiter instance', () => {
  const response = { set: jest.fn() };
  const next = jest.fn();
  defaultRateLimit(request, response, next);
  expect(next).toHaveBeenCalledWith();
  expect(response.set).toHaveBeenCalledWith(expect.objectContaining({
    'X-RateLimit-Limit': 100,
    'X-RateLimit-Remaining': 99,
  }));
  expect(getRateLimiterStats().byType.default).toBe(1);
  resetRateLimit(request);
  expect(getRateLimiterStats().totalKeys).toBe(0);
});

test('rejects requests beyond the configured limit', () => {
  const response = { set: jest.fn() };
  for (let i = 0; i < 100; i++) defaultRateLimit(request, response, () => {});
  const next = jest.fn();
  defaultRateLimit(request, response, next);
  expect(next).toHaveBeenCalledWith(expect.objectContaining({
    message: 'Too many requests, please try again later',
  }));
  expect(response.set).toHaveBeenCalledTimes(100);
});
