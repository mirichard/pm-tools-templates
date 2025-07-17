-- seed_data.sql: Generate realistic sample data for project management demo

-- Initialize session
USE WAREHOUSE COMPUTE_WH;
USE DATABASE PM_DASHBOARD_DB;
USE SCHEMA RAW;

-- Usage: run in SnowSQL after medallion_schema and before transformations

-- PROJECTS table with JSON metadata
-- Usage: run in SnowSQL after medallion_schema and before transformations

-- PROJECTS table with JSON metadata
CREATE OR REPLACE TABLE projects (
  project_id INT,
  name STRING,
  sponsor STRING,
  pm STRING,
  start_date DATE,
  end_date DATE,
  status STRING,
  metadata VARIANT
);
INSERT INTO projects
SELECT
  seq4()+1 AS project_id,
  'Project ' || TO_VARCHAR(seq4()+1) AS name,
  CASE MOD(seq4(),5)
    WHEN 0 THEN 'Finance' WHEN 1 THEN 'HR' WHEN 2 THEN 'IT' WHEN 3 THEN 'Marketing' ELSE 'Operations' END AS sponsor,
  CASE MOD(seq4(),5)
    WHEN 0 THEN 'Alice' WHEN 1 THEN 'Bob' WHEN 2 THEN 'Charlie' WHEN 3 THEN 'Dana' ELSE 'Eve' END AS pm,
  DATEADD(day, -MOD(seq4(),90), CURRENT_DATE()) AS start_date,
  DATEADD(day, -MOD(seq4(),90) + 180, CURRENT_DATE()) AS end_date,
  CASE MOD(seq4(),4)
    WHEN 0 THEN 'Planned' WHEN 1 THEN 'In Progress' WHEN 2 THEN 'Completed' ELSE 'On Hold' END AS status,
OBJECT_CONSTRUCT(
    'priority', CASE MOD(seq4(),3) WHEN 0 THEN 'Low' WHEN 1 THEN 'Medium' ELSE 'High' END,
    'tags', ARRAY_CONSTRUCT('demo','sample')
  ) AS metadata
FROM TABLE(GENERATOR(ROWCOUNT => 8));

-- MILESTONES table
CREATE OR REPLACE TABLE milestones (
  milestone_id INT,
  project_id INT,
  name STRING,
  due_date DATE,
  completion_date DATE,
  status STRING
);
INSERT INTO milestones
SELECT
  seq4()+1 AS milestone_id,
  MOD(seq4(),8)+1 AS project_id,
  'Milestone ' || TO_VARCHAR(seq4()+1) AS name,
  DATEADD(day, MOD(seq4(),180), CURRENT_DATE()) AS due_date,
  CASE WHEN MOD(seq4(),2)=0 THEN DATEADD(day, MOD(seq4(),180), CURRENT_DATE()) ELSE NULL END AS completion_date,
  CASE WHEN MOD(seq4(),2)=0 THEN 'Completed' ELSE 'Pending' END AS status
FROM TABLE(GENERATOR(ROWCOUNT => 40));

-- TASKS table
CREATE OR REPLACE TABLE tasks (
  task_id INT,
  milestone_id INT,
  assigned_to STRING,
  estimated_hours INT,
  actual_hours INT,
  status STRING
);
INSERT INTO tasks
SELECT
  seq4()+1 AS task_id,
  MOD(seq4(),40)+1 AS milestone_id,
  CASE MOD(seq4(),5)
    WHEN 0 THEN 'Alice' WHEN 1 THEN 'Bob' WHEN 2 THEN 'Charlie' WHEN 3 THEN 'Dana' ELSE 'Eve' END AS assigned_to,
  MOD(seq4(),16)+1 AS estimated_hours,
  CASE WHEN MOD(seq4(),3)=0 THEN NULL ELSE MOD(seq4(),16)+1 END AS actual_hours,
  CASE MOD(seq4(),3)
    WHEN 0 THEN 'Not Started' WHEN 1 THEN 'In Progress' ELSE 'Completed' END AS status
FROM TABLE(GENERATOR(ROWCOUNT => 100));

-- RESOURCES table
CREATE OR REPLACE TABLE resources (
  resource_id INT,
  name STRING,
  role STRING,
  availability_pct INT
);
INSERT INTO resources
SELECT
  seq4()+1 AS resource_id,
  CASE MOD(seq4(),5)
    WHEN 0 THEN 'Alice' WHEN 1 THEN 'Bob' WHEN 2 THEN 'Charlie' WHEN 3 THEN 'Dana' ELSE 'Eve' END AS name,
  CASE MOD(seq4(),4)
    WHEN 0 THEN 'PM' WHEN 1 THEN 'Engineer' WHEN 2 THEN 'Designer' ELSE 'Analyst' END AS role,
  50 + MOD(seq4(),51) AS availability_pct
FROM TABLE(GENERATOR(ROWCOUNT => 5));

-- TIME_LOGS table
CREATE OR REPLACE TABLE time_logs (
  log_id INT,
  resource_id INT,
  project_id INT,
  task_id INT,
  date DATE,
  hours_logged FLOAT
);
INSERT INTO time_logs
SELECT
  seq4()+1 AS log_id,
  MOD(seq4(),5)+1 AS resource_id,
  MOD(seq4(),8)+1 AS project_id,
  MOD(seq4(),100)+1 AS task_id,
  DATEADD(day, -MOD(seq4(),30), CURRENT_DATE()) AS date,
  (MOD(seq4(),8)+1) * 1.0 AS hours_logged
FROM TABLE(GENERATOR(ROWCOUNT => 200));

-- RISKS table
CREATE OR REPLACE TABLE risks (
  risk_id INT,
  project_id INT,
  title STRING,
  likelihood STRING,
  impact STRING,
  mitigation STRING,
  status STRING
);
INSERT INTO risks
SELECT
  seq4()+1 AS risk_id,
  MOD(seq4(),8)+1 AS project_id,
  'Risk ' || TO_VARCHAR(seq4()+1) AS title,
  CASE MOD(seq4(),3)
    WHEN 0 THEN 'Low' WHEN 1 THEN 'Medium' ELSE 'High' END AS likelihood,
  CASE MOD(seq4(),3)
    WHEN 0 THEN 'Low' WHEN 1 THEN 'Medium' ELSE 'High' END AS impact,
  'Mitigation plan ' || TO_VARCHAR(seq4()+1) AS mitigation,
  CASE MOD(seq4(),2)
    WHEN 0 THEN 'Open' ELSE 'Closed' END AS status
FROM TABLE(GENERATOR(ROWCOUNT => 20));

-- BUDGETS table
CREATE OR REPLACE TABLE budgets (
  project_id INT,
  baseline_cost FLOAT,
  actual_cost FLOAT,
  forecast_cost FLOAT
);
INSERT INTO budgets
SELECT
  MOD(seq4(),8)+1 AS project_id,
  50000 + MOD(seq4(),50000) AS baseline_cost,
  40000 + MOD(seq4(),60000) AS actual_cost,
  60000 + MOD(seq4(),40000) AS forecast_cost
FROM TABLE(GENERATOR(ROWCOUNT => 8));
