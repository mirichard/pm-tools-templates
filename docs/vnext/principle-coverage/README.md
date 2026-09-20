# Principles integration: annotation reconciliation

Issue #1058 completes the remaining annotation criterion of Epic #712. Base inspected: `4bd97b8f9b93fb72cc33669f4840934b91c21c6a` on main; review date: 09/20/2026.

## Reconciliation

Main contained the approved top-20 annotations, while the other 119 current catalog templates lacked the three-field contract. The earlier work is recoverable at `b803fab460987ee8c763cb31a63091038b549f40`, but its closure claim was not reflected in main. Its validator searched for the presence of `primary_principles:` and did not validate the complete contract.

All 119 missing assignments were reviewed against current template purpose, applicability guidance and content structure. Prior mappings were revised where unsuitable: cleaning validation described change control, a team charter described investment approval, and the user-story template described performance reporting. The new rationales identify concrete uses of each template rather than claiming guaranteed compliance or safety. `meta/principle-annotation-reconciliation.json` retains the recovered assignments, revised decisions, content headings and exact before/after hashes by canonical path and domain.

The existing 20 approved annotations are unchanged. Each addition is exactly three YAML lines. Removing those lines reconstructs every prior file byte-for-byte. Existing bodies, applicability guidance, links, migration wave evidence and review dates are preserved. Content-repair and review hashes record the additive annotation review; no new full-content, human or professional review is asserted.

## Denominator and enforcement

The scope is the unique existing canonical Markdown paths from the live `templates/templates.json`, resolving `canonical_path` when non-null and otherwise `path`. Legacy aliases do not add templates. At this revision there are 139 catalog records and 139 valid annotated templates, with no exclusions. This is an observed count, not a permanent target.

`meta/principle-coverage.json` is generated, not hand-maintained. It records the catalog's last-changing commit and content digest, schema digest, denominator, numerator, principle distribution, annotation line counts and each template's current digest and annotation. The validator independently derives the complete result and rejects a stale manifest, including denominator changes or unapproved exclusions. Reports separately record the tested commit and whether tracked working files differ from it, avoiding a self-referential committed HEAD digest.

Validation rejects duplicate canonical paths, missing/unsafe files, malformed or duplicate-key YAML, missing annotation fields, unknown or repeated principles, primary/secondary overlap, invalid rationale type/length, multiple sentences and annotations over ten physical lines. It reuses the live guidance validator and requires working taxonomy links to the anti-pattern guide and assessment. Semantic suitability remains an editorial review responsibility; passing syntax checks alone does not establish it.

The existing metadata CI workflow runs validation and regression tests on catalog, template, schema, validator, test and manifest changes, and uploads the tested-commit report. Future templates must satisfy full coverage before the check passes.

## Reproduce and maintain

From a checkout with Git history and PyYAML installed:

```sh
python scripts/validate_principle_coverage.py
python -m unittest tests.test_principle_coverage tests.test_principles_guidance tests.test_template_metadata tests.test_template_reviews tests.test_migrated_freshness
```

After reviewing a new or edited template, regenerate the manifest and include it in the same PR:

```sh
python scripts/validate_principle_coverage.py --write-manifest
python scripts/validate_principle_coverage.py --json-output /tmp/principle-coverage-validation.json
```

Regeneration writes only when all content checks pass. Review the generated diff; do not add exclusions or change the denominator manually.

## Epic acceptance mapping

| Epic #712 criterion | Evidence |
|---|---|
| Approved taxonomy | `docs/principles/principle-taxonomy.md`, schema and closed #741 |
| Every catalog template annotated | Generated full-catalog manifest and dedicated validator; #1058 |
| Usage and exclusion guidance | Closed #743, PR #1257 and live guidance validation |
| Misuse documentation | Closed #744 and ten indexed, reciprocally linked anti-patterns |
| Principle self-assessment | Closed #745 and PR #1257 browser/scoring tests; owner accepted timing criterion on 09/20/2026 without claiming a measured duration |
| Lightweight annotations | Three added lines per template; existing 20 preserved; ten-line maximum enforced |

Local validation: all 46 coverage, guidance, metadata, review and freshness tests pass; 137/137 migrated reviews validate with no freshness errors or age warnings; all 119 original files reconstruct exactly after removing annotations. CI and final integration results belong in the PR and issue closure records. Neither #1058 nor #712 should close solely on this pre-integration report. Future recommender and adoption-metric work is outside this epic's six stated acceptance criteria; no sprint or release scope is added.
