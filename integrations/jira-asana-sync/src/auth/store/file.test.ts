import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
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

describe('FileTokenStore encryption boundary', () => {
  const directories: string[] = [];

  afterEach(async () => {
    await Promise.all(directories.splice(0).map((directory) => fs.rm(directory, {
      recursive: true,
      force: true
    })));
  });

  it('stores authenticated ciphertext and restores the token', async () => {
    const directory = await fs.mkdtemp(join(tmpdir(), 'jira-asana-token-'));
    directories.push(directory);
    const encryptionKey = Buffer.alloc(32, 7).toString('base64');
    const store = new FileTokenStore(directory, encryptionKey);
    const token = {
      accessToken: 'sensitive-access-token',
      refreshToken: 'sensitive-refresh-token',
      expiresAt: 1_800_000_000_000,
      provider: 'jira' as const
    };

    await store.save('jira-default', token);

    const files = await fs.readdir(directory);
    const stored = await fs.readFile(join(directory, files[0]), 'utf8');
    expect(stored).not.toContain(token.accessToken);
    expect(stored).not.toContain(token.refreshToken);
    expect((await fs.stat(join(directory, files[0]))).mode & 0o777).toBe(0o600);
    await expect(store.load('jira-default')).resolves.toEqual(token);
  });

  it('rejects an invalid encryption key before persisting a token', async () => {
    const store = new FileTokenStore('/tmp/jira-asana-invalid-key', 'not-a-key');
    await expect(store.save('jira-default', {
      accessToken: 'token',
      provider: 'jira'
    })).rejects.toThrow('canonical base64-encoded 32-byte key');
  });
});
