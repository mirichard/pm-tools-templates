# Issue #376 discovery — Slack/Teams update bot

**Research date:** 2026-10-30

**Decision owner:** Michael Richard (`@mirichard`)

**Status:** Research only; no platform, delivery, release, permission, or sprint selection

**Repository evidence baseline:** `8078fdd24db8e9d274a5922c1db00c051f708663` (PR #1608 base)

## Decision brief

Do not select or build a Slack or Teams bot yet. Retain the user outcome—submit a project update in a familiar workflow—but revise the historical “automatically collect” scope to require an explicit user action, extraction preview, and user confirmation. Use GitHub-native structured submission as the low-permission comparison/control for the update contract; consider a single-platform, mention-only adapter only after #368 defines the accepted fields, provenance, and conflict/staleness behavior and #377 owns any reminder policy. Never read or analyze ambient conversation history.

The base revision contains maintained status-report templates and an executive-report JSON schema, but not a chat collector or a complete update contract. GitHub Projects supports custom fields and status updates. Official platform references describe Slack Events API/scopes and Teams’ mention-only default versus broader RSC permissions; Slack and Microsoft documentation hosts could not be fetched directly in this runtime, so exact scope, consent, retry, and tenant behavior must be rechecked before implementation.

No evidence here supports 90% adoption, extraction accuracy, response improvement, or communications analytics. These remain unmeasured historical targets, not acceptance evidence. The owner must choose whether to first validate the GitHub-native control or authorize a narrowly scoped Slack/Teams option for future refinement. This recommendation does not make #376 backlog-ready or sprint-ready.

## Evidence and capability/gap matrix

Repository links below are pinned to base revision `8078fdd24db8e9d274a5922c1db00c051f708663`; blob hashes identify the corresponding Git tree entries where useful. “Disposition” is a research recommendation, not an owner decision.

| Capability / claim | Evidence and revision | Gap, dependency, and disposition |
|---|---|---|
| Structured status content | The catalog identifies [`domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md) as canonical (blob `1a72c30c6a10629f958ba0fd93fa224cb5c07df9`). The maintained [`executive_status_report.schema.json`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/schemas/web-mvp/executive_status_report.schema.json) (blob `80bc7f5ce7672349e5bd49c7e1243ddfa96964db`) requires `reportingPeriod` and `overallHealth`; it also defines schedule, budget, scope, highlights, risks, and next steps. | These are report artifacts, not the #368 intake contract: no source provenance, submitter confirmation, duplicate/stale/conflict policy, or conversation adapter is established by them. **Retain** as reusable vocabulary; **revise** only through #368’s owner-reviewed contract. |
| Execution reporting | The catalog’s maintained [`Project Execution Status Report Template`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/domains/delivery/templates/traditional/Traditional/Process_Groups/Executing/project_execution_status_report_template.md) (blob `b2f70bb1a831463a4d0cd3cf19164c6b0559f710`) covers progress, deliverables, risks/issues, and next-period objectives. | It is a broad worksheet, not evidence of automatic collection. Generated `docs/site/dist` and alternate paths are not separate capabilities. **Retain** as reference; **defer** automatic extraction. |
| GitHub-native control | GitHub’s [Projects overview](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) and [Projects API guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects) (both read 2026-10-30) document custom fields, status updates, issue/PR-linked project data, built-in workflows, and GraphQL/Actions automation. The API guide specifies `read:project` for queries and `project` for queries/mutations; a GitHub App creating a project linked to a repository may also need that repository’s `Contents` permission. The [GraphQL Projects reference](https://docs.github.com/en/graphql/reference/projects) documents `createProjectV2StatusUpdate`. The repository has general task/epic/story issue forms (for example [`task.yml`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/.github/ISSUE_TEMPLATE/task.yml), blob `a8d01077a575bdf90aeb499ebc4454466e243915`), but no dedicated project-update form was found. | A human-authored structured GitHub update requires no Slack/Teams installation or conversation-history permission. If API automation is later chosen, scope project access to only what the selected operation needs; do not grant the broader mutation scope to a read-only collector. **Retain** as the comparison/control; **revise** the form fields only after #368 settles the contract. |
| Slack interaction | Official starting points: [Events API](https://api.slack.com/apis/connections/events-api), [OAuth scopes](https://api.slack.com/scopes), and [`app_mention`](https://api.slack.com/events/app_mention). Search results surfaced Slack’s `app_mentions:read` for mention events and `chat:write` for a bot response; broad history scopes such as `channels:history`, `groups:history`, and `im:history` are not proposed. | Direct fetch of Slack documentation failed. These scope names and the current installation/consent process are **provisional** until checked against Slack’s live docs and workspace policy. **Revise** the broad “conversational AI” requirement to an explicit mention/command; **defer** history access and ambient monitoring. |
| Teams interaction | Official references: [channel and group conversations](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/channel-and-group-conversations) and [resource-specific consent (RSC)](https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/rsc/resource-specific-consent). Microsoft’s search-indexed docs say bots receive direct @mentions by default in group/channel conversations; reading all messages requires broader resource-specific permissions such as `ChannelMessage.Read.Group` / `ChatMessage.Read.Chat` and consent in the installed conversation. | Direct fetch of Microsoft Learn failed; recheck current manifest requirements, consent role, and channel limitations before a build. **Retain** mention-only as a candidate; **defer/reject for this scope** all-message RSC access. |
| Conversation context and extraction | No maintained repository asset demonstrates conversational extraction. The relevant official starting points are Slack’s Events API and Teams’ mention/RSC docs above. | Limit input to the single user-invoked message; do not fetch thread/history or infer role/project from unrelated communications. Show extracted fields with source spans; allow edit, confirm, or reject before handoff. Ask the user about missing/ambiguous fields. **Revise** NLP accuracy claims into fixture-based behavior tests; no training or silent extraction. |
| Duplicate events and retries | Slack’s official Events API reference is the primary source for delivery/retry details; Teams’ [rate-limit guidance](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/how-to/rate-limit) is the relevant official starting point for throttling. Exact current retry timings/limits were not independently verified because the documentation hosts were inaccessible. | Any future implementation should persist an idempotency key from the platform delivery/activity ID, acknowledge promptly, and make retries safe; do not deduplicate distinct user submissions by text alone. Respect applicable retry/throttle instructions (including `Retry-After` when returned), bound retries, and expose terminal failures for human review. **Retain** these as proposed safeguards; verify platform-specific mechanics before acceptance. |
| Schedules, quiet hours, escalation | The historical epic mixes update collection, configurable schedules, and escalation. Current discovery plan sequences status collection with #368 and deterministic reminders with #377. | #376 should be user-initiated/respond-only; it must not schedule prompts, escalate, or message missing reporters. If any future reminder is selected, #377 must define recipient consent, time zone, quiet hours, cancellation, deduplication, and suppression first. **Defer** prompts/escalation to #377. |
| Aggregation and data consistency | #368’s active research PR [#1600](https://github.com/mirichard/pm-tools-templates/pull/1600) investigates required fields, provenance, stale/missing/conflicting updates, and duplicates; this is ongoing work, not an approved contract. #377’s active research PR [#1609](https://github.com/mirichard/pm-tools-templates/pull/1609) investigates reminder rules. | Handoff only a user-confirmed payload plus minimal source reference after #368 defines its contract. Do not duplicate collector or reminder tasks. **Retain** the dependency; **defer** implementation pending both reports and owner decisions. |
| Adoption, accuracy, efficiency, analytics | The historical #376 text claims 90% pilot adoption, extraction accuracy, improved response, and communication-pattern analytics. No measurement plan, pilot data, approved cohort, or validated result was located in the issue/repository evidence reviewed. | Preserve as historical hypotheses, not acceptance criteria. Any later adoption/response/accuracy measure needs an owner-approved denominator, time window, opt-out treatment, baseline, test set/adjudication, and privacy review. **Revise** to observable fixture behavior; **defer** telemetry and communication-pattern analytics. |

### Context and sequencing

- #376 has no issue comments and no native children. Its verified parent is #365; #368, #371, and #377 are sibling epics under #365. The issue read-back records Michael Richard and Copilot as co-assignees; Michael remains decision owner.
- The controlling `research/v2.5-discovery-plan.md` schedules #368/#369/#370/#371/#377 in Sprint 5 and #376 in Sprint 6 (December 21, 2026–January 10, 2027); this is a discovery sequence, not a delivery commitment. The owner separately authorized this first research round on October 30. Portfolio PR #1597 is synthesizing WIP/capacity, so this report does not change the sequence or claim capacity.
- Related WIP reports: [#1600 for #368](https://github.com/mirichard/pm-tools-templates/pull/1600), [#1609 for #377](https://github.com/mirichard/pm-tools-templates/pull/1609), [#1603 for #371](https://github.com/mirichard/pm-tools-templates/pull/1603), [#1598 for #365](https://github.com/mirichard/pm-tools-templates/pull/1598), and [#1597 for #1566](https://github.com/mirichard/pm-tools-templates/pull/1597). They are open research work, not delivery evidence or approvals.
- Preserve closed #1482 as completed; no repeat contributor walkthrough is required. Preserve #1379’s accepted source-sufficiency finding; it is unrelated to chat permissions and does not authorize outreach, telemetry, or an experiment.

## Proposed synthetic validation fixture (not executed)

**Synthetic input; never send to a live bot or platform:**

> “The billing export is 2 of 5 complete. The vendor API change blocks the remaining three; I expect a workaround by Friday.”

| Proposed step | Expected observable evidence |
|---|---|
| Invocation/context boundary | A future bot receives only this explicitly submitted message (for Slack, a user invocation such as an @mention; for Teams, a direct interaction/@mention). No thread, channel history, private messages, or participant analytics are read. |
| Candidate extraction | Preview `progress: 2 of 5`; `blocker: vendor API change blocks remaining three`; `next update/forecast: workaround by Friday`. Each proposed value is linked to its exact text span. Do not infer overall health, owner, or a calendar date. |
| Confirmation | The submitter can edit, confirm, or reject. No data reaches #368 unless confirmed; ambiguity prompts a clarification instead of an inferred value. |
| Provenance/handoff | On confirmation, pass only the #368-approved fields, confirmation state, timestamp, and the minimum source reference required by its contract. The #368 contract is not yet available; this payload is illustrative, not schema. |
| Duplicate/retry case | Re-delivering the same platform activity/event ID creates no second update and returns the same safe acknowledgement. A distinct event with identical text remains a distinct submission unless a human cancels it. |
| Quiet-hours case | No prompt or escalation is generated. Any future reminder policy belongs to #377 and needs explicit owner-approved timezone/quiet-hour/cancellation rules. |
| Failure case | A transient handoff failure is retried idempotently within a bounded policy; terminal failure is surfaced for human recovery, not silently discarded or repeatedly messaged. Platform-specific retry timing remains unverified. |

**Executed checks:** repository source/catalog inspection at the pinned base revision; issue/PR/native-parent read-backs; GitHub Projects documentation fetched; Slack/Microsoft documentation links and indexed search summaries reviewed with direct-fetch limitations recorded.

**Not executed:** bot installation, API calls, event delivery, extraction, permissions/consent verification in a tenant/workspace, user testing, or measurement.

**Human acceptance:** none. The owner must approve a platform and acceptance fixtures before implementation.

## Conditional candidate issue drafts

These are mutually exclusive/sequenceable proposals, not created issues or owner-approved estimates. Create at most the selected one after the indicated dependencies are resolved. Ranges are rough research estimates in person-days, not staffing commitments; they assume one engineer, existing hosting/tooling, and exclude platform approval delays, security review, production rollout, and user-pilot costs.

### Option A — GitHub-native structured update baseline (recommended first control)

- **User outcome:** A project contributor can submit an update against one selected project using a structured GitHub form, without installing a chat bot.
- **Scope:** One repository/project; fields and provenance exactly as approved in #368; manual submission and native GitHub record only. No chat parsing, scheduled prompting, reminders, API integration, or analytics.
- **Acceptance:** (1) A dedicated form captures the #368-approved required fields and rejects missing required values. (2) A synthetic fixture covers a complete, incomplete, stale, and conflicting update as specified by #368. (3) The resulting record retains only the agreed author/time/source provenance. (4) No external message or update is sent automatically.
- **Validation:** Form/schema review plus synthetic submissions and comparison to the approved #368 contract; human maintainer confirms field interpretation.
- **Dependencies/owner gaps:** #368 report and owner selection of fields; identify the target repository/project and the person who will maintain the form.
- **Illustrative effort:** 2–4 person-days if the existing GitHub form/project surfaces suffice and no API automation is needed; re-estimate if authentication or cross-repository aggregation is required.

### Option B — Slack mention-only adapter (defer pending explicit selection)

- **User outcome:** A contributor can explicitly invoke a Slack app and confirm a proposed update before it enters the #368 contract.
- **Scope:** One workspace and one approved interaction surface; only the invoking message; provisional least privilege `app_mentions:read` plus `chat:write` if replies are needed. Do not request channel/group/DM history. No scheduled prompts, analytics, or Teams parity.
- **Acceptance:** (1) No ambient messages are ingested. (2) Preview shows source spans and allows edit/confirm/reject. (3) Unconfirmed content never reaches #368. (4) Replayed event IDs do not create duplicate submissions. (5) transient failures do not lose confirmed submissions or create duplicates; exact retry behavior is verified against the live Slack docs.
- **Validation:** Synthetic event fixtures for mention, missing/ambiguous values, confirmation, duplicate delivery, retry, and failed handoff; workspace-admin consent and scope review before any installation.
- **Dependencies/owner gaps:** #368 schema; owner selection; Slack workspace/app approval; current scope, signing, retry, retention, and hosting review.
- **Illustrative effort:** 5–10 person-days assuming one invocation workflow, existing hosting/identity, and no broad history access. Re-estimate after official API verification.

### Option C — Teams mention-only adapter (defer; do not promise parity)

- **User outcome:** A contributor can explicitly invoke a Teams bot and confirm a proposed update before it enters the #368 contract.
- **Scope:** One approved tenant and one-to-one/direct or @mention interaction; one submitted message only; no RSC permissions to read all messages, no scheduled prompts, no cross-platform parity, and no analytics.
- **Acceptance:** (1) The bot acts only on a user-initiated interaction/@mention. (2) A preview supports edit/confirm/reject and blocks unconfirmed handoff. (3) Duplicate activity delivery is idempotent. (4) throttling/transient failures follow current connector/Graph guidance and are testable without duplicate updates.
- **Validation:** Synthetic activity fixtures; tenant app/consent review and current Microsoft documentation verification before installation; #368 contract comparison.
- **Dependencies/owner gaps:** #368 schema; owner selection; tenant administrator/app approval; validated bot framework, current RSC and retry behavior.
- **Illustrative effort:** 5–10 person-days assuming one tenant and a single interaction path, existing hosting, and no RSC/read-all access. Re-estimate after API/tenant review.

## Promotion criteria

- **Backlog-ready:** Michael selects one bounded user outcome; #368 has an owner-approved update/provenance contract; platform and minimal permissions/consent are verified from current official documentation; exclusions and acceptance fixtures are agreed; #377 owns all reminder/quiet-hour behavior; a privacy/retention disposition and estimate assumptions are recorded.
- **Sprint-ready:** named delivery owner; leaf-sized scope; dependencies resolved or sequenced; test environment and permission approvals available; deterministic fixtures cover confirmation, missing/conflicting data, duplicates, retries, and failure recovery; estimate reviewed; no unapproved telemetry or live messaging.
- **Owner-selected:** Michael explicitly selects an option and records disposition of the alternatives and historical metrics. This is a separate decision from research completion, PR merge, backlog readiness, sprint selection, or release approval. No current evidence satisfies these gates.

## Proposed concise owner comment for #376

> Research report: [issue-376-discovery.md in PR #1608](https://github.com/mirichard/pm-tools-templates/pull/1608/files) compares a GitHub-native structured baseline with narrowly invoked Slack/Teams options. Recommendation: do not select/build a bot yet; first resolve #368’s update/provenance contract, keep reminders under #377, and use explicit user invocation plus confirmation if a chat option is later selected. Direct Slack/Microsoft documentation access and tenant/workspace permission verification remain open. No adoption, accuracy, or response-rate evidence was produced. Owner decision: choose whether to validate the GitHub baseline first or authorize one platform option for future refinement; no delivery or sprint commitment is implied.

## Four-point closeout

- **Recommended next step:** Michael selects whether the GitHub-native baseline or one mention-only platform option should be refined after #368’s contract is ready.
- **Research completed:** maintained assets, issue hierarchy, sibling research, official API entry points, permission/context trade-offs, proposed fixture, and promotion gates were inventoried.
- **Remaining gaps:** direct Slack/Microsoft docs and tenant/workspace access, approved #368 fields, privacy/retention decisions, implementation validation, and portfolio WIP/capacity reconciliation.
- **Owner decision required:** platform/control selection and explicit disposition of historical adoption, accuracy, response, parity, and analytics targets.
