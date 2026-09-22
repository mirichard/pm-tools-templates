import { jest } from '@jest/globals';
import * as tf from '@tensorflow/tfjs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AIInsightsEngine } from '../../src/services/AIInsightsEngine.js';
import { AIInsightsClient } from '../../src/dashboard/aiInsightsClient.js';
import { RiskPredictionModel } from '../../src/ml/models/RiskPredictionModel.js';

afterEach(() => jest.restoreAllMocks());

test('client serializes request bodies once', async () => {
  const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true, json: async () => ({ success: true }),
  });
  const client = new AIInsightsClient();
  await client.makeRequest('/risk/predict', { body: { teamSize: 5 } });
  expect(fetchMock.mock.calls[0][1].body).toBe('{"teamSize":5}');
});

test('a failed request clears its timeout', async () => {
  jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('connection refused'));
  const clear = jest.spyOn(globalThis, 'clearTimeout');
  await expect(new AIInsightsClient({ retries: 1 }).makeRequest('/test')).rejects.toThrow('connection refused');
  expect(clear).toHaveBeenCalled();
});

test('shutting down one engine does not dispose another engine’s weights', async () => {
  const first = new AIInsightsEngine();
  const second = new AIInsightsEngine();
  try {
    await first.initialize();
    await second.initialize();
    await first.shutdown();
    const result = await second.predictRisk({ teamSize: 5, duration: 60, budget: 50000 });
    expect(Number.isFinite(result.confidence)).toBe(true);
  } finally {
    await first.shutdown();
    await second.shutdown();
  }
});

test('saved model weights can be reloaded without the native backend', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'risk-model-'));
  const model = new RiskPredictionModel();
  let reloaded;
  const input = tf.zeros([1, model.features.length]);
  let before;
  let after;
  try {
    await model.initialize();
    await model.save(directory);
    const json = JSON.parse(await readFile(join(directory, 'model.json'), 'utf8'));
    const buffer = await readFile(join(directory, 'weights.bin'));
    reloaded = await tf.loadLayersModel(tf.io.fromMemory({
      modelTopology: json.modelTopology,
      weightSpecs: json.weightsManifest[0].weights,
      weightData: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
    }));
    before = model.model.predict(input);
    after = reloaded.predict(input);
    expect(Array.from(await after.data())).toEqual(Array.from(await before.data()));
  } finally {
    input.dispose();
    before?.dispose();
    after?.dispose();
    reloaded?.dispose();
    model.dispose();
    await rm(directory, { recursive: true, force: true });
  }
});
