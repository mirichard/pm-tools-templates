-- integration_tests.sql: End-to-end test for PMO_DASHBOARD_DB pipeline

-- 1. Setup context
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PMO_DASHBOARD_DB;

-- 2. Ingest RAW from demo database
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 3. Transform data in SILVER schema
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

CREATE OR REPLACE SECURE VIEW GOLD.project_kpis AS
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

-- 5. Integration test assertions
SELECT COUNT(*) AS kpi_count FROM GOLD.project_kpis;

SELECT project_id, total_tasks, completed_tasks, pending_tasks, percent_complete, budget_status
FROM GOLD.project_kpis ORDER BY project_id LIMIT 5;

-- 1. Setup context
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PMO_DASHBOARD_DB;

-- 2. Ingest RAW from demo database
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 3. Transform into SILVER
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

-- 4. Publish secure view in GOLD
CREATE OR REPLACE SCHEMA GOLD;
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW GOLD.project_kpis AS
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

-- 5. Integration test assertions
SELECT COUNT(*) AS kpi_count FROM GOLD.project_kpis;
SELECT * FROM GOLD.project_kpis ORDER BY project_id LIMIT 5;

-- 1. Setup context
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PMO_DASHBOARD_DB;

-- 2. Populate RAW layer from demo data
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 3. Transform data in SILVER schema
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
JOIN RAW.projects p ON m.project_id = p.project_id
GROUP BY p.project_id;

CREATE OR REPLACE TABLE budgets AS
SELECT * FROM RAW.budgets;

-- 4. Create secure view in GOLD schema
CREATE OR REPLACE SCHEMA GOLD;
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW GOLD.project_kpis AS
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
SELECT COUNT(*) AS kpi_count FROM GOLD.project_kpis;
SELECT * FROM GOLD.project_kpis ORDER BY project_id LIMIT 5;

-- 1. Setup context
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PMO_DASHBOARD_DB;

-- 2. Populate RAW layer from demo data
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 3. Transform data in SILVER schema
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
JOIN RAW.projects p ON m.project_id = p.project_id
GROUP BY p.project_id;

CREATE OR REPLACE TABLE budgets AS
SELECT * FROM RAW.budgets;

-- 4. Create secure view in GOLD schema
CREATE OR REPLACE SCHEMA GOLD;
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW GOLD.project_kpis AS
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
LEFT JOIN SILVER.budgets b ON p.project_id = b.project_id;

-- 5. Validate the secure view
SELECT COUNT(*) AS kpi_count FROM GOLD.project_kpis;
SELECT * FROM GOLD.project_kpis ORDER BY project_id LIMIT 5;

-- 1. Setup context and RAW ingestion
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PMO_DASHBOARD_DB;

CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 2. Transform in SILVER schema
CREATE OR REPLACE SCHEMA SILVER;
USE SCHEMA SILVER;

CREATE OR REPLACE TABLE projects AS SELECT * FROM RAW.projects;
CREATE OR REPLACE TABLE milestones AS SELECT * FROM RAW.milestones;
CREATE OR REPLACE TABLE tasks AS SELECT * FROM RAW.tasks;

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

-- 3. Create secure view in GOLD schema
CREATE OR REPLACE SCHEMA GOLD;
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW GOLD.project_kpis AS
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

-- 4. Validate the secure view
SELECT COUNT(*) AS kpi_count FROM GOLD.project_kpis;
SELECT *
FROM GOLD.project_kpis
ORDER BY project_id
LIMIT 5;

-- 1. Setup context
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PMO_DASHBOARD_DB;

-- 2. Populate RAW layer from demo database
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 3. Transform and curate in SILVER schema
CREATE OR REPLACE SCHEMA SILVER;
USE SCHEMA SILVER;

-- Copy data
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

-- 4. Create secure view in GOLD schema
CREATE OR REPLACE SCHEMA GOLD;
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW project_kpis AS
SELECT
  p.project_id,
  p.name,
  p.start_date,
  p.end_date,
  s.total_tasks,
  s.completed_tasks,
  s.pending_tasks,
  ROUND(100.0 * s.completed_tasks / NULLIF(s.total_tasks,0),2) AS percent_complete,
  b.baseline_cost,
  b.actual_cost,
  b.forecast_cost,
  CASE WHEN b.actual_cost > b.baseline_cost THEN 'Over Budget' ELSE 'On Budget' END AS budget_status
FROM SILVER.projects p
LEFT JOIN SILVER.task_summary s ON p.project_id = s.project_id
LEFT JOIN SILVER.budgets b      ON p.project_id = b.project_id;

-- 5. Validate the view
DESCRIBE VIEW project_kpis;
SELECT project_id, total_tasks, completed_tasks, pending_tasks, percent_complete, budget_status
FROM project_kpis
ORDER BY project_id
LIMIT 5;

-- 1. Setup context
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PMO_DASHBOARD_DB;

-- 2. Populate RAW layer from demo database
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 3. Transform and curate in SILVER schema
CREATE OR REPLACE SCHEMA SILVER;
USE SCHEMA SILVER;

-- Projects table
CREATE OR REPLACE TABLE projects AS SELECT * FROM RAW.projects;

-- Task summary
CREATE OR REPLACE TABLE task_summary AS
SELECT
  p.project_id,
  COUNT(t.task_id) AS total_tasks,
  SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN t.status != 'Completed' THEN 1 ELSE 0 END) AS pending_tasks
FROM RAW.tasks t
JOIN RAW.milestones m ON t.milestone_id = m.milestone_id
JOIN RAW.projects p    ON m.project_id   = p.project_id
GROUP BY p.project_id;

-- Budgets copy
CREATE OR REPLACE TABLE budgets AS SELECT * FROM RAW.budgets;

-- 4. Create secure views in GOLD schema
CREATE OR REPLACE SCHEMA GOLD;
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW project_kpis AS
SELECT
  p.project_id,
  p.name,
  p.start_date,
  p.end_date,
  s.total_tasks,
  s.completed_tasks,
  s.pending_tasks,
  ROUND(100.0 * s.completed_tasks / NULLIF(s.total_tasks,0),2) AS percent_complete,
  b.baseline_cost,
  b.actual_cost,
  b.forecast_cost,
  CASE WHEN b.actual_cost > b.baseline_cost THEN 'Over Budget' ELSE 'On Budget' END AS budget_status
FROM SILVER.projects p
LEFT JOIN SILVER.task_summary s ON p.project_id = s.project_id
LEFT JOIN SILVER.budgets b     ON p.project_id = b.project_id;

-- 5. Validate the view
DESCRIBE VIEW project_kpis;
SELECT *
FROM project_kpis
ORDER BY project_id
LIMIT 5;

-- integration_tests.sql: End-to-end integration test for PMO_DASHBOARD_DB pipeline

-- 1. Setup context
USE DATABASE PMO_DASHBOARD_DB;

-- 2. Populate RAW layer from demo database
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE TABLE RAW.projects   AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE RAW.milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE RAW.tasks      AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE RAW.budgets    AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- 3. Curate in SILVER schema
CREATE OR REPLACE SCHEMA SILVER;
USE SCHEMA SILVER;

-- Copy over raw data
CREATE OR REPLACE TABLE projects AS SELECT * FROM PMO_DASHBOARD_DB.RAW.projects;

-- Task summary
CREATE OR REPLACE TABLE task_summary AS
SELECT
  p.project_id,
  COUNT(t.task_id) AS total_tasks,
  SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN t.status != 'Completed' THEN 1 ELSE 0 END) AS pending_tasks
FROM RAW.tasks t
JOIN RAW.milestones m ON t.milestone_id = m.milestone_id
JOIN RAW.projects p    ON m.project_id   = p.project_id
GROUP BY p.project_id;

-- Copy budgets
CREATE OR REPLACE TABLE budgets AS SELECT * FROM RAW.budgets;

-- 4. Create secure views in GOLD schema
CREATE OR REPLACE SCHEMA GOLD;
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW project_kpis AS
SELECT
  p.project_id,
  p.name,
  p.start_date,
  p.end_date,
  s.total_tasks,
  s.completed_tasks,
  s.pending_tasks,
  ROUND(100.0 * s.completed_tasks / NULLIF(s.total_tasks,0),2) AS percent_complete,
  b.baseline_cost,
  b.actual_cost,
  b.forecast_cost,
  CASE WHEN b.actual_cost > b.baseline_cost THEN 'Over Budget' ELSE 'On Budget' END AS budget_status
FROM SILVER.projects p
LEFT JOIN SILVER.task_summary s ON p.project_id = s.project_id
LEFT JOIN SILVER.budgets b     ON p.project_id = b.project_id;

-- 5. Validate the view
DESCRIBE VIEW project_kpis;
SELECT *
FROM project_kpis
ORDER BY project_id
LIMIT 5;
USE DATABASE PMO_DASHBOARD_DB;

-- Populate RAW layer from existing dev database
USE SCHEMA RAW;
CREATE OR REPLACE TABLE projects AS SELECT * FROM PM_DASHBOARD_DB.RAW.projects;
CREATE OR REPLACE TABLE milestones AS SELECT * FROM PM_DASHBOARD_DB.RAW.milestones;
CREATE OR REPLACE TABLE tasks AS SELECT * FROM PM_DASHBOARD_DB.RAW.tasks;
CREATE OR REPLACE TABLE budgets AS SELECT * FROM PM_DASHBOARD_DB.RAW.budgets;

-- Populate SILVER layer from RAW demo data
USE SCHEMA SILVER;

CREATE OR REPLACE TABLE projects AS
SELECT * FROM RAW.projects;

CREATE OR REPLACE TABLE task_summary AS
SELECT
  p.project_id,
  COUNT(t.task_id)           AS total_tasks,
  SUM(CASE WHEN t.status='Completed' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN t.status!='Completed' THEN 1 ELSE 0 END) AS pending_tasks
FROM RAW.tasks t
JOIN RAW.milestones m ON t.milestone_id = m.milestone_id
JOIN RAW.projects p    ON m.project_id   = p.project_id
GROUP BY p.project_id;

CREATE OR REPLACE TABLE budgets AS
SELECT * FROM RAW.budgets;

-- Validate GOLD secure view
USE SCHEMA GOLD;

CREATE OR REPLACE SECURE VIEW project_kpis AS
SELECT
  p.project_id,
  p.name,
  p.start_date,
  p.end_date,
  t.total_tasks,
  t.completed_tasks,
  t.pending_tasks,
  ROUND(100.0 * t.completed_tasks / NULLIF(t.total_tasks,0),2) AS percent_complete,
  b.baseline_cost,
  b.actual_cost,
  b.forecast_cost,
  CASE WHEN b.actual_cost > b.baseline_cost THEN 'Over Budget' ELSE 'On Budget' END AS budget_status
FROM SILVER.projects p
JOIN SILVER.task_summary t ON p.project_id = t.project_id
LEFT JOIN SILVER.budgets b ON p.project_id = b.project_id;

-- Retrieve KPIs for sample projects
describe view project_kpis;
SELECT *
FROM project_kpis
ORDER BY project_id
LIMIT 5;
CREATE OR REPLACE SECURE VIEW project_kpis AS
SELECT
  p.project_id,
  p.name,
  p.start_date,
  p.end_date,
  t.total_tasks,
  t.completed_tasks,
  t.pending_tasks,
  ROUND(100.0 * t.completed_tasks / NULLIF(t.total_tasks,0),2) AS percent_complete,
  b.baseline_cost,
  b.actual_cost,
  b.forecast_cost,
  CASE WHEN b.actual_cost > b.baseline_cost THEN 'Over Budget' ELSE 'On Budget' END AS budget_status
FROM SILVER.projects p
JOIN SILVER.task_summary t ON p.project_id = t.project_id
LEFT JOIN SILVER.budgets b ON p.project_id = b.project_id;

-- Validate GOLD secure view
USE SCHEMA GOLD;

-- Retrieve KPIs for sample projects
describe view project_kpis;
SELECT *
FROM GOLD.project_kpis
ORDER BY project_id
LIMIT 5;
