# Roadmap

**Editorial review date:** 09/26/2026

This roadmap summarizes released capabilities, outstanding follow-up, and future candidates for PM Tools & Templates. Release notes describe what shipped; linked issues hold scope and acceptance evidence. An open issue is not, by itself, a delivery commitment.

[Use the library](README.md) · [Release history](https://github.com/mirichard/pm-tools-templates/releases) · [Open work](https://github.com/mirichard/pm-tools-templates/issues?q=is%3Aissue%20is%3Aopen) · [Milestones](https://github.com/mirichard/pm-tools-templates/milestones)

## Released

Repository and component versions follow separate histories. `v2.3.0` is assigned to the latest published repository release, `vNext`; the existing `v2.2.0` tag has no published release entry and cannot be reused. See [release numbering and history](docs/release-versioning.md) for the manifest, automated consistency checks, and release procedure. No next release is scheduled.

| Delivery | What it provides | Record |
| --- | --- | --- |
| v2.3.0 (vNext) — Value Delivery System Upgrade | Benefits and value-delivery guidance; six performance domains; context-sensitive template selection; principles and applicability guidance; adaptive governance; product and continuous-delivery practices | [Published release — 09/21/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext) |
| Requirements CLI v1.2 | Nonfunctional-requirement generation, quality-attribute mapping, acceptance-criteria scaffolding, human-review gates, and classification evaluation | [Published release — 09/18/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/v1.2.0-requirements-cli) |

vNext's migration establishes canonical locations and cross-references for the migrated collection. Legacy paths remain supported through vNext and at least the next major release under the [compatibility policy](docs/domain-navigation-and-legacy-paths.md).

Release acceptance and closeout are recorded in [#1266](https://github.com/mirichard/pm-tools-templates/issues/1266#issuecomment-5755321786), closed as completed on 09/21/2026 after verification of the release tag, final workflows, and announcement. Project-board status remains explicitly unverified in that record.

## Merged changes and accepted work

These records distinguish merged work from published releases. A merged change is not a new release or deployment.

| Work | Acceptance / current position | Evidence |
| --- | --- | --- |
| Browser-based template customization — #75 | Completed and accepted in Sprint 1: draft retention, save/reopen recovery, validation and export across five editors | [Merged PR #1381](https://github.com/mirichard/pm-tools-templates/pull/1381) · [Acceptance record](demos/288-template-customization/ACCEPTANCE.md) · [Closed issue #75](https://github.com/mirichard/pm-tools-templates/issues/75) |
| Issue-management intake and validation — #1367 | Completed in Sprint 1 after external UAT and an actual successful scheduled issue-type sweep | [Merged PR #1368](https://github.com/mirichard/pm-tools-templates/pull/1368) · [Scheduled run](https://github.com/mirichard/pm-tools-templates/actions/runs/36241475787) · [Closed issue #1367](https://github.com/mirichard/pm-tools-templates/issues/1367) |
| Outcome roadmap and backlog mapping | Mapping and reconciliation accepted; #78 completed; residual community scope retained in #1383 | [Merged PR #1382](https://github.com/mirichard/pm-tools-templates/pull/1382) · [Issue #78](https://github.com/mirichard/pm-tools-templates/issues/78) |
| README entry-point redesign | Catalog, selection-guide and beginner-kit routes; resource-use instructions and separate software prerequisites | [Merged PR #1269](https://github.com/mirichard/pm-tools-templates/pull/1269) |

## Outstanding follow-up

| Item | Current position | Next decision or action |
| --- | --- | --- |
| Catalog-domain export | Recorded as follow-up in the [domain-refactor reconciliation, #711](https://github.com/mirichard/pm-tools-templates/issues/711); excluded from the vNext delivery claim | Confirm remaining scope and tracking before scheduling; [PR #1188](https://github.com/mirichard/pm-tools-templates/pull/1188) was closed without merge |

At the 09/24/2026 baseline review, no GitHub milestones were open. The overall vNext and Sprint 15 milestones are closed. Some closed historical milestones still contain open issues, so their old dates should not be read as active commitments. No next-release date is committed in this roadmap.

## Current outcome map

[Product Roadmap project](https://github.com/users/mirichard/projects/11) · [Complete backlog alignment](backlog/roadmap-alignment.md)

The 09/24/2026 baseline mapped 60 then-open issues to seven product outcomes and repository maintenance. The affected rows below reflect the 09/26/2026 Sprint 1 and AI-direction decisions; the baseline count is not a current open-issue count. Native epic/story/task relationships remain intact. Planning horizon, workflow status and sprint commitment are separate.

| Outcome | Epic ownership and retained scope | Next decision |
| --- | --- | --- |
| **O1 — Find and customize templates** | Discovery #323 → #69/#104; onboarding #284 → #103; standalone customization #75 | #75 is completed and accepted through PR #1381; refine search/navigation/tutorial gaps separately. |
| **O2 — Apply practical PM guidance** | Role suites #47/#49/#50; bounded content work #57/#58/#64 | Repair Design Thinking and Lean Startup journeys; reconcile existing assets before expanding suites. |
| **O3 — Use supported integrations** | #318 → #325 and guide tasks #59/#60/#62; #325 → #61/#76/#290; #290 → #385/#386 | Validate retained guides and one consumer/API contract; resolve overlapping sync scope before execution. |
| **O4 — Contribute and influence priorities** | #319 → #63/#77/#78/#1383/#1384; feedback/reporting records provide operational context | #78 accepted and completed; retain #1383 community participation scope, contribution repairs and privacy-aware analytics for later selection. |
| **O5 — Make traceable value decisions** | #320 → #341 | Reuse benefits/reporting guidance; define one bounded outcome with reproducible calculations. |
| **O6 — Automate bounded PM workflows** | #365 → #367–#383 | Validate the SOW/Charter input contract and choose one complete workflow; the full environment remains uncommitted. |
| **O7 — Use trustworthy AI insights** | Research #523 → #1379; deferred #92/#105; retained recovery #1329 → #1293/#1298/#1372–#1376 | Test whether AI-assisted plan review supports defensible PM decisions with less total effort and adequate coverage. Legacy recovery is paused pending reuse; it is not a prerequisite for this research. |
| **M1 — Maintain repository reliability** | #1367; future confirmed security/CI defects are maintenance work | #1367 is completed with scheduled-run evidence; triage future confirmed defects independently. |

The [alignment register](backlog/roadmap-alignment.md#outcome-register) links every issue, including discovery candidates and operational records, to its current next action. Outcome identifiers are navigation/grouping keys, not new epics or a replacement for native parents.

## Planning decisions

The table below records the agreed 09/26/2026 disposition. It is a decision record, not a live status feed. Current issue and board values are maintained in the generated snapshot below; neither automation nor a closed issue establishes release or acceptance evidence.

| Horizon | Work | Boundary |
| --- | --- | --- |
| **Sprint 1 — added scope** | [#1384](https://github.com/mirichard/pm-tools-templates/issues/1384): repository-wide documentation/usability synchronization | Explicitly added by Michael on 09/26/2026; implementation and live activation require acceptance. |
| **Sprint 1 — Done** | #75 template customization; #1367 issue-management acceptance; #78 roadmap reconciliation | Accepted leaf work; completion does not close parent epics or create a release. |
| **Next / sprint reserves** | #57 and #58 content navigation; #63 contribution workflow remains in the preparation queue | #57/#58 are reserves, not Sprint 1 commitments. Select scope and capacity before starting. |
| **Next — integration preparation** | #59, #60, #62: guidance validation; #61: bounded API decision spike | A spike recommendation does not authorize a new service. |
| **Research — separate from Sprint 1 delivery** | #523 → #1379 AI-assisted sponsor-approval review | Evidence-gathering only; no AI benefit or product readiness claim. |
| **Paused / retained recovery** | #1329 and #1293/#1298/#1372–#1376; draft PRs #1377/#1378 | No Sprint assignment. Resume only for explicitly selected reuse; existing applicable acceptance gates remain. |
| **Later** | Remaining epic/story proposals and #64 | Refine outcomes, resolve overlap and confirm dependencies before promotion. |
| **Discovery / ongoing** | Research candidates below; #198/#1313/#1314 operational records | Neither category is a delivery commitment or product-throughput measure. |

[Now Epic Sprints](https://github.com/users/mirichard/projects/12) records Sprint 1 (09/25–10/18/2026). These are the sprint's planning dates, not a forecast for a release. No next-release scope or date is committed. Parent epics summarize their children; completing a child does not establish that the whole epic is delivered.

### AI research decision and resumption conditions

[#1379](https://github.com/mirichard/pm-tools-templates/issues/1379) evaluates sponsor-approval readiness using existing project plans, supporting records, context and explicit decision criteria, regardless of planning tool or project domain. Compare normal PM review, a checklist, and checklist plus AI. Measure total effort including PM verification, coverage and defensibility; require source references and human decision authority.

The synthetic review runs demonstrate test mechanics only. Before comparative evaluation, resolve the recorded protocol gaps, independently check case realism, admit an authentic case, assign participants/adjudication and freeze the comparison and decision criteria. See the [readiness audit](https://github.com/mirichard/pm-tools-templates/blob/162ff1ba235960ca574ae48734058d2fee9845af/research/1379-sponsor-approval/readiness-audit-2026-09-26.md). No authentic case or participant cohort is yet confirmed in that record.

Legacy recovery remains documented under [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329). Draft #1377 retains bounded lint work; mixed draft #1378 is frozen for component-level reuse assessment. Predictive-model gates apply if predictive claims are selected, not as a prerequisite for plan-review research. Paused work is not completed or waived.

## Current delivery snapshot

The editorial date above applies to human-reviewed narrative. Snapshot capture time is maintained separately by synchronization; older snapshots without a recorded time gain one on the next reconciliation. [Latest synchronization checks](https://github.com/mirichard/pm-tools-templates/actions/workflows/roadmap-sync.yml) show run times and outcomes, including checks that found no changes.

<!-- roadmap-sync:start -->
Snapshot updated at: 2026-09-26T19:15:46.772Z (UTC).

[Latest synchronization checks](https://github.com/mirichard/pm-tools-templates/actions/workflows/roadmap-sync.yml) — includes successful checks with no data changes. A check does not publish to main until its PR is merged.

Snapshot fingerprint: `5165a5086f97ee020c02557dfb4d7c9bdb897374643e2ee034f3e7cb369156c7`. Values are copied from issues and Projects, not inferred acceptance or release claims.

| Sprint | Issue | Issue state | Board status |
| --- | --- | --- | --- |
| Sprint 1 | [#75](https://github.com/mirichard/pm-tools-templates/issues/75) — Story: Complete the browser-based template customization workflow | Closed (completed) | Done |
| Sprint 1 | [#78](https://github.com/mirichard/pm-tools-templates/issues/78) — Story: Roadmap Publication &amp; Community Engagement Platform | Closed (completed) | Done |
| Sprint 1 | [#1367](https://github.com/mirichard/pm-tools-templates/issues/1367) — Bug: Resolve intake and validation gaps found in issue-management UAT | Closed (completed) | Done |
| Sprint 1 | [#1384](https://github.com/mirichard/pm-tools-templates/issues/1384) — Story: Keep repository roadmap documentation and planning views synchronized | Open | In Progress |

[Full status and drift report](backlog/roadmap-status.md). 16 drift flag(s) require review.

<!-- roadmap-sync:end -->

## Unscheduled candidates

The following research-derived candidates are explicitly deprioritized and unscheduled. Their order does not indicate priority. None has a release commitment.

| Candidate | Intended outcome | Scope reference |
| --- | --- | --- |
| Bidirectional requirements consistency | Propagate test-case edits back to use cases and validate process-state consistency | [#1159](https://github.com/mirichard/pm-tools-templates/issues/1159) |
| Requirements extraction from transcripts | Turn elicitation transcripts into candidate requirements for human review and the existing CLI | [#1160](https://github.com/mirichard/pm-tools-templates/issues/1160) |
| Deterministic risk scoring | Provide a risk taxonomy, template, and explainable scoring rules; no predictive-model claim | [#1161](https://github.com/mirichard/pm-tools-templates/issues/1161) |
| Stakeholder sentiment support | Complement a stakeholder register with optional sentiment and stance signals | [#1162](https://github.com/mirichard/pm-tools-templates/issues/1162) |

Other open proposals include [documentation search](https://github.com/mirichard/pm-tools-templates/issues/104), [Jira/Asana synchronization](https://github.com/mirichard/pm-tools-templates/issues/290), and [release automation](https://github.com/mirichard/pm-tools-templates/issues/373). Their outcome mappings and overlap decisions are recorded above and in the alignment register; none is selected next-release scope.

## How to read and maintain this roadmap

- **Released:** linked to a published release. Check release notes for included scope.
- **Merged / accepted:** linked to a merged PR and acceptance evidence; does not imply deployment or inclusion in a published release.
- **Outstanding follow-up:** a documented gap or reconciliation item; inclusion does not assign a delivery date.
- **Unscheduled candidate:** retained for evaluation, without an approved delivery commitment.
- Record approved scope, acceptance criteria, dependencies, and scheduling in the relevant issue or milestone before presenting a candidate as planned delivery.
- Issues own scope, acceptance and native relationships; Projects own planning fields. The [synchronization workflow](docs/roadmap-sync.md) proposes changes to generated status sections and reports drift. Maintainers approve strategy, priority, acceptance and residual-scope decisions. New issues require triage before joining Now or Next.

## Historical proposals

The [previous roadmap](https://github.com/mirichard/pm-tools-templates/blob/e8c7d6cee508bf612f4e8c71ed8e0ce0ba87269f/ROADMAP.md) remains available as a historical record. Its 2025–2026 phase schedules, speculative architecture, staffing and budgets, adoption and revenue targets, and blockchain/AR/VR proposals are not carried forward as current commitments. The [legacy product backlog](backlog/roadmap-product-backlog.md) is retained as a historical reference.

On 09/24/2026, the owner retired the following proposals as **not planned**: #321, #328, #331–#337, #339–#340, #342–#346, and overlapping stories #93–#96. The [retirement record](https://github.com/mirichard/pm-tools-templates/issues/321) and individual issue comments preserve the rationale. This is a scope decision, not a delivery claim. Existing software security and maintenance obligations, AI recovery [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329), and the unscheduled research candidates above remain separately tracked. Other backlog proposals require their own disposition.

## Feedback

[Start a discussion](https://github.com/mirichard/pm-tools-templates/discussions) about priorities or [open an issue](https://github.com/mirichard/pm-tools-templates/issues/new/choose) describing the user problem, intended outcome, and evidence that would demonstrate success.
