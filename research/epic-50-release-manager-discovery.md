# Epic #50 — Release Manager discovery

**Research date:** 2026-10-30  
**Status:** Discovery recommendation only; no delivery, acceptance, release, or sprint commitment.

## Decision brief

**Recommendation:** Do not build a 12-template suite or automate release decisions in #50. Select one bounded first candidate: connect the existing canonical release-management guidance into a usable release-manager journey, with named role slots, linked readiness evidence, explicit go/no-go ownership, and a routine-versus-emergency distinction. Improve the existing canonical template rather than duplicating its material.

**Evidence:** The maintained [Release Management Workflow Template](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md) already covers planning, quality gates, rollback, communications, monitoring, dependencies, and retrospectives. Separate maintained assets cover release forecasting, CI/CD evidence, UAT, and rollback. The v2.3 and v2.4 closeouts document accepted releases, authorization, verification, and announcements; they do not demonstrate product deployment or rollback. The release-draft workflow updates repository metadata, not deployment execution. Completed #1482 is a contributor/maintainer walkthrough, not release UAT, and remains accepted without repetition.

**Principal uncertainty:** No direct release-manager user research or observed use of these assets establishes which handoff is most painful. Several large templates also contain generic examples and sample thresholds that require local validation.

**Owner decision needed:** Proceed, revise, or defer the first candidate; confirm the intended audience and whether emergency releases are in scope. Before delivery selection, name an owner, resolve dependencies, and confirm capacity. #50 remains an unscheduled research candidate; this recommendation does not close or accept it.

## Evidence inventory and capability dispositions

The canonical sources below are maintained content; example values are not operational defaults. Repository URLs are relative to this report. Issue links identify current ownership boundaries.

| Original capability / proposed disposition | Repository evidence | Usability gap and ownership boundary |
|---|---|---|
| **Release planning and scheduling — retain, connect, revise.** | [Release Management Template: strategy and planning](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#release-strategy-framework); [Agile Release Plan](../domains/delivery/project-lifecycle/02-planning/project-management-plan/agile-release-plan-template.md#iterative-release-cadence); [Hybrid Release Planning](../domains/delivery/templates/hybrid/Hybrid/Templates/hybrid_release_planning_template.md); [release cadence guide](../docs/delivery/release-cadence-guide.md). | The newer guidance separates a release opportunity from authorization and records outcomes, dependencies, and a review date. The older portions of the role template still give sample calendars, roles, and targets; they need local tailoring. The release manager coordinates the plan; the product/service owner chooses scope and outcome. |
| **Deployment and rollback — retain, revise recovery evidence.** | [Release Management Template: deployment, runbook, rollback](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#4-release-execution-stage); [Deployment Checklist](../essential-templates/infrastructure/deployment-checklist-template.md); [Rollback Plan Template](../docs/governance/rollback-plan-template.md). | Existing checklists are broad and do not by themselves establish that a specific artifact, database change, configuration, or external side effect can be safely reversed. Require a tested rollback or approved forward-recovery route and name who may stop, recover, and verify. #50 provides guidance; #373 does not gain authority to deploy or roll back. |
| **Release communications and announcements — retain, connect.** | [Release Management Template: communication matrix and messages](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#release-coordination-and-communication); [communication planning template](../domains/delivery/templates/traditional/Traditional/Templates/communication_plan_template.md); [v2.4 announcement record](../docs/releases/v2.4.0-closeout.md). | The existing role template has pre-release and in-progress messages, but a bounded handoff should also say who communicates a hold, delay, rollback, and completion, to whom, through which channel, and when. A published announcement is not evidence that every subscriber received it. #50 coordinates messages; #373 must not send them merely because a workflow ran. |
| **Quality gates and testing coordination — retain, link evidence.** | [Release Management Template: quality gates and pre-release checks](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#quality-gates-implementation); [UAT plan](../domains/delivery/templates/traditional/Traditional/Templates/uat_plan_template.md); [CI/CD promotion contract](../domains/measurement/methodology-frameworks/emerging-methods/devops/cicd_pipeline_planning_template.md#increment-promotion-contract); [#372 UAT toolkit](https://github.com/mirichard/pm-tools-templates/issues/372). | The role template contains fixed illustrative values (for example test coverage and performance thresholds); these are not universal acceptance criteria. The readiness record should identify the exact candidate and link current test/UAT evidence, its owner, and its status. #372 concerns UAT planning/capture; #50 consumes an authorized UAT disposition and does not implement the UAT generator. |
| **Release risk assessment and mitigation — retain, tailor.** | [Release Management Template: risk register, go/no-go, incident response](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#risk-management-and-contingency-planning); [rollback plan](../docs/governance/rollback-plan-template.md). | Generic sample risk ratings and triggers are not evidence about a particular service. Identify the risk owner, mitigation evidence, residual risk decision-maker, and recovery route. Emergency urgency must not silently waive mandatory controls. |
| **Post-release monitoring and feedback — retain, connect.** | [Release Management Template: monitoring and success metrics](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#5-post-release-stage); [Monitoring and Alerting Template](../domains/measurement/methodology-frameworks/emerging-methods/devops/monitoring_alerting_template.md); [continuous delivery loop](../docs/delivery/continuous-delivery-pipeline.md). | The assets distinguish service health, user feedback, and realized outcomes, but example thresholds and monitoring windows require service-owner approval. Name the on-call/service owner, signals and freshness, observation window, response thresholds, and who may promote, hold, or recover. Neither #50 nor a successful CI run proves outcomes. |
| **Cross-team coordination and dependencies — retain, connect.** | [Release Management Template: coordination board and handoffs](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#cross-team-coordination); [Hybrid Release Planning: dependency map](../domains/delivery/templates/hybrid/Hybrid/Templates/hybrid_release_planning_template.md#dependency-management-framework); [CI/CD promotion contract](../domains/measurement/methodology-frameworks/emerging-methods/devops/cicd_pipeline_planning_template.md#increment-promotion-contract). | Static boards and handoff lists need real dependency owners, due/ready evidence, impact, and escalation. The release manager tracks the interface; each supplying team owns its readiness commitment. |
| **Retrospectives and lessons learned — retain, revise the handoff.** | [Release Management Template: release retrospective](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#release-retrospectives); [Hybrid Release Planning: retrospective](../domains/delivery/templates/hybrid/Hybrid/Templates/hybrid_release_planning_template.md#release-retrospective); [continuous delivery loop](../docs/delivery/continuous-delivery-pipeline.md). | There is no need for another generic retrospective template. Tie observations to evidence, action owners/dates, and the next review; distinguish release learning from project closure and measured business outcomes. |

### Source-of-truth and non-acceptance notes

- **Canonical role template:** `domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md` (metadata says updated 2026-09-19). `templates/templates.json` catalogs this path. Its newer increment worksheet (lines 31–75) says decisions require candidate/evidence/authority and that related #373 remains separate automation.
- **Navigation, generated, or noncanonical material:** `methodology-frameworks/emerging-methods/devops/release_management_template.md` and `domains/measurement/domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md` are navigation-only pointers. `templates/hybrid/Hybrid/Templates/hybrid_release_planning_template.md` and `project-docs/hybrid_release_plan.md` are moved-path pointers. `docs/templates/release_management_template.md` is a 708-byte catalog card, not the template body. `docs/site/dist/downloads/release_management_template.md` is a generated 27,883-byte export and differs from the 35,193-byte canonical source; do not use it as the edit target. The [Release Train Engineer toolkit](../role-based-toolkits/release-train-engineer/README.md) is maintained but explicitly SAFe/ART-specific; it is not a general Release Manager role toolkit.
- **Staging/drafts and examples:** `staging/enhanced-templates/03-release-planning-template.md` and `05-testing-and-release-checklist.md` are staged generic drafts (review metadata says 2025-08-19); related sanitized text and workbook files are not maintained canonical assets. `Hybrid/Release_Validation_2025-08-08.md` is a historical site/CI validation record with owner review pending, not evidence that a software product release passed role-based acceptance. The broad role template has examples, but no current, completed, maintained release-manager scenario was identified in the searched source set.
- **Existing repository workflows:** [Update Release Draft](../.github/workflows/update-release-draft.yml) invokes [release_management.py](../scripts/release_management.py) to validate version metadata and reconcile a draft; it does not publish releases or deploy applications. The tests in [test_release_management.py](../tests/test_release_management.py) verify versioning, preflight, idempotency, collision handling, and read-back—not operational release readiness. [Build and Deploy Advanced Template Browser](../.github/workflows/build-deploy-site.yml) builds and deploys the documentation site to GitHub Pages on `main`; this is not a product-release workflow. The template-selector [production workflow](../PM%20Tools%20Templates%20-%20Q3%202025%20Delivery%20Cycle/Implementation/template-selector/.github/workflows/ci-production.yml) and [staging workflow](../PM%20Tools%20Templates%20-%20Q3%202025%20Delivery%20Cycle/Implementation/template-selector/.github/workflows/ci-staging.yml) contain commented-out example deployment, health-check, rollback, and notification commands followed by success-message `echo`s. They are workflow scaffolds, not evidence of executable or validated product deployment/recovery. No production application deployment or product rollback was established by this inspection.

## Release-manager journey and decision ownership

Role names below are **accountability slots to identify for a real service**, not claims that this repository assigns those roles. The release manager coordinates and records; the authorized product, service, change, or incident authority makes the decision unless policy explicitly delegates it.

| Stage | Accountable roles to name | Inputs and decision | Output and handoff |
|---|---|---|---|
| **Plan** | Product/service owner; release manager; delivery lead | Outcome, bounded scope, release type/window or ready trigger, acceptance, capacity, support, risks, and dependencies. Product/service owner selects scope; the calendar alone is not authorization. | Versioned plan and forecast with assumptions, owners, exclusions, and review point. |
| **Coordinate dependencies** | Dependency owners; release manager as coordinator | Required team/vendor changes, compatibility, readiness evidence, due times, and impact of delay. Owners confirm their dependency; release manager escalates unresolved or changed dependencies. | Named dependency status and escalation/hold decision; update affected teams and the plan. |
| **Assemble readiness evidence** | Test/QA lead; product/UAT owner; security/control owner; operations/on-call; release manager compiles | Same immutable artifact/source/configuration; build, test, security, acceptance/UAT, monitoring, support coverage, dependency status, risk, and tested rollback/forward recovery. | Linked evidence with owner, timestamp/freshness, result, and exceptions; missing or stale evidence remains missing, not “pass.” |
| **Go/no-go** | Authorized release/change authority; incident commander for an incident; release manager records | Applicable mandatory controls, readiness results, residual risk, support, communications, and recovery. The authority records GO, HOLD/NO-GO, or approved exception and its scope/rationale. | Decision-maker, decision/time, exact candidate/scope, evidence links, conditions, and next review. |
| **Deploy or recover** | Authorized deployment operator; service/on-call owner; release authority | Approved runbook, access, environment, state/configuration compatibility, observation criteria, and stop/recovery triggers. Operator executes; the named authority decides hold/promotion/recovery. | Actual version and timestamps, checks/results, incident/rollback or forward-recovery record, and verified service state. |
| **Communicate** | Release/comms owner; release manager coordinates; incident lead for emergency messages | Audience, impact, schedule, status, decision, channel, and next update; distinguish planned notice from hold/delay/rollback/completion. | Approved, time-stamped messages and links; receipt/delivery is not claimed unless measured. |
| **Monitor** | On-call/service owner; release authority; support/user-feedback owner | Approved baseline/control, per-stage signals, sample/freshness and observation window, guardrails, user feedback, and support issues. The authority promotes, holds, or recovers on evidence. | Monitoring and feedback record, actual exposure, decision and escalation; service health is separate from adoption/value. |
| **Review** | Product/service owner; benefits owner; release manager facilitates; action owners | Service health, acceptance, user/support feedback, release issues, outcome measures, and unresolved risk. | Retrospective and owned actions with due dates; feed the next increment or investment decision. |

### Routine and emergency release distinction

- **Routine:** use the planned window/cadence, full applicable evidence and approvals, confirmed cross-team dependencies, support coverage, pre-release communications, staged observation if appropriate, and post-release review. A missed window or elapsed timer does not turn an unready candidate into a GO.
- **Emergency/hotfix:** start from the incident/change authority and immediate impact; define the narrowest safe candidate and risk-based essential checks, record who approved any exception and why, preserve mandatory safety/security/regulatory controls, identify the tested recovery or forward-fix route, communicate status/impact, and complete post-change validation and review. “Minimal testing” is not a blanket waiver. Current release guidance already says urgency changes coordination, not accountable decisions or mandatory controls ([cadence guide](../docs/delivery/release-cadence-guide.md#exceptions-and-review), [release template](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#release-strategy-framework)).

## Ranked gaps and options

Ratings are comparative discovery judgments, not user-research findings. **Evidence strength** means support in inspected repository artifacts; none of these ratings substitutes for release-manager interviews or usability observation.

| Rank / gap | User value | Operational risk | Evidence strength | Dependencies | Working effort |
|---|---|---|---|---|---|
| **1. One decision path across existing assets** | High: reduces the work of finding the right plan, evidence, approver, and handoff. | High: missing/stale evidence or unclear authority can create an unsafe GO. | Strong for asset fragmentation and the existence of source guidance; medium for actual user friction. | Low for a manual guide; optionally use existing UAT records. #372 and #373 are not prerequisites. | 2–3 person-days, assuming one editor, one review, no new software. |
| **2. Evidence that rollback/recovery is feasible for this change** | High for stateful or high-impact releases. | High: binary rollback may not undo data/configuration/external effects. | Medium-high: existing guidance identifies these concerns, but no production rollback exercise was found. | Service/operator, data owner, and local change policy; not automation. | 2–4 person-days, assuming guidance-only change and one representative review. |
| **3. A distinct emergency path** | Conditional: valuable where the audience handles urgent production changes. | High if “fast track” is read as permission to bypass required checks. | Medium: the role template includes hotfix language while the cadence guide supplies stronger constraints; no incident scenario validation was found. | Owner confirms emergency scope and responsible incident/change authority; mandatory controls remain local. | 2–4 person-days, assuming a short addendum in the existing canonical template. |

**Options compared:** Improving existing assets is preferable to a new parallel checklist; connecting the current canonical template to the release plan, CI/CD, UAT, communication, rollback, and monitoring sources is the smallest coherent first slice. A narrowly improved recovery section may follow. Creating an entirely new template suite is not supported by evidence; only consider a separate emergency addendum if an owner validates that need.

## Draft delivery candidates — not filed or committed

Estimates are rough planning ranges, not historical estimates, commitments, or capacity confirmation. Candidate owner, dependencies, and sequencing must be set by the owner before backlog promotion.

### Candidate 1 — Connect the release-manager journey to existing evidence (recommended first)

**User outcome:** As a release manager, I can assemble the right evidence, coordinate handoffs, and record a justified hold/go decision without searching for or duplicating the repository’s release guidance.

**Scope:** Revise the front of the canonical Release Management Template with a concise plan → dependencies → readiness → go/no-go → deploy/recover → communicate → monitor → review map. For each stage identify role/decision slots, required inputs, output/evidence, and next handoff; link to existing canonical planning, CI/CD, UAT, rollback, communication, monitoring, and retrospective assets. Distinguish routine and emergency paths. Reuse existing templates rather than creating a second checklist.

**Exclusions:** Workflow generation or evaluation, CI/CD integrations, deployment/publishing, automatic approvals or notices, new release policy or universal thresholds, repeated #1482 validation, and claims that #50 or #373 is delivered.

**Observable acceptance criteria:**
1. The maintained canonical template presents the eight-stage journey and links each handoff to a maintained source; legacy pointers/generated exports are not edited as sources.
2. Each stage names an accountable role slot and distinguishes the release manager’s coordination from the approving/executing authority.
3. Missing/stale evidence produces HOLD/NO-GO; an authorized decision records candidate, scope, authority, time, rationale, and links.
4. Routine and emergency guidance differentiates coordination and essential checks without implying a blanket waiver of mandatory controls.
5. Two fictional walkthroughs below can be completed using the revised source; both end with a decision, communications, monitoring, and review record.

**Validation examples:** Run the successful staged release and the blocked readiness scenario in “Proposed validation”; check all new links/anchors and canonical paths. These are proposed documentation walkthroughs, not observed release outcomes.

**Dependencies/readiness gates:** Existing manual UAT and CI/CD evidence can be linked; #372 is optional unless generated UAT evidence is explicitly required. #373 owns automation and is not a prerequisite. Owner confirms audience, emergency scope, approval-role language, accountable delivery owner, dependency sequencing, and capacity.

**Effort range:** 2–3 person-days for one editor and one reviewer, assuming one existing canonical file, no user research, no automation, and one focused validation pass.

### Candidate 2 — Make recovery decisions specific to state and compatibility

**User outcome:** As a release authority or operator, I can tell before GO whether the proposed rollback is actually safe and what verified recovery route to use if it is not.

**Scope:** Clarify recovery evidence in the existing [rollback plan](../docs/governance/rollback-plan-template.md) and its link from the canonical release template: version/configuration/data compatibility, backup/restore or forward recovery, tested verification, recovery owner, and decision authority. Replace non-tailored sample thresholds with fields for locally approved criteria.

**Exclusions:** Implementing or running rollback commands, production testing, changing deployment workflows, setting universal RTO/RPO or service thresholds, and automating a rollback decision.

**Observable acceptance criteria:** The source template distinguishes binary rollback from data/configuration recovery; captures objective trigger and evidence, named decision/execution/verification roles, and communication; and explicitly results in HOLD when no acceptable tested route exists. A fictional incompatible-schema change must not be approved solely because the previous application binary exists.

**Validation examples:** Tabletop one compatible rollback and one irreversible/schema-changing migration; verify expected decisions and all cross-links.

**Dependencies/readiness gates:** Service/data owner and operator validate recovery vocabulary; owner chooses whether scope belongs in #50 or existing rollback guidance. Any actual recovery test requires an authorized nonproduction environment and is outside this research task.

**Effort range:** 2–4 person-days for guidance and review only; assumes no environment-specific runbook implementation.

### Candidate 3 — Add a bounded emergency-release decision path (conditional)

**User outcome:** As an incident/change authority coordinating a hotfix, I can move quickly without ambiguity about mandatory controls, decision ownership, communication, or post-change review.

**Scope:** Add an emergency subsection to the existing canonical release template with entry condition, narrow scope, authority/exception record, essential checks, dependency/support checks, tested recovery or forward fix, communication timing, post-change validation, and retrospective. Keep it separate from routine cadence.

**Exclusions:** Establishing this organization’s incident policy, defining legal/regulatory exceptions, bypassing required controls, deploying automatically, or building a separate large template.

**Observable acceptance criteria:** A fictional incident scenario identifies the incident/change authority and operator; records the emergency rationale, exact candidate and retained mandatory controls; distinguishes an approved exception from a missing result; reaches HOLD if the only recovery option is untested/unacceptable; and requires post-change checks and review.

**Validation examples:** Walk through a time-critical hotfix with a failed optional check and a missing mandatory security check; the first follows approved exception policy, the second is not silently treated as GO. No exception is presumed authorized by this draft.

**Dependencies/readiness gates:** Owner confirms emergencies are in #50’s audience and identifies who may approve exceptions; local incident/change policy must be linked before the wording can be considered ready. #373 may later automate a workflow but cannot create that authority.

**Effort range:** 2–4 person-days for a bounded content addition and review, assuming the relevant policy exists and no policy design is required.

## Proposed validation — fictional scenarios only

These are **proposed tests**, not historical evidence. No deployment, release, announcement, or rollback was performed for this discovery.

| Scenario | Fixture and decisions to exercise | Expected artifact result |
|---|---|---|
| **Fictional successful routine release: “Northstar 4.2”** | Product owner sets bounded scope and window; dependency owners confirm compatibility; one immutable candidate has passing build/security/test and authorized UAT evidence; on-call/support are staffed; a tested recovery route and approved cohort guardrails are linked. The authorized release authority records GO. Operator stages exposure; service owner compares the agreed signals and sample to thresholds; authority records promotion; release manager coordinates planned and completion messages; service/product owners record follow-up and review. | A reader can trace each handoff and decision to a named role slot and source record; only authorized GO permits execution/promotion; health, feedback, and business outcome are distinct. |
| **Fictional blocked routine release: “Northstar 4.3”** | CI is green, but monitoring data is stale and a database migration changes state without a tested rollback or approved forward-recovery plan. A scheduled window arrives. | The candidate is HOLD/NO-GO despite green CI and schedule. The record names missing evidence/owners, does not claim rollback feasibility, updates stakeholders, and defines what must be verified before reconsideration. |
| **Optional emergency variant: “Northstar 4.3.1”** | A production incident requires a narrow hotfix. Incident authority approves only the checks local policy permits to be tailored; one required security control is missing. | The missing mandatory control is not bypassed by “emergency” status. The template records who must resolve/escalate it, the safe hold or approved alternative, communication, and required post-change review. |

### Existing evidence (separate from proposed tests)

- [v2.3.0/vNext closeout](../docs/vnext/release-closeout.md) records accepted scope, linked issue/PR evidence, publication and announcement, tests, and explicit limits. One initially pending visual regression check later passed. The history also notes that a numeric tag alias workflow failed before changing the published release/draft; the error was not captured, and a later authorized one-time recovery was used. This is repository metadata recovery, not a production rollback exercise.
- [v2.4.0 closeout](../docs/releases/v2.4.0-closeout.md) records an explicit owner authorization to release ahead of the former target, a published tag/commit, the acceptance/decision record, 19 sub-app CI jobs and aggregate gate passing, security/workflow checks, release announcement #1552, and 12 local release-management tests. Subscriber notification delivery is not independently verified. These records concern the repository’s template release, not a demonstration of the role template’s product deployment procedure.
- [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482) is closed completed and its accepted contributor/maintainer walkthrough is preserved. It validates a contributor-submission journey after relevant unit tests and before formal UAT, using synthetic data; it is not formal release UAT or a release go/no-go, and this work does not repeat it.
- The current workflow and tests show version/draft controls and documentation-site deployment only; they do not establish an integrated product deployment, approval, monitoring, or recovery system.

## Promotion checklist and target disposition

### Promotion checklist

- **Backlog-ready:** Attach this inventory and user/problem evidence; select a bounded outcome and exclusions; compare reuse/improve/create options; write observable acceptance and validation; identify dependencies/risks; provide an assumption-based effort range; record owner proceed/revise/defer/stop. The evidence supports Candidate 1 for owner review, not automatic promotion.
- **Sprint-ready:** Decompose the selected candidate into leaf work; name an accountable owner; resolve or sequence dependencies; confirm test method and fixtures; estimate with the delivery team; obtain an explicit readiness decision. Confirm emergency scope and authority if Candidate 3 is chosen.
- **Selected for a sprint:** Additionally identify a sprint goal and confirm capacity after research and other work are allocated. A backlog-ready issue, merged report, or completed #1482 walkthrough does not itself select work.

These gates follow [discovery tracker #1566](https://github.com/mirichard/pm-tools-templates/issues/1566) and [research/v2.5-discovery-plan.md](./v2.5-discovery-plan.md). The epic remains unscheduled; no owner, sprint, milestone, or capacity is assigned here.

### Historical proposal metrics

| Historical proposal | Disposition | Measurement / evidence needed if retained as a separate business target |
|---|---|---|
| **“Complete suite of 12+ Release Manager templates”** | **Retire as an acceptance metric; revise to an evidence-based asset gap review.** Eight capabilities are already present in canonical guidance and adjacent sources. Do not count pointers, generated exports, or staging drafts as distinct maintained assets. | If the owner retains a catalog-completeness goal, first define canonical, independently useful asset criteria and count only catalogued maintained sources. A count alone does not establish usability or value. |
| **“Integration with CI/CD and deployment tools”** | **Defer from #50’s first delivery; keep as a boundary/dependency for #373.** #50 may link to CI/CD evidence but does not execute or connect a deployment. | Any later integration needs a named tool/workflow, permissions model, safe failure behavior, and owner-approved acceptance. No integration is claimed here. |
| **“Adoption by 150+ release managers”** | **Retain only as an unvalidated business aspiration; not an acceptance criterion.** No baseline, user denominator, usage telemetry, or privacy-approved measurement exists in the inspected evidence. | Define “active release manager,” unique-user counting, observation window, baseline, opt-in/consent and privacy safeguards; use a privacy-approved survey or aggregated use evidence. No telemetry activation is authorized by #1566 or this task. |
| **“25% reduction in release-related issues”** | **Retain only as a hypothesis; not an acceptance criterion or achieved result.** The inspected release records do not establish a comparable incident baseline or causal effect. | Define release-attributed issue taxonomy/severity, denominator (for example, rate per 100 releases), comparable pre/post windows, exposure and confounders, data owner, and analysis method. Report association unless the design supports causal attribution. |

## Sources and research limitations

### Repository and issue sources

- [Issue #50](https://github.com/mirichard/pm-tools-templates/issues/50), current roadmap/refinement disposition (09/24/2026); [#373 automation epic](https://github.com/mirichard/pm-tools-templates/issues/373); [#372 UAT toolkit](https://github.com/mirichard/pm-tools-templates/issues/372); [#1566 discovery tracker](https://github.com/mirichard/pm-tools-templates/issues/1566).
- [Release Management Template](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md), metadata updated 2026-09-19; [v2.3.0 closeout](../docs/vnext/release-closeout.md), reconciled 2026-09-24; [v2.4.0 closeout](../docs/releases/v2.4.0-closeout.md), published 2026-10-30; [release versioning](../docs/release-versioning.md), verified 2026-10-30.
- [Release cadence guide](../docs/delivery/release-cadence-guide.md), [continuous delivery guide](../docs/delivery/continuous-delivery-pipeline.md), [CI/CD planning template](../domains/measurement/methodology-frameworks/emerging-methods/devops/cicd_pipeline_planning_template.md), [deployment checklist](../essential-templates/infrastructure/deployment-checklist-template.md), and [rollback plan](../docs/governance/rollback-plan-template.md).

### External guidance and public workflows

Checked 2026-10-30. Page publication/update dates are stated only where the source exposes them; otherwise the access date is given rather than an inferred publication date.

**Authoritative guidance**

1. Google SRE Workbook, [“Canarying Releases”](https://sre.google/workbook/canarying-releases/). The repository’s canonical release template links it and says it was reviewed 2026-09-20 ([source lines 52–65](../domains/measurement/methodology-frameworks/emerging-methods/devops/release_management_template.md#canary-and-staged-rollout-decisions)). The page’s own publication/update date was not visible, and direct retrieval was unavailable in this sandbox; use it as a cited reference, not as independently verified evidence for this report.
2. Microsoft Azure Well-Architected, [“Safe deployment practices”](https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/safe-deployments), checked 2026-10-30; no publication/update date visible in the retrieved material. Its staged deployment and health-check guidance is relevant to limiting exposure and pausing on unhealthy results. It is platform/architecture guidance, not a universal release checklist or proof that a particular rollback is safe.
3. NIST, [SP 800-218, Secure Software Development Framework v1.1](https://csrc.nist.gov/pubs/sp/800/218/final), published 2022-02-03. It informs security evidence and vulnerability response, but does not specify a particular project’s approval chain, rollback test, communications, or post-deployment acceptance.

**Public implementations/tool workflows**

1. GitHub Actions, [managing deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) and [deployment protection rules](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments), checked 2026-10-30; no page update date visible. The docs describe required reviewers, wait timers, branch/tag policies, and optional protection rules. Applicability depends on plan/configuration; a workflow approval is not proof that the linked readiness evidence is complete.
2. GitHub Actions, [deploying to Amazon ECS](https://docs.github.com/en/actions/how-tos/deploy/deploy-to-third-party-platforms/amazon-elastic-container-service), checked 2026-10-30; no page update date visible. The example uses a commit-identified image, task-definition update, and service-stability wait, with an optional production environment. It demonstrates a technical deployment workflow, not business acceptance, rollback feasibility across data/configuration, or stakeholder communication.
3. Kubernetes, [Deployments: rolling updates and rollback](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), checked 2026-10-30; no page update date visible. Its rollout status and revision rollback illustrate platform-level execution and verification. Rollback restores the Deployment’s Pod template; it does not establish recovery for databases, configuration, or external side effects, and it does not supply release approval or communication.

**Limitations:** Some vendor documentation domains could not be fetched directly from this sandbox because of network/DNS restrictions; the GitHub documentation page was retrieved, and the other linked primary sources are identified with their dates/limitations above. The repository’s own release records and templates were inspected locally. No release-manager interviews, usability study, independent user adoption data, deployed-system walkthrough, or production rollback exercise was conducted. Historical dates, estimates, checkmarks, and success claims in #50 are not treated as present-day readiness or proof of delivery.

## Proposed #50 results comment (not posted)

The available GitHub tools in this session were read-only for issue comments, and the browser was signed out. If posting is unavailable, the exact proposed comment is:

> Discovery results: [PR #1571](https://github.com/mirichard/pm-tools-templates/pull/1571) adds the [#50 discovery report](https://github.com/mirichard/pm-tools-templates/blob/copilot/release-manager-role-template-suite/research/epic-50-release-manager-discovery.md), linked to the #1566 research track. Recommendation: proceed, revise, or defer Candidate 1—connect the existing canonical release guidance and evidence into one accountable journey; do not create a 12-template suite or treat #373 automation as delivered. Owner decision needed: confirm the audience and emergency-release scope, then name the delivery owner, resolve dependencies, and confirm capacity before backlog/sprint promotion. #1482 remains accepted and is not repeated. No release, deployment, workflow change, or acceptance was performed; #50 remains open.

**PR handling note:** PR #1571 is a draft. Its current auto-generated body includes `Fixes #50`, which would close the epic if merged. Replace that text with `Refs #50 and #1566 — research only; does not close or accept #50` before any merge. The available tools did not expose a PR-description edit operation; do not merge until the auto-close wording is corrected.
