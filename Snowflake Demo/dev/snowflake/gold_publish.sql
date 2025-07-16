-- gold_publish.sql: Create consumption views for dashboard in CONSUMPTION schema
-- Run after silver_transform

USE WAREHOUSE COMPUTE_WH;
USE DATABASE PM_DASHBOARD_DB;
USE SCHEMA CONSUMPTION;

-- Create view for project overview
-- e.g. summarizing key metrics
CREATE OR REPLACE VIEW PROJECT_OVERVIEW AS
SELECT
  ps.project_id,
  ps.project_name,
  ps.total_tasks,
  ps.completed_tasks,
  ps.pending_tasks,
  ps.percent_complete,
  td.resource_name,
  COUNT(td.task_id) AS assigned_tasks
FROM CURATED.PROJECT_SUMMARY ps
LEFT JOIN CURATED.TASK_DETAIL td
  ON ps.project_id = td.project_id
GROUP BY
  ps.project_id,
  ps.project_name,
  ps.total_tasks,
  ps.completed_tasks,
  ps.pending_tasks,
  ps.percent_complete,
  td.resource_name;

-- Create view for upcoming tasks
CREATE OR REPLACE VIEW UPCOMING_TASKS AS
SELECT
  td.task_id,
  td.project_id,
  td.task_name,
  td.status,
  td.due_date,
  td.resource_name
FROM CURATED.TASK_DETAIL td
WHERE td.due_date > CURRENT_DATE()
ORDER BY td.due_date ASC;

-- Grants to SYSADMIN for consumption
GRANT SELECT ON ALL VIEWS IN SCHEMA CONSUMPTION TO ROLE SYSADMIN;
