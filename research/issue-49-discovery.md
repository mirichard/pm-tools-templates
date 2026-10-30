# Issue #49 — Product Owner toolkit discovery

**Research snapshot:** repository base revision [`8078fdd24db8e9d274a5922c1db00c051f708663`](https://github.com/mirichard/pm-tools-templates/commit/8078fdd24db8e9d274a5922c1db00c051f708663), 2026-10-30.  
**Issue / decision owner:** [#49](https://github.com/mirichard/pm-tools-templates/issues/49), Michael Richard.  
**Disposition requested:** proceed / revise / defer / stop. This report is discovery evidence, not implementation acceptance or a delivery selection.

## Decision brief

**Recommendation — revise and retain #49 as an O2 / Later, unscheduled candidate; do not create a new template suite now.** The repository already has canonical catalog entries for Product Vision, Backlog Management, User Story, and OKR templates, plus several tracked but uncatalogued Product Owner guides. The approved [Product Vision and candidate assessment](../backlog/product-goal.md) supplies a stronger decision rule than the historical suite-size target: link evidence, identify unknowns, define an evaluation method, and record selection separately. A likely improvement is a small, tested crosswalk from user/research evidence through an ordered backlog item, using existing canonical assets—not another standalone template.

The inventory and a synthetic fixture below expose navigation/maintenance and evidence-to-priority gaps, not validated user demand. No participant research, tool integration, telemetry, user adoption, or satisfaction study was performed. The workflow specification remains proposed and inactive. Historical “15+ templates,” “200+ product owners,” and “90% satisfaction” are unverified goals, not achieved results or acceptance criteria; retain them as historical claims pending Michael’s explicit decision, and defer measurement unless a population, method, owner, and authorized data source are agreed.

Michael should record proceed / revise / defer / stop and select any bounded follow-up. The current Later horizon and lack of a release date remain unchanged; this report does not make #49 backlog-ready or sprint-ready.

## Evidence and capability/gap matrix

Repository links below refer to the snapshot at `8078fdd24db8e9d274a5922c1db00c051f708663`. Catalog status is taken from [`templates/templates.json`](../templates/templates.json) and canonical-path rules in [domain navigation guidance](../docs/domain-navigation-and-legacy-paths.md). Files under `docs/site/dist/` are generated outputs, not additional maintained templates. The legacy Product Owner paths for Product Vision, Backlog Management, User Story, and OKR are navigation pointers; update their cataloged canonical destinations instead.

| Capability | Evidence in the repository | Gap / dependency | Disposition |
|---|---|---|---|
| **Product vision and strategy** | The owner-approved [Product Vision and candidate assessment](../backlog/product-goal.md#apply-the-vision-during-backlog-refinement) (approved 2026-09-28) defines evidence, evaluation, and separate decision records. A cataloged [Product Vision Template](../domains/uncertainty/role-based-toolkits/product-owner/product-vision-template.md) covers users, value, goals, measures, assumptions, and validation. The tracked [`product-strategy-canvas.md`](../role-based-toolkits/product-owner/product-strategy-canvas.md) overlaps those sections but is not a curated-catalog entry. | Decide whether the uncatalogued canvas is a distinct maintained asset, a source to merge/link, or a historical alternative. The template’s illustrative fields do not validate its market, user, or benefit assumptions. | **Retain** approved benchmark and canonical vision template; **revise** links/status for the canvas after owner review; **defer** a new vision/strategy template. |
| **Story and backlog management** | Cataloged [Backlog Management](../domains/uncertainty/role-based-toolkits/product-owner/backlog-management-template.md) and [User Story](../domains/uncertainty/role-based-toolkits/product-owner/user-story-template.md) templates cover value, ordering, criteria, dependencies, and refinement. The [Story Writing Checklist](../role-based-toolkits/product-owner/story-writing-checklist.md) overlaps those checks. The [Backlog Management Process](../docs/processes/backlog-management-process.md) is repository process guidance, not a second user backlog. | Existing artifacts can support the sample task, but there is no validated end-to-end example that carries an observed need and its source into a priority rationale. The backlog template also contains dated sample roadmap rows; do not read them as current commitments. | **Retain** the canonical templates and process; **revise/link** one evidence-to-ordering example and mark examples as illustrative; **defer** duplicate backlog/story templates. |
| **Stakeholder communication** | The tracked [Product Owner collaboration framework](../role-based-toolkits/product-owner/stakeholder-collaboration-framework.md) covers stakeholder mapping, communication, feedback, and conflict. Cross-role assets include the [stakeholder communication plan](../docs/governance/stakeholder-comm-plan.md) and [stakeholder templates](../docs/templates/). | Material is distributed across role, governance, and stakeholder folders. The role README links to four role subdirectories whose READMEs are short inventories, not completed tools. The accountable decision maker and escalation boundary should be visible without duplicating the general stakeholder toolkit. | **Retain** relevant assets; **revise/link** navigation and clarify the Product Owner’s product-priority decision versus facilitation; **defer** another communication framework. |
| **Roadmap and release planning** | The tracked [Product Strategy Canvas](../role-based-toolkits/product-owner/product-strategy-canvas.md) includes themes and quarterly roadmap placeholders; the backlog template has roadmap rows. The current [repository roadmap](../ROADMAP.md) and [alignment register](../backlog/roadmap-alignment.md) distinguish outcome mapping, horizon, selection, and release commitments. | There is no evidence that a new PO-specific release-planning template is needed. #49 and #47/#50 are O2 / Later, with no release date. Keep product outcome/priority decisions distinct from program/portfolio coordination (#47) and release execution, controls, and automation (#50 / #373). | **Retain** current roadmap/decision records; **revise** links and boundary language if selected; **defer** a new release-planning asset and any integration. |
| **User research and feedback** | The tracked [User Research Planning Template](../role-based-toolkits/product-owner/user-research-planning.md), updated 2026-09-19, asks for a decision, unknowns, method, participants, consent/data handling, observations, limitations, and follow-up. The official [GOV.UK discovery guidance](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works) treats discovery as evidence-gathering before decisions; it applies to government digital services, not as a universal PO requirement. | No participant findings or product-user evidence for #49 were gathered. The synthetic example below cannot establish demand. Any future outreach, data collection, or telemetry needs separate authorization. | **Retain** the planning guide; **revise** cross-links to connect findings to backlog decisions; **defer** participant research until separately authorized. |
| **Product metrics and KPIs** | The tracked [Product Metrics Dashboard](../role-based-toolkits/product-owner/product-metrics-dashboard.md) lists usage, satisfaction, business, and delivery measures. The approved [product candidate assessment](../backlog/product-goal.md#evidence-and-comparison-rules) requires a measure, baseline/comparator, acceptance rule, and explicit unknowns; it adopts no numeric scoring model. | Dashboard examples and placeholders are not observed data, validated targets, or an active data pipeline. No denominator, cohort, baseline, survey method, metric owner, or authorized source supports the 200-user / 90% claims. | **Retain** as an optional reference; **revise** any selected metric around an owner-agreed outcome and measurement contract; **defer** collection, telemetry, and numerical targets. |
| **Cross-functional guidance and workflow** | The [Product Owner workflow specification](../docs/product-owner-workflow-spec.md) (prepared 2026-09-28) describes evidence, decisions, dependencies, and a synthetic OCM walkthrough, and explicitly says it is proposed/not activated. The [v2.5 discovery plan](v2.5-discovery-plan.md) assigns #49 an asset inventory and one-task comparison for the Sprint 4 checkpoint (November 29). | No live workflow or tested cross-functional handoff is established. The plan also records the Project 13 automation credential limitation; inability to read that board is not evidence that its queue is empty. | **Retain** the spec as design evidence only; **revise** or defer activation based on owner decision and permissions; do not add integrations, recipients, or permissions here. |

### Source and classification notes

- The curated catalog records four canonical Product Owner role templates: Product Vision, Backlog Management, User Story, and OKR. It separately records User Story Mapping as an adjacent asset. Additional tracked files (strategy canvas, user research plan, prioritization guide, story checklist, collaboration framework, and metrics dashboard) are useful inventory evidence, but are not additional curated-catalog entries; their canonical/maintenance status should not be inferred from their directory alone.
- The legacy `role-based-toolkits/product-owner/{product-vision-template,backlog-management-template,user-story-template,okr-template}.md` files point to cataloged canonical files. Do not count those aliases or generated site copies as distinct templates.
- The role README describes Product Strategy, Backlog Management, Stakeholder Collaboration, and Value Measurement tool areas. Their nested READMEs mostly list tool names; they do not prove that the linked suite contains each promised tool.
- The discovery plan’s November 29 date is a portfolio checkpoint, not a delivery date or permission to change sprint/project status. The plan caps active investigations at two and requires owner disposition before promotion.
- #49 is standalone with no native parent or child issues. #1566 is a linked portfolio checkpoint, not a parent delivery epic. The open related research PRs are [#1570](https://github.com/mirichard/pm-tools-templates/pull/1570) for #47 and [#1571](https://github.com/mirichard/pm-tools-templates/pull/1571) / [#1572](https://github.com/mirichard/pm-tools-templates/pull/1572) for #50. They are concurrent, unaccepted research; this report does not repeat their inventory or resolve their decisions.
- Reuse [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482) as accepted contributor/maintainer walkthrough evidence; do not repeat it. Preserve [#1379](https://github.com/mirichard/pm-tools-templates/issues/1379)’s owner-confirmed source-sufficiency finding at `0dc4f6b071eaffa46a6458c3ac034acadd857f2a`; do not repeat source qualification or imply its separate realism, participant, or study-control gates are complete.

## Synthetic validation fixture — not user research

**Purpose:** Check that existing artifacts can carry a clearly labeled need through research, backlog ordering, and an owner decision without turning missing evidence into a product claim.

| Fixture field | Synthetic entry / expected handling |
|---|---|
| Product / task | A fictional Product Owner is asked to decide whether to add a capability after a hypothetical user request. This is a test fixture only; no real user, request, product usage, or outcome is asserted. |
| Need and evidence | `NEED-1`: `[synthetic need statement]`; `EVIDENCE-1`: `[synthetic observation or source]`; source date, method, population, and limitation are required fields. Mark all as **fixture-only**, not observed. |
| Candidate | `CANDIDATE-1`: `[smallest outcome-oriented backlog item]`; link `NEED-1` and `EVIDENCE-1`; state assumptions, alternatives, dependencies, and an observable acceptance result. |
| Comparison | Apply the owner-approved contribution/evidence/evaluation questions in `backlog/product-goal.md`. If source support, baseline, or comparator is absent, mark it **unknown**; do not enter zero, a RICE score, a user count, or a satisfaction result. |
| Ordering and authority | Record a proposed relative order and rationale as a fixture. Keep the actual priority **unselected** until Michael records a decision. A proposal is not sprint selection, estimate, or release commitment. |
| Expected check | A reviewer can trace every factual assertion to a source or see it labeled synthetic/unknown; scope, dependencies, evaluation, and decision authority remain explicit. A failed trace blocks a backlog-ready claim. |

**Executed evidence:** Static repository inventory and source-link review at the revision above. The existing canonical-path validator was invoked while examining the repository; its baseline output was 148 entries, 0 errors, 0 warnings. This validates catalog paths, not template quality or user outcomes.  
**Not executed:** No participant sessions, user feedback study, integration test, adoption/satisfaction measurement, or live workflow walkthrough.  
**Proposed test and human acceptance:** Use the fixture in any owner-selected documentation refinement, run the applicable link/path checks, and have Michael decide whether the example is accurate and sufficient. No acceptance is claimed here.

## Conditional candidate packages

These are bounded options for later triage, not opened issues, estimates, or sprint assignments. Do not create duplicates or promote without the owner disposition described below.

### Candidate A — Reconcile Product Owner navigation and demonstrate one evidence-to-backlog path

- **User outcome:** A Product Owner can find the canonical asset for each step and see how a sourced need, uncertainty, candidate, priority rationale, and owner decision fit together.
- **Scope:** Reconcile the role README and related links to cataloged canonical files; disposition uncatalogued PO role files; add or adapt one explicitly synthetic/verified example using existing assets; check that it does not duplicate #47/#50.
- **Exclusions:** New template family, production workflow, live integrations, user outreach, telemetry, sprint/release commitment, and changes to Project 11/13.
- **Observable acceptance (if selected):** Every in-scope link resolves to the intended canonical file; aliases are identified as pointers; the example distinguishes repository facts, synthetic fields, assumptions, and unknowns; a reviewer can trace the proposed backlog item to its evidence and separate owner decision; no new template is added unless the owner identifies a distinct uncovered user outcome.
- **Validation:** `node scripts/validate-canonical-paths.js --strict`, `python3 check_anchor_links_filtered.py`, and human review of the worked example against the approved product-candidate assessment. These are proposed tests, not acceptance already achieved.
- **Dependencies / owner gap:** Michael selects the task and decides canonical status for uncatalogued files. A named delivery owner and dependency/capacity decisions are absent.
- **Effort range:** 1–2 person-days, an analyst planning assumption for a small documentation/link/example change; not measured or confirmed.
- **Readiness:** Conditional backlog candidate only after owner selection; not sprint-ready.

### Candidate B — Decide whether to retain and measure the historical adoption/satisfaction hypotheses

- **User outcome:** Any future claim about suite adoption or satisfaction is interpretable and not mistaken for template count or page activity.
- **Scope:** First obtain an owner decision on whether the historical 200-user / 90%-satisfaction hypotheses should be retained, replaced, or retired. If retained, prepare a measurement proposal specifying target population, denominator, sampling/response method, baseline/comparator, period, metric owner, permitted data source, privacy/consent needs, and limits.
- **Exclusions:** Collecting responses, recruiting participants, enabling telemetry, asserting a result, or setting a new target without owner approval.
- **Observable acceptance (if selected):** The decision is recorded; any retained measure has an operational definition and feasible authorized method; unavailable inputs remain explicitly unknown; no measurement begins without separate authorization.
- **Validation:** Owner review of the proposed measurement contract; no result can be validated until a separately authorized study or data source exists.
- **Dependencies / owner gap:** Michael’s disposition, a defined audience, metric owner, and approved collection method/source. None is established by this research.
- **Effort range:** 1–3 person-days to prepare/review a proposal after the owner decision and source constraints are known; excludes data collection and is not confirmed.
- **Readiness:** Defer until Candidate A’s user outcome is selected and the measurement decision is made; not backlog-ready or sprint-ready now.

## Historical targets and scope reconciliation

| Historical claim in #49 | Evidence status | Proposed disposition (owner decision required) |
|---|---|---|
| **15+ Product Owner templates** | **Unverified / definition unclear.** The curated catalog has four Product Owner role templates plus an adjacent story-mapping asset; several other tracked role files are uncatalogued and have overlapping scope. Aliases and generated copies are not additional templates. | Do not claim completion or build to a count. Keep as historical, defer as an acceptance threshold, and replace only if Michael selects a scope-based asset inventory and quality measure. |
| **200+ Product Owners adopted** | **Unverified.** No defined population, adoption source, measurement period, or authorized telemetry/recruitment exists in this research. | Retain only as a historical hypothesis pending owner decision; defer measurement. Do not infer use from downloads, metadata, or issue assignment. |
| **90% user satisfaction** | **Unverified.** No survey instrument, sample, response rate, baseline, or satisfaction data exists here. Outreach is not authorized. | Retain only as a historical hypothesis pending owner decision; do not treat as acceptance or run a survey. |
| **Integration with popular product-management tools** | **Unspecified.** No named products, user need, permission model, or selected integration scope is evidenced. | Defer; a future proposal must identify the use case and authorized tool boundary. Do not implement or request permissions. |
| **Q3–Q4 2025 timeline / “High” priority** | Historical issue text. The newer issue decision is O2 / Later, unscheduled, with no release date. | Treat the old dates and priority as superseded context, not commitments. Keep current horizon and owner authority unchanged. |

## Promotion gates

| State | Minimum evidence required | Current #49 assessment |
|---|---|---|
| **Backlog-ready candidate** | A supported user problem or explicitly authorized research question; maintained-asset/duplicate map; bounded outcome and exclusions; feasible option; observable acceptance and validation; dependencies, effort assumptions, and owner disposition. | This report supplies the inventory and a synthetic fixture, but no validated user problem or selected outcome. Candidate A is conditional; Candidate B is deferred. |
| **Sprint-ready** | Leaf-sized, testable work; named accountable owner; accepted estimate; dependencies resolved or sequenced; validation method and environment; confirmed capacity and sprint selection. | Not met. No estimate, delivery owner, capacity confirmation, or sprint selection is established. |
| **Owner-selected** | Michael records proceed / revise / defer / stop, selected scope, rationale, and next action in the issue/project record. A research PR or assignment does not count. | Decision pending. Preserve O2 / Later; do not change Project stages or issue state. |

## Research method and limitations

- Read #49 and its comments (none), native relationships (standalone; no children), #47/#50, #1566 and its comments, active relevant PRs, repository instructions, the v2.5 plan, and the sources linked above. #1566’s sole comment is an automated receipt, not a substantive decision.
- Compared role-level sources with the curated catalog, canonical-path metadata, approved product-candidate assessment, roadmap/alignment records, and the proposed-but-inactive workflow spec. The inventory is not a user study, quality audit, or statement that every uncatalogued file is obsolete.
- External reference check (2026-10-30): the [November 2020 Scrum Guide](https://scrumguides.org/scrum-guide.html) supports the distinction between Product Owner accountability for value/backlog ordering and team delivery planning. [GOV.UK discovery guidance](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works) is a public-service-specific example of investigating user needs before proceeding, not a universal mandate. Direct page fetch was unavailable in this runtime; links were identified via web search and applicability is intentionally limited.
- No interviews, surveys, user analytics, live Project 13 board read, or live integration check were performed. The planning plan states the automation credential cannot resolve Project 13; this is a coverage limitation, not an empty-queue finding.

## Proposed concise issue comment / record

> **Research complete — [PR #1575](https://github.com/mirichard/pm-tools-templates/pull/1575), report: [`research/issue-49-discovery.md`](https://github.com/mirichard/pm-tools-templates/blob/copilot/mirichard-pm-tools-templates-49/research/issue-49-discovery.md).** Existing canonical assets cover most listed capabilities; the clearest bounded opportunity is to reconcile navigation and demonstrate one evidence-to-prioritized-backlog path using existing assets. No user validation or adoption/satisfaction data was collected. The 15-template, 200-user, and 90% targets remain unverified and are recommended for explicit owner disposition, not acceptance. Michael: please record proceed / revise / defer / stop and any selected scope. Current O2 / Later status and all delivery commitments remain unchanged.

Before merge, the PR description must reference **`Refs #49`**, not `Closes #49` / `Fixes #49`; merging research is not issue acceptance or closure.

## Four-point closeout

- **Recommended next step:** Michael records proceed / revise / defer / stop; if proceeding, select Candidate A before the November 29 research checkpoint.
- **Research completed:** canonical and supporting asset inventory, duplication/status review, task fixture, boundary reconciliation, and target dispositions.
- **Remaining gaps:** actual user evidence, canonical status decision for uncatalogued files, and any authorized measurement method.
- **Owner decision required:** whether to retain the epic and which bounded candidate, if any, to select.
