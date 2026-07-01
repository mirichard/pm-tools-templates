---
title: "Value Delivery Dashboard"
methodology: "universal"
complexity: "intermediate"
owner: "mirichard"
updated: "2026-07-01"
---

# Value Delivery Dashboard

**Purpose:** Track the connection between project deliverables and business value. This dashboard answers: *"Is the work we're doing producing the outcomes we promised?"*

> **Usage options:**
> - **Standalone** — Use this as a dedicated value delivery report
> - **Integrated** — Append these sections to your [Project Dashboard](project-dashboard-template.md) after the "Upcoming Activities" section
>
> **Related resources:**
> - [KPI Mapping Template](kpi-mapping-template.md) — Define your KPI hierarchy first
> - [Benefit Realization Framework](../../../business-stakeholder-suite/financial-governance/benefit-realization-framework.md) — Detailed benefits planning
> - [ROI Tracking Dashboard](../../../business-stakeholder-suite/financial-governance/roi-tracking-dashboard.md) — Financial value tracking

---

## Dashboard Header

- **Project/Program:** [Name]
- **Reporting Period:** [Start Date] – [End Date]
- **Prepared By:** [Name]
- **Review Frequency:** [Weekly / Bi-weekly / Monthly]

---

## Panel 1: Value Delivery Summary

| Metric | Value | Trend | Status |
|--------|-------|-------|--------|
| **Value Health Score** | ___/100 | ↑↓→ | 🟢🟡🔴 |
| **Benefits On Track** | ___% | ↑↓→ | 🟢🟡🔴 |
| **KPI Targets Achieved** | ___/___ | ↑↓→ | 🟢🟡🔴 |
| **Stakeholder Satisfaction** | ___/5 | ↑↓→ | 🟢🟡🔴 |

**Value Health Score calculation:**
```
Value Health Score = (
    Benefits On Track %    × 0.40
  + KPI Achievement %      × 0.30
  + Stakeholder Satisfaction % × 0.20
  + Outcome Confidence %   × 0.10
)

Status thresholds:
  🟢 Green  = ≥ 80
  🟡 Yellow = 60–79
  🔴 Red    = < 60
```

**Period summary:**
[1–2 sentence narrative: "Value delivery is on track. 4 of 5 planned benefits are trending to target. Key risk: benefit BEN-003 delayed due to dependency on vendor integration."]

---

## Panel 2: Benefits Status

### Active Benefits

| ID | Benefit | Category | Target Value | Realized Value | Gap | Status | Owner |
|----|---------|----------|-------------|---------------|-----|--------|-------|
| BEN-001 | [Name] | Financial / Operational / Strategic | $[X] or [X]% | $[Y] or [Y]% | [Z] | 🟢🟡🔴 | [Name] |
| BEN-002 | [Name] | | | | | | |
| BEN-003 | [Name] | | | | | | |
| BEN-004 | [Name] | | | | | | |
| BEN-005 | [Name] | | | | | | |

### Benefits Summary

| Metric | Value |
|--------|-------|
| Total planned benefits | [count] |
| On track (🟢) | [count] ([%]) |
| At risk (🟡) | [count] ([%]) |
| Off track (🔴) | [count] ([%]) |
| **Total expected value** | **$[amount]** |
| **Value realized to date** | **$[amount] ([%])** |
| **Realization rate** | **[%]** |

> *For detailed benefit planning and measurement methodology, see the [Benefit Realization Framework](../../../business-stakeholder-suite/financial-governance/benefit-realization-framework.md).*

---

## Panel 3: Outcome KPIs

Track the KPIs most relevant to value delivery. Pull targets from your [KPI Mapping Template](kpi-mapping-template.md).

### Strategic KPIs (Level 1)

| KPI | Target | Actual | Variance | Trend | Status |
|-----|--------|--------|----------|-------|--------|
| [e.g., Portfolio ROI] | [X]% | [Y]% | [+/- Z]% | ↑↓→ | 🟢🟡🔴 |
| [e.g., Benefits Realization Rate] | [X]% | [Y]% | [+/- Z]% | ↑↓→ | 🟢🟡🔴 |
| [e.g., Strategic Alignment Score] | [X]% | [Y]% | [+/- Z]% | ↑↓→ | 🟢🟡🔴 |

### Project KPIs (Level 3)

| KPI | Type | Target | Actual | Variance | Trend | Status |
|-----|------|--------|--------|----------|-------|--------|
| Schedule Performance (SPI) | Lagging | ≥ 0.95 | | | ↑↓→ | 🟢🟡🔴 |
| Cost Performance (CPI) | Lagging | ≥ 0.95 | | | ↑↓→ | 🟢🟡🔴 |
| Scope Completion | Lagging | ≥ [X]% | | | ↑↓→ | 🟢🟡🔴 |
| Risk Exposure | Leading | Decreasing | | | ↑↓→ | 🟢🟡🔴 |
| Quality Score | Lagging | ≤ [X]% defects | | | ↑↓→ | 🟢🟡🔴 |

**KPI Achievement Rate:** ___/___ KPIs meeting targets = **[X]%**

> *For full KPI hierarchy (Levels 1–4) and leading/lagging indicator definitions, see the [KPI Mapping Template](kpi-mapping-template.md).*

---

## Panel 4: Value Flow

Map what was delivered to the business value it produced (or is expected to produce).

### Recent Deliverables → Outcomes

| Deliverable | Delivered | Expected Outcome | Outcome Status | Evidence | Benefit Linked |
|-------------|-----------|-----------------|----------------|----------|----------------|
| [e.g., New onboarding flow] | [Date] | Reduce time-to-productivity by 20% | 🟢 Achieved | Avg onboarding time: 3 days → 2.4 days | BEN-001 |
| [e.g., Risk dashboard v2] | [Date] | Improve risk response time by 30% | 🟡 Partial | Response time: 48hrs → 38hrs (21%) | BEN-003 |
| [e.g., API integration] | [Date] | Eliminate manual data entry | ⏳ Pending | Deployed, measuring over next 2 weeks | BEN-004 |
| [Deliverable] | [Date] | [Expected outcome] | 🟢🟡🔴⏳ | [Measurement] | [BEN-ID] |

### Value Flow Summary

| Metric | Value |
|--------|-------|
| Deliverables shipped this period | [count] |
| Outcomes achieved | [count] |
| Outcomes partially achieved | [count] |
| Outcomes pending measurement | [count] |
| **Delivery-to-outcome conversion rate** | **[%]** |

---

## Panel 5: Leading Indicators

These forward-looking metrics predict whether planned value will be realized.

| Indicator | Value | Target | Trend | Signal |
|-----------|-------|--------|-------|--------|
| **Outcome Confidence** | ___% | ≥ 80% | ↑↓→ | Team's subjective confidence in realizing remaining planned benefits |
| **Benefits Pipeline** | $[amount] | — | ↑↓→ | Total value of benefits not yet realized (unrealized potential) |
| **Time to Value** | ___ days | ≤ ___ days | ↑↓→ | Avg days from deliverable completion to measurable outcome |
| **Stakeholder NPS** | ___ | ≥ ___ | ↑↓→ | Net Promoter Score from stakeholder satisfaction survey |
| **Dependency Risk Count** | ___ | Decreasing | ↑↓→ | Number of unresolved dependencies that could block value delivery |

### Early Warning Signals

- [ ] **Outcome Confidence < 60%** → Schedule a value delivery review with stakeholders
- [ ] **Benefits Pipeline declining without realization** → Benefits may be at risk of cancellation
- [ ] **Time to Value increasing** → Investigate delivery-to-adoption bottlenecks
- [ ] **Dependency Risk Count increasing** → Escalate blockers to program level
- [ ] **Stakeholder NPS < 0** → Conduct stakeholder interviews to understand dissatisfaction

---

## Review Actions

### This Period's Decisions

| Decision | Rationale | Impact | Owner | Date |
|----------|-----------|--------|-------|------|
| [e.g., Accelerate BEN-003] | Behind target, high business value | Reassign 2 resources | [Name] | [Date] |
| [Decision] | [Why] | [What changes] | [Who] | [When] |

### Adjustments for Next Period

- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]

---

## Appendix: Value Delivery Glossary

| Term | Definition |
|------|-----------|
| **Benefit** | A measurable improvement resulting from a project deliverable |
| **Value Health Score** | Composite metric (0–100) combining benefits on-track %, KPI achievement, stakeholder satisfaction, and outcome confidence |
| **Value Flow** | The traceable connection from a deliverable to the business outcome it produces |
| **Outcome Confidence** | Team's subjective probability (0–100%) that remaining planned benefits will be realized on schedule |
| **Time to Value** | Days elapsed from deliverable completion to first measurable business outcome |
| **Benefits Pipeline** | Total monetary or percentage value of planned but not-yet-realized benefits |
| **Delivery-to-Outcome Conversion** | Percentage of shipped deliverables that have produced their expected outcome |
