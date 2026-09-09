# B2A Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B2A`
- Asset count: `9`
- Primary domain: `Team`
- Rollback owner: `mirichard`
- Status: **PASS (local, pre-integration)**
- Delivery PR: pending

## Scope decision

B2A executes all nine Batch 2 Team-domain moves as one dependency-aware wave. It remains within the default 12-asset limit and preserves the two ordered same-wave dependency edges. Three dependencies already resolve at executed canonical paths; the remaining 22 dependencies remain available at deferred legacy paths. Every legacy source is retained as a navigation-only pointer.

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `methodology-frameworks/agile-scrum/scaling-frameworks/less/less_retrospective_template.md` | `domains/team/methodology-frameworks/agile-scrum/scaling-frameworks/less/less_retrospective_template.md` | `a96a2a8c38e7231f2d4354d465d5e47efddd1d7c226cb0eef5e4c524cae9189f` |
| `project-lifecycle/01-initiation/project-charter/agile-team-charter-template.md` | `domains/team/project-lifecycle/01-initiation/project-charter/agile-team-charter-template.md` | `0f0673726f23f2778e520fd5b9f59c9de8ba17f64cc3c4ab56f6f542fc61e5df` |
| `project-lifecycle/02-planning/resource-planning/skills-matrix-template.md` | `domains/team/project-lifecycle/02-planning/resource-planning/skills-matrix-template.md` | `89caff225adae1dd3db08729141472ea80946d18f6098333d039275748bcf158` |
| `project-lifecycle/02-planning/resource-planning/team-charter-template.md` | `domains/team/project-lifecycle/02-planning/resource-planning/team-charter-template.md` | `66814df1b812d05e9caf5e8f4dc524082eea0926100478f93752a98882b4712d` |
| `role-based-toolkits/scrum-master/agile-ceremonies/backlog-refinement-template.md` | `domains/team/role-based-toolkits/scrum-master/agile-ceremonies/backlog-refinement-template.md` | `42e010dfd3e6392835182f16b440d091ae4228cae96b91f98517ad2fbfdeb632` |
| `role-based-toolkits/scrum-master/agile-ceremonies/daily-standup-template.md` | `domains/team/role-based-toolkits/scrum-master/agile-ceremonies/daily-standup-template.md` | `51d78959b9bcb390984d708e42ec3e30a0f9dc6c4196d2583681b432e83b8b7b` |
| `templates/agile/sprint_review_template.md` | `domains/team/templates/agile/sprint_review_template.md` | `3f37c1dbbc7f11b2ac603b6846eb99470550de0cf7fa7b4d61b98659c4996325` |
| `templates/agile/sprint_retrospective_template.md` | `domains/team/templates/agile/sprint_retrospective_template.md` | `30d1d9549b91ad911ac934f3bc86da72813b850229f095c8afe6a4974f1bf47d` |
| `templates/traditional/Traditional/Process_Groups/Executing/team_performance_assessment_template.md` | `domains/team/templates/traditional/Traditional/Process_Groups/Executing/team_performance_assessment_template.md` | `7d6268733b205ac301e8e55d9892a3c0b4999a923f1fa2deca188704907720aa` |

Historical/generated evidence under `site/.lighthouseci/**`, archived documentation, backup/proposal metadata, and prior wave records are not rewritten. Maintained catalogs, indexes, mappings, documentation, and navigation records use canonical destinations.

## Checkpoint A — Baseline

- `pre_batch_sha`: `b521b58792f7de09c391f3665cc3f56a5a22b752`
- Working branch: `feat/b2a-team-wave`, created from the B1G merge commit on `main`
- Entry-manifest validation: PASS — nine source assets and hashes verified; no destination collisions
- Dependency disposition: PASS — 2 same-wave, 3 executed, 22 existing deferred

## Checkpoints B/C — Move and compatibility

- All nine canonical bodies moved into `domains/team/...`.
- Each legacy source was recreated as a navigation-only Markdown pointer.
- Each pointer resolves from its legacy path to its canonical destination.
- Each destination SHA-256 equals its recorded pre-move source SHA-256.

## Checkpoint D — Canonical references

Maintained catalogs, domain/value-flow mappings, generated migration and cross-reference metadata, current documentation, and internal links are updated to canonical destinations. The B2A manifest retains legacy source paths as immutable execution evidence.

## Checkpoints E/F — Validation and decision

Validation command suite:

```bash
node scripts/validate-migration-wave.mjs --manifest meta/migration-waves/b2a.json
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

Decision: **PASS (local, pre-integration) — retain the complete B2A wave on the delivery branch; GitHub, review, and affected-scope visual gates remain pending**.

Rollback boundary: revert the complete B2A delivery commit or merge commit, regenerate metadata/indexes, and rerun the same suite. All nine assets must roll back together.

## Exit evidence

| Acceptance area | Result |
|---|---|
| Mapping completeness | PASS — 137/137 |
| Move/hash integrity | PASS — all 9 destination hashes equal their recorded source hashes |
| Legacy pointers | PASS — all 9 navigation-only pointers resolve to their canonical destinations |
| Dependency evidence integrity | PASS — executed manifest validates every recorded disposition |
| Canonical uniqueness and duplicate control | PASS — no migration-created canonical duplicate |
| Bidirectional navigation and internal links | PASS — 137/137 cross-reference coverage; strict and filtered-link validators pass |
| Catalog/index discovery | PASS — 139-template catalog and generated index use canonical paths with legacy aliases |
| Reviewed visual regression | Pending |
| Legacy `/blob/main/...` bookmark compatibility | Pending post-merge |
| Required CI | Pending |
| Production rollback command | Pending merge SHA |

Local exit suite results:

- Executed B2A manifest: PASS — 9 assets, limit 12
- Migration-wave tests: PASS — 12/12
- Destination hashes and legacy-pointer resolution: PASS — 9/9 each
- Migration metadata generation: PASS — 137 records; 137/137 cross-reference coverage
- Sprint 10 strict validator: PASS — 137/137; 100% cross-reference coverage
- Curated templates: PASS — 139 templates
- Canonical paths: PASS — 0 errors; 3 pre-existing warnings
- Filtered anchor links: PASS
- Focused Jest: PASS — 1 suite, 2 tests, 100% coverage
- Metadata and template-index regeneration: deterministic
