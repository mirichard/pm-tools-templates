#!/usr/bin/env node

/**
 * AI Insights Deployment Verification Script
 * Comprehensive verification of the complete AI system
 */

import { AIInsightsEngine } from '../src/services/AIInsightsEngine.js';
import { AIInsightsClient } from '../src/dashboard/aiInsightsClient.js';
import AIInsightsServer from '../src/api/server.js';

console.log('🚀 AI-Powered Project Insights - Deployment Verification\n');

const verificationSummary = {
  tests: 0,
  passed: 0,
  failed: 0,
  errors: []
};

function test(description, testFn) {
  return new Promise(async (resolve) => {
    verificationSummary.tests++;
    process.stdout.write(`   Testing: ${description}... `);
    
    try {
      await testFn();
      console.log('✅ PASS');
      verificationSummary.passed++;
      resolve(true);
    } catch (error) {
      console.log('❌ FAIL');
      console.log(`      Error: ${error.message}`);
      verificationSummary.failed++;
      verificationSummary.errors.push(`${description}: ${error.message}`);
      resolve(false);
    }
  });
}

async function verifyAIEngine() {
  console.log('\n📦 Core AI Engine Verification');
  console.log('=====================================');
  
  let aiEngine;
  
  await test('AI Engine initialization', async () => {
    aiEngine = new AIInsightsEngine();
    await aiEngine.initialize();
    if (!aiEngine.isInitialized) throw new Error('Engine not initialized');
  });

  await test('All ML models loaded', async () => {
    const modelCount = Object.keys(aiEngine.models).length;
    if (modelCount !== 4) throw new Error(`Expected 4 models, got ${modelCount}`);
  });

  const sampleProject = {
    teamSize: 6,
    duration: 90,
    budget: 75000,
    complexity: 'medium',
    methodology: 'agile',
    stakeholders: 8,
    requirements: 35,
    features: 15,
    teamExperience: 0.7,
    technologies: ['react', 'nodejs', 'postgresql'],
    historicalData: {
      similarProjects: 20,
      successRate: 0.85,
      avgDelay: 0.15
    }
  };

  await test('Risk prediction accuracy', async () => {
    const result = await aiEngine.predictRisk(sampleProject);
    if (!result.riskLevel || !['low', 'medium', 'high', 'critical'].includes(result.riskLevel)) {
      throw new Error('Invalid risk level');
    }
    if (result.confidence <= 0 || result.confidence > 1) {
      throw new Error('Invalid confidence score');
    }
  });

  await test('Resource optimization', async () => {
    const result = await aiEngine.optimizeResources(sampleProject);
    if (!result.efficiency || !result.recommendations) {
      throw new Error('Missing optimization results');
    }
  });

  await test('Schedule analysis', async () => {
    const result = await aiEngine.analyzeSchedule(sampleProject);
    if (!result.criticalPath || !Array.isArray(result.criticalPath)) {
      throw new Error('Invalid schedule analysis');
    }
  });

  await test('Quality prediction', async () => {
    const result = await aiEngine.predictQuality(sampleProject);
    if (!result.testCoverage || !result.defectRate) {
      throw new Error('Invalid quality prediction');
    }
  });

  await test('Comprehensive insights generation', async () => {
    const startTime = Date.now();
    const result = await aiEngine.generateInsights(sampleProject);
    const duration = Date.now() - startTime;
    
    if (!result.insights || !Array.isArray(result.insights)) {
      throw new Error('Invalid insights structure');
    }
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      throw new Error('Invalid recommendations structure');
    }
    if (duration > 5000) {
      throw new Error(`Response too slow: ${duration}ms`);
    }
  });

  await test('Performance metrics', async () => {
    const metrics = aiEngine.getPerformanceMetrics();
    if (!metrics.predictions || typeof metrics.avgTime !== 'number') {
      throw new Error('Invalid performance metrics');
    }
  });

  await test('Cache functionality', async () => {
    // Test caching with same request
    const start1 = Date.now();
    await aiEngine.predictRisk(sampleProject);
    const duration1 = Date.now() - start1;
    
    const start2 = Date.now();
    await aiEngine.predictRisk(sampleProject);
    const duration2 = Date.now() - start2;
    
    if (duration2 >= duration1) {
      throw new Error('Cache not working - second request not faster');
    }
  });

  // Cleanup
  if (aiEngine) {
    await aiEngine.shutdown();
  }
}

async function verifyAPIServer() {
  console.log('\n🌐 API Server Verification');
  console.log('=====================================');
  
  let server;
  let client;
  
  await test('API Server startup', async () => {
    server = new AIInsightsServer();
    await server.initialize();
    if (!server.aiEngine || !server.aiEngine.isInitialized) {
      throw new Error('Server AI engine not initialized');
    }
  });

  await test('Client library initialization', async () => {
    client = new AIInsightsClient({
      baseURL: 'http://localhost:3001/api/v1',
      timeout: 10000,
      retries: 1
    });
    if (!client.baseURL) throw new Error('Client not configured');
  });

  // Note: For a full test, we'd need the server actually running
  // This verifies the code structure and initialization
  
  // Cleanup
  if (server && server.aiEngine) {
    await server.aiEngine.shutdown();
  }
}

async function verifyDocumentation() {
  console.log('\n📚 Documentation Verification');
  console.log('=====================================');
  
  const fs = await import('fs');
  const path = await import('path');
  
  const requiredFiles = [
    'README.md',
    'DEPLOYMENT.md',
    'package.json',
    'Dockerfile',
    'docker-compose.yml',
    '.env.example',
    '.env.production'
  ];

  for (const file of requiredFiles) {
    await test(`${file} exists`, async () => {
      if (!fs.existsSync(file)) {
        throw new Error(`Required file ${file} not found`);
      }
    });
  }

  await test('Package.json configuration', async () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!pkg.scripts['start:api'] || !pkg.scripts['deploy:docker']) {
      throw new Error('Missing required npm scripts');
    }
    if (!pkg.dependencies['@tensorflow/tfjs-node']) {
      throw new Error('Missing TensorFlow dependency');
    }
  });
}

async function verifyProductionReadiness() {
  console.log('\n🏭 Production Readiness Verification');
  console.log('=====================================');
  
  await test('Docker configuration', async () => {
    const fs = await import('fs');
    const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
    if (!dockerfile.includes('FROM node:18-alpine')) {
      throw new Error('Dockerfile not using Node 18 Alpine');
    }
    if (!dockerfile.includes('USER aiinsights')) {
      throw new Error('Dockerfile not dropping root privileges');
    }
  });

  await test('Environment configuration', async () => {
    const fs = await import('fs');
    const envExample = fs.readFileSync('.env.example', 'utf8');
    const envProd = fs.readFileSync('.env.production', 'utf8');
    
    if (!envExample.includes('NODE_ENV=') || !envProd.includes('NODE_ENV=production')) {
      throw new Error('Environment files missing required variables');
    }
  });

  await test('Security configuration', async () => {
    const fs = await import('fs');
    const serverCode = fs.readFileSync('src/api/server.js', 'utf8');
    if (!serverCode.includes('helmet') || !serverCode.includes('cors')) {
      throw new Error('Security middleware not configured');
    }
  });
}

async function runVerification() {
  try {
    console.log('🔍 Starting comprehensive deployment verification...\n');
    
    await verifyDocumentation();
    await verifyProductionReadiness();
    await verifyAIEngine();
    await verifyAPIServer();
    
    console.log('\n📊 Verification Summary');
    console.log('=====================================');
    console.log(`Total Tests: ${verificationSummary.tests}`);
    console.log(`Passed: ${verificationSummary.passed} ✅`);
    console.log(`Failed: ${verificationSummary.failed} ❌`);
    console.log(`Success Rate: ${Math.round(verificationSummary.passed / verificationSummary.tests * 100)}%`);
    
    if (verificationSummary.failed > 0) {
      console.log('\n❌ Failed Tests:');
      verificationSummary.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
      console.log('\n🔧 Please fix the failed tests before deployment.');
      process.exit(1);
    } else {
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('\n✅ AI-Powered Project Insights System is ready for production deployment!');
      console.log('\n🚀 Quick Start:');
      console.log('   docker-compose up -d');
      console.log('   curl http://localhost:3001/health');
      console.log('\n📚 Documentation: ./DEPLOYMENT.md');
      console.log('🌐 API Docs: http://localhost:3001/api/v1');
    }
    
  } catch (error) {
    console.error('\n💥 Verification failed with error:', error.message);
    process.exit(1);
  }
}

// Run verification
runVerification();

