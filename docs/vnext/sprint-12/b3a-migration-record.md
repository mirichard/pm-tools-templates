# B3A Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B3A`
- Source batch: `3`
- Asset count: `12`
- Primary domain: `Delivery`
- Rollback owner: `mirichard`
- Pre-batch SHA: `f639e285ec3970372f1fa1166b4af07d371e7fb8`
- Manifest: `meta/migration-waves/b3a.json`
- Status: **PASS (entry baseline); physical migration pending**

## Scope decision

The current migration inventory contains 69 pending Batch 3 / Delivery candidates. The original planner selected the first twelve lexicographic candidates before dependency ordering. Full Tarjan strongly-connected-component analysis showed that this boundary split three dependency cycles; closing those cycles required seventeen assets and therefore exceeded the repository's fifteen-asset safety ceiling.

The migration planner and validator were corrected before B3A execution. Planning now selects a deterministic source-ordered prefix while treating every same-batch/domain SCC as indivisible, and validation rejects manifests that split an SCC. Under both the normal twelve-asset target and the fifteen-asset ceiling, the first safe atomic prefix contains the same twelve assets. The next candidate belongs to a four-asset SCC and would increase the wave to sixteen, so that component is deferred intact to the next wave.

B3A therefore contains twelve assets and splits zero SCCs.

## Assets and immutable entry hashes

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/compliance/capa_management_template.md` | `c529b8195c0e169a00d64e8f397d765c873bb329bbd63340825abc62715445b4` |
| `industry-specializations/healthcare-pharmaceutical/clinical-trials/clinical_trial_protocol_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/clinical-trials/clinical_trial_protocol_template.md` | `45e3419297ecf5986bd2144134578b1237bf43cfb4f3f45d049ccb417405947e` |
| `industry-specializations/healthcare-pharmaceutical/manufacturing/process_control_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/manufacturing/process_control_template.md` | `5294d183cbcfa7cd148e5f8553b606cd77d02d733ae4dac72ac652527bb1371a` |
| `industry-specializations/healthcare-pharmaceutical/quality/quality_management_review_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/quality/quality_management_review_template.md` | `1d0bb39160e464dc89a713e4ef865e31e8e18ab46ba1a6475a4a24f188d53181` |
| `industry-specializations/healthcare-pharmaceutical/compliance/gxp_training_plan_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/compliance/gxp_training_plan_template.md` | `5ed332f0480642c30b255f26b7218f4b6dd7e71376b339015f3fcda28efe6f4a` |
| `industry-specializations/healthcare-pharmaceutical/lifecycle/pharmaceutical_qbd_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/lifecycle/pharmaceutical_qbd_template.md` | `78d325c58e8f345939a6fb2efc82f82ba954f548b71befc1182f7d72930f93c0` |
| `industry-specializations/healthcare-pharmaceutical/manufacturing/batch_record_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/manufacturing/batch_record_template.md` | `2028d72c48d76f6ca0e99291452e2c04f7ea855692cbd92816df4077c8b77643` |
| `industry-specializations/healthcare-pharmaceutical/manufacturing/manufacturing_batch_record_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/manufacturing/manufacturing_batch_record_template.md` | `25dc484b2e9e7ac300d207246e464cb901dba925113c4e5568a53817a7f22f17` |
| `industry-specializations/healthcare-pharmaceutical/regulatory/computer_system_validation_protocol_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/regulatory/computer_system_validation_protocol_template.md` | `88a04353e540a4cd6c9a6e6f62a217c6026f95107d56fd0e3cbc10bb387b3711` |
| `industry-specializations/healthcare-pharmaceutical/validation/equipment_qualification_protocol_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/validation/equipment_qualification_protocol_template.md` | `fbc7a75cb552460d80e5f42b9a0694660b7230a9573dfd2766d1c721e7e22d92` |
| `industry-specializations/healthcare-pharmaceutical/validation/process_validation_master_plan_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/validation/process_validation_master_plan_template.md` | `c0300e4f494b44312d3e17cc9a410dad3171cbabf61b9ee6d5e04774982ad8d5` |
| `industry-specializations/healthcare-pharmaceutical/validation/validation_master_plan_template.md` | `domains/delivery/industry-specializations/healthcare-pharmaceutical/validation/validation_master_plan_template.md` | `770b558145b2ab79d322fdacf902cee25b0fe342bedfcd584fa0712752323414` |

## Dependency-boundary evidence

The rejected original first-twelve boundary crossed three SCCs:

- GxP / validation-master SCC: 3 assets
- Manufacturing / CSV qualification SCC: 4 assets
- Regulatory risk / communication SCC: 4 assets

Closing all SCCs intersecting that raw selection required 17 assets. The corrected SCC-atomic B3A selection contains complete GxP/validation-master and manufacturing/CSV qualification components while deferring the four-asset regulatory risk/communication component intact. Independent full-graph validation confirmed zero split SCCs across all 69 pending Delivery candidates.

## Checkpoint A — entry baseline

Authoritative baseline run: GitHub Actions run `34614165100`.

- Migration-wave tests: PASS — 15/15
- Migration-link checker tests: PASS — 5/5
- Entry manifest: PASS — 12 assets, limit 12
- Sprint 10 strict validation: PASS — 137/137; 100% cross-reference coverage
- Curated templates: PASS — 139 templates
- Canonical paths: PASS — 0 errors; 1 inherited Stakeholder Register `path`/`canonical_path` warning
- Migration-link baseline: PASS for no new failures — 12 files, 63 local inline links, 2 inherited failures, 0 new failures
- CI: PASS — 1 suite, 2 tests, 100% coverage
- Entry integrity: PASS — 12/12 source hashes match; 0 destination collisions

The two inherited link failures are both in `industry-specializations/healthcare-pharmaceutical/lifecycle/pharmaceutical_qbd_template.md`:

- `../regulatory-compliance/`
- `../clinical-research/`

They are baseline defects and are not B3A-created.

## Inherited generator drift

Running `node scripts/generate-sprint-10-metadata.mjs` on untouched `main` at the pre-batch SHA and on the B3A entry branch produces the identical pre-existing change to `meta/migration-inventory.json`.

Generated diff SHA-256:

`8789b36931eb137b16c4c74e760c7c992e84208d85453cd4299dd7ba5d54935f`

This is prior-wave metadata normalization drift, not a B3A regression. It is explicitly baselined and must not be silently misclassified as B3A-created change.

## Tooling corrections established before execution

B3A exposed two migration-tooling defects before any physical move:

1. The planner could split same-batch/domain dependency cycles because it sliced candidates before dependency analysis. Planning now selects an SCC-atomic prefix and validation rejects split-cycle manifests.
2. The migration-link checker assumed canonical destinations existed even for an entry-phase manifest. It now checks entry-phase legacy sources against the pre-batch baseline and preserves canonical-destination behavior for executed manifests.

Both corrections have focused regression coverage and passed the entry baseline.

## Checkpoints B/C — canonical moves and compatibility

**Pending.** Each selected source will be moved byte-for-byte to its `domains/delivery/...` destination. The original path will then be recreated as a navigation-only pointer to that destination. Destination hashes and pointer resolution must pass 12/12 before this checkpoint is complete.

## Checkpoint D — canonical references and metadata

**Pending.** Maintained catalogs, indexes, mappings, selectors, documentation, and navigation will be updated after the physical move. Historical evidence and archived/generated snapshots will not be rewritten merely to eliminate legacy paths.

## Checkpoint E — affected-scope validation

**Pending.** Executed-wave validation must prove zero B3A-created link regressions relative to the entry baseline and re-run structural, catalog, selector/copy, migration-wave, and CI checks.

## Checkpoint F — reviewed visual regression

**Pending.** Visual comparison must be performed on the final PR head against reviewed baselines. Baselines will not be updated merely to force a green result.

## Checkpoint G — post-merge verification

**Pending and outside pre-merge completion.** After manual merge, production `main` must verify canonical hashes/pointers, required workflows, comprehensive visual regression, and rollback SHA before B3A is recorded as executed/closed.

## Technical-debt disposition

B3A is a structural migration. Canonical template bodies are immutable for this wave. Inherited content-quality issues are not silently repaired. Existing technical-debt tracking remains under #1117 / #1058 where applicable; any newly discovered inherited defect will be explicitly dispositioned rather than folded into body edits.

## Rollback

Pre-batch rollback anchor:

`f639e285ec3970372f1fa1166b4af07d371e7fb8`

After manual integration, the wave-level rollback method is:

`git revert <B3A-merge-sha>`

No physical migration has yet occurred at the time of this entry record.