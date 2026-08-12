import { promises as fs } from 'fs';
import { dirname, join, resolve, sep } from 'path';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import type { Token, TokenStore } from '../types';

interface EncryptedToken {
  version: 1;
  algorithm: 'aes-256-gcm';
  iv: string;
  authTag: string;
  ciphertext: string;
}

export class FileTokenStore implements TokenStore {
  constructor(
    private baseDir = process.env.TOKEN_DIR || '.tokens',
    private encodedEncryptionKey = process.env.TOKEN_ENCRYPTION_KEY
  ) {}

  private encryptionKey(): Buffer {
    if (!this.encodedEncryptionKey) {
      throw new Error('TOKEN_ENCRYPTION_KEY is required for file token storage');
    }
    const key = Buffer.from(this.encodedEncryptionKey, 'base64');
    if (key.length !== 32 || key.toString('base64') !== this.encodedEncryptionKey) {
      throw new Error('TOKEN_ENCRYPTION_KEY must be a canonical base64-encoded 32-byte key');
    }
    return key;
  }

  private encrypt(token: Token): EncryptedToken {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.encryptionKey(), iv, {
      authTagLength: 16
    });
    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(token), 'utf8'),
      cipher.final()
    ]);
    return {
      version: 1,
      algorithm: 'aes-256-gcm',
      iv: iv.toString('base64'),
      authTag: cipher.getAuthTag().toString('base64'),
      ciphertext: ciphertext.toString('base64')
    };
  }

  private decrypt(envelope: EncryptedToken): Token {
    if (envelope.version !== 1 || envelope.algorithm !== 'aes-256-gcm') {
      throw new Error('Unsupported token-store encryption format');
    }
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey(),
      Buffer.from(envelope.iv, 'base64'),
      { authTagLength: 16 }
    );
    decipher.setAuthTag(Buffer.from(envelope.authTag, 'base64'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(envelope.ciphertext, 'base64')),
      decipher.final()
    ]);
    return JSON.parse(plaintext.toString('utf8')) as Token;
  }

  private fileFor(key: string) {
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(key)) {
      throw new Error('Invalid token-store key');
    }
    const root = resolve(this.baseDir);
    const keyDigest = createHash('sha256').update(key, 'utf8').digest('hex');
    const file = resolve(join(root, `${keyDigest}.json`));
    if (!file.startsWith(`${root}${sep}`)) throw new Error('Token path escapes store');
    return file;
  }

  async save(key: string, token: Token): Promise<void> {
    const file = this.fileFor(key);
    await fs.mkdir(dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(this.encrypt(token)), {
      encoding: 'utf8',
      flag: 'w',
      mode: 0o600
    });
  }

  async load(key: string): Promise<Token | null> {
    try {
      const file = this.fileFor(key);
      const data = await fs.readFile(file, 'utf8');
      return this.decrypt(JSON.parse(data) as EncryptedToken);
    } catch (e: any) {
      if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return null;
      throw e;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await fs.unlink(this.fileFor(key));
    } catch (e: any) {
      if (e && e.code === 'ENOENT') return;
      throw e;
    }
  }
}
