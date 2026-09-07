# B1D Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B1D`
- Asset count: `1`
- Rollback owner: `mirichard`
- Status: **PASS (local, pre-integration)**
- Initial implementation commit: pending
- Delivery PR: pending

## Scope decision

B1D moves one Stakeholder-domain asset with no unresolved dependency inside the remaining Batch 1 inventory. It unlocks the budget-template dependency chain, which subsequently feeds the executive-report, executive-dashboard, budget-dashboard, and traditional-charter migrations.

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `project-lifecycle/01-initiation/stakeholder-analysis/enterprise-stakeholder-analysis-template.md` | `domains/stakeholder/project-lifecycle/01-initiation/stakeholder-analysis/enterprise-stakeholder-analysis-template.md` | `a63bf5c5e6d9c5fa3a2db03e6bd04bcd902bc013d61e9e890568f265363e6555` |

Historical/generated evidence files (`site/.lighthouseci/**`, `*.bak`) and the proposal snapshot `templates/templates.proposed.json` are retained unchanged. Maintained catalogs, indexes, mappings, current documentation, and navigation records use the canonical destination.

## Checkpoint A — Baseline

- `pre_batch_sha`: `cd58f39d99531429df48fd0dce7e05c0439aa180`
- Working branch: `feat/b1d-enterprise-stakeholder-analysis`, created cleanly from current `origin/main`
- Source existed; destination did not exist
- Baseline metadata generation: PASS — 137 migration records and 137/137 cross-reference coverage with no generated drift
- Baseline domain counts: Stakeholder `11`, Team `9`, Delivery `69`, Planning `8`, Uncertainty `13`, Measurement `27`
- Baseline strict migration, curated-template, canonical-path, filtered-anchor, and focused test checks: PASS
- B1C prerequisite: PASS — PR [#1085](https://github.com/mirichard/pm-tools-templates/pull/1085) merged at `cd58f39d99531429df48fd0dce7e05c0439aa180`; post-merge visual run [#34121847059](https://github.com/mirichard/pm-tools-templates/actions/runs/34121847059) succeeded

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

Decision: **PASS (local, pre-integration) — retain B1D on the delivery branch**. Required PR checks and post-merge legacy bookmark checks remain integration gates.

Rollback boundary: revert the B1D delivery commit/merge commit, regenerate metadata/indexes, and rerun the same suite. Do not start B1E until B1D is integrated and final evidence is recorded.

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
| Reviewed visual regression | Pending |
| Legacy `/blob/main/...` bookmark compatibility | Pending post-merge |
| Required CI | Pending |
| Production rollback command | Pending merge SHA |

Local exit suite results:

- Migration metadata generation: PASS — 137 records; 137/137 cross-reference coverage; deterministic regeneration
- Sprint 10 strict validator: PASS — 137/137; 100% cross-reference coverage
- Curated templates: PASS — 139 templates
- Authoritative template-index generation: PASS
- Canonical paths: PASS — 0 errors; 3 existing warnings
- Filtered anchor links: PASS
- Focused Jest suite: PASS — 1 suite, 2 tests, 100% coverage
