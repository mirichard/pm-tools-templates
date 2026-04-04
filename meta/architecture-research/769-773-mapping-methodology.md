# Tasks #769 & #773: Asset Mapping Methodology

**Stories:** #718 (Value Flow Mapping) + #719 (Domain Alignment)
**Epic:** #707 (Epic 0: Repository Audit & Mapping)
**Date:** 2026-04-03
**Status:** Complete

---

## 1. Mapping Procedure

For each asset in the repository inventory:

### Step 1: Identify the asset
- Source: `templates/templates.json` (137 cataloged templates) + uncataloged assets from #832 inventory
- Exclude infrastructure files (package.json, tsconfig, .gitignore, etc.)
- Exclude navigation/index files (README.md, TEMPLATE_INDEX.md, etc.)

### Step 2: Assign Value Flow Category
1. Check asset's tags against the tag-to-category rules (see #768 document, Section 3)
2. Assign **primary** category: `input-enabler`, `activity-support`, `output-generator`, or `outcome-tracker`
3. Optionally assign **secondary** category if the asset clearly spans stages
4. Document rationale (1 sentence)

### Step 3: Assign Performance Domain
1. Check asset's tags against the tag-to-domain rules (see #772 document, Section 3)
2. Assign **primary** domain: Stakeholder, Team, Delivery, Planning, Uncertainty, or Measurement
3. Optionally assign up to **2 secondary** domains
4. Document rationale (1 sentence)

### Step 4: Flag for review
- If automated mapping confidence is low (ambiguous tags, missing tags), flag `needs-review: true`
- If asset has 5+ tags spanning 3+ domain categories, flag `cross-domain: true`

---

## 2. Output Schema

### Per-Asset Mapping Record (JSON)

```json
{
  "path": "project-lifecycle/02-planning/risk-management/risk-management-plan-template.md",
  "title": "Risk Management Plan Template",
  "methodology": "universal",
  "value_flow": {
    "primary": "activity-support",
    "secondary": null,
    "rationale": "Guides risk response planning during project execution"
  },
  "domain": {
    "primary": "Uncertainty",
    "secondary": ["Planning"],
    "rationale": "Primary purpose is risk identification and mitigation strategy"
  },
  "flags": {
    "needs_review": false,
    "cross_domain": false
  }
}
```

### Aggregate Output Files

| File | Purpose | Format |
|------|---------|--------|
| `meta/value-flow-mapping.json` | All assets mapped to value flow stages | JSON array of records |
| `meta/domain-mapping.json` | All assets mapped to performance domains | JSON array of records |
| `meta/mapping-summary.md` | Human-readable summary with statistics | Markdown |
| `meta/needs-review.md` | Assets flagged for manual review | Markdown list |

### Coverage Matrix Format (for domain mapping)

```
                 | Stakeholder | Team | Delivery | Planning | Uncertainty | Measurement |
|----------------|-------------|------|----------|----------|-------------|-------------|
| agile          |      3      |   5  |    12    |    2     |      1      |      1      |
| traditional    |      4      |   1  |    10    |    5     |      3      |      1      |
| hybrid         |      2      |   1  |     4    |    1     |      1      |      0      |
| universal      |     10      |   3  |    19    |   15     |     12      |     20      |
```

---

## 3. Calibration Set (10 Examples)

These examples establish the mapping standard. All subsequent mappings should be consistent with these.

### Example 1: Business Case Template
- **Path:** `templates/traditional/Traditional/Templates/business_case_template.md`
- **Tags:** `traditional`, `technology`, `risk-management`, `stakeholder-management`, `quality`
- **Value Flow:** Primary: `input-enabler` — Justifies the project investment before work begins
- **Domain:** Primary: `Planning` — Establishes the strategic case for the project; Secondary: `Stakeholder` (stakeholder buy-in)

### Example 2: Sprint Planning Template
- **Path:** `templates/agile/sprint_planning_template.md`
- **Tags:** `agile`, `scrum`, `planning`, `quality`
- **Value Flow:** Primary: `activity-support` — Structures iteration-level work planning
- **Domain:** Primary: `Delivery` — Execution-level planning for a sprint; Secondary: `Team` (team collaboration)

### Example 3: Executive Dashboard
- **Path:** `business-stakeholder-suite/executive-dashboards/performance-monitoring-analytics.md`
- **Tags:** (inferred: `monitoring`, `stakeholder-management`, `communication`)
- **Value Flow:** Primary: `output-generator` — Produces a report for stakeholder consumption
- **Domain:** Primary: `Measurement` — Tracks and displays performance metrics; Secondary: `Stakeholder` (executive audience)

### Example 4: Risk Management Plan Template
- **Path:** `project-lifecycle/02-planning/risk-management/risk-management-plan-template.md`
- **Tags:** (inferred: `risk-management`, `planning`)
- **Value Flow:** Primary: `activity-support` — Guides risk management during execution
- **Domain:** Primary: `Uncertainty` — Core risk management artifact; Secondary: `Planning`

### Example 5: Stakeholder Register Template
- **Path:** `project-lifecycle/01-initiation/stakeholder-analysis/stakeholder-register-template.md`
- **Tags:** (inferred: `stakeholder-management`)
- **Value Flow:** Primary: `input-enabler` — Identifies stakeholders before engagement planning
- **Domain:** Primary: `Stakeholder` — Core stakeholder identification artifact

### Example 6: Change Management Plan Template
- **Path:** `templates/traditional/Traditional/Templates/change_management_plan_template.md`
- **Tags:** `traditional`, `technology`, `risk-management`, `stakeholder-management`, `communication`, `planning`, `monitoring`
- **Value Flow:** Primary: `activity-support` — Guides change control during execution
- **Domain:** Primary: `Delivery` — Change management is a delivery process; Secondary: `Stakeholder`, `Uncertainty`
- **Flags:** `cross_domain: true` (7 tags spanning 4+ domains)

### Example 7: ROI Tracking Dashboard
- **Path:** `business-stakeholder-suite/financial-governance/roi-tracking-dashboard.md`
- **Tags:** (inferred: `finance`, `monitoring`)
- **Value Flow:** Primary: `outcome-tracker` — Measures business value realization
- **Domain:** Primary: `Measurement` — Tracks ROI metrics; Secondary: `Planning` (financial alignment)

### Example 8: Backlog Refinement Template
- **Path:** `role-based-toolkits/scrum-master/agile-ceremonies/backlog-refinement-template.md`
- **Tags:** `agile`, `scrum`, `technology`, `risk-management`, `planning`, `quality`
- **Value Flow:** Primary: `activity-support` — Guides backlog grooming during sprints
- **Domain:** Primary: `Delivery` — Execution ceremony; Secondary: `Team` (team collaboration activity)

### Example 9: Project Health Assessment Template
- **Path:** `project-assessment-suite/project-health-assessment-template.md`
- **Tags:** (inferred: `monitoring`, `quality`, `risk-management`)
- **Value Flow:** Primary: `outcome-tracker` — Assesses overall project health for improvement
- **Domain:** Primary: `Measurement` — Assessment/evaluation artifact; Secondary: `Uncertainty`

### Example 10: Hybrid Project Charter Template
- **Path:** `templates/hybrid/Hybrid/Templates/hybrid_project_charter_template.md`
- **Tags:** `hybrid`, `risk-management`, `stakeholder-management`, `planning`, `quality`
- **Value Flow:** Primary: `input-enabler` — Defines project purpose and authorization
- **Domain:** Primary: `Planning` — Establishes scope, objectives, constraints; Secondary: `Stakeholder`

---

## 4. Edge Case Rules

| Scenario | Value Flow Assignment | Domain Assignment |
|----------|----------------------|-------------------|
| Asset has no tags in templates.json | Flag `needs_review: true`, assign based on file path context | Flag `needs_review: true`, assign based on directory location |
| Asset is in `docs/templates/` (150+ files) | Map using title/description keywords | Map using title keywords |
| Asset is a methodology guide (not a template) | `activity-support` | `Delivery` |
| Asset is in `staging/` (pending integration) | Map normally — staging is about readiness, not content type | Map normally |
| Asset is industry-specific | Inherit category from generic equivalent | Primary: `Delivery` (industry execution); add industry domain as note |
| Assessment templates | `outcome-tracker` (they evaluate, not execute) | `Measurement` (they measure/assess) |
| Integration guides | `activity-support` (enable tool-supported work) | `Delivery` (tool setup is execution support) |

---

## 5. Validation Rules

A mapping is considered valid when:

1. Every asset has exactly one primary value flow category
2. Every asset has exactly one primary domain
3. Secondary assignments are limited to 2 max (domain) or 1 max (value flow)
4. All 4 value flow categories have at least 5 assets each
5. All 6 domains have at least 3 assets each
6. No more than 20% of assets are flagged `needs_review`
7. Calibration examples are mapped consistently with this document
