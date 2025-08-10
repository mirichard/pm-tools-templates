export function toCharterMarkdown(data: Record<string, unknown>): string {
  const d = data as any;
  const lines: string[] = [];
  lines.push(`# ${d.projectName || 'Project Charter'}`);
  if (d.sponsor) lines.push(`- Sponsor: ${d.sponsor}`);
  lines.push('');
  lines.push('## Purpose');
  lines.push(safeBlock(d.purpose));
  lines.push('');
  lines.push('## Scope');
  lines.push(safeBlock(d.scope));
  lines.push('');
  lines.push('## Success Criteria');
  lines.push(safeBlock(d.successCriteria));
  lines.push('');
  return lines.join('\n');
}

function safeBlock(v: unknown): string {
  const s = (v ?? '').toString().trim();
  return s.length ? s : '_(not provided)_';
}
