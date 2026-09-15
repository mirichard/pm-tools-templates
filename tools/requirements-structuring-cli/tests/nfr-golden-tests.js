const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const Ajv = require('ajv');
const { generateCandidates } = require('../src/nfr-candidates');
const { validateNFRInput } = require('../src/nfr-input');
const root = path.resolve(__dirname, '../examples/fixtures/nfr-golden');
const variants = ['neutral', 'pci-dss'];
const expected = {
  "neutral": {
    "characteristics": [
      "compatibility",
      "functional-suitability",
      "interaction-capability",
      "performance-efficiency",
      "reliability",
      "security"
    ],
    "uncovered": [
      "flexibility",
      "maintainability",
      "safety"
    ],
    "candidates": 70,
    "bindings": 280
  },
  "pci-dss": {
    "characteristics": [
      "compatibility",
      "functional-suitability",
      "interaction-capability",
      "reliability",
      "security"
    ],
    "uncovered": [
      "flexibility",
      "maintainability",
      "performance-efficiency",
      "safety"
    ],
    "candidates": 78,
    "bindings": 312
  }
};
const base = 'password-reset-input';
const read = (variant, suffix) => JSON.parse(fs.readFileSync(path.join(root, variant, base + suffix), 'utf8'));

// Flatten a UCS into { path -> step } using the exact same path grammar
// generateCandidates' handoff validator accepts (see src/nfr-candidates.js
// validateHandoff): /basicFlow/steps/N or /(alternativeFlows|exceptionFlows)/N/steps/M.
// That validator only checks path shape and uniqueness, never that the path
// resolves to a real step — this reproduces the actual resolution so the
// fixture test can verify it independently.
function flattenStepsByPath(ucs) {
  const byPath = new Map();
  ucs.basicFlow.steps.forEach((step, i) => byPath.set(`/basicFlow/steps/${i}`, step));
  for (const key of ['alternativeFlows', 'exceptionFlows']) {
    (ucs[key] || []).forEach((flow, flowIndex) => {
      flow.steps.forEach((step, stepIndex) => byPath.set(`/${key}/${flowIndex}/steps/${stepIndex}`, step));
    });
  }
  return byPath;
}

module.exports = async runner => {
  await runner.test('Golden fixture: all captured artifacts exist and have valid structure', () => {
    const source = fs.readFileSync(path.join(root, base + '.md'), 'utf8');
    assert.equal(require('crypto').createHash('sha256').update(source).digest('hex'), 'f722b387b595bcbf34d5e344f853ba4086d1ee6e92e7ea7ea3e1cdabf42c3f3d');
    const parsed = new (require('../src/parser'))().parseContent(source);
    const catalog = [...parsed.basicFlow, ...parsed.alternativeFlows, ...parsed.exceptionFlows]
      .map(({ id, originalText }) => ({ id, originalText }));
    for (const variant of variants) {
      const suffixes = ['-ambiguity.json', '-ambiguity-report.md', '-structured.json', '-ucs.json', '-tests.json', '.feature', '-nfr-classifications.json', '-nfr-report.md'];
      assert.equal(fs.readdirSync(path.join(root, variant)).length, suffixes.length);
      for (const suffix of suffixes) {
        const text = fs.readFileSync(path.join(root, variant, base + suffix), 'utf8');
        assert(text.trim().length > 0);
        if (suffix.endsWith('.json')) JSON.parse(text);
      }
      assert.equal(read(variant, '-nfr-classifications.json').requirements.length, 10);
      assert.deepEqual(read(variant, '-ucs.json').sourceRequirements, catalog);
      assert.deepEqual(read(variant, '-structured.json').sourceRequirements, catalog);
      assert.match(fs.readFileSync(path.join(root, variant, base + '-nfr-report.md'), 'utf8'), /Coverage Gaps and Missing Inputs/);
    }
    return true;
  });
  await runner.test('Golden fixture: structured and UCS artifacts actually pass validateNFRInput and their reference schemas (#1164 finding 3)', () => {
    // #1164 found that the committed *-structured.json captures fail validateNFRInput
    // (refUseCaseId and other prompt-permitted nulls were rejected as strings-only) and
    // that this suite never caught it: nulling structured.steps in memory left every
    // existing golden test passing, because none of them invoked the validator. Fixed
    // upstream in src/nfr-input.js; this test is the actual regression guard.
    const ajv = new Ajv({ strict: false });
    const validateFormalStructure = ajv.compile(require('../schemas/formal-structure.schema.json'));
    const validateUCSTemplate = ajv.compile(require('../schemas/ucs-template.schema.json'));
    for (const variant of variants) {
      const structured = read(variant, '-structured.json');
      const ucs = read(variant, '-ucs.json');

      const structuredResult = validateNFRInput(structured);
      assert.equal(structuredResult.kind, 'structured');
      assert.equal(structuredResult.data.steps[0].refUseCaseId, null,
        'sanity check: this fixture must still exercise a real prompt-permitted null, not a stale copy');

      const ucsResult = validateNFRInput(ucs);
      assert.equal(ucsResult.kind, 'ucs');

      assert(validateFormalStructure(structured), JSON.stringify(validateFormalStructure.errors));
      assert(validateUCSTemplate(ucs), JSON.stringify(validateUCSTemplate.errors));

      // Prove the validator is actually discriminating, not vacuously passing:
      // a field no generation prompt authorizes as null must still be rejected.
      const brokenStructured = JSON.parse(JSON.stringify(structured));
      brokenStructured.steps[0].actor = null;
      assert.throws(() => validateNFRInput(brokenStructured), /steps\[0\]\.actor/);

      const brokenUCS = JSON.parse(JSON.stringify(ucs));
      brokenUCS.basicFlow.steps = null;
      assert.throws(() => validateNFRInput(brokenUCS));
    }
    return true;
  });
  await runner.test('Golden fixture: exact coverage, placeholder-only bindings and PCI-DSS additions', () => {
    for (const variant of variants) {
      const handoff = read(variant, '-nfr-classifications.json');
      const generated = generateCandidates(handoff, { overlay: variant });
      assert.deepEqual([...new Set(generated.candidates.map(c => c.characteristic))].sort(), expected[variant].characteristics);
      assert.deepEqual([...generated.uncoveredCharacteristics].sort(), expected[variant].uncovered);
      assert.equal(generated.candidates.length, expected[variant].candidates);
      assert.equal(generated.candidates.reduce((n, c) => n + Object.keys(c.bindings).length, 0), expected[variant].bindings);
      for (const candidate of generated.candidates) {
        for (const [name, binding] of Object.entries(candidate.bindings)) assert.equal(binding, `[NEEDS INPUT: ${name}]`);
      }
      if (variant !== 'neutral') {
        const neutral = generateCandidates(handoff);
        const added = generated.candidates.filter(c => !neutral.candidates.some(n => n.id === c.id));
        assert.equal(neutral.candidates.length, 73);
        assert.deepEqual(added.map(c => ({ patternId: c.patternId, path: c.source.path })),
          ['/basicFlow/steps/1', '/basicFlow/steps/2', '/basicFlow/steps/4', '/basicFlow/steps/5', '/alternativeFlows/0/steps/0']
            .map(path => ({ patternId: 'pci-dss.confidentiality', path })));
        assert(neutral.candidates.every(n => generated.candidates.some(c => c.id === n.id)));
      }
    }
    return true;
  });
  await runner.test('Golden fixture: every classification handoff source path resolves to the real UCS step it claims', () => {
    // generateCandidates' handoff validator only enforces path shape and
    // uniqueness (see validateHandoff in src/nfr-candidates.js); a
    // plausible-looking but nonexistent path such as /basicFlow/steps/99
    // would still pass that check and produce candidates/report entries
    // pointing at a step that doesn't exist. Resolve every recorded path
    // against the actual committed UCS and confirm it names the same step.
    for (const variant of variants) {
      const ucs = read(variant, '-ucs.json');
      const byPath = flattenStepsByPath(ucs);
      const handoff = read(variant, '-nfr-classifications.json');
      assert(handoff.requirements.length > 0);
      for (const requirement of handoff.requirements) {
        const step = byPath.get(requirement.source.path);
        assert(step, `${variant}: source path ${requirement.source.path} does not resolve to any step in the committed UCS`);
        assert.equal(step.stepId, requirement.source.stepId,
          `${variant}: source path ${requirement.source.path} resolves to step ${step.stepId}, not the claimed ${requirement.source.stepId}`);
      }
    }
    return true;
  });
  await runner.test('Golden fixture: six derived files regenerate byte-identically', () => {
    const output = execFileSync(process.execPath, [path.join(root, 'verify-regeneration.cjs')], { encoding: 'utf8' });
    assert.equal((output.match(/3 deterministic files byte-identical/g) || []).length, 2);
    return true;
  });
};
