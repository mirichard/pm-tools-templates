import { RiskPredictionModel } from '../../src/ml/models/RiskPredictionModel.js';

describe('heuristic risk-factor and mitigation contract', () => {
  const model = new RiskPredictionModel();
  const base = { teamSize: 10, duration: 180, budget: 100000, complexity: 'medium', teamExperience: 0.5 };

  test('preserves existing trigger boundaries and structured values', () => {
    expect(model.analyzeRiskFactors(base)).toEqual([]);
    const factors = model.analyzeRiskFactors({
      ...base, teamSize: 11, duration: 181, budget: 100001, complexity: 'high', teamExperience: 0,
    });
    expect(factors.map(factor => factor.factor)).toEqual([
      'Large Team Size', 'Long Duration', 'High Budget', 'High Complexity', 'Low Team Experience',
    ]);
    for (const factor of factors) {
      expect(['medium', 'high']).toContain(factor.severity);
      expect(factor.description.length).toBeGreaterThan(0);
      expect(factor.impact).toBeGreaterThanOrEqual(0);
      expect(factor.impact).toBeLessThanOrEqual(1);
    }
  });

  test('coordination and training advice depends on factors, not random classification', () => {
    const factors = model.analyzeRiskFactors({ ...base, teamSize: 11, teamExperience: 0.2 });
    for (const level of ['low', 'medium', 'high', 'critical']) {
      const strategies = model.generateMitigationStrategies(level, factors);
      expect(strategies).toEqual(expect.arrayContaining([
        expect.objectContaining({ strategy: 'Communication Protocols', description: expect.stringContaining('Implement clear communication protocols') }),
        expect.objectContaining({ strategy: 'Team Training', description: expect.stringContaining('Provide additional training') }),
        expect.objectContaining({ strategy: 'Mentorship Program' }),
      ]));
      for (const strategy of strategies) {
        expect(strategy.priority).toMatch(/^(medium|high)$/);
        expect(strategy.timeframe.length).toBeGreaterThan(0);
      }
    }
    expect(model.generateMitigationStrategies('low', [])).toEqual([]);
    const withoutFactors = model.generateMitigationStrategies('high', []).map(item => item.strategy);
    expect(withoutFactors).not.toContain('Communication Protocols');
    expect(withoutFactors).not.toContain('Team Training');
  });

  test('training cannot report success while its implementation is absent', async () => {
    await expect(model.train([{ teamSize: 4, label: 'low' }]))
      .rejects.toThrow('training is not implemented');
    expect(model.isInitialized).toBe(false);
    expect(model.model).toBeNull();
  });
});

test('direct risk output identifies untrained predictions and heuristic factors', async () => {
  const model = new RiskPredictionModel();
  try {
    await model.initialize();
    const prediction = await model.predict({ teamSize: 4 });
    expect(prediction.metadata).toMatchObject({
      validationStatus: 'unvalidated', trainingStatus: 'untrained', factorMethod: 'heuristic',
    });
  } finally {
    model.dispose();
  }
});
