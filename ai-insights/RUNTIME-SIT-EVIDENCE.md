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

- Docker, Podman and Trivy are unavailable in this execution environment. Image
  build, container health/security and Compose behavior were not executed. A
  dependency audit is not a container scan. On a capable runner, build the image,
  run health/request/shutdown checks, and scan its exact immutable digest with
  the repository's required vulnerability policy. Do not mark this gate passed
  from the Dockerfile edit or native-process test.
- Saved-result persistence and automatic trained-artifact reload are not accepted.
  The cache is memory-only; declared Compose volumes do not establish persistence.
- No accessible rendered dashboard host or UAT participant/access confirmation is
  available. The client hook tests do not establish UAT or browser rendering.
- No latency/concurrency throughput acceptance threshold is established. These
  tests prove bounded request association, not load capacity or performance SLAs.
- Existing full-suite and trained-model gates remain unmet; #1372 stays open.
  No restoration to main or production deployment is authorized by this checkpoint.
