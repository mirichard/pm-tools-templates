# ADR-0288: Defaults for Epic 288 (Template Customization Web Interface - MVP)

Status: Proposed (can be overridden later)
Date: 2025-08-09
Epic: #288

Context
Several implementation choices for the MVP are unspecified. To avoid blocking development, we adopt pragmatic defaults that are low-risk and reversible.

Decision
1) Export style guide
- Default: Create a minimal house style for MD/DOCX/PDF exports.
- Rationale: No existing brand guidelines provided; a neutral, readable style unblocks development.
- Implementation: docs/export/style-guide.md and export/pandoc/defaults.yaml.

2) Pandoc availability
- Default: Containerized Pandoc for CI/build steps.
- Rationale: Avoid host/CI dependencies; use stable pandoc/core image in future workflows.
- Implementation: Provide defaults.yaml now; containerized step to be added in CI later.

3) OAuth save-to-repo
- Default: Defer for MVP; anonymous mode stores locally (session/local storage) and supports file download. Add OAuth as a follow-up once UX is validated.
- Rationale: Reduces complexity and secret handling; accelerates MVP timeline.

4) Collaboration MVP template
- Default: Project Charter template for collaboration demo (Yjs-based shared editing + presence).
- Rationale: High-visibility, text-centric; ideal for proving collaboration without heavy tables.

5) Hosting target
- Default: Static frontend + serverless functions for export in production; local Node service for dev.
- Rationale: Keeps costs and operations low while supporting export needs.

Consequences
- Quick path to MVP with minimal external dependencies.
- Easy to replace house style with branded assets later.
- OAuth integration, containerized Pandoc CI, and production serverless deployment will be separate tasks.

Alternatives considered
- Full Node service in production: higher ops cost for MVP.
- Immediate OAuth: adds security and setup complexity; not needed to validate MVP value.

Roll-back
- Styles can be swapped by updating defaults.yaml and templates.
- Collaboration can be feature-flagged off if unstable.

Open items
- When brand guidelines are available, align export styles.
- Select production serverless provider (e.g., Netlify Functions, Vercel, Cloudflare Workers, AWS Lambda).
