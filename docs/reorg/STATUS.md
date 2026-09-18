# Repository Reorganization Status

Purpose
- Provide transparent visibility into ongoing reorganization efforts and progress.

Current status (2025-08-19)
- Phase: Stabilization
- Focus areas:
  - Normalize duplicate template paths (e.g., risk_register vs risk-register)
  - Consolidate legacy directories (integration_guides → integration-guides)
  - Improve discoverability with Examples Library and CLI Guide

Milestones
- M1: Inventory and mapping complete ✅
- M2: Redirects and doc links updated ✅
- M3: Contributor guidance refreshed ✅
- M4: Final clean-up and deprecations announced ⏳

Communication plan
- Changes summarized in CHANGELOG.md under "Docs/Structure"
- Breaking moves will include migration notes in MIGRATION_GUIDE.md

How to follow along
- Watch labels: transparency, theme-1-ux
- See related docs:
  - docs/examples/library.md
  - docs/cli/README.md

Risks and mitigations
- Risk: Broken links — Mitigation: nightly link checks, site builds
- Risk: Contributor confusion — Mitigation: README updates, QUICK_START

Rollback plan
- If a structural change causes disruption, revert the specific commit and restore previous path; update links accordingly.

