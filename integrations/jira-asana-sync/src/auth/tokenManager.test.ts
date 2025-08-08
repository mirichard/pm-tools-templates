import { describe, it, expect } from 'vitest';
import { shouldRefresh } from './tokenManager';

describe('token refresh heuristic', () => {
  it('does not refresh when no expiry is known', () => {
    expect(shouldRefresh(undefined, 1000, 300)).toBe(false);
  });
  it('refreshes when expiry within skew window', () => {
    // expires at 1200, now 1000, skew 300 => 200 <= 300 => refresh
    expect(shouldRefresh(1200, 1000, 300)).toBe(true);
  });
  it('does not refresh when expiry is far in future', () => {
    expect(shouldRefresh(5000, 1000, 300)).toBe(false);
  });
});
