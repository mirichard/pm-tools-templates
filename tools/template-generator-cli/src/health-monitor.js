#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const cron = require('node-cron');
const express = require('express');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
require('dotenv').config();

/**
 * Enterprise Health Monitoring System
 * 
 * Monitors ecosystem health and performance:
 * - System resource utilization
 * - Service availability and response times
 * - Data integrity and consistency
 * - Template repository health
 * - Integration endpoint status
 * - Performance metrics and trends
 */
class HealthMonitor {
  constructor() {
    this.app = express();
    this.port = process.env.HEALTH_MONITOR_PORT || 3002;
    
    // Monitoring configuration
    this.config = {
      checkInterval: process.env.HEALTH_CHECK_INTERVAL || '*/2 * * * *', // Every 2 minutes
      alertThresholds: {
        responseTime: 5000, // 5 seconds
        errorRate: 0.05,    // 5%
        diskUsage: 0.85,    // 85%
        memoryUsage: 0.90,  // 90%
        cpuUsage: 0.80      // 80%
      },
      services: [
        { name: 'AI Service', url: 'http://localhost:3001/api/ai/health', port: 3001 },
        { name: 'Dashboard', url: 'http://localhost:3000/api/dashboard/health', port: 3000 }
      ]
    };
    
    // Health state
    this.healthData = {
      overall: { status: 'unknown', score: 0 },
      system: {},
      services: {},
      repository: {},
      performance: {},
      alerts: [],
      trends: {},
      lastCheck: null
    };
    
    // Data persistence
    this.healthDataPath = path.resolve(__dirname, '../health-data');
    this.logsPath = path.resolve(__dirname, '../logs');
    
    this.setupRoutes();
    this.setupMonitoring();
  }

  setupRoutes() {
    this.app.use(express.json());
    
    // Health dashboard endpoints
    this.app.get('/api/health/overview', this.getHealthOverview.bind(this));
    this.app.get('/api/health/system', this.getSystemHealth.bind(this));
    this.app.get('/api/health/services', this.getServiceHealth.bind(this));
    this.app.get('/api/health/repository', this.getRepositoryHealth.bind(this));
    this.app.get('/api/health/performance', this.getPerformanceMetrics.bind(this));
    this.app.get('/api/health/alerts', this.getActiveAlerts.bind(this));
    this.app.get('/api/health/trends', this.getHealthTrends.bind(this));
    
    // Control endpoints
    this.app.post('/api/health/check', this.performHealthCheck.bind(this));
    this.app.post('/api/health/alert', this.createAlert.bind(this));
    this.app.delete('/api/health/alert/:id', this.dismissAlert.bind(this));
    
    // Main health status
    this.app.get('/health', (req, res) => {
      res.json({
        status: this.healthData.overall.status,
        score: this.healthData.overall.score,
        timestamp: this.healthData.lastCheck,
        services: Object.keys(this.healthData.services).map(name => ({
          name,
          status: this.healthData.services[name]?.status || 'unknown'
        }))
      });
    });
  }

  async setupMonitoring() {
    await fs.ensureDir(this.healthDataPath);
    await fs.ensureDir(this.logsPath);
    
    // Load historical health data
    await this.loadHealthHistory();
    
    // Perform initial health check
    await this.performComprehensiveHealthCheck();
    
    // Schedule periodic health checks
    cron.schedule(this.config.checkInterval, () => {
      console.log(chalk.dim('🔍 Performing scheduled health check...'));
      this.performComprehensiveHealthCheck();
    });
    
    // Schedule daily health summary
    cron.schedule('0 9 * * *', () => {
      console.log(chalk.blue('📊 Generating daily health summary...'));
      this.generateDailyHealthSummary();
    });
  }

  async performComprehensiveHealthCheck() {
    console.log(chalk.blue('🔍 Performing comprehensive health check...'));
    
    try {
      const startTime = Date.now();
      
      // Run all health checks in parallel
      const [
        systemHealth,
        serviceHealth,
        repositoryHealth,
        performanceMetrics
      ] = await Promise.all([
        this.checkSystemHealth(),
        this.checkServiceHealth(),
        this.checkRepositoryHealth(),
        this.collectPerformanceMetrics()
      ]);
      
      // Update health data
      this.healthData.system = systemHealth;
      this.healthData.services = serviceHealth;
      this.healthData.repository = repositoryHealth;
      this.healthData.performance = performanceMetrics;
      this.healthData.lastCheck = new Date().toISOString();
      
      // Calculate overall health score
      this.healthData.overall = this.calculateOverallHealth();
      
      // Check for alerts
      await this.checkAlertConditions();
      
      // Save health data
      await this.saveHealthData();
      
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✅ Health check completed in ${duration}ms - Overall score: ${Math.round(this.healthData.overall.score * 100)}%`));
      
    } catch (error) {
      console.error(chalk.red('❌ Health check failed:'), error);
      
      this.healthData.overall = {
        status: 'critical',
        score: 0,
        error: error.message
      };
      
      await this.createAlert('system', 'Health check system failure', 'critical', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async checkSystemHealth() {
    console.log(chalk.dim('  🖥️  Checking system resources...'));
    
    const health = {
      cpu: await this.getCPUUsage(),
      memory: await this.getMemoryUsage(),
      disk: await this.getDiskUsage(),
      network: await this.getNetworkStatus(),
      uptime: this.getSystemUptime(),
      loadAverage: await this.getLoadAverage()
    };
    
    // Calculate system health score
    health.score = this.calculateSystemHealthScore(health);
    health.status = this.getHealthStatus(health.score);
    
    return health;
  }

  async checkServiceHealth() {
    console.log(chalk.dim('  🔧 Checking service availability...'));
    
    const serviceHealth = {};
    
    for (const service of this.config.services) {
      try {
        const startTime = Date.now();
        
        // Check if port is listening
        const isListening = await this.checkPortListening(service.port);
        
        if (isListening) {
          // Check service health endpoint
          const response = await this.checkServiceEndpoint(service.url);
          const responseTime = Date.now() - startTime;
          
          serviceHealth[service.name] = {
            status: response.success ? 'healthy' : 'unhealthy',
            responseTime,
            lastCheck: new Date().toISOString(),
            details: response.data,
            score: response.success ? 1.0 : 0.0
          };
        } else {
          serviceHealth[service.name] = {
            status: 'unavailable',
            responseTime: null,
            lastCheck: new Date().toISOString(),
            details: { error: 'Service not listening on port' },
            score: 0.0
          };
        }
        
      } catch (error) {
        serviceHealth[service.name] = {
          status: 'error',
          responseTime: null,
          lastCheck: new Date().toISOString(),
          details: { error: error.message },
          score: 0.0
        };
      }
    }
    
    return serviceHealth;
  }

  async checkRepositoryHealth() {
    console.log(chalk.dim('  📁 Checking repository integrity...'));
    
    const repoPath = path.resolve(__dirname, '../../..');
    
    const health = {
      gitStatus: await this.checkGitStatus(repoPath),
      templateIntegrity: await this.checkTemplateIntegrity(repoPath),
      linkHealth: await this.checkLinkHealth(repoPath),
      fileStructure: await this.checkFileStructure(repoPath),
      dataIntegrity: await this.checkDataIntegrity()
    };
    
    // Calculate repository health score
    health.score = this.calculateRepositoryHealthScore(health);
    health.status = this.getHealthStatus(health.score);
    
    return health;
  }

  async collectPerformanceMetrics() {
    console.log(chalk.dim('  ⚡ Collecting performance metrics...'));
    
    const metrics = {
      ecosystem: await this.measureEcosystemPerformance(),
      templates: await this.measureTemplatePerformance(),
      analytics: await this.measureAnalyticsPerformance(),
      responseTimes: await this.measureResponseTimes()
    };
    
    return metrics;
  }

  // System monitoring methods
  async getCPUUsage() {
    try {
      const { stdout } = await execAsync("top -l 1 | grep 'CPU usage' | awk '{print $3}' | sed 's/%//'");
      return parseFloat(stdout.trim()) / 100;
    } catch (error) {
      return 0;
    }
  }

  async getMemoryUsage() {
    try {
      const { stdout } = await execAsync("vm_stat | grep 'Pages free\\|Pages active\\|Pages inactive\\|Pages speculative\\|Pages wired down'");
      const lines = stdout.trim().split('\n');
      
      let free = 0, active = 0, inactive = 0, speculative = 0, wired = 0;
      
      lines.forEach(line => {
        const value = parseInt(line.split(':')[1].trim().replace('.', ''));
        if (line.includes('free')) free = value;
        else if (line.includes('active')) active = value;
        else if (line.includes('inactive')) inactive = value;
        else if (line.includes('speculative')) speculative = value;
        else if (line.includes('wired')) wired = value;
      });
      
      const total = free + active + inactive + speculative + wired;
      const used = active + inactive + speculative + wired;
      
      return used / total;
    } catch (error) {
      return 0;
    }
  }

  async getDiskUsage() {
    try {
      const { stdout } = await execAsync("df -h / | tail -1 | awk '{print $5}' | sed 's/%//'");
      return parseFloat(stdout.trim()) / 100;
    } catch (error) {
      return 0;
    }
  }

  async getNetworkStatus() {
    try {
      const { stdout } = await execAsync("ping -c 1 google.com");
      return { status: 'connected', details: 'Internet connectivity confirmed' };
    } catch (error) {
      return { status: 'disconnected', details: 'No internet connectivity' };
    }
  }

  getSystemUptime() {
    try {
      return process.uptime();
    } catch (error) {
      return 0;
    }
  }

  async getLoadAverage() {
    try {
      const { stdout } = await execAsync("uptime | awk -F'load averages: ' '{print $2}'");
      const loads = stdout.trim().split(' ').map(parseFloat);
      return {
        '1min': loads[0] || 0,
        '5min': loads[1] || 0,
        '15min': loads[2] || 0
      };
    } catch (error) {
      return { '1min': 0, '5min': 0, '15min': 0 };
    }
  }

  async checkPortListening(port) {
    try {
      const { stdout } = await execAsync(`lsof -i :${port}`);
      return stdout.trim().length > 0;
    } catch (error) {
      return false;
    }
  }

  async checkServiceEndpoint(url) {
    try {
      const axios = require('axios');
      const response = await axios.get(url, { timeout: 5000 });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, data: { error: error.message } };
    }
  }

  // Repository health checks
  async checkGitStatus(repoPath) {
    try {
      const { stdout: status } = await execAsync('git status --porcelain', { cwd: repoPath });
      const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd: repoPath });
      
      return {
        branch: branch.trim(),
        uncommittedChanges: status.trim().split('\n').filter(line => line.trim()).length,
        clean: status.trim().length === 0
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkTemplateIntegrity(repoPath) {
    try {
      // Count templates and check for required files
      const templateDirs = [
        'methodology-frameworks',
        'industry-specializations', 
        'role-based-toolkits',
        'business-stakeholder-suite'
      ];
      
      let totalTemplates = 0;
      let missingReadmes = 0;
      
      for (const dir of templateDirs) {
        const dirPath = path.join(repoPath, dir);
        if (await fs.pathExists(dirPath)) {
          const files = await fs.readdir(dirPath, { recursive: true });
          const mdFiles = files.filter(f => f.endsWith('.md'));
          totalTemplates += mdFiles.length;
          
          // Check for README files in subdirectories
          const subdirs = files.filter(f => !f.includes('.'));
          for (const subdir of subdirs) {
            const readmePath = path.join(dirPath, subdir, 'README.md');
            if (!await fs.pathExists(readmePath)) {
              missingReadmes++;
            }
          }
        }
      }
      
      return {
        totalTemplates,
        missingReadmes,
        integrity: missingReadmes === 0 ? 'good' : 'degraded'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkLinkHealth(repoPath) {
    try {
      // Run a subset of link checking
      const { stdout } = await execAsync('find . -name "*.md" | head -10 | xargs grep -l "http" | wc -l', { cwd: repoPath });
      const filesWithLinks = parseInt(stdout.trim());
      
      return {
        filesWithLinks,
        status: 'checked',
        note: 'Subset check - full link validation available separately'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkFileStructure(repoPath) {
    try {
      const requiredDirs = [
        'methodology-frameworks',
        'industry-specializations',
        'role-based-toolkits',
        'business-stakeholder-suite',
        'tools'
      ];
      
      const missingDirs = [];
      for (const dir of requiredDirs) {
        if (!await fs.pathExists(path.join(repoPath, dir))) {
          missingDirs.push(dir);
        }
      }
      
      return {
        requiredDirs: requiredDirs.length,
        missingDirs,
        structure: missingDirs.length === 0 ? 'complete' : 'incomplete'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkDataIntegrity() {
    try {
      const analyticsPath = path.resolve(__dirname, '../analytics');
      
      if (!await fs.pathExists(analyticsPath)) {
        return { status: 'no_data' };
      }
      
      const files = await fs.readdir(analyticsPath);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      let validFiles = 0;
      let corruptFiles = 0;
      
      for (const file of jsonFiles) {
        try {
          await fs.readJSON(path.join(analyticsPath, file));
          validFiles++;
        } catch (error) {
          corruptFiles++;
        }
      }
      
      return {
        totalFiles: jsonFiles.length,
        validFiles,
        corruptFiles,
        integrity: corruptFiles === 0 ? 'good' : 'degraded'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Performance measurement methods
  async measureEcosystemPerformance() {
    const startTime = Date.now();
    
    try {
      // Simulate ecosystem operations
      const { EcosystemGateway } = require('./ecosystem-gateway');
      const gateway = new EcosystemGateway();
      
      const testAssessment = {
        projectName: 'Health Check Test',
        industry: 'information_technology',
        teamSize: 'medium',
        complexity: 'moderate'
      };
      
      await gateway.discoverEcosystemCapabilities();
      
      return {
        responseTime: Date.now() - startTime,
        status: 'operational'
      };
    } catch (error) {
      return {
        responseTime: Date.now() - startTime,
        status: 'error',
        error: error.message
      };
    }
  }

  async measureTemplatePerformance() {
    const startTime = Date.now();
    
    try {
      // Measure template access time
      const templatesPath = path.resolve(__dirname, '../../..');
      const files = await fs.readdir(templatesPath, { recursive: true });
      const mdFiles = files.filter(f => f.endsWith('.md')).slice(0, 5);
      
      for (const file of mdFiles) {
        await fs.readFile(path.join(templatesPath, file), 'utf8');
      }
      
      return {
        responseTime: Date.now() - startTime,
        templatesAccessed: mdFiles.length,
        status: 'operational'
      };
    } catch (error) {
      return {
        responseTime: Date.now() - startTime,
        status: 'error',
        error: error.message
      };
    }
  }

  async measureAnalyticsPerformance() {
    const startTime = Date.now();
    
    try {
      const analyticsPath = path.resolve(__dirname, '../analytics');
      
      if (await fs.pathExists(analyticsPath)) {
        const files = await fs.readdir(analyticsPath);
        const jsonFiles = files.filter(f => f.endsWith('.json')).slice(0, 3);
        
        for (const file of jsonFiles) {
          await fs.readJSON(path.join(analyticsPath, file));
        }
      }
      
      return {
        responseTime: Date.now() - startTime,
        status: 'operational'
      };
    } catch (error) {
      return {
        responseTime: Date.now() - startTime,
        status: 'error',
        error: error.message
      };
    }
  }

  async measureResponseTimes() {
    const measurements = {};
    
    for (const service of this.config.services) {
      try {
        const startTime = Date.now();
        await this.checkServiceEndpoint(service.url);
        measurements[service.name] = Date.now() - startTime;
      } catch (error) {
        measurements[service.name] = -1; // Indicates failure
      }
    }
    
    return measurements;
  }

  // Health calculation methods
  calculateSystemHealthScore(health) {
    const weights = {
      cpu: 0.25,
      memory: 0.25,
      disk: 0.25,
      network: 0.25
    };
    
    let score = 0;
    
    // CPU score (lower usage is better)
    score += weights.cpu * Math.max(0, 1 - health.cpu / this.config.alertThresholds.cpuUsage);
    
    // Memory score (lower usage is better)
    score += weights.memory * Math.max(0, 1 - health.memory / this.config.alertThresholds.memoryUsage);
    
    // Disk score (lower usage is better)
    score += weights.disk * Math.max(0, 1 - health.disk / this.config.alertThresholds.diskUsage);
    
    // Network score
    score += weights.network * (health.network.status === 'connected' ? 1 : 0);
    
    return Math.max(0, Math.min(1, score));
  }

  calculateRepositoryHealthScore(health) {
    let score = 0;
    let factors = 0;
    
    // Git status
    if (health.gitStatus && !health.gitStatus.error) {
      score += health.gitStatus.clean ? 1 : 0.7;
      factors++;
    }
    
    // Template integrity
    if (health.templateIntegrity && !health.templateIntegrity.error) {
      score += health.templateIntegrity.integrity === 'good' ? 1 : 0.5;
      factors++;
    }
    
    // File structure
    if (health.fileStructure && !health.fileStructure.error) {
      score += health.fileStructure.structure === 'complete' ? 1 : 0.5;
      factors++;
    }
    
    // Data integrity
    if (health.dataIntegrity && !health.dataIntegrity.error) {
      score += health.dataIntegrity.integrity === 'good' ? 1 : 0.5;
      factors++;
    }
    
    return factors > 0 ? score / factors : 0;
  }

  calculateOverallHealth() {
    const weights = {
      system: 0.3,
      services: 0.4,
      repository: 0.3
    };
    
    let overallScore = 0;
    
    // System health
    if (this.healthData.system.score !== undefined) {
      overallScore += weights.system * this.healthData.system.score;
    }
    
    // Service health (average of all services)
    const serviceScores = Object.values(this.healthData.services).map(s => s.score || 0);
    if (serviceScores.length > 0) {
      const avgServiceScore = serviceScores.reduce((sum, score) => sum + score, 0) / serviceScores.length;
      overallScore += weights.services * avgServiceScore;
    }
    
    // Repository health
    if (this.healthData.repository.score !== undefined) {
      overallScore += weights.repository * this.healthData.repository.score;
    }
    
    return {
      score: overallScore,
      status: this.getHealthStatus(overallScore)
    };
  }

  getHealthStatus(score) {
    if (score >= 0.8) return 'healthy';
    if (score >= 0.6) return 'warning';
    if (score >= 0.3) return 'degraded';
    return 'critical';
  }

  // Alert management
  async checkAlertConditions() {
    // Check system thresholds
    if (this.healthData.system.cpu > this.config.alertThresholds.cpuUsage) {
      await this.createAlert('system', `High CPU usage: ${Math.round(this.healthData.system.cpu * 100)}%`, 'warning');
    }
    
    if (this.healthData.system.memory > this.config.alertThresholds.memoryUsage) {
      await this.createAlert('system', `High memory usage: ${Math.round(this.healthData.system.memory * 100)}%`, 'warning');
    }
    
    if (this.healthData.system.disk > this.config.alertThresholds.diskUsage) {
      await this.createAlert('system', `High disk usage: ${Math.round(this.healthData.system.disk * 100)}%`, 'critical');
    }
    
    // Check service availability
    Object.entries(this.healthData.services).forEach(([name, health]) => {
      if (health.status === 'unavailable' || health.status === 'error') {
        this.createAlert('service', `Service ${name} is ${health.status}`, 'critical');
      } else if (health.responseTime > this.config.alertThresholds.responseTime) {
        this.createAlert('performance', `Service ${name} slow response: ${health.responseTime}ms`, 'warning');
      }
    });
    
    // Check overall health
    if (this.healthData.overall.score < 0.5) {
      await this.createAlert('system', `Overall system health degraded: ${Math.round(this.healthData.overall.score * 100)}%`, 'critical');
    }
  }

  async createAlert(type, message, severity, metadata = {}) {
    const alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      severity,
      metadata,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    
    // Add to active alerts
    this.healthData.alerts = this.healthData.alerts || [];
    this.healthData.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.healthData.alerts.length > 100) {
      this.healthData.alerts = this.healthData.alerts.slice(-100);
    }
    
    console.log(chalk.red(`🚨 ALERT [${severity.toUpperCase()}]: ${message}`));
    
    return alert;
  }

  // API handlers
  async getHealthOverview(req, res) {
    res.json({
      overall: this.healthData.overall,
      lastCheck: this.healthData.lastCheck,
      summary: {
        system: this.healthData.system?.status || 'unknown',
        services: Object.keys(this.healthData.services).length,
        activeAlerts: this.healthData.alerts?.filter(a => a.status === 'active').length || 0
      }
    });
  }

  async getSystemHealth(req, res) {
    res.json(this.healthData.system);
  }

  async getServiceHealth(req, res) {
    res.json(this.healthData.services);
  }

  async getRepositoryHealth(req, res) {
    res.json(this.healthData.repository);
  }

  async getPerformanceMetrics(req, res) {
    res.json(this.healthData.performance);
  }

  async getActiveAlerts(req, res) {
    const activeAlerts = this.healthData.alerts?.filter(a => a.status === 'active') || [];
    res.json(activeAlerts);
  }

  async getHealthTrends(req, res) {
    res.json(this.healthData.trends || {});
  }

  async performHealthCheck(req, res) {
    await this.performComprehensiveHealthCheck();
    res.json({ success: true, timestamp: this.healthData.lastCheck });
  }

  async dismissAlert(req, res) {
    const alertId = req.params.id;
    const alert = this.healthData.alerts?.find(a => a.id === alertId);
    
    if (alert) {
      alert.status = 'dismissed';
      alert.dismissedAt = new Date().toISOString();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Alert not found' });
    }
  }

  // Data persistence
  async saveHealthData() {
    try {
      const dataFile = path.join(this.healthDataPath, 'health-state.json');
      await fs.writeJSON(dataFile, this.healthData, { spaces: 2 });
      
      // Also save a timestamped copy for trends
      const timestamp = new Date().toISOString().split('T')[0];
      const trendFile = path.join(this.healthDataPath, `health-${timestamp}.json`);
      await fs.writeJSON(trendFile, {
        timestamp: this.healthData.lastCheck,
        overall: this.healthData.overall,
        system: this.healthData.system,
        services: this.healthData.services
      });
    } catch (error) {
      console.error('Failed to save health data:', error);
    }
  }

  async loadHealthHistory() {
    try {
      const dataFile = path.join(this.healthDataPath, 'health-state.json');
      if (await fs.pathExists(dataFile)) {
        const savedData = await fs.readJSON(dataFile);
        this.healthData = { ...this.healthData, ...savedData };
      }
    } catch (error) {
      console.log(chalk.yellow('Warning: Could not load health history:', error.message));
    }
  }

  async generateDailyHealthSummary() {
    // Generate and log daily health summary
    const summary = {
      date: new Date().toISOString().split('T')[0],
      overallScore: this.healthData.overall.score,
      systemHealth: this.healthData.system?.score || 0,
      serviceAvailability: Object.values(this.healthData.services).filter(s => s.status === 'healthy').length,
      totalAlerts: this.healthData.alerts?.filter(a => a.timestamp.startsWith(new Date().toISOString().split('T')[0])).length || 0
    };
    
    console.log(chalk.blue('📊 Daily Health Summary:'));
    console.log(chalk.white(`  Overall Score: ${Math.round(summary.overallScore * 100)}%`));
    console.log(chalk.white(`  System Health: ${Math.round(summary.systemHealth * 100)}%`));
    console.log(chalk.white(`  Service Availability: ${summary.serviceAvailability}/${this.config.services.length}`));
    console.log(chalk.white(`  Today's Alerts: ${summary.totalAlerts}`));
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(chalk.green(`🔍 Health Monitor running on port ${this.port}`));
      console.log(chalk.blue(`   Health Dashboard: http://localhost:${this.port}/health`));
      console.log(chalk.dim(`   API Overview: http://localhost:${this.port}/api/health/overview`));
    });
  }
}

// CLI Integration
if (require.main === module) {
  const monitor = new HealthMonitor();
  monitor.start();
}

module.exports = { HealthMonitor };
