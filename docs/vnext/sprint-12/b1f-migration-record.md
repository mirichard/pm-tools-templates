# B1F Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B1F`
- Asset count: `8`
- Primary domain: `Stakeholder`
- Rollback owner: `mirichard`
- Status: **PASS (local, pre-integration)**
- Delivery PR: Pending

## Scope decision

B1F executes the eight remaining Batch 1 Stakeholder-domain moves as one dependency-aware wave. It includes the atomic same-wave pair `project-assessment-suite/stakeholder-engagement-assessment-template.md` and `role-based-toolkits/product-owner/okr-template.md`; neither member may be retained independently if the wave is rolled back. Dependencies outside B1F remain available at their existing or previously migrated paths.

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `business-stakeholder-suite/executive-dashboards/Word/Executive-Report-Templates.md` | `domains/stakeholder/business-stakeholder-suite/executive-dashboards/Word/Executive-Report-Templates.md` | `1338a81251bc9956211cbdf2a8473105aca45b45ee8607fbdac59a0524119381` |
| `business-stakeholder-suite/executive-dashboards/powerbi-integration/executive-dashboard-template.md` | `domains/stakeholder/business-stakeholder-suite/executive-dashboards/powerbi-integration/executive-dashboard-template.md` | `2f7f07ed73be740db85f2e104d859701da83cf205f731b8a465a0e80e445872b` |
| `business-stakeholder-suite/financial-governance/budget-dashboard-template.md` | `domains/stakeholder/business-stakeholder-suite/financial-governance/budget-dashboard-template.md` | `167f338626bb4c864e00458699a36be5687b998c92d37103e1a286de53bd88ee` |
| `business-stakeholder-suite/financial-governance/enhanced-business-cases/advanced-business-case-template.md` | `domains/stakeholder/business-stakeholder-suite/financial-governance/enhanced-business-cases/advanced-business-case-template.md` | `b9fca0975cc801353e0ff7ddac459ea8631fdd7fc9498bf55c07d769b8ea04df` |
| `project-assessment-suite/waterfall-project-assessment-template.md` | `domains/stakeholder/project-assessment-suite/waterfall-project-assessment-template.md` | `95165f9cbf36fa6dc2e812e45a845342b045c6fa072f3126994feab5a7128404` |
| `project-lifecycle/01-initiation/stakeholder-analysis/agile-stakeholder-map-template.md` | `domains/stakeholder/project-lifecycle/01-initiation/stakeholder-analysis/agile-stakeholder-map-template.md` | `a9312efad04f7976d8e03c39f0ac59658001629c1c0d57150db91c44ccea9f17` |
| `project-assessment-suite/stakeholder-engagement-assessment-template.md` | `domains/stakeholder/project-assessment-suite/stakeholder-engagement-assessment-template.md` | `f75d1438fe08ec594fda5f649f2fdb9c014677fcd2b8e46fc5eb04db35f19e2c` |
| `role-based-toolkits/product-owner/okr-template.md` | `domains/stakeholder/role-based-toolkits/product-owner/okr-template.md` | `8275b3a215747acf56a7a6324a5994ce78a312548bcfba25fda8b712a172e841` |

Historical/generated evidence under `site/.lighthouseci/**` is not rewritten. Maintained catalogs, indexes, mappings, documentation, and navigation records use canonical destinations.

## Checkpoint A — Baseline

- `pre_batch_sha`: `fe526dbec23f50a1ac9d97a7ae5f798a69d78c40`
- Working branch: `feat/b1f-stakeholder-wave`, created from the merged PR #1088 commit on `main`
- Entry-manifest validation: PASS — 8 source assets and hashes verified; no destination collisions
- Dependency disposition: PASS — all dependencies satisfied; the two-asset cycle is retained atomically

## Checkpoints B/C — Move and compatibility

- All eight canonical bodies moved into `domains/stakeholder/...`.
- Each legacy source was recreated as a navigation-only Markdown pointer.
- Each pointer resolves from its legacy path to its canonical destination.
- Each destination SHA-256 equals its recorded pre-move source SHA-256.

## Checkpoint D — Canonical references

Maintained catalogs, domain/value-flow mappings, generated migration and cross-reference metadata, current documentation, and internal links are updated to canonical destinations. The B1F manifest retains legacy source paths as immutable execution evidence.

## Checkpoints E/F — Validation and decision

Validation command suite:

```bash
node scripts/validate-migration-wave.mjs --manifest meta/migration-waves/b1f.json
node scripts/generate-sprint-10-metadata.mjs
git diff --exit-code -- meta/migration-inventory.json meta/cross-references.json
node scripts/validate-sprint-10.mjs --require-annotations
node scripts/validate-curated-templates.js
node scripts/generate-template-index.js
git diff --exit-code -- TEMPLATE_INDEX.md
node scripts/validate-canonical-paths.js --strict
python3 scripts/check_anchor_links_filtered.py
npm run test:migration-wave
npm run test:ci
```

Decision: **PASS (local, pre-integration) — retain the complete B1F wave on the delivery branch**.

Rollback boundary: revert the complete B1F delivery commit or merge commit, regenerate metadata/indexes, and rerun the same suite. The eight assets—including both members of the atomic dependency pair—must roll back together.

## Exit evidence

| Acceptance area | Result |
|---|---|
| Mapping completeness | PASS — 137/137 |
| Move/hash integrity | PASS — all 8 destination hashes equal their recorded source hashes |
| Legacy pointers | PASS — all 8 navigation-only pointers resolve to their canonical destinations |
| Dependency evidence integrity | PASS — executed manifest validates all dispositions; atomic pair retained |
| Canonical uniqueness and duplicate control | PASS — no migration-created canonical duplicate |
| Bidirectional navigation and internal links | PASS — 137/137 cross-reference coverage; strict and filtered-link validators pass |
| Catalog/index discovery | PASS — 139-template catalog and generated index use canonical paths with legacy aliases |
| Reviewed visual regression | Pending PR validation |
| Legacy `/blob/main/...` bookmark compatibility | Pending post-merge |
| Required CI | Pending PR validation |
| Production rollback command | Pending merge SHA |

Local exit suite results:

- Executed B1F manifest: PASS — 8 assets, limit 12
- Migration-wave tests: PASS — 11/11
- Migration metadata generation: PASS — 137 records; 137/137 cross-reference coverage
- Sprint 10 strict validator: PASS — 137/137; 100% cross-reference coverage
- Curated templates: PASS — 139 templates
- Canonical paths: PASS — 0 errors; 3 pre-existing warnings
- Filtered anchor links: PASS
- Focused Jest: PASS — 1 suite, 2 tests, 100% coverage
