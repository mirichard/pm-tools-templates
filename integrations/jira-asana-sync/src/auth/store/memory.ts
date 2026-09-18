import type { Token, TokenStore } from '../types';

export class MemoryTokenStore implements TokenStore {
  private map = new Map<string, Token>();

  async save(key: string, token: Token): Promise<void> {
    this.map.set(key, token);
  }
  async load(key: string): Promise<Token | null> {
    return this.map.get(key) || null;
  }
  async delete(key: string): Promise<void> {
    this.map.delete(key);
  }
}
