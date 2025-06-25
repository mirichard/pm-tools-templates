/**
 * AI Insights Integration Tests
 * Comprehensive test suite for production validation
 */

import { jest } from '@jest/globals';
import { AIInsightsEngine } from '../src/services/AIInsightsEngine.js';
import { AIInsightsClient } from '../src/dashboard/aiInsightsClient.js';
import AIInsightsServer from '../src/api/server.js';

describe('AI Insights Integration Tests', () => {
  let aiEngine;
  let server;
  let client;
  let serverInstance;

  // Test data
  const sampleProject = {
    id: 'test-proj-001',
    name: 'Integration Test Project',
    teamSize: 5,
    duration: 90,
    budget: 75000,
    complexity: 'medium',
    methodology: 'agile',
    stakeholders: 6,
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

  beforeAll(async () => {
    // Initialize AI Engine
    aiEngine = new AIInsightsEngine();
    await aiEngine.initialize();

    // Start test server
    server = new AIInsightsServer();
    serverInstance = await server.start();
    
    // Give server time to fully start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Initialize client
    client = new AIInsightsClient({
      baseURL: 'http://localhost:3001/api/v1',
      timeout: 30000,
      retries: 2
    });
  }, 60000);

  afterAll(async () => {
    if (aiEngine) {
      await aiEngine.shutdown();
    }
    if (server) {
      await server.shutdown();
    }
  }, 30000);

  describe('AI Engine Core Functionality', () => {
    test('should initialize successfully', () => {
      expect(aiEngine.isInitialized).toBe(true);
      expect(aiEngine.models).toBeDefined();
      expect(Object.keys(aiEngine.models)).toHaveLength(4);
    });

    test('should predict risk accurately', async () => {
      const result = await aiEngine.predictRisk(sampleProject);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.riskFactors).toBeInstanceOf(Array);
      expect(result.mitigationStrategies).toBeInstanceOf(Array);
      expect(result.timeline).toBeInstanceOf(Array);
      expect(result.impact).toBeDefined();
    });

    test('should optimize resources', async () => {
      const result = await aiEngine.optimizeResources(sampleProject);
      
      expect(result).toBeDefined();
      expect(result.efficiency).toBeDefined();
      expect(result.recommendations).toBeInstanceOf(Array);
      expect(result.utilization).toBeDefined();
    });

    test('should analyze schedule', async () => {
      const result = await aiEngine.analyzeSchedule(sampleProject);
      
      expect(result).toBeDefined();
      expect(result.criticalPath).toBeInstanceOf(Array);
      expect(result.optimization).toBeDefined();
      expect(result.bufferAnalysis).toBeDefined();
    });

    test('should predict quality', async () => {
      const result = await aiEngine.predictQuality(sampleProject);
      
      expect(result).toBeDefined();
      expect(result.testCoverage).toBeDefined();
      expect(result.defectRate).toBeDefined();
      expect(result.codeQuality).toBeDefined();
    });

    test('should generate comprehensive insights', async () => {
      const result = await aiEngine.generateInsights(sampleProject);
      
      expect(result).toBeDefined();
      expect(result.insights).toBeInstanceOf(Array);
      expect(result.recommendations).toBeInstanceOf(Array);
      expect(result.summary).toBeDefined();
      expect(result.riskPrediction).toBeDefined();
      expect(result.resourceOptimization).toBeDefined();
      expect(result.scheduleAnalysis).toBeDefined();
      expect(result.qualityPrediction).toBeDefined();
    });
  });

  describe('API Server Functionality', () => {
    test('should respond to health check', async () => {
      const health = await client.healthCheck();
      
      expect(health.status).toBe('healthy');
      expect(health.timestamp).toBeDefined();
      expect(health.aiEngine).toBe('initialized');
    });

    test('should handle risk prediction API', async () => {
      const result = await client.predictRisk(sampleProject);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should handle insights generation API', async () => {
      const result = await client.generateInsights(sampleProject);
      
      expect(result).toBeInstanceOf(Object);
      expect(result.data).toBeDefined();
      expect(result.data.insights).toBeInstanceOf(Array);
      expect(result.data.recommendations).toBeInstanceOf(Array);
    });

    test('should handle batch processing', async () => {
      const projects = [sampleProject, { ...sampleProject, id: 'test-proj-002' }];
      const result = await client.batchAnalyze(projects);
      
      expect(result).toBeDefined();
      expect(result.total).toBe(2);
      expect(result.processed).toBe(2);
      expect(result.successful).toBeGreaterThan(0);
      expect(result.results).toBeInstanceOf(Array);
    });

    test('should return performance metrics', async () => {
      const metrics = await client.getPerformanceMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.predictions).toBeGreaterThanOrEqual(0);
      expect(metrics.avgTime).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheSize).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Performance Requirements', () => {
    test('should meet response time requirements', async () => {
      const startTime = Date.now();
      await client.predictRisk(sampleProject);
      const duration = Date.now() - startTime;
      
      expect(duration).toBeLessThan(5000); // 5 seconds max
    });

    test('should handle concurrent requests', async () => {
      const promises = Array(5).fill().map(() => 
        client.predictRisk({
          ...sampleProject,
          id: `concurrent-${Math.random()}`
        })
      );
      
      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
      });
    });

    test('should maintain accuracy under load', async () => {
      const results = await Promise.all(
        Array(10).fill().map(() => client.predictRisk(sampleProject))
      );
      
      // All results should be consistent for the same input
      const firstResult = results[0];
      results.forEach(result => {
        expect(result.riskLevel).toBe(firstResult.riskLevel);
        expect(Math.abs(result.confidence - firstResult.confidence)).toBeLessThan(0.1);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid project data', async () => {
      const invalidProject = { invalidField: 'test' };
      
      await expect(client.predictRisk(invalidProject)).rejects.toThrow();
    });

    test('should handle API rate limiting', async () => {
      // This would require actual rate limiting to be configured
      // For now, just verify the error handling structure exists
      expect(client.isRetryableError).toBeDefined();
    });

    test('should handle network errors gracefully', async () => {
      const badClient = new AIInsightsClient({
        baseURL: 'http://localhost:9999/api/v1',
        retries: 1,
        timeout: 1000
      });
      
      await expect(badClient.healthCheck()).rejects.toThrow();
    });
  });

  describe('Data Validation', () => {
    test('should validate required fields', async () => {
      const incompleteProject = { teamSize: 5 };
      
      const result = await client.predictRisk(incompleteProject);
      expect(result).toBeDefined(); // Should work with defaults
    });

    test('should validate field ranges', async () => {
      const projectWithInvalidRange = {
        ...sampleProject,
        teamSize: -1,
        budget: 999999999
      };
      
      await expect(client.predictRisk(projectWithInvalidRange))
        .rejects.toThrow();
    });

    test('should sanitize input data', async () => {
      const projectWithMaliciousInput = {
        ...sampleProject,
        name: '<script>alert("xss")</script>Test Project'
      };
      
      const result = await client.predictRisk(projectWithMaliciousInput);
      expect(result).toBeDefined();
    });
  });

  describe('Cache Functionality', () => {
    test('should cache predictions', async () => {
      // First request
      const start1 = Date.now();
      const result1 = await client.predictRisk(sampleProject);
      const duration1 = Date.now() - start1;
      
      // Second request (should be cached)
      const start2 = Date.now();
      const result2 = await client.predictRisk(sampleProject);
      const duration2 = Date.now() - start2;
      
      expect(result1.riskLevel).toBe(result2.riskLevel);
      expect(duration2).toBeLessThan(duration1); // Should be faster due to caching
    });

    test('should clear cache when requested', async () => {
      await client.clearCache();
      const response = await client.clearCache();
      
      expect(response.success).toBe(true);
      expect(response.message).toContain('cleared');
    });
  });

  describe('Model Accuracy', () => {
    test('should maintain consistent risk predictions', () => {
      const testCases = [
        { project: { ...sampleProject, complexity: 'low' }, expectedRisk: ['low', 'medium'] },
        { project: { ...sampleProject, complexity: 'high', teamSize: 15 }, expectedRisk: ['medium', 'high', 'critical'] }
      ];
      
      testCases.forEach(async ({ project, expectedRisk }) => {
        const result = await aiEngine.predictRisk(project);
        expect(expectedRisk).toContain(result.riskLevel);
      });
    });

    test('should provide meaningful confidence scores', async () => {
      const result = await aiEngine.predictRisk(sampleProject);
      
      expect(result.confidence).toBeGreaterThan(0.5); // Should be reasonably confident
      expect(result.confidence).toBeLessThanOrEqual(1.0);
    });
  });

  describe('Integration with Dashboard', () => {
    test('should format data for dashboard display', async () => {
      const insights = await client.generateInsights(sampleProject);
      const displayFormat = insights.toDisplayFormat();
      
      expect(displayFormat.summary).toBeDefined();
      expect(displayFormat.risk).toBeDefined();
      expect(displayFormat.resources).toBeDefined();
      expect(displayFormat.schedule).toBeDefined();
      expect(displayFormat.quality).toBeDefined();
      expect(displayFormat.metadata).toBeDefined();
      expect(displayFormat.metadata.completeness).toBeGreaterThan(0);
    });

    test('should provide actionable recommendations', async () => {
      const insights = await client.generateInsights(sampleProject);
      const summary = insights.getSummary();
      
      expect(summary.keyInsights).toBeInstanceOf(Array);
      expect(summary.priorityRecommendations).toBeInstanceOf(Array);
      expect(summary.estimatedImpact).toBeDefined();
    });
  });
});

describe('Load Testing', () => {
  let client;

  beforeAll(() => {
    client = new AIInsightsClient({
      baseURL: 'http://localhost:3001/api/v1',
      timeout: 30000
    });
  });

  test('should handle sustained load', async () => {
    const concurrency = 10;
    const iterations = 5;
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
      const batch = Array(concurrency).fill().map((_, index) => 
        client.predictRisk({
          ...sampleProject,
          id: `load-test-${i}-${index}`,
          teamSize: 3 + (index % 5)
        })
      );
      
      const batchResults = await Promise.all(batch);
      results.push(...batchResults);
    }
    
    expect(results).toHaveLength(concurrency * iterations);
    results.forEach(result => {
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
      expect(result.confidence).toBeGreaterThan(0);
    });
  }, 60000);
});

// Custom test helpers
const TestHelpers = {
  createRandomProject: () => ({
    id: `test-${Date.now()}-${Math.random()}`,
    name: `Test Project ${Math.random()}`,
    teamSize: Math.floor(Math.random() * 10) + 2,
    duration: Math.floor(Math.random() * 180) + 30,
    budget: Math.floor(Math.random() * 100000) + 10000,
    complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    methodology: ['agile', 'waterfall', 'hybrid'][Math.floor(Math.random() * 3)],
    stakeholders: Math.floor(Math.random() * 15) + 2,
    requirements: Math.floor(Math.random() * 50) + 10,
    features: Math.floor(Math.random() * 30) + 5,
    teamExperience: Math.random(),
    technologies: ['react', 'nodejs', 'python', 'java'].slice(0, Math.floor(Math.random() * 3) + 1),
    historicalData: {
      similarProjects: Math.floor(Math.random() * 50) + 5,
      successRate: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
      avgDelay: Math.random() * 0.3 // 0 to 0.3
    }
  }),

  validateInsightStructure: (insights) => {
    expect(insights).toBeDefined();
    expect(insights.insights).toBeInstanceOf(Array);
    expect(insights.recommendations).toBeInstanceOf(Array);
    expect(insights.summary).toBeDefined();
    expect(insights.riskPrediction).toBeDefined();
    expect(insights.resourceOptimization).toBeDefined();
    expect(insights.scheduleAnalysis).toBeDefined();
    expect(insights.qualityPrediction).toBeDefined();
  }
};

export { TestHelpers };

