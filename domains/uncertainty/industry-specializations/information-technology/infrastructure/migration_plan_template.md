---
title: "Migration Plan Template"
methodology: "universal"
complexity: "starter"
owner: "mirichard"
updated: "2026-09-19"
---

# IT Infrastructure Migration Plan Template

## When to Use

- When moving infrastructure, systems, or data between controlled environments.
- When cutover needs readiness checks, verification, rollback authority, and operational handover.

## When NOT to Use

- To proceed without tested recovery options for a material migration failure.
- Do not waive essential controls solely because delivery is Agile, hybrid, or time-constrained. See [Tailoring by omission](../../../../../docs/principles/anti-patterns.md#tailoring-omission).

## Pairs Well With

- [Disaster Recovery Template](../../../../../domains/planning/industry-specializations/information-technology/infrastructure/disaster_recovery_template.md).
- [Infrastructure Assessment Template](../../../../../domains/measurement/industry-specializations/information-technology/infrastructure/infrastructure_assessment_template.md).

Selection context: Uncertainty domain; universal methodology; starter complexity. Match the situations above to project phase, risk, team size, and industry using the [decision-engine context model](../../../../../meta/architecture-research/800-801-context-assessment-model.md).

## Purpose and use

Plan a controlled move from a defined source to a defined target. Agree validation, stop conditions, and rollback authority before scheduling execution. Use environment-specific runbooks for commands and technical procedures.

## Migration scope

- **Migration owner / business approver:** [Names]
- **Source and target:** [Systems / versions / locations]
- **Assets and data in scope:** [Inventory reference / volume]
- **Exclusions and dependencies:** [Items / owners]
- **Service window and acceptable interruption:** [Window / approved limit]
- **Change record and approvals:** [Reference / decisions]

## Readiness and controls

| Readiness condition | Evidence | Owner | Status / unresolved gap |
|---|---|---|---|
| Target capacity and access verified | [Test / record] | [Name] | [Status] |
| Backup and restoration verified | [Restore evidence] | [Name] | [Status] |
| Dependency and stakeholder readiness | [Confirmations] | [Name] | [Status] |
| Rehearsal complete | [Results / lessons] | [Name] | [Status] |

## Execution and validation

| Sequence | Action / runbook | Dependency | Owner | Expected result | Evidence / actual time |
|---|---|---|---|---|---|
| 1 | [Action] | [Condition] | [Name] | [Result] | [Record] |

Validate inventory completeness, data reconciliation, permissions, critical user journeys, and operational monitoring against documented baselines. Record exceptions and require the named owner to accept them.

## Go/no-go and rollback

- **Go/no-go criteria and decision time:** [Conditions / time]
- **Decision authority and alternate:** [Roles]
- **Rollback triggers and latest safe decision point:** [Thresholds / time]
- **Rollback procedure and reconciliation of new data:** [Runbook / data handling]
- **Rollback validation:** [Service and data checks / approver]

## Handover and closure

- **Support owner and monitoring period:** [Owner / duration]
- **Outstanding defects:** [Impact / owner / due date]
- **Business acceptance:** [Approver / evidence / date]
- **Source retirement conditions:** [Retention, reconciliation, and approval requirements]
- **Lessons and follow-up:** [Actions / owners]

## Related Resources
- [Infrastructure Assessment Template](./infrastructure_assessment_template.md)
- [Deployment Checklist](../../../essential-templates/infrastructure/deployment-checklist-template.md)
