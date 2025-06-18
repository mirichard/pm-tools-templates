#!/usr/bin/env node

/**
 * Basic AI Functionality Test Script
 * Quick validation of core AI features
 */

import { AIInsightsEngine } from '../src/services/AIInsightsEngine.js';
import { performance } from 'perf_hooks';

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function logSuccess(message) {
  log(COLORS.GREEN, `✅ ${message}`);
}

function logError(message) {
  log(COLORS.RED, `❌ ${message}`);
}

function logInfo(message) {
  log(COLORS.BLUE, `ℹ️  ${message}`);
}

function logWarning(message) {
  log(COLORS.YELLOW, `⚠️  ${message}`);
}

// Test data
const testProjects = {
  lowRisk: {
    id: 'test-low-risk',
    name: 'Simple Website Project',
    teamSize: 3,
    duration: 60,
    budget: 30000,
    complexity: 'low',
    methodology: 'agile',
    stakeholders: 2,
    requirements: 10,
    features: 5,
    teamExperience: 0.8,
    technologies: ['react', 'nodejs']
  },
  mediumRisk: {
    id: 'test-medium-risk',
    name: 'E-commerce Platform',
    teamSize: 8,
    duration: 90,
    budget: 100000,
    complexity: 'medium',
    methodology: 'agile',
    stakeholders: 6,
    requirements: 40,
    features: 20,
    teamExperience: 0.6,
    technologies: ['react', 'nodejs', 'postgresql']
  },
  highRisk: {
    id: 'test-high-risk',
    name: 'Enterprise System Migration',
    teamSize: 15,
    duration: 45,
    budget: 500000,
    complexity: 'high',
    methodology: 'waterfall',
    stakeholders: 25,
    requirements: 150,
    features: 80,
    teamExperience: 0.4,
    technologies: ['java', 'python', 'react', 'oracle', 'kubernetes']
  }
};

async function testAIEngine() {
  log(COLORS.BOLD, '\n🧠 AI-Powered Project Insights - Basic Functionality Test\n');

  try {
    // Initialize AI Engine
    logInfo('Initializing AI Engine...');
    const aiEngine = new AIInsightsEngine();
    await aiEngine.initialize();
    logSuccess('AI Engine initialized successfully');

    // Test each risk level
    for (const [riskType, project] of Object.entries(testProjects)) {
      log(COLORS.BOLD, `\n📊 Testing ${riskType.toUpperCase()} project: ${project.name}`);
      
      await testRiskPrediction(aiEngine, project, riskType);
      await testResourceOptimization(aiEngine, project);
      await testScheduleAnalysis(aiEngine, project);
      await testQualityPrediction(aiEngine, project);
    }

    // Test comprehensive insights
    log(COLORS.BOLD, '\n🔍 Testing Comprehensive Insights Generation');
    await testComprehensiveInsights(aiEngine, testProjects.mediumRisk);

    // Test performance
    log(COLORS.BOLD, '\n⚡ Testing Performance');
    await testPerformance(aiEngine, testProjects.mediumRisk);

    // Test edge cases
    log(COLORS.BOLD, '\n🎯 Testing Edge Cases');
    await testEdgeCases(aiEngine);

    // Cleanup
    logInfo('Shutting down AI Engine...');
    await aiEngine.shutdown();
    logSuccess('AI Engine shutdown complete');

    log(COLORS.BOLD, '\n🎉 All tests completed successfully!');

  } catch (error) {
    logError(`Test failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

async function testRiskPrediction(aiEngine, project, expectedRiskLevel) {
  try {
    logInfo(`Testing risk prediction for ${project.name}...`);
    
    const startTime = performance.now();
    const result = await aiEngine.predictRisk(project);
    const duration = performance.now() - startTime;

    // Validate result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Risk prediction returned invalid result');
    }

    if (!['low', 'medium', 'high', 'critical'].includes(result.riskLevel)) {
      throw new Error(`Invalid risk level: ${result.riskLevel}`);
    }

    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      throw new Error(`Invalid confidence score: ${result.confidence}`);
    }

    if (!Array.isArray(result.riskFactors)) {
      throw new Error('Risk factors should be an array');
    }

    logSuccess(`Risk Level: ${result.riskLevel} (Confidence: ${(result.confidence * 100).toFixed(1)}%)`);
    logSuccess(`Response time: ${duration.toFixed(2)}ms`);
    
    if (result.riskFactors.length > 0) {
      logInfo(`Key risk factors: ${result.riskFactors.slice(0, 3).join(', ')}`);
    }

    // Performance check
    if (duration > 3000) {
      logWarning(`Response time ${duration.toFixed(2)}ms exceeds 3s threshold`);
    }

  } catch (error) {
    logError(`Risk prediction test failed: ${error.message}`);
    throw error;
  }
}

async function testResourceOptimization(aiEngine, project) {
  try {
    logInfo('Testing resource optimization...');
    
    const startTime = performance.now();
    const result = await aiEngine.optimizeResources(project);
    const duration = performance.now() - startTime;

    // Validate result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Resource optimization returned invalid result');
    }

    if (typeof result.efficiency !== 'number') {
      throw new Error('Efficiency should be a number');
    }

    if (!Array.isArray(result.recommendations)) {
      throw new Error('Recommendations should be an array');
    }

    logSuccess(`Efficiency score: ${(result.efficiency * 100).toFixed(1)}%`);
    logSuccess(`Response time: ${duration.toFixed(2)}ms`);
    
    if (result.recommendations.length > 0) {
      logInfo(`Recommendations: ${result.recommendations.length} suggestions provided`);
    }

  } catch (error) {
    logError(`Resource optimization test failed: ${error.message}`);
    throw error;
  }
}

async function testScheduleAnalysis(aiEngine, project) {
  try {
    logInfo('Testing schedule analysis...');
    
    const startTime = performance.now();
    const result = await aiEngine.analyzeSchedule(project);
    const duration = performance.now() - startTime;

    // Validate result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Schedule analysis returned invalid result');
    }

    if (!Array.isArray(result.criticalPath)) {
      throw new Error('Critical path should be an array');
    }

    logSuccess(`Critical path: ${result.criticalPath.length} tasks identified`);
    logSuccess(`Response time: ${duration.toFixed(2)}ms`);

  } catch (error) {
    logError(`Schedule analysis test failed: ${error.message}`);
    throw error;
  }
}

async function testQualityPrediction(aiEngine, project) {
  try {
    logInfo('Testing quality prediction...');
    
    const startTime = performance.now();
    const result = await aiEngine.predictQuality(project);
    const duration = performance.now() - startTime;

    // Validate result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Quality prediction returned invalid result');
    }

    if (typeof result.testCoverage !== 'number') {
      throw new Error('Test coverage should be a number');
    }

    if (typeof result.defectRate !== 'number') {
      throw new Error('Defect rate should be a number');
    }

    logSuccess(`Test coverage: ${(result.testCoverage * 100).toFixed(1)}%`);
    logSuccess(`Defect rate: ${result.defectRate.toFixed(2)} bugs/kloc`);
    logSuccess(`Response time: ${duration.toFixed(2)}ms`);

  } catch (error) {
    logError(`Quality prediction test failed: ${error.message}`);
    throw error;
  }
}

async function testComprehensiveInsights(aiEngine, project) {
  try {
    logInfo('Testing comprehensive insights generation...');
    
    const startTime = performance.now();
    const result = await aiEngine.generateInsights(project);
    const duration = performance.now() - startTime;

    // Validate result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Comprehensive insights returned invalid result');
    }

    const requiredFields = ['insights', 'recommendations', 'summary', 'riskPrediction', 'resourceOptimization', 'scheduleAnalysis', 'qualityPrediction'];
    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(result.insights)) {
      throw new Error('Insights should be an array');
    }

    if (!Array.isArray(result.recommendations)) {
      throw new Error('Recommendations should be an array');
    }

    logSuccess(`Generated ${result.insights.length} insights`);
    logSuccess(`Generated ${result.recommendations.length} recommendations`);
    logSuccess(`Response time: ${duration.toFixed(2)}ms`);

    // Performance check for comprehensive analysis
    if (duration > 8000) {
      logWarning(`Comprehensive analysis time ${duration.toFixed(2)}ms exceeds 8s threshold`);
    }

  } catch (error) {
    logError(`Comprehensive insights test failed: ${error.message}`);
    throw error;
  }
}

async function testPerformance(aiEngine, project) {
  try {
    logInfo('Running performance tests...');
    
    const iterations = 5;
    const times = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      await aiEngine.predictRisk(project);
      const duration = performance.now() - startTime;
      times.push(duration);
    }

    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    logSuccess(`Average response time: ${avgTime.toFixed(2)}ms`);
    logSuccess(`Min response time: ${minTime.toFixed(2)}ms`);
    logSuccess(`Max response time: ${maxTime.toFixed(2)}ms`);

    if (avgTime > 3000) {
      logWarning('Average response time exceeds 3s threshold');
    }

    // Test concurrent requests
    logInfo('Testing concurrent requests...');
    const concurrentStart = performance.now();
    const promises = Array(5).fill().map(() => aiEngine.predictRisk({
      ...project,
      id: `concurrent-${Math.random()}`
    }));
    
    const results = await Promise.all(promises);
    const concurrentDuration = performance.now() - concurrentStart;

    logSuccess(`Concurrent requests (5): ${concurrentDuration.toFixed(2)}ms`);
    
    // Verify all results are valid
    const allValid = results.every(result => 
      result && 
      ['low', 'medium', 'high', 'critical'].includes(result.riskLevel) &&
      typeof result.confidence === 'number'
    );

    if (!allValid) {
      throw new Error('Some concurrent requests returned invalid results');
    }

    logSuccess('All concurrent requests returned valid results');

  } catch (error) {
    logError(`Performance test failed: ${error.message}`);
    throw error;
  }
}

async function testEdgeCases(aiEngine) {
  try {
    logInfo('Testing edge cases...');

    const edgeCases = [
      {
        name: 'Minimal project',
        project: {
          teamSize: 1,
          duration: 1,
          budget: 100,
          complexity: 'low',
          methodology: 'agile'
        }
      },
      {
        name: 'Large enterprise project',
        project: {
          teamSize: 100,
          duration: 1000,
          budget: 10000000,
          complexity: 'high',
          methodology: 'waterfall'
        }
      },
      {
        name: 'Zero budget project',
        project: {
          teamSize: 5,
          duration: 30,
          budget: 0,
          complexity: 'medium',
          methodology: 'agile'
        }
      },
      {
        name: 'Missing optional fields',
        project: {
          teamSize: 5,
          duration: 60,
          budget: 50000,
          complexity: 'medium',
          methodology: 'agile'
          // No stakeholders, requirements, features, etc.
        }
      }
    ];

    for (const { name, project } of edgeCases) {
      logInfo(`Testing: ${name}`);
      
      try {
        const result = await aiEngine.predictRisk(project);
        
        if (!result || !['low', 'medium', 'high', 'critical'].includes(result.riskLevel)) {
          throw new Error(`Invalid result for ${name}`);
        }
        
        logSuccess(`${name}: ${result.riskLevel} (${(result.confidence * 100).toFixed(1)}%)`);
        
      } catch (edgeError) {
        logError(`Edge case "${name}" failed: ${edgeError.message}`);
        throw edgeError;
      }
    }

    logSuccess('All edge cases handled successfully');

  } catch (error) {
    logError(`Edge case testing failed: ${error.message}`);
    throw error;
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAIEngine().catch(error => {
    logError(`Test execution failed: ${error.message}`);
    process.exit(1);
  });
}

export { testAIEngine };

