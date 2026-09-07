# B1C Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B1C`
- Asset count: `1`
- Rollback owner: `mirichard`
- Status: **PASS (pre-integration)**
- Initial implementation commit: `7be5305d90cb9a7ee078a92e5762ee54442b11f3`
- Delivery PR: [#1085](https://github.com/mirichard/pm-tools-templates/pull/1085)

## Scope decision

B1C is the smallest executable continuation after B1B: one Stakeholder-domain asset. Moving the EVM dashboard first also converts a dependency used by two remaining Batch 1 assets—the advanced business case and budget dashboard templates—to its canonical location.

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `business-stakeholder-suite/financial-governance/enhanced-business-cases/evm-dashboard-template.md` | `domains/stakeholder/business-stakeholder-suite/financial-governance/enhanced-business-cases/evm-dashboard-template.md` | `4e10e837a2028a3bf287768652da91000487d140efc9799b5c19d0602fd901e5` |

Historical/generated evidence files (`site/.lighthouseci/**`, `*.bak`) and the proposal snapshot `templates/templates.proposed.json` are retained unchanged. Maintained catalogs, indexes, mappings, current documentation, and navigation records use the canonical destination.

## Checkpoint A — Baseline

- `pre_batch_sha`: `a962df1a41783ba5ca471e800c9660c1c0d3df5a`
- Working branch: `feat/b1c-evm-dashboard`, created cleanly from current `origin/main`
- Source existed; destination did not exist
- Baseline metadata generation: PASS — 137 migration records and 137/137 cross-reference coverage with no generated drift
- Baseline domain counts: Stakeholder `11`, Team `9`, Delivery `69`, Planning `8`, Uncertainty `13`, Measurement `27`
- Baseline strict migration, curated-template, canonical-path, filtered-anchor, and focused test checks: PASS
- B1B prerequisite: PASS — PR [#1084](https://github.com/mirichard/pm-tools-templates/pull/1084) merged; pre-merge visual run [#370](https://github.com/mirichard/pm-tools-templates/actions/runs/34114056079) and post-merge run [#371](https://github.com/mirichard/pm-tools-templates/actions/runs/34115828621) succeeded

## Checkpoints B/C — Move and compatibility

- The canonical body was moved with `git mv` into `domains/stakeholder/...`.
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

Decision: **PASS (pre-integration) — retain B1C on the delivery branch**. Required PR checks, including visual regression against the reviewed baselines, passed. The post-merge legacy bookmark check remains the final integration gate.

Rollback boundary: revert the B1C delivery commit/merge commit, regenerate metadata/indexes, and rerun the same suite. Do not start B1D until B1C is integrated and final evidence is recorded.

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
| Reviewed visual regression | PASS — run [#373](https://github.com/mirichard/pm-tools-templates/actions/runs/34118412210), attempt 2 |
| Legacy `/blob/main/...` bookmark compatibility | Pending post-merge |
| Required CI | PASS — all 16 PR workflows completed successfully or were conditionally skipped as designed |
| Production rollback command | Pending merge SHA |

Local exit suite results:

- Migration metadata generation: PASS — 137 records; 137/137 cross-reference coverage; deterministic regeneration
- Sprint 10 strict validator: PASS — 137/137; 100% cross-reference coverage
- Curated templates: PASS — 139 templates
- Authoritative template-index generation: PASS
- Canonical paths: PASS — 0 errors; 3 existing warnings
- Filtered anchor links: PASS
- Focused Jest suite: PASS — 1 suite, 2 tests, 100% coverage
