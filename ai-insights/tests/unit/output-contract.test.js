import { InsightsGenerator } from '../../src/services/InsightsGenerator.js';
import { AIInsightsResult } from '../../src/dashboard/aiInsightsClient.js';
import { ResourceOptimizationModel } from '../../src/ml/models/ResourceOptimizationModel.js';
import { ScheduleIntelligenceModel } from '../../src/ml/models/ScheduleIntelligenceModel.js';
import { QualityPredictionModel } from '../../src/ml/models/QualityPredictionModel.js';

test('aggregate retains model outputs through JSON transport and dashboard projection', async () => {
  const projectData = { id: 'contract-fixture', teamSize: 4, duration: 60, teamExperience: 0.5 };
  const resource = new ResourceOptimizationModel();
  const schedule = new ScheduleIntelligenceModel();
  const quality = new QualityPredictionModel();
  await Promise.all([resource.initialize(), schedule.initialize(), quality.initialize()]);
  const inputs = {
    projectData,
    riskPrediction: {
      riskLevel: 'low', confidence: 0.6, riskFactors: [], mitigationStrategies: [],
      timeline: [], impact: {},
    },
    resourceOptimization: await resource.optimize(projectData),
    scheduleAnalysis: await schedule.analyze(projectData),
    qualityPrediction: await quality.predict(projectData),
  };
  const aggregate = await new InsightsGenerator().generate(inputs);
  for (const key of ['riskPrediction', 'resourceOptimization', 'scheduleAnalysis', 'qualityPrediction']) {
    expect(aggregate[key]).toEqual(inputs[key]);
  }
  const result = new AIInsightsResult(JSON.parse(JSON.stringify(aggregate)));
  const display = result.toDisplayFormat();
  expect(display.risk).toEqual(inputs.riskPrediction);
  expect(display.resources.currentUtilization).toBe(0.78);
  expect(display.resources.targetUtilization).toBe(0.85);
  expect(display.schedule.currentSchedule.bufferTime).toBe(7);
  expect(display.quality.metrics.testCoverage.predicted).toBe(55);
  expect(display.metadata).toMatchObject({
    completeness: 100,
    contractVersion: 'recovery-v1',
    validationStatus: 'unvalidated',
    simulatedSections: ['resourceOptimization', 'scheduleAnalysis', 'qualityPrediction'],
  });
  expect(display.summary.estimatedImpact).toBeNull();
});

test('missing sections are unavailable, not fabricated as complete or validated', () => {
  const display = new AIInsightsResult({ insights: [], recommendations: [] }).toDisplayFormat();
  expect(display.risk).toBeUndefined();
  expect(display.resources).toBeUndefined();
  expect(display.schedule).toBeUndefined();
  expect(display.quality).toBeUndefined();
  expect(display.metadata.completeness).toBe(0);
  expect(display.metadata.validationStatus).toBe('unvalidated');
  expect(display.summary.estimatedImpact).toBeNull();
});
