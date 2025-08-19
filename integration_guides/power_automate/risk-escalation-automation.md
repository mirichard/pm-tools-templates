# Risk Escalation Automation Flow

## Overview
This Power Automate flow monitors project risk registers and automatically escalates high-impact risks to appropriate stakeholders based on configurable criteria. It ensures critical risks receive timely attention and proper escalation through the organizational hierarchy.

## Flow Description

### Trigger
**SharePoint List Item Modified**: Triggered when risk register items are created or updated

### Escalation Logic
- **Critical Risks**: Immediate notification to executives and sponsors
- **High Risks**: Escalation to project managers and department heads
- **Medium Risks**: Notification to team leads and risk owners
- **Low Risks**: Documentation only, no immediate escalation

### Output
- Automated email notifications
- Teams channel alerts
- Executive dashboard updates
- Risk tracking reports
- Escalation audit trail

## Flow Configuration

### Prerequisites
```yaml
Required Connections:
  - SharePoint (Risk Register)
  - Office 365 Outlook
  - Microsoft Teams
  - Power BI (Premium)
  - Microsoft Planner (Optional)

Required Permissions:
  - SharePoint list read/write access
  - Email send permissions on behalf of service account
  - Teams channel posting rights
  - User profile read access for escalation routing
```

### Risk Register Schema
```yaml
SharePoint List: Risk Register
Required Columns:
  - Title (Single line of text)
  - RiskDescription (Multiple lines of text)
  - Impact (Choice: Critical, High, Medium, Low)
  - Probability (Choice: Very High, High, Medium, Low, Very Low)
  - RiskScore (Calculated: Impact × Probability)
  - Category (Choice: Technical, Business, External, Resource)
  - Owner (Person)
  - Status (Choice: Open, In Progress, Mitigated, Closed)
  - MitigationPlan (Multiple lines of text)
  - DateIdentified (Date)
  - TargetResolutionDate (Date)
  - LastReviewed (Date)
  - EscalationLevel (Choice: None, Team, Management, Executive)
  - BusinessImpact (Multiple lines of text)
```

### Flow Variables
```json
{
  "riskSiteUrl": "https://company.sharepoint.com/sites/ProjectManagement",
  "riskListName": "Risk Register",
  "executiveTeam": ["ceo@company.com", "cto@company.com", "cfo@company.com"],
  "managementTeam": ["pm-director@company.com", "ops-manager@company.com"],
  "escalationMatrix": {
    "Critical": ["Executive", "Management", "Team"],
    "High": ["Management", "Team"],
    "Medium": ["Team"],
    "Low": ["Owner"]
  },
  "teamsChannelId": "19:risk-management-channel",
  "powerBIDashboard": "https://app.powerbi.com/risk-dashboard"
}
```

## Flow Steps

### Step 1: Initialize Variables and Parse Trigger
```json
{
  "variables": [
    {
      "name": "RiskItem",
      "type": "Object",
      "value": "@triggerBody()"
    },
    {
      "name": "RiskScore",
      "type": "Integer", 
      "value": "@mul(triggerBody()?['Impact_x0020_Value'], triggerBody()?['Probability_x0020_Value'])"
    },
    {
      "name": "EscalationRequired",
      "type": "Boolean",
      "value": false
    },
    {
      "name": "NotificationRecipients",
      "type": "Array",
      "value": []
    },
    {
      "name": "EscalationMessage",
      "type": "String",
      "value": ""
    }
  ]
}
```

### Step 2: Determine Risk Priority Level
```json
{
  "action": "Switch - Risk Priority Classification",
  "expression": "@variables('RiskScore')",
  "cases": {
    "Critical": {
      "case": "@greater(variables('RiskScore'), 15)",
      "actions": {
        "setEscalationLevel": "Executive",
        "setUrgency": "Immediate",
        "setEscalationRequired": true
      }
    },
    "High": {
      "case": "@and(greater(variables('RiskScore'), 9), lessOrEquals(variables('RiskScore'), 15))",
      "actions": {
        "setEscalationLevel": "Management", 
        "setUrgency": "High",
        "setEscalationRequired": true
      }
    },
    "Medium": {
      "case": "@and(greater(variables('RiskScore'), 4), lessOrEquals(variables('RiskScore'), 9))",
      "actions": {
        "setEscalationLevel": "Team",
        "setUrgency": "Medium",
        "setEscalationRequired": "@equals(triggerBody()?['Status']?['Value'], 'Open')"
      }
    },
    "Low": {
      "default": true,
      "actions": {
        "setEscalationLevel": "Owner",
        "setUrgency": "Low", 
        "setEscalationRequired": false
      }
    }
  }
}
```

### Step 3: Build Recipient Lists Based on Escalation Level
```json
{
  "action": "Condition - Check Escalation Required",
  "expression": "@variables('EscalationRequired')",
  "actions": {
    "if_true": {
      "switch_escalation_level": {
        "Executive": {
          "getExecutiveEmails": "@variables('executiveTeam')",
          "getManagementEmails": "@variables('managementTeam')",
          "getRiskOwnerEmail": "@triggerBody()?['Owner']?['Email']",
          "combineRecipients": "@union(variables('executiveTeam'), variables('managementTeam'), createArray(triggerBody()?['Owner']?['Email']))"
        },
        "Management": {
          "getManagementEmails": "@variables('managementTeam')",
          "getRiskOwnerEmail": "@triggerBody()?['Owner']?['Email']",
          "combineRecipients": "@union(variables('managementTeam'), createArray(triggerBody()?['Owner']?['Email']))"
        },
        "Team": {
          "getRiskOwnerEmail": "@triggerBody()?['Owner']?['Email']",
          "getTeamLeadEmail": "@outputs('Get_Team_Lead')?['Email']",
          "combineRecipients": "@createArray(triggerBody()?['Owner']?['Email'], outputs('Get_Team_Lead')?['Email'])"
        }
      }
    }
  }
}
```

### Step 4: Generate Risk Assessment Report
```json
{
  "action": "Compose - Risk Assessment",
  "inputs": {
    "riskId": "@triggerBody()?['ID']",
    "title": "@triggerBody()?['Title']",
    "description": "@triggerBody()?['RiskDescription']",
    "impact": "@triggerBody()?['Impact']?['Value']",
    "probability": "@triggerBody()?['Probability']?['Value']", 
    "riskScore": "@variables('RiskScore')",
    "category": "@triggerBody()?['Category']?['Value']",
    "owner": "@triggerBody()?['Owner']?['DisplayName']",
    "status": "@triggerBody()?['Status']?['Value']",
    "dateIdentified": "@triggerBody()?['DateIdentified']",
    "targetResolution": "@triggerBody()?['TargetResolutionDate']",
    "businessImpact": "@triggerBody()?['BusinessImpact']",
    "mitigationPlan": "@triggerBody()?['MitigationPlan']",
    "escalationLevel": "@outputs('Switch_Risk_Priority')?['escalationLevel']",
    "urgency": "@outputs('Switch_Risk_Priority')?['urgency']"
  }
}
```

### Step 5: Build Escalation Email Template
```html
<!-- Risk Escalation Email Template -->
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto;">

  <!-- Alert Header -->
  <div style="background: @{if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), 'linear-gradient(135deg, #d13438, #a4262c)', if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Management'), 'linear-gradient(135deg, #ff8c00, #e77c00)', 'linear-gradient(135deg, #ffb900, #f2cc00)'))}; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px; display: flex; align-items: center;">
      @{if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), '🚨', if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Management'), '⚠️', '⚡'))} 
      Risk Escalation Required
    </h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">
      @{outputs('Risk_Assessment')?['urgency']} Priority - @{outputs('Risk_Assessment')?['escalationLevel']} Level
    </p>
  </div>

  <!-- Risk Summary -->
  <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid @{if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), '#d13438', if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Management'), '#ff8c00', '#ffb900'))};">
    
    <h2 style="color: #323130; margin-top: 0;">📋 Risk Summary</h2>
    
    <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
      <h3 style="margin: 0 0 10px 0; color: #d13438;">@{outputs('Risk_Assessment')?['title']}</h3>
      <p style="margin: 0; color: #605e5c; line-height: 1.5;">@{outputs('Risk_Assessment')?['description']}</p>
    </div>

    <!-- Risk Metrics Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
      
      <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
        <div style="font-size: 28px; font-weight: bold; color: @{if(greater(outputs('Risk_Assessment')?['riskScore'], 15), '#d13438', if(greater(outputs('Risk_Assessment')?['riskScore'], 9), '#ff8c00', '#ffb900'))};">
          @{outputs('Risk_Assessment')?['riskScore']}
        </div>
        <div style="color: #605e5c; font-size: 14px;">Risk Score</div>
      </div>

      <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
        <div style="font-size: 20px; font-weight: bold; color: #323130;">
          @{outputs('Risk_Assessment')?['impact']}
        </div>
        <div style="color: #605e5c; font-size: 14px;">Impact Level</div>
      </div>

      <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
        <div style="font-size: 20px; font-weight: bold; color: #323130;">
          @{outputs('Risk_Assessment')?['probability']}
        </div>
        <div style="color: #605e5c; font-size: 14px;">Probability</div>
      </div>

      <div style="background: white; padding: 15px; border-radius: 6px; text-align: center;">
        <div style="font-size: 16px; font-weight: bold; color: #323130;">
          @{outputs('Risk_Assessment')?['category']}
        </div>
        <div style="color: #605e5c; font-size: 14px;">Category</div>
      </div>

    </div>
  </div>

  <!-- Business Impact -->
  <div style="background: white; padding: 20px;">
    <h2 style="color: #323130; border-bottom: 2px solid #edebe9; padding-bottom: 10px;">💼 Business Impact</h2>
    <div style="background: #fff8f0; border-left: 4px solid #ff8c00; padding: 15px; margin: 15px 0;">
      <p style="margin: 0; color: #323130; line-height: 1.6;">@{outputs('Risk_Assessment')?['businessImpact']}</p>
    </div>
  </div>

  <!-- Mitigation Plan -->
  <div style="background: white; padding: 20px;">
    <h2 style="color: #323130; border-bottom: 2px solid #edebe9; padding-bottom: 10px;">🛡️ Mitigation Plan</h2>
    @{if(empty(outputs('Risk_Assessment')?['mitigationPlan']), 
      '<div style="background: #fdf2f2; border-left: 4px solid #d13438; padding: 15px; margin: 15px 0;">
        <p style="margin: 0; color: #d13438; font-weight: bold;">⚠️ No mitigation plan defined - Immediate action required!</p>
      </div>',
      concat('<div style="background: #f3f9f1; border-left: 4px solid #107c10; padding: 15px; margin: 15px 0;">
        <p style="margin: 0; color: #323130; line-height: 1.6;">', outputs('Risk_Assessment')?['mitigationPlan'], '</p>
      </div>'))}
  </div>

  <!-- Risk Details -->
  <div style="background: white; padding: 20px;">
    <h2 style="color: #323130; border-bottom: 2px solid #edebe9; padding-bottom: 10px;">📊 Risk Details</h2>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 15px 0;">
      <div>
        <strong style="color: #323130;">Risk Owner:</strong><br>
        <span style="color: #605e5c;">@{outputs('Risk_Assessment')?['owner']}</span>
      </div>
      <div>
        <strong style="color: #323130;">Current Status:</strong><br>
        <span style="color: @{if(equals(outputs('Risk_Assessment')?['status'], 'Open'), '#d13438', if(equals(outputs('Risk_Assessment')?['status'], 'In Progress'), '#ff8c00', '#107c10'))};">
          @{outputs('Risk_Assessment')?['status']}
        </span>
      </div>
      <div>
        <strong style="color: #323130;">Date Identified:</strong><br>
        <span style="color: #605e5c;">@{formatDateTime(outputs('Risk_Assessment')?['dateIdentified'], 'MMM dd, yyyy')}</span>
      </div>
      <div>
        <strong style="color: #323130;">Target Resolution:</strong><br>
        <span style="color: @{if(lessOrEquals(outputs('Risk_Assessment')?['targetResolution'], utcnow()), '#d13438', '#605e5c')};">
          @{if(empty(outputs('Risk_Assessment')?['targetResolution']), 'Not Set', formatDateTime(outputs('Risk_Assessment')?['targetResolution'], 'MMM dd, yyyy'))}
        </span>
      </div>
    </div>
  </div>

  <!-- Action Required -->
  <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #323130; margin-top: 0;">🎯 Immediate Actions Required</h2>
    
    @{if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), 
      '<div style="background: #fdf2f2; border-left: 4px solid #d13438; padding: 15px; margin: 15px 0;">
        <h3 style="margin: 0 0 10px 0; color: #d13438;">Executive Decision Required</h3>
        <ul style="margin: 0; color: #323130;">
          <li>Review business impact and strategic implications</li>
          <li>Approve additional resources for risk mitigation</li>
          <li>Consider project scope or timeline adjustments</li>
          <li>Escalate to board/stakeholders if necessary</li>
        </ul>
      </div>',
      if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Management'),
        '<div style="background: #fff8f0; border-left: 4px solid #ff8c00; padding: 15px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #ff8c00;">Management Action Needed</h3>
          <ul style="margin: 0; color: #323130;">
            <li>Review and validate mitigation plan</li>
            <li>Allocate necessary resources and budget</li>
            <li>Assign additional team members if needed</li>
            <li>Set up regular monitoring and review schedule</li>
          </ul>
        </div>',
        '<div style="background: #fff4ce; border-left: 4px solid #ffb900; padding: 15px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0; color: #cc8c00;">Team Action Items</h3>
          <ul style="margin: 0; color: #323130;">
            <li>Implement immediate mitigation measures</li>
            <li>Update risk status and progress regularly</li>
            <li>Escalate if situation worsens</li>
            <li>Document lessons learned</li>
          </ul>
        </div>'))}

    <!-- Quick Action Links -->
    <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 6px;">
      <p style="margin: 0; color: #605e5c; font-size: 14px;">
        📋 <a href="@{concat(variables('riskSiteUrl'), '/Lists/', variables('riskListName'), '/DispForm.aspx?ID=', outputs('Risk_Assessment')?['riskId'])}" style="color: #0078d4; text-decoration: none;">View Full Risk Details</a> |
        ✏️ <a href="@{concat(variables('riskSiteUrl'), '/Lists/', variables('riskListName'), '/EditForm.aspx?ID=', outputs('Risk_Assessment')?['riskId'])}" style="color: #0078d4; text-decoration: none;">Update Risk Status</a> |
        📊 <a href="@{variables('powerBIDashboard')}" style="color: #0078d4; text-decoration: none;">View Risk Dashboard</a> |
        💬 <a href="https://teams.microsoft.com/l/channel/@{variables('teamsChannelId')}" style="color: #0078d4; text-decoration: none;">Discuss in Teams</a>
      </p>
    </div>
  </div>

</div>
```

### Step 6: Send Escalation Notifications
```json
{
  "action": "Office 365 Outlook - Send Email",
  "to": "@{join(variables('NotificationRecipients'), ';')}",
  "subject": "@{concat('🚨 RISK ESCALATION - ', outputs('Risk_Assessment')?['urgency'], ' Priority: ', outputs('Risk_Assessment')?['title'])}",
  "body": "@variables('EscalationMessage')",
  "importance": "@{if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), 'High', 'Normal')}",
  "isHtml": true,
  "attachments": [
    {
      "name": "Risk-Assessment-Report.json",
      "contentBytes": "@base64(string(outputs('Risk_Assessment')))"
    }
  ]
}
```

### Step 7: Post Teams Alert
```json
{
  "action": "Microsoft Teams - Post Adaptive Card",
  "channel": "@variables('teamsChannelId')",
  "card": {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.3",
    "body": [
      {
        "type": "Container",
        "style": "@{if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), 'attention', if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Management'), 'warning', 'accent'))}",
        "items": [
          {
            "type": "ColumnSet",
            "columns": [
              {
                "type": "Column",
                "width": "auto",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "@{if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), '🚨', if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Management'), '⚠️', '⚡'))}",
                    "size": "ExtraLarge"
                  }
                ]
              },
              {
                "type": "Column",
                "width": "stretch",
                "items": [
                  {
                    "type": "TextBlock",
                    "text": "Risk Escalation Alert",
                    "weight": "Bolder",
                    "size": "Large",
                    "color": "Light"
                  },
                  {
                    "type": "TextBlock",
                    "text": "@{concat(outputs('Risk_Assessment')?['urgency'], ' Priority - ', outputs('Risk_Assessment')?['escalationLevel'], ' Level')}",
                    "color": "Light",
                    "spacing": "None"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "Container",
        "items": [
          {
            "type": "TextBlock",
            "text": "@outputs('Risk_Assessment')?['title']",
            "weight": "Bolder",
            "size": "Medium",
            "wrap": true
          },
          {
            "type": "TextBlock",
            "text": "@outputs('Risk_Assessment')?['description']",
            "wrap": true,
            "spacing": "Small"
          },
          {
            "type": "FactSet",
            "facts": [
              {
                "title": "Risk Score:",
                "value": "@outputs('Risk_Assessment')?['riskScore']"
              },
              {
                "title": "Impact:",
                "value": "@outputs('Risk_Assessment')?['impact']"
              },
              {
                "title": "Probability:",
                "value": "@outputs('Risk_Assessment')?['probability']"
              },
              {
                "title": "Owner:",
                "value": "@outputs('Risk_Assessment')?['owner']"
              },
              {
                "title": "Status:",
                "value": "@outputs('Risk_Assessment')?['status']"
              }
            ]
          }
        ]
      }
    ],
    "actions": [
      {
        "type": "Action.OpenUrl",
        "title": "View Risk Details",
        "url": "@{concat(variables('riskSiteUrl'), '/Lists/', variables('riskListName'), '/DispForm.aspx?ID=', outputs('Risk_Assessment')?['riskId'])}"
      },
      {
        "type": "Action.OpenUrl", 
        "title": "Update Status",
        "url": "@{concat(variables('riskSiteUrl'), '/Lists/', variables('riskListName'), '/EditForm.aspx?ID=', outputs('Risk_Assessment')?['riskId'])}"
      }
    ]
  }
}
```

### Step 8: Update Risk Dashboard
```json
{
  "action": "Power BI - Add Rows to Dataset",
  "workspace": "Risk Management Workspace",
  "dataset": "Risk Escalation Log",
  "table": "Escalations",
  "rows": [
    {
      "EscalationDate": "@utcnow()",
      "RiskId": "@outputs('Risk_Assessment')?['riskId']",
      "RiskTitle": "@outputs('Risk_Assessment')?['title']",
      "EscalationLevel": "@outputs('Risk_Assessment')?['escalationLevel']",
      "RiskScore": "@outputs('Risk_Assessment')?['riskScore']",
      "Impact": "@outputs('Risk_Assessment')?['impact']", 
      "Probability": "@outputs('Risk_Assessment')?['probability']",
      "Category": "@outputs('Risk_Assessment')?['category']",
      "Owner": "@outputs('Risk_Assessment')?['owner']",
      "Status": "@outputs('Risk_Assessment')?['status']",
      "NotificationsSent": "@length(variables('NotificationRecipients'))",
      "UrgencyLevel": "@outputs('Risk_Assessment')?['urgency']"
    }
  ]
}
```

### Step 9: Create Follow-up Tasks (For Critical/High Risks)
```json
{
  "action": "Condition - Create Follow-up Tasks",
  "expression": "@or(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), equals(outputs('Risk_Assessment')?['escalationLevel'], 'Management'))",
  "actions": {
    "if_true": {
      "create_planner_task": {
        "action": "Planner - Create Task",
        "planId": "risk-management-plan-id",
        "bucketId": "escalated-risks-bucket",
        "title": "@{concat('Risk Escalation Follow-up: ', outputs('Risk_Assessment')?['title'])}",
        "details": "@{concat('Risk ID: ', outputs('Risk_Assessment')?['riskId'], '\nEscalation Level: ', outputs('Risk_Assessment')?['escalationLevel'], '\nRisk Score: ', outputs('Risk_Assessment')?['riskScore'], '\nRequired Actions: Review mitigation plan and provide status update within 48 hours.')}",
        "dueDateTime": "@addDays(utcnow(), if(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), 1, 2))",
        "assignments": {
          "@outputs('Risk_Assessment')?['owner']": {
            "@odata.type": "microsoft.graph.plannerAssignment",
            "orderHint": " !"
          }
        }
      }
    }
  }
}
```

### Step 10: Log Escalation Activity
```json
{
  "action": "SharePoint - Create Item",
  "site": "@variables('riskSiteUrl')",
  "list": "Risk Escalation Log",
  "body": {
    "Title": "@{concat('Escalation - ', outputs('Risk_Assessment')?['title'])}",
    "RiskId": "@outputs('Risk_Assessment')?['riskId']",
    "EscalationDate": "@utcnow()",
    "EscalationLevel": "@outputs('Risk_Assessment')?['escalationLevel']",
    "RiskScore": "@outputs('Risk_Assessment')?['riskScore']",
    "NotificationsSent": "@length(variables('NotificationRecipients'))",
    "Recipients": "@join(variables('NotificationRecipients'), '; ')",
    "EscalationReason": "@{concat('Risk score of ', outputs('Risk_Assessment')?['riskScore'], ' triggered ', outputs('Risk_Assessment')?['escalationLevel'], ' level escalation')}",
    "ActionsTaken": "Automated escalation notifications sent, Teams alert posted, dashboard updated",
    "FollowUpRequired": "@if(or(equals(outputs('Risk_Assessment')?['escalationLevel'], 'Executive'), equals(outputs('Risk_Assessment')?['escalationLevel'], 'Management')), 'Yes', 'No')"
  }
}
```

## Customization Options

### Escalation Criteria
Modify escalation thresholds:
```json
{
  "escalationRules": {
    "immediate": {
      "conditions": [
        "riskScore >= 20",
        "impact == 'Critical'",
        "category == 'Business' AND probability == 'Very High'"
      ],
      "escalationLevel": "Executive",
      "timeframe": "immediate"
    },
    "urgent": {
      "conditions": [
        "riskScore >= 12",
        "impact == 'High' AND probability >= 'High'",
        "targetResolutionDate <= today + 7 days"
      ],
      "escalationLevel": "Management", 
      "timeframe": "within 2 hours"
    }
  }
}
```

### Multi-Project Support
```json
{
  "projectSpecificRules": {
    "project1": {
      "executives": ["project1-sponsor@company.com"],
      "managers": ["project1-manager@company.com"],
      "escalationThresholds": {"critical": 15, "high": 10}
    },
    "project2": {
      "executives": ["project2-sponsor@company.com"],
      "managers": ["project2-manager@company.com"], 
      "escalationThresholds": {"critical": 12, "high": 8}
    }
  }
}
```

### Time-Based Escalation
```json
{
  "timeBasedRules": {
    "businessHours": {
      "start": "08:00",
      "end": "18:00",
      "timezone": "EST",
      "escalateImmediately": true
    },
    "afterHours": {
      "escalateIfCritical": true,
      "escalateIfHigh": false,
      "nextBusinessDayEscalation": true
    },
    "weekends": {
      "criticalOnly": true,
      "emergencyContacts": ["oncall@company.com"]
    }
  }
}
```

## Advanced Features

### AI-Powered Risk Analysis
```json
{
  "aiAnalysis": {
    "connector": "AI Builder Text Analytics",
    "sentiment": "Analyze risk description sentiment",
    "keyPhrases": "Extract key risk indicators",
    "similarRisks": "Find historical similar risks",
    "recommendedActions": "Suggest mitigation strategies"
  }
}
```

### Integration with External Systems
```json
{
  "externalIntegrations": {
    "jira": {
      "createIssue": "Auto-create JIRA tickets for high risks",
      "linkToEpic": "Link to project epic/initiative"
    },
    "servicenow": {
      "createIncident": "Critical risks become incidents",
      "assignmentGroup": "Risk management team"
    },
    "slack": {
      "channelNotification": "Post to dedicated Slack channel",
      "directMessage": "DM risk owners directly"
    }
  }
}
```

### Risk Pattern Detection
```json
{
  "patternDetection": {
    "recurringRisks": "Identify similar risks across projects",
    "riskClusters": "Group related risks by category/cause",
    "trendAnalysis": "Track risk score trends over time",
    "earlyWarning": "Predict potential risk escalations"
  }
}
```

## Performance & Monitoring

### Success Metrics
```yaml
KPIs:
  - Escalation Response Time: <30 minutes for critical risks
  - Notification Delivery Rate: >99%
  - False Positive Rate: <5%
  - Risk Resolution Time: 50% improvement after escalation
  - Stakeholder Satisfaction: >4.5/5.0
```

### Error Handling
```json
{
  "errorScenarios": {
    "emailFailure": {
      "action": "Retry with Teams notification",
      "fallback": "Create high-priority task"
    },
    "dataSourceUnavailable": {
      "action": "Use cached risk data",
      "alertAdmin": true
    },
    "permissionDenied": {
      "action": "Log error and notify admin",
      "escalateToSystemAdmin": true
    }
  }
}
```

### Monitoring Dashboard
Track in Power BI:
- Escalation frequency by risk category
- Response times by escalation level
- Risk resolution effectiveness
- Stakeholder engagement metrics
- System performance and reliability

## Deployment Checklist

### Pre-Deployment
- [ ] Configure SharePoint risk register list
- [ ] Set up stakeholder groups and permissions
- [ ] Test email delivery to all escalation levels
- [ ] Validate Teams channel integration
- [ ] Configure Power BI dashboard connections

### Post-Deployment
- [ ] Monitor first week of escalations closely
- [ ] Collect feedback from stakeholders
- [ ] Fine-tune escalation thresholds
- [ ] Document any custom configurations
- [ ] Train risk owners on the process

---

*This escalation flow ensures critical risks receive appropriate and timely attention*
*Regular monitoring and threshold adjustment optimize the balance between thoroughness and efficiency*
*The automated system provides consistent risk management while reducing manual oversight burden*
