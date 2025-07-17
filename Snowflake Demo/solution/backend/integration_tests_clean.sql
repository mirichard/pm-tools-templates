-- integration_tests_clean.sql: Clean end-to-end test for PMO_DASHBOARD_DB pipeline

-- 1. Setup context
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PMO_DASHBOARD_DB;

-- 2. Ingest RAW layer from demo data
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 3. Transform in SILVER schema
CREATE OR REPLACE SCHEMA SILVER;
USE SCHEMA SILVER;

CREATE OR REPLACE TABLE projects   AS SELECT * FROM RAW.projects;
CREATE OR REPLACE TABLE milestones AS SELECT * FROM RAW.milestones;
CREATE OR REPLACE TABLE tasks      AS SELECT * FROM RAW.tasks;

CREATE OR REPLACE TABLE task_summary AS
SELECT
  p.project_id,
  COUNT(t.task_id) AS total_tasks,
  SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN t.status != 'Completed' THEN 1 ELSE 0 END) AS pending_tasks
FROM RAW.tasks t
JOIN RAW.milestones m ON t.milestone_id = m.milestone_id
JOIN RAW.projects p  ON m.project_id   = p.project_id
GROUP BY p.project_id;

CREATE OR REPLACE TABLE budgets AS SELECT * FROM RAW.budgets;

-- 4. Publish secure view in GOLD schema
CREATE OR REPLACE SCHEMA GOLD;
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW project_kpis AS
SELECT
  p.project_id,
  p.name,
  p.start_date,
  p.end_date,
  COALESCE(s.total_tasks,0) AS total_tasks,
  COALESCE(s.completed_tasks,0) AS completed_tasks,
  COALESCE(s.pending_tasks,0) AS pending_tasks,
  ROUND(100.0 * COALESCE(s.completed_tasks,0) / NULLIF(s.total_tasks,0),2) AS percent_complete,
  COALESCE(b.baseline_cost,0) AS baseline_cost,
  COALESCE(b.actual_cost,0) AS actual_cost,
  COALESCE(b.forecast_cost,0) AS forecast_cost,
  CASE WHEN COALESCE(b.actual_cost,0) > COALESCE(b.baseline_cost,0) THEN 'Over Budget' ELSE 'On Budget' END AS budget_status
FROM SILVER.projects p
LEFT JOIN SILVER.task_summary s ON p.project_id = s.project_id
LEFT JOIN SILVER.budgets b      ON p.project_id = b.project_id;

-- 5. Validate the secure view
SELECT COUNT(*) AS kpi_count FROM project_kpis;
SELECT project_id, total_tasks, completed_tasks, pending_tasks, percent_complete, budget_status
FROM project_kpis ORDER BY project_id LIMIT 5;

