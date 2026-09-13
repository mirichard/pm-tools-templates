const assert = require('assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const Ajv = require('ajv');
const Parser = require('../src/parser');
const Structurer = require('../src/structurer');
const Transformer = require('../src/ucs-transformer');
const { UCSTemplate } = require('../src/ucs-template');
const TestGenerator = require('../src/test-generator');
const GherkinGenerator = require('../src/gherkin-generator');
const { sourceMap, attachSources } = require('../src/source-traceability');
const { validateNFRInput } = require('../src/nfr-input');
const { validateDocumentContent } = require('../src/security');
const root = path.resolve(__dirname, '..');
const originalText = '4. FR4: A new password must be at least 12 characters and contain at least one letter and one number.';
const catalog = [{ id: 'FR4', originalText }];
const step = () => ({ stepId: '4', actor: 'System', action: 'validates', businessObject: 'Password',
  description: 'Meets complexity rules', sourceRequirementId: 'FR4', sourceText: 'invented' });
const structured = () => ({ useCaseId: 'UC-TEST', useCaseName: 'Password reset', steps: [step()], sourceRequirements: catalog });
const ucs = () => ({ useCaseId: 'UC-TEST', intent: 'Password reset', role: 'User', preconditions: [],
  postconditions: [], businessObjects: [], relatedUseCases: [], basicFlow: { steps: [step()] }, alternativeFlows: [], exceptionFlows: [] });
const parsed = () => new Parser().parseContent('## Basic Flow\n' + originalText);

module.exports = async runner => {
  const test = (name, fn) => runner.test('Source traceability: ' + name, async () => { await fn(); return true; });
  await test('parser retains original whitespace and explicit IDs across all flow types', () => {
    const p = new Parser().parseContent('## Basic Flow\n' + originalText + '  \n## Alternative Flows\n- AF9: Retry\n## Exception Flows\n- Fail');
    assert.deepEqual(p.basicFlow[0], { id: 'FR4', originalText: originalText + '  ', text: originalText.slice(3) });
    assert.equal(p.alternativeFlows[0].id, 'AF9'); assert.equal(p.exceptionFlows[0].id, 'EF-1');
    assert.equal(p.exceptionFlows[0].originalText, '- Fail');
  });
  await test('CRLF source generates a valid feature file with clean source comments', async () => {
    const input = '## Basic Flow\r\n' + originalText + '  \r\n';
    const p = new Parser().parseContent(input);
    assert.equal(p.rawText, input);
    const d = attachSources(ucs(), sourceMap(p.basicFlow), 'ucs', 'Test');
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'traceability-crlf-'));
    try {
      const output = path.join(dir, 'password.feature');
      await new GherkinGenerator().generateFile(new TestGenerator().generate(d), d, output);
      const feature = fs.readFileSync(output, 'utf8');
      assert.equal(validateDocumentContent(feature), feature);
      assert(feature.includes('    # ' + originalText + '  \n'));
      assert(!feature.includes('\r'));
    } finally { fs.rmSync(dir, { recursive: true, force: true }); }
  });
  await test('LF source preserves original whitespace and unchanged generated output', () => {
    const input = '## Basic Flow\n' + originalText + '  \n';
    const p = new Parser().parseContent(input);
    assert.equal(p.rawText, input);
    assert.deepEqual(p.basicFlow, [{ id: 'FR4', originalText: originalText + '  ', text: originalText.slice(3) }]);
    const expected = attachSources(ucs(), sourceMap([{ id: 'FR4', originalText: originalText + '  ' }]), 'ucs', 'Test');
    const actual = attachSources(ucs(), sourceMap(p.basicFlow), 'ucs', 'Test');
    const generate = d => new GherkinGenerator().generate(new TestGenerator().generate(d), d);
    assert.equal(generate(actual), generate(expected));
  });
  await test('fallback IDs repeat for unchanged input; explicit labels survive reordering', () => {
    const p = new Parser(); const text = '## Basic Flow\n1. Login\n2. Logout';
    assert.deepEqual(p.parseContent(text), p.parseContent(text));
    assert.deepEqual(p.parseContent(text).basicFlow.map(s => s.id), ['BF-1', 'BF-2']);
    assert.equal(p.parseContent('## Basic Flow\n1. FR9: Other\n' + originalText).basicFlow[1].id, 'FR4');
  });
  await test('duplicate labels fail instead of choosing an ambiguous source', () => {
    assert.throws(() => new Parser().parseContent('## Basic Flow\nFR4: A\n## Alternative Flows\nFR4: B'), /Duplicate source requirement ID "FR4"/);
  });
  await test('all three parsed-array prompt consumers render IDs and text, not objects', () => {
    const p = new Parser().parseContent('## Basic Flow\nFR4: Validate\n## Alternative Flows\nRetry\n## Exception Flows\nFail');
    const prompt = new Structurer()._buildUserPrompt(p);
    for (const text of ['[FR4] FR4: Validate', '[AF-1] Retry', '[EF-1] Fail']) assert(prompt.includes(text));
    assert(!prompt.includes('[object Object]'));
  });
  await test('join replaces model text and catalog with original source for multiple steps', () => {
    const d = structured(); d.steps.push({ ...step(), stepId: '4a' });
    d.sourceRequirements = [{ id: 'FR4', originalText: 'model text' }];
    const result = attachSources(d, sourceMap(catalog), 'structured', 'Test');
    assert(result.steps.every(s => s.sourceText === originalText)); assert.deepEqual(result.sourceRequirements, catalog);
  });
  await test('unknown ID error identifies both the step and ID', () => {
    const d = structured(); d.steps[0].sourceRequirementId = 'FR99';
    assert.throws(() => attachSources(d, sourceMap(catalog), 'structured', 'Test'), /step "4".*sourceRequirementId "FR99"/);
  });
  await test('missing and malformed IDs are rejected', () => {
    for (const id of [undefined, null, 4, '', 'FR 4', [], {}]) {
      const d = structured(); d.steps[0].sourceRequirementId = id;
      assert.throws(() => attachSources(d, sourceMap(catalog), 'structured', 'Test'), /step "4".*sourceRequirementId/);
    }
  });
  await test('invalid and duplicate catalogs and malformed steps fail', () => {
    for (const entries of [[], null, [{id:'FR4'}], [catalog[0],catalog[0]]]) assert.throws(() => sourceMap(entries));
    for (const d of [{steps:[]},{steps:[null]}]) assert.throws(() => attachSources(d,sourceMap(catalog),'structured','Test'));
  });
  await test('real three-boundary orchestration reattaches only parser-owned text', async () => {
    const s = new Structurer(); let calls = 0;
    s.llm.chat = async ({systemPrompt,userPrompt}) => {
      assert(systemPrompt.includes('sourceRequirementId')); assert(userPrompt.includes('FR4'));
      calls++; const d = structured(); d.sourceRequirements = [{ id:'FR4',originalText:'model replacement' }];
      return JSON.stringify(d);
    };
    const formal = await s.structure(parsed()); assert.equal(calls,2);
    assert.equal(formal.steps[0].sourceText,originalText);
    const t = new Transformer();
    t.llm.chat = async ({systemPrompt,userPrompt}) => {
      assert(systemPrompt.includes('sourceRequirementId')); assert(userPrompt.includes(originalText));
      return JSON.stringify(ucs());
    };
    const result = (await t.transform(formal)).toJSON();
    assert.equal(result.basicFlow.steps[0].sourceRequirementId,'FR4');
    assert.equal(result.basicFlow.steps[0].sourceText,originalText); assert.deepEqual(result.sourceRequirements,catalog);
  });
  for (const stage of ['structure','correction','ucs']) {
    await test(stage + ' boundary rejects unknown ID before downstream use', async () => {
      const bad = structured(); bad.steps[0].sourceRequirementId='FR99';
      if(stage==='ucs') {
        const t=new Transformer(); const d=ucs();d.basicFlow.steps[0].sourceRequirementId='FR99';
        t.llm.chat=async()=>JSON.stringify(d);
        await assert.rejects(t.transform(structured()),/UCS transformation: step "4".*FR99/);
      } else {
        const s=new Structurer();s.llm.chat=async()=>JSON.stringify(bad);
        await assert.rejects(stage==='structure'?s.structure(parsed()):s._correctBusinessObjects(structured()),/step "4".*FR99/);
      }
    });
  }
  await test('joins include alternative and exception steps', () => {
    const d=ucs();for(const key of ['alternativeFlows','exceptionFlows'])d[key]=[{steps:[step()]}];
    attachSources(d,sourceMap(catalog),'ucs','Test');
    for(const key of ['alternativeFlows','exceptionFlows'])assert.equal(d[key][0].steps[0].sourceText,originalText);
  });
  await test('tests and Gherkin preserve exact constraint references without inventing assertions', () => {
    const d=attachSources(ucs(),sourceMap(catalog),'ucs','Test');
    const generator=new TestGenerator(); const tests=generator.generate(d);const feature=new GherkinGenerator().generate(tests,d);
    assert.equal(tests[0].steps[0].sourceText,originalText);assert(generator.formatSummary(tests).includes(originalText));
    assert(feature.includes('    # '+originalText));assert(feature.includes('Then the Meets complexity rules'));
  });
  await test('legacy artifacts remain schema-valid and process without invented provenance', async () => {
    const d=ucs();delete d.basicFlow.steps[0].sourceRequirementId;delete d.basicFlow.steps[0].sourceText;
    const ajv=new Ajv({strict:false});assert(ajv.validate(require('../schemas/ucs-template.schema.json'),d));validateNFRInput(d);
    const round=UCSTemplate.fromJSON(d).toJSON();assert.deepEqual(round,d);
    const tests=new TestGenerator().generate(round);assert(!('sourceText' in tests[0].steps[0]));
    assert(!new GherkinGenerator().generate(tests,round).includes('# Source requirement'));
    const formal=structured();delete formal.sourceRequirements;delete formal.steps[0].sourceRequirementId;delete formal.steps[0].sourceText;
    assert(ajv.validate(require('../schemas/formal-structure.schema.json'),formal));
    const t=new Transformer();t.llm.chat=async()=>JSON.stringify(ucs());
    assert(!('sourceText' in (await t.transform(formal)).toJSON().basicFlow.steps[0]));
  });
  await test('deterministic transform rejoins source text without mutating its input', () => {
    const d=structured();const before=JSON.stringify(d);const result=new Transformer().transformDeterministic(d).toJSON();
    assert.equal(result.basicFlow.steps[0].sourceText,originalText);assert.equal(JSON.stringify(d),before);
  });
  await test('all prompt version headers match exported version constants', () => {
    for(const [file,version] of [['01-structure-requirements.md',Structurer.STRUCTURE_PROMPT_VERSION],
      ['02-correct-business-objects.md',Structurer.CORRECTION_PROMPT_VERSION],['03-generate-ucs-template.md',Transformer.UCS_PROMPT_VERSION]]) {
      assert.equal(version,'1.0.0');assert(fs.readFileSync(path.join(root,'prompts',file),'utf8').includes('Prompt version: '+version));
    }
  });
  for(const id of ['FR99','missing']) {
    await test('real CLI surfaces '+id+' ID error with nonzero exit and no UCS output', () => {
      const dir=fs.mkdtempSync(path.join(os.tmpdir(),'traceability-test-'));
      try {
        const input=path.join(dir,'input.md');fs.writeFileSync(input,'## Basic Flow\n'+originalText);
        const result=spawnSync(process.execPath,['--require',path.join(__dirname,'source-traceability-preload.js'),
          path.join(root,'src/index.js'),'pipeline',input,'-o',path.join(dir,'out')],
          {encoding:'utf8',env:{...process.env,TRACE_TEST_ID:id,SAVE_LLM_TRACES:'false'}});
        if(result.error)throw result.error;
        assert.equal(result.status,1);assert.match(result.stderr,/Pipeline error: Structuring: step "4"/);
        assert(result.stderr.includes(id==='missing'?'<missing>':'"FR99"'));assert(!result.stderr.includes('[object Object]'));
        assert(!fs.existsSync(path.join(dir,'out/input-ucs.json')));
        console.log(result.stderr.trim());
      } finally {fs.rmSync(dir,{recursive:true,force:true});}
    });
  }
};
