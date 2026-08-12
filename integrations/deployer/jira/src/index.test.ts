import { describe, expect, it } from 'vitest';
import { sanitizeLogValue } from './index.js';

describe('sanitizeLogValue', () => {
  it('neutralizes terminal line separators without losing legitimate text', () => {
    expect(sanitizeLogValue('failed\r\nfor tenant\u2028next')).toBe('failed  for tenant next');
  });
});
