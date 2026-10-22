# Issue #1161 Evidence Ledger and Audit

**Disposition used across this packet:** Further research required; not ready for Sprint 3 commitment.

**Scope of this document:** traceable evidence only. This is not implementation authorization.

- Issue: https://github.com/mirichard/pm-tools-templates/issues/1161
- Original draft PR (preserved): https://github.com/mirichard/pm-tools-templates/pull/1412
- Replacement draft PR: https://github.com/mirichard/pm-tools-templates/pull/1413
- Clean base commit: `12784bd89f21fcbcc6fb91322fd3e324dd0b8b04`
- Verified source revision used for preservation: `4751154c6c1ab7a18741534b4ef9d8b7a452ac53`
- Access date: 2026-09-29

## 1) Claim / source ledger

| Claim | Source (URL or repo path@commit) | Relevant passage / observation | Evidence observed | Status | Limitation |
|---|---|---|---|---|---|
| #1161 is currently unscheduled and deprioritized. | https://github.com/mirichard/pm-tools-templates/issues/1161 | Issue body starts with “Status: Unscheduled, deprioritized research-derived product candidate.” | Confirmed in live issue body. | Supported | Issue status text is policy/context, not technical proof of feasibility. |
| #1412 includes unrelated changes. | https://github.com/mirichard/pm-tools-templates/pull/1412 ; local command `gh pr view 1412 --json files,commits` | Files list included `.github/*` and many `ai-insights/*` files; commit count 30; file count 84. | Confirmed contamination scope. | Supported | Count can change if #1412 is updated later. |
| Historical “GO / timeline / staffing” assertions exist in #1161 comments. | https://github.com/mirichard/pm-tools-templates/issues/1161#issuecomment-5734731299 | Comment states “APPROVED FOR GO”, dates, and “~7.5 FTE-weeks”. | Confirmed statements exist. | Supported (as historical claims) | Historical comments are not current authorization. |
| Historical scoring contract is internally inconsistent. | https://github.com/mirichard/pm-tools-templates/issues/1161#issuecomment-5733934379 | Same comment states factor bounds and examples using out-of-range mitigation factors and conflicting labels. | See Section 3 arithmetic audit. | Supported | This proves inconsistency, not a replacement method. |
| Synthetic data limitation is explicitly stated for the source research. | #1161 issue body and Crossref abstract for DOI `10.3390/make8010001` | Issue body states synthetic/rule-based limitation; Crossref abstract says “validate the modelling pipeline” and “should not be interpreted as real-world predictive accuracy.” | Limitation confirmed in both places. | Supported | Abstract-level evidence; full-paper methodological appraisal is still pending. |
| Repository has existing risk scoring guidance based on ordinal prioritization. | `templates/traditional/Traditional/Templates/risk_register_template.md`@`12784bd...` | Line with “ordinal scores prioritize attention; their product is not an expected monetary loss.” | Confirmed caution language in template. | Supported | Repository practice is not proof of PMBOK/ISO requirements. |
| #1160/#1162 do not explicitly declare blocking dependency for #1161. | https://github.com/mirichard/pm-tools-templates/issues/1160 and /issues/1162 | Both issue bodies state unscheduled deprioritized candidates; no explicit block relationship in those bodies. | No explicit blocker found in inspected issues. | Supported (narrowly) | Absence of explicit blocker is not proof of independence in delivery planning. |
| Claimed source paper identity can be bibliographically matched. | Crossref API and OpenAlex by DOI `10.3390/make8010001` | Title, journal, date, and author match candidate description at high level. | Bibliographic record located. | Supported | Metadata matching alone is insufficient for paper-derived taxonomy/method claims; those require examination of relevant source content and reuse terms. |

## 2) Search record (actual outcomes)

Outcome types used:
1. Search completed and results inspected
2. Request failed or timed out
3. Access unavailable
4. Source located and content examined

| Service | Query / request | Date | Outcome type | Result |
|---|---|---:|---:|---|
| GitHub issue/comments | #1161 body + comments, #1160, #1162 | 2026-09-29 | 4 | Source text examined directly via API/tooling. |
| GitHub PR API | `gh pr view 1412 --json files,commits` | 2026-09-29 | 4 | 84 files / 30 commits; contamination confirmed. |
| Google Scholar | `Geamanu Machine Learning and Knowledge Extraction risk` | 2026-09-29 | 2 | HTTP 403 request failure from this environment; not evidence of absence. |
| DOI resolver | `https://doi.org/10.3390/make8010001` | 2026-09-29 | 2 | HTTP 403 in this environment. |
| MDPI article page | `https://www.mdpi.com/2504-4990/8/1/1` | 2026-09-29 | 2 | HTTP 403 in this environment. |
| Crossref | `https://api.crossref.org/works/10.3390/make8010001` | 2026-09-29 | 4 | Record located; abstract includes synthetic-data limitation and 27 input variables. |
| Crossref query | `query.author=Geamanu&query.container-title=Machine Learning and Knowledge Extraction` | 2026-09-29 | 4 | Returned one matching item: DOI `10.3390/make8010001`. |
| OpenAlex | `works/https://doi.org/10.3390/make8010001` | 2026-09-29 | 4 | Record located; publication metadata aligns with Crossref. |
| Web index query | Author variant wording (`Geamanu` / `Geamănu`) | 2026-09-29 | 1 | No additional distinct candidate record identified in inspected index results. |

### What is still unresolved from search/access

- Full-text access through DOI/MDPI endpoints failed from this environment (403).
- Institutional-access-only checks were not completed in this run.
- Therefore, full-paper verification of taxonomy semantics, domain limits, and reuse constraints remains open.

### Verification requirement for paper-derived claims

If a future proposal retains paper-derived taxonomy or method claims, verification of relevant source content and reuse terms is required. Metadata-only confirmation is insufficient.

The repo owner may approve a different research direction (for example, custom/internal taxonomy work). However, verification cannot be waived while retaining paper-derived claims.

## 3) Historical scoring contract under audit (not approved specification)

The historical comment in #1161 provided these factor bounds:
- Probability: 1–5
- Impact: 1–5
- Mitigation factor: 0.5–1.0
- Time factor: 0.8–1.2
- Dependency factor: 1.0–1.5

### Internal arithmetic checks

- Minimum raw score from stated bounds: `1 × 1 × 0.5 × 0.8 × 1.0 = 0.4`
- Maximum raw score from stated bounds: `5 × 5 × 1.0 × 1.2 × 1.5 = 45`

This conflicts with historical wording that implied a raw maximum of 30 before normalization.

A different section in the prior packet used a time factor upper bound of 1.5. Under that variant:
- Maximum raw score becomes `5 × 5 × 1.0 × 1.5 × 1.5 = 56.25`

Additional inconsistency in historical examples:
- Example score `10.08` was described as moving toward HIGH while the same historical threshold table listed HIGH as 12+.
- Historical mitigation examples included factors (`0.28`, `0.145`) outside the stated mitigation range (`0.5–1.0`).

**Conclusion:** contradictory ranges and labels are confirmed. No replacement formula is approved in this packet.

## 4) Reproducible inventory replacing the “25+ templates” claim

Inventory method at commit `12784bd89f21fcbcc6fb91322fd3e324dd0b8b04`:

- Source of truth: `templates/templates.json`
- Selection rule used for dedicated risk paths: regex `(^|[/_-])risk([/_-]|$)` against catalog path (`canonical_path || path`)

Command logic executed (Python over catalog) produced these dedicated risk paths:

1. `domains/delivery/industry-specializations/healthcare-pharmaceutical/regulatory/compliance_risk_assessment_template.md`
2. `domains/delivery/project-lifecycle/02-planning/risk-management/agile-risk-board-template.md`
3. `domains/measurement/industry-specializations/information-technology/cybersecurity/risk_assessment_template.md`
4. `domains/measurement/project-assessment-suite/risk-management-assessment-template.md`
5. `domains/measurement/project-lifecycle/02-planning/risk-management/risk-management-plan-template.md`
6. `domains/uncertainty/project-lifecycle/02-planning/risk-management/enterprise-risk-assessment-template.md`
7. `domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md`

Duplicate checks on this dedicated set:
- Duplicate basenames: none
- Duplicate full-file-content groups (SHA-256): none

Note: a broader risk-keyword match across titles/tags/paths returns many more catalog items (115 in this run), including assets where risk is not the primary purpose. The list above is the stricter dedicated-path subset.

## 5) Standards assertions status (PMBOK / ISO)

- This packet does **not** claim that repository templates verify PMBOK or ISO prescriptions.
- In this run, no full-text PMBOK or ISO 31000 standard clause was retrieved and quoted as direct support for any specific thresholds/modifiers.
- Therefore, any statement that PMBOK/ISO prescribe this specific modifier formula or thresholds remains **unverified** here.

## 6) Alternatives and discriminating evidence needed

No ranking here is final. Evidence required to distinguish options is listed explicitly.

| Alternative | What it is | Evidence needed to choose it |
|---|---|---|
| A. Improve existing risk guidance/calibration | Clarify and strengthen current templates and scoring instructions only | User pain evidence that current ambiguity causes material decision problems; review burden compared with status quo |
| B. Add transparent calculation aid using an approved method | Spreadsheet/template helper with auditable arithmetic | Approved scoring specification first; usability evidence that the aid improves consistency without false reassurance |
| C. Continue investigating source-research-derived proposal | Keep researching provenance/rights/method constraints from cited paper | Examination of relevant source content and reuse terms, with documented applicability limits; metadata alone is insufficient. |
| D. Defer/decline further product development | No new deterministic scoring productization now | Evidence that opportunity cost outweighs expected benefit, or unresolved method/value uncertainty remains too high |

## 7) Explicit limitations

- This packet does not authorize merge, implementation, sprint assignment, or release commitment.
- Any future implementation requires separate repo-owner decisions on method, scope, and validation approach.
