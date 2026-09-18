export interface Token {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // epoch ms
  provider: 'jira' | 'asana';
}

export interface TokenStore {
  save(key: string, token: Token): Promise<void>;
  load(key: string): Promise<Token | null>;
  delete(key: string): Promise<void>;
}
