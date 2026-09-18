import type { Token, TokenStore } from './types';
import type { AppConfig } from '../config';
import { createJiraClient } from './jira';

export function shouldRefresh(expiresAt?: number, nowMs: number = Date.now(), skewMs: number = 5 * 60 * 1000) {
  if (!expiresAt) return false; // if unknown, caller decides (avoid surprise refresh)
  return expiresAt - nowMs <= skewMs;
}

export async function getValidJiraToken(key: string, store: TokenStore, cfg: AppConfig): Promise<Token | null> {
  const current = await store.load(key);
  if (!current) return null;
  if (!shouldRefresh(current.expiresAt)) return current;
  if (!current.refreshToken) return current; // cannot refresh without refresh token

  const jira = createJiraClient(cfg);
  const refreshedRaw = await jira.refreshToken(current.refreshToken);
  const normalized = jira.normalizeToken(refreshedRaw);
  await store.save(key, normalized);
  return normalized;
}
