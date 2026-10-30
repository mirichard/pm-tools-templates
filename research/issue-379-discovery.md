# RAID Log Auto-Starter — discovery for #379

Research snapshot: **2026-10-30**. Refs mirichard/pm-tools-templates#379.
Accountable owner: **Michael Richard (@mirichard)**; Copilot: research/preparation only.
Disposition proposed: **revise to one bounded, human-reviewed deterministic candidate; defer broader automation**.
No implementation, delivery acceptance, scheduling, issue closure or release selection is asserted.

## Decision brief

Recommend preparing a source-linked, deterministic RAID candidate draft from sanitized synthetic Markdown/text, not implementing the historical epic. The remaining user outcome is a reviewable starting point with evidence, rather than another blank log or an automatically approved risk assessment.

The maintained RAID template already distinguishes risks, assumptions, issues and dependencies. Existing requirements-CLI code offers parser-owned source catalogs and rejection of unknown source IDs, but explicitly cannot establish semantic correctness or completeness. The web MVP renders supplied risk data; that is not document extraction. #366's completion comment describes a different repository, whose source could not be accessed here. Its reported accuracy and time savings do not validate this repository's input contract.

Use explicit clauses and versioned rules first; treat library suggestions as questions, not document-derived facts. AI extraction could broaden phrasing coverage, but schema compliance cannot establish correct classification, faithful anchors or completeness. No model calls, installation, restoration or comparative experiment were performed.

Reuse #367 for canonical mapping and #1161 for taxonomy/scoring research. The RAID template's 1–3 scoring scale is not interchangeable with historical #1161 proposals; leave probability, impact, priority and mitigation unset unless explicitly supplied and reviewed. Preserve #1482's accepted walkthrough and #1379's accepted source-sufficiency evidence without repeating either investigation.

Uncertainties remain: reusable #366 contract, adjudicated examples, owner-approved taxonomy, reviewer availability, safe export behavior and user value. Michael Richard should choose further fixture/contract preparation, revision or deferral, and decide whether this is stronger than #367's other slices. This report does not select delivery or supersede portfolio WIP/capacity gates.

## Evidence basis and decision precedence

Repository observations below use inspected checkout
[`4dcd8202c99849a6eea7e64b919ef1b657626bb1`](https://github.com/mirichard/pm-tools-templates/commit/4dcd8202c99849a6eea7e64b919ef1b657626bb1).
Paths in the matrix link to immutable sources, not generated catalog claims. Code/test inspection is not execution evidence.

- [#379](https://github.com/mirichard/pm-tools-templates/issues/379): live body, comments and native relationships read. No comments or children returned; native parent is [#365](https://github.com/mirichard/pm-tools-templates/issues/365). Michael Richard and Copilot are co-assignees. October 30 research authorization and September 24 unscheduled disposition control over historical dates and checked “Definition of Done.”
- [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566) and [discovery plan](../research/v2.5-discovery-plan.md): compare #367/#379–#381 before choosing one deterministic slice. The two-investigation limit and unconfirmed 8–12 research person-days remain; a batch assignment does not establish additional capacity. Portfolio synthesis belongs to [PR #1597](https://github.com/mirichard/pm-tools-templates/pull/1597), not this report. Its draft report was inspected; it is not owner acceptance. Project 13's workflow credential read limitation remains reported, not evidence of an empty queue.
- [#367](https://github.com/mirichard/pm-tools-templates/issues/367) / [PR #1599](https://github.com/mirichard/pm-tools-templates/pull/1599): mapping/input-contract coordination. No changed files returned for that PR at inspection; do not assume its report or mapping is delivered. Keep that investigation separate.
- [#1161](https://github.com/mirichard/pm-tools-templates/issues/1161): read all four comments. [Accepted correction](https://github.com/mirichard/pm-tools-templates/issues/1161#issuecomment-5901454254), merged at [`686f0cbf0774ad22d67122badcc3f555514fdefc`](https://github.com/mirichard/pm-tools-templates/tree/686f0cbf0774ad22d67122badcc3f555514fdefc/research/1161-risk-scoring-engine), supersedes September 18 GO/schedule/benefit claims. Reuse its [evidence ledger](../research/1161-risk-scoring-engine/evidence.md) and [gated scope](../research/1161-risk-scoring-engine/scope-and-acceptance.md). Documentation acceptance did not approve the taxonomy, formula or implementation. [PR #1621](https://github.com/mirichard/pm-tools-templates/pull/1621) is ongoing research; no changed files returned at inspection. Do not duplicate its scoring task.
- [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482): closed/completed walkthrough acceptance is preserved. No repeat walkthrough is proposed; formal UAT and restricted-original controls remain separate.
- [#1379 accepted preparation/merge record](https://github.com/mirichard/pm-tools-templates/issues/1379#issuecomment-5901958597): source sufficiency remains accepted; accepted head `13ea34cc71ed477ee2deac3b8a2b5f0584bb4dae` merged into the research branch at `f23605d320c0972c51cb58f04aa7dd1cd552d54c`, not main. Independent reference judgments, realism review, participant/adjudicator arrangements and frozen comparison controls remain outstanding. Link [ongoing PR #1619](https://github.com/mirichard/pm-tools-templates/pull/1619), rather than repeat source searches or authorize outreach.
- [Current PR #1611](https://github.com/mirichard/pm-tools-templates/pull/1611) is the focused research vehicle. Its body uses `Refs #379`; the issue API nevertheless returned it under closing-PR metadata. This metadata is not authorization to close #379. Retain non-closing references and verify linkage before any owner merge.

### Capability, evidence and gap matrix

All dispositions below are recommendations for owner review, not changes to epic acceptance.

| Capability / historical requirement | Inspected evidence | Remaining gap / dependency | Disposition |
|---|---|---|---|
| Four distinct RAID record types | [Canonical RAID source, lines 43–119](https://github.com/mirichard/pm-tools-templates/blob/4dcd8202c99849a6eea7e64b919ef1b657626bb1/domains/delivery/templates/traditional/Traditional/Templates/raid_log_template.md#L43-L119) has four tables, owners and statuses. Its overview calls dependencies external, while its table explicitly allows internal/external. | Agree classification and ambiguity rules; internal dependencies must not be excluded by that overview shorthand. | **Retain** maintained tables; **revise** extraction contract, not template content in this PR. |
| SOW/Charter input | [Canonical Charter, assumptions/constraints](https://github.com/mirichard/pm-tools-templates/blob/4dcd8202c99849a6eea7e64b919ef1b657626bb1/domains/planning/templates/traditional/Traditional/Process_Groups/Initiating/project_charter_template.md#L122-L160); [#366 completion comment](https://github.com/mirichard/pm-tools-templates/issues/366#issuecomment-3469807566) names external repository commits `4586afa`, `6589ab0`, `536a32f`. | GitHub read of that repository's `development/tools/sow-parser` returned 404 (missing/inaccessible is unresolved). No independently inspected parser contract or verified migration. #367 owns reuse validation. | **Retain** closure of #366; **revise** assumption that closure proves local integration. Restrict proposed slice to sanitized synthetic text; **defer** PDF/Word/original intake. |
| Source-grounded extraction and uncertainty | [Parser lines 97–108](https://github.com/mirichard/pm-tools-templates/blob/4dcd8202c99849a6eea7e64b919ef1b657626bb1/tools/requirements-structuring-cli/src/parser.js#L97-L108) keeps original lines and explicit/fallback IDs; [traceability module](https://github.com/mirichard/pm-tools-templates/blob/4dcd8202c99849a6eea7e64b919ef1b657626bb1/tools/requirements-structuring-cli/src/source-traceability.js#L1-L58) rejects duplicate catalog IDs and unknown references. | Requirements flows are not SOW RAID clauses. Module comments explicitly warn that valid IDs can still be wrong and sources omitted. Need document revision, line/span anchors, quote verification and semantic review. | **Retain** provenance pattern; **revise** for RAID, without claiming existing code implements extraction. |
| Stable IDs, duplicates and reruns | [Existing provenance tests](https://github.com/mirichard/pm-tools-templates/blob/4dcd8202c99849a6eea7e64b919ef1b657626bb1/tools/requirements-structuring-cli/tests/source-traceability-tests.js) describe source retention and ID validation, not RAID deduplication. | Distinguish duplicate source IDs (invalid input) from repeated evidence (valid). Reworded, contradictory or cross-type items need human disposition; edits invalidate old anchors. | **Revise** with proposed identity/review rules below. |
| Traditional template mapping and generation | [Legacy RAID path](https://github.com/mirichard/pm-tools-templates/blob/4dcd8202c99849a6eea7e64b919ef1b657626bb1/templates/traditional/Traditional/Templates/raid_log_template.md) is navigation-only; canonical source above is maintained. [Web MVP risk renderer](https://github.com/mirichard/pm-tools-templates/blob/4dcd8202c99849a6eea7e64b919ef1b657626bb1/web-mvp/src/templates/risk.md.ts#L1-L20) formats supplied risk objects and fractional probability as a percentage. | Renderer neither extracts RAID nor provides approval/source-anchor fields. Generated output, sample rows and legacy pointers are not additional maintained libraries or acceptance evidence. #367 must agree mapping and representation/escaping. | **Retain** canonical source; **revise** mapping proposal; do not extend the renderer here. |
| Industry/project-specific risk libraries; “50%+” accuracy uplift | [#1161 corrected inventory and claims ledger](https://github.com/mirichard/pm-tools-templates/blob/686f0cbf0774ad22d67122badcc3f555514fdefc/research/1161-risk-scoring-engine/evidence.md) separates templates from a validated taxonomy or scoring engine. | No validated extraction library established by inspected assets. Paper-derived 27-variable claims require source-content/reuse/applicability verification; its synthetic results are not real-world predictive accuracy. | **Defer** library delivery and uplift claim; retain as unmeasured hypothesis. Library hints must be labeled unsourced prompts, never extracted facts. |
| Categorization / priority scoring | [RAID scoring guide](https://github.com/mirichard/pm-tools-templates/blob/4dcd8202c99849a6eea7e64b919ef1b657626bb1/domains/delivery/templates/traditional/Traditional/Templates/raid_log_template.md#L63-L105) uses 1–3 probability/impact, maximum 9, and a distinct issue-priority guide. #1161 preserves unapproved historical alternatives. | No approved shared scale, missing-input, tie or sensitivity policy. Text classification cannot infer calibrated probability or impact. #1161 owns method research. | **Retain** explicit record types; **defer** automatic ranking and compliance claims. Unknown values stay unknown, never default to zero/low. |
| Human approval / internal-external views | RAID source has review history but no extraction approval state; #379 proposes dual views. | Need candidate-level accept/edit/reject/needs-context decisions and disclosure policy. A source excerpt can itself disclose content; approval is not export permission. | **Revise** to local reviewer-only draft; **defer** audience projections and external publication. |
| Mitigation, real-time updates and analytics | Historical #379 requirements; inspected template provides manual fields and summary counts, not verified autonomous services. | No approved knowledge-base recommendation method, live data contract, permissions or effectiveness evaluation. | **Defer** all automation, integrations, telemetry and predictive claims. Retain manual management guidance. |
| Coverage, consistency, adoption and efficiency | Historical #379: 80%+ relevant items, 50%+ library uplift, comprehensive coverage, consistency and saved setup time. Historical #366 reports 100% accuracy and 95% savings elsewhere. | No adjudicated corpus, denominator, baseline, timing protocol or independent results for this task. | **Retain** as hypotheses, **revise** measurement as below; none is achieved or silently deleted. |

### Method comparison and accessible primary examples

Accessed **2026-10-30**. Direct fetches of spaCy's rule-matching page, OpenAI's structured-output guide and the UK Orange Book failed DNS lookup; that does not refute their content. GitHub primary-source reads succeeded for the two sources below. No Orange Book/standards-compliance assertion is made. Neither library nor provider was installed or invoked.

| Option / primary example | What the inspected source establishes | Applicability and limitation for #379 |
|---|---|---|
| Existing JavaScript rules / curated phrase library | Repository parser/source-catalog mechanisms above are inspectable. | Lowest integration novelty for a small explicit-clause baseline. Proposed deterministic RAID rules still need definition and tests; headings/keywords alone do not prove meaning. Rule libraries are not predictive risk libraries. |
| spaCy `Matcher` | [Official documentation source](https://github.com/explosion/spaCy/blob/15fbf5ef36689d925549d96cb9b9469b5140d7bb/website/docs/usage/rule-based-matching.mdx), last path commit 2024-10-23; inspected file blob `8632f4573eb85c8510573b2f85855b7e445833de`. Shows token-attribute patterns and warns tokenization must match patterns. | Example 1: match an explicit assumption cue with its surrounding clause. Hand-authored lexical rules can be deterministic; rules relying on predicted linguistic annotations introduce model dependencies. Not a prebuilt RAID classifier. |
| spaCy `PhraseMatcher` | Same official source distinguishes terminology-list matching and case-insensitive `LOWER` matching. | Example 2: find a curated vendor-approval phrase. Useful candidate retrieval, not proof of dependency, negation handling or domain coverage. Would add a Python stack; no dependency is justified for this research PR. |
| AI structured summarization / extraction | [OpenAI official cookbook](https://github.com/openai/openai-cookbook/blob/20793784ac467f06ed67f3e3e9349dc9596894e0/examples/Structured_Outputs_Intro.ipynb), last path commit 2026-07-14; inspected blob `dc66684e9f20e03188c75104676d783e8a923c23`. Example 2 summarizes synthetic articles to a schema; example 3 extracts product preferences. | Examples 3–4: structured candidate fields and entity extraction are plausible adaptations, not RAID evidence. Schema-constrained structure does not prove truthful quotes, correct type or recall. The notebook documents refusal handling; its model-availability text is not a current deployment recommendation. No API credentials, model selection or live comparison authorized here. |

Recommendation: retain an explicit-rule baseline and abstention path; defer AI execution. An eventual separately authorized comparison would freeze identical synthetic inputs, rule/library versions, model/prompt/retry settings, source-validation checks and human reference labels. Treat embedded instructions as document data, never tool commands. Invalid anchors, refusal, truncation or malformed output must fail to a visible review state, not silently produce an empty “successful” RAID log. No training or #1329 restoration follows.

## Synthetic worked example and proposed evidence fixture

**Hand-authored illustration, not extractor output, executable test results or human acceptance.**
Fictional SOW/Charter `SYN-379`, revision `synthetic-v1`, section `Delivery conditions`.
The following eight numbered source lines are the complete fixture; labels are explicit source IDs, not inferred facts:

```text
S01: If the test environment is delivered after day 10, integration testing may slip.
S02: Planning assumes that the vendor sandbox will remain available through day 20; this is unverified.
S03: The integration test environment is unavailable today and testing is blocked.
S04: Integration testing cannot start until Vendor V supplies a sandbox on day 10.
S05: Integration testing cannot start until Vendor V supplies a sandbox on day 10.
S06: No current issue has been reported for the training workstream.
S07: Approval is pending.
S08: The vendor sandbox is confirmed unavailable through day 20.
```

### Proposed reference judgments

These are author proposals awaiting an independent, owner-approved reviewer/adjudicator, not a gold standard.

| Source anchor | Proposed classification / candidate | Reason, uncertainty and handling |
|---|---|---|
| `SYN-379@synthetic-v1:L1 / S01` | Risk `R-01` | Conditional future event and schedule effect. Keep exact quote; probability/impact/score/mitigation/owner remain null. “May” is not a numerical likelihood. |
| `…:L2 / S02` | Assumption `A-01` | Explicit unverified planning premise. Validation required; not marked validated from source presence. |
| `…:L3 / S03` | Issue `I-01` | Present observed blockage in the fictional source, not a future risk. Source reports it; no independent operational verification. |
| `…:L4–L5 / S04,S05` | Dependency `D-01`, two evidence anchors | Explicit provider, prerequisite and consumer. Exact duplicate text in the same revision yields one candidate with both anchors. “Day 10” stays source-relative, not an invented calendar deadline. |
| `…:L6 / S06` | No positive issue candidate | Negated statement, not proof that all issues are absent. Record “no explicit positive candidate,” never “risk-free.” |
| `…:L7 / S07` | Needs context; withhold type | Missing approver, consumer, object and effect; do not force a dependency or issue label. Reviewer may request clarification without outreach in this assignment. |
| `…:L8 / S08` | Issue candidate `I-02`; conflict link to `A-01` | Claimed current unavailability conflicts with the planning premise. Preserve both, flag contradiction; no silent replacement or automatic validation of either. |

`R-01`, `I-01` and `D-01` concern related testing work, but are not interchangeable duplicates. Do not merge across types merely because “environment” or “sandbox” overlaps. Any inference that the two environments are identical requires human review. Keep cross-type relationships distinct from deduplication decisions.

### Proposed candidate contract and safety invariants

- Input: sanitized synthetic text only, immutable document ID/revision, section and explicit clause IDs, plus original text with line/span map. Reject duplicate clause IDs, missing revision, empty/unsupported input or stale spans visibly. No binary conversion, uploads, original intake or network calls.
- Candidate: stable ID, proposed type or `needs-context`, description, exact source quote(s), document revision/line spans, rule ID/version, extraction basis (`explicit-clause` versus separately labeled `library-prompt`), uncertainty reason, related/duplicate/conflicting candidate links and review state. A library prompt without a source cannot masquerade as an extracted record.
- Verify quotes/spans against the parser-owned source, not model-generated source text. Preserve source/derivation metadata alongside any reviewed template mapping; do not overload an operational owner/status field with extraction confidence.
- Review starts `pending`; reviewer records accept/edit/reject/needs-context, rationale and source version. Operational dates, owner, probability, impact, priority and mitigation stay null unless supported and explicitly confirmed. No invented reviewer identity or automated approval.
- Exact duplicate key: same source revision, proposed type and full normalized clause text; preserve every original quote/anchor. Normalization may remove layout whitespace, not negation, dates, party names or numbers. Semantic near-duplicates and conflicting statements require review; record merge rationale and retain original candidates.
- Same unchanged input and rule version must yield identical candidate IDs/order and not append duplicates. New source revisions require re-extraction/reconciliation; earlier approvals do not automatically carry over. No overwriting accepted records or silent disappearance of removed-source candidates.
- Keep export disabled in the initial contract proposal. Any later Markdown/CSV mapping needs escaping for pipes, newlines, HTML and spreadsheet-formula-leading text, plus disclosure review; a renderer name containing “safe” is not evidence that these protections exist.

### Proposed validation versus executed work

**Proposed, not run:** freeze the eight-line fixture and independent judgments; exercise all four types, negation, ambiguity, conflicts, exact/near/cross-type duplicates, missing/duplicate IDs, source edits, CRLF/Unicode offsets, malformed input, embedded instructions and hostile export text. Confirm identical reruns and invalidate stale approvals. A second paraphrased fixture should expose rule blind spots rather than tune only to these eight lines. Unknown reference judgments must remain unresolved, not counted as correct.

Evaluate per-type precision (`correct accepted type+anchor matches / emitted candidates`) and recall (`matched reference items / adjudicated reference items`), with documented one-to-many matching/deduplication and separate abstention/unresolved counts. Quote fidelity, type correctness, unsupported-field rate, reviewer corrections and review effort need separate measures. An 80% aggregate could hide failure on an entire class; report counts and denominators per type. This small authored fixture cannot substantiate the historical 80% target.

For the historical 50% library uplift, first specify what “accuracy” means, a generic baseline, fixed unseen examples and whether improvement is relative or percentage points; compare precision/recall and review burden, not added item counts. For setup-time savings/consistency/adoption hypotheses, require an owner-approved manual baseline, equal task/quality conditions, correction time and a permitted observation method. No participants, telemetry or measurements were collected; no measured benefit, coverage, compliance or predictive claim is made.

**Executed in this assignment:** live GitHub issue/comment/relationship and active-PR reads; repository template/code/research inspection; primary-source documentation reads through GitHub. Documentation check results are recorded in the validation section below. No extractor, scoring engine, live AI, participant study, acceptance fixture or UAT was executed.

## One bounded candidate draft — not an issue creation or delivery selection

**Proposed title:** Source-linked, reviewer-gated RAID draft from explicit synthetic clauses.

- **User outcome:** a PM can review source-backed starting candidates without confusing future risk, unverified premise, current issue or prerequisite, and can trace each judgment back to its source.
- **Scope:** explicit-clause deterministic baseline, versioned source/candidate contract, local review dispositions and repeatable synthetic fixtures. Use existing canonical tables only through an agreed #367 mapping. First refine this packet under #379; create a linked leaf task only after owner disposition. No native children were returned for #379, and the inspected #367/#1161 PRs do not establish an existing delivery leaf. Recheck before creating anything.
- **Exclusions:** AI execution/restoration, predictive models, automated scoring/mitigation, industry libraries, binary/original-file intake, production UI, external views/export, integrations, analytics and real-time tracking.
- **Observable proposed acceptance:** all four record types represented on the agreed explicit fixtures; every emitted document-derived candidate resolves to exact revision/quote/span and explains its rule; all outputs start pending; unsupported attributes remain null; negation and ambiguous clauses do not become false positive approved records; duplicate evidence preserves all anchors; conflicts and semantic duplicates require recorded human decisions; unchanged reruns are identical; revised sources cannot silently reuse approval. Malformed inputs produce actionable failures rather than apparent success.
- **Validation method:** owner-approved independently reviewed fixture labels plus deterministic contract tests, source-fidelity checks, repeat-run comparison and a local review walkthrough after relevant unit tests. Include negative/adversarial cases above. This is future validation specific to RAID, not repetition of #1482 or formal UAT.
- **Dependency/owner gaps:** Michael Richard must authorize the bounded direction and name a delivery owner and independent reviewer; #367 must settle input reuse/canonical mapping; #1161 retains scoring/taxonomy decisions outside this slice. No reference set, agreed review mechanism, confirmed capacity or implementation acceptance exists yet.
- **Effort scenario, not an estimate commitment:** **3–6 person-days**, assuming one implementer familiar with existing JavaScript tooling, reviewer availability, text-only input and no production UI/export: 1–2 days contract/fixture agreement, 1–2 explicit-rule/review-draft work, 1–2 tests and adjudication. Source-contract changes or unavailable reviewers require re-estimation; review waiting time and portfolio coordination are excluded. This does not reserve any of #1566's research capacity or alter sprint/milestone commitments.

Do not open a second scoring or mapping task: continue those concerns in #1161 and #367. The broader epic remains open with residual features explicitly deferred, not discarded.

## Promotion and owner decision

| State | Required evidence | Present disposition |
|---|---|---|
| Backlog-ready bounded candidate | Recorded problem/user evidence standard and results, maintained-asset inventory, bounded outcome/exclusions, feasible option, reference fixture/acceptance proposal, dependencies, effort assumptions and owner proceed/revise/defer decision. | Inventory and a proposal exist; independent labels, user-value evidence, reusable input contract and owner disposition are missing. **Not promoted.** |
| Sprint-ready leaf | Named implementation/review owners, agreed contract, independently testable leaf scope, approved acceptance/validation, resolved or explicitly sequenced dependencies and reviewed estimate. | Missing. Research assignment/co-assignment and PR merge are not readiness evidence. |
| Owner-selected | Explicit Michael Richard selection against a sprint goal, confirmed capacity after research allocation and recorded sequencing/WIP decision. | Not selected; no stage, sprint or milestone updates made. |

### Publication and exact proposed updates

This report is the only issue-specific file change. Existing [PR #1611](https://github.com/mirichard/pm-tools-templates/pull/1611) is used; no new PR or auto-merge is requested. Keep `Refs mirichard/pm-tools-templates#379` in its description, not a closing keyword. Link #1599/#1621/#1597 for related research.

Available tools can publish this branch/PR progress but do not expose a new issue-comment or project-field write operation. No issue/project write is claimed. Proposed issue comment, ready for an authorized maintainer to post:

> Research report: [research/issue-379-discovery.md](https://github.com/mirichard/pm-tools-templates/pull/1611/files), Refs #379. Recommend revising to one source-linked, reviewer-gated deterministic synthetic-text slice; defer scoring to #1161 and mapping/input reuse to #367. Preserved #1482 acceptance and #1379 source sufficiency. No implementation or performance validation was performed. Remaining gates: reusable input contract, independently adjudicated fixtures, user-value evidence, reviewer/delivery ownership and capacity. Michael Richard: choose further bounded preparation, revision or deferral. No delivery, closure or release acceptance is requested.

Proposed project update: **retain current stage/priority/sprint/milestone and both assignees**; add evidence link to PR #1611 and next-action text: “Owner disposition of bounded RAID candidate; resolve #367 input contract and independent review arrangements before promotion.” Project 13 live stage was not independently read here; do not infer it or mark Done/sprint-ready. Coordinate any WIP decision in #1566, without granting more permissions.

## Documentation validation

Only this Markdown report changes; no production code, dependencies, template metadata, paths or generated index change. Applicable checks: the existing `check_anchor_links_filtered.py` checker (targeted report then repository scan, invoked without its report-file write side effect) and `git diff --check`. No new testing tool or standalone fixture file is added. Product extraction tests above remain proposals.

Executed 2026-10-30:

- Existing `LinkHealthChecker.check_file` on this report: **0 broken anchors**. The report has no same-document anchor links; this is not validation of external URLs.
- Existing `LinkHealthChecker.run_check` on the repository: **1,385 Markdown files, 5 broken anchors**, all in unchanged `docs/principles/anti-patterns.md` (lines 10, 11, 13, 15, 16). No changed-report findings. Invoked the existing class through Python, suppressing the CLI's generated report-file write; full output kept outside the repository in `/tmp/issue-379-anchor-check.log`.
- Manual artifact checks: **248-word decision brief**, all **3 local Markdown evidence links resolve**, and whitespace check of the added report passed.
- Secret scan of `research/issue-379-discovery.md`: **no secrets detected**.

No application builds/tests were run for this documentation-only change. The anchor checker does not verify remote source availability or classification correctness; successful GitHub reads and explicit access failures are reported separately above.

## Owner handoff

- **Recommended next step:** review the one bounded deterministic candidate alongside #367's alternatives.
- **Research completed:** maintained-asset/decision inventory, method comparison and source-linked synthetic example.
- **Remaining gaps:** input reuse, independent judgments, user value, approved contract and confirmed ownership/capacity.
- **Owner decision required:** Michael Richard selects further preparation, revision or deferral; no automatic delivery promotion.
