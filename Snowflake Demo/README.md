# Snowflake Demo Dashboard

## Overview
This Snowflake-based project management dashboard demo showcases how Snowflake can be used to ingest, transform, and serve data for PMO analytics. It targets project and program managers, engineering teams, and business stakeholders seeking robust KPI tracking and reporting capabilities.

## Features
- **Project Portfolio Overview**: Key metrics (tasks, completion %, status)
- **Gantt Chart**: Visualize project timelines and milestones
- **Risk Matrix**: Interactive scatter grid categorizing risks by likelihood & impact
- **KPI Panel**: SPI/CPI gauges and budget variance
- **Milestone Tracker**: Table view with status highlights and trend indicators
- **Resource Load Heatmap**: Resource utilization over time
- **Upcoming Tasks**: Sorted list of pending tasks by due date

## Tech Stack
- **Snowflake**: Data ingestion, transformation, and consumption layers (Bronze → Silver → Gold)
- **Sample Data**: Generated via Snowflake’s `GENERATOR` and JSON semi-structured types
- **Frontend (optional)**: React + Plotly or Power BI for visualization

## Data Model
- **projects**: Project metadata with JSON `metadata` field for custom properties
- **milestones**: Project milestones with due and completion dates
- **tasks**: Task-level details linked to milestones and resources
- **resources**: Project resources and availability
- **time_logs**: Daily hours logged per resource, project, and task
- **risks**: Project risk register with mitigation and status
- **budgets**: Financial metrics (baseline, actual, forecast costs)

## Setup Instructions
1. **Provision Schemas**: Run `medallion_schema.sql` to create `PM_DASHBOARD_DB` and schemas (`RAW`, `CURATED`, `CONSUMPTION`).
2. **Load Sample Data**: Execute `seed_data.sql` in the `RAW` schema to populate tables.
3. **Transform Data**: Run `silver_transform.sql` to build curated tables in `CURATED` schema.
4. **Publish Views**: Execute `gold_publish.sql` to create consumption views in `CONSUMPTION` schema.
5. **Query & Visualize**: Use `snowsql` or connect BI tools (e.g., Power BI, Tableau) to the `CONSUMPTION` views:
   ```sql
   SELECT * FROM PM_DASHBOARD_DB.CONSUMPTION.PROJECT_OVERVIEW;
   ```

## Usage Scenarios
- **Project Health Check**: Monitor % completion, overdue tasks, and budget variance.
- **Executive Reporting**: Aggregate KPIs across portfolio for leadership dashboards.
- **Forecast Variance Analysis**: Compare baseline vs actual costs to detect overruns.
- **Resource Management**: Balance workloads and identify resource shortages.

## Known Limitations
- Demo-scale data (limited rows) not suitable for production volumes.
- No automated data refresh; models rely on single-run scripts.
- Simplified security and role model for demonstration purposes.

## License / Attribution
This demo is provided under the [MIT License](https://opensource.org/licenses/MIT). Feel free to adapt and extend for your own needs.

---
_Last updated: 2025-07-16_

*For detailed test scenarios and scripts, see `TDD.md`.*

<!-- End of README -->

This directory contains the Snowflake setup and configuration code for the PM Tools Templates “Snowflake Demo” medallion schema (Bronze → Silver → Gold) pattern. 

You can use the SQL scripts under each environment (dev, test, prod) to provision a new database and schemas in Snowflake for a project management dashboard demo.  

Directory structure mirrors standard code-promotion branches:  
- dev  
- test  
- prod  

Each environment folder contains a `snowflake/medallion_schema.sql` script.

