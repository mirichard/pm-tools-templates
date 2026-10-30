# Issue #1159 discovery — bidirectional consistency and process-state validation

- **Research snapshot:** 2026-10-30
- **Repository source snapshot:** [`main` at `8078fdd24db8e9d274a5922c1db00c051f708663`](https://github.com/mirichard/pm-tools-templates/commit/8078fdd24db8e9d274a5922c1db00c051f708663)
- **Accountable decision owner:** Michael Richard
- **Disposition:** Research only; candidate remains unscheduled and unselected.
- **Related work:** [#1566 portfolio synthesis](https://github.com/mirichard/pm-tools-templates/issues/1566), [open portfolio research PR #1597](https://github.com/mirichard/pm-tools-templates/pull/1597), [current issue-specific draft PR #1588](https://github.com/mirichard/pm-tools-templates/pull/1588).

## Decision brief

Keep #1159 deferred and unscheduled. The repository already has a useful deterministic base: the Requirements Structuring & Validation CLI (package version 1.2.0) carries source requirement IDs/text into generated UCS and test artifacts and checks a limited set of UCS/process-model object and ordering rules. This establishes traceability and narrow process checks; it does not implement reverse edits from tests into UCS, prove source attribution is semantically correct, or validate arbitrary process behavior.

The two September 18 comments are owner-authored historical statements, including a GO claim and a claimed final review window. They do not establish current implementation selection: the stated Sep 28–Oct 1 final-approval window is later than the comments, no corroborating review artifact was found in the pinned checkout, and the newer Oct 30 issue body and portfolio plan explicitly retain this as an unscheduled research candidate. The cited `meta/spike-decision-framework.md` is absent from the pinned source snapshot. The current assignment controls: research and preparation only.

If Michael later selects the candidate, first validate a deterministic, reviewable change-proposal loop on synthetic fixtures—not automatic bidirectional synchronization. Require explicit stable IDs and field mappings, reject ambiguous or concurrent edits, and preserve the original artifacts until a human approves a patch. The source papers' full text was not accessible in this run; their method details and applicability remain unverified. No user-demand, accuracy, adoption, savings, staffing, or delivery estimate is established here.

**Owner decision required:** whether to retain the deferred candidate for later research, stop it, or explicitly select a bounded follow-on discovery/delivery task. This report does not select or schedule it.

## Status and approval evidence

| Evidence | What it establishes | What it does not establish |
|---|---|---|
| [Issue #1159](https://github.com/mirichard/pm-tools-templates/issues/1159), current body/metadata checked 2026-10-30 | Open; Michael Richard and Copilot are assignees; no native parent or child; body labels the candidate unscheduled/deprioritized and explicitly restricts this assignment to research. | Selection, delivery authorization, estimate, or sprint commitment. |
| [Owner comment 1](https://github.com/mirichard/pm-tools-templates/issues/1159#issuecomment-5733933860), 2026-09-18 | Historical owner-authored spike claims, proposed roadmap and “GO” recommendation. | Independent validation of the described prototype, metrics, or proposed effort. |
| [Owner comment 2](https://github.com/mirichard/pm-tools-templates/issues/1159#issuecomment-5734731309), 2026-09-18 | Historical owner-authored “GO (Priority 3)” statement and claims of dependencies, timeline, resource need, and a final review gate. | Completed final approval: the stated Sep 28–Oct 1 gate followed the Sep 18 comment, and no confirming gate record was found in this checkout. It is not current selection evidence. |
| [`research/v2.5-discovery-plan.md`](v2.5-discovery-plan.md) and [backlog alignment](../backlog/roadmap-alignment.md#product-candidate-benchmark--09282026) | #1159–#1162 remain unscheduled options; the discovery plan preserves accepted #1482 validation and #1379 source-sufficiency evidence and prohibits automatic promotion. | A decision to implement #1159. |
| [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566) and [PR #1597](https://github.com/mirichard/pm-tools-templates/pull/1597) | Current portfolio context and parallel synthesis; #1159 remains in the deferred candidate set. | A replacement for this issue-specific evidence or an empty Project 13 queue. |
| [PR #1588](https://github.com/mirichard/pm-tools-templates/pull/1588), checked 2026-10-30 | Existing open draft is the focused research PR for this issue; it initially contained only a plan commit. | Implementation progress, acceptance, or merge. |
| `meta/spike-decision-framework.md` | The historical comment points to this file. | The file is absent from pinned commit `8078fdd`; its content and claimed approval evidence could not be inspected. |

No separate issue-specific child or parent was returned by the native issue relationship lookup. This report links to #1566 rather than duplicating its portfolio investigation. #1482 remains accepted/closed and is not repeated; #1379's accepted source-sufficiency evidence remains preserved, not re-evaluated here.

## Capability / evidence / gap matrix

| Capability or claim | Maintained evidence and exact revision | Evidence boundary / gap | Dependency or owner gap | Disposition |
|---|---|---|---|---|
| Parse requirement lines and retain identifiers/source text | [`parser.js`](../tools/requirements-structuring-cli/src/parser.js), [`source-traceability.js`](../tools/requirements-structuring-cli/src/source-traceability.js), [`docs/source-traceability.md`](../tools/requirements-structuring-cli/docs/source-traceability.md); repository snapshot `8078fdd24db8e9d274a5922c1db00c051f708663`, CLI package `1.2.0`. | Explicit labels survive reordering; generated positional IDs do not survive insertions/reordering. A valid but wrong source ID cannot be detected, coverage is not proven, and a source catalog is not authenticated provenance. | A future round-trip needs stable authored IDs and a versioned source baseline. | **Retain** current one-way trace links; **revise** ID contract before reverse edits. |
| Generate UCS and tests with source references | [`ucs-transformer.js`](../tools/requirements-structuring-cli/src/ucs-transformer.js), [`test-generator.js`](../tools/requirements-structuring-cli/src/test-generator.js), [`ucs-template.schema.json`](../tools/requirements-structuring-cli/schemas/ucs-template.schema.json). | Generated artifacts retain `sourceRequirementId`/`sourceText`; there is no implemented inverse mapping or write-back operation. Model output may be attributed to an incorrect but valid ID. | Define which test fields map losslessly to which UCS fields; an owner must select whether to support edits at all. | **Retain** forward traceability; **defer** propagation. |
| Check process/state consistency | [`consistency-checker.js`](../tools/requirements-structuring-cli/src/consistency-checker.js) and [process/state schemas](../tools/requirements-structuring-cli/schemas/business-process.schema.json). | Implemented checks compare business-object names and ordering and compare lowercased trigger/action strings. Rule 1's “semantic” label is object membership, not natural-language semantic validation. This is not proof of general process equivalence. Behavior for graph loops, joins, incomplete models, and cross-flow path semantics needs explicit tests and policy. | Confirm target process-model subset and expected flow semantics; no current human acceptance record for this candidate. | **Retain** narrow deterministic checks with precise claims; **revise** their documented scope; **defer** broad semantic validation. |
| Reverse edits and conflict behavior | No reverse-edit module or round-trip behavior found in maintained CLI assets at the pinned revision. | Stable IDs, base revisions, field-level mappings, merge policy, multi-test conflicts, orphan dispositions, and lossless round trips are not implemented or validated. | Requires owner selection, explicit mapping contract and bounded acceptance fixture. | **Defer** implementation; validate a synthetic proposal-only slice first if selected. |
| Historical prototype, score, success metrics, complexity and timeline | September 18 comments on [#1159](https://github.com/mirichard/pm-tools-templates/issues/1159#issuecomment-5733933860) and [#1159](https://github.com/mirichard/pm-tools-templates/issues/1159#issuecomment-5734731309). | Claims such as “100% (7/7),” >95% coverage, <5% false positives, >70% adoption, >30 minutes saved, 2–3 weeks, and 6.5 FTE-weeks have no reproducible fixture, measurement method, or corroborating artifact inspected here. Historical estimates also differ. | Define measurement population, baseline, acceptance threshold, and evidence owner before reuse. | **Revise** to unvalidated historical claims; do not carry them forward as targets or estimates without owner decision. |
| Cited research | CLI README cites Li & Zheng, *Enhancing Requirements via Structured Formalization and Process-State Consistency Validation: An LLM-Assisted Test-Driven Framework*, IET Software (2025), [DOI 10.1049/sfw2/6714956](https://doi.org/10.1049/sfw2/6714956). Issue also cites Li, Zheng & Cai, ICFEM 2025; author publication listing: [Huaqiao University](https://faculty.hqu.edu.cn/lihaibo/en/lwcg/105585/content/58133.htm); publisher record/PDF: [Springer DOI 10.1007/978-981-95-4213-0_11](https://doi.org/10.1007/978-981-95-4213-0_11). | Publisher/author pages could not be fetched in this environment. Search metadata suggests the ICFEM title “A Test-Driven Approach for Refining Use Case Specifications of Software Requirements with LLMs”; exact bibliographic relationship to the issue's abbreviated title, full-text method, applicability, and reuse terms were not independently verified. | Primary full text and reuse/licensing review are prerequisites for any paper-derived requirements. | **Retain** citations as leads; **defer** source-derived claims pending direct review. |
| Accepted adjacent evidence | [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482) closed with owner-confirmed walkthrough acceptance; [#1379](https://github.com/mirichard/pm-tools-templates/issues/1379) accepted source-sufficiency evidence is preserved in the discovery plan. | Neither validates #1159's process-state logic or bidirectional edits. | None for this report; do not duplicate or reopen accepted work. | **Retain** as bounded adjacent evidence only. |

## Candidate invariants and decisions to test

These are proposed validation rules, not existing CLI behavior or owner-approved product policy.

1. **Identity and provenance:** Each in-scope requirement, use case, flow, step, test case, and test step has a unique explicit stable ID. A provenance edge names both endpoint IDs and artifact revisions. Display order and generated positional IDs are not identity.
2. **Mapping and coverage:** Every in-scope test step resolves to an existing use-case step through an explicit mapping. One source step may have multiple tests. A source step without a test is an explicit `not_tested`/`not_applicable` disposition, not a silent orphan. A test without a valid parent is an error.
3. **Controlled reverse mapping:** A test field can produce a parent change proposal only when a declared field mapping defines an exact, lossless transformation. Text similarity, an LLM suggestion, or a valid but incorrect source ID is not a sufficient mapping.
4. **Conflict safety:** A proposal records the parent artifact's base revision and before-value. If the current revision/value differs, or two tests propose incompatible values for the same parent field, reject application and report the competing values. Never choose last-writer-wins or overwrite silently; require human resolution.
5. **Graph boundaries:** The derivation/provenance graph is acyclic; reject self-links and cycles. Process control-flow loops, if supported, are separately modeled and explicitly bounded/semantically defined—not confused with provenance cycles.
6. **Lossless round trip:** For mapped fields, export → test edit → proposal → human-approved apply → regenerate preserves the edited field and every unrelated field, ID, alternative/exception path, and unmapped source value. No claim of byte-identical formatting unless the format contract explicitly requires it.
7. **Deterministic process check:** Given identical versioned UCS and process-model inputs, return identical findings. Structural checks may report missing links, IDs, unreachable/orphaned nodes, and specified ordering violations; semantic equivalence requires a separately approved human-evaluation method.

## Proposed synthetic fixture — not executed

This fixture describes a future test, not a demonstrated CLI capability:

```text
revision r1
REQ-RESET-01: Service sends one reset link to the verified address.
UC-RESET-01 / FLOW-BASIC / STEP-SEND-LINK
  sourceRequirementId = REQ-RESET-01
  action = "sends one reset link"
TC-RESET-01 / TEST-STEP-SEND-LINK
  mapsTo = STEP-SEND-LINK
  expectedResult = "One reset link is sent to the verified address."
```

**Proposed round-trip check:** Change the test's expected result to “One reset link with an expiry timestamp is sent to the verified address.” A declared exact mapping emits a preview patch for the mapped UCS postcondition, retaining the source and test IDs, before-value, proposed value, and `r1` base revision. With unchanged parent at `r1`, an explicit human-approved apply followed by regeneration must retain the new value and all unrelated fields. Serialize/parse equality must hold for all unmapped fields.

**Proposed conflict check:** Concurrently change the parent at `r2` to “One reset link is sent to the verified address and expires after 30 minutes.” Applying the `r1` proposal must make no write and return a conflict containing the base, current, and proposed values. Two incompatible proposals against the same parent field must have the same no-write outcome.

**Proposed graph/error cases:** Duplicate stable IDs, missing mapped parent, orphan test, un-dispositioned uncovered requirement, self/cyclic provenance links, and a test edit without an approved field mapping each produce explicit findings and no mutation. A modeled process loop is not a provenance cycle.

**Evidence status:** The fixture has not been run against the CLI or any implementation. No prototype result, user evaluation, or human acceptance is claimed. Existing CLI test command is `npm test --prefix tools/requirements-structuring-cli`; it validates existing tests only, not this proposal.

## Conditional readiness / reuse package

No duplicate delivery issue is proposed. If the owner selects further work, refine this single bounded candidate before creating or promoting delivery work:

- **User outcome:** A reviewer can edit a generated test field, inspect a deterministic, attributable UCS change proposal, resolve conflicts safely, and validate the resulting UCS against a declared process model.
- **Bounded scope:** Offline CLI artifacts and synthetic fixtures; explicit IDs and field mappings; preview-only proposals followed by explicit human approval; one deterministic edit path; basic and one alternative flow; focused conflict/orphan/cycle coverage.
- **Exclusions:** Silent or automatic writes, inferred text mappings, LLM-based semantic restoration, live integrations, broad multi-project synchronization, telemetry, dashboards, adoption claims, sensitive/original-file intake, and delivery/release commitments.
- **Observable acceptance criteria if selected:** (1) duplicate/missing IDs and unresolved orphans are reported deterministically; (2) a test edit without an explicit invertible mapping is rejected; (3) a mapped edit yields a revision-bound preview and changes no source before approval; (4) stale and competing edits produce no-write conflicts with all values visible; (5) approved edit/regeneration preserves IDs and unrelated fields in basic/alternative-flow fixtures; (6) process validation reports only specified deterministic structural/order rules; (7) test fixtures cover each result and no LLM/API credentials are needed.
- **Validation method:** Offline unit/CLI tests over versioned synthetic JSON fixtures; compare normalized artifact structures before/after round trip; assert no mutation on errors/conflicts; separately review rule semantics and findings with the accountable owner. Proposed, not executed.
- **Dependencies and owner gaps:** Michael Richard must decide whether to retain/select the candidate, approve the mapping/loop/orphan policy, and set evidence needed for process semantics. Direct review of the cited primary papers and reuse terms remains open. No user demand or stakeholder acceptance evidence was gathered or authorized.
- **Effort:** No defensible numeric range yet. First bound input formats, mapping semantics, conflict policy, and paper/source review; estimate only after that scope is accepted. The historical 2–3 week and 6.5 FTE-week claims are inconsistent and unvalidated, not estimates for this package.

## Promotion criteria

| Gate | Required evidence | Current assessment |
|---|---|---|
| **Backlog-ready** | Documented user/problem evidence; accepted bounded outcome and exclusions; source/method evidence sufficient for claims; synthetic acceptance fixture and validation method; dependencies and gaps visible; explicit owner disposition. | **Not met.** Only a research candidate and historical claims exist; source review, demand evidence, and owner selection are missing. |
| **Sprint-ready** | Backlog-ready plus named delivery owner, leaf-sized acceptance, resolved/explicitly sequenced dependencies, reproducible tests, defensible estimate, and owner readiness decision. | **Not met.** No delivery scope, estimate, dependency decision, or capacity confirmation. |
| **Owner-selected** | Michael Richard explicitly records selection of the bounded candidate and its intended planning path; selection does not itself imply sprint capacity or acceptance. | **Not met / decision pending.** Neither this report nor the historical GO comments make a current selection. |

Recommended project/issue state remains **unscheduled, deprioritized, research candidate**. No project stage or milestone change is proposed.

## Sources and check limitations

- Repository instructions: [`.github/copilot-instructions.md`](../.github/copilot-instructions.md). Research plan: [`research/v2.5-discovery-plan.md`](v2.5-discovery-plan.md).
- CLI evidence links above refer to the exact repository snapshot recorded at the top. Package metadata at that snapshot reports version `1.2.0`; this is newer than the issue's historical “v1.1.0” description.
- Primary source leads: [IET Software DOI](https://doi.org/10.1049/sfw2/6714956), [ICFEM author publication listing](https://faculty.hqu.edu.cn/lihaibo/en/lwcg/105585/content/58133.htm), and [Springer DOI](https://doi.org/10.1007/978-981-95-4213-0_11). Direct publisher fetches failed in this environment; the article content and reuse terms were not inspected.
- Related portfolio PR: [#1597](https://github.com/mirichard/pm-tools-templates/pull/1597). This report is the issue-specific evidence packet; coordinate changes through links rather than duplicating the portfolio report.

## Executed checks

- `npm test --prefix tools/requirements-structuring-cli` — 240/240 existing CLI tests passed after installing the locked dependencies. This does not execute or accept the proposed fixture.
- `python3 check_anchor_links_filtered.py` — scanned 1,385 Markdown files; this report had no reported link error. The repository-wide check still reports five unrelated broken anchors in `docs/principles/anti-patterns.md` (lines 10, 11, 13, 15, and 16); none were changed here.
- `git diff --check` — passed for the report. The link-checker's generated tracked summary was restored; no unrelated file changes are included.

### Four-point close

- **Recommended next step:** Keep deferred; ask Michael to explicitly retain, stop, or select the bounded discovery candidate.
- **Research completed:** Reconciled current status and historical comments; inspected CLI traceability/process checks and preserved adjacent accepted evidence.
- **Remaining gaps:** Direct paper/reuse review, user/problem evidence, approved mapping/conflict semantics, and fixture execution.
- **Owner decision required:** Whether any follow-on work is selected; no implementation, estimate, or schedule is authorized by this report.
