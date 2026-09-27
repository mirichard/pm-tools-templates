import React, { useEffect, useMemo, useState } from 'react';
import { SchemaForm } from './SchemaForm';
import { MarkdownPreview } from './MarkdownPreview';
import { TemplatePicker } from './TemplatePicker';
import { Toolbar, Version } from './Toolbar';
import { DiffView } from './DiffView';
import { schemas, toMarkdown } from '../utils/templates';
import { validateData } from '../utils/validation';

export default function App() {
  const [template, setTemplate] = useState<keyof typeof schemas>('charter');
  const [drafts, setDrafts] = useState<Partial<Record<keyof typeof schemas, Record<string, unknown>>>>({});
  const [dirty, setDirty] = useState<Partial<Record<keyof typeof schemas, boolean>>>({});
  const data = drafts[template] || {};
  const validation = validateData(schemas[template], data);
  const setData = (next: Record<string, unknown>, unsaved: boolean) => {
    setDrafts(previous => ({ ...previous, [template]: next }));
    setDirty(previous => ({ ...previous, [template]: unsaved }));
    setShowDiff({});
  };
  useEffect(() => {
    if (!Object.values(dirty).some(Boolean)) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
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
  const exportedMarkdown = validation.valid ? md : `> DRAFT — required information is missing or invalid. Review before use.\n\n${md}`;

  return (
    <main className="container" id="main" tabIndex={-1}>
      <section className="panel" aria-labelledby="editor-h">
        <h2 id="editor-h">Template Editor <span className="badge">Completion: {completion}%</span></h2>
        <p>Choose a template, enter your project information, then review and download the generated Markdown document.</p>
        <p>Switching templates retains drafts during this visit. Save a named version before reloading or leaving. Versions are stored only in this browser and may be cleared; download a backup.</p>
        <TemplatePicker value={template} onChange={(t)=>{ setTemplate(t); setShowDiff({}); }} />
        <p>{dirty[template] ? "Current template has unsaved changes." : "Use Save Version to keep a named copy in this browser."}</p>
        <Toolbar
          key={template}
          markdown={exportedMarkdown}
          templateKey={template}
          data={data}
          onSaved={() => setDirty(previous => ({ ...previous, [template]: false }))}
          onLoadVersion={(v)=> {
            if (!dirty[template] || window.confirm('Replace this unsaved draft with the saved version? Cancel to keep editing.')) setData(v.data, false);
          }}
          onDiffRequest={(a,b)=> setShowDiff({ a, b })}
        />
        <SchemaForm schema={schemas[template]} value={data} onChange={(next)=> setData(next, true)} />
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
            <h3>Saved version comparison: {showDiff.a.name} vs {showDiff.b.name}</h3>
            <p>Download uses the current draft, not this comparison.</p>
            <button onClick={() => setShowDiff({})}>Return to current preview</button>
            <DiffView a={toMarkdown(template, showDiff.a.data)} b={toMarkdown(template, showDiff.b.data)} />
          </div>
        ) : (
          <MarkdownPreview markdown={md} />
        )}
      </section>
    </main>
  );
}
