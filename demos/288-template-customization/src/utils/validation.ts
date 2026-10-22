import Ajv, { ErrorObject } from 'ajv';

export type FieldSchema = {
  type?: string;
  title?: string;
  properties?: Record<string, FieldSchema>;
  items?: FieldSchema;
  required?: readonly string[];
  enum?: readonly string[];
};
export type ValidationResult = { valid: boolean; errors: string[]; byField: Record<string, string[]> };
const ajv = new Ajv({ allErrors: true, strict: false });

export function validateData(schema: FieldSchema, value: Record<string, unknown>): ValidationResult {
  const validate = ajv.compile(schema);
  const valid = !!validate(value);
  const byField: Record<string, string[]> = {};
  const errors = (validate.errors || []).map((e: ErrorObject) => {
    const path = e.keyword === 'required' ? `${e.instancePath}/${e.params.missingProperty}` : e.instancePath;
    const label = path.slice(1).split('/').join(' › ') || 'Form';
    const message = `${label}: ${e.message || 'Invalid value'}`;
    (byField[path] ||= []).push(message);
    return message;
  });
  return { valid, errors, byField };
}

// Stored drafts may be incomplete, but must have the template's data types.
export function hasDraftShape(schema: FieldSchema, value: unknown): boolean {
  if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    return Object.entries(value).every(([key, item]) =>
      Object.prototype.hasOwnProperty.call(schema.properties || {}, key) && hasDraftShape(schema.properties![key], item));
  }
  if (schema.type === 'array') return Array.isArray(value) && value.every(item => hasDraftShape(schema.items || {}, item));
  if (schema.type === 'number' || schema.type === 'integer') return typeof value === 'number' && Number.isFinite(value);
  return typeof value === 'string' && (!schema.enum || value === '' || schema.enum.includes(value));
}
