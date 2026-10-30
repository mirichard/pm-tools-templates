'use strict';

// Deterministic preparation. No inferred acceptance, priority or capacity.
const fs = require('node:fs');
const crypto = require('node:crypto');
const {projectItems, cell} = require('./roadmap-sync.cjs');
const policy = require('../.github/planning-policy.json');
const marker = '<!-- planning-automation:v1 -->';
const day = 86400000;
const labels = issue => (issue.labels || []).map(x => typeof x === 'string' ? x : x.name);
const link = n => `[#${n}](https://github.com/${policy.repository}/issues/${n})`;
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

function validatePolicy(p) {
  if (p.sprintDays !== 21) throw new Error('Expected owner-approved 21-day cadence');
  const titles = new Set(), numbers = new Set();
  let previousEnd = null;
  for (const s of p.sprints) {
    const start = Date.parse(s.start + 'T00:00:00Z');
    if (!Number.isFinite(start) || new Date(start).toISOString().slice(0,10) !== s.start || titles.has(s.title)) throw new Error('Invalid sprint date/title');
    if (previousEnd !== null && start !== previousEnd + day) throw new Error('Sprint dates must be consecutive');
    previousEnd = start + (p.sprintDays - 1) * day;
    titles.add(s.title);
    if (s.capacityDays !== null && (!Number.isFinite(s.capacityDays) || s.capacityDays < 0)) throw new Error('Invalid capacity');
    for (const n of s.issues) {
      if (!Number.isSafeInteger(n) || n < 1 || numbers.has(n)) throw new Error('Duplicate/invalid sprint issue');
      numbers.add(n);
      const estimate = p.candidates[n]?.estimateDays;
      if (!estimate || estimate.length !== 2 || estimate.some(x => !Number.isFinite(x) || x < 0) || estimate[0] > estimate[1]) throw new Error('Invalid estimate');
    }
  }
}

async function collect(github, graphql, p = policy) {
  const [owner, repo] = p.repository.split('/');
  const boards = {}, collectionWarnings = [];
  for (const [name, number] of Object.entries(p.projects)) {
    try { boards[name] = await projectItems(graphql, number); }
    catch (error) {
      if (name !== 'discovery' || !String(error.message).includes('Could not resolve to a ProjectV2')) throw error;
      boards[name] = [];
      collectionWarnings.push('Research project #13 unavailable to workflow credential: live discovery stage/promotion checks NOT performed. Use #1566 for the recorded plan; do not infer an empty research queue.');
    }
  }
  // Full pagination and explicit PR exclusion are essential to correct metrics.
  const open = (await github.paginate(github.rest.issues.listForRepo, {owner, repo, state:'open', per_page:100})).filter(x => !x.pull_request);
  const numbers = new Set([...open.map(x => x.number), ...boards.delivery.map(x => x.number), ...Object.keys(p.candidates).map(Number)]);
  const byNumber = new Map(open.map(x => [x.number,x]));
  for (const n of [...numbers].sort((a,b) => a-b)) {
    if (!byNumber.has(n)) byNumber.set(n, (await github.rest.issues.get({owner,repo,issue_number:n})).data);
  }
  const children = {}, parents = {};
  for (const issue of byNumber.values()) {
    if (issue.pull_request) continue;
    if (labels(issue).includes('type:epic') || Object.values(p.candidates).some(x => x.parent === issue.number)) {
      children[issue.number] = await github.paginate('GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues', {owner,repo,issue_number:issue.number,per_page:100});
      for (const child of children[issue.number]) {
        if (parents[child.number] && parents[child.number] !== issue.number) throw new Error('Conflicting native parent');
        parents[child.number] = issue.number;
      }
    }
  }
  const fields = await graphql(`query($owner:String!,$number:Int!){user(login:$owner){projectV2(number:$number){fields(first:100){pageInfo{hasNextPage} nodes{... on ProjectV2IterationField{name configuration{iterations{id title startDate duration} completedIterations{id title startDate duration}}}}}}}}`, {owner:p.projectOwner,number:p.projects.delivery});
  const connection = fields.user?.projectV2?.fields;
  if (!connection || connection.pageInfo.hasNextPage) throw new Error('Incomplete iteration field inventory');
  const iteration = connection.nodes.find(x => x.name === p.iterationField);
  if (!iteration) throw new Error('Configured iteration field missing');
  return {collectionWarnings,issues:[...byNumber.values()].filter(x => !x.pull_request).sort((a,b)=>a.number-b.number),boards,children,parents,iterations:[...iteration.configuration.iterations,...iteration.configuration.completedIterations]};
}

function decisionValid(d, p) {
  return Boolean(d && p.decisionOwners.includes(d.owner) && /^\d{4}-\d{2}-\d{2}$/.test(d.date || '') &&
    new RegExp(`^https://github\\.com/${p.repository}/(?:issues|pull)/\\d+(?:#.*)?$`).test(d.record || ''));
}

function readiness(issue, snapshot, p = policy) {
  const gaps = [], n = issue.number, meta = p.candidates[n], d = p.readinessDecisions[n];
  if (!(issue.assignees || []).length) gaps.push('owner missing');
  if (!meta?.estimateDays) gaps.push('estimate missing');
  if (meta?.parent && snapshot.parents[n] !== meta.parent) gaps.push(`native parent #${meta.parent} missing/mismatched`);
  if (!decisionValid(d,p) || d.decision !== 'ready') gaps.push('owner readiness decision missing');
  for (const field of ['outcome','scope','acceptance','dependencies']) if (!d?.[field]?.trim()) gaps.push(`${field} disposition missing`);
  if (issue.state !== 'open') gaps.push('not open for sprint selection');
  if (labels(issue).includes('type:epic') || (snapshot.children[n] || []).length) gaps.push('parent rollup; select leaf work');
  return gaps;
}

function acceptanceFlags(snapshot, p = policy) {
  const issues = new Map(snapshot.issues.map(i=>[i.number,i])), warnings = [];
  for (const item of snapshot.boards.delivery) {
    if (item.archived) continue;
    const issue = issues.get(item.number);
    if (!issue) throw new Error(`Missing issue #${item.number}`);
    const other = snapshot.boards.backlog.find(x=>x.number===item.number&&!x.archived);
    if (other && other.Status !== item.Status) warnings.push(`#${item.number}: backlog/delivery status disagreement`);
    if (issue.state === 'closed' && issue.state_reason !== 'completed' && item.Status === 'Done') warnings.push(`#${item.number}: closed as ${issue.state_reason || 'unspecified'}, not accepted delivery`);
    if (issue.state === 'open' && item.Status === 'Done') warnings.push(`#${item.number}: open issue marked Done`);
    // Preserve historical owner acceptance; assess the selected release only.
    if (issue.milestone?.number !== p.milestone || p.preservedAcceptance[item.number]) continue;
    const d = p.acceptanceDecisions[item.number];
    if ((item.Status === 'Done' || issue.state === 'closed') && (!decisionValid(d,p) || d.decision !== 'accepted' || !d.criteria?.length || !d.revision?.match(/^[a-f0-9]{40}$/) || d.criteria.some(c=>!c.criterion?.trim() || !/^https:\/\//.test(c.evidence || '') || c.result !== 'pass'))) {
      warnings.push(`#${item.number}: acceptance record must identify criteria, evidence, revision and owner decision`);
    }
    const outstanding = (snapshot.children[item.number] || []).filter(x=>x.state !== 'closed' || x.state_reason !== 'completed');
    if ((item.Status === 'Done' || issue.state === 'closed') && outstanding.length) warnings.push(`#${item.number}: ${outstanding.length} unresolved/non-completed native children; explicit residual-scope decision needed`);
  }
  return warnings;
}

function buildReport(snapshot, p = policy, now = new Date()) {
  validatePolicy(p);
  const issues = snapshot.issues, byNumber = new Map(issues.map(i=>[i.number,i]));
  const warnings = [...(snapshot.collectionWarnings || []), ...acceptanceFlags(snapshot,p)];
  const open = issues.filter(i=>i.state==='open' && !labels(i).includes('type:operational'));
  const recent = open.filter(i=>Date.parse(i.created_at) >= +now-7*day && Date.parse(i.created_at)<=+now);
  const untriaged = open.filter(i=>labels(i).includes('needs-triage'));
  const aging = open.filter(i=>{
    const r=snapshot.boards.backlog.find(x=>x.number===i.number);
    return Date.parse(i.updated_at)<+now-30*day && !['Later'].includes(r?.Horizon) && !['Paused','Done'].includes(r?.Status) && !labels(i).some(x=>['type:epic','type:candidate'].includes(x));
  });
  const lines = [marker,'# Planning decision digest','',`As of ${now.toISOString().slice(0,10)}. Preparation only: no acceptance, prioritization, sprint commitment or publication is inferred.`, '', '## Acceptance and status exceptions','',...(warnings.length?warnings.map(x=>'- '+cell(x)):['No structural exceptions found. This is not acceptance evidence.']), '', '## Backlog review','',`New issues by creation date: ${recent.length}; needs triage: ${untriaged.length}; aging active candidates: ${aging.length}. Intentional Later/Paused, research candidates and operational work are excluded from aging.`, '',...open.filter(i=>recent.includes(i)||untriaged.includes(i)||aging.includes(i)).map(i=>`- ${link(i.number)} ${cell(i.title)} — ${recent.includes(i)?'new; ':''}${untriaged.includes(i)?'needs triage; ':''}${aging.includes(i)?'aging active candidate':''}`), '', '## Sprint preparation',''];
  for (const s of p.sprints) {
    const end = new Date(Date.parse(s.start+'T00:00:00Z')+(p.sprintDays-1)*day).toISOString().slice(0,10);
    const iterations=snapshot.iterations.filter(x=>x.title===s.title);
    if (iterations.length!==1 || iterations[0].startDate!==s.start || iterations[0].duration!==p.sprintDays) warnings.push(`${s.title}: calendar differs from approved ${s.start}, 21 days`);
    const estimates=s.issues.map(n=>p.candidates[n].estimateDays);
    const low=estimates.reduce((a,x)=>a+x[0],0), high=estimates.reduce((a,x)=>a+x[1],0);
    lines.push(`### ${cell(s.title)}: ${s.start}–${end}`,'',`Goal: ${cell(s.goal)}. Effort ${low}–${high} person-days. Capacity: ${s.capacityDays===null?'UNCONFIRMED — no capacity-based commitment':s.capacityDays+' person-days'}. [Separate view](https://github.com/users/${p.projectOwner}/projects/${p.projects.delivery}/views/${s.view}).`,'');
    if(s.capacityDays!==null && high>s.capacityDays) warnings.push(`${s.title}: upper estimate ${high} exceeds capacity ${s.capacityDays}`);
    for(const n of s.issues){
      const issue=byNumber.get(n);
      if(!issue) throw new Error(`Selected issue #${n} missing`);
      const gaps=readiness(issue,snapshot,p);
      const item=snapshot.boards.delivery.find(x=>x.number===n&&!x.archived);
      const assignments=Object.entries(item||{}).filter(([k,v])=>(k==='Sprint'||/^v\d+\.\d+ Sprint$/.test(k))&&v);
      if(assignments.length!==1||item?.[p.iterationField]!==s.title) gaps.push('sprint field missing/conflicting');
      if(issue.milestone?.number!==p.milestone) gaps.push('release milestone mismatch');
      lines.push(`- ${link(n)} ${cell(issue.title)} — ${gaps.length?gaps.map(cell).join('; '):'recorded entry gates present; owner selection still required'}`);
    }
    lines.push('');
  }
  lines.push('## Planning exceptions','',...(warnings.length?warnings.map(x=>'- '+cell(x)):['None detected.']), '', '## Parallel Research & Discovery','',`Proposed allowance ${p.discovery.planningAllowanceDays.join('–')} person-days across the release; maximum ${p.discovery.activeInvestigationLimit} active investigations. This allowance replaces the narrower 4–6-day proposal and must be reconciled with delivery capacity.`, '');
  for(const wave of p.discovery.waves) lines.push(`- By ${wave.checkpoint}: ${wave.focus.map(link).join(', ')} — ${cell(wave.output)}.`);
  lines.push(`- Independent decision track: ${p.discovery.independentDecisionTrack.map(link).join(', ')}. Preserved pause: ${p.discovery.preservePaused.map(link).join(', ')}.`,'','### Discovery queue and promotion gaps','');
  for(const item of snapshot.boards.discovery.filter(x=>!x.archived)){
    const issue=byNumber.get(item.number);
    if(!issue || issue.state!=='open' || !labels(issue).some(x=>['type:epic','type:candidate'].includes(x))) continue;
    lines.push(`- ${link(issue.number)} ${cell(issue.title)} — ${cell(item['Discovery stage']||'stage missing')}; ${p.discovery.preservePaused.includes(issue.number)?'preserve pause': 'promote bounded leaf work only after problem evidence, scope, acceptance, dependencies, estimate and owner decision'}.`);
  }
  lines.push('','Decisions: approve/revise scope and capacity; select candidates; record acceptance against the issue/revision; disposition research as proceed/revise/defer/stop. No automatic carryover, stale closure, telemetry activation or release publication.');
  return {body:lines.join('\n')+'\n',warnings,counts:{new:recent.length,untriaged:untriaged.length,aging:aging.length}};
}

async function publishDigest(github, body, p = policy) {
  if (Buffer.byteLength(body,'utf8')>60000) throw new Error('Digest exceeds safe issue size; retained artifact only');
  const [owner,repo]=p.repository.split('/');
  // List all open issues, not search indexing: reruns cannot race stale search results.
  const all=await github.paginate(github.rest.issues.listForRepo,{owner,repo,state:'all',labels:'planning-digest',per_page:100});
  const matching=all.filter(i=>!i.pull_request && i.body?.startsWith(marker));
  if(matching.length>1) throw new Error('Multiple planning digests; manual reconciliation required');
  if(matching.length){
    const old=matching[0];
    if(old.state!=='open') throw new Error('Planning digest intentionally closed; refusing to reopen');
    if(old.body===body) return old.html_url;
    return (await github.rest.issues.update({owner,repo,issue_number:old.number,body})).data.html_url;
  }
  try { await github.rest.issues.getLabel({owner,repo,name:'planning-digest'}); }
  catch(error) { if(error.status!==404) throw error; await github.rest.issues.createLabel({owner,repo,name:'planning-digest',color:'5319e7',description:'Single recurring planning decision digest'}); }
  return (await github.rest.issues.create({owner,repo,title:'Planning decision digest — backlog, sprints and discovery',body,labels:['type:operational','planning-digest']})).data.html_url;
}

async function run({github,graphql,core,preview=true,issueNumber=null}){
  const snapshot=await collect(github,graphql);
  const report=buildReport(snapshot);
  fs.mkdirSync('planning-preview',{recursive:true});
  fs.writeFileSync('planning-preview/report.md',report.body);
  fs.writeFileSync('planning-preview/snapshot.json',JSON.stringify(snapshot,null,2));
  if(issueNumber!==null){
    if(!Number.isSafeInteger(issueNumber)||issueNumber<1) throw new Error('Invalid issue number');
    const issue=snapshot.issues.find(i=>i.number===issueNumber);
    if(!issue) throw new Error('Issue not in planning inventory');
    const d=policy.acceptanceDecisions[issueNumber];
    core.info(`Issue #${issueNumber}: acceptance decision record ${decisionValid(d,policy)?'present (human review required)':'absent'}. No generic CI/commit-keyword acceptance is performed.`);
  }
  await core.summary.addRaw(report.body).write();
  if(!preview) core.info(`Decision digest: ${await publishDigest(github,report.body)}`);
  return {warnings:report.warnings,fingerprint:hash(snapshot)};
}
module.exports={validatePolicy,collect,readiness,acceptanceFlags,buildReport,publishDigest,run,decisionValid};
