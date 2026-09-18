# Release Validation - 2025-08-08

Scope: Post-merge validation for canonical paths + CI/workflow fixes and preview site deployment.

Commit/tag references:
- Main commit: 7bdd82a7 (CI policy update for a11y job)
- Prior main commit: 01272c88 (WCAG contrast fix)
- Release: v2025.08.08
- Pages URL: https://mirichard.github.io/pm-tools-templates/

Validation results
- CI pipelines
  - Build and tests: PASS (build-test)
  - Canonical path validator: PASS (✅ Validate Canonical Template Paths)
  - Link health checks (anchors + docs): PASS
  - Security scans: PASS (CodeQL, Semgrep, infrastructure tests)
  - Preview a11y + perf: Non-blocking on push to main; blocking on PRs. Latest run has contrast fix applied.
  - Build and Deploy Advanced Template Browser: PASS, Pages enabled and deployed.

- Manual checks
  - Pages site responds HTTP 200 and renders index and preview content.
  - Template index regenerated; no drift reported by validator script.

Known follow-ups
- Dependabot PRs will begin opening for low-severity issues (alerts must be enabled at org/repo security settings if not already).
- Keep preview-a11y-perf blocking on PRs to catch regressions; can re-enable blocking on main later if desired.

Rollback plan
- Revert contrast change if it introduces unintended visual side effects.
- Disable Pages or revert CI workflow commits if deployment regressions occur.
- Re-tag release as needed with a corrective patch.

Risk and impact
- Low risk; changes are primarily documentation, CI configuration, and preview site CSS.
- User-facing impact: improved link accuracy, validation coverage, and a11y contrast.

Lessons learned
- Keep a11y checks strict on PRs; allow non-blocking on main during stabilization windows.
- Enable GitHub Pages prior to merging deployment workflows to avoid initial 404s in deploy job.

Sign-off
- Prepared by: Warp AI Agent (automated)
- Owner review: Pending
- Date/time (UTC): 2025-08-08

