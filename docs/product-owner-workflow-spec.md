# Product Owner workflow — implementation specification

**Status:** Proposed implementation; not activated. **Prepared:** 09/28/2026.
**Decision authority:** repo owner acting as Product Owner.
**Benchmark:** [Approved product goal and candidate rubric](../backlog/product-goal.md).

## Purpose and boundaries

Give the Product Owner one place to see new opportunities, actions requiring attention, and decisions needed from research through release and outcome review. Preserve a clear distinction between evidence, priority, authorization, and delivery.

This specification authorizes no new product development, notification recipients, or release. The OCM example is hypothetical; no findings, assignments, deadlines, or scores have been fabricated. Acceptance of the design must precede live notification activation.

## Documented basis versus repository choices

| Reference | Practice used | Repository adaptation |
| --- | --- | --- |
| [Atlassian worked discovery guide](https://www.atlassian.com/software/jira/product-discovery/guides/getting-started/quick-start) | Capture ideas, attach evidence, compare, communicate roadmap, link delivery | GitHub issues and Projects supply the records and views; no Jira migration |
| [GitLab Product Processes](https://handbook.gitlab.com/handbook/product/product-processes/) | Ordered backlog, capacity discussion, documented planning changes | Product Owner decisions remain separate from contributor estimates and sprint selection |
| [GOV.UK discovery](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works) and [success measurement](https://www.gov.uk/service-manual/service-standard/point-10-define-success-publish-performance-data) | Investigate the problem and evaluate outcomes | Proportionate research and an assigned outcome review; no government compliance claim |
| [GitHub Projects practices](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/best-practices-for-projects) | Responsibilities, sub-issues, dependencies, views and one source of truth | One primary product record, related research/delivery work, one attention queue |

The stages, fields, reminder cadence, and permission rules below are proposed local design choices. None of these sources prescribes this exact configuration.

## 1. Entry experience

Before entry, the README, contribution guide and issue chooser link to a short workflow guide and the OCM example. During entry, the form explains why each field is needed and shows a placeholder example that is not submitted as evidence.

Revise the existing Epic form to support uncommitted opportunities as well as coordinated delivery. Keep the general Product idea form for smaller or uncertain proposals.

| Epic form input | Required at intake | Guidance / OCM example |
| --- | --- | --- |
| Problem and intended users | Yes | Describe the observation, not a presumed solution. PMs may omit adoption activities from plans. |
| Goal contribution | Yes | Explain expected contribution to capability, project/program success or meaningful outcomes. This is a hypothesis until supported. |
| Evidence available | Yes; “not yet collected” allowed | Link the audit or experience; distinguish personal observation from representative research. |
| Existing resources / related issues | Yes; “not yet checked” allowed | Link known OCM resources or state that inventory is needed. |
| Possible scope and exclusions | Optional | Explore change-planning support; do not presume an entire tool suite. |
| Timing or constraints | Optional | Identify actual commitments and dependencies; no invented deadline. |

Remove required final acceptance criteria and child-issue lists from uncommitted epic intake. Add them during delivery refinement. Preserve existing issue-type validation: one type label; an epic may be in discovery. Amend the issue policy's statement that Epic forms are only for planned work. Existing forms continue working; do not bulk-reclassify issues.

Submission creates a normal issue, with type:epic and needs-triage. General ideas retain type:candidate. Both enter the same intake view. No author receives decision authority through submission.

## 2. Records and fields

Project 11 is the primary Product Roadmap record. Projects 12 (delivery) and 13 (research) remain execution views where relevant. Reuse the same issue; do not clone it to change stages.

| Data | Canonical location | Editing rule |
| --- | --- | --- |
| Problem, rubric, evidence, limitations, current summary | Issue body | Maintained by the responsible contributor; preserve links to dated decisions |
| Decision and rationale | Dated issue comment | Authorized decision-maker posts it; amendments supersede rather than erase decisions |
| Next-action owner | Issue assignee | One accountable assignee for managed work; other contributors named in body |
| Product stage | New Project 11 single-select | Values below; changes requiring authorization need a decision link |
| Next action | New Project 11 text | Concrete action, or linked child action; not “follow up” without a subject |
| Review date | New Project 11 date | Explicitly selected; YYYY-MM-DD storage, MM/DD/YYYY display in guidance |
| Decision record | New Project 11 text | URL of latest applicable decision comment |
| Attention | New Project 11 single-select, automation-owned | Configuration error / Needs owner or date / Decision needed / Due / Clear |
| Readiness, Last reviewed | Existing fields | Readiness concerns selection; Last reviewed changes only after an actual human review |
| Outcome, Horizon | Existing fields | Outcome is a contribution mapping; horizon records planning, not authorization |
| Sprint, delivery Status, release milestone | Existing delivery records | Selected child work uses actual capacity and release scope; no automatic commitment |

Product-stage values: Awaiting triage; Research; Decision required; Development selected; Delivery; Released; Outcome review; Deferred; Stopped; Complete.

Only candidate epics and candidate issues participate by default. Linked research, delivery, release-readiness and outcome-review issues may be enrolled for attention tracking without becoming new product candidates. Managed child actions need owner, next action and review date, but no product-stage value.

Do not mirror editable stage/date fields into multiple Projects. The issue body may link to Project 11. Stage and delivery Status have different meanings: a merged child does not mark an epic Released or Complete.

## 3. Views and Product Owner actions

| View | Contents and presentation | User action |
| --- | --- | --- |
| PO attention | Managed items whose computed Attention is not Clear; grouped by Attention, ordered by review date | Open issue, act, record decision or assign action |
| Intake | Candidates at Awaiting triage, oldest first | Check duplication/scope and decide research, direct bounded development, clarification, deferral or stop |
| Research | Candidates at Research plus linked investigations | Inspect next actions and findings; preparer signals Decision required |
| Comparison | Decision required and Development selected candidates; show Outcome, Stage, owner, Next action, Decision record | Open rubric summaries and record selection/order |
| Delivery | Existing sprint board with native child links and PRs | Agree sprint scope with contributors and review acceptance |
| Outcome reviews | Released/Outcome review candidates and linked review tasks | Review benefits evidence, limitations and next investment |

PO attention intentionally combines decisions for the Product Owner and escalations involving contributors. It is not a claim that all listed actions belong to the Product Owner.

Do not create a composite score yet. The approved rubric supports evidence comparison but no numerical model or weights have been agreed. Add no fake zeroes for unknowns. Research and development investments must be compared separately. Manual backlog order is the Product Owner's decision, not a calculated evidence score.

## 4. Decisions and transitions

Use this decision comment structure:
- Decision: research / develop / further evidence / defer / stop / accept / release / complete.
- Scope and evidence: precise links, uncertainty and alternatives considered.
- Rationale: evidence-based assessment and any strategic/commitment considerations, distinguished.
- Next action: action, owner, review date or dated dependency check.
- Authorization limits: what is and is not selected.

| Transition | Required record and authority |
| --- | --- |
| New -> Awaiting triage | Automatic capture only; no approval |
| Triage -> Research | Product Owner decision naming question, effort limit and research child/owner |
| Triage -> Development selected | Product Owner decision with supported bounded scope; investigation may be unnecessary for well-understood work, but rationale is required |
| Research -> Decision required | Preparer links findings and incomplete questions; this requests a decision, not approval |
| Decision required -> Research | Product Owner identifies specific further evidence and bounded work |
| Decision required -> Development selected | Product Owner records assessment, selected scope, acceptance measures, effort/dependencies |
| Development selected -> Delivery | Child work refined and contributors agree capacity/sprint scope; existing engineering gates apply |
| Delivery -> Released | Accepted included scope, release authorization by repo owner, and verified published version/tag URL |
| Released -> Outcome review | Named reviewer, agreed measure and review date/trigger; plan this before release |
| Outcome review -> Complete | Product Owner records results/limitations and disposition of residual scope |
| Any active stage -> Deferred / Stopped | Product Owner rationale; Deferred requires revisit trigger plus review date; Stopped closes as not planned |
| Deferred -> appropriate active stage | New Product Owner decision; no automatic restart on date alone |

An inconclusive outcome review is a valid recorded result, not a successful-benefit claim. Delivery issues can close with acceptance while a separate outcome-review issue remains open. Parent closure requires explicit disposition of residual work.

## 5. Routing, reminders and access

Implement in a repository script plus event and scheduled GitHub Actions, reusing existing credentials and automation where verified compatible. Read paginated issues, Project items and fields. Resolve field IDs from a checked configuration, not names guessed on each mutation.

- Issue opened/reopened/labeled events enqueue eligible records idempotently. Default-stage assignment applies only to new records; reopening requires triage, not restoration of an old approval.
- Manual workflow dispatch supports preview/reconcile. A daily sweep catches missed events and Project field edits; do not assume custom-field edits trigger repository issue events.
- Proposed schedule: daily check at 14:17 UTC, weekly digest Monday in that run. This is a best-effort UTC schedule, not a guaranteed local-time notification.
- Use America/New_York to compare date-only review dates. A due date marks an action due; it is not a deadline inferred from issue age.
- On first due detection, post one bot reminder to the owner. Dedupe by issue, owner, next-action text and review date using a hidden marker in the bot comment. Read existing markers before retrying.
- Weekly digest posts at most one comment per ISO week to a dedicated operational tracking issue. Group intake, decisions, due/overdue actions, and configuration gaps; mention the configured Product Owner once. Include links and concrete actions.
- Missing owner/date appears as Needs owner or date, never as Clear. Unassigned intake is directed to the configured triage owner, without assigning product delivery responsibility.
- Decision required appears immediately when its stage is set; notification arrives on the next event/sweep. During normal human review, a manual reconcile can refresh Attention.
- Routine comments do not update review dates or erase overdue status. Rescheduling requires a dated reason. Deferred/blocked work has a dated check; the system prompts, not restarts.
- Use one lock per managed issue, reread before writing, and avoid overwriting concurrent human changes. Partial failures must be reported and retried without duplicate items/comments.

Validate the actor and decision link against explicitly configured Product Owner/release-authority accounts before treating an authorization as valid. A field edit or checkbox is not approval. Invalid links or unauthorized transitions produce Configuration error attention; do not advance downstream work. Preserve the last valid decision.

GitHub Project editing is not a hard approval barrier. This design detects invalid transitions; existing branch/release controls remain authoritative. Contributors may edit evidence but cannot authorize themselves through issue text.

Project 11 is user-owned: verify credential access with read and reversible test mutations. Do not assume the repository GITHUB_TOKEN has Projects access. Use an approved credential supporting the required project/issue permissions; fail visibly if unavailable. Never execute submitted issue content as code. Dry-run mode performs no writes or mentions. Default live reminders off until recipients and acceptance are confirmed.

References: [Projects API and authentication](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects), [Actions events](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

## 6. OCM walkthrough and acceptance scenarios

Fictional test data only. Use a controlled test issue labelled as a fixture; no actual OCM epic or third-party assignment is authorized here.

| Scenario / action | Expected visible result |
| --- | --- |
| Submit OCM opportunity through form | Required guidance is clear; one issue and one primary Project item; Awaiting triage; no sprint/milestone |
| Leave owner/date unset | PO attention shows Needs owner or date; no invented owner or overdue date |
| PO authorizes OCM inventory/research | Decision URL preserved; linked research question and effort limit; Research stage |
| Research date passes | One reminder to assigned test owner; weekly digest includes unresolved action |
| Repeat the sweep / retry after failure | No duplicate reminder or Project item |
| Add ordinary comment | Original review date and due state retained |
| Research returns inconclusive findings | Decision required with unknowns; no score of zero or automatic development |
| PO defers pending practitioner access | Rationale and trigger retained; dated check; no sprint; no automatic restart |
| PO approves a worksheet/example slice | Development selected with scoped acceptance; rest of epic uncommitted |
| Contributor or bot imitates approval | Authorization rejected; Configuration error; no downstream transition |
| Contributors agree sprint scope | Selected child stories appear in delivery sprint; epic not treated as wholly committed |
| PR merges but acceptance/release incomplete | No automatic product Released/Complete state |
| Repo owner publishes accepted scope | Release/tag link retained; outcome-review action remains visible |
| Delivery child closes while outcome review remains open | Closed child leaves active reminders; parent and review remain discoverable |
| Project credential/API fails or pages exceed first page | Visible workflow failure and retry; no silent successful reconciliation |

Specification walkthrough result: each scenario has a defined action and expected disposition. These are acceptance cases, not executed UAT or automated test results.

## 7. Implementation and rollout

1. Inventory live Project field IDs, active workflows, credentials, recipients, and overlapping reminders; record a pre-change snapshot. No silent migration of existing candidates.
2. Implement form guidance, issue policy correction, and a concise PO operating guide.
3. Implement field/view setup with preview and idempotent reconciliation; avoid competing Readiness/Stage automations.
4. Implement routing, decision validation and reminders with tests for the scenarios above, including pagination, concurrency, dates and permissions.
5. Run fixtures with reminders disabled; then a controlled notification trial using confirmed recipients. Capture screenshots and run links.
6. Repo owner accepts intake, research, deferral, decision and delivery-handoff behavior. Activate only the accepted scope.
7. Migrate existing items through explicit review; do not fabricate past approvals, dates or evidence.

Rollback: disable mutation/reminder workflows and retain issues, decisions and fields; provide manual PO views and an unresolved-action report. No deletion of historical records.

Outstanding before live activation: field/credential inventory, configured authority accounts and reminder recipients, cadence acceptance, implementation, tests and UAT. Numerical scoring remains a separate decision and is not represented as delivered by this workflow.
