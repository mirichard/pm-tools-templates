# Continuous Delivery Pipeline Guide

Story #752 · Epic #714

## When to use

Use for products/services that release useful increments repeatedly, including after a delivery project closes. Continuous delivery means maintaining readiness to release; it does not require automatic production deployment. Select [project/product mode](product-thinking-framework.md) independently of methodology and release cadence.

## When not to use

For a single defined delivery, use the existing release-management process without imposing ongoing product ceremonies. Do not use this guide as a ready-to-run deployment system or as evidence that deployment, user acceptance or realized value succeeded.

## Use the existing templates

The maintained **pipeline worksheet** is the new [continuous delivery increment record](../../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#continuous-delivery-increment-record) inside the existing Release Management Template. It covers release planning, incremental scope, candidate/evidence, cadence, staged rollout, recovery and the next outcome review.

Use the existing [CI/CD planning template](../../domains/measurement/methodology-frameworks/emerging-methods/devops/cicd_pipeline_planning_template.md#increment-promotion-contract) for tooling and promotion boundaries, and the [agile release plan](../../domains/delivery/project-lifecycle/02-planning/project-management-plan/agile-release-plan-template.md#iterative-release-cadence) for forecasting across increments. These are enhancements to the assets related to [#373 Release Management Workflow](https://github.com/mirichard/pm-tools-templates/issues/373), not a second template suite. #373's broader automation/generator requirements remain independent and are not claimed delivered here.

## Repeatable delivery loop

| Step | Existing record and evidence | Decision and owner |
|---|---|---|
| Plan useful increment | Product backlog IDs, outcome hypothesis, target users, acceptance, dependencies and exclusions in the increment record. | Product owner selects a useful bounded increment and a review date. |
| Build and verify | Immutable artifact/source/configuration, build/test/security and acceptance evidence linked through CI/CD planning. | Delivery and control owners resolve failed/missing checks; release authority decides readiness. |
| Release with limited exposure | Cohorts, guardrails, observation/evidence minimums, source freshness, support and recovery in the release record. | Named authority promotes, holds or recovers; monitor per cohort and preserve decision evidence. |
| Expand and observe | Prior-stage approval, current health and compatibility, actual exposure and timestamps. | Repeat stage decisions; no promotion on elapsed time or missing data alone. |
| Learn and replenish | Service health, user feedback, outcome evidence and unresolved actions. | Service/product and benefits owners decide improvement, further investment or retirement; update the same backlog. |

Use the existing [staged-rollout worksheet and rehearsals](../../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#canary-and-staged-rollout-decisions). A canary/pilot does not replace pre-release acceptance or mandatory approval. Choose an approved alternative when representative isolation or an acceptable recovery route cannot be established.

## Continue beyond project closure

Enter from [project lifecycle](../../project-lifecycle/README.md) and [05-closure](../../project-lifecycle/05-closure/README.md#continuing-delivery-after-closure). Close the bounded project or increment while recording the continuing product/service owner, accepted funding/support, backlog custody, release authority and next outcome review. Missing receiving ownership is a handover gap to resolve, not permission to abandon obligations.

Reuse [operational continuity](operational-continuity-planning.md) for accepted support and maintenance, [feedback loops](feedback-loop-architecture.md) for ideation through post-delivery input, and [delivery metrics](delivery-metrics-framework.md) for flow plus separately measured value. Repeat delivery loops under continuing ownership; do not reopen the original project for every routine product change.

Record deployment success, exposure/acceptance and realized outcomes separately. For example, an increment can deploy cleanly yet fail to improve the chosen outcome; the product owner reviews that evidence before funding the next increment.

## Select and review cadence

Use the [release cadence guide](release-cadence-guide.md). Time-based, flow-based and coordinated approaches share the same readiness, authorization and recovery requirements. Example release percentages, timings and thresholds elsewhere in templates require local approval; they are not defaults established by this story.

## Acceptance map

The existing increment worksheet covers planning, incremental delivery and canary/staged rollout. The cadence guide covers frequency decisions and both time-based and flow-based examples. Lifecycle and closure navigation connect ongoing ownership to that loop. Existing release assets are enhanced and #373 is referenced without claiming its independent automation scope. Acceptance follows merged-result verification of the five original criteria.
