/**
 * AI Insights API Server
 * RESTful API for AI-Powered Project Insights
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from '../utils/logger.js';
import { AIInsightsEngine } from '../services/AIInsightsEngine.js';
import { validateProjectData } from '../utils/validation.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { apiMetrics } from '../middleware/metrics.js';

dotenv.config();

class AIInsightsServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.aiEngine = null;
    this.server = null;
  }

  async initialize() {
    try {
      logger.info('🚀 Initializing AI Insights API Server...');

      // Initialize AI Engine
      this.aiEngine = new AIInsightsEngine();
      await this.aiEngine.initialize();

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup error handling
      this.setupErrorHandling();

      logger.info('✅ AI Insights API Server initialized');
    } catch (error) {
      logger.error('❌ Failed to initialize API server:', error);
      throw error;
    }
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    }));

    // Compression
    this.app.use(compression());

    // Request logging
    this.app.use(morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) }
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Rate limiting
    this.app.use('/api/', rateLimiter);

    // API metrics
    this.app.use('/api/', apiMetrics);
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        aiEngine: this.aiEngine ? 'initialized' : 'not_initialized'
      });
    });

    // API routes
    this.app.use('/api/v1', this.createAPIRoutes());

    // Documentation
    this.app.get('/', (req, res) => {
      res.json({
        service: 'AI-Powered Project Insights',
        version: '1.0.0',
        documentation: '/api/v1/docs',
        endpoints: {
          insights: 'POST /api/v1/insights/analyze',
          risk: 'POST /api/v1/risk/predict',
          resources: 'POST /api/v1/resources/optimize',
          schedule: 'POST /api/v1/schedule/analyze',
          quality: 'POST /api/v1/quality/predict',
          sentiment: 'POST /api/v1/sentiment/analyze',
          patterns: 'POST /api/v1/patterns/recognize',
          performance: 'GET /api/v1/performance/metrics'
        }
      });
    });
  }

  createAPIRoutes() {
    const router = express.Router();

    // Comprehensive Insights Analysis
    router.post('/insights/analyze', validateProjectData, async (req, res, next) => {
      try {
        const startTime = Date.now();
        const insights = await this.aiEngine.generateInsights(req.body);
        
        res.json({
          success: true,
          data: insights,
          performance: {
            duration: Date.now() - startTime,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        next(error);
      }
    });

    // Risk Prediction
    router.post('/risk/predict', validateProjectData, async (req, res, next) => {
      try {
        const riskPrediction = await this.aiEngine.predictRisk(req.body);
        res.json({
          success: true,
          data: riskPrediction
        });
      } catch (error) {
        next(error);
      }
    });

    // Resource Optimization
    router.post('/resources/optimize', validateProjectData, async (req, res, next) => {
      try {
        const optimization = await this.aiEngine.optimizeResources(req.body);
        res.json({
          success: true,
          data: optimization
        });
      } catch (error) {
        next(error);
      }
    });

    // Schedule Intelligence
    router.post('/schedule/analyze', validateProjectData, async (req, res, next) => {
      try {
        const analysis = await this.aiEngine.analyzeSchedule(req.body);
        res.json({
          success: true,
          data: analysis
        });
      } catch (error) {
        next(error);
      }
    });

    // Quality Prediction
    router.post('/quality/predict', validateProjectData, async (req, res, next) => {
      try {
        const prediction = await this.aiEngine.predictQuality(req.body);
        res.json({
          success: true,
          data: prediction
        });
      } catch (error) {
        next(error);
      }
    });

    // Sentiment Analysis
    router.post('/sentiment/analyze', async (req, res, next) => {
      try {
        const { text } = req.body;
        if (!text) {
          return res.status(400).json({
            success: false,
            error: 'Text data required for sentiment analysis'
          });
        }

        const sentiment = await this.aiEngine.analyzeSentiment(text);
        res.json({
          success: true,
          data: sentiment
        });
      } catch (error) {
        next(error);
      }
    });

    // Pattern Recognition
    router.post('/patterns/recognize', async (req, res, next) => {
      try {
        const { historicalData } = req.body;
        if (!historicalData) {
          return res.status(400).json({
            success: false,
            error: 'Historical data required for pattern recognition'
          });
        }

        const patterns = await this.aiEngine.recognizePatterns(historicalData);
        res.json({
          success: true,
          data: patterns
        });
      } catch (error) {
        next(error);
      }
    });

    // Performance Metrics
    router.get('/performance/metrics', (req, res) => {
      const metrics = this.aiEngine.getPerformanceMetrics();
      res.json({
        success: true,
        data: metrics
      });
    });

    // Batch Analysis
    router.post('/insights/batch', async (req, res, next) => {
      try {
        const { projects } = req.body;
        if (!Array.isArray(projects)) {
          return res.status(400).json({
            success: false,
            error: 'Projects array required for batch analysis'
          });
        }

        const results = await Promise.all(
          projects.map(async (project, index) => {
            try {
              const insights = await this.aiEngine.generateInsights(project);
              return { index, success: true, data: insights };
            } catch (error) {
              return { index, success: false, error: error.message };
            }
          })
        );

        res.json({
          success: true,
          data: {
            total: projects.length,
            processed: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length,
            results
          }
        });
      } catch (error) {
        next(error);
      }
    });

    // Cache Management
    router.delete('/cache', (req, res) => {
      this.aiEngine.clearCache();
      res.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    });

    return router;
  }

  setupErrorHandling() {
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.originalUrl
      });
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  async start() {
    try {
      await this.initialize();

      this.server = this.app.listen(this.port, () => {
        logger.info(`🚀 AI Insights API Server running on port ${this.port}`);
        logger.info(`📊 Health check: http://localhost:${this.port}/health`);
        logger.info(`📚 API Documentation: http://localhost:${this.port}/api/v1/docs`);
      });

      // Graceful shutdown
      process.on('SIGTERM', () => this.shutdown());
      process.on('SIGINT', () => this.shutdown());

    } catch (error) {
      logger.error('❌ Failed to start API server:', error);
      throw error;
    }
  }

  async shutdown() {
    logger.info('🔄 Shutting down AI Insights API Server...');

    if (this.server) {
      this.server.close(() => {
        logger.info('🛑 HTTP server closed');
      });
    }

    if (this.aiEngine) {
      await this.aiEngine.shutdown();
    }

    logger.info('✅ AI Insights API Server shutdown complete');
    process.exit(0);
  }
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new AIInsightsServer();
  server.start().catch((error) => {
    logger.error('Fatal server error:', error);
    process.exit(1);
  });
}

export default AIInsightsServer;

