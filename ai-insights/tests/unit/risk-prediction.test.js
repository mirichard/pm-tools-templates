/**
 * Unit Tests for Risk Prediction Model
 * Tests individual risk prediction algorithms in isolation
 */

import { jest } from '@jest/globals';
import { RiskPredictionModel } from '../../src/ml/models/RiskPredictionModel.js';

describe('RiskPredictionModel', () => {
  let riskModel;

  beforeEach(() => {
    riskModel = new RiskPredictionModel();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Risk Level Classification', () => {
    test('should predict low risk for small, simple projects', () => {
      const project = {
        teamSize: 3,
        duration: 60,
        complexity: 'low',
        methodology: 'agile',
        teamExperience: 0.8,
        budget: 30000
      };

      const result = riskModel.predict(project);
      
      expect(result.riskLevel).toBe('low');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('should predict high risk for large, complex projects with tight timelines', () => {
      const project = {
        teamSize: 20,
        duration: 30,
        complexity: 'high',
        methodology: 'waterfall',
        teamExperience: 0.3,
        budget: 1000000
      };

      const result = riskModel.predict(project);
      
      expect(['high', 'critical']).toContain(result.riskLevel);
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    test('should predict medium risk for balanced projects', () => {
      const project = {
        teamSize: 8,
        duration: 90,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.6,
        budget: 150000
      };

      const result = riskModel.predict(project);
      
      expect(['medium', 'low', 'high']).toContain(result.riskLevel);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    test('should predict critical risk for impossible projects', () => {
      const project = {
        teamSize: 50,
        duration: 7, // 1 week for massive project
        complexity: 'high',
        methodology: 'waterfall',
        teamExperience: 0.1,
        budget: 10000000
      };

      const result = riskModel.predict(project);
      
      expect(result.riskLevel).toBe('critical');
      expect(result.confidence).toBeGreaterThan(0.8);
    });
  });

  describe('Risk Factor Identification', () => {
    test('should identify team size as risk factor for large teams', () => {
      const project = {
        teamSize: 25,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      const result = riskModel.predict(project);
      
      expect(result.riskFactors).toContain('Large team size');
    });

    test('should identify tight timeline as risk factor', () => {
      const project = {
        teamSize: 5,
        duration: 14, // 2 weeks
        complexity: 'high',
        methodology: 'agile'
      };

      const result = riskModel.predict(project);
      
      expect(result.riskFactors).toContain('Tight timeline');
    });

    test('should identify inexperienced team as risk factor', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.2
      };

      const result = riskModel.predict(project);
      
      expect(result.riskFactors).toContain('Low team experience');
    });

    test('should identify complex technology stack as risk factor', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'high',
        methodology: 'agile',
        technologies: ['react', 'nodejs', 'python', 'java', 'kubernetes', 'tensorflow']
      };

      const result = riskModel.predict(project);
      
      expect(result.riskFactors).toContain('Complex technology stack');
    });
  });

  describe('Confidence Score Calculation', () => {
    test('should provide high confidence for typical project patterns', () => {
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

      const result = riskModel.predict(project);
      
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should provide lower confidence for unusual project patterns', () => {
      const project = {
        teamSize: 1,
        duration: 365,
        complexity: 'high',
        methodology: 'hybrid',
        teamExperience: 1.0,
        budget: 10
      };

      const result = riskModel.predict(project);
      
      expect(result.confidence).toBeLessThan(0.7);
    });

    test('should provide moderate confidence for edge cases', () => {
      const project = {
        teamSize: 100,
        duration: 1,
        complexity: 'low',
        methodology: 'waterfall'
      };

      const result = riskModel.predict(project);
      
      expect(result.confidence).toBeGreaterThan(0.3);
      expect(result.confidence).toBeLessThan(0.8);
    });
  });

  describe('Mitigation Strategy Generation', () => {
    test('should suggest team coordination strategies for large teams', () => {
      const project = {
        teamSize: 20,
        duration: 90,
        complexity: 'medium',
        methodology: 'agile'
      };

      const result = riskModel.predict(project);
      
      expect(result.mitigationStrategies).toContain('Implement clear communication protocols');
    });

    test('should suggest timeline adjustments for tight schedules', () => {
      const project = {
        teamSize: 5,
        duration: 15,
        complexity: 'high',
        methodology: 'agile'
      };

      const result = riskModel.predict(project);
      
      expect(result.mitigationStrategies).toContain('Consider extending timeline');
    });

    test('should suggest training for inexperienced teams', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'high',
        methodology: 'agile',
        teamExperience: 0.2
      };

      const result = riskModel.predict(project);
      
      expect(result.mitigationStrategies).toContain('Provide additional training');
    });
  });

  describe('Input Validation', () => {
    test('should handle missing optional fields gracefully', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
        // Missing: teamExperience, stakeholders, requirements, etc.
      };

      const result = riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should reject invalid team size', () => {
      const project = {
        teamSize: 0,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      expect(() => riskModel.predict(project)).toThrow('Invalid team size');
    });

    test('should reject invalid duration', () => {
      const project = {
        teamSize: 5,
        duration: 0,
        complexity: 'medium',
        methodology: 'agile'
      };

      expect(() => riskModel.predict(project)).toThrow('Invalid duration');
    });

    test('should reject invalid complexity level', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'invalid',
        methodology: 'agile'
      };

      expect(() => riskModel.predict(project)).toThrow('Invalid complexity level');
    });

    test('should reject invalid methodology', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'invalid'
      };

      expect(() => riskModel.predict(project)).toThrow('Invalid methodology');
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle minimum viable project', () => {
      const project = {
        teamSize: 1,
        duration: 1,
        complexity: 'low',
        methodology: 'agile',
        budget: 1
      };

      const result = riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
    });

    test('should handle maximum enterprise project', () => {
      const project = {
        teamSize: 1000,
        duration: 3650, // 10 years
        complexity: 'high',
        methodology: 'waterfall',
        budget: 1000000000,
        stakeholders: 500,
        requirements: 10000,
        features: 5000
      };

      const result = riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
    });

    test('should handle zero budget projects', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        budget: 0
      };

      const result = riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskFactors).toContain('Zero or minimal budget');
    });

    test('should handle perfect team experience', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 1.0
      };

      const result = riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
    });

    test('should handle zero team experience', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.0
      };

      const result = riskModel.predict(project);
      
      expect(result).toBeDefined();
      expect(result.riskFactors).toContain('No team experience');
    });
  });

  describe('Consistency and Determinism', () => {
    test('should return consistent results for identical inputs', () => {
      const project = {
        teamSize: 8,
        duration: 90,
        complexity: 'medium',
        methodology: 'agile',
        teamExperience: 0.7
      };

      const results = Array(10).fill().map(() => riskModel.predict(project));
      
      const firstResult = results[0];
      results.forEach(result => {
        expect(result.riskLevel).toBe(firstResult.riskLevel);
        expect(result.confidence).toBe(firstResult.confidence);
        expect(result.riskFactors).toEqual(firstResult.riskFactors);
      });
    });

    test('should be deterministic across multiple instances', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      const model1 = new RiskPredictionModel();
      const model2 = new RiskPredictionModel();
      
      const result1 = model1.predict(project);
      const result2 = model2.predict(project);
      
      expect(result1.riskLevel).toBe(result2.riskLevel);
      expect(result1.confidence).toBe(result2.confidence);
    });
  });

  describe('Performance Requirements', () => {
    test('should complete prediction within acceptable time', () => {
      const project = {
        teamSize: 5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      const startTime = performance.now();
      const result = riskModel.predict(project);
      const duration = performance.now() - startTime;
      
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('should handle batch predictions efficiently', () => {
      const projects = Array(100).fill().map((_, i) => ({
        teamSize: (i % 20) + 1,
        duration: (i % 180) + 30,
        complexity: ['low', 'medium', 'high'][i % 3],
        methodology: ['agile', 'waterfall', 'hybrid'][i % 3]
      }));

      const startTime = performance.now();
      const results = projects.map(project => riskModel.predict(project));
      const duration = performance.now() - startTime;
      
      expect(results).toHaveLength(100);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      
      results.forEach(result => {
        expect(result.riskLevel).toMatch(/^(low|medium|high|critical)$/);
      });
    });
  });

  describe('Error Handling', () => {
    test('should throw descriptive error for null input', () => {
      expect(() => riskModel.predict(null)).toThrow('Project data is required');
    });

    test('should throw descriptive error for undefined input', () => {
      expect(() => riskModel.predict(undefined)).toThrow('Project data is required');
    });

    test('should throw descriptive error for empty object', () => {
      expect(() => riskModel.predict({})).toThrow('Required fields missing');
    });

    test('should throw descriptive error for negative values', () => {
      const project = {
        teamSize: -5,
        duration: 60,
        complexity: 'medium',
        methodology: 'agile'
      };

      expect(() => riskModel.predict(project)).toThrow('Team size must be positive');
    });
  });
});

