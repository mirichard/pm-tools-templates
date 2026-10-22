# Analytics SDK development

## Supported local workflow

Use Node.js 24 and npm. Run from the repository root:

```sh
npm ci --prefix analytics-platform
npm --prefix analytics-platform run lint
npm --prefix analytics-platform run build
npm --prefix analytics-platform test -- --runInBand
npm --prefix analytics-platform audit
```

`test:watch` is also available in the package. There are no `start`, `dev`,
`dev:api`, `dev:dashboard`, `db:migrate`, or `db:seed` scripts. PostgreSQL, Redis,
Kafka, Python, Docker, and a separate dashboard checkout are not needed to run
these SDK checks.

## Local SDK example

After building, run this from the repository root. It replaces `fetch` with a
local recorder; it does not contact a service or demonstrate server ingestion.
The consent setting is explicit test input, not a substitute for a user consent UI.

```sh
node <<'JS'
const assert = require('node:assert/strict');
const { AnalyticsCollector } = require('./analytics-platform/dist/index.js');
const requests = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  requests.push({ url, body: JSON.parse(options.body) });
  return { ok: true };
};
(async () => {
  const collector = new AnalyticsCollector({
    apiUrl: 'https://analytics.example.invalid',
    apiKey: 'local-example-only',
    flushIntervalMs: 3600000,
  });
  try {
    await collector.requestConsent({ featureAdoption: true });
    collector.trackCLIUsage('init', true);
    await collector.flush();
    assert.equal(requests.length, 1);
    assert.equal(requests[0].body.events[0].type, 'cli_usage');
    console.log('Recorded one local CLI event');
  } finally {
    collector.destroy();
    globalThis.fetch = originalFetch;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
JS
```

## Runtime boundaries

The collector imports Node's `crypto` and uses `fetch`, timers, and optional
`localStorage`. The checked build is CommonJS. A browser bundle and browser
compatibility have not been validated. Missing or inaccessible local storage is
caught, so consent/metadata persistence is unavailable in that case.

Construction starts a timer. Call `destroy()` when finished; it clears the timer
and starts a final flush without awaiting it. Await `flush()` before destruction
when your caller needs to wait for the current send attempt. Repeated
`initAnalytics()` calls replace the global reference without destroying the
previous collector; use one instance or explicitly destroy the earlier one.

## Validation boundaries

The ten existing tests exercise SDK behavior with mocked transport. They do not
validate a server, browser deployment, HTTP error retries, concurrent flushing,
model accuracy, or regulatory compliance. See [API behavior](api.md) and
[data handling](privacy.md) before designing an integration.
