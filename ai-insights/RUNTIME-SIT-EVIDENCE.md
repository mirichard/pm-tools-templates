# Runtime SIT checkpoint — 09/25/2026

Scope: #1298 / #1372 under #1329. PR #1378 remains draft, stacked on #1377.
Base: 6fa52dbe04f8cb56429de3ab749611bec6106b88. Evidence belongs to the commit
introducing this record; obtain its exact SHA from the PR commit history.
Environment: Node 24.19.0, npm 11.9.0, Linux, TensorFlow.js CPU backend.

## Demonstrated defects and repairs

Eight of nine new failure-path cases failed before repairs. Three additional
malformed-envelope cases also failed before their repair. All now pass.

- Failed dashboard refresh retained old success; overlapping calls could overwrite
  newer state. Request generations now restrict state changes to the latest call,
  clear prior insights on refresh and invalidate pending display work on clear.
- Native fetch TypeError network failures were not retried. Retry handling includes
  them; abort timeouts now remain active through response body consumption.
- An in-flight prediction could repopulate an explicitly cleared cache. Cache
  generations prevent that write. Cloning cached values prevents caller mutation
  from corrupting later responses.
- Malformed success envelopes were accepted as insights. They now reject clearly.
- Docker started src/index.js, which runs a demo without an HTTP listener. It now
  starts src/api/server.js. Added a build-context exclusion file for local modules,
  environment secrets, data, logs and experiment files.

## Reproduction and results

Run from ai-insights:

```sh
npm run lint
npm test -- --runInBand tests/unit/recovery-failure-paths.test.js tests/unit/recovery-server.test.js tests/unit/dashboard-hooks.test.js
npm test -- --runInBand
npm audit --json
```

| Evidence | Result |
| --- | --- |
| Focused regression / HTTP / hooks | 17 passed |
| Required source lint | Passed |
| Complete final suite | 105 passed / 9 failed, 114 total |
| npm dependency audit | 0 vulnerabilities reported |
| Actual API entrypoint subprocess | Production-mode health healthy; SIGTERM exit 0 |
| Fresh server cycles | Two start/request/shutdown cycles; cache empty at each start; model tensors return to baseline |

Real HTTP tests cover invalid input before inference, controlled inference failure,
subsequent success, concurrent project association, cache reuse and explicit
invalidation. Controlled predictions test transport, not accuracy. Restart testing
uses the real untrained risk model but makes no claim of stable predictions.

The nine remaining final-run failures concern risk classifications, confidence,
across-instance consistency, integration prediction consistency, tight timeline,
technology-stack factors and timeline advice. No failed test is excluded or waived.
Random untrained model outputs still make some failure counts variable.

## Remaining gates and handoff

- Container build/runtime and HIGH/CRITICAL scan now pass on GitHub Actions;
  see the dated checkpoint below. Compose behavior remains unverified.
- Saved-result persistence and automatic trained-artifact reload are not accepted.
  The cache is memory-only; declared Compose volumes do not establish persistence.
- No accessible rendered dashboard host or UAT participant/access confirmation is
  available. The client hook tests do not establish UAT or browser rendering.
- No latency/concurrency throughput acceptance threshold is established. These
  tests prove bounded request association, not load capacity or performance SLAs.
- Existing full-suite and trained-model gates remain unmet; #1372 stays open.
  No restoration to main or production deployment is authorized by this checkpoint.

## Container checkpoint — 2026-09-25

[Actions run 36154968749](https://github.com/mirichard/pm-tools-templates/actions/runs/36154968749)
passed all container steps and the required Container scan gate.

- PR #1378 head: `9d9970e649fa1b1c6b4842d5617ed7c4f3070043`.
- Tested PR merge checkout: `5e6d4752a8feb0deffa7e5abb87182e8d57c5515`.
- Image: `sha256:c07cc0fe38f6b1371c9f9fa6170ed426034a35eb3276f1f00cd31717773ae0b4`.
- Base resolved to `node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1`.
- Non-root process; API health/initialized engine; valid prediction disclosing
  untrained status; invalid-input HTTP 400; declared Docker HEALTHCHECK; and
  graceful stop with exit 0/no OOM all passed.
- Trivy v0.74.0 reported zero HIGH/CRITICAL findings across Alpine 3.24.2 and
  Node package results. This is a dated vulnerability scan, not a claim about
  lower severities or all security properties. No ignore file or waiver added.
- Full artifact `container-evidence-36154968749-1`, ID `10873615298`, expires
  2026-10-25. Its ZIP SHA256 was verified against GitHub's artifact digest:
  `d3ff82eff4e996abd688ae6e515bfa0067c69eaf281cf4d74e73bdd80adc970c`.
- Durable extracted responses, identities, smoke result and scan summary are in
  [evidence/container-36154968749](evidence/container-36154968749/).
  The full package inventory and runner logs remain in the Actions artifact.
  The post-stop inspection reports unhealthy because the process has stopped;
  its last HEALTHCHECK exited 0, and the smoke script required healthy before stop.

Continuation: retain full artifact before expiry if needed; rerun these checks
when runtime/dependencies/base image change. Next resolve proposed risk-rule
inputs/semantics, persistence expectations and dashboard/UAT access. This one
successful container run does not satisfy the two complete green app suites,
trained-model acceptance, persistence, load performance, Compose or UAT gates.
Both draft PRs remain unmerged, and #1298/#1372/#1329 remain open.
