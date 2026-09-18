import React from 'react';
import { diffLines, type Change } from 'diff';

type Props = { a: string; b: string };

export function DiffView({ a, b }: Props) {
  const parts = diffLines(a, b);
  return (
    <pre aria-label="Diff" style={{ background: '#fafafa', padding: 12, borderRadius: 8, border: '1px solid #eee', overflowX: 'auto' }}>
      {parts.map((p: Change, i: number) => (
        <span key={i} style={{ background: p.added ? '#e6ffed' : p.removed ? '#ffeef0' : undefined }}>
          {p.value}
        </span>
      ))}
    </pre>
  );
}
