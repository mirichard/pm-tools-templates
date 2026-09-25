# Recovery output contract: recovery-v1

Development contract for #1298 and SIT #1372. The application remains withdrawn.
Schema completeness and passing transport tests do not establish predictive accuracy.

## Input and transport

The HTTP project endpoints and direct risk prediction use `validateProjectInput`
in `src/utils/validation.js`. A recognized supplied field is required. Valid
partial inputs receive defaults; unknown fields are stripped. The schema owns
numeric limits and enum values. Invalid requests return HTTP 400 and no prediction.
The comprehensive HTTP endpoint receives the normalized project from middleware.

The insights HTTP envelope contains `success` and `data`. The dashboard client
unwraps `data` into `AIInsightsResult`. Arrays must be recognized with
`Array.isArray`, including arrays parsed outside Jest's VM realm.

## Aggregate fields

| Field | Shape and units | Dashboard projection |
| --- | --- | --- |
| `riskPrediction` | `riskLevel`: low/medium/high/critical; `confidence`, `probability`: 0–1; `riskFactors`: object array; `mitigationStrategies`, `timeline`: arrays | `risk` |
| `resourceOptimization` | `currentUtilization`, `targetUtilization`: fractions 0–1; `recommendations`: array; `resourceAllocation`: headcounts; `capacityPlan`: hours per week | `resources` |
| `scheduleAnalysis` | `currentSchedule.criticalPath`: string array; `bufferTime`, durations and `optimizations[].timeSaving`: days | `schedule` |
| `qualityPrediction` | `metrics.testCoverage.predicted`: percentage 0–100; `codeQuality.predicted`: score 0–100; `defectRate.predicted`: simulated value with no established measurement denominator | `quality` |
| `executiveSummary` | Existing generated summary object; no separate `summary` alias in the aggregate | Dashboard constructs its own `summary` |
| `insights`, `recommendations` | Object arrays | Summary lists |
| `metadata` | `contractVersion: recovery-v1`, `validationStatus: unvalidated`, `simulatedSections` naming resource, schedule, quality | Included in display metadata |

Risk initializes untrained random weights. Confidence is a model output, not a
calibrated reliability measure. Resource, schedule and quality outputs are
simulations. Their nested shapes are retained rather than inventing top-level
metrics or claiming validated optimization. Defect-rate units require resolution
before a supported production contract can be accepted.

The aggregator must retain all four model sections through JSON serialization.
Missing sections remain unavailable and reduce the dashboard's completeness
percentage. Completeness counts available sections, not scientific validity.
Estimated impact is unavailable (`null`) for unvalidated results.

## Risk-factor and mitigation objects

`riskFactors` entries contain `factor`, `severity`, `description`, and `impact`.
`mitigationStrategies` entries contain `strategy`, `priority`, `description`, and
`timeframe`. They are object arrays, not arrays of display strings.

Existing heuristic conditions remain unchanged: team size >10, duration >180
days, budget >$100,000, high complexity, and team experience <0.5. Zero experience
is included in `Low Team Experience`; there is no separate zero-only factor.
These are inherited development rules, not empirically validated cutoffs.
Their impact values are heuristic scores, not probabilities or calibrated causal
effects. Boundary tests preserve the conditions without claiming validation.

Large-team factors now produce Communication Protocols advice. Low-experience
factors produce Team Training and the existing Mentorship Program advice. These
recommendations depend on those factors regardless of the random classification.

Direct risk responses identify `trainingStatus: untrained`,
`validationStatus: unvalidated`, and `factorMethod: heuristic` in metadata.
The unimplemented `train` method rejects rather than logging successful training.
Tight-timeline factors, technology-stack factors, and timeline-extension advice
remain unresolved; their tests stay active. See `MODEL-VALIDATION-READINESS.md`.

## Execution and evidence

The app is native JavaScript ESM. Node and Docker execute `src` directly;
there is no TypeScript input or compilation artifact. The obsolete `tsc` build
script is removed and inventory declares compilation not applicable. Required
lint checks all source syntax and identifier resolution. Required Jest tests
execute runtime behavior. Container packaging/security remains a separate #1329 gate.

`tests/unit/output-contract.test.js` checks retention, serialization, display
projection and unavailable sections using a deterministic risk fixture.
`tests/integration.test.js` exercises real HTTP transport, current nested model
shapes, concurrent requests and cache reuse/invalidation. Its model-accuracy
assertions remain unchanged and may fail until trained-model evaluation is complete.
