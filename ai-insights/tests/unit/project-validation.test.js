import { jest } from '@jest/globals';
import * as tf from '@tensorflow/tfjs';
import { validateProjectInput, validateProjectData, validateBatchRequest } from '../../src/utils/validation.js';
import { RiskPredictionModel } from '../../src/ml/models/RiskPredictionModel.js';

function response() {
  return { code: null, body: null, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}

const invalid = [null, undefined, {}, [], 'project', {unknown: true},
  {teamSize: 0}, {teamSize: -1}, {teamSize: 101}, {teamSize: 1.5},
  {duration: 0}, {duration: 366}, {budget: 0}, {budget: 10000001},
  {complexity: 'invalid'}, {methodology: 'invalid'},
  {teamExperience: NaN}, {budget: Infinity}, {duration: -Infinity},
  {teamSize: 5, historicalData: {successRate: 2}},
];

test.each(invalid.map((input, index) => [index, input]))('invalid case %i is rejected by middleware and model before inference', async (_index, input) => {
  const next = jest.fn();
  const res = response();
  validateProjectData({body: input}, res, next);
  expect(res.code).toBe(400);
  expect(next).not.toHaveBeenCalled();
  const model = new RiskPredictionModel();
  model.isInitialized = true;
  model.model = {predict: jest.fn()};
  const tensors = tf.memory().numTensors;
  await expect(model.predict(input)).rejects.toThrow();
  expect(model.model.predict).not.toHaveBeenCalled();
  expect(tf.memory().numTensors).toBe(tensors);
});

test('valid partial input receives the same defaults at HTTP and model boundaries', () => {
  const req = {body: {teamSize: 5, unknown: 'discard'}};
  const res = response();
  const next = jest.fn();
  validateProjectData(req, res, next);
  expect(next).toHaveBeenCalledTimes(1);
  expect(req.body).toEqual(validateProjectInput({teamSize: 5}).value);
  expect(req.body).toMatchObject({duration: 60, budget: 50000, complexity: 'medium'});
  expect(req.body).not.toHaveProperty('unknown');
});

test('valid boundary values retain historical zero values in model features', () => {
  const {value, error} = validateProjectInput({teamSize: 100, duration: 365, budget: 10000000,
    teamExperience: 0, historicalData: {similarProjects: 0, successRate: 0, avgDelay: 0}});
  expect(error).toBeUndefined();
  expect(new RiskPredictionModel().extractFeatures(value).slice(7)).toEqual([0, 0, 0, 0]);
});

test('batch validation rejects empty and unknown-only projects', () => {
  for (const project of [{}, {unknown: true}, null]) {
    const res = response();
    const next = jest.fn();
    validateBatchRequest({body: {projects: [project]}}, res, next);
    expect(res.code).toBe(400);
    expect(next).not.toHaveBeenCalled();
  }
});
