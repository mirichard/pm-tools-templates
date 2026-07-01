# Tasks #788 & #789: Outcome Dashboard Research & Design

**Story:** #723 ([Value] – Outcome Dashboard)
**Epic:** #708 (Epic 1: Value Delivery Layer)
**Date:** 2026-07-01
**Status:** Complete
**Closes:** #788, #789

---

## 1. Research: Existing Dashboard Extension Points (#788)

### Dashboard Asset Inventory

| Asset | Location | Purpose | Value Delivery Content |
|-------|----------|---------|----------------------|
| Project Health Dashboard | `dashboards/project-health-dashboard.md` | Auto-generated project health | ❌ No value/outcome metrics |
| Project Dashboard Template | `project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md` | Manual project status | ❌ Schedule/budget/quality only |
| Executive Dashboard (PowerBI) | `business-stakeholder-suite/executive-dashboards/powerbi-integration/executive-dashboard-template.md` | Executive portfolio view | ⚠️ Has strategic goals table but no benefit tracking |
| Product Metrics Dashboard | `role-based-toolkits/product-owner/product-metrics-dashboard.md` | Product performance | ⚠️ Has OKR section but no value flow |
| Benefit Realization Framework | `business-stakeholder-suite/financial-governance/benefit-realization-framework.md` | Benefits tracking | ✅ Has benefit register + dashboard section |
| ROI Tracking Dashboard | `business-stakeholder-suite/financial-governance/roi-tracking-dashboard.md` | Financial ROI | ✅ Financial value tracking |
| KPI Mapping Template | `project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md` | KPI hierarchy | ✅ 4-level hierarchy (new, #786) |

### Gap Analysis

**What exists:** Execution metrics (schedule, cost, quality, risk), financial tracking (ROI, budget, EVM), and now KPI hierarchy mapping.

**What's missing:** A single dashboard that shows **value delivery outcomes** — the connection between what teams deliver and the business value it produces. Specifically:
1. No "value delivery" section in any project-level dashboard
2. No benefits-at-a-glance view tied to project milestones
3. No leading indicators for value realization (benefits pipeline, outcome confidence)
4. No cross-reference between KPI levels and actual benefit delivery

### Extension Points Identified

| Dashboard | Extension Point | What to Add | Impact |
|-----------|----------------|-------------|--------|
| Project Dashboard Template | After "Key Metrics" section | Value Delivery panel with benefit status, outcome KPIs, value flow | High — primary project-level integration |
| Executive Dashboard (PowerBI) | StrategicGoals table + Page 1 | Benefits Realization KPI card, outcome trend chart | Medium — enhances existing strategic section |
| Product Metrics Dashboard | After "Goal Tracking & OKRs" (section 7) | Value delivery metrics linking product metrics to business outcomes | Low — product-specific, not universal |

**Recommendation:** Create a standalone **Value Delivery Dashboard** template that can be used independently OR integrated as a section into the Project Dashboard Template. This avoids disrupting existing templates while providing a clear value delivery view.

---

## 2. Design: Value Delivery Dashboard Section (#789)

### Dashboard Structure

The Value Delivery Dashboard has 5 panels, designed to fit as a standalone document or as an appendix section to the Project Dashboard Template.

```
┌─────────────────────────────────────────────────────┐
│  PANEL 1: Value Delivery Summary                    │
│  Overall value health, benefits on track %, score   │
├─────────────────────────────────────────────────────┤
│  PANEL 2: Benefits Status                           │
│  Benefit register snapshot — realized/at-risk/      │
│  planned, with $ or % values                        │
├─────────────────────────────────────────────────────┤
│  PANEL 3: Outcome KPIs                              │
│  Strategic + Project KPIs from kpi-mapping-template │
│  with actuals vs targets                            │
├──────────────────────────┬──────────────────────────┤
│  PANEL 4: Value Flow     │  PANEL 5: Leading        │
│  Deliverable → Outcome   │  Indicators               │
│  mapping (what shipped   │  Outcome confidence,      │
│  → what value produced)  │  benefits pipeline,       │
│                          │  stakeholder satisfaction  │
└──────────────────────────┴──────────────────────────┘
```

### Panel Specifications

**Panel 1: Value Delivery Summary**
- Value Health Score: composite of benefits on-track %, KPI target achievement, stakeholder satisfaction
- Color-coded status: 🟢 ≥80% on-track, 🟡 60–79%, 🔴 <60%
- Trend indicator vs. previous period

**Panel 2: Benefits Status**
- Columns: Benefit ID, Name, Category, Target Value, Realized Value, Status, Owner
- Summary row: total expected, total realized, realization rate %
- Source: links to Benefit Realization Framework entries

**Panel 3: Outcome KPIs**
- Pulls from L1 (Strategic) and L3 (Project) KPIs defined in the KPI Mapping Template
- Columns: KPI, Target, Actual, Variance, Trend
- Leading vs. lagging indicator tags

**Panel 4: Value Flow**
- Maps recent deliverables to business outcomes
- Columns: Deliverable, Date Delivered, Expected Outcome, Outcome Status, Evidence
- Supports traceability: "we shipped X, it produced Y value"

**Panel 5: Leading Indicators**
- Outcome confidence score (team's subjective confidence in realizing planned benefits)
- Benefits pipeline value (total value of benefits not yet realized)
- Stakeholder satisfaction trend
- Time to value (avg days from delivery to measurable outcome)

### Integration Strategy

The dashboard template will include a header note:

> *This dashboard can be used standalone or appended to your [Project Dashboard](../project-dashboard-template.md). To integrate, copy the sections below into your project dashboard after the "Upcoming Activities" section.*

### File Location

`project-lifecycle/04-monitoring-control/progress-tracking/value-delivery-dashboard.md`

This follows the convention established by the KPI mapping template and the existing project dashboard template in the same directory.

### Cross-References

- **KPI source:** [KPI Mapping Template](kpi-mapping-template.md) — Levels 1 and 3
- **Benefits source:** [Benefit Realization Framework](../../../business-stakeholder-suite/financial-governance/benefit-realization-framework.md)
- **Financial source:** [ROI Tracking Dashboard](../../../business-stakeholder-suite/financial-governance/roi-tracking-dashboard.md)
- **Executive rollup:** [Executive Dashboard](../../../business-stakeholder-suite/executive-dashboards/powerbi-integration/executive-dashboard-template.md)
