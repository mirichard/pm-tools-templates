# Data Validation and Quality Control Framework

## 📊 Overview
This comprehensive framework ensures data integrity, accuracy, and reliability for executive dashboards. It implements multi-layer validation, automated quality checks, and real-time data monitoring to maintain high-quality insights for decision-making.

## 🏗️ Quality Framework Architecture

### Data Quality Dimensions
1. **Accuracy**: Data correctly represents real-world values
2. **Completeness**: All required data fields are present
3. **Consistency**: Data follows defined formats and business rules
4. **Timeliness**: Data is current and updated within acceptable timeframes
5. **Validity**: Data conforms to defined formats and constraints
6. **Uniqueness**: No duplicate records exist where they shouldn't

### Quality Control Layers
```
┌─────────────────────────────────────────────────────────┐
│                   EXECUTIVE DASHBOARDS                  │
├─────────────────────────────────────────────────────────┤
│              Data Quality Monitoring Layer              │
├─────────────────────────────────────────────────────────┤
│               Business Rules Validation                 │
├─────────────────────────────────────────────────────────┤
│              Statistical Quality Checks                 │
├─────────────────────────────────────────────────────────┤
│               Schema & Format Validation                │
├─────────────────────────────────────────────────────────┤
│                   Data Sources                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔍 Data Validation Rules

### Project Data Validation
```javascript
// /validators/projectValidator.js
const Joi = require('joi');
const moment = require('moment');

const projectSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(3).max(100).required(),
  projectManager: Joi.string().min(2).max(50).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  status: Joi.string().valid('On Track', 'At Risk', 'Behind Schedule', 'Critical', 'Completed').required(),
  priority: Joi.string().valid('Critical', 'High', 'Medium', 'Low').required(),
  portfolio: Joi.string().valid('Technology', 'Operations', 'Business').required(),
  budget: Joi.number().positive().min(1000).max(100000000).required(),
  actualCost: Joi.number().min(0).max(Joi.ref('budget')).allow(0),
  percentComplete: Joi.number().integer().min(0).max(100).required(),
  riskLevel: Joi.string().valid('Critical', 'High', 'Medium', 'Low').required(),
  strategicGoalId: Joi.string().uuid().allow(null),
  lastUpdated: Joi.date().iso().max('now').required()
});

class ProjectValidator {
  static validate(projectData) {
    const { error, value } = projectSchema.validate(projectData, {
      abortEarly: false,
      allowUnknown: false
    });

    if (error) {
      throw new ValidationError('Project validation failed', error.details);
    }

    // Business logic validations
    this.validateBusinessRules(value);
    
    return value;
  }

  static validateBusinessRules(project) {
    const validationErrors = [];

    // Rule 1: Completed projects must be 100% complete
    if (project.status === 'Completed' && project.percentComplete !== 100) {
      validationErrors.push({
        field: 'percentComplete',
        message: 'Completed projects must have 100% completion',
        value: project.percentComplete
      });
    }

    // Rule 2: Critical projects must have recent updates (within 7 days)
    if (project.status === 'Critical') {
      const daysSinceUpdate = moment().diff(moment(project.lastUpdated), 'days');
      if (daysSinceUpdate > 7) {
        validationErrors.push({
          field: 'lastUpdated',
          message: 'Critical projects must be updated within 7 days',
          value: project.lastUpdated
        });
      }
    }

    // Rule 3: Actual cost should not exceed budget by more than 20% without approval
    const budgetOverrun = ((project.actualCost - project.budget) / project.budget) * 100;
    if (budgetOverrun > 20) {
      validationErrors.push({
        field: 'actualCost',
        message: 'Actual cost exceeds budget by more than 20%',
        value: project.actualCost,
        severity: 'warning'
      });
    }

    // Rule 4: Project duration validation
    const projectDuration = moment(project.endDate).diff(moment(project.startDate), 'months');
    if (projectDuration > 36) {
      validationErrors.push({
        field: 'endDate',
        message: 'Project duration exceeds 36 months',
        value: projectDuration,
        severity: 'warning'
      });
    }

    // Rule 5: Status and completion consistency
    if (project.percentComplete === 0 && project.status !== 'Not Started') {
      validationErrors.push({
        field: 'status',
        message: 'Status inconsistent with completion percentage',
        value: project.status
      });
    }

    if (validationErrors.length > 0) {
      throw new BusinessRuleValidationError('Business rule validation failed', validationErrors);
    }
  }

  static validateDataQuality(projects) {
    const qualityReport = {
      totalRecords: projects.length,
      accuracy: 0,
      completeness: 0,
      consistency: 0,
      timeliness: 0,
      issues: []
    };

    // Accuracy checks
    const accuracyIssues = this.checkAccuracy(projects);
    qualityReport.accuracy = ((projects.length - accuracyIssues.length) / projects.length) * 100;
    qualityReport.issues.push(...accuracyIssues);

    // Completeness checks
    const completenessIssues = this.checkCompleteness(projects);
    qualityReport.completeness = ((projects.length - completenessIssues.length) / projects.length) * 100;
    qualityReport.issues.push(...completenessIssues);

    // Consistency checks
    const consistencyIssues = this.checkConsistency(projects);
    qualityReport.consistency = ((projects.length - consistencyIssues.length) / projects.length) * 100;
    qualityReport.issues.push(...consistencyIssues);

    // Timeliness checks
    const timelinessIssues = this.checkTimeliness(projects);
    qualityReport.timeliness = ((projects.length - timelinessIssues.length) / projects.length) * 100;
    qualityReport.issues.push(...timelinessIssues);

    return qualityReport;
  }

  static checkAccuracy(projects) {
    const issues = [];
    
    projects.forEach((project, index) => {
      // Check for impossible completion percentages
      if (project.status === 'Not Started' && project.percentComplete > 0) {
        issues.push({
          recordIndex: index,
          projectId: project.id,
          type: 'accuracy',
          field: 'percentComplete',
          message: 'Completion percentage > 0 for not started project',
          severity: 'error'
        });
      }

      // Check for unrealistic budget values
      if (project.budget < 1000 || project.budget > 100000000) {
        issues.push({
          recordIndex: index,
          projectId: project.id,
          type: 'accuracy',
          field: 'budget',
          message: 'Budget value outside realistic range',
          severity: 'warning'
        });
      }
    });

    return issues;
  }

  static checkCompleteness(projects) {
    const issues = [];
    const requiredFields = ['id', 'name', 'projectManager', 'startDate', 'endDate', 'status', 'budget'];
    
    projects.forEach((project, index) => {
      requiredFields.forEach(field => {
        if (!project[field] || project[field] === null || project[field] === '') {
          issues.push({
            recordIndex: index,
            projectId: project.id,
            type: 'completeness',
            field: field,
            message: `Required field ${field} is missing or empty`,
            severity: 'error'
          });
        }
      });
    });

    return issues;
  }

  static checkConsistency(projects) {
    const issues = [];
    
    projects.forEach((project, index) => {
      // Status consistency with dates
      const now = moment();
      const endDate = moment(project.endDate);
      
      if (project.status === 'Completed' && endDate.isAfter(now)) {
        issues.push({
          recordIndex: index,
          projectId: project.id,
          type: 'consistency',
          field: 'status',
          message: 'Project marked completed but end date is in future',
          severity: 'error'
        });
      }

      // Budget consistency
      if (project.actualCost > project.budget * 2) {
        issues.push({
          recordIndex: index,
          projectId: project.id,
          type: 'consistency',
          field: 'actualCost',
          message: 'Actual cost more than double the budget',
          severity: 'warning'
        });
      }
    });

    return issues;
  }

  static checkTimeliness(projects) {
    const issues = [];
    const staleThreshold = moment().subtract(30, 'days');
    
    projects.forEach((project, index) => {
      const lastUpdated = moment(project.lastUpdated);
      
      if (lastUpdated.isBefore(staleThreshold) && project.status !== 'Completed') {
        issues.push({
          recordIndex: index,
          projectId: project.id,
          type: 'timeliness',
          field: 'lastUpdated',
          message: 'Project data not updated in 30+ days',
          severity: 'warning'
        });
      }
    });

    return issues;
  }
}

module.exports = ProjectValidator;
```

---

## 💰 Financial Data Validation

### Financial Metrics Validator
```javascript
// /validators/financialValidator.js
const Joi = require('joi');

const financialMetricsSchema = Joi.object({
  recordId: Joi.string().uuid().required(),
  projectId: Joi.string().uuid().required(),
  date: Joi.date().iso().required(),
  budgetAllocated: Joi.number().positive().required(),
  actualSpend: Joi.number().min(0).required(),
  forecastCost: Joi.number().positive().required(),
  roi: Joi.number().min(-1).max(10).required(), // -100% to 1000%
  npv: Joi.number().allow(null),
  irr: Joi.number().min(-1).max(1).allow(null), // -100% to 100%
  costPerformanceIndex: Joi.number().positive().required(),
  earnedValue: Joi.number().min(0).required()
});

class FinancialValidator {
  static validate(financialData) {
    const { error, value } = financialMetricsSchema.validate(financialData, {
      abortEarly: false
    });

    if (error) {
      throw new ValidationError('Financial validation failed', error.details);
    }

    // Advanced financial validations
    this.validateFinancialLogic(value);
    
    return value;
  }

  static validateFinancialLogic(financial) {
    const validationErrors = [];

    // Earned Value Management validations
    const scheduleVariance = financial.earnedValue - (financial.budgetAllocated * this.getTimeProgress(financial.date));
    const costVariance = financial.earnedValue - financial.actualSpend;
    
    // CPI should match calculated value
    const calculatedCPI = financial.earnedValue / financial.actualSpend;
    const cpiDifference = Math.abs(financial.costPerformanceIndex - calculatedCPI);
    
    if (cpiDifference > 0.05) { // 5% tolerance
      validationErrors.push({
        field: 'costPerformanceIndex',
        message: 'CPI does not match calculated value',
        expected: calculatedCPI,
        actual: financial.costPerformanceIndex
      });
    }

    // ROI reasonableness check
    if (financial.roi > 5) { // 500% ROI
      validationErrors.push({
        field: 'roi',
        message: 'ROI exceeds reasonable threshold',
        value: financial.roi,
        severity: 'warning'
      });
    }

    // Forecast accuracy validation
    const forecastVariance = Math.abs(financial.forecastCost - financial.actualSpend) / financial.actualSpend;
    if (forecastVariance > 0.5) { // 50% variance
      validationErrors.push({
        field: 'forecastCost',
        message: 'Forecast significantly different from actual',
        variance: forecastVariance,
        severity: 'warning'
      });
    }

    if (validationErrors.length > 0) {
      throw new BusinessRuleValidationError('Financial logic validation failed', validationErrors);
    }
  }

  static getTimeProgress(date) {
    // Calculate time progress based on project timeline
    // This would typically reference project start/end dates
    return 0.5; // Placeholder
  }

  static detectAnomalies(financialMetrics) {
    const anomalies = [];
    
    // Z-score analysis for outlier detection
    const values = financialMetrics.map(f => f.actualSpend);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    financialMetrics.forEach((metric, index) => {
      const zScore = (metric.actualSpend - mean) / standardDeviation;
      
      if (Math.abs(zScore) > 3) { // 3 standard deviations
        anomalies.push({
          recordIndex: index,
          projectId: metric.projectId,
          type: 'statistical_outlier',
          field: 'actualSpend',
          zScore: zScore,
          value: metric.actualSpend,
          severity: 'warning'
        });
      }
    });

    return anomalies;
  }
}

module.exports = FinancialValidator;
```

---

## ⚠️ Risk Data Validation

### Risk Register Validator
```javascript
// /validators/riskValidator.js
class RiskValidator {
  static validateRiskData(risks) {
    const validationReport = {
      totalRisks: risks.length,
      validRisks: 0,
      issues: [],
      riskDistribution: {},
      qualityScore: 0
    };

    risks.forEach((risk, index) => {
      try {
        this.validateSingleRisk(risk);
        validationReport.validRisks++;
      } catch (error) {
        validationReport.issues.push({
          recordIndex: index,
          riskId: risk.id,
          errors: error.details || [error.message]
        });
      }
    });

    // Calculate quality metrics
    validationReport.qualityScore = (validationReport.validRisks / validationReport.totalRisks) * 100;
    validationReport.riskDistribution = this.analyzeRiskDistribution(risks);

    return validationReport;
  }

  static validateSingleRisk(risk) {
    const requiredFields = ['id', 'projectId', 'riskDescription', 'impact', 'probability'];
    const missingFields = requiredFields.filter(field => !risk[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate risk score calculation
    const calculatedScore = risk.impact * risk.probability;
    if (Math.abs(risk.riskScore - calculatedScore) > 0.1) {
      throw new ValidationError('Risk score does not match impact × probability');
    }

    // Validate impact and probability ranges
    if (risk.impact < 1 || risk.impact > 5) {
      throw new ValidationError('Impact must be between 1 and 5');
    }

    if (risk.probability < 1 || risk.probability > 5) {
      throw new ValidationError('Probability must be between 1 and 5');
    }

    // Business rule validations
    this.validateRiskBusinessRules(risk);
  }

  static validateRiskBusinessRules(risk) {
    // Critical risks must have mitigation plans
    if (risk.riskScore >= 15 && !risk.mitigationPlan) {
      throw new BusinessRuleValidationError('Critical risks must have mitigation plans');
    }

    // Closed risks must have close dates
    if (risk.status === 'Closed' && !risk.dateClosed) {
      throw new BusinessRuleValidationError('Closed risks must have closure dates');
    }

    // Risk age validation
    if (risk.status === 'Open') {
      const daysSinceIdentified = moment().diff(moment(risk.dateIdentified), 'days');
      if (daysSinceIdentified > 90) {
        throw new BusinessRuleValidationError('Open risks older than 90 days require review', 'warning');
      }
    }
  }

  static analyzeRiskDistribution(risks) {
    const distribution = {
      bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
      byStatus: { open: 0, mitigating: 0, closed: 0 },
      averageScore: 0,
      trendsIssues: []
    };

    risks.forEach(risk => {
      // Severity distribution
      if (risk.riskScore >= 15) distribution.bySeverity.critical++;
      else if (risk.riskScore >= 10) distribution.bySeverity.high++;
      else if (risk.riskScore >= 5) distribution.bySeverity.medium++;
      else distribution.bySeverity.low++;

      // Status distribution
      distribution.byStatus[risk.status.toLowerCase()]++;
    });

    // Calculate average score
    distribution.averageScore = risks.reduce((sum, risk) => sum + risk.riskScore, 0) / risks.length;

    // Identify trend issues
    if (distribution.bySeverity.critical > risks.length * 0.1) {
      distribution.trendsIssues.push('High number of critical risks (>10%)');
    }

    if (distribution.byStatus.open > risks.length * 0.7) {
      distribution.trendsIssues.push('High number of open risks (>70%)');
    }

    return distribution;
  }
}

module.exports = RiskValidator;
```

---

## 🔄 Real-Time Data Quality Monitoring

### Quality Monitoring Service
```javascript
// /services/dataQualityService.js
const EventEmitter = require('events');
const cron = require('node-cron');

class DataQualityService extends EventEmitter {
  constructor() {
    super();
    this.qualityMetrics = new Map();
    this.qualityThresholds = {
      accuracy: 95,
      completeness: 98,
      consistency: 90,
      timeliness: 85
    };
    
    this.startMonitoring();
  }

  startMonitoring() {
    // Run quality checks every hour
    cron.schedule('0 * * * *', () => {
      this.runQualityChecks();
    });

    // Generate daily quality reports
    cron.schedule('0 6 * * *', () => {
      this.generateDailyQualityReport();
    });
  }

  async runQualityChecks() {
    try {
      console.log('Running data quality checks...');
      
      const [projectQuality, financialQuality, riskQuality] = await Promise.all([
        this.checkProjectDataQuality(),
        this.checkFinancialDataQuality(),
        this.checkRiskDataQuality()
      ]);

      const overallQuality = this.calculateOverallQuality([
        projectQuality,
        financialQuality,
        riskQuality
      ]);

      this.qualityMetrics.set('latest', {
        timestamp: new Date(),
        project: projectQuality,
        financial: financialQuality,
        risk: riskQuality,
        overall: overallQuality
      });

      // Emit quality alerts if thresholds are breached
      this.checkQualityThresholds(overallQuality);

      this.emit('qualityCheckCompleted', overallQuality);
      
    } catch (error) {
      console.error('Error during quality checks:', error);
      this.emit('qualityCheckFailed', error);
    }
  }

  async checkProjectDataQuality() {
    const projects = await projectService.getAllProjects();
    const qualityReport = ProjectValidator.validateDataQuality(projects);
    
    return {
      dataSource: 'projects',
      recordCount: projects.length,
      accuracy: qualityReport.accuracy,
      completeness: qualityReport.completeness,
      consistency: qualityReport.consistency,
      timeliness: qualityReport.timeliness,
      issues: qualityReport.issues,
      qualityScore: this.calculateQualityScore(qualityReport)
    };
  }

  async checkFinancialDataQuality() {
    const financialMetrics = await financialService.getAllMetrics();
    const anomalies = FinancialValidator.detectAnomalies(financialMetrics);
    
    // Calculate quality dimensions
    const completenessScore = this.calculateCompletenessScore(financialMetrics);
    const accuracyScore = this.calculateAccuracyScore(financialMetrics, anomalies);
    
    return {
      dataSource: 'financial',
      recordCount: financialMetrics.length,
      accuracy: accuracyScore,
      completeness: completenessScore,
      consistency: 95, // Placeholder - would implement consistency checks
      timeliness: this.calculateTimelinessScore(financialMetrics),
      anomalies: anomalies.length,
      qualityScore: (accuracyScore + completenessScore + 95 + this.calculateTimelinessScore(financialMetrics)) / 4
    };
  }

  async checkRiskDataQuality() {
    const risks = await riskService.getAllRisks();
    const validationReport = RiskValidator.validateRiskData(risks);
    
    return {
      dataSource: 'risks',
      recordCount: risks.length,
      accuracy: validationReport.qualityScore,
      completeness: this.calculateRiskCompleteness(risks),
      consistency: this.calculateRiskConsistency(risks),
      timeliness: this.calculateRiskTimeliness(risks),
      distribution: validationReport.riskDistribution,
      qualityScore: validationReport.qualityScore
    };
  }

  calculateOverallQuality(qualityReports) {
    const totalRecords = qualityReports.reduce((sum, report) => sum + report.recordCount, 0);
    const weightedScores = qualityReports.map(report => ({
      weight: report.recordCount / totalRecords,
      ...report
    }));

    return {
      overallScore: weightedScores.reduce((sum, report) => sum + (report.qualityScore * report.weight), 0),
      accuracy: weightedScores.reduce((sum, report) => sum + (report.accuracy * report.weight), 0),
      completeness: weightedScores.reduce((sum, report) => sum + (report.completeness * report.weight), 0),
      consistency: weightedScores.reduce((sum, report) => sum + (report.consistency * report.weight), 0),
      timeliness: weightedScores.reduce((sum, report) => sum + (report.timeliness * report.weight), 0),
      totalRecords: totalRecords,
      dataSourceBreakdown: qualityReports
    };
  }

  checkQualityThresholds(qualityMetrics) {
    const alerts = [];

    Object.entries(this.qualityThresholds).forEach(([dimension, threshold]) => {
      if (qualityMetrics[dimension] < threshold) {
        alerts.push({
          dimension,
          currentValue: qualityMetrics[dimension],
          threshold,
          severity: qualityMetrics[dimension] < threshold * 0.8 ? 'critical' : 'warning',
          message: `${dimension} quality below threshold: ${qualityMetrics[dimension].toFixed(1)}% < ${threshold}%`
        });
      }
    });

    if (alerts.length > 0) {
      this.emit('qualityAlertsGenerated', alerts);
      this.sendQualityAlerts(alerts);
    }
  }

  async sendQualityAlerts(alerts) {
    // Send alerts to administrators
    const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
    const warningAlerts = alerts.filter(alert => alert.severity === 'warning');

    if (criticalAlerts.length > 0) {
      await notificationService.sendCriticalAlert({
        title: 'Critical Data Quality Issues Detected',
        alerts: criticalAlerts,
        recipients: await userService.getDataQualityAdmins()
      });
    }

    if (warningAlerts.length > 0) {
      await notificationService.sendWarningAlert({
        title: 'Data Quality Warnings',
        alerts: warningAlerts,
        recipients: await userService.getDataQualityAdmins()
      });
    }
  }

  generateDailyQualityReport() {
    const latestMetrics = this.qualityMetrics.get('latest');
    
    if (!latestMetrics) {
      console.log('No quality metrics available for daily report');
      return;
    }

    const report = {
      date: new Date().toISOString().split('T')[0],
      summary: {
        overallScore: latestMetrics.overall.overallScore,
        totalRecords: latestMetrics.overall.totalRecords,
        qualityTrend: this.calculateQualityTrend()
      },
      breakdown: latestMetrics.overall.dataSourceBreakdown,
      recommendations: this.generateQualityRecommendations(latestMetrics)
    };

    this.emit('dailyReportGenerated', report);
    
    // Store report for historical analysis
    this.storeQualityReport(report);
  }

  calculateQualityTrend() {
    // Compare with previous day's metrics
    // Implementation would analyze historical data
    return 'stable'; // Placeholder
  }

  generateQualityRecommendations(metrics) {
    const recommendations = [];

    if (metrics.overall.accuracy < 95) {
      recommendations.push({
        priority: 'high',
        category: 'accuracy',
        action: 'Implement additional data validation rules',
        description: 'Low accuracy scores indicate potential data entry errors or system integration issues'
      });
    }

    if (metrics.overall.completeness < 98) {
      recommendations.push({
        priority: 'medium',
        category: 'completeness',
        action: 'Enforce required field validations',
        description: 'Missing data fields are impacting dashboard reliability'
      });
    }

    if (metrics.overall.timeliness < 85) {
      recommendations.push({
        priority: 'high',
        category: 'timeliness',
        action: 'Review data refresh schedules',
        description: 'Stale data is reducing the value of real-time dashboards'
      });
    }

    return recommendations;
  }

  // Utility methods for quality calculations
  calculateQualityScore(qualityReport) {
    return (qualityReport.accuracy + qualityReport.completeness + 
            qualityReport.consistency + qualityReport.timeliness) / 4;
  }

  calculateCompletenessScore(data) {
    const requiredFields = ['budgetAllocated', 'actualSpend', 'forecastCost', 'roi'];
    let completeRecords = 0;
    
    data.forEach(record => {
      const isComplete = requiredFields.every(field => 
        record[field] !== null && record[field] !== undefined && record[field] !== ''
      );
      if (isComplete) completeRecords++;
    });

    return (completeRecords / data.length) * 100;
  }

  calculateAccuracyScore(data, anomalies) {
    return ((data.length - anomalies.length) / data.length) * 100;
  }

  calculateTimelinessScore(data) {
    const now = moment();
    const currentRecords = data.filter(record => 
      moment(record.date).diff(now, 'days') >= -7 // Within last 7 days
    );
    
    return (currentRecords.length / data.length) * 100;
  }

  calculateRiskCompleteness(risks) {
    const requiredFields = ['riskDescription', 'impact', 'probability', 'mitigationPlan'];
    const completeRisks = risks.filter(risk => 
      requiredFields.every(field => risk[field] && risk[field].toString().trim() !== '')
    );
    
    return (completeRisks.length / risks.length) * 100;
  }

  calculateRiskConsistency(risks) {
    let consistentRisks = 0;
    
    risks.forEach(risk => {
      const calculatedScore = risk.impact * risk.probability;
      if (Math.abs(risk.riskScore - calculatedScore) <= 0.1) {
        consistentRisks++;
      }
    });
    
    return (consistentRisks / risks.length) * 100;
  }

  calculateRiskTimeliness(risks) {
    const now = moment();
    const recentlyUpdatedRisks = risks.filter(risk => {
      const daysSinceUpdate = now.diff(moment(risk.lastUpdated || risk.dateIdentified), 'days');
      return daysSinceUpdate <= 30; // Updated within 30 days
    });
    
    return (recentlyUpdatedRisks.length / risks.length) * 100;
  }

  async storeQualityReport(report) {
    try {
      await qualityReportService.saveReport(report);
      console.log('Quality report stored successfully');
    } catch (error) {
      console.error('Error storing quality report:', error);
    }
  }

  getLatestQualityMetrics() {
    return this.qualityMetrics.get('latest');
  }

  getQualityThresholds() {
    return this.qualityThresholds;
  }

  updateQualityThresholds(newThresholds) {
    this.qualityThresholds = { ...this.qualityThresholds, ...newThresholds };
    this.emit('thresholdsUpdated', this.qualityThresholds);
  }
}

module.exports = new DataQualityService();
```

---

## 📊 Data Quality Dashboard API

### Quality Metrics Endpoint
```javascript
// /routes/dataQuality.js
const express = require('express');
const router = express.Router();
const dataQualityService = require('../services/dataQualityService');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Get current quality metrics
router.get('/metrics', authenticateToken, requireRole(['Admin', 'DataQualityManager']), (req, res) => {
  try {
    const metrics = dataQualityService.getLatestQualityMetrics();
    
    if (!metrics) {
      return res.status(404).json({ 
        error: 'No quality metrics available',
        message: 'Quality checks may not have run yet'
      });
    }

    res.json({
      data: metrics,
      timestamp: metrics.timestamp,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching quality metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quality thresholds
router.get('/thresholds', authenticateToken, requireRole(['Admin', 'DataQualityManager']), (req, res) => {
  try {
    const thresholds = dataQualityService.getQualityThresholds();
    res.json({ data: thresholds });
  } catch (error) {
    console.error('Error fetching quality thresholds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update quality thresholds
router.put('/thresholds', authenticateToken, requireRole(['Admin']), (req, res) => {
  try {
    const { accuracy, completeness, consistency, timeliness } = req.body;
    
    // Validate threshold values
    const thresholds = { accuracy, completeness, consistency, timeliness };
    Object.entries(thresholds).forEach(([key, value]) => {
      if (typeof value !== 'number' || value < 0 || value > 100) {
        throw new ValidationError(`Invalid threshold value for ${key}: ${value}`);
      }
    });

    dataQualityService.updateQualityThresholds(thresholds);
    
    res.json({
      message: 'Quality thresholds updated successfully',
      data: dataQualityService.getQualityThresholds()
    });
  } catch (error) {
    console.error('Error updating quality thresholds:', error);
    res.status(400).json({ error: error.message });
  }
});

// Trigger manual quality check
router.post('/check', authenticateToken, requireRole(['Admin', 'DataQualityManager']), async (req, res) => {
  try {
    dataQualityService.runQualityChecks();
    
    res.json({
      message: 'Quality check initiated',
      status: 'running'
    });
  } catch (error) {
    console.error('Error triggering quality check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get quality history
router.get('/history', authenticateToken, requireRole(['Admin', 'DataQualityManager']), async (req, res) => {
  try {
    const { days = 30, metric } = req.query;
    
    const history = await qualityReportService.getQualityHistory({
      days: parseInt(days),
      metric: metric
    });
    
    res.json({
      data: history,
      period: `${days} days`,
      metric: metric || 'all'
    });
  } catch (error) {
    console.error('Error fetching quality history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

---

## 🔧 Error Handling and Custom Exceptions

### Custom Error Classes
```javascript
// /utils/errors.js
class ValidationError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    this.statusCode = 400;
  }
}

class BusinessRuleValidationError extends Error {
  constructor(message, details = [], severity = 'error') {
    super(message);
    this.name = 'BusinessRuleValidationError';
    this.details = details;
    this.severity = severity;
    this.statusCode = 422;
  }
}

class DataQualityError extends Error {
  constructor(message, qualityDimension, currentValue, threshold) {
    super(message);
    this.name = 'DataQualityError';
    this.qualityDimension = qualityDimension;
    this.currentValue = currentValue;
    this.threshold = threshold;
    this.statusCode = 503;
  }
}

module.exports = {
  ValidationError,
  BusinessRuleValidationError,
  DataQualityError
};
```

---

## 📋 Implementation Checklist

### Setup Phase
- [ ] Install validation dependencies (Joi, moment.js)
- [ ] Configure data quality thresholds
- [ ] Set up monitoring cron jobs
- [ ] Create quality metrics storage
- [ ] Configure alert notifications

### Validation Rules
- [ ] Implement project data validation
- [ ] Implement financial data validation  
- [ ] Implement risk data validation
- [ ] Create business rule validators
- [ ] Set up anomaly detection algorithms

### Quality Monitoring
- [ ] Deploy quality monitoring service
- [ ] Configure real-time quality checks
- [ ] Set up quality alerting system
- [ ] Create quality dashboard endpoints
- [ ] Implement quality history tracking

### Testing & Deployment
- [ ] Unit test all validators
- [ ] Integration test quality service
- [ ] Load test quality monitoring
- [ ] Deploy to staging environment
- [ ] Monitor production quality metrics

---

**Framework Version**: 1.0  
**Last Updated**: August 3, 2025  
**Dependencies**: Joi 17+, Moment.js 2.29+, Node.js 18+  
**Created By**: Enterprise Executive Dashboard Suite - Issue #327
