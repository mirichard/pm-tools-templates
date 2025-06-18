/**
 * Insights Generator
 * Combines all AI models to generate comprehensive insights
 */

import { logger } from '../utils/logger.js';

export class InsightsGenerator {
  constructor() {
    this.insightTypes = [
      'risk_assessment',
      'resource_optimization', 
      'schedule_optimization',
      'quality_prediction',
      'stakeholder_management'
    ];
  }

  async generate(analysisData) {
    try {
      const {
        projectData,
        riskPrediction,
        resourceOptimization,
        scheduleAnalysis,
        qualityPrediction
      } = analysisData;

      const insights = await this.synthesizeInsights(analysisData);
      const recommendations = await this.generateRecommendations(analysisData);
      const executiveSummary = await this.createExecutiveSummary(insights, recommendations);

      return {
        projectId: projectData.id,
        projectName: projectData.name,
        generatedAt: new Date().toISOString(),
        insights,
        recommendations,
        executiveSummary,
        confidence: this.calculateOverallConfidence(analysisData),
        riskLevel: riskPrediction.riskLevel,
        actionItems: this.prioritizeActionItems(recommendations),
        metadata: {
          modelsUsed: ['risk', 'resource', 'schedule', 'quality'],
          version: '1.0.0',
          processingTime: Date.now()
        }
      };

    } catch (error) {
      logger.error('❌ Insights generation failed:', error);
      throw error;
    }
  }

  async synthesizeInsights(data) {
    const insights = [];

    // Risk Insights
    if (data.riskPrediction.riskLevel === 'high' || data.riskPrediction.riskLevel === 'critical') {
      insights.push({
        type: 'risk_alert',
        priority: 'high',
        title: `High ${data.riskPrediction.riskLevel} Risk Detected`,
        description: `Project has ${data.riskPrediction.riskLevel} risk level with ${Math.floor(data.riskPrediction.confidence * 100)}% confidence`,
        impact: 'schedule, budget, quality',
        recommendation: 'Implement enhanced monitoring and risk mitigation strategies',
        confidence: data.riskPrediction.confidence
      });
    }

    // Resource Insights
    const utilizationGap = data.resourceOptimization.targetUtilization - data.resourceOptimization.currentUtilization;
    if (utilizationGap > 0.05) {
      insights.push({
        type: 'resource_optimization',
        priority: 'medium',
        title: 'Resource Utilization Opportunity',
        description: `Team utilization can be improved by ${Math.floor(utilizationGap * 100)}%`,
        impact: 'productivity, timeline',
        recommendation: 'Redistribute workload and implement skill-based task assignment',
        confidence: data.resourceOptimization.confidence
      });
    }

    // Quality Insights
    if (data.qualityPrediction.overallQualityScore < 80) {
      insights.push({
        type: 'quality_concern',
        priority: 'high',
        title: 'Quality Score Below Target',
        description: `Predicted quality score of ${data.qualityPrediction.overallQualityScore}% is below 80% threshold`,
        impact: 'customer satisfaction, maintenance',
        recommendation: 'Increase test coverage and implement code review processes',
        confidence: data.qualityPrediction.confidence
      });
    }

    // Schedule Insights
    const scheduleBuffer = data.scheduleAnalysis.currentSchedule.bufferTime;
    if (scheduleBuffer < data.projectData.duration * 0.1) {
      insights.push({
        type: 'schedule_risk',
        priority: 'medium',
        title: 'Insufficient Schedule Buffer',
        description: `Only ${scheduleBuffer} days buffer for ${data.projectData.duration} day project`,
        impact: 'delivery date, stakeholder confidence',
        recommendation: 'Add additional buffer time or reduce scope',
        confidence: data.scheduleAnalysis.confidence
      });
    }

    return insights;
  }

  async generateRecommendations(data) {
    const recommendations = [];

    // High-priority recommendations
    recommendations.push({
      id: 'rec-001',
      priority: 'high',
      category: 'risk_mitigation',
      title: 'Implement Daily Risk Standup',
      description: 'Add 15-minute daily risk review to existing standups',
      effort: 'low',
      impact: 'high',
      timeline: 'immediate',
      success_metrics: ['Risk identification speed', 'Issue resolution time'],
      confidence: 0.89
    });

    recommendations.push({
      id: 'rec-002', 
      priority: 'medium',
      category: 'resource_optimization',
      title: 'Skill-Based Task Assignment',
      description: 'Reassign tasks based on individual expertise and capacity',
      effort: 'medium',
      impact: 'medium',
      timeline: '1 week',
      success_metrics: ['Team utilization rate', 'Task completion velocity'],
      confidence: 0.82
    });

    recommendations.push({
      id: 'rec-003',
      priority: 'medium',
      category: 'quality_assurance',
      title: 'Automated Testing Implementation',
      description: 'Set up continuous integration with automated test suite',
      effort: 'high',
      impact: 'high',
      timeline: '2-3 weeks',
      success_metrics: ['Test coverage %', 'Bug detection rate'],
      confidence: 0.91
    });

    return recommendations;
  }

  async createExecutiveSummary(insights, recommendations) {
    const highPriorityIssues = insights.filter(i => i.priority === 'high').length;
    const totalRecommendations = recommendations.length;
    
    return {
      overview: `Analysis of project reveals ${highPriorityIssues} high-priority areas requiring attention`,
      keyFindings: [
        'Risk level requires enhanced monitoring and mitigation',
        'Resource utilization can be optimized for better productivity',
        'Quality metrics are within acceptable range with room for improvement'
      ],
      recommendedActions: totalRecommendations,
      expectedOutcome: '15-20% improvement in project success probability',
      nextSteps: [
        'Review and prioritize recommendations',
        'Implement high-priority actions within 1 week',
        'Schedule follow-up analysis in 2 weeks'
      ]
    };
  }

  calculateOverallConfidence(data) {
    const confidences = [
      data.riskPrediction.confidence,
      data.resourceOptimization.confidence,
      data.scheduleAnalysis.confidence,
      data.qualityPrediction.confidence
    ];

    return confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  }

  prioritizeActionItems(recommendations) {
    return recommendations
      .filter(rec => rec.priority === 'high')
      .slice(0, 3)
      .map(rec => ({
        action: rec.title,
        timeline: rec.timeline,
        impact: rec.impact,
        effort: rec.effort
      }));
  }
}

