import React from 'react';

type TemplateKey = 'charter' | 'risk' | 'stakeholder' | 'sprint' | 'executive';
export function TemplatePicker({ value, onChange }: { value: TemplateKey, onChange: (t: TemplateKey)=>void }) {
  return (
    <div className="toolbar" role="radiogroup" aria-label="Template">
      {([
        ['charter','Project Charter'],
        ['risk','Risk Register'],
        ['stakeholder','Stakeholder Plan'],
        ['sprint','Sprint Planning'],
        ['executive','Executive Status'],
      ] as const).map(([k,label]) => (
        <label key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type="radio" name="template" value={k} checked={value===k} onChange={()=>onChange(k as TemplateKey)} />
          {label}
        </label>
      ))}
    </div>
  );
}
