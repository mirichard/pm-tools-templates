export function toExecutiveMarkdown(data: any): string {
  const lines: string[] = [];
  lines.push(`# Executive Status Report`);
  lines.push('');
  lines.push(`Reporting Period: ${data?.reportingPeriod || ''}`);
  lines.push(`Overall Health: ${data?.overallHealth || ''}`);
  lines.push('');
  lines.push('## Schedule / Budget / Scope');
  lines.push(`- Schedule: ${data?.schedule || ''}`);
  lines.push(`- Budget: ${data?.budget || ''}`);
  lines.push(`- Scope: ${data?.scope || ''}`);
  lines.push('');
  lines.push('## Highlights');
  lines.push(block(data?.highlights));
  lines.push('');
  lines.push('## Risks');
  lines.push(block(data?.risks));
  lines.push('');
  lines.push('## Next Steps');
  lines.push(block(data?.nextSteps));
  lines.push('');
  return lines.join('\n');
}
function block(v: any) { const s = (v ?? '').toString().trim(); return s.length ? s : '_(not provided)_'; }
