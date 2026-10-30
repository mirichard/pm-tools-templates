# Roadmap

**Editorial review date:** 10/30/2026

This roadmap summarizes released capabilities, outstanding follow-up, and future candidates for PM Tools & Templates. Release notes describe what shipped; linked issues hold scope and acceptance evidence. An open issue is not, by itself, a delivery commitment.

[Use the library](README.md) · [Release history](https://github.com/mirichard/pm-tools-templates/releases) · [Open work](https://github.com/mirichard/pm-tools-templates/issues?q=is%3Aissue%20is%3Aopen) · [Milestones](https://github.com/mirichard/pm-tools-templates/milestones)

## Released

Repository and component versions follow separate histories. The latest repository release is **v2.4.0**, published October 30, 2026 with explicit owner authorization ahead of the former November 29 target. See [release numbering and history](docs/release-versioning.md). The approved next release direction is **v2.5.0**, targeting January 22, 2027 subject to readiness. Detailed scope and capacity remain provisional; see [#1556](https://github.com/mirichard/pm-tools-templates/issues/1556).

| Delivery | What it provides | Record |
| --- | --- | --- |
| v2.4.0 — Template workflows, community intake and delivery reliability | Browser customization, Design Thinking/Lean Startup kits, sanitized-file/text contribution and feedback, and delivery/security maintenance | [Published release — 10/30/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/v2.4.0) |
| v2.3.0 (vNext) — Value Delivery System Upgrade | Benefits and value-delivery guidance; six performance domains; context-sensitive template selection; principles and applicability guidance; adaptive governance; product and continuous-delivery practices | [Published release — 09/21/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext) |
| Requirements CLI v1.2 | Nonfunctional-requirement generation, quality-attribute mapping, acceptance-criteria scaffolding, human-review gates, and classification evaluation | [Published release — 09/18/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/v1.2.0-requirements-cli) |

vNext's migration establishes canonical locations and cross-references for the migrated collection. Legacy paths remain supported through vNext and at least the next major release under the [compatibility policy](docs/domain-navigation-and-legacy-paths.md).

Release acceptance and closeout are recorded in [#1266](https://github.com/mirichard/pm-tools-templates/issues/1266#issuecomment-5755321786), closed as completed on 09/21/2026 after verification of the release tag, final workflows, and announcement. Project-board status remains explicitly unverified in that record.

## Merged changes and accepted work

The records below are included in v2.4.0 where accepted. #57/#58 and the bounded #319 contribution/feedback scope are also accepted and published; #63/#1383 are completed. Restricted-original handling remains explicitly deferred in #1546 (O4 / Later), and #1480/#1481 remain later work. See [release closeout](docs/releases/v2.4.0-closeout.md).

| Work | Acceptance / current position | Evidence |
| --- | --- | --- |
| Browser-based template customization — #75 | Completed and accepted in Sprint 1: draft retention, save/reopen recovery, validation and export across five editors | [Merged PR #1381](https://github.com/mirichard/pm-tools-templates/pull/1381) · [Acceptance record](demos/288-template-customization/ACCEPTANCE.md) · [Closed issue #75](https://github.com/mirichard/pm-tools-templates/issues/75) |
| Issue-management intake and validation — #1367 | Completed in Sprint 1 after external UAT and an actual successful scheduled issue-type sweep | [Merged PR #1368](https://github.com/mirichard/pm-tools-templates/pull/1368) · [Scheduled run](https://github.com/mirichard/pm-tools-templates/actions/runs/36241475787) · [Closed issue #1367](https://github.com/mirichard/pm-tools-templates/issues/1367) |
| Outcome roadmap and backlog mapping | Mapping and reconciliation accepted; #78 and bounded #1383 completed in v2.4.0 | [Merged PR #1382](https://github.com/mirichard/pm-tools-templates/pull/1382) · [Issue #78](https://github.com/mirichard/pm-tools-templates/issues/78) |
| README entry-point redesign | Catalog, selection-guide and beginner-kit routes; resource-use instructions and separate software prerequisites | [Merged PR #1269](https://github.com/mirichard/pm-tools-templates/pull/1269) |

## Outstanding follow-up

| Item | Current position | Next decision or action |
| --- | --- | --- |
| Catalog-domain export | Recorded as follow-up in the [domain-refactor reconciliation, #711](https://github.com/mirichard/pm-tools-templates/issues/711); excluded from the vNext delivery claim | Confirm remaining scope and tracking before scheduling; [PR #1188](https://github.com/mirichard/pm-tools-templates/pull/1188) was closed without merge |

At the 09/24/2026 baseline review, no GitHub milestones were open. The overall vNext and Sprint 15 milestones are closed. Some closed historical milestones still contain open issues, so their old dates should not be read as active commitments. The current v2.5.0 planning target is recorded below.

## Current outcome map

**Product benchmark — approved 09/28/2026:** All product candidates are assessed against the [Product Vision and evidence guidance](backlog/product-goal.md). The outcome map below organizes contributions to that vision; alignment alone does not establish benefit, priority, or delivery commitment.

[Product Roadmap project](https://github.com/users/mirichard/projects/11) · [Complete backlog alignment](backlog/roadmap-alignment.md)

The 09/24/2026 baseline mapped 60 then-open issues to seven product outcomes and repository maintenance. The affected rows below reflect the 09/26/2026 Sprint 1 and AI-direction decisions; the baseline count is not a current open-issue count. Native epic/story/task relationships remain intact. Planning horizon, workflow status and sprint commitment are separate.

| Outcome | Epic ownership and retained scope | Next decision |
| --- | --- | --- |
| **O1 — Find and customize templates** | Discovery #323 → #69/#104; onboarding #284 → #103; standalone customization #75 | #75 is completed and accepted through PR #1381; refine search/navigation/tutorial gaps separately. |
| **O2 — Apply practical PM guidance** | Role suites #47/#49/#50; bounded content work #57/#58/#64 | Design Thinking and Lean Startup journeys (#57/#58) are accepted and released in v2.4.0; select further suite work separately. |
| **O3 — Use supported integrations** | #318 → #325 and guide tasks #59/#60/#62; #325 → #61/#76/#290; #290 → #385/#386 | Validate retained guides and one consumer/API contract; resolve overlapping sync scope before execution. |
| **O4 — Contribute and influence priorities** | #319 → #63/#77/#78/#1383/#1384; feedback/reporting records provide operational context | #319 bounded sanitized-file/text scope, #63/#78/#1383 are accepted and released; restricted originals (#1546), participation enhancements (#1481), and opt-in analytics (#1480) remain deferred. |
| **O5 — Make traceable value decisions** | #320 → #341 | Reuse benefits/reporting guidance; define one bounded outcome with reproducible calculations. |
| **O6 — Automate bounded PM workflows** | #365 → #367–#383 | Validate the SOW/Charter input contract and choose one complete workflow; the full environment remains uncommitted. |
| **O7 — Use trustworthy AI insights** | Research #523 → #1379; deferred #92/#105; retained recovery #1329 → #1293/#1298/#1372–#1376 | Test whether AI-assisted plan review supports defensible PM decisions with less total effort and adequate coverage. Legacy recovery is paused pending reuse; it is not a prerequisite for this research. |
| **M1 — Maintain repository reliability** | #1367; future confirmed security/CI defects are maintenance work | #1367 is completed with scheduled-run evidence; triage future confirmed defects independently. |

The [alignment register](backlog/roadmap-alignment.md#outcome-register) links every issue, including discovery candidates and operational records, to its current next action. Outcome identifiers are navigation/grouping keys, not new epics or a replacement for native parents.

## Approved v2.5.0 direction — October 30, 2026

**Product Goal:** Help a PM find an appropriate template and successfully apply it to a real project.

Target **January 22, 2027**, subject to readiness. [Release plan #1556](https://github.com/mirichard/pm-tools-templates/issues/1556) · [Milestone](https://github.com/mirichard/pm-tools-templates/milestone/38) · [Sprint project](https://github.com/users/mirichard/projects/12).

| Sprint | Dates | Candidate outcome |
| --- | --- | --- |
| Sprint 4 | Nov 9–29, 2026 | #104 / #323: relevant search across an agreed content boundary |
| Sprint 5 | Nov 30–Dec 20, 2026 | #103 / #284: guided selection, completion and download |
| Sprint 6 | Dec 21, 2026–Jan 10, 2027 | Combined journey acceptance, defects, accessibility/mobile and release preparation |

The owner corrected the cadence to three consecutive three-week sprints. Separate [Sprint 4](https://github.com/users/mirichard/projects/12/views/6), [Sprint 5](https://github.com/users/mirichard/projects/12/views/7) and [Sprint 6](https://github.com/users/mirichard/projects/12/views/8) boards replace the shared view. January 11–22 is contingency, not extra committed feature capacity.

Six delivery packages decompose the two selected stories and release tracker: search #1559/#1560 (8–12 focused person-days), onboarding #1561/#1562 (6–10), and integration/release #1563/#1564 (4–7). The 18–29-day total is a provisional analyst estimate, not measured team velocity; do not double-count parent issues. Parallel discovery has a separate proposed 4–6-day allowance. Actual staffing, holiday availability, acceptance decisions and measurement lead times remain unresolved; [#1556](https://github.com/mirichard/pm-tools-templates/issues/1556) records the capacity scenario. Extra backlog is not committed merely to fill nine weeks.

The owner approved direction and candidate allocation; refinement must still establish maintained-asset reuse, supported scope, explicit disposition of existing acceptance requirements, dependencies and capacity. Parent epics are not accepted in full by selecting their children. #62 is reserve only. #1482 remains accepted and #1546 remains deferred.

Parallel discovery: #523/#1379 resolves the remaining review/participant/control gates while preserving accepted source sufficiency; #365 verifies reusable components and the SOW/Charter contract to propose one bounded workflow. Discovery does not block v2.5.0 and does not automatically promote work to delivery. #1329 remains paused.

Project 12 retains the original `Sprint` calendar for v2.4 history. Its `v2.5 Sprint` calendar holds the approved overlapping planning dates; generated snapshots read both and report conflicting assignments. Planning approval is not publication authorization.

## Historical planning decisions

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

[Now Epic Sprints](https://github.com/users/mirichard/projects/12) records Sprint 1 (09/25–10/18/2026). These are the sprint's planning dates, not a forecast for a release. The later v2.5.0 planning decision below supersedes this historical no-next-release position. Parent epics summarize their children; completing a child does not establish that the whole epic is delivered.

### AI research decision and resumption conditions

[#1379](https://github.com/mirichard/pm-tools-templates/issues/1379) evaluates sponsor-approval readiness using existing project plans, supporting records, context and explicit decision criteria, regardless of planning tool or project domain. Compare normal PM review, a checklist, and checklist plus AI. Measure total effort including PM verification, coverage and defensibility; require source references and human decision authority.

The synthetic review runs demonstrate test mechanics only. Before comparative evaluation, resolve the recorded protocol gaps, independently check case realism, admit an authentic case, assign participants/adjudication and freeze the comparison and decision criteria. See the [readiness audit](https://github.com/mirichard/pm-tools-templates/blob/162ff1ba235960ca574ae48734058d2fee9845af/research/1379-sponsor-approval/readiness-audit-2026-09-26.md). No authentic case or participant cohort is yet confirmed in that record.

Legacy recovery remains documented under [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329). Draft #1377 retains bounded lint work; mixed draft #1378 is frozen for component-level reuse assessment. Predictive-model gates apply if predictive claims are selected, not as a prerequisite for plan-review research. Paused work is not completed or waived.

## Current delivery snapshot

The editorial date above applies to human-reviewed narrative. Snapshot capture time is maintained separately by synchronization; older snapshots without a recorded time gain one on the next reconciliation. [Latest synchronization checks](https://github.com/mirichard/pm-tools-templates/actions/workflows/roadmap-sync.yml) show run times and outcomes, including checks that found no changes.

<!-- roadmap-sync:start -->
Snapshot updated at: 2026-10-30T17:23:00.373Z (UTC).

[Latest synchronization checks](https://github.com/mirichard/pm-tools-templates/actions/workflows/roadmap-sync.yml) — includes successful checks with no data changes. A check does not publish to main until its PR is merged.

Snapshot fingerprint: `53be0b7052e0531daf2885f50d682f18f70034bb2c739f5757c4ae79fa35272b`. Values are copied from issues and Projects, not inferred acceptance or release claims.

| Sprint | Issue | Issue state | Board status | Release milestone |
| --- | --- | --- | --- | --- |
| Sprint 2 | [#57](https://github.com/mirichard/pm-tools-templates/issues/57) — Task: Complete Design Thinking template navigation and acceptance | Closed (completed) | Done | [v2.4.0 — Now Epics Sprints 1–3](https://github.com/mirichard/pm-tools-templates/milestone/35) |
| Sprint 2 | [#58](https://github.com/mirichard/pm-tools-templates/issues/58) — Task: Complete Lean Startup kit navigation and acceptance | Closed (completed) | Done | [v2.4.0 — Now Epics Sprints 1–3](https://github.com/mirichard/pm-tools-templates/milestone/35) |
| Sprint 1 | [#75](https://github.com/mirichard/pm-tools-templates/issues/75) — Story: Complete the browser-based template customization workflow | Closed (completed) | Done | [v2.4.0 — Now Epics Sprints 1–3](https://github.com/mirichard/pm-tools-templates/milestone/35) |
| Sprint 1 | [#78](https://github.com/mirichard/pm-tools-templates/issues/78) — Story: Roadmap Publication &amp; Community Engagement Platform | Closed (completed) | Done | [v2.4.0 — Now Epics Sprints 1–3](https://github.com/mirichard/pm-tools-templates/milestone/35) |
| Sprint 5 | [#103](https://github.com/mirichard/pm-tools-templates/issues/103) — Story: UX-101: Interactive Getting Started Tutorial | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |
| Sprint 4 | [#104](https://github.com/mirichard/pm-tools-templates/issues/104) — Story: UX-201: Unified Search Across All Documentation | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |
| Sprint 3 | [#319](https://github.com/mirichard/pm-tools-templates/issues/319) — EPIC: Community &amp; Feedback Ecosystem | Closed (completed) | Done | [v2.4.0 — Now Epics Sprints 1–3](https://github.com/mirichard/pm-tools-templates/milestone/35) |
| Sprint 1 | [#1367](https://github.com/mirichard/pm-tools-templates/issues/1367) — Bug: Resolve intake and validation gaps found in issue-management UAT | Closed (completed) | Done | [v2.4.0 — Now Epics Sprints 1–3](https://github.com/mirichard/pm-tools-templates/milestone/35) |
| Sprint 1 | [#1384](https://github.com/mirichard/pm-tools-templates/issues/1384) — Story: Keep repository roadmap documentation and planning views synchronized | Closed (completed) | Done | [v2.4.0 — Now Epics Sprints 1–3](https://github.com/mirichard/pm-tools-templates/milestone/35) |
| Sprint 3 | [#1483](https://github.com/mirichard/pm-tools-templates/issues/1483) — Validate reusable-plan imports into Jira and Asana before custom development | Closed (not_planned) | Done | [None](https://github.com/mirichard/pm-tools-templates/milestone/37) |
| Sprint 6 | [#1556](https://github.com/mirichard/pm-tools-templates/issues/1556) — Task: Plan, validate and release v2.5.0 — Find and apply a template | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |
| Sprint 4 | [#1559](https://github.com/mirichard/pm-tools-templates/issues/1559) — Task: Define unified-search corpus, query fixtures and acceptance measures | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |
| Sprint 4 | [#1560](https://github.com/mirichard/pm-tools-templates/issues/1560) — Task: Implement and validate unified documentation and template search | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |
| Sprint 5 | [#1561](https://github.com/mirichard/pm-tools-templates/issues/1561) — Task: Define first-use tutorial, progress behavior and acceptance measures | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |
| Sprint 5 | [#1562](https://github.com/mirichard/pm-tools-templates/issues/1562) — Task: Implement and validate the guided first-template journey | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |
| Sprint 6 | [#1563](https://github.com/mirichard/pm-tools-templates/issues/1563) — Task: Validate v2.5 combined journey and resolve release defects | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |
| Sprint 6 | [#1564](https://github.com/mirichard/pm-tools-templates/issues/1564) — Task: Prepare v2.5 release notes, checks and approval package | Open | Todo | [v2.5.0 — Find and apply a template](https://github.com/mirichard/pm-tools-templates/milestone/38) |

[Full status and drift report](backlog/roadmap-status.md). 11 drift flag(s) require review.

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
