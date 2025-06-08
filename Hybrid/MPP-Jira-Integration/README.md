# MPP-Jira Integration Framework

## Overview
This framework provides a hybrid approach to project management by integrating Microsoft Project (MPP) plans with Jira projects. It enables project managers to maintain detailed project schedules in MPP while leveraging Jira's agile capabilities for execution and tracking.

## Use Case: Operations Quarterly Planning
This integration is particularly valuable for operations teams that work in quarterly cycles:
- PM maintains a detailed MPP with tasks, resources, and dependencies
- Every quarter, dates are updated and resource assignments are verified
- The updated plan is exported and synchronized with Jira
- Teams execute work in Jira while maintaining alignment with the overall schedule

## Components

### 1. MPP Template (`mpp-template/`)
- Pre-configured Microsoft Project template with custom fields
- Includes Epic and Story fields for Jira mapping
- Standard project management fields (dates, duration, status, resources)

### 2. Export Scripts (`export-scripts/`)
- Python scripts to export MPP data to standardized formats
- Handles field mapping and data validation
- Supports incremental updates

### 3. Jira Automation (`jira-automation/`)
- Jira automation rules for importing MPP data
- Creates and updates Epics and Stories based on MPP structure
- Maintains bidirectional synchronization

### 4. Documentation (`docs/`)
- Setup instructions
- Field mapping specifications
- Troubleshooting guide
- Best practices

## Workflow

1. **Planning Phase (MPP)**
   - Update quarterly schedule in MPP
   - Assign resources and verify dependencies
   - Set Epic and Story information for Jira items

2. **Export Phase**
   - Run export script to generate Jira-compatible data
   - Validate field mappings and data integrity

3. **Import Phase (Jira)**
   - Automation rules process the exported data
   - Creates new Epics/Stories or updates existing ones
   - Maintains parent-child relationships

4. **Execution Phase**
   - Teams work in Jira using agile practices
   - Status updates flow back to reporting systems

5. **Sync Phase**
   - Regular synchronization of status and progress
   - Preparation for next quarterly update

## Getting Started

1. Review the setup documentation in `docs/setup.md`
2. Configure the MPP template with your organization's fields
3. Set up Jira automation rules
4. Test the integration with a pilot project
5. Roll out to operational teams

## Benefits

- **Hybrid Approach**: Combines detailed planning (MPP) with agile execution (Jira)
- **Resource Management**: Maintains resource allocation visibility
- **Quarterly Cycles**: Supports operational planning rhythms
- **Scalability**: Can handle multiple projects and teams
- **Traceability**: Maintains links between plan and execution

