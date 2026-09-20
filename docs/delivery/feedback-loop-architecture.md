# Feedback Loop Architecture

Story #753 · Epic #714 · Acceptance correction: 09/20/2026

## When to use

Use this architecture when stakeholder input must influence recurring delivery decisions, including product evolution and project-to-operations handover. Scale collection frequency to the decision and risk; the stages below can repeat and overlap.

## When not to use

For a standalone retrospective with no continuing delivery decisions, use the existing retrospective directly. Do not collect personal or sensitive feedback without an appropriate purpose, access model and retention decision. A survey score does not establish acceptance or compliance.

## Stage loops and existing artifacts

Maintain feedback in the existing backlog, issue log or action register. Reuse the linked templates; no second feedback database is required. Each record contains ID, stage, source/date, collection channel, finding, triage decision/rationale, owner, due date, linked action, verification and response to the source.

| Stage | Feedback source and collection | Processing and accountable owner | Action path and existing artifact |
|---|---|---|---|
| Ideation | Prospective users, frontline staff and sponsors; interviews/workshops (sync), idea submissions and surveys (async). | Product/business owner groups needs, tests assumptions and records whose input is missing. | Accept an experiment, revise the value hypothesis, defer with rationale or reject; record the decision in the [KPI mapping](../../project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md) and existing initiative backlog. Return the decision to contributors. |
| Planning | Stakeholders and delivery/operations teams; planning reviews (sync), requirements comments and dependency questions (async). | PM and requirement owner assess scope, feasibility, acceptance criteria and impact before baselining. | Update acceptance criteria or submit a [change-control record](../../role-based-toolkits/project-manager/governance-tools/change-control-process.md); communicate disposition at the next agreed planning review. |
| Execution | Team, users and quality reviewers; [sprint retrospective](../../domains/team/templates/agile/sprint_retrospective_template.md) (sync), review comments and issue reports (async). | Delivery lead deduplicates findings, separates defects from improvements and assigns a verifiable action. | Put corrective work in the existing backlog; review effectiveness in the next retrospective and link the result to the originating feedback. |
| Delivery | Receiving users, sponsor and operational owner; acceptance demonstration (sync), test evidence and sign-off comments (async). | Acceptance authority checks evidence against agreed criteria and records exceptions; delivery is not accepted merely because feedback was collected. | Record acceptance, rejection or conditional handover in the [closure report](../../domains/delivery/templates/traditional/Traditional/Process_Groups/Closing/project_closure_report_template.md). Failed criteria return to the delivery backlog with owner and retest date. |
| Post-delivery | Service users, operators and benefits owners; service reviews (sync), support tickets, telemetry and follow-up surveys (async). | Service/product owner reviews incidents, recurring needs and outcome evidence with the benefits owner. | Route incidents immediately, prioritize improvements, and update the [operational continuity record](../../transition_to_operations_framework.md) and [benefits review](../../templates/universal/benefits-review-template.md). Report verification to the source and feed new opportunities into ideation. |

For each stage, set a collection/review cadence and a named backup. Sync sessions support clarification and conflict resolution; async channels support distributed participation and evidence review. Both feed the same action record. Confirm receipt, explain deferrals, and provide a route to challenge a disposition. Protect anonymous contributors when reporting decisions.

## Critical feedback and escalation

Do not wait for a retrospective, survey cycle or minimum number of complaints when feedback indicates immediate safety, security, service or material delivery risk. Notify the designated incident/on-call owner immediately through the organization's established emergency route; preserve evidence and follow the applicable incident procedure.

For governance escalation, reuse [event controls](../governance/event-driven-controls.md) and [notifications](../governance/event-notifications.md). Record detected time, severity basis, accountable owner/backup, acknowledgement deadline, response-plan deadline, next update and delivery evidence. E09/E10 handle applicable control failures/incidents; E12 handles missing evidence. Internal targets never extend a stricter legal, contractual or safety deadline.

If acknowledgement or the action deadline is missed, escalate to the backup and next decision authority. The authority can approve a bounded deferral with rationale and review date; silence is not approval. Verify effectiveness before closure and notify the original source where appropriate.

## Feedback-loop health

Use a fixed reporting window, explicit cohort and source timestamps. Report both completed actions and outstanding/overdue work so delayed cases do not disappear from averages. Zero denominators and unavailable timestamps produce **not assessed**, not a favorable percentage.

| Measure | Definition and calculation | Interpretation and action |
|---|---|---|
| Response rate | Unique valid respondents / eligible people invited in the same survey cohort × 100. Define validity, invitation cutoff and duplicate handling. | Segment by stakeholder group where appropriate; investigate missing representation before treating the result as consensus. |
| Time-to-action | Elapsed time from feedback receipt to first substantive action, excluding automated acknowledgement. Report median, sample count and age of still-unacted items. | Owner investigates long delays and blockers. Use the same calendar/business-time convention across comparisons. |
| Closure rate | Items from a stated intake cohort with verified disposition by the cutoff / all items in that cohort × 100. Report implemented, rejected, duplicate and deferred counts separately. | Deferral is open work, not closure. Accepted/rejected dispositions require rationale and communication; implemented actions require effectiveness evidence. |

Example: 12 valid respondents from 20 invited gives 60% response. Of 10 feedback items received in one cohort, 4 verified implemented and 2 reasoned rejections communicated to their sources gives 60% closure; the 4 remaining items stay open. Neither percentage measures stakeholder satisfaction. See the [delivery metrics guide](delivery-metrics-framework.md) for source, cohort and dashboard conventions.

## Worked loop

A service user reports an inaccessible handover instruction through the async support channel. The service owner records the source/date and links the existing instruction. Triage identifies a delivery barrier, assigns an owner and due date, and alerts the delivery authority if acceptance is affected. The owner corrects the instruction; the receiving team demonstrates the task successfully. The record links that evidence, records the disposition, informs the user and adds the lesson to the existing retrospective. An unsuccessful demonstration returns the item to open work.

## Acceptance evidence map

The stage table covers ideation, planning, execution, delivery and post-delivery, and specifies sources, collection, processing and action paths. Its links integrate existing retrospective and review assets. Collection guidance covers sync/async use; the escalation section defines the immediate-action route; the health table defines all three required measures. Issue closure follows merged-result verification, not this document's existence alone.
