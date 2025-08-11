# Asana Deployer (Minimal)

Public-facing CLI to create a minimal Asana project with optional seed tasks.
Dry-run by default; write mode requires a bearer token via environment variable.

Requirements
- Node.js 18+ recommended
- ASANA_BEARER set to a valid Asana access token (write mode only)

Usage
- Dry-run (no writes):
```
npm --prefix integrations/deployer/asana run dev
```
- Write mode (guarded):
```
ASANA_BEARER={{ASANA_ACCESS_TOKEN}} npm --prefix integrations/deployer/asana run deploy
```
Optional flags
- --workspace=WORKSPACE_GID (if omitted, uses the first workspace from your account)

Environment variables
- ASANA_PROJECT_NAME: project name (default: "PM Tools Demo")

Notes
- Do not echo or commit secrets. Set tokens via environment variables only.
- This is a minimal deployer intended for demos and scaffolding. Extend as needed for your org.
