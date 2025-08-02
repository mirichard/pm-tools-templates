# Excel Executive Dashboard Workbook

**Purpose:** Interactive Excel workbook for real-time project tracking and analysis  
**Audience:** CFO, PMO, Project Managers, Executive Sponsors  
**Features:** Automated calculations, pivot tables, visual charts, scenario modeling  

---

## 📊 Workbook Structure (7 Worksheets)

### Sheet 1: Executive Summary
```
     A          B          C          D          E          F
1  PROJECT EXECUTIVE DASHBOARD - [Project Name]
2  Report Date: [=TODAY()]     Next Update: [=TODAY()+7]
3
4  OVERALL PROJECT HEALTH                    SCORE: 73/100
5  ┌─────────────────────────────────────────────────────┐
6  │ Schedule   ████████████████████████████████ 85/100  │
7  │ Budget     ████████████████░░░░░░░░░░░░░░░░ 55/100  │
8  │ Scope      ████████████████████████████░░░░ 80/100  │
9  │ Quality    ████████████████████████████████ 90/100  │
10 │ Risks      ████████████████████░░░░░░░░░░░░ 65/100  │
11 │ Team       ████████████████████████████████ 88/100  │
12 │ Stakeholder████████████████████████░░░░░░░░ 75/100  │
13 └─────────────────────────────────────────────────────┘
14
15 FINANCIAL SUMMARY
16 Total Budget:        $1,500,000
17 Spent to Date:      $1,200,000
18 Forecast Total:     $1,650,000
19 Variance:           $(150,000)    -10.0%
20 Remaining Budget:   $300,000
21
22 KEY MILESTONES
23 MVP Release:         Aug 30, 2024    ✅ On Track
24 User Testing:        Jul 15, 2024    🔄 In Progress
25 Full Deployment:     Oct 15, 2024    ⚠️ At Risk
26
27 TOP RISKS
28 Data Migration:      Score 20        🔴 Critical
29 Vendor Delays:       Score 16        🟡 High
30 Compliance Changes:  Score 15        🟡 High
```

### Sheet 2: Financial Dashboard
```
     A              B           C           D           E           F
1  FINANCIAL PERFORMANCE DASHBOARD
2
3  BUDGET BREAKDOWN
4  Category          Budget      Actual      Forecast    Variance    %Var
5  Labor            $600,000    $520,000    $650,000    $(50,000)   -8.3%
6  Vendor           $300,000    $280,000    $450,000    $(150,000)  -50.0%
7  Infrastructure   $200,000    $175,000    $175,000    $25,000     12.5%
8  Training         $100,000    $75,000     $100,000    $0          0.0%
9  Contingency      $300,000    $0          $225,000    $75,000     25.0%
10 TOTAL           $1,500,000   $1,050,000  $1,600,000  $(100,000)  -6.7%
11
12 MONTHLY BURN RATE
13 Month            Budget      Actual      Variance    Cumulative
14 January         $100,000    $95,000     $5,000      $5,000
15 February        $120,000    $118,000    $2,000      $7,000
16 March           $150,000    $165,000    $(15,000)   $(8,000)
17 April           $130,000    $142,000    $(12,000)   $(20,000)
18 May             $140,000    $155,000    $(15,000)   $(35,000)
19
20 FINANCIAL KPIs
21 Cost Performance Index (CPI):    0.92
22 Budget Utilization %:            70.0%
23 Forecast Accuracy:               ±5.2%
24 Contingency Remaining:           75.0%
```

### Sheet 3: Risk Register
```
     A        B                        C         D        E        F        G
1  RISK REGISTER DASHBOARD
2
3  Risk ID  Description              Category  Prob     Impact   Score    Status
4  R001     Data Migration Complex   Technical  4        5        20       🔴 Critical
5  R002     Vendor Delivery Delays   Schedule   4        4        16       🟡 High
6  R003     Regulatory Changes       External   3        5        15       🟡 High
7  R004     Resource Availability    Resource   3        3        9        🟢 Medium
8  R005     Budget Overrun          Financial  2        4        8        🟢 Medium
9
10 RISK SUMMARY METRICS
11 Total Risks:                25
12 Critical Risks (15-25):     7     28.0%
13 High Risks (10-14):         8     32.0%
14 Medium Risks (5-9):         10    40.0%
15
16 FINANCIAL IMPACT
17 Total $ at Risk:           $550,000
18 Mitigation Cost:           $235,000
19 Net Risk Exposure:         $315,000
20
21 RISK TREND ANALYSIS
22 New Risks (This Month):     3
23 Closed Risks:              2
24 Average Resolution Time:    15 days
```

### Sheet 4: Schedule Tracking
```
     A              B              C              D           E
1  SCHEDULE PERFORMANCE DASHBOARD
2
3  MILESTONE TRACKING
4  Milestone         Planned Date   Forecast Date  Variance    Status
5  Project Kickoff   Jan 15, 2024   Jan 15, 2024   0 days     ✅ Complete
6  Requirements      Mar 1, 2024    Feb 28, 2024   +1 day     ✅ Complete
7  Design Approval   Apr 15, 2024   Apr 12, 2024   +3 days    ✅ Complete
8  Development       Jun 30, 2024   Jun 25, 2024   +5 days    🔄 In Progress
9  User Testing      Aug 15, 2024   Aug 15, 2024   0 days     📅 Scheduled
10 MVP Release       Sep 30, 2024   Sep 30, 2024   0 days     📅 Scheduled
11 Full Deployment   Nov 15, 2024   Nov 22, 2024   -7 days    ⚠️ At Risk
12
13 SCHEDULE KPIs
14 Schedule Performance Index:  1.08
15 Critical Path Float:         5 days
16 Milestone Achievement Rate:  95.0%
17 Average Delay per Milestone: +0.7 days
18
19 CRITICAL PATH ANALYSIS
20 Activity              Duration   Float    Status
21 Database Design       10 days    0 days   Critical
22 API Development       15 days    2 days   Near Critical
23 Integration Testing   8 days     0 days   Critical
24 User Acceptance       5 days     3 days   Normal
```

### Sheet 5: Team Performance
```
     A              B           C           D           E
1  TEAM PERFORMANCE DASHBOARD
2
3  TEAM METRICS
4  Metric                    Current     Target      Status
5  Team Velocity             85 pts      78 pts      ✅ Above Target
6  Team Satisfaction         4.2/5       4.0/5       ✅ Above Target
7  Sprint Commitment         92%         85%         ✅ Above Target
8  Cross-training Level      75%         75%         ✅ On Target
9  Team Turnover            0%          <5%         ✅ Excellent
10
11 RESOURCE ALLOCATION
12 Role                 Planned FTE  Actual FTE  Utilization  Issues
13 Project Manager     1.0          1.0         100%         None
14 Business Analyst    2.0          1.5         75%          Resource Gap
15 Developers          6.0          5.0         83%          1 Open Position
16 QA Engineers        2.0          2.0         100%         None
17 DevOps Engineer     1.0          1.0         100%         None
18
19 TEAM HEALTH INDICATORS
20 Burnout Risk Level:        Low
21 Knowledge Sharing Score:   4.3/5
22 Collaboration Rating:      4.5/5
23 Process Satisfaction:      4.1/5
```

### Sheet 6: Stakeholder Engagement
```
     A                    B              C           D           E
1  STAKEHOLDER ENGAGEMENT DASHBOARD
2
3  STAKEHOLDER SATISFACTION
4  Stakeholder Group       Count    Satisfaction  Engagement  Trend
5  Executive Sponsors      3        4.5/5         High        ↗️
6  Functional Managers     8        4.2/5         Medium      →
7  Project Team           15        4.4/5         High        ↗️
8  End Users              25        3.8/5         Medium      ↘️
9  External Vendors        4        4.0/5         Medium      →
10
11 COMMUNICATION EFFECTIVENESS
12 Email Open Rate:             87%
13 Meeting Attendance:          92%
14 Response Time (Avg):         18 hours
15 Feedback Quality Score:      4.1/5
16
17 ENGAGEMENT ACTIVITIES
18 Activity                 Frequency    Attendance   Effectiveness
19 Executive Reviews        Monthly      95%          4.3/5
20 Team Standups           Daily        97%          4.5/5
21 Sprint Reviews          Bi-weekly    83%          4.2/5
22 Stakeholder Updates     Monthly      76%          3.9/5
```

### Sheet 7: Data Sources & Calculations
```
     A                    B                   C
1  DATA SOURCES AND FORMULAS
2
3  HEALTH SCORE CALCULATIONS
4  Overall Health = AVERAGE(B6:B12)  [From Executive Summary]
5  Schedule Health = (SPI * 50) + (Float/10 * 25) + (Milestone% * 25)
6  Budget Health = 100 - ABS(Variance% * 100)
7  Risk Health = 100 - (Critical_Risks * 5) - (High_Risks * 2)
8
9  FINANCIAL FORMULAS
10 Variance = Actual - Budget
11 Variance% = Variance / Budget
12 CPI = Earned Value / Actual Cost
13 Burn Rate = Total Spent / Months Elapsed
14
15 CONDITIONAL FORMATTING RULES
16 Green (Good):     >80
17 Yellow (Caution): 60-80
18 Red (Critical):   <60
19
20 AUTOMATED UPDATES
21 Last Updated: =NOW()
22 Next Update: =TODAY()+7
23 Data Refresh: Every weekday at 9 AM
```

---

## 🔧 Excel Features & Formulas

### Key Excel Functions Used
```excel
// Health Score Calculation
=AVERAGE(B6:B12)

// Budget Variance
=IF(C5<>0,(B5-C5)/C5,0)

// Risk Score
=B4*C4

// Conditional Formatting for Status
=IF(E5>80,"🟢",IF(E5>60,"🟡","🔴"))

// Trend Indicators
=IF(F5>F4,"↗️",IF(F5<F4,"↘️","→"))

// Project Health Color
=IF(B4>=80,"Green",IF(B4>=60,"Yellow","Red"))
```

### Data Validation Rules
- **Dates:** Must be in YYYY-MM-DD format
- **Percentages:** Between 0% and 100%
- **Risk Scores:** Between 1 and 25
- **Budget Values:** Positive numbers only
- **Status Fields:** Dropdown lists with predefined values

### Pivot Table Configurations
1. **Risk Analysis:** Risk Category vs. Score
2. **Budget Tracking:** Month vs. Category vs. Variance
3. **Milestone Performance:** Phase vs. Variance
4. **Team Metrics:** Role vs. Utilization

---

## 📊 Chart Recommendations

### Executive Summary Charts
- **Health Scorecard:** Horizontal bar chart with color coding
- **Budget Status:** Gauge chart showing percentage utilized
- **Timeline:** Gantt chart with milestone markers

### Financial Dashboard Charts
- **Budget Variance:** Waterfall chart showing categories
- **Burn Rate:** Line chart with trend analysis
- **Forecast vs. Actual:** Combination chart

### Risk Dashboard Charts
- **Risk Heat Map:** Scatter plot (Probability vs. Impact)
- **Risk Trend:** Area chart showing risk levels over time
- **Category Breakdown:** Donut chart by risk type

---

## 🔄 Advanced Integration & Automation

### 🚀 NEW: Power Query Data Connections

#### Jira Integration (Power Query)
```M
// Power Query M Language - Jira Connection
let
    Source = Web.Contents(
        "https://your-company.atlassian.net/rest/api/3/search",
        [
            Headers = [
                #"Authorization" = "Basic " & Binary.ToText(
                    Text.ToBinary("username:api-token"), 
                    BinaryEncoding.Base64
                ),
                #"Content-Type" = "application/json"
            ],
            Content = Text.ToBinary(
                "{\"jql\":\"project = 'EXEC' AND updated >= -7d\",\"fields\":[\"key\",\"summary\",\"status\",\"assignee\",\"created\",\"updated\"]}"
            )
        ]
    ),
    JsonResponse = Json.Document(Source),
    Issues = JsonResponse[issues],
    ConvertToTable = Table.FromList(Issues, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    ExpandRecords = Table.ExpandRecordColumn(ConvertToTable, "Column1", 
        {"key", "fields"}, 
        {"IssueKey", "Fields"}
    ),
    ExpandFields = Table.ExpandRecordColumn(ExpandRecords, "Fields",
        {"summary", "status", "assignee", "created", "updated"},
        {"Summary", "Status", "Assignee", "Created", "Updated"}
    )
in
    ExpandFields
```

#### Azure DevOps Integration (Power Query)
```M
// Power Query M Language - Azure DevOps Connection
let
    Source = Web.Contents(
        "https://dev.azure.com/your-org/your-project/_apis/wit/wiql",
        [
            Headers = [
                #"Authorization" = "Basic " & Binary.ToText(
                    Text.ToBinary(":" & "your-pat-token"), 
                    BinaryEncoding.Base64
                ),
                #"Content-Type" = "application/json"
            ],
            Content = Text.ToBinary(
                "{\"query\":\"SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo] FROM WorkItems WHERE [System.TeamProject] = 'ExecutiveDashboard' AND [System.ChangedDate] >= @today - 7\"}"
            )
        ]
    ),
    JsonResponse = Json.Document(Source),
    WorkItems = JsonResponse[workItems],
    ConvertToTable = Table.FromList(WorkItems, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    ExpandWorkItems = Table.ExpandRecordColumn(ConvertToTable, "Column1", 
        {"id", "url"}, 
        {"WorkItemId", "WorkItemUrl"}
    )
in
    ExpandWorkItems
```

#### Financial ERP Integration (Power Query)
```M
// Power Query M Language - ERP System Connection
let
    Source = Sql.Database(
        "your-erp-server.company.com", 
        "FinancialDB",
        [
            Query = "
                SELECT 
                    ProjectCode,
                    BudgetCategory,
                    PlannedAmount,
                    ActualAmount,
                    ForecastAmount,
                    PeriodDate,
                    LastUpdated
                FROM ProjectFinancials 
                WHERE ProjectCode IN ('EXEC-001', 'EXEC-002') 
                    AND PeriodDate >= DATEADD(month, -6, GETDATE())
                ORDER BY PeriodDate DESC
            "
        ]
    )
in
    Source
```

### 📊 Advanced Excel Formulas for Financial Modeling

#### Dynamic Budget Variance Analysis
```excel
// Advanced Budget Health Score
=LET(
    variance_pct, (ActualCost - PlannedCost) / PlannedCost,
    trend_factor, IF(VarianceTrend="Improving", 1.1, IF(VarianceTrend="Worsening", 0.9, 1)),
    base_score, MAX(0, 100 - (ABS(variance_pct) * 100)),
    adjusted_score, base_score * trend_factor,
    MIN(100, adjusted_score)
)

// Predictive Forecast Model
=FORECAST.ETS(
    DATE(2024,12,31),
    MonthlyActuals,
    MonthlyDates,
    1,
    1,
    1
)

// Risk-Adjusted ROI Calculation
=LET(
    base_roi, (ProjectValue - ProjectCost) / ProjectCost,
    risk_factor, 1 - (RiskScore / 100 * 0.3),
    risk_adjusted_roi, base_roi * risk_factor,
    risk_adjusted_roi
)
```

### 🎨 Interactive Charts with Drill-Down Capabilities

#### Executive Summary Interactive Dashboard
```vba
' VBA Code for Interactive Chart Functionality
Private Sub Chart_SeriesClick(ByVal SeriesIndex As Long, ByVal PointIndex As Long, Cancel As Boolean)
    Dim selectedCategory As String
    Dim detailSheet As Worksheet
    
    ' Get clicked category
    selectedCategory = ActiveChart.SeriesCollection(SeriesIndex).Points(PointIndex).DataLabel.Text
    
    ' Navigate to detail view
    Select Case selectedCategory
        Case "Budget"
            Set detailSheet = Worksheets("Financial Dashboard")
        Case "Schedule"
            Set detailSheet = Worksheets("Schedule Tracking")
        Case "Risks"
            Set detailSheet = Worksheets("Risk Register")
        Case "Team"
            Set detailSheet = Worksheets("Team Performance")
    End Select
    
    ' Activate detail sheet and highlight relevant section
    detailSheet.Activate
    detailSheet.Range("A1:F20").Select
End Sub

' Auto-refresh data connections
Private Sub Workbook_Open()
    ' Refresh all Power Query connections
    ActiveWorkbook.Connections.RefreshAll
    
    ' Schedule next auto-refresh
    Application.OnTime Now + TimeValue("00:15:00"), "RefreshDashboard"
End Sub

Sub RefreshDashboard()
    ' Refresh all data connections
    ActiveWorkbook.Connections.RefreshAll
    
    ' Update last refresh timestamp
    Range("LastRefresh").Value = Now()
    
    ' Schedule next refresh (15 minutes)
    Application.OnTime Now + TimeValue("00:15:00"), "RefreshDashboard"
End Sub
```

### 🚨 Automated Variance Analysis and Alerting

#### Alert Threshold Configuration
```excel
// Budget Alert Formula (Conditional Formatting)
=AND(
    ABS((Actual-Budget)/Budget) > AlertThreshold,
    AlertsEnabled = TRUE
)

// Email Alert Trigger (VBA)
Sub CheckBudgetAlerts()
    Dim i As Long
    Dim alertMessage As String
    Dim criticalAlerts As String
    
    For i = 5 To 20 ' Budget rows
        If Cells(i, 7).Value > 0.1 Then ' 10% variance threshold
            criticalAlerts = criticalAlerts & "\n• " & Cells(i, 1).Value & ": " & Format(Cells(i, 7).Value, "0.0%") & " over budget"
        End If
    Next i
    
    If criticalAlerts <> "" Then
        alertMessage = "🚨 BUDGET ALERTS for " & Range("ProjectName").Value & ":" & criticalAlerts
        Call SendEmailAlert(alertMessage)
    End If
End Sub

Sub SendEmailAlert(message As String)
    Dim outlookApp As Object
    Dim mailItem As Object
    
    Set outlookApp = CreateObject("Outlook.Application")
    Set mailItem = outlookApp.CreateItem(0)
    
    With mailItem
        .To = Range("AlertEmailList").Value
        .Subject = "Executive Dashboard Alert - " & Range("ProjectName").Value
        .Body = message & "\n\nDashboard: " & ThisWorkbook.FullName
        .Send
    End With
End Sub
```

### Refresh Schedule
- **Daily:** Team metrics, budget actuals
- **Weekly:** Risk scores, milestone progress
- **Monthly:** Stakeholder satisfaction, financial forecasts
- **On-Demand:** Executive summary before key meetings

### Distribution Options
- **Email Automation:** Send weekly reports to stakeholder lists
- **SharePoint Integration:** Publish to executive dashboard
- **Power BI Connection:** Feed data to real-time dashboards
- **PDF Export:** Generate printable executive summaries

---

*This Excel workbook should be customized with your organization's specific metrics, branding, and data sources. Regular maintenance ensures accuracy and relevance for executive decision-making.*

