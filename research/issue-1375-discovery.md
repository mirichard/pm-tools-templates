# Issue #1375 — conditional AI recovery UAT readiness

**Research checkpoint:** October 30, 2026
**Disposition:** Preparation only; legacy UAT remains paused under #1329. No UAT execution, outreach, restoration, sprint assignment, acceptance, or closure is authorized.
**Accountable owner and parent acceptance authority:** Michael Richard.

## Decision brief

Keep #1375 paused. Preserve Michael’s September 25 acceptance of the explicitly bounded demonstration behavior—planning checks, input validation, failure recovery, session-only results, and simulation/unavailable labels—as historical participant evidence. It excludes model accuracy and production release; it does not close #1375, satisfy required SIT, or accept a later planning-review flow.

The approved legacy U1–U6 plan and recorded observations are useful for reuse, but the tested revisions are historical. The missing-Quality fixture was participant-confirmed without an independent new-checkout capture. Later browser/container checks on `d16564b` and `919f2de` are engineering evidence, not renewed participant acceptance. The latest recorded local full suite remains 138 passing / 6 failing on 144 tests; no failures are waived. The corresponding container/browser Actions run passed, but does not establish a green full suite or current runnable candidate.

Do not repeat accepted scenarios absent a relevant behavior change. Resume only if Michael selects a retained legacy flow, reconciles applicable #1372 SIT evidence and #1373 scenarios, confirms a versioned accessible candidate and willing participant(s), and records the decision rules. Follow #1379 separately for sponsor-approval value research; require #1374 only if predictive claims are retained. The immediate owner decision is retain, revise, or continue to defer the legacy flow—not whether historical observations occurred.

## Capability, evidence, and gap matrix

| Capability / evidence | Source, revision, and what it establishes | Gap / dependency | Disposition |
|---|---|---|---|
| Bounded legacy demonstration UAT | [Michael’s scoped acceptance](https://github.com/mirichard/pm-tools-templates/issues/1375#issuecomment-5836291026) records participant/acceptance-owner “ACCEPTED” on 2026-09-25 for planning checks, input validation, failure recovery, session-only results, and clear simulation/unavailable labels. Initial observed build: `81ee6cc1ff0c56ce2dd016583967090dd8126117`, Chrome on iPad via Codespaces, Node 24.14.0. | Explicitly excludes model accuracy and production release. The record says this scoped acceptance does not satisfy #1372, close #1375, or waive #1329/#1376. | **Retain** as historical, scope-limited participant evidence. Do not repeat accepted cases without a behavior change. |
| Legacy U1–U6 scenarios and observations | Maintained [`SPRINT1-VALIDATION-PLAN.md`](../ai-insights/SPRINT1-VALIDATION-PLAN.md) records the U1–U6 plan and synthetic fixtures. Comments record baseline/shortfall/capacity/input observations; U4 offline failure and retry ([5836069753](https://github.com/mirichard/pm-tools-templates/issues/1375#issuecomment-5836069753), [5836130101](https://github.com/mirichard/pm-tools-templates/issues/1375#issuecomment-5836130101)); U5 close/reopen ([5836158877](https://github.com/mirichard/pm-tools-templates/issues/1375#issuecomment-5836158877)); and U6 missing Quality ([5836280831](https://github.com/mirichard/pm-tools-templates/issues/1375#issuecomment-5836280831)). The missing-section candidate was `fe14a5fc7761cbe97970ec5a7599ae04526bb448`; automation evidence is in [comment 5836236217](https://github.com/mirichard/pm-tools-templates/issues/1375#issuecomment-5836236217) and [Actions run 36163976155](https://github.com/mirichard/pm-tools-templates/actions/runs/36163976155). | U4 screenshot evidence was supplied in the conversation, not attached to the issue. U5 and U6 include participant confirmation but no new screenshot; U6 specifically records no independent new-checkout capture. The run tested its pinned historical candidate, not today’s checkout. | **Retain** existing observations and exact limits. Do not represent participant confirmation as independent capture or rerun simply to refresh expired artifacts. |
| UAT plan and scenario ownership (#1373) | Owner’s plan record says legacy scenarios and ownership were approved on 2026-09-25; the current plan distinguishes the legacy U1–U6 lane from sponsor-approval research. The October 30 conditional scenario analysis is in draft [PR #1593](https://github.com/mirichard/pm-tools-templates/pull/1593), commit `d431ee2c9505e9da9f261a1fb655baa903f8eab7` (not merged). | No willing participant, access, or availability is confirmed for a future or changed flow. The approved legacy plan is not acceptance of the changed planning-review UX or #1379 research. | **Retain** the approved legacy plan; **revise only** if Michael selects a different retained flow or an applicable behavior changes. |
| Required SIT (#1372) | [`RUNTIME-SIT-EVIDENCE.md`](../ai-insights/RUNTIME-SIT-EVIDENCE.md) and [`OUTPUT-CONTRACT.md`](../ai-insights/OUTPUT-CONTRACT.md) define historical contracts and bounded transport/browser checks. Current conditional SIT report is draft [PR #1592](https://github.com/mirichard/pm-tools-templates/pull/1592), commit `8a567d1fb7f5f18ba9c29198eaf5a53c7f7b9ce0` (not merged). | #1372 remains open. Its applicable cases must be reconciled to an owner-selected runtime and pass before this task can claim its required SIT prerequisite. Historical contract tests or container checks do not establish that result. | **Retain** prior engineering evidence; **defer** UAT execution until applicable SIT readiness is recorded. |
| Changed guided/source-neutral planning flow | Historical candidate `d16564bd644a2669bd3a7c8fb20d8f9d73bb8d29` has browser/container evidence in run [36168904959](https://github.com/mirichard/pm-tools-templates/actions/runs/36168904959). Source-neutral candidate `919f2de327cb81a4c28f84b5ab6f010a3cf618f6` has run [36172363589](https://github.com/mirichard/pm-tools-templates/actions/runs/36172363589). The owner said the first redesign was not sufficiently user-centered and later paused further UI work pending #1379. Parent #1329 says PRs #1377/#1378 closed without merging; their preserved revisions are not a current release candidate. | Neither automation run is participant usability evidence for the changed flow. The current base `8078fdd24db8e9d274a5922c1db00c051f708663` lacks a complete runnable app manifest/API runtime; no current candidate or participant access is established. | **Defer** fresh UX/UAT. Do not treat either commit or browser automation as current user acceptance. |
| Sponsor-approval value/scope (#1379) | The current research direction is whether AI-assisted plan review helps a PM reach a defensible decision with adequate coverage and less total effort; the first use case is sponsor-approval readiness. The v1.1 protocol and packet are preserved on the separate research branch at `f23605d320c0972c51cb58f04aa7dd1cd552d54c`. Owner-accepted source sufficiency is retained; see [#1379 decision](https://github.com/mirichard/pm-tools-templates/issues/1379#issuecomment-5901958597). | Accepted source sufficiency is preparation evidence, not product value. Independent realism/requirements/burden review, reference judgments/adjudication, willing comparison participants, frozen controls, success criteria, and owner authorization remain outstanding. | **Retain and link** #1379; do not duplicate it or substitute legacy UAT for the value study. No UAT lane is selected by this report. |
| Historical accuracy, efficiency, and adoption targets | Parent [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329) says historical accuracy, efficiency, adoption, and deployment figures are not verified results or accepted thresholds. #1379’s protocol proposes measuring total preparation/review/verification/disposition effort and coverage, but no comparative study has run. | No efficiency or adoption benefit is established by the demonstration. No numeric target is approved here. Accuracy/calibration remains separate under #1374 if prediction is retained. | **Retain as unverified historical claims**; Michael must explicitly retain, revise, or retire each applicable target and name its measurement before any new acceptance claim. Do not silently drop them. |
| Predictive claims (#1374) | Current conditional evaluation research is draft [PR #1594](https://github.com/mirichard/pm-tools-templates/pull/1594), commit `f32d41ec86f6dccb313c3b07a16ecca45cc38db2`. The maintained [`MODEL-VALIDATION-READINESS.md`](../ai-insights/MODEL-VALIDATION-READINESS.md) records an untrained/unvalidated model and missing target, representative labeled data, evaluator, and approved gates. | No predictive capability or claim is selected. If prediction remains in scope, predictive evaluation is a separate dependency; otherwise #1374 is not a blanket prerequisite to #1379. | **Defer** predictive acceptance; preserve its criteria and do not claim accuracy or calibration. |
| Completed walkthrough (#1482) and portfolio guardrails (#1566) | [#1482](https://github.com/mirichard/pm-tools-templates/issues/1482) is closed with owner-confirmed walkthrough criteria; [`research/v2.5-discovery-plan.md`](v2.5-discovery-plan.md) says it is complete and not repeated, preserves #1379 source sufficiency, and keeps #1329 paused. Current portfolio synthesis is draft [PR #1597](https://github.com/mirichard/pm-tools-templates/pull/1597). | Portfolio research/delivery person-day scenarios are not estimates or commitments for this issue; no sprint/capacity change is authorized. | **Retain** #1482 acceptance and portfolio constraints; no repeat walkthrough or sprint promotion. |

### Evidence and runtime boundary

The current checkout is the documentation/recovery snapshot at base `8078fdd`; it is not the historical recovery candidate used for the reported participant sessions. `ai-insights/` in this checkout has no complete runnable application manifest/API runtime. The preserved runs are dated engineering evidence: Actions runs 36163976155, 36168904959, and 36172363589 completed successfully for their container/browser/scan jobs; they do not prove current SIT, a green full suite, or participant acceptance of a changed flow. The owner’s records gave October 25, 2026 as the expiry date for earlier artifacts; the Actions API currently lists no artifacts for any of the three cited runs. Compact evidence committed for run 36168904959 remains in `ai-insights/evidence/container-36168904959/`.

The latest recorded local full-suite result is 138 passed / 6 failed / 144 total for `919f2de`; failures concern the untrained model’s classification, confidence, and consistency assertions. Earlier records include 123/8 on the bounded-demo candidate and 137/5 on the guided redesign candidate. These are revision-specific local suite results—not a claim that the corresponding successful Container Image Scan runs ran the full suite. No failed GitHub Actions run was found for the cited scan runs.

## Conditional readiness checklist

Status labels: **recorded** means supported by the cited record; **missing** means no confirming evidence was found; **conditional** means it applies only after the owner selects the flow.

| Gate before any future UAT | Current status | Required evidence / owner |
|---|---|---|
| Owner-selected user flow and bounded claim | **Missing for future work**; the prior bounded demo is accepted, but legacy reuse is paused and #1379 is separate | Michael records retain/revise/defer for the legacy flow, or selects a new capability with its own acceptance scope. |
| Reviewed scenario version and pass/blocking rules | **Recorded for historical legacy U1–U6; conditional for any new flow** | Reuse the approved plan only for the retained legacy behavior. Michael reviews changes; blocking conditions are agreed before execution. |
| Versioned recovery build and isolated environment | **Missing for a new run** | Pin exact commit, runtime/dependencies, startup command, host/port, environment configuration, and test-fixture version. Do not run the old app from the current checkout or use production data. |
| Applicable #1372 SIT cases pass on selected candidate | **Missing / unresolved** | Reconcile the required case IDs to the selected scope and record actual results against the same candidate SHA. #1372 remains open. |
| Participant availability and test access | **Missing for future work** | Confirm willing participant(s), device/browser, isolated host access, and date only after owner authorizes resumption. Prior participation does not imply future availability. Do not contact participants under this assignment. |
| Acceptance owner and decision authority | **Recorded for the old demonstration** | Michael remains accountable and accepted that bounded scope. Record a separate decision for any changed behavior; do not infer acceptance from automation. |
| Safe fixtures and evidence handling | **Recorded as synthetic-only plan; new run unexecuted** | Use only the approved synthetic fixtures. Keep credentials, personal data, and original project files out of issue evidence. |
| Predictive evaluation | **Conditional / deferred** | Link #1374 only if the selected scope includes predictive claims; require its separately approved evidence before accepting those claims. |
| Parent and restoration gates | **Open** | #1329 remains the parent acceptance authority; #1376 retains final restoration. This readiness report waives neither. |

### Evidence-capture pack

For each scenario that is actually authorized and executed, capture a separate record containing:

1. Issue/scenario ID and scenario-plan revision; scope of the user claim being checked.
2. Exact candidate commit, clean-checkout reference, dependency lockfile, runtime/browser/device, environment name, host/port, startup command, and UTC start/end times.
3. Synthetic fixture ID and version; expected observable behavior agreed before execution.
4. Exact user action and actual observation. Preserve the full failure message and whether prior output remained visible; identify unavailable, simulated, or unvalidated content as observed.
5. Evidence reference (redacted screenshot/log/report), evidence hash where available, and any limitation (for example, confirmation without a new screenshot). Never place credentials or original project data in the record.
6. Status exactly one of **pass**, **fail**, **blocked**, or **not run**; linked defect/retest record; executor; participant’s own words/decision recorded by the owner; and final acceptance-owner decision.

The historical observations may be linked as prior evidence, but must not be copied into a new run record as if they were freshly executed. “Plan approved,” “automation passed,” and “container gate passed” are not participant outcomes.

## Proposed validation fixture — synthetic, not executed here

This is a blank-shape illustration for safe evidence capture, not a UAT result or a new acceptance record.

| Field | Proposed value / status |
|---|---|
| Case | `U4` — service/network failure followed by recovery; legacy lane only if Michael retains it |
| Fixture | Existing synthetic F1 from `SPRINT1-VALIDATION-PLAN.md`; no real project data |
| Candidate SHA / environment | **Unset — must be pinned before execution** |
| Expected observation | A failed request is explicit; stale output is not presented as fresh; after service/network recovery, a new request can succeed and is distinguishable from prior output |
| Actual observation | **NOT RUN for this report** |
| Evidence / defect | **Unset** |
| Status | **NOT RUN — no pass/fail inferred** |
| Human decision | **None requested or simulated** |

The historical U4 evidence on `81ee6cc` is separately recorded in comments 5836069753 and 5836130101 and was within the accepted demonstration. This proposed row must not be used to repeat that accepted behavior absent a material change.

## Defect and retest workflow (conditional)

1. Freeze the failing observation in the evidence record: exact SHA/environment, scenario revision, synthetic fixture, steps, expected/actual, complete error, and evidence reference. Mark it **fail** or **blocked**, never pass by omission.
2. Link the evidence to the existing accountable repair task or create one only after owner-approved scope requires it. State severity and whether it blocks a required scenario; do not broaden #1375 into implementation or restore the app.
3. After an authorized fix, record the fix commit and rerun the failed scenario plus directly affected regression cases against that exact commit. Preserve original and retest results; do not overwrite history.
4. A retest passes only when the agreed observable behavior is met and evidence is attached/referenced. A changed scope, fixture, or user-facing behavior requires an updated scenario and may require new participant review.
5. Leave any required scenario unresolved if it fails, is blocked, or was not run. Obtain Michael’s explicit decision after the evidence and defect disposition are reviewed. Only the acceptance owner can accept the scoped user outcome; automation cannot provide that decision.

## Conditional readiness / reuse package

No new delivery issue is proposed. Reuse #1372 (SIT), #1373 (scenarios), #1374 (predictive evaluation if applicable), #1375 (UAT), #1376 (restoration), #1329 (parent decision), and #1379 (value/scope) rather than duplicating tasks.

- **User outcome:** If a legacy flow is retained, a participant can complete only its supported synthetic scenarios and correctly interpret failure, unavailable, simulated, and session-only behavior. If sponsor-approval review is selected, a PM can verify a source-grounded recommendation against criteria; its value is assessed only under #1379.
- **Scope:** Readiness preparation, evidence reuse, and conditional scenario execution only after all entry gates are satisfied.
- **Exclusions:** Product selection by Copilot; implementation, runtime restoration, training, live integrations, new permissions, telemetry, original/sensitive-file intake, outreach, study execution, sponsor authorization, release, gate waivers, or changed sprint/milestone commitments.
- **Observable acceptance if resumed:** Michael records the selected lane and scenario revision; applicable #1372 cases pass on the pinned candidate; the willing participant and test access are confirmed; each executed scenario has an evidence record with actual outcomes and defects; blocking defects are retested; and Michael records the scoped decision. Missing prerequisites remain blocked, not accepted.
- **Validation method:** Review the pinned evidence pack and source revisions first; then, only after owner authorization, execute approved scenarios in the isolated environment and link actual results. Keep participant UAT, engineering/browser checks, predictive evaluation, and restoration as distinct evidence.
- **Owners/dependencies:** Michael is accountable. Future participant/operator availability and access are unconfirmed. Independent #1379 reference reviewers/adjudicator and comparison participants are unassigned; do not conflate those roles with legacy UAT. #1372/#1329 apply to legacy restoration; #1374 applies only to predictive claims.
- **Effort:** **Not estimable.** No defensible execution range exists until the lane, scenario count, candidate, participant/access arrangements, and expected defect work are known. Any numeric range now would be an unsupported commitment; the portfolio ranges in #1566 are not an estimate for #1375.

## Promotion criteria

| Gate | Required evidence | Current disposition |
|---|---|---|
| Backlog-ready | Selected user outcome; bounded scope/exclusions; linked historical evidence; explicit prerequisites, risks, and acceptance method; owner disposition. Reuse existing issues rather than creating duplicate work. | **Not newly promoted.** Historical scoped acceptance is retained; future flow selection remains with Michael. |
| Sprint-ready | Leaf-sized selected work; named execution/acceptance roles; confirmed participant/access; versioned candidate and fixtures; required SIT/scenario dependencies passed or explicitly sequenced; estimate and confirmed capacity. | **Not ready.** Candidate, future participant/access, applicable SIT reconciliation, estimate, and capacity are missing. |
| Owner-selected | Michael explicitly records proceed/revise/defer/stop for the relevant legacy or new research lane. This is separate from backlog readiness, sprint selection, execution, acceptance, or restoration. | **Decision required.** No owner choice is inferred from this report or an agent assignment. |

## Proposed concise comment for #1375

> Research readiness report added in PR #1595 (`Refs #1375`). Recommendation: keep legacy UAT paused; preserve the September 25 acceptance only for its expressly bounded demonstration scope. The historical U1–U6 evidence and its limitations, SIT/value dependencies, readiness checklist, evidence-capture fields, synthetic not-run fixture, and defect/retest workflow are documented. The changed planning-review flow has engineering/browser evidence only, not renewed participant acceptance. No UAT, outreach, restoration, or acceptance claim was made. Remaining gates: owner selection of a retained flow, applicable #1372 SIT reconciliation, and confirmed candidate/participant/access. Michael’s retain/revise/defer decision is required.

The available GitHub tools do not expose creation of a new issue comment. The exact proposed comment is therefore included here for the owner; no existing comment was edited or replied to.

## Validation and final four points

- **Executed for this report:** Repository instructions and maintained plan/contract/evidence documents inspected; native issue relationships and open PRs reviewed; historical acceptance and Actions records reconciled. The cited Actions scan/browser jobs succeeded on their pinned commits; they did not run the complete local suite.
- **Not executed:** UAT, participant outreach, runtime/app tests, a fresh build, model evaluation, restoration, or human acceptance.
- **Documentation validation:** `python3 check_anchor_links_filtered.py` completed across 1,385 Markdown files; no report-specific broken-link finding was reported. It printed advisory heading-anchor suggestions, including for this report. A local path check passed; the checker's generated summary was reverted. No production files or tests are changed.

1. **Recommended next step:** Michael records whether to retain or continue deferring the legacy user flow; do not resume UAT before that choice and applicable #1372 readiness.
2. **Research completed:** Historical bounded acceptance, evidence revisions/limits, related SIT/UAT/value/prediction research, participant/access gaps, and conditional capture/retest steps reconciled.
3. **Remaining gaps:** Applicable SIT pass evidence on a selected candidate, current isolated runtime/access, and willing future participant availability remain unconfirmed; #1379 comparison prerequisites remain separate.
4. **Owner decision required:** Michael must choose the legacy lane’s disposition and separately select/authorize any future flow. No product-value, UAT, sprint, release, or restoration decision is made here.
