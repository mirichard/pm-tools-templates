'use strict';

const roles = ['product-owner', 'project-manager', 'scrum-master'];
const day = 86400000;
const issueLabels = issue => (issue.labels || []).map(label => typeof label === 'string' ? label : label.name);
const issueUrl = (repository, number) => `https://github.com/${repository}/issues/${number}`;
const reviewUrl = repository => `https://${repository.split('/')[0]}.github.io/${repository.split('/')[1]}/planning-review/`;

function buildReview(snapshot, policy, options = {}) {
  const { readiness, acceptanceFlags } = require('./planning-automation.cjs');
  const generatedAt = new Date(options.now || Date.now()).toISOString();
  const issues = new Map(snapshot.issues.map(issue => [issue.number, issue]));
  const coverageWarnings = snapshot.collectionWarnings || [];
  const discoveryAvailable = coverageWarnings.length === 0;
  const inventory = snapshot.issues.map(issue => {
    const discovery = snapshot.boards.discovery.find(item => item.number === issue.number && !item.archived);
    const delivery = snapshot.boards.delivery.find(item => item.number === issue.number && !item.archived);
    const backlog = snapshot.boards.backlog.find(item => item.number === issue.number && !item.archived);
    return {
      number: issue.number, title: issue.title, url: issueUrl(policy.repository, issue.number),
      state: issue.state, stateReason: issue.state_reason || '',
      stream: delivery ? 'delivery' : discovery ? 'discovery' : 'backlog',
      stage: discovery ? discovery['Discovery stage'] || '' : '',
      status: delivery?.Status || discovery?.Status || backlog?.Status || '',
      sprint: delivery?.[policy.iterationField] || '',
      milestone: issue.milestone?.title || '',
      release: issue.milestone?.number === policy.milestone ? policy.release : '',
      horizon: backlog?.Horizon || ''
    };
  });
  const findings = [];
  const sourcesFor = numbers => numbers.filter(number => issues.has(number)).map(number => ({
    number, title: issues.get(number).title, url: issueUrl(policy.repository, number)
  }));
  function add(finding) {
    findings.push({ roles, release: '', sprint: '', stage: '', changed: false, ...finding });
  }
  if (!discoveryAvailable) {
    add({ id: 'discovery-coverage', title: 'Discovery-stage coverage is unavailable', stream: 'discovery',
      severity: 'critical', decisionRequired: false, facts: coverageWarnings,
      impact: 'Research stages and promotion gaps cannot be assessed from this collection.',
      recommendation: 'Restore collection access and rerun the review before making a stage-based recommendation.', sources: [] });
  }
  for (const sprint of policy.sprints) {
    const end = new Date(Date.parse(sprint.start) + (policy.sprintDays - 1) * day).toISOString().slice(0, 10);
    if (end < generatedAt.slice(0, 10)) continue;
    const gaps = sprint.issues.flatMap(number => {
      const issue = issues.get(number);
      if (!issue) return [`#${number} is absent from the collected issue inventory.`];
      return readiness(issue, snapshot, policy).map(gap => `#${number}: ${gap}`);
    });
    if (gaps.length) {
      const hasDocumentedDefinitionDecision = sprint.issues.some(number => /\*\*Decisions still needed:\*\*/i.test(issues.get(number)?.body || ''));
      add({ id: `readiness-${sprint.title.replace(/\s+/g, '-').toLowerCase()}`,
        title: `${sprint.title} entry records need reconciliation`, stream: 'delivery', sprint: sprint.title, release: policy.release,
        roles: hasDocumentedDefinitionDecision ? ['project-manager', 'scrum-master'] : roles,
        severity: 'attention', decisionRequired: !hasDocumentedDefinitionDecision,
        facts: [`${sprint.issues.length} selected work items were checked against the recorded entry criteria.`, ...gaps],
        impact: `Recorded entry evidence is incomplete for the ${sprint.start} to ${end} planning window. Existing issue decisions may already answer some gaps.`,
        recommendation: 'Reconcile the linked issue decisions with the entry records, then resolve only the remaining scope, acceptance or dependency decisions.',
        roleActions: {
          'product-owner': 'Confirm the remaining outcome, scope and acceptance decisions using existing issue evidence.',
          'project-manager': 'Reconcile entry records and dependency sequencing before confirming the planned allocation.',
          'scrum-master': 'Bring the specific remaining entry gaps into planning and link evidence that already resolves them.'
        }, sources: sourcesFor(sprint.issues) });
    }
    const iteration = snapshot.iterations.filter(item => item.title === sprint.title);
    if (iteration.length !== 1 || iteration[0].startDate !== sprint.start || iteration[0].duration !== policy.sprintDays) {
      add({ id: `calendar-${sprint.title.replace(/\s+/g, '-').toLowerCase()}`,
        title: `${sprint.title} dates disagree with the recorded plan`, stream: 'delivery', sprint: sprint.title, release: policy.release,
        severity: 'critical', decisionRequired: true,
        facts: [`The plan specifies ${sprint.start} and ${policy.sprintDays} days; the collected iteration does not match.`],
        impact: 'Date-based planning views can refer to different delivery windows.',
        recommendation: 'Reconcile the approved plan and iteration dates before using the window for a commitment.', sources: sourcesFor(sprint.issues) });
    }
  }
  const acceptanceGroups = new Map();
  for (const warning of acceptanceFlags(snapshot, policy)) {
    const key = warning.replace(/^#[0-9]+: /, '').replace(/[0-9]+/g, 'n');
    if (!acceptanceGroups.has(key)) acceptanceGroups.set(key, []);
    acceptanceGroups.get(key).push(warning);
  }
  for (const [kind, warnings] of acceptanceGroups) {
    const numbers = warnings.map(warning => Number(warning.match(/^#(\d+)/)?.[1]));
    const stopped = kind.startsWith('closed as not_planned');
    add({ id: `acceptance-${kind.replace(/[^a-z]+/gi, '-').toLowerCase()}`,
      title: stopped ? `${numbers.length} stopped work item${numbers.length === 1 ? ' is' : 's are'} still marked Done` : `Reconcile ${numbers.length} delivery disposition record${numbers.length === 1 ? '' : 's'}`,
      roles: ['project-manager', 'scrum-master'], stream: 'delivery',
      release: numbers.every(number => inventory.find(item => item.number === number)?.release === policy.release) ? policy.release : '',
      severity: stopped ? 'review' : 'attention', decisionRequired: false,
      facts: warnings, impact: 'The board status alone does not establish accepted delivery.',
      recommendation: 'Reconcile the affected board records with the existing completion or stop decisions and preserve their evidence.', sources: sourcesFor(numbers) });
  }
  const references = new Set([
    ...policy.discovery.independentDecisionTrack, ...policy.discovery.preservePaused,
    ...policy.discovery.deliveryRefinement, ...policy.discovery.waves.flatMap(wave => wave.focus)
  ]);
  for (const number of references) {
    const issue = issues.get(number);
    if (issue?.state === 'closed' && issue.state_reason === 'not_planned') {
      add({ id: `superseded-policy-${number}`, title: `Retire the superseded planning reference to #${number}`,
        stream: 'discovery', severity: 'attention', decisionRequired: false,
        facts: [`The planning policy still references #${number}. The issue is closed as not planned.`],
        impact: 'The review can continue surfacing follow-ups that the owner has already cancelled.',
        recommendation: 'Reconcile the policy reference with the recorded stop decision. Preserve the historical research and rationale.', sources: sourcesFor([number]) });
    }
  }
  for (const issue of snapshot.issues.filter(item => item.state === 'open')) {
    const entry = inventory.find(item => item.number === issue.number);
    const labels = issueLabels(issue);
    const decisionText = issue.body?.match(/\*\*Decisions still needed:\*\*\s*([^\n]+)/i)?.[1];
    if (decisionText) {
      const gatedNumber = Number(issue.body.match(/#(\d+)\s+remains gated/i)?.[1]);
      const topic = issue.title.replace(/^Task:\s*Define\s*/i, '').replace(/^Task:\s*/i, '');
      const decisionScope = decisionText.split(/\.\s+(?=#|No repeat|The accepted)/)[0];
      add({ id: `documented-decision-${issue.number}`, title: `Decide ${topic.charAt(0).toLowerCase() + topic.slice(1)}`,
        stream: entry.stream, sprint: entry.sprint, stage: entry.stage, release: entry.release,
        roles: ['product-owner', 'project-manager'], severity: 'attention', decisionRequired: true,
        facts: [decisionText.slice(0, 1800)],
        impact: gatedNumber ? `The issue explicitly records that #${gatedNumber} remains gated on this definition.` : `#${issue.number} explicitly identifies these decisions as still required for its definition.`,
        recommendation: `Record decisions on ${decisionScope.replace(/\.$/, '')}. Reconcile the resulting scope and acceptance records before selection.`, sources: sourcesFor(gatedNumber ? [issue.number, gatedNumber] : [issue.number]) });
    }
    if (labels.some(label => ['blocked', 'status:blocked'].includes(label.toLowerCase())) || entry.status.toLowerCase() === 'blocked') {
      add({ id: `blocked-${issue.number}`, title: `Unblock #${issue.number}`, stream: entry.stream,
        sprint: entry.sprint, stage: entry.stage, release: entry.release, severity: 'critical', decisionRequired: false,
        facts: ['The collected issue label or project status marks this work as blocked.'],
        impact: 'Progress depends on resolving the recorded blocker. Its cause must be confirmed in the issue.',
        recommendation: 'Review the blocker evidence and record the next unblock action and accountable owner.', sources: sourcesFor([issue.number]) });
    }
    if (labels.includes('needs-triage')) {
      add({ id: `triage-${issue.number}`, title: `Disposition #${issue.number}`, stream: 'backlog', release: entry.release,
        roles: ['product-owner', 'scrum-master'], severity: 'review', decisionRequired: true,
        facts: ['The issue is open and labeled needs-triage.'], impact: 'Its place in the active backlog remains unresolved.',
        recommendation: 'Review relevance and overlap, then record proceed, revise, defer or stop with a short rationale.', sources: sourcesFor([issue.number]) });
    }
    if (discoveryAvailable && ['Decision needed', 'Ready for sprint selection'].includes(entry.stage)) {
      add({ id: `discovery-decision-${issue.number}`, title: entry.stage === 'Decision needed' ? `Disposition the research in #${issue.number}` : `Review the bounded delivery candidate under #${issue.number}`,
        stream: 'discovery', stage: entry.stage, release: entry.release, severity: 'review', decisionRequired: true,
        facts: [`The collected discovery stage is ${entry.stage}.`],
        impact: 'A stage label does not establish evidence sufficiency or owner selection of a delivery story.',
        recommendation: 'Inspect the linked evidence, first story, acceptance criteria and dependencies before recording a selection or deferral.', sources: sourcesFor([issue.number]) });
    }
  }
  const researchRecords = inventory.filter(item => issueLabels(issues.get(item.number)).some(label => ['type:epic', 'type:candidate'].includes(label)));
  const active = researchRecords.filter(item => item.state === 'open' && item.stage === 'Discovery in progress');
  if (discoveryAvailable && active.length > policy.discovery.activeInvestigationLimit) {
    add({ id: 'discovery-wip', title: 'Review active research against the investigation limit', stream: 'discovery',
      stage: 'Discovery in progress', severity: 'attention', decisionRequired: true,
      facts: [`${active.length} open epic/candidate records are marked in progress; the recorded limit is ${policy.discovery.activeInvestigationLimit} active investigations.`],
      impact: 'The in-progress record count exceeds the investigation limit. Parent rollups may describe the same investigation.',
      recommendation: 'Confirm which records represent distinct investigations, then record the active selection and sequencing decision.', sources: sourcesFor(active.map(item => item.number)) });
  }
  const runId = Number(options.sourceRunId || 0);
  return {
    schemaVersion: 1, repository: policy.repository, release: policy.release, generatedAt,
    sourceRunId: runId, sourceRevision: options.sourceRevision || '',
    sourceUrl: runId ? `https://github.com/${policy.repository}/actions/runs/${runId}` : '',
    publishRequested: options.publishRequested === true,
    comparison: { available: false, baselineAt: null, baselineUrl: null }, changes: [],
    coverage: Object.entries(snapshot.boards).map(([name, items]) => ({ name, available: name !== 'discovery' || discoveryAvailable, count: name === 'discovery' && !discoveryAvailable ? null : items.length })),
    research: { available: discoveryAvailable, active: discoveryAvailable ? active.length : null,
      prioritized: discoveryAvailable ? researchRecords.filter(item => item.state === 'open' && item.stage === 'Prioritized for discovery').length : null,
      activeLimit: policy.discovery.activeInvestigationLimit },
    sprints: policy.sprints.map(sprint => ({ title: sprint.title, start: sprint.start,
      end: new Date(Date.parse(sprint.start) + (policy.sprintDays - 1) * day).toISOString().slice(0, 10) })),
    findings, inventory
  };
}

function compareReviews(current, previous) {
  const result = structuredClone(current);
  if (!previous || previous.repository !== current.repository) return result;
  if (previous.sourceRunId === current.sourceRunId) {
    result.comparison = previous.comparison;
    result.changes = previous.changes;
    const changed = new Set(previous.findings.filter(item => item.changed).map(item => item.id));
    result.findings.forEach(item => { item.changed = changed.has(item.id); });
    return result;
  }
  if (Date.parse(previous.generatedAt) >= Date.parse(current.generatedAt)) return result;
  result.comparison = { available: true, baselineAt: previous.generatedAt, baselineUrl: previous.sourceUrl };
  const oldInventory = new Map(previous.inventory.map(item => [item.number, item]));
  const changedNumbers = new Set();
  const discoveryCompared = previous.coverage.some(item => item.name === 'discovery' && item.available) && current.coverage.some(item => item.name === 'discovery' && item.available);
  for (const item of current.inventory) {
    const old = oldInventory.get(item.number);
    const fields = old ? ['state', 'stateReason', 'sprint', 'milestone', 'horizon'].filter(field => item[field] !== old[field]) : [];
    if (old && old.stream === item.stream && (item.stream !== 'discovery' || discoveryCompared) && item.status !== old.status) fields.push('status');
    if (old && discoveryCompared && item.stage !== old.stage) fields.push('stage');
    if (!old || fields.length) {
      changedNumbers.add(item.number);
      result.changes.push({ number: item.number, title: item.title, url: item.url,
        stream: item.stream, stage: item.stage, sprint: item.sprint, release: item.release,
        kind: old ? 'changed' : 'new-to-inventory',
        details: old ? fields.map(field => `${field}: ${old[field] || 'unrecorded'} → ${item[field] || 'unrecorded'}`) : ['Added to this collected inventory; creation or selection is not inferred.'] });
    }
  }
  const currentNumbers = new Set(current.inventory.map(item => item.number));
  for (const item of previous.inventory.filter(entry => !currentNumbers.has(entry.number))) {
    result.changes.push({ number: item.number, title: item.title, url: item.url,
      stream: item.stream, stage: item.stage, sprint: item.sprint, release: item.release,
      kind: 'absent-from-inventory', details: ['Absent from the current collected inventory; closure or acceptance has not been verified.'] });
  }
  const oldFindings = new Map(previous.findings.map(item => [item.id, item]));
  for (const finding of result.findings) {
    const old = oldFindings.get(finding.id);
    finding.changed = !old || JSON.stringify(old.facts) !== JSON.stringify(finding.facts) || finding.sources.some(source => changedNumbers.has(source.number));
  }
  const currentFindingIds = new Set(current.findings.map(item => item.id));
  for (const finding of previous.findings.filter(item => !currentFindingIds.has(item.id))) {
    if (finding.stream === 'discovery' && !discoveryCompared) continue;
    for (const source of finding.sources) {
      const item = current.inventory.find(entry => entry.number === source.number);
      if (!item) continue;
      const detail = `The evidence rule no longer flags: ${finding.title}. Inspect the source record for its disposition.`;
      const existing = result.changes.find(change => change.number === item.number);
      if (existing) existing.details.push(detail);
      else result.changes.push({ number: item.number, title: item.title, url: item.url,
        stream: item.stream, stage: item.stage, sprint: item.sprint, release: item.release,
        kind: 'no-longer-flagged', details: [detail] });
    }
  }
  return result;
}

function validateReview(review, repository) {
  if (review?.schemaVersion !== 1 || review.repository !== repository || !Number.isFinite(Date.parse(review.generatedAt))) throw new Error('Invalid planning review identity or date');
  if (!Array.isArray(review.findings) || !Array.isArray(review.inventory) || !Array.isArray(review.coverage) || !Array.isArray(review.changes) || !Array.isArray(review.sprints)) throw new Error('Incomplete planning review');
  const permitted = new Set(['schemaVersion','repository','release','generatedAt','sourceRunId','sourceRevision','sourceUrl','publishRequested','comparison','changes','coverage','research','sprints','findings','inventory','latestAttempt']);
  if (Object.keys(review).some(key => !permitted.has(key))) throw new Error('Unexpected planning review data; refusing publication');
  if (!Number.isSafeInteger(review.sourceRunId) || review.sourceRunId < 1 || !/^[a-f0-9]{40}$/.test(review.sourceRevision)) throw new Error('Missing source-run provenance');
  if (review.sourceUrl !== `https://github.com/${repository}/actions/runs/${review.sourceRunId}`) throw new Error('Invalid source-run URL');
  if (typeof review.publishRequested !== 'boolean' || typeof review.comparison?.available !== 'boolean' || typeof review.research?.available !== 'boolean') throw new Error('Missing planning publication or coverage state');
  const keysOnly = (value, allowed) => {
    if (!value || typeof value !== 'object' || Object.keys(value).some(key => !allowed.includes(key))) throw new Error('Unexpected nested planning data; refusing publication');
  };
  for (const item of review.inventory) keysOnly(item, ['number','title','url','state','stateReason','stream','stage','status','sprint','milestone','release','horizon']);
  for (const item of review.changes) keysOnly(item, ['number','title','url','stream','stage','sprint','release','kind','details']);
  for (const finding of review.findings) {
    keysOnly(finding, ['id','roles','release','sprint','stage','changed','title','stream','severity','decisionRequired','facts','impact','recommendation','roleActions','sources']);
    if (finding.roleActions) keysOnly(finding.roleActions, roles);
    for (const source of finding.sources) keysOnly(source, ['number','title','url']);
  }
  if (review.latestAttempt && !new RegExp(`^https://github\\.com/${repository}/actions/runs/[0-9]+$`).test(review.latestAttempt.url)) throw new Error('Invalid refresh-attempt URL');
  for (const item of [...review.inventory, ...review.changes, ...review.findings.flatMap(finding => finding.sources)]) {
    if (!Number.isSafeInteger(item.number) || item.number < 1 || item.url !== issueUrl(repository, item.number) || typeof item.title !== 'string') throw new Error('Invalid issue evidence reference');
  }
  for (const finding of review.findings) {
    if (!Array.isArray(finding.roles) || !finding.roles.length || !finding.roles.every(role => roles.includes(role)) || !['critical','attention','review'].includes(finding.severity) || !Array.isArray(finding.facts) || !finding.facts.every(fact => typeof fact === 'string') || typeof finding.recommendation !== 'string') throw new Error('Invalid planning finding');
  }
  return review;
}

module.exports = { buildReview, compareReviews, validateReview, reviewUrl };
