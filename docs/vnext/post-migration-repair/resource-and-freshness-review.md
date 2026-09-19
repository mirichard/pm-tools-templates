# Resource references and content freshness

Review date: 09/19/2026. Comparison base: `dc7146cc59387421b872dffbadd86b8b6f8dd3a2` (draft PR #1253). Completed repository content-maintenance review: all 137 migrated templates now have current, content-bound evidence; the three additional age warnings found by the repository-wide linter were also repaired and reviewed.

## Missing-resource dispositions

All 34 previously unresolved source/target records (35 rendered references) now have a disposition in `link-dispositions.json`:

| Disposition | Records | Evidence |
|---|---:|---|
| Relinked | 25 | Inspected matching resources or substantive sections; labels describe the actual destination. UAT forms, training planning, and change governance reuse existing sections. |
| Created | 1 | Added a usable user-research planning template with decision, recruitment, neutral-task, evidence, limitation, and follow-up fields. |
| Retired | 8 | Removed one deliberately deleted test fixture, two nonexistent industry-infrastructure collections, and five recommendations for nonexistent role toolkits. Existing practice-specific guidance remains. |

History was fetched beyond the shallow checkout. The obsolete test fixture was deleted in `6bec16e5`. Searches of reachable history found no paths for the three proposed DevOps/security/SRE role toolkits, the two proposed industry-infrastructure directories, or the user-research plan. These are bounded findings about reachable repository history, not claims that equivalent material cannot exist elsewhere.

One old URL served both “Agile Planning” and “Product Backlog Management”; those labels now point to distinct, appropriate maintained resources. Retired optional recommendations do not imply that the missing toolkits or industry collections have been delivered.

## Freshness review outcomes

The migration denominator remains the 137 executed destinations in the unchanged migration inventory. `meta/template-content-reviews.json` now contains 140 completed records: those 137 plus three nonmigrated templates exposed by the repository-wide linter.

| Outcome | Templates | Evidence |
|---|---:|---|
| Migrated content reviews completed | 137 | Current date, identified AI reviewer, file-specific findings, exact SHA-256; remaining-batch section coverage and source links recorded where used. |
| Migrated age warnings | 0 | `python scripts/check_migrated_freshness.py` checks the full executed inventory. |
| Additional nonmigrated reviews | 3 | Tableau dashboard, traditional risk register, traditional status report; substantive defects repaired. |
| Repository-wide age warnings | 0 | Full metadata linter, including the three additional templates. |

The first batch completed 24 reviews (20 revisions and four retained bodies). The completion batch reviewed the remaining 113: 96 bodies revised and 17 retained with separate review evidence. Thus 116 migrated bodies received substantive review revisions and 21 retained their existing modification dates in these content-review batches. Reference-only changes from earlier commits are accounted for separately in the repair manifest.

## First batch history

The first batch selected the 26 templates below 700 words at the comparison base. It found and corrected more than age debt:

- Removed 14 conflicting metadata blocks rendered as body text. Five belong to longer templates still pending full review; cleanup alone did not earn a freshness date.
- Replaced six skeletal templates with actionable assessment, enterprise risk, hybrid planning, data-center planning, disaster-recovery planning, and migration planning fields.
- Added evidence, defined scoring, N/A handling, accountable actions, and follow-up to eight short assessments.
- Corrected risk-score calculation and probability bands, dashboard variance conventions, and default testing exclusions.
- Corrected Scrum terminology, optional Daily Scrum prompts and facilitation, and the distinction between story acceptance and Definition of Done against the [November 2020 Scrum Guide](https://scrumguides.org/scrum-guide.html).

## Completion batch findings

- Replaced outdated FDA/ICH references, including E6(R3), Q2(R2), and the medical-device QMSR transition; linked primary guidance in affected templates. Product/site acceptance limits require approved rationale and evidence.
- Resolved the QbD finding by removing a false mandatory-design-space rule and unqualified product-specific acceptance limits. Resolved the purchase-order finding by replacing unconditional legal-effect claims with approved terms, applicability, acceptance, and procurement/legal review fields. Neither template certifies a real product or transaction.
- Corrected GDPR lawful-basis guidance, password-policy examples, financial formulas and variance definitions, mixed-grain calculations, planning scope, unsupported framework/trademark claims, and fixed sample dates presented as document metadata.
- Updated Node examples from the unsupported Node 18 line to Node 24 and repaired the documented webhook verifier's malformed-signature handling. Tests execute that exact documentation example.
- Clarified configurable worksheet inputs, evidence sources, periods, units, decision ownership, and the difference between examples and actual approval/results.
- The three additional templates needed substantive repairs: Tableau calculation/aggregation, join fan-out, authorization, mobile and refresh guidance; risk-register probability boundaries and truncated approval; status-report earned-value conventions, inconsistent scores and truncated resource row.

## Method and limits

The reviews are attributed to Codex as AI-assisted repository maintenance. The first batch read complete short bodies. The completion pass used whole-file structural and claim extraction, section/instruction/example review, targeted risk and formula inspection, and authoritative-source verification for identified time-sensitive claims. The ledger records that method and file-specific findings; it is not a claim of human line-by-line review or exhaustive professional validation.

Source examples and embedded configurations were not deployed. Only the documented webhook function received runtime example tests; Tableau/Power BI workbooks, cloud infrastructure and regulated workflows still require testing and approval in their intended environments. The two specialist-template findings were resolved by correcting the generic template, not by claiming specialist approval. No human acceptance result or screenshot approval is inferred from this maintenance review.

## Review policy

`updated` remains the date of a substantive content revision. A separate completed review can establish freshness for unchanged content. The linter accepts it only when the ledger supplies a valid review date, identified reviewer, full-content scope, specific evidence, and SHA-256 matching the current file. A later content change invalidates that review. Missing, pending, partial, stale, malformed, and future-dated reviews cannot silently clear warnings. Future modification dates are invalid as well.

For subsequent maintenance:

1. Review the affected body and record the review method and scope accurately.
2. Verify instructions, examples, assumptions, scope, metadata, links, and time-sensitive claims; use authoritative sources where needed.
3. Repair findings, or record the specific unresolved finding. Do not attest currentness for a partial review.
4. Change `updated` only for substantive revisions; record completed full-content review date, reviewer, evidence, and exact SHA-256 separately.
5. Update the exact current-body repair hash while preserving original migration hashes and wave manifests. Run the validators and commit the evidence together.

CI now requires a valid review for every executed migration destination and zero age warnings both in that inventory and across the metadata linter's scope. The 365-day threshold is unchanged. Regression tests cover the 365/366-day boundary, absent and pending reviews, hash drift, future dates, missing files, and empty/duplicate inventory. Original migration hashes and wave manifests remain unchanged.

## Validation

- Strict Sprint 10 validation: 137/137, with annotations; migration post-check: zero diagnostics; all six domain entry points pass.
- Catalog identity: zero errors/warnings; 139 domain records verified.
- Original 286-file scope: 1,191 local inline links, zero failures. Additional changed nonmigrated bodies and the new research template are checked separately.
- Migrated metadata: zero errors and zero age warnings; 137/137 validated reviews. Full metadata linter: zero strict errors and zero age warnings; 33 unrelated inherited required-field errors remain reported separately.
- Review ledger: 140 unique completed records, including exactly all 137 inventory destinations; current file hashes verified.
- 56 Node tests and 46 Python tests pass. Changed workflow passes actionlint with shellcheck/pyflakes disabled.
- `freshness-validation.json` records the completion snapshot and counts. Reproduce with `python scripts/check_migrated_freshness.py` and the commands in the repair README; the full metadata workflow enforces repository-wide zero age warnings.

Remote CI and visual review remain integration gates. No issue is closed and no visual baseline is accepted by this change.
