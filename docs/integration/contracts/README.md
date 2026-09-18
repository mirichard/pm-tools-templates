# Integration Contracts (Draft)

Purpose: Define JSON schemas and example payloads for inbound/outbound integration events.

Structure
- providers/
  - jira/
    - inbound-issue-updated.schema.json
    - outbound-status-sync.schema.json
  - github/
    - inbound-push.schema.json
    - outbound-project-update.schema.json
- examples/
  - jira-issue-updated.json
  - github-push.json

Notes
- Schemas are versioned; breaking changes require a new major version.
- Use consistent envelope: { provider, event, version, data }.

