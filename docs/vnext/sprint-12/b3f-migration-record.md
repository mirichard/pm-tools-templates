# B3F Migration Execution Record

- Issues: #1057; parent #711.
- Wave: B3F; source batch 3; Delivery; 12 dependency-aware assets.
- Pre-batch SHA: `9fecc91628f331e0f3b4e013088f8b806afff042`.
- Rollback owner: `mirichard`.
- Manifest: `meta/migration-waves/b3f.json`.

## Scope and integrity

The final 12 Delivery assets preserve their pre-move SHA-256 values. Legacy files provide relative canonical-location pointers; catalog aliases retain source identities. No canonical destination was replaced. Dependencies are in this wave or available at existing paths. One navigation-only compatibility file preserves the moved change-management plan's relative risk-register link and points directly to the catalog's canonical Uncertainty-domain Risk Register.

| Legacy source | Canonical destination | SHA-256 |
|---|---|---|
| `templates/traditional/Traditional/Process_Groups/Monitoring_and_Controlling/project_performance_monitoring_template.md` | `domains/delivery/templates/traditional/Traditional/Process_Groups/Monitoring_and_Controlling/project_performance_monitoring_template.md` | `8bfa9c5b021d3cddadb12e081976f092395f70605b11704b2fd0dd9938d007ba` |
| `templates/traditional/Traditional/Process_Groups/Planning/project_management_plan_template.md` | `domains/delivery/templates/traditional/Traditional/Process_Groups/Planning/project_management_plan_template.md` | `d9d5d711fef826ae66669052bea13a0c96ea5bebe1f647337cc8abd54a9baa86` |
| `templates/traditional/Traditional/Process_Groups/Planning/work_breakdown_structure_template.md` | `domains/delivery/templates/traditional/Traditional/Process_Groups/Planning/work_breakdown_structure_template.md` | `315f67d04de2d3b5dc32be6132f60caede285666fd8cc2362c6b16c02b8d4f15` |
| `templates/traditional/Traditional/Templates/raid_log_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/raid_log_template.md` | `fe40e55482e765f09610b14f1a3f02b91048c9e0f77833b0952b61c3dfd1862b` |
| `templates/traditional/Traditional/Templates/purchase_order_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/purchase_order_template.md` | `1774015a25b64d49da2cc535984350fa488dc52a0e4f07c7882454e0d032b4f6` |
| `templates/traditional/Traditional/Templates/uat_plan_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/uat_plan_template.md` | `ee173547e1cd8905fc329ac748356545fd7dfb7a0c241a8e9e83151c20bb092f` |
| `templates/traditional/Traditional/Templates/uat_strategy_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/uat_strategy_template.md` | `aa9a0c9345aae72ef671fa4e03230dea2ba06cc1234a9d318069dfcc9f3847c8` |
| `templates/traditional/Traditional/Process_Groups/Planning/project_schedule_template.md` | `domains/delivery/templates/traditional/Traditional/Process_Groups/Planning/project_schedule_template.md` | `369379d571d8d8979138042f015ae2ed8989a486b99924a0c62f25be999778e5` |
| `templates/traditional/Traditional/Templates/change_management_plan_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/change_management_plan_template.md` | `952d7cfe226ee061599688c1b9f1f6768ee3013e7a735e284e6bb6f5d2588e2b` |
| `templates/traditional/Traditional/Templates/project_roadmap_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/project_roadmap_template.md` | `47cf62cfa8a3716fd648e7aa80bbf01cbb9f2090a6c3fa396be04b2ec9bfbd99` |
| `templates/traditional/Traditional/Templates/change_request_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/change_request_template.md` | `33ecd1a3df1bf28e8ad3918b95967513bfc5ce43545fa749563b3c7c527ba544` |
| `templates/traditional/Traditional/Templates/communication_plan_template.md` | `domains/delivery/templates/traditional/Traditional/Templates/communication_plan_template.md` | `19c4977c07597ca7a4001bb5a33edcb39ed7bd08f5b262a782d8f9d6ffd0969c` |

## Validation and completion

Entry/executed manifests, migration post-check, catalog/canonical validation, and 137/137 annotation coverage passed. All 47 migration/catalog tests and 17 metadata tests passed. Changed-body metadata has zero blocking errors. Scoped link validation checked 44 files and 389 local inline links: six inherited failures, zero new failures. Final CI and visual results are recorded in the delivery PR. This record does not assert that pending CI, security, or reviewed visual gates have passed. No threshold change, exclusion, or blanket baseline update is authorized.

Inventory after execution: 110 executed / 27 remaining, all remaining assets in Measurement. Migration issues remain open.

## Review dispositions

Copilot identified a compatibility-link correction, now addressed by linking directly to the catalog canonical Risk Register. Two inherited truncated endings (`may require buf` in Project Schedule and `Avoid over-` in WBS) were confirmed byte-identical in the pre-batch sources. They are explicitly deferred and tracked in #1145 for a separate content-quality change; this migration preserves their recorded hashes.

## Integration and rollback

Manual merge requires passing affected-scope validation, review findings addressed, and review of changed visual surfaces. After merge, verify main content, canonical hashes, canonical and legacy URLs, main workflows, and one comprehensive visual run. PR #1128 remains paused.

Rollback: `git revert <B3F-merge-sha>`, regenerate metadata, and rerun validation. The wave is the rollback boundary; reverting restores source bodies and removes this wave's canonical copies and compatibility navigation.
