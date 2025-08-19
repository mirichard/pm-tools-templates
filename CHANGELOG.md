# Changelog

## 2025-08-19

Summary: Program Manager Toolkit expansion (Issues #41, #42)

- Added program manager subfolders and starter templates:
  - role-based-toolkits/program-manager/program-planning/
  - role-based-toolkits/program-manager/portfolio-management/
  - role-based-toolkits/program-manager/governance-framework/
  - role-based-toolkits/program-manager/risk-management/
  - role-based-toolkits/program-manager/communications/
  - role-based-toolkits/program-manager/stakeholder-management/
- Seeded initial templates (PMP, roadmap, PWBS, resource plan; portfolio kanban, prioritization model, value tracking, governance cadence; governance and quality; risk register/plan/dependency matrix/escalation; comms framework; stakeholder management docs).
- Updated role-based-toolkits/program-manager/README.md to link new sections.

- Added Program Manager subfolders and templates for Issues #42–#46 (portfolio-management, benefits-realization, program-lifecycle, methodology-variants, and integration communication docs).

Validation and Governance
- Ran link and path checks locally (to be confirmed by CI).
- Changes align with Traditional, Agile-at-Scale, and Hybrid guidance.

### Docs/UX Improvements (2025-08-19)

Completed five enhancements to improve documentation accessibility and user experience:

- **Examples Library (#70)**: Created comprehensive Examples & Sample Artifacts Library with curated links and navigation structure.
- **Contributor Visibility (#71)**: Enhanced contributor guidance with prominent README CTAs and GitHub issue template contact links.
- **CLI Documentation (#72)**: Added complete CLI usage guide covering installation, commands, examples, and safety guidelines.
- **Reorg Transparency (#73)**: Established reorganization status documentation with milestone tracking and progress communication.
- **AI Insights Strategy (#74)**: Developed exploratory monetization strategy framework for AI-powered insights platform.

All changes merged via PRs #480-484 with full CI validation.

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

