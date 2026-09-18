const assert = require('assert');
const { validateLibraryData, loadNFRLibrary } = require('../src/nfr-library');
const { selectOverlay } = require('../src/nfr-overlays');
const { normalizeNFROptions } = require('../src/nfr-options');

const originals = [require('../data/nfr/taxonomy.json'), require('../data/nfr/patterns.json'), require('../data/nfr/overlays.json')];
const fixture = () => JSON.parse(JSON.stringify(originals));

module.exports = async (runner) => {
  const test = (name, fn) => runner.test(`NFR library: ${name}`, () => { fn(); return true; });
  const rejects = (mutate, message) => {
    const values = fixture();
    mutate(...values);
    assert.throws(() => validateLibraryData(...values), message);
  };
  await test('bundled schemas and complete 9/40 taxonomy relationships pass', () => {
    assert.deepStrictEqual(validateLibraryData(...fixture()),
      { characteristics: 9, subCharacteristics: 40, corePatterns: 40, overlays: 5, overlayPatterns: 5 });
  });
  await test('semver accepts dotted revisions and rejects malformed or mismatched revisions', () => {
    rejects((t) => { t.revision = '0x1x0'; }, /taxonomy:/);
    rejects((t) => { t.revision = '0\\a1\\b0'; }, /taxonomy:/);
    rejects((t, c) => { c.taxonomyRevision = '0.2.0'; }, /taxonomy revision mismatch/);
    rejects((t, c, o) => { o.revision = '0.2.0'; }, /core\/overlay revision mismatch/);
  });
  await test('missing or duplicated core coverage cannot pass', () => {
    rejects((t, c) => { c.patterns.pop(); }, /cover each/);
    rejects((t, c) => { c.patterns.push(c.patterns[0]); }, /duplicate pattern/);
    rejects((t, c) => { c.patterns[1].subCharacteristic = c.patterns[0].subCharacteristic; }, /cover each/);
  });
  await test('new taxonomy entries require a corresponding curated pattern', () => {
    rejects((t) => { t.characteristics[0].subCharacteristics.push({ ...t.characteristics[0].subCharacteristics[0], id: 'new-quality' }); }, /cover each/);
  });
  await test('duplicate taxonomy and source identities fail', () => {
    rejects((t) => { t.sources.push(t.sources[0]); }, /duplicate taxonomy source/);
    rejects((t) => { t.characteristics.push(t.characteristics[0]); }, /duplicate characteristic/);
    rejects((t) => { t.characteristics[1].subCharacteristics.push(t.characteristics[0].subCharacteristics[0]); }, /duplicate sub-characteristic/);
  });
  await test('every taxonomy citation and pattern provenance resolves', () => {
    rejects((t) => { t.characteristics[0].sources = ['invented']; }, /unknown taxonomy source/);
    rejects((t, c) => { c.patterns[0].provenance.frameworks[0].id = 'invented'; }, /unknown framework/);
    rejects((t, c) => { c.patterns[0].provenance.subCharacteristic = 'invented'; }, /provenance mismatch/);
    rejects((t, c) => { c.frameworks.push(c.frameworks[0]); }, /duplicate framework/);
    rejects((t, c) => { c.patterns[0].provenance.frameworks[0].section = ''; }, /patterns:/);
  });
  await test('wrong taxonomy parent and overlay namespace fail', () => {
    rejects((t, c) => { c.patterns[0].characteristic = 'security'; }, /taxonomy parent/);
    rejects((t, c, o) => { o.overlays[0].patterns[0].id = 'core.accountability'; }, /duplicate pattern/);
    rejects((t, c, o) => { o.overlays[0].patterns[0].id = 'unregistered.accountability'; }, /namespace mismatch/);
  });
  await test('malformed, undeclared and unused placeholders fail', () => {
    rejects((t, c) => { c.patterns[0].template += ' {{missing}}'; }, /parameter\/placeholder mismatch/);
    rejects((t, c) => { c.patterns[0].template += ' {{bad-name}}'; }, /malformed template/);
    rejects((t, c) => { c.patterns[0].parameters.unused = { type: 'string', description: 'Unused' }; }, /parameter\/placeholder mismatch/);
    rejects((t, c) => { c.patterns[0].template += '\nAnother statement.'; }, /malformed template/);
    rejects((t, c) => { c.patterns[0].template += ' It shall do more.'; }, /one requirement/);
  });
  await test('metric target omitted from template fails with pattern and missing reference', () => {
    for (const name of ['target', 'acceptanceBound']) {
      const values = fixture();
      const pattern = values[1].patterns[0];
      const target = pattern.parameters.target;
      delete pattern.parameters.target;
      pattern.parameters[name] = target;
      pattern.metric.targetParameter = name;
      pattern.template = pattern.template.replace('{{target}}', 'the approved bound');
      assert.throws(() => validateLibraryData(...values), {
        message: `Invalid NFR library: ${pattern.id}: metric target reference {{${name}}} is missing from template`,
      });
    }
  });
  await test('metric target referenced by its declared name passes', () => {
    for (const name of ['target', 'acceptanceBound']) {
      const values = fixture();
      const pattern = values[1].patterns[0];
      const target = pattern.parameters.target;
      delete pattern.parameters.target;
      pattern.parameters[name] = target;
      pattern.metric.targetParameter = name;
      pattern.template = pattern.template.replace('{{target}}', `{{${name}}}`);
      assert.strictEqual(validateLibraryData(...values).corePatterns, 40);
    }
  });
  await test('target type, unit and acceptance bounds are meaningful', () => {
    rejects((t, c) => { c.patterns[0].parameters.target.type = 'string'; }, /numeric bounds on string/);
    rejects((t, c) => { c.patterns[0].metric.unit = 'minutes'; }, /type\/unit mismatch/);
    rejects((t, c) => { c.patterns[0].metric.targetParameter = 'missing'; }, /metric target/);
    rejects((t, c) => { c.patterns[0].parameters.target.maximum = 101; }, /bounded by 100/);
    rejects((t, c) => { c.patterns[0].parameters.target.minimum = 101; }, /inverted parameter bounds/);
    rejects((t, c) => { c.patterns[0].parameters.target.minimum = -1; }, /nonnegative numeric/);
  });
  await test('schemas require provenance and forbid silent default thresholds and extra fields', () => {
    rejects((t, c) => { delete c.patterns[0].provenance; }, /patterns:/);
    rejects((t, c) => { c.patterns[0].parameters.target.default = 99.9; }, /patterns:/);
    rejects((t, c, o) => { o.overlays[0].replaces = ['core.accountability']; }, /overlays:/);
  });
  await test('candidate status and accuracy notice cannot claim unverified approval', () => {
    rejects((t) => { t.releaseStatus = 'approved'; }, /taxonomy:/);
    rejects((t) => { t.accuracyNotice = 'ISO verified'; }, /taxonomy:/);
    rejects((t, c) => { c.patterns[0].reviewStatus = 'approved'; }, /patterns:/);
    assert.match(loadNFRLibrary().accuracyNotice, /REQUIRES human verification/);
  });
  await test('neutral is the default with exactly the neutral pattern set', () => {
    const library = loadNFRLibrary();
    assert.strictEqual(library.overlay, 'neutral');
    assert.deepStrictEqual(library.patterns, originals[1].patterns);
    assert.strictEqual(normalizeNFROptions({}).overlay, 'neutral');
    assert.ok(library.frameworks.every((ref) => !['cfr11', 'hipaa', 'pci', 'section508', 'wcag20'].includes(ref.id)));
  });
  await test('each opt-in overlay is additive and excludes every other overlay', () => {
    for (const overlay of originals[2].overlays) {
      const library = loadNFRLibrary({ overlay: overlay.id });
      assert.strictEqual(selectOverlay(overlay.id), overlay.id);
      assert.deepStrictEqual(library.patterns, [...originals[1].patterns, ...overlay.patterns]);
      assert.strictEqual(library.applicability, overlay.applicability);
      const used = new Set(library.patterns.flatMap((p) => p.provenance.frameworks.map((ref) => ref.id)));
      assert.deepStrictEqual(new Set(library.frameworks.map((ref) => ref.id)), used);
      assert.strictEqual(normalizeNFROptions({ profile: overlay.id }).overlay, overlay.id);
    }
  });
  await test('unknown and prototype-like overlay selections fail closed', () => {
    for (const overlay of ['unknown', 'constructor', '__proto__', 'toString', '../hipaa', null]) {
      assert.throws(() => selectOverlay(overlay), /Unknown NFR overlay/);
      assert.throws(() => loadNFRLibrary({ overlay }), /Unknown NFR overlay/);
    }
    assert.throws(() => normalizeNFROptions({ profile: 'hipaa', overlay: 'pci-dss' }), /same|conflict|match/i);
  });
  await test('reserved or duplicate overlay registration fails', () => {
    rejects((t, c, o) => { o.overlays.push(o.overlays[0]); }, /duplicate overlay/);
    rejects((t, c, o) => { o.overlays[0].id = 'neutral'; }, /reserved overlay/);
  });
  await test('consumers cannot mutate shared core or overlay data', () => {
    const library = loadNFRLibrary({ overlay: 'hipaa' });
    assert.ok(Object.isFrozen(library.patterns[0].parameters.target));
    assert.throws(() => library.patterns.push({}), TypeError);
    assert.deepStrictEqual(loadNFRLibrary().patterns, originals[1].patterns);
  });
  await test('Section 508 preserves its WCAG 2.0 provenance separately from WCAG 2.2', () => {
    const section508 = originals[2].overlays.find((o) => o.id === 'section-508').patterns[0];
    assert.deepStrictEqual(section508.provenance.frameworks.map((f) => f.id), ['section508', 'wcag20']);
    const wcag = originals[2].overlays.find((o) => o.id === 'wcag-22').patterns[0];
    assert.deepStrictEqual(wcag.provenance.frameworks.map((f) => f.id), ['wcag22']);
    assert.deepStrictEqual([wcag.parameters.target.minimum, wcag.parameters.target.maximum], [100, 100]);
    const pci = originals[2].overlays.find((o) => o.id === 'pci-dss').patterns[0];
    assert.deepStrictEqual([pci.parameters.target.minimum, pci.parameters.target.maximum], [0, 0]);
  });
};
