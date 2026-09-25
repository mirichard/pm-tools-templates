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
export const reviewSchema = Joi.object({
  context: Joi.object({
    projectName: text.required(), scope: text.required(), periodStart: calendarDate.required(),
    periodEnd: calendarDate.required(), asOf: calendarDate.required(), timezone: text.required(),
    decision: text.required(), source: text.required(), planVersion: text.required(),
    alignmentConfirmed: Joi.boolean().strict().valid(true).required(),
  }).required(),
  evidence: planningSchema.default({}),
}).custom((value, helpers) => {
  if (value.context.periodEnd < value.context.periodStart) return helpers.error('any.invalid');
  const groups = [value.evidence.schedule?.dependencies, value.evidence.integrations, value.evidence.skills];
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
  const assessment = assessPlanning({ baselineId: value.context.planVersion, planningAssessment: value.evidence });
  res.setHeader('Cache-Control', 'no-store');
  return res.json({ success: true, data: {
    schemaVersion: 'planning-review-v1',
    ...(req.params.operation === 'review' ? { reviewId: randomUUID() } : {}),
    context: value.context, evidence: value.evidence, assessment,
  } });
}
