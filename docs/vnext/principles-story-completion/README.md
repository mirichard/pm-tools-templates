# Principles stories #743–745: completion evidence

Base inspected: `11a47f0789ba120d23ee88526e5ac19340298bc9`. Author: Codex. Review date: 09/20/2026.

## Findings on the merged baseline

The closed Epic #712 and earlier Sprint 13 reports did not establish completion of these child stories. Most catalog entries had principle tags but no explicit usage sections. The anti-pattern guide had ten brief rows without template-specific discovery links. The self-assessment had one prompt per principle and a 0–2 scale, rather than the required 3–5 prompts and 1–5 scale. Its interpretation also introduced a governance gate inconsistent with story #745's advisory purpose.

## #743 — Usage guidance

| Acceptance criterion | Delivery / evidence |
|---|---|
| 2–5 When to Use bullets | Two authored applicability bullets per current canonical catalog entry |
| 2–5 When NOT to Use bullets | Two exclusions, including a relevant linked misuse pattern |
| Pairs Well With | Two links to complementary canonical templates |
| Context-specific guidance | File-specific purpose, near-miss exclusions, and reviewed pairing choices; structural checks reject identical use sections |
| Decision-engine context | Situations address phase, risk, team or industry as appropriate; every entry links the existing #726 context model |
| Top three domains first | Repair order: Delivery (67), Measurement (30), Uncertainty (14), then Stakeholder (11), Team (9), Planning (8) |

The denominator is the live `templates/templates.json` catalog: 139 canonical records at this revision, including the two benefits templates beyond the 137 migrated assets. Legacy pointers and duplicate views are not additional templates. No current catalog entry is being retired by this work. The validator uses the live catalog, so new entries cannot bypass the guidance requirements.

The per-file record in `meta/principles-story-completion.json` binds prior and new hashes and records domain order. Prior bodies are retained exactly; the two existing benefit-template guidance headings are renamed to supplemental headings so their instructions remain available without duplicate required sections. Original migration hashes and wave manifests are unchanged. Review ledger dates are preserved: the additional evidence describes a scoped review of the additions, not a new full-body or professional review.

## #744 — Anti-pattern documentation

The [guide](../../principles/anti-patterns.md) provides ten indexed patterns. Each includes domains, description, symptoms, impact, corrective alternative, and specific template links. All 139 template exclusions link to their applicable pattern, and each pattern links back to its relevant templates. This supplies browsing and reciprocal discovery without replacing local guidance.

## #745 — Self-assessment

The [worksheet and instructions](../../principles/self-assessment.md) and [interactive worksheet](../../principles/self-assessment.html) cover all ten approved principles with three questions each and anchored scores from 1 to 5. The browser version computes principle means, overall alignment, ten labeled visual bars, and lowest-score priorities. Each principle links to two concrete improvement tools. Unknown answers stay incomplete; sample or missing values do not become favorable scores. Solo and team-first-pass instructions, action ownership, follow-up, print, and reset are included. Responses are not transmitted or persisted.

**Remaining acceptance check:** The under-ten-minute criterion has a nine-minute first-pass design, but no representative human timed trial has been recorded. Automated form filling does not prove reading, judgment, or completion time. Keep #745 open until a timed first pass is recorded (scope, elapsed time, any confusing questions, and an improvement selected). Team discussion and evidence gathering are explicitly outside that first pass.

## Validation and closure rules

- `python scripts/validate_principles_guidance.py`: 139 catalog templates, ten patterns, zero errors.
- Five guidance regression tests cover missing guidance, catalog growth, broken pattern anchors, self-pairing, and the current catalog.
- Four scoring tests cover taxonomy, question count, concrete tool links, incomplete answers, valid range, invalid inputs, and equal weighting.
- Thirty-three existing metadata, review, and migrated-freshness tests pass.
- Migrated freshness: 137/137 reviewed, zero errors and age warnings.
- Strict Sprint 10 author validation passes; migration post-check passes with 137 executed moves and zero remaining.
- Reversing only the guidance insertion and two heading renames reconstructs all 139 prior template bodies exactly.
- Git diff whitespace check passes.
- Browser scoring, reset, accessibility, mobile fit, and screenshot capture run in the existing Web MVP accessibility workflow. Local browser execution was blocked by the unavailable Chromium download; do not claim local visual acceptance.

Remote CI and screenshot inspection must pass before merge readiness. Close #743 and #744 only after merge and post-merge verification. Keep #745 and the parent incomplete until the timing acceptance check is satisfied. No new sprint scope is introduced.
