# Local Testing Guide

This project includes end-to-end tests and performance checks. Use the locally installed binaries to avoid global shims.

## Prerequisites
- Node.js and npm
- Chrome/Chromium (for Lighthouse)

## Install

```
npm ci --prefix site
```

## Run the demo server

```
node site/server.js
# Server listens on http://localhost:5173
```

## End-to-end tests (Playwright + axe)

```
# In one terminal, ensure the server is running
npx --yes wait-on http://localhost:5173
./site/node_modules/.bin/playwright test --config=site/playwright.config.ts --reporter=list
```

Expected: 2 tests, all passing.

## Lighthouse (local runner)

Run Lighthouse using the project’s installed binary (no npx):

```
./site/node_modules/.bin/lighthouse http://localhost:5173/ \
  --preset=desktop \
  --chrome-flags="--headless=new" \
  --output=json --output=html \
  --output-path=./site/lighthouse/report
```

Alternatively, to save JSON only:

```
./site/node_modules/.bin/lighthouse http://localhost:5173/ \
  --preset=desktop \
  --chrome-flags="--headless=new" \
  --output=json \
  --output-path=./site/lighthouse.json
```

The project’s thresholds are defined in `site/lighthouserc.json`.

## CI helper

The `ci` script will start the server, wait-on, run Playwright, and run LHCI autorun:

```
npm run ci --prefix site
```

