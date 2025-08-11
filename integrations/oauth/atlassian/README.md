# Atlassian OAuth Scaffold (Issue #290)

Purpose
- Establish OAuth 2.0 (auth code + PKCE) flow for Atlassian Cloud APIs (Jira/Confluence).
- Store tokens securely; implement refresh and scope management.

Checklist (Phase 1)
- [ ] Register app (developer.atlassian.com) and record client_id, redirect_uri
- [ ] Implement PKCE auth code flow (no secrets in code); use environment variables
- [ ] Persist tokens securely (local dev: keychain/file vault; prod: secret manager)
- [ ] Implement refresh token logic; handle scope changes gracefully
- [ ] Add basic permission test call (e.g., GET /rest/api/3/project/search)
- [ ] Add retry/backoff for 429/5xx and basic circuit breaker
- [ ] Add audit logging events for auth success/failure

Security & Compliance
- Never commit secrets. Use env variables like: ATLASSIAN_CLIENT_ID, ATLASSIAN_REDIRECT_URI
- Limit scopes to minimum required; document scope rationale
- Document and test logout/revoke behavior

Next
- Provide a tiny CLI/script to open the consent URL and capture the code locally for dev
