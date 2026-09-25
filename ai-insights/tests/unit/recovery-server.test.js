import { jest } from '@jest/globals';
import AIInsightsServer from '../../src/api/server.js';
import * as tf from '@tensorflow/tfjs';

async function post(base, body) {
  const response = await fetch(`${base}/api/v1/risk/predict`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

test('real HTTP startup, failure, recovery and concurrent project association', async () => {
  const server = new AIInsightsServer({ port: 0 });
  try {
    await server.start();
    const base = `http://127.0.0.1:${server.server.address().port}`;
    expect((await (await fetch(`${base}/health`)).json()).aiEngine).toBe('initialized');
    const predict = jest.spyOn(server.aiEngine.models.riskPrediction, 'predict')
      .mockImplementation(async project => {
        if (project.name === 'fail') throw new Error('Synthetic inference failure');
        await new Promise(resolve => setTimeout(resolve, project.name === 'A' ? 15 : 1));
        return { projectName: project.name, trainingStatus: 'synthetic-fixture' };
      });
    expect((await post(base, { teamSize: 0 })).status).toBe(400);
    expect(predict).not.toHaveBeenCalled();
    const failed = await post(base, { name: 'fail', teamSize: 4 });
    expect(failed.status).toBe(500);
    expect(failed.body.success).toBe(false);
    const [a, b] = await Promise.all(['A', 'B'].map(name => post(base, { name, teamSize: 4 })));
    expect(a.body.data.projectName).toBe('A');
    expect(b.body.data.projectName).toBe('B');
    await post(base, { name: 'A', teamSize: 4 });
    expect(predict).toHaveBeenCalledTimes(3);
    await fetch(`${base}/api/v1/cache`, { method: 'DELETE' });
    await post(base, { name: 'A', teamSize: 4 });
    expect(predict).toHaveBeenCalledTimes(4);
  } finally {
    await server.shutdown();
    jest.restoreAllMocks();
  }
}, 15000);

test('fresh service restart empties volatile cache and releases model tensors', async () => {
  const before = tf.memory().numTensors;
  for (let cycle = 0; cycle < 2; cycle++) {
    const server = new AIInsightsServer({ port: 0 });
    try {
      await server.start();
      expect(server.aiEngine.cache.size).toBe(0);
      const base = `http://127.0.0.1:${server.server.address().port}`;
      const result = await post(base, { teamSize: 4 });
      expect(result.status).toBe(200);
      expect(result.body.data.metadata.trainingStatus).toBe('untrained');
      expect(server.aiEngine.cache.size).toBe(1);
    } finally {
      await server.shutdown();
    }
    expect(tf.memory().numTensors).toBe(before);
  }
}, 15000);

test('planning evidence crosses HTTP without cache reuse and UAT serves session disclosure', async () => {
  const previous = process.env.ENABLE_RECOVERY_UAT;
  process.env.ENABLE_RECOVERY_UAT = 'true';
  const server = new AIInsightsServer({ port: 0 });
  try {
    await server.start();
    const base = `http://127.0.0.1:${server.server.address().port}`;
    const page = await fetch(`${base}/recovery-uat/uat/`);
    expect(page.status).toBe(200);
    expect(page.headers.get('cache-control')).toBe('no-store');
    expect(await page.text()).toContain('Results are not saved');
    const body = { teamSize: 4, baselineId: 'v1', planningAssessment: {
      baselineId: 'v1', assessedAt: new Date(Date.now() - 10000).toISOString(),
      reviewDue: new Date(Date.now() + 10000).toISOString(),
      schedule: { remainingEffortHours: 12, availableCapacityHours: 8,
        assumptions: 'Qualified net capacity', evidenceReferences: ['plan-1'] },
    } };
    const first = await post(base, body);
    expect(first.status).toBe(200);
    expect(first.body.data.planningAssessment.checks[0]).toMatchObject({ status: 'triggered', measurements: { shortfallHours: 4 } });
    expect(server.aiEngine.cache.size).toBe(0);
    body.planningAssessment.reviewDue = new Date(Date.now() - 1000).toISOString();
    const expired = await post(base, body);
    expect(expired.body.data.planningAssessment.checks.every(c => c.status === 'not_assessed')).toBe(true);
    const aggregate = await fetch(`${base}/api/v1/insights/analyze`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    expect((await aggregate.json()).data.riskPrediction.planningAssessment.schemaVersion).toBe('planning-v1');
    body.planningAssessment.schedule.availableCapacityHours = -1;
    expect((await post(base, body)).status).toBe(400);
  } finally {
    await server.shutdown();
    if (previous === undefined) delete process.env.ENABLE_RECOVERY_UAT;
    else process.env.ENABLE_RECOVERY_UAT = previous;
  }
}, 15000);

test('missing-quality fixture is opt-in, validates input and leaves normal responses intact', async () => {
  const previous = process.env.ENABLE_RECOVERY_UAT;
  const endpoint = '/api/v1/recovery-uat/missing-quality/insights/analyze';
  try {
    for (const enabled of [false, true]) {
      process.env.ENABLE_RECOVERY_UAT = String(enabled);
      const server = new AIInsightsServer({ port: 0 });
      try {
        await server.start();
        const base = `http://127.0.0.1:${server.server.address().port}`;
        const request = (route, teamSize = 4) => fetch(`${base}${route}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Synthetic fixture project', teamSize }),
        });
        const response = await request(endpoint);
        expect(response.status).toBe(enabled ? 200 : 404);
        if (!enabled) continue;
        expect(response.headers.get('cache-control')).toBe('no-store');
        const partial = await response.json();
        expect(partial.fixture).toBe('missing-quality');
        expect(partial.data).not.toHaveProperty('qualityPrediction');
        for (const key of ['riskPrediction', 'resourceOptimization', 'scheduleAnalysis']) {
          expect(partial.data[key]).toBeDefined();
        }
        expect((await request(endpoint, 0)).status).toBe(400);
        const normal = await (await request('/api/v1/insights/analyze')).json();
        expect(normal.data.qualityPrediction).toBeDefined();
        expect(normal).not.toHaveProperty('fixture');
      } finally {
        await server.shutdown();
      }
    }
  } finally {
    if (previous === undefined) delete process.env.ENABLE_RECOVERY_UAT;
    else process.env.ENABLE_RECOVERY_UAT = previous;
  }
}, 15000);
