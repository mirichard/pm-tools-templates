# Issue #1372 — conditional SIT evidence and contract gaps

- **Research checkpoint:** 2026-10-30
- **Disposition:** Paused; preparation only; no runtime selected
- **Accountable decision owner:** Michael Richard
- **Authority:** [#1329](https://github.com/mirichard/pm-tools-templates/issues/1329)
**Related work:** [#1293](https://github.com/mirichard/pm-tools-templates/issues/1293), [#1298](https://github.com/mirichard/pm-tools-templates/issues/1298), [#1374](https://github.com/mirichard/pm-tools-templates/issues/1374), [#1375](https://github.com/mirichard/pm-tools-templates/issues/1375), [#1379](https://github.com/mirichard/pm-tools-templates/issues/1379), [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566)

## Decision brief

Keep the legacy SIT paused. Preserve the `recovery-v1` contract and bounded test/container/browser evidence as a **candidate reuse package**, not as a selected or accepted runtime. The latest source candidate is `919f2de327cb81a4c28f84b5ab6f010a3cf618f6`; its evidence record is `aaa419d51e473b32f4bc3c38ac0cfc3de9612af8`. Both are preserved from PR #1378, which was closed without merging. The current base contains evidence and selected UI/test fragments, not a complete runnable model/API package.

There is useful engineering evidence for input validation, serialization/projection, failure/retry, concurrency/cache isolation, and a container/browser smoke path. It does not establish a trained or accurate model, two green full-suite runs, durable model-artifact loading, performance acceptance, or participant acceptance of the redesigned flow. The latest recorded full suite on the candidate was 138 passed / 6 failed; failures remained around untrained-model classification, confidence, and consistency.

Michael must decide whether any legacy component is retained after the independent #1379 research and component inventory in #1591. #1379's current first use case—sponsor-approval readiness—is a research direction, not approval to reuse this risk-insights path. If a runtime is retained, select its exact revision and contract, reconcile #1293/#1298 repairs, then run only applicable cases against that candidate. If not retained, record a separate supersession/retirement decision. This work does not block #1379.

## Scope and evidence basis

The native parent is #1329; #1372 has no native children. Its retained dependencies are #1293 (effective lint) and #1298 (build/test/runtime repairs). Current issue instructions supersede the historical Sprint 1 forecast: this is conditional legacy SIT, not active delivery. PRs #1377 and #1378 were closed without merging on September 27; preserved branches and their evidence are not integrated `main` behavior.

The [v2.5 discovery plan](v2.5-discovery-plan.md) keeps #1329 paused and #1379 independent. It says research-to-backlog requires evidence, bounded scope, dependencies, estimate and owner disposition; sprint selection additionally requires resolved/sequenced dependencies, testable validation, an owner, and confirmed capacity. No external method or product claim is needed for this contract-focused review; no external sources or independent reviewers were used.

The source-sufficiency evidence already accepted in #1379 remains accepted; this report does not repeat source searching or make that independent research contingent on legacy SIT.

At base revision [`8078fdd`](https://github.com/mirichard/pm-tools-templates/tree/8078fdd24db8e9d274a5922c1db00c051f708663), the tracked `ai-insights` tree contains research/evidence and selected dashboard/test files, but no complete `package.json`, API server, or model implementation. The executable source below is linked at preserved revisions and must not be mistaken for a maintained runtime on `main`.

## Capability / evidence / gap matrix

| Area and disposition | Source and exact revision | Evidence already recorded | Gap / dependency |
|---|---|---|---|
| **Input schema and defaults — retain as candidate contract** | [`validation.js`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/src/utils/validation.js), `aaa419d` | Shared Joi validation is used by HTTP middleware, batch validation and direct risk prediction. At least one recognized field is required; partial input is defaulted; unknown fields are stripped. The schema defines team size 1–100, duration 1–365 days, budget 1,000–10,000,000, plus enum and other field bounds. Invalid HTTP input returns 400 before inference. | Reconfirm against the exact owner-selected candidate; no fresh run on current `main`. Preserve schema-owned semantics rather than infer new defaults. |
| **Risk model — revise claims; defer predictive acceptance** | [`RiskPredictionModel.js`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/src/ml/models/RiskPredictionModel.js), `aaa419d`; [`MODEL-VALIDATION-READINESS.md`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/MODEL-VALIDATION-READINESS.md) | The implementation initializes random weights, does not load a trained artifact, explicitly rejects training, and labels direct outputs untrained/unvalidated. Synthetic fixtures can exercise interfaces only. | #1374 still owns target/label definitions, authorized representative data, holdout protocol, calibration/abstention criteria and artifact provenance. No accuracy, confidence-calibration or AI-value claim is established. |
| **Aggregate/API/serialization — retain `recovery-v1` for conditional SIT** | [`OUTPUT-CONTRACT.md`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/OUTPUT-CONTRACT.md); [`InsightsGenerator.js`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/src/services/InsightsGenerator.js); [`server.js`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/src/api/server.js) | `POST /api/v1/insights/analyze` returns `{success, data}`. Aggregate must preserve `riskPrediction`, `resourceOptimization`, `scheduleAnalysis`, and `qualityPrediction`; client unwraps `data`; display projection counts available sections and reports missing ones unavailable. Tests exercise JSON serialization and projection. | `recovery-v1` is a development contract, not production approval. `qualityPrediction.metrics.defectRate.predicted` has no established denominator. Missing-section and malformed-envelope checks need execution on a selected runtime. |
| **Units and output semantics — retain with explicit limits** | [`OUTPUT-CONTRACT.md`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/OUTPUT-CONTRACT.md), `aaa419d` | Risk confidence/probability are 0–1 outputs, not calibrated reliability. Resource utilization is a 0–1 fraction; allocation is headcount; capacity is hours/week. Schedule durations, buffer and time saved are days. Test coverage and code-quality predictions are 0–100. Resource, schedule and quality are marked simulated; estimated impact is `null` while unvalidated. | Resolve defect-rate units/denominator before any production contract. Do not equate completeness, heuristic impact, or confidence with scientific validity. |
| **Planning evidence — defer mapping to a selected capability** | `OUTPUT-CONTRACT.md` (`planning-v1` additive note), [`RISK-RULES-PROPOSAL.md`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/RISK-RULES-PROPOSAL.md), `aaa419d`; source-neutral runtime candidate `919f2de` | Michael approved evidence-based rules and session-only results on September 25. `planning-v1` is additive to risk output; `planning-review-v2` is the later source-neutral guided workflow. Focused HTTP/browser checks exist for that workflow. | Neither version is selected as the future product capability. #1379 now studies sponsor-approval readiness; this is not approval to revive the planning UI or map it onto the risk model. The latest workflow's browser engineering checks are not independent user acceptance. |
| **Failure, concurrency and cache — retain tests; defer acceptance rerun** | [`recovery-failure-paths.test.js`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/tests/unit/recovery-failure-paths.test.js); [`integration.test.js`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/tests/integration.test.js); [`aiInsightsClient.js`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/src/dashboard/aiInsightsClient.js) | Recorded cases cover invalid input before inference, controlled inference failure then success, malformed envelopes, network retry/timeout, concurrent project association, cloned cache values, invalidation during inference and latest-request-only dashboard state. | These are deterministic transport/state fixtures, not model accuracy or load-capacity evidence. No approved latency/throughput threshold exists; rerun only on a selected, repaired revision. |
| **Persistence/reload — retain session-only result behavior; defer artifact gate** | [`SPRINT1-VALIDATION-PLAN.md`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/SPRINT1-VALIDATION-PLAN.md), `aaa419d`; `RiskPredictionModel.js`, `aaa419d` | Michael approved no saved result history/browser storage. Cache is volatile and restart clears it. The plan requires an explicit no-history disclosure and a new request after reload. | This decision does not waive trained-artifact loading under #1374/#1329. No durable result retrieval API is claimed; verify only the approved session-only contract if the path is retained. |
| **Rendered dashboard / user acceptance — revise or defer** | [`RUNTIME-SIT-EVIDENCE.md`](https://github.com/mirichard/pm-tools-templates/blob/aaa419d51e473b32f4bc3c38ac0cfc3de9612af8/ai-insights/RUNTIME-SIT-EVIDENCE.md); [#1375](https://github.com/mirichard/pm-tools-templates/issues/1375) | Actions run [36172363589](https://github.com/mirichard/pm-tools-templates/actions/runs/36172363589) succeeded for its recorded candidate's container, browser, Trivy and gate jobs. The evidence record gives merge checkout `da2766e…`, image `sha256:ab6ca99d…`, zero HIGH/CRITICAL findings, and source-neutral planning-flow assertions. | It is not full-app-suite evidence or participant UAT of the risk-model path. The earlier redesign was rejected; current UI work is paused. #1375 owns any required UAT and participant evidence. The 30-day Actions artifact expired October 25; compact summaries remain in the preserved evidence tree. |
| **Lint/build/full-suite — defer acceptance; preserve failures** | [#1293](https://github.com/mirichard/pm-tools-templates/issues/1293), [#1298](https://github.com/mirichard/pm-tools-templates/issues/1298), [PR #1377](https://github.com/mirichard/pm-tools-templates/pull/1377), [PR #1378](https://github.com/mirichard/pm-tools-templates/pull/1378) | Preserved code runs native JavaScript ESM; the obsolete `tsc` command was removed because there is no TypeScript build. The latest recorded lint passed; focused suites passed 17 tests; the latest recorded full suite on `919f2de` was 138 passed / 6 failed / 144 total. | Both repair PRs closed unmerged; issues #1293/#1298 remain open. The six failures concern untrained classification, confidence and cross-instance consistency; there are no two consecutive complete green runs. Historical counts differ by revision and must not be combined. Current `main` has no complete app package to validate. |
| **Portfolio / component reuse — coordinate, do not duplicate** | [#1566](https://github.com/mirichard/pm-tools-templates/issues/1566), [PR #1591](https://github.com/mirichard/pm-tools-templates/pull/1591), [PR #1590](https://github.com/mirichard/pm-tools-templates/pull/1590), [PR #1589](https://github.com/mirichard/pm-tools-templates/pull/1589), [PR #1595](https://github.com/mirichard/pm-tools-templates/pull/1595) | The open research PRs cover portfolio disposition, component reuse, build/test defects, lint, and UAT readiness. | They are ongoing, draft research—not accepted repairs or new runtime decisions. Reuse their links and findings rather than create duplicate issue drafts. Preserve completed #1482; its contributor/maintainer walkthrough is not evidence for this app's SIT or UAT. |

### Revision and validation ledger

| Evidence | Exact revision / environment | What it establishes—and does not |
|---|---|---|
| Runtime candidate | `919f2de327cb81a4c28f84b5ab6f010a3cf618f6`, preserved under [`preserve/pr-1378-2026-09-27`](https://github.com/mirichard/pm-tools-templates/tree/preserve/pr-1378-2026-09-27) | Candidate source revision only; not merged or selected. |
| Evidence record | `aaa419d51e473b32f4bc3c38ac0cfc3de9612af8` | Preserved documents, focused test records and compact evidence. |
| Latest recorded focused tests | Node 24.19.0, npm 11.9.0, Linux, TensorFlow.js CPU; `npm run lint`; focused recovery/API/hook suites | Lint passed and the focused run reported 17 passed. Earlier focused increments at other revisions reported 35 and 17; do not aggregate counts across revisions. |
| Latest recorded full suite | `npm test -- --runInBand` at `919f2de` | 138 passed / 6 failed / 144 total. No full-suite green result is claimed. |
| Latest referenced Actions run | [36172363589](https://github.com/mirichard/pm-tools-templates/actions/runs/36172363589); candidate `919f2de`; merge checkout `da2766e3007dcf72bf6524e7b818900c4482c98e` | Run and relevant jobs succeeded for container/runtime/browser/Trivy. It did not run or pass the app's complete Jest suite or human UAT. |
| Older run and result counts | #1372/#1378 dated comments and earlier sections in `RUNTIME-SIT-EVIDENCE.md` | Superseded only by newer evidence for the same changed path; retain historical counts with their revision and do not call them current. |

No app tests were run for this research report: the checked-out base is not the complete runtime, and no acceptance candidate has been selected. Actions logs and owner-authored records were inspected; this is not an independent rerun or audit of model validity.

## Proposed synthetic fixture and conditional SIT matrix

The following is a **proposed evidence fixture**, not an executed test in this research task. Use synthetic data only. It checks contract and failure behavior, never predictive accuracy.

```json
{
  "id": "sit-synthetic-001",
  "name": "Synthetic acceptance project",
  "teamSize": 4,
  "duration": 60,
  "budget": 50000,
  "complexity": "medium",
  "teamExperience": 0.5
}
```

| Case | Input/action | Expected contract evidence | Existing evidence / next action |
|---|---|---|---|
| S1 valid | Submit fixture above to `/api/v1/insights/analyze` | HTTP success envelope; four model sections survive JSON; documented units/status; no calibrated-accuracy or impact claim | Output-contract test covers serialization/projection with a controlled risk value. Rerun against the selected runtime; separately prove rendered behavior if required. |
| S2 partial/default | Submit `{"teamSize":4}` through HTTP and direct validator | Same schema defaults (including duration 60, budget 50000, complexity `medium`); unknown fields stripped | Existing project-validation test. Reconfirm exact chosen schema. |
| S3 valid boundaries | Use schema minima/maxima, e.g. team size 1/100, duration 1/365, budget 1000/10000000; include zero team experience and historical zeros where applicable | Boundaries accepted and zeros preserved; no changed behavior in direct-vs-HTTP normalization | Existing fixture coverage; rerun targeted case on selected revision. |
| S4 invalid | Submit `{"teamSize":0}`, `{}`, `null`; test `NaN`/infinity only at direct-function boundary (JSON cannot encode them) | Invalid HTTP input returns 400 before inference; no success prediction or stale UI result | Existing validation/failure tests; malformed JSON and request errors are separate HTTP cases. |
| S5 failure/missing | After a valid request, force service failure; also test malformed envelope and missing `qualityPrediction` | Failed refresh cannot display old success as fresh; malformed envelope rejects; omitted section is unavailable, not fabricated; estimated impact remains unavailable | Existing hook/unit and bounded browser evidence. Confirm rendered **model** path only if that path is selected; do not substitute the planning-only route. |
| S6 concurrency/cache | Submit two named projects concurrently, repeat an identical risk request, clear cache while inference is pending | Correct request/project association; cache reuse/invalidation and no stale repopulation; no cross-caller mutation | Existing integration and recovery-failure tests; these do not set a load/performance threshold. |
| S7 restart/session | Start, request, stop and restart the API; reload the browser | Volatile API cache is empty after restart; session-only UI clearly says no saved history and requires a new request. Trained model artifact loading is separately reported blocked. | Historical server-cycle evidence and owner-approved behavior. Re-run only on a selected candidate; this is not durable persistence acceptance. |
| S8 user acceptance | If a user-facing path remains in scope, use #1375's reviewed scenarios on the recorded build | Actual participant observations, defects/retests, and the named acceptance owner's decision are recorded separately from automation | No current approval for repeated redesigned-flow UAT; participant access and any new acceptance scope must be decided first. |

### Reproducible environment and commands — proposed only

The last source-neutral runtime candidate is pinned below solely to make a later comparison reproducible. It is **not** authorized as the selected SIT target. Execute only after Michael selects a retained component/runtime and #1293/#1298 repair scope is reconciled.

```bash
set -eu
git fetch origin preserve/pr-1378-2026-09-27
sit_dir=$(mktemp -d /tmp/ai-insights-sit.XXXXXX)
git worktree add --detach "$sit_dir" 919f2de327cb81a4c28f84b5ab6f010a3cf618f6
cd "$sit_dir/ai-insights"
test "$(git rev-parse HEAD)" = 919f2de327cb81a4c28f84b5ab6f010a3cf618f6
node --version  # recorded environment: v24.19.0
npm --version   # recorded environment: 11.9.0
npm ci
npm run lint
npm test -- --runInBand tests/unit/project-validation.test.js tests/unit/output-contract.test.js tests/unit/recovery-failure-paths.test.js tests/unit/recovery-server.test.js tests/unit/dashboard-hooks.test.js
```

For the API/container portion, record the actual image digest and checked-out SHA; bind only to a private isolated test environment, use synthetic fixtures, confirm `/health`, then call the endpoint:

```bash
ENABLE_RECOVERY_UAT=true HOST=127.0.0.1 PORT=3001 npm run start:api
curl -fsS http://127.0.0.1:3001/health
curl -fsS -X POST http://127.0.0.1:3001/api/v1/insights/analyze \
  -H 'Content-Type: application/json' \
  --data '{"id":"sit-synthetic-001","name":"Synthetic acceptance project","teamSize":4,"duration":60,"budget":50000,"complexity":"medium","teamExperience":0.5}'
```

Capture environment, SHA, image digest, exact command, request/response, expected/actual result, evidence path, status, defect link, executor and reviewer decision for each case. Run the full suite only on the repaired, owner-selected candidate for its acceptance gate; the recorded command is `npm test -- --runInBand`. Repeat container/security checks when the selected runtime, dependencies or base image change. A successful deterministic fixture remains transport evidence, not accuracy evidence.

## Conditional readiness / reuse package

No new delivery issue is proposed; #1372, #1293, #1298, #1374, #1375 and #1379 already own the distinct work. Conditional package:

- **User outcome:** for one owner-selected and supported path, demonstrate that the model/API/UI boundary preserves the approved contract and failure behavior without implying unsupported accuracy.
- **Scope:** only selected input/output schema, serialization, defaults/errors, failure and concurrency cases, approved session-only/reload behavior, and the required test evidence for the chosen runtime.
- **Exclusions:** model training/evaluation (#1374), product-value study (#1379), participant UAT (#1375), new UI/features, saved-result persistence, release/restoration, security exceptions, and any change to sprint/milestone commitments.
- **Observable acceptance:** exact candidate SHA and environment recorded; all applicable valid/partial/boundary/invalid/missing/failure/concurrency/restart cases have repeatable results; no required failure is waived; repair defects link to #1293/#1298 and affected cases rerun; full-suite and parent #1329 gates remain separately satisfied before any Done/restoration decision.
- **Validation:** targeted tests first; selected runtime integration/browser checks only where the retained path requires them; full app suite at the acceptance candidate; container/security gate on the same immutable image if applicable. Human acceptance is separately owned by Michael/#1375.
- **Dependencies / owner gaps:** Michael must choose retain/revise/defer/retire for components after #1379 and #1591 evidence. #1293/#1298 repair and review are unresolved. #1374 gates predictive claims/artifact loading. Any new capability needs its own approved contracts and implementation acceptance; #1379 remains independent.
- **Effort assumption:** no committed estimate exists. For planning discussion only, a **2–4 person-day** range assumes one selected runtime, existing reusable fixtures, repaired dependencies, no new features, no model work, and no participant recruitment. It excludes defect repair, model/data evaluation, UAT, release/security remediation, and waiting for decisions. Michael must replace or reject this assumption before backlog/sprint planning; capacity is unconfirmed.

### Promotion criteria

| Stage | Required evidence | Current status |
|---|---|---|
| **Backlog-ready** | Owner-selected retained capability and runtime; bounded outcome/exclusions; agreed contract version; disposition of #1293/#1298; dependency and defect map; evidence-backed estimate and owner decision | **Not ready for execution.** This report prepares reuse evidence only. |
| **Sprint-ready** | Backlog-ready scope plus exact candidate/repaired revision, executable isolated environment, case-level acceptance method, linked repairs, named owner, sequenced dependencies, reviewed estimate and confirmed capacity/selection | **Not ready.** No runtime selected, repairs remain unresolved, full suite is not green and capacity is not confirmed. |
| **Owner-selected** | Michael's explicit record to retain/revise/defer/retire the legacy path; if retained, identify the component and exact runtime/contract; separately record acceptance authority | **Pending.** Choosing sponsor-approval readiness for #1379 research is not a legacy runtime selection. |

## Four-point decision brief

- **Recommended next step:** Michael records retain/revise/defer/retire for the legacy components after #1379/#1591 evidence; if retained, name the exact runtime and contract.
- **Research completed:** preserved contracts, source revisions, tests, current base inventory, Actions evidence, issue dependencies and existing related research were reconciled.
- **Remaining gaps:** #1293/#1298 integration, six recorded full-suite failures, trained-model/data/calibration gates, and any required participant acceptance remain unresolved.
- **Owner decision required:** whether this legacy path is still needed at all; no SIT pass, acceptance, schedule or restoration is inferred.
