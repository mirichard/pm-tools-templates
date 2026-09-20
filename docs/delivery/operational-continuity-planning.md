# Operational Continuity Planning

Story #754 · Epic #714 · Acceptance correction: 09/20/2026

## When to use

Use for deliverables needing ongoing support, maintenance or evolution after the project team disbands. It applies to software, facilities, equipment, business processes and services. Begin before closure so the receiving owner can demonstrate readiness.

## When not to use

For a standalone artifact with no operational component, use the normal closure report. Do not require a real production incident to prove readiness; a safe exercise can demonstrate the receiving team's capability. Completion of a project does not itself establish operational acceptance or realized benefits.

## Extend the existing transition framework

Complete the operational continuity acceptance record in the [Transition to Operations Framework](../../transition_to_operations_framework.md#operational-continuity-acceptance-record). This is the maintained worksheet; the guidance here explains its use rather than creating a parallel plan. Enter through [05-closure / transition to operations](../../project-lifecycle/05-closure/transition-to-operations/README.md), and link the accepted record from the [closure report](../../domains/delivery/templates/traditional/Traditional/Process_Groups/Closing/project_closure_report_template.md).

## Support and maintenance decisions

| Support model | Suitable context | Required decision |
|---|---|---|
| Dedicated receiving team | Critical service or specialized equipment requiring sustained expertise. | Named owner and backup, coverage, budget, capability evidence and escalation authority. |
| Shared service | Several deliverables can use a common support capability. | Queue ownership, capacity, priority/conflict handling and service boundaries. |
| Self-service | Users can safely perform routine tasks using maintained instructions. | Accessible knowledge base, training, maintenance owner and a supported exception route. |
| Hybrid/vendor | Responsibilities cross internal and external teams. | Responsibility boundaries, contact paths, handoff acknowledgement and contract-backed obligations. |

Staffing follows demand, criticality, operating hours and competence. Project budget or industry alone does not determine headcount or support model. Record routine maintenance tasks, owner, frequency, prerequisites, spares/dependencies, downtime arrangements and evidence of completion. For software this includes patches, restores and configuration changes; for physical/process deliverables it includes inspection, calibration, supplies and procedure review.

## Knowledge transfer before team disbandment

Use the checklist in the existing framework's acceptance record. The receiving owner must locate the knowledge base, demonstrate representative routine and exceptional tasks, verify necessary access, and acknowledge responsibility. Record gaps with interim controls, owners and dates. A training attendance list alone is not evidence of operational competence.

Store runbooks, work instructions, known issues, design/decision rationale, vendor contacts and maintenance history in an owned, accessible location. Link restricted credential storage; never copy secret values into handover reports. Record who will update the knowledge base after project closure and who covers the primary owner’s absence.

## Warranty and ongoing support

The approved agreement determines whether a warranty exists and its actual obligations. Record the instrument, start/end event, duration, covered deliverables/defects, exclusions, reporting route, response versus restoration/resolution commitments, operating hours, costs and extension/dispute authority. Any credits, caps or support effort limits must come from that agreement; this guide supplies no default commercial terms.

At warranty end, assign every unresolved obligation to an accepted owner and funding source. Warranty expiry does not silently discharge open defects or transfer responsibility. Distinguish defect correction from enhancement requests and route the latter to the product/service backlog. Record ongoing support and end-of-life decisions, including replacement/migration, access and applicable record-retention decisions.

## Handover and review gates

1. **Prepare:** delivery and receiving owners agree scope, support model, maintenance, knowledge base and acceptance evidence.
2. **Demonstrate:** receiving staff perform representative tasks and an escalation exercise safely; record results and unresolved gaps.
3. **Accept or defer:** the designated authority accepts ownership with explicit conditions, or retains project responsibility and a remediation plan. Keep the closure record linked to the decision.
4. **Stabilize:** review actual incidents, maintenance and feedback on an agreed cadence. Exit stabilization on evidenced readiness criteria, not an arbitrary number of weeks or incidents.
5. **Operate and improve:** the service owner maintains support, budget and knowledge; the benefits owner checks outcomes through the [benefits review](../../templates/universal/benefits-review-template.md). Use [feedback loops](feedback-loop-architecture.md) for new needs and escalation.

## Worked contexts

| Decision | IT/software service | Non-IT facility handover |
|---|---|---|
| Scope/owner | Customer portal; service owner accepts production operations. | Refurbished training facility; facilities manager accepts the building/service scope. |
| Maintenance | Patch/restore schedule, deployment and rollback procedures, dependency owners. | Inspection and equipment-service schedule, supplier contacts and consumable/spare arrangements. |
| Knowledge transfer | Operator locates the runbook and demonstrates restore and incident routing in a safe environment. | Receiving staff locate operating manuals and demonstrate an opening/closing routine and emergency escalation exercise. |
| Support/escalation | Service desk → on-call engineer → service authority; approved security route for incidents. | Facilities helpdesk → maintenance contractor → facilities authority; existing emergency route for immediate hazards. |
| Warranty | Record software defect coverage, support hours and actual agreement dates. | Record covered workmanship/equipment, supplier obligations and actual agreement dates. |
| Acceptance evidence | Exercise results, access verification, known-issue disposition and signed ownership. | Inspection/commissioning evidence where applicable, keys/access handover, training demonstration and signed ownership. |

All example decisions require project-specific values and approval. No universal availability, staffing, warranty length or certification requirement is implied.

## Acceptance evidence map

The existing framework contains the support/maintenance/escalation/knowledge-base record and knowledge-transfer checklist. This guide supplies warranty decisions and IT/non-IT examples. The closure entry point and closure report link the record into the lifecycle. These map to the original six criteria of #754; issue closure follows merged-result verification.
