# Issue #77 — usage analytics discovery

**Research snapshot:** October 30, 2026  
**Decision owner:** Michael Richard  
**Current disposition:** #77 remains a Later-backlog child of #1480. This report authorizes no collection, implementation, sprint selection, or change to project state.

## Decision brief

Do not activate tracking or promote delivery yet. The narrowest potentially useful question is: **among people who separately opt in, which maintained template files receive the most download-intent events per week, and should any be queued for a human documentation review?** This could inform a specific review-queue decision, but it would measure opted-in clicks—not unique users, successful downloads, template use, completion, quality, or all visitors.

Repository evidence shows a client SDK with consent flags and event helpers, but no receiving service, durable analytics store, dashboard, or integration in the checked application entry points. The existing SDK sends more fields than this question needs, and does not provide a complete withdrawal, export, or remote-deletion path. Community ratings, requests, corrections, and feedback are separately handled under #319; that accepted work is not telemetry.

Official privacy sites were not reachable from this environment, no live data or participant evidence was collected, and no deployment or legal review was verified. The product decision and the trade-off between immediate aggregate-only processing and user-linked export/deletion remain open.

**Owner decision:** decide whether this narrow review-queue question is worth pursuing; if so, choose a data/deletion model and obtain qualified privacy review before any event is sent. Keep #1480 and #77 in Later until those prerequisites and capacity are explicit.

## Minimum question and measurement boundary

**Proposed question:** Among people who explicitly consent to optional usage measurement, which canonical template paths receive the greatest number of download-intent events in a calendar week, and should maintainers manually review those templates for clarity or discoverability in the next planning cycle?

This is deliberately a low-claim signal. A click records intent only; it does not prove that a file downloaded successfully or was opened, completed, effective, or liked. Counts exclude non-consenting visitors and may be biased by who opts in and by repeat clicks. Do not label these counts “users,” “adoption,” “completion,” or “effectiveness.” No denominator or opt-in-rate claim is supported by this event design.

The decision to inform is limited to whether an item enters a **human review queue**. It does not automatically change roadmap priority, template quality scores, or delivery commitments. A threshold, review cadence, and accountable reviewer have not been selected.

## Capability, evidence, and gap matrix

The source revision below is the repository base visible to this research branch (`8078fdd24db8e9d274a5922c1db00c051f708663`). Blob IDs distinguish the inspected files from later edits. Links to GitHub issue and PR records are live records; their state is reported as observed on October 30, 2026.

| Asset / evidence | Observed capability or evidence | Gap, dependency, and disposition |
|---|---|---|
| [Parent epic #1480](https://github.com/mirichard/pm-tools-templates/issues/1480) and native #77 parent relationship | The owner set #1480 to **Product backlog — Later**, moved #77 out of #319, and explicitly withheld telemetry activation, sprint selection, and a delivery date. The epic asks for a decision, measurement plan, consent/withdrawal, retention, access, export/deletion, and tests before implementation. | **Retain** #1480 as the governing scope. Owner must select the product decision and data model before promoting a child. Historical percentages are hypotheses, not gates. |
| [Issue #77](https://github.com/mirichard/pm-tools-templates/issues/77) | Current parent is #1480. There are no issue comments in the retrieved record. The older 8-point, Must Have, Q3 2025, and completion/adoption targets are explicitly superseded or unvalidated. | **Revise** the broad historical acceptance language through owner-approved refinement; do not treat historical targets or schedule as commitments. Keep the issue open and Later. |
| [Issue #319](https://github.com/mirichard/pm-tools-templates/issues/319), [#1383](https://github.com/mirichard/pm-tools-templates/issues/1383), and merged [PR #1497](https://github.com/mirichard/pm-tools-templates/pull/1497) | The owner recorded #319's acceptance closeout on October 30; #1383 is closed. PR #1497 merged October 20 with text-only/public sanitized contribution, correction, request, report, rating, and feedback routes and receipt/disposition guidance. The current [submission-handling guide](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/docs/community/submission-handling.md) says ratings/feedback do not prove adoption or quality and no automatic analytics or catalog scoring is performed. Blob: `674ec7950eb87ce30c9a53a3fbf3fdbc1aee7b83`. | **Retain** the accepted community route and decision communication under #319. Do not duplicate its intake forms or infer telemetry from its feedback records. |
| [Accepted walkthrough #1482](https://github.com/mirichard/pm-tools-templates/issues/1482), [walkthrough record](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/docs/community/epic-319-walkthrough.md) | The owner confirmed completion; #1482 is closed with its acceptance criteria checked. The maintained guide says not to repeat the walkthrough and does not invent granular observations. Blob: `8e77e4bcdefb5a0459357b0adb7aa93aade1b937`. | **Retain** accepted evidence. No repeat walkthrough or replacement acceptance claim. This does not establish telemetry, privacy, UAT, or release acceptance. |
| [Analytics SDK source](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/src/sdk/collector.ts) | Source blob `3ce2c1cb2b5d7e861380a14e04ab2694eac171e1`. It has false-default consent flags, an in-memory queue, optional local-storage consent/metadata, event helpers, and a configurable HTTP batch sender. Events can include a timestamp, generated session ID, configured user ID, metadata, consent flags, exact template name, methodology, completion time, CLI command, and feedback rating/comment length. Sanitization is shallow and limited. | **Defer** activation. The schema exceeds the proposed measurement need; no app integration was found in the checked runtime entry-point directories. The constructor starts a flush timer, and a granted usage flag queues a consent event. Do not interpret comments or names like “Privacy-First” as privacy validation. |
| [SDK consent guide](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/docs/consent.md), blob `179f85a4132d4dde04704aa1ff7f82886c68f0aa` | The application, not the SDK, must present consent. The guide says missing/malformed consent defaults false; valid stored JSON is not schema-validated. `revokeConsent()` clears queued events and storage keys but does not clear in-memory metadata/user ID, cancel in-flight sends, or request remote deletion. Ordinary consent changes do not clear queued events. | **Revise** the proposed controls and tests before implementation. Local revocation is not remote deletion or proof no in-flight request completes. |
| [SDK privacy guide](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/docs/privacy.md), blob `5247514db9f3b409d3752d0afe1c112c970104a7` | The guide explicitly says this is not a deployed-service privacy policy or compliance evidence. No receiver/database is provided here. It documents identifiers, local storage, shallow filtering, and missing retention, access-role, remote export/deletion, and transport/storage guarantees. | **Retain** as a limitations record; **revise** only through separately accepted implementation work. Legal compliance is not demonstrated. |
| [SDK API docs](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/docs/api.md) and [dashboard status](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/docs/dashboard.md) | The API URL/key are caller-supplied. The docs describe a future endpoint contract but no server, database, report/query API, dashboard, or deployed service in this sub-application. Separate `dashboard-mvp` is not shown to integrate with this SDK. | **Defer** backend, dashboard, and integrations until purpose, owner, data handling, and capacity are accepted. Do not infer production behavior from SDK code or generated site copies. |
| [SDK tests](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/src/sdk/collector.test.ts), blob `c9098f7b3778e3065ae6ea586a295f68df670839` | Tests use a mocked fetch and include consent gating, selected sanitization, network rejection/requeue, and local-storage fallback/revoke cases. They are not end-to-end service, deletion, consent-interface, or human-acceptance evidence. | **Retain** as implementation evidence only. Execution was attempted for this assignment but blocked because the SDK's local npm dependencies are not installed; no test pass is claimed. |
| [Catalog registry](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/templates/templates.json), blob `1f89a7069b8c72574989922bd1672602a0b88828` | The registry lists 148 entries with a `path` field, not a stable `id` field. Maintained template files are the content; `TEMPLATE_INDEX.md` and `site/dist` are generated copies, not evidence of live measurement. | **Retain** the registry/path as a candidate allowlist only after validating it against maintained files at event time. No usage values or deployment integration were established. |
| [Portfolio discovery plan](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/research/v2.5-discovery-plan.md), blob `8f6a2d1e61561c2eba44c84e8b423f0127299411` | The plan assigns #1480 to Sprint 6 portfolio discovery, not delivery; capacity scenarios are unconfirmed. It says preserve #1482 and #1379 evidence and avoid telemetry activation/outreach. | **Retain** the portfolio sequencing and capacity caveat. Coordinate through this report; do not duplicate parent-epic research or assert a sprint commitment. |
| [#1379 accepted evidence-sufficiency finding](https://github.com/mirichard/pm-tools-templates/issues/1379) | The owner accepted the source-sufficiency finding for PUB-ALMMSN-01 at `0dc4f6b071eaffa46a6458c3ac034acadd857f2a`. The issue explicitly preserves gaps in realism/reference review, participants, and study controls. | **Retain** the accepted finding; unrelated to telemetry and not a basis to repeat source qualification or claim study readiness. |
| [Active research PR #1580](https://github.com/mirichard/pm-tools-templates/pull/1580) | The existing PR is open and draft on this branch. Its retrieved body still has automatic issue-closing references. | **Revise PR metadata** to a non-closing `Refs mirichard/pm-tools-templates#77` reference before any merge. This environment can push report changes but has no PR-edit or new-issue-comment operation; exact proposed metadata/comment are below. Do not merge. |

## Proposed data flow and event contract

This is a **design proposal, not an implemented or tested integration**:

1. Keep all collection off by default. Before any event, show an optional, purpose-specific choice describing the event fields, recipient, retention, withdrawal, and the actual consequences for export/deletion. Using, downloading, or providing feedback must not depend on consent. Save only the preference required to remember the choice; do not emit a consent event to the analytics endpoint.
2. After an affirmative choice, a user action may create a fixed `template_download_intent` event. Accept only a canonical path validated against the maintained catalog; reject unknown/custom fields. Do not collect feedback text, free text, account/email, role, industry, methodology, project content, full URL, referrer, exact timestamp, or a stable session/user identifier for this question.
3. A future receiver would validate the event and template path, derive a week bucket at receipt, increment only an aggregate `(week, template_path)` count, and discard the individual event. The network endpoint and its infrastructure may still observe request metadata such as an IP address; transport, provider logs, and retention must be reviewed and configured, not assumed away.
4. Only authorized maintainers may access aggregate counts. No public dashboard or fine-grained segments are proposed. Owner/privacy review must define access, low-count disclosure handling, aggregate retention, and whether counts may be exported.
5. On withdrawal, stop future collection, discard unsent events, clear the local preference as designed, and prevent new requests. A sent request cannot be recalled by a client-side toggle. Withdrawal is not deletion of prior data.

**Synthetic minimal event proposal** (no identifier; no live service):

```json
{
  "schema_version": 1,
  "event_type": "template_download_intent",
  "template_path": "templates/universal/benefits-review-template.md"
}
```

The receiver—not the client payload—would assign the aggregation week. The path is a public maintained-file reference; the candidate value above is synthetic. The current catalog has paths rather than stable IDs, so path lifecycle and allowlist validation remain prerequisites.

### Identifier, withdrawal, export, and deletion decision

There is a material design trade-off that must not be hidden:

- **Aggregate immediately, with no persistent identifier:** best minimizes event-level data for the proposed question. It cannot provide an individual event export or remove a person’s contribution from a count after aggregation. Do not promise those capabilities or imply withdrawal deletes past aggregate contributions.
- **Retain pseudonymous, consent-scoped event rows until a defined deletion window closes:** could support row-level export/deletion before aggregation, but creates linkable data, requires secure token issuance/recovery, identity/verification and access controls, retention limits, derived-aggregate treatment, and a tested deletion path. A random token is still potentially personal/pseudonymous data; it is not anonymous merely because it lacks a name.

Neither model is approved. No retention period is selected. If applicable rights cannot be met under the chosen model, do not collect until the owner and qualified reviewer resolve the design. Separate client storage, server request logs, backups, and already-derived aggregates in any retention/deletion specification.

## Synthetic worked example and verification plan

**Synthetic-only fixture:** Assume three invented clicks in `2026-W44`, with consent already granted for each: two for `templates/universal/benefits-review-template.md` and one for `domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md`. Proposed aggregate output:

| Week | Maintained template path | Download-intent events |
|---|---|---:|
| 2026-W44 | `templates/universal/benefits-review-template.md` | 2 |
| 2026-W44 | `domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md` | 1 |

These are illustrative values, not repository analytics or user evidence. They count events, not people or successful downloads. A maintainer could use the relative counts to decide whether to inspect the two documents; no automatic priority or quality conclusion follows.

**Proposed tests—not executed and not accepted:**

1. With no consent, malformed consent, or a rejected/unknown consent version, verify zero event requests and zero queued usage events. Confirm the normal template journey works.
2. After affirmative consent, verify one allowed click sends only the schema fields above; assert no `sessionId`, `userId`, metadata, timestamp, referrer, IP, free text, or feedback payload is stored in the event record. Reject unknown template paths.
3. Revoke before flush and verify queued events are discarded and no subsequent event is sent. Use a controllable in-flight request to demonstrate the actual race/cancellation behavior; do not claim a request already received can be undone by the client.
4. For the selected data model, test retention and access controls against synthetic records. If individual export/deletion is promised, verify export completeness and deletion across raw rows, derived counts, logs, backups, and retries with a synthetic subject. If aggregate-only is selected, explicitly verify the interface does not promise individual historical deletion and obtain qualified review of that limitation.
5. Reconcile synthetic input counts to output counts; test sparse buckets and reporting access. A human maintainer and owner must accept the usefulness, disclosure threshold, and decision rule before a live product decision.

**Executed checks:** source/docs/issues/relationships were inspected; official-source access was attempted and unavailable; the local analytics test command was attempted and did not run because `analytics-platform/node_modules/@typescript/native/bin/tsc` is absent. No live endpoint, user data, telemetry, deletion flow, or human review was exercised.

## Historical target disposition

| Historical item | Disposition | Reason / replacement |
|---|---|---|
| “60%+ user opt-in within 6 months” | **Retire as a target.** | No baseline, eligible-user denominator, timeline, or accepted benefit exists. Measuring non-consent exposure to claim a rate would itself require a separate reviewed design. Do not optimize the consent prompt for conversion. |
| “10,000+ data points monthly” | **Retire.** | Event volume is not user value and creates an incentive to collect more data than the decision needs. Use no volume target; only the minimum evidence needed for the owner-selected decision. |
| “80% of enhancement priorities influenced by data” | **Defer; not an acceptance criterion.** | “Influenced” and the denominator are undefined; event counts are opt-in-biased and do not establish priority quality. Reconsider only with an agreed decision-quality baseline and evidence. |
| “25% improvement in template completion” | **Defer as an unvalidated hypothesis; not a target for this slice.** | No completion definition, baseline, comparison design, or evidence is supplied. Download intent cannot measure completion or causal improvement. |
| 8 story points, Must Have, Q3 2025, and previous milestone/dates | **Retire as current commitments.** | Historical planning details are superseded by #77’s Later status under #1480. No current effort or schedule is confirmed. |
| “GDPR/CCPA compliance” checkbox | **Replace with a qualified, context-specific review gate.** | This research does not establish jurisdiction, roles, lawful basis, applicability, or compliance. Do not claim compliance from a checkbox, SDK comment, or consent flag. |

## Conditional candidate package — refine existing #77, do not duplicate

**Candidate title:** Optional aggregate template download-intent measurement  
**User outcome:** Maintainers can decide whether to place a maintained template into a human documentation-review queue using a clearly bounded, voluntary aggregate signal.

**Scope:** One explicitly approved question; one event type; canonical template-path validation; opt-in-before-event behavior; one selected aggregation/deletion model; documented data flow, retention, access, withdrawal, and limits; synthetic fixtures and a verified report. The initial measure is download intent only.

**Exclusions:** Any tracking before consent; feedback/ratings ingestion; user/profile segmentation; cross-site or cross-device identity; use of raw project/content files; a public dashboard; automatic catalog changes; completion/effectiveness claims; live collection before acceptance; unrelated community intake; GDPR/CCPA certification.

**Observable acceptance criteria (proposed, not accepted):**

- Owner records the user decision, purpose, event denominator/limitations, report audience, and review-queue action.
- Owner chooses aggregate-only or pseudonymous row-level handling and approves the corresponding withdrawal/export/deletion promises after qualified privacy review.
- No request is sent before opt-in; events contain only the approved schema; consent refusal and withdrawal preserve the normal template journey.
- Synthetic cases reconcile to aggregate output; retention, access, sparse-count behavior, deletion/export (if promised), and failure/recovery tests pass.
- Maintainer instructions identify the owner, recipient, supported decision, limits, and stop conditions; owner accepts the evidence before enablement.

**Validation:** automated tests with mocked transport and synthetic inputs; data-store/access/deletion tests for the selected architecture; human review of notice and report; no participant outreach or real-user collection as part of this discovery.

**Dependencies / gaps:** owner decision; named product/data operator and implementation capacity; actual application integration point and receiving-service owner (none identified); consent UX; qualified privacy counsel/reviewer; processor/hosting/log configuration; approved retention/access/deletion model; report threshold and maintenance owner.

**Effort range:** not responsibly estimable from current evidence. The receiver and deletion model are not selected, and capacity is unconfirmed. The historical 8 points is not a usable estimate. Estimate only after these dependencies are resolved; no delivery task is created by this report.

## Promotion criteria

- **Backlog-ready:** owner selects the measurement question and user decision; scope/exclusions are accepted; existing assets and integration point are confirmed; data/consent/deletion alternatives and legal-review dependency are documented; a bounded synthetic validation method, accountable owner, and defensible estimate are supplied. **Current status: not backlog-ready** because the owner decision, data model, service owner, estimate, and privacy review are missing.
- **Sprint-ready:** named delivery and data owners; consent UX and event contract approved; infrastructure/logging, access, retention, export/deletion semantics, and failure behavior specified; privacy/legal review complete for the actual context; synthetic tests and human acceptance criteria are actionable; dependencies sequenced and capacity confirmed. **Current status: not sprint-ready.**
- **Owner-selected:** Michael explicitly chooses proceed/revise/defer/stop after reviewing this discovery and any qualified review. Only an explicit later selection plus capacity planning can place a bounded slice in a sprint. **No selection is inferred here.**

The accepted #1482 walkthrough and #1379 source-sufficiency finding remain preserved. No project stage, sprint, milestone, or issue closure change is requested.

## Primary privacy references and research limits

These are official source pointers for qualified review, not a legal opinion. Attempts to retrieve official sites on October 30, 2026 failed because DNS resolution was unavailable in this environment; the current texts, applicability, and any legal conclusions were therefore **not independently verified during this research**.

| Official source | Potentially relevant provisions | Applicability caution |
|---|---|---|
| [Regulation (EU) 2016/679 (GDPR), official EUR-Lex text](https://eur-lex.europa.eu/eli/reg/2016/679/oj) | Articles 5 (purpose limitation, minimization, storage limitation, accountability), 6 (lawfulness), 7(3) (withdrawal), 17 (erasure), 25 (data protection by design/default), 30 and 32. | Applicability, legal role/basis, exceptions, and meaning of aggregation require review of the real service, parties, and users. No compliance conclusion is made. |
| [EDPB Guidelines 05/2020 on consent under Regulation 2016/679](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en) (final version 1.1, adopted May 4, 2020) | Consent quality, specificity, information, affirmative action, and withdrawal. | Guidance does not establish that consent is the required or sufficient legal basis for a particular product; the actual interface and context need review. |
| [California Privacy Protection Agency consumer privacy information](https://cppa.ca.gov/consumers/) and [California Civil Code §1798.105](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1798.105.&lawCode=CIV) | Official references for California consumer deletion rights and agency guidance. | Business/applicability thresholds, statutory exceptions, regulations, service-provider roles, and the treatment of aggregates require current qualified review. No CCPA compliance conclusion is made. |

Privacy design questions for the owner/reviewer: jurisdiction and parties; purpose and legal basis; notice and consent UX; whether any network identifiers or logs are personal information; controller/processor and hosting; access and audit; retention of events, logs, backups, and aggregates; withdrawal vs. erasure; identity verification; export format; aggregation/re-identification risk; and handling of derived counts when a deletion request arrives.

## Proposed PR and issue communication

**Existing PR:** #1580 is the focused draft for this report. Its retrieved body contains automatic issue-closing references; replace that metadata before any merge. The available tools can push this file but do not expose a PR-edit or new-issue-comment operation.

**Proposed PR title:** `Research: #77 usage measurement discovery`

**Proposed PR reference/body text:** `Refs mirichard/pm-tools-templates#77. Related: #1480 (parent/deferred scope), #319 and #1497 (accepted community intake, distinct from telemetry), #1482 (accepted walkthrough), #1379 (preserved source-sufficiency evidence), #1566 and [research/v2.5-discovery-plan.md](research/v2.5-discovery-plan.md). No tracking is activated; no issue/project status or acceptance is changed.`

**Proposed concise issue comment (not posted):**

> Research report: [issue-77-discovery.md](https://github.com/mirichard/pm-tools-templates/blob/REPLACE_WITH_MERGED_REVISION/research/issue-77-discovery.md). Recommendation: keep #77 under #1480 in Later and do not activate telemetry. The only bounded candidate is opt-in download-intent counts by maintained template path to inform a human documentation-review queue; this is not use, completion, or effectiveness evidence. The SDK has no receiver/dashboard and does not implement remote export/deletion. Official privacy sites were unreachable during research; owner selection of the data/deletion model and qualified review remain prerequisites. No project status or acceptance changed.

Replace `REPLACE_WITH_MERGED_REVISION` with the report commit before posting. No Project field update is proposed.

## Four-point owner summary

- **Recommended next step:** Michael decides whether the narrow review-queue question merits further refinement and which data/deletion model is acceptable.
- **Research completed:** Current scope, accepted community work, SDK/docs/tests, catalog registry, portfolio plan, related PRs, and privacy design gaps were reviewed.
- **Remaining gaps:** Official-source access/legal review, service and data owner, event integration, consent UX, retention/access/deletion design, confirmed estimate/capacity, and synthetic acceptance remain unresolved.
- **Owner decision required:** Proceed, revise, defer, or stop; keep the issue Later unless and until the owner selects otherwise.
