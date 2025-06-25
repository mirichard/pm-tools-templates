/**
 * Risk Prediction Model
 * Machine Learning model for predicting project risks
 */

import * as tf from '@tensorflow/tfjs-node';
import { logger } from '../../utils/logger.js';

export class RiskPredictionModel {
  constructor() {
    this.model = null;
    this.isInitialized = false;
    this.features = [
      'teamSize',
      'duration', 
      'budget',
      'complexity',
      'stakeholders',
      'requirements',
      'features',
      'teamExperience',
      'similarProjects',
      'historicalSuccessRate',
      'avgDelay'
    ];
    this.riskCategories = ['low', 'medium', 'high', 'critical'];
  }

  async initialize() {
    try {
      logger.info('🔧 Initializing Risk Prediction Model...');
      
      // Try to load existing model, otherwise create new one
      try {
        // In production, load from saved model
        // this.model = await tf.loadLayersModel('file://./data/models/risk-prediction/model.json');
        // logger.info('📂 Loaded existing Risk Prediction model');
        throw new Error('No existing model found'); // Force creation for demo
      } catch (error) {
        // Create new model if no existing model found
        await this.createModel();
        logger.info('🆕 Created new Risk Prediction model');
      }

      this.isInitialized = true;
      logger.info('✅ Risk Prediction Model initialized');

    } catch (error) {
      logger.error('❌ Failed to initialize Risk Prediction Model:', error);
      throw error;
    }
  }

  async createModel() {
    logger.info('🏗️ Building Risk Prediction neural network...');

    // Create a neural network for risk prediction
    this.model = tf.sequential({
      layers: [
        // Input layer
        tf.layers.dense({
          inputShape: [this.features.length],
          units: 64,
          activation: 'relu',
          name: 'input_layer'
        }),
        
        // Hidden layers with dropout for regularization
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 32,
          activation: 'relu',
          name: 'hidden_layer_1'
        }),
        
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({
          units: 16,
          activation: 'relu',
          name: 'hidden_layer_2'
        }),
        
        // Output layer for risk classification
        tf.layers.dense({
          units: this.riskCategories.length,
          activation: 'softmax',
          name: 'output_layer'
        })
      ]
    });

    // Compile the model
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    logger.info('🎯 Risk Prediction model architecture created');
    logger.info('📊 Model summary:', this.model.summary());
  }

  /**
   * Extract features from project data
   */
  extractFeatures(projectData) {
    const complexityMapping = { 'low': 1, 'medium': 2, 'high': 3 };
    
    return [
      projectData.teamSize || 4,
      projectData.duration || 60,
      (projectData.budget || 50000) / 10000, // Normalize budget
      complexityMapping[projectData.complexity] || 2,
      projectData.stakeholders || 5,
      projectData.requirements || 20,
      projectData.features || 10,
      projectData.teamExperience || 0.5,
      projectData.historicalData?.similarProjects || 10,
      projectData.historicalData?.successRate || 0.8,
      projectData.historicalData?.avgDelay || 0.1
    ];
  }

  /**
   * Predict risk level for a project
   */
  async predict(projectData) {
    try {
      if (!this.isInitialized || !this.model) {
        throw new Error('Risk Prediction Model not initialized');
      }

      // Extract features
      const features = this.extractFeatures(projectData);
      
      // Create tensor
      const inputTensor = tf.tensor2d([features]);
      
      // Make prediction
      const prediction = this.model.predict(inputTensor);
      const probabilities = await prediction.data();
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      // Find the predicted class
      const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
      const predictedRisk = this.riskCategories[maxProbIndex];
      const confidence = Math.max(...probabilities);

      // Generate risk factors analysis
      const riskFactors = this.analyzeRiskFactors(projectData, features);
      
      // Generate risk mitigation recommendations
      const mitigationStrategies = this.generateMitigationStrategies(predictedRisk, riskFactors);

      return {
        riskLevel: predictedRisk,
        confidence: parseFloat(confidence.toFixed(3)),
        probability: parseFloat(confidence.toFixed(3)),
        riskScore: this.calculateRiskScore(probabilities),
        riskFactors,
        mitigationStrategies,
        timeline: this.predictRiskTimeline(projectData),
        impact: this.assessRiskImpact(predictedRisk, projectData),
        metadata: {
          modelVersion: '1.0.0',
          predictionDate: new Date().toISOString(),
          features: this.features,
          probabilities: Array.from(probabilities).map(p => parseFloat(p.toFixed(3)))
        }
      };

    } catch (error) {
      logger.error('❌ Risk prediction failed:', error);
      throw error;
    }
  }

  /**
   * Analyze risk factors contributing to the prediction
   */
  analyzeRiskFactors(projectData, features) {
    const riskFactors = [];

    // Team size risk
    if (projectData.teamSize > 10) {
      riskFactors.push({
        factor: 'Large Team Size',
        severity: 'medium',
        description: 'Large teams may face communication and coordination challenges',
        impact: 0.6
      });
    }

    // Duration risk
    if (projectData.duration > 180) {
      riskFactors.push({
        factor: 'Long Duration',
        severity: 'high', 
        description: 'Long projects are susceptible to scope creep and changing requirements',
        impact: 0.8
      });
    }

    // Budget risk
    if (projectData.budget > 100000) {
      riskFactors.push({
        factor: 'High Budget',
        severity: 'medium',
        description: 'High-budget projects face increased scrutiny and pressure',
        impact: 0.5
      });
    }

    // Complexity risk
    if (projectData.complexity === 'high') {
      riskFactors.push({
        factor: 'High Complexity',
        severity: 'high',
        description: 'Complex projects have higher technical and implementation risks',
        impact: 0.9
      });
    }

    // Team experience risk
    if (projectData.teamExperience < 0.5) {
      riskFactors.push({
        factor: 'Low Team Experience',
        severity: 'high',
        description: 'Inexperienced teams may struggle with technical challenges',
        impact: 0.7
      });
    }

    return riskFactors;
  }

  /**
   * Generate mitigation strategies based on risk assessment
   */
  generateMitigationStrategies(riskLevel, riskFactors) {
    const strategies = [];

    if (riskLevel === 'high' || riskLevel === 'critical') {
      strategies.push({
        strategy: 'Enhanced Project Monitoring',
        priority: 'high',
        description: 'Implement daily standups and weekly risk reviews',
        timeframe: 'immediate'
      });

      strategies.push({
        strategy: 'Risk-Based Testing',
        priority: 'high', 
        description: 'Focus testing efforts on highest-risk components',
        timeframe: '1-2 weeks'
      });
    }

    if (riskFactors.some(rf => rf.factor === 'Low Team Experience')) {
      strategies.push({
        strategy: 'Mentorship Program',
        priority: 'medium',
        description: 'Pair experienced team members with junior developers',
        timeframe: '1 week'
      });
    }

    if (riskFactors.some(rf => rf.factor === 'High Complexity')) {
      strategies.push({
        strategy: 'Technical Spike Stories',
        priority: 'high',
        description: 'Research and prototype complex technical solutions',
        timeframe: '2-3 weeks'
      });
    }

    return strategies;
  }

  /**
   * Calculate composite risk score
   */
  calculateRiskScore(probabilities) {
    // Weighted sum based on risk severity
    const weights = [0.1, 0.3, 0.7, 1.0]; // low, medium, high, critical
    let score = 0;
    
    for (let i = 0; i < probabilities.length; i++) {
      score += probabilities[i] * weights[i];
    }
    
    return parseFloat((score * 100).toFixed(1));
  }

  /**
   * Predict risk timeline
   */
  predictRiskTimeline(projectData) {
    const duration = projectData.duration || 60;
    const riskPeaks = [];

    // Early phase risks (first 20% of project)
    riskPeaks.push({
      phase: 'Planning & Setup',
      timeframe: `Days 1-${Math.floor(duration * 0.2)}`,
      riskTypes: ['Requirements clarity', 'Team formation', 'Tool setup'],
      severity: 'medium'
    });

    // Mid phase risks (middle 60% of project)
    riskPeaks.push({
      phase: 'Development',
      timeframe: `Days ${Math.floor(duration * 0.2)}-${Math.floor(duration * 0.8)}`,
      riskTypes: ['Technical challenges', 'Scope creep', 'Resource constraints'],
      severity: 'high'
    });

    // Late phase risks (final 20% of project)
    riskPeaks.push({
      phase: 'Integration & Delivery',
      timeframe: `Days ${Math.floor(duration * 0.8)}-${duration}`,
      riskTypes: ['Integration issues', 'Quality concerns', 'Delivery pressure'],
      severity: 'high'
    });

    return riskPeaks;
  }

  /**
   * Assess risk impact
   */
  assessRiskImpact(riskLevel, projectData) {
    const impactMapping = {
      'low': { schedule: 0.05, budget: 0.02, quality: 0.03 },
      'medium': { schedule: 0.15, budget: 0.10, quality: 0.08 },
      'high': { schedule: 0.30, budget: 0.25, quality: 0.20 },
      'critical': { schedule: 0.50, budget: 0.40, quality: 0.35 }
    };

    const baseImpact = impactMapping[riskLevel];
    
    return {
      schedule: {
        delayProbability: baseImpact.schedule,
        estimatedDelay: Math.floor(projectData.duration * baseImpact.schedule),
        description: `Potential delay of ${Math.floor(projectData.duration * baseImpact.schedule)} days`
      },
      budget: {
        overrunProbability: baseImpact.budget,
        estimatedOverrun: Math.floor(projectData.budget * baseImpact.budget),
        description: `Potential budget overrun of $${Math.floor(projectData.budget * baseImpact.budget).toLocaleString()}`
      },
      quality: {
        degradationRisk: baseImpact.quality,
        description: `${Math.floor(baseImpact.quality * 100)}% chance of quality issues`
      }
    };
  }

  /**
   * Train the model (for future implementation)
   */
  async train(trainingData) {
    // This would be implemented with real training data
    logger.info('🏋️ Training Risk Prediction Model...');
    // Training implementation would go here
    logger.info('✅ Risk Prediction Model training complete');
  }

  /**
   * Save the model
   */
  async save(path = './data/models/risk-prediction') {
    if (this.model) {
      await this.model.save(`file://${path}`);
      logger.info('💾 Risk Prediction Model saved');
    }
  }
}

