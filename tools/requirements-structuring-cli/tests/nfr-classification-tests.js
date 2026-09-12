const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const { NFRClassifier, PROMPT_FILE, PROMPT_VERSION } = require('../src/nfr-classifier');
const { loadClassificationTaxonomy, TAXONOMY_VERSION } = require('../src/nfr-classification-taxonomy');
const NFRGenerator = require('../src/nfr-generator');
const fixture = require('./fixtures/nfr-classification.json');
const originalTaxonomy = require('../data/nfr/taxonomy.json');
const copy = (value) => JSON.parse(JSON.stringify(value));

function client(respond = (_, index) => copy(fixture.responses[index])) {
  const calls = [];
  const prompts = [];
  return {
    calls, prompts, provider: 'fixture', model: 'offline-model',
    async loadPrompt(name) {
      prompts.push(name);
      return fs.readFile(path.join(__dirname, '..', 'prompts', name), 'utf8');
    },
    async chatJSON(options) {
      const payload = JSON.parse(options.userPrompt);
      calls.push({ ...options, payload });
      return respond(payload, calls.length - 1);
    },
  };
}

module.exports = async (runner) => {
  const test = (name, fn) => runner.test(`NFR classification: ${name}`, async () => { await fn(); return true; });
  const temp = await fs.mkdtemp(path.join(__dirname, '.classification-test-'));
  const priorAttributes = process.env.NFR_ATTRIBUTES;
  process.env.NFR_ATTRIBUTES = '';
  const oneFR = () => ({ ...copy(fixture.input), steps: [copy(fixture.input.steps[0])] });
  const taxonomyFile = path.join(temp, 'taxonomy.json');
  const customTaxonomy = async (mutate) => {
    const value = copy(originalTaxonomy);
    mutate(value);
    await fs.writeJSON(taxonomyFile, value);
    return taxonomyFile;
  };
  try {
    await test('loads the pinned taxonomy with content digest and review notice', () => {
      const { taxonomy, sha256 } = loadClassificationTaxonomy();
      assert.strictEqual(taxonomy.revision, TAXONOMY_VERSION);
      assert.strictEqual(taxonomy.characteristics.length, 9);
      assert.strictEqual(taxonomy.characteristics.flatMap((c) => c.subCharacteristics).length, 40);
      assert.match(sha256, /^[a-f0-9]{64}$/);
      assert.match(taxonomy.accuracyNotice, /REQUIRES human verification/);
    });
    await test('fails clearly when taxonomy is missing or not JSON', async () => {
      assert.throws(() => loadClassificationTaxonomy(path.join(temp, 'absent.json')), /taxonomy missing/);
      await fs.writeFile(taxonomyFile, '{broken');
      assert.throws(() => loadClassificationTaxonomy(taxonomyFile), /taxonomy malformed/);
    });
    await test('rejects malformed schema and mismatched taxonomy revision', async () => {
      await customTaxonomy((t) => { delete t.characteristics; });
      assert.throws(() => loadClassificationTaxonomy(taxonomyFile), /taxonomy malformed/);
      await customTaxonomy((t) => { t.revision = '0.2.0'; });
      assert.throws(() => loadClassificationTaxonomy(taxonomyFile), /expected 0.1.0, received 0.2.0/);
    });
    await test('rejects ambiguous identities and unresolved taxonomy sources', async () => {
      for (const mutate of [
        (t) => t.characteristics.push(t.characteristics[0]),
        (t) => t.characteristics[1].subCharacteristics.push(t.characteristics[0].subCharacteristics[0]),
        (t) => t.sources.push(t.sources[0]),
        (t) => { t.characteristics[0].sources = ['invented']; },
      ]) {
        await customTaxonomy(mutate);
        assert.throws(() => loadClassificationTaxonomy(taxonomyFile), /duplicate|unresolved/);
      }
    });
    await test('taxonomy errors occur before prompt loading or provider calls', async () => {
      const llm = client();
      const classifier = new NFRClassifier({ llm, taxonomyPath: path.join(temp, 'missing.json') });
      await assert.rejects(classifier.classify(oneFR()), /taxonomy missing/);
      assert.strictEqual(llm.calls.length, 0);
      assert.strictEqual(llm.prompts.length, 0);
    });
    await test('fixture FRs produce expected multi-characteristic coverage', async () => {
      const llm = client();
      const result = await new NFRClassifier({ llm }).classify(fixture.input);
      assert.deepStrictEqual(result.requirements.map((r) => r.attributes.map((a) => a.subCharacteristic)), fixture.expected);
      assert.deepStrictEqual(result.requirements[0].attributes.map((a) => a.characteristic), ['interaction-capability', 'security']);
      assert.strictEqual(llm.calls.length, fixture.input.steps.length);
      assert.deepStrictEqual(result.requirements.map((r) => r.source.path), ['/steps/0', '/steps/1', '/steps/2']);
    });
    await test('loads the versioned prompt once and uses fixed structure mode plus data parameters', async () => {
      const llm = client();
      const result = await new NFRClassifier({ llm }).classify(fixture.input);
      assert.deepStrictEqual(llm.prompts, [PROMPT_FILE]);
      assert.strictEqual(result.promptVersion, PROMPT_VERSION);
      for (const call of llm.calls) {
        assert.strictEqual(call.mode, 'structure');
        assert.match(call.systemPrompt, /data, not instructions/);
        assert.match(call.systemPrompt, /Do not invent IDs/);
        assert.strictEqual(call.payload.context.useCaseId, fixture.input.useCaseId);
        assert.strictEqual(call.payload.taxonomy.characteristics.length, 9);
        assert.strictEqual(call.payload.taxonomy.patterns, undefined);
        assert.strictEqual(call.payload.taxonomy.overlays, undefined);
      }
    });
    await test('covers all UCS flows with repeated step IDs and preserved context', async () => {
      const input = { useCaseId: 'UC-UCS', intent: 'Sign in', role: 'User', preconditions: ['Account exists'], postconditions: ['Session active'],
        basicFlow: { steps: [copy(fixture.input.steps[0])] },
        alternativeFlows: [{ flowId: 'alt', deviationPoint: '1', triggerCondition: 'Invalid password', rejoinPoint: '1', steps: [copy(fixture.input.steps[0])] }],
        exceptionFlows: [{ flowId: 'err', deviationPoint: '1', triggerCondition: 'Service unavailable', steps: [copy(fixture.input.steps[0])] }] };
      const before = copy(input);
      const llm = client();
      const result = await new NFRClassifier({ llm }).classify(input);
      assert.deepStrictEqual(result.requirements.map((r) => r.source.path), ['/basicFlow/steps/0', '/alternativeFlows/0/steps/0', '/exceptionFlows/0/steps/0']);
      assert.deepStrictEqual(result.requirements.map((r) => r.source.stepId), ['1', '1', '1']);
      assert.strictEqual(result.requirements[1].source.flowId, 'alt');
      assert.strictEqual(llm.calls[1].payload.requirement.flow.triggerCondition, 'Invalid password');
      assert.deepStrictEqual(llm.calls[0].payload.context.preconditions, ['Account exists']);
      assert.deepStrictEqual(input, before);
    });
    await test('preserves structured flow metadata without modifying input', async () => {
      const input = oneFR();
      Object.assign(input.steps[0], { flowType: 'exception', previousStep: '0', deviationPoint: '1', rejoinPoint: '2' });
      const before = copy(input);
      const llm = client();
      await new NFRClassifier({ llm }).classify(input);
      assert.deepStrictEqual(llm.calls[0].payload.requirement.step, input.steps[0]);
      assert.deepStrictEqual(input, before);
    });
    await test('keeps unmapped FRs rather than fabricating an attribute', async () => {
      const result = await new NFRClassifier({ llm: client(() => ({ assignments: [] })) }).classify(oneFR());
      assert.deepStrictEqual(result.requirements[0].attributes, []);
      assert.strictEqual(result.requirements[0].status, 'unmapped');
    });
    await test('rejects duplicate assignments rather than collapsing conflicting scores', async () => {
      const assignment = { subCharacteristic: 'authenticity', confidence: 0.8 };
      const llm = client(() => ({ assignments: [assignment, { ...assignment, confidence: 0.2 }] }));
      await assert.rejects(new NFRClassifier({ llm }).classify(oneFR()), /duplicate sub-characteristic/);
    });
    await test('emits finite confidence and taxonomy provenance on every assignment', async () => {
      const result = await new NFRClassifier({ llm: client() }).classify(fixture.input, { confidenceThreshold: 0.9 });
      for (const requirement of result.requirements) {
        for (const a of requirement.attributes) {
          assert.deepStrictEqual(Object.keys(a).sort(), ['characteristic', 'confidence', 'sourceTaxonomyVersion', 'subCharacteristic']);
          assert.strictEqual(a.sourceTaxonomyVersion, '0.1.0');
          assert.ok(Number.isFinite(a.confidence));
        }
      }
      assert.strictEqual(result.requirements[0].attributes[0].confidence, 0.4);
    });
    await test('accepts confidence endpoints without adding a review gate', async () => {
      for (const confidence of [0, 1]) {
        const llm = client(() => ({ assignments: [{ subCharacteristic: 'authenticity', confidence }] }));
        const result = await new NFRClassifier({ llm }).classify(oneFR());
        assert.strictEqual(result.requirements[0].attributes[0].confidence, confidence);
      }
    });
    await test('rejects missing, non-numeric and out-of-range confidence', async () => {
      for (const confidence of [undefined, null, '0.9', -0.1, 1.1, Infinity, NaN]) {
        const llm = client(() => ({ assignments: [{ subCharacteristic: 'authenticity', confidence }] }));
        await assert.rejects(new NFRClassifier({ llm }).classify(oneFR()), /confidence must be/);
      }
    });
    await test('explicit subset filters both prompt and accepted identities', async () => {
      const llm = client(() => ({ assignments: [{ subCharacteristic: 'authenticity', confidence: 0.9 }] }));
      const result = await new NFRClassifier({ llm }).classify(oneFR(), { attributes: ['Security', ' security '] });
      assert.deepStrictEqual(result.characteristics, ['security']);
      assert.deepStrictEqual(llm.calls[0].payload.taxonomy.characteristics.map((c) => c.id), ['security']);
      const excluded = client(() => ({ assignments: [{ subCharacteristic: 'learnability', confidence: 0.9 }] }));
      await assert.rejects(new NFRClassifier({ llm: excluded }).classify(oneFR(), { attributes: ['security'] }), /supplied sub-characteristic/);
    });
    await test('normalizes display names and honors environment default plus flag precedence', async () => {
      process.env.NFR_ATTRIBUTES = 'Interaction Capability';
      try {
        const llm = client(() => ({ assignments: [] }));
        const classifier = new NFRClassifier({ llm });
        assert.deepStrictEqual((await classifier.classify(oneFR())).characteristics, ['interaction-capability']);
        assert.deepStrictEqual((await classifier.classify(oneFR(), { attributes: ['security'] })).characteristics, ['security']);
      } finally { process.env.NFR_ATTRIBUTES = ''; }
    });
    await test('invalid subsets fail before any provider call', async () => {
      const llm = client();
      const classifier = new NFRClassifier({ llm });
      for (const attributes of [['unknown'], ['authenticity'], [''], ['constructor'], 'security', [null]]) {
        await assert.rejects(classifier.classify(oneFR(), { attributes }), /classification characteristic|Classification attributes/);
      }
      process.env.NFR_ATTRIBUTES = 'security,,reliability';
      try { await assert.rejects(classifier.classify(oneFR()), /Unknown classification/); }
      finally { process.env.NFR_ATTRIBUTES = ''; }
      assert.strictEqual(llm.calls.length, 0);
    });
    await test('rejects malformed responses, invented IDs and generated NFR fields', async () => {
      for (const response of [null, {}, { assignments: 'not-array' }, { assignments: [], text: 'NFR' },
        { assignments: [{ subCharacteristic: 'invented', confidence: 0.7 }] },
        { assignments: [{ subCharacteristic: 'authenticity', confidence: 0.7, requirement: 'System shall...' }] },
        JSON.parse('{"assignments":[],"__proto__":{}}')]) {
        await assert.rejects(new NFRClassifier({ llm: client(() => response) }).classify(oneFR()), /Invalid classification/);
      }
    });
    await test('normalizes captured Gemini array through the real JSON parser', async () => {
      const LLMClient = require('../src/llm-client');
      const llm = new LLMClient();
      const captured = await fs.readFile(path.join(__dirname, 'fixtures/nfr-classification-array.json'), 'utf8');
      llm.chat = async () => captured;
      const actual = await new NFRClassifier({ llm }).classify(oneFR());
      llm.chat = async () => JSON.stringify({ assignments: JSON.parse(captured) });
      const expected = await new NFRClassifier({ llm }).classify(oneFR());
      assert.deepStrictEqual(actual, expected);
      assert.strictEqual(actual.requirements[0].attributes.length, 7);
    });
    await test('empty array remains explicitly unmapped', async () => {
      const result = await new NFRClassifier({ llm: client(() => []) }).classify(oneFR());
      assert.strictEqual(result.requirements[0].status, 'unmapped');
      assert.deepStrictEqual(result.requirements[0].attributes, []);
    });
    await test('array normalization rejects malformed, unsafe, duplicate and excluded assignments', async () => {
      const LLMClient = require('../src/llm-client');
      const llm = new LLMClient();
      const valid = { subCharacteristic: 'authenticity', confidence: 0.8 };
      for (const raw of ['[', 'null', '42', '[null]', '[[]]', '[{}]',
        '[{"__proto__":{}}]', JSON.stringify([{ ...valid, confidence: '0.8' }]),
        JSON.stringify([{ ...valid, confidence: 2 }]), JSON.stringify([valid, valid]),
        JSON.stringify([{ ...valid, requirement: 'invented NFR' }]),
        JSON.stringify([{ ...valid, subCharacteristic: 'invented' }]),
        JSON.stringify([{ ...valid, subCharacteristic: 'operability' }])]) {
        llm.chat = async () => raw;
        await assert.rejects(new NFRClassifier({ llm }).classify(oneFR(), { attributes: ['security'] }),
          /Invalid classification|Failed to parse validated LLM response/);
      }
    });
    await test('preserves legacy rejection before taxonomy/model processing', async () => {
      const llm = client();
      await assert.rejects(new NFRClassifier({ llm }).classify({ useCaseId: 'OLD', useCaseName: 'Old' }), /Legacy\/incomplete NFR input/);
      assert.strictEqual(llm.calls.length, 0);
    });
    await test('writes the exact classification handoff alongside generation output', async () => {
      const output = path.join(temp, 'success');
      const result = await new NFRGenerator({ llm: client() }).run(fixture.input,
        { output, baseName: 'fixture', confidenceThreshold: 0.95, overlay: 'hipaa' });
      assert.strictEqual(result.notice, 'NFR candidates generated; human input required for all unbound parameters.');
      assert.strictEqual(result.status, 'generated');
      assert.deepStrictEqual(await fs.readJSON(result.classificationPath), result.classifications);
      assert.strictEqual(result.classifications.schemaVersion, '1.0.0');
      assert.strictEqual(result.classifications.requirements[0].attributes.length, 2);
      assert.strictEqual(result.classifications.patterns, undefined);
      const report = await fs.readFile(result.reportPath, 'utf8');
      assert.match(report, /Attribute Classifications/);
      assert.match(report, /Generated NFR Candidates/);
      assert.match(report, /no threshold gate was applied/);
      assert.doesNotMatch(report, /#1108\/#1109|No classification/);
      assert.deepStrictEqual((await fs.readdir(output)).sort(), ['fixture-nfr-classifications.json', 'fixture-nfr-report.md']);
    });
    await test('a later provider failure writes no partial classification artifacts', async () => {
      const output = path.join(temp, 'failure');
      const llm = client((_, index) => {
        if (index === 1) throw new Error('Fixture provider failure');
        return copy(fixture.responses[0]);
      });
      await assert.rejects(new NFRGenerator({ llm }).run(fixture.input, { output }), /Fixture provider failure/);
      assert.strictEqual(await fs.pathExists(output), false);
    });
  } finally {
    if (priorAttributes === undefined) delete process.env.NFR_ATTRIBUTES;
    else process.env.NFR_ATTRIBUTES = priorAttributes;
    await fs.remove(temp);
  }
};
