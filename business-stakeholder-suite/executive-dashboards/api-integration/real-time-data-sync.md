# Real-Time Data Synchronization API

## 📊 Overview
This document outlines the API endpoints and real-time data synchronization architecture for executive dashboards. It provides RESTful APIs for dashboard data consumption, webhook integrations, and real-time updates via WebSocket connections.

## 🏗️ Architecture Overview

### System Components
- **API Gateway**: Load balancing and authentication
- **Data Processing Layer**: Real-time data transformation
- **Cache Layer**: Redis for high-performance data serving
- **WebSocket Server**: Real-time push notifications
- **Database Layer**: Primary data storage with read replicas

### Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Redis cache
- **Real-time**: Socket.IO for WebSocket connections
- **Authentication**: JWT tokens with OAuth 2.0
- **API Documentation**: OpenAPI 3.0 (Swagger)

---

## 🔌 API Endpoints

### Base Configuration
```yaml
# OpenAPI 3.0 Configuration
openapi: 3.0.3
info:
  title: Executive Dashboard API
  version: 1.0.0
  description: Real-time data synchronization for executive dashboards
servers:
  - url: https://api.company.com/v1/executive
    description: Production server
  - url: https://staging-api.company.com/v1/executive
    description: Staging server
```

### Authentication
```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    oauth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://auth.company.com/oauth/authorize
          tokenUrl: https://auth.company.com/oauth/token
          scopes:
            read:dashboard: Read dashboard data
            write:dashboard: Modify dashboard configurations
```

---

## 📈 Portfolio & Project Endpoints

### GET /projects
Get all projects with filtering and pagination.

```yaml
/projects:
  get:
    summary: Retrieve project portfolio data
    security:
      - bearerAuth: []
    parameters:
      - name: portfolio
        in: query
        schema:
          type: string
          enum: [Technology, Operations, Business, All]
      - name: status
        in: query
        schema:
          type: array
          items:
            type: string
            enum: [On Track, At Risk, Behind Schedule, Critical, Completed]
      - name: priority
        in: query
        schema:
          type: string
          enum: [Critical, High, Medium, Low]
      - name: limit
        in: query
        schema:
          type: integer
          minimum: 1
          maximum: 1000
          default: 100
      - name: offset
        in: query
        schema:
          type: integer
          minimum: 0
          default: 0
    responses:
      200:
        description: Successful response
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: array
                  items:
                    $ref: '#/components/schemas/Project'
                meta:
                  $ref: '#/components/schemas/PaginationMeta'
```

### Node.js Implementation
```javascript
// /routes/projects.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const projectService = require('../services/projectService');

router.get('/projects', authenticateToken, async (req, res) => {
  try {
    const {
      portfolio = 'All',
      status,
      priority,
      limit = 100,
      offset = 0
    } = req.query;

    // Build filter object
    const filters = {
      portfolio: portfolio !== 'All' ? portfolio : undefined,
      status: status ? status.split(',') : undefined,
      priority: priority,
      userId: req.user.id, // For row-level security
      userRole: req.user.role
    };

    const result = await projectService.getProjects(filters, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Calculate additional metrics
    const enrichedData = await Promise.all(
      result.data.map(async (project) => ({
        ...project,
        healthScore: calculateHealthScore(project),
        riskLevel: await calculateRiskLevel(project.id),
        budgetVariance: calculateBudgetVariance(project),
        scheduleVariance: calculateScheduleVariance(project)
      }))
    );

    res.json({
      data: enrichedData,
      meta: {
        total: result.total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: result.total > (parseInt(offset) + parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function calculateHealthScore(project) {
  const statusScores = {
    'On Track': 100,
    'At Risk': 60,
    'Behind Schedule': 30,
    'Critical': 10,
    'Completed': 100
  };
  return statusScores[project.status] || 50;
}

function calculateBudgetVariance(project) {
  return ((project.actualCost - project.budget) / project.budget) * 100;
}

function calculateScheduleVariance(project) {
  const today = new Date();
  const plannedProgress = calculatePlannedProgress(project.startDate, project.endDate, today);
  return project.percentComplete - plannedProgress;
}

module.exports = router;
```

---

## 💰 Financial Metrics Endpoints

### GET /financial-metrics
Real-time financial performance data.

```yaml
/financial-metrics:
  get:
    summary: Get financial performance metrics
    security:
      - bearerAuth: []
    parameters:
      - name: projectIds
        in: query
        schema:
          type: array
          items:
            type: string
      - name: dateRange
        in: query
        schema:
          type: string
          enum: [1M, 3M, 6M, 1Y, YTD, Custom]
      - name: startDate
        in: query
        schema:
          type: string
          format: date
      - name: endDate
        in: query
        schema:
          type: string
          format: date
    responses:
      200:
        description: Financial metrics data
        content:
          application/json:
            schema:
              type: object
              properties:
                summary:
                  $ref: '#/components/schemas/FinancialSummary'
                trends:
                  type: array
                  items:
                    $ref: '#/components/schemas/FinancialTrend'
```

### Implementation
```javascript
// /routes/financial-metrics.js
router.get('/financial-metrics', authenticateToken, async (req, res) => {
  try {
    const { projectIds, dateRange = '3M', startDate, endDate } = req.query;
    
    // Calculate date range
    const dates = calculateDateRange(dateRange, startDate, endDate);
    
    // Get financial data
    const financialData = await financialService.getMetrics({
      projectIds: projectIds ? projectIds.split(',') : undefined,
      startDate: dates.start,
      endDate: dates.end,
      userId: req.user.id
    });

    // Calculate KPIs
    const summary = {
      totalBudget: financialData.reduce((sum, item) => sum + item.budget, 0),
      totalActual: financialData.reduce((sum, item) => sum + item.actualCost, 0),
      weightedROI: calculateWeightedROI(financialData),
      portfolioNPV: calculatePortfolioNPV(financialData),
      budgetVariance: calculateTotalBudgetVariance(financialData),
      forecastAccuracy: await calculateForecastAccuracy(financialData),
      costPerformanceIndex: calculateCPI(financialData),
      earnedValueMetrics: calculateEarnedValue(financialData)
    };

    // Generate trend data
    const trends = await generateFinancialTrends(financialData, dates);

    res.json({
      summary,
      trends,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching financial metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Advanced financial calculations
function calculateWeightedROI(data) {
  const totalValue = data.reduce((sum, item) => sum + item.budget, 0);
  const weightedSum = data.reduce((sum, item) => 
    sum + (item.roi * item.budget), 0);
  return totalValue > 0 ? weightedSum / totalValue : 0;
}

function calculateEarnedValue(data) {
  return data.map(project => ({
    projectId: project.id,
    plannedValue: project.budget * (project.plannedProgress / 100),
    earnedValue: project.budget * (project.percentComplete / 100),
    actualCost: project.actualCost,
    scheduleVariance: (project.budget * (project.percentComplete / 100)) - 
                     (project.budget * (project.plannedProgress / 100)),
    costVariance: (project.budget * (project.percentComplete / 100)) - 
                  project.actualCost
  }));
}
```

---

## ⚠️ Risk Management Endpoints

### GET /risks
Risk register and analysis data.

```yaml
/risks:
  get:
    summary: Get risk register data
    security:
      - bearerAuth: []
    parameters:
      - name: riskLevel
        in: query
        schema:
          type: string
          enum: [Critical, High, Medium, Low]
      - name: status
        in: query
        schema:
          type: string
          enum: [Open, Mitigating, Closed]
    responses:
      200:
        description: Risk data
        content:
          application/json:
            schema:
              type: object
              properties:
                risks:
                  type: array
                  items:
                    $ref: '#/components/schemas/Risk'
                analytics:
                  $ref: '#/components/schemas/RiskAnalytics'
```

### Implementation
```javascript
// /routes/risks.js
router.get('/risks', authenticateToken, async (req, res) => {
  try {
    const { riskLevel, status, projectIds } = req.query;
    
    const risks = await riskService.getRisks({
      riskLevel,
      status,
      projectIds: projectIds ? projectIds.split(',') : undefined,
      userId: req.user.id
    });

    // Calculate risk analytics
    const analytics = {
      totalRisks: risks.length,
      criticalRisks: risks.filter(r => r.riskScore >= 15).length,
      highRisks: risks.filter(r => r.riskScore >= 10 && r.riskScore < 15).length,
      riskTrend: await calculateRiskTrend(risks),
      mitigationRate: calculateMitigationRate(risks),
      averageRiskScore: risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length,
      riskDistribution: calculateRiskDistribution(risks),
      ageAnalysis: calculateRiskAgeAnalysis(risks)
    };

    res.json({
      risks: risks.map(risk => ({
        ...risk,
        ageInDays: calculateRiskAge(risk.dateIdentified, risk.dateClosed),
        mitigationStatus: calculateMitigationStatus(risk),
        impactCategory: categorizeImpact(risk.impact),
        urgency: calculateUrgency(risk)
      })),
      analytics,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching risks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function calculateMitigationRate(risks) {
  const totalRisks = risks.length;
  const closedRisks = risks.filter(r => r.status === 'Closed').length;
  return totalRisks > 0 ? (closedRisks / totalRisks) * 100 : 0;
}

function calculateRiskAge(dateIdentified, dateClosed) {
  const endDate = dateClosed ? new Date(dateClosed) : new Date();
  const startDate = new Date(dateIdentified);
  return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
}
```

---

## 📊 Real-Time Dashboard Data Endpoint

### GET /dashboard-data
Consolidated dashboard data for real-time updates.

```javascript
// /routes/dashboard.js
router.get('/dashboard-data', authenticateToken, async (req, res) => {
  try {
    const { portfolio, refreshToken } = req.query;
    const userId = req.user.id;

    // Check if data has changed since last request
    const lastUpdate = await cacheService.getLastUpdate(userId, portfolio);
    if (refreshToken && refreshToken === lastUpdate.token) {
      return res.status(304).json({ message: 'Not modified' });
    }

    // Parallel data fetching for performance
    const [
      portfolioHealth,
      financialSummary,
      riskSummary,
      strategicAlignment,
      resourceUtilization
    ] = await Promise.all([
      dashboardService.getPortfolioHealth(userId, portfolio),
      dashboardService.getFinancialSummary(userId, portfolio),
      dashboardService.getRiskSummary(userId, portfolio),
      dashboardService.getStrategicAlignment(userId, portfolio),
      dashboardService.getResourceUtilization(userId, portfolio)
    ]);

    const dashboardData = {
      timestamp: new Date().toISOString(),
      refreshToken: generateRefreshToken(),
      kpis: {
        portfolioHealthScore: portfolioHealth.score,
        budgetPerformanceIndex: financialSummary.bpi,
        schedulePerformanceIndex: portfolioHealth.spi,
        riskExposureScore: riskSummary.exposureScore,
        strategicAlignmentRate: strategicAlignment.rate,
        resourceUtilizationRate: resourceUtilization.rate
      },
      alerts: await generateAlerts(userId, portfolio),
      trends: {
        healthTrend: portfolioHealth.trend,
        budgetTrend: financialSummary.trend,
        riskTrend: riskSummary.trend
      },
      topProjects: {
        atRisk: portfolioHealth.atRiskProjects.slice(0, 5),
        highPerforming: portfolioHealth.highPerformingProjects.slice(0, 5),
        criticalPath: portfolioHealth.criticalPathProjects.slice(0, 5)
      }
    };

    // Cache the result
    await cacheService.setDashboardData(userId, portfolio, dashboardData);

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate contextual alerts
async function generateAlerts(userId, portfolio) {
  const alerts = [];
  
  // Budget alerts
  const budgetAlerts = await alertService.checkBudgetThresholds(userId, portfolio);
  alerts.push(...budgetAlerts);
  
  // Schedule alerts
  const scheduleAlerts = await alertService.checkScheduleThresholds(userId, portfolio);
  alerts.push(...scheduleAlerts);
  
  // Risk alerts
  const riskAlerts = await alertService.checkRiskThresholds(userId, portfolio);
  alerts.push(...riskAlerts);
  
  return alerts.sort((a, b) => b.priority - a.priority).slice(0, 10);
}
```

---

## 🔄 Real-Time WebSocket Implementation

### WebSocket Server Setup
```javascript
// /websocket/dashboardUpdates.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const redisAdapter = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

class DashboardWebSocketServer {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
        methods: ['GET', 'POST']
      }
    });

    // Redis adapter for horizontal scaling
    const pubClient = createClient({ url: process.env.REDIS_URL });
    const subClient = pubClient.duplicate();
    this.io.adapter(redisAdapter(pubClient, subClient));

    this.setupAuthentication();
    this.setupConnectionHandlers();
    this.startPeriodicUpdates();
  }

  setupAuthentication() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Validate user permissions
        const user = await userService.getUserById(decoded.id);
        if (!user || !user.canAccessDashboard) {
          return next(new Error('Authentication failed'));
        }

        socket.userId = user.id;
        socket.userRole = user.role;
        socket.portfolios = user.portfolios || [];
        
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  setupConnectionHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Dashboard connection established: ${socket.userId}`);

      // Join user-specific rooms
      socket.join(`user:${socket.userId}`);
      socket.portfolios.forEach(portfolio => {
        socket.join(`portfolio:${portfolio}`);
      });

      // Handle dashboard subscription
      socket.on('subscribe:dashboard', async (data) => {
        const { portfolio, refreshInterval = 30000 } = data;
        
        // Validate access to portfolio
        if (!socket.portfolios.includes(portfolio) && socket.userRole !== 'Executive') {
          socket.emit('error', { message: 'Access denied to portfolio' });
          return;
        }

        socket.join(`dashboard:${portfolio}`);
        socket.currentPortfolio = portfolio;
        socket.refreshInterval = Math.max(refreshInterval, 10000); // Min 10 seconds

        // Send initial data
        const dashboardData = await dashboardService.getDashboardData(socket.userId, portfolio);
        socket.emit('dashboard:data', dashboardData);

        // Set up periodic updates
        this.setupPeriodicUpdates(socket);
      });

      // Handle real-time metric requests
      socket.on('request:metrics', async (data) => {
        const { metrics, portfolio } = data;
        const metricsData = await metricsService.getRealtimeMetrics(
          socket.userId, 
          portfolio, 
          metrics
        );
        socket.emit('metrics:data', metricsData);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Dashboard disconnected: ${socket.userId}`);
        if (socket.updateInterval) {
          clearInterval(socket.updateInterval);
        }
      });
    });
  }

  setupPeriodicUpdates(socket) {
    if (socket.updateInterval) {
      clearInterval(socket.updateInterval);
    }

    socket.updateInterval = setInterval(async () => {
      try {
        if (socket.currentPortfolio) {
          const dashboardData = await dashboardService.getDashboardData(
            socket.userId, 
            socket.currentPortfolio
          );
          socket.emit('dashboard:update', dashboardData);
        }
      } catch (error) {
        console.error('Error sending periodic update:', error);
        socket.emit('error', { message: 'Update failed' });
      }
    }, socket.refreshInterval || 30000);
  }

  // Broadcast updates to specific groups
  broadcastUpdate(type, data, target) {
    switch (type) {
      case 'portfolio':
        this.io.to(`portfolio:${target}`).emit('portfolio:update', data);
        break;
      case 'project':
        this.io.to(`project:${target}`).emit('project:update', data);
        break;
      case 'alert':
        this.io.to(`user:${target}`).emit('alert:new', data);
        break;
      case 'system':
        this.io.emit('system:update', data);
        break;
    }
  }

  // Start system-wide periodic updates
  startPeriodicUpdates() {
    // Update dashboard cache every minute
    setInterval(async () => {
      try {
        await dashboardService.refreshAllDashboardCaches();
      } catch (error) {
        console.error('Error refreshing dashboard caches:', error);
      }
    }, 60000);

    // Process alerts every 5 minutes
    setInterval(async () => {
      try {
        const alerts = await alertService.processNewAlerts();
        alerts.forEach(alert => {
          this.broadcastUpdate('alert', alert, alert.userId);
        });
      } catch (error) {
        console.error('Error processing alerts:', error);
      }
    }, 300000);
  }
}

module.exports = DashboardWebSocketServer;
```

### Client-Side WebSocket Implementation
```javascript
// /client/dashboardWebSocket.js
class DashboardWebSocket {
  constructor(token, options = {}) {
    this.token = token;
    this.options = {
      url: options.url || 'ws://localhost:3000',
      reconnectAttempts: options.reconnectAttempts || 5,
      reconnectDelay: options.reconnectDelay || 1000,
      ...options
    };
    
    this.socket = null;
    this.reconnectCount = 0;
    this.callbacks = new Map();
    
    this.connect();
  }

  connect() {
    this.socket = io(this.options.url, {
      auth: { token: this.token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Dashboard WebSocket connected');
      this.reconnectCount = 0;
      this.emit('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Dashboard WebSocket disconnected:', reason);
      this.emit('disconnected', reason);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.attemptReconnect();
      }
    });

    // Dashboard data handlers
    this.socket.on('dashboard:data', (data) => {
      this.emit('dashboardData', data);
    });

    this.socket.on('dashboard:update', (data) => {
      this.emit('dashboardUpdate', data);
    });

    this.socket.on('alert:new', (alert) => {
      this.emit('newAlert', alert);
    });

    this.socket.on('error', (error) => {
      console.error('Dashboard WebSocket error:', error);
      this.emit('error', error);
    });
  }

  subscribeToDashboard(portfolio, refreshInterval = 30000) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('subscribe:dashboard', { portfolio, refreshInterval });
    }
  }

  requestMetrics(metrics, portfolio) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('request:metrics', { metrics, portfolio });
    }
  }

  on(event, callback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set());
    }
    this.callbacks.get(event).add(callback);
  }

  off(event, callback) {
    if (this.callbacks.has(event)) {
      this.callbacks.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.callbacks.has(event)) {
      this.callbacks.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in callback for event ${event}:`, error);
        }
      });
    }
  }

  attemptReconnect() {
    if (this.reconnectCount < this.options.reconnectAttempts) {
      this.reconnectCount++;
      console.log(`Attempting reconnect ${this.reconnectCount}/${this.options.reconnectAttempts}`);
      
      setTimeout(() => {
        this.connect();
      }, this.options.reconnectDelay * this.reconnectCount);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('reconnectFailed');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Usage example
const dashboardSocket = new DashboardWebSocket(userToken, {
  url: 'wss://api.company.com',
  reconnectAttempts: 10,
  reconnectDelay: 2000
});

dashboardSocket.on('dashboardData', (data) => {
  updateDashboardUI(data);
});

dashboardSocket.on('newAlert', (alert) => {
  showNotification(alert);
});

dashboardSocket.subscribeToDashboard('Technology', 15000);
```

---

## 📊 Data Schemas

### Project Schema
```yaml
components:
  schemas:
    Project:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        projectManager:
          type: string
        startDate:
          type: string
          format: date
        endDate:
          type: string
          format: date
        status:
          type: string
          enum: [On Track, At Risk, Behind Schedule, Critical, Completed]
        priority:
          type: string
          enum: [Critical, High, Medium, Low]
        portfolio:
          type: string
        budget:
          type: number
          format: float
        actualCost:
          type: number
          format: float
        percentComplete:
          type: integer
          minimum: 0
          maximum: 100
        riskLevel:
          type: string
          enum: [Critical, High, Medium, Low]
        strategicGoalId:
          type: string
          format: uuid
        healthScore:
          type: number
          minimum: 0
          maximum: 100
        lastUpdated:
          type: string
          format: date-time
```

### Financial Summary Schema
```yaml
    FinancialSummary:
      type: object
      properties:
        totalBudget:
          type: number
          format: float
        totalActual:
          type: number
          format: float
        budgetVariance:
          type: number
          format: float
        budgetVariancePercent:
          type: number
          format: float
        weightedROI:
          type: number
          format: float
        portfolioNPV:
          type: number
          format: float
        costPerformanceIndex:
          type: number
          format: float
        forecastAccuracy:
          type: number
          format: float
          minimum: 0
          maximum: 100
```

---

## 🚀 Deployment Configuration

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000 3001

USER node

CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/dashboard
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=dashboard
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

**API Version**: 1.0  
**Last Updated**: August 3, 2025  
**Compatibility**: Node.js 18+, PostgreSQL 13+, Redis 6+  
**Created By**: Enterprise Executive Dashboard Suite - Issue #327
