# Webhook framework

This Node.js service accepts signed HTTP requests at `POST /webhook/:provider`.
The GitHub and Jira handlers currently return event summaries; they do not update
external systems. Other provider integrations and schema contracts are not implemented.

## Install, test, and run

Use Node.js 24. From the repository root:

```sh
npm ci --prefix integrations/webhook-framework
npm run test:webhook
```

The root command delegates to the framework's local Jest installation. All five
suites run, covering handler summaries, HMAC verification, logging, and HTTP rate
limiting with and without explicitly configured proxy trust.

To start the service, supply `WEBHOOK_SECRET` through your environment, then run:

```sh
npm --prefix integrations/webhook-framework start
```

`PORT` defaults to 8787. The entry point is `src/server.mjs`. The current signature
scheme is a demonstration SHA-256 HMAC over the raw body, read from `x-signature`
or `x-hub-signature-256`; provider-specific authentication has not been validated
for every provider. The service rejects missing or invalid signatures and limits
requests. Logging and timing metrics currently go to stdout.

## CI coverage

`.github/ci-coverage.json` includes this package in the sub-app matrix. Tests and
dependency audit are required and have no waiver. There is no configured linter
or compilation step; neither is reported as a passing check. Dependabot monitors
the local manifest and lockfile.

The retry helper exists separately but is not connected to request processing.
