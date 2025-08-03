-- medallion_schema.sql: Sets up Bronze (raw), Silver (curated), and Gold (consumption) schemas
-- Usage: run in SnowSQL with a role that has accountadmin or securityadmin privileges

-- Switch context
USE WAREHOUSE COMPUTE_WH;
USE ROLE SYSADMIN;

-- Create database
CREATE OR REPLACE DATABASE PM_DASHBOARD_DB;
USE DATABASE PM_DASHBOARD_DB;

-- Create schemas for medallion layers
environment parameterized as DEV, TEST or PROD
CREATE OR REPLACE SCHEMA RAW;
CREATE OR REPLACE SCHEMA CURATED;
CREATE OR REPLACE SCHEMA CONSUMPTION;

-- Grants
-- Allow SYSADMIN to fully manage
GRANT ALL ON DATABASE PM_DASHBOARD_DB TO ROLE SYSADMIN;
GRANT ALL ON SCHEMA RAW TO ROLE SYSADMIN;
GRANT ALL ON SCHEMA CURATED TO ROLE SYSADMIN;
GRANT ALL ON SCHEMA CONSUMPTION TO ROLE SYSADMIN;
