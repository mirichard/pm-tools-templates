'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {snapshotTime, cell, replaceBlock, projectItems, collect, render, publish} = require('../scripts/roadmap-sync.cjs');
const fixture = () => ({issues: [
  {number: 78, title: 'Roadmap', state: 'closed', reason: 'completed', parent: 319, types: ['type:story']},
  {number: 1383, title: 'Residual', state: 'open', reason: null, parent: 319, types: ['type:story']}
], roadmap: [{number:78, Status:'Done', Outcome:'O4', Horizon:'Now'},
  {number:1383, Status:'Todo', Outcome:'O4', Horizon:'Unscheduled'}],
  sprint: [{number:78, Status:'Done', Sprint:'Sprint 1'}]});

test('accepted closeout and unscheduled residual remain distinct', () => {
  const result = render(fixture());
  assert.deepEqual(result.warnings, []);
  assert.match(result.summary, /Closed \(completed\)/);
  assert.doesNotMatch(result.summary, /Residual/);
  assert.match(result.register, /Residual.*Open.*319.*Unscheduled/);
});
test('closed not-planned remains visibly distinct from completed', () => {
  const data=fixture(); data.issues[0].reason='not_planned';
  assert.match(render(data).summary, /Closed \(not_planned\)/);
});
test('flags missing mapping, open Done, closed active and conflicting boards without mutating inputs', () => {
  const data=fixture(); data.roadmap[0].Status='In Progress'; data.roadmap[1].Status='Done';
  delete data.roadmap[1].Outcome; data.issues[1].types=[];
  const before=JSON.stringify(data), result=render(data);
  assert.equal(JSON.stringify(data),before);
  assert.ok(result.warnings.some(x=>x.includes('closed issue')));
  assert.ok(result.warnings.some(x=>x.includes('open issue')));
  assert.ok(result.warnings.some(x=>x.includes('board statuses differ')));
  assert.ok(result.warnings.some(x=>x.includes('missing Outcome')));
  assert.ok(result.warnings.some(x=>x.includes('type label')));
});
test('new open issue outside the board and archived open item are visible drift', () => {
  const data=fixture(); data.roadmap[1].archived=true;
  data.issues.push({number:9999,title:'New',state:'open',types:['type:task']});
  assert.equal(render(data).warnings.filter(x=>x.includes('missing or archived')).length,2);
});
test('deterministic ordering and no wall-clock timestamp churn', () => {
  const data=fixture(), first=render(data); data.issues.reverse(); data.roadmap.reverse();
  assert.deepEqual(render(data), first);
});
test('untrusted titles cannot inject table rows or HTML', () => {
  assert.equal(cell('<img> | [link]\nnext'), '&lt;img&gt; &#124; &#91;link&#93; next');
});
test('replace only one marked block and reject missing or duplicate markers', () => {
  const source='Strategy\n<!-- roadmap-sync:start -->\nold\n<!-- roadmap-sync:end -->\nDecision';
  assert.equal(replaceBlock(source,'new'),source.replace('old','new'));
  assert.throws(()=>replaceBlock('no markers','new'));
  assert.throws(()=>replaceBlock(source+'<!-- roadmap-sync:start -->','new'));
});
function page(number, more=false, truncated=false) {
  return {user:{projectV2:{items:{pageInfo:{hasNextPage:more,endCursor:more?'next':null}, nodes:[{
    isArchived:false,content:{__typename:'Issue',number,repository:{nameWithOwner:'mirichard/pm-tools-templates'}},
    fieldValues:{pageInfo:{hasNextPage:truncated},nodes:[{field:{name:'Status'},name:'Todo'}]}
  }]}}}};
}
test('projects paginate completely and pass cursors', async () => {
  const calls=[]; const result=await projectItems(async(q,args)=>{calls.push(args.cursor);return page(calls.length,calls.length===1);},11);
  assert.equal(result.length,2); assert.deepEqual(calls,[null,'next']);
});
test('missing/inaccessible projects and truncated fields fail closed', async () => {
  await assert.rejects(projectItems(async()=>({user:{projectV2:null}}),11),/unavailable/);
  await assert.rejects(projectItems(async()=>page(1,false,true),11),/truncated/);
  await assert.rejects(projectItems(async()=>{throw Error('denied');},11),/denied/);
});
test('collector uses all-open paginated list and includes retained closed items; excludes PRs', async () => {
  const reads=[];
  const github={paginate:async()=>[{number:2000},{number:2001,pull_request:{}}],rest:{issues:{listForRepo:()=>{},get:async({issue_number})=>{
    reads.push(issue_number);return {data:{title:'Issue',state:'closed',state_reason:'completed',labels:[{name:'type:story'}],parent_issue_url:'https://api.github.com/repos/mirichard/pm-tools-templates/issues/319'}};
  }}}};
  const result=await collect(github,async(q,args)=>page(args.number===11?78:75));
  assert.ok(reads.includes(2000));assert.ok(reads.includes(1367));assert.ok(!reads.includes(2001));
  assert.equal(result.issues[0].parent,319);
});
function publisher({existing=false, same=false, human=false, foreignPR=false}={}) {
  const calls=[]; const contents={'ROADMAP.md':'new','backlog/roadmap-status.md':'register'};
  const record=name=>async args=>{calls.push({name,args});return {data:{sha:name,html_url:'https://github.com/example/pr'}};};
  const github={paginate:async()=>existing?[{number:1,body:foreignPR?'Human PR':'<!-- roadmap-sync:v1 -->',html_url:'existing'}]:[],rest:{
    git:{getRef:async()=>{if(!existing)throw Object.assign(Error(),{status:404});return {data:{object:{sha:'head'}}};},
      getCommit:async({commit_sha})=>({data:{message:commit_sha==='head'&&human?'manual':'docs(roadmap): refresh generated status',tree:{sha:'tree'}}}),
      createTree:record('tree'),createCommit:record('commit'),createRef:record('createRef'),updateRef:record('updateRef')},
    repos:{getContent:async({path})=>({data:{encoding:'base64',content:Buffer.from(same?contents[path]:'old').toString('base64')}})},
    pulls:{list:()=>{},create:record('createPR'),update:record('updatePR')}
  }};
  return {github,calls,contents};
}
test('first publication writes only allowed files and creates one PR', async () => {
  const x=publisher();await publish(x.github,x.contents,{warnings:[],digest:'digest'},'base');
  assert.deepEqual(x.calls.find(x=>x.name==='tree').args.tree.map(x=>x.path),['ROADMAP.md','backlog/roadmap-status.md']);
  assert.equal(x.calls.filter(x=>x.name==='createPR').length,1);
});
test('existing PR is refreshed fast-forward without another PR', async () => {
  const x=publisher({existing:true});await publish(x.github,x.contents,{warnings:[],digest:'digest'},'base');
  assert.equal(x.calls.filter(x=>x.name==='createPR').length,0);
  assert.equal(x.calls.find(x=>x.name==='updateRef').args.force,false);
  assert.deepEqual(x.calls.find(x=>x.name==='commit').args.parents,['head','base']);
});
test('identical pending snapshot makes no writes', async () => {
  const x=publisher({existing:true,same:true});await publish(x.github,x.contents,{warnings:[],digest:'digest'},'base');assert.equal(x.calls.length,0);
});
test('human branch or foreign PR is not overwritten', async () => {
  for(const options of [{existing:true,human:true},{existing:true,foreignPR:true}]) {
    const x=publisher(options);await assert.rejects(publish(x.github,x.contents,{warnings:[],digest:'digest'},'base'));
    assert.equal(x.calls.length,0);
  }
});

test('freshness preserves main and pending timestamps but advances for changed data', () => {
  const old = '2026-09-26T18:05:00.000Z', now = '2026-09-26T20:05:00.000Z';
  const record = digest => `Snapshot updated at: ${old} (UTC).\nSnapshot fingerprint: \`${digest}\``;
  assert.equal(snapshotTime('same', [record('same')], now), old);
  assert.equal(snapshotTime('same', [record('older'), record('same')], now), old);
  assert.equal(snapshotTime('changed', [record('same')], now), now);
  assert.equal(snapshotTime('same', ['Snapshot fingerprint: `same`'], now), now);
  assert.equal(snapshotTime('same', [record('same').replace(old, 'invalid')], now), now);
});

test('reconciliation retains identical output before and after snapshot merge', async () => {
  const {run} = require('../scripts/roadmap-sync.cjs');
  const fs = require('node:fs');
  const os = require('node:os');
  const path = require('node:path');
  const cwd = process.cwd(), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'roadmap-freshness-'));
  const original = {'ROADMAP.md':'Narrative\n<!-- roadmap-sync:start -->\nold\n<!-- roadmap-sync:end -->',
    'backlog/roadmap-status.md':'old'};
  let pending;
  const github = {paginate:async()=>[],rest:{issues:{listForRepo:()=>{},get:async()=>({data:{
    title:'Issue',state:'open',labels:[{name:'type:story'}]}})},repos:{
    getBranch:async()=>({data:{commit:{sha:'base'}}}),
    getContent:async({ref,path})=>{
      if(ref!=='base' && !pending) throw Object.assign(Error('missing'),{status:404});
      return {data:{type:'file',encoding:'base64',content:Buffer.from((ref==='base'?original:pending)[path]).toString('base64')}};
    }}}};
  const core = {summary:{addRaw(){return this;},async write(){}}};
  const args = {github,graphql:async(q,a)=>page(a.number===11?78:75),core,preview:true};
  try {
    process.chdir(dir);
    assert.equal((await run(args)).changed,true);
    const read = () => ({'ROADMAP.md':fs.readFileSync('roadmap-sync-preview/roadmap.md','utf8'),
      'backlog/roadmap-status.md':fs.readFileSync('roadmap-sync-preview/status.md','utf8')});
    pending = read();
    assert.match(pending['ROADMAP.md'], /Snapshot updated at: .*Z \(UTC\)/);
    assert.equal((await run(args)).changed,true);
    assert.deepEqual(read(),pending);
    Object.assign(original,pending);
    assert.equal((await run(args)).changed,false);
    assert.deepEqual(read(),pending);
  } finally { process.chdir(cwd); fs.rmSync(dir,{recursive:true,force:true}); }
});
