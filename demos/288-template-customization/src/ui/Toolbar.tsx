import React from 'react';
import { schemas } from '../utils/templates';
import { hasDraftShape } from '../utils/validation';

export type Version = { name: string; data: Record<string, unknown>; createdAt: number };
type TemplateKey = keyof typeof schemas;

export function Toolbar({ markdown, templateKey, data, onLoadVersion, onDiffRequest, onSaved }:
  { markdown: string; templateKey: TemplateKey; data: Record<string, unknown>; onLoadVersion: (v: Version)=>void; onDiffRequest: (a: Version, b: Version)=>void; onSaved: ()=>void }) {
  const [verName, setVerName] = React.useState('');
  const [versions, setVersions] = React.useState<Version[]>([]);
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [vA, setVA] = React.useState('');
  const [vB, setVB] = React.useState('');
  React.useEffect(() => {
    const refresh = () => {
      try { setVersions(getVersions(templateKey)); setError(''); }
      catch { setVersions([]); setError('Saved versions could not be read. Existing storage has not been changed. Download your current draft and use Retry after restoring browser storage or repairing the stored data.'); }
    };
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [templateKey]);

  const retry = () => {
    try { setVersions(getVersions(templateKey)); setError(''); setNotice('Saved versions refreshed.'); }
    catch { setError('Saved versions remain unavailable. Download your draft before repairing browser storage.'); }
  };
  const save = () => {
    setNotice('');
    if (!verName.trim()) { setError('Enter a version name before saving.'); return; }
    try {
      const list = saveVersion(templateKey, { name: verName.trim(), data, createdAt: Date.now() });
      setVersions(list); setVerName(''); setError(''); setNotice('Version saved in this browser.'); onSaved();
    } catch {
      setError('Version not saved. Your draft is still available. Download Markdown as a backup, then free browser storage or restore access and retry. Existing saved data has not been overwritten.');
    }
  };
  const load = (key: string) => {
    if (!key) return;
    try {
      const fresh = getVersions(templateKey);
      setVersions(fresh);
      const version = fresh.find(v => keyOf(v) === key);
      if (!version) throw new Error('Version unavailable');
      onLoadVersion(version); setError(''); setNotice('');
    } catch { setError('Saved versions changed or could not be read. Retry to refresh the list; your current draft has been retained.'); }
  };
  return <>
    <div className="toolbar" aria-label="Actions">
      <button onClick={() => download(`${templateKey}.md`, markdown)}>Download Markdown</button>
      <div className="version-controls">
        <input aria-label="Version name" placeholder="Version name" value={verName} onChange={e => setVerName(e.target.value)} />
        <button onClick={save}>Save Version</button>
      </div>
      <div className="version-controls">
        <label htmlFor="load-version">Load:</label>
        <select id="load-version" aria-label="Load version" value="" onChange={e => load(e.target.value)}>
          <option value="">Select…</option>
          {versions.map(v => <option key={keyOf(v)} value={keyOf(v)}>{v.name}</option>)}
        </select>
      </div>
      <div className="version-controls">
        <span>Diff:</span>
        <select aria-label="Diff A" value={vA} onChange={e => setVA(e.target.value)}>
          <option value="">A…</option>
          {versions.map(v => <option key={keyOf(v)} value={keyOf(v)}>{v.name}</option>)}
        </select>
        <select aria-label="Diff B" value={vB} onChange={e => setVB(e.target.value)}>
          <option value="">B…</option>
          {versions.map(v => <option key={keyOf(v)} value={keyOf(v)}>{v.name}</option>)}
        </select>
        <button disabled={!versions.some(v => keyOf(v) === vA) || !versions.some(v => keyOf(v) === vB)} onClick={() => {
          const a = versions.find(v => keyOf(v) === vA);
          const b = versions.find(v => keyOf(v) === vB);
          if (a && b) onDiffRequest(a, b);
        }}>Show Diff</button>
      </div>
    </div>
    {error && <div role="alert" className="error">{error} <button onClick={retry}>Retry</button></div>}
    <p role="status">{notice}</p>
  </>;
}
function download(name: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
function storageKey(templateKey: string) { return `pmtools:demo288:versions:${templateKey}`; }
export function getVersions(templateKey: TemplateKey): Version[] {
  const raw = localStorage.getItem(storageKey(templateKey));
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(v =>
    v && typeof v === 'object' && typeof v.name === 'string' && v.name.trim() &&
    typeof v.createdAt === 'number' && Number.isFinite(v.createdAt) && hasDraftShape(schemas[templateKey], v.data)
  )) throw new Error('Invalid saved versions');
  const keys = parsed.map(keyOf);
  if (new Set(keys).size !== keys.length) throw new Error('Duplicate saved versions');
  return parsed;
}
export function saveVersion(templateKey: TemplateKey, v: Version): Version[] {
  // Re-read before appending: never replace unreadable storage with an empty list.
  const list = getVersions(templateKey);
  if (!hasDraftShape(schemas[templateKey], v.data)) throw new Error('Invalid draft');
  const createdAt = Math.max(v.createdAt, ...list.map(item => item.createdAt + 1));
  const next = [...list, { ...v, createdAt }];
  localStorage.setItem(storageKey(templateKey), JSON.stringify(next));
  return next;
}
export function keyOf(v: Version) { return `${v.name}:${v.createdAt}`; }
