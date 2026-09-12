// Re-render deterministic artifacts from recorded live handoffs; never call a provider.
const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const root = path.resolve(__dirname, '../../..');
const TestGenerator = require(path.join(root, 'src/test-generator'));
const GherkinGenerator = require(path.join(root, 'src/gherkin-generator'));
const ReportGenerator = require(path.join(root, 'src/report-generator'));
const { UCSTemplate } = require(path.join(root, 'src/ucs-template'));
const { generateCandidates } = require(path.join(root, 'src/nfr-candidates'));
const { formatCandidateReport } = require(path.join(root, 'src/nfr-candidate-report'));
const output = fs.mkdtempSync(path.join(os.tmpdir(), 'nfr-golden-regeneration-'));
const base = 'password-reset-input';
for (const overlay of ['neutral', 'fda-21-cfr-11']) {
  const inputDir = path.join(__dirname, overlay);
  const read = suffix => JSON.parse(fs.readFileSync(path.join(inputDir, base + suffix), 'utf8'));
  const input = read('-ucs.json');
  const classifications = read('-nfr-classifications.json');
  const tests = new TestGenerator().generate(UCSTemplate.fromJSON(input));
  const generation = generateCandidates(classifications, { overlay });
  assert(generation.candidates.every(c => Object.entries(c.bindings)
    .every(([name, value]) => value === `[NEEDS INPUT: ${name}]`)));
  const report = new ReportGenerator().formatNFRReport({
    notice: 'NFR candidates generated; human input required for all unbound parameters.',
    input, inputKind: 'ucs', classifications,
    options: { provider: 'gemini', model: 'gemini-2.5-flash', attributes: [], confidenceThreshold: null, overlay },
  }) + '\n' + formatCandidateReport(generation);
  const files = {
    [base + '-tests.json']: JSON.stringify(tests, null, 2),
    [base + '.feature']: new GherkinGenerator().generate(tests, input),
    [base + '-nfr-report.md']: report,
  };
  fs.mkdirSync(path.join(output, overlay));
  for (const [name, text] of Object.entries(files)) {
    fs.writeFileSync(path.join(output, overlay, name), text);
    assert.equal(text, fs.readFileSync(path.join(inputDir, name), 'utf8'), `${overlay}/${name} differs`);
  }
  console.log(`${overlay}: 3 deterministic files byte-identical; ${generation.candidates.length} candidates; all bindings placeholders`);
}
console.log(`Fresh regenerated files: ${output}`);
console.log('Provider-derived artifacts remain recorded inputs; this does not prove live-provider repeatability.');
