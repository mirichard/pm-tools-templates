# 📊 Curation Dashboard

**Live Demo:** [http://localhost:8080](http://localhost:8080) (when backend is running)

This directory contains the frontend for the Template Curation Dashboard.

## What It Is
- **Interactive Analytics** - Real-time visualization of template metrics
- **Responsive Design** - Works on desktop and mobile
- **Dynamic Data** - Fetches live data from the backend API
- **Zero Dependencies** - Vanilla HTML, CSS, and JavaScript

## Key Features

| Feature | Description |
|---------|-------------|
| **Template Tier Chart** | Pie chart of template classifications |
| **Score Distribution Chart** | Bar chart of UX, Functionality, Docs scores |
| **Template Table** | Filterable, searchable list of all templates |
| **Tier Filters** | Quick filtering by Premium, Featured, etc. |
| **Responsive Layout** | Adapts to different screen sizes |

## File Structure

```
curation-dashboard/
├── index.html       # Dashboard UI markup
├── dashboard.js     # Data fetching and chart logic
└── README.md        # This file
```

## How It Works
1. **Fetches Data**
   - On page load, `dashboard.js` makes a `fetch` request to `http://localhost:8080/metrics`.

2. **Processes Metrics**
   - Aggregates data for charts (tier distribution, score counts).
   - Populates the template table with detailed metrics.

3. **Renders Visualizations**
   - Uses Chart.js to create interactive charts.
   - Builds the template table with dynamic data.
   - Sets up event listeners for search and filtering.

## Local Development

**Prerequisites:**
- Node.js and npm
- The backend server must be running.

**Steps:**
1. Clone the repository.
2. Start the backend server (`cd backend && npm run dev`).
3. Open `curation-dashboard/index.html` in your browser.

*Note: Direct opening of `index.html` (file://) will fail due to CORS. You must use the server at `localhost:8080`.*

## Customization

### **Changing Chart Types**
- Edit `dashboard.js` and modify the `type` property in the Chart.js configuration.
- *Example: `type: 'doughnut'` for the tier distribution.* 

### **Updating Colors**
- The color schemes are defined at the top of `dashboard.js` in the `tierColors` and `scoreColors` objects.

### **Modifying Table Columns**
- The table headers are in `index.html` and the data population logic is in `dashboard.js` (`populateTemplateTable` function).

## Troubleshooting

**Dashboard is blank?**
- Check the browser console (F12) for errors.
- Ensure the backend server is running on `localhost:8080`.
- Verify that `backend/public/metrics/curation-metrics.json` exists.

**Charts not loading?**
- Confirm Chart.js is properly loaded from the CDN in `index.html`.
- Check for JavaScript errors in the browser console.

**Data not up to date?**
- Run `npm run extract` in the `backend` directory to refresh the metrics.
