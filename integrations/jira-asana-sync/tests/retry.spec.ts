import { describe, it, expect, vi } from 'vitest';
import { withRetry, isRateLimitError } from '../src/lib/retry';

describe('retry helper', () => {
  it('resolves immediately when no error', async () => {
    const fn = vi.fn().mockResolvedValue('ok');
    const res = await withRetry(fn);
    expect(res).toBe('ok');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and eventually succeeds', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('transient'))
      .mockResolvedValueOnce('ok');

    const onRetry = vi.fn();
    const res = await withRetry(fn, { minDelayMs: 1, maxDelayMs: 2, onRetry, jitter: false });
    expect(res).toBe('ok');
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('stops after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('boom'));
    await expect(withRetry(fn, { retries: 2, minDelayMs: 1, maxDelayMs: 2, jitter: false })).rejects.toThrow(
      'boom'
    );
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('detects rate limit errors by status', () => {
    expect(isRateLimitError({ response: { status: 429 } })).toBe(true);
    expect(isRateLimitError({ statusCode: 503 })).toBe(true);
    expect(isRateLimitError({})).toBe(false);
  });

  it('detects network errors by code', () => {
    expect(isRateLimitError({ code: 'ECONNRESET' })).toBe(true);
    expect(isRateLimitError({ cause: { code: 'ETIMEDOUT' } })).toBe(true);
  });
});
