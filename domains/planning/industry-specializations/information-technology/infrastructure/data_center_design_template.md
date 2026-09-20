---
title: "Data Center Design Template"
methodology: "universal"
complexity: "starter"
owner: "mirichard"
updated: "2026-09-19"
primary_principles: ["systems-thinking", "quality-by-design"]
secondary_principles: ["risk-optimization"]
principle_rationale: "Connects data-center capacity, power, cooling and resilience requirements to design decisions, acceptance checks and operational handover."
---

# Data Center Design Template

## When to Use

- During infrastructure planning when data-center capacity and design decisions need traceability.
- When facilities and IT owners must agree resilience, power, cooling, and handover requirements.

## When NOT to Use

- As engineering approval or a construction-ready design without qualified review.
- Do not use a completed template or example configuration as proof of fitness for the actual environment. See [Template as substitute for judgment](../../../../../docs/principles/anti-patterns.md#template-judgment).

## Pairs Well With

- [Infrastructure Assessment Template](../../../../../domains/measurement/industry-specializations/information-technology/infrastructure/infrastructure_assessment_template.md).
- [Disaster Recovery Template](../../../../../domains/planning/industry-specializations/information-technology/infrastructure/disaster_recovery_template.md).

Selection context: Planning domain; universal methodology; starter complexity. Match the situations above to project phase, risk, team size, and industry using the [decision-engine context model](../../../../../meta/architecture-research/800-801-context-assessment-model.md).

## Purpose and use

Capture requirements and design decisions for review by the facility, network, security, and operations leads. This planning worksheet does not prescribe engineering capacities or replace approved engineering drawings.

## Design context

- **Project / site / design owner:** [Names]
- **Business services and criticality:** [Services and consequences of interruption]
- **Current load and growth assumptions:** [Measured demand / forecast / horizon]
- **Constraints:** [Space, budget, schedule, existing systems, approvals]

## Requirements and design decisions

| System | Measured requirement and source | Proposed design / capacity | Redundancy and failure scenario | Reviewer / evidence |
|---|---|---|---|---|
| Power and backup | [Load / source] | [Design reference] | [Failure response] | [Name / calculation or test] |
| Cooling | [Heat load / source] | [Design reference] | [Failure response] | [Name / evidence] |
| Network and connectivity | [Traffic / latency needs] | [Design reference] | [Failure response] | [Name / evidence] |
| Racks, cabling, and physical space | [Inventory / growth] | [Layout reference] | [Access / maintainability] | [Name / evidence] |
| Physical access and environmental monitoring | [Policy / risk] | [Controls] | [Detection / response] | [Name / evidence] |

Record applicable site requirements with the responsible specialist and approval reference. Do not copy example capacities without sizing evidence.

## Implementation and acceptance

| Work package | Dependency / outage window | Owner | Acceptance test and threshold | Evidence / approver |
|---|---|---|---|---|
| [Package] | [Dependency / window] | [Name] | [Test] | [Reference / name] |

## Operational handover

- **As-built documentation and inventory:** [Location / owner]
- **Monitoring, maintenance, and support:** [Owners / schedules]
- **Resilience test results and unresolved defects:** [Evidence / accepted exceptions]
- **Acceptance decision and date:** [Approver / conditions / date]
- **Next capacity review:** [Date / trigger]

## Related Resources
- [Infrastructure Requirements Template](../../../../../essential-templates/infrastructure/infrastructure-requirements-template.md)
- [Infrastructure Assessment Template](../../../../measurement/industry-specializations/information-technology/infrastructure/infrastructure_assessment_template.md)
