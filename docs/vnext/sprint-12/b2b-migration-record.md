# B2B Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057) (parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711))
- Batch: `B2B`
- Asset count: `13`
- Primary domain: `Uncertainty`
- Rollback owner: `mirichard`
- Status: **PASS (local execution); GitHub integration gates pending**

## Scope decision

B2B executes all thirteen remaining Batch 2 Uncertainty-domain moves as one atomic dependency-aware wave. The group remains within the operating model's 15-asset ceiling. Its 19 same-wave edges include multiple cycles, so splitting the group would weaken atomic dependency handling and create avoidable transitional references. Four dependencies already resolve at executed canonical paths, and ten remain available at deferred legacy paths. No dependency is missing.

| Legacy source | Canonical destination | Pre-move SHA-256 |
|---|---|---|
| `industry-specializations/information-technology/infrastructure/migration_plan_template.md` | `domains/uncertainty/industry-specializations/information-technology/infrastructure/migration_plan_template.md` | `db8a336f4e9059f03b1c91cf0b750b1ac36455f12524fbc55fc79d09c80faa82` |
| `project-lifecycle/02-planning/risk-management/risk-register-template.md` | `domains/uncertainty/project-lifecycle/02-planning/risk-management/risk-register-template.md` | `88bff3d126d0d911dd0af1bce7a1dbba642c8a5fc3536d18144849225731a08e` |
| `project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md` | `domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/status-report-template.md` | `aa10eee873c4fb6f9755e59c3dbe9a48f40dd8a2452d5231c92fa3e3361548ee` |
| `role-based-toolkits/project-manager/essential-templates/meeting-templates.md` | `domains/uncertainty/role-based-toolkits/project-manager/essential-templates/meeting-templates.md` | `733ce38e3062f418d3d18de128f1535433b8ac4e48ce113103847c14bd169302` |
| `industry-specializations/information-technology/software-development/requirements_specification_template.md` | `domains/uncertainty/industry-specializations/information-technology/software-development/requirements_specification_template.md` | `04fe0e90e9df7e6502d8f244983a98e8e5c952ccb450e298c1acb0683eb1ff6b` |
| `industry-specializations/information-technology/software-development/user_story_mapping_template.md` | `domains/uncertainty/industry-specializations/information-technology/software-development/user_story_mapping_template.md` | `94d03a74e36dc1de37e0ce1e545c32557aef15ccd0951a40aff7d69077954f1d` |
| `role-based-toolkits/product-owner/user-story-template.md` | `domains/uncertainty/role-based-toolkits/product-owner/user-story-template.md` | `370b2f8cba7d82ce45781c6d9a484b6b0e5c2695480553491b2668279077c118` |
| `project-assessment-suite/assessment-report-template.md` | `domains/uncertainty/project-assessment-suite/assessment-report-template.md` | `542595e2691103808729b4a74d0b564867c013a92b8513f0aec08fcf4c2df523` |
| `project-lifecycle/02-planning/risk-management/enterprise-risk-assessment-template.md` | `domains/uncertainty/project-lifecycle/02-planning/risk-management/enterprise-risk-assessment-template.md` | `309adc88633a4b0c437935cd4be6c7e56cead0c8395c0a7bfe0f7e591e5a4852` |
| `project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md` | `domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md` | `ef58c1f9ea8dded2f4c545637f4443d196619157455b32941a4b0207486d7a57` |
| `role-based-toolkits/product-owner/backlog-management-template.md` | `domains/uncertainty/role-based-toolkits/product-owner/backlog-management-template.md` | `7a8a7148188a5d3587bb32017b6b90a3505f59e55e346d6e29751d0a06d29100` |
| `role-based-toolkits/product-owner/product-vision-template.md` | `domains/uncertainty/role-based-toolkits/product-owner/product-vision-template.md` | `b3272316a959d181229a4ec00345ee07ac5d3bbed099bf4d0abea1ff9f50e01a` |
| `templates/test-samples/quality-test-plan-template.md` | `domains/uncertainty/templates/test-samples/quality-test-plan-template.md` | `2ba91662759324665fa4a19c8c2f5bdba016a0b2d9f8e96baaba8f5d47bc9d0c` |

Historical/generated evidence, archived documentation, proposal/backup metadata, and prior wave manifests are intentionally not rewritten. Maintained catalogs, indexes, mappings, documentation, and navigation records use canonical destinations.

## Checkpoint A — Baseline

- `pre_batch_sha`: `0970338f8441608a189d45c97e89ed300a5d2975`
- Working branch: `feat/b2b-uncertainty-wave`, created from current `main`
- Entry-manifest validation: PASS — thirteen source assets and hashes verified; no destination collisions
- Dependency disposition: PASS — 19 same-wave, 4 executed, 10 existing deferred, 0 missing

## Checkpoints B/C — Move and compatibility

- All thirteen canonical bodies moved into `domains/uncertainty/...`.
- Each legacy source was recreated as a navigation-only Markdown pointer.
- Each pointer resolves from its legacy path to its canonical destination.
- Each destination SHA-256 equals its recorded pre-move source SHA-256.
- Two navigation-only compatibility files preserve Migration Plan related-resource links to Infrastructure Assessment and Deployment Checklist; neither adds a migrated template body.
- The repair script's template-creation helper skips existing files and symbolic links so rerunning it cannot replace migrated bodies with stubs.

## Checkpoint D — Canonical references

Maintained catalogs, domain/value-flow mappings, generated migration and cross-reference metadata, current documentation, and internal links are updated to canonical destinations. The B2B manifest retains legacy source paths as immutable execution evidence.

## Checkpoints E/F — Validation and decision

Local validation is complete:

- Executed B2B manifest: PASS — 13 assets, limit 15
- Destination hashes and legacy-pointer resolution: PASS — 13/13 each
- Migration metadata generation: PASS — 137 records; 137/137 cross-reference coverage
- Sprint 10 strict validator: PASS — 137/137; 100% cross-reference coverage
- Curated templates: PASS — 139 templates
- Canonical paths: PASS — 0 errors; 1 pre-existing Stakeholder Register warning
- Migration-scope inline links: PASS for no new failures — 60 Markdown files, 919 local inline links, 110 pre-existing failures, 0 new failures against the pre-batch SHA
- The former filtered-anchor PASS claim is withdrawn: that command performs no validation. Its B2B manifest entry is replaced by `python3 scripts/check_migration_links.py --manifest meta/migration-waves/b2b.json`.
- Checker scope: inline Markdown file/directory links, ATX heading fragments, and explicit HTML anchors outside fenced code. External URLs, reference-style links, site routing, and inbound legacy section bookmarks are not verified by this check. This is migration regression evidence, not a claim that all repository links work.
- Link-checker regression tests: PASS — 3/3, including missing files/fragments and a previously valid link broken by relocation
- Risk Register and Status Report catalog canonical paths and generated index: corrected to Uncertainty destinations; Traditional variant files remain available in alternate paths
- Template-selector copy behavior: PASS — both copied files equal their canonical bodies byte-for-byte
- Previously valid relative file links in all thirteen moved bodies: PASS; compatibility pointers resolve to maintained resources
- Repair-helper preservation and missing-file creation checks: PASS
- Complete repair-script fixture execution: PASS with all helper targets already present, both with and without the README repair; preserved targets and reached final analysis from a zero counter. All post-increments are replaced; repository-root discovery and the missing summary color definition are corrected.
- Migration-wave tests: PASS — 12/12
- Focused Jest: PASS — 1 suite, 2 tests, 100% coverage
- Metadata and template-index regeneration: deterministic

Pull-request workflows, review, and affected-scope visual regression must pass before integration. Reviewed visual baselines may be published only after the evidence text is final. Post-merge production bookmark, required main-workflow, comprehensive visual-regression, and rollback-SHA verification remain mandatory.

Decision: **PASS (local execution); retain B2B as one atomic wave. GitHub integration gates remain pending.**

Rollback boundary: revert the complete B2B delivery commit or eventual squash-merge commit, regenerate metadata/indexes, and rerun the complete suite. All thirteen assets must roll back together.
