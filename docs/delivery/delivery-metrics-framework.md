# Delivery Metrics Framework

Story #755 · Epic #714 · Acceptance correction: 09/20/2026

## When to use

Use to understand flow and throughput alongside existing schedule, cost, quality and outcome measures in Kanban/continuous flow or Scrum/iteration delivery. Measure the system and improvement experiments, not individual productivity rankings.

## When not to use

Do not publish inferred durations from aggregate issue counts, compare teams using story points, or treat faster output as proof of realized value. If source events or measurement boundaries are unavailable, report **not assessed**. A one-off delivery may need only its existing execution measures.

## Define the measurement boundary

Record workflow ID/version, item type, request/commitment point, started state, finished state, reporting window and timezone, calendar/business-time convention, source URL/query/as-of time and owner. Use one consistent elapsed-time basis. State cancellation, reopening, splitting and duplicate policies before counting. Include blocked/review/queue states inside the started-to-finished boundary in WIP and cycle time.

Core throughput, cycle-time and WIP terminology follows [The Kanban Guide, May 2025](https://kanbanguides.org/the-kanban-guide/2025.5/), checked 09/20/2026. The reporting contracts and worked examples below are repository implementation guidance.

| Measure | Definition | Reporting rule |
|---|---|---|
| Throughput | Count of distinct work items finished per unit of time. | Report item type, count and window length. Story-point velocity is a separate iteration measure; points are not item counts. |
| Cycle time | Elapsed time from started to finished, including waiting within that boundary. | Report completed cohort, sample size and median/percentiles with calculation method. Do not substitute active effort. |
| Lead time | Elapsed time from the explicitly chosen request/commitment point to finished. | Label the start event; it may precede the cycle-time boundary. Compare only identical definitions. |
| WIP | Count of started but unfinished items at the observation time, including blocked and waiting items. | Report as-of timestamp and agreed WIP policy; no universal team-size multiplier. |
| Flow efficiency | Non-overlapping active elapsed time divided by total elapsed time within the same chosen boundary × 100. | Record how active intervals are captured. For this guide use started-to-finished elapsed time as denominator; missing active intervals means not assessed. Do not divide cycle time by lead time as a general proxy. |

Track unfinished item age (observation time minus started time) beside completed cycle times so stuck work remains visible. Active elapsed time is not summed person-hours: simultaneous workers do not multiply an interval's duration.

## Worked calculation

Illustrative item A: requested at hour 0, started at hour 24, finished at hour 120; measured active intervals total 24 non-overlapping hours within the started-to-finished boundary. Lead time is 120 hours, cycle time 96 hours, and flow efficiency 24 / 96 × 100 = 25%. The remaining 72 hours within that boundary are waiting; the 24 hours before start are outside it.

For a seven-day reporting window, four distinct finished items give throughput of 4 items/week. If two other items have started but remain unfinished at cutoff (including one blocked), WIP is 2. An item's story points do not change either count. Cancelled work is reported separately; reopened work follows a disclosed policy so it is not silently counted twice.

## Reuse existing metrics and dashboard assets

Extend newly produced records in [metrics/status-data](../../metrics/status-data/) using the optional `flow_metrics` contract in [metrics guidance](../../metrics/README.md). The existing status-reporting producers expose the field as null until verified event data is supplied. Historical snapshots are preserved; this change does not implement an event collector or backfill historical measurements.

Existing aggregate fields such as `recent_closed` are only potential throughput inputs after verifying window, scope, uniqueness and completion semantics. `open_issues` includes unstarted work and is not WIP. Neither field supplies start or active-work timestamps. Reconcile source counts before combining them with new measures; inherited historical totals are not assumed reliable.

Use the added **Flow and value measurements** section of the [existing project dashboard](../../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md#flow-and-value-measurements). Keep its schedule/cost/quality fields and event-control handoff. Populate observed values with provenance and an action owner; absent flow data stays not assessed and never turns the dashboard green.

| Cadence | Flow view | Existing execution view | Decision |
|---|---|---|---|
| Kanban / continuous | WIP and age at observation time; throughput and completed cycle/lead times over fixed rolling windows. | Maintain budget, service quality and risk measures on their approved cadence. | Unblock work, adjust pull/WIP policy or run a bounded improvement experiment. |
| Scrum / iterations | Use the same item/time definitions; show completed cohort per sprint plus rolling windows and unfinished WIP/age. | Retain sprint goal, scope, capacity and optional team-local velocity. | Discuss causes and an experiment at the retrospective; do not reset WIP or age at sprint boundaries. |

## Contextual baselines and interpretation

Establish a local baseline from comparable work types, workflow versions and calendar conventions. Show sample count and missing-data coverage. Small samples make percentiles unstable: publish raw durations/range and uncertainty rather than asserting a precise service expectation. Choose and disclose a percentile method; do not mix methods across periods.

Compare a team's own like-for-like history before and after a change, considering item mix, demand, capacity, rework and quality. Segment unusually large or urgent work rather than changing definitions to improve the score. Avoid universal targets such as “60% flow efficiency” or “two-day cycle time.” A benchmark is relevant only with its source, cohort, boundary and limitations recorded.

High WIP with increasing age suggests investigating queues; falling cycle time with rising escaped defects calls for a quality review. Throughput growth with flat outcomes calls for reassessing what is delivered. Set local review thresholds and use [event controls](../governance/event-driven-controls.md) for significant exceptions; retain mandatory approvals.

## Link flow to the value KPI hierarchy

Use the existing [four-level KPI mapping template](../../project-lifecycle/04-monitoring-control/progress-tracking/kpi-mapping-template.md) from the value-delivery work. Add the actual KPI IDs and owners to dashboard records; the mapping is a testable contribution hypothesis, not automatic attribution.

| Level | Example link | Evidence and owner |
|---|---|---|
| 4 — Execution | Service-request cycle time and throughput, with quality/rework guardrails. | Delivery owner provides event history and completed cohort. |
| 3 — Project | Time until the new service capability is accepted and used. | PM checks acceptance and adoption evidence against baseline. |
| 2 — Program | Contribution to the program's service improvement benefit. | Program benefits owner reconciles dependencies and avoids double counting. |
| 1 — Strategic | Improved customer outcome or reduced verified operating cost. | Sponsor/benefits owner measures realized outcomes using the [benefits review](../../templates/universal/benefits-review-template.md). |

This applies the repository's evidence-based-decisions, value-focus and continuous-learning principles. Delivery counts are output; value realization requires separate outcome evidence.

## Acceptance evidence map

The metric table defines all five requested measures; cadence guidance supports flow and iterations. The existing status producers and metrics contract extend metrics assets; the existing dashboard combines flow and execution measures. Baseline guidance covers contextual interpretation, and the four-level mapping connects delivery to value KPIs. These address the original six criteria; final acceptance follows merged-result verification.
