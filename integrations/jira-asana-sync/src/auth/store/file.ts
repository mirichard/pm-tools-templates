import { promises as fs } from 'fs';
import { dirname, join, resolve, sep } from 'path';
import type { Token, TokenStore } from '../types';

export class FileTokenStore implements TokenStore {
  constructor(private baseDir = process.env.TOKEN_DIR || '.tokens') {}

  private fileFor(key: string) {
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(key)) {
      throw new Error('Invalid token-store key');
    }
    const root = resolve(this.baseDir);
    const file = resolve(join(root, `${key}.json`));
    if (!file.startsWith(`${root}${sep}`)) throw new Error('Token path escapes store');
    return file;
  }

  async save(key: string, token: Token): Promise<void> {
    const file = this.fileFor(key);
    await fs.mkdir(dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(token), { encoding: 'utf8', flag: 'w' });
  }

  async load(key: string): Promise<Token | null> {
    try {
      const file = this.fileFor(key);
      const data = await fs.readFile(file, 'utf8');
      return JSON.parse(data) as Token;
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
