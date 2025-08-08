# Jira/Asana Integration – OAuth 2.0 Foundations (Q3)

This module scaffolds secure OAuth 2.0 authentication flows for Atlassian (Jira Cloud) and Asana to enable bi‑directional synchronization of template structures and project data.

Status: In Progress (Issue #385)

Goals for this slice
- Implement secure OAuth 2.0 flows for Jira and Asana using environment variables (no secrets in logs)
- Establish least-privilege scopes and document permissions
- Provide rotation/expiry guidance and non-interactive CI usage patterns
- Prepare test harness for local validation and CI dry-runs

Key principles
- Never print tokens or secrets
- Keep credentials in environment variables only
- Use least-privilege scopes; separate read/write where possible
- Support dry-run and verbose audit logs without sensitive data

Directory structure
```
integrations/jira-asana-sync/
  ├─ src/
  │  ├─ auth/
  │  │  ├─ jira.ts
  │  │  └─ asana.ts
  │  ├─ config.ts
  │  └─ index.ts
  ├─ .env.example
  ├─ SECURITY_NOTES.md
  ├─ package.json
  └─ tsconfig.json
```

Environment variables (.env or CI vars)
- JIRA_CLIENT_ID
- JIRA_CLIENT_SECRET
- JIRA_CLOUD_SCOPES (comma-separated)
- JIRA_REDIRECT_URI
- ASANA_CLIENT_ID
- ASANA_CLIENT_SECRET
- ASANA_SCOPES (comma-separated)
- ASANA_REDIRECT_URI

Local development
1) Copy .env.example to .env and fill values
2) Install deps and run the dev harness
```
npm install
npm run dev -- --provider=jira --dry-run

4) Reconciliation preview (dry):
```
# Option A: without token (uses sample target data)
npm run dev -- --provider=jira --action=reconcile --dry-run

# Option B: with Jira bearer token from your environment (local dev only)
# Alternatively, if you have previously saved a token to the local token store
# the tool will attempt to use and refresh it automatically (key: jira-default)
# Do not echo this token; set it via your shell securely
# e.g., JIRA_BEARER=$JIRA_ACCESS_TOKEN npm run dev -- --provider=jira --action=reconcile --dry-run

# Optional: include --apply to run the planner (still dry-run by default)
# This prints a concise plan summary without executing writes
npm run dev -- --provider=jira --action=reconcile --dry-run --apply

# Guarded write mode (currently a no-op; validates limits and refuses without confirmation)
# You must set SYNC_WRITE_CONFIRM=YES to even attempt write mode; still no writes are executed yet
SYNC_WRITE_CONFIRM=YES npm run dev -- --provider=jira --action=reconcile --write --allow-types=TaskType,Field --max-creates=5 --max-updates=10 --max-deletes=1 --cloud-id=YOUR_CLOUD_ID --project-key=SCRUM
```
```
3) For Asana replace provider argument accordingly

Security and compliance
See SECURITY_NOTES.md. This module is designed for explicit consent flows and CI usage where tokens are stored securely via environment variables (e.g., GitHub Actions encrypted secrets).

Next steps
- Add token storage abstraction (file/kv/secret manager)
- Add refresh token flows and rotation procedures
- Wire into sync engine (#386) with idempotent delta sync

CI validation
A GitHub Actions workflow runs on changes to this module to build and perform a dry-run authorize URL generation:
- Uses DRY_RUN=true and environment-provided secrets
- Runs Jira step if Jira secrets are present
- Runs Asana step only if Asana secrets are configured

Write mode canary
- When --write is used with SYNC_WRITE_CONFIRM=YES and required flags, the tool writes a safe canary project property (pm-tools-sync.plan) with the plan summary to the specified project (no structural changes). This verifies access and scope without modifying project configuration.
- Required flags: --cloud-id, --project-key
- Token: provide via JIRA_BEARER or stored token (jira-default)

Secrets note
- Jira secrets are already configured in GitHub; Asana secrets are optional and steps will be skipped until added.
- Add token storage abstraction (file/kv/secret manager)
- Add refresh token flows and rotation procedures
- Wire into sync engine (#386) with idempotent delta sync
