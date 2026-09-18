export function toSprintMarkdown(data: any): string {
  const lines: string[] = [];
  lines.push(`# Sprint: ${data?.sprintName || ''}`);
  lines.push('');
  lines.push(`Start: ${data?.startDate || ''}  `);
  lines.push(`End: ${data?.endDate || ''}`);
  lines.push('');
  if (Array.isArray(data?.goals) && data.goals.length) {
    lines.push('## Goals');
    for (const g of data.goals) lines.push(`- ${g}`);
    lines.push('');
  }
  if (Array.isArray(data?.stories) && data.stories.length) {
    lines.push('## Stories');
    lines.push('| ID | Title | Estimate |');
    lines.push('|---|---|---|');
    for (const s of data.stories) lines.push(`| ${s.id || ''} | ${s.title || ''} | ${s.estimate ?? ''} |`);
    lines.push('');
  }
  return lines.join('\n');
}
