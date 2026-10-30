# Issue #60 discovery: Zapier guide coverage and validation

**Research date:** 2026-10-30
**Accountable owner:** Michael Richard (@mirichard)
**Disposition:** Research only; #60 remains an unscheduled backlog task under #318. This report is not delivery acceptance.

## Decision brief

Keep #60 as a focused documentation-reconciliation and validation task; do not treat it as a cross-platform integration build. At source revision [`1dc6c67`](https://github.com/mirichard/pm-tools-templates/tree/1dc6c67e61527d6d868613b1d8c48d1d2c34abb8), the maintained Zapier folder contains a general README, a multi-tool project-sync walkthrough, and a time-tracking aggregator. The README advertises many additional examples, including budget monitoring, but those files are absent. The two walkthroughs are prose recipes, not shared/importable Zap artifacts; repository inspection provides no evidence of live Zap execution. Their “ready-to-use,” synchronization, performance, and savings language exceeds the evidence in the files.

Retain the project-sync and time-aggregation topics as explicitly unvalidated guidance; revise the README inventory and unsupported claims; defer any new budget workflow until the owner selects and bounds it. #59 is a sibling of #60 under #318, not a verified prerequisite; the historical Power Automate dependency is not supported by the current task/parent disposition. This does not decide #59’s own work.

The report proposes one synthetic, one-way Asana-task-to-Trello-card fixture with explicit mapping, idempotency expectations, and failure cases. It has not been run. Official Zapier Help Center and pricing sources were not reachable from this environment, so current connector, account-permission, licensing, retry, replay, and task-limit behavior remains to be verified before guide publication. Owner decision: confirm the single supported example and its test/access boundary, or defer validation while retaining the documentation-only repair.

## Evidence and coverage matrix

Repository links below pin the inspected guide revision. **Recipe** means instructional prose only; this inspection found no Zap export/package or execution record.

| Capability | Maintained asset and evidence at inspected revision | Gap / dependency | Disposition |
|---|---|---|---|
| Project sync | [`README.md`](https://github.com/mirichard/pm-tools-templates/blob/1dc6c67e61527d6d868613b1d8c48d1d2c34abb8/integration_guides/zapier_automation/README.md) advertises broad “real-time”/bidirectional sync. [`multi-tool-project-sync.md`](https://github.com/mirichard/pm-tools-templates/blob/1dc6c67e61527d6d868613b1d8c48d1d2c34abb8/integration_guides/zapier_automation/multi-tool-project-sync.md) describes Asana→Trello creation and a separate Trello→Asana status-update recipe. Both are manual recipes; no importable Zap or run evidence was found. | No complete mapping contract or demonstrated loop/duplicate/conflict handling. The create-card recipe does not specify a lookup-before-create for a repeated source task. Product connector events, account authorization, current tier requirements, and transient-failure behavior were not independently verified. | **Retain** a bounded one-way recipe; **revise** “ready-to-use,” “real-time,” bidirectional, and reliability claims unless validated. |
| Data collection | The README lists performance metrics and customer-feedback aggregators; no corresponding maintained files were found in `integration_guides/zapier_automation/`. | No documented source schema, field mapping, output, or validation. A reporting/data-collection service is not part of this issue’s selected slice. | **Defer** unsupported examples; remove or clearly mark absent entries in the README. |
| Notifications | README has generic Asana→Slack and multi-step notification examples. There is no dedicated maintained notification walkthrough in the Zapier folder. These are configuration prose, not shared Zaps or verified sends. | No recipient/channel permission contract, duplicate-notification guard, failure/retry record, or synthetic output fixture. Do not send live notifications for this research. | **Revise** the README to label the sample a manual recipe and not a validated workflow; defer a separate notification build. |
| Budget monitoring | The README links `budget-monitoring-system.md` and separately lists expense tracking and budget-variance examples; the advertised guide file is absent. Folder inspection found no budget guide. | No retained budget workflow, budget/actual schema, threshold rule, sample output, connector or finance-data access decision. | **Defer** creating a budget guide until the owner selects a bounded use case; repair the broken/unsupported README inventory in #60. |
| Time tracking | [`time-tracking-aggregator.md`](https://github.com/mirichard/pm-tools-templates/blob/1dc6c67e61527d6d868613b1d8c48d1d2c34abb8/integration_guides/zapier_automation/time-tracking-aggregator.md) describes Toggl/Harvest/Clockify input and Sheets/Airtable/Excel outputs. It includes a Toggl→Sheets recipe, but no importable Zap or execution evidence. | Source-specific schemas, duration/time-zone/currency handling, access scopes, deduplication, partial-failure recovery, and rate calculations are not established. Claims such as “70% reduction,” “95% reduction in errors,” and savings/ROI amounts have no measurement method or evidence in the guide. | **Retain** as unvalidated instructional material; **revise** unsupported quantified benefits and add limitations or evidence; defer live validation until authorized access and a test environment exist. |

### Source and governance notes

- The inspected tree was clean at `1dc6c67e61527d6d868613b1d8c48d1d2c34abb8`; the Zapier directory contained only the three linked Markdown files. Repository-wide Markdown search found no additional Zapier guide copies. No `.zap`/import package or execution evidence was identified in the inspected assets.
- Issue #60 has native parent #318; #318 lists #59 and #60 as sibling tasks. No native #59→#60 dependency is recorded. #60’s historical “Power Automate templates completion” dependency is in its superseded proposal, not its current acceptance criteria. The current #318 charter calls for selecting evidence-backed slices, not completing all integrations as a single platform.
- Related draft PRs at review: [#1577](https://github.com/mirichard/pm-tools-templates/pull/1577) for #60 and [#1576](https://github.com/mirichard/pm-tools-templates/pull/1576) for sibling #59. They were open drafts at inspection; they are not validation evidence or accepted delivery.
- The [v2.5 discovery plan](v2.5-discovery-plan.md) places #318 in a Sprint 6 discovery portfolio and explicitly says planning is not a release commitment. It requires owner disposition and confirmed capacity before selection. It preserves completed #1482 validation and #1379 source-sufficiency evidence; neither is repeated or reinterpreted here. #1482 is completed, while #1379’s accepted source sufficiency does not imply unrelated Zapier evidence or acceptance.
- Product sources attempted on 2026-10-30: [Zapier Help Center](https://help.zapier.com/hc/en-us/) and [Zapier pricing](https://zapier.com/pricing). DNS resolution failed in this environment. No product-specific plan limits, connector availability, required permission scopes, task semantics, or retry/replay claims are inferred from those sources. Recheck the relevant official app/help pages when external access is available.
- **PR metadata correction still required:** the existing draft PR #1577 has an agent-generated `Fixes #60` suffix despite the requested non-closing reference. The available progress tool updates the checklist but does not remove that suffix, and no PR-body editing operation is available in this session. Before any merge, a maintainer must replace the closing suffix so the PR references #60 with `Refs #60` only. The PR remains open and draft; it has not been merged or auto-merged.

## Proposed synthetic validation fixture — not executed

This fixture is a proposal for a bounded, one-way guide example, not a claim that the listed connector events or mappings are available in a particular Zapier plan. Use only a designated test workspace and synthetic data if an owner later authorizes execution.

**Use case:** copy one eligible Asana task to one Trello card. No reverse sync, real project data, or notification.

**Synthetic input**

```yaml
source_app: Asana
source_project_id: proj_SYN_01
source_task_id: task_SYN_104
name: Prepare sample status report
notes: Synthetic fixture only
status: in_progress
due_date: 2026-11-06
assignee_email: person@example.invalid
```

**Proposed mapping and expected result**

| Source | Target | Mapping rule |
|---|---|---|
| `source_task_id` | Mapping table `source_id` | Store with fixed source-app key (`asana`) and returned Trello card ID; use this key for lookup before creating. |
| `name` | Trello card name | Direct text mapping; reject/route for review if blank. |
| `notes` | Trello card description | Direct text mapping, with a visible source reference such as `Source: Asana task_SYN_104`. |
| `status` | Trello list | Proposed explicit translation: `in_progress` → `Doing`; confirm actual source values and target list names before configuration. |
| `due_date` | Trello due date | Preserve calendar date `2026-11-06`; verify connector timezone/date behavior before publication. |
| `assignee_email` | Trello member | Do not map automatically unless a unique authorized target member match is confirmed; otherwise omit and record as unresolved. |

**Expected synthetic output**: one Trello card named `Prepare sample status report`, in the test board’s `Doing` list, due `2026-11-06`, with the synthetic description and a mapping row `(asana, task_SYN_104, <created-card-id>)`. The placeholder target ID is deliberately not fabricated.

**Proposed checks (not executed):**

1. **First eligible event:** create one card and one mapping row; compare every mapped field to the expected output.
2. **Duplicate/replayed event:** lookup `(asana, task_SYN_104)` first; update the mapped card or safely skip—never create a second card. If the chosen platform actions cannot enforce this, document that limitation rather than promising idempotency.
3. **Required field absent / target authorization failure:** do not report success; capture the failed step and a safe manual correction/retry path. Do not silently drop the record.
4. **Partial failure (card created, mapping write failed) or ambiguous timeout:** do not blindly replay a create action. Inspect the test target for the source reference, reconcile the mapping, then retry only after confirming the prior side effect. Record the recovery and resulting single-card count.
5. **Transient connector failure:** verify current official retry/replay controls and observed run history in the authorized test environment before documenting any retry promise. No fixed retry count is asserted here.

**Prerequisites to verify before any execution:** owner-approved test boundary; test accounts/workspaces for both apps; supported current Zapier trigger/action for the chosen app accounts; minimum required app permissions and account ownership; current Zapier plan/usage entitlement for the selected steps; a test board/list; and a controlled mapping store. Do not connect accounts or enable a Zap as part of this discovery.

**Execution and acceptance status:** no Zap was created or run, no account was connected, and no notification was sent. Repository inspection is the only completed evidence. The checks above are proposed test cases; human review of sample values, account permissions, recovery behavior, and guide usefulness remains a separate owner acceptance decision.

## Conditional readiness / reuse package (no duplicate issue proposed)

Reuse #60’s existing acceptance criteria and #1577’s focused research PR; do not create a second delivery issue for the same reconciliation.

- **User outcome:** a project manager can tell which Zapier examples are actually maintained and reproduce one explicitly bounded example without mistaking prose for an importable or verified integration.
- **Scope:** reconcile the README’s inventory/claims against maintained assets; choose whether to retain one-way project sync and time aggregation; document one supported example’s input/output/mappings and limitations; add a proposed or authorized synthetic validation record. Record disposition of budget and absent examples.
- **Exclusions:** building a cross-platform service; creating or publishing shared Zaps; live account connections, real notifications, production data, new permissions, telemetry, user outreach, or claims of efficiency/accuracy without measurements.
- **Observable acceptance:** links resolve to maintained files or are removed/marked deferred; each retained example is labeled “manual recipe,” “importable artifact,” or “executed/verified” according to evidence; no unsupported ready-to-use/live/bidirectional claim remains; one bounded fixture contains exact synthetic input, expected output, field map, prerequisites, duplicate/retry/partial-failure disposition; any unrun checks and product-access limitations are explicit.
- **Validation method:** scoped Markdown link/anchor check plus file-presence review; if later authorized, execute only the proposed synthetic case in a test workspace, save non-sensitive expected/actual results and run-history evidence, and obtain owner review. A passing documentation check does not establish Zap execution or user acceptance.
- **Dependencies / owner gaps:** Michael Richard selects the retained example and determines whether a test workspace/account boundary is available and authorized. Current official connector, permission, plan and failure/replay details are not verified. #59 is not a prerequisite; coordinate cross-issue wording if useful, but do not wait for or duplicate its outcome.
- **Effort scenario (not confirmed):** approximately **1–2 person-days** for README/guide reconciliation and synthetic fixture documentation, assuming no new workflow artifact or external research access is required. Add **1–3 person-days** only if the owner authorizes a test workspace and requires a recorded execution/recovery pass; range assumes one source/target pair and excludes account provisioning, licensing, broader user testing, and additional examples. These are planning assumptions, not an estimate or schedule approved by the owner.

### Promotion criteria

- **Backlog-ready:** #60 is already an unscheduled backlog task with a bounded current acceptance list. Keep it there; the report supplies evidence and unresolved choices, not a stage change.
- **Sprint-ready:** only after the owner selects the example/scope; a named delivery and validation owner, confirmed account/test permissions, current connector/licensing prerequisites, testable acceptance, failure/recovery method, and an owner-reviewed estimate are recorded. Resolve or explicitly sequence dependencies and confirm capacity.
- **Owner-selected:** requires Michael Richard’s explicit prioritization and selection decision. Neither this report, a PR, nor the historical Sprint 6 planning reference grants that approval.

## Four-point closeout

- **Recommended next step:** owner selects whether to retain the proposed one-way Asana→Trello fixture and whether test execution is authorized.
- **Research completed:** maintained-asset inventory, issue hierarchy/dependency review, source-revision assessment, claims/gaps, and a synthetic validation proposal.
- **Remaining gaps:** external official product details, authorized test access, and any executed Zap/run or human acceptance evidence.
- **Owner decision required:** confirm scope and test boundary; keep #60 unscheduled until promotion prerequisites are met.
