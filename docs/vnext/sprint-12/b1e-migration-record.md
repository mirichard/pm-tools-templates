# B1E Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B1E`
- Asset count: `1`
- Rollback owner: `mirichard`
- Status: **PASS (local, pre-integration)**
- Initial implementation commit: `81a9b3f90b5bf4d71dd6a0e839291e4b5e0aed99`
- Delivery PR: [#1087](https://github.com/mirichard/pm-tools-templates/pull/1087)

## Scope decision

B1E moves one Planning-domain asset after B1D integrated the only dependency within the remaining Batch 1 migration graph. The two other dependencies are assigned to Batch 4 and remain valid at their current paths. Moving the Budget Template now unlocks the executive-report and traditional-project-charter chain.

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `role-based-toolkits/project-manager/essential-templates/budget-template.md` | `domains/planning/role-based-toolkits/project-manager/essential-templates/budget-template.md` | `8152afa2b63d3917167714c8467e7950ee75498df38471a714dfcd9f7f055b32` |

Historical/generated evidence files (`site/.lighthouseci/**`, `*.bak`) and the proposal snapshot `templates/templates.proposed.json` are retained unchanged. Maintained catalogs, indexes, mappings, current documentation, and navigation records use the canonical destination.

## Checkpoint A — Baseline

- `pre_batch_sha`: `aca38be3a1a4a15b6230e3a2b8163030d9ae0005`
- Working branch: `feat/b1e-budget-template`, created cleanly from current `origin/main`
- Source existed; destination did not exist
- Baseline metadata generation: PASS — 137 migration records and 137/137 cross-reference coverage with no generated drift
- Baseline domain counts: Stakeholder `11`, Team `9`, Delivery `69`, Planning `8`, Uncertainty `13`, Measurement `27`
- Baseline strict migration, curated-template, canonical-path, filtered-anchor, and focused test checks: PASS
- B1D prerequisite: PASS — PR [#1086](https://github.com/mirichard/pm-tools-templates/pull/1086) merged at `074ff132f564afff58e37f7e28dc342e31bbf0e7`; post-merge visual run [#380](https://github.com/mirichard/pm-tools-templates/actions/runs/34126811446), attempt 2, succeeded

## Checkpoints B/C — Move and compatibility

- The canonical body was moved with `git mv` into `domains/planning/...`.
- The legacy source path was recreated as a navigation-only Markdown pointer.
- The pointer resolves from the old path to the canonical destination.
- The destination SHA-256 equals the recorded pre-move source SHA-256.

## Checkpoint D — Canonical references

Maintained catalogs, domain/value-flow mappings, generated migration and cross-reference metadata, current documentation, and internal links were updated to the canonical destination. Historical evidence, backup files, and the proposal snapshot remain unchanged.

## Checkpoints E/F — Validation and decision

Validation command suite:

```bash
node scripts/generate-sprint-10-metadata.mjs
git diff --exit-code -- meta/migration-inventory.json meta/cross-references.json
node scripts/validate-sprint-10.mjs --require-annotations
node scripts/validate-curated-templates.js
node scripts/generate-template-index.js
git diff --exit-code -- TEMPLATE_INDEX.md
node scripts/validate-canonical-paths.js --strict
python3 scripts/check_anchor_links_filtered.py
npm run test:ci
```

Decision: **PASS (local, pre-integration) — retain B1E on the delivery branch**. Required PR checks and post-merge legacy bookmark checks remain integration gates.

Rollback boundary: revert the B1E delivery commit/merge commit, regenerate metadata/indexes, and rerun the same suite. Do not start B1F until B1E is integrated and final evidence is recorded.

## Exit evidence

| Acceptance area | Result |
|---|---|
| Mapping completeness | PASS — 137/137 |
| Domain minimum coverage | PASS — Stakeholder 11, Team 9, Delivery 69, Planning 8, Uncertainty 13, Measurement 27 |
| Move/hash integrity | PASS — destination hash equals the recorded source hash |
| Legacy pointer | PASS — navigation-only pointer resolves to the canonical destination |
| Canonical uniqueness and duplicate control | PASS — no migration-created canonical duplicate |
| Bidirectional navigation and internal links | PASS — 137/137 cross-reference coverage; strict and filtered-link validators pass |
| Catalog/index discovery | PASS — 139-template catalog and generated index point to the canonical destination |
| Reviewed visual regression | PASS — run [#382](https://github.com/mirichard/pm-tools-templates/actions/runs/34147504106), attempt 2 |
| Legacy `/blob/main/...` bookmark compatibility | Pending post-merge |
| Required CI | PASS — run 34147504186 |
| Production rollback command | Pending merge SHA |

Local exit suite results:

- Migration metadata generation: PASS — 137 records; 137/137 cross-reference coverage; deterministic regeneration
- Sprint 10 strict validator: PASS — 137/137; 100% cross-reference coverage
- Curated templates: PASS — 139 templates
- Authoritative template-index generation: PASS
- Canonical paths: PASS — 0 errors; 3 existing warnings
- Filtered anchor links: PASS
- Focused Jest suite: PASS — 1 suite, 2 tests, 100% coverage
