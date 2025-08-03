# Test-Driven Development (TDD) Draft for Snowflake Demo

## 1. Overview
This document outlines the test-driven development approach for the Snowflake Demo medallion schema pipeline (Bronze → Silver → Gold) in the PM-Tools-Templates repository. It serves as the living foundation for documenting technical architecture, scripts, and validation test cases.

## 2. Objectives
- Validate environment provisioning (database, schemas, roles).
- Confirm data ingestion into RAW (Bronze) tables.
- Verify transformation logic in CURATED (Silver) tables.
- Ensure consumption views in CONSUMPTION (Gold) layer yield correct metrics.
- Document test scenarios, expected outcomes, and tools used.

## 3. Prerequisites
- Active Snowflake account and SnowSQL configured (`mytrial` profile).
- `COMPUTE_WH` warehouse, `SYSADMIN` role privileges.
- Local codebase at `/pm-tools-templates/Snowflake Demo/dev/snowflake`.

## 4. Test Scenarios

### 4.1 Environment Provisioning
**Script**: `medallion_schema.sql`  
**Actions**:
- Run script.  
- Confirm database `PM_DASHBOARD_DB` exists.  
- Confirm schemas `RAW`, `CURATED`, `CONSUMPTION` exist.

### 4.2 Bronze Layer Validation
**Script**: `bronze_setup.sql`  
**Actions**:
- Run script.  
- Query `RAW.PROJECTS`, `RAW.TASKS`, `RAW.RESOURCES` row counts and sample data.

### 4.3 Silver Layer Validation
**Script**: `silver_transform.sql`  
**Actions**:
- Run script.  
- Query `CURATED.PROJECT_SUMMARY`, `CURATED.TASK_DETAIL`, `CURATED.RESOURCE_WORKLOAD` for expected aggregates and joins.

### 4.4 Gold Layer Validation
**Script**: `gold_publish.sql`  
**Actions**:
- Run script.  
- Query views `CONSUMPTION.PROJECT_OVERVIEW`, `CONSUMPTION.UPCOMING_TASKS` to validate metrics and ordering.

### 4.5 Edge Case: Zero-Task Projects
**Script**: `bronze_setup.sql`, `silver_transform.sql`, `gold_publish.sql`  
**Actions**:
- Insert a project with no tasks: e.g., `INSERT INTO RAW.PROJECTS VALUES (3, 'Empty Project', '2025-08-01', '2025-12-01');`  
- Re-run `silver_transform.sql` to update CURATED layer.  
- Re-run `gold_publish.sql` to update CONSUMPTION layer.  
- Validate `CURATED.PROJECT_SUMMARY` for the new project shows `total_tasks = 0`, `completed_tasks = 0`, `pending_tasks = 0`, and `percent_complete` is `NULL`.  
- Validate `CONSUMPTION.PROJECT_OVERVIEW` contains one row for the new project with `assigned_tasks = 0` and `resource_name` as `NULL`.

## 5. Test Execution
**Script**: `gold_publish.sql`  
**Actions**:
- Run script.  
- Query views `CONSUMPTION.PROJECT_OVERVIEW`, `CONSUMPTION.UPCOMING_TASKS` to validate metrics and ordering.

## 5. Test Execution
It is recommended to automate the above validations using a shell script or CI pipeline with assertions.  
Example validation commands:
```bash
snowsql -c mytrial -q "SELECT COUNT(*) FROM PM_DASHBOARD_DB.RAW.PROJECTS;" | grep 2
snowsql -c mytrial -q "SELECT AVG(percent_complete) FROM PM_DASHBOARD_DB.CURATED.PROJECT_SUMMARY;" | grep 33.33
```  

## 6. Reporting & Next Steps
- Capture test results and log failures.  
- Document troubleshooting steps for common errors (e.g., warehouse privileges).  
- Extend TDD with performance benchmarks and security tests.  

*Draft created: 2025-07-16*
