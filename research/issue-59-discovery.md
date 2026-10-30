# Issue #59 — Power Automate guide coverage and validation

**Research snapshot:** 2026-10-30
**Repository source revision:** [`8078fdd24db8e9d274a5922c1db00c051f708663`](https://github.com/mirichard/pm-tools-templates/tree/8078fdd24db8e9d274a5922c1db00c051f708663)
**Status:** Research only; issue #59 remains open and unscheduled. Michael Richard is the accountable decision owner. This report does not claim delivery, acceptance, or runtime validation.

## Decision brief

Keep the two extant examples as **unvalidated instructional material**, but revise their framing before users rely on them. Do not describe the guide as a collection of ready-to-use flows or instruct readers to import packages: the README links 20 Markdown files, only the weekly-status and risk-escalation targets exist, and no Power Automate package is present. The old missing-meeting-guide claim is confirmed for the current source snapshot, but it is one of 18 missing linked targets, not the only gap.

The weekly report and risk escalation documents are long prose recipes, not importable definitions or evidence of execution. Both contain mappings and implementation claims that need owner/tenant validation; the risk example in particular does not define numeric values for its choice fields although its score calculation uses numeric fields. Keep the six scope categories visible, mark approvals and meetings as uncovered, and defer creating additional examples until the owner selects a supported slice.

Recommend a future, isolated validation of a synthetic SharePoint task-list-to-weekly-summary flow, with no email/Teams actions. That proposal is not an executed Power Automate test. Microsoft Learn pages were identified but direct retrieval was blocked, so current connector licensing, tenant policy and product behavior remain unverified. Owner decision: whether to retain all six categories as future outcomes, and whether to select this single bounded test slice. No implementation or sprint selection is requested.

## Evidence and source boundary

The canonical guide directory at the repository source revision above contains only [`README.md`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/integration_guides/power_automate/README.md), [`weekly-status-report-flow.md`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/integration_guides/power_automate/weekly-status-report-flow.md), and [`risk-escalation-automation.md`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/integration_guides/power_automate/risk-escalation-automation.md). The current branch's initial planning commit does not change those files.

Repository inspection counted 20 relative Markdown targets in the README: 2 exist and 18 do not. A repository-wide ZIP search found only `tests/fixtures/epic-319/11-mixed-synthetic-package.zip`, an unrelated mixed-package test fixture; it is not a Power Automate flow. No exported flow definition, package manifest, test tenant run, execution log or human acceptance record was found for this guide. A Markdown walkthrough is source documentation, not a deployable flow or execution evidence.

### Related owner decisions and active work

- The native parent relationship is #318, verified through the issue API; #318 retains #59, #60 and #62 as child work. Its current charter is a selected, supported integration slice—not the historical seven-platform synchronization proposal.
- The [v2.5 discovery plan](v2.5-discovery-plan.md) places integration feasibility in the Sprint 6 discovery portfolio, limits concurrent investigations to two, and says availability is unconfirmed. This report does not schedule #59 or mark it sprint-ready.
- Active PRs [#1576](https://github.com/mirichard/pm-tools-templates/pull/1576) (this research), [#1577](https://github.com/mirichard/pm-tools-templates/pull/1577) (Zapier/#60), and [#1578](https://github.com/mirichard/pm-tools-templates/pull/1578) (Excel/#62) are separate, newly opened research threads. Their existence is not product validation. Three draft PRs do not establish that three investigations are formally in progress; the owner should reconcile their sequencing with #1566's two-investigation WIP limit rather than infer staffing. Link sibling reports when available; do not duplicate their platform investigations here.
- Preserve the completed contributor/maintainer walkthrough in [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482); it is not Power Automate validation and must not be repeated. Preserve the accepted source-sufficiency finding in [#1379](https://github.com/mirichard/pm-tools-templates/issues/1379); it does not evidence these flows.

### Capability, evidence and gap matrix

| Retained category | Current source and evidence | Dependencies / material gaps | Disposition |
|---|---|---|---|
| **Status reporting** | [`weekly-status-report-flow.md`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/integration_guides/power_automate/weekly-status-report-flow.md) describes a recurrence, multiple data sources, a report, SharePoint storage and delivery. It is prose with JSON/HTML snippets only; no flow package or run evidence. | The recipe combines Project/Graph, SharePoint, Power BI, Teams, Planner and Outlook without a tested input contract, environment/version, importable definition or reproducible fixture. Its progress calculation does not define behavior for zero tasks; the shown task/status fields and expressions need validation against an actual flow. Requires a tenant-approved test environment, suitable license/connector rights, sample lists and least-privilege connections if later tested. | **REVISE** as clearly unvalidated guidance; scope a one-connector-family synthetic validation slice before retaining broader implementation claims. |
| **Stakeholder notifications** | README links a `stakeholder-notification-system.md` and `task-assignment-notifications.md`, neither exists. The risk guide describes email/Teams outputs but is evidence only for the risk-specific recipe, not a generic notification walkthrough. | No notification recipient contract, consent/recipient controls, routing fixture or delivery evidence. Sending messages to real people is out of scope. | **DEFER** a separate notification example; treat any future delivery as an isolated test sink with explicit recipient and permission controls. |
| **Risk escalation** | [`risk-escalation-automation.md`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/integration_guides/power_automate/risk-escalation-automation.md) describes a SharePoint-triggered flow, schema, score thresholds, notification paths, logs and metrics. It is prose only. | Schema fields define Impact/Probability as choices but the score expression reads numeric `Impact Value`/`Probability Value` fields not defined in that schema. Severity boundaries and escalation rules vary within the document; the trigger fires on create or update without an idempotency/re-notification rule. External delivery, audit and fallback behavior are untested. | **REVISE**; retain the problem example, not its “ensures” or performance claims, until the owner selects a scoring contract and evidence fixture. |
| **Approvals** | README links document, change-request, quality-gate and deliverable-review workflows; all four target files are absent. No approval flow artifact or approval evidence was found. | Needs an owner-approved approver/decision model, delegated permission/licensing review, timeout/escalation behavior, audit and test identities. | **DEFER**; do not imply approval automation is supplied. |
| **Meetings** | README links meeting reminders, scheduling, resource booking, calendar sync and availability; all five targets are absent. The specifically named `meeting-scheduling-automation.md` is not present at this revision. | Calendar/mailbox access, attendee/room permission, time-zone and conflict rules, duplicate invitation behavior and acceptable test recipients are unspecified. | **DEFER**; no meeting guide exists to validate or repair beyond correcting the unsupported link/claim. |
| **Microsoft 365 integration** | README names Microsoft 365 products and connectors; both recipes mention SharePoint/Outlook/Teams and other Microsoft services. This is cross-cutting narrative, not a maintained integration contract or a tested M365 guide. | The README's “Microsoft 365 Business (includes Power Automate)” and “Premium for advanced connectors” statements are too broad to establish rights for a specific flow. Connector tier, plan, environment policy/DLP, identity, permission scope and tenant configuration must be checked for the exact design. | **REVISE** the prerequisite language; retain only a precise, owner-approved connector set after current tenant/licensing review. |

### Unsupported claims requiring explicit disposition

The README calls the material “ready-to-use flows,” advertises importing `.zip` packages, and describes production deployment. It also presents targets including 99%+ flow success, under 1% failure, 50%+ manual-task reduction, 40% faster reporting and 60% faster approvals. The weekly guide gives separate success/delivery KPIs; the risk guide claims delivery, response-time, false-positive, resolution and satisfaction targets. No baseline, measurement method, sample, runtime evidence or acceptance was found. Do not silently carry these forward as achieved results: the owner should mark each as **measured with linked evidence**, **aspirational and explicitly unverified**, or **retired** before revising public claims.

## Proposed synthetic worked example and validation fixture

**Status: proposed fixture only; no flow was provisioned or run.** This deliberately narrows the weekly-report concept to read-only synthetic task data and a single SharePoint report-list upsert. It excludes Graph/Project, email, Teams, Power BI, real people, production data and tenant access. The example is not an exported flow and does not establish that the current walkthrough's expressions are valid.

**Synthetic input rows** (fixed period; statuses are fixture values):

| ProjectKey | TaskKey | Status | DueDate |
|---|---|---|---|
| `SYN-PA-001` | `T-01` | `Complete` | `2026-10-28` |
| `SYN-PA-001` | `T-02` | `In Progress` | `2026-10-30` |
| `SYN-PA-001` | `T-03` | `Not Started` | `2026-11-03` |

**Proposed mapping and expected output:** filter source rows to `ProjectKey=SYN-PA-001`; normalize the three statuses without treating blank/unknown values as complete; calculate `TotalTasks=3`, `CompletedTasks=1`, `CompletionPercent=33.3`; upsert a report record keyed by `(ProjectKey, PeriodEnd=2026-11-01)`. Include the source period and test-run identifier. The unique business key makes repeat runs update the same report record rather than intentionally creating another.

**Proposed prerequisites to confirm before any tenant test:**

- **Connector set:** built-in recurrence plus the SharePoint connector to read the synthetic task list and create/update the synthetic report list. No Outlook, Teams, Power BI, Graph/HTTP, custom or third-party connector is in this slice. Confirm the exact actions and connector classification in the test tenant.
- **License and environment:** an assigned license must authorize the selected scheduled cloud flow, owner/run-only model and connector set. An authorized tenant administrator must confirm current plan entitlements, environment policy/DLP and any organizational restrictions against the current Microsoft licensing/connector documentation. This report does not assert that a particular Microsoft 365 SKU suffices.
- **Identity and permissions:** the connection identity needs read access to only the staging task list and create/edit access to only the staging report list; the flow maker needs permission to create/run the flow in the isolated environment. Confirm the connection owner's lifecycle and run-only-user behavior; do not grant site-wide or tenant-wide rights just for this test.
- **Data and operations:** use only the three synthetic rows and a designated development environment; keep real people, production lists, messages and external systems out. No environment, license, identity or permission was provisioned for this research.

**Candidate test cases — proposed, not executed:**

| Case | Fixture/action | Observable expected result |
|---|---|---|
| Baseline mapping | Three rows above | One report record; total 3, completed 1, percentage 33.3; no message sent. |
| Duplicate/replay | Submit the same project/period input twice | One record at the unique key; second run is recorded as a replay/update, not a second report. |
| Transient read failure | Mock the task-list read to fail once, then succeed on retry | Final output matches baseline; attempt count and recovery are visible; no partial report is marked successful. |
| Permanent read/permission failure | Deny the staging list read | No report record; run is visibly failed with an actionable diagnostic; no success or delivery claim. |
| Output upsert failure/retry | Fail the first staging report-list write, retry with the same business key | At most one report record; final values match baseline; failure and recovery are recorded. |
| Invalid source value | Add a row with blank/unknown status | Validation rejects or quarantines it with a diagnostic; the report does not silently count it as complete. |

**Safe validation sequence if selected:** first run the arithmetic/schema fixture locally; then, only with owner/admin authorization, use an isolated Power Automate development environment and synthetic SharePoint source/output lists. Use a license and connector rights confirmed for that exact tenant/flow, least-privilege test identities, no external recipients and no production data. Capture sanitized flow definition/version, environment and connector classifications, test inputs, expected/actual outputs, run IDs and failed-run details. Exercise replay and induced failures; record the actual at-least-once/retry behavior rather than asserting exactly-once semantics. A designated human owner reviews evidence and accepts or rejects the guide separately. No tenant, license, permission or environment access was available or requested for this research.

**Product-source limitation:** Microsoft Learn search located first-party references for [Power Automate licensing](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs), the [SharePoint connector](https://learn.microsoft.com/en-us/connectors/sharepointonline/), the [Office 365 Outlook connector](https://learn.microsoft.com/en-us/connectors/office365/), [flow error handling](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling) and [concurrency guidance](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/implement-parallel-execution). Direct page retrieval failed in this environment (DNS/address lookup unavailable). Search summaries are not treated here as verified product terms; the current connector tier, licensing rights, permission model, retry/concurrency behavior and tenant policy must be checked against those sources and by an authorized tenant administrator before implementation.

## Conditional readiness / reuse package

This is a bounded option for #59, **not a new issue draft, estimate commitment, sprint selection or authorization to implement**. Reuse #59 under #318; link the sibling investigations (#60/#62) rather than create duplicate platform tasks.

- **User outcome:** a PM can tell which Power Automate material is explanatory, what is actually importable, and what has passed a reproducible synthetic validation.
- **Proposed scope if owner selects it:** correct unsupported README/package claims; retain the weekly-report and risk examples as explicitly unvalidated only if their content is still useful; validate one synthetic SharePoint-to-SharePoint weekly summary; publish input/output mapping, prerequisites, failure semantics and evidence.
- **Exclusions:** creating all 18 absent linked guides; approving or building production flows; premium/custom connectors; live email/Teams/calendar actions; tenant provisioning or new permissions; telemetry; user outreach; changing releases/sprints; closing #59.
- **Observable acceptance if selected:** all six categories have a clear retain/revise/defer disposition; every retained guide link resolves; no ZIP/import/deployment claim remains without a corresponding artifact and import test; the chosen slice has a versioned test fixture and expected output; duplicate/replay, transient retry, permanent permission failure, output failure and invalid input results are recorded from an isolated synthetic test; historical performance claims are measured with evidence or explicitly marked aspirational/retired; owner records human acceptance or remaining gaps.
- **Validation method:** scoped link/artifact audit, deterministic fixture checks, then authorized isolated Power Automate run evidence as described above. Markdown or local arithmetic checks alone do not satisfy runtime validation.
- **Dependencies / owner gaps:** Michael Richard selects whether the six categories remain intended outcomes and chooses the slice; an authorized Microsoft 365/Power Platform tenant administrator confirms current license, connector, DLP and permission requirements; test-environment and test-identity availability are unconfirmed; a maintainer is needed for doc updates. No external connector/licensing verification was possible in this research run.
- **Effort range:** **2–4 person-days, preliminary planning range only**, assuming one standard-connector slice, an already available isolated environment and a maintainer/tenant admin available for review. Excludes environment provisioning, licensing procurement, production rollout, extra connectors and building the 18 missing examples. Actual effort is unconfirmed; do not place it on a sprint from this range.

## Promotion criteria

- **Backlog-ready:** user/problem outcome, six-category inventory, exclusions, one feasible option, dependencies, proposed acceptance/validation and evidence links are recorded. This report supplies research material but the owner decision and source-access gaps remain open.
- **Sprint-ready:** owner-selected leaf scope; named delivery/test owners; confirmed environment, license and permissions; verified connector set; deterministic fixture; failure/retry expectations; estimate confirmed by the delivery owner; dependencies sequenced; human acceptance criteria agreed. These prerequisites are currently missing.
- **Owner-selected:** Michael Richard explicitly records whether to proceed, revise, defer or stop, decides the retained category scope and any performance-claim disposition, and separately confirms capacity/sprint selection if relevant. Assignment, research PR or passing documentation checks is not that decision.

## Executed checks and limits

- Inspected issue #59, its comments, its native parent relationship, #318, #1566, #1482, #1379, relevant active PRs, repository Copilot instructions, the v2.5 discovery plan and the current canonical guide files.
- At source revision `8078fdd24db8e9d274a5922c1db00c051f708663`, verified 20 README Markdown targets, 2 existing target files and 18 missing targets; verified the three canonical files and found no Power Automate ZIP package. The only repository ZIP found is an unrelated #319 synthetic fixture.
- Ran the sample arithmetic as a local inline Python check: the three supplied rows yield 3 total tasks, 1 complete task and 33.3 percent. This checks only the fixture arithmetic, not Power Automate expressions or runtime behavior.
- Ran `python3 check_anchor_links_filtered.py` across 1,385 Markdown files. The report has no broken anchors; the repository-wide scan found 5 broken anchors in the unrelated pre-existing `docs/principles/anti-patterns.md` and 16,329 anchor suggestions. No unrelated file was changed intentionally.
- No Power Automate flow, import, tenant connection, runtime test, user test or human acceptance was performed. Microsoft Learn direct retrieval was blocked; tenant-specific prerequisites and behavior remain unverified.
- No implementation, production integration, permission change, live notification, metric activation, sprint change, acceptance claim or issue closure is made by this report.

## Proposed issue comment (not posted)

> Research is recorded in [PR #1576](https://github.com/mirichard/pm-tools-templates/pull/1576) and `research/issue-59-discovery.md`. At source revision `8078fdd24db8e9d274a5922c1db00c051f708663`, the README has 20 Markdown targets, 2 existing files and 18 missing files; no Power Automate import ZIP or runtime evidence was found. The weekly-status and risk-escalation examples are prose only; the meeting guide is absent. Recommend retaining them only as unvalidated guidance, correcting package/metric claims, and considering one synthetic SharePoint summary test. No test tenant or current licensing/permission verification was available. Issue #59 remains open and unscheduled. Michael Richard's decision is requested on six-category scope and whether to select that slice.

## Four-point disposition

- **Recommended next step:** Michael selects whether to retain the six categories and whether to authorize planning for the single synthetic SharePoint summary slice.
- **Research completed:** current assets, missing links/packages, evidence limits, dependencies and a proposed fixture/test matrix are recorded at the source revision.
- **Remaining gaps:** no importable flow, execution evidence, tenant-verified licensing/permissions, runtime validation or human acceptance.
- **Owner decision required:** category scope and unsupported metric disposition; any test-environment access, delivery estimate and later sprint choice require separate confirmation.
