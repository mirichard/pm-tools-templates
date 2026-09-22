# PMO Dashboard Frontend

This directory contains the React frontend for the PMO Dashboard demo.

## Setup

Use Node.js 24 LTS (matching CI).

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Start the development server:

   ```bash
   npm start
   ```

   The app will be available at http://localhost:3000.

## Mock Data Mode

By default, the dashboard uses mock data in `src/data/mockData.js`. To switch to live data:

1. Update or replace `src/data/api.js` with your real API calls.
2. Modify `src/pages/Dashboard.js` to import and use `fetchProjectKPIs` instead of mock data.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

The build artifacts will be output to the `build/` directory.

## Tests and Security Validation

```bash
npm test
npm run audit:all
npx playwright install chromium
npm run build && npm run test:browser
```

Jest runs the component tests. The full dependency audit includes development
and build tooling and fails on low severity or higher findings. The Snowflake
dependency audit workflow runs this full check on frontend changes and verifies
dashboard rendering and filter reset in Chromium against both the development
server and production build. The shared CI runtime audit remains separate.

Rsbuild replaces the deprecated Create React App tooling. The existing React
source files and HTML template are retained. Production source maps are disabled
in `rsbuild.config.mjs`; CRA's `GENERATE_SOURCEMAP` setting is no longer used.
