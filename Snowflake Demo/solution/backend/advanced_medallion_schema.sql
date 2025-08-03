-- solution/backend/advanced_medallion_schema.sql: Enhanced medallion schema with dynamic SQL and secure views
-- Execute as ACCOUNTADMIN or SECURITYADMIN

-- Enable time travel (set retention)
ALTER ACCOUNT SET DATA_RETENTION_TIME_IN_DAYS = 1;

-- Create DB & schemas
CREATE OR REPLACE DATABASE PMO_DASHBOARD_DB;
USE DATABASE PMO_DASHBOARD_DB;

-- Bronze: Raw landing
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE STAGE s_raw FILE_FORMAT = (TYPE = 'CSV');

-- silver: curated transforms with dynamic SQL
CREATE OR REPLACE SCHEMA SILVER;

-- Dynamic SQL to load all CSVs from s_raw into tables
DECLARE
  table_rec RECORD;
BEGIN
  FOR table_rec IN (SELECT DISTINCT METADATA$FILENAME f FROM @s_raw) DO
    EXECUTE IMMEDIATE
      'COPY INTO SILVER.' || REGEXP_SUBSTR(table_rec.f, '^[^\.]+') ||
      ' FROM @s_raw/' || table_rec.f || ' FILE_FORMAT = (TYPE = ''CSV'', SKIP_HEADER = 1)';
  END FOR;
END;

-- Gold: Consumption with secure views
CREATE OR REPLACE SCHEMA GOLD;

-- Example secure view wrapping Silver data with masking
CREATE OR REPLACE SECURE VIEW GOLD.project_kpis AS
SELECT
  p.project_id,
  p.name,
  p.start_date,
  p.end_date,
  t.total_tasks,
  t.completed_tasks,
  t.pending_tasks,
  ROUND(100.0 * completed_tasks / NULLIF(total_tasks,0),2) AS percent_complete,
  b.baseline_cost,
  b.actual_cost,
  b.forecast_cost,
  CASE WHEN actual_cost > baseline_cost THEN 'Over Budget' ELSE 'On Budget' END AS budget_status
FROM SILVER.projects p
JOIN SILVER.task_summary t ON p.project_id = t.project_id
LEFT JOIN SILVER.budgets b ON p.project_id = b.project_id;

-- Grants
GRANT USAGE ON DATABASE PMO_DASHBOARD_DB TO ROLE ANALYTICS_ROLE;
GRANT SELECT ON ALL SCHEMAS IN DATABASE PMO_DASHBOARD_DB TO ROLE ANALYTICS_ROLE;

