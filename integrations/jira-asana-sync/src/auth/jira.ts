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
    } as any;

    const accessToken = await client.getToken(tokenParams);
    return accessToken;
  }

  return { authorizeUrl, fetchToken };
}
