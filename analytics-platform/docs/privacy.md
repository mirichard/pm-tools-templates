# SDK data handling

This document describes current code behavior. It is not a deployed service's
privacy policy or evidence of regulatory compliance.

## Data sent

Every nonempty batch includes events, the current metadata object, and consent
flags. Events may include the configured user ID and always include a generated
session ID and timestamp. The SDK does not anonymize or hash user IDs.

`track()` removes only the top-level event-data keys `email`, `password`, `token`,
`apiKey`, and `personalInfo`. Top-level strings longer than 1,000 characters are
truncated to 1,000 characters plus an ellipsis. Nested objects are not recursively
sanitized, and batch metadata does not pass through this filter. Callers must
choose safe input fields; the filter is not a general personal-data detector.

`trackFeedback()` sends the rating and comment presence/length, not comment text.
This does not constrain what callers can send through custom events.

## Local and remote storage

Events are queued in memory. Consent and metadata are optionally written to
`pm-tools-analytics-consent` and `pm-tools-user-metadata` in local storage, without
SDK-level encryption. Missing or inaccessible storage is tolerated. Metadata can
remain in memory after consent revocation; see [consent behavior](consent.md).

The caller supplies the endpoint URL and API key. The code does not enforce
HTTPS, encrypt stored events, implement retention policies, manage access roles,
or provide remote data export/deletion. No receiving service or database exists
in this directory, so server storage and security properties cannot be inferred
from this SDK.

## Work needed before broader deployment

A deployed system would need explicit data and consent contracts, validated
transport/storage controls, reliable delivery semantics, retention and deletion
behavior, and appropriate review of its actual operating context. None of the
previous documentation's compliance, encryption, retention-period, or uptime
claims should be treated as implemented guarantees.

See [API delivery limitations](api.md#delivery-limitations) and
[development validation](development.md#validation-boundaries).
