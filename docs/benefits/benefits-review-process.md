---
title: "Benefits Review Process"
methodology: "universal"
complexity: "intermediate"
owner: "benefits-owner"
updated: "2026-09-02"
domain: "Measurement"
tags: ["benefits-realization", "governance", "value-delivery", "closure"]
---

# Benefits Review Process

## Purpose

Use this process to test whether project outputs are producing the approved business outcomes, make timely corrective decisions, and retain evidence after delivery. The accountable business benefits owner—not the project manager—owns realization after transition.

## When to use

Use for projects with approved, measurable benefit targets. Apply the full cadence to high-value, high-risk, regulated, or strategically material work; combine checkpoints for smaller work when the sponsor documents why reduced governance is proportionate.

## When not to use

Do not force this process onto exploratory or research work whose benefits are intentionally emergent. Use hypothesis and learning measures until targets can be responsibly baselined.

## Roles and decision rights

| Role | Accountability |
|---|---|
| Sponsor | Approves targets, tolerance, corrective funding, material scope changes, and closure decisions |
| Benefits owner | Accountable for measurement, realization actions, forecasts, evidence and post-project reviews |
| Project manager | Organizes reviews through closure, maintains traceability, and raises changes and risks |
| Operational owner | Supplies adoption and operating evidence; owns sustainment after handover |
| Finance/data owner | Validates baselines, calculations, sources and confidence |
| PMO/governance body | Challenges material variance, confirms proportional controls, and receives escalations |
| Stakeholder representative | Tests whether realized value and adverse impacts reflect stakeholder experience |

One named person may fill several roles, but Sponsor and Benefits Owner decision rights must remain explicit. Review records identify attendees, absences, conflicts and the decision owner.

## Required inputs

- Approved business case, expected outcomes and benefit IDs
- [Benefits Register](../../templates/universal/benefits-register-lightweight.md)
- Baselines, targets, measurement units, target dates and data-source owners
- Current delivery, adoption, cost, risk, issue and change-control information
- Prior review decisions and realization actions
- At closure: acceptance, transition readiness and outstanding obligations

If a baseline, target, owner or reliable source is missing, record the benefit as `NOT MEASURABLE`, raise a corrective action, and do not report it as on track.

## Review cadence

| Checkpoint | Timing | Focus | Required decision and retained output |
|---|---|---|---|
| Mid-project | At the approved midpoint or material stage boundary | Leading indicators, target validity, delivery-to-outcome assumptions | Continue, correct, rebaseline through change control, or escalate; signed review and action log |
| Closure | Before administrative closure | Outputs accepted, ownership transferred, current actuals and residual realization plan | Close, conditionally close, or hold closure; benefits transition record and scheduled reviews |
| Day 30 | 30 ± 5 calendar days after closure | Adoption, early operational stability and data availability | Continue plan, correct adoption/operations, or escalate; updated variance record |
| Day 60 | 60 ± 7 days after closure | Benefit trajectory and sustainability risks | Continue, fund corrective action, initiate change, or escalate |
| Day 90 | 90 ± 10 days after closure | Realized outcome, forecast confidence and sustained ownership | Accept realization status, extend monitoring, commission deep PIR, or escalate |
| Deep PIR | Normally 3–6 months after closure when warranted | Long-term realization and systemic lessons | Use the [Post-Implementation Review](../../templates/universal/post-implementation-review-template.md) |

An event-driven review occurs immediately when a red threshold, unreliable source, benefit-harm indicator, regulatory breach, or approved target change arises. Calendar reviews do not delay escalation.

## Review method

1. **Prepare:** Benefits owner freezes an as-of date, gathers source evidence, updates the register, and completes one [Benefits Variance Analysis](../../templates/universal/benefits-variance-analysis-template.md) per review.
2. **Validate:** Data owner confirms source, unit, direction, formula and confidence. Finance confirms material financial measures.
3. **Assess:** Review each benefit, dependencies, disbenefits, adoption and forecast. Separate delivery completion from outcome realization.
4. **Decide:** Decision owner records `CONTINUE`, `CORRECT`, `CHANGE`, `ESCALATE`, `EXTEND`, or `ACCEPT`, with rationale and dissent.
5. **Act:** Each action receives one owner, due date, success measure and escalation date. Approved baseline or scope changes follow change control; history is never overwritten.
6. **Learn and retain:** Send value findings to [Lessons Learned](../../role-based-toolkits/project-manager/essential-templates/lessons-learned.md), update the business case/portfolio forecast, and store the signed review with source references.

## Variance model

For a benefit where **higher is better**:

`achievement % = (actual − baseline) ÷ (target − baseline) × 100`

For a benefit where **lower is better**:

`achievement % = (baseline − actual) ÷ (baseline − target) × 100`

`variance percentage points = achievement % − expected achievement % at the review date`

The expected achievement curve must be approved before measurement. If none exists, use the approved target-date forecast and mark confidence `LOW`; do not assume linear realization silently. Monetary portfolio totals must not combine unlike periods or double-count dependent benefits.

## Default tolerance and escalation

The business case may approve stricter thresholds. These defaults apply otherwise:

| Status | Variance from expected achievement | Additional trigger | Required response |
|---|---:|---|---|
| Green | ≥ −5 percentage points | No material harm/control failure | Benefits owner monitors through next checkpoint |
| Amber | < −5 and ≥ −15 points | Forecast risk or corrective action needed | Benefits owner creates action within 2 business days; Sponsor reviews within 5 |
| Red | < −15 points | Material disbenefit, regulatory/control breach, target integrity issue, or forecast below approved minimum | Notify Sponsor and PMO within 1 business day; convene decision within 3 |
| Critical | Any | Safety, legal, ethical, or severe financial/reputational exposure | Immediate containment and escalation under applicable governance; do not wait for a review |

Repeated Amber at two consecutive checkpoints is treated as Red. Missing or unreliable evidence is Amber unless the resulting exposure is material, in which case it is Red.

## Escalation outcomes

The Sponsor or authorized governance body may approve corrective action, assign resources, change delivery or operating scope, rebaseline through formal change control, extend monitoring, initiate a deep PIR, suspend benefit claims, or stop harmful activity. Rebaselining must preserve the original baseline and approved-change history; it cannot be used to hide underperformance.

## Records and integration

Retain the completed review, variance analysis, source references, attendance, decisions, actions, approvals, change records and lessons in the project repository according to records policy. At closure, link these records from the closure report and transfer open actions to the operational owner. Feed validated forecasts to portfolio planning and use causal findings—not unsupported anecdotes—to improve future business cases and estimates.

## Related assets

- [Benefits Review Template](../../templates/universal/benefits-review-template.md)
- [Benefits Variance Analysis Template](../../templates/universal/benefits-variance-analysis-template.md)
- [Benefits Register](../../templates/universal/benefits-register-lightweight.md)
- [Value Stream Map](../../project-lifecycle/value-stream-map.md)
- [Change Control](../../project-lifecycle/04-monitoring-control/change-control/)
- [Closure guidance](../../project-lifecycle/05-closure/README.md)
