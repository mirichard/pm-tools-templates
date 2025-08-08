import { config } from './config';
import { createJiraClient } from './auth/jira';
import { createAsanaClient } from './auth/asana';

// Minimal dev harness – prints authorization URLs and supports dry-run reconcile (no secrets)
import { MemoryTokenStore } from './auth/store/memory';
import { FileTokenStore } from './auth/store/file';
import { getValidJiraToken } from './auth/tokenManager';
import type { TokenStore } from './auth/types';
import { reconcilePreview } from './sync/reconcile';
import { defaultMapping } from './sync/mapping';

(async () => {
  const provider = (process.argv.find(a => a.startsWith('--provider=')) || '').split('=')[1] as 'jira'|'asana'|undefined;
  const action = (process.argv.find(a => a.startsWith('--action=')) || '').split('=')[1] || 'auth';
  const dryRun = config.dryRun || process.argv.includes('--dry-run');
  if (!provider) {
    console.log('Usage: tsx src/index.ts --provider=jira|asana [--action=auth|reconcile] [--dry-run]');
    process.exit(1);
  }

  // Use file-backed store for local dev so refreshed tokens persist between runs
  const store: TokenStore = new FileTokenStore();

  if (action === 'auth') {
    if (provider === 'jira') {
      const jira = createJiraClient(config);
      const url = jira.authorizeUrl('state-jira');
      console.log(`[DRY=${dryRun}] Jira authorize URL:\n${url}`);
    } else if (provider === 'asana') {
      const asana = createAsanaClient(config);
      const url = asana.authorizeUrl('state-asana');
      console.log(`[DRY=${dryRun}] Asana authorize URL:\n${url}`);
    }
  } else if (action === 'reconcile') {
    // DRY sample source from templates
    const source = [
      { id: 'tpl-1', type: 'TaskType', name: 'Story' },
      { id: 'tpl-2', type: 'Field', name: 'Priority', values: ['High','Medium','Low'] },
    ];

    let target: any[] = [];
    if (provider === 'jira') {
      let bearer = process.env.JIRA_BEARER; // optional for local dev; never printed
      if (!bearer) {
        // Attempt to load a stored token and refresh if needed
        const tk = await getValidJiraToken('jira-default', store, config);
        if (tk?.accessToken) bearer = tk.accessToken;
      }
      if (bearer) {
        const { getAccessibleResources, getIssueTypes, getFields } = await import('./jira/api');
        const resources = await getAccessibleResources(bearer);
        if (!resources.length) {
          console.log('No accessible Jira resources found with provided token.');
        } else {
          const cloudId = resources[0].id;
          const [types, fields] = await Promise.all([
            getIssueTypes(bearer, cloudId),
            getFields(bearer, cloudId)
          ]);
          target.push(
            ...types.map((t: any) => ({ externalId: t.id, type: 'TaskType', name: t.name })),
            ...fields.filter((f: any) => !f.custom || f.name === 'Priority').map((f: any) => ({ externalId: f.id, type: 'Field', name: f.name }))
          );
        }
      } else {
        // Fallback sample when no token provided
        target = [
          { externalId: 'jira-abc', type: 'TaskType', name: 'Story' },
          { externalId: 'jira-def', type: 'Field', name: 'Priority', values: ['High','Low'] },
        ];
      }
    }

    const report = reconcilePreview(source as any, target as any, defaultMapping);
    console.log(`[DRY=${dryRun}] Reconciliation preview:`);
    console.log(JSON.stringify(report, null, 2));

    // Optional planner: --apply triggers the apply planner (still dry-run by default)
    const doApply = process.argv.includes('--apply');
    const doWrite = process.argv.includes('--write');

    if (doWrite && process.env.SYNC_WRITE_CONFIRM !== 'YES') {
      console.error('Refusing to proceed: --write requires SYNC_WRITE_CONFIRM=YES');
      process.exit(2);
    }

    if (doApply || doWrite) {
      const { applyOperations } = await import('./sync/apply');
      const getNum = (name: string): number | undefined => {
        const arg = process.argv.find(a => a.startsWith(`--${name}=`));
        return arg ? Number(arg.split('=')[1]) : undefined;
      };
      const allowTypesArg = process.argv.find(a => a.startsWith('--allow-types='));
      const allowTypes = allowTypesArg ? allowTypesArg.split('=')[1].split(',').map(s => s.trim()) as any : undefined;

      const res = await applyOperations(report.operations, {
        dryRun: !doWrite, // true unless explicitly writing
        allowTypes,
        maxCreates: getNum('max-creates'),
        maxUpdates: getNum('max-updates'),
        maxDeletes: getNum('max-deletes'),
      });
      console.log(doWrite ? 'Write mode summary:' : 'Apply planner result (dry-run):', JSON.stringify(res));

      // Safe canary write: store the plan summary as a project property (no structural changes)
      if (doWrite) {
        const cloudIdArg = process.argv.find(a => a.startsWith('--cloud-id='));
        const projectKeyArg = process.argv.find(a => a.startsWith('--project-key='));
        const cloudId = cloudIdArg ? cloudIdArg.split('=')[1] : undefined;
        const projectKey = projectKeyArg ? projectKeyArg.split('=')[1] : undefined;
        if (!cloudId || !projectKey) {
          console.error('Missing required flags for write mode: --cloud-id and --project-key');
          process.exit(3);
        }
        let bearer = process.env.JIRA_BEARER;
        if (!bearer) {
          const tk = await getValidJiraToken('jira-default', store, config);
          if (tk?.accessToken) bearer = tk.accessToken;
        }
        if (!bearer) {
          console.error('No Jira bearer token available for write mode. Set JIRA_BEARER or store a token.');
          process.exit(4);
        }
        const { setProjectProperty } = await import('./jira/api');
        const propertyKey = 'pm-tools-sync.plan';
        const value = { timestamp: new Date().toISOString(), plan: res };
        await setProjectProperty(bearer, cloudId, projectKey, propertyKey, value);
        console.log(`Wrote canary plan property '${propertyKey}' to project ${projectKey} in cloud ${cloudId}.`);
      }
    }
  }
})();
