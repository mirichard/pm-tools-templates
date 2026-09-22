# Analytics dashboard status

No dashboard is implemented in `analytics-platform`. There is no dashboard
subdirectory, development command, login URL, report builder, live analytics
stream, or dashboard configuration schema to run here.

The repository's separate [`dashboard-mvp`](../../dashboard-mvp/) is a different
application. Its existence does not establish an integration with this SDK or
an analytics backend.

## Proposed scope

Before implementing a dashboard, define the ingestion and query contracts,
meaningful aggregate metrics, access controls, consent and retention behavior,
and the data freshness and failure states shown to users. Then build and test
those components against a real service. This is proposed work without a release
date or availability commitment.

The current executable component is the [collection SDK](../README.md).
Its [outbound request format](api.md#outbound-http-request) describes what a
future ingestion service would receive; no such service ships with this package.
