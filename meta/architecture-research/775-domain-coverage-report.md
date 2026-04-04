# Task #775: Domain Coverage Analysis and Gap Report

**Story:** #719 ([Mapping] – Domain Alignment – Performance Domain Classification)
**Epic:** #707 (Epic 0: Repository Audit & Mapping)
**Date:** 2026-04-03
**Status:** Complete

---

## 1. Coverage Matrix (from automated mapping of 137 templates)

| Methodology | Stakeholder | Team | Delivery | Planning | Uncertainty | Measurement | Total |
|-------------|-------------|------|----------|----------|-------------|-------------|-------|
| agile | 0 | 5 | 14 | 0 | 0 | 0 | 19 |
| hybrid | 0 | 0 | 6 | 1 | 0 | 0 | 7 |
| traditional | 1 | 1 | 18 | 3 | 0 | 0 | 23 |
| universal | 10 | 3 | 31 | 4 | 13 | 27 | 88 |
| **Total** | **11** | **9** | **69** | **8** | **13** | **27** | **137** |

## 2. Gap Analysis

### Critical Gaps (0 templates in cell)

| Cell | Severity | Impact | Recommendation |
|------|----------|--------|---------------|
| agile × Stakeholder | **Critical** | No agile-specific stakeholder templates (agile stakeholder map exists but tagged universal) | Re-tag existing assets or create agile stakeholder engagement guide |
| agile × Planning | Medium | Sprint-level planning is in Delivery; strategic planning for agile projects missing | Create agile roadmap/release planning templates |
| agile × Uncertainty | Medium | Agile risk boards exist in `docs/templates/` but not tagged agile | Re-tag; create lightweight agile risk template |
| agile × Measurement | Medium | Agile metrics exist in scrum-master toolkit but tagged differently | Re-tag velocity/burndown templates |
| hybrid × Stakeholder | Medium | No hybrid-specific stakeholder templates | Low priority — universal templates serve this need |
| hybrid × Team | Medium | No hybrid team management templates | Referenced in issue #717 — `hybrid_team_management_template.md` exists in docs/templates/ |
| hybrid × Uncertainty | Low | Universal risk templates cover this | No action needed |
| hybrid × Measurement | Low | Universal measurement templates cover this | No action needed |
| traditional × Uncertainty | Medium | Risk templates exist but tagged universal, not traditional | Re-tag `risk_register_template.md` and `risk_assessment_template.md` |
| traditional × Measurement | Medium | Status reports exist but tagged universal | Re-tag traditional status/EVM templates |

### Under-Served Domains

| Domain | Count | % | Assessment |
|--------|-------|---|-----------|
| **Team** | 9 | 6.6% | Lowest coverage. Ceremony templates (standup, retro) are here but team-building, conflict resolution, and skills development templates are missing. |
| **Planning** | 8 | 5.8% | Second-lowest. Many planning templates are routed to Delivery because they carry methodology tags. Strategic planning and portfolio planning are thin. |
| **Stakeholder** | 11 | 8.0% | Third-lowest. Stakeholder analysis and communication exist but engagement strategy, satisfaction measurement, and stakeholder reporting are gaps. |

### Over-Served Domains

| Domain | Count | % | Assessment |
|--------|-------|---|-----------|
| **Delivery** | 69 | 50.4% | Over-represented but expected — this is a PM template repo, and execution templates are the core product. Not a problem. |
| **Measurement** | 27 | 19.7% | Well-served. Dashboard and assessment templates provide strong measurement coverage. |

## 3. Consistency Validation

Spot-checked 20 mappings for consistency:
- 18/20 consistent with calibration set rules
- 2 edge cases: `change_management_plan_template.md` could be Stakeholder (change comms) instead of Delivery (change process) — kept as Delivery per the "primary use" rule
- Cross-domain flagging correctly identifies templates spanning 3+ domains

## 4. Recommendations for Downstream Epics

| Epic | Domain Actions |
|------|---------------|
| Epic 1 (Value Delivery Layer) | Add outcome measurement templates to boost Measurement in agile/hybrid |
| Epic 4 (Domain Refactor) | Re-tag methodology-specific templates that are currently universal; create Team domain templates |
| Epic 5 (Principles Integration) | Ensure principles map to all 6 domains evenly |
| Epic 6 (Governance Modernization) | Add governance templates to Uncertainty and Planning domains |
