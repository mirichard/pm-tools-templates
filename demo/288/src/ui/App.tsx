import React, { useMemo, useState } from 'react';
import { SchemaForm, ValidationResult } from './SchemaForm';
import { MarkdownPreview } from './MarkdownPreview';
import { TemplatePicker } from './TemplatePicker';
import { Toolbar, Version } from './Toolbar';
import { DiffView } from './DiffView';
import { schemas, toMarkdown } from '../utils/templates';

export default function App() {
  const [template, setTemplate] = useState<keyof typeof schemas>('charter');
  const [data, setData] = useState<Record<string, unknown>>({});
  const [validation, setValidation] = useState<ValidationResult>({ valid: true, errors: [], byField: {} });
  const [showDiff, setShowDiff] = useState<{a?: Version, b?: Version}>({});

  const completion = useMemo(() => {
    const required = ([...(schemas[template].required || [])] as unknown as string[]);
    const filled = required.filter(k => {
      const v = (data as any)[k];
      return v !== undefined && v !== null && String(v).trim().length > 0;
    }).length;
    return required.length === 0 ? 100 : Math.round((filled / required.length) * 100);
  }, [data, template]);

  const md = useMemo(() => toMarkdown(template, data), [template, data]);

  return (
    <div className="container" role="main" id="main">
      <section className="panel" aria-labelledby="editor-h">
        <h2 id="editor-h">Template Editor</h2>
        <div className="meta" aria-live="polite">
          <span className="badge">Completion: {completion}%</span>
        </div>
        <TemplatePicker value={template} onChange={(t)=>{ setTemplate(t); setData({}); setShowDiff({}); }} />
        <Toolbar
          markdown={md}
          templateKey={template}
          data={data}
          onLoadVersion={(v)=> setData(v.data)}
          onDiffRequest={(a,b)=> setShowDiff({ a, b })}
        />
        <SchemaForm schema={schemas[template]} value={data} onChange={(next, v)=> { setData(next); setValidation(v); }} />
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
            <DiffView a={toMarkdown(template, showDiff.a.data)} b={toMarkdown(template, showDiff.b.data)} />
          </div>
        ) : (
          <MarkdownPreview markdown={md} />
        )}
      </section>
    </div>
  );
}
