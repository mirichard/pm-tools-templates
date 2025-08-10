import React, { useMemo, useState } from 'react';
import charterSchema from '@schemas/project_charter.schema.json';
import riskSchema from '@schemas/risk_register.schema.json';
import stakeholderSchema from '@schemas/stakeholder_communication_plan.schema.json';
import sprintSchema from '@schemas/sprint_planning.schema.json';
import executiveSchema from '@schemas/executive_status_report.schema.json';
import { SchemaForm, ValidationResult } from './components/SchemaForm';
import { MarkdownPreview } from './components/MarkdownPreview';
import { toCharterMarkdown } from './templates/charter.md';
import { toRiskMarkdown } from './templates/risk.md';
import { toStakeholderMarkdown } from './templates/stakeholder.md';
import { toSprintMarkdown } from './templates/sprint.md';
import { toExecutiveMarkdown } from './templates/executive.md';
import { TemplatePicker } from './components/TemplatePicker';
import { Toolbar, Version } from './components/Toolbar';
import { DiffView } from './components/DiffView';
import { useCharterCollab } from './collab/useCharterCollab';

export default function App() {
  const [template, setTemplate] = useState<'charter'|'risk'|'stakeholder'|'sprint'|'executive'>('charter');
  const [data, setData] = useState<Record<string, unknown>>({});
  const [validation, setValidation] = useState<ValidationResult>({ valid: true, errors: [], byField: {} });
  const [showDiff, setShowDiff] = useState<{a?: Version, b?: Version}>({});
  const [collabEnabled, setCollabEnabled] = useState(false);
  const { ymap } = useCharterCollab(collabEnabled && template==='charter');

  // sync local data to Yjs and vice versa for charter
  React.useEffect(() => {
    if (!ymap) return;
    const updateFromY = () => {
      const obj: any = {};
      ymap.forEach((v,k) => obj[k]=v);
      setData((prev) => ({ ...prev, ...obj }));
    };
    updateFromY();
    const observer = (e: any) => updateFromY();
    ymap.observe(observer);
    return () => { ymap.unobserve(observer); };
  }, [ymap]);

  const completion = useMemo(() => {
    const required = (charterSchema.required || []) as string[];
    const filled = required.filter((k) => {
      const v = (data as any)[k];
      return v !== undefined && v !== null && String(v).trim().length > 0;
    }).length;
    return required.length === 0 ? 100 : Math.round((filled / required.length) * 100);
  }, [data]);

  const activeSchema = useMemo(() => ({
    charter: charterSchema,
    risk: riskSchema,
    stakeholder: stakeholderSchema,
    sprint: sprintSchema,
    executive: executiveSchema,
  }[template] as any), [template]);

  const md = useMemo(() => {
    switch (template) {
      case 'charter': return toCharterMarkdown(data);
      case 'risk': return toRiskMarkdown(data);
      case 'stakeholder': return toStakeholderMarkdown(data);
      case 'sprint': return toSprintMarkdown(data);
      case 'executive': return toExecutiveMarkdown(data);
    }
  }, [template, data]);

  const handleChange = (next: any, v: ValidationResult) => {
    setData(next);
    setValidation(v);
    if (ymap && template==='charter') {
      // upsert keys from next into ymap
      Object.keys(next).forEach(k => ymap.set(k, (next as any)[k]));
    }
  };

  return (
    <div className="container" role="main" id="main">
      <section className="panel" aria-labelledby="editor-h">
        <h2 id="editor-h">Template Editor <span className="badge">Completion: {completion}%</span></h2>
        <TemplatePicker value={template} onChange={(t)=>{ setTemplate(t); setData({}); setShowDiff({}); }} />
        {template==='charter' && (
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <input type="checkbox" checked={collabEnabled} onChange={e=>setCollabEnabled(e.target.checked)} />
            Enable Collaboration (experimental)
          </label>
        )}
        <Toolbar
          markdown={md}
          templateKey={template}
          data={data}
          onLoadVersion={(v)=> setData(v.data)}
          onDiffRequest={(a,b)=> setShowDiff({ a, b })}
        />
        <SchemaForm
          schema={activeSchema}
          value={data}
          onChange={handleChange}
        />
        {!validation.valid && (
          <div aria-live="polite" className="error" style={{ marginTop: 8 }}>
            {validation.errors.map((e, i) => <div key={i}>• {e}</div>)}
          </div>
        )}
      </section>
      <section className="panel" aria-labelledby="preview-h">
        <h2 id="preview-h">Live Preview</h2>
        <div className="toolbar">
          <span className="badge">Markdown</span>
        </div>
        {showDiff.a && showDiff.b ? (
          <div>
            <h3>Diff: {showDiff.a.name} vs {showDiff.b.name}</h3>
            <DiffView a={toMarkdownFor(template, showDiff.a.data)} b={toMarkdownFor(template, showDiff.b.data)} />
          </div>
        ) : (
          <MarkdownPreview markdown={md} />
        )}
      </section>
    </div>
  );

  function toMarkdownFor(t: typeof template, d: any) {
    switch (t) {
      case 'charter': return toCharterMarkdown(d);
      case 'risk': return toRiskMarkdown(d);
      case 'stakeholder': return toStakeholderMarkdown(d);
      case 'sprint': return toSprintMarkdown(d);
      case 'executive': return toExecutiveMarkdown(d);
    }
  }
}
