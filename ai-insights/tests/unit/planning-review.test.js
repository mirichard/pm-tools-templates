import { jest } from '@jest/globals';
import AIInsightsServer from '../../src/api/server.js';

const fixture = () => ({
  context: { projectName: 'Plan', scope: 'Testing only', periodStart: '2026-09-25', periodEnd: '2026-10-09', asOf: '2026-09-25', timezone: 'America/New_York', decision: 'Commit milestone?', source: 'Plan.xlsx, Tasks', planVersion: 'v1', alignmentConfirmed: true },
  evidence: { baselineId: 'v1', assessedAt: new Date(Date.now() - 60000).toISOString(), reviewDue: new Date(Date.now() + 86400000).toISOString(), schedule: { remainingEffortHours: 120, availableCapacityHours: 80, assumptions: 'Net qualified hours', evidenceReferences: ['plan-1'], dependencies: [{ id: 'Prerequisite', owner: 'Provider', evidenceReferences: ['D1'], neededAt: '2026-09-27T12:00:00.000Z', availableAt: '2026-09-28T12:00:00.000Z' }] }, integrations: [{ id: 'A', status: 'blocked', issue: 'Test failed', owner: 'Tech lead', evidenceReferences: ['I1'] }], skills: [{ id: 'Testing', coverage: 'gap', owner: 'Delivery lead', evidenceReferences: ['S1'] }] },
});
let server, base, previous;
beforeAll(async () => {
  previous = process.env.ENABLE_RECOVERY_UAT; process.env.ENABLE_RECOVERY_UAT = 'true';
  server = new AIInsightsServer({ port: 0 }); await server.start();
  base = `http://127.0.0.1:${server.server.address().port}`;
});
afterAll(async () => {
  await server.shutdown();
  if (previous === undefined) delete process.env.ENABLE_RECOVERY_UAT; else process.env.ENABLE_RECOVERY_UAT = previous;
});
const post = async (body, operation = 'review') => {
  const response = await fetch(`${base}/api/v1/recovery-uat/planning/${operation}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { status: response.status, cache: response.headers.get('cache-control'), body: await response.json() };
};
test('planning review preserves scope/evidence, evaluates independent checks without ML calls or defaults', async () => {
  const aggregate = jest.spyOn(server.aiEngine, 'generateInsights');
  const predict = jest.spyOn(server.aiEngine.models.riskPrediction, 'predict');
  try {
    const body = fixture(); const first = await post(body);
    expect(first.status).toBe(200); expect(first.cache).toBe('no-store');
    expect(first.body.data.context).toEqual(body.context);
    expect(first.body.data.evidence).toEqual(body.evidence);
    expect(first.body.data.assessment.checks.every(c => c.status === 'triggered')).toBe(true);
    expect(first.body.data).not.toHaveProperty('riskPrediction');
    expect(first.body.data).not.toHaveProperty('teamSize');
    body.evidence.schedule.availableCapacityHours = 160;
    const next = await post(body);
    expect(next.body.data.reviewId).not.toBe(first.body.data.reviewId);
    expect(next.body.data.assessment.checks[0]).toMatchObject({ status: 'not_triggered', measurements: { shortfallHours: 0, ratio: .75 } });
    expect(next.body.data.assessment.checks.slice(1).every(c => c.status === 'triggered')).toBe(true);
    expect(aggregate).not.toHaveBeenCalled(); expect(predict).not.toHaveBeenCalled();
  } finally { aggregate.mockRestore(); predict.mockRestore(); }
});
test('unknown evidence remains not assessed; zero capacity remains a real shortfall', async () => {
  const body = fixture(); delete body.evidence.schedule.availableCapacityHours;
  expect((await post(body)).body.data.assessment.checks[0].status).toBe('not_assessed');
  body.evidence.schedule.availableCapacityHours = 0;
  expect((await post(body)).body.data.assessment.checks[0]).toMatchObject({ status: 'triggered', measurements: { shortfallHours: 120, ratio: null } });
  delete body.evidence;
  expect((await post(body, 'preview')).body.data.assessment.checks.every(c => c.status === 'not_assessed')).toBe(true);
  expect((await post(body, 'preview')).body.data).not.toHaveProperty('reviewId');
});
test.each([
  ['misaligned scope', b => { b.context.alignmentConfirmed = false; }],
  ['reversed period', b => { b.context.periodEnd = '2026-09-01'; }],
  ['invalid calendar date', b => { b.context.periodStart = '2026-02-30'; }],
  ['missing scope', b => { delete b.context.scope; }],
  ['duplicate items', b => { b.evidence.integrations.push({ ...b.evidence.integrations[0] }); }],
  ['negative hours', b => { b.evidence.schedule.remainingEffortHours = -1; }],
  ['experimental input', b => { b.teamSize = 4; }],
])('rejects %s without producing a review', async (_name, change) => {
  const body = fixture(); change(body); const response = await post(body);
  expect(response.status).toBe(400); expect(response.body).not.toHaveProperty('data');
});
test('mismatched or expired evidence cannot be presented as current', async () => {
  const body = fixture(); body.evidence.baselineId = 'old';
  expect((await post(body)).body.data.assessment.checks.every(c => c.status === 'not_assessed')).toBe(true);
  body.evidence.baselineId = 'v1'; body.evidence.reviewDue = new Date(Date.now() - 1000).toISOString();
  expect((await post(body)).body.data.assessment.checks.every(c => c.status === 'not_assessed')).toBe(true);
});
test('planning routes are absent without recovery opt-in', async () => {
  process.env.ENABLE_RECOVERY_UAT = 'false'; const disabled = new AIInsightsServer({ port: 0 });
  try {
    await disabled.start();
    const response = await fetch(`http://127.0.0.1:${disabled.server.address().port}/api/v1/recovery-uat/planning/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(fixture()) });
    expect(response.status).toBe(404);
  } finally { await disabled.shutdown(); process.env.ENABLE_RECOVERY_UAT = 'true'; }
});
