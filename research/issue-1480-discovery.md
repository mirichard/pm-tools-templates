# Issue #1480 — opt-in template usage analytics discovery

**Research snapshot:** October 30, 2026
**Decision owner:** Michael Richard
**Disposition:** Product backlog — Later. This report authorizes no telemetry, implementation, sprint selection, release, or issue/project status change.

## Decision brief

**Recommendation:** Do not activate or schedule usage measurement now. First ask whether a specific maintainer decision cannot be made from the repository’s existing public feedback and catalog evidence. No such decision or unmet need is evidenced in this research. The smallest plausible future question is whether opted-in template download-intent events should place a maintained file in a human documentation-review queue. This is only a candidate, not an owner-selected purpose.

The existing evidence is insufficient to estimate actual template use: accepted #319 intake provides requests, ratings, corrections, and feedback, while the static curation-metrics snapshot measures catalog scoring. Neither is a usage denominator. A separate preview demo contains an opt-in, in-memory counter, but it does not establish deployed collection or populated usage evidence. The SDK has consent-gated events but no receiver or durable reporting service, and its identifiers, metadata, consent/revocation, and deletion behavior exceed or fail to meet the candidate’s needs.

There is no user research, live-traffic evidence, approved data owner, selected consent/deletion model, or qualified privacy review. Official source pages could not be fetched directly in this environment. Preserve #1480 and existing #77 in Later; do not duplicate #77. **Michael must decide whether to defer/stop measurement or authorize further refinement of the candidate question and data model.**

## Capability, evidence, and gap matrix

Source-code links below pin the inspected repository snapshot to base revision [`8078fdd`](https://github.com/mirichard/pm-tools-templates/commit/8078fdd24db8e9d274a5922c1db00c051f708663); the listed blob IDs identify exact file revisions. A code path or test is not evidence that a service is deployed or has collected data.

| Capability / evidence | What the inspected source establishes | Gap, dependency, disposition |
|---|---|---|
| [#1480](https://github.com/mirichard/pm-tools-templates/issues/1480) and its native relationship to [#77](https://github.com/mirichard/pm-tools-templates/issues/77) | #1480 is Later; #77 is its existing child and is also Later. The owner explicitly disallows telemetry activation and makes prior numeric targets hypotheses, not delivery gates. | **Retain** this parent/child structure and owner decision rights. Refine #77 rather than create a duplicate implementation story. No measurement purpose is yet selected. |
| [#319](https://github.com/mirichard/pm-tools-templates/issues/319), merged [PR #1497](https://github.com/mirichard/pm-tools-templates/pull/1497), and [`docs/community/submission-handling.md`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/docs/community/submission-handling.md) (blob `674ec7950eb87ce30c9a53a3fbf3fdbc1aee7b83`) | Accepted community intake covers sanitized contributions, requests, corrections, reports, ratings, and general feedback. The maintained guide says ratings are not verified adoption/quality evidence; public issues and comments are public. PR #1497 is merged, but does not implement usage analytics. | **Retain** the #319 journeys and separate them from telemetry. Do not mine or repurpose feedback text as an unapproved behavioral event stream. |
| [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482) and its accepted walkthrough | The owner confirmed the contributor/maintainer walkthrough complete; #1482 is closed. | **Retain** its accepted evidence. Do not repeat the walkthrough or treat it as consent, telemetry, or privacy validation. |
| [#1379](https://github.com/mirichard/pm-tools-templates/issues/1379) | Owner review accepted source sufficiency for PUB-ALMMSN-01 v0.1 at `0dc4f6b071eaffa46a6458c3ac034acadd857f2a`. The issue preserves separate realism/reference-review and study-control gaps. | **Retain** the accepted source-sufficiency finding only. It is unrelated to analytics and is not evidence for analytics need or readiness. |
| [SDK collector](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/src/sdk/collector.ts) (blob `3ce2c1cb2b5d7e861380a14e04ab2694eac171e1`), [consent guide](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/docs/consent.md) (blob `179f85a4132d4dde04704aa1ff7f82886c68f0aa`), and [privacy guide](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/docs/privacy.md) (blob `5247514db9f3b409d3752d0afe1c112c970104a7`) | The SDK has false defaults for absent/malformed consent, an in-memory queue, optional local storage, and event helpers. Events may contain a timestamp, session ID, configured user ID, metadata, consent flags, template name, methodology, completion time, or feedback rating/comment length. The app must supply the consent UI and endpoint. | **Defer** activation. Current payloads are broader than a minimal question. `revokeConsent()` clears queued events and local consent/metadata keys, but does not clear in-memory metadata/user ID, cancel in-flight sends, or delete remote data. Valid stored consent JSON is not schema-validated; consent changes do not clear already queued events. These are documented code boundaries, not legal conclusions. |
| [SDK API](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/docs/api.md) and [dashboard status](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/docs/dashboard.md) | The SDK POSTs to a caller-supplied URL. The package has no receiving API, database, report query, dashboard, configured retention, access roles, or remote export/deletion service. Its separate dashboard-MVP is not evidence of an SDK integration. | **Defer** service, dashboard, and integration work until purpose, owner, architecture, access, retention, and deletion are approved. Do not infer production behavior from client code. |
| [Separate `site/` preview demo](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/site/server.js) (blob `ff61b1ae1b7512c921c52d7d0f1504850645a170`), [`app.js`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/site/src/app.js) (blob `f97a2eb40dac1c94da329b512010dde9ad5f410e`), and [`index.html`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/site/src/index.html) (blob `01707ac14369c64c589005e19da9aaf2a16b5438`) | This distinct preview demo asks for consent, sends a preview event with path and client timestamp after consent, counts by event/path in server memory, and exposes a JSON dashboard route. The source does not establish that it is deployed or contains real traffic. Its consent choice has no in-demo withdrawal control; the server process lifetime bounds its in-memory counters, not any hosting/request logs. | **Revise the evidence inventory** to acknowledge this pre-existing demo, but **defer** treating it as production capability or evidence. No telemetry was sent or demo started for this assignment. Its counters have no eligible-visitor denominator, and demo behavior does not settle a repository-wide consent, access, retention, or deletion policy. |
| [`public/metrics/curation-metrics.json`](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/public/metrics/curation-metrics.json), blob `26c552eade6b1eabd4998646f799f3fc13ca642f` | The static snapshot says `lastGenerated: 2025-08-05` and reports catalog tiers and curation score buckets. It does not contain usage events, visit counts, or an eligible-user denominator. | **Retain** as catalog-curation evidence only. It cannot answer usage, opt-in rate, adoption, or effectiveness. |
| [SDK tests](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/analytics-platform/src/sdk/collector.test.ts), blob `c9098f7b3778e3065ae6ea586a295f68df670839` | Tests use mocked fetch and cover selected consent gating, sanitization, network rejection/requeue, storage fallback, and queue clearing on revoke. | **Retain** as unit-level implementation evidence only. They do not prove a consent interface, deployment, remote deletion/export, retention, or human acceptance. No SDK test result is claimed for this documentation-only assignment. |
| [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566), [portfolio plan](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/research/v2.5-discovery-plan.md) (blob `8f6a2d1e61561c2eba44c84e8b423f0127299411`), and active draft [PR #1597](https://github.com/mirichard/pm-tools-templates/pull/1597) | Plan places #1480 in the Sprint 6 discovery portfolio, not delivery; research and delivery capacity scenarios are unconfirmed. The plan explicitly preserves #1482 and #1379 evidence and prohibits telemetry activation. PR #1597 is an open draft portfolio synthesis. | **Retain** portfolio sequencing and capacity caveats; link to #1566/#1597 rather than duplicate portfolio work. A discovery checkpoint is not a sprint commitment or owner selection. |
| Existing child research: open draft [PR #1580](https://github.com/mirichard/pm-tools-templates/pull/1580) | This is the in-progress #77 report, not a merged or accepted decision. It proposes weekly opted-in download-intent counts by maintained path for a human review queue and records SDK lifecycle gaps. | **Reuse and review** its issue-specific evidence; do not create another #77 report or treat its proposed question as selected. This parent report consolidates the decision and links the child research. |
| Current production catalog surface checked: [`docs/site/src`](https://github.com/mirichard/pm-tools-templates/tree/8078fdd24db8e9d274a5922c1db00c051f708663/docs/site/src) | The checked catalog source contains no reference to the SDK or preview-demo telemetry. The workflow builds/deploys `docs/site/dist`, distinct from the `site/` preview server. | **Defer** any claim of production collection. This is a bounded source inspection, not proof about external hosting logs or every possible deployment. |

### Measurement question and denominator

No evidence establishes that usage measurement is needed for a current owner decision. If Michael wants a bounded candidate to evaluate, the question from draft #1580 is: **Should a maintained template be placed in a human documentation-review queue based on opted-in download-intent events during a reporting week?**

The numerator would be **events** for each allowlisted maintained template path per week, not people, successful downloads, or template use. Repeat events may come from one person/session. The proposed event does not include all eligible visitors, non-consenting visitors, or impressions, so there is no denominator for opt-in rate, unique-user adoption, or click-through rate. No completion or effectiveness inference is supported. If the owner needs one of those other decisions, this candidate does not answer it.

### Proposed minimum data and lifecycle boundary

If the owner selects this question, a minimal event could contain only `schema_version`, `event_type: "template_download_intent"`, and an allowlisted canonical `template_path`. The receiver would assign a reporting week; no client timestamp, stable user/session ID, profile, feedback, referrer, or free text is needed for the proposed count. A request may still expose network/hosting metadata; those logs and their retention must be assessed before collection.

```json
{
  "schema_version": 1,
  "event_type": "template_download_intent",
  "template_path": "templates/universal/benefits-review-template.md"
}
```

The application would present a clear, optional choice before any event; refusal leaves the template journey unchanged. Withdrawal stops future events and discards unsent events, but cannot undo a request already received. The candidate default is to aggregate immediately and discard the raw event, with no public dashboard and access limited to an owner-designated maintainer. **No aggregate retention period or access role is approved.**

Aggregate-only handling minimizes linkage but cannot export or remove an individual's contribution after aggregation. If individual export/deletion is a promised requirement, the owner must instead select and review a row-level/pseudonymous design, retention window, identity/recovery mechanism, access controls, and deletion of raw records, derived counts, logs, backups, and retries. Pseudonymous data is not assumed anonymous. If the applicable export/deletion promise cannot be met and tested for the chosen design, do not collect. Neither model is selected.

## Conditional refinement/reuse package — existing #77

No new delivery issue is proposed. If the owner chooses further refinement, update the existing #77 under #1480.

**User outcome:** Maintainers can decide whether to manually review a maintained template using a voluntary, bounded signal without making use or feedback conditional on tracking.

**Scope to consider:** One owner-selected decision; one event type; canonical path allowlisting; purpose-specific opt-in before collection; a selected aggregation and data-lifecycle model; synthetic reconciliation and a human-reviewed report. The initial candidate measures download intent only.

**Exclusions:** Collection before consent; feedback/rating ingestion; profile segmentation or stable cross-session identity; project or file contents; public dashboards; automatic priority/catalog changes; claims of adoption, completion, or effectiveness; live collection before acceptance; unrelated #319 journeys; compliance certification.

**Proposed observable acceptance criteria—not approved:**

1. Owner records the user/maintainer decision, purpose, event definition, denominator and limitations, report audience, and what action a report may inform.
2. Owner selects aggregate-only or row-level handling and approves withdrawal, export, deletion, retention, and derived-aggregate semantics after qualified review of the actual context.
3. Before affirmative consent, no event request is sent or queued; after withdrawal, no new event is sent and unsent events are discarded. The normal template journey remains usable in either state.
4. Only approved schema fields and maintained paths are accepted. Synthetic inputs reconcile to output; access, retention, failure/recovery, sparse counts, and any promised export/deletion behavior pass tests.
5. A maintainer and owner review the notice, report, limitations, and decision usefulness before any live enablement.

**Validation method:** mocked-transport consent tests; synthetic aggregation fixtures; tests for schema/path rejection, queued/in-flight behavior, access, retention, and recovery; end-to-end export/deletion tests only if promised by the selected architecture; human review of notice and report. Research did not execute these tests, use live traffic, or conduct outreach.

**Dependencies and owner gaps:** Michael’s proceed/revise/defer/stop decision; named product/data operator and engineering capacity; actual application integration point and receiving-service owner; consent interface; hosting/processor and request-log behavior; approved access, retention, deletion/export and aggregate policy; qualified privacy review; report owner and decision threshold.

**Effort (conditional refinement only):** Provisional planning range of **1–3 person-days** to refine the existing #77 after owner selection. Assumptions: one measurement question; reuse of the source inventory and draft #1580; one maintainer/engineering review and qualified privacy review; no participant outreach, code, live collection, or new service design. This is an analyst range, not a confirmed estimate or capacity commitment. The delivery implementation remains unestimated until the owner selects a data model, receiver, consent experience, and deletion requirements. Historical “8 points” is superseded, not a current estimate.

## Synthetic fixture and validation status

**Synthetic-only example; no real usage data.** Suppose three opted-in download-intent events in a made-up reporting week: two for `templates/universal/benefits-review-template.md` and one for `domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md`.

| Reporting week | Maintained template path | Download-intent events |
|---|---|---:|
| 2026-W44 | `templates/universal/benefits-review-template.md` | 2 |
| 2026-W44 | `domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md` | 1 |

These are event counts among consenting visitors only. They do not represent unique people or total visitors. No opt-in percentage, popularity threshold, quality score, roadmap priority, or effectiveness result follows from this fixture.

**Proposed tests—not executed or accepted:** (a) no/malformed consent produces no queued or sent usage event; (b) consented input sends only the approved path/event schema; (c) refusal and withdrawal preserve the normal template journey and discard unsent events; (d) synthetic event counts reconcile exactly to aggregates; (e) unknown paths, sparse buckets, access, retention, and the selected deletion/export model behave as specified; (f) in-flight send and failure/recovery behavior is documented and tested.

**Executed research checks:** inspected the linked issues and native #77→#1480 relationship; reviewed the pinned repository files and source revisions in the matrix; inspected active related PRs #1580, #1597, and #1617; searched the maintained catalog source for telemetry integration; queried official privacy references on October 30, 2026. Direct EUR-Lex/ICO page retrieval failed due unavailable DNS in this environment. `python3 check_anchor_links_filtered.py` exited 0 after checking 1,385 Markdown files. The new report had anchor suggestions but no broken-link entries; the repository scan also reported five existing broken anchors in `integrations/asana/docs/errors.md` (lines 10, 11, 13, 15, and 16), left unchanged as unrelated. No live service was contacted, no telemetry event was sent, and no user or participant data was collected.

**Human acceptance:** none. Michael’s decision, qualified review, product/data ownership, and acceptance of a proposed scope are all outstanding.

## Historical target disposition

These are explicit recommendations for owner disposition, not edits to #77 or approved decisions:

| Historical claim in #77 | Recommended disposition | Why |
|---|---|---|
| 60%+ opt-in within six months | **Retire as a target.** | No eligible-user denominator, baseline, timeline, or accepted benefit exists; optimizing consent conversion is not the purpose of measurement. |
| 10,000+ monthly data points | **Retire.** | Event volume is not user value and creates no need-based collection limit. |
| 80% of enhancement priorities influenced by data | **Defer; not an acceptance criterion.** | “Influenced” and its denominator are undefined; event counts do not measure decision quality. |
| 25% improvement in template completion | **Defer as an unvalidated hypothesis; not a target for this candidate.** | No completion definition, baseline, comparison design, or causal evidence is supplied; download intent cannot measure completion. |
| Historical 8 story points, Must Have, Q3 2025, and dates | **Retire as current commitments.** | Current owner disposition is Later; scope and implementation choices remain unresolved. |
| GDPR/CCPA compliance checkbox | **Replace with a context-specific qualified review gate.** | This research does not establish jurisdiction, parties, legal basis, applicability, or compliance. |

## Privacy references and limitations

These primary/official references identify questions for qualified review; they are not legal advice or a compliance finding. On October 30, 2026, web search surfaced the official EUR-Lex text and ICO guidance links, but direct retrieval failed because DNS was unavailable. Their current text and applicability were not independently verified here.

- [Regulation (EU) 2016/679, EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj), especially Articles 5 (purpose limitation, minimization, storage limitation), 7(3) (withdrawal), 17 (erasure), 25 (data protection by design/default), and 32 (security). Article 7(3) states that withdrawal must be as easy as giving consent; applicability and legal basis require review of the actual service and parties.
- [ICO anonymisation and pseudonymisation guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/), relevant to whether a retained event or aggregate is truly anonymous or remains linkable. Aggregation alone must not be presented as proof that individuals cannot be identified; qualified review of the actual fields, surrounding data, and release context is needed.

Unresolved review questions include jurisdiction and roles, lawful basis, actual UI and withdrawal path, endpoint/provider logs and IP handling, access/audit, retention of raw events and backups, identity verification for export/deletion, and whether derived aggregates can be altered or deleted. No compliance determination is made.

## Promotion gates and coordination

- **Backlog-ready:** a specific user/maintainer decision and purpose are owner-selected; existing evidence and the chosen measurement boundary are documented; scope/exclusions, data owner, service/integration point, privacy-review dependency, validation approach, and defensible estimate are available. **Not met:** the question itself is unselected; service/data owners, data model, qualified review, and estimate are missing.
- **Sprint-ready:** named delivery and data owners; consent and event contracts approved; hosting/logging, access, retention, withdrawal, export/deletion, failure behavior, test fixtures, dependencies, and capacity are resolved or sequenced; owner readiness decision recorded. **Not met.**
- **Owner-selected:** Michael explicitly chooses proceed, revise, defer, or stop after reviewing the evidence. Research assignment, draft PR, and plan placement do not constitute selection. **No selection is inferred.**

Keep the accepted #1482 walkthrough and #1379 source-sufficiency evidence intact. Coordinate the child question through [#77](https://github.com/mirichard/pm-tools-templates/issues/77) and its open [PR #1580](https://github.com/mirichard/pm-tools-templates/pull/1580); coordinate portfolio dependencies through [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566) and draft [PR #1597](https://github.com/mirichard/pm-tools-templates/pull/1597). This report is issue-specific and does not change Projects or create another delivery issue.

**Proposed concise issue comment (not posted):**

> Research report: [PR #1617](https://github.com/mirichard/pm-tools-templates/pull/1617/files). Recommendation: keep #1480 and #77 in Later; do not activate telemetry. Existing community feedback and catalog curation metrics do not establish template use, and the separate preview-demo counter is not evidence of deployed/populated analytics. A weekly opted-in download-intent count is only a candidate for a human review-queue decision, with no user/adoption/completion denominator. Service/data ownership, consent and deletion model, qualified privacy review, and an implementation estimate remain open. No project status or acceptance changed; Michael’s proceed/revise/defer/stop decision is required.

No Project update is proposed. The current toolset did not expose a GitHub issue-comment mutation operation, so the exact comment above is provided for an authorized human to post.

**PR reference correction required before merge:** The active PR body currently ends in an autogenerated `Fixes #1480` footer, contrary to the research-only instruction. Replace it with `Refs mirichard/pm-tools-templates#1480`; do not merge until corrected. The available progress operation can push commits but does not expose PR-body editing.

## Four-point owner summary

- **Recommended next step:** Michael decides whether a specific review-queue question justifies further refinement, or whether #1480/#77 should remain deferred or stop.
- **Research completed:** Existing aggregates, accepted community work, SDK, preview demo, source revisions, related research, and measurement/lifecycle gaps were reviewed.
- **Remaining gaps:** No demonstrated measurement need, denominator for broader adoption claims, service/data owner, approved data lifecycle, qualified privacy review, capacity, or delivery estimate.
- **Owner decision required:** Proceed, revise, defer, or stop; no implementation, sprint, release, or telemetry activation is authorized.
