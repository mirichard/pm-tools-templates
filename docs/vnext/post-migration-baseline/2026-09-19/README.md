# Post-migration quality baseline — 09/19/2026

**Overall: migration integrity verified; quality baseline has open defects. Not a clean release certification.**

Pinned main revision: [`4525639da93fde99efef64295324e8d72e6c61d7`](https://github.com/mirichard/pm-tools-templates/commit/4525639da93fde99efef64295324e8d72e6c61d7), after #1250 (catalog domains) and #1251 (legacy pointers). This report supersedes earlier closeout status for this revision; it does not rewrite historical validation evidence.

## Scope and results

| Area | Result | Evidence |
|---|---|---|
| Migration inventory and content integrity | PASS | 137 executed moves; all 137 canonical SHA-256 values exactly match recorded pre-move hashes. |
| Legacy compatibility | PASS | All 137 pointers satisfy the shared navigation-only contract and target maintained files. The former 301 pointer errors are absent. |
| Catalog domains | PASS | 139/139 entries resolve to approved primary domains; sync check makes zero changes. |
| Catalog identity | WARNING | One stakeholder-register entry has different `path` and `canonical_path`; existing validator reports zero errors and one warning. |
| Required front matter | FAIL | 128/137 migrated templates pass; nine have invalid `complexity`. Both additional benefits templates pass, giving 130/139 catalog-path bodies valid metadata. |
| Metadata freshness | WARNING | All 137 migrated bodies have `updated` dates older than 365 days as of 09/19/2026. A stale date does not prove stale content; do not reset dates without review. |
| Domain coverage | PASS | Migration counts: Stakeholder 11, Team 9, Delivery 67, Planning 8, Uncertainty 14, Measurement 28. Every domain exceeds minimum 3. Catalog adds two Measurement benefits templates. |
| Root domain navigation | FAIL | All six domain links are missing from the root README; domain navigation validator reports six errors. |
| Local inline links | FAIL | 1,193 occurrences checked across 286 unique files; 82 failures across 36 files. |
| Repository migration post-check | FAIL | 405 diagnostics, including maintained references to legacy locations. These are not 405 missing pointers and can overlap other findings. |
| Duplicate content | PASS within scope | Zero duplicate raw-content or whitespace-normalized body groups among 137 migrated destinations; 137 unique destinations and 139 unique catalog paths. |
| Focused regression tests | PASS | 28 tests pass: catalog domains, migration post-check, domain navigation, and reviewed-domain regeneration. Unit tests do not override failed live-repository checks. |
| CI snapshot | MIXED | 25 runs: 13 successful, 11 failed, one in progress at capture. See timestamped snapshot; this is not a final all-green claim. |
| Visual coverage | UNVERIFIED | Merge visual run was still in progress at capture. No screenshots or new baselines were accepted by this audit. |

## Evidence files

- [baseline.json](baseline.json): per-template hashes, metadata errors/warnings, pointer results, every scoped link failure, duplicate groups, catalog identity discrepancy, and complete local validator outputs.
- [ci-snapshot.json](ci-snapshot.json): observed time, exact commit, run IDs, attempts, URLs, and states for all 25 returned runs. Later workflow completion does not retroactively change this snapshot.
- [Audit script](../../../../scripts/audit-post-migration.py): repeatable local capture using existing repository validators. Requires Python with PyYAML, Node.js, and Git. It records failed checks without treating the capture operation itself as a release gate.

## Prioritized repair queue

1. **Restore enforceable CI.** Migration Post-Check run [35463634961](https://github.com/mirichard/pm-tools-templates/actions/runs/35463634961) failed during checkout because `jira-automation-scripts` has no URL in `.gitmodules`. Metadata run [35463634918](https://github.com/mirichard/pm-tools-templates/actions/runs/35463634918) failed in clean-status tests before metadata lint: a missing `if` guard and a 22,681-character interpolated scalar. Other failed workflows require their own diagnosis; their causes are not inferred here. Exit: these gates execute their intended validators successfully, with no weakened assertions.
2. **Repair root navigation and maintained references.** Restore the six domain entry links and disposition every one of the 405 post-check diagnostics. The current missing links contradict earlier owner-reported resolution; preserve that historical human acceptance without using it to override this observed revision. Exit: both live validators pass.
3. **Resolve catalog identity and nine metadata defects.** Reconcile stakeholder-register identity deliberately; correct invalid complexity values using the documented schema. Review old `updated` dates on substance. Exit: 139 catalog-path bodies pass required metadata and canonical identity warning is resolved. Template-body changes must follow the content-change provenance process; do not rewrite original migration hashes to force a pass.
4. **Repair scoped links.** Use all 82 recorded occurrences, validate target meaning, and explicitly disposition absent resources. Exit: zero unresolved failures in the same 286-file scope. Do not fabricate targets or broaden scope silently.
5. **Complete visual acceptance.** Inspect the completed merge run's comparisons, regressions, unbaselined captures, errors, and artifacts. Human-review changed surfaces before publishing baselines. Exit: documented reviewed coverage and remaining limitations, not merely a green job.

The numbered items are a prioritized work queue, not claims that separate tracking issues have already been filed. This baseline changes no templates, workflow policy, or issue closure state.

## Interpretation and limits

- The metadata audit is a full census of the 137 migrated destination bodies plus two catalog additions, not a changed-files-only check. It applies the existing required-field/schema rules directly; catalog `domain` completeness is tested separately. The stakeholder-register alternate canonical identity is reported separately and must be reconciled.
- Link scope is all migrated destinations, legacy pointers, catalog paths/canonical identities, six domain READMEs, root README, template index, and legacy-navigation policy. The existing checker handles local inline Markdown links outside fenced code and ATX/HTML anchors. External HTTP availability, reference-style links, rendered site routes, and legacy section fragments are not tested.
- Duplicate checks cover exact and whitespace-normalized migrated bodies, not semantic similarity or all repository documents.
- The standard Sprint 10 author validator passes. The separately gated `--require-annotations` mode was not run or certified.
- Prior #1166 evidence documented 2,426 unbaselined images. That historical gap is not a count of this run's coverage; current visual coverage remains unknown until the run and artifacts are assessed.
- Original source bodies remain protected by recorded hashes. Passing integrity proves byte preservation, not editorial correctness or usability.

## Reproduce and compare

Use an isolated checkout of the pinned revision and run the audit script from this report's PR by absolute path with that checkout as the working directory:

```sh
python3 /path/to/audit-post-migration.py --as-of 2026-09-19 --output /tmp/post-migration-baseline.json
```

The script records the checkout's exact SHA. Compare per-path errors, hashes, and link occurrences with `baseline.json`; command timings in test output may differ. Capture CI separately through the commit-filtered Actions runs API. Future repair evidence should identify a new commit and delta; retain this snapshot unchanged rather than relabeling its defects as passes.
