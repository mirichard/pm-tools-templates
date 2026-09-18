import { AuthorizationCode } from 'simple-oauth2';
import type { AppConfig } from '../config';

export function createAsanaClient(cfg: AppConfig) {
  const client = new AuthorizationCode({
    client: {
      id: cfg.asana.clientId,
      secret: cfg.asana.clientSecret,
    },
    auth: {
      tokenHost: 'https://app.asana.com',
      authorizePath: '/-/oauth_authorize',
      tokenPath: '/-/oauth_token',
    },
    http: {
      json: 'force',
    }
  });

  function authorizeUrl(state: string) {
    return client.authorizeURL({
      redirect_uri: cfg.asana.redirectUri,
      scope: cfg.asana.scopes,
      state,
    });
  }

  async function fetchToken(code: string) {
    const tokenParams = {
      code,
      redirect_uri: cfg.asana.redirectUri,
      grant_type: 'authorization_code',
    } as any;

    const accessToken = await client.getToken(tokenParams);
    return accessToken;
  }

  async function refreshToken(refreshToken: string) {
    const res = await fetch('https://app.asana.com/-/oauth_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: cfg.asana.clientId,
        client_secret: cfg.asana.clientSecret,
        refresh_token: refreshToken,
      })
    });
    if (!res.ok) throw new Error(`Asana refresh token failed: ${res.status} ${res.statusText}`);
    return res.json();
  }

  function normalizeToken(raw: any) {
    const now = Date.now();
    const expiresIn = Number(raw.expires_in || raw.expiresIn || 0) * 1000;
    return {
      accessToken: raw.access_token || raw.accessToken,
      refreshToken: raw.refresh_token || raw.refreshToken,
      expiresAt: expiresIn ? now + expiresIn : undefined,
      provider: 'asana' as const,
    };
  }

  return { authorizeUrl, fetchToken, refreshToken, normalizeToken };
}
