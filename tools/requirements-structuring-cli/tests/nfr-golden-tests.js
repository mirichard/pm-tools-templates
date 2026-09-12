const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { generateCandidates } = require('../src/nfr-candidates');
const root = path.resolve(__dirname, '../examples/fixtures/nfr-golden');
const variants = ['neutral', 'fda-21-cfr-11'];
const base = 'password-reset-input';
const read = (variant, suffix) => JSON.parse(fs.readFileSync(path.join(root, variant, base + suffix), 'utf8'));
module.exports = async runner => {
  await runner.test('Golden fixture: all captured artifacts exist and have valid structure', () => {
    assert(fs.readFileSync(path.join(root, base + '.md'), 'utf8').includes('FR6:'));
    for (const variant of variants) {
      const suffixes = ['-ambiguity.json', '-ambiguity-report.md', '-structured.json', '-ucs.json', '-tests.json', '.feature', '-nfr-classifications.json', '-nfr-report.md'];
      assert.equal(fs.readdirSync(path.join(root, variant)).length, suffixes.length);
      for (const suffix of suffixes) {
        const text = fs.readFileSync(path.join(root, variant, base + suffix), 'utf8');
        assert(text.trim().length > 0);
        if (suffix.endsWith('.json')) JSON.parse(text);
      }
      assert.equal(read(variant, '-nfr-classifications.json').requirements.length, 8);
      assert.match(fs.readFileSync(path.join(root, variant, base + '-nfr-report.md'), 'utf8'), /Coverage Gaps and Missing Inputs/);
    }
    return true;
  });
  await runner.test('Golden fixture: breadth, placeholder-only bindings and genuine FDA addition', () => {
    for (const variant of variants) {
      const handoff = read(variant, '-nfr-classifications.json');
      const generated = generateCandidates(handoff, { overlay: variant });
      assert(new Set(generated.candidates.map(c => c.characteristic)).size >= 4);
      assert(generated.candidates.length > 0);
      for (const candidate of generated.candidates) {
        for (const [name, binding] of Object.entries(candidate.bindings)) assert.equal(binding, `[NEEDS INPUT: ${name}]`);
      }
      if (variant !== 'neutral') {
        const neutral = generateCandidates(handoff);
        const added = generated.candidates.filter(c => !neutral.candidates.some(n => n.id === c.id));
        assert.equal(added.length, 1);
        assert.equal(added[0].patternId, 'fda-21-cfr-11.accountability');
        assert(neutral.candidates.every(n => generated.candidates.some(c => c.id === n.id)));
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
