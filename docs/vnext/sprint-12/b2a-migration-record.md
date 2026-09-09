# B2A Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B2A`
- Asset count: `9`
- Primary domain: `Team`
- Rollback owner: `mirichard`
- Status: **PASS (PR, pre-integration)**
- Delivery PR: [#1092](https://github.com/mirichard/pm-tools-templates/pull/1092)

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

Decision: **PASS (pre-integration) — retain the complete B2A wave on the delivery branch; final-head checks and review remain pending**.

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
| Reviewed visual regression | PASS — run [#403](https://github.com/mirichard/pm-tools-templates/actions/runs/34296723928), attempt 3; 74 reviewed B2A screenshots; verified baselines `4adcdb9f` |
| Legacy `/blob/main/...` bookmark compatibility | Pending post-merge |
| Required CI | PASS — CI run [34296723946](https://github.com/mirichard/pm-tools-templates/actions/runs/34296723946); SAST run [34296723956](https://github.com/mirichard/pm-tools-templates/actions/runs/34296723956); all 17 applicable workflows passed |
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

GitHub pre-integration evidence:

- Initial affected-scope visual run: 38 new screenshots and 36 expected legacy-pointer regressions, all independently reviewed as clean
- Reviewed baseline branch commit: `4adcdb9fd4a482aedda9a2ed7a57ea1ea7b163d5`
- Baseline manifest: PASS — 2,026 physical screenshots across 50 packs; every ZIP hash, byte count, and entry count verified
- Visual run 403, attempt 3: PASS — 104/104 comparisons; 0 regressions; 0 new screenshots
- All 17 applicable workflows on the validated implementation head: PASS
