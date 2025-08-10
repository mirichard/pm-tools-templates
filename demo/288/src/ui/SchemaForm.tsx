import React from 'react';
import Ajv, { ErrorObject } from 'ajv';

export type ValidationResult = { valid: boolean; errors: string[]; byField: Record<string, string[]> };
const ajv = new Ajv({ allErrors: true, strict: false });

type Props = {
  schema: any;
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>, validation: ValidationResult) => void;
};

export function SchemaForm({ schema, value, onChange }: Props) {
  const validate = React.useMemo(() => ajv.compile(schema), [schema]);

  const updateValue = (path: string[], next: any) => {
    const updated = setAtPath(value, path, next);
    const valid = validate(updated);
    const ajvErrors = validate.errors || [];
    const errors = ajvErrors.map(formatAjvError);
    const byField = groupErrorsByField(ajvErrors);
    onChange(updated, { valid: !!valid, errors, byField });
  };

  const renderField = (path: string[], key: string, def: any) => {
    const id = `field-${[...path, key].join('-')}`;
    const errId = `err-${[...path, key].join('-')}`;
    const fullPath = [...path, key];
    const val = getAtPath(value, fullPath);
    const label = def.title || key;
    const requiredList: string[] = (path.length === 0 ? (schema.required || []) : (def.required || [])) as string[];
    const isRequired = requiredList?.includes(key) || false;
    const fieldKey = fullPath[0];

    if (def.type === 'array') {
      const arr = Array.isArray(val) ? (val as any[]) : [];
      const items = def.items || {};
      if (items.type === 'object') {
        return (
          <div key={id}>
            <label>{label}{isRequired ? ' *' : ''}</label>
            {arr.map((_, idx) => (
              <fieldset key={`${id}-${idx}`} style={{ border: '1px solid #eee', padding: 8, marginTop: 8 }}>
                <legend>Item {idx + 1}</legend>
                {Object.entries(items.properties || {}).map(([k, subDef]: any) => (
                  renderField([...fullPath, String(idx)], k as string, subDef)
                ))}
              </fieldset>
            ))}
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => {
                const newObj: any = {};
                Object.keys(items.properties || {}).forEach(k => newObj[k] = '');
                updateValue(fullPath, [...arr, newObj]);
              }}>Add Item</button>
              {arr.length > 0 && (
                <button type="button" onClick={() => updateValue(fullPath, arr.slice(0, -1))}>Remove Last</button>
              )}
            </div>
          </div>
        );
      }
    }

    if (def.type === 'object' && def.properties) {
      return (
        <fieldset key={id} style={{ border: '1px solid #eee', padding: 8, marginTop: 8 }}>
          <legend>{label}</legend>
          {Object.entries(def.properties).map(([k, subDef]: any) => renderField(fullPath, k as string, subDef))}
        </fieldset>
      );
    }

    if (def.enum) {
      return (
        <div key={id}>
          <label htmlFor={id}>{label}{isRequired ? ' *' : ''}</label>
          <select id={id} aria-required={isRequired} aria-invalid={hasFieldError(fieldKey)} aria-describedby={hasFieldError(fieldKey) ? errId : undefined}
            value={String(val ?? '')} onChange={(e) => updateValue(fullPath, e.target.value)}>
            <option value="">Select…</option>
            {def.enum.map((opt: string) => (<option key={opt} value={opt}>{opt}</option>))}
          </select>
          {renderErrors(fieldKey, errId)}
        </div>
      );
    }

    if (def.type === 'number' || def.type === 'integer') {
      return (
        <div key={id}>
          <label htmlFor={id}>{label}{isRequired ? ' *' : ''}</label>
          <input id={id} type="number" aria-required={isRequired} aria-invalid={hasFieldError(fieldKey)} aria-describedby={hasFieldError(fieldKey) ? errId : undefined}
            value={(val as any) ?? ''}
            onChange={(e) => updateValue(fullPath, e.target.value === '' ? undefined : Number(e.target.value))} />
          {renderErrors(fieldKey, errId)}
        </div>
      );
    }

    const isTextarea = (def.type === 'string') && (label.toLowerCase().includes('scope') || label.toLowerCase().includes('purpose') || label.toLowerCase().includes('criteria'));
    return (
      <div key={id}>
        <label htmlFor={id}>{label}{isRequired ? ' *' : ''}</label>
        {isTextarea ? (
          <textarea id={id} rows={5} aria-required={isRequired} aria-invalid={hasFieldError(fieldKey)} aria-describedby={hasFieldError(fieldKey) ? errId : undefined}
            value={(val as any) ?? ''} onChange={(e) => updateValue(fullPath, e.target.value)} />
        ) : (
          <input id={id} type="text" aria-required={isRequired} aria-invalid={hasFieldError(fieldKey)} aria-describedby={hasFieldError(fieldKey) ? errId : undefined}
            value={(val as any) ?? ''} onChange={(e) => updateValue(fullPath, e.target.value)} />
        )}
        {renderErrors(fieldKey, errId)}
      </div>
    );
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} aria-describedby="form-help">
      {Object.entries(schema.properties || {}).map(([k, def]) => renderField([], k, def))}
      <p id="form-help" style={{ fontSize: 12, color: '#666', marginTop: 12 }}>Required fields: {(schema.required || []).join(', ') || 'None'}</p>
    </form>
  );

  function hasFieldError(fieldKey: string): boolean {
    const m = byFieldRef();
    return !!(m[fieldKey] && m[fieldKey].length);
  }
  function renderErrors(fieldKey: string, errId: string) {
    const m = byFieldRef();
    if (!m[fieldKey] || m[fieldKey].length === 0) return null;
    const regionId = `errors-${fieldKey}-region`;
    return (
      <div id={regionId} role="alert" aria-live="assertive" aria-atomic={false} className="error">
        <ul role="list" id={errId}>
          {m[fieldKey].map((msg, i) => (
            <li role="listitem" key={i} id={`error-${fieldKey}-${i}`}>{msg}</li>
          ))}
        </ul>
      </div>
    );
  }
  function byFieldRef(): Record<string, string[]> {
    const ok = validate(value);
    const grouped = groupErrorsByField(validate.errors || []);
    return grouped;
  }
}

function formatAjvError(e: ErrorObject): string {
  const path = e.instancePath ? e.instancePath.replace(/\//g, '.').replace(/^\./, '') : '';
  const at = path ? ` at ${path}` : '';
  return `${e.message || 'Invalid value'}${at}`;
}

function groupErrorsByField(errors: ErrorObject[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const e of errors) {
    const path = e.instancePath ? e.instancePath.replace(/^\//, '') : '';
    const key = path.split('/')[0] || (e.params as any)?.missingProperty || '';
    if (!key) continue;
    const msg = e.message || 'Invalid value';
    if (!map[key]) map[key] = [];
    map[key].push(msg);
  }
  return map;
}

function getAtPath(obj: any, path: string[]): any { return path.reduce((acc, k) => (acc && typeof acc === 'object') ? acc[k] : undefined, obj); }
function setAtPath(obj: any, path: string[], value: any): any {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const clone = Array.isArray(obj) ? [...obj] : { ...(obj || {}) };
  clone[head] = rest.length ? setAtPath(clone[head], rest, value) : value;
  return clone;
}
