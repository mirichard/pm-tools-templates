export function toStakeholderMarkdown(data: any): string {
  const lines: string[] = [];
  lines.push('# Stakeholder Communication Plan');
  lines.push('');
  const list = Array.isArray(data?.stakeholders) ? data.stakeholders : [];
  if (list.length === 0) {
    lines.push('_(no stakeholders provided)_');
  } else {
    lines.push('| Name | Role | Contact | Info Needs | Frequency | Channel |');
    lines.push('|---|---|---|---|---|---|');
    for (const s of list) {
      lines.push(`| ${s.name || ''} | ${s.role || ''} | ${s.contact || ''} | ${safe(s.infoNeeds)} | ${s.frequency || ''} | ${s.channel || ''} |`);
    }
  }
  lines.push('');
  return lines.join('\n');
}
function safe(v: any) { return (v ?? '').toString().replace(/\n/g, ' '); }
