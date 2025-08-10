export function toCharterMarkdown(data: Record<string, any>): string {
  const d = data || {};
  const lines: string[] = [];
  lines.push(`# ${d.projectName || 'Project Charter'}`);
  if (d.sponsor) lines.push(`- Sponsor: ${d.sponsor}`);
  lines.push('');
  lines.push('## Purpose');
  lines.push(block(d.purpose));
  lines.push('');
  lines.push('## Scope');
  lines.push(block(d.scope));
  lines.push('');
  lines.push('## Success Criteria');
  lines.push(block(d.successCriteria));
  lines.push('');
  return lines.join('\n');
}
function block(v: unknown){ const s = (v ?? '').toString().trim(); return s.length ? s : '_(not provided)_'; }
