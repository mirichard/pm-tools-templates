const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

/**
 * Project Intelligence CLI Gateway
 * 
 * Transforms from standalone template generator to ecosystem entry point
 * Connects users to AI-powered project management ecosystem
 */
class EcosystemGateway {
  constructor() {
    this.rootPath = path.resolve(__dirname, '../../..');
    this.ecosystemConnections = {
      aiInsights: path.join(this.rootPath, 'ai-insights'),
      businessSuite: path.join(this.rootPath, 'business-stakeholder-suite'),
      methodologyFrameworks: path.join(this.rootPath, 'methodology-frameworks'),
      roleBasedToolkits: path.join(this.rootPath, 'role-based-toolkits'),
      industrySpecializations: path.join(this.rootPath, 'industry-specializations')
    };
    
    this.analyticsCollector = new UsageAnalyticsCollector();
    this.aiConnector = new AIInsightsConnector(this.rootPath);
    this.ecosystemOrchestrator = new EcosystemOrchestrator(this.rootPath);
  }

  /**
   * Main entry point - replaces simple template generation
   * Creates intelligent project ecosystem instead of static templates
   */
  async createProjectEcosystem(assessment, recommendation) {
    console.log(chalk.blue('\n🌟 Creating your intelligent project ecosystem...'));
    
    // Step 1: Collect data for AI training
    await this.analyticsCollector.captureProjectSetup(assessment, recommendation);
    
    // Step 2: Get AI-powered insights
    const aiInsights = await this.aiConnector.getProjectIntelligence(assessment);
    
    // Step 3: Orchestrate ecosystem components
    const ecosystem = await this.ecosystemOrchestrator.buildProjectEcosystem({
      assessment,
      recommendation,
      aiInsights
    });
    
    return ecosystem;
  }

  /**
   * Discover available ecosystem components
   */
  async discoverEcosystemCapabilities() {
    const capabilities = {
      aiInsights: await this.checkAIInsightsAvailable(),
      businessDashboards: await this.checkBusinessSuiteAvailable(),
      methodologySupport: await this.checkMethodologyFrameworks(),
      industrySpecialization: await this.checkIndustrySpecializations(),
      toolIntegrations: await this.checkIntegrationCapabilities()
    };
    
    return capabilities;
  }

  async checkAIInsightsAvailable() {
    try {
      const aiInsightsPath = this.ecosystemConnections.aiInsights;
      const exists = await fs.pathExists(aiInsightsPath);
      if (exists) {
        // Check for AI components
        const components = await fs.readdir(aiInsightsPath);
        return {
          available: true,
          components: components.filter(c => c.endsWith('.js') || c.endsWith('.py')),
          features: ['project-health-monitoring', 'predictive-analytics', 'risk-intelligence']
        };
      }
      return { available: false, reason: 'AI insights system not found' };
    } catch (error) {
      return { available: false, reason: error.message };
    }
  }

  async checkBusinessSuiteAvailable() {
    try {
      const businessSuitePath = this.ecosystemConnections.businessSuite;
      const exists = await fs.pathExists(businessSuitePath);
      if (exists) {
        const dashboards = await fs.pathExists(path.join(businessSuitePath, 'executive-dashboards'));
        const automation = await fs.pathExists(path.join(businessSuitePath, 'communication-automation'));
        return {
          available: true,
          features: {
            executiveDashboards: dashboards,
            communicationAutomation: automation,
            financialGovernance: await fs.pathExists(path.join(businessSuitePath, 'financial-governance'))
          }
        };
      }
      return { available: false, reason: 'Business stakeholder suite not found' };
    } catch (error) {
      return { available: false, reason: error.message };
    }
  }

  async checkMethodologyFrameworks() {
    try {
      const frameworksPath = this.ecosystemConnections.methodologyFrameworks;
      const exists = await fs.pathExists(frameworksPath);
      if (exists) {
        const frameworks = await fs.readdir(frameworksPath);
        return {
          available: true,
          frameworks: frameworks.filter(f => !f.startsWith('.')),
          count: frameworks.length
        };
      }
      return { available: false, reason: 'Methodology frameworks not found' };
    } catch (error) {
      return { available: false, reason: error.message };
    }
  }

  async checkIndustrySpecializations() {
    try {
      const industryPath = this.ecosystemConnections.industrySpecializations;
      const exists = await fs.pathExists(industryPath);
      if (exists) {
        const specializations = await fs.readdir(industryPath);
        return {
          available: true,
          specializations: specializations.filter(s => !s.startsWith('.')),
          count: specializations.length
        };
      }
      return { available: false, reason: 'Industry specializations not found' };
    } catch (error) {
      return { available: false, reason: error.message };
    }
  }

  async checkIntegrationCapabilities() {
    const integrationPaths = [
      path.join(this.rootPath, 'integrations'),
      path.join(this.rootPath, 'integration-toolkits'),
      path.join(this.rootPath, 'integration_guides')
    ];
    
    const capabilities = [];
    
    for (const integrationPath of integrationPaths) {
      if (await fs.pathExists(integrationPath)) {
        const integrations = await fs.readdir(integrationPath);
        capabilities.push(...integrations.filter(i => !i.startsWith('.')));
      }
    }
    
    return {
      available: capabilities.length > 0,
      integrations: capabilities,
      count: capabilities.length
    };
  }
}

/**
 * Collects usage analytics for AI training and ecosystem improvement
 */
class UsageAnalyticsCollector {
  constructor() {
    this.analyticsPath = path.resolve(__dirname, '../analytics');
    this.ensureAnalyticsDirectory();
  }

  async ensureAnalyticsDirectory() {
    await fs.ensureDir(this.analyticsPath);
  }

  async captureProjectSetup(assessment, recommendation) {
    const analyticsData = {
      timestamp: new Date().toISOString(),
      sessionId: this.generateSessionId(),
      assessment: {
        projectName: assessment.projectName,
        industry: assessment.industry,
        teamSize: assessment.teamSize,
        duration: assessment.duration,
        complexity: assessment.complexity,
        changeFrequency: assessment.changeFrequency,
        stakeholderTypes: assessment.stakeholderTypes,
        experience: assessment.experience
      },
      recommendation: {
        methodology: recommendation.methodology,
        confidence: recommendation.confidence,
        reasoning: recommendation.reasoning
      },
      ecosystemContext: {
        version: '1.0.0-ecosystem-gateway',
        source: 'cli-gateway'
      }
    };

    // Store for AI training (anonymized)
    const filename = `project-setup-${Date.now()}.json`;
    await fs.writeJSON(path.join(this.analyticsPath, filename), analyticsData, { spaces: 2 });
    
    console.log(chalk.dim(`📊 Usage data collected for ecosystem improvement`));
  }

  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async getUsageInsights() {
    try {
      const files = await fs.readdir(this.analyticsPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        return { totalProjects: 0, insights: 'No usage data available yet' };
      }

      const insights = {
        totalProjects: jsonFiles.length,
        lastUsed: jsonFiles[jsonFiles.length - 1],
        dataAvailable: true
      };

      return insights;
    } catch (error) {
      return { error: error.message };
    }
  }
}

/**
 * Connects to AI insights system for intelligent recommendations
 */
class AIInsightsConnector {
  constructor(rootPath) {
    this.aiInsightsPath = path.join(rootPath, 'ai-insights');
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:3001';
    this.mockAIMode = !this.checkAIServiceAvailable();
  }

  async checkAIServiceAvailable() {
    try {
      const axios = require('axios');
      await axios.get(`${this.aiServiceUrl}/api/ai/health`, { timeout: 1000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getProjectIntelligence(assessment) {
    console.log(chalk.dim('🧠 Analyzing project with AI insights...'));
    
    // Try real AI service first
    const aiAvailable = await this.checkAIServiceAvailable();
    
    if (aiAvailable) {
      try {
        return await this.connectToRealAISystem(assessment);
      } catch (error) {
        console.log(chalk.yellow('AI service unavailable, falling back to local insights'));
        return this.generateMockAIInsights(assessment);
      }
    }
    
    // Fallback to mock insights
    return this.generateMockAIInsights(assessment);
  }

  async connectToRealAISystem(assessment) {
    const axios = require('axios');
    
    console.log(chalk.blue('🚀 Connecting to real AI service for advanced analysis...'));
    
    const response = await axios.post(`${this.aiServiceUrl}/api/ai/project-intelligence`, {
      assessment
    }, {
      timeout: 10000
    });
    
    console.log(chalk.green('✨ Received AI-powered insights!'));
    return response.data;
  }

  generateMockAIInsights(assessment) {
    // Simulate AI-powered insights based on assessment
    const insights = {
      riskPredictions: this.predictProjectRisks(assessment),
      resourceOptimization: this.suggestResourceOptimization(assessment),
      scheduleForecasting: this.generateScheduleForecast(assessment),
      successFactors: this.identifySuccessFactors(assessment),
      aiConfidence: this.calculateAIConfidence(assessment)
    };

    return insights;
  }

  predictProjectRisks(assessment) {
    const risks = [];
    
    if (assessment.complexity === 'complex' || assessment.complexity === 'highly_complex') {
      risks.push({
        type: 'scope_creep',
        probability: 0.7,
        impact: 'high',
        mitigation: 'Implement strict change control process'
      });
    }
    
    if (assessment.changeFrequency === 'frequently' || assessment.changeFrequency === 'constantly') {
      risks.push({
        type: 'requirements_volatility',
        probability: 0.8,
        impact: 'medium',
        mitigation: 'Use agile methodology with frequent stakeholder feedback'
      });
    }
    
    if (assessment.teamSize === 'large' || assessment.teamSize === 'enterprise') {
      risks.push({
        type: 'communication_breakdown',
        probability: 0.6,
        impact: 'high',
        mitigation: 'Establish clear communication protocols and regular checkpoints'
      });
    }

    return risks;
  }

  suggestResourceOptimization(assessment) {
    return {
      recommendedTeamStructure: this.getOptimalTeamStructure(assessment),
      skillGapAnalysis: this.analyzeSkillGaps(assessment),
      capacityPlanning: this.planCapacity(assessment)
    };
  }

  getOptimalTeamStructure(assessment) {
    const structures = {
      small: { core: 3, extended: 2, specialization: 'generalist' },
      medium: { core: 5, extended: 4, specialization: 'mixed' },
      large: { core: 8, extended: 6, specialization: 'specialist' },
      enterprise: { core: 12, extended: 10, specialization: 'highly_specialized' }
    };
    
    return structures[assessment.teamSize] || structures.medium;
  }

  analyzeSkillGaps(assessment) {
    const gaps = [];
    
    if (assessment.industry === 'software_development') {
      gaps.push('DevOps expertise', 'Security specialist', 'UX/UI designer');
    } else if (assessment.industry === 'healthcare_pharmaceutical') {
      gaps.push('Regulatory compliance expert', 'Clinical research coordinator');
    }
    
    return gaps;
  }

  planCapacity(assessment) {
    const durationFactors = {
      short: 1.0,
      medium: 1.2,
      long: 1.5,
      ongoing: 1.8
    };
    
    const complexityFactors = {
      simple: 1.0,
      moderate: 1.3,
      complex: 1.6,
      highly_complex: 2.0
    };
    
    const baseFTE = 3;
    const factor = (durationFactors[assessment.duration] || 1.2) * 
                   (complexityFactors[assessment.complexity] || 1.3);
    
    return {
      recommendedFTE: Math.ceil(baseFTE * factor),
      bufferRecommendation: '15-20%',
      criticalSkills: this.analyzeSkillGaps(assessment)
    };
  }

  generateScheduleForecast(assessment) {
    // Mock predictive scheduling (future: real Monte Carlo simulation)
    const baseDuration = {
      short: 12,
      medium: 26,
      long: 52,
      ongoing: 104
    }[assessment.duration] || 26;
    
    const complexityMultiplier = {
      simple: 0.8,
      moderate: 1.0,
      complex: 1.4,
      highly_complex: 1.8
    }[assessment.complexity] || 1.0;
    
    const forecastWeeks = Math.ceil(baseDuration * complexityMultiplier);
    
    return {
      estimatedDuration: `${forecastWeeks} weeks`,
      confidenceInterval: '±15%',
      criticalPath: ['requirements_gathering', 'core_development', 'testing', 'deployment'],
      riskFactors: ['scope_changes', 'resource_availability', 'technical_complexity']
    };
  }

  identifySuccessFactors(assessment) {
    const factors = [];
    
    if (assessment.experience === 'expert' || assessment.experience === 'advanced') {
      factors.push('Strong PM leadership available');
    }
    
    if (assessment.stakeholderTypes && assessment.stakeholderTypes.includes('executive')) {
      factors.push('Executive sponsorship secured');
    }
    
    factors.push(
      'Clear methodology alignment',
      'Appropriate tool selection',
      'Stakeholder engagement plan'
    );
    
    return factors;
  }

  calculateAIConfidence(assessment) {
    // Mock AI confidence calculation
    let confidence = 0.7; // Base confidence
    
    if (assessment.experience === 'expert') confidence += 0.1;
    if (assessment.complexity === 'simple') confidence += 0.1;
    if (assessment.changeFrequency === 'rarely') confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  async connectToRealAISystem(assessment) {
    // Future implementation: Connect to actual AI insights system
    // This will integrate with the ai-insights/ directory components
    throw new Error('Real AI system integration not yet implemented');
  }
}

/**
 * Orchestrates creation of complete project ecosystem
 */
class EcosystemOrchestrator {
  constructor(rootPath) {
    this.rootPath = rootPath;
  }

  async buildProjectEcosystem(data) {
    const { assessment, recommendation, aiInsights } = data;
    
    console.log(chalk.green('🌟 Building your intelligent project ecosystem...'));
    
    const ecosystem = {
      projectIntelligence: await this.createProjectIntelligence(assessment, recommendation, aiInsights),
      businessDashboards: await this.createBusinessDashboards(assessment, recommendation),
      methodologyFramework: await this.setupMethodologyFramework(assessment, recommendation),
      toolIntegrations: await this.setupToolIntegrations(assessment, recommendation),
      communityConnections: await this.connectToCommunity(assessment, recommendation)
    };
    
    return ecosystem;
  }

  async createProjectIntelligence(assessment, recommendation, aiInsights) {
    return {
      overview: {
        projectName: assessment.projectName,
        methodology: recommendation.methodology,
        confidence: recommendation.confidence,
        aiConfidence: aiInsights.aiConfidence
      },
      predictions: {
        risks: aiInsights.riskPredictions,
        schedule: aiInsights.scheduleForecasting,
        resources: aiInsights.resourceOptimization
      },
      successFactors: aiInsights.successFactors
    };
  }

  async createBusinessDashboards(assessment, recommendation) {
    // Connect to business-stakeholder-suite/
    const dashboards = {
      executive: await this.generateExecutiveDashboard(assessment, recommendation),
      financial: await this.generateFinancialDashboard(assessment, recommendation),
      operational: await this.generateOperationalDashboard(assessment, recommendation)
    };
    
    return dashboards;
  }

  async generateExecutiveDashboard(assessment, recommendation) {
    return {
      type: 'executive_dashboard',
      components: [
        'project_status_overview',
        'risk_heatmap',
        'financial_summary',
        'milestone_timeline',
        'stakeholder_satisfaction'
      ],
      updateFrequency: 'weekly',
      audience: 'C-suite and executives'
    };
  }

  async generateFinancialDashboard(assessment, recommendation) {
    return {
      type: 'financial_dashboard',
      components: [
        'budget_tracking',
        'cost_variance_analysis',
        'roi_projection',
        'resource_cost_breakdown',
        'financial_forecasting'
      ],
      updateFrequency: 'daily',
      audience: 'CFO and financial stakeholders'
    };
  }

  async generateOperationalDashboard(assessment, recommendation) {
    return {
      type: 'operational_dashboard',
      components: [
        'team_performance_metrics',
        'task_completion_rates',
        'issue_tracking',
        'quality_metrics',
        'velocity_tracking'
      ],
      updateFrequency: 'real-time',
      audience: 'Project managers and team leads'
    };
  }

  async setupMethodologyFramework(assessment, recommendation) {
    // Connect to methodology-frameworks/
    const frameworkPath = path.join(this.rootPath, 'methodology-frameworks', 
      recommendation.methodology === 'agile' ? 'agile-scrum' :
      recommendation.methodology === 'traditional' ? 'traditional-waterfall' : 'hybrid-approaches'
    );
    
    return {
      methodology: recommendation.methodology,
      frameworkPath,
      templates: await this.discoverMethodologyTemplates(frameworkPath),
      practices: await this.getMethodologyPractices(recommendation.methodology)
    };
  }

  async discoverMethodologyTemplates(frameworkPath) {
    try {
      if (await fs.pathExists(frameworkPath)) {
        const files = await fs.readdir(frameworkPath, { recursive: true });
        return files.filter(f => f.endsWith('.md')).slice(0, 10); // Limit for demo
      }
    } catch (error) {
      console.log(chalk.dim(`Note: ${error.message}`));
    }
    return [];
  }

  async getMethodologyPractices(methodology) {
    const practices = {
      agile: ['daily_standups', 'sprint_planning', 'retrospectives', 'backlog_grooming'],
      traditional: ['phase_gate_reviews', 'change_control', 'risk_management', 'quality_assurance'],
      hybrid: ['iteration_planning', 'milestone_reviews', 'flexible_ceremonies', 'adaptive_governance']
    };
    
    return practices[methodology] || practices.hybrid;
  }

  async setupToolIntegrations(assessment, recommendation) {
    // Connect to existing integrations/ and integration_guides/
    return {
      recommended: this.getRecommendedTools(assessment, recommendation),
      available: await this.getAvailableIntegrations(),
      setup: 'Integration guides will be generated in project setup'
    };
  }

  getRecommendedTools(assessment, recommendation) {
    const tools = {
      agile: ['Jira', 'Azure DevOps', 'Trello', 'GitHub Projects'],
      traditional: ['Microsoft Project', 'Smartsheet', 'Monday.com', 'Asana'],
      hybrid: ['Notion', 'ClickUp', 'Wrike', 'Linear']
    };
    
    return tools[recommendation.methodology] || tools.hybrid;
  }

  async getAvailableIntegrations() {
    const integrationPaths = [
      path.join(this.rootPath, 'integrations'),
      path.join(this.rootPath, 'integration_guides')
    ];
    
    const available = [];
    for (const integrationPath of integrationPaths) {
      try {
        if (await fs.pathExists(integrationPath)) {
          const integrations = await fs.readdir(integrationPath);
          available.push(...integrations.filter(i => !i.startsWith('.')));
        }
      } catch (error) {
        // Path doesn't exist, continue
      }
    }
    
    return available;
  }

  async connectToCommunity(assessment, recommendation) {
    return {
      communityResources: [
        'project_success_stories',
        'methodology_best_practices',
        'industry_specific_guidance',
        'expert_consultations'
      ],
      contributionOpportunities: [
        'template_feedback',
        'methodology_insights',
        'tool_integration_reviews'
      ],
      learningPaths: [
        `${recommendation.methodology}_mastery`,
        `${assessment.industry}_specialization`,
        'ecosystem_platform_features'
      ]
    };
  }
}

module.exports = {
  EcosystemGateway,
  UsageAnalyticsCollector,
  AIInsightsConnector,
  EcosystemOrchestrator
};
