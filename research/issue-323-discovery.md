# #323 advanced template discovery: epic coverage and decisions

Research snapshot: **October 30, 2026**. Refs mirichard/pm-tools-templates#323.  
Accountable owner: **Michael Richard (@mirichard)**; Copilot prepares research only.  
Repository source inspection: [`e4221bff84fd0725f95456f368ef469e928380f8`](https://github.com/mirichard/pm-tools-templates/tree/e4221bff84fd0725f95456f368ef469e928380f8).  
Disposition: **retain the epic open; reuse selected search work; defer unselected discovery capabilities pending owner decisions and evidence.**

## Decision brief

Do not implement or promote the historical epic as a single delivery. The current catalog and selector already provide deterministic title/description and metadata filtering, domain navigation, favorites, and a template-detail preview route. These are maintained capabilities, not proof of full-document search, comparative selection, user benefit, or accessibility conformance. The separate Express preview demo and generated site output are not interchangeable with the maintained Pages source.

The October 30 owner direction selects only #104 for Sprint 4 refinement/delivery planning; #1559 and #1560 already define its corpus/acceptance and implementation packages. Reuse the open #104 and #69 research reports (#1583 and #1579); do not duplicate their issue-specific investigation. Keep #69, wizard/personalization, comparison, and AI recommendations unselected. Prefer deterministic discovery improvements before considering AI, whose 85% historical accuracy target has no agreed corpus, reference judgments, or validated result.

The issue’s satisfaction, time-reduction, wizard-completion, and WCAG targets remain claims requiring explicit measurement and disposition, not achieved results. Issue comments supplied for this review are automated general-feedback forwards, not observed user outcomes. Owner decision is required on which residual user outcome to retain, how to disposition every historical target, and whether/when to select a bounded follow-up. No capacity, release, telemetry, study, or implementation approval is inferred.

## Capability, evidence, and gap matrix

Source links in this table pin code to the repository inspection revision above. The two issue-specific research reports have their own exact open-PR revisions.

| Capability / evidence | Maintained source and current evidence | Gap, dependency, and disposition |
|---|---|---|
| Portfolio and selected scope | [Controlling plan](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/research/v2.5-discovery-plan.md#L21-L34); [#323](https://github.com/mirichard/pm-tools-templates/issues/323); native relationship reads show #69 and #104 under #323. #104 is selected for Sprint 4 planning; #69 and residual capabilities are not. | **Retain** epic-level traceability and open status. **Defer** parent-level delivery. Dependencies: owner scope/acceptance disposition, named owner, available capacity, sequencing. The #1556 release target remains readiness-dependent; publication is separately authorized. |
| Metadata and deterministic CLI selector | [`templates/templates.json`](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/templates/templates.json#L1-L5) declares a generated catalog of 148 entries; 148 records have titles, descriptions, methodology, complexity, and tags; 5 include `canonical_path` and 137 include `alternate_paths`. [`template-selector.mjs`](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/scripts/template-selector.mjs#L35-L57) searches title/path and filters methodology, complexity, and tags; copy mode prefers `canonical_path` ([lines 133–161](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/scripts/template-selector.mjs#L133-L161)). | **Retain** curated metadata and canonical-path rules as deterministic inputs. **Revise** metadata freshness/coverage validation before treating facets or recommendations as reliable: the catalog’s `generated` timestamp is 2025-08-05 while entries have later `updated` values. Dependency: verify regeneration/freshness and field definitions. The CLI is not full-document search or an AI recommender. |
| Maintained Pages browser and search | [`TemplateBrowser.tsx`](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/site/src/components/TemplateBrowser.tsx#L35-L53) filters supplied cards by title/description, methodology, and favorites; its search placeholder also says tags, but the predicate does not search tags ([lines 82–124](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/site/src/components/TemplateBrowser.tsx#L82-L124)). [`templates.ts`](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/site/src/data/templates.ts#L1-L5) supplies cards from the catalog. [`docs/site/package.json`](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/site/package.json#L5-L10) builds the Astro site; tracked `docs/site/dist` is generated output, not the maintained component source. | **Retain** deterministic catalog browse/search and favorites. **Revise** claims to match actual fields; do not count catalog matching as #104 full-document search. Dependency: #1559 corpus and fixture decisions; #1560 implementation remains gated. |
| Navigation and selector variants | [Six maintained domain entry points](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/domain-navigation-and-legacy-paths.md#L7-L24) and [template-selector guidance](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/getting-started/template-selector.md). `templates/index.html` is a distinct static browser. The separate [Express demo](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/site/src/app.js#L47-L93) groups allowlisted Markdown paths in native `<details>` sections; it is not the Pages navigation contract. | **Retain** canonical domain routes and compatible legacy links. **Revise** #69 only after the owner chooses the supported surface and state behavior; reuse [#69 research PR #1579, head `51ad3ee0c812427414975819351e613636b6060f`](https://github.com/mirichard/pm-tools-templates/blob/51ad3ee0c812427414975819351e613636b6060f/research/issue-69-discovery.md). **Defer** new wizard/progressive-disclosure behavior absent an approved user task and evidence. |
| Preview and comparison | The Pages [template detail route](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/site/src/pages/templates/%5Bid%5D.astro#L6-L15) loads a template and [`TemplateViewer`](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/site/src/components/TemplateViewer.tsx#L46-L95) displays Markdown source and a version-history tab; Office formats are represented by download/quick-start content, not live previews ([lines 97–175](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/site/src/components/TemplateViewer.tsx#L97-L175)). A [methodology comparison guide](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/methodology-guides/methodology-comparison.md) exists. | **Retain** detail/Markdown preview and methodology guidance. **Defer** template comparison matrix, case studies, and cross-format live preview until a user decision task, comparison criteria, and source coverage are approved. Do not equate related-template similarity metadata with validated comparison or ranking. |
| Accessibility | [`docs/accessibility.md`](https://github.com/mirichard/pm-tools-templates/blob/e4221bff84fd0725f95456f368ef469e928380f8/docs/accessibility.md#L1-L71) is an author checklist and cites WCAG 2.1. Some source controls have labels/semantic HTML; other inspected controls (for example the Preview/Version History buttons and a clickable favorite span) have no demonstrated keyboard/assistive-technology test evidence. This is source inspection only. | **Retain** accessibility as a cross-cutting acceptance requirement. **Revise** “WCAG 2.1 AA compliant” to an explicit standard/version, surfaces, manual/automated test plan, assistive-technology/browser matrix, and human acceptance record. No conformance claim is made. Official W3C reference fetches were blocked by DNS on 2026-10-30; the repository’s cited [WCAG quick reference](https://www.w3.org/WAI/WCAG21/quickref/) and [WAI-ARIA disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) are references, not independently checked evidence in this research. |
| AI, personalization, and outcomes | Historical epic text lists AI recommendations, role/industry suggestions, wizard completion, satisfaction, time-to-selection, and 85% AI accuracy. No inspected maintained asset establishes those outcomes or an evaluated recommendation model. #1379’s owner-accepted PUB-ALMMSN-01 source-sufficiency finding ([accepted at revision `0dc4f6b071eaffa46a6458c3ac034acadd857f2a`](https://github.com/mirichard/pm-tools-templates/issues/1379)) is separate evidence and does not authorize AI use for discovery. | **Defer** AI and personalization until deterministic metadata/search is adequate and an owner approves a bounded evaluation with an independently judged reference set, error trade-offs, and privacy boundary. **Retain unresolved** historical targets pending explicit measurement/disposition; no telemetry or participant outreach is authorized. |
| Related accepted evidence and research coordination | [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482) records the completed contributor/maintainer walkthrough; its owner confirms it is not to be repeated. [#104 research PR #1583, head `243c9b7505c191c43aa186fcd26188f54b333acd`](https://github.com/mirichard/pm-tools-templates/blob/243c9b7505c191c43aa186fcd26188f54b333acd/research/issue-104-discovery.md) defines search-specific gaps; the related [#69 report](https://github.com/mirichard/pm-tools-templates/pull/1579) does not duplicate that investigation. [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566) retains the two-investigation WIP limit and unconfirmed research/delivery capacity. | **Retain** accepted #1482 and #1379 findings without repeating their evidence work. **Reuse** issue-specific reports/tasks; do not create another #104 implementation item. Missing independent human evidence and owner decisions remain missing. |

### Historical outcome claims and evidence needed

None of these values is a validated result. Preserve each until the owner records retain/revise/defer and an appropriate measurement method:

| Historical claim | Minimum evidence before reporting an outcome |
|---|---|
| 90% discovery satisfaction | Defined task/population, instrument and scale, sample/response denominator, measurement window, and raw summarized responses with privacy controls. |
| 70% faster time to template | Comparable baseline and post-change tasks, start/stop rules, eligibility/sample, timing method, and distribution (not only a single average). |
| 85% recommendation accuracy | Fixed representative query/context set, independent human reference judgments, metric/error definition, disagreement handling, and a held-out evaluation; no model training or use is authorized here. |
| 95% wizard completion | Defined eligible start and completion events, exclusions, denominator, scenario, and measurement window. |
| WCAG 2.1 AA | Explicit supported surface/version, criterion-by-criterion evaluation, assistive technology/browser coverage, automated plus manual checks, defects/dispositions, and qualified human acceptance. |
| Historical search/navigation relevance or efficiency targets | Versioned corpus and task/query set, relevance rubric and independent judgments, timing baseline, sample/window, and reproducible procedure. #104’s existing report owns the search-specific target dispositions. |

Issue comments provided with this assignment are repeated automated S3 “general” feedback-routing notices from #355. They do not identify a discovery task, study sample, observed behavior, or validated outcome; do not use them as user research.

## Proposed validation fixture — synthetic, not executed

**Scenario:** A hypothetical user wants to find a benefits review template. The existing catalog record for **Benefits Review Template** has a description about evidence-based lifecycle/post-closure reviews and a canonical candidate path `templates/universal/benefits-review-template.md` (`path`; no `canonical_path` field).

**Proposed deterministic checks for #104 refinement:**

1. Query `benefits review` returns that catalog record and its canonical destination.
2. A separately chosen query whose matching phrase occurs only in a supported document body is used to distinguish full-document search from current title/description filtering.
3. A no-match query yields an understandable empty state; keyboard-only navigation reaches the result and opens the destination.
4. Record corpus revision, included/excluded paths, query, expected result(s), ranking rationale, snippet, environment, response-time observation, and reviewer identity/role. Human reviewers judge relevance; synthetic fixtures do not establish user satisfaction, speed improvement, AI accuracy, or WCAG conformance.

**Executed evidence:** inspected `templates/templates.json` and source predicates at repository revision `e4221bff84fd0725f95456f368ef469e928380f8`; the cited record exists. No browser, assistive-technology, performance, participant, or outcome test was run for this report. #1559 owns the search corpus and fixture definition; any human acceptance remains pending.

## Conditional readiness and reuse package

No new delivery issues are proposed: #104 already has #1559 (definition, provisional **2–3 focused person-days**) and #1560 (implementation/validation, provisional **6–9 focused person-days**). Those estimates are not validated velocity or confirmed capacity; count them once. For #69, reuse the conditional packages in [PR #1579](https://github.com/mirichard/pm-tools-templates/pull/1579), rather than duplicating its research:

### #69 P1 — choose and define one navigation contract

- **Outcome:** mobile users can identify a category route without needing to search every file.
- **Scope/exclusions:** choose one supported surface, the existing six domain labels, visible search/direct links, and expansion/state behavior; no implementation, study, or search change.
- **Observable acceptance:** owner selects the surface and records category labels, state/persistence, keyboard/focus behavior, and supported viewport/assistive-technology fixtures; every chosen destination maps to a canonical route.
- **Validation:** compare the current entry points and synthetic task traces, then owner review; no participant result is implied.
- **Dependencies/owner gaps:** Michael selects surface/contract; test environment and reviewer access are unconfirmed.
- **Effort:** 1–2 focused person-days from #69 report assumptions; re-estimate if more than one surface or content reclassification is needed.

### #69 P2 — conditional single-surface validation slice

- **Outcome:** mobile users can navigate chosen categories and understand expanded state.
- **Scope/exclusions:** only after P1 and separate delivery authorization; one surface, six groups, existing metadata. No telemetry, personalization, AI, or participant outreach.
- **Observable acceptance:** viewport/keyboard/state-reset fixtures pass; labels and expanded state are perceivable; navigation reaches the expected canonical destinations; defects and untested assistive-technology coverage are recorded.
- **Validation:** reproducible functional fixtures plus separately authorized human/assistive-technology evaluation; synthetic checks are not user-completion evidence.
- **Dependencies/owner gaps:** surface and state contract, implementation owner, test environments, and capacity remain unconfirmed. Reuse #1559 only where search work overlaps; do not double-count shared work.
- **Effort:** 3–6 focused person-days, an analyst assumption in #69 research for one Pages surface; re-estimate if assumptions fail. Study execution is not included.

Wizard, template-comparison, personalization, and AI packages are **deferred**, not silently removed: no distinct validated user outcome or owner-selected scope presently justifies another issue. Historical target disposition remains a prerequisite to execution or closeout.

## Promotion gates

- **Backlog-ready:** evidence links and source revisions; defined user problem and outcome; existing capability/gap inventory; bounded scope/exclusions; observable acceptance and validation; dependencies/risks; estimate with assumptions; explicit historical-target dispositions; owner review. A research PR alone is not promotion.
- **Sprint-ready:** backlog-ready plus a leaf-sized delivery item, named accountable owner, acceptance fixtures and validation method, dependencies resolved or sequenced, re-estimate, and confirmed capacity. No task is sprint-ready merely because #104 is selected for planning.
- **Owner-selected:** Michael explicitly records the chosen slice, scope/acceptance disposition, priority/horizon, and any delivery/release authorization. No automatic status or project-stage change follows from this report.

## Proposed owner comment (not posted)

> #323 research is linked in PR #1587. Recommendation: keep the epic open; reuse #1559/#1560 for selected #104 search refinement, and keep #69 and the remaining wizard/comparison/personalization/AI scope unselected. Please decide which residual user outcome, if any, to retain and disposition the historical satisfaction, timing, wizard, AI-accuracy, and accessibility targets. No implementation, telemetry, study, capacity, or release approval is implied.

## Four-point close

- **Recommended next step:** owner reviews #1587 and decides whether to refine #69 after #104’s definition work.
- **Research completed:** maintained capability inventory, source-revision citations, cross-issue reconciliation, synthetic fixture, and promotion gates.
- **Remaining gaps:** outcome baselines, human relevance judgments, accessibility evaluation, navigation surface/state choice, capacity, and explicit historical-target dispositions.
- **Owner decision required:** select/defer residual scope and record target dispositions; no decision or acceptance is inferred here.
