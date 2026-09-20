# Release Cadence Decision Guide

Story #752 · Epic #714

## When to use

Use when deciding or revisiting how frequently a product/service releases increments. Start from customer need, readiness and operating constraints, not a universal release-frequency target.

## When not to use

Do not apply a recurring cadence to a one-time delivery merely to appear continuous. Never use cadence or urgency to bypass applicable approvals, safety, recovery or acceptance evidence.

## Choose a cadence

| Context | Candidate cadence | Constraints and decision |
|---|---|---|
| Stakeholders need predictable training, communication or coordinated change windows | Time-based (for example, a release opportunity every two weeks) | Agree window/timezone, dependencies and notification lead time; hold unready work. The sprint and release schedules may differ. |
| Small independent increments, reliable checks, monitoring/recovery and available decision/support owners | Flow-based (release on readiness) | Trigger on evidenced readiness plus authorized release conditions; control WIP and do not equate merged code with permission to deploy. |
| Independent changes coexist with shared migrations, external dependencies or customer windows | Coordinated mix | Allow ready independent increments while scheduling coupled changes; document which policy applies to each increment. |
| Recovery, evidence, staffing or dependencies are uncertain | Hold and improve capability | Assign the missing capability/decision to an owner and due date; do not increase frequency until the approved release conditions can be met. |

For each decision record demand/feedback delay, batch size, dependency coupling, test duration, data/configuration compatibility, monitoring/sample needs, recovery evidence, available support, contractual windows and decision authority. The [increment worksheet](../../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#increment-worksheet) stores the choice and rationale.

Choose a trial period and review date appropriate to demand and risk. Compare like-for-like history using the [delivery metrics guide](delivery-metrics-framework.md): throughput, elapsed lead/cycle times, WIP/age, failures/rework, user outcomes and operating load. Increase frequency only when smaller increments and adequate controls support the outcome; reduce or pause release exposure when readiness or service health deteriorates. Fewer releases alone do not fix a quality problem.

## Time-based example

A team plans a release opportunity every second Tuesday, with a published coordination window. Each increment has independent acceptance and immutable candidate evidence. The release owner checks dependencies, monitoring, support and recovery before authorizing a staged rollout. An unready increment is held and its forecast/communication updated; ready independent work may proceed if the authority approves the revised scope. A sprint review supplies learning, not automatic release permission.

## Flow-based example

A service team keeps each small change releasable after verification. A ready candidate enters limited exposure only when release policy/authority, support coverage and dependency checks permit. Expansion requires the recorded health and evidence conditions. Low traffic with insufficient sample causes a hold or approved longer observation; it does not count as success. Feedback and outcomes update the backlog continuously, while investment and governance reviews retain their agreed cadence.

## Exceptions and review

Record emergency-release rationale, incident/change authority, essential checks, recovery route, communications and follow-up. Urgency changes coordination, not the need for accountable decisions. Use the existing [event controls](../governance/event-driven-controls.md) for missed decisions, critical incidents or missing evidence; deadlines and mandatory controls still apply.

Review cadence after a material change in demand, dependencies, risk, staffing or release outcomes, and on the planned review date. Keep the approved cadence, actual releases, held increments and reasons distinct so reporting cannot confuse the schedule with achieved delivery.
