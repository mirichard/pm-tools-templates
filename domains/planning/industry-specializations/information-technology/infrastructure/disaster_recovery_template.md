---
title: "Disaster Recovery Template"
methodology: "universal"
complexity: "starter"
owner: "mirichard"
updated: "2026-09-19"
---

# IT Infrastructure Disaster Recovery Template

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
