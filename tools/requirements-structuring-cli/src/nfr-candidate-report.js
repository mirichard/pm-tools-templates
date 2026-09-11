const { sanitizeTerminalValue } = require('./security');
const display = value => sanitizeTerminalValue(String(value ?? '')).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])).replace(/([\\`*_[\]#|])/g, '\\$1');

function formatCandidateReport(generation) {
  const lines = ['## Generated NFR Candidates', '',
    'Candidates need human input before they are testable acceptance criteria. No targets or measurement conditions were inferred.', '',
    `Renderer: ${display(generation.rendererVersion)}; selected overlay: ${display(generation.overlay)}.`, '',
    display(generation.accuracyNotice), ''];
  const sources = [...new Set(generation.candidates.map(c => c.source.path))];
  for (const source of sources) {
    lines.push(`### FR ${display(source)}`, '');
    const candidates = generation.candidates.filter(c => c.source.path === source);
    for (const characteristic of [...new Set(candidates.map(c => c.characteristic))]) {
      lines.push(`#### ${display(characteristic)}`, '');
      for (const c of candidates.filter(c => c.characteristic === characteristic)) {
        lines.push(`Candidate: ${display(c.id)}`, '', display(c.text), '',
          `Source step: ${display(c.source.stepId)}; sub-characteristic: ${display(c.subCharacteristic)}; confidence: ${c.confidence}.`,
          `Pattern: ${display(c.patternId)}; library: ${display(c.libraryRevision)}; taxonomy: ${display(c.sourceTaxonomyVersion)}.`,
          `Metric: ${display(c.metric.type)}; unit: ${display(c.metric.unit)}; comparison: ${display(c.metric.operator)}.`,
          `Measurement guidance (not supplied project conditions): ${display(c.metric.measurement)}`, '',
          ...c.frameworks.map(f => `Framework: ${display(f.title)}; edition: ${display(f.edition)}; section: ${display(f.section)}; reference: ${display(f.url)}`), '',
          `Applicability needs review: ${display(c.applicability)}`, '');
      }
    }
  }
  return lines.join('\n');
}
module.exports = { formatCandidateReport, display };
