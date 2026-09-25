# Sprint 1 SIT and UAT preparation

09/25/2026 · #1372 / #1373 · Authority: #1329.
Status: scenarios and ownership approved by Michael on 09/25/2026; execution/sign-off remain separate.
Application remains withdrawn. PR #1378 is stacked on #1377 and both remain draft.

## Common setup and evidence

Use an isolated recovery environment with Node 24.19.0 / npm 11.9.0 and the tested
commit recorded. No production data or credentials in fixtures/evidence. Start
from ai-insights with npm ci and npm run start:api; record actual bind address and
port from startup. Confirm /health before using /api/v1 endpoints. Use a separately
identified dashboard host for user tests; the client module is not itself a
rendered application. The opt-in host is implemented; participant access is not yet confirmed.

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
| S6 | Stop/restart intended runtime; reload results and model artifact | Document persistence contract; correct artifact/version and result identity, or explicit unavailable state | Session-only contract approved; trained artifact blocked |
| S7 | Run required lint/full suite and record security/runtime gates | Two complete green runs and all #1329 gates; no excluded failures | Full suite remains failing; no acceptance claimed |

Commands from ai-insights: npm run lint; npm test -- --runInBand.
Use existing tests/unit/project-validation.test.js, output-contract.test.js,
runtime-regressions.test.js and tests/integration.test.js as evidence starting
points, not proof that dashboard rendering or persistence is complete.

## UAT scenarios — #1373 plan / #1375 execution

Common preconditions: confirmed participant, accessible isolated dashboard host,
known commit, service health, baseline F1 and evidence template. No participant
has yet confirmed availability or access. Michael confirmed the decision-owner role; participant availability/access remain
unverified.

| ID / user outcome | Additional precondition and steps | Expected observable result |
| --- | --- | --- |
| U1 Enter project data | Enter F1, inspect units and values, submit; repeat using F2 where UI supports partial input | Submitted values retained; defaults identifiable; response associated with this project |
| U2 Request and interpret insights | After U1, inspect risk explanation, metadata and recommendations | Unvalidated/untrained status visible; confidence not presented as validated accuracy; user can distinguish factors from model output |
| U3 Correct invalid input | Enter F3; submit; correct team size and resubmit | Actionable validation error; no new success on failure; corrected request can complete |
| U4 Recover from service failure | After a successful request, stop/isolate the test service; request again; restore service and retry | Failure visible; old results identified as previous results rather than current success; retry possible |
| U5 Reopen results | Record project/result identity; navigate away and reopen; restart service and repeat | Persisted result retains identity/version, or explicit unavailability; no silent regenerated result portrayed as saved history |
| U6 Recognize limitations | Inspect resource, schedule and quality sections and estimated impact; exercise a missing section | Simulation labels visible at use; missing sections unavailable; no quantified benefit from unvalidated results |

U5 now tests the approved session-only behavior: no saved history; reload/reopen requires a new explicit request. U2/U6 may
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

## Persistence and UAT decision package — 09/25/2026

Status: approved by Michael ("Confirmed", 09/25/2026 at 11:40 AM ET).
Code review at `19ef6d507836c94289dcf61845b1f1f8b5f8d8ba` confirms an in-memory
engine cache, disabled trained-model loading, and a dashboard client module with
no rendered host in src/dashboard. Passing container checks do not close these gaps.

| Decision | Recommendation | Acceptance consequence |
| --- | --- | --- |
| Saved results | Session-only results for initial recovery; no saved history or automatic regeneration represented as history | On page reload/reopen, explain that results are not saved and require a new explicit request; disclose this before the first request |
| API restart | Cache is disposable; a fresh service has no cached predictions | Existing visible results remain visibly dated previous results; new requests are identified separately |
| Model artifact | A future accepted trained artifact must load by pinned version/hash on startup and fail explicitly if missing/incompatible | This remains required under #1374/#1329; session-only results do not waive model persistence |
| UAT surface | Prepare a minimal isolated dashboard using the existing client, synthetic fixtures and explicit unvalidated/simulated labels | Exercise U1–U6 in a browser; no restoration to main or production rollout implied |
| Acceptance owner | Michael as product decision owner and proposed UAT participant, subject to confirmation | Prepare access first; actual user execution and recorded decision remain necessary |

The session-only decision narrows supported behavior and is approved. S6/U5 test
that behavior; successful execution must still be recorded. If
saved history is required, instead specify retention, storage ownership, deletion
and result/model identity, and implement durable storage before U5 execution.

Disclosure, unavailable states and the opt-in rendered host are implemented;
record its tested commit and verify participant access. Do not assume access from
Michael's iPad to a local runner URL. Confirm access with a real browser session
before scheduling user execution; no participant response or sign-off is inferred.

Continuation mapping: #1298 owns implementation; #1372 verifies schema/API/rules
and restart behavior; #1373 records scenario/owner approval; #1375 records actual
UAT execution; #1374 retains model loading/evaluation; #1329 retains final gates.
The three rule scenarios and six other failures from the last full suite remain
open until evidenced repairs. No acceptance checkbox changes in this package.


## Approved execution contract and access

Michael confirmed the evidence-based rule scope, session-only results and role as
acceptance owner. Actual participant availability and access have not been tested.
S6: restart clears volatile cache; no saved result is silently regenerated. Trained
artifact loading remains a separate unmet requirement. U5: reload/reopen clears
results, displays no-history disclosure and requires an explicit new request.

An opt-in dashboard is implemented at `/recovery-uat/uat/`. It uses the existing
client and real aggregate API. Session-only disclosure appears before submission;
failures clear successful output; missing sections display unavailable; simulated
sections and the untrained label are identified at use. It writes no browser
storage. Browser automation is engineering evidence, not Michael's UAT sign-off.

Create an isolated checkout of the recovery branch; do not run the old app
files from main. These commands preserve the existing working directory and
stop if any setup step fails. The temporary directory is disposable, not result
storage. Recreate it after a Codespace rebuild.

```bash
cd /workspaces/pm-tools-templates &&
git fetch origin fix/1298-runtime-contracts &&
uat_dir=$(mktemp -d /tmp/ai-insights-uat.XXXXXX) &&
git worktree add --detach "$uat_dir" FETCH_HEAD &&
cd "$uat_dir/ai-insights" &&
npm ci &&
ENABLE_RECOVERY_UAT=true HOST=127.0.0.1 PORT=3001 npm run start:api
```

Record the checkout SHA with `git rev-parse HEAD` from this checkout in a second
terminal. Leave the server terminal running. If startup fails, retain the first
error and checkout SHA; do not modify the old main-branch copy to make it run.

Access correction, 09/25/2026: the initial instructions omitted the checkout
commands. Michael ran from main and encountered a duplicate rateLimiter declaration.
The recovery source uses limiterInstance and passes the Node syntax check;
this main-checkout failure is not a failure of the tested recovery image.
Participant access remains pending until this corrected procedure succeeds.

In Codespaces, forward port 3001 with Private visibility. Open the forwarded URL
and append `/recovery-uat/uat/`. No public deployment or authenticated user access
is established by this command; Michael must confirm the page opens on his device.
Use only synthetic projects. The page is disabled unless explicitly enabled.

Resume U1–U6 on the recorded candidate and record each result/defect and final
user decision on #1375. #1373 remains open until its full acceptance criteria are
reconciled; this approval alone is not issue closure. Two complete green suites,
trained-model acceptance and all #1329 restoration gates remain required.
