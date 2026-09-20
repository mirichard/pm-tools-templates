---
title: "Enterprise Risk Assessment Template"
methodology: "universal"
complexity: "starter"
owner: "mirichard"
updated: "2026-09-19"
primary_principles: ["risk-optimization", "systems-thinking"]
secondary_principles: ["evidence-based-decisions"]
principle_rationale: "Assesses cross-functional exposure against shared risk appetite and scoring conventions with named response and escalation owners."
---

# Enterprise Risk Assessment

## When to Use

- During planning or major change when material risks span multiple organizational functions.
- When risk appetite, scoring, ownership, and escalation need a shared enterprise view.

## When NOT to Use

- For a small team's routine issue list without enterprise exposure.
- Do not impose enterprise coordination or approval layers where team size and risk do not justify them. See [Maximum governance](../../../../../docs/principles/anti-patterns.md#maximum-governance).

## Pairs Well With

- [Risk Management Plan Template](../../../../../domains/measurement/project-lifecycle/02-planning/risk-management/risk-management-plan-template.md).
- [Risk Register Template](../../../../../domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md).

Selection context: Uncertainty domain; universal methodology; starter complexity. Match the situations above to project phase, risk, team size, and industry using the [decision-engine context model](../../../../../meta/architecture-research/800-801-context-assessment-model.md).

## Governance scaling recommendations

Use the [risk-based governance framework](../../../../../docs/governance/risk-based-scaling.md) to assess **technical, schedule, budget, organizational and compliance** exposure. Record each as low, medium, high or unknown, with risk IDs, dated evidence, current controls, an owner and next review.

- **Low:** combine evidence where the effective tier permits; retain weekly updates and required sponsor/acceptance gates.
- **Medium:** add dependency/contingency and change-impact evidence, weekly risk review and at least fortnightly sponsor review.
- **High or unknown:** use Rigorous controls, formal risk/control reporting and assurance at affected gates; assign evidence-gap owners and dates for unknowns.

Use the highest exposure, retaining higher context, size, team and policy floors; confirmed regulatory context remains Rigorous. Map local assessment scores to the approved exposure definitions with a rationale; do not average unlike scores. Reduce controls only after verified response effectiveness and sponsor/control-owner approval. Mandatory controls remain in force.

**Scaling decision:** [Five ratings and evidence; assessed/effective risk; tier and policy floor; affected artifacts/cadence; approval and effective date; next review].


## Purpose and use

Identify uncertain events that could affect enterprise objectives and agree accountable responses. Define assessment boundaries and thresholds before scoring. Record realized events in the issue log rather than treating them as future risks.

## Assessment context

- **Organization / program and objectives:** [Scope]
- **Assessment owner and participants:** [Names / roles]
- **Assessment date and horizon:** [Date / period]
- **Dependencies and exclusions:** [Included functions, suppliers, systems, and exclusions]
- **Risk appetite and escalation authority:** [Approved tolerances and decision owner]

## Scoring conventions

Agree project-specific definitions for low, medium, and high likelihood and impact. Define impact against cost, schedule, service, people, and other relevant objectives. A 1–3 ordinal ranking supports prioritization; it is not an estimated monetary loss. Record uncertain estimates explicitly.

| Level | Likelihood definition for this horizon | Impact threshold and affected objective |
|---|---|---|
| 1 — Low | [Definition] | [Threshold] |
| 2 — Medium | [Definition] | [Threshold] |
| 3 — High | [Definition] | [Threshold] |

## Risk assessment and response

| ID | Cause → uncertain event → consequence | Evidence / assumptions | Likelihood | Impact | Priority rationale | Owner |
|---|---|---|---|---|---|---|
| R-01 | [Risk statement] | [Source / uncertainty] | [1–3] | [1–3] | [Score and any override reason] | [Name] |

| Risk | Response and action | Due date | Trigger / indicator | Contingency | Residual exposure | Acceptance authority |
|---|---|---|---|---|---|---|
| R-01 | [Avoid / reduce / transfer / accept; action] | [Date] | [Observable threshold] | [Fallback] | [Remaining likelihood and impact] | [Name / decision / date] |

## Review and escalation

Review at [cadence] and after material changes. Escalate when a tolerance or trigger is exceeded. Verify response effectiveness with evidence before reducing a rating or closing a risk. Record decisions, dependencies, next review date, and unresolved information requests.

## Related Templates
- [Project Charter](../../../../../project-lifecycle/01-initiation/project-charter/)
- [Risk Management](../risk-management/)
- [Communication Plan](../../../../../project-lifecycle/02-planning/communication-planning/)
