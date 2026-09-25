/**
 * AI Insights Engine
 * Core machine learning service for project insights
 */

import * as tf from '@tensorflow/tfjs';
import { logger } from '../utils/logger.js';
import { RiskPredictionModel } from '../ml/models/RiskPredictionModel.js';
import { ResourceOptimizationModel } from '../ml/models/ResourceOptimizationModel.js';
import { ScheduleIntelligenceModel } from '../ml/models/ScheduleIntelligenceModel.js';
import { QualityPredictionModel } from '../ml/models/QualityPredictionModel.js';
import { SentimentAnalyzer } from '../ml/SentimentAnalyzer.js';
import { PatternRecognition } from '../ml/PatternRecognition.js';
import { InsightsGenerator } from '../services/InsightsGenerator.js';

export class AIInsightsEngine {
  constructor() {
    this.models = {};
    this.isInitialized = false;
    this.cache = new Map();
    this.cacheVersion = 0;
    this.performance = {
      predictions: 0,
      totalTime: 0,
      avgTime: 0
    };
  }

  async initialize() {
    try {
      logger.info('🔧 Initializing AI Insights Engine...');
      
      // Set TensorFlow backend
      await tf.ready();
      logger.info(`🧠 TensorFlow backend: ${tf.getBackend()}`);

      // Initialize ML models
      await this.initializeModels();

      // Initialize supporting services
      this.sentimentAnalyzer = new SentimentAnalyzer();
      this.patternRecognition = new PatternRecognition();
      this.insightsGenerator = new InsightsGenerator();

      this.isInitialized = true;
      logger.info('✅ AI Insights Engine initialized successfully');

    } catch (error) {
      logger.error('❌ Failed to initialize AI Insights Engine:', error);
      throw error;
    }
  }

  async initializeModels() {
    logger.info('🤖 Loading ML models...');

    try {
      // Risk Prediction Model
      this.models.riskPrediction = new RiskPredictionModel();
      await this.models.riskPrediction.initialize();
      logger.modelLog('RiskPrediction', 'Loaded');

      // Resource Optimization Model
      this.models.resourceOptimization = new ResourceOptimizationModel();
      await this.models.resourceOptimization.initialize();
      logger.modelLog('ResourceOptimization', 'Loaded');

      // Schedule Intelligence Model
      this.models.scheduleIntelligence = new ScheduleIntelligenceModel();
      await this.models.scheduleIntelligence.initialize();
      logger.modelLog('ScheduleIntelligence', 'Loaded');

      // Quality Prediction Model
      this.models.qualityPrediction = new QualityPredictionModel();
      await this.models.qualityPrediction.initialize();
      logger.modelLog('QualityPrediction', 'Loaded');

    } catch (error) {
      logger.error('❌ Failed to load ML models:', error);
      throw error;
    }
  }

  /**
   * Risk Prediction
   * Predicts project risks using trained ML model
   */
  async predictRisk(projectData) {
    const startTime = Date.now();
    
    try {
      if (!this.isInitialized) {
        throw new Error('AI Engine not initialized');
      }

      // Generate cache key
      const cacheKey = `risk_${JSON.stringify(projectData)}`;
      // Time-sensitive evidence must be reassessed on every request.
      const cacheable = !projectData.planningAssessment;
      if (cacheable && this.cache.has(cacheKey)) {
        logger.debug('📋 Using cached risk prediction');
        return structuredClone(this.cache.get(cacheKey));
      }

      // Predict using ML model
      const cacheVersion = this.cacheVersion;
      const prediction = await this.models.riskPrediction.predict(projectData);
      
      // Cache result
      if (cacheable && cacheVersion === this.cacheVersion) {
        this.cache.set(cacheKey, structuredClone(prediction));
      }

      // Log performance
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics(duration);
      logger.predictionLog('RiskPrediction', projectData, prediction, prediction.confidence);

      return prediction;

    } catch (error) {
      logger.error('❌ Risk prediction failed:', error);
      throw error;
    }
  }

  /**
   * Resource Optimization
   * Optimizes resource allocation using ML algorithms
   */
  async optimizeResources(projectData) {
    const startTime = Date.now();
    
    try {
      if (!this.isInitialized) {
        throw new Error('AI Engine not initialized');
      }

      const optimization = await this.models.resourceOptimization.optimize(projectData);
      
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics(duration);
      logger.predictionLog('ResourceOptimization', projectData, optimization, optimization.confidence);

      return optimization;

    } catch (error) {
      logger.error('❌ Resource optimization failed:', error);
      throw error;
    }
  }

  /**
   * Schedule Intelligence
   * Analyzes and optimizes project schedules
   */
  async analyzeSchedule(projectData) {
    const startTime = Date.now();
    
    try {
      if (!this.isInitialized) {
        throw new Error('AI Engine not initialized');
      }

      const analysis = await this.models.scheduleIntelligence.analyze(projectData);
      
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics(duration);
      logger.predictionLog('ScheduleIntelligence', projectData, analysis, analysis.confidence);

      return analysis;

    } catch (error) {
      logger.error('❌ Schedule analysis failed:', error);
      throw error;
    }
  }

  /**
   * Quality Prediction
   * Predicts quality metrics for the project
   */
  async predictQuality(projectData) {
    const startTime = Date.now();
    
    try {
      if (!this.isInitialized) {
        throw new Error('AI Engine not initialized');
      }

      const prediction = await this.models.qualityPrediction.predict(projectData);
      
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics(duration);
      logger.predictionLog('QualityPrediction', projectData, prediction, prediction.confidence);

      return prediction;

    } catch (error) {
      logger.error('❌ Quality prediction failed:', error);
      throw error;
    }
  }

  /**
   * Sentiment Analysis
   * Analyzes stakeholder sentiment from communications
   */
  async analyzeSentiment(textData) {
    try {
      return await this.sentimentAnalyzer.analyze(textData);
    } catch (error) {
      logger.error('❌ Sentiment analysis failed:', error);
      throw error;
    }
  }

  /**
   * Pattern Recognition
   * Identifies patterns from historical project data
   */
  async recognizePatterns(historicalData) {
    try {
      return await this.patternRecognition.analyze(historicalData);
    } catch (error) {
      logger.error('❌ Pattern recognition failed:', error);
      throw error;
    }
  }

  /**
   * Generate Comprehensive Insights
   * Combines all AI models to generate comprehensive project insights
   */
  async generateInsights(projectData) {
    const startTime = Date.now();
    
    try {
      logger.info('🧠 Generating comprehensive AI insights...');

      // Run all predictions in parallel
      const [
        riskPrediction,
        resourceOptimization, 
        scheduleAnalysis,
        qualityPrediction
      ] = await Promise.all([
        this.predictRisk(projectData),
        this.optimizeResources(projectData),
        this.analyzeSchedule(projectData),
        this.predictQuality(projectData)
      ]);

      // Generate comprehensive insights
      const insights = await this.insightsGenerator.generate({
        projectData,
        riskPrediction,
        resourceOptimization,
        scheduleAnalysis,
        qualityPrediction
      });

      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics(duration);
      logger.performanceLog('GenerateInsights', duration, { 
        insights: insights.insights.length,
        recommendations: insights.recommendations.length 
      });

      return insights;

    } catch (error) {
      logger.error('❌ Insights generation failed:', error);
      throw error;
    }
  }

  /**
   * Performance Metrics
   */
  updatePerformanceMetrics(duration) {
    this.performance.predictions++;
    this.performance.totalTime += duration;
    this.performance.avgTime = this.performance.totalTime / this.performance.predictions;
  }

  getPerformanceMetrics() {
    return {
      ...this.performance,
      cacheSize: this.cache.size,
      modelsLoaded: Object.keys(this.models).length
    };
  }

  /**
   * Cache Management
   */
  clearCache() {
    this.cacheVersion++;
    this.cache.clear();
    logger.info('🗑️ Cache cleared');
  }

  /**
   * Shutdown
   */
  async shutdown() {
    logger.info('🔄 Shutting down AI Insights Engine...');
    
    // Clear cache
    this.clearCache();
    
    // Dispose TensorFlow resources
    for (const model of Object.values(this.models)) {
      model.dispose?.();
    }
    this.models = {};
    
    // Log final performance metrics
    logger.info('📊 Final Performance Metrics:', this.getPerformanceMetrics());
    
    this.isInitialized = false;
    logger.info('✅ AI Insights Engine shutdown complete');
  }
}

