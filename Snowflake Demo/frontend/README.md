# PMO Dashboard Frontend

This directory contains the React frontend for the PMO Dashboard demo.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Disable source map generation to suppress Plotly warnings (already configured in `.env`).

3. Start the development server:

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

