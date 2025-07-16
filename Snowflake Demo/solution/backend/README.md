# Project Management Dashboard Demo Backend

This directory contains Snowflake pipeline scripts and integration tests for the PMO Dashboard demo.

## Contents
- advanced_medallion_schema.sql: Schema setup and secure view creation
- integration_tests_clean.sql: Clean end-to-end integration test for RAW → SILVER → GOLD

## Running Integration Tests

Execute the following in your terminal:

```bash
snowsql -c mytrial -f solution/backend/integration_tests_clean.sql
```

This will:
1. Ingest demo RAW data from `PM_DASHBOARD_DB.RAW` into `PMO_DASHBOARD_DB.RAW`  
2. Transform data in the `SILVER` schema  
3. Publish a secure `project_kpis` view in `GOLD`  
4. Validate the view returns the expected rows and counts

## Next Steps
- Expose the secure view via a serverless API (e.g. AWS Lambda + API Gateway)  
- Secure the API with role-based access  
- Connect the frontend to the API for live data consumption

