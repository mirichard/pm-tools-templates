# Golden NFR reference example (#1116)

This fixture extends `examples/web-store-input.md` into a synthetic regulated
laboratory-supply ordering workflow. It retains the shopping/cart/order idiom
while making account access, audit records, interrupted-order recovery and
keyboard interaction explicit. No real customer, payment or patient data is used.

The planned neutral and `fda-21-cfr-11` runs use the same source. Overlay selection
is an illustrative opt-in audit-record scenario, not a compliance assertion.
Numeric targets and measurement conditions remain exactly as the generator's
NEEDS INPUT placeholders; this example must never manually fill them in.

Work in progress: generated artifacts and verified regeneration instructions
will be added after successful full-pipeline runs. This is not yet an eval gold
standard or a completed reference for #1113/#1114.

## Explicit synthetic-example choices

The owner specified state transitions, correction flags and audit events. To
resolve the accompanying warnings, this fixture chooses case-insensitive
substring search on product name/identifier, hides variant controls when absent,
requires a nonempty single-sentence comment per correction flag (approval comments
optional; no numeric length cap), uses read-only HTML receipts retained for the
life of the order record, and preserves all prior review metadata in immutable
audit entries. These are fixture-specific functional choices, not recommended
production retention, performance or compliance commitments. No deletion/expiry
operation is modeled. The correction branch is optional; Under Review can move
directly to Approved. Cancellation and fulfillment behavior are explicit in the
source rather than inferred by a model.
