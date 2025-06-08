# Jira Automation Rules for MPP Integration

## Overview
This directory contains Jira automation rules and configurations to process MPP exports and maintain synchronization between Microsoft Project and Jira.

## Automation Rules

### 1. MPP Import Processor
**Purpose**: Processes CSV/JSON imports from MPP exports

**Trigger**: File attachment or webhook from import process

**Components**:
- **Trigger**: Scheduled or webhook-based
- **Condition**: Check for MPP export marker
- **Actions**: 
  - Parse import data
  - Create/update Epics, Stories, Tasks
  - Set field mappings
  - Maintain hierarchy

### 2. Epic Creation Rule
**Purpose**: Automatically creates Epics from MPP data

**Configuration**:
```json
{
  "name": "MPP Epic Creation",
  "trigger": {
    "type": "issue_created",
    "conditions": [
      {
        "field": "labels",
        "operator": "contains",
        "value": "mpp-import"
      },
      {
        "field": "issuetype",
        "operator": "equals",
        "value": "Epic"
      }
    ]
  },
  "actions": [
    {
      "type": "set_field_value",
      "field": "epic_name",
      "value": "{{issue.summary}}"
    },
    {
      "type": "add_label",
      "value": "mpp-sync"
    }
  ]
}
```

### 3. Story Linking Rule
**Purpose**: Links Stories to their parent Epics

**Configuration**:
```json
{
  "name": "MPP Story Linking",
  "trigger": {
    "type": "issue_created",
    "conditions": [
      {
        "field": "labels",
        "operator": "contains",
        "value": "mpp-import"
      },
      {
        "field": "issuetype",
        "operator": "equals",
        "value": "Story"
      },
      {
        "field": "epic_link",
        "operator": "is_not_empty"
      }
    ]
  },
  "actions": [
    {
      "type": "link_to_epic",
      "epic_key": "{{issue.epic_link}}"
    },
    {
      "type": "add_label",
      "value": "mpp-sync"
    }
  ]
}
```

### 4. Task Hierarchy Rule
**Purpose**: Maintains parent-child relationships for tasks

**Configuration**:
```json
{
  "name": "MPP Task Hierarchy",
  "trigger": {
    "type": "issue_created",
    "conditions": [
      {
        "field": "labels",
        "operator": "contains",
        "value": "mpp-import"
      },
      {
        "field": "parent",
        "operator": "is_not_empty"
      }
    ]
  },
  "actions": [
    {
      "type": "create_subtask",
      "parent_key": "{{issue.parent}}",
      "subtask_type": "Sub-task"
    },
    {
      "type": "add_label",
      "value": "mpp-sync"
    }
  ]
}
```

### 5. Status Synchronization Rule
**Purpose**: Syncs status changes back to tracking systems

**Configuration**:
```json
{
  "name": "MPP Status Sync",
  "trigger": {
    "type": "issue_transitioned",
    "conditions": [
      {
        "field": "labels",
        "operator": "contains",
        "value": "mpp-sync"
      }
    ]
  },
  "actions": [
    {
      "type": "web_request",
      "url": "{{webhook_url}}/status-update",
      "method": "POST",
      "body": {
        "external_id": "{{issue.external_id}}",
        "status": "{{issue.status}}",
        "progress": "{{issue.progress}}",
        "updated_date": "{{now}}"
      }
    }
  ]
}
```

### 6. Field Update Synchronization
**Purpose**: Tracks field changes for bi-directional sync

**Configuration**:
```json
{
  "name": "MPP Field Sync",
  "trigger": {
    "type": "issue_updated",
    "conditions": [
      {
        "field": "labels",
        "operator": "contains",
        "value": "mpp-sync"
      },
      {
        "field_changed": ["assignee", "due_date", "story_points", "priority"]
      }
    ]
  },
  "actions": [
    {
      "type": "web_request",
      "url": "{{webhook_url}}/field-update",
      "method": "POST",
      "body": {
        "external_id": "{{issue.external_id}}",
        "changed_fields": "{{issue.changelog.items}}",
        "updated_date": "{{now}}",
        "updated_by": "{{issue.updated_by}}"
      }
    }
  ]
}
```

## Setup Instructions

### 1. Prerequisites
- Jira Administrator access
- Automation for Jira app installed
- Custom fields configured for MPP mapping
- Webhook endpoint configured (if using API sync)

### 2. Custom Field Configuration
Create these custom fields in your Jira project:

| Field Name | Type | Context |
|------------|------|--------|
| External ID | Text | All issue types |
| Epic Link | Epic Link | Stories, Tasks |
| Start Date | Date | All issue types |
| Due Date | Date | All issue types |
| Progress | Number (%) | All issue types |
| MPP Duration | Text | All issue types |

### 3. Import Automation Rules

1. Navigate to **Project Settings > Automation**
2. Click **Create Rule**
3. Import each rule configuration above
4. Customize trigger conditions for your project
5. Update webhook URLs and field mappings
6. Test with sample data

### 4. Webhook Configuration

If using API-based synchronization:

```bash
# Example webhook endpoint setup
POST /api/mpp-sync/status-update
Content-Type: application/json

{
  "external_id": "MPP-123",
  "status": "In Progress",
  "progress": 25,
  "updated_date": "2024-01-15T10:30:00Z"
}
```

## Best Practices

### Rule Organization
1. **Naming Convention**: Use "MPP" prefix for all related rules
2. **Labels**: Consistently use "mpp-import" and "mpp-sync" labels
3. **Error Handling**: Add conditions to prevent infinite loops
4. **Logging**: Enable audit logs for troubleshooting

### Performance Considerations
1. **Batch Processing**: Process imports in batches
2. **Rate Limiting**: Respect Jira API limits
3. **Conditional Execution**: Use specific conditions to avoid unnecessary triggers
4. **Cleanup**: Regularly review and optimize rules

### Security
1. **Webhook Security**: Use authentication tokens
2. **Field Validation**: Validate all input data
3. **Permission Checks**: Ensure appropriate user permissions
4. **Audit Trail**: Maintain logs of all sync activities

## Troubleshooting

### Common Issues

1. **Rules Not Triggering**
   - Check trigger conditions
   - Verify labels are applied correctly
   - Review automation logs

2. **Hierarchy Issues**
   - Validate parent-child relationships
   - Check Epic Link configurations
   - Verify issue type permissions

3. **Field Mapping Errors**
   - Confirm custom fields exist
   - Check field permissions
   - Validate data formats

4. **Performance Issues**
   - Review rule execution frequency
   - Optimize condition logic
   - Consider batch processing

### Debugging

1. **Enable Verbose Logging**
   ```json
   {
     "action": {
       "type": "log_action",
       "message": "MPP Sync: {{issue.key}} - {{trigger.event}}"
     }
   }
   ```

2. **Test Mode**
   - Use test project for rule validation
   - Create sample issues with MPP labels
   - Monitor automation execution logs

3. **Rollback Plan**
   - Document rule configurations
   - Maintain backup of working rules
   - Plan for quick rollback if needed

## Integration Testing

### Test Scenarios
1. **Epic Creation**: Import Epic from MPP
2. **Story Linking**: Link Stories to Epics
3. **Task Hierarchy**: Create Sub-tasks under Stories
4. **Status Updates**: Change status in Jira
5. **Field Synchronization**: Update assignee, dates, priorities
6. **Bulk Import**: Process multiple items simultaneously

### Validation Checklist
- [ ] All custom fields are populated correctly
- [ ] Hierarchy relationships are maintained
- [ ] Labels are applied consistently
- [ ] Webhook responses are processed
- [ ] Error conditions are handled gracefully
- [ ] Performance is acceptable for expected volume

