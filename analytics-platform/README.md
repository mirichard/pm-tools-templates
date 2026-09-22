# Analytics collection SDK

This directory currently implements a TypeScript event collection SDK. It does
not contain an analytics API server, dashboard, database migrations, processing
pipeline, or deployed service. Server-related dependencies in `package.json` are
not evidence that those features exist.

## What exists

- `src/sdk/collector.ts`: event consent checks, an in-memory queue, HTTP batch
  submission, and optional local storage of consent and metadata.
- `src/index.ts`: exports the collector and convenience functions.
- `src/sdk/collector.test.ts`: ten tests covering consent, selected sanitization
  behavior, network rejection, and storage fallback.
- TypeScript build, ESLint, Jest, and dependency audit coverage in repository CI.

## Getting started

Use Node.js 24, matching repository CI. From the repository root:

```sh
npm ci --prefix analytics-platform
npm --prefix analytics-platform run lint
npm --prefix analytics-platform run build
npm --prefix analytics-platform test -- --runInBand
```

The build produces CommonJS `dist/index.js` and TypeScript declarations. There
is no server to start or dashboard URL to open. The [development guide](docs/development.md)
includes a local example that needs no external service.

## Documentation

- [SDK API and outbound request format](docs/api.md)
- [Consent behavior](docs/consent.md)
- [Data handling and limitations](docs/privacy.md)
- [Dashboard status and proposed scope](docs/dashboard.md)
- [Development and validation](docs/development.md)

## Proposed platform work

An ingestion API, durable storage, aggregate queries, dashboards, and data
lifecycle controls would each require a specification, implementation, and
validation before being advertised as available. The previous 2025 milestones,
service URLs, uptime targets, and compliance claims were not implementation
or release evidence. Historical drafts remain in Git history.
