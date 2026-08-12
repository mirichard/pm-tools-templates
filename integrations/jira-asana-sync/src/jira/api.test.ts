import { describe, expect, it } from 'vitest';
import { assertBearerToken } from './api';

describe('Jira bearer-token boundary', () => {
  it('accepts an opaque token without changing it', () => {
    const token = 'AbCdEf0123456789._~-+/=';
    expect(assertBearerToken(token)).toBe(token);
  });

  it.each(['short', 'valid-looking-token\r\nInjected: value', 'token with spaces that is long enough'])(
    'rejects malformed token data',
    (token) => expect(() => assertBearerToken(token)).toThrow('Invalid Jira bearer token format')
  );
});
