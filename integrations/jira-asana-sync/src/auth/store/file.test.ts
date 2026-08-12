import { describe, expect, it } from 'vitest';
import { FileTokenStore } from './file';

describe('FileTokenStore key boundary', () => {
  const store = new FileTokenStore('/tmp/jira-asana-token-test');

  it.each(['../escape', 'nested/key', 'line\nbreak', '', 'a'.repeat(129)])(
    'rejects unsafe key %j',
    async (key) => {
      await expect(store.load(key)).rejects.toThrow('Invalid token-store key');
    }
  );
});
