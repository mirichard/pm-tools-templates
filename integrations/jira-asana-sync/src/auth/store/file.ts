import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import type { Token, TokenStore } from '../types';

export class FileTokenStore implements TokenStore {
  constructor(private baseDir = process.env.TOKEN_DIR || '.tokens') {}

  private fileFor(key: string) {
    return join(this.baseDir, `${key}.json`);
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
