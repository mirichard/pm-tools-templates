import React from 'react';
import { FieldSchema, validateData, ValidationResult } from '../utils/validation';
export type { ValidationResult } from '../utils/validation';

type Props = {
  schema: FieldSchema;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>, validation: ValidationResult) => void;
};

export function SchemaForm({ schema, value, onChange }: Props) {
  const validation = validateData(schema, value);
  const updateValue = (path: string[], next: unknown) => {
    const updated = setAtPath(value, path, next) as Record<string, unknown>;
    onChange(updated, validateData(schema, updated));
  };
  const renderField = (path: string[], def: FieldSchema, required = false, title?: string): React.ReactNode => {
    const id = `field-${path.join('-')}`;
    const errId = `${id}-error`;
    const label = title || def.title || path[path.length - 1];
    const val = getAtPath(value, path);
    const errors = validation.byField[`/${path.join('/')}`] || [];
    const error = errors.length > 0 && <div id={errId} className="error">{errors.join('; ')}</div>;
    const aria = { 'aria-required': required, 'aria-invalid': errors.length > 0, 'aria-describedby': errors.length ? errId : undefined };

    if (def.type === 'array') {
      const arr = Array.isArray(val) ? val : [];
      const item = def.items || {};
      return <fieldset key={id}>
        <legend>{label}{required ? ' *' : ''}</legend>
        {error}
        {arr.map((_, index) => <div key={`${id}-${index}`}>
          {renderField([...path, String(index)], item, false, `${label} ${index + 1}`)}
        </div>)}
        <button id={`${id}-add`} type="button" aria-label={`Add ${label} item`} onClick={() => updateValue(path, [...arr, item.type === 'object' ? {} : ''])}>Add Item</button>
        {arr.length > 0 && <button type="button" aria-label={`Remove last ${label} item`} onClick={() => { updateValue(path, arr.slice(0, -1)); if (arr.length === 1) document.getElementById(`${id}-add`)?.focus(); }}>Remove Last</button>}
      </fieldset>;
    }
    if (def.type === 'object') return <fieldset key={id}>
      <legend>{label}</legend>
      {Object.entries(def.properties || {}).map(([key, sub]) => renderField([...path, key], sub, def.required?.includes(key)))}
    </fieldset>;

    const text = typeof val === 'string' || typeof val === 'number' ? val : '';
    return <div key={id}>
      <label htmlFor={id}>{label}{required ? ' *' : ''}</label>
      {def.enum ? <select id={id} {...aria} value={text} onChange={e => updateValue(path, e.target.value)}>
        <option value="">Select…</option>
        {def.enum.map(option => <option key={option}>{option}</option>)}
      </select> : def.type === 'number' || def.type === 'integer' ?
        <input id={id} type="number" step={def.type === 'integer' ? 1 : 'any'} {...aria} value={text} onChange={e => updateValue(path, e.target.value === '' ? undefined : Number(e.target.value))} /> :
        /scope|purpose|criteria/i.test(label) ? <textarea id={id} rows={5} {...aria} value={text} onChange={e => updateValue(path, e.target.value)} /> :
        <input id={id} type="text" {...aria} value={text} onChange={e => updateValue(path, e.target.value)} />}
      {error}
    </div>;
  };
  return <form onSubmit={e => e.preventDefault()} aria-describedby="form-help">
    <p id="form-help">Fields marked * are required. Incomplete work can be saved or downloaded as a draft.</p>
    {Object.entries(schema.properties || {}).map(([key, def]) => renderField([key], def, schema.required?.includes(key)))}
  </form>;
}

function getAtPath(value: unknown, path: string[]): unknown {
  return path.reduce<unknown>((current, key) => current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined, value);
}
function setAtPath(value: unknown, path: string[], next: unknown): unknown {
  if (!path.length) return next;
  const [key, ...rest] = path;
  if (Array.isArray(value)) {
    const copy = [...value];
    copy[Number(key)] = setAtPath(copy[Number(key)], rest, next);
    return copy;
  }
  const copy = { ...(value as Record<string, unknown> || {}) };
  if (!rest.length && next === undefined) delete copy[key];
  else copy[key] = setAtPath(copy[key], rest, next);
  return copy;
}
