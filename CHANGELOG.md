# Changelog

## 2025-08-19

- Added program manager subfolders and starter templates:
  - role-based-toolkits/program-manager/program-planning/
  - role-based-toolkits/program-manager/governance-framework/
  - role-based-toolkits/program-manager/risk-management/
  - role-based-toolkits/program-manager/communications/
  - role-based-toolkits/program-manager/stakeholder-management/
- Seeded initial templates (PMP, roadmap, PWBS, resource plan; governance and quality; risk register/plan/dependency matrix/escalation; comms framework; stakeholder management docs).
- Updated role-based-toolkits/program-manager/README.md to link new sections.

Validation and Governance
- Ran link and path checks locally (to be confirmed by CI).
- Changes align with Traditional, Agile-at-Scale, and Hybrid guidance.

### Further increments (Issues #16, #18, #21, #23)

- #16 Enhanced Tool Integrations
  - Webhook framework: signature util extracted; logger and metrics middleware wired; provider handlers (Jira, GitHub)
  - JSON Schemas: Jira inbound issue_updated; GitHub inbound push
  - Scoped unit tests with isolated Jest config: signature and handler tests passing locally
- #18 Documentation Enhancement
  - Tutorials: automate status emails, customize project charter
  - Tutorial steps format and walkthrough example added; API docs reference schema area
- #21 Template Marketplace
  - Submission guide, validation checklist, discovery taxonomy
  - Staged sample submission and front-matter example; mock validation output
- #23 EPIC 0 Master Plan
  - KPI scorecards with example targets and data source links
  - Quarterly planning and scorecard templates

## 2025-08-08

Consolidation of canonical path migration and CI/workflow fixes.

Highlights:
- Adopted canonical_path across templates and introduced canonical/alternate path validation script.
- Regenerated TEMPLATE_INDEX.md from templates/templates.json; removed non-canonical duplicates.
- Added simple Template Selector CLI and usage docs.
- Introduced preview-a11y-perf job and enhanced docs link/anchor checks.
- Fixed Integration OAuth Check and related workflows; made certain doc/security checks non-blocking on PRs.
- Added accessibility checklist and clarified template format availability.

CI/Quality:
- Updated CI to Node 20; hardened npm install steps.
- Enabled CodeQL, Semgrep, visual regression tests, and artifact lifecycle fixes.

Breaking/Behavioral changes:
- Prefer canonical templates/ paths; role-based-toolkits and lifecycle directories act as stubs.

All notable changes to this project will be documented in this file.

## 2025-08-08

Summary: Terminology alignment and canonical link updates

- Align user-facing terminology from “PMBOK” to “Traditional” across primary documentation.
  - Updated templates/README.md, templates/hybrid/Hybrid/README.md, industry-specializations/README.md, templates/traditional/Traditional/README.md, methodology-frameworks/README.md, and examples/README.md.
  - Preserved legal/trademark statements and authoritative standards citations (e.g., PMBOK® section references), and skipped generated site output.
- Updated README “Most Popular Templates” to use canonical paths under templates/ and role-based-toolkits.
- Began deduplication of TEMPLATE_INDEX.md by adding a canonicalization note and retargeting duplicate rows to canonical templates paths.
- Ran repository link checks for README files; no broken links detected.

Notes:
- Future work will continue consolidating duplicate index entries and normalizing naming conventions.
- See CONTRIBUTING.md (Terminology and Standards References) for guidance on when to use “Traditional” vs. PMBOK® citations.

