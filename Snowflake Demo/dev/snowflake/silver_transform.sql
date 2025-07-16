-- silver_transform.sql: Transform raw data into curated tables in CURATED schema
-- Run after bronze_setup

USE WAREHOUSE COMPUTE_WH;
USE DATABASE PM_DASHBOARD_DB;
USE SCHEMA CURATED;

-- Create project summary table
CREATE OR REPLACE TABLE PROJECT_SUMMARY AS
SELECT
  p.project_id,
  p.project_name,
  p.start_date,
  p.end_date,
  COUNT(t.task_id)                  AS total_tasks,
  SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN t.status != 'Completed' THEN 1 ELSE 0 END) AS pending_tasks,
  ROUND(100.0 * SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.task_id),0), 2) AS percent_complete
FROM RAW.PROJECTS p
LEFT JOIN RAW.TASKS t
  ON p.project_id = t.project_id
GROUP BY p.project_id, p.project_name, p.start_date, p.end_date;

-- Create task detail table with resource info
CREATE OR REPLACE TABLE TASK_DETAIL AS
SELECT
  t.task_id,
  t.project_id,
  t.task_name,
  t.status,
  t.due_date,
  r.resource_name,
  r.role              AS resource_role
FROM RAW.TASKS t
LEFT JOIN RAW.RESOURCES r
  ON t.owner = r.resource_name;

-- Create resource workload table
CREATE OR REPLACE TABLE RESOURCE_WORKLOAD AS
SELECT
  r.resource_id,
  r.resource_name,
  r.role,
  COUNT(t.task_id) AS assigned_tasks
FROM RAW.RESOURCES r
LEFT JOIN RAW.TASKS t
  ON r.resource_name = t.owner
GROUP BY r.resource_id, r.resource_name, r.role;

-- Grants to SYSADMIN
GRANT SELECT ON ALL TABLES IN SCHEMA CURATED TO ROLE SYSADMIN;

