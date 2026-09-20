---
title: "Disaster Recovery Template"
methodology: "universal"
complexity: "starter"
owner: "mirichard"
updated: "2026-09-19"
primary_principles: ["risk-optimization", "stewardship"]
secondary_principles: ["quality-by-design"]
principle_rationale: "Defines service recovery objectives, activation authority and runbook verification so owners can rehearse and execute accountable recovery."
---

# IT Infrastructure Disaster Recovery Template

## When to Use

- When a service needs an agreed recovery runbook and exercise schedule.
- When operational owners must define recovery objectives, activation authority, and verification steps.

## When NOT to Use

- As proof that recovery objectives can be met without an exercise.
- Do not use a completed template or example configuration as proof of fitness for the actual environment. See [Template as substitute for judgment](../../../../../docs/principles/anti-patterns.md#template-judgment).

## Pairs Well With

- [Migration Plan Template](../../../../../domains/uncertainty/industry-specializations/information-technology/infrastructure/migration_plan_template.md).
- [Handover Template](../../../../../domains/measurement/role-based-toolkits/project-manager/essential-templates/handover-template.md).

Selection context: Planning domain; universal methodology; starter complexity. Match the situations above to project phase, risk, team size, and industry using the [decision-engine context model](../../../../../meta/architecture-research/800-801-context-assessment-model.md).

## Purpose and use

Prepare a service-specific recovery plan and validate it through exercises. Agree business recovery objectives before choosing technical procedures. Keep credentials in the approved secret store, not in this document.

## Service and recovery objectives

- **Service / business owner / technical owner:** [Names]
- **Critical users, operating periods, and impact:** [Context]
- **Recovery time objective (RTO):** [Target elapsed time to restore service]
- **Recovery point objective (RPO):** [Maximum acceptable data loss measured in time]
- **Dependencies:** [Identity, network, data, suppliers, upstream/downstream services]
- **Plan version / approval / next exercise:** [Version / decision / date]

## Activation and communications

| Trigger | Who declares recovery | Contacts and alternate channel | Escalation authority |
|---|---|---|---|
| [Observable service condition] | [Role / alternate] | [Approved directory reference] | [Role] |

## Recovery runbook

Use tested, environment-specific instructions. Define stop conditions and verification before proceeding to the next step.

| Step | Prerequisite | Procedure reference | Owner | Expected result / evidence | Stop or fallback condition |
|---|---|---|---|---|---|
| 1 | [Safe starting state] | [Approved runbook] | [Name / role] | [Result] | [Condition] |

- **Backup / restore source and validation:** [Location, access, integrity checks]
- **Recovery sequence:** [Dependencies and sequencing rationale]
- **Service acceptance:** [Business validation and approver]
- **Return to normal operation:** [Reconciliation, cutback criteria, authority, fallback]

## Exercise and maintenance record

| Scenario / date | Actual recovery time | Actual data loss | Objective met? | Evidence | Gap / owner / due date |
|---|---|---|---|---|---|
| [Scenario] | [Elapsed time] | [Measured loss] | [Yes / no / not measured] | [Record] | [Action] |

Reassess the plan after material service changes, failed exercises, or incidents. Record unresolved gaps explicitly; an untested plan is not proof that recovery objectives can be met.

## Related Resources
- [Infrastructure Requirements Template](../../../../../essential-templates/infrastructure/infrastructure-requirements-template.md)
- [Infrastructure Assessment Template](../../../../measurement/industry-specializations/information-technology/infrastructure/infrastructure_assessment_template.md)
