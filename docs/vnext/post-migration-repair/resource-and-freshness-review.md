# Resource references and content freshness

Review date: 09/19/2026. Comparison base: `dc7146cc59387421b872dffbadd86b8b6f8dd3a2` (draft PR #1253). This is a follow-up maintenance batch, not a claim that the full content-review backlog is complete.

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

The exact denominator is the 137 executed destinations in the immutable migration inventory. The content-review ledger is `meta/template-content-reviews.json`.

| Outcome | Templates | Meaning |
|---|---:|---|
| Completed AI content review | 24 | Full bodies read; 20 substantively revised and dated, four retained with original modification dates and separate review evidence. |
| Specialist review needed | 2 | Full bodies inspected; pharmaceutical QbD claims and purchase-order legal language remain unresolved. |
| Full content review pending | 111 | Structural checks and limited maintenance do not count as completed substantive review. |

The first batch selected the 26 templates below 700 words at the comparison base. It found and corrected more than age debt:

- Removed 14 conflicting metadata blocks rendered as body text. Five belong to longer templates still pending full review; cleanup alone did not earn a freshness date.
- Replaced six skeletal templates with actionable assessment, enterprise risk, hybrid planning, data-center planning, disaster-recovery planning, and migration planning fields.
- Added evidence, defined scoring, N/A handling, accountable actions, and follow-up to eight short assessments.
- Corrected risk-score calculation and probability bands, dashboard variance conventions, and default testing exclusions.
- Corrected Scrum terminology, optional Daily Scrum prompts and facilitation, and the distinction between story acceptance and Definition of Done against the [November 2020 Scrum Guide](https://scrumguides.org/scrum-guide.html).

Reviews are explicitly attributed to Codex as AI-assisted content maintenance. They do not assert human acceptance, specialist approval, or operational verification. The 24 completed reviews reduce migrated-template age warnings from 137 to 113. Those 113 warnings remain visible: 111 pending full review and two requiring specialist review. No mass date reset occurred.

## Review policy

`updated` remains the date of a substantive content revision. A separate completed review can establish freshness for unchanged content. The linter accepts it only when the ledger supplies a valid review date, identified reviewer, full-content scope, specific evidence, and SHA-256 matching the current file. A later content change invalidates that review. Missing, pending, partial, stale, malformed, and future-dated reviews cannot silently clear warnings. Future modification dates are invalid as well.

For subsequent batches:

1. Select pending records by domain and read each complete body.
2. Verify instructions, examples, assumptions, scope, metadata, links, and time-sensitive claims; use authoritative sources where needed.
3. Repair findings, or record the specific unresolved finding. Do not attest currentness for a partial review.
4. Change `updated` only for substantive revisions; record completed full-content review date, reviewer, evidence, and exact SHA-256 separately.
5. Update the exact current-body repair hash while preserving original migration hashes and wave manifests. Run the validators and commit the evidence together.

The two specialist findings are recorded per file in the ledger. QbD requires validation of product-specific example limits and the asserted design-space requirement. The purchase order requires review of its unconditional acceptance and legally-binding statements against the intended purchasing terms and jurisdiction. Neither is marked current.

## Validation

- Original inventory and wave manifests unchanged; strict Sprint 10 validation passes for all 137 destinations with annotations.
- Migration post-check: zero diagnostics. Catalog identity: zero errors or warnings. Domain synchronization: 139 records verified.
- Original 286-file link scope: 1,191 local inline links checked, zero failures, including new section anchors. New research plan: two additional local links pass.
- Migrated metadata: zero required-field errors; 113 age warnings deliberately retained.
- Review ledger: 137 unique inventory destinations; 24 completed, two specialist-review, 111 pending; completed hashes verified.
- 54 Node tests and 38 Python tests pass. The affected metadata workflow passes actionlint with shellcheck/pyflakes disabled.

Remote CI and visual review remain outstanding. No screenshot baseline was accepted, no workflow was manually dispatched, and no issue was closed.
