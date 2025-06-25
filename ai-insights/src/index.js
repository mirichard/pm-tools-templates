/**
 * AI-Powered Project Insights
 * Main Entry Point
 */

import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { AIInsightsEngine } from './services/AIInsightsEngine.js';
import { DataGenerator } from './data/generator.js';

// Load environment configuration
dotenv.config();

class Application {
  constructor() {
    this.aiEngine = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      logger.info('🚀 Initializing AI-Powered Project Insights System...');

      // Initialize AI Engine
      this.aiEngine = new AIInsightsEngine();
      await this.aiEngine.initialize();

      // Generate sample data if needed
      if (process.env.NODE_ENV === 'development') {
        logger.info('📊 Generating sample training data...');
        const dataGenerator = new DataGenerator();
        await dataGenerator.generateTrainingData();
      }

      this.isInitialized = true;
      logger.info('✅ AI Insights System initialized successfully');

      // Start demonstration
      await this.runDemo();

    } catch (error) {
      logger.error('❌ Failed to initialize AI Insights System:', error);
      process.exit(1);
    }
  }

  async runDemo() {
    if (!this.isInitialized) {
      throw new Error('System not initialized');
    }

    logger.info('🎯 Running AI Insights Demo...');

    // Demo project data
    const sampleProject = {
      id: 'proj-001',
      name: 'Dashboard MVP',
      phase: 'development',
      teamSize: 4,
      duration: 60, // days
      budget: 50000,
      complexity: 'medium',
      methodology: 'agile',
      stakeholders: 8,
      requirements: 45,
      features: 12,
      riskFactors: ['timeline', 'scope', 'technical'],
      teamExperience: 0.8,
      technologies: ['react', 'typescript', 'nodejs'],
      historicalData: {
        similarProjects: 15,
        successRate: 0.87,
        avgDelay: 0.12
      }
    };

    try {
      // Risk Prediction
      logger.info('🔍 Generating Risk Prediction...');
      const riskPrediction = await this.aiEngine.predictRisk(sampleProject);
      logger.info('Risk Analysis:', riskPrediction);

      // Resource Optimization
      logger.info('⚡ Optimizing Resource Allocation...');
      const resourceOptimization = await this.aiEngine.optimizeResources(sampleProject);
      logger.info('Resource Optimization:', resourceOptimization);

      // Schedule Intelligence
      logger.info('📅 Analyzing Schedule Optimization...');
      const scheduleAnalysis = await this.aiEngine.analyzeSchedule(sampleProject);
      logger.info('Schedule Analysis:', scheduleAnalysis);

      // Quality Prediction
      logger.info('🎯 Predicting Quality Metrics...');
      const qualityPrediction = await this.aiEngine.predictQuality(sampleProject);
      logger.info('Quality Prediction:', qualityPrediction);

      // Generate Comprehensive Insights
      logger.info('🧠 Generating AI-Powered Insights...');
      const insights = await this.aiEngine.generateInsights(sampleProject);
      logger.info('AI Insights:', insights);

      logger.info('✅ Demo completed successfully!');

    } catch (error) {
      logger.error('❌ Demo failed:', error);
    }
  }

  async shutdown() {
    logger.info('🔄 Shutting down AI Insights System...');
    if (this.aiEngine) {
      await this.aiEngine.shutdown();
    }
    logger.info('👋 AI Insights System shutdown complete');
  }
}

// Application startup
const app = new Application();

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  logger.info('\\nReceived SIGINT, shutting down gracefully...');
  await app.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('\\nReceived SIGTERM, shutting down gracefully...');
  await app.shutdown();
  process.exit(0);
});

// Start the application
app.initialize().catch((error) => {
  logger.error('Fatal error during startup:', error);
  process.exit(1);
});

export default app;

