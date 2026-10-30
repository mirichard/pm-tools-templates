# Epic #47 — Program Management Discovery

**Research snapshot:** 2026-10-30  
**Status:** Recommendation for owner review; not a delivery or sprint commitment.

## Decision brief

Recommend refining one small, human-managed program coordination slice first: connect the existing cross-project dependency matrix and program status/escalation guidance into a governance-ready decision record, with one clearly synthetic worked example. Do not create another program, portfolio, benefits, or integration platform. A second, lower-priority candidate is to correct and complete the program lifecycle/methodology crosswalk using canonical assets already in the repository.

The strongest evidence is the content itself: the program plan, charters, risk and benefits assets are substantive, but the dependency matrix and program status/communication documents mainly define headings and fields. Existing material already covers the core artifacts, portfolio prioritization, benefits reviews, and SAFe planning. The proposed first slice connects rather than duplicates those assets.

The principal uncertainty is user need: issue #47 has no discussion or native child issues, and the available repository feedback did not surface a program-specific user report. The user consequence is therefore a content-based inference, not validated user research. External benchmarking was limited; five public GitHub Projects workflows are cited, but they describe one platform and do not establish outcomes.

**Owner decision needed:** approve, revise, or defer Candidate 1 for backlog refinement; confirm whether program-level communication is the first uncovered outcome. No owner, capacity, estimate, or sprint selection is confirmed here.

## Current issue and refinement context

- Issue [#47](https://github.com/mirichard/pm-tools-templates/issues/47) is an unscheduled, standalone O2 / Later discovery candidate. Its current next action is to inventory maintained assets and select only uncovered outcomes. Its historical dates, checkmarks, parent reference to closed #98, adoption target, and satisfaction target are not current delivery commitments.
- #47 has no native sub-issues and no issue comments in the available read. Its links include the merged roadmap-alignment proposal [#1371](https://github.com/mirichard/pm-tools-templates/pull/1371) and the [roadmap product backlog](../backlog/roadmap-product-backlog.md). The proposal maps the backlog and leaves research candidates uncommitted.
- Discovery tracker [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566) groups #47 with integration/resource/value candidates for its Sprint 6 discovery checkpoint. Its policy requires evidence, bounded outcomes, exclusions, feasibility, dependencies, estimates, and owner disposition before backlog promotion. Sprint readiness additionally needs a named owner, leaf work, sequencing, validation, estimate, and owner readiness decision; actual sprint selection also requires confirmed capacity.
- [#320](https://github.com/mirichard/pm-tools-templates/issues/320) is a separate, parentless executive/value parent; [#341](https://github.com/mirichard/pm-tools-templates/issues/341) is its child and must reconcile with #47's benefits guidance. Do not make executive dashboards, ROI calculation, or enterprise reporting part of this recommendation.
- Related automation/integration work is grouped elsewhere: [#371 communication-plan generator](https://github.com/mirichard/pm-tools-templates/issues/371), [#379 RAID auto-starter](https://github.com/mirichard/pm-tools-templates/issues/379), and [#382 resource-planning assistant](https://github.com/mirichard/pm-tools-templates/issues/382) are under #365. They are coordination boundaries, not assumed dependencies or approved work for #47.

## Capability-to-evidence matrix

| Original capability | Maintained evidence and demonstrated usability | Gap and consequence | Dependencies / boundary | Disposition |
|---|---|---|---|---|
| **Core Program Manager Toolkit** | The [program-manager entry point](../role-based-toolkits/program-manager/README.md#L3-L27) describes coordination across projects and links to assessment, governance, and risk work. The canonical [program management plan](../domains/delivery/templates/traditional/Traditional/Templates/program_management_plan_template.md#L14-L33) explicitly distinguishes program oversight from constituent project plans and covers governance, integration, communication, benefits, risk, resources, and monitoring. The canonical [program charter](../domains/planning/templates/traditional/Traditional/Templates/program_charter_template.md#L14-L33) covers program outcomes, boundaries, and governance. | Coverage exists, but the role-level entry point does not give a task-led path through all of those artifacts. Populated examples in large templates are illustrative, not evidence that a real program adopted or validated them. A user may need to assemble a working sequence from separate files; this consequence is plausible but unvalidated. | Use existing canonical paths in `templates/templates.json`; retain project plans for project execution. | **Retain.** Improve navigation only where it directly supports a selected outcome; do not rebuild the toolkit. |
| **Portfolio Management** | The [portfolio suite guide](../role-based-toolkits/program-manager/portfolio-management/README.md#L1-L24) links a Kanban, weighted prioritization, benefits view, and governance cadence. The [Kanban](../role-based-toolkits/program-manager/portfolio-management/portfolio-kanban-board.md#L10-L16) defines portfolio flow, and the [prioritization model](../role-based-toolkits/program-manager/portfolio-management/prioritization-model.md#L10-L32) supplies explicit scoring fields and a calculation. These assets address selection and investment balancing across initiatives, rather than coordination inside one program. | The toolkit's benefits dashboard and governance-cadence files are short outlines. However, the existing Kanban and prioritization model provide substantive portfolio structures; a new portfolio suite is not justified by this inventory. Portfolio-level investment ranking must not be conflated with program-level dependency management. | #320/#341 own executive/value reporting; avoid duplicating portfolio financial aggregation or ROI calculations. | **Retain** existing coverage; defer a new portfolio suite. Link program guidance to the portfolio assets without changing their ownership. |
| **Benefits Realization Management** | The program [benefits realization plan](../role-based-toolkits/program-manager/benefits-realization/benefits-realization-plan.md#L10-L20) includes owners, baselines, targets, dependencies, measures, governance, and validation. The maintained [benefits review process](../docs/benefits/benefits-review-process.md#L15-L48) defines decision rights, source evidence, and `NOT MEASURABLE` handling; it also specifies a review cadence and decision/action record at [lines 52–70](../docs/benefits/benefits-review-process.md#L52-L70). The [variance template](../templates/universal/benefits-variance-analysis-template.md#L14-L47) has calculation and integrity rules. A [completed synthetic Day-60 example](../examples/benefits-review/service-centre-day-60-review.md#L1-L36) demonstrates traceability and escalation without claiming production evidence. | The program role's benefits register is only a pointer, but the maintained universal register and review process provide substantive support. Benefits realization is an outcome across related projects and may continue after their delivery; it is not the same as project output completion or portfolio investment ranking. `tests/test_governance_tiers.py` checks governance-asset inventory/link coverage, not benefits calculations or program reporting; the nearby [`web-mvp` stakeholder communication schema](../schemas/web-mvp/stakeholder_communication_plan.schema.json) is not a program-level contract. | Reconcile with #341, whose current disposition asks for traceable inputs and reproducible value calculations. Preserve the accepted benefits evidence; do not repeat or replace it with a new ROI engine. | **Retain and connect.** Defer new benefits calculators/dashboards to #341's separate evidence and owner decisions. |
| **Program Lifecycle Templates** | The [program lifecycle guide](../role-based-toolkits/program-manager/program-lifecycle/README.md#L1-L13) names initiation, planning, execution, monitoring/control, and closure, with links to program and project assets. The canonical program plan also has program lifecycle and closure sections ([contents](../domains/delivery/templates/traditional/Traditional/Templates/program_management_plan_template.md#L53-L72)). | The lifecycle guide is a phase map only: it does not define phase outputs, handoffs, entry/exit decisions, or how program-level outcomes differ from constituent project lifecycle records. A user may not know which maintained asset to produce or review at each stage; this is an inferred usability gap, not reported user evidence. | Reuse canonical program, project-lifecycle, and benefits assets; avoid duplicating project lifecycle templates. | **Revise.** Candidate 2 adds an asset crosswalk and observable phase outputs, not a new lifecycle suite. |
| **Program Communication and Integration** | The [communications index](../role-based-toolkits/program-manager/communications/README.md#L1-L22) names program/project/executive audiences and methodology variants. The [multi-level plan](../role-based-toolkits/program-manager/communications/multi-level-communication-plan.md#L1-L14) lists sections, while the [dependency/risk matrix](../role-based-toolkits/program-manager/risk-management/dependency-risk-matrix.md#L1-L15) lists source/target, criticality, exposure, owner, and status. The [program status framework](../role-based-toolkits/program-manager/communications/program-status-reporting-framework.md#L1-L12) lists health, decisions, dependencies, risks, and milestones. | These are outlines rather than an end-to-end worked workflow: no example shows how a cross-project dependency becomes an escalation, governance decision, owned action, and status update. The likely consequence—different contributors interpreting fields or losing decision traceability—is an assumption. | Coordinate with #371's communication-plan generation and #379's RAID automation so a manual artifact does not silently become an automation contract. No integration with Jira, Smartsheet, Slack, or Teams is included. | **Revise.** This is the recommended first bounded outcome: connect existing artifacts and demonstrate their use in a synthetic scenario. Defer automation. |
| **Methodology-Specific Program Templates** | Traditional program charter and plan are canonical and detailed; the maintained [SAFe PI planning template](../domains/delivery/methodology-frameworks/agile-scrum/scaling-frameworks/safe/safe_program_increment_planning_template.md#L12-L46) covers objectives, dependencies, risk, and integrated planning. The [methodology-variants guide](../role-based-toolkits/program-manager/methodology-variants/README.md#L1-L23) attempts a Traditional / Agile-at-Scale / Hybrid map. | The guide links to eight `templates/...` targets that do not exist at those paths in this checkout (including `project_roadmap_template.md`, `risk_register_template.md`, `pi_planning_template.md`, and the Hybrid examples). The canonical artifacts do exist elsewhere, so this is a discoverability/path problem, not proof the methodologies are unsupported. The guide also mixes project- and program-level examples. | Use `templates/templates.json` and the domain-navigation contract, which treats `canonical_path` as authoritative and legacy paths as aliases. Do not edit generated `TEMPLATE_INDEX.md` or site outputs. | **Revise.** Correct the crosswalk to maintained canonical program assets; do not add more methodology variants until the links and actual gaps are reviewed. |

### Distinctions and evidence quality

- **Project management** plans and controls a constituent project's scope, delivery, and outputs. **Program management** coordinates related projects/components, their shared dependencies and governance, toward outcomes and benefits. **Portfolio management** selects, prioritizes, and balances investments that need not all belong to one program. This distinction is visible in the repository's program plan and portfolio Kanban, and is consistent with the distinction the proposed candidates preserve.
- The gap demonstrated by the repository is content usability and navigation—not a demonstrated failure of users or program outcomes. Issue #47 has no comments or native children. The sole #1566 comment is an automated receipt, not feedback. The local community-feedback search found no program-specific record; a broad issue search timed out, so this is not proof that no user feedback exists elsewhere.
- The historical goals of 100+ program-manager adoption and 90% satisfaction are not acceptance criteria. No user cohort, baseline, sampling method, instrument, or collection owner was found for either. Keep them as unvalidated business aspirations unless a credible measurement method is separately approved.

## Options and priority

| Option | User value / evidence | Dependencies and effort | Recommendation |
|---|---|---|---|
| **Improve existing assets** (fill in every stub) | Several thin outlines are directly observable, but broad completion would address no single user task and evidence of user pain is weak. | Many files and methodology variants; expands scope before selecting a first outcome. | Do not accept as an all-at-once suite. |
| **Connect fragmented assets** (dependency → escalation → decision/action → status) | Best fit to the documented program-manager task of coordinating interdependent projects. Gap is directly visible in outlines; user impact remains an assumption. Reuses existing matrix, status guidance, governance and risk assets. | Small candidate; coordinate terminology and future input needs with #371/#379, without blocking on their automation. | **Recommended first**, subject to owner approval and user-need check. |
| **Create missing assets** (new integration platform, portfolio suite, benefits engine, or capacity assistant) | Lowest evidence of an uncovered #47 outcome; several capabilities already have maintained artifacts. | High or unknown effort; overlaps #320/#341 or #365 children #371/#379/#382 and #318 integration work. | Defer. Preserve these scopes as related work rather than silently deleting them. |

## Bounded delivery-candidate issue drafts

These are draft scopes for owner refinement, not created or approved issues. Effort ranges are rough planning assumptions for artifact work only; they are not confirmed estimates or capacity commitments.

### Candidate 1 — Cross-project dependency decision and escalation brief (**recommended first**)

**User outcome:** As a program manager coordinating related projects, I can turn a material cross-project dependency into a traceable governance decision and owned follow-up, so component status does not obscure a program-level blocker.

**Scope:** Refine the maintained dependency-risk matrix and program status/escalation guidance into one human-operated sequence: source/target component and deliverable; dependency and criticality; impact/date; accountable owner; trigger and escalation; decision needed/authority; decision, action owner, due date, and status-update link. Add one fictional scenario from dependency discovery through review and closure of the action. Link to the existing program risk register and governance decision authority rather than copying them.

**Exclusions:** Software integration, automatic status collection, generated reports, workflow bots, portfolio investment ranking, ROI calculations, and resource optimization. No production or personal data in the example. This does not implement #371 or #379.

**Dependencies / coordination:** Uses the existing dependency matrix, program risk/governance assets, and status framework. Coordinate field names with #371 and #379 if their owners select overlapping input/output contracts; these are not hard blockers for this manual template slice. #320/#341 remain out of scope.

**Observable acceptance criteria:**
1. The updated artifact defines the required fields, roles, escalation trigger, decision authority, action owner/due date, and link back to source component records.
2. The synthetic example traces one dependency from two named fictional component projects through an impact, decision, action, and dated status update; the decision and follow-up are distinguishable from project delivery status.
3. The example includes one non-escalated dependency and one escalated dependency, with explicit rationale for each outcome.
4. All local links resolve; no new application code, schema, external credentials, or generated output is required.

**Validation examples:** Review a blocked deliverable that affects a downstream project milestone and benefits forecast; verify an owner can find the decision required and action. Review a non-critical dependency with a local mitigation; verify it is recorded without unnecessary steering escalation. Run `python3 check_anchor_links_filtered.py` and inspect the focused artifact links.

**Effort range:** Roughly **2–4 person-days**, assuming one contributor can refine the existing matrix/status documents, write one short synthetic example, and validate links; excludes user research, review wait time, automation, and capacity overhead. Not confirmed.

**Unresolved readiness gates:** Confirm the user task with at least one appropriate program-management practitioner or existing evidence; decide whether this should live in the current toolkit paths; name an owner; reconcile proposed fields with #371/#379 once their contracts are selected; obtain an owner-reviewed estimate and backlog disposition.

### Candidate 2 — Canonical program lifecycle and methodology crosswalk

**User outcome:** As a program manager choosing an approach, I can identify the maintained program-level artifact and expected handoff for each lifecycle phase and methodology without following stale or project-only paths.

**Scope:** Update the lifecycle and methodology guide(s) to map initiation, planning, delivery/integration, monitoring, and closure to existing canonical program artifacts; distinguish program records from project records and portfolio decisions; replace invalid links with paths from the catalog; state where Traditional, SAFe/agile-at-scale, and Hybrid choices genuinely differ. Do not create new methodology templates in this slice.

**Exclusions:** New lifecycle framework, a complete template rewrite, changes to template classification or canonical paths, additional portfolio/benefits features, and assertions that one methodology is universally superior.

**Dependencies / coordination:** `templates/templates.json`, `docs/domain-navigation-and-legacy-paths.md`, canonical program charter/plan, SAFe PI planning, and project-lifecycle assets. Any classification or path changes require the applicable catalog/domain validators and maintainer review.

**Observable acceptance criteria:**
1. Every local link in the two guides resolves to a maintained canonical file or clearly identified navigation page.
2. Each lifecycle phase names a program-level output/decision and identifies related project-level evidence without presenting a project plan as a program artifact.
3. Each methodology row points to existing canonical assets; unavailable coverage is marked explicitly rather than linked to a nonexistent file.
4. A synthetic program can be traced through the crosswalk from charter to planning, a delivery checkpoint, benefits review, and transition/closure without editing generated indexes.

**Validation examples:** Run the Markdown anchor/link checker; verify each path against `templates/templates.json` and inspect the referenced canonical file; manually walk the example through all phases and three methodology choices.

**Effort range:** Roughly **1–3 person-days**, assuming limited edits to two guide files and link validation only; excludes authoring new templates or metadata, user research, and review wait time. Not confirmed.

**Unresolved readiness gates:** Confirm whether the owner wants the lifecycle map as a separate outcome or considers it sufficient to defer; decide the minimum methodology set; name an owner; review any needed catalog/path changes; confirm estimate and validation reviewer.

## Recommendation and promotion checklist

Select **Candidate 1** for backlog refinement only if the owner agrees that program-level cross-project decision/escalation is the most valuable uncovered outcome. It is a connected, artifact-level improvement with a small footprint and a clear boundary from automated integration work. Candidate 2 is a lower-priority, separately testable navigation correction. Resource capacity is retained in the capability inventory but not proposed here: #382 owns assistant/optimization scope and the discovery plan explicitly treats integration/resource/value feasibility as a coordinated Sprint 6 investigation.

### Research → backlog-ready

- [ ] Owner accepts, revises, or defers the named candidate and records the disposition.
- [ ] Confirm an unmet user task with evidence; otherwise label the candidate as a hypothesis and decide whether validation is warranted before backlog promotion.
- [ ] Keep scope, exclusions, dependencies, existing asset links, observable acceptance criteria, validation examples, and rough estimate assumptions with the selected child work.
- [ ] Reconcile related #371/#379 contracts and #320/#341 boundaries; do not promote the full #47 epic because one slice is selected.
- [ ] Keep #47 standalone and Later until owner decisions change it; retain unselected capability scope as explicitly deferred or retained.

### Backlog-ready → sprint-ready

- [ ] Name an accountable owner and leaf-sized tasks.
- [ ] Confirm dependencies are resolved or explicitly sequenced; define a review/validation owner and method.
- [ ] Replace the rough range with an owner-reviewed estimate; confirm team capacity and any research allocation.
- [ ] Record the owner's sprint-readiness decision. A merged PR or completed checklist alone is not acceptance.

### Sprint-ready → selected for a sprint

- [ ] Owner selects the specific candidate against a sprint goal and confirmed capacity.
- [ ] Record sprint assignment only after selection; no sprint or milestone is assigned by this discovery.
- [ ] At closeout, link actual accepted evidence and explicitly retain, defer, or retire the remaining #47 capabilities.

## Benchmark and source references

### Program-management guidance and public workflows

- **PMI, *The Standard for Program Management*, Fifth Edition (2024).** [Official standard page](https://www.pmi.org/standards/program-management). Selected as authoritative program-management guidance. Page retrieval was blocked in this environment, so detailed claims from it were not used as verified evidence.
- **GitHub Projects documentation — five workflows from one public system.** The research subagent reported these pages as accessed 2026-10-30; GitHub Docs does not display publication dates on the returned pages. Direct fetch from the main session was DNS-blocked, so these are illustrative workflow references, not independently verified outcome evidence or five independent implementations:
  1. [Parent issues and sub-issue progress](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-parent-issue-and-sub-issue-progress-fields): use explicit hierarchy and roll-up while preserving the distinction between work hierarchy and a genuine program.
  2. [Changing a project view layout](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/changing-the-layout-of-a-view): offer multiple views over shared work rather than duplicate source records.
  3. [Adding items automatically](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically): define inclusion criteria and ownership instead of indiscriminately aggregating a portfolio.
  4. [Built-in project automations](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations): keep event-to-status automation bounded and retain human review for program health, benefits, risk, and escalation.
  5. [Sharing project updates](https://docs.github.com/en/issues/planning-and-tracking-with-projects/sharing-project-updates): use dated updates/history, but do not treat an individual project status as program health.

No product popularity, adoption, or claimed efficiency was used as evidence of quality. These workflows inform possible traceability and reporting patterns only.

### Repository and issue sources

- [#47 — current refinement, capabilities, and roadmap alignment](https://github.com/mirichard/pm-tools-templates/issues/47)
- [#1566 — discovery checkpoints and promotion policy](https://github.com/mirichard/pm-tools-templates/issues/1566)
- [#1371 — merged roadmap mapping proposal](https://github.com/mirichard/pm-tools-templates/pull/1371)
- [#320 — executive/value parent charter](https://github.com/mirichard/pm-tools-templates/issues/320) and [#341 — ROI/value child](https://github.com/mirichard/pm-tools-templates/issues/341)
- [#371 — communication-plan generator](https://github.com/mirichard/pm-tools-templates/issues/371), [#379 — RAID auto-starter](https://github.com/mirichard/pm-tools-templates/issues/379), and [#382 — resource-planning assistant](https://github.com/mirichard/pm-tools-templates/issues/382)
- [Discovery plan and promotion gates](./v2.5-discovery-plan.md#L13-L36)
- [Canonical-path and legacy-path contract](../docs/domain-navigation-and-legacy-paths.md#L1-L24)
- Canonical source registry: [`templates/templates.json`](../templates/templates.json); generated site copies and `TEMPLATE_INDEX.md` are not treated as source assets.

## Research limitations and requested issue comment

External research was partially limited by network/DNS access: PMI and direct web fetches failed; five GitHub Projects workflow pages were reported by a research subagent but could not be fetched again in the main session. No independent user interviews or usage data were available. The only observed evidence for the communication/lifecycle gaps is the maintained repository content itself. No estimate, staffing, user validation, owner approval, sprint, milestone, or release commitment is represented as confirmed.

The available GitHub tool surface did not expose creation of a new issue comment. **Proposed concise comment for #47** (not posted):

> Research results are in draft PR [#1570](https://github.com/mirichard/pm-tools-templates/pull/1570), with discovery tracked under [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566). Recommendation: refine a bounded, manual cross-project dependency-to-decision/escalation brief using existing assets; defer new suite/automation work. Owner decision requested: approve, revise, or defer Candidate 1 and confirm whether this is the first uncovered program-manager outcome. No sprint, milestone, or Done/readiness status is proposed.
