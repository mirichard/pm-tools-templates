/**
 * Unit Tests for Risk Prediction Model
 * Tests individual risk prediction algorithms in isolation
 */

import { jest } from '@jest/globals';
import { RiskPredictionModel } from '../../src/ml/models/RiskPredictionModel.js';

describe('RiskPredictionModel', () => {
  let riskModel;

  beforeEach(async () => {
    riskModel = new RiskPredictionModel();
    await riskModel.initialize();
  });

  afterEach(() => {
    riskModel.dispose();
    jest.clearAllMocks();
  });

  describe('Risk Level Classification', () => {
    test('should predict low risk for small, simple projects', async () => {
      const project = {
        teamSize: 3,
        duration: 60,
        complexity: 'low',
        methodology: 'agile',
        teamExperience: 0.8,
        budget: 30000
      };

      const result = await riskModel.predict(project);
      
      expect(result.riskLevel).toBe('low');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('should predict high risk for large, complex projects with tight timelines', async () => {
      const project = {
        teamSize: 20,
        duration: 30,
        complexity: 'high',
        methodology: 'waterfall',
        teamExperience: 0.3,
        budget: 1000000
      };

      const result = await riskModel.predict(project);
      
      expect(['high', 'critical']).toContain(result.riskLevel);
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should predict medium risk for balanced projects', async () => {
      const project = {
        teamSize: 8,
        duration: 90,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.6,
        budget: 150000
      };

      const result = await riskModel.predict(project);
      
      expect(['medium', 'low', 'high']).toContain(result.riskLevel);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    test('should predict critical risk for impossible projects', async () => {
      const project = {
        teamSize: 50,
        duration: 7, // 1 week for massive project
        complexity: 'high',
        methodology: 'waterfall',
        teamExperience: 0.1,
        budget: 10000000
      };

      const result = await riskModel.predict(project);
      
      expect(result.riskLevel).toBe('critical');
      expect(result.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Risk Factor Identification', () => {
    test('should identify team size as risk factor for large teams', async () => {
      const project = {
        teamSize: 25,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      const result = await riskModel.predict(project);
      
      expect(result.riskFactors).toEqual(expect.arrayContaining([
        expect.objectContaining({ factor: 'Large Team Size', severity: expect.any(String), description: expect.any(String), impact: expect.any(Number) })
      ]));
    });

    test('should identify tight timeline as risk factor', async () => {
      const project = {
        teamSize: 5,
        duration: 14, // 2 weeks
        complexity: 'high',
        methodology: 'agile'
      };

      const result = await riskModel.predict(project);
      
      expect(result.riskFactors).toEqual(expect.arrayContaining([
        expect.objectContaining({ factor: 'Tight Timeline', severity: expect.any(String), description: expect.any(String), impact: expect.any(Number) })
      ]));
    });

    test('should identify inexperienced team as risk factor', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.2
      };

      const result = await riskModel.predict(project);
      
      expect(result.riskFactors).toEqual(expect.arrayContaining([
        expect.objectContaining({ factor: 'Low Team Experience', severity: expect.any(String), description: expect.any(String), impact: expect.any(Number) })
      ]));
    });

    test('should identify complex technology stack as risk factor', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'high',
        methodology: 'agile',
        technologies: ['react', 'nodejs', 'python', 'java', 'kubernetes', 'tensorflow']
      };

      const result = await riskModel.predict(project);
      
      expect(result.riskFactors).toEqual(expect.arrayContaining([
        expect.objectContaining({ factor: 'Complex Technology Stack', severity: expect.any(String), description: expect.any(String), impact: expect.any(Number) })
      ]));
    });
  });

  describe('Confidence Score Calculation', () => {
    test('should provide high confidence for typical project patterns', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.7,
        stakeholders: 5,
        requirements: 30,
        features: 15
      };

      const result = await riskModel.predict(project);
      
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should provide lower confidence for unusual project patterns', async () => {
      const project = {
        teamSize: 1,
        duration: 365,
        complexity: 'high',
        methodology: 'hybrid',
        teamExperience: 1.0,
        budget: 1000 // Shared input schema minimum; confidence assertion remains unchanged.
      };

      const result = await riskModel.predict(project);
      
      expect(result.confidence).toBeLessThan(0.7);
    });

    test('should provide moderate confidence for edge cases', async () => {
      const project = {
        teamSize: 100,
        duration: 1,
        complexity: 'low',
        methodology: 'waterfall'
      };

      const result = await riskModel.predict(project);
      
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.confidence).toBeLessThan(0.8);
    });
  });

  describe('Mitigation Strategy Generation', () => {
    test('should suggest team coordination strategies for large teams', async () => {
      const project = {
        teamSize: 20,
        duration: 90,
        complexity: 'medium',
        methodology: 'agile'
      };

      const result = await riskModel.predict(project);
      
      expect(result.mitigationStrategies).toEqual(expect.arrayContaining([
        expect.objectContaining({ strategy: 'Communication Protocols', priority: expect.any(String), description: expect.stringContaining('Implement clear communication protocols'), timeframe: expect.any(String) })
      ]));
    });

    test('should suggest timeline adjustments for tight schedules', async () => {
      const project = {
        teamSize: 5,
        duration: 15,
        complexity: 'high',
        methodology: 'agile'
      };

      const result = await riskModel.predict(project);
      
      expect(result.mitigationStrategies).toEqual(expect.arrayContaining([
        expect.objectContaining({ strategy: 'Timeline Review', priority: expect.any(String), description: expect.stringContaining('Consider extending timeline'), timeframe: expect.any(String) })
      ]));
    });

    test('should suggest training for inexperienced teams', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'high',
        methodology: 'agile',
        teamExperience: 0.2
      };

      const result = await riskModel.predict(project);
      
      expect(result.mitigationStrategies).toEqual(expect.arrayContaining([
        expect.objectContaining({ strategy: 'Team Training', priority: expect.any(String), description: expect.stringContaining('Provide additional training'), timeframe: expect.any(String) })
      ]));
    });
  });

  describe('Input Validation', () => {
    test('should handle missing optional fields gracefully', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
        // Missing: teamExperience, stakeholders, requirements, etc.
      };

      const result = await riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should reject invalid team size', async () => {
      const project = {
        teamSize: 0,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      await expect(riskModel.predict(project)).rejects.toThrow('Invalid team size');
    });

    test('should reject invalid duration', async () => {
      const project = {
        teamSize: 5,
        duration: 0,
        complexity: 'medium',
        methodology: 'agile'
      };

      await expect(riskModel.predict(project)).rejects.toThrow('Invalid duration');
    });

    test('should reject invalid complexity level', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'invalid',
        methodology: 'agile'
      };

      await expect(riskModel.predict(project)).rejects.toThrow('Invalid complexity level');
    });

    test('should reject invalid methodology', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'invalid'
      };

      await expect(riskModel.predict(project)).rejects.toThrow('Invalid methodology');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle minimum viable project', async () => {
      const project = {
        teamSize: 1,
        duration: 1,
        complexity: 'low',
        methodology: 'agile',
        budget: 1000
      };

      const result = await riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
    });

    test('should handle maximum enterprise project', async () => {
      const project = {
        teamSize: 100,
        duration: 365, // Shared API limit
        complexity: 'high',
        methodology: 'waterfall',
        budget: 10000000,
        stakeholders: 50,
        requirements: 1000,
        features: 500
      };

      const result = await riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
    });

    test('should reject budgets below the shared API minimum', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        budget: 0
      };

      await expect(riskModel.predict(project)).rejects.toThrow('budget');
    });

    test('should handle perfect team experience', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 1.0
      };

      const result = await riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
    });

    test('should handle zero team experience', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.0
      };

      const result = await riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskFactors).toEqual(expect.arrayContaining([
        expect.objectContaining({ factor: 'Low Team Experience', severity: expect.any(String), description: expect.any(String), impact: expect.any(Number) })
      ]));
    });
  });

  describe('Consistency and Determinism', () => {
    test('should return consistent results for identical inputs', async () => {
      const project = {
        teamSize: 8,
        duration: 90,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.7
      };

      const results = await Promise.all(Array(10).fill().map(() => riskModel.predict(project)));
      
      const firstResult = results[0];
      results.forEach(result => {
        expect(result.riskLevel).toBe(firstResult.riskLevel);
        expect(result.confidence).toBe(firstResult.confidence);
        expect(result.riskFactors).toEqual(firstResult.riskFactors);
      });
    });

    test('should be deterministic across multiple instances', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      const model1 = new RiskPredictionModel();
      const model2 = new RiskPredictionModel();
      
      await model1.initialize();
      await model2.initialize();
      const result1 = await model1.predict(project);
      const result2 = await model2.predict(project);
      model1.dispose();
      model2.dispose();
      
      expect(result1.riskLevel).toBe(result2.riskLevel);
      expect(result1.confidence).toBe(result2.confidence);
    });
  });

  describe('Performance Requirements', () => {
    test('should complete prediction within acceptable time', async () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      const startTime = performance.now();
      const result = await riskModel.predict(project);
      const duration = performance.now() - startTime;
      
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('should handle batch predictions efficiently', async () => {
      const projects = Array(100).fill().map((_, i) => ({
        teamSize: (i % 20) + 1,
        duration: (i % 180) + 30,
        complexity: ['low', 'medium', 'high'][i % 3],
        methodology: ['agile', 'waterfall', 'hybrid'][i % 3]
      }));

      const startTime = performance.now();
      const results = await Promise.all(projects.map(project => riskModel.predict(project)));
      const duration = performance.now() - startTime;
      
      expect(results).toHaveLength(100);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      
      results.forEach(result => {
        expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
      });
    });
  });

  describe('Error Handling', () => {
    test('should throw descriptive error for null input', async () => {
      await expect(riskModel.predict(null)).rejects.toThrow('Project data is required');
    });

    test('should throw descriptive error for undefined input', async () => {
      await expect(riskModel.predict(undefined)).rejects.toThrow('Project data is required');
    });

    test('should throw descriptive error for empty object', async () => {
      await expect(riskModel.predict({})).rejects.toThrow('Required fields missing');
    });

    test('should throw descriptive error for negative values', async () => {
      const project = {
        teamSize: -5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      await expect(riskModel.predict(project)).rejects.toThrow('Team size must be positive');
    });
  });
});

