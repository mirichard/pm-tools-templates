import React from 'react';
// @ts-ignore - types not provided
import { diffLines } from 'diff';

export function DiffView({ a, b }: { a: string, b: string }) {
  const parts: any[] = diffLines(a, b) as any[];
  return (
    <pre aria-label="Diff" style={{ background: '#fafafa', padding: 12, borderRadius: 8, border: '1px solid #eee', overflowX: 'auto' }}>
      {parts.map((p: any, i: number) => (
        <span key={i} style={{ background: p.added ? '#e6ffed' : p.removed ? '#ffeef0' : undefined }}>
          {p.value}
        </span>
      ))}
    </pre>
  );
}
