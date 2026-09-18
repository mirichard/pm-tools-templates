# Security Notes – Jira/Asana OAuth

- Secrets must be provided via environment variables only. Never hard-code or echo in logs.
- Use separate apps/credentials for dev, stage, and prod. Enforce least-privilege scopes:
  - Jira: request only read:jira-user, read:jira-work; add write:jira-work for sync writes
  - Asana: request default/basic scopes; extend only if needed for write actions
- Enable short-lived access tokens and refresh tokens. Rotate client secrets regularly.
- In CI (e.g., GitHub Actions), store secrets as encrypted repository/org secrets.
- Add redaction for any accidental token presence in structured logs.
- Maintain an audit log of operations without including token material.
- Document a rollback plan: revoke tokens/rotate secrets, disable app if compromise suspected.
