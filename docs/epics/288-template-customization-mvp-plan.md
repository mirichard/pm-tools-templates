# Epic 288: Template Customization Web Interface (MVP) – Development Plan

Objective
Deliver a browser-based customization experience for 5 key templates with real-time preview, basic collaboration, export (MD/DOCX/PDF), basic versioning, accessibility, and mobile responsiveness—suitable for public beta.

Scope (MVP)
- Templates: Project Charter, Risk Register, Stakeholder Communication Plan, Sprint Planning, Executive Status Report
- Features:
  - Schema-driven editor with validation + completion %
  - Live Markdown preview
  - Export: MD, DOCX, PDF (consistent styles)
  - Basic versioning (save/list/restore + simple diff)
  - Collaboration MVP for 1 template (CRDT/Yjs)
  - Accessibility (WCAG 2.1 AA) and mobile responsiveness
- Non-goals (deferred): Advanced roles/permissions, enterprise SSO, advanced analytics

Architecture Decisions
- Frontend: React + TypeScript, Tailwind, component tests (Jest/RTL)
- Collaboration: WebSockets + Yjs (CRDT)
- Backend: Node.js/Express for export, versioning helpers, and collaboration relay
- Templates: JSON Schema + Handlebars for generation; Pandoc for DOCX/PDF
- Storage: Anonymous mode = session-only; Authenticated = optional GitHub commit API

Deliverables and Acceptance Criteria
1) Editor + Schemas (all 5)
- Each template has a JSON Schema definition
- Form renders from schema with validation + completion percentage
- a11y labels, focus order, and keyboard nav validated

2) Preview + Export
- Live Markdown preview updates under 500ms warm
- Export MD/DOCX/PDF; DOCX/PDF meet style guide

3) Versioning (basic)
- Save named versions, list, restore, show diff (field-level/markdown)
- If authenticated: commit JSON/MD to repo

4) Collaboration MVP (1 template)
- Two users can co-edit Project Charter with presence
- No data loss on reconnect; perceived latency <100ms (LAN)

5) A11y + Mobile
- WCAG 2.1 AA checks pass (aXe CI); responsive layouts verified

Governance (per project rules)
- Validation: unit, component, E2E, a11y, perf evidence attached to #288 prior to closure
- Rollback: feature flags to disable collaboration/export
- UAT: 2–3 user sessions; sign-off recorded in #288
- Documentation: User guide; CHANGELOG entry; code comments
- Security/Privacy: No PII persistence for anonymous; OAuth optional; logs scrubbed
- Peer review: PR checklist for a11y/perf/export
- Lessons learned: short note in docs after beta

Execution Plan (5 weeks)
- Week 1: Repo scaffolding notes, schema framework, Project Charter editor + live preview
- Week 2: Risk Register + Stakeholder Plan; MD/DOCX/PDF export baseline
- Week 3: Sprint Planning + Exec Status Report; basic versioning; OAuth save-to-repo
- Week 4: Collaboration MVP (Charter); a11y polish; perf tuning
- Week 5: Hardening, E2E, docs, governance evidence, beta tag

Open Questions (defaults selected; can be overridden)
- Export style guide: Default = minimal house style (see docs/export/style-guide.md)
- Pandoc availability: Default = containerized for CI/build steps (see export/pandoc/defaults.yaml)
- OAuth save-to-repo: Default = defer for MVP; anonymous local save + download
- Collaboration MVP: Default = Project Charter template
- Hosting target: Default = static frontend + serverless (prod); local Node for dev
- Export style guide source of truth (existing brand guidelines?)
- Pandoc availability in CI/runtime (or containerized step)?
- GitHub OAuth app details (client ID/secret) and target repo for save-to-repo?
- Any data retention constraints beyond anonymous session storage?

Traceability
- Parent epic: #288
- Child issues: editor/schemas, preview/export, versioning, collaboration MVP, a11y/mobile, docs, QA
