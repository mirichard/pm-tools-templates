import Joi from 'joi';
import { randomUUID } from 'node:crypto';
import { planningSchema } from '../utils/validation.js';
import { assessPlanning } from './planningAssessment.js';

const text = Joi.string().trim().max(2000);
const calendarDate = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).custom((value, helpers) => {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? helpers.error('any.invalid') : value;
});
const applicability = Joi.object({
  state: Joi.string().valid('include', 'unknown', 'not_applicable').required(),
  reason: text.when('state', { is: 'not_applicable', then: Joi.required(), otherwise: Joi.optional() }),
});
const handoff = Joi.object({
  id: text.required(), owner: text,
  evidenceReferences: Joi.array().items(text).min(1),
  status: Joi.string().valid('verified', 'blocked', 'unknown'), issue: text,
});
const reviewEvidence = planningSchema.keys({ integrations: Joi.forbidden(), handoffs: Joi.array().items(handoff) });
export const reviewSchema = Joi.object({
  context: Joi.object({
    projectName: text.required(), scope: text.required(), periodStart: calendarDate.required(),
    periodEnd: calendarDate.required(), asOf: calendarDate.required(), timezone: text.required(),
    decision: text.required(), planVersion: text.required(),
    alignmentConfirmed: Joi.boolean().strict().valid(true).required(),
  }).required(),
  applicability: Joi.object(Object.fromEntries(['capacity', 'dependencies', 'handoffs', 'skills'].map(key => [key, applicability.required()]))).required(),
  evidence: reviewEvidence.default({}),
}).custom((value, helpers) => {
  if (value.context.periodEnd < value.context.periodStart) return helpers.error('any.invalid');
  const groups = [value.evidence.schedule?.dependencies, value.evidence.handoffs, value.evidence.skills];
  for (const group of groups) {
    if (group && new Set(group.map(item => item.id.trim())).size !== group.length) return helpers.error('any.invalid');
  }
  return value;
});

/** Separate planning endpoint: never invokes the experimental model or its defaults. */
export function planningReviewHandler(req, res) {
  if (!['preview', 'review'].includes(req.params.operation)) return res.status(404).json({ success: false });
  const { value, error } = reviewSchema.validate(req.body, { abortEarly: false, stripUnknown: false });
  if (error) return res.status(400).json({
    success: false,
    error: 'Check required review fields, date order, scope confirmation and unique item names.',
    details: error.details.map(item => ({ field: item.path.join('.'), message: item.message })),
  });
  // Reuse the established arithmetic/date checks; handoff semantics are defined here.
  const applicableEvidence = structuredClone(value.evidence);
  if (value.applicability.capacity.state !== 'include' && applicableEvidence.schedule) {
    for (const key of ['remainingEffortHours', 'availableCapacityHours', 'assumptions', 'evidenceReferences']) delete applicableEvidence.schedule[key];
  }
  if (value.applicability.dependencies.state !== 'include' && applicableEvidence.schedule) delete applicableEvidence.schedule.dependencies;
  if (value.applicability.skills.state !== 'include') delete applicableEvidence.skills;
  applicableEvidence.integrations = value.applicability.handoffs.state === 'include' ? applicableEvidence.handoffs : undefined;
  delete applicableEvidence.handoffs;
  const assessment = assessPlanning({ baselineId: value.context.planVersion, planningAssessment: applicableEvidence });
  assessment.schemaVersion = 'planning-review-checks-v2';
  const oldChecks = assessment.checks;
  assessment.checks = Object.entries(value.applicability).flatMap(([key, choice]) => {
    if (choice.state !== 'include') return [{
      ruleId: key, ruleVersion: '2.0.0', status: choice.state === 'not_applicable' ? 'not_applicable' : 'not_assessed',
      reason: choice.state === 'not_applicable' ? `Excluded by you: ${choice.reason}` : 'You have not yet decided whether this check applies.',
      evidenceReferences: [], measurements: {},
      recommendation: choice.state === 'not_applicable' ? 'Reconsider this exclusion if the work changes. No assessment was performed.' : 'Decide whether this check is relevant; include it or explain why it does not apply.',
    }];
    return oldChecks.filter(check => check.ruleId === (key === 'handoffs' ? 'integrations' : key)).map(check => {
      if (key !== 'handoffs') return check;
      return { ...check, ruleId: 'handoffs', ruleVersion: '2.0.0',
        reason: check.status === 'triggered' ? 'A required handoff has a documented unresolved issue' : check.status === 'not_triggered' ? 'No issue found in this handoff based on the supplied information' : check.reason,
        recommendation: check.status === 'triggered' ? 'Agree what the receiving person needs, assign the corrective action and confirm readiness before the handoff is needed.' : check.recommendation,
      };
    });
  });
  res.setHeader('Cache-Control', 'no-store');
  return res.json({ success: true, data: {
    schemaVersion: 'planning-review-v2',
    ...(req.params.operation === 'review' ? { reviewId: randomUUID() } : {}),
    context: value.context, applicability: value.applicability, evidence: value.evidence, assessment,
  } });
}
