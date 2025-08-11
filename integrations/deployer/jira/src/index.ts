import { getAccessibleResources, createProject } from './api.js';
import type { JiraTemplate, DeployOptions } from './types.js';

function parseArgs(argv: string[]) {
  const get = (name: string) => {
    const a = argv.find(s => s.startsWith(`--${name}=`));
    return a ? a.split('=')[1] : undefined;
  };
  return {
    dryRun: argv.includes('--dry-run'),
    cloudId: get('cloud-id'),
    projectTypeKey: (get('project-type') as any) || 'software',
    token: process.env.JIRA_BEARER,
  } as DeployOptions & { token?: string };
}

export async function deployJiraProject(tpl: JiraTemplate, opts: DeployOptions & { token: string }) {
  const { token } = opts;
  let cloudId = opts.cloudId;
  if (!cloudId) {
    const resources = await getAccessibleResources(token);
    if (!resources?.length) throw new Error('No accessible resources found for token');
    cloudId = resources[0].id;
  }

  const body = {
    key: tpl.key,
    name: tpl.name,
    projectTypeKey: opts.projectTypeKey || 'software',
    leadAccountId: undefined,
    assigneeType: 'PROJECT_LEAD',
    // Use a simplified template; admins can adjust post-creation
  } as any;

  return createProject(token, cloudId!, body);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const token = (args as any).token;
  if (!token) {
    console.error('JIRA_BEARER is required');
    process.exit(2);
  }

  const template: JiraTemplate = {
    name: process.env.JIRA_PROJECT_NAME || 'PM Tools Demo',
    key: process.env.JIRA_PROJECT_KEY || 'PMD',
  };

  if (args.dryRun) {
    console.log('[DRY] Would create Jira project with:', { template, projectTypeKey: args.projectTypeKey });
    return;
  }

  try {
    const res = await deployJiraProject(template, { ...args, token } as any);
    console.log('Created Jira project:', JSON.stringify(res));
  } catch (e:any) {
    console.error('Deploy failed:', e.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

