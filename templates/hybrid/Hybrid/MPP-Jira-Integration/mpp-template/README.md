# MPP Template for Jira Integration

## Overview
This Microsoft Project template is configured with custom fields to support integration with Jira. It maintains traditional project management capabilities while adding fields necessary for agile work item creation.

## Custom Fields Configuration

### Required Custom Fields
Add these custom fields to your Microsoft Project template:

| Field Name | Type | Purpose | Jira Mapping |
|------------|------|---------|-------------|
| Jira_Epic_Key | Text | Jira Epic identifier | Epic Key |
| Jira_Story_Key | Text | Jira Story identifier | Story Key |
| Jira_Issue_Type | Text | Type of Jira issue | Issue Type (Epic/Story/Task) |
| Jira_Priority | Text | Priority level | Priority |
| Jira_Labels | Text | Comma-separated labels | Labels |
| Jira_Sprint | Text | Target sprint | Sprint |
| Jira_Story_Points | Number | Effort estimation | Story Points |
| Jira_Assignee | Text | Assigned team member | Assignee |
| Jira_Component | Text | Jira component | Component |
| Export_Flag | Yes/No | Include in export | N/A (filter) |

### Standard Fields Mapping

| MPP Field | Jira Field | Notes |
|-----------|------------|-------|
| Task Name | Summary | Primary title |
| Notes | Description | Detailed description |
| Start | Start Date | Planned start |
| Finish | Due Date | Planned completion |
| % Complete | Progress | Completion percentage |
| Status | Status | Workflow status |
| Resource Names | Assignee | Primary assignee |
| Duration | Original Estimate | Time estimate |

## Template Structure

### Hierarchy Levels
1. **Project Summary** - Overall project container
2. **Epics** - Major feature areas or themes
3. **Stories** - User stories or functional requirements
4. **Tasks** - Implementation tasks and subtasks

### Naming Conventions
- **Epics**: [EPIC] Epic Name
- **Stories**: [STORY] Story Name  
- **Tasks**: Task Name (no prefix)

## Usage Instructions

### Initial Setup
1. Open the MPP template
2. Configure custom fields (see above)
3. Set up your project hierarchy
4. Define Epics and Stories

### Quarterly Updates
1. Update dates based on current schedule
2. Verify resource assignments
3. Set Export_Flag = Yes for items to sync
4. Update Jira-specific fields as needed
5. Run export process

### Field Population Guidelines

#### For Epics
- Set Jira_Issue_Type = "Epic"
- Populate Jira_Epic_Key if updating existing
- Leave Jira_Story_Key blank
- Set appropriate labels and components

#### For Stories
- Set Jira_Issue_Type = "Story"
- Reference parent Epic in hierarchy
- Populate Jira_Story_Key if updating existing
- Set story points and assignee

#### For Tasks
- Set Jira_Issue_Type = "Task" or "Sub-task"
- Link to parent Story
- Focus on implementation details

## Best Practices

1. **Consistent Naming**: Use clear, descriptive names
2. **Hierarchy Maintenance**: Keep Epic > Story > Task structure
3. **Resource Alignment**: Ensure MPP resources match Jira users
4. **Regular Updates**: Update dates and progress weekly
5. **Export Validation**: Test exports before full sync

## Sample Template Download

*Note: Add link to actual .mpp template file when available*

## Troubleshooting

### Common Issues
1. **Missing Custom Fields**: Verify all required fields are created
2. **Invalid Dates**: Check date formats and dependencies
3. **Resource Mismatch**: Ensure names match Jira usernames
4. **Hierarchy Errors**: Verify Epic/Story relationships

### Field Validation
- Jira_Issue_Type: Must be "Epic", "Story", "Task", or "Sub-task"
- Jira_Priority: Must match Jira priority scheme
- Jira_Assignee: Must be valid Jira username
- Export_Flag: Must be Yes/No, defaults to No

