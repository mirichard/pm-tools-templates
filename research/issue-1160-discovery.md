# Issue #1160 — Requirements extraction from elicitation transcripts

- **Research snapshot:** 2026-10-30
- **Disposition:** Unscheduled, deprioritized research-derived candidate; this report is research, not implementation approval.
- **Accountable owner:** Michael Richard (@mirichard).
- **Working PR:** [#1620](https://github.com/mirichard/pm-tools-templates/pull/1620) — research only; do not merge as delivery acceptance.

## Decision brief

**Recommendation — revise and defer.** Preserve #1160 as an unscheduled alternative candidate; do not carry the historical GO, spaCy choice, schedule, staffing, performance, adoption, or savings claims forward as current commitments. The October 30 owner instruction and current issue body explicitly retain an unscheduled disposition and authorize research only.

The maintained Requirements CLI does not ingest elicitation transcripts. It starts with already-structured Markdown requirements, then detects ambiguity, structures use cases, and runs review gates. Its source-traceability work can retain source requirement lines through generated steps, but it does not establish that extraction is correct or complete, distinguish transcript turns/speakers, or resolve wrong-but-valid attributions. This is a useful downstream contract, not evidence that transcript preprocessing exists.

The September 18 spike comments report prototype and model-performance numbers, but no reproducible prototype, transcript fixtures, gold labels, evaluation protocol, or independent verification was located in the maintained assets inspected. Treat those numbers as unverified historical claims. The cited RE-COVER and Almeida papers are bibliographically identifiable and relevant to dialogue/interview requirements generation; only indexed metadata/abstract summaries were available, not full-text appraisal. Neither citation presently supports the claimed accuracy or a particular implementation choice.

**Owner decision required:** whether to retain a bounded synthetic-only prototype/evaluation candidate for future backlog consideration, and whether to preserve, replace, or withdraw each historic target. No sprint, release, method, or delivery estimate is selected here.

## Evidence and capability/gap matrix

Repository links below pin maintained assets to base revision [`8078fdd24db8e9d274a5922c1db00c051f708663`](https://github.com/mirichard/pm-tools-templates/tree/8078fdd24db8e9d274a5922c1db00c051f708663).

| Capability / claim | Evidence and source revision | Gap, dependency, or limitation | Disposition |
|---|---|---|---|
| Current issue status and authority | [#1160](https://github.com/mirichard/pm-tools-templates/issues/1160), current body (updated 2026-10-30): open/reopened, assignees Michael Richard and Copilot, candidate/backlog labels, no milestone; no native parent or children. Current instruction authorizes research only. | Historical comments are not the current scheduling or implementation decision. No explicit native dependency on #1161 or #1162 was returned. | **Retain** unscheduled status and owner decision rights; **revise** historical GO language as non-controlling context. |
| Historical spaCy/LLM metrics and roadmap | [Spike comment, 2026-09-18](https://github.com/mirichard/pm-tools-templates/issues/1160#issuecomment-5733934135) claims 82–88% results on three transcripts and model comparisons; [Q4 GO comment, 2026-09-18](https://github.com/mirichard/pm-tools-templates/issues/1160#issuecomment-5734731285) claims priority, start date, and 5.75 FTE-weeks. | Inspected maintained research/CLI assets contain no implementation, three transcript fixtures, gold set, protocol, raw results, or independent review substantiating these claims. “7/7 extracted” is not recall without a defined gold set; “accuracy,” precision, and recall are not interchangeable. Cost/latency and roadmap claims also lack reproducible sources here. | **Revise** to “historically reported, unverified”; retain as a claim ledger for owner disposition, not as evidence or estimates. |
| RE-COVER, Voria et al. (IEEE TSE 2025) | Gianmario Voria et al., “RECOVER: Toward Requirements Generation from Stakeholders’ Conversations,” *IEEE Transactions on Software Engineering* 51(6), 1912–1933 (June 2025), DOI [10.1109/TSE.2025.3572056](https://doi.org/10.1109/TSE.2025.3572056); [arXiv preprint](https://arxiv.org/abs/2411.19552); [IEEE record](https://xplorestaging.ieee.org/document/11008757). Indexed abstract/summaries describe NLP/LLM-assisted requirements generation from conversations and evaluation of relevant turns and requirement quality. | IEEE/arXiv full text could not be fetched in this run. Exact dataset, study design, numerical results, limitations, and detailed applicability remain unverified. Indexed summaries do not establish this CLI's source-anchoring, negation, contradiction, deduplication, or approval behavior. | **Retain** as relevant primary research; **defer** paper-derived performance and method claims pending full-text appraisal. |
| Almeida et al. (WER 2025) | Camila Almeida et al., “From Elicitation Interviews to Software Requirements: Evaluating LLM Performance in Requirement Generation,” *Proceedings of the 28th Workshop on Requirements Engineering (WER2025)*, DOI [10.29327/1588952.28-12](https://doi.org/10.29327/1588952.28-12); [official proceedings entry](https://werpapers.dimap.ufrn.br/proceedings/WER2025/wer202511.html), [PDF](https://www.werpapers.dimap.ufrn.br/papers/WER2025/wer202511.pdf). Indexed descriptions identify a ChatGPT-4/DeepSeek-V3 comparison on functional and non-functional requirements from two interview-transcript cases; they report ambiguity/categorization challenges. | Official page/PDF could not be fetched in this environment (DNS lookup failure). Metrics, dataset details, method, and meaning of “efficiency” could not be verified from the full paper. The indexed account does not establish source-turn traceability, speaker attribution, contradiction handling, or approval controls. | **Retain** as directly relevant research; **revise** evidence status to “bibliography and indexed summary located; full-text appraisal pending.” |
| Manual elicitation structuring | The CLI README describes a stakeholder interview followed by a BA/PO filling a Markdown requirements template; [input template](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/tools/requirements-structuring-cli/templates/requirements-input.md) expects use-case metadata, actors, preconditions, flows, and business objects. | This is an existing manual path, not evidence of its time, error rate, or user value. The template does not capture transcript turn IDs, timestamps, or speaker provenance as a required field. | **Retain** as the known baseline; do not assert measured manual effort or benefit. |
| Current Requirements CLI contract | [README](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/tools/requirements-structuring-cli/README.md) documents `init`, `detect`, `structure`, `transform`, and `pipeline`; its pipeline starts at `requirements-input.md` and adds review gates. The [parser](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/tools/requirements-structuring-cli/src/parser.js) reads Markdown basic/alternative/exception flows and preserves raw input. | No maintained transcript import/extraction command was found. A preprocessor would need a deliberately defined handoff into the existing Markdown contract; “feeds the CLI” does not currently mean raw transcript compatibility. | **Retain** the existing CLI as a downstream consumer; **revise** integration acceptance to require an explicit, reviewed handoff contract. |
| Existing source anchoring | [Source traceability docs](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/tools/requirements-structuring-cli/docs/source-traceability.md), [implementation](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/tools/requirements-structuring-cli/src/source-traceability.js), and [tests](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/tools/requirements-structuring-cli/tests/source-traceability-tests.js) show explicit or positional source IDs, original-line reattachment, and rejection of missing/malformed/unknown IDs. | The docs explicitly say a wrong-but-valid ID can pass, source membership does not prove complete coverage, and one source ID per step cannot represent multi-source derivation. It anchors already-articulated requirement lines, not transcript turns or speaker identity. | **Retain** the mechanism as reusable downstream provenance; **revise** any proposal that treats it as transcript-level validation or extraction quality evidence. |
| Human review and safe data boundary | The CLI README says each phase has a review gate. [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482) is closed/completed with its accepted walkthrough preserved; [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566) and [the v2.5 plan](https://github.com/mirichard/pm-tools-templates/blob/8078fdd24db8e9d274a5922c1db00c051f708663/research/v2.5-discovery-plan.md) state that #1482 is not repeated and preserve #1379's accepted PUB-ALMMSN-01 evidence-sufficiency finding (owner-confirmed for v0.1 at revision `0dc4f6b071eaffa46a6458c3ac034acadd857f2a`; see [#1379](https://github.com/mirichard/pm-tools-templates/issues/1379) and [accepted preparation PR #1389](https://github.com/mirichard/pm-tools-templates/pull/1389)). | Existing CLI phase approval is not an explicit transcript-candidate approval contract. No unsanitized transcript intake, participant outreach, or new permissions are authorized. #1379's source sufficiency is unrelated and must not be re-run or represented as validation for #1160. | **Retain** the completed #1482 acceptance and #1379 evidence unchanged; **defer** real transcript handling and any new intake or permissions. |
| Portfolio and related work | #1566's October 30 instruction says #1159–#1162 remain deferred candidates and asks for linked issue-specific reports, not duplicated child investigations. Its current WIP portfolio PR is [#1597](https://github.com/mirichard/pm-tools-templates/pull/1597); issue-specific research PRs #1621/#1622 cover siblings. The current #1160 research PR is [#1620](https://github.com/mirichard/pm-tools-templates/pull/1620). | Historical “enables #1161/#1162” is not an explicit current dependency. The sibling candidates do not establish this item's priority or readiness. | **Retain** cross-links and portfolio coordination; **defer** dependency or sequencing claims unless owner confirms them. |

### Historical target disposition

The spike comment also proposed `<30s` processing, `>85%` precision, `>60%` adoption, and `>50%` manual-review time reduction. None has a denominator, representative corpus, baseline, measurement protocol, or owner-confirmed acceptance threshold in the inspected maintained assets. These targets are **not silently discarded**: owner decision is needed to retain, redefine, or withdraw each before they can become acceptance criteria. No model/library choice follows from the reported metrics.

## Proposed synthetic validation fixture

**Status:** Proposed only; not run through an extractor and not human-accepted. Text is invented for this report. IDs are stable fixture turn IDs, not real timestamps or people.

| Turn | Speaker | Synthetic utterance |
|---|---|---|
| T01 | Facilitator | “What should the dashboard do when a task is late?” |
| T02 | Analyst | “It should notify the owner when a task becomes overdue.” |
| T03 | Operations | “No email, please; we already get too many. An in-app notice is enough.” |
| T04 | Analyst | “Actually, owners must not receive any notification for overdue tasks.” |
| T05 | Product owner | “That conflicts with T02. I have not decided whether notice is required.” |
| T06 | Operations | “Show late tasks on the dashboard too.” |
| T07 | Product owner | “Show overdue work on the dashboard.” |

**Expected review behavior (proposal, not extractor output):**

| Candidate / disposition | Source anchor(s) | Reason to retain for review |
|---|---|---|
| Candidate with unresolved subject: “[It/system?] should notify the owner when a task becomes overdue.” | T02, speaker Analyst | Preserve the exact quote and speaker; do not resolve “it” or elevate to an approved requirement. |
| Candidate preference/constraint: “No email; an in-app notice is enough.” | T03, speaker Operations | Preserve the negative channel preference; clarify whether an in-app notice is required and whether “enough” is a decision. |
| **Conflict; abstain from resolution** between T02 and T04; T05 explicitly says undecided. | T02, T04, T05 | Keep both opposing source statements and mark unresolved; no majority vote or model confidence can settle the decision. |
| Candidate: “The dashboard shall show overdue tasks.” | T06, T07 | Potential near-duplicate; link both turns for human comparison. Deduplication must not erase the distinct T06/T07 wording or imply agreement. |
| **Not a requirement:** T01 is a question, not a stakeholder commitment. | T01 | Do not convert elicitation prompts into requirements. |

**Proposed test assertions:** preserve exact source spans and speaker labels; distinguish question, positive, negated, tentative, and contradictory statements; do not resolve contradiction; group possible paraphrases without silently merging or dropping sources; mark every output as a candidate; require an explicit human accept/reject/edit decision before any approved requirement is exported. A human reviewer should confirm the fixture's expected labels before it becomes a golden test.

**Executed checks:** repository assets and CLI contracts above were inspected at base revision `8078fdd24db8e9d274a5922c1db00c051f708663`. No extraction, benchmark, or acceptance check was executed. The repository Markdown/anchor checker completed; it reported five broken anchors elsewhere in the repository and no broken anchor links for this report. Its generated `link_health_report_filtered.txt` was restored and is not part of this change.

## Conditional candidate issue draft

**Provisional title:** `[Research candidate][Requirements] Prototype source-anchored transcript candidates with synthetic fixtures`

**User outcome:** A BA/PO can inspect transcript-derived candidate requirements with exact source-turn and speaker references, unresolved states visible, and explicit human approval before candidates are handed to the existing Requirements CLI.

**Scope:** One offline, synthetic-only prototype or contract slice. Define a transcript-turn input shape and a candidate output/handoff that preserves original utterance, turn ID, optional speaker label, and candidate state. Exercise ambiguity, negation, contradiction, question/non-requirement, speaker attribution, duplicate/near-duplicate utterances, and accept/reject/edit. Export only human-approved text into the existing Markdown input contract.

**Exclusions:** Real or sensitive transcript intake; transcription/audio integrations; diarization; APIs or new permissions; participant outreach; telemetry; training/fine-tuning; automatic approval; unreviewed resolution of contradiction; release commitment. Do not select spaCy, a transformer, or an API from unsupported historical comparison numbers.

**Observable acceptance criteria (proposed):**

1. Synthetic transcript fixture inputs have stable turn IDs and clearly labeled speaker fields; no real transcript is used.
2. Each emitted candidate preserves its verbatim source text and source-turn reference; uncertain, negated, contradictory, and question-only turns remain visibly distinct for review.
3. Contradictions are surfaced, not silently reconciled; likely duplicates remain linked to all source turns and are not destructively merged before review.
4. No candidate is represented as approved. A human can accept, reject, or edit each candidate; only accepted text is exportable to the existing CLI Markdown contract.
5. Offline tests assert the fixture cases and output contract. Any precision/recall, speed, adoption, or time-saved threshold is separately defined and measured against a documented gold set before being claimed.

**Validation method:** deterministic offline fixture tests first; then a separately approved evaluation protocol with labeled source spans, independent adjudication, predeclared metrics, and human review. Passing synthetic tests demonstrates behavior on those fixtures only, not real-world accuracy or user value.

**Dependencies / owner gaps:** owner chooses whether to retain this candidate and resolves the historical success-target disposition; requirements owner confirms candidate-vs-approved wording and output format. Paper applicability remains open (especially RE-COVER). No confirmed implementation owner, dependency sequencing, capacity, or milestone. No explicit native dependency on #1161/#1162 was identified. Reuse existing CLI source traceability; do not duplicate it or the #1566 portfolio work.

**Effort range (planning assumption only, not an estimate or commitment):** 3–5 person-days for a synthetic-only contract/prototype and offline fixture tests, assuming no user interface, no external model/API, no real transcript processing, and direct reuse of CLI Markdown handoff. Re-estimate if the owner selects a model, adds review UX, broadens the evaluation, or requires real-data controls.

**Decision:** This draft is not ready to create or schedule until the owner selects the scope and resolves the evidence/target gaps. It is an alternative candidate, not part of #1107 or its completed v1.2 work.

## Promotion criteria

| State | Minimum evidence and decision |
|---|---|
| **Research complete / backlog candidate** | Verify primary paper claims or record access limitations; document the user/problem evidence and existing manual/CLI baseline; choose bounded outcome and exclusions; define fixture, validation, dependencies, risks, and a defensible estimate range; record Michael Richard's disposition. A checked report or WIP PR alone does not promote the issue. |
| **Sprint-ready** | Owner-selected leaf scope; named delivery owner; acceptance criteria and validation method accepted; source/format/model choices resolved; dependencies sequenced; estimate reviewed; privacy/intake controls satisfied for any chosen data; capacity confirmed for the actual sprint. |
| **Owner-selected / scheduled** | Explicit owner decision and sprint/milestone selection. Research authorization, historical GO comments, this report, and PR merge do not imply this state. Do not mark the issue or project stage Done or sprint-ready. |

## Proposed issue/PR update text if write access is unavailable

**Proposed concise issue comment:**

> Research report prepared in [PR #1620](https://github.com/mirichard/pm-tools-templates/pull/1620). Recommendation: retain #1160 as an unscheduled candidate, but treat the historical GO and spaCy performance claims as unverified pending full-text appraisal and a reproducible evaluation. The maintained CLI starts from structured Markdown requirements; it has source-line traceability, not transcript ingestion or transcript-level extraction validation. The report proposes a synthetic-only, source-anchored candidate fixture and a conditional prototype scope. No implementation, release, schedule, or target threshold is approved. Michael Richard's decision is requested on whether to retain this bounded candidate and whether to keep, revise, or withdraw the historical accuracy/adoption/time-saving targets. #1482 acceptance and #1379 source-sufficiency evidence are preserved; no project stage change is proposed.

**Write-access status (checked 2026-10-30):** GitHub MCP access here is read-only for issue/PR metadata, and the browser page is unauthenticated. The progress tool can push this branch and update its checklist, but no available tool can edit the PR relationship suffix or post an issue comment. The current PR body has a generated `Fixes #1160` suffix. **Required PR edit:** replace that suffix with `Refs #1160`; do not merge or close the issue. The exact proposed issue comment is above. No project field or stage update is proposed.

## Verification record

- **Executed:** repository inspection at the PR base revision; issue status, comments, relationships, and relevant PRs checked using GitHub API tools; CLI source/input/traceability contracts read directly.
- **Not executed:** transcript extraction, accuracy/latency evaluation, user research, human acceptance of the proposed fixture, or real-data intake.
- **External access limitation:** Bibliographic records and indexed abstract summaries were found for both papers, but direct fetches of IEEE, arXiv, WER proceedings, and the WER PDF failed or timed out. Detailed methods, exact findings, limitations, and applicability therefore remain unverified; follow-up full-text appraisal is required before relying on either paper's claims.
- **Documentation checks:** `python3 check_anchor_links_filtered.py` completed successfully (exit 0); it reported five broken anchors elsewhere in the repository and no broken anchor links for this report. `git diff --check` passed. Documentation checks validate repository anchors/format only; external paper links were not independently fetched and research claims are not validated by these checks.

## Four-point closeout

- **Recommended next step:** Michael decides whether to retain the conditional synthetic-only candidate.
- **Research completed:** current CLI contract, issue status, historical claims, accepted evidence, and candidate validation design reviewed.
- **Remaining gaps:** full-text appraisal for both sources, independent fixture approval, metric definitions, and delivery estimate/capacity.
- **Owner decision required:** retain/revise/defer the candidate and explicitly disposition historic success targets; no schedule or implementation selected.
