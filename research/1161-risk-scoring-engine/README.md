# Issue #1161 Research Correction Packet

**Disposition:** Further research required; not ready for Sprint 3 commitment.

This packet corrects and isolates research quality issues identified in #1412. It supports repo-owner decision making for #1161 and does **not** authorize implementation.

- Candidate issue: https://github.com/mirichard/pm-tools-templates/issues/1161
- Original draft PR (preserved): https://github.com/mirichard/pm-tools-templates/pull/1412
- Replacement draft PR: https://github.com/mirichard/pm-tools-templates/pull/1413
- Scope boundary: only `research/1161-risk-scoring-engine/`

## Decision brief

Observed evidence confirms all of the following at once:

- #1161 remains unscheduled/deprioritized in its issue body.
- Historical comments in #1161 include unsupported commitments and internally inconsistent scoring details.
- The contaminated PR #1412 mixed research with unrelated application and CI changes.
- Bibliographic records for the cited Geamanu paper can be located via Crossref/OpenAlex metadata, but direct DOI/MDPI fetches failed (403) in this environment.
- Synthetic-data limitations are explicitly stated and must be preserved if this candidate is ever pursued.

Given these conditions, the only supportable disposition in this packet is:

**Further research required; not ready for Sprint 3 commitment.**

## Corrected historical claims summary

| Historical claim theme | Corrected status in this packet |
|---|---|
| “GO approval” and schedule/staffing commitments | Treated as historical comments, not current authorization |
| “No dependencies” or “blocked by #1160/#1162” certainty | Reframed as: no explicit blocking relationship identified in inspected issue bodies; dependency status still requires explicit delivery-level confirmation |
| Source paper not found anywhere | Corrected: bibliographic records located; some endpoints inaccessible from this environment |
| PMBOK/ISO formula endorsement | Marked unverified without direct clause-level sources |
| Proposed scoring contract as settled | Withdrawn to “historical/unvalidated proposal under audit” |
| Planned mitigation modeled as proven reduction | Corrected to separate planned, implemented, and verified effects |

## Acceptance matrix (correction assignment vs implementation readiness)

Status values are restricted to **Met / Not met / Unknown**.

| ID | Scope | Criterion | Status | Evidence pointer |
|---|---|---|---|---|
| COR-01 | Correction assignment | Replacement PR is isolated to `research/1161-risk-scoring-engine/` | Met | `gh pr view 1413 --json files` (all paths under research directory) |
| COR-02 | Correction assignment | #1412 preserved and explicitly marked non-merge candidate | Met | #1412 comment linking #1413 and contamination rationale |
| COR-03 | Correction assignment | Unsupported commitments removed from corrected packet | Met | This README + `evidence.md` + `scope-and-acceptance.md` |
| COR-04 | Correction assignment | Evidence ledger includes source, observation, status, and limitation | Met | `evidence.md` Section 1 |
| COR-05 | Correction assignment | Search outcomes distinguish success/failure/access states | Met | `evidence.md` Section 2 |
| COR-06 | Correction assignment | Historical scoring contract contradictions documented without replacement method | Met | `evidence.md` Section 3 |
| COR-07 | Correction assignment | Reproducible inventory replaces “25+ templates” shorthand | Met | `evidence.md` Section 4 |
| COR-08 | Correction assignment | Continuation checkpoint exists with restart instructions and next action | Met | `CONTINUATION.md` |
| RDY-01 | Implementation readiness | Source-research applicability/licensing details verified from full paper | Unknown | Direct DOI/MDPI access failed in this run |
| RDY-02 | Implementation readiness | Method specification approved (inputs, bounds, thresholds, override rules) | Not met | No approved replacement method in this packet |
| RDY-03 | Implementation readiness | User-value evidence for this candidate in real PM contexts | Not met | No user-study evidence in repository artifacts inspected in this run |
| RDY-04 | Implementation readiness | Delivery scope selection (guidance only vs calculation aid vs further research) | Unknown | Repo-owner decision pending |

## Next actions (research only)

1. Decide whether to continue candidate research or defer/decline further product development.
2. If continuing, secure a source-validation path (full-paper access and reuse constraints) before claiming paper-derived taxonomy specifics.
3. If method work is authorized, approve a method-definition process before any implementation planning.
4. If user-value validation is authorized, define an evidence standard for usefulness (not just arithmetic consistency).

## Document map

- `README.md` (this file): disposition, corrected claim framing, acceptance matrix, next actions.
- `evidence.md`: claim/source ledger, search record, reproducible inventory, alternatives framing.
- `scope-and-acceptance.md`: fictional journeys, input/evidence boundaries, unresolved method decisions, proposal options, evaluation approach.
- `CONTINUATION.md`: crash-safe restart and progress checkpoint.

## Non-authorization statement

Draft research only. No merge, implementation authorization, or Sprint 3 commitment.
