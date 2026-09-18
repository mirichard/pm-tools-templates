// Markdown utilities: strip front-matter/metadata and slice from first heading
function isMetaLineFactory() {
  const pairRe = /[A-Za-z_][\w\- ]*\s*:\s*("[^"]*"|'[^']*'|\[[^\]]*\]|\([^\)]*\)|[^\s][^\s,]*)/g;
  const commonMetaKeys = /^(title|methodology|complexity|process_group|industry|role|tags|version|owner|updated|lastModified|estimated_completion_time)\s*:/i;
  return function isMetaLine(line) {
    const t = (line || '').trim();
    if (!t) return true;
    if (t.startsWith('#')) return false;
    if (/^warning:/i.test(t)) return true;
    if (commonMetaKeys.test(t)) return true;
    const matches = t.match(pairRe);
    if (matches && matches.length >= 2) return true;
    if (matches && matches.length === 1 && commonMetaKeys.test(t)) return true;
    return false;
  };
}
const isMetaLine = isMetaLineFactory();

export function stripFrontMatter(raw) {
  if (!raw) return '';
  let text = raw;
  // Remove YAML front matter (--- ... ---)
  text = text.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/, '');

  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && isMetaLine(lines[i])) i++;

  const firstAtxHeadingIdx = lines.findIndex(l => /^\s*#/.test(l));
  const scanLimit = firstAtxHeadingIdx === -1 ? Math.min(lines.length, 30) : Math.min(firstAtxHeadingIdx, 30);
  for (let j = 0; j < scanLimit; j++) {
    const t = (lines[j] || '').trim();
    if (/^(-{3,}|_{3,}|\*{3,})$/.test(t)) { lines[j] = ''; continue; }
    if (isMetaLine(lines[j])) { lines[j] = ''; continue; }
    if (/^(?:-{3,}|={3,})$/.test(t)) {
      let k = j - 1; while (k >= 0 && (!lines[k] || !lines[k].trim())) k--;
      if (k >= 0 && isMetaLine(lines[k])) { lines[j] = ''; lines[k] = ''; }
    }
  }

  const rest = lines.slice(i).join('\n').replace(/^\s+/, '');
  return rest;
}

export function sliceFromFirstHeading(cleaned) {
  // helper to decide if a setext heading candidate is metadata-like
  const looksMeta = (s) => isMetaLine(s);
  const lines = cleaned.split(/\r?\n/);
  // Iterate to find the first real heading
  let start = -1;
  // Consider ATX headings first
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*#/.test(l)) { start = i; break; }
    // Detect setext heading: non-empty line followed by === or ---
    if (l && i + 1 < lines.length) {
      const underline = (lines[i + 1] || '').trim();
      if (/^(?:={3,}|-{3,})$/.test(underline)) {
        if (!looksMeta(l)) { start = i; break; }
      }
    }
  }
  return start !== -1 ? lines.slice(start).join('\n') : cleaned;
}
