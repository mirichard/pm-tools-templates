import React from 'react';

export type Version = { name: string; data: Record<string, unknown>; createdAt: number };

export function Toolbar({ markdown, templateKey, data, onLoadVersion, onDiffRequest }:
  { markdown: string, templateKey: string, data: Record<string, unknown>, onLoadVersion: (v: Version)=>void, onDiffRequest: (a: Version, b: Version)=>void }) {
  const [verName, setVerName] = React.useState('');
  const versions = getVersions(templateKey);
  const [vA, setVA] = React.useState<string>('');
  const [vB, setVB] = React.useState<string>('');

  return (
    <div className="toolbar" aria-label="Actions">
      <button onClick={()=>download(`${templateKey}.md`, markdown)}>Download Markdown</button>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <input aria-label="Version name" placeholder="Version name" value={verName} onChange={e=>setVerName(e.target.value)} />
        <button onClick={()=>{ if(!verName.trim()) return; saveVersion(templateKey, { name: verName.trim(), data, createdAt: Date.now() }); setVerName(''); }}>Save Version</button>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <label>Load:</label>
        <select aria-label="Load version" value="" onChange={e => { const v = versions.find(x => keyOf(x)===e.target.value); if (v) onLoadVersion(v); }}>
          <option value="">Select…</option>
          {versions.map(v => <option key={keyOf(v)} value={keyOf(v)}>{v.name}</option>)}
        </select>
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <label>Diff:</label>
        <select aria-label="Diff A" value={vA} onChange={e=>setVA(e.target.value)}>
          <option value="">A…</option>
          {versions.map(v => <option key={keyOf(v)} value={keyOf(v)}>{v.name}</option>)}
        </select>
        <select aria-label="Diff B" value={vB} onChange={e=>setVB(e.target.value)}>
          <option value="">B…</option>
          {versions.map(v => <option key={keyOf(v)} value={keyOf(v)}>{v.name}</option>)}
        </select>
        <button onClick={()=>{ const a = versions.find(x=>keyOf(x)===vA); const b = versions.find(x=>keyOf(x)===vB); if (a && b) onDiffRequest(a,b); }}>Show Diff</button>
      </div>
    </div>
  );
}

function download(name: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function storageKey(templateKey: string) { return `pmtools:demo288:versions:${templateKey}`; }
export function getVersions(templateKey: string): Version[] {
  try { const raw = localStorage.getItem(storageKey(templateKey)); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
export function saveVersion(templateKey: string, v: Version) {
  const list = getVersions(templateKey);
  list.push(v);
  localStorage.setItem(storageKey(templateKey), JSON.stringify(list));
}
export function keyOf(v: Version) { return `${v.name}:${v.createdAt}`; }
