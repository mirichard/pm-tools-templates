# Event-Driven Governance Controls

Story #748 · Parent #713 · Sprint 14

Use these controls to respond to material events between scheduled reviews. They **complement, never replace, scheduled governance**: retain the artifacts, authorities, gates and reporting cadence of the [adaptive governance model](governance-decision-matrix.md) and [risk-based scaling framework](risk-based-scaling.md). A quiet alert queue is not evidence that scheduled reviews can be skipped.

This is an operating model and configurable catalog, not a deployed monitoring service. Assign named people, approve thresholds and connect evidence sources before using it. Existing incident procedures and stricter mandatory response requirements take precedence.

## Configure before activation

For each enabled event record: event ID, scope, source and metric definition, approved threshold, comparison operator, measurement window, sampling frequency, source freshness limit, primary owner, backup, decision authority, notification channel, acknowledgement deadline and next-action deadline. The sponsor and relevant control owner approve the configuration and any changes. Review disabled/inapplicable events with a reason and named approver; never silently disable a mandatory control.

The catalog's thresholds are approved project parameters, not universal limits. Examples such as **budget variance >10%** or **turnover >20%** are illustrative; they become operative only when approved. Equality does not breach a strict `>` threshold. Retain the baseline version used to evaluate the event so a later rebaseline cannot erase the historical breach.

Use these default response classes unless an approved requirement is stricter. Timelines start at **detection**, not the next reporting cycle:

| Class | Acknowledge | Required next action | Escalation if missed |
|---|---|---|---|
| Immediate | Primary or backup acknowledges within 1 elapsed hour. | Begin safe containment/escalation immediately under existing procedures; establish a decision/response plan within 4 elapsed hours. | Notify backup and escalation authority immediately when the acknowledgement deadline expires; keep escalating unresolved deadlines. |
| Urgent | Within 4 working hours. | Convene the decision owners and record a response plan within 1 business day. | Notify backup and sponsor at the missed acknowledgement or plan deadline. |
| Routine | Within 1 business day. | Record an impact assessment and decision request/plan within 2 business days, before any affected commitment. | Notify backup and next authority at the missed acknowledgement or plan deadline. |

Define working hours, business-day calendar and time zone in the charter. Immediate events need a staffed response route outside business hours; do not rely on an unattended inbox. Plans must name action owners, dates, decision authority, interim restrictions and next update. These deadlines require acknowledgement and a response plan, **not guaranteed resolution**. A nearer gate or required response deadline takes precedence. Failure to respond never constitutes approval.

## Event catalog

| ID | Event | Trigger condition | Required governance response | Responsible party and decision authority | Timeline |
|---|---|---|---|---|---|
| E01 | Forecast budget breach | Forecast-at-completion variance `(forecast total cost - approved total budget) / approved total budget × 100` exceeds the approved percentage for the same scope/currency; e.g., >10%. | Validate forecast and baseline, assess funding/contingency options and log the sponsor decision before new affected commitments. | Budget owner prepares evidence; PM coordinates; sponsor approves funding/baseline changes. | Urgent |
| E02 | Milestone slippage | Forecast milestone date minus its approved baseline date exceeds the approved delay in calendar days, or a mandatory milestone is forecast to be missed. | Review critical path and recovery options; agree dependency actions and escalate any requested commitment change. | Delivery lead owns analysis; sponsor or delegated schedule authority decides. | Urgent |
| E03 | Critical risk materializes | A risk classified high/critical under the approved assessment occurs, or its approved contingency activation condition is met. | Open/link an issue, activate authorized contingency, assess remaining exposure and notify the sponsor; follow the incident route if applicable. | Risk owner responds with PM; sponsor and applicable control owner decide reserved actions. | Immediate |
| E04 | Baseline scope change | A change request would alter an approved scope/acceptance baseline, including work proposed outside delegated tolerances. | Log the request and assess cost, schedule, risk and benefits before authorizing affected work; retain pending/rejected decisions. | PM/change owner assesses; designated change authority approves or rejects. | Routine |
| E05 | Acceptance or quality failure | A mandatory acceptance criterion fails, or a defect exceeds the approved release/gate severity tolerance. | Hold the affected gate/release; obtain corrective-action and verification evidence before resubmission. | Quality/delivery owner investigates; gate authority and relevant control owner decide readiness. | Urgent |
| E06 | Critical dependency failure | A critical supplier/interface/dependency is forecast unavailable by its approved need date, or fails a committed acceptance condition. | Assess downstream exposure, agree an owned recovery/fallback and escalate changed commitments across projects. | Dependency owner coordinates; program lead/sponsor resolves cross-project decisions. | Urgent |
| E07 | Team turnover or critical capability loss | Departures in a rolling 30-calendar-day window divided by assigned headcount at the start of that window exceed the approved percentage (e.g., >20%), or an indispensable role becomes uncovered. | Reassess capacity, knowledge transfer, segregation of duties and delivery commitments; approve coverage/recovery actions. | Resource manager and PM assess; sponsor approves material resourcing/baseline changes. | Urgent |
| E08 | Decision authority unavailable | A required decision reaches its recorded decision-needed deadline without an authorized decision, or the named approver is unavailable and no authorized delegate can act. | Escalate to the next authority; name an authorized delegate or revise the plan. Hold commitments needing the missing approval. | PM owns routing; sponsor/next authority assigns delegation or decides. | Urgent |
| E09 | Mandatory control failure | Evidence identifies failure of an applicable mandatory control, or required control evidence is absent at the affected gate. | Notify the control owner immediately, apply authorized restrictions and hold the affected gate until the required disposition/evidence is approved. | Accountable control owner leads; sponsor/gate authority handles dependent project decisions. | Immediate |
| E10 | Suspected security or safety incident | An observed event meets the organization's suspected-incident criteria; confirmation is not required to notify the incident route. | Follow the established incident/emergency procedure first; share only necessary project impact through governance channels and track linked decisions. | Designated incident/safety lead responds; PM coordinates project impact with sponsor. | Immediate |
| E11 | Benefit or outcome viability breach | Forecast benefit/outcome performance falls below its approved minimum over the defined measurement horizon, or a critical business-case assumption is invalidated. | Revalidate the business case, options and acceptance assumptions; sponsor decides continuation, adjustment or stop. | Benefit/product owner prepares evidence; sponsor/investment authority decides. | Routine |
| E12 | Monitoring evidence unavailable | A required source is missing, fails validation, exceeds its approved freshness limit, or cannot support a calculation because a denominator/baseline is zero or undefined. | Mark the measure unknown, investigate the evidence gap and assign recovery owner/date. Do not report green or infer that thresholds are unbreached; apply provisional risk controls where exposure cannot be assessed. | Metric/source owner repairs evidence; PM and applicable control owner assess interim restrictions. | Urgent |

For E01, use a forecast-at-completion measure, not actual spend to date or earned-value variance. For E07, retain the window's starting population and distinct departures; additions do not dilute the denominator. If either denominator is zero/undefined, raise E12 instead of calculating a percentage. Do not infer an E01/E07 threshold breach from unavailable data; known high exposure or a critical vacancy still triggers its independent event.

Source owners set sampling intervals short enough to detect events before the decision window closes. Notification deadlines cannot compensate for stale monitoring. E12's configuration must itself have an independent heartbeat/reconciliation check so a failed dashboard cannot silently suppress its own alert.

## Respond, escalate and close

1. **Detect and record:** capture a unique occurrence ID, catalog ID, detected time/time zone, source/as-of date, observed value/condition, threshold and baseline version, evidence link and affected objective. Anyone can report an event; the assigned owner validates it without delaying immediate containment.
2. **Notify and acknowledge:** use the [initial alert](event-notifications.md#initial-alert). Include the named owner/backup, decision authority, acknowledgement deadline and next-action deadline. Delivery confirmation is not acknowledgement; the responsible person must accept ownership explicitly.
3. **Assess and decide:** link the risk, issue, change or incident record. Apply the effective tier and risk controls, record authorized decisions and restrictions, and communicate the next update time. Do not let the alerting mechanism authorize changes.
4. **Escalate overdue or worsening events:** send the [escalation notice](event-notifications.md#escalation-or-decision-request) to the charter's next authority. An unavailable owner routes to the backup. Notify the sponsor if the backup also fails; keep the event open and hold affected commitments lacking approval. Escalate material deterioration immediately, even if an earlier deadline has not expired.
5. **Verify closure:** the decision/control owner confirms the required response and evidence, residual exposure, handover ownership and follow-up date. Use the [closure/update notice](event-notifications.md#update-and-closure). An improved metric alone does not close an issue, waive a control, approve a baseline or lower a tier.
6. **Reconcile at scheduled reviews:** include open, overdue, closed and suppressed duplicate alerts in the normal status cycle. Verify source completeness, owners, actions and missed detections; retain scheduled gates and review dates.

Deduplicate repeated observations of the **same occurrence** using catalog ID, project/scope and linked source record; retain each observation and the original detection time. Do not reset the response clock on retries. Changed severity, new affected scope or a new occurrence after verified closure requires a new notification or reopened record with its own audit trail. Never suppress a distinct incident merely because another event has the same catalog ID.

## Monitoring and reporting integration

| Existing asset | Input to event control | Record returned to the asset |
|---|---|---|
| [Project dashboard](../../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md) | Source/as-of date, approved metric definition, scope, threshold and observed trend; add forecast-total-cost data for E01. | Event/occurrence ID, unknown-data flag, owner, acknowledgement/plan deadlines and current state; retain ordinary metric reporting. |
| [Status report](../../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md) | Current exceptions, commitments, decisions needed and forecasts. | Open/overdue events, response decisions and closure evidence. Send urgent alerts immediately; the scheduled report summarizes them later. |
| [Risk register](../../domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md) | Risk ID, assessed exposure, indicators and approved contingency conditions. | Event link, response effectiveness and verified residual exposure; use #747 before changing governance intensity. |
| [Issue log](../../domains/delivery/templates/traditional/Traditional/Templates/issue_log_template.md) | Materialized risk, defect, control failure or monitoring gap. | Issue owner, restrictions, action dates, escalation decisions and resolution evidence. |
| [Change control](../../role-based-toolkits/project-manager/governance-tools/change-control-process.md) | Requested scope/baseline changes and impact assessment. | Authorized decision, resulting baseline version and linked event; notification never replaces approval. |
| [Escalation matrix](../../role-based-toolkits/project-manager/governance-tools/escalation-matrix.md) | Named primary/backup, limits of delegation and next authority. | Acknowledgement, overdue routing, decision owner and notification history. |
| [Benefits governance](../../role-based-toolkits/program-manager/benefits-realization/benefits-governance.md) | Benefit forecasts, assumptions, measurement horizon and approved minima. | Investment decision, accountable outcome owner, residual exposure and follow-up. |

Add these fields to the existing tracker; a separate database is unnecessary:

| Occurrence / event ID | Detected / evidence as-of | Condition / baseline | Owner / backup / authority | Acknowledge by / actual | Plan due / next update | State / linked record | Decision / closure evidence |
|---|---|---|---|---|---|---|---|
| [ID / E01–E12] | [Timestamp/time zone] | [Observed vs approved] | [Names] | [Times] | [Times] | [Open/acknowledged/responding/closed; link] | [Decision, approver, date and evidence] |

## Walkthroughs

- **Threshold boundary:** approved E01 threshold is >10%, budget is $100,000 and forecast total cost is $110,000: no E01 percentage breach at exactly 10%. A forecast of $111,000 is 11% and opens E01; budget owner acknowledges within 4 working hours and records a plan within 1 business day. Other approved conditions still apply.
- **Missing denominator:** a zero baseline budget raises E12, not a fabricated 0% or infinite variance. Mark exposure unknown, assign a source owner and assess provisional high-risk controls under #747 until evidence supports a rating.
- **Materialized risk and silence:** a critical integration risk occurs at 2:00 PM. Open E03 and a linked issue; begin authorized contingency immediately. If unacknowledged at 3:00 PM, escalate to the backup/authority. Retain the original clock; the response plan is due by 6:00 PM unless stricter requirements apply.
- **Recovery and routine review:** after verified recovery, the authorized owner records residual exposure and closes the occurrence. The next scheduled governance review still takes place and examines the response and any missed signals.
