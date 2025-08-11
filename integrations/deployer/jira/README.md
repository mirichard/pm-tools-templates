# Jira Deployer (Minimal)

Public-facing CLI to create a minimal Jira project from a simple template.
Dry-run by default; write mode requires a bearer token via environment variable.

Requirements
- Node.js 18+ recommended
- JIRA_BEARER set to a valid Atlassian access token (write mode only)

Usage
- Dry-run (no writes):
```
npm --prefix integrations/deployer/jira run dev
```
- Write mode (guarded):
```
JIRA_BEARER={{JIRA_ACCESS_TOKEN}} npm --prefix integrations/deployer/jira run deploy
```
Optional flags
- --cloud-id=YOUR_CLOUD_ID (otherwise auto-detected)
- --project-type=software|service_desk|business (default: software)

Environment variables
- JIRA_PROJECT_NAME: project name (default: "PM Tools Demo")
- JIRA_PROJECT_KEY: 2–10 uppercase letters (default: "PMD")

Notes
- Do not echo or commit secrets. Set tokens via environment variables only.
- This is a minimal deployer intended for demos and scaffolding. Extend as needed for your org.
