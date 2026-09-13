# B3D Migration Execution Record

- Issues: [#1057](https://github.com/mirichard/pm-tools-templates/issues/1057), parent [#711](https://github.com/mirichard/pm-tools-templates/issues/711)
- Batch: B3D; source batch: 3; primary domain: Delivery
- Scope: 12 assets selected by the dependency-aware planner; dependency cycles remain atomic.
- Pre-batch SHA: `de93a99a5154367fc996cdf41b2738046eba5192`
- Rollback owner: `mirichard`
- Manifest: `meta/migration-waves/b3d.json`
- Status: Executed locally; integration and reviewed visual gates pending in the delivery PR.

## Content integrity and compatibility

All 12 canonical bodies preserve their pre-move SHA-256 hashes. All 12 legacy files provide a relative canonical-location pointer, and the catalog retains each legacy alias.

Four destinations contained B3C navigation-only pointers. The manifest records their hashes. Validation requires the exact navigation-only format, the intended source target, a regular file, and matching content in the pre-batch Git checkpoint. Drift, wrong targets, symlinks, extra content, and uncommitted replacement evidence are rejected. Executed validation checks canonical body hashes and retains the replacement evidence for rollback review.

Six new navigation-only files preserve previously working relative links without modifying template bodies: two infrastructure templates, the CI/CD planning template, and the infrastructure, sprint-planning, and risk-management directories. No symlinks or duplicate bodies are introduced.

## Assets and immutable hashes

| Legacy source | Canonical destination | SHA-256 |
|---|---|---|
| `methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_program_increment_planning_template.md` | `domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_program_increment_planning_template.md` | `c69dfa1a6da85c2ad76911f228846544a6477a9b7343f1f0a8777d557f8a19c3` |
| `project-assessment-suite/agile-project-assessment-template.md` | `domains/delivery/project-assessment-suite/agile-project-assessment-template.md` | `d6c3d92cbc2d8160a13a4b10dd1bc28b4b0f5978d62651ca633581cbb7266318` |
| `methodology-frameworks/agile-scrum/scaling-frameworks/safe/pi_planning_template.md` | `domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/pi_planning_template.md` | `bfc54b6167e17f60324b219eee1ceca426243df72a3229895754ba474119c58b` |
| `methodology-frameworks/agile-scrum/scaling-frameworks/safe/portfolio_kanban_template.md` | `domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/portfolio_kanban_template.md` | `6e106e086812a27dfdb0f6e24385e5e4c0d4798ded17d63fb2f16a1c83f5ce78` |
| `methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_portfolio_kanban_template.md` | `domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_portfolio_kanban_template.md` | `06aa28142b43d23a20a74e92bfbf40cf3cd526ae9a58045164fdb160d54f7174` |
| `methodology-frameworks/hybrid/infrastructure/hybrid-infrastructure-template.md` | `domains/delivery/methodology-frameworks/hybrid/infrastructure/hybrid-infrastructure-template.md` | `f4509b4bd1fd0623ad1a57b881eb3e27a48923f4fefce164ea7a4c229aa75882` |
| `project-assessment-suite/hybrid-project-assessment-template.md` | `domains/delivery/project-assessment-suite/hybrid-project-assessment-template.md` | `1c8fa1600dd19af4f0423cf206686d82bd921f371607587c9b534d5dfbdca2b6` |
| `project-lifecycle/02-planning/project-management-plan/hybrid-project-management-plan-template.md` | `domains/delivery/project-lifecycle/02-planning/project-management-plan/hybrid-project-management-plan-template.md` | `bd2120477962f8098e889728c96eda2ae0a035066af1bcb9f19c0e8faff3e64a` |
| `templates/hybrid/Hybrid/Templates/hybrid_release_planning_template.md` | `domains/delivery/templates/hybrid/Hybrid/Templates/hybrid_release_planning_template.md` | `15deb9f7888d40448607bda46ff99ea779a5c5b6ecba01f3f6ddb6244a0ae316` |
| `templates/hybrid/Hybrid/Templates/hybrid_team_management_template.md` | `domains/delivery/templates/hybrid/Hybrid/Templates/hybrid_team_management_template.md` | `1457753bce63009ade9f4c7b313eb8bf5f5949473a8cadc22191909daf4d82fd` |
| `templates/hybrid/Hybrid/Templates/integrated_change_strategy_template.md` | `domains/delivery/templates/hybrid/Hybrid/Templates/integrated_change_strategy_template.md` | `6e507133a8d33dd70efa9c37219528937b0cd507b4a612ce17ba9b200be3c490` |
| `templates/hybrid/Hybrid/Templates/progressive_acceptance_plan_template.md` | `domains/delivery/templates/hybrid/Hybrid/Templates/progressive_acceptance_plan_template.md` | `d1d1d8291915ed829c632e823e442e8667ea5a5f675b52e5f02e2e433030a20a` |

## Validation and maintained references

- Entry and executed manifests pass for all 12 assets.
- Migration post-check: 86 executed / 51 remaining (24 Delivery, 27 Measurement).
- Maintained catalogs, mappings, indexes, documentation, and inventory dependencies use canonical paths; historical wave and research records retain original identities.
- Migration-wave and post-check tests: 35 passed, including replacement guard negative cases.
- Curated catalog: 139 valid templates. Strict canonical paths: zero errors, one inherited warning.
- Link validation: zero new failures; inherited broken links remain outside this structural migration.
- Metadata regeneration, annotation coverage, full CI/security, and visual evidence are recorded in the delivery PR as checks complete. No visual threshold change, exclusion, or blanket baseline update is authorized by this record.

## Integration and rollback

Manual merge requires passing checks and review of all changed visual surfaces against the original source baselines. This record does not assert that pending integration gates have passed.

After merge, verify the exact main tree, all canonical hashes and legacy URLs, required workflows, and one comprehensive visual run. Keep #1057 and #711 open while migration remains incomplete.

Rollback: `git revert <B3D-merge-sha>`, regenerate metadata, and rerun validation. The revert restores both the original source bodies and the four displaced B3C navigation pointers.
