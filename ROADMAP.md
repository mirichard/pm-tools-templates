# Roadmap

**Last reviewed:** 09/24/2026

This roadmap summarizes released capabilities, outstanding follow-up, and future candidates for PM Tools & Templates. Release notes describe what shipped; linked issues hold scope and acceptance evidence. An open issue is not, by itself, a delivery commitment.

[Use the library](README.md) · [Release history](https://github.com/mirichard/pm-tools-templates/releases) · [Open work](https://github.com/mirichard/pm-tools-templates/issues?q=is%3Aissue%20is%3Aopen) · [Milestones](https://github.com/mirichard/pm-tools-templates/milestones)

## Released

Repository and component versions follow separate histories. `v2.3.0` is assigned to the latest published repository release, `vNext`; the existing `v2.2.0` tag has no published release entry and cannot be reused. See [release numbering and history](docs/release-versioning.md) for the manifest, automated consistency checks, and release procedure. No next release is scheduled.

| Delivery | What it provides | Record |
| --- | --- | --- |
| v2.3.0 (vNext) — Value Delivery System Upgrade | Benefits and value-delivery guidance; six performance domains; context-sensitive template selection; principles and applicability guidance; adaptive governance; product and continuous-delivery practices | [Published release — 09/21/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/vNext) |
| Requirements CLI v1.2 | Nonfunctional-requirement generation, quality-attribute mapping, acceptance-criteria scaffolding, human-review gates, and classification evaluation | [Published release — 09/18/2026](https://github.com/mirichard/pm-tools-templates/releases/tag/v1.2.0-requirements-cli) |
| README entry-point redesign | Catalog, selection-guide, and beginner-kit routes; explained domains; resource-use instructions; separate software prerequisites | [Merged PR #1269](https://github.com/mirichard/pm-tools-templates/pull/1269) |

vNext's migration establishes canonical locations and cross-references for the migrated collection. Legacy paths remain supported through vNext and at least the next major release under the [compatibility policy](docs/domain-navigation-and-legacy-paths.md).

Release acceptance and closeout are recorded in [#1266](https://github.com/mirichard/pm-tools-templates/issues/1266#issuecomment-5755321786), closed as completed on 09/21/2026 after verification of the release tag, final workflows, and announcement. Project-board status remains explicitly unverified in that record.

## Outstanding follow-up

| Item | Current position | Next decision or action |
| --- | --- | --- |
| Catalog-domain export | Recorded as follow-up in the [domain-refactor reconciliation, #711](https://github.com/mirichard/pm-tools-templates/issues/711); excluded from the vNext delivery claim | Confirm remaining scope and tracking before scheduling; [PR #1188](https://github.com/mirichard/pm-tools-templates/pull/1188) was closed without merge |

At this review, no GitHub milestones are open. The overall vNext and Sprint 15 milestones are closed. Some closed historical milestones still contain open issues, so their old dates should not be read as active commitments. No next-release date is committed in this roadmap.

## Current outcome map

[Product Roadmap project](https://github.com/users/mirichard/projects/11) · [Complete backlog alignment](backlog/roadmap-alignment.md)

The 09/24/2026 review maps all 60 open issues to seven product outcomes and repository maintenance. Native epic/story/task relationships remain intact. The project separates planning horizon from workflow status; alignment does not schedule delivery.

| Outcome | Epic ownership and retained scope | Next decision |
| --- | --- | --- |
| **O1 — Find and customize templates** | Discovery #323 → #69/#104; onboarding #284 → #103; standalone customization #75 | Prepare #75 first using the existing five-editor implementation; refine search/navigation/tutorial gaps separately. |
| **O2 — Apply practical PM guidance** | Role suites #47/#49/#50; bounded content work #57/#58/#64 | Repair Design Thinking and Lean Startup journeys; reconcile existing assets before expanding suites. |
| **O3 — Use supported integrations** | #318 → #325 and guide tasks #59/#60/#62; #325 → #61/#76/#290; #290 → #385/#386 | Validate retained guides and one consumer/API contract; resolve overlapping sync scope before execution. |
| **O4 — Contribute and influence priorities** | #319 → #63/#77/#78; feedback/reporting records provide operational context | Publish this roadmap/project view, complete the existing contribution path, and refine privacy-aware analytics. |
| **O5 — Make traceable value decisions** | #320 → #341 | Reuse benefits/reporting guidance; define one bounded outcome with reproducible calculations. |
| **O6 — Automate bounded PM workflows** | #365 → #367–#383 | Validate the SOW/Charter input contract and choose one complete workflow; the full environment remains uncommitted. |
| **O7 — Use trustworthy AI insights** | Recovery #1329 → #1293/#1298; expansion #523 → #92/#105 | Complete recovery gates separately; expansion remains deferred pending supported contracts, data and evaluation. |
| **M1 — Maintain repository reliability** | #1367; future confirmed security/CI defects are maintenance work | Verify the actual scheduled issue-type sweep and record acceptance. |

The [alignment register](backlog/roadmap-alignment.md#outcome-register) links every issue, including discovery candidates and operational records, to its current next action. Outcome identifiers are navigation/grouping keys, not new epics or a replacement for native parents.

## Now, Next and Later

| Horizon | Work | Boundary |
| --- | --- | --- |
| **Now** | #78 roadmap mapping; #1367 scheduled verification; #1329 recovery with #1293/#1298 in its own lane | Existing authorized work and acceptance; no new restoration or release commitment. |
| **Next — 1** | #75: complete editing, preview, save/reopen and export across the five supported editors | Select an owner and available capacity before implementation. |
| **Next — 2** | #57, #58, #63: content navigation and contribution workflow | Accept independently; equal rank does not imply parallel staffing. |
| **Next — 3** | #59, #60, #62: integration guidance validation; #61: bounded API decision spike | A spike recommendation does not authorize a new service. |
| **Later** | Remaining epic/story proposals and #64 | Refine outcomes, resolve overlap and confirm dependencies before promotion. |
| **Discovery / ongoing** | Research candidates below; #198/#1313/#1314 operational records | Neither category is a delivery commitment or product-throughput measure. |

This order carries forward the groomed queue in #75. No capacity estimate, delivery date, sprint or next-release scope is assigned. Parent epics summarize their children; completing a child does not establish that the whole epic is delivered.

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

- **Released:** linked to a published release or a merged change. Check the linked record for limitations and acceptance evidence.
- **Outstanding follow-up:** a documented gap or reconciliation item; inclusion does not assign a delivery date.
- **Unscheduled candidate:** retained for evaluation, without an approved delivery commitment.
- Record approved scope, acceptance criteria, dependencies, and scheduling in the relevant issue or milestone before presenting a candidate as planned delivery.
- Update this page, the affected alignment row and the linked project when scope, horizon or acceptance changes. Keep release evidence in releases and issues; count leaf delivery separately from epic rollups. New issues require triage before joining Now or Next.

## Historical proposals

The [previous roadmap](https://github.com/mirichard/pm-tools-templates/blob/e8c7d6cee508bf612f4e8c71ed8e0ce0ba87269f/ROADMAP.md) remains available as a historical record. Its 2025–2026 phase schedules, speculative architecture, staffing and budgets, adoption and revenue targets, and blockchain/AR/VR proposals are not carried forward as current commitments. The [legacy product backlog](backlog/roadmap-product-backlog.md) is retained as a historical reference.

On 09/24/2026, the owner retired the following proposals as **not planned**: #321, #328, #331–#337, #339–#340, #342–#346, and overlapping stories #93–#96. The [retirement record](https://github.com/mirichard/pm-tools-templates/issues/321) and individual issue comments preserve the rationale. This is a scope decision, not a delivery claim. Existing software security and maintenance obligations, AI recovery [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329), and the unscheduled research candidates above remain separately tracked. Other backlog proposals require their own disposition.

## Feedback

[Start a discussion](https://github.com/mirichard/pm-tools-templates/discussions) about priorities or [open an issue](https://github.com/mirichard/pm-tools-templates/issues/new/choose) describing the user problem, intended outcome, and evidence that would demonstrate success.
