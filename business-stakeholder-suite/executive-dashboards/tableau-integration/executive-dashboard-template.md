---
title: "Executive Dashboard Template"
methodology: "universal"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# Tableau Executive Dashboard Template

## 📊 Overview
This comprehensive Tableau template provides executive-level project management insights with interactive visualizations, real-time KPI tracking, and strategic alignment monitoring optimized for executive decision-making.

## 🎯 Dashboard Architecture

### Data Source Configuration
- **Primary Connection**: SQL Server/PostgreSQL database
- **Secondary Sources**: Excel workbooks, SharePoint lists, REST APIs
- **Refresh Schedule**: Every 15 minutes during business hours
- **Data Extracts**: Optimized for performance with 6-month rolling window

### Dashboard Structure
1. **Executive Summary** (Landing Page)
2. **Financial Performance** (Detailed Analysis)
3. **Portfolio Overview** (Multi-project View)
4. **Strategic Alignment** (Goal Tracking)
5. **Risk & Issues** (Risk Management)
6. **Resource Utilization** (Capacity Planning)

---

## 📈 Dashboard 1: Executive Summary

### Layout Configuration
```
+------------------+------------------+------------------+
|   Portfolio      |    Budget        |   Schedule       |
|   Health Score   |   Performance    |   Performance    |
|      85.2        |     Index        |      Index       |
|                  |      1.15        |      0.92        |
+------------------+------------------+------------------+
| Projects by Status Distribution    | Top 5 At-Risk   |
|                                    | Projects         |
| [Donut Chart]                      | [Table]          |
|                                    |                  |
+------------------------------------+------------------+
| Monthly Portfolio Trend Analysis                      |
| [Dual-Axis Line Chart]                               |
|                                                       |
+-------------------------------------------------------+
```

### Key Metrics & Calculated Fields

#### Portfolio Health Score
```sql
-- Calculated Field: Portfolio Health Score
CASE [Status]
    WHEN 'On Track' THEN 100
    WHEN 'At Risk' THEN 60
    WHEN 'Behind Schedule' THEN 30
    WHEN 'Critical' THEN 10
    WHEN 'Completed' THEN 100
    ELSE 50
END
```

#### Budget Performance Index
```sql
-- Calculated Field: Budget Performance Index
SUM([Earned Value]) / SUM([Actual Cost])
```

#### Schedule Performance Index
```sql
-- Calculated Field: Schedule Performance Index
IF [Status] = 'Completed' OR ([Status] != 'Behind Schedule' AND [End Date] >= TODAY()) 
THEN 1 ELSE 0 END
```

#### Strategic Alignment Rate
```sql
-- Calculated Field: Strategic Alignment Rate
IF ISNULL([Strategic Goal ID]) THEN 0 ELSE 1 END
```

### Visual Specifications

#### KPI Cards
- **Size**: 200px x 150px
- **Font**: Tableau Bold, 24pt for values
- **Colors**: 
  - Green (#28a745) for good performance (>90)
  - Yellow (#ffc107) for caution (70-89)
  - Red (#dc3545) for critical (<70)

#### Status Distribution Donut
- **Chart Type**: Pie chart with inner radius 50%
- **Color Palette**: Traffic Light (Red, Yellow, Green, Blue)
- **Labels**: Show percentages and counts
- **Tooltip**: Project names and details

#### Trend Analysis Line Chart
- **X-Axis**: Month-Year
- **Y-Axis**: Portfolio health score (left), Budget utilization (right)
- **Dual Axis**: Synchronized scales
- **Trend Lines**: Linear with confidence bands

### Filters & Parameters
```sql
-- Parameter: Date Range
[Date Range Parameter]
Values: 'Last 3 Months', 'Last 6 Months', 'Year to Date', 'Custom'

-- Filter: Portfolio
[Portfolio] IN ('Technology', 'Operations', 'Business', 'All')

-- Filter: Priority Level
[Priority] IN ('Critical', 'High', 'Medium', 'Low', 'All')
```

---

## 💰 Dashboard 2: Financial Performance

### Layout Configuration
```
+------------------------+------------------------+
| ROI by Portfolio       | Cost Performance       |
| [Horizontal Bar]       | Trend [Line Chart]     |
|                        |                        |
+------------------------+------------------------+
| Budget vs Actual vs Forecast                    |
| [Waterfall Chart]                               |
|                                                 |
+-------------------------------------------------+
| Financial Health Matrix      | Top Cost Drivers |
| [Scatter Plot]               | [Treemap]        |
|                              |                  |
+------------------------------+------------------+
```

### Advanced Calculated Fields

#### Weighted Average ROI
```sql
-- Calculated Field: Weighted ROI
SUM([ROI] * [Budget]) / SUM([Budget])
```

#### Cost Variance
```sql
-- Calculated Field: Cost Variance
[Actual Cost] - [Budget Allocated]
```

#### Cost Variance Percentage
```sql
-- Calculated Field: Cost Variance %
([Actual Cost] - [Budget Allocated]) / [Budget Allocated] * 100
```

#### Forecast Accuracy
```sql
-- Calculated Field: Forecast Accuracy
100 - (ABS([Forecast Cost] - [Actual Spend]) / [Actual Spend] * 100)
```

#### Earned Value Management
```sql
-- Calculated Field: Schedule Variance (SV)
[Earned Value] - [Planned Value]

-- Calculated Field: Cost Variance (CV)
[Earned Value] - [Actual Cost]

-- Calculated Field: Schedule Performance Index (SPI)
[Earned Value] / [Planned Value]

-- Calculated Field: Cost Performance Index (CPI)
[Earned Value] / [Actual Cost]
```

### Financial Forecasting
```sql
-- Calculated Field: Estimate at Completion (EAC)
IF [CPI] > 0 THEN [Budget] / [CPI] ELSE [Budget] * 1.2 END

-- Calculated Field: Estimate to Complete (ETC)
[EAC] - [Actual Cost]

-- Calculated Field: Variance at Completion (VAC)
[Budget] - [EAC]
```

---

## 📊 Dashboard 3: Portfolio Overview

### Layout Configuration
```
+-----------------------------------+------------------+
| Portfolio Risk vs ROI Matrix      | Resource         |
| [Scatter Plot with Trend Lines]   | Utilization      |
|                                   | [Heat Map]       |
+-----------------------------------+------------------+
| Project Timeline (Gantt Chart Alternative)          |
| [Horizontal Bar Chart with Date Axis]               |
|                                                      |
+------------------------------------------------------+
| Performance Radar by Portfolio   | Milestone        |
| [Radar/Spider Chart]             | Achievement      |
|                                  | [Bullet Chart]   |
+----------------------------------+------------------+
```

### Portfolio Analysis Calculations

#### Risk Score Calculation
```sql
-- Calculated Field: Project Risk Score
[Impact] * [Probability]
```

#### Portfolio Efficiency
```sql
-- Calculated Field: Portfolio Efficiency
([Projects Completed] / [Total Projects]) * 
([Budget Utilized] / [Total Budget]) * 100
```

#### Resource Utilization
```sql
-- Calculated Field: Resource Utilization %
([Allocation] * [Utilization]) / [Allocation] * 100
```

#### Timeline Performance
```sql
-- Calculated Field: Days Ahead/Behind
DATEDIFF('day', [Planned End Date], [Actual End Date])
```

### Advanced Visualizations

#### Risk-ROI Scatter Plot
- **X-Axis**: Risk Score (0-25)
- **Y-Axis**: ROI Percentage
- **Size**: Budget Amount
- **Color**: Project Status
- **Trend Line**: Linear regression with R-squared
- **Reference Lines**: Average risk and ROI

#### Gantt Chart Alternative
```sql
-- Calculated Field: Project Duration
DATEDIFF('day', [Start Date], [End Date])

-- Calculated Field: Days Completed
DATEDIFF('day', [Start Date], TODAY()) * ([Percent Complete] / 100)

-- Calculated Field: Timeline Status
IF [End Date] < TODAY() AND [Status] != 'Completed' THEN 'Overdue'
ELSEIF [End Date] <= DATEADD('day', 30, TODAY()) THEN 'Due Soon'
ELSE 'On Track' END
```

---

## 🎯 Dashboard 4: Strategic Alignment

### Layout Configuration
```
+---------------------------+-------------------------+
| Strategic Goal Progress   | Business Value          |
| [Bullet Charts]          | Realization             |
|                          | [Waterfall Chart]       |
+---------------------------+-------------------------+
| Goal Achievement Forecast                           |
| [Forecast Chart with Confidence Intervals]         |
|                                                     |
+-----------------------------------------------------+
| Strategic Initiative Health | Benefit Timeline     |
| [Scorecard/Matrix]         | [Gantt Chart]        |
|                            |                      |
+----------------------------+----------------------+
```

### Strategic Calculations

#### Goal Progress Percentage
```sql
-- Calculated Field: Goal Progress %
[Current Value] / [Target Value] * 100
```

#### Strategic Alignment Score
```sql
-- Calculated Field: Strategic Alignment Score
IF ISNULL([Strategic Goal ID]) THEN 0 
ELSE [Budget] END / SUM([Budget]) * 100
```

#### Value Realization Rate
```sql
-- Calculated Field: Value Realization Rate
([Realized Benefits] / [Projected Benefits]) * 100
```

#### Goal Achievement Forecast
```sql
-- Calculated Field: Projected Achievement Date
IF [Goal Progress %] > 0 THEN
    DATEADD('day', 
        ([Target Value] - [Current Value]) / 
        ([Current Value] / DATEDIFF('day', [Start Date], TODAY())), 
        TODAY())
END
```

---

## ⚠️ Dashboard 5: Risk & Issues

### Layout Configuration
```
+---------------------------+-------------------------+
| Risk Heat Map            | Risk Trend Analysis     |
| [Matrix/Heat Map]        | [Line Chart]           |
|                          |                        |
+---------------------------+-------------------------+
| Issue Aging Analysis     | Risk Response           |
| [Histogram]              | Effectiveness           |
|                          | [Funnel Chart]          |
+---------------------------+-------------------------+
| Critical Risks by Portfolio              | Risk     |
| [Table with Conditional Formatting]     | Timeline |
|                                          | [Gantt]  |
+------------------------------------------+----------+
```

### Risk Management Calculations

#### Risk Score
```sql
-- Calculated Field: Risk Score
[Impact] * [Probability]
```

#### Risk Category
```sql
-- Calculated Field: Risk Category
IF [Risk Score] >= 15 THEN 'Critical'
ELSEIF [Risk Score] >= 10 THEN 'High'
ELSEIF [Risk Score] >= 5 THEN 'Medium'
ELSE 'Low' END
```

#### Issue Age
```sql
-- Calculated Field: Issue Age (Days)
DATEDIFF('day', [Date Identified], 
    IF ISNULL([Date Closed]) THEN TODAY() ELSE [Date Closed] END)
```

#### Risk Mitigation Rate
```sql
-- Calculated Field: Risk Mitigation Rate
COUNTD(IF [Status] = 'Closed' THEN [Risk ID] END) / 
COUNTD([Risk ID]) * 100
```

---

## 👥 Dashboard 6: Resource Utilization

### Layout Configuration
```
+--------------------------------+------------------------+
| Resource Allocation Matrix     | Skill Distribution     |
| [Heat Map]                     | [Stacked Bar Chart]    |
|                                |                        |
+--------------------------------+------------------------+
| Capacity Planning Forecast                             |
| [Area Chart with Projections]                          |
|                                                         |
+---------------------------------------------------------+
| Team Productivity Metrics     | Resource Bottlenecks   |
| [Multi-measure Chart]         | [Pareto Chart]         |
|                               |                        |
+-------------------------------+------------------------+
```

### Resource Calculations

#### Utilization Rate
```sql
-- Calculated Field: Actual Utilization %
[Utilization] / [Allocation] * 100
```

#### Capacity Gap
```sql
-- Calculated Field: Capacity Gap
[Required Capacity] - [Available Capacity]
```

#### Productivity Index
```sql
-- Calculated Field: Team Productivity
[Completed Work Value] / [Resource Cost]
```

#### Skill Level Distribution
```sql
-- Calculated Field: Senior Resource Ratio
COUNTD(IF [Skill Level] = 'Senior' THEN [Resource ID] END) / 
COUNTD([Resource ID]) * 100
```

---

## 🔌 Data Connection Setup

### SQL Server Connection
```sql
-- Connection String
Server: your-server.database.windows.net
Database: ProjectManagementDB
Authentication: SQL Server Authentication
Username: tableau_reader
```

### Custom SQL Query
```sql
SELECT 
    p.ProjectID,
    p.ProjectName,
    p.ProjectManager,
    p.StartDate,
    p.EndDate,
    p.Status,
    p.Priority,
    p.Portfolio,
    p.Budget,
    p.ActualCost,
    p.PercentComplete,
    p.RiskLevel,
    p.StrategicGoalID,
    fm.ROI,
    fm.NPV,
    fm.IRR,
    fm.EarnedValue,
    rr.RiskScore,
    rr.Impact,
    rr.Probability,
    sg.GoalName,
    sg.CurrentValue,
    sg.TargetValue
FROM Projects p
LEFT JOIN FinancialMetrics fm ON p.ProjectID = fm.ProjectID
LEFT JOIN RiskRegister rr ON p.ProjectID = rr.ProjectID
LEFT JOIN StrategicGoals sg ON p.StrategicGoalID = sg.GoalID
WHERE p.IsActive = 1
```

### Excel Connection
```
File Path: \\shared\project-data\executive-dashboard-data.xlsx
Sheets: Projects, FinancialMetrics, RiskRegister, StrategicGoals, Resources
Connection: Live (refreshes every 15 minutes)
```

### REST API Connection
```json
{
  "url": "https://api.yourcompany.com/projects",
  "method": "GET",
  "headers": {
    "Authorization": "Bearer [TOKEN]",
    "Content-Type": "application/json"
  },
  "pagination": {
    "type": "offset",
    "limit": 1000
  }
}
```

---

## 📱 Mobile Optimization

### Mobile Layout Specifications
- **Screen Size**: Optimized for tablets (1024x768) and phones (375x667)
- **Navigation**: Simplified menu with key dashboards only
- **Interactions**: Touch-friendly buttons and gestures
- **Performance**: Reduced data load for mobile connections

### Mobile Dashboard Priority
1. **Executive Summary** (Most Important)
2. **Financial Performance** (High Priority)
3. **Risk & Issues** (Medium Priority)
4. **Portfolio Overview** (Optional)

### Mobile-Specific Calculations
```sql
-- Calculated Field: Mobile Display Format
IF SIZE() = 'Mobile' THEN 
    LEFT([Project Name], 20) + '...'
ELSE [Project Name] END
```

---

## 🎨 Design Standards

### Color Palette
```css
/* Executive Theme Colors */
Primary Blue: #1f4e79
Secondary Blue: #2e75b6
Accent Orange: #ff6b35
Success Green: #28a745
Warning Yellow: #ffc107
Danger Red: #dc3545
Neutral Gray: #6c757d
Background: #f8f9fa
```

### Typography
- **Headers**: Tableau Bold, 18-24pt
- **Subheaders**: Tableau Medium, 14-16pt
- **Body Text**: Tableau Regular, 10-12pt
- **KPI Values**: Tableau Bold, 28-36pt

### Layout Guidelines
- **Margins**: 10px minimum around all elements
- **Spacing**: 15px between visualization containers
- **Grid**: 12-column responsive grid system
- **Alignment**: Left-aligned text, center-aligned KPIs

---

## ⚡ Performance Optimization

### Data Extract Strategy
```sql
-- Incremental Refresh Configuration
WHERE [LastUpdated] >= DATEADD('day', -1, TODAY())
```

### Calculation Optimization
- Use **Table Calculations** instead of row-level calculations where possible
- Implement **Context Filters** for performance
- Utilize **Data Source Filters** to reduce data volume
- Create **Aggregated Extracts** for summary views

### Best Practices
1. **Limit Data Range**: Default to last 6 months
2. **Use Extracts**: For better performance with large datasets
3. **Optimize Joins**: Minimize complex table relationships
4. **Cache Management**: Regular refresh schedule during off-hours

---

## 🔒 Security Configuration

### User Access Levels
- **Executive View**: Full access to all dashboards
- **Manager View**: Portfolio-specific access
- **Team Lead View**: Project-specific access
- **Viewer**: Read-only access to summary dashboards

### Row-Level Security
```sql
-- User Filter
[Portfolio] = [User Portfolio] OR [User Role] = 'Executive'
```

### Publishing Settings
- **Server**: Tableau Server (Enterprise)
- **Site**: Executive Dashboards
- **Project**: Q3 2025 Executive Suite
- **Permissions**: Role-based access control

---

## 📋 Implementation Checklist

### Pre-Implementation
- [ ] Validate data source connections
- [ ] Test calculated fields with sample data
- [ ] Verify mobile responsiveness
- [ ] Configure security settings

### Implementation Steps
1. **Create Data Connections**
2. **Build Calculated Fields**
3. **Design Dashboard Layouts**
4. **Apply Formatting and Colors**
5. **Configure Filters and Parameters**
6. **Test Interactivity**
7. **Optimize Performance**
8. **Publish to Server**

### Post-Implementation
- [ ] User acceptance testing
- [ ] Performance monitoring
- [ ] Training delivery
- [ ] Documentation updates

---

## 🎓 Training Resources

### Executive Training (2 hours)
1. **Dashboard Navigation** (30 minutes)
2. **Key Metrics Interpretation** (45 minutes)
3. **Interactive Features** (30 minutes)
4. **Mobile Access** (15 minutes)

### Administrator Training (1 day)
1. **Data Source Management** (2 hours)
2. **Dashboard Maintenance** (2 hours)
3. **User Management** (1 hour)
4. **Performance Optimization** (2 hours)
5. **Troubleshooting** (1 hour)

---

**Template Version**: 1.0  
**Last Updated**: August 3, 2025  
**Compatibility**: Tableau Desktop 2021.4+, Tableau Server 2021.4+  
**Created By**: Enterprise Executive Dashboard Suite - Issue #327
