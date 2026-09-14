# B4A Migration Execution Record

- Issues: #1057; parent #711.
- Wave: B4A; source batch 4; Measurement; 15 dependency-aware assets.
- Pre-batch SHA: `8f680af6990f65b4de5aedf16871e23f86ffc5c2`.
- Rollback owner: `mirichard`.
- Manifest: `meta/migration-waves/b4a.json`.

## Scope and integrity

All 15 canonical bodies preserve their original SHA-256 values. Legacy pointers and catalog aliases preserve access. Dependency cycles remain within the wave; no destination body was replaced.

| Legacy source | Canonical destination | SHA-256 |
|---|---|---|
| `industry-specializations/financial-services/compliance/compliance-management-template.md` | `domains/measurement/industry-specializations/financial-services/compliance/compliance-management-template.md` | `1719184880167489dc260a7a0044f5e627c3b3c13df27741f7073c2d6a1f877c` |
| `industry-specializations/information-technology/cybersecurity/incident_response_template.md` | `domains/measurement/industry-specializations/information-technology/cybersecurity/incident_response_template.md` | `53c41ca421b970020c66faf05f1afa0691e72a0ee3627f4b553eafcb4366519a` |
| `industry-specializations/information-technology/cybersecurity/risk_assessment_template.md` | `domains/measurement/industry-specializations/information-technology/cybersecurity/risk_assessment_template.md` | `06c0c9d00e9cfc4c104ece6a4834bb0b7c579d01049d3a56af9795e781ed992d` |
| `industry-specializations/information-technology/digital-transformation/digital_transformation_strategy_template.md` | `domains/measurement/industry-specializations/information-technology/digital-transformation/digital_transformation_strategy_template.md` | `2448e97d65f180380bca8037edd8bd6c497ee285c8fb9ebdf03392b48aa38cce` |
| `industry-specializations/information-technology/infrastructure/infrastructure_assessment_template.md` | `domains/measurement/industry-specializations/information-technology/infrastructure/infrastructure_assessment_template.md` | `a75ac25c38b9304995c9549189e6d310178497eb96f554856a6dae2d9cee0931` |
| `industry-specializations/information-technology/security/cybersecurity_assessment_template.md` | `domains/measurement/industry-specializations/information-technology/security/cybersecurity_assessment_template.md` | `9c7640128c87dd00bc96b64412c0036d234d8536c469ef90b53c6f403b12c829` |
| `project-lifecycle/02-planning/business-requirements/business_requirements_document_template.md` | `domains/measurement/project-lifecycle/02-planning/business-requirements/business_requirements_document_template.md` | `68ce143df4327ffae340b42292a52a14e9ef24df0501b452ae3c003f015aa1b5` |
| `industry-specializations/information-technology/software-development/technical_design_document_template.md` | `domains/measurement/industry-specializations/information-technology/software-development/technical_design_document_template.md` | `260838d45353513cd1ffa16b484517a6bf0cb37460492bb2049a6427f16bf2fa` |
| `industry-specializations/information-technology/software-development/test_plan_template.md` | `domains/measurement/industry-specializations/information-technology/software-development/test_plan_template.md` | `d2874996ef634c94ef623e631fd37fedb49fb609be1d9f8e55f34143b5b1f374` |
| `methodology-frameworks/emerging-methods/devops/cicd_pipeline_planning_template.md` | `domains/measurement/methodology-frameworks/emerging-methods/devops/cicd_pipeline_planning_template.md` | `05b492617a09417baf7de2a755b6028f1fe844b50877ecd6809bfdb429e19f95` |
| `methodology-frameworks/emerging-methods/devops/release_management_template.md` | `domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md` | `0ebf8b0f77543353af7be4cafe19986c6af515d81e399763ae80cc8e475b6778` |
| `project-assessment-suite/current-state-analysis-template.md` | `domains/measurement/project-assessment-suite/current-state-analysis-template.md` | `f9b0cb20451849ec72f7afc170d624bf6b4b6ab3ed4c2c789cbe838c5523fe3c` |
| `project-assessment-suite/executive-summary-template.md` | `domains/measurement/project-assessment-suite/executive-summary-template.md` | `f9db1eb1ff403b140873fcb4dd27eb8361b4e6d6ca8f2365e4b9b135a0ef9662` |
| `project-lifecycle/02-planning/resource-planning/resource-management-plan-template.md` | `domains/measurement/project-lifecycle/02-planning/resource-planning/resource-management-plan-template.md` | `ff7fda80410dbe59428077dbc9000149f9c5f969b842e1c58bf9be239627e93c` |
| `project-lifecycle/02-planning/risk-management/risk-management-plan-template.md` | `domains/measurement/project-lifecycle/02-planning/risk-management/risk-management-plan-template.md` | `5bc34126cd641661d98b88879810de59dc8f516742e388bdde1e9c4d7f190ab1` |

## Compatibility navigation

Six navigation-only files preserve existing relative links to metrics, DevSecOps, infrastructure as code, the repository README, future-state planning, and process maturity. Pending Measurement bodies remain at their usable source paths until the next wave. No duplicate template bodies were introduced.

## Validation and completion

Entry/executed manifests, migration post-check, curated/canonical paths, and 137/137 annotation coverage pass. All 47 migration/catalog tests and 17 metadata tests pass. Scoped link checks distinguish inherited failures from new regressions. Final validation evidence is recorded in the delivery PR. This record does not assert that pending CI, security, or reviewed visual gates have passed. No threshold change, exclusion, or blanket baseline update is authorized.

Inventory after execution: 125 executed / 12 remaining, all remaining assets in Measurement. Parent migration issues remain open.

## Integration and rollback

Manual merge requires passing affected-scope validation, review findings addressed, and review of changed visual surfaces. After merge, verify main content, canonical hashes, canonical and legacy URLs, main workflows, and one comprehensive visual run. PR #1128 remains paused.

Rollback: `git revert <B4A-merge-sha>`, regenerate metadata, and rerun validation. The wave is the rollback boundary.
