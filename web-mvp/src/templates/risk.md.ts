export function toRiskMarkdown(data: any): string {
  const lines: string[] = [];
  lines.push('# Risk Register');
  lines.push('');
  const risks = Array.isArray(data?.risks) ? data.risks : [];
  if (risks.length === 0) {
    lines.push('_(no risks provided)_');
  } else {
    lines.push('| ID | Description | Probability | Impact | Mitigation | Owner |');
    lines.push('|---|---|---|---|---|---|');
    for (const r of risks) {
      lines.push(`| ${r.id || ''} | ${safe(r.description)} | ${fmtProb(r.probability)} | ${r.impact || ''} | ${safe(r.mitigation)} | ${r.owner || ''} |`);
    }
  }
  lines.push('');
  return lines.join('\n');
}

function safe(v: any) { return (v ?? '').toString().replace(/\n/g, ' '); }
function fmtProb(p: any) { return (typeof p === 'number') ? `${Math.round(p * 100)}%` : ''; }
