# solution/frontend/README.md

# Project Management Dashboard Demo Frontend

This directory contains the React + Plotly frontend for the PMO Dashboard demo.

## Getting Started

Install dependencies:
```bash
cd solution/frontend
npm install
```

Run the development server:
```bash
npm start
```

The app will launch at http://localhost:3000 and display:
- KPI Panel  
- Gantt Chart  
- Risk Matrix  
- Milestone Tracker  
- Resource Heatmap  
- Upcoming Tasks Table

## Connecting to Snowflake

Replace `src/data/mockData.js` with API calls to your Snowflake-backed service. For example:
```js
import axios from 'axios';

export const fetchProjectKPIs = () = axios.get('/api/kpis');
```

## Setup

1. cd solution/frontend  
2. npm install  
3. npm start

## Structure

- src/components: reusable chart and panel components  
- src/pages/Dashboard.js: main layout aggregating components  
- src/data: mock data for demonstration; replace with API calls to Snowflake  

## Features

- Gantt Chart using Plotly.js  
- Risk Matrix scatter grid  
- KPI Panel (SPI & CPI)  
- Milestone Tracker table  
- Resource Load Heatmap  
- Upcoming Tasks table  

## Next Steps

- Connect to Snowflake via a serverless API  
- Implement role-based views and filters  
- Enhance styling and accessibility
