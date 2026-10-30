const {test}=require('node:test');
const assert=require('node:assert/strict');
const {validatePolicy,readiness,acceptanceFlags,buildReport,publishDigest}=require('../scripts/planning-automation.cjs');
const original=require('../.github/planning-policy.json');
const policy=()=>structuredClone(original);
function fixture(){
 const p=policy();
 const issues=Object.keys(p.candidates).map(Number).map(number=>({number,title:'Example',state:'open',assignees:[{login:'mirichard'}],labels:[],milestone:{number:38},created_at:'2026-01-01',updated_at:'2026-10-30'}));
 return {issues,boards:{backlog:[],discovery:[],delivery:p.sprints.flatMap(s=>s.issues.map(number=>({number,Status:'Todo','v2.5 Sprint':s.title})))},children:{},parents:Object.fromEntries(Object.entries(p.candidates).map(([n,c])=>[n,c.parent])),iterations:p.sprints.map(s=>({title:s.title,startDate:s.start,duration:21}))};
}
const now=new Date('2026-10-30T12:00:00Z');
test('calendar rejects impossible dates, nonconsecutive sprints and duplicate allocations',()=>{
 validatePolicy(policy());
 for(const mutate of [p=>p.sprints[0].start='2026-02-30',p=>p.sprints[1].start='2026-12-01',p=>p.sprints[1].issues.push(1559),p=>p.sprints[0].capacityDays=-1]){
  const p=policy();mutate(p);assert.throws(()=>validatePolicy(p));
 }
});
test('readiness requires explicit decision and native parent; epic cannot count as leaf capacity',()=>{
 const p=policy(),s=fixture(),i=s.issues[0];i.body='- [x] All complete; CI green';
 assert.ok(readiness(i,s,p).includes('owner readiness decision missing'));
 p.readinessDecisions[i.number]={owner:'mirichard',date:'2026-10-30',record:'https://github.com/mirichard/pm-tools-templates/issues/1559',decision:'ready',outcome:'find',scope:'bounded',acceptance:'fixture',dependencies:'none'};
 assert.deepEqual(readiness(i,s,p),[]);
 s.parents[i.number]=999;i.labels=['type:epic'];
 assert.match(readiness(i,s,p).join(' '),/native parent.*parent rollup/);
});
test('Done requires issue-specific criteria and revision; preserves accepted walkthrough',()=>{
 const p=policy(),s=fixture();s.boards.delivery[0].Status='Done';s.issues[0].state='closed';s.issues[0].state_reason='completed';
 assert.match(acceptanceFlags(s,p).join(' '),/acceptance record/);
 p.acceptanceDecisions[1559]={owner:'mirichard',date:'2026-10-30',record:'https://github.com/mirichard/pm-tools-templates/issues/1559',decision:'accepted',revision:'a'.repeat(40),criteria:[{criterion:'find',evidence:'https://github.com/mirichard/pm-tools-templates/issues/1559',result:'pass'}]};
 assert.deepEqual(acceptanceFlags(s,p),[]);
 s.children[1559]=[{state:'open'}];assert.match(acceptanceFlags(s,p).join(' '),/residual-scope/);
 s.issues[0].number=1482;s.boards.delivery[0].number=1482;assert.deepEqual(acceptanceFlags(s,p),[]);
});
test('new uses creation date; aging excludes deliberate Later and Paused',()=>{
 const s=fixture();s.issues[0].updated_at='2026-10-29';s.issues[1].created_at='2026-10-29';
 for(const [idx,fields] of [[2,{Horizon:'Later'}],[3,{Status:'Paused'}]]){s.issues[idx].updated_at='2025-01-01';s.boards.backlog.push({number:s.issues[idx].number,...fields});}
 s.issues[4].labels=['type:candidate'];s.issues[4].updated_at='2025-01-01';
 assert.deepEqual(buildReport(s,policy(),now).counts,{new:1,untriaged:0,aging:0});
});
test('capacity unknown is not commitment; mismatched calendar and double assignment are visible',()=>{
 const s=fixture();s.iterations[0].duration=14;s.boards.delivery[0].Sprint='Sprint 3';
 const r=buildReport(s,policy(),now);assert.match(r.body,/UNCONFIRMED/);assert.match(r.body,/sprint field missing\/conflicting/);assert.match(r.warnings.join(' '),/calendar differs/);
});
test('single digest is idempotent and never reopens a closed decision record',async()=>{
 const body='<!-- planning-automation:v1 -->\nreport';let updates=0,creates=0;
 const old={number:99,state:'open',body,html_url:'url'};
 const github={paginate:async()=>[old],rest:{issues:{listForRepo(){},update:async()=>{updates++;return{data:old}},create:async()=>{creates++;return{data:old}}}}};
 assert.equal(await publishDigest(github,body),'url');assert.equal(updates+creates,0);
 await publishDigest(github,body+' changed');assert.equal(updates,1);
 old.state='closed';await assert.rejects(publishDigest(github,body),/refusing to reopen/);
 github.paginate=async()=>[old,old];await assert.rejects(publishDigest(github,body),/Multiple/);
 await assert.rejects(publishDigest(github,'x'.repeat(60001)),/safe issue size/);
});
test('unavailable discovery is a visible limitation, never an empty-queue success',()=>{
 const s=fixture();s.collectionWarnings=['Research project #13 unavailable: checks NOT performed'];
 const r=buildReport(s,policy(),now);assert.match(r.body,/Research project #13 unavailable: checks NOT performed/);assert.equal(r.warnings.length,1);
});
