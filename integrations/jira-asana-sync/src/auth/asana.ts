import { AuthorizationCode } from 'simple-oauth2';
import type { AppConfig } from '../config';

export function createAsanaClient(cfg: AppConfig) {
  const client = new AuthorizationCode({
    client: {
      id: cfg.asana.clientId,
      secret: cfg.asana.clientSecret,
    },
    auth: {
      tokenHost: 'https://app.asana.com/',
      authorizePath: '/- /oauth_authorize',
      tokenPath: '/- /oauth_token',
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
    } as any;

    const accessToken = await client.getToken(tokenParams);
    return accessToken;
  }

  return { authorizeUrl, fetchToken };
}
