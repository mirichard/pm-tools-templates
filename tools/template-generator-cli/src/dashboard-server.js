#!/usr/bin/env node

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const WebSocket = require('ws');
const { createServer } = require('http');
const cron = require('node-cron');
require('dotenv').config();

/**
 * Advanced Executive Dashboard Server
 * 
 * Provides real-time business intelligence dashboards for:
 * - Project portfolio overview
 * - Risk monitoring and alerts
 * - Resource utilization tracking
 * - Financial governance
 * - KPI metrics and trends
 */
class DashboardServer {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    this.port = process.env.DASHBOARD_PORT || 3000;
    
    // Data repositories
    this.analyticsPath = path.resolve(__dirname, '../analytics');
    this.dashboardDataPath = path.resolve(__dirname, '../dashboard-data');
    // Path to templates in repository root
    this.templatesPath = path.resolve(__dirname, '../..');
    
    // Dashboard state
    this.clients = new Set();
    this.dashboardData = {
      projects: [],
      portfolio: {},
      risks: [],
      resources: {},
      financials: {},
      kpis: {},
      realTimeMetrics: {}
    };
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupDataCollection();
    this.startPeriodicUpdates();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../dashboard-ui')));
    
    // CORS for development
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
  }

  setupRoutes() {
    // Main dashboard view
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../dashboard-ui/index.html'));
    });

    // API Endpoints
    this.app.get('/api/dashboard/overview', this.getPortfolioOverview.bind(this));
    this.app.get('/api/dashboard/projects', this.getProjectList.bind(this));
    this.app.get('/api/dashboard/risks', this.getRiskDashboard.bind(this));
    this.app.get('/api/dashboard/resources', this.getResourceDashboard.bind(this));
    this.app.get('/api/dashboard/financials', this.getFinancialDashboard.bind(this));
    this.app.get('/api/dashboard/kpis', this.getKPIDashboard.bind(this));
    this.app.get('/api/dashboard/templates', this.getTemplateMetrics.bind(this));
    
    // Real-time data endpoints
    this.app.get('/api/dashboard/realtime', this.getRealTimeMetrics.bind(this));
    this.app.post('/api/dashboard/alerts', this.createAlert.bind(this));
    
    // Health check
    this.app.get('/api/dashboard/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        connectedClients: this.clients.size,
        dataLastUpdated: this.dashboardData.lastUpdated
      });
    });
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log(chalk.blue('📊 New dashboard client connected'));
      this.clients.add(ws);
      
      // Send current data to new client
      ws.send(JSON.stringify({
        type: 'dashboard-data',
        data: this.dashboardData
      }));
      
      ws.on('close', () => {
        console.log(chalk.dim('📊 Dashboard client disconnected'));
        this.clients.delete(ws);
      });
      
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleClientMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });
    });
  }

  async setupDataCollection() {
    await fs.ensureDir(this.analyticsPath);
    await fs.ensureDir(this.dashboardDataPath);
    
    // Load existing dashboard data
    try {
      const dataFile = path.join(this.dashboardDataPath, 'dashboard-state.json');
      if (await fs.pathExists(dataFile)) {
        const savedData = await fs.readJSON(dataFile);
        this.dashboardData = { ...this.dashboardData, ...savedData };
      }
    } catch (error) {
      console.log(chalk.yellow('Warning: Could not load dashboard state:', error.message));
    }
    
    // Initial data collection
    await this.collectDashboardData();
  }

  async collectDashboardData() {
    console.log(chalk.blue('📊 Collecting dashboard data...'));
    
    try {
      // Collect project data from analytics
      const projects = await this.loadProjectData();
      
      // Generate portfolio overview
      const portfolio = this.generatePortfolioOverview(projects);
      
      // Analyze risks across projects
      const risks = this.analyzePortfolioRisks(projects);
      
      // Calculate resource utilization
      const resources = this.calculateResourceMetrics(projects);
      
      // Generate financial metrics
      const financials = this.generateFinancialMetrics(projects);
      
      // Calculate KPIs
      const kpis = this.calculateKPIs(projects);
      
      // Update dashboard data
      this.dashboardData = {
        projects,
        portfolio,
        risks,
        resources,
        financials,
        kpis,
        realTimeMetrics: this.generateRealTimeMetrics(),
        lastUpdated: new Date().toISOString()
      };
      
      // Save state
      await this.saveDashboardState();
      
      // Broadcast to connected clients
      this.broadcastUpdate('dashboard-data', this.dashboardData);
      
      console.log(chalk.green(`📊 Dashboard data updated: ${projects.length} projects analyzed`));
    } catch (error) {
      console.error(chalk.red('Dashboard data collection error:'), error);
    }
  }

  async loadProjectData() {
    const projects = [];
    
    try {
      const analyticsFiles = await fs.readdir(this.analyticsPath);
      const jsonFiles = analyticsFiles.filter(f => f.endsWith('.json'));
      
      for (const file of jsonFiles) {
        try {
          const projectData = await fs.readJSON(path.join(this.analyticsPath, file));
          
          // Enrich project data with derived metrics
          const enrichedProject = {
            ...projectData,
            id: projectData.sessionId || file.replace('.json', ''),
            status: this.deriveProjectStatus(projectData),
            healthScore: this.calculateProjectHealth(projectData),
            riskLevel: this.calculateRiskLevel(projectData),
            progressEstimate: this.estimateProgress(projectData)
          };
          
          projects.push(enrichedProject);
        } catch (error) {
          console.log(chalk.dim(`Warning: Could not load project ${file}: ${error.message}`));
        }
      }
    } catch (error) {
      console.log(chalk.yellow('Warning: Could not load analytics data:', error.message));
    }
    
    return projects;
  }

  generatePortfolioOverview(projects) {
    const overview = {
      totalProjects: projects.length,
      byStatus: {},
      byIndustry: {},
      byComplexity: {},
      byTeamSize: {},
      healthDistribution: { healthy: 0, warning: 0, critical: 0 },
      resourceUtilization: 0,
      averageHealthScore: 0
    };
    
    if (projects.length === 0) return overview;
    
    let totalHealthScore = 0;
    
    projects.forEach(project => {
      // Status distribution
      const status = project.status || 'unknown';
      overview.byStatus[status] = (overview.byStatus[status] || 0) + 1;
      
      // Industry distribution
      const industry = project.assessment?.industry || 'unknown';
      overview.byIndustry[industry] = (overview.byIndustry[industry] || 0) + 1;
      
      // Complexity distribution
      const complexity = project.assessment?.complexity || 'unknown';
      overview.byComplexity[complexity] = (overview.byComplexity[complexity] || 0) + 1;
      
      // Team size distribution
      const teamSize = project.assessment?.teamSize || 'unknown';
      overview.byTeamSize[teamSize] = (overview.byTeamSize[teamSize] || 0) + 1;
      
      // Health distribution
      const healthScore = project.healthScore || 0;
      totalHealthScore += healthScore;
      
      if (healthScore >= 0.8) overview.healthDistribution.healthy++;
      else if (healthScore >= 0.6) overview.healthDistribution.warning++;
      else overview.healthDistribution.critical++;
    });
    
    overview.averageHealthScore = totalHealthScore / projects.length;
    overview.resourceUtilization = this.calculateOverallResourceUtilization(projects);
    
    return overview;
  }

  analyzePortfolioRisks(projects) {
    const risks = [];
    const riskCounts = {};
    
    projects.forEach(project => {
      // Extract risks from project recommendations (if available)
      if (project.recommendation && project.recommendation.risks) {
        project.recommendation.risks.forEach(risk => {
          const riskKey = risk.type || 'unknown';
          riskCounts[riskKey] = (riskCounts[riskKey] || 0) + 1;
          
          risks.push({
            projectId: project.id,
            projectName: project.assessment?.projectName || 'Unknown Project',
            type: risk.type,
            probability: risk.probability || 0.5,
            impact: risk.impact || 'medium',
            severity: this.calculateRiskSeverity(risk),
            status: 'active'
          });
        });
      }
      
      // Add derived risks based on project characteristics
      const derivedRisks = this.deriveProjectRisks(project);
      risks.push(...derivedRisks);
    });
    
    return {
      active: risks.filter(r => r.status === 'active'),
      byType: riskCounts,
      highSeverity: risks.filter(r => r.severity === 'high').length,
      totalRisks: risks.length
    };
  }

  calculateResourceMetrics(projects) {
    const metrics = {
      totalTeamMembers: 0,
      utilizationByRole: {},
      capacityPlanning: {},
      skillGaps: [],
      costMetrics: {}
    };
    
    projects.forEach(project => {
      const assessment = project.assessment || {};
      
      // Estimate team size based on project characteristics
      const estimatedTeamSize = this.estimateTeamSize(assessment);
      metrics.totalTeamMembers += estimatedTeamSize;
      
      // Track utilization by industry (proxy for role types)
      const industry = assessment.industry || 'general';
      metrics.utilizationByRole[industry] = (metrics.utilizationByRole[industry] || 0) + estimatedTeamSize;
    });
    
    return metrics;
  }

  generateFinancialMetrics(projects) {
    return {
      totalBudget: this.estimatePortfolioBudget(projects),
      spendByIndustry: this.calculateSpendByIndustry(projects),
      riskExposure: this.calculateFinancialRiskExposure(projects),
      roi: this.estimatePortfolioROI(projects),
      costOptimizationOpportunities: this.identifyCostOptimizations(projects)
    };
  }

  calculateKPIs(projects) {
    return {
      portfolioHealth: this.dashboardData.portfolio?.averageHealthScore || 0,
      onTimeDelivery: this.calculateOnTimeDeliveryRate(projects),
      budgetVariance: this.calculateBudgetVariance(projects),
      riskMitigationRate: this.calculateRiskMitigationRate(projects),
      resourceUtilization: this.calculateOverallResourceUtilization(projects),
      clientSatisfaction: this.estimateClientSatisfaction(projects),
      teamProductivity: this.calculateTeamProductivity(projects),
      qualityMetrics: this.calculateQualityMetrics(projects)
    };
  }

  generateRealTimeMetrics() {
    return {
      activeUsers: this.clients.size,
      systemLoad: Math.random() * 0.3 + 0.1, // Mock system load
      apiResponseTime: Math.random() * 100 + 50, // Mock response time
      dataFreshness: new Date().toISOString(),
      alerts: this.generateCurrentAlerts()
    };
  }

  // API Route Handlers
  async getPortfolioOverview(req, res) {
    res.json(this.dashboardData.portfolio);
  }

  async getProjectList(req, res) {
    res.json(this.dashboardData.projects);
  }

  async getRiskDashboard(req, res) {
    res.json(this.dashboardData.risks);
  }

  async getResourceDashboard(req, res) {
    res.json(this.dashboardData.resources);
  }

  async getFinancialDashboard(req, res) {
    res.json(this.dashboardData.financials);
  }

  async getKPIDashboard(req, res) {
    res.json(this.dashboardData.kpis);
  }

  async getTemplateMetrics(req, res) {
    try {
      const templateMetrics = await this.collectTemplateMetrics();
      res.json(templateMetrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to collect template metrics' });
    }
  }

  async getRealTimeMetrics(req, res) {
    res.json(this.dashboardData.realTimeMetrics);
  }

  async createAlert(req, res) {
    const { type, message, severity, projectId } = req.body;
    
    const alert = {
      id: `alert-${Date.now()}`,
      type,
      message,
      severity,
      projectId,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    
    // Broadcast alert to all connected clients
    this.broadcastUpdate('alert', alert);
    
    res.json({ success: true, alertId: alert.id });
  }

  // WebSocket message handling
  handleClientMessage(ws, data) {
    switch (data.type) {
      case 'request-update':
        ws.send(JSON.stringify({
          type: 'dashboard-data',
          data: this.dashboardData
        }));
        break;
      
      case 'subscribe-alerts':
        // Client wants to receive alerts
        ws.alertSubscription = true;
        break;
      
      default:
        console.log('Unknown client message type:', data.type);
    }
  }

  // Utility methods
  broadcastUpdate(type, data) {
    const message = JSON.stringify({ type, data });
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  async saveDashboardState() {
    try {
      const stateFile = path.join(this.dashboardDataPath, 'dashboard-state.json');
      await fs.writeJSON(stateFile, this.dashboardData, { spaces: 2 });
    } catch (error) {
      console.error('Failed to save dashboard state:', error);
    }
  }

  startPeriodicUpdates() {
    // Update dashboard data every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      console.log(chalk.dim('🔄 Periodic dashboard update...'));
      this.collectDashboardData();
    });
    
    // Update real-time metrics every 30 seconds
    cron.schedule('*/30 * * * * *', () => {
      this.dashboardData.realTimeMetrics = this.generateRealTimeMetrics();
      this.broadcastUpdate('realtime-metrics', this.dashboardData.realTimeMetrics);
    });
  }

  async collectTemplateMetrics() {
    // Analyze template usage and effectiveness
    return {
      totalTemplates: await this.countTotalTemplates(),
      usageByCategory: await this.analyzeTemplateUsage(),
      effectiveness: await this.calculateTemplateEffectiveness(),
      gaps: await this.identifyTemplateGaps()
    };
  }

  // Helper methods (simplified implementations)
  deriveProjectStatus(project) {
    const age = Date.now() - new Date(project.timestamp).getTime();
    const daysSinceCreation = age / (1000 * 60 * 60 * 24);
    
    if (daysSinceCreation < 7) return 'planning';
    if (daysSinceCreation < 30) return 'active';
    if (daysSinceCreation < 90) return 'ongoing';
    return 'completed';
  }

  calculateProjectHealth(project) {
    // Calculate health score based on various factors
    let score = 0.7; // Base score
    
    const assessment = project.assessment || {};
    
    // Adjust based on complexity
    if (assessment.complexity === 'simple') score += 0.2;
    else if (assessment.complexity === 'highly_complex') score -= 0.2;
    
    // Adjust based on experience
    if (assessment.experience === 'expert') score += 0.1;
    else if (assessment.experience === 'beginner') score -= 0.1;
    
    // Adjust based on change frequency
    if (assessment.changeFrequency === 'constantly') score -= 0.15;
    
    return Math.max(0, Math.min(1, score));
  }

  calculateRiskLevel(project) {
    const health = this.calculateProjectHealth(project);
    if (health >= 0.8) return 'low';
    if (health >= 0.6) return 'medium';
    return 'high';
  }

  estimateProgress(project) {
    const status = this.deriveProjectStatus(project);
    const progressMap = {
      'planning': 0.1,
      'active': 0.4,
      'ongoing': 0.7,
      'completed': 1.0
    };
    return progressMap[status] || 0.1;
  }

  calculateOverallResourceUtilization(projects) {
    // Mock implementation
    return 0.75 + Math.random() * 0.2;
  }

  calculateRiskSeverity(risk) {
    const probability = risk.probability || 0.5;
    const impactScore = { low: 0.3, medium: 0.6, high: 0.9, critical: 1.0 }[risk.impact] || 0.6;
    const severity = probability * impactScore;
    
    if (severity >= 0.7) return 'high';
    if (severity >= 0.4) return 'medium';
    return 'low';
  }

  deriveProjectRisks(project) {
    const risks = [];
    const assessment = project.assessment || {};
    
    if (assessment.complexity === 'highly_complex') {
      risks.push({
        projectId: project.id,
        projectName: assessment.projectName || 'Unknown',
        type: 'complexity_risk',
        probability: 0.8,
        impact: 'high',
        severity: 'high',
        status: 'active'
      });
    }
    
    return risks;
  }

  estimateTeamSize(assessment) {
    const sizeMap = { small: 3, medium: 8, large: 15, enterprise: 25 };
    return sizeMap[assessment.teamSize] || 5;
  }

  generateCurrentAlerts() {
    return [
      {
        id: 'alert-1',
        type: 'performance',
        message: 'High system load detected',
        severity: 'warning',
        timestamp: new Date().toISOString()
      }
    ];
  }

  // Additional mock implementations for completeness
  estimatePortfolioBudget(projects) { return projects.length * 250000; }
  calculateSpendByIndustry(projects) { return {}; }
  calculateFinancialRiskExposure(projects) { return 0.15; }
  estimatePortfolioROI(projects) { return 1.25; }
  identifyCostOptimizations(projects) { return []; }
  calculateOnTimeDeliveryRate(projects) { return 0.82; }
  calculateBudgetVariance(projects) { return 0.05; }
  calculateRiskMitigationRate(projects) { return 0.78; }
  estimateClientSatisfaction(projects) { return 0.85; }
  calculateTeamProductivity(projects) { return 0.80; }
  calculateQualityMetrics(projects) { return 0.88; }
  async countTotalTemplates() { return 150; }
  async analyzeTemplateUsage() { return {}; }
  async calculateTemplateEffectiveness() { return 0.78; }
  async identifyTemplateGaps() { return []; }

  start() {
    this.server.listen(this.port, () => {
      console.log(chalk.green(`📊 Executive Dashboard running on port ${this.port}`));
      console.log(chalk.blue(`   Dashboard URL: http://localhost:${this.port}`));
      console.log(chalk.dim(`   API Health: http://localhost:${this.port}/api/dashboard/health`));
    });
  }
}

// CLI Integration
if (require.main === module) {
  const dashboard = new DashboardServer();
  dashboard.start();
}

module.exports = { DashboardServer };
