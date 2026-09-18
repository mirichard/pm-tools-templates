# Tasks #784 & #785: KPI Mapping Engine Design

**Story:** #722 ([Value] – KPI Mapping Engine)
**Epic:** #708 (Epic 1: Value Delivery Layer)
**Date:** 2026-05-01
**Status:** Complete

---

## 1. Existing Metrics/KPI Asset Catalog (#784)

| Location | Assets | What's Measured |
|----------|--------|----------------|
| `metrics/risk-data/` | 63 JSON files | Risk scores, risk counts, trend data (time-series, bi-weekly) |
| `metrics/status-data/` | 7 JSON files | Project status metrics (time-series) |
| `reports/status/` | 9 MD files | Weekly/monthly status reports with narrative |
| `dashboards/` | 1 MD file | Project health dashboard (single template) |
| `dashboard-mvp/` | Next.js app | Interactive dashboard web application |
| `business-stakeholder-suite/executive-dashboards/` | 8+ files | Performance monitoring, security, testing validation |
| `business-stakeholder-suite/financial-governance/` | 10 files | ROI tracking, budget, cost management, value stream, benefits |
| `project-assessment-suite/` | 18 files | Health, maturity, governance, risk, stakeholder assessments |
| `role-based-toolkits/product-owner/product-metrics-dashboard.md` | 1 file | Product-level metrics |
| `templates/templates.json` | Metadata | Quality scores per template (qualityScore field) |

### Coverage Assessment
- **Execution metrics:** Strong — risk data, status tracking, dashboards
- **Financial metrics:** Strong — ROI, budget, cost management
- **Assessment metrics:** Strong — health, maturity, governance assessments
- **Strategic metrics:** Weak — no OKR tracking dashboard, no portfolio-level KPIs
- **Team metrics:** Weak — no velocity, burndown, or team health tracking templates
- **Benefits metrics:** Moderate — framework exists but no automated tracking

---

## 2. KPI Hierarchy Model (#785)

### 4-Level Hierarchy

```
Level 1: STRATEGIC KPIs (Executive/Sponsor)
├── Portfolio ROI
├── Strategic alignment score
├── Benefits realization rate
└── Organizational capability maturity

Level 2: PROGRAM KPIs (Program Manager)
├── Cross-project dependency health
├── Resource utilization across projects
├── Aggregate delivery performance
└── Program benefits on track %

Level 3: PROJECT KPIs (Project Manager)
├── Schedule Performance Index (SPI)
├── Cost Performance Index (CPI)
├── Scope completion %
├── Risk exposure trend
├── Stakeholder satisfaction
└── Quality metrics

Level 4: EXECUTION METRICS (Team)
├── Sprint velocity / throughput
├── Cycle time / lead time
├── Defect rate / rework rate
├── Team health score
├── Burndown / burnup
└── WIP limits adherence
```

### Mapping to Existing Templates

| KPI Level | Existing Templates | Gap |
|-----------|-------------------|-----|
| Strategic | `financial-governance/roi-tracking-dashboard.md`, `benefit-realization-framework.md` | Portfolio-level KPI dashboard |
| Program | `project-assessment-suite/` (health, governance) | Cross-project aggregation template |
| Project | `status_report_template.md`, `executive-dashboards/`, `risk_register_template.md` | Integrated project KPI dashboard |
| Execution | `product-metrics-dashboard.md`, `metrics/risk-data/` | Velocity/burndown template, team health survey |

### Implementation Plan (Sprint 8)
1. Create integrated project KPI dashboard template (consolidates scattered metrics)
2. Enhance executive dashboard with strategic KPI section
3. Create team health/velocity tracking template (addresses Team domain gap)
