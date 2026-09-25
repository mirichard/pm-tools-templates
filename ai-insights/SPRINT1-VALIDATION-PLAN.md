# Sprint 1 SIT and UAT preparation

09/25/2026 · #1372 / #1373 · Authority: #1329.
Status: prepared for review; this is not execution evidence or acceptance.
Application remains withdrawn. PR #1378 is stacked on #1377 and both remain draft.

## Common setup and evidence

Use an isolated recovery environment with Node 24.19.0 / npm 11.9.0 and the tested
commit recorded. No production data or credentials in fixtures/evidence. Start
from ai-insights with npm ci and npm run start:api; record actual bind address and
port from startup. Confirm /health before using /api/v1 endpoints. Use a separately
identified dashboard host for user tests; the client module is not itself a
rendered application. Dashboard access and host deployment are not yet confirmed.

Safe baseline F1: {"name":"Synthetic acceptance project","teamSize":4,"duration":60,
"budget":50000,"complexity":"medium","teamExperience":0.5}.
F2: {"teamSize":4}. F3: {"teamSize":0}. F4: {}.
These fixtures test behavior, not risk accuracy. Preserve session/request IDs in
logs and use distinct project names for concurrent cases.

For every result record: case ID, UTC timestamp, commit, environment/runtime,
fixture, exact command/action, expected and actual result, evidence location,
pass/fail/blocked status, defect link, executor and reviewer decision. Do not
record a blocked or unexecuted scenario as passed.

## SIT traceability — #1372

Contract: OUTPUT-CONTRACT.md (recovery-v1); schema: src/utils/validation.js.
Paths: direct risk model → AIInsightsEngine / InsightsGenerator → HTTP JSON →
AIInsightsClient / AIInsightsResult → host dashboard rendering.

| ID | Procedure | Expected evidence | Current readiness |
| --- | --- | --- | --- |
| S1 | Submit F1 to /api/v1/insights/analyze; inspect JSON and dashboard projection | Four model sections retained, documented units, unvalidated metadata, simulated sections, null estimated impact | Existing contract tests; host rendering unverified |
| S2 | Submit F2; compare normalized defaults with shared schema | Defaults consistent across direct and HTTP paths; no fabricated supplied values | Existing validation tests; rerun on acceptance candidate |
| S3 | Submit numeric min/max boundaries, F3, F4, null and nonfinite direct inputs | Valid bounds accepted; invalid requests rejected before inference; HTTP 400 for invalid JSON project values | Existing validation tests; rerun on acceptance candidate |
| S4 | Render valid result; then force HTTP failure and malformed/missing section response | Explicit failure/unavailable state; previous result not presented as fresh success | Needs host failure-path execution |
| S5 | Start fresh; run concurrent requests; repeat same request and invalidate cache | Correct request/result association; no shared state contamination; cache reuse/invalidation evidenced by inference calls | Integration coverage exists; repeatable runtime evidence needed |
| S6 | Stop/restart intended runtime; reload results and model artifact | Document persistence contract; correct artifact/version and result identity, or explicit unavailable state | Trained artifact and persistence contract blocked |
| S7 | Run required lint/full suite and record security/runtime gates | Two complete green runs and all #1329 gates; no excluded failures | Full suite remains failing; no acceptance claimed |

Commands from ai-insights: npm run lint; npm test -- --runInBand.
Use existing tests/unit/project-validation.test.js, output-contract.test.js,
runtime-regressions.test.js and tests/integration.test.js as evidence starting
points, not proof that dashboard rendering or persistence is complete.

## UAT scenarios — #1373 plan / #1375 execution

Common preconditions: confirmed participant, accessible isolated dashboard host,
known commit, service health, baseline F1 and evidence template. No participant
has yet confirmed availability or access. Michael is the proposed decision owner,
subject to explicit confirmation; executor/representative remains unassigned.

| ID / user outcome | Additional precondition and steps | Expected observable result |
| --- | --- | --- |
| U1 Enter project data | Enter F1, inspect units and values, submit; repeat using F2 where UI supports partial input | Submitted values retained; defaults identifiable; response associated with this project |
| U2 Request and interpret insights | After U1, inspect risk explanation, metadata and recommendations | Unvalidated/untrained status visible; confidence not presented as validated accuracy; user can distinguish factors from model output |
| U3 Correct invalid input | Enter F3; submit; correct team size and resubmit | Actionable validation error; no new success on failure; corrected request can complete |
| U4 Recover from service failure | After a successful request, stop/isolate the test service; request again; restore service and retry | Failure visible; old results identified as previous results rather than current success; retry possible |
| U5 Reopen results | Record project/result identity; navigate away and reopen; restart service and repeat | Persisted result retains identity/version, or explicit unavailability; no silent regenerated result portrayed as saved history |
| U6 Recognize limitations | Inspect resource, schedule and quality sections and estimated impact; exercise a missing section | Simulation labels visible at use; missing sections unavailable; no quantified benefit from unvalidated results |

U5 is blocked until persistence behavior is agreed and implemented. U2/U6 may
reveal presentation defects even though metadata exists in the API. Record those
as defects; metadata presence alone is insufficient for user acceptance.

## Proposed decision rules and outstanding approvals

A scenario passes only when its observable results are evidenced on the recorded
candidate. Block acceptance for misleading validation claims, stale success after
failure, incorrect project association, data loss contrary to the approved
persistence contract, or any failed required scenario. Other defects need recorded
severity, disposition and owner; there is no blanket cosmetic-defect waiver.

Before UAT execution confirm participant and decision owner, availability, access,
scenario review and pass/fail criteria. Before #1373 closure record that approval
and link it here. Do not close #1372 until its required execution evidence passes.
Plan approval does not close #1375 or override trained-model/security gates.
