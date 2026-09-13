# B3E Migration Execution Record

- Issues: #1057; parent #711.
- Wave: B3E; source batch 3; Delivery; 12 dependency-aware assets.
- Pre-batch SHA: `fba39481fb7dbad8cdd45e251cce3ad0217d9f94`.
- Rollback owner: `mirichard`.
- Manifest: `meta/migration-waves/b3e.json`.

## Scope and integrity

All 12 canonical bodies preserve their pre-move SHA-256 values. Each legacy source provides a relative canonical-location pointer, and catalog aliases preserve the original source paths. No existing canonical destination was replaced. Dependencies are either in this wave, already migrated, or deliberately retained at an existing usable path.

| Legacy source | Canonical destination | SHA-256 |
|---|---|---|
| `project-lifecycle/02-planning/project-management-plan/traditional-project-management-plan-template.md` | `domains/delivery/project-lifecycle/02-planning/project-management-plan/traditional-project-management-plan-template.md` | `377a8035beec71d6b87bd4a86f994ad282a31316ceec3a58e3c3e9645e5fcf33` |
| `templates/hybrid/Hybrid/Templates/hybrid_quality_management_template.md` | `domains/delivery/templates/hybrid/Hybrid/Templates/hybrid_quality_management_template.md` | `242395430e8c1541260b0446931d505f1b63a0aacd40a328c7ae71d63005ee82` |
| `project-lifecycle/02-planning/project-management-plan/agile-release-plan-template.md` | `domains/delivery/project-lifecycle/02-planning/project-management-plan/agile-release-plan-template.md` | `0da71dc599bfc989493568314b3c3505d45c1cf45353b0fb0aed194de0d86f6f` |
| `project-lifecycle/02-planning/risk-management/agile-risk-board-template.md` | `domains/delivery/project-lifecycle/02-planning/risk-management/agile-risk-board-template.md` | `c21471c497e2d5c5d03beb1dc1ba6c16c71ee0968346560a745069d6c2b2cdd2` |
| `templates/agile/product_backlog_template.md` | `domains/delivery/templates/agile/product_backlog_template.md` | `2235c7af0329590b42886dc552c6314367fdeb2abed577382906e071a58ed8a2` |
| `templates/agile/sprint_planning_template.md` | `domains/delivery/templates/agile/sprint_planning_template.md` | `f36813b5adb50ce997ed84e1c9c0ae4558cb3f09d11a05876492383b96dc9815` |
| `templates/traditional/Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md` | `domains/delivery/templates/traditional/Traditional/Knowledge_Areas/Project_Cost_Management/roi_tracking_template.md` | `c0c8ee1ebc50582bae668d50ee44a4a51a394ec248be5ab881b9c2c8bbc6bcad` |
| `templates/traditional/Traditional/Process_Groups/Executing/requirements_traceability_matrix_template.md` | `domains/delivery/templates/traditional/Traditional/Process_Groups/Executing/requirements_traceability_matrix_template.md` | `90077cdd46763e468f39c04831323ed39d5993c8d815c729f4118be4afce7767` |
| `templates/traditional/Traditional/Process_Groups/Closing/project_closure_report_template.md` | `domains/delivery/templates/traditional/Traditional/Process_Groups/Closing/project_closure_report_template.md` | `3f7d84648b990561627e5ebc761f3eb133e0350ac2a17858871be83124da7565` |
| `templates/traditional/Traditional/Process_Groups/Executing/project_execution_status_report_template.md` | `domains/delivery/templates/traditional/Traditional/Process_Groups/Executing/project_execution_status_report_template.md` | `11646ab5f94555586b4d565b67b3b705437d07a242ffbac2b5e7862973c50c25` |
| `templates/traditional/Traditional/Templates/issue_log_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/issue_log_template.md` | `279b6222363708b2d872aec2a78a8db3459288ab549306ee1d786c78e5b304c1` |
| `templates/traditional/Traditional/Templates/program_management_plan_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/program_management_plan_template.md` | `6440f148aabedc18dfd20d11d3589ddc01973a81a657ba30a4a2c0991505cfea` |

## Validation and completion

Local validation passed: 40 migration-wave/post-check tests, 17 metadata tests, 139 catalog entries, and canonical/alternate path checks. Link validation checked 47 files and 550 local inline links: nine inherited failures, zero new. Updating the maintained KPI mapping reference required adding its missing metadata header; its substantive body is unchanged apart from the canonical link. No compatibility navigation files were needed for these 12 moves.

The delivery PR records final validation results. This record does not assert that pending CI, security, or reviewed visual gates have passed. No threshold change, exclusion, or blanket baseline update is authorized. The inventory after execution is 98 executed / 39 remaining: 12 Delivery and 27 Measurement. Migration issues remain open.

## Integration and rollback

Manual merge requires passing affected-scope validation, review findings addressed, and review of changed visual surfaces. After merge, verify the main tree, canonical hashes, all canonical and legacy URLs, main workflows, and one comprehensive visual run.

Rollback: `git revert <B3E-merge-sha>`, regenerate metadata, and rerun validation. The wave is the rollback boundary; reverting restores original source bodies and removes the migrated copies and new navigation files.
