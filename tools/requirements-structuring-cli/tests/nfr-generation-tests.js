const assert = require('assert');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { NFRClassifier } = require('../src/nfr-classifier');
const { loadNFRLibrary } = require('../src/nfr-library');
const { matchingPatterns, generateCandidates } = require('../src/nfr-candidates');
const { formatCandidateReport } = require('../src/nfr-candidate-report');
const { assertGenerationOutputAvailable, writeGenerationReport } = require('../src/nfr-output');
const NFRGenerator = require('../src/nfr-generator');
const fixture = require('./fixtures/nfr-classification.json');

module.exports = async function(runner) {
  const test = (name, fn) => runner.test(`NFR generation: ${name}`, async () => { await fn(); return true; });
  const llm = { provider: 'fixture', model: 'fixture', loadPrompt: async () => '',
    chatJSON: async () => ({ assignments: [{ subCharacteristic: 'authenticity', confidence: 0.8 }] }) };
  const handoff = await new NFRClassifier({ llm }).classify(fixture.input);
  const library = loadNFRLibrary();
  const clone = x => JSON.parse(JSON.stringify(x));
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'nfr-generation-'));
  try {
    await test('matches found, absent and multiple patterns in deterministic ID order', () => {
      const p = library.patterns.find(p => p.subCharacteristic === 'authenticity');
      assert.strictEqual(matchingPatterns(library.patterns, 'authenticity')[0], p);
      assert.deepStrictEqual(matchingPatterns(library.patterns, 'absent'), []);
      assert.deepStrictEqual(matchingPatterns([{...p,id:'z'}, {...p,id:'a'}], 'authenticity').map(p=>p.id), ['a','z']);
    });
    await test('default neutral includes no overlay; explicit overlay is additive', () => {
      const overlay = loadNFRLibrary({overlay:'wcag-22'});
      const extra = overlay.patterns.find(p=>!p.id.startsWith('core.'));
      const input=clone(handoff); input.requirements.forEach(r=>{r.attributes=[{characteristic:extra.characteristic,subCharacteristic:extra.subCharacteristic,confidence:0.6,sourceTaxonomyVersion:'0.1.0'}];});
      const neutral=generateCandidates(input); const selected=generateCandidates(input,{overlay:'wcag-22'});
      assert.strictEqual(selected.candidates.length, neutral.candidates.length*2);
      assert(neutral.candidates.every(c=>c.patternId.startsWith('core.')));
      assert(selected.candidates.some(c=>c.patternId===extra.id));
      assert(selected.candidates.every(c=>c.bindings.target==='[NEEDS INPUT: target]'));
      assert.throws(()=>generateCandidates(input,{overlay:'unknown'}), /Unknown NFR overlay/);
    });
    await test('rendering is identical twice and never mutates its handoff', () => {
      const before=JSON.stringify(handoff);
      assert.deepStrictEqual(generateCandidates(handoff),generateCandidates(handoff));
      assert.strictEqual(JSON.stringify(handoff),before);
    });
    await test('every core pattern renders without inferred targets or conditions', () => {
      const input=clone(handoff);
      input.requirements=[{...input.requirements[0],attributes:library.patterns.map(p=>({characteristic:p.characteristic,subCharacteristic:p.subCharacteristic,confidence:0.5,sourceTaxonomyVersion:'0.1.0'}))}];
      const output=generateCandidates(input);
      assert.strictEqual(output.candidates.length,40);
      for(const c of output.candidates){
        assert.strictEqual(c.bindings.target,'[NEEDS INPUT: target]');
        assert.strictEqual(c.bindings.conditions,'[NEEDS INPUT: conditions]');
        assert(c.text.includes('[NEEDS INPUT: target]'));
        assert(c.text.includes('[NEEDS INPUT: conditions]'));
        assert(!c.text.includes('{{'));
        assert.strictEqual((c.text.match(/\bshall\b/g)||[]).length,1);
        assert.strictEqual(c.unboundParameters.length,4);
      }
    });
    await test('retains source, confidence and complete framework provenance', () => {
      const c=generateCandidates(handoff).candidates[0];
      assert.deepStrictEqual(c.source,handoff.requirements[0].source);
      assert.strictEqual(c.confidence,0.8);assert.strictEqual(c.sourceTaxonomyVersion,'0.1.0');
      assert(c.metric.unit); assert(c.frameworks.every(f=>f.title&&f.edition&&f.section&&f.url));
    });
    await test('Markdown groups FRs and characteristics and displays metric and references', () => {
      const report=formatCandidateReport(generateCandidates(handoff));
      for(const marker of ['Generated NFR Candidates','### FR /steps/0','#### security','Metric:','unit:','Framework:','Pattern:','NEEDS INPUT: target']) assert(report.includes(marker),marker);
    });
    await test('coverage reports eight uncovered characteristics and every unbound candidate', () => {
      const output=generateCandidates(handoff);assert.strictEqual(output.uncoveredCharacteristics.length,8);
      assert(!output.uncoveredCharacteristics.includes('security'));
      const report=formatCandidateReport(output);
      assert(report.includes('Coverage Gaps and Missing Inputs'));
      assert(report.includes('Unbound parameters per candidate'));
      assert(report.includes('NEEDS INPUT: conditions'));
    });
    await test('unmapped FRs yield explicit gaps and no fabricated requirements', () => {
      const input=clone(handoff);input.requirements.forEach(r=>{r.attributes=[];r.status='unmapped';});
      const output=generateCandidates(input);assert.strictEqual(output.candidates.length,0);
      assert.strictEqual(output.uncoveredCharacteristics.length,9);
      assert.strictEqual(output.unmappedSources.length,input.requirements.length);
    });
    await test('rejects invalid versions, taxonomy hash, source IDs and assignment confidence', () => {
      for(const mutate of [x=>x.schemaVersion='2',x=>x.sourceTaxonomyVersion='x',x=>x.taxonomySha256='bad',
        x=>x.requirements[0].source.path='/../../etc',x=>x.requirements[0].attributes[0].confidence=2,
        x=>x.requirements[0].attributes[0].subCharacteristic='unknown']){
        const input=clone(handoff);mutate(input);assert.throws(()=>generateCandidates(input));
      }
    });
    await test('existing edited output blocks before a provider call and preserves all bytes', async () => {
      const output=path.join(temp,'blocked');await fs.ensureDir(output);
      const report=path.join(output,'requirements-nfr-report.md');await fs.writeFile(report,'HUMAN EDIT');
      const throwing={loadPrompt:async()=>{throw new Error('Provider should not run');}};
      await assert.rejects(new NFRGenerator({llm:throwing}).run(fixture.input,{output}), /already exists.*--force/);
      assert.strictEqual(await fs.readFile(report,'utf8'),'HUMAN EDIT');
    });
    await test('force replaces report while retaining exact classification JSON contract', async () => {
      const output=path.join(temp,'forced');const generator=new NFRGenerator({llm});
      const result=await generator.run(fixture.input,{output});await fs.writeFile(result.reportPath,'HUMAN EDIT');
      await assert.rejects(generator.run(fixture.input,{output}),/already exists/);
      const forced=await generator.run(fixture.input,{output,force:true});
      assert((await fs.readFile(forced.reportPath,'utf8')).includes('Generated NFR Candidates'));
      assert.deepStrictEqual(await fs.readJSON(forced.classificationPath),forced.classifications);
    });
    await test('existing classification alone blocks before provider access', async () => {
      const output=path.join(temp,'class-only');await fs.ensureDir(output);
      await fs.writeFile(path.join(output,'requirements-nfr-classifications.json'),'PRIOR');
      await assert.rejects(new NFRGenerator({llm}).run(fixture.input,{output}), /already exists/);
    });
    await test('exclusive report writes and symlink refusal protect existing files', async () => {
      const file=path.join(temp,'exclusive.md');await writeGenerationReport(file,'first');
      await assert.rejects(writeGenerationReport(file,'second'),/already exists/);
      const link=path.join(temp,'link.md');await fs.symlink(file,link);
      assert.throws(()=>assertGenerationOutputAvailable(link,true),/Unsafe/);
      assert.strictEqual(await fs.readFile(file,'utf8'),'first');
    });
    await test('standalone command accepts force and preserves output without it', async () => {
      const root=path.resolve(__dirname,'..');const input=path.join(temp,'input.json');await fs.writeJSON(input,fixture.input);
      const output=path.join(temp,'cli');
      const env={...process.env,NODE_OPTIONS:'',NFR_ATTRIBUTES:'',SAVE_LLM_TRACES:'false'};
      const run=extra=>spawnSync(process.execPath,['--require',path.join(__dirname,'nfr-classification-preload.js'),path.join(root,'src/index.js'),'generate-nfr',input,'-o',output,...extra],{cwd:temp,env,encoding:'utf8',timeout:15000});
      let r=run([]);assert.strictEqual(r.status,0,r.stderr);
      const report=path.join(output,'input-nfr-report.md');await fs.writeFile(report,'MANUAL');
      r=run([]);assert.strictEqual(r.status,1);assert(r.stderr.includes('--force'));assert.strictEqual(await fs.readFile(report,'utf8'),'MANUAL');
      r=run(['--force']);assert.strictEqual(r.status,0,r.stderr);assert(r.stdout.includes('JSON handoff'));
    });
  } finally { await fs.remove(temp); }
};
