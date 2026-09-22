# SDK consent behavior

The application must obtain the user's decision and pass it to the collector.
The SDK does not display a consent dialog or provide a consent-management service.

## Event categories

| Flag | Events gated by this flag |
|---|---|
| `usageAnalytics` | Template download/completion, consent/metadata updates, and unrecognized custom event types |
| `featureAdoption` | `cli_usage` and `integration_usage` |
| `performanceData` | `performance_metric` |
| `feedbackData` | `feedback_submitted` |
| `geographicData` | Stored flag only; no geographic collector or dedicated event mapping exists |

When storage is absent or its JSON cannot be parsed, defaults are all false.
`requestConsent()` replaces the complete consent object: omitted options become
false. Granting usage consent also queues `consent_updated` and initiates a flush.
Valid JSON loaded from storage is not schema-validated.

## Storage and revocation

Consent is stored under `pm-tools-analytics-consent` when local storage is
available. `getConsent()` returns a copy of the current flags. Storage exceptions
are caught, so a successful call does not prove persistence succeeded.

`revokeConsent()` clears the event queue, resets flags, and removes both consent
and metadata storage keys. It does not clear the instance's in-memory metadata
or user ID, cancel in-flight requests, or request remote data deletion. Ordinary
`requestConsent()` changes do not clear already queued events.

The SDK has no durable consent audit trail, policy versioning, user identity
verification, preference synchronization, or built-in export/delete service.
These are implementation boundaries, not claims of legal compliance. See
[data handling](privacy.md) for the fields that may leave the process.
