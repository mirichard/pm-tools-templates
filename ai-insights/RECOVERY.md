# AI insights recovery checkpoint

This branch is development-only. Do not merge it into main or deploy it as a restored feature.
The immutable recovery point remains `767ffc3bc6026970af7ed9a070b85e89f4609d5d` on `preserve/ai-insights-1320`.
Restoration acceptance criteria remain in issue #1329.

## Reproduced baseline (2026-09-22)

Node 24, clean npm ci, TensorFlow.js JavaScript CPU backend.
Full test command: `npm test -- --runInBand`.
Baseline: 33 passed / 33 failed out of 66 tests.

The risk network initializes random untrained weights. Classification and confidence assertions can change between runs. Passing those assertions is not model evaluation evidence.
No representative training/evaluation dataset or agreed accuracy/calibration thresholds has been established by this checkpoint.

## First bounded repair

Wrap temporary inference tensors in try/finally cleanup. Previously, synchronous inference errors leaked the input tensor; rejected prediction.data() promises leaked input and output tensors.
Two new tests measure TensorFlow tensor counts before and after those failures. Both fail against the preserved implementation and pass with the repair. The complete runtime-regression suite passes (six tests).
The full suite after the repair: 36 passed / 32 failed out of 68. The two new passes are deterministic; other count differences are not evidence of improved model accuracy. Existing tests were neither excluded nor weakened.
Full npm audit reports zero vulnerabilities at this checkpoint. Container security and deployment have not been revalidated.

## Next milestones

1. Define one project-input schema for direct model calls and HTTP requests; reject invalid/non-finite inputs before creating tensors. Resolve currently conflicting zero-budget/default expectations explicitly.
2. Agree and document output shapes used by models, API, dashboard, and integration tests; correct cross-realm array assertions without weakening their semantic checks.
3. Define the supported prediction use case and obtain representative, labeled evaluation data. Set accuracy/calibration criteria before training or publishing confidence values.
4. Repair lint/build commands and remaining runtime/lifecycle cases. Require two full passing runs, then validate persistence, concurrency, intended-runtime startup and container security.
5. Restore inventory, scanning, gateway behavior, and accurate documentation only in a separate release PR after issue #1329 criteria are met.

## Baseline failed cases

- RiskPredictionModel Risk Level Classification should predict low risk for small, simple projects
- RiskPredictionModel Risk Level Classification should predict critical risk for impossible projects
- RiskPredictionModel Risk Factor Identification should identify team size as risk factor for large teams
- RiskPredictionModel Risk Factor Identification should identify tight timeline as risk factor
- RiskPredictionModel Risk Factor Identification should identify inexperienced team as risk factor
- RiskPredictionModel Risk Factor Identification should identify complex technology stack as risk factor
- RiskPredictionModel Confidence Score Calculation should provide high confidence for typical project patterns
- RiskPredictionModel Confidence Score Calculation should provide lower confidence for unusual project patterns
- RiskPredictionModel Confidence Score Calculation should provide moderate confidence for edge cases
- RiskPredictionModel Mitigation Strategy Generation should suggest team coordination strategies for large teams
- RiskPredictionModel Mitigation Strategy Generation should suggest timeline adjustments for tight schedules
- RiskPredictionModel Mitigation Strategy Generation should suggest training for inexperienced teams
- RiskPredictionModel Input Validation should reject invalid team size
- RiskPredictionModel Input Validation should reject invalid duration
- RiskPredictionModel Input Validation should reject invalid complexity level
- RiskPredictionModel Input Validation should reject invalid methodology
- RiskPredictionModel Edge Cases and Boundary Conditions should handle zero budget projects
- RiskPredictionModel Edge Cases and Boundary Conditions should handle zero team experience
- RiskPredictionModel Consistency and Determinism should be deterministic across multiple instances
- RiskPredictionModel Error Handling should throw descriptive error for null input
- RiskPredictionModel Error Handling should throw descriptive error for undefined input
- RiskPredictionModel Error Handling should throw descriptive error for empty object
- RiskPredictionModel Error Handling should throw descriptive error for negative values
- AI Insights Integration Tests AI Engine Core Functionality should optimize resources
- AI Insights Integration Tests AI Engine Core Functionality should analyze schedule
- AI Insights Integration Tests AI Engine Core Functionality should predict quality
- AI Insights Integration Tests AI Engine Core Functionality should generate comprehensive insights
- AI Insights Integration Tests API Server Functionality should handle insights generation API
- AI Insights Integration Tests API Server Functionality should handle batch processing
- AI Insights Integration Tests Error Handling should handle invalid project data
- AI Insights Integration Tests Model Accuracy should maintain consistent risk predictions
- AI Insights Integration Tests Integration with Dashboard should format data for dashboard display
- AI Insights Integration Tests Integration with Dashboard should provide actionable recommendations

## Second checkpoint: shared project validation

Direct risk prediction, project HTTP middleware, and batch entries now call the
same validator. At least one recognized supplied field is required; valid partial
objects retain schema defaults and unknown fields are stripped. The existing
Joi numeric conversion behavior is retained. Values such as NaN and Infinity
are rejected before tensor allocation.

The existing HTTP contract defines the supported range: teamSize 1–100,
duration 1–365 days, budget 1,000–10,000,000; other limits remain in projectSchema.
Direct-model boundary fixtures now test those same minimum and maximum values.
Zero-budget predictions are rejected rather than accepted under a conflicting
model-only test. Accuracy and confidence assertions were not changed.
Historical similarProjects/successRate/avgDelay zeros are no longer replaced by
defaults in feature extraction. Normalized defaults also reach impact calculation.

Validation: all 29 validation/runtime cases passed twice. Existing full-suite
input-validation cases now pass; the full run was 70 passed / 21 failed out of 91.
Remaining classification/confidence results are still stochastic and this count
is not evidence of model quality. Added cases cover HTTP middleware and model
rejection, no inference or tensor allocation on invalid inputs, partial-input
defaults, upper boundaries, historical zeros, and batch rejection.

Next: reconcile output structures across models, API, dashboard, and tests.
The model remains untrained and the app remains withdrawn from main.

## Sprint 1: effective lint coverage (09/25/2026)

Issue #1293 now has an app-local `.eslintrc.cjs` compatible with the locked
ESLint 8.57.1. `npm run lint` recursively checks all 18 JavaScript sources with
`eslint:recommended` and zero allowed warnings. Browser globals apply only to
the dashboard client; its optional CommonJS export is explicitly declared.
Unused contract parameters are named with a leading underscore; unused local
variables and undefined names remain errors. Stub implementations still need
the model/output reliability work required by #1329.

The dashboard hook previously referenced undefined `useState`/`useCallback`.
ESM consumers now supply their host React hooks, for example
`useAIInsights(client, { useState, useCallback })`; browser consumers may use
`globalThis.React`. Missing hooks fail with an explicit error. Hook regression
tests cover successful responses, service failure, and both integration modes.

Validation on Node 24.19.0 / npm 11.9.0 after clean `npm ci`:
- The repository check runner passed `ai-insights lint` twice consecutively.
- ESLint API results covered all 18 sources; undefined-name canaries were
  detected at the root, nested model and browser paths.
- Dashboard hook/security suites: four tests passed.
- Complete suite: 68 passed / 26 failed out of 94. A fresh unchanged-base run
  at `5b00c8d7` produced 69 passed / 22 failed out of 91. Random untrained-model
  assertions and timing-sensitive cache checks still vary; these runs do not
  establish full-suite acceptance or predictive reliability.

Only the recovery inventory's lint waiver is removed. Build/test repair (#1298),
SIT (#1372), UAT planning (#1373), and the remaining #1329 restoration gates
remain open. This change targets the recovery branch; it does not restore the
app to main. ESLint 8 is end-of-life; this bounded repair uses the existing
lockfile, and dependency modernization remains a restoration consideration.

## Sprint 1: native runtime and aggregate contract repair (09/25/2026)

PR #1377's CI lint and audit pass, but its app test step fails; the PR remains
unmerged. #1298 continues on a branch stacked on the lint repair.

The app runs native JavaScript ESM from `src`, including in Docker. Removed the
obsolete `tsc` script and its build waiver; inventory now explicitly records no
compilation step. This is not a successful TypeScript build. Required lint and
runtime tests remain enabled. Removed the stale ESM-parser test waiver because
the suites now execute; remaining failures must fail the gate.

`OUTPUT-CONTRACT.md` records recovery-v1. The aggregate response now retains the
four model sections consumed by the dashboard. Nested resource/schedule/quality
assertions use those documented source shapes, array checks work across realms,
and cache validation counts inference calls before/after invalidation instead
of comparing millisecond timings. Unvalidated/simulated status survives transport
and dashboard projection; unvalidated estimated impact is unavailable.

Evidence, Node 24.19.0 / npm 11.9.0:
- Inventory validation: 21 manifests reconciled. Required lint passes.
- Both new output-contract regressions fail on the unchanged recovery baseline
  (missing model sections and missing validation status) and pass after repair.
- Contract/dashboard/security focused run: 6 tests pass.
- Two full runs: 83 passed / 13 failed, then 80 passed / 16 failed (96 total).
  Integration passes in both; risk-model unit failures remain. Counts fluctuate
  with random untrained weights and do not establish model reliability.

Remaining #1298 work includes risk-factor/mitigation object-versus-string
contracts, unsupported tight-timeline/technology-stack expectations, a confidence
fixture whose budget violates the shared schema, and untrained classification,
confidence/calibration and cross-instance determinism. Do not make up training
or evaluation evidence, tune output to fixtures, or exclude these failed tests.
#1372 still requires complete supported-path acceptance evidence; no task is
closed and no restoration to main is authorized by this checkpoint.

## Sprint 1: risk-factor contract and training-status repair (09/25/2026)

Structured factor/mitigation assertions now match recovery-v1. Existing factor
thresholds are unchanged; zero experience is represented by Low Team Experience.
Large-team and low-experience factors now produce the coordination and training
advice expected by the existing scenarios, independently of random classification.
The unusual-project confidence fixture uses the shared schema's minimum budget;
its confidence threshold is unchanged. Unsupported timeline/technology assertions
remain active as structured-object requirements.

Direct predictions disclose untrained/unvalidated status and heuristic factors.
The empty training method now rejects instead of logging a false success.
`MODEL-VALIDATION-READINESS.md` records target/label definitions, authorized
representative data, evaluation/calibration criteria and missing heuristic rules
needed for further acceptance work. The synthetic generator's random outcomes
are not a representative training or evaluation dataset.

Validation on Node 24.19.0 / npm 11.9.0:
- Required lint passes. Four new deterministic contract/status tests pass;
  three fail on the unchanged baseline (advice, training guard, status metadata).
- Two full runs: 91 passed / 9 failed and 92 passed / 8 failed (100 total).
- Three stable unresolved cases concern tight-timeline factor, technology-stack
  factor and timeline-extension advice. Other failures are classification,
  confidence and cross-instance predictions from random weights; the second run
  also failed an integration model-accuracy assertion.

No suites or acceptance assertions are skipped or waived. Full-suite acceptance
is still unmet; #1298/#1372/#1329 remain open and both recovery PRs remain draft.
