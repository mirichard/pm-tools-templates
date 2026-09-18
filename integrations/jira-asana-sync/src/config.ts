import dotenv from 'dotenv';

dotenv.config();

function req(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing required env var: ${name}`);
  return v.trim();
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  dryRun: /^true$/i.test(process.env.DRY_RUN || ''),
  jira: {
    clientId: req('JIRA_CLIENT_ID'),
    clientSecret: req('JIRA_CLIENT_SECRET'),
    scopes: (process.env.JIRA_CLOUD_SCOPES || '').split(',').map(s => s.trim()).filter(Boolean),
    redirectUri: req('JIRA_REDIRECT_URI')
  },
  asana: {
    clientId: req('ASANA_CLIENT_ID'),
    clientSecret: req('ASANA_CLIENT_SECRET'),
    scopes: (process.env.ASANA_SCOPES || '').split(',').map(s => s.trim()).filter(Boolean),
    redirectUri: req('ASANA_REDIRECT_URI')
  }
} as const;

export type AppConfig = typeof config;
