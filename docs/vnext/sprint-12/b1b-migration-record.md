# B1B Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B1B`
- Asset count: `2`
- Rollback owner: `mirichard`
- Status: **PASS (local, pre-integration)**
- Delivery PR: pending

## Scope decision

B1B is the smallest dependency-complete expansion after the B1A canary. The two Planning-domain assets are mutual dependencies and therefore move in one atomic subset under the approved rule that mutually related assets move together. Each asset had 11 inventory-listed inbound-reference files before execution.

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `industry-specializations/information-technology/infrastructure/data_center_design_template.md` | `domains/planning/industry-specializations/information-technology/infrastructure/data_center_design_template.md` | `d7fd9270887a9ddaf7025bf5963df1cc4ecda89c63a76bd3b3af103c3fea0a07` |
| `industry-specializations/information-technology/infrastructure/disaster_recovery_template.md` | `domains/planning/industry-specializations/information-technology/infrastructure/disaster_recovery_template.md` | `e2f85f6387be817a220dfa32eb65083df02fc50ad3054ea62c5e3f56d52c00a5` |

Historical/generated evidence files (`site/.lighthouseci/**`, `*.bak`) and the proposal snapshot `templates/templates.proposed.json` are retained unchanged. Maintained catalogs, indexes, mappings, current documentation, and navigation records use the canonical destinations.

## Checkpoint A — Baseline

- `pre_batch_sha`: `e88846275ce7f1097a4671cd25330eb5dd06c5d1`
- Working branch: `feat/b1b-domain-migration`, created cleanly from current `origin/main`
- Sources existed; destinations did not exist
- Baseline metadata generation: PASS — 137 migration records and 137/137 cross-reference coverage with no generated drift
- Baseline domain counts: Stakeholder `11`, Team `9`, Delivery `69`, Planning `8`, Uncertainty `13`, Measurement `27`
- Baseline strict migration, curated-template, canonical-path, filtered-anchor, and focused test checks: PASS
- B1A prerequisite: PASS — integrated; Visual Regression Testing run [#348](https://github.com/mirichard/pm-tools-templates/actions/runs/34040783605) succeeded

## Checkpoints B/C — Move and compatibility

- Both canonical bodies were moved with `git mv` into `domains/planning/...`.
- Each legacy source path was recreated as a navigation-only Markdown pointer.
- Each pointer resolves from the old path to its canonical destination.
- Each destination SHA-256 equals its recorded pre-move source SHA-256.

## Checkpoint D — Canonical references

Maintained references updated in the same atomic batch:

- `meta/domain-mapping.json`
- `meta/value-flow-mapping.json`
- `meta/cross-references.json`
- `meta/migration-inventory.json`
- `templates/templates.json`
- `TEMPLATE_INDEX.md`
- `industry-specializations/information-technology/README.md`
- `docs/templates/data_center_design_template.md`
- `docs/templates/disaster_recovery_template.md`

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

The first post-move run exposed and corrected a generator defect that only appears when multiple executed assets reference each other. Generation now builds one complete executed-path map and applies it atomically to dependencies and all cross-reference fields. The strict validator confirms that mutual relationships remain symmetric and previous/next navigation remains bidirectional.

Decision: **PASS (local, pre-integration) — retain B1B on the delivery branch**. Required PR checks and post-merge legacy bookmark checks remain integration gates.

Rollback boundary: revert the single B1B delivery commit/merge commit, regenerate metadata/indexes, and rerun the same suite. Do not start B1C until B1B is integrated and the final evidence below is recorded.

## Exit evidence

| Acceptance area | Result |
|---|---|
| Mapping completeness | PASS — 137/137 |
| Domain minimum coverage | PASS — Stakeholder 11, Team 9, Delivery 69, Planning 8, Uncertainty 13, Measurement 27 |
| Move/hash integrity | PASS — 2/2 destination hashes equal their recorded source hashes |
| Legacy pointers | PASS — 2/2 navigation-only pointers resolve to canonical destinations |
| Canonical uniqueness and duplicate control | PASS — no migration-created canonical duplicates |
| Bidirectional navigation and internal links | PASS — 137/137 cross-reference coverage; strict and filtered-link validators pass |
| Catalog/index discovery | PASS — 139-template catalog and generated index point to canonical destinations |
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
