# solution/frontend/README.md

# Project Management Dashboard Demo Frontend

This directory contains a React-based frontend showcasing advanced PM analytics powered by Snowflake.

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
