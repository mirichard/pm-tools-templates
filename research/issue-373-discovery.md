# Issue #373 — Release Management Workflow discovery

**Research snapshot:** 2026-10-30

**Source snapshot:** [`19decfbd3316edebd3daeda5c2e92c466c151546`](https://github.com/mirichard/pm-tools-templates/commit/19decfbd3316edebd3daeda5c2e92c466c151546)

**Status:** Research for owner review only; #373 remains unscheduled. **Refs #373**
**Accountable decision owner:** Michael Richard

## Decision brief

**Recommendation:** Keep the broad release-workflow automation epic unscheduled. Reuse the canonical Release Management Template and existing release-planning, rollback, CI/CD, and communications assets; do not create a second checklist suite or treat repository Actions as a product-deployment integration. The repository does have real release automation: required CI validates repository changes, and **Update Release Draft** reconciles repository version metadata and an unpublished draft. It does not generate release plans for arbitrary projects, deploy services, evaluate project-specific go/no-go criteria, test production rollback, or monitor service outcomes.

The v2.4.0 record provides an exact example of explicit owner authorization, candidate commit/tag verification, passing required CI and security checks, publication, and closeout. These are repository-release evidence, not proof of customer deployments or service rollback. Maintained templates already provide most manual planning and decision fields; the missing product outcome, target users/platforms, authorities, and integration contract are not established. The related #50 report in open PRs #1571/#1572 already recommends a separate release-manager journey guide; reuse that work and resolve its PR overlap rather than duplicating it here.

**Conditional bounded candidate:** if the owner confirms #373 should first address repository releases, refine one documentation-only evidence-gate handoff against the existing release process. If #373 means releases of users’ products/services, defer this candidate until a specific user/workflow and target integration are evidenced. No delivery, sprint, release, or acceptance decision is made here.

## Capability, evidence, and gap matrix

Repository links below are pinned to source snapshot `19decfbd3316edebd3daeda5c2e92c466c151546` unless a specific release revision is named.

| Capability | Maintained source and observed evidence | Gap / dependency | Disposition |
|---|---|---|---|
| Go/no-go and release readiness | [Canonical Release Management Template](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md) includes an increment record for candidate identity, linked build/test/security evidence, acceptance results, an authorized decision, support coverage, and evidence locations. The [Agile Release Plan](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/domains/delivery/project-lifecycle/02-planning/project-management-plan/agile-release-plan-template.md) also has go/no-go criteria. | CI reports technical checks; it does not decide project acceptance, policy, staffing, or release authority. #372 UAT and #370 audience/view work are related discovery items, not evidence that these dependencies are delivered or scheduled. | **Retain** existing manual criteria and source records. **Revise** the historical “95%+ cutover accuracy” target only after defining the outcome, denominator, baseline, and measurement method. |
| Cutover and sequencing | The canonical template records rollout stages, exposure limits, observation windows, guardrails, owners, and decisions. [Release Cadence Guide](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/docs/delivery/release-cadence-guide.md) distinguishes time-based, flow-based, and coordinated approaches. | No maintained workflow allocates user-project resources, calculates schedule accuracy, or executes a cutover. Calendar readiness is expressly not release authorization. | **Retain** the reusable planning fields. **Defer** automated coordination until a concrete user workflow, data contract, and owner are established. |
| Rollback and recovery | The [Rollback Plan Template](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/docs/governance/rollback-plan-template.md) asks for triggers, steps, verification, communication, and decision authority. The canonical release template additionally calls for compatible data/configuration recovery and tested evidence. | Repository CI tests code and repository metadata, not rollback against a deployed service. A checked example or rollback field is not a tested recovery route. | **Retain** current guidance. **Defer** generated or automatically tested rollback; require target-specific recovery evidence and human authority before any such candidate. |
| Communications and post-release follow-up | The canonical release template includes recipient/communication fields and outcome, service-health, and follow-up records; [Continuous Delivery Pipeline Guide](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/docs/delivery/continuous-delivery-pipeline.md) separates deployment health from realized outcomes. The v2.4.0 closeout records its announcement but says individual subscriber delivery was not verified. | No project-specific notification routing, audience authorization, live service monitoring, or outcome measurement is integrated with CI. | **Retain** the distinct human communication, health, and outcome records. **Defer** automated notifications and monitoring pending audience, permissions, and source/ownership decisions. |
| Repository CI and release metadata | [`ci.yml`](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/.github/workflows/ci.yml) runs root tests, migration/navigation checks, release-version consistency and regression tests, app checks, and an aggregate required gate. [`update-release-draft.yml`](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/.github/workflows/update-release-draft.yml) runs on pushes to `main` or manual dispatch with `contents: write`; [`release_management.py`](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/scripts/release_management.py) validates manifest identity, preflights tags/releases, may add a missing numeric alias, updates release metadata, and creates/updates a **draft**. It verifies read-back and does not publish the draft or deploy a product. | This is repository-specific version/draft reconciliation, not a workflow generator or integration with users’ CI/CD or deployment systems. Its successful run does not satisfy project-specific readiness or acceptance. | **Retain** existing CI and version/draft automation as bounded repository capability. **Defer** broad product integration and automatic release decisions. |
| Actual v2.4.0 release evidence | [v2.4.0 closeout](https://github.com/mirichard/pm-tools-templates/blob/19decfbd3316edebd3daeda5c2e92c466c151546/docs/releases/v2.4.0-closeout.md) and [#1393](https://github.com/mirichard/pm-tools-templates/issues/1393) record owner authorization, accepted scope, tag/commit `b82b8eef56ba304ceb54a2fc340de0168f3ebbb3`, publication, and closeout. CI run [41080150868](https://github.com/mirichard/pm-tools-templates/actions/runs/41080150868) and Update Release Draft run [41080150951](https://github.com/mirichard/pm-tools-templates/actions/runs/41080150951) both completed successfully on that commit. #1393 records all 19 sub-app checks and the aggregate gate passed, plus configured security checks. | Evidence is for a GitHub repository release. It does not show project deployment, rollback rehearsal, service monitoring, end-user acceptance, or verified delivery of subscriber notifications. This research did not rerun those accepted checks. | **Retain** as a repository-release case study only; **defer** claims about product release performance or universal automation. |

### Related issue and research status

- #373 has no issue comments. Its native parent is #365; no native children were returned. The historical description names #372 and #370 as dependencies, but their delivery is not established by that text.
- #1566 and [`research/v2.5-discovery-plan.md`](v2.5-discovery-plan.md) make this a Sprint 5 **discovery** topic, not a v2.5 delivery commitment. The plan caps active investigations at two and says research/backlog promotion and sprint readiness require separate evidence and owner decisions.
- #50 is a standalone candidate. Its current discovery is in open draft PRs [#1571](https://github.com/mirichard/pm-tools-templates/pull/1571) and [#1572](https://github.com/mirichard/pm-tools-templates/pull/1572). The more recent #1572 report proposes a connected human-facing role guide and explicitly separates that from #373 automation; it is ongoing research, not merged or owner-accepted evidence. Resolve the overlapping PRs and link/reuse the chosen report; do not recreate its guide here.
- Preserve #1482 as completed and accepted; do not repeat its walkthrough. Preserve #1379’s accepted source-sufficiency evidence as directed by #1566 and the discovery plan; no #1379 experiment or evidence gathering is part of this investigation.
- The legacy release-template path is navigation-only. New references and future edits belong to the canonical Measurement-domain file linked above.

## Proposed evidence gates

These are a proposed decision contract, not gates executed by this research or a claim that the existing workflows enforce every item. Use **GO** only when all required evidence is current and tied to the same immutable candidate and the authorized owner records approval. Use **NO-GO** for an explicit failed mandatory control. Use **HOLD** for missing, stale, ambiguous, or mismatched evidence or missing authority; do not convert absence into a pass or waive mandatory controls.

1. **Scope and authority:** record the intended outcome, included/excluded work, acceptance owner, release authority, and applicable emergency/change authority. A historical date or checklist completion is not approval.
2. **Candidate and technical checks:** identify the exact source revision, artifact/version, and relevant configuration; link passing required CI, security, and acceptance evidence for that candidate. Missing/cancelled checks or evidence for a different revision mean HOLD.
3. **Operational readiness:** record dependency and cutover sequence, support/on-call coverage, communication audience/owner, objective monitoring criteria, and a tested recovery route including data/configuration effects. No safe, tested route means HOLD or an explicitly approved non-rollback recovery path—not a generated rollback claim.
4. **Authorized decision:** preserve the decision maker, timestamp, decision, evidence links, and any allowed exception authority. Routine automation can prepare evidence; it cannot substitute for human acceptance or release authorization.
5. **Publication and follow-up:** for repository releases, verify release/tag identity, published notes/downloads, announcement link, and closeout. Report subscriber delivery as unknown unless measured. For a service release, separately record deployment exposure, health evidence, operational ownership, and user/business outcomes; repository CI is not service monitoring.

## Synthetic proposed fixture — not executed

All names and evidence below are fictional placeholders. This fixture is a proposed desk-check for the gate contract, not a test of a release system, a real user scenario, or human acceptance.

| Field | Fictional value |
|---|---|
| Candidate | `demo-service / RELEASE-DEMO-01 / SYNTHETIC-REVISION-A` |
| CI/security | Required CI and security evidence marked “pass” in the proposed fixture; no real run IDs or artifacts exist. |
| Cutover/recovery | Draft window and staged steps recorded; recovery evidence for a data migration is intentionally absent. |
| Human decision | Release authority not recorded. |
| Expected gate result | **HOLD**: missing migration recovery evidence and release authority block GO even though the fictional CI checks pass. |
| Proposed validation | A future reviewer checks that a user of the evidence record cannot mistake green CI for release approval, and can identify the missing evidence, accountable owner, and next action. No check was run for this fixture. |

## Conditional candidate for owner decision

**Draft title:** Define a repository-release evidence-gate handoff using existing assets (**conditional; do not create or schedule without owner selection**).

- **User outcome:** A maintainer can assemble a traceable go/hold decision for one GitHub-hosted repository release using existing CI, release metadata, release notes, and owner-approval evidence.
- **Bounded scope:** Document how the current repository release process maps its actual automated checks and draft updater to the five evidence gates above. Reuse `docs/release-versioning.md`, the canonical Release Management Template, and existing release records; update an existing source only if owner review identifies a concrete omission.
- **Exclusions:** No new workflow or permissions; no publish/deploy action; no external CI/CD integration; no generated product workflows; no automatic go/no-go, rollback, monitoring, notification, or UAT; no repeat of #1482.
- **Observable acceptance criteria:** (1) Each claimed automated gate maps to a source file and observed check; each human gate names the decision owner/evidence. (2) The document states draft-updater behavior and explicitly says it does not publish or deploy. (3) A synthetic all-evidence example and a missing-evidence HOLD example are desk-checked, with no production or user claim. (4) Existing release-version and CI behavior is not changed; local documentation links validate.
- **Validation method:** Review the source-to-claim map against the pinned workflow/script revision; run the applicable Markdown link check for any resulting documentation change. Do not rerun historical v2.4 checks or walkthroughs.
- **Dependencies and owner gaps:** Michael must confirm that repository releases are the intended first user outcome, approve boundaries and named release authority, and select an author/reviewer. #50’s role-guide work must be reconciled to avoid duplicate documentation. If #373 instead targets users’ product/service releases, this candidate is not applicable; identify the target project types, release authority, CI/CD systems, permissions, and acceptance evidence first. #372/#370 are not assumed delivered prerequisites.
- **Effort range:** Preliminary analyst assumption **1–2 focused person-days** for documentation refinement and review, excluding implementation, external integration, user research, and schedule/capacity overhead. This is not a team estimate or commitment; re-estimate after owner selection.

### Historical targets: preserve, do not claim

| Historical target | Current evidence/disposition |
|---|---|
| “95%+ accuracy” for cutover planning in #373 | No definition, denominator, baseline, or measured result was found in the reviewed sources. Retain as an unvalidated historical business target pending an owner-approved measurement method; do not use as acceptance for the documentation candidate. |
| #50’s “150+ release managers” adoption and “25% reduction” in release-related issues | Reuse the explicit measurement limitations/dispositions in ongoing #50 report PR #1572. No baseline, eligible-user denominator, attribution, or observed outcome is claimed here. Do not silently convert either into delivery acceptance or report them as achieved. |

## Promotion criteria and current status

- **Backlog-ready:** owner confirms the user/problem and selects a bounded outcome; source inventory and exclusions are accepted; dependencies, risks, validation, estimate assumptions, and named owner are recorded. **Not met:** user outcome and target release context remain ambiguous; no candidate is owner-selected.
- **Sprint-ready:** additionally decompose selected work into leaf tasks with observable acceptance, named delivery/review owners, a validation method, resolved or explicitly sequenced dependencies, estimate, and confirmed capacity. **Not met:** no delivery owner, capacity confirmation, or owner readiness decision is recorded.
- **Owner-selected:** Michael explicitly chooses/revises/defer/stops a candidate and records authority and disposition. Research completion, a passing CI run, an open PR, and historical checkmarks do not select scope or approve a release.

No Project stage, sprint, milestone, release target, or owner assignment is changed by this report. Historical efficiency/adoption/accuracy claims remain unmeasured unless separately dispositioned with a method.

## Finish

- **Recommended next step:** Michael decides whether #373’s first user outcome is repository release evidence or project/service release automation.
- **Research completed:** mapped maintained templates to actual CI and release-draft automation; reused v2.4 evidence and #50’s ongoing discovery.
- **Remaining gaps:** target user/platform, decision owners, integration contract, user evidence, and confirmed delivery capacity.
- **Owner decision required:** select/revise/defer the conditional candidate and resolve the #50 report overlap; no sprint or release selection is requested.
