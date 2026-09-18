import { getMe, createProject, createTask } from './api.js';
import type { AsanaTemplate, DeployOptions } from './types.js';

function parseArgs(argv: string[]) {
  const get = (name: string) => {
    const a = argv.find(s => s.startsWith(`--${name}=`));
    return a ? a.split('=')[1] : undefined;
  };
  return {
    dryRun: argv.includes('--dry-run'),
    workspace: get('workspace'),
    token: process.env.ASANA_BEARER,
  } as DeployOptions & { token?: string };
}

export async function deployAsanaProject(tpl: AsanaTemplate, opts: DeployOptions & { token: string }) {
  const { token } = opts;
  let workspace = opts.workspace;
  if (!workspace) {
    const me = await getMe(token);
    workspace = me?.data?.workspaces?.[0]?.gid;
  }
  if (!workspace) throw new Error('No workspace available');

  const proj = await createProject(token, workspace, { name: tpl.name, notes: tpl.notes });
  const projectGid = proj?.data?.gid;
  if (tpl.tasks?.length) {
    for (const t of tpl.tasks) {
      await createTask(token, { name: t.name, notes: t.notes, projects: [projectGid] });
    }
  }
  return proj;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const token = (args as any).token;
  if (!token) {
    console.error('ASANA_BEARER is required');
    process.exit(2);
  }

  const template: AsanaTemplate = {
    name: process.env.ASANA_PROJECT_NAME || 'PM Tools Demo',
    notes: 'Created by pm-tools-templates deployer',
    tasks: [
      { name: 'Kickoff' },
      { name: 'Define Scope' },
    ],
  };

  if (args.dryRun) {
    console.log('[DRY] Would create Asana project with:', { template });
    return;
  }

  try {
    const res = await deployAsanaProject(template, { ...args, token } as any);
    console.log('Created Asana project:', JSON.stringify(res));
  } catch (e:any) {
    console.error('Deploy failed:', e.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

