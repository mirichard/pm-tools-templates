# Product backlog alignment

**Updated:** 09/26/2026 · **Baseline:** 60 then-open issues reviewed 09/24/2026 at commit `185f820f22a1b73a8b1b84f3244cbf1b9b2169cc`.

[Roadmap](../ROADMAP.md) · [Product Roadmap project](https://github.com/users/mirichard/projects/11) · [Issue policy](../docs/issues-management.md)

This register maps the groomed backlog to repository outcomes. The issue retains its scope and acceptance evidence; the project carries the working planning view. Mapping an epic does not approve every feature in its historical proposal. The baseline mapping did not assign delivery commitments. The 09/26 update records the subsequently approved Sprint 1 scope and AI research direction, and retains completed rows for traceability.

## Planning decisions

| Horizon | Meaning | Selected preparation or existing work |
| --- | --- | --- |
| Now | Work already authorized or awaiting acceptance; not a new release promise | #78 bounded roadmap acceptance in Sprint 1; #75 and #1367 accepted and Done. Legacy recovery remains retained but paused, outside Sprint 1 |
| Next | Ordered preparation queue; implementation needs an owner, capacity and accepted scope | #57/#58 are Sprint 1 reserves only; #63 needs policy resolution; then #59/#60/#62 and decision spike #61 |
| Later | Retained scope requiring refinement or a dependency/overlap decision | Other epics/stories and #64; no dates |
| Unscheduled | Discovery options not selected for delivery | #1159–#1162 |
| Ongoing | Operational records, excluded from delivery throughput | #198, #1313, #1314 |

Equal queue ranks do not imply simultaneous delivery. Select one bounded product item at a time until actual capacity is recorded. #523 → #1379 is separate plan-review research, not a Sprint 1 product-delivery commitment. #1329 recovery is paused pending explicit reuse selection and does not block that research. Parent horizons summarize child preparation, not active implementation of the whole epic.

## Outcome register

### O1: Find and customize templates

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#69](https://github.com/mirichard/pm-tools-templates/issues/69) — Story: Navigation Structure Optimization - Collapsible Template Organization | story | [#323](https://github.com/mirichard/pm-tools-templates/issues/323) | Later | Product; Needs refinement | Define the supported navigation surface and keyboard/mobile acceptance before implementation. |
| [#75](https://github.com/mirichard/pm-tools-templates/issues/75) — Story: Complete the browser-based template customization workflow | story | Standalone | Now | Product; Done (Sprint 1) | Accepted and closed through [PR #1381](https://github.com/mirichard/pm-tools-templates/pull/1381); see [acceptance record](../demos/288-template-customization/ACCEPTANCE.md). No new release claim. |
| [#103](https://github.com/mirichard/pm-tools-templates/issues/103) — Story: UX-101: Interactive Getting Started Tutorial | story | [#284](https://github.com/mirichard/pm-tools-templates/issues/284) | Later | Product; Needs refinement | Select one end-to-end first-use tutorial; separate usability acceptance from unmeasured adoption targets. |
| [#104](https://github.com/mirichard/pm-tools-templates/issues/104) — Story: UX-201: Unified Search Across All Documentation | story | [#323](https://github.com/mirichard/pm-tools-templates/issues/323) | Later | Product; Needs refinement | Inventory existing search, define full-content coverage and reproducible relevance/performance fixtures. |
| [#284](https://github.com/mirichard/pm-tools-templates/issues/284) — EPIC: Interactive Template Onboarding System | epic | Standalone | Later | Product; Rollup / refine | Reconcile existing getting-started guidance and examples; scope #103 before broader onboarding. |
| [#323](https://github.com/mirichard/pm-tools-templates/issues/323) — EPIC: Advanced Template Discovery & Selection System | epic | Standalone | Later | Product; Rollup / refine | Reconcile existing selector/navigation/search against #69 and #104; select one remaining discovery gap. |

### O2: Apply practical PM guidance

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#47](https://github.com/mirichard/pm-tools-templates/issues/47) — EPIC: 1.10: Program Management Template Suite Implementation | epic | Standalone | Later | Product; Rollup / refine | Inventory existing program/portfolio/benefits assets; select only uncovered user outcomes. |
| [#49](https://github.com/mirichard/pm-tools-templates/issues/49) — EPIC: 1.11: Product Owner Role Template Suite | epic | Standalone | Later | Product; Rollup / refine | Reconcile the Product Owner toolkit against maintained product guidance before creating stories. |
| [#50](https://github.com/mirichard/pm-tools-templates/issues/50) — EPIC: 1.12: Release Manager Role Template Suite | epic | Standalone | Later | Product; Rollup / refine | Reconcile release-manager guidance with existing assets and #373; separate guidance from automation. |
| [#57](https://github.com/mirichard/pm-tools-templates/issues/57) — Task: Complete Design Thinking template navigation and acceptance | task | Standalone | Next | Product; Needs selection | Repair Design Thinking navigation and demonstrate a complete sample workflow. |
| [#58](https://github.com/mirichard/pm-tools-templates/issues/58) — Task: Complete Lean Startup kit navigation and acceptance | task | Standalone | Next | Product; Needs selection | Repair Lean Startup kit navigation and demonstrate canvas-to-validation use. |
| [#64](https://github.com/mirichard/pm-tools-templates/issues/64) — Task: Complete industry adaptation guidance against existing templates | task | Standalone | Later | Product; Needs refinement | Map existing industry/context guidance, fill demonstrated gaps and prove one worked adaptation. |
| [#1159](https://github.com/mirichard/pm-tools-templates/issues/1159) — [Research candidate][Requirements] Bidirectional consistency and process-state validation | candidate | Standalone | Unscheduled | Discovery; Uncommitted | Discovery only: validate demand and traceability semantics before proposing delivery scope. |
| [#1160](https://github.com/mirichard/pm-tools-templates/issues/1160) — [Research candidate][Requirements] Requirements extraction from elicitation transcripts | candidate | Standalone | Unscheduled | Discovery; Uncommitted | Discovery only: validate transcript permissions, review workflow and requirements-CLI fit. |

### O3: Use supported integrations

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#59](https://github.com/mirichard/pm-tools-templates/issues/59) — Task: Reconcile Power Automate guide coverage and validation | task | [#318](https://github.com/mirichard/pm-tools-templates/issues/318) | Next | Product; Needs selection | Reconcile Power Automate guide/package claims and record supported execution evidence. |
| [#60](https://github.com/mirichard/pm-tools-templates/issues/60) — Task: Reconcile Zapier guide coverage and validation | task | [#318](https://github.com/mirichard/pm-tools-templates/issues/318) | Next | Product; Needs selection | Reconcile Zapier recipes, missing links and duplicate/failure handling. |
| [#61](https://github.com/mirichard/pm-tools-templates/issues/61) — Spike: Define the minimum template connectivity API contract | spike | [#325](https://github.com/mirichard/pm-tools-templates/issues/325) | Next | Product; Needs selection | Run the existing half-day consumer/API decision spike only when selected; service implementation is a separate decision. |
| [#62](https://github.com/mirichard/pm-tools-templates/issues/62) — Task: Validate and scope the existing Excel automation starter | task | [#318](https://github.com/mirichard/pm-tools-templates/issues/318) | Next | Product; Needs selection | Validate one Excel starter in its supported environment; distinguish examples from executable artifacts. |
| [#76](https://github.com/mirichard/pm-tools-templates/issues/76) — Story: Enhanced Tool Integrations Platform - Bi-Directional PM Tool Sync | story | [#325](https://github.com/mirichard/pm-tools-templates/issues/325) | Later | Product; Needs refinement | Transfer any distinct multi-tool requirements to bounded work; do not duplicate #290 Jira/Asana sync. |
| [#290](https://github.com/mirichard/pm-tools-templates/issues/290) — Story: Integration Enhancement - Jira/Asana Bi-directional Sync | story | [#325](https://github.com/mirichard/pm-tools-templates/issues/325) | Later | Product; Needs refinement | Define supported Jira/Asana slice and test access; then #385 before authenticated #386 execution. |
| [#318](https://github.com/mirichard/pm-tools-templates/issues/318) — EPIC: Integration & Automation Platform | epic | Standalone | Next | Product; Rollup / refine | Roll up selected guide reconciliation; do not schedule all integrations as one platform. |
| [#325](https://github.com/mirichard/pm-tools-templates/issues/325) — EPIC: Universal PM Tool Integration Platform | epic | [#318](https://github.com/mirichard/pm-tools-templates/issues/318) | Next | Product; Rollup / refine | Resolve #76/#290 overlap and #61 consumer contract before selecting an integration slice. |
| [#385](https://github.com/mirichard/pm-tools-templates/issues/385) — Task: [#290] OAuth 2.0 for Jira/Asana with Secure Token Management | task | [#290](https://github.com/mirichard/pm-tools-templates/issues/290) | Later | Product; Needs refinement | Validate OAuth/token lifecycle and provider test access for the selected #290 slice. |
| [#386](https://github.com/mirichard/pm-tools-templates/issues/386) — Task: [#290] Field Mapping + Delta Sync (Jira/Asana) with Idempotency | task | [#290](https://github.com/mirichard/pm-tools-templates/issues/290) | Later | Product; Needs refinement | Implement mapped delta sync after #385 for authenticated execution; prove idempotency and conflict behavior. |

### O4: Contribute and influence priorities

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#63](https://github.com/mirichard/pm-tools-templates/issues/63) — Task: Complete the repository-native template contribution workflow | task | [#319](https://github.com/mirichard/pm-tools-templates/issues/319) | Next | Product; Needs selection | Resolve contribution branching policy, repair links and validate a sample contribution. |
| [#77](https://github.com/mirichard/pm-tools-templates/issues/77) — Story: Usage Analytics & Feedback Loop Platform - Data-Driven Insights | story | [#319](https://github.com/mirichard/pm-tools-templates/issues/319) | Later | Product; Needs refinement | Inventory existing feedback reports; define consent, retention, deletion and minimal data needs before new telemetry. |
| [#78](https://github.com/mirichard/pm-tools-templates/issues/78) — Story: Roadmap Publication & Community Engagement Platform | story | [#319](https://github.com/mirichard/pm-tools-templates/issues/319) | Now | Product; In progress | Reconcile published mapping, Sprint 1 status and AI direction; merge and accept the reconciliation before marking the bounded slice complete. Retain broader community scope explicitly. |
| [#198](https://github.com/mirichard/pm-tools-templates/issues/198) — 💬 Community Feedback: Help Us Improve PM Tools & Templates | operational | Standalone | Ongoing | Operations; Monitoring | Ongoing feedback intake; triage actionable findings into separate linked work. |
| [#319](https://github.com/mirichard/pm-tools-templates/issues/319) — EPIC: Community & Feedback Ecosystem | epic | Standalone | Next | Product; Rollup / refine | Roll up #78 roadmap mapping and #63 contribution repairs; refine analytics separately. |
| [#1313](https://github.com/mirichard/pm-tools-templates/issues/1313) — 📊 Template Analytics Report | operational | Standalone | Ongoing | Operations; Monitoring | Ongoing rating report; submitted ratings are not adoption or verified quality. |
| [#1314](https://github.com/mirichard/pm-tools-templates/issues/1314) — 💎 Template Review Candidates | operational | Standalone | Ongoing | Operations; Monitoring | Ongoing review shortlist; this is not marketplace delivery scope. |

### O5: Make traceable value decisions

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#320](https://github.com/mirichard/pm-tools-templates/issues/320) — EPIC: Executive & Enterprise Platform | epic | Standalone | Later | Product; Rollup / refine | Select one executive reporting outcome using existing benefits/reporting assets. |
| [#341](https://github.com/mirichard/pm-tools-templates/issues/341) — EPIC: ROI & Value Tracking System | epic | [#320](https://github.com/mirichard/pm-tools-templates/issues/320) | Later | Product; Rollup / refine | Prove traceable inputs and reproducible value calculations; reconcile with #47 and existing benefits guidance. |
| [#1161](https://github.com/mirichard/pm-tools-templates/issues/1161) — [Research candidate][Risk] Risk register with deterministic scoring engine | candidate | Standalone | Unscheduled | Discovery; Uncommitted | Discovery only: evaluate taxonomy and deterministic rules; preserve the non-predictive limitation. |

### O6: Automate bounded PM workflows

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#365](https://github.com/mirichard/pm-tools-templates/issues/365) — EPIC: Smart Program Management Environment | epic | Standalone | Later | Product; Rollup / refine | Validate reuse and the #366 SOW/Charter input contract, then select one end-to-end workflow; defer other children. |
| [#367](https://github.com/mirichard/pm-tools-templates/issues/367) — EPIC: Traditional Template Mapping Engine | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Validate the #366 input contract and map to maintained canonical templates before generator work. |
| [#368](https://github.com/mirichard/pm-tools-templates/issues/368) — EPIC: Automated Workstream Update Collector | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Define a minimal update schema and source; validate #366/#367 assumptions before integrations. |
| [#369](https://github.com/mirichard/pm-tools-templates/issues/369) — EPIC: Consolidated Status Report Generator | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Use validated #368 updates to generate one traceable status report. |
| [#370](https://github.com/mirichard/pm-tools-templates/issues/370) — EPIC: Internal vs External View Generator | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Define disclosure rules and test internal/external views against #367/#369 outputs. |
| [#371](https://github.com/mirichard/pm-tools-templates/issues/371) — EPIC: Communication Plan Generator | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Validate structured stakeholder inputs; reuse communication/RACI guidance before generation. |
| [#372](https://github.com/mirichard/pm-tools-templates/issues/372) — EPIC: UAT Planning Toolkit | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Reconcile existing UAT guidance and requirements-CLI outputs before a bounded generated plan. |
| [#373](https://github.com/mirichard/pm-tools-templates/issues/373) — EPIC: Release Management Workflow | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Distinguish user-facing cutover/go-no-go workflow from repository release automation; reconcile #50. |
| [#374](https://github.com/mirichard/pm-tools-templates/issues/374) — EPIC: Jira + Smartsheet Integration Layer | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Reconcile Jira reuse with #325/#290; scope only distinct Smartsheet and project-data needs. |
| [#375](https://github.com/mirichard/pm-tools-templates/issues/375) — EPIC: Project Analytics Engine | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Replace the historical all-epics prerequisite with a minimal data contract; reconcile #1329/#523. |
| [#376](https://github.com/mirichard/pm-tools-templates/issues/376) — EPIC: Slack/Teams Update Bot | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Use #368 update contract and #371 communication rules; require channel permission and retained-data policy. |
| [#377](https://github.com/mirichard/pm-tools-templates/issues/377) — EPIC: Reminder & Escalation Workflow | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Define deterministic reminder/escalation rules from #368/#371 before optimization claims. |
| [#378](https://github.com/mirichard/pm-tools-templates/issues/378) — EPIC: Milestone Calendar Sync Tool | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Select one calendar and bounded milestone contract; validate #367/#371 and time-zone behavior. |
| [#379](https://github.com/mirichard/pm-tools-templates/issues/379) — EPIC: RAID Log Auto-Starter | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Validate source extraction against #366/#367; reconcile deterministic scoring candidate #1161. |
| [#380](https://github.com/mirichard/pm-tools-templates/issues/380) — EPIC: Deliverables Matrix Generator | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Validate source-to-deliverable traceability and the #366/#367 mapping contract. |
| [#381](https://github.com/mirichard/pm-tools-templates/issues/381) — EPIC: Checklist Generator (Full Lifecycle) | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Reuse maintained lifecycle checklists; validate #366/#367 inputs before generation or assignment automation. |
| [#382](https://github.com/mirichard/pm-tools-templates/issues/382) — EPIC: Resource Planning Assistant | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Define explicit capacity/skills inputs and human approval; validate #366/#367 before optimization. |
| [#383](https://github.com/mirichard/pm-tools-templates/issues/383) — EPIC: Budget Forecasting Module | epic | [#365](https://github.com/mirichard/pm-tools-templates/issues/365) | Later | Product; Rollup / refine | Define cost/resource inputs from #382/#367; prefer reproducible calculations before predictive claims. |

### O7: Use trustworthy AI insights

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#92](https://github.com/mirichard/pm-tools-templates/issues/92) — Story: AI-Driven Stakeholder Sentiment Monitor | story | [#523](https://github.com/mirichard/pm-tools-templates/issues/523) | Later | Product; Needs refinement | Reconcile overlap with #1162; require permitted data, representative evaluation and human review. |
| [#105](https://github.com/mirichard/pm-tools-templates/issues/105) — Story: AI-101: Monte Carlo Schedule Forecasting Engine | story | [#523](https://github.com/mirichard/pm-tools-templates/issues/523) | Later | Product; Needs refinement | Deferred candidate: define forecasting use case, permitted data and predictive evaluation before selection; not a prerequisite for #1379. |
| [#523](https://github.com/mirichard/pm-tools-templates/issues/523) — EPIC: AI Data Science Enhancements - Phase 2 | epic | Standalone | Later | Product; Rollup / refine | #1379 evaluates AI-assisted sponsor-approval review against normal PM review and checklist baselines; #92/#105 remain deferred. Legacy recovery is not a prerequisite. |
| [#1162](https://github.com/mirichard/pm-tools-templates/issues/1162) — [Research candidate][Stakeholders] Stakeholder register with sentiment analysis | candidate | Standalone | Unscheduled | Discovery; Uncommitted | Discovery only: reconcile with #92 and assess permitted data and human review; no new story or parent assigned. |
| [#1293](https://github.com/mirichard/pm-tools-templates/issues/1293) — Bug: AI insights lacks effective lint configuration | bug | [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) | Now | AI recovery; Retained draft, no Sprint | PR #1377 retains bounded lint repair. Integration awaits explicit reuse selection; project workflow remains In Progress, not an active sprint commitment. |
| [#1298](https://github.com/mirichard/pm-tools-templates/issues/1298) — Bug: AI insights build configuration and remaining test failures | bug | [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) | Now | AI recovery; Frozen draft, no Sprint | PR #1378 is frozen with a component inventory. Select reusable scope before extraction/integration; project workflow remains In Progress. No waiver-based closure. |
| [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) — EPIC: Restore AI insights after reliability validation | epic | Standalone | Now | AI recovery; Paused, no Sprint | Resume only if legacy runtime reuse is selected. Restoration requires applicable existing gates; #1379 research proceeds independently. |

The retained Now horizons above are planning metadata, not a claim that paused recovery is active. The following post-baseline issues extend this register; their disposition is recorded without inventing a new project horizon.

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#1372](https://github.com/mirichard/pm-tools-templates/issues/1372) — AI recovery SIT | task | [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) | See disposition | Paused; no Sprint | Resume contract/integration acceptance only if runtime reuse is selected; depends on #1293/#1298. |
| [#1373](https://github.com/mirichard/pm-tools-templates/issues/1373) — AI recovery UAT planning | task | [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) | See disposition | Paused; no Sprint | Define selected-product scenarios after #1379; no legacy UAT execution commitment. |
| [#1374](https://github.com/mirichard/pm-tools-templates/issues/1374) — Predictive risk-model evaluation | task | [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) | See disposition | Deferred; no Sprint | Apply accuracy/calibration gates only if predictive claims are selected. |
| [#1375](https://github.com/mirichard/pm-tools-templates/issues/1375) — AI recovery UAT execution | task | [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) | See disposition | Paused; no Sprint | Requires #1379/#1372/#1373 and selected runtime scope before execution. |
| [#1376](https://github.com/mirichard/pm-tools-templates/issues/1376) — AI restoration acceptance | task | [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) | See disposition | Paused; no Sprint | Requires #1293/#1298/#1372–#1375 if restoration is selected; preserve gate evidence. |
| [#1379](https://github.com/mirichard/pm-tools-templates/issues/1379) — AI-assisted plan-review research | candidate | [#523](https://github.com/mirichard/pm-tools-templates/issues/523) | See disposition | Research; readiness gaps; no Sprint | Resolve protocol gaps, independently assess realism, admit an authentic case and assign participants/adjudication before comparative evaluation. Synthetic runs do not prove AI value. |

### M1: Maintain repository reliability

| Issue | Type | Parent | Horizon | Lane / readiness | Next action |
| --- | --- | --- | --- | --- | --- |
| [#1367](https://github.com/mirichard/pm-tools-templates/issues/1367) — Bug: Resolve intake and validation gaps found in issue-management UAT | bug | Standalone | Now | Maintenance; Done (Sprint 1) | Closed after external UAT and [successful scheduled sweep](https://github.com/mirichard/pm-tools-templates/actions/runs/36241475787); merged PR #1368. |

## Dependencies and overlap decisions

| Decision | Treatment |
| --- | --- |
| #76 and #290 | #290 owns Jira/Asana delivery, with #385 → authenticated #386. Retain #76 only for demonstrably distinct scope; transfer requirements before duplicate closure. |
| #374 and #325 | Preserve #374 under #365; reuse the integration contract and adapters rather than build a competing Jira layer. |
| #92 and #1162 | Compare real-time monitoring with the optional sentiment-register proposal before selection; keep the research candidate uncommitted. |
| #47/#320/#341 and released benefits guidance | Inventory maintained assets before adding program or value-tracking functionality. |
| #50 and #373 | Separate reusable release-manager guidance from generated operational workflows; repository release numbering is already maintained separately. |
| #365 and #366 | #366 is closed historical work; its cross-repository implementation is not evidence of an integrated input contract. Validate reuse before dependent generation. |
| #375/#383 and #1329/#523 | Define minimum data contracts and representative evaluation. Historical accuracy targets and “all previous epics” are not accepted readiness gates. |
| Catalog-domain export | Remains an unscoped follow-up in #711; establish a bounded issue only after checking existing export behavior. It is not silently assigned to an unrelated open epic. |

## Hierarchy and inventory controls

The 09/24/2026 baseline contained **30 epics, 10 stories, 9 tasks, 3 bugs, 1 spike, 4 candidates and 3 operational records**. At that review, all 60 had exactly one approved type. These are historical counts; closed #75/#1367 and the added AI follow-ups mean this is not today's open inventory. The 37 parent relationships reuse the owner's verified GitHub API read-back from 09/24/2026; this mapping does not create or replace native parents. Twenty-three issues are intentionally root/standalone, including #75 and the research candidates. A shared outcome is not a new parent relationship.

Seventeen child epics under #365 roll up to O6, even where their capabilities also support other outcomes. Cross-cutting relationships are dependencies, avoiding competing parents. Count accepted leaf deliverables separately from epic rollups; issue counts do not establish effort or capacity.

At the baseline review, sixteen open issues retained **closed historical milestones**. Those dates are not active commitments and are excluded from this planning view. Legacy `theme-*`, phase and priority labels are not the authority for outcome or horizon. No release date is assigned here. Sprint 1 commitments are #75, #1367 and the bounded #78 slice; #57/#58 remain reserves.

## Project use and maintenance

Use the linked project for open work and keep the historical delivery projects closed. Include native parent and sub-issue progress, type labels, planning horizon and outcome. Keep workflow status separate from horizon: Next does not mean In progress, and Later does not mean rejected. Operational items stay visible in a separate view and do not count as product delivery.

During grooming, check new items for one type, a primary outcome, correct parent or standalone rationale, one next decision and duplicate/dependency conflicts. Candidates enter discovery; new items do not inherit a delivery commitment merely because they are added to the project. Before implementation, confirm the owner, available capacity, supported scope, acceptance fixtures and needed access/data. Before closure, record merged evidence and disposition of residual scope, then update the issue, project and roadmap together.

This is a dated inventory, not an automatic synchronization claim. Update affected rows when scope or disposition changes; reconcile project items against all open issues at each planning review. #78 tracks acceptance of the public roadmap/project experience; this mapping alone does not close its broader historical community requirements.

## #78 Sprint 1 acceptance and continuation

The selected slice reconciles the existing public roadmap and GitHub Projects experience. It does not commission a separate community platform.

| Acceptance area | Evidence / treatment | Remaining action |
| --- | --- | --- |
| Public roadmap and project integration | Initial mapping merged in [PR #1371](https://github.com/mirichard/pm-tools-templates/pull/1371); [Product Roadmap](https://github.com/users/mirichard/projects/11) and [Now Epic Sprints](https://github.com/users/mirichard/projects/12) provide interactive planning views | Accept this reconciliation after merge and verify the public reader journey from roadmap to issue and project |
| Progress and feature status | #75 and #1367 are accepted; #78 is the remaining active Sprint 1 slice; AI research and paused recovery have distinct dispositions | Verify board status after PR linking and final acceptance; automation must not leave completed items In Progress |
| Timelines | Sprint dates are planning boundaries; closed milestone dates and historical proposals are not release forecasts | Publish a release forecast only when separately agreed |
| Broader community engagement | Dedicated voting/engagement features and historical targets (500 votes, 80% satisfaction, 30% community-driven priorities, 200% engagement growth) have no acceptance evidence or current commitment | Retain under #78/#319 for explicit scope and measurement decisions; do not mark them delivered by this documentation change |

Owner/acceptance authority: Michael Richard. #78 remains open until the bounded slice is accepted and its residual scope is explicitly disposed of or separately tracked. The reconciliation PR must reference #78 without automatically closing it. No broader community requirement is waived here.
