# B1G Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B1G`
- Asset count: `5`
- Primary domain: `Planning`
- Rollback owner: `mirichard`
- Status: **PASS (local, pre-integration)**
- Delivery PR: [#1091](https://github.com/mirichard/pm-tools-templates/pull/1091)

## Scope decision

B1G executes the five remaining Batch 1 Planning-domain moves as one dependency-aware wave. Every recorded dependency is available at an existing deferred path or a previously executed canonical path. The wave completes Batch 1 while retaining every legacy source as a navigation-only pointer.

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `project-lifecycle/01-initiation/project-charter/traditional-project-charter-template.md` | `domains/planning/project-lifecycle/01-initiation/project-charter/traditional-project-charter-template.md` | `3b7cfab0abc66bc389bbe4c161330e19af41f1801fb6edafa06700e47acbf75f` |
| `templates/hybrid/Hybrid/Templates/hybrid_project_charter_template.md` | `domains/planning/templates/hybrid/Hybrid/Templates/hybrid_project_charter_template.md` | `6e83701a99b292612c65cf5388b008a25a658728dccb134926ed7a0446fc9bb5` |
| `templates/traditional/Traditional/Process_Groups/Initiating/project_charter_template.md` | `domains/planning/templates/traditional/Traditional/Process_Groups/Initiating/project_charter_template.md` | `1cf4e3a648bbbe5f188a6f9c7c8141620539ab94a68951722b71b0426cc7eb24` |
| `templates/traditional/Traditional/Templates/business_case_template.md` | `domains/planning/templates/traditional/Traditional/Templates/business_case_template.md` | `6eb3641724f91300a53af81496d77483f25a9a55910b59682202de01554f4ebe` |
| `templates/traditional/Traditional/Templates/program_charter_template.md` | `domains/planning/templates/traditional/Traditional/Templates/program_charter_template.md` | `cf362c0636f43d6fd6dfefe4e8b74ecc8b255c3686a7ade50d9e5dbb0ece821f` |

Historical/generated evidence under `site/.lighthouseci/**` and proposal-only metadata are not rewritten. Maintained catalogs, indexes, mappings, documentation, and navigation records use canonical destinations.

## Checkpoint A — Baseline

- `pre_batch_sha`: `9012ac677333913d1b704fa2a2f84aadc6b1859f`
- Working branch: `feat/b1g-planning-wave`, created from the B1F merge commit on `main`
- Entry-manifest validation: PASS — five source assets and hashes verified; no destination collisions
- Dependency disposition: PASS — every dependency resolves at a usable existing or executed path

## Checkpoints B/C — Move and compatibility

- All five canonical bodies moved into `domains/planning/...`.
- Each legacy source was recreated as a navigation-only Markdown pointer.
- Each pointer resolves from its legacy path to its canonical destination.
- Each destination SHA-256 equals its recorded pre-move source SHA-256.

## Checkpoint D — Canonical references

Maintained catalogs, domain/value-flow mappings, generated migration and cross-reference metadata, current documentation, and internal links are updated to canonical destinations. The B1G manifest retains legacy source paths as immutable execution evidence.

## Checkpoints E/F — Validation and decision

Validation command suite:

```bash
node scripts/validate-migration-wave.mjs --manifest meta/migration-waves/b1g.json
node scripts/generate-sprint-10-metadata.mjs
git diff --exit-code -- meta/migration-inventory.json meta/cross-references.json
node scripts/validate-sprint-10.mjs --require-annotations
node scripts/validate-curated-templates.js
node scripts/generate_template_index.mjs
git diff --exit-code -- TEMPLATE_INDEX.md
node scripts/validate-canonical-paths.js --strict
python3 scripts/check_anchor_links_filtered.py
npm run test:migration-wave
npm run test:ci
```

Decision: **PASS (local, pre-integration) — retain the complete B1G wave on the delivery branch**.

Rollback boundary: revert the complete B1G delivery commit or merge commit, regenerate metadata/indexes, and rerun the same suite. All five assets must roll back together.

## Exit evidence

| Acceptance area | Result |
|---|---|
| Mapping completeness | PASS — 137/137 |
| Move/hash integrity | PASS — all 5 destination hashes equal their recorded source hashes |
| Legacy pointers | PASS — all 5 navigation-only pointers resolve to their canonical destinations |
| Dependency evidence integrity | PASS — executed manifest validates every recorded disposition |
| Canonical uniqueness and duplicate control | PASS — no migration-created canonical duplicate |
| Bidirectional navigation and internal links | PASS — 137/137 cross-reference coverage; strict and filtered-link validators pass |
| Catalog/index discovery | PASS — 139-template catalog and generated index use canonical paths with legacy aliases |
| Reviewed visual regression | Pending PR visual run |
| Legacy `/blob/main/...` bookmark compatibility | Pending post-merge |
| Required CI | Pending PR workflows |
| Production rollback command | Pending merge SHA |

Local exit suite results:

- Executed B1G manifest: PASS — 5 assets, limit 12
- Migration-wave tests: PASS — 11/11
- Destination hashes and legacy-pointer resolution: PASS — 5/5 each
- Migration metadata generation: PASS — 137 records; 137/137 cross-reference coverage
- Sprint 10 strict validator: PASS — 137/137; 100% cross-reference coverage
- Curated templates: PASS — 139 templates
- Canonical paths: PASS — 0 errors; 3 pre-existing warnings
- Filtered anchor links: PASS
- Focused Jest: PASS — 1 suite, 2 tests, 100% coverage
- Metadata and template-index regeneration: deterministic
