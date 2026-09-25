import { assessPlanning } from '../../src/services/planningAssessment.js';
import { validateProjectInput } from '../../src/utils/validation.js';
const now = new Date('2026-09-25T12:00:00Z');
const project = (effort = 120, capacity = 80) => ({ baselineId: 'v1', duration: 14,
  planningAssessment: { baselineId: 'v1', assessedAt: '2026-09-24T12:00:00Z', reviewDue: '2026-09-26T12:00:00Z',
    schedule: { remainingEffortHours: effort, availableCapacityHours: capacity,
      assumptions: 'Net qualified capacity', evidenceReferences: ['plan-v1'] } } });
const capacityCheck = p => assessPlanning(p, now).checks.find(c => c.ruleId === 'capacity');
test.each([[120,80,'triggered',40,1.5],[80,80,'triggered',0,1],[40,80,'not_triggered',0,0.5],
  [10,0,'triggered',10,null],[0,0,'not_assessed',0,null]])('capacity boundary %s/%s', (effort, capacity, status, shortfallHours, ratio) => {
  expect(capacityCheck(project(effort, capacity))).toMatchObject({ status, measurements: { shortfallHours, ratio } });
});
test('duration and stack size alone cannot establish exposure', () => {
  expect(assessPlanning({ duration: 1, technologies: Array(20).fill('tool') }, now).checks.every(c => c.status === 'not_assessed')).toBe(true);
  expect(capacityCheck({ ...project(40,80), duration: 1 }).status).toBe('not_triggered');
});
test.each(['missing','expired','mismatch'])('unusable evidence: %s', condition => {
  const p = project();
  if (condition === 'missing') delete p.planningAssessment.assessedAt;
  if (condition === 'expired') p.planningAssessment.reviewDue = now.toISOString();
  if (condition === 'mismatch') p.baselineId = 'v2';
  expect(assessPlanning(p, now).checks.every(c => c.status === 'not_assessed')).toBe(true);
});
test.each([-1,NaN,Infinity,'80'])('reject invalid numeric evidence %s', value => {
  expect(validateProjectInput(project(value)).error).toBeDefined();
});
test('reject invalid timestamp order and future assessment', () => {
  const p = project(); p.planningAssessment.reviewDue = p.planningAssessment.assessedAt;
  expect(validateProjectInput(p).error).toBeDefined();
  p.planningAssessment.assessedAt = '2999-01-01T00:00:00Z';
  expect(validateProjectInput(p).error).toBeDefined();
});
test('dependency, integration and skill evidence distinguish gaps from unknowns', () => {
  const p = project(); const common = { owner: 'owner', evidenceReferences: ['evidence'] };
  p.planningAssessment.schedule.dependencies = [{ ...common, id: 'late', neededAt: '2026-09-25T00:00:00Z', availableAt: '2026-09-26T00:00:00Z' }];
  p.planningAssessment.integrations = [{ ...common, id: 'blocked', status: 'blocked', issue: 'failed test' }, { ...common, id: 'verified', status: 'verified' }, { id: 'unknown', status: 'blocked' }];
  p.planningAssessment.skills = [{ ...common, id: 'gap', coverage: 'gap' }, { ...common, id: 'unknown', coverage: 'unknown' }];
  expect(assessPlanning(p, now).checks.filter(c => c.subject).map(c => [c.subject,c.status])).toEqual([
    ['late','triggered'],['blocked','triggered'],['verified','not_triggered'],['unknown','not_assessed'],['gap','triggered'],['unknown','not_assessed'],
  ]);
  const validated = validateProjectInput(p);
  expect(validated.error).toBeUndefined();
  expect(assessPlanning(validated.value, now).checks).toEqual(assessPlanning(p, now).checks);
});
