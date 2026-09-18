# Power BI Sample Data Sets and Custom Measures

## 📊 Overview
This document provides sample data sets and custom DAX measures to quickly populate and test your Power BI executive dashboards. Use these templates to demonstrate functionality before connecting to live data sources.

## 🎯 Sample Data Structure

### 1. Projects Sample Data
```csv
ProjectID,ProjectName,ProjectManager,StartDate,EndDate,Status,Priority,Portfolio,Budget,ActualCost,PercentComplete,RiskLevel,StrategicGoalID,LastUpdated
P001,Digital Transformation Initiative,Sarah Johnson,2024-01-15,2024-12-31,On Track,High,Technology,2500000,1875000,75,Medium,G001,2025-08-03
P002,Customer Portal Redesign,Michael Chen,2024-03-01,2024-09-30,At Risk,High,Technology,800000,720000,85,High,G002,2025-08-03
P003,Supply Chain Optimization,Emily Rodriguez,2024-02-01,2024-11-15,Behind Schedule,Medium,Operations,1200000,980000,60,High,G003,2025-08-03
P004,AI-Powered Analytics Platform,David Kim,2024-04-01,2025-02-28,On Track,High,Technology,1800000,900000,45,Low,G001,2025-08-03
P005,Sustainability Initiative,Lisa Wang,2024-01-01,2024-10-31,Completed,Medium,Operations,600000,580000,100,Low,G004,2025-08-03
P006,Mobile App Development,James Brown,2024-05-01,2024-12-15,Critical,High,Technology,950000,1100000,40,Critical,G002,2025-08-03
P007,Process Automation,Ana Martinez,2024-03-15,2024-09-30,On Track,Medium,Operations,700000,525000,70,Medium,G003,2025-08-03
P008,Cybersecurity Enhancement,Robert Taylor,2024-02-15,2024-08-31,At Risk,Critical,Technology,1500000,1350000,90,High,G005,2025-08-03
P009,Market Expansion,Jennifer Lee,2024-06-01,2025-03-31,On Track,High,Business,2200000,1100000,50,Medium,G006,2025-08-03
P010,ERP System Upgrade,Thomas Wilson,2024-01-01,2024-12-31,Behind Schedule,Critical,Technology,3000000,2400000,65,High,G001,2025-08-03
```

### 2. Financial Metrics Sample Data
```csv
RecordID,ProjectID,Date,BudgetAllocated,ActualSpend,ForecastCost,ROI,NPV,IRR,CostPerformanceIndex,EarnedValue
F001,P001,2025-01-31,500000,375000,2400000,1.25,450000,0.18,1.33,500000
F002,P001,2025-02-28,1000000,800000,2350000,1.28,480000,0.19,1.25,800000
F003,P001,2025-03-31,1500000,1200000,2300000,1.30,510000,0.20,1.25,1200000
F004,P002,2025-01-31,200000,180000,790000,1.15,120000,0.14,1.11,200000
F005,P002,2025-02-28,400000,360000,780000,1.18,140000,0.15,1.11,400000
F006,P002,2025-03-31,600000,540000,770000,1.20,160000,0.16,1.11,600000
F007,P003,2025-01-31,300000,245000,1180000,1.08,80000,0.12,1.22,300000
F008,P003,2025-02-28,600000,490000,1170000,1.10,90000,0.13,1.22,600000
F009,P003,2025-03-31,900000,735000,1160000,1.12,100000,0.14,1.22,900000
F010,P004,2025-01-31,225000,112500,1780000,1.40,350000,0.22,2.00,225000
```

### 3. Risk Register Sample Data
```csv
RiskID,ProjectID,RiskDescription,Impact,Probability,RiskScore,Status,Owner,MitigationPlan,DateIdentified,DateClosed
R001,P001,Technology integration complexity,4,3,12,Open,Sarah Johnson,Phased integration approach,2024-02-01,
R002,P002,User adoption resistance,3,4,12,Mitigating,Michael Chen,Comprehensive training program,2024-03-15,
R003,P003,Supply chain disruption,5,2,10,Open,Emily Rodriguez,Alternative supplier identification,2024-02-15,
R004,P004,Data quality issues,3,3,9,Closed,David Kim,Data validation framework,2024-04-15,2024-06-30
R005,P005,Regulatory compliance changes,2,2,4,Closed,Lisa Wang,Regular compliance reviews,2024-01-15,2024-08-01
R006,P006,Budget overrun,4,4,16,Critical,James Brown,Weekly budget reviews,2024-05-15,
R007,P007,Resource availability,3,2,6,Mitigating,Ana Martinez,Cross-training initiatives,2024-03-30,
R008,P008,Security vulnerabilities,5,3,15,Open,Robert Taylor,Enhanced security protocols,2024-02-28,
R009,P009,Market conditions change,4,2,8,Open,Jennifer Lee,Market monitoring system,2024-06-15,
R010,P010,System compatibility issues,4,3,12,Mitigating,Thomas Wilson,Compatibility testing framework,2024-01-15,
```

### 4. Strategic Goals Sample Data
```csv
GoalID,GoalName,Description,TargetDate,Status,KPI,CurrentValue,TargetValue,BusinessUnit
G001,Digital Innovation Leadership,Become industry leader in digital solutions,2024-12-31,In Progress,Digital Revenue %,35,50,Technology
G002,Customer Experience Excellence,Achieve best-in-class customer satisfaction,2024-10-31,In Progress,NPS Score,72,85,Business
G003,Operational Efficiency,Reduce operational costs by 15%,2024-11-30,In Progress,Cost Reduction %,8,15,Operations
G004,Sustainability Goals,Achieve carbon neutrality,2024-12-31,Completed,Carbon Reduction %,100,100,Operations
G005,Cybersecurity Maturity,Implement enterprise security framework,2024-08-31,At Risk,Security Score,7,9,Technology
G006,Market Expansion,Enter 3 new geographical markets,2025-03-31,On Track,New Markets,1,3,Business
```

### 5. Resource Utilization Sample Data
```csv
ResourceID,ProjectID,ResourceName,Role,Allocation,Cost,StartDate,EndDate,Utilization,SkillLevel
R001,P001,Sarah Johnson,Project Manager,100,150000,2024-01-15,2024-12-31,95,Senior
R002,P001,Alex Thompson,Developer,80,120000,2024-01-15,2024-12-31,85,Senior
R003,P001,Maria Garcia,Designer,60,90000,2024-02-01,2024-10-31,75,Mid
R004,P002,Michael Chen,Project Manager,100,145000,2024-03-01,2024-09-30,90,Senior
R005,P002,John Davis,Developer,100,110000,2024-03-01,2024-09-30,95,Mid
R006,P003,Emily Rodriguez,Project Manager,100,140000,2024-02-01,2024-11-15,85,Senior
R007,P003,Carlos Mendez,Analyst,80,95000,2024-02-01,2024-11-15,80,Mid
R008,P004,David Kim,Project Manager,100,160000,2024-04-01,2025-02-28,88,Senior
R009,P004,Rachel Park,Data Scientist,90,130000,2024-04-01,2025-02-28,92,Senior
R010,P005,Lisa Wang,Project Manager,100,135000,2024-01-01,2024-10-31,100,Senior
```

## 🧮 Advanced DAX Measures

### Executive Summary KPIs

```dax
// Portfolio Health Score (Weighted)
Portfolio Health Score = 
VAR HealthTable = 
    ADDCOLUMNS(
        Projects,
        "HealthPoints", 
        SWITCH(
            Projects[Status],
            "On Track", 100,
            "At Risk", 60,
            "Behind Schedule", 30,
            "Critical", 10,
            "Completed", 100,
            50
        ),
        "Weight", Projects[Budget]
    )
RETURN
    DIVIDE(
        SUMX(HealthTable, [HealthPoints] * [Weight]),
        SUM(Projects[Budget])
    )

// Budget Performance Index
Budget Performance Index = 
VAR TotalBudget = SUM(Projects[Budget])
VAR TotalActual = SUM(Projects[ActualCost])
VAR TotalEarned = 
    SUMX(
        Projects,
        Projects[Budget] * (Projects[PercentComplete] / 100)
    )
RETURN
    DIVIDE(TotalEarned, TotalActual)

// Schedule Performance Index
Schedule Performance Index = 
VAR Today = TODAY()
VAR TotalProjects = COUNTROWS(Projects)
VAR OnScheduleProjects = 
    COUNTROWS(
        FILTER(
            Projects,
            OR(
                Projects[Status] = "Completed",
                AND(
                    Projects[Status] <> "Behind Schedule",
                    Projects[EndDate] >= Today
                )
            )
        )
    )
RETURN
    DIVIDE(OnScheduleProjects, TotalProjects)

// Risk Exposure Score
Risk Exposure Score = 
VAR CriticalRisks = COUNTROWS(FILTER(RiskRegister, RiskRegister[RiskScore] >= 15))
VAR HighRisks = COUNTROWS(FILTER(RiskRegister, RiskRegister[RiskScore] >= 10 && RiskRegister[RiskScore] < 15))
VAR TotalRisks = COUNTROWS(RiskRegister)
RETURN
    IF(
        TotalRisks = 0,
        0,
        DIVIDE((CriticalRisks * 3) + (HighRisks * 2), TotalRisks * 3) * 100
    )

// Strategic Alignment Rate
Strategic Alignment Rate = 
VAR AlignedProjects = 
    COUNTROWS(
        FILTER(Projects, NOT(ISBLANK(Projects[StrategicGoalID])))
    )
VAR TotalProjects = COUNTROWS(Projects)
RETURN
    DIVIDE(AlignedProjects, TotalProjects) * 100
```

### Financial Performance Measures

```dax
// Weighted Average ROI
Weighted Average ROI = 
DIVIDE(
    SUMX(
        RELATEDTABLE(FinancialMetrics),
        FinancialMetrics[ROI] * Projects[Budget]
    ),
    SUM(Projects[Budget])
)

// Portfolio NPV
Portfolio NPV = 
SUMX(
    VALUES(Projects[ProjectID]),
    CALCULATE(
        LASTNONBLANK(FinancialMetrics[Date], FinancialMetrics[NPV])
    )
)

// Forecast Accuracy
Forecast Accuracy = 
VAR ForecastVariance = 
    SUMX(
        FinancialMetrics,
        ABS(FinancialMetrics[ForecastCost] - FinancialMetrics[ActualSpend])
    )
VAR TotalActual = SUM(FinancialMetrics[ActualSpend])
RETURN
    IF(
        TotalActual = 0,
        0,
        MAX(0, 100 - (DIVIDE(ForecastVariance, TotalActual) * 100))
    )

// Cash Flow Projection
Cash Flow Projection = 
VAR RemainingBudget = 
    SUMX(
        Projects,
        Projects[Budget] * ((100 - Projects[PercentComplete]) / 100)
    )
VAR MonthsRemaining = 6 // Configurable parameter
RETURN
    DIVIDE(RemainingBudget, MonthsRemaining)

// Cost at Completion (EAC)
Estimate at Completion = 
SUMX(
    Projects,
    VAR CPI = DIVIDE(
        Projects[Budget] * (Projects[PercentComplete] / 100),
        Projects[ActualCost]
    )
    RETURN
        IF(
            CPI > 0,
            DIVIDE(Projects[Budget], CPI),
            Projects[Budget] * 1.2 // Default overrun assumption
        )
)
```

### Resource and Capacity Measures

```dax
// Resource Utilization Rate
Resource Utilization Rate = 
DIVIDE(
    SUMX(Resources, Resources[Allocation] * Resources[Utilization] / 100),
    SUM(Resources[Allocation])
) * 100

// Team Productivity Index
Team Productivity Index = 
VAR CompletedWork = 
    SUMX(
        FILTER(Projects, Projects[Status] = "Completed"),
        Projects[Budget]
    )
VAR TotalResourceCost = SUM(Resources[Cost])
RETURN
    DIVIDE(CompletedWork, TotalResourceCost)

// Skill Gap Analysis
Critical Skill Gap = 
VAR SeniorResources = COUNTROWS(FILTER(Resources, Resources[SkillLevel] = "Senior"))
VAR TotalResources = COUNTROWS(Resources)
VAR OptimalSeniorRatio = 0.4 // 40% should be senior
RETURN
    MAX(
        0,
        (OptimalSeniorRatio * TotalResources) - SeniorResources
    )

// Capacity Forecast
Available Capacity Next Quarter = 
VAR NextQuarterStart = EOMONTH(TODAY(), 0) + 1
VAR NextQuarterEnd = EOMONTH(TODAY(), 3)
VAR AvailableResources = 
    SUMX(
        FILTER(
            Resources,
            OR(
                Resources[EndDate] >= NextQuarterStart,
                ISBLANK(Resources[EndDate])
            )
        ),
        Resources[Allocation] * (1 - Resources[Utilization] / 100)
    )
RETURN
    AvailableResources * 0.75 // 75% efficiency factor
```

### Risk and Quality Measures

```dax
// Risk Trend Analysis
Risk Trend Direction = 
VAR CurrentMonth = MONTH(TODAY())
VAR PreviousMonth = CurrentMonth - 1
VAR CurrentRisks = 
    COUNTROWS(
        FILTER(
            RiskRegister,
            MONTH(RiskRegister[DateIdentified]) = CurrentMonth
        )
    )
VAR PreviousRisks = 
    COUNTROWS(
        FILTER(
            RiskRegister,
            MONTH(RiskRegister[DateIdentified]) = PreviousMonth
        )
    )
RETURN
    SWITCH(
        TRUE(),
        CurrentRisks > PreviousRisks, "Increasing",
        CurrentRisks < PreviousRisks, "Decreasing",
        "Stable"
    )

// Quality Score
Project Quality Score = 
VAR CompletedOnTime = 
    COUNTROWS(
        FILTER(
            Projects,
            AND(
                Projects[Status] = "Completed",
                Projects[EndDate] <= Projects[PlannedEndDate] // Assuming this field exists
            )
        )
    )
VAR CompletedOnBudget = 
    COUNTROWS(
        FILTER(
            Projects,
            AND(
                Projects[Status] = "Completed",
                Projects[ActualCost] <= Projects[Budget]
            )
        )
    )
VAR TotalCompleted = COUNTROWS(FILTER(Projects, Projects[Status] = "Completed"))
VAR TimeScore = DIVIDE(CompletedOnTime, TotalCompleted) * 50
VAR BudgetScore = DIVIDE(CompletedOnBudget, TotalCompleted) * 50
RETURN
    TimeScore + BudgetScore

// Issue Resolution Rate
Issue Resolution Rate = 
VAR OpenIssues = COUNTROWS(FILTER(RiskRegister, RiskRegister[Status] = "Open"))
VAR ClosedIssues = COUNTROWS(FILTER(RiskRegister, RiskRegister[Status] = "Closed"))
VAR TotalIssues = OpenIssues + ClosedIssues
RETURN
    DIVIDE(ClosedIssues, TotalIssues) * 100
```

### Time-Intelligence Measures

```dax
// Year-over-Year Growth
Portfolio Value YoY Growth = 
VAR CurrentYearValue = SUM(Projects[Budget])
VAR PreviousYearValue = 
    CALCULATE(
        SUM(Projects[Budget]),
        SAMEPERIODLASTYEAR('Calendar'[Date])
    )
RETURN
    DIVIDE(CurrentYearValue - PreviousYearValue, PreviousYearValue) * 100

// Quarter-over-Quarter Comparison
Projects Completed QoQ = 
VAR CurrentQuarter = 
    COUNTROWS(
        FILTER(Projects, Projects[Status] = "Completed")
    )
VAR PreviousQuarter = 
    CALCULATE(
        COUNTROWS(FILTER(Projects, Projects[Status] = "Completed")),
        PREVIOUSQUARTER('Calendar'[Date])
    )
RETURN
    CurrentQuarter - PreviousQuarter

// Moving Average (3-month)
Budget Utilization 3M Avg = 
AVERAGEX(
    DATESINPERIOD(
        'Calendar'[Date],
        MAX('Calendar'[Date]),
        -3,
        MONTH
    ),
    [Budget Utilization Rate]
)

// Trending Direction
Performance Trend = 
VAR Current = [Portfolio Health Score]
VAR Previous = 
    CALCULATE(
        [Portfolio Health Score],
        PREVIOUSMONTH('Calendar'[Date])
    )
RETURN
    SWITCH(
        TRUE(),
        Current > Previous * 1.05, "↗ Improving",
        Current < Previous * 0.95, "↘ Declining",
        "→ Stable"
    )
```

## 📊 Visualization Recommendations

### Card Visuals
Use these measures in card visuals for executive summary:
- Portfolio Health Score
- Budget Performance Index
- Strategic Alignment Rate
- Risk Exposure Score

### Gauge Charts
Perfect for performance indicators:
- Schedule Performance Index (Target: 100%)
- Resource Utilization Rate (Target: 85%)
- Project Quality Score (Target: 90%)

### Line Charts
Ideal for trend analysis:
- Portfolio Value YoY Growth
- Budget Utilization 3M Avg
- Risk Trend Analysis over time

### Scatter Plot
Great for portfolio analysis:
- X-axis: Risk Score
- Y-axis: ROI
- Size: Budget
- Color: Status

## 🔧 Implementation Notes

### Data Refresh Strategy
```dax
// Last Refresh Timestamp
Last Data Refresh = 
FORMAT(NOW(), "yyyy-mm-dd hh:mm:ss")

// Data Freshness Warning
Data Freshness Warning = 
VAR LastUpdate = MAX(Projects[LastUpdated])
VAR HoursSinceUpdate = DATEDIFF(LastUpdate, NOW(), HOUR)
RETURN
    IF(
        HoursSinceUpdate > 24,
        "⚠ Data may be outdated",
        "✓ Data is current"
    )
```

### Performance Optimization
1. **Use Variables**: Store complex calculations in variables
2. **Filter Early**: Apply filters before expensive calculations
3. **Avoid Calculated Columns**: Use measures for better performance
4. **Proper Relationships**: Ensure efficient data model relationships

---

**Template Version**: 1.0  
**Last Updated**: August 3, 2025  
**Compatibility**: Power BI Desktop 2.120+  
**Created By**: Enterprise Executive Dashboard Suite - Issue #327
