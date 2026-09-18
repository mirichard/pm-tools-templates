# Asana OAuth Scaffold (Issue #290)

Purpose
- Establish OAuth 2.0 (auth code) flow for Asana API.
- Store tokens securely; implement refresh and scope management.

Checklist (Phase 1)
- [ ] Register app (developers.asana.com) and record client_id, redirect_uri
- [ ] Implement auth code flow; use environment variables
- [ ] Persist tokens securely (local dev: keychain/file vault; prod: secret manager)
- [ ] Implement refresh token logic; handle scope changes gracefully
- [ ] Add basic permission test call (e.g., GET /projects)
- [ ] Add retry/backoff for 429/5xx and basic circuit breaker
- [ ] Add audit logging events for auth success/failure

Security 6 Compliance
- Never commit secrets. Use env variables like: ASANA_CLIENT_ID, ASANA_REDIRECT_URI
- Limit scopes to minimum required; document scope rationale
- Document and test logout/revoke behavior

Next
- Provide a tiny CLI/script to open the consent URL and capture the code locally for dev
