/** Evidence-based checks; independent of the untrained risk classifier. */
export function assessPlanning(project, now = new Date()) {
  const evidence = project.planningAssessment;
  const assessedAt = now.toISOString();
  const result = (id, status, reason, references = [], measurements = {}, recommendation = null) => ({
    ruleId: id, ruleVersion: '1.0.0', status, reason,
    evidenceReferences: references, measurements, recommendation,
  });
  const unavailable = reason => ({
    schemaVersion: 'planning-v1', assessedAt,
    checks: ['capacity', 'dependencies', 'integrations', 'skills'].map(id =>
      result(id, 'not_assessed', reason)),
  });
  if (!evidence) return unavailable('Planning evidence was not supplied');
  if (!project.baselineId || !evidence.baselineId || !evidence.assessedAt || !evidence.reviewDue) {
    return unavailable('Baseline, assessment date and review-due date are required');
  }
  if (project.baselineId !== evidence.baselineId) return unavailable('Evidence baseline does not match the current plan');
  if (now >= new Date(evidence.reviewDue)) return unavailable('Evidence review is due');
  if (now < new Date(evidence.assessedAt)) return unavailable('Evidence assessment date is in the future');
  const checks = [];
  const schedule = evidence.schedule;
  if (!schedule || schedule.remainingEffortHours == null || schedule.availableCapacityHours == null ||
      !schedule.assumptions || !schedule.evidenceReferences?.length) {
    checks.push(result('capacity', 'not_assessed', 'Effort, qualified capacity, assumptions and evidence references are required'));
  } else {
    const effort = schedule.remainingEffortHours;
    const capacity = schedule.availableCapacityHours;
    const measurements = { remainingEffortHours: effort, availableCapacityHours: capacity,
      shortfallHours: Math.max(0, effort - capacity), ratio: capacity > 0 ? effort / capacity : null };
    const status = effort === 0 && capacity === 0 ? 'not_assessed' : effort >= capacity ? 'triggered' : 'not_triggered';
    const reason = effort === 0 && capacity === 0 ? 'No useful capacity ratio' :
      effort > capacity ? 'Capacity shortfall' : effort === capacity ? 'No capacity margin' : 'No aggregate capacity shortfall detected';
    checks.push(result('capacity', status, reason, schedule.evidenceReferences, measurements,
      status === 'triggered' ? 'Review scope, qualified capacity or delivery date; no fixed extension is inferred' : null));
  }
  const collections = [
    ['dependencies', schedule?.dependencies, item => new Date(item.availableAt) > new Date(item.neededAt),
      item => item.availableAt && item.neededAt, 'Prerequisite arrives after it is needed', 'Resolve prerequisite or replan'],
    ['integrations', evidence.integrations, item => item.status === 'blocked',
      item => ['verified', 'blocked'].includes(item.status) && (item.status !== 'blocked' || item.issue),
      'Documented critical integration issue', 'Time-box a feasibility test with an accountable owner'],
    ['skills', evidence.skills, item => item.coverage === 'gap',
      item => ['confirmed', 'gap'].includes(item.coverage),
      'Confirmed skills coverage gap', 'Obtain qualified support, pairing or training with a due date'],
  ];
  for (const [id, items, triggered, complete, reason, advice] of collections) {
    if (!items?.length) {
      checks.push(result(id, 'not_assessed', 'No checks with supporting evidence were supplied'));
      continue;
    }
    for (const item of items) {
      const known = item.owner && item.evidenceReferences?.length && complete(item);
      checks.push({ ...result(id, !known ? 'not_assessed' : triggered(item) ? 'triggered' : 'not_triggered',
        !known ? 'Required readiness evidence or owner is missing' : triggered(item) ? reason : 'No exposure detected in this assessed check',
        item.evidenceReferences || [], {}, known && triggered(item) ? advice : null), subject: item.id });
    }
  }
  return { schemaVersion: 'planning-v1', assessedAt, baselineId: evidence.baselineId,
    evidenceAssessedAt: evidence.assessedAt, reviewDue: evidence.reviewDue, checks };
}
