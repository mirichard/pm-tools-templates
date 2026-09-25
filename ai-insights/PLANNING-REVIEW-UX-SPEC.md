# Planning review: inputs, workflow and acceptance criteria

Date: 09/25/2026. Status: proposed design specification for review; not implemented.
Owner/decision maker: Michael. Implementation reference: `fe14a5fc7761cbe97970ec5a7599ae04526bb448`.

## Purpose and boundaries

Help a project manager prepare evidence from an existing plan, check selected delivery
conditions, decide how to address findings, and reassess. The starting plan may be in
Excel, Microsoft Project (MPP), Smartsheet, or another tool. Its existence does not
establish that effort, qualified capacity, or readiness evidence is assessment-ready.

User-confirmed design basis: prepare → review inputs → assess → act → reassess.
Explain inputs, process and outputs at each stage. User acceptance of the earlier
recovery demonstration remains valid for that behavior; it does not accept this
redesign, establish usability, validate predictions, or authorize production release.

Initial design recommendation: guided manual preparation and entry, with explicit
source references. File upload, MPP parsing, Smartsheet connections and automatic
mapping are not current capabilities and are not assumed in this design. The source
plan remains authoritative; assessment actions do not update it automatically.

The supported assessment is evidence-based capacity, dependency, integration and
skills checks. It does not certify a complete plan, calculate a critical path, level
resources, or establish delivery probability. Program managers must select a bounded
workstream/milestone; program-wide aggregation and resource deduplication are not
implemented. Avoid unqualified labels such as “Plan validated” or “Project safe.”

## Intended workflow

| Step | User's question and work | Interface output / transition |
| --- | --- | --- |
| 1. Prepare | What can this review tell me? What should I gather from my plan and colleagues? | Explain supported checks and limits; show source-based preparation checklist, sample values and missing-information actions; disclose session-only behavior before entry. |
| 2. Define review | Which project, plan version, work scope, period and delivery decision am I reviewing? | Named review with explicit scope, start/end, as-of date and decision; distinguish the review period from total project duration. |
| 3. Prepare evidence | What do these values mean, where do I find them, and who confirms them? | Grouped questions for each check; definitions, units, examples, sources, owners and unknown states; allow incomplete preparation. |
| 4. Review inputs | Are the values consistent and sufficient? | Editable summary; readiness and missing prerequisites for each check; distinguish invalid values from missing evidence. Identify exclusions and defaults. |
| 5. Assess | What did the tool check, how, and what did it find? | Evidence-linked findings with status, calculation/reason, scope, time, limitations and recommended follow-up. List unassessed checks alongside assessed checks. |
| 6. Act | Who should do what about each finding? | Proposed action, accountable owner, due date, source-plan update and required resolution evidence; decisions remain with the PM and relevant authorities. |
| 7. Reassess / report | What changed and what remains unresolved? | Explicit new assessment using updated evidence; capture prior/new review identities and residual findings in a review record; disclose what is and is not retained. |

A user may inspect guidance and prepare incomplete inputs without being forced to
invent values. Invalid supplied values block submission with corrections. Incomplete
valid evidence may proceed to a partial review with named unassessed checks; a run
with no assessable checks provides a preparation summary, never a success judgment.

## Preparation checklist

| Starting information | Preparation task | Person/source to consult |
| --- | --- | --- |
| Task list, dates and milestones | Select included work and time window; identify unfinished tasks; avoid summing both summary rows and their subtasks. | PM; current schedule/version |
| Percent complete | Obtain remaining-effort estimates in person-hours. Do not silently convert task percent complete or elapsed duration into remaining work. If an estimate is derived, document its basis and obtain owner confirmation. | Task owners; maintained remaining-work fields or estimates |
| Resource assignments or forecast | Confirm qualified hours available during this window, accounting for working calendars, leave, other assignments and skill fit. Avoid counting shared resources twice. | Resource managers and workstream leads |
| Task links/dependency register | Confirm prerequisite, recipient milestone, needed date, expected availability and accountable owner. | Dependency/provider owners |
| Technical notes or risks | Identify critical interfaces, current verification evidence and unresolved compatibility/feasibility issues. | Technical/integration owners |
| Staffing/skills matrix | Confirm required skills and whether qualified coverage exists for the selected work. | Delivery/resource leads |
| Supporting documents | Record plan version, references, confirmation date, assumptions and when evidence must be reviewed. | Evidence owners; source records |

For example, qualified capacity may be prepared as the sum of each eligible person's
available work hours in the window after deductions. Document the calculation;
allocate mixed-role hours to avoid overlap. The aggregate comparison cannot prove
that each specialist is available at the precise time their task requires them.

## Input dictionary

Requiredness: **Review** = needed to identify the proposed review; **Check** = needed
to assess the named check; **Conditional** = required for a stated condition;
**Optional** = contextual. Unknown is never encoded as zero, false, or “ready.”
“Current” below describes the reference implementation, not the proposed interface.

### Review identity and evidence applicability

| User-facing input | Meaning / example | Source and preparation | Requiredness and effect | Current mapping / change |
| --- | --- | --- | --- | --- |
| Project or workstream name | Recognizable source-plan identity; “Customer portal” | Copy from source plan. | Review; identifies the result, not a risk predictor. | `name`; present. |
| Review scope / milestone | Included work and exclusions; “Integration testing; excludes training” | Select tasks/milestone and note exclusions. | Review; constrains all evidence. | New structured context; current name/duration do not establish scope. |
| Review period | Start/end of the work window, with timezone where dates include times | Align effort, capacity and prerequisite dates to the same window. | Review; end must not precede start; explicitly confirm alignment. | New fields and contract validation. Current duration is total-project context. |
| Review as-of date | Date the plan status represents | Confirm status date with owners; distinguish from when the tool runs. | Review; dates the input snapshot. | New explicit review context. |
| Decision to support | “Can we commit to the testing milestone?” | State the decision and audience. | Review; guides interpretation; no scoring effect. | New context. |
| Source plan / location | “Release plan.xlsx, Tasks tab”; approved reference or URL | Record enough to find the source, without credentials or unnecessary personal data. | Review; traceability, no automatic access implied. | New review-level provenance; existing evidence references are per check. |
| Current plan version | Version being reviewed; “Release plan v1.3” | Use a recognizable revision/date. A working version need not be an approved baseline. | Check, all checks; required by current evaluator. | `baselineId`; replace unexplained “Current baseline” label. |
| Plan version supported by evidence | Version the supplied estimates/readiness evidence actually describes | Default visibly from selected plan only after confirmation; allow older version to be declared. | Check, all checks; mismatch means not assessed until evidence is revalidated. | `planningAssessment.baselineId`; current duplicate field needs guided confirmation. |
| Evidence last confirmed | When an owner last checked this evidence; not the tool's execution time | Obtain actual confirmation date/time. | Check, all checks; future date rejected. | `planningAssessment.assessedAt`; currently shared across evidence. |
| Evidence review due | When evidence needs confirmation again; not the milestone due date | Choose with owners based on expected change; no arbitrary freshness default. | Check, all checks; later than confirmation; due/expired evidence is not assessed. | `planningAssessment.reviewDue`; currently shared across evidence. |

The current contract has one applicability/freshness envelope for all checks. The
first redesign must state that constraint and use an envelope valid for every
included item. Do not silently give old evidence a new date. Independent per-item
freshness requires a separate schema/evaluator change.

### Capacity inputs

| User-facing input | Meaning / example | Source and preparation | Requiredness and effect | Current mapping / change |
| --- | --- | --- | --- | --- |
| Remaining effort | Unfinished work inside the scope/window, in person-hours; 120 | Sum owner-confirmed remaining effort for included tasks, without summary-row duplication. | Check, capacity; nonnegative finite number; no inferred value from percent complete. | `schedule.remainingEffortHours`; present. |
| Available qualified capacity | Person-hours that can actually serve this work in the same window; 80 | Confirm calendars, allocations, leave, competing work and skill eligibility. | Check, capacity; nonnegative finite number; zero means confirmed no capacity. | `schedule.availableCapacityHours`; present. |
| Capacity basis and assumptions | Included people/roles, allocation method, exclusions and estimate basis | Describe how the two totals were prepared. | Check, capacity; missing assumptions → not assessed. | `schedule.assumptions`; present, needs multiline guidance. |
| Supporting evidence | “Resource forecast v1.3, week 2; confirmed by delivery lead” | Identify estimates and resource confirmation. | Check, capacity; missing reference → not assessed. | `schedule.evidenceReferences`; UI currently shares one reference across unrelated checks. |

Use person-hours because they measure work, not elapsed duration. Do not silently
convert working days into eight-hour days. Any conversion must state the applicable
calendar and hours-per-day assumption.

### Dependencies, integrations and skills

These are repeatable item groups. Each item needs its own owner and evidence.
The proposed UI must not assume the same owner/reference applies to every group.

| User-facing input | Meaning / example | Source and preparation | Requiredness and effect | Current mapping / change |
| --- | --- | --- | --- | --- |
| Prerequisite and affected work | “Test environment ready for integration tests” | Select a delivery prerequisite from schedule/register. | Check, dependencies; identifies what is evaluated. | `schedule.dependencies[].id`; API exists, UI absent; affected-work context needs design. |
| Prerequisite needed by | When the receiving work needs it | Confirm against milestone/task plan. | Check, dependencies; missing → not assessed. | `neededAt`; API only. |
| Expected availability | Current owner-confirmed availability date, not an invented commitment | Obtain provider forecast and uncertainty. | Check, dependencies; later than needed triggers a conflict; unknown → not assessed. | `availableAt`; API only; forecast uncertainty is contextual, not modeled. |
| Critical interface | Interface needed for selected delivery scope; “Billing API” | Identify from architecture/integration plan. | Check, integrations. | `integrations[].id`; UI currently accepts one item. |
| Interface readiness | Verified, blocked, or unknown | Review technical test/feasibility evidence. | Check, integrations; blocked requires issue detail; unknown → not assessed. | `integrations[].status`; present. |
| Documented interface issue | Specific unresolved finding; “Compatibility test failed” | Reference test result/issue record. | Conditional when blocked; missing detail → not assessed. | `integrations[].issue`; present. |
| Required skill | Capability needed for selected work; “Integration testing” | Review task needs with delivery leads. | Check, skills. | `skills[].id`; UI currently accepts one item. |
| Skill coverage | Confirmed coverage, confirmed gap, or unknown | Confirm access to qualified support for the work; do not infer from job title alone. | Check, skills; gap triggers finding; unknown → not assessed. | `skills[].coverage`; present; current rule does not calculate availability by date. |
| Accountable evidence owner | Person or role confirming each prerequisite/interface/skill item | Obtain confirmation from the relevant owner. | Check for each item; missing → not assessed. | Each item's `owner`; current UI shares one value across integration and skill. |
| Supporting reference | Evidence specific to the item; “INT-42 test result” | Provide recognizable document/record/version. | Check for each item; missing → not assessed. | Each item's `evidenceReferences`; needs independent entry. |

An empty list means no evidence was supplied; it does not prove there are no
applicable dependencies/interfaces/skills. “Not applicable” is a proposed distinct
state requiring a rationale and contract work; do not map it to a passing result.

### Existing demonstration inputs to separate from planning checks

| Current input | Current role | Proposed treatment |
| --- | --- | --- |
| Team size | Untrained classifier input; does not establish qualified capacity. | Do not require for evidence-based planning checks; retain only in clearly separated experimental model context. |
| Duration (days) | Untrained classifier input; not a defined assessment window. | Replace its planning purpose with scope/window; do not treat elapsed days as effort. |
| Budget (USD) | Untrained classifier context; no implemented budget-adequacy rule. | Exclude from the planning-preparation checklist until an explained check uses it. |
| Complexity | Low/medium/high classifier input without a PM-facing rubric. | Do not ask for a subjective rating as a prerequisite to these checks. |
| Other API defaults | Includes stakeholders, requirements, features and experience defaults. | Never present them as user-provided facts or evidence. Separate the experimental flow and disclose its defaults. |

The current aggregate endpoint still invokes the untrained classifier and supplies
model defaults. Removing these inputs from the planning journey requires an explicit
API/UI separation; hiding fields alone does not remove that behavior. Do not alter
model tests or release criteria to accommodate a presentation redesign.

## Assessment logic and output contract

Before running, explain: “We compare the evidence you supply using the checks below.
We do not independently verify your plan or predict delivery success.”

| Condition | User-facing finding | Follow-up and limits |
| --- | --- | --- |
| Missing, mismatched or expired applicability evidence | Not assessed; identify affected checks and missing/stale evidence. | Obtain confirmation against the selected plan. Current envelope can invalidate all checks. |
| Effort exceeds capacity | Capacity shortfall; show both totals, difference and calculation. | Verify estimates; consider scope, qualified capacity or date changes. No automatic delay forecast. |
| Effort equals positive capacity | No capacity margin; show equality. | Review contingency/uncertainty; do not report this as spare capacity. |
| Effort below capacity | No aggregate capacity shortfall detected. | Does not establish task sequencing, skill coverage or milestone feasibility. |
| Positive effort with zero capacity | Capacity shortfall; ratio not applicable. | Resolve absent capacity; never show an infinite or misleading numeric ratio. |
| Both effort and capacity zero | Not assessed: no useful capacity ratio. | Confirm scope and estimates; never infer plan approval. |
| Prerequisite available after needed | Dependency timing conflict; display relevant dates. | Resolve with provider/recipient owners or replan affected work. Earlier/equal availability only clears this date comparison. |
| Documented blocked critical interface | Integration issue; cite interface, issue and evidence. | Assign feasibility/remediation work and a verification deadline. |
| Confirmed skill gap | Skills coverage gap; cite required skill and evidence. | Arrange qualified support, pairing or training and confirm readiness before need. |
| Unknown readiness or missing owner/reference | Not assessed; list what's missing. | Create an evidence-gathering action. Unknown does not mean a confirmed defect. |

Every finding needs review identity/scope, input snapshot, evidence, rule/version,
assessment time, status/reason, applicable calculation, limitations and follow-up.
Show coverage explicitly: assessed items and unassessed items, not a single overall
“pass.” A missing API section displays unavailable and is not a successful check.
Untrained predictions and simulated outputs must not compete with actionable
planning findings or appear to validate them.

## Actions, reassessment and review record

For each issue or evidence gap, support this record: finding reference; proposed
response; accountable action owner; due date; approval needed; source-plan change;
resolution evidence; status. Evidence owner and action owner may differ. The PM
chooses the response with responsible stakeholders; the tool offers options.

Example: 120 remaining hours versus 80 available → confirm estimates → agree scope,
capacity or date response → update source plan → confirm revised evidence → reassess.
If capacity becomes 160, the ratio becomes 0.75 and shortfall becomes zero. An
unresolved interface issue and skills gap remain independent findings. Marking an
action “done” does not clear a finding without updated evidence and reassessment.

Proposed initial retention approach: keep session-only behavior, add a user-controlled
print/download review record containing the input snapshot, sources, findings,
actions, exclusions and review/rule identities. Export is not currently implemented;
it needs an explicit implementation item. Do not claim history, autosave or automatic
comparison with a previous session. Users retain prior records externally and update
the source plan themselves. Disclose data loss on navigation before lengthy entry.
Longer-lived drafts/history would change the accepted persistence contract and need
a separate retention/access design.

## Proposed acceptance criteria for the redesign

These criteria supplement the accepted demonstration; they are not already passed.

| ID | Observable acceptance criterion | Verification |
| --- | --- | --- |
| UX-01 | A PM starting from a task/%-complete plan can identify missing evidence, source/owner and preparation action before entry. | Participant walkthrough using a supplied synthetic spreadsheet-style plan; no facilitator explanation of fields. |
| UX-02 | Every input has a plain-language definition, example, source guidance, units where applicable, requiredness and explanation of how it affects a check. | Dictionary-to-interface review plus participant explanation of effort versus capacity and review period. |
| UX-03 | Scope, window, plan version and as-of date appear in the review summary; inconsistent evidence cannot silently be assessed together. | Mixed-window/version fixture; verify correction or explicit not-assessed outcome. |
| UX-04 | Unknown is distinguishable from zero and verified/no issue. Percent complete, headcount and elapsed duration do not silently become effort/capacity. | Missing-input and zero-value cases; participant preparation exercise. |
| UX-05 | Preflight identifies readiness and missing prerequisites per check, preserves valid entries during correction, and labels partial/no-check reviews. | Incomplete and invalid fixtures; keyboard and iPad interaction. |
| UX-06 | Findings show evidence, calculation/reason, limits and next action; no aggregate result implies complete plan validity. | PM explains the 120/80 shortfall and why clearing it does not resolve an interface issue. |
| UX-07 | Dependencies, interfaces and skills support separate items, owners and references without silent reuse or omission. | Two-item fixtures with different owners/statuses; API and rendered verification. |
| UX-08 | PM can record a response, owner, due date and resolution evidence, then identify the source-plan update needed. | Participant action walkthrough; no automatic write-back implied. |
| UX-09 | Explicit reassessment with 120/160 clears only the capacity finding; unresolved issues remain and updated result identity/time are visible. | Controlled reassessment and participant interpretation. |
| UX-10 | A retained review record includes inputs, evidence, findings, exclusions, actions and identity; session-only limits are explained before entry. | Implemented print/download inspection and reopen test; no saved-history claim. |
| UX-11 | Errors, unknown/unavailable states and results are understandable without color alone; labels/help associate with inputs; keyboard focus and status announcements work. | Keyboard, screen-reader and narrow-screen checks; participant review on iPad. |
| UX-12 | Ordinary planning review does not require unexplained experimental-model inputs; experimental/simulated output stays explicitly separate. | Trace submitted inputs to endpoint and displayed output; verify no hidden model defaults presented as evidence. |

## Implementation sequence and handoff

1. Review this specification and resolve the proposed retention/export choice; then
   create a low-fidelity walkthrough of preparation, input review, findings/actions.
2. Validate that walkthrough with a PM using a synthetic plan containing deliberate
   preparation gaps. Record interpretation and task-completion problems before code.
3. Implement scope/provenance fields and a planning-only contract; add repeatable
   evidence groups, preparation/preflight guidance and field-level errors.
4. Implement findings/actions and the agreed review-record mechanism; retain clear
   session boundaries and separate experimental content.
5. Verify UX-01–UX-12, API boundary behavior and regression checks; seek new acceptance
   for changed behavior. Previous UAT evidence stays historical, not erased.

Issue mapping: #1298 implementation; #1373 revised scenarios; #1372 contract/SIT;
#1375 participant usability/acceptance; #1374 predictive-model dependencies;
#1329/#1376 restoration authority. This specification changes no sprint assignment,
issue completion state, model gate, branch protection or release approval.

## Inspected implementation sources

- [Current UAT form](src/dashboard/uat/index.html)
- [Current submission and rendering](src/dashboard/uat/dashboard.js)
- [Shared input schema](src/utils/validation.js)
- [Evidence-based evaluator](src/services/planningAssessment.js)
- [Approved rule contract](RISK-RULES-PROPOSAL.md)
- [Existing SIT/UAT plan](SPRINT1-VALIDATION-PLAN.md)

This is a task-specific design specification grounded in the implementation and
Michael's stated workflow. It is not an external standards-compliance assessment.
