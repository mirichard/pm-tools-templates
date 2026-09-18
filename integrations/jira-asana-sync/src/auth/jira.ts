import { AuthorizationCode } from 'simple-oauth2';
import type { AppConfig } from '../config';

export function createJiraClient(cfg: AppConfig) {
  const client = new AuthorizationCode({
    client: {
      id: cfg.jira.clientId,
      secret: cfg.jira.clientSecret,
    },
    auth: {
      tokenHost: 'https://auth.atlassian.com',
      authorizePath: '/authorize',
      tokenPath: '/oauth/token',
    },
    http: {
      json: 'force',
    }
  });

  function authorizeUrl(state: string) {
    return client.authorizeURL({
      redirect_uri: cfg.jira.redirectUri,
      scope: cfg.jira.scopes,
      state,
      audience: 'api.atlassian.com'
    });
  }

  async function fetchToken(code: string) {
    const tokenParams = {
      code,
      redirect_uri: cfg.jira.redirectUri,
      grant_type: 'authorization_code',
      audience: 'api.atlassian.com'
    } as any;

    const accessToken = await client.getToken(tokenParams);
    return accessToken;
  }

  async function refreshToken(refreshToken: string) {
    // Minimal direct token endpoint call; avoids pulling types/runtime from simple-oauth2 AccessToken
    const res = await fetch('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: cfg.jira.clientId,
        client_secret: cfg.jira.clientSecret,
        refresh_token: refreshToken,
        audience: 'api.atlassian.com'
      })
    });
    if (!res.ok) throw new Error(`Jira refresh token failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  function normalizeToken(raw: any) {
    const now = Date.now();
    const expiresIn = Number(raw.expires_in || raw.expiresIn || 0) * 1000;
    return {
      accessToken: raw.access_token || raw.accessToken,
      refreshToken: raw.refresh_token || raw.refreshToken,
      expiresAt: expiresIn ? now + expiresIn : undefined,
      provider: 'jira' as const,
    };
  }

  return { authorizeUrl, fetchToken, refreshToken, normalizeToken };
}
