# Executive Dashboard Health Scoring System

## 📊 Overview

**Purpose:** Automated algorithms to calculate project health scores for executive dashboards  
**Output:** Real-time health scores (0-100) with predictive trending  
**Integration:** Excel, PowerPoint, real-time dashboards, and BI platforms  

---

## 🏗️ Health Score Architecture

### Core Health Dimensions (100-Point Scale)

| Dimension | Weight | Max Points | Description |
|-----------|--------|------------|-------------|
| **Schedule Performance** | 20% | 20 | Timeline adherence and milestone delivery |
| **Budget Performance** | 20% | 20 | Financial management and cost control |
| **Scope Management** | 15% | 15 | Requirements stability and change control |
| **Quality Metrics** | 15% | 15 | Defect rates, testing results, quality gates |
| **Risk Management** | 15% | 15 | Risk exposure and mitigation effectiveness |
| **Team Performance** | 10% | 10 | Team velocity, satisfaction, and capacity |
| **Stakeholder Satisfaction** | 5% | 5 | Stakeholder engagement and feedback |

### Health Score Ranges

```
🟢 HEALTHY:   80-100 points  (Green Zone)
🟡 CAUTION:   60-79 points   (Yellow Zone) 
🔴 CRITICAL:  0-59 points    (Red Zone)
```

---

## 🔢 Detailed Scoring Algorithms

### 1. Schedule Performance Score (20 Points)

#### Algorithm Implementation
```javascript
function calculateScheduleScore(projectData) {
    const {
        schedulePerformanceIndex, // SPI from earned value management
        milestoneAchievementRate, // % of milestones delivered on time
        criticalPathFloat,        // Days of float on critical path
        averageDelayDays,        // Average delay per milestone
        totalMilestones,         // Total planned milestones
        completedMilestones      // Milestones completed
    } = projectData;
    
    // Base SPI Score (0-8 points)
    let spiScore = 0;
    if (schedulePerformanceIndex >= 1.1) spiScore = 8;
    else if (schedulePerformanceIndex >= 1.0) spiScore = 6;
    else if (schedulePerformanceIndex >= 0.9) spiScore = 4;
    else if (schedulePerformanceIndex >= 0.8) spiScore = 2;
    else spiScore = 0;
    
    // Milestone Achievement Score (0-8 points)
    let milestoneScore = Math.round(milestoneAchievementRate * 8);
    
    // Critical Path Score (0-2 points)
    let criticalPathScore = 0;
    if (criticalPathFloat >= 10) criticalPathScore = 2;
    else if (criticalPathFloat >= 5) criticalPathScore = 1;
    else criticalPathScore = 0;
    
    // Delay Penalty (0-2 points)
    let delayScore = 0;
    if (averageDelayDays <= 1) delayScore = 2;
    else if (averageDelayDays <= 3) delayScore = 1;
    else delayScore = 0;
    
    const totalScheduleScore = Math.min(20, spiScore + milestoneScore + criticalPathScore + delayScore);
    
    return {
        score: totalScheduleScore,
        breakdown: {
            spi: spiScore,
            milestones: milestoneScore,
            criticalPath: criticalPathScore,
            delays: delayScore
        },
        trend: calculateScheduleTrend(projectData),
        alerts: generateScheduleAlerts(projectData)
    };
}

function calculateScheduleTrend(data) {
    // Analyze last 4 weeks of SPI data
    const recentSPI = data.historicalSPI.slice(-4);
    const trend = linearRegression(recentSPI);
    
    if (trend.slope > 0.02) return 'IMPROVING';
    if (trend.slope < -0.02) return 'DECLINING';
    return 'STABLE';
}
```

#### Excel Implementation
```excel
// Schedule Performance Score Formula
=LET(
    SPI, ScheduleData[SPI],
    MilestoneRate, ScheduleData[MilestoneAchievementRate],
    CriticalFloat, ScheduleData[CriticalPathFloat],
    AvgDelay, ScheduleData[AverageDelay],
    
    SPIScore, IF(SPI>=1.1, 8, IF(SPI>=1.0, 6, IF(SPI>=0.9, 4, IF(SPI>=0.8, 2, 0)))),
    MilestoneScore, ROUND(MilestoneRate * 8, 0),
    FloatScore, IF(CriticalFloat>=10, 2, IF(CriticalFloat>=5, 1, 0)),
    DelayScore, IF(AvgDelay<=1, 2, IF(AvgDelay<=3, 1, 0)),
    
    MIN(20, SPIScore + MilestoneScore + FloatScore + DelayScore)
)
```

### 2. Budget Performance Score (20 Points)

#### Algorithm Implementation
```javascript
function calculateBudgetScore(financialData) {
    const {
        costPerformanceIndex,    // CPI from earned value
        budgetVariancePercent,   // (Actual - Budget) / Budget
        burnRateAccuracy,       // Actual vs planned burn rate
        forecastAccuracy,       // Historical forecast reliability
        contingencyRemaining    // % of contingency unused
    } = financialData;
    
    // CPI Score (0-8 points)
    let cpiScore = 0;
    if (costPerformanceIndex >= 1.1) cpiScore = 8;
    else if (costPerformanceIndex >= 1.0) cpiScore = 6;
    else if (costPerformanceIndex >= 0.9) cpiScore = 4;
    else if (costPerformanceIndex >= 0.8) cpiScore = 2;
    else cpiScore = 0;
    
    // Budget Variance Score (0-6 points)
    const absVariance = Math.abs(budgetVariancePercent);
    let varianceScore = 0;
    if (absVariance <= 0.05) varianceScore = 6;        // ±5%
    else if (absVariance <= 0.10) varianceScore = 4;   // ±10%
    else if (absVariance <= 0.15) varianceScore = 2;   // ±15%
    else varianceScore = 0;
    
    // Burn Rate Score (0-3 points)
    let burnScore = 0;
    if (burnRateAccuracy >= 0.95) burnScore = 3;
    else if (burnRateAccuracy >= 0.90) burnScore = 2;
    else if (burnRateAccuracy >= 0.85) burnScore = 1;
    else burnScore = 0;
    
    // Forecast Accuracy Score (0-3 points)
    let forecastScore = Math.round(forecastAccuracy * 3);
    
    const totalBudgetScore = Math.min(20, cpiScore + varianceScore + burnScore + forecastScore);
    
    return {
        score: totalBudgetScore,
        breakdown: {
            cpi: cpiScore,
            variance: varianceScore,
            burnRate: burnScore,
            forecast: forecastScore
        },
        trend: calculateBudgetTrend(financialData),
        riskLevel: assessBudgetRisk(financialData)
    };
}
```

### 3. Risk Management Score (15 Points)

#### Algorithm Implementation
```javascript
function calculateRiskScore(riskData) {
    const {
        totalRisks,
        criticalRisks,      // Risk score 15-25
        highRisks,          // Risk score 10-14
        mediumRisks,        // Risk score 5-9
        riskTrend,          // Increasing/Stable/Decreasing
        mitigationRate,     // % risks with active mitigation
        avgTimeToMitigation // Days to implement mitigation
    } = riskData;
    
    // Risk Exposure Score (0-8 points)
    const riskExposure = (criticalRisks * 3) + (highRisks * 2) + (mediumRisks * 1);
    const maxExposure = totalRisks * 3; // Worst case: all critical
    const exposureRatio = riskExposure / maxExposure;
    
    let exposureScore = 0;
    if (exposureRatio <= 0.2) exposureScore = 8;       // Low exposure
    else if (exposureRatio <= 0.4) exposureScore = 6;  // Medium exposure
    else if (exposureRatio <= 0.6) exposureScore = 4;  // High exposure
    else if (exposureRatio <= 0.8) exposureScore = 2;  // Very high exposure
    else exposureScore = 0;                             // Critical exposure\n    \n    // Risk Trend Score (0-4 points)\n    let trendScore = 0;\n    if (riskTrend === 'DECREASING') trendScore = 4;\n    else if (riskTrend === 'STABLE') trendScore = 2;\n    else trendScore = 0; // INCREASING\n    \n    // Mitigation Effectiveness Score (0-3 points)\n    let mitigationScore = Math.round(mitigationRate * 3);\n    \n    const totalRiskScore = Math.min(15, exposureScore + trendScore + mitigationScore);\n    \n    return {\n        score: totalRiskScore,\n        breakdown: {\n            exposure: exposureScore,\n            trend: trendScore,\n            mitigation: mitigationScore\n        },\n        riskLevel: determineRiskLevel(criticalRisks, highRisks),\n        recommendations: generateRiskRecommendations(riskData)\n    };\n}\n```\n\n### 4. Quality Metrics Score (15 Points)\n\n#### Algorithm Implementation\n```javascript\nfunction calculateQualityScore(qualityData) {\n    const {\n        defectDensity,          // Defects per thousand lines of code\n        testCoveragePercent,    // % code covered by tests\n        testPassRate,           // % tests passing\n        customerSatisfaction,   // Rating 1-5\n        systemUptime,          // % uptime\n        performanceBenchmarks  // Array of performance metrics\n    } = qualityData;\n    \n    // Defect Density Score (0-5 points)\n    let defectScore = 0;\n    if (defectDensity <= 1) defectScore = 5;      // Excellent\n    else if (defectDensity <= 3) defectScore = 4; // Good\n    else if (defectDensity <= 5) defectScore = 3; // Fair\n    else if (defectDensity <= 10) defectScore = 2; // Poor\n    else defectScore = 1;                          // Critical\n    \n    // Test Coverage Score (0-4 points)\n    let coverageScore = 0;\n    if (testCoveragePercent >= 90) coverageScore = 4;\n    else if (testCoveragePercent >= 80) coverageScore = 3;\n    else if (testCoveragePercent >= 70) coverageScore = 2;\n    else if (testCoveragePercent >= 60) coverageScore = 1;\n    else coverageScore = 0;\n    \n    // Test Pass Rate Score (0-3 points)\n    let passRateScore = Math.round(testPassRate * 3);\n    \n    // Customer Satisfaction Score (0-3 points)\n    let satisfactionScore = Math.round((customerSatisfaction - 1) / 4 * 3);\n    \n    const totalQualityScore = Math.min(15, defectScore + coverageScore + passRateScore + satisfactionScore);\n    \n    return {\n        score: totalQualityScore,\n        breakdown: {\n            defects: defectScore,\n            coverage: coverageScore,\n            passRate: passRateScore,\n            satisfaction: satisfactionScore\n        },\n        qualityTrend: calculateQualityTrend(qualityData)\n    };\n}\n```\n\n### 5. Team Performance Score (10 Points)\n\n#### Algorithm Implementation\n```javascript\nfunction calculateTeamScore(teamData) {\n    const {\n        teamVelocity,          // Sprint velocity vs target\n        teamSatisfaction,      // Team satisfaction 1-5\n        utilizationRate,       // Team utilization %\n        turnoverRate,          // Team turnover %\n        skillCoverage,         // % of required skills covered\n        collaborationScore     // Team collaboration rating\n    } = teamData;\n    \n    // Velocity Score (0-3 points)\n    let velocityScore = 0;\n    const velocityRatio = teamVelocity.actual / teamVelocity.target;\n    if (velocityRatio >= 1.1) velocityScore = 3;\n    else if (velocityRatio >= 0.9) velocityScore = 2;\n    else if (velocityRatio >= 0.8) velocityScore = 1;\n    else velocityScore = 0;\n    \n    // Team Satisfaction Score (0-3 points)\n    let satisfactionScore = Math.round((teamSatisfaction - 1) / 4 * 3);\n    \n    // Utilization Score (0-2 points)\n    let utilizationScore = 0;\n    if (utilizationRate >= 0.8 && utilizationRate <= 0.95) utilizationScore = 2; // Optimal range\n    else if (utilizationRate >= 0.7 && utilizationRate <= 0.99) utilizationScore = 1;\n    else utilizationScore = 0;\n    \n    // Turnover Penalty (0-2 points)\n    let turnoverScore = 0;\n    if (turnoverRate <= 0.05) turnoverScore = 2;      // ≤5%\n    else if (turnoverRate <= 0.10) turnoverScore = 1; // ≤10%\n    else turnoverScore = 0;                           // >10%\n    \n    const totalTeamScore = Math.min(10, velocityScore + satisfactionScore + utilizationScore + turnoverScore);\n    \n    return {\n        score: totalTeamScore,\n        breakdown: {\n            velocity: velocityScore,\n            satisfaction: satisfactionScore,\n            utilization: utilizationScore,\n            turnover: turnoverScore\n        },\n        teamHealth: assessTeamHealth(teamData)\n    };\n}\n```\n\n---\n\n## 🔮 Predictive Health Modeling\n\n### Trend Analysis Algorithm\n```javascript\nfunction calculatePredictiveHealth(historicalData, currentMetrics) {\n    const {\n        last12Weeks,       // Historical health scores\n        currentTrajectory, // Current rate of change\n        riskFactors,      // Known upcoming risks\n        seasonalFactors   // Historical seasonal patterns\n    } = historicalData;\n    \n    // Linear regression on historical data\n    const trendLine = linearRegression(last12Weeks);\n    \n    // Predict next 4 weeks\n    const predictions = [];\n    for (let week = 1; week <= 4; week++) {\n        let predictedScore = trendLine.slope * (last12Weeks.length + week) + trendLine.intercept;\n        \n        // Apply risk factor adjustments\n        predictedScore *= calculateRiskAdjustment(riskFactors, week);\n        \n        // Apply seasonal adjustments\n        predictedScore *= getSeasonalAdjustment(seasonalFactors, week);\n        \n        // Bound predictions between 0-100\n        predictedScore = Math.max(0, Math.min(100, predictedScore));\n        \n        predictions.push({\n            week: week,\n            predictedHealth: Math.round(predictedScore),\n            confidence: calculateConfidence(trendLine.rSquared, week)\n        });\n    }\n    \n    return {\n        currentHealth: calculateOverallHealth(currentMetrics),\n        trend: trendLine.slope > 0 ? 'IMPROVING' : trendLine.slope < 0 ? 'DECLINING' : 'STABLE',\n        predictions: predictions,\n        riskFactors: identifyRiskFactors(predictions),\n        recommendations: generateRecommendations(predictions, currentMetrics)\n    };\n}\n\nfunction calculateRiskAdjustment(riskFactors, week) {\n    let adjustment = 1.0;\n    \n    riskFactors.forEach(risk => {\n        if (risk.impactWeek <= week) {\n            adjustment *= (1 - risk.impact); // Reduce score by risk impact\n        }\n    });\n    \n    return adjustment;\n}\n```\n\n### Machine Learning Enhanced Scoring\n```python\n# Python implementation for advanced ML scoring\nimport numpy as np\nfrom sklearn.ensemble import RandomForestRegressor\nfrom sklearn.preprocessing import StandardScaler\n\nclass HealthScorePredictor:\n    def __init__(self):\n        self.model = RandomForestRegressor(n_estimators=100, random_state=42)\n        self.scaler = StandardScaler()\n        self.feature_names = [\n            'schedule_spi', 'budget_cpi', 'risk_count', 'team_velocity',\n            'defect_density', 'stakeholder_satisfaction', 'milestone_completion',\n            'budget_variance', 'critical_risks', 'team_satisfaction'\n        ]\n    \n    def train_model(self, historical_projects):\n        \"\"\"Train the model on historical project data\"\"\"\n        X = historical_projects[self.feature_names]\n        y = historical_projects['final_health_score']\n        \n        X_scaled = self.scaler.fit_transform(X)\n        self.model.fit(X_scaled, y)\n        \n        return self.model.score(X_scaled, y)\n    \n    def predict_health_score(self, current_metrics):\n        \"\"\"Predict health score for current project state\"\"\"\n        X = np.array([current_metrics[name] for name in self.feature_names]).reshape(1, -1)\n        X_scaled = self.scaler.transform(X)\n        \n        prediction = self.model.predict(X_scaled)[0]\n        feature_importance = dict(zip(self.feature_names, self.model.feature_importances_))\n        \n        return {\n            'predicted_score': max(0, min(100, prediction)),\n            'feature_importance': feature_importance,\n            'risk_factors': self.identify_risk_factors(current_metrics, feature_importance)\n        }\n    \n    def identify_risk_factors(self, metrics, importance):\n        \"\"\"Identify metrics that are driving the score down\"\"\"\n        risk_factors = []\n        \n        for feature, weight in importance.items():\n            if weight > 0.1 and metrics[feature] < 0.7:  # High importance, low score\n                risk_factors.append({\n                    'metric': feature,\n                    'current_value': metrics[feature],\n                    'impact_weight': weight,\n                    'recommended_action': self.get_recommendation(feature, metrics[feature])\n                })\n        \n        return sorted(risk_factors, key=lambda x: x['impact_weight'], reverse=True)\n```\n\n---\n\n## 📊 Real-Time Dashboard Integration\n\n### JavaScript Dashboard Implementation\n```javascript\nclass ExecutiveHealthDashboard {\n    constructor(containerId, apiEndpoint) {\n        this.container = document.getElementById(containerId);\n        this.apiEndpoint = apiEndpoint;\n        this.refreshInterval = 15 * 60 * 1000; // 15 minutes\n        this.chart = null;\n        \n        this.initializeDashboard();\n        this.startAutoRefresh();\n    }\n    \n    async initializeDashboard() {\n        const healthData = await this.fetchHealthData();\n        this.renderHealthScore(healthData);\n        this.renderTrendChart(healthData.historical);\n        this.renderAlerts(healthData.alerts);\n    }\n    \n    renderHealthScore(data) {\n        const scoreColor = this.getScoreColor(data.overallHealth);\n        const scoreIcon = this.getScoreIcon(data.overallHealth);\n        \n        this.container.innerHTML = `\n            <div class=\"health-dashboard\">\n                <div class=\"overall-health\">\n                    <div class=\"health-score\" style=\"color: ${scoreColor}\">\n                        ${scoreIcon} ${data.overallHealth}/100\n                    </div>\n                    <div class=\"health-status\">${this.getHealthStatus(data.overallHealth)}</div>\n                    <div class=\"health-trend\">\n                        Trend: ${this.getTrendIcon(data.trend)} ${data.trend}\n                    </div>\n                </div>\n                \n                <div class=\"health-breakdown\">\n                    ${this.renderBreakdown(data.breakdown)}\n                </div>\n                \n                <div class=\"predictions\">\n                    <h3>4-Week Forecast</h3>\n                    ${this.renderPredictions(data.predictions)}\n                </div>\n            </div>\n        `;\n    }\n    \n    renderBreakdown(breakdown) {\n        return Object.entries(breakdown).map(([dimension, data]) => `\n            <div class=\"dimension\" data-dimension=\"${dimension}\">\n                <div class=\"dimension-name\">${this.formatDimensionName(dimension)}</div>\n                <div class=\"dimension-score\">\n                    <div class=\"score-bar\">\n                        <div class=\"score-fill\" style=\"width: ${(data.score / data.maxScore) * 100}%; background-color: ${this.getScoreColor(data.score / data.maxScore * 100)}\"></div>\n                    </div>\n                    <span class=\"score-value\">${data.score}/${data.maxScore}</span>\n                </div>\n                <div class=\"dimension-trend\">${this.getTrendIcon(data.trend)} ${data.trend}</div>\n            </div>\n        `).join('');\n    }\n    \n    getScoreColor(score) {\n        if (score >= 80) return '#22C55E'; // Green\n        if (score >= 60) return '#EAB308'; // Yellow\n        return '#EF4444'; // Red\n    }\n    \n    getScoreIcon(score) {\n        if (score >= 80) return '🟢';\n        if (score >= 60) return '🟡';\n        return '🔴';\n    }\n    \n    async fetchHealthData() {\n        try {\n            const response = await fetch(this.apiEndpoint, {\n                headers: {\n                    'Authorization': `Bearer ${this.getAuthToken()}`,\n                    'Content-Type': 'application/json'\n                }\n            });\n            \n            if (!response.ok) throw new Error(`HTTP ${response.status}`);\n            \n            return await response.json();\n        } catch (error) {\n            console.error('Failed to fetch health data:', error);\n            this.showError('Unable to load health data. Please refresh the page.');\n        }\n    }\n    \n    startAutoRefresh() {\n        setInterval(() => {\n            this.initializeDashboard();\n        }, this.refreshInterval);\n    }\n}\n\n// Initialize dashboard\ndocument.addEventListener('DOMContentLoaded', () => {\n    const dashboard = new ExecutiveHealthDashboard(\n        'executive-dashboard', \n        '/api/executive/health-score'\n    );\n});\n```\n\n### Excel VBA Integration\n```vba\n' Excel VBA for real-time health score calculation\nFunction CalculateOverallHealthScore() As Double\n    Dim scheduleScore As Double\n    Dim budgetScore As Double\n    Dim riskScore As Double\n    Dim qualityScore As Double\n    Dim teamScore As Double\n    Dim scopeScore As Double\n    Dim stakeholderScore As Double\n    \n    ' Calculate individual dimension scores\n    scheduleScore = CalculateScheduleScore() * 0.2   ' 20% weight\n    budgetScore = CalculateBudgetScore() * 0.2       ' 20% weight\n    scopeScore = CalculateScopeScore() * 0.15        ' 15% weight\n    qualityScore = CalculateQualityScore() * 0.15    ' 15% weight\n    riskScore = CalculateRiskScore() * 0.15          ' 15% weight\n    teamScore = CalculateTeamScore() * 0.1           ' 10% weight\n    stakeholderScore = CalculateStakeholderScore() * 0.05 ' 5% weight\n    \n    ' Calculate weighted overall score\n    CalculateOverallHealthScore = scheduleScore + budgetScore + scopeScore + _\n                                  qualityScore + riskScore + teamScore + stakeholderScore\n    \n    ' Store breakdown for dashboard\n    Range(\"HealthBreakdown[Schedule]\").Value = scheduleScore\n    Range(\"HealthBreakdown[Budget]\").Value = budgetScore\n    Range(\"HealthBreakdown[Scope]\").Value = scopeScore\n    Range(\"HealthBreakdown[Quality]\").Value = qualityScore\n    Range(\"HealthBreakdown[Risk]\").Value = riskScore\n    Range(\"HealthBreakdown[Team]\").Value = teamScore\n    Range(\"HealthBreakdown[Stakeholder]\").Value = stakeholderScore\n    \n    ' Update timestamp\n    Range(\"LastCalculated\").Value = Now()\nEnd Function\n\nSub AutoRefreshHealthScore()\n    ' Auto-refresh health score every hour\n    Application.OnTime Now + TimeValue(\"01:00:00\"), \"AutoRefreshHealthScore\"\n    \n    ' Recalculate health score\n    Dim newScore As Double\n    newScore = CalculateOverallHealthScore()\n    \n    ' Check for significant changes\n    Dim previousScore As Double\n    previousScore = Range(\"PreviousHealthScore\").Value\n    \n    If Abs(newScore - previousScore) > 5 Then\n        ' Significant change detected - send alert\n        Call SendHealthScoreAlert(newScore, previousScore)\n    End If\n    \n    ' Update dashboard\n    Range(\"CurrentHealthScore\").Value = newScore\n    Range(\"PreviousHealthScore\").Value = newScore\nEnd Sub\n```\n\n---\n\n## 🚨 Alerting and Notifications\n\n### Alert Configuration\n```javascript\nconst ALERT_THRESHOLDS = {\n    CRITICAL: {\n        overallHealth: 60,\n        dimensionHealth: 40,\n        trendDecline: -10, // 10 point decline in 2 weeks\n        riskIncrease: 5    // 5 new critical risks\n    },\n    WARNING: {\n        overallHealth: 75,\n        dimensionHealth: 60,\n        trendDecline: -5,\n        riskIncrease: 3\n    },\n    INFO: {\n        overallHealth: 85,\n        dimensionHealth: 80,\n        trendDecline: 0,\n        riskIncrease: 1\n    }\n};\n\nfunction generateHealthAlerts(healthData, historicalData) {\n    const alerts = [];\n    \n    // Overall health alerts\n    if (healthData.overallHealth <= ALERT_THRESHOLDS.CRITICAL.overallHealth) {\n        alerts.push({\n            level: 'CRITICAL',\n            type: 'OVERALL_HEALTH',\n            message: `Project health is critical at ${healthData.overallHealth}/100`,\n            recommendation: 'Immediate executive intervention required',\n            escalateTo: ['CEO', 'Project Sponsor']\n        });\n    }\n    \n    // Trend-based alerts\n    const twoWeekTrend = calculateTwoWeekTrend(historicalData);\n    if (twoWeekTrend <= ALERT_THRESHOLDS.CRITICAL.trendDecline) {\n        alerts.push({\n            level: 'CRITICAL',\n            type: 'DECLINING_TREND',\n            message: `Health score declining rapidly: ${twoWeekTrend} points in 2 weeks`,\n            recommendation: 'Review project fundamentals and implement corrective actions',\n            escalateTo: ['PMO', 'Project Manager']\n        });\n    }\n    \n    // Dimension-specific alerts\n    Object.entries(healthData.breakdown).forEach(([dimension, data]) => {\n        if (data.score <= ALERT_THRESHOLDS.CRITICAL.dimensionHealth) {\n            alerts.push({\n                level: 'CRITICAL',\n                type: 'DIMENSION_CRITICAL',\n                dimension: dimension,\n                message: `${dimension} performance is critical: ${data.score}/${data.maxScore}`,\n                recommendation: getDimensionRecommendation(dimension, data),\n                escalateTo: getDimensionOwners(dimension)\n            });\n        }\n    });\n    \n    return alerts;\n}\n```\n\n---\n\n## 📈 Usage and Implementation\n\n### Integration Checklist\n- [ ] **Data Sources Connected**: PM tools, financial systems, risk registers\n- [ ] **Scoring Algorithms Configured**: Weights adjusted for organization\n- [ ] **Dashboard Deployed**: Real-time visualization active\n- [ ] **Alerts Configured**: Notification rules and recipients set\n- [ ] **Historical Data**: Baseline data collected for trending\n- [ ] **Training Completed**: Stakeholders understand scoring methodology\n\n### Performance Metrics\n- **Calculation Time**: < 2 seconds for full health score\n- **Data Refresh**: Every 15 minutes\n- **Alert Response**: < 1 minute for critical alerts\n- **Dashboard Load**: < 3 seconds\n- **Accuracy**: 85%+ correlation with project outcomes\n\n---\n\n*This health scoring system provides automated, real-time insights into project performance, enabling proactive management and early intervention when issues arise.*"
