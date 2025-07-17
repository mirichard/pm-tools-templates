-- bronze_setup.sql: Create staging tables in RAW schema and load sample data
-- Use this in dev environment after medallion_schema

USE WAREHOUSE COMPUTE_WH;
USE DATABASE PM_DASHBOARD_DB;
USE SCHEMA RAW;

-- Create staging tables
CREATE OR REPLACE TABLE PROJECTS (
  project_id INT,
  project_name STRING,
  start_date DATE,
  end_date DATE
);

CREATE OR REPLACE TABLE TASKS (
  task_id INT,
  project_id INT,
  task_name STRING,
  status STRING,
  owner STRING,
  due_date DATE
);

CREATE OR REPLACE TABLE RESOURCES (
  resource_id INT,
  resource_name STRING,
  role STRING
);

-- Load sample data into PROJECTS
INSERT INTO PROJECTS VALUES
  (1, 'Demo Project', '2025-07-01', '2025-12-31'),
  (2, 'Second Project', '2025-06-15', '2025-11-30');

-- Load sample data into TASKS
INSERT INTO TASKS VALUES
  (101, 1, 'Define scope', 'Completed', 'Alice', '2025-07-10'),
  (102, 1, 'Design solution', 'In Progress', 'Bob', '2025-08-01'),
  (103, 1, 'Implement features', 'Pending', 'Charlie', '2025-09-15'),
  (201, 2, 'Initiate project', 'Completed', 'Dana', '2025-06-20');

-- Load sample data into RESOURCES
INSERT INTO RESOURCES VALUES
  (1, 'Alice', 'PM'),
  (2, 'Bob', 'Engineer'),
  (3, 'Charlie', 'Engineer'),
  (4, 'Dana', 'PM');

