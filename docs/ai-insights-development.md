# AI insights development preservation

AI insights is withdrawn from the active repository and is not a supported user feature. The intention is to repair and enhance it before a separately reviewed release.

## Preserved source

- [Dedicated preservation branch](https://github.com/mirichard/pm-tools-templates/tree/preserve/ai-insights-1320/ai-insights)
- [Immutable recovery commit](https://github.com/mirichard/pm-tools-templates/tree/767ffc3bc6026970af7ed9a070b85e89f4609d5d/ai-insights): `767ffc3bc6026970af7ed9a070b85e89f4609d5d`
- The branch retains the full repository history and all repairs made during #1320. Do not delete it when the PR branch is deleted.

A dedicated development repository has not been created. The preservation branch is the current recovery point; it can be cloned and used as the source for later extraction. It is not a deployed or validated application. Default-branch dependency checks no longer cover the preserved app.

Restoration work and acceptance criteria are tracked in [issue #1329](https://github.com/mirichard/pm-tools-templates/issues/1329).

## Last validation and known defects

The preserved revision runs on Node 24 with TensorFlow.js 4.22.0's JavaScript CPU backend. Seven targeted runtime/security tests passed and the full npm audit reported zero vulnerabilities on September 22, 2026. The latest full suite had 33 passing and 33 failing tests; it must not be represented as production-ready.

Preserved repairs include Jest ESM support, rate-limiter declaration/enforcement, HTML escaping checks, HTTP request serialization, server startup/shutdown, per-engine tensor disposal, model save/reload, and async test lifecycle fixes.

Outstanding work includes:

1. Define the supported API/output contracts and align model, API, dashboard, and tests.
2. Replace the randomly initialized risk network and placeholder training/loading with a trained, versioned model and documented evaluation data. Define accuracy/calibration criteria before claiming reliability.
3. Replace or explicitly constrain simulated resource, schedule, and quality calculations.
4. Repair input validation, remaining test expectations, cache assertions, and integration coverage without excluding failing suites or inventing confidence values.
5. Restore effective lint/build checks tracked in #1293 and #1298; remove the test exception only after two consecutive complete successful runs.
6. Revalidate dependencies, container startup, image vulnerabilities, persistence, latency, and concurrent request behavior in the intended runtime.

## Reintroduction criteria

A future release must have reviewed behavior/accuracy criteria, reproducible test and evaluation results, complete passing CI, no unresolved high/critical vulnerabilities, and accurate user documentation. Restore manifest inventory, Dependabot coverage, image scanning, and gateway availability in the same reviewed change that restores the app. The retained `Container scan gate` fails if tracked files return under `ai-insights` without replacing the withdrawal check.

PRs #1315, #1318, #1319, #1321, and #1322 concern the withdrawn application. Reassess their dependency changes during resumption rather than merging them into this repository after removal. #1320 is repurposed as the withdrawal PR; its earlier application repairs remain at the recovery commit above.
