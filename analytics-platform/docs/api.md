# Analytics SDK API

Source: [`collector.ts`](../src/sdk/collector.ts), exported through
[`src/index.ts`](../src/index.ts). This is an SDK reference and description of
outbound requests. No receiving HTTP API is implemented in this directory.

## Construction and lifecycle

`new AnalyticsCollector({ apiUrl, apiKey, userId?, flushIntervalMs? })` creates an
instance. The flush interval defaults to 30,000 ms; passing zero also selects
that default. `userId` is included in events when provided.

| Method | Current behavior |
|---|---|
| `requestConsent(options)` | Replaces all consent flags; omitted flags become false. Returns the resulting consent asynchronously. No UI is shown. |
| `getConsent()` | Returns a shallow copy of current flags. |
| `setUserMetadata(metadata)` | Merges metadata, attempts local storage, and records an update event if usage consent permits it. |
| `track(type, data?)` | Checks the event category and queues shallowly sanitized data. |
| `flush()` | Sends the queued batch; requeues on a rejected fetch promise. |
| `revokeConsent()` | Resets flags, clears queued events, and removes the two storage keys. Does not recall in-flight requests or delete server data. |
| `destroy()` | Stops the timer and initiates a final, unawaited flush. |

Typed metadata fields are `role`, `industry`, `methodology`, `teamSize`, and
`experience`. Runtime input validation is not implemented.

## Event helpers

| Method | Event |
|---|---|
| `trackTemplateDownload(templateName, methodology)` | `template_download` |
| `trackTemplateCompletion(templateName, completionTime)` | `template_completion`; time is recorded as `completionTimeMs` |
| `trackCLIUsage(command, success)` | `cli_usage` |
| `trackFeedback(templateName, rating, comment?)` | `feedback_submitted`; sends comment presence and length, not comment text |
| `trackPerformance(action, duration, success)` | `performance_metric`; duration is recorded as `durationMs` |

`initAnalytics(config)` creates the global collector; `getAnalytics()` returns
it or null. Module-level `trackEvent` and the five event helpers delegate to that
instance and do nothing when it has not been initialized.

## Outbound HTTP request

Each nonempty flush calls `fetch` with:

- URL: the configured `apiUrl` followed by `/analytics/events`.
- Method: `POST`.
- Headers: `Content-Type: application/json`, `Authorization: Bearer <apiKey>`,
  and `X-Session-ID` containing the generated session ID.
- JSON body: `{ events, metadata, consent }`.

Each event contains `type`, `data`, a millisecond `timestamp`, `sessionId`, and
optional `userId`. The session ID combines a timestamp and six random bytes.
The SDK does not provision credentials or validate a response schema. There is
no official base URL, JWT issuer, report endpoint, query API, webhook API, or
server-side rate-limit contract in this implementation.

## Delivery limitations

A rejected fetch promise requeues the batch and logs a warning. HTTP 4xx/5xx
responses do not normally reject fetch; this implementation does not inspect
`response.ok` or status, so those batches are not requeued. There is no durable
event queue, retry backoff, timeout, batch limit, deduplication, or delivery
acknowledgement. Critical event types (`error`, `security_incident`, and
`consent_updated`) initiate an immediate flush only if their consent check passes.

See [consent](consent.md), [data handling](privacy.md), and the
[local example](development.md#local-sdk-example).
