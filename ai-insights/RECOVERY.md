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
