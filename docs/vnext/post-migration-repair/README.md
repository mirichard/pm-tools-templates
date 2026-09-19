# Post-migration quality repairs

Baseline: main `4525639da93fde99efef64295324e8d72e6c61d7` and baseline PR #1252. This change repairs the measured repository state; it does not relabel the original baseline as passing.

## Results

| Check | Baseline | Local repaired state |
|---|---|---|
| Migrated-template required metadata | 9 invalid complexity values | 0 errors; `basic` normalized to schema value `starter` |
| Catalog identity | 1 path/canonical-path disagreement | 0 warnings; stakeholder register points to its migrated body and preserves prior location as alias |
| Root domain navigation | 6 missing entry links | 6/6 entry points pass |
| Maintained references | 405 diagnostics | Post-check passes; historical diagnostic report preserved as a narrowly named evidence exception |
| Local inline links | 82 failed occurrences in baseline scope | 0 failed occurrences in the same 286-file scope |
| Migration validation | Original bodies only | Strict author validation, including `--require-annotations`, passes with explicit content-repair provenance |
| Legacy pointers | 137 pass | 137 preserved |
| Unit tests | 28 focused tests | 54 Node tests and 30 Python tests pass |
| Workflow startup | Multiple invalid workflows | All 11 affected workflow files pass actionlint 1.7.7 (shellcheck/pyflakes disabled) |

## Content and reference decisions

- Original migration inventory hashes and wave manifests are unchanged. `meta/content-repairs.json` binds 38 intentionally repaired bodies to their original hashes and exact current SHA-256 values. Sprint 10 and historical executed-wave validators require those exact values; unknown paths, duplicate entries, forged originals, missing rationale, and further body edits fail. Three new regression tests verify the contract. This manifest is part of the proposed PR and requires review, not evidence of approval already granted.
- `link-dispositions.json` lists each affected source/target decision. Available matching resources replace broken paths. For 34 target records without an established equivalent, the original resource label remains as plain text with an explicit unavailable notice. This removes deceptive links without inventing templates; those missing resources remain content-coverage gaps. General project risk links target enterprise risk assessment, not the unrelated cybersecurity assessment.
- `link_health_report_filtered.txt` is a historical generated diagnostic report, not maintained navigation. Its original bytes are preserved and its exact filename is added to the existing historical/reference policy. No maintained template or directory is excluded. Its historical findings are not claims about the repaired revision.
- Two nonmigrated infrastructure templates touched by reference corrections receive required front matter so changed-file metadata enforcement also passes. Existing migrated `updated` dates are not mass-reset: 137 age warnings remain pending substantive review.

## CI repair scope

- Remove the orphan `jira-automation-scripts` gitlink (recorded commit `bea2a9a195cfab3c62d925a956941c25af2f61a0`) from the parent repository index. There was no `.gitmodules` entry or configured URL; this unconfigured pointer caused checkout cleanup to fail. No child repository is deleted; the gitlink remains recoverable in parent history.
- Restore clean-status workflow safety logic from `923e666` while preserving current action versions. Test mode suppresses email/commits; generation and safe-mode tests pass without delivery.
- Restore three missing migration npm scripts and add content-repair regression tests to the migration gate.
- Correct a committed conflict marker, malformed YAML quoting/heredoc indentation, unsupported mail-action inputs, unavailable expression contexts, missing step/job references, and undeclared manual inputs in the affected workflows. Artifact cleanup remains manual and requires explicit cleanup/force selection; this work does not dispatch it.

Static workflow validation is not a claim that every manually dispatched integration succeeds. No email, artifact deletion, production dispatch, or external-service integration was executed. Remote PR/main CI and screenshot review remain integration gates; no visual baseline is published or accepted here.

## Reproduction

```sh
node scripts/validate-sprint-10.mjs --require-annotations
node scripts/migration-post-check.mjs
node scripts/validate-domain-navigation.mjs
node scripts/validate-canonical-paths.js
node scripts/validate-curated-templates.js
node scripts/sync-catalog-domains.js --check
node --test tests/content-repairs.test.mjs tests/migration-wave.test.mjs tests/migration-post-check.test.mjs tests/domain-navigation.test.mjs tests/catalog-domains.test.cjs tests/reviewed-domain-mapping.test.mjs
python3 -m unittest discover -s tests -p test_template_metadata.py
python3 -m unittest discover -s tests -p test_clean_status.py
python3 -m unittest tests.test_quality_gate_baseline
```

For scoped links, use `check_migration_links.check` on the `link_scope_files` list in PR #1252's baseline JSON. External HTTP availability and legacy section fragments remain outside that check. Preserve this before/after scope when reporting future results.
