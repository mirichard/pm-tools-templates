# Weekly Status Report Flow

## Overview
This Power Automate flow automatically collects project status information from various sources, compiles it into a professional status report, and distributes it to relevant stakeholders every week.

## Flow Description

### Trigger
**Recurrence**: Weekly on Friday at 4:00 PM

### Data Sources
- Microsoft Project Online/Project for the Web
- SharePoint Lists (Tasks, Issues, Risks)
- Power BI Datasets
- Teams Activity Data
- Planner Tasks

### Output
- Formatted HTML email report
- SharePoint document library storage
- Teams channel notification
- Executive dashboard update

## Flow Configuration

### Prerequisites
```yaml
Required Connections:
  - SharePoint
  - Microsoft Project
  - Office 365 Outlook
  - Microsoft Teams
  - Power BI (Premium connector)

Required Permissions:
  - Project read access
  - SharePoint site collection access
  - Teams channel posting rights
  - Email send permissions
```

### Flow Variables
```json
{
  "projectSiteUrl": "https://company.sharepoint.com/sites/ProjectManagement",
  "statusReportList": "Weekly Status Reports",
  "stakeholderGroup": "Project Stakeholders",
  "teamsChannelId": "19:abc123...",
  "executiveDashboardUrl": "https://app.powerbi.com/...",
  "reportTemplate": "Weekly Status Template"
}
```

## Flow Steps

### Step 1: Initialize Variables
```json
{
  "variables": [
    {
      "name": "ReportDate",
      "type": "String",
      "value": "@{formatDateTime(utcnow(), 'yyyy-MM-dd')}"
    },
    {
      "name": "ProjectData",
      "type": "Object",
      "value": {}
    },
    {
      "name": "StatusHTML",
      "type": "String",
      "value": ""
    },
    {
      "name": "StakeholderEmails",
      "type": "Array",
      "value": []
    }
  ]
}
```

### Step 2: Get Project Information
```json
{
  "action": "HTTP - Get Project Details",
  "method": "GET",
  "uri": "https://graph.microsoft.com/v1.0/me/drive/items/{projectFileId}",
  "headers": {
    "Authorization": "Bearer @{body('Get_Access_Token')?['access_token']}"
  }
}
```

### Step 3: Collect Status Data
#### 3.1 Get Task Progress
```json
{
  "action": "SharePoint - Get Items",
  "site": "@variables('projectSiteUrl')",
  "list": "Tasks",
  "filter": "Status ne 'Completed' and DueDate le '@{addDays(utcnow(), 7)}'",
  "orderBy": "Priority desc"
}
```

#### 3.2 Get Risk Information
```json
{
  "action": "SharePoint - Get Items",
  "site": "@variables('projectSiteUrl')",
  "list": "Risk Register",
  "filter": "Status eq 'Open' and Impact eq 'High'",
  "select": "Title,Impact,Probability,Mitigation,Owner"
}
```

#### 3.3 Get Issue Summary
```json
{
  "action": "SharePoint - Get Items",
  "site": "@variables('projectSiteUrl')",
  "list": "Issues",
  "filter": "Status ne 'Closed' and CreatedDate ge '@{addDays(utcnow(), -7)}'",
  "select": "Title,Status,Priority,AssignedTo,CreatedDate"
}
```

### Step 4: Calculate Metrics
```json
{
  "action": "Compose - Calculate Progress",
  "inputs": {
    "totalTasks": "@length(body('Get_Tasks')?['value'])",
    "completedTasks": "@length(where(body('Get_Tasks')?['value'], 'Status', 'Completed'))",
    "progressPercentage": "@div(length(where(body('Get_Tasks')?['value'], 'Status', 'Completed')), length(body('Get_Tasks')?['value']))",
    "openRisks": "@length(body('Get_Risks')?['value'])",
    "newIssues": "@length(body('Get_Issues')?['value'])"
  }
}
```

### Step 5: Build Report HTML
```html
<!-- Status Report Template -->
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto;">
  
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #0078d4, #106ebe); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">Weekly Project Status Report</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Week ending @{formatDateTime(utcnow(), 'MMMM dd, yyyy')}</p>
  </div>

  <!-- Executive Summary -->
  <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #0078d4;">
    <h2 style="color: #323130; margin-top: 0;">📋 Executive Summary</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
      
      <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-size: 28px; font-weight: bold; color: @{if(greater(outputs('Calculate_Progress')?['progressPercentage'], 0.8), '#107c10', if(greater(outputs('Calculate_Progress')?['progressPercentage'], 0.6), '#ff8c00', '#d13438'))};">
          @{formatNumber(mul(outputs('Calculate_Progress')?['progressPercentage'], 100), '0')}%
        </div>
        <div style="color: #605e5c; font-size: 14px;">Overall Progress</div>
      </div>

      <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-size: 28px; font-weight: bold; color: @{if(equals(outputs('Calculate_Progress')?['openRisks'], 0), '#107c10', if(greater(outputs('Calculate_Progress')?['openRisks'], 2), '#d13438', '#ff8c00'))};">
          @{outputs('Calculate_Progress')?['openRisks']}
        </div>
        <div style="color: #605e5c; font-size: 14px;">Open Risks</div>
      </div>

      <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-size: 28px; font-weight: bold; color: @{if(equals(outputs('Calculate_Progress')?['newIssues'], 0), '#107c10', if(greater(outputs('Calculate_Progress')?['newIssues'], 3), '#d13438', '#ff8c00'))};">
          @{outputs('Calculate_Progress')?['newIssues']}
        </div>
        <div style="color: #605e5c; font-size: 14px;">New Issues</div>
      </div>

    </div>
  </div>

  <!-- Task Progress -->
  <div style="padding: 20px; background: white;">
    <h2 style="color: #323130; border-bottom: 2px solid #edebe9; padding-bottom: 10px;">📈 Task Progress</h2>
    
    <div style="margin: 15px 0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>Completed Tasks</span>
        <span>@{outputs('Calculate_Progress')?['completedTasks']} of @{outputs('Calculate_Progress')?['totalTasks']}</span>
      </div>
      <div style="background: #edebe9; height: 10px; border-radius: 5px;">
        <div style="background: linear-gradient(90deg, #107c10, #5bb85b); height: 100%; width: @{mul(outputs('Calculate_Progress')?['progressPercentage'], 100)}%; border-radius: 5px;"></div>
      </div>
    </div>

    <!-- Upcoming Tasks -->
    <h3 style="color: #323130; margin: 20px 0 10px 0;">🎯 Upcoming Deadlines (Next 7 Days)</h3>
    <div style="background: #fff4ce; border-left: 4px solid #ffb900; padding: 15px; margin: 10px 0;">
      @{join(select(where(body('Get_Tasks')?['value'], item(), and(le(item()?['DueDate'], addDays(utcnow(), 7)), ne(item()?['Status'], 'Completed'))), 
        concat('<div style="margin: 5px 0;">
          <strong>', item()?['Title'], '</strong> - Due: ', formatDateTime(item()?['DueDate'], 'MMM dd'), 
          ' (', item()?['AssignedTo']?['Title'], ')
        </div>')), '')}
    </div>
  </div>

  <!-- Risks & Issues -->
  <div style="padding: 20px; background: #fff;">
    <h2 style="color: #323130; border-bottom: 2px solid #edebe9; padding-bottom: 10px;">⚠️ Risks & Issues</h2>
    
    @{if(greater(outputs('Calculate_Progress')?['openRisks'], 0), 
      concat('<h3 style="color: #d13438;">High Priority Risks</h3>',
        join(select(body('Get_Risks')?['value'], 
          concat('<div style="background: #fdf2f2; border-left: 4px solid #d13438; padding: 12px; margin: 8px 0;">
            <strong>', item()?['Title'], '</strong><br>
            <span style="color: #605e5c; font-size: 14px;">
              Impact: ', item()?['Impact'], ' | Probability: ', item()?['Probability'], '<br>
              Owner: ', item()?['Owner']?['Title'], '<br>
              Mitigation: ', item()?['Mitigation'], '
            </span>
          </div>')), '')), 
      '<p style="color: #107c10;">✅ No high-priority risks at this time.</p>')}

    @{if(greater(outputs('Calculate_Progress')?['newIssues'], 0), 
      concat('<h3 style="color: #ff8c00; margin-top: 20px;">New Issues This Week</h3>',
        join(select(body('Get_Issues')?['value'], 
          concat('<div style="background: #fff8f0; border-left: 4px solid #ff8c00; padding: 12px; margin: 8px 0;">
            <strong>', item()?['Title'], '</strong><br>
            <span style="color: #605e5c; font-size: 14px;">
              Priority: ', item()?['Priority'], ' | Status: ', item()?['Status'], '<br>
              Assigned to: ', item()?['AssignedTo']?['Title'], '<br>
              Created: ', formatDateTime(item()?['CreatedDate'], 'MMM dd, yyyy'), '
            </span>
          </div>')), '')), 
      '<p style="color: #107c10;">✅ No new issues this week.</p>')}
  </div>

  <!-- Next Week Focus -->
  <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #323130; margin-top: 0;">🎯 Next Week Focus</h2>
    <ul style="color: #323130; line-height: 1.6;">
      <li>Complete high-priority tasks due next week</li>
      <li>Address open risks and implement mitigation strategies</li>
      <li>Resolve new issues identified this week</li>
      <li>Continue progress toward project milestones</li>
    </ul>
    
    <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 6px;">
      <p style="margin: 0; color: #605e5c; font-size: 14px;">
        📊 <a href="@{variables('executiveDashboardUrl')}" style="color: #0078d4; text-decoration: none;">View Executive Dashboard</a> |
        💬 <a href="https://teams.microsoft.com/l/channel/@{variables('teamsChannelId')}" style="color: #0078d4; text-decoration: none;">Discuss in Teams</a> |
        📋 <a href="@{concat(variables('projectSiteUrl'), '/Lists/Tasks')}" style="color: #0078d4; text-decoration: none;">View All Tasks</a>
      </p>
    </div>
  </div>

</div>
```

### Step 6: Get Stakeholder Email Addresses
```json
{
  "action": "SharePoint - Get Group Members",
  "site": "@variables('projectSiteUrl')",
  "group": "@variables('stakeholderGroup')",
  "select": "Email,DisplayName"
}
```

### Step 7: Send Email Report
```json
{
  "action": "Office 365 Outlook - Send Email",
  "to": "@{join(select(body('Get_Stakeholder_Emails')?['value'], item()?['Email']), ';')}",
  "subject": "Weekly Project Status Report - @{formatDateTime(utcnow(), 'MMM dd, yyyy')}",
  "body": "@variables('StatusHTML')",
  "importance": "Normal",
  "isHtml": true
}
```

### Step 8: Save Report to SharePoint
```json
{
  "action": "SharePoint - Create Item",
  "site": "@variables('projectSiteUrl')",
  "list": "@variables('statusReportList')",
  "body": {
    "Title": "Weekly Status Report - @{formatDateTime(utcnow(), 'yyyy-MM-dd')}",
    "ReportDate": "@{formatDateTime(utcnow(), 'yyyy-MM-dd')}",
    "ReportContent": "@variables('StatusHTML')",
    "OverallProgress": "@{mul(outputs('Calculate_Progress')?['progressPercentage'], 100)}",
    "OpenRisks": "@outputs('Calculate_Progress')?['openRisks']",
    "NewIssues": "@outputs('Calculate_Progress')?['newIssues']"
  }
}
```

### Step 9: Post to Teams Channel
```json
{
  "action": "Microsoft Teams - Post Message",
  "channel": "@variables('teamsChannelId')",
  "message": {
    "title": "📊 Weekly Status Report Available",
    "text": "The weekly project status report for @{formatDateTime(utcnow(), 'MMMM dd, yyyy')} has been generated and distributed.",
    "sections": [
      {
        "activityTitle": "Quick Summary",
        "activitySubtitle": "Overall Progress: @{formatNumber(mul(outputs('Calculate_Progress')?['progressPercentage'], 100), '0')}% | Open Risks: @{outputs('Calculate_Progress')?['openRisks']} | New Issues: @{outputs('Calculate_Progress')?['newIssues']}"
      }
    ],
    "potentialAction": [
      {
        "@type": "OpenUri",
        "name": "View Full Report",
        "targets": [
          {
            "os": "default",
            "uri": "@{body('Create_SharePoint_Item')?['@odata.editLink']}"
          }
        ]
      }
    ]
  }
}
```

## Customization Options

### Report Frequency
Change the recurrence trigger to run:
- **Daily**: Monday-Friday at 5:00 PM
- **Bi-weekly**: Every other Friday
- **Monthly**: Last Friday of each month

### Additional Data Sources
Extend the flow to include:
- Budget/financial data from ERP systems
- Customer feedback from support tickets
- Quality metrics from testing tools
- Resource utilization from time tracking

### Conditional Logic Examples
```json
{
  "condition": "Project Health Status",
  "expression": "@greater(outputs('Calculate_Progress')?['progressPercentage'], 0.8)",
  "actions": {
    "if_true": {
      "teamsMessage": "🟢 Project is on track!",
      "emailPriority": "Normal"
    },
    "if_false": {
      "teamsMessage": "🟡 Project needs attention",
      "emailPriority": "High"
    }
  }
}
```

### Multi-Language Support
```json
{
  "variables": {
    "reportLanguage": "en-US",
    "translations": {
      "en-US": {
        "title": "Weekly Project Status Report",
        "progress": "Overall Progress",
        "risks": "Open Risks"
      },
      "es-ES": {
        "title": "Informe Semanal del Estado del Proyecto",
        "progress": "Progreso General",
        "risks": "Riesgos Abiertos"
      }
    }
  }
}
```

## Error Handling

### Common Error Scenarios
```json
{
  "errorHandling": {
    "dataSourceUnavailable": {
      "action": "Skip and send notification",
      "message": "Unable to retrieve data from [source]. Report generated with available data."
    },
    "emailDeliveryFailure": {
      "action": "Retry with backup method",
      "backup": "Save to SharePoint and send Teams notification"
    },
    "permissionDenied": {
      "action": "Alert administrator",
      "notification": "Flow requires additional permissions to access [resource]"
    }
  }
}
```

### Retry Configuration
```json
{
  "retryPolicy": {
    "type": "exponential",
    "count": 3,
    "interval": "PT20S",
    "maximumInterval": "PT1H"
  }
}
```

## Performance Optimization

### Parallel Processing
```json
{
  "parallel": {
    "branches": {
      "tasks": "Get task data",
      "risks": "Get risk data", 
      "issues": "Get issue data",
      "stakeholders": "Get stakeholder emails"
    }
  }
}
```

### Data Caching
```json
{
  "caching": {
    "stakeholderEmails": {
      "duration": "PT24H",
      "key": "stakeholder-emails-cache"
    },
    "projectMetadata": {
      "duration": "PT12H", 
      "key": "project-metadata-cache"
    }
  }
}
```

## Monitoring & Analytics

### Flow Analytics
Track these metrics in Power BI:
- Report generation success rate
- Email delivery rates
- Stakeholder engagement (open rates)
- Data source availability
- Flow execution time

### Success Metrics
```yaml
KPIs:
  - Flow Success Rate: >95%
  - Report Generation Time: <2 minutes
  - Email Delivery Rate: >98%
  - Stakeholder Satisfaction: >4.0/5.0
```

## Deployment Checklist

### Pre-Deployment
- [ ] Verify all connections are configured
- [ ] Test with sample data
- [ ] Validate email templates render correctly
- [ ] Confirm stakeholder email lists are accurate
- [ ] Set up monitoring dashboards

### Post-Deployment
- [ ] Monitor first week of automated reports
- [ ] Collect stakeholder feedback
- [ ] Fine-tune data filters and thresholds
- [ ] Document any customizations made
- [ ] Train team on monitoring and maintenance

---

*This flow template provides a comprehensive foundation for automated status reporting*
*Customize the data sources, report format, and distribution lists to match your project needs*
*Regular monitoring and maintenance ensure continued reliability and stakeholder satisfaction*
