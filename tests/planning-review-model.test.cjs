const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildReview, compareReviews, validateReview } = require('../scripts/planning-review-model.cjs');
const original = require('../.github/planning-policy.json');

function fixture() {
  const policy = structuredClone(original);
  const issues = Object.keys(policy.candidates).map(Number).map(number => ({
    number, title: `Work ${number}`, state: 'open', state_reason: null, assignees: [{ login: 'mirichard' }],
    labels: [], milestone: { number: policy.milestone, title: 'v2.5.0' }, body: 'PRIVATE-SNAPSHOT-BODY',
    created_at: '2026-10-01', updated_at: '2026-11-01'
  }));
  const snapshot = { issues, boards: { backlog: [], discovery: [], delivery: policy.sprints.flatMap(sprint => sprint.issues.map(number => ({ number, Status: 'Todo', [policy.iterationField]: sprint.title }))) },
    parents: Object.fromEntries(Object.entries(policy.candidates).map(([number, item]) => [number, item.parent])), children: {}, collectionWarnings: [],
    iterations: policy.sprints.map(sprint => ({ title: sprint.title, startDate: sprint.start, duration: policy.sprintDays })) };
  const options = { now: '2026-11-05T12:00:00Z', sourceRunId: 100, sourceRevision: 'a'.repeat(40), publishRequested: true };
  return { snapshot, policy, options };
}

test('public model contains linked, role-relevant actions without raw issue bodies', () => {
  const { snapshot, policy, options } = fixture();
  const review = buildReview(snapshot, policy, options);
  validateReview(review, policy.repository);
  assert.equal(review.comparison.available, false);
  assert.ok(review.findings.some(item => item.id === 'readiness-sprint-4'));
  assert.equal(review.findings.find(item => item.id === 'readiness-sprint-4').sources.length, 2);
  assert.ok(!JSON.stringify(review).includes('PRIVATE-SNAPSHOT-BODY'));
  assert.ok(!JSON.stringify(review).includes('headers'));
  assert.equal(review.publishRequested, true);
});

test('an owner stop decision is a superseded-policy finding, never a new research decision', () => {
  const { snapshot, policy, options } = fixture();
  snapshot.issues.push({ number: 1379, title: 'Stopped study', state: 'closed', state_reason: 'not_planned', labels: [] });
  const review = buildReview(snapshot, policy, options);
  const finding = review.findings.find(item => item.id === 'superseded-policy-1379');
  assert.ok(finding);
  assert.equal(finding.decisionRequired, false);
  assert.match(finding.recommendation, /recorded stop decision/);
});

test('missing discovery coverage is unknown and produces no stage-based promotion recommendation', () => {
  const { snapshot, policy, options } = fixture();
  snapshot.collectionWarnings = ['Project 13 unavailable'];
  const review = buildReview(snapshot, policy, options);
  assert.equal(review.research.active, null);
  assert.equal(review.coverage.find(item => item.name === 'discovery').count, null);
  assert.ok(review.findings.some(item => item.id === 'discovery-coverage'));
  assert.ok(!review.findings.some(item => item.id.startsWith('discovery-decision-')));
});

test('comparisons detect recorded state and stage changes and retain their baseline on a site rebuild', () => {
  const { snapshot, policy, options } = fixture();
  snapshot.boards.discovery.push({ number: 1559, 'Discovery stage': 'Intake' });
  const old = buildReview(snapshot, policy, options);
  snapshot.boards.discovery[0]['Discovery stage'] = 'Decision needed';
  const current = buildReview(snapshot, policy, { ...options, now: '2026-11-06T12:00:00Z', sourceRunId: 101 });
  const compared = compareReviews(current, old);
  assert.equal(compared.comparison.available, true);
  assert.deepEqual(compared.changes.map(item => item.number), [1559]);
  assert.match(compared.changes[0].details.join(' '), /Intake.*Decision needed/);
  const repeated = compareReviews(current, compared);
  assert.deepEqual(repeated.comparison, compared.comparison);
  assert.deepEqual(repeated.changes, compared.changes);
  assert.equal(compareReviews(current, null).changes.length, 0);
});

test('unavailable discovery on the baseline does not manufacture a stage transition', () => {
  const { snapshot, policy, options } = fixture();
  snapshot.collectionWarnings = ['Project 13 unavailable'];
  const old = buildReview(snapshot, policy, options);
  snapshot.collectionWarnings = [];
  snapshot.boards.discovery.push({ number: 1559, 'Discovery stage': 'Intake' });
  const current = buildReview(snapshot, policy, { ...options, now: '2026-11-06T12:00:00Z', sourceRunId: 101 });
  assert.ok(compareReviews(current, old).changes.every(item => item.details.every(detail => !detail.startsWith('stage:'))));
});

test('publication rejects wrong identity, raw snapshot data and foreign evidence links', () => {
  const { snapshot, policy, options } = fixture();
  for (const mutate of [review => { review.repository = 'other/repo'; }, review => { review.snapshot = snapshot; }, review => { review.sourceUrl = 'https://example.com'; }, review => { review.inventory[0].url = 'javascript:alert(1)'; }, review => { review.inventory[0].body = 'must not publish'; }, review => { review.latestAttempt = {url:'javascript:alert(1)'}; }]) {
    const review = buildReview(snapshot, policy, options); mutate(review);
    assert.throws(() => validateReview(review, policy.repository));
  }
});

test('discovery policy references do not become release commitments and absent work is not accepted delivery', () => {
  const { snapshot, policy, options } = fixture();
  snapshot.issues.push({ number: 1379, title: 'Stopped study', state: 'closed', state_reason: 'not_planned', labels: [] });
  const old = buildReview(snapshot, policy, options);
  assert.equal(old.findings.find(item => item.id === 'superseded-policy-1379').release, '');
  snapshot.issues = snapshot.issues.filter(item => item.number !== 1379);
  const current = buildReview(snapshot, policy, { ...options, now: '2026-11-06T12:00:00Z', sourceRunId: 101 });
  const changes = compareReviews(current, old).changes;
  assert.equal(changes.find(item => item.number === 1379).kind, 'absent-from-inventory');
  assert.match(changes.find(item => item.number === 1379).details[0], /has not been verified/);
});

test('resolved entry-record flags appear as rule changes without claiming delivery acceptance', () => {
  const { snapshot, policy, options } = fixture();
  const old = buildReview(snapshot, policy, options);
  for (const number of policy.sprints[0].issues) policy.readinessDecisions[number] = {
    owner: 'mirichard', date: '2026-11-06', record: `https://github.com/${policy.repository}/issues/${number}`,
    decision: 'ready', outcome: 'defined', scope: 'bounded', acceptance: 'recorded', dependencies: 'recorded'
  };
  const current = buildReview(snapshot, policy, { ...options, now: '2026-11-06T12:00:00Z', sourceRunId: 101 });
  const compared = compareReviews(current, old);
  assert.equal(compared.changes.filter(item => item.kind === 'no-longer-flagged').length, 2);
  assert.ok(compared.changes.every(item => item.details[0].includes('evidence rule no longer flags')));
});

test('research refinement follows explicit current portfolio recommendations and preserves closed or historical decisions', () => {
  const { snapshot, policy, options } = fixture();
  snapshot.issues.push({ number: 47, title: 'Dependency brief', state: 'open', labels: ['type:epic'] },
    { number: 1566, title: 'Portfolio', state: 'open', labels: [], body: 'The most concrete additional refinement candidates are #47 (dependency decision brief). Owner selection remains open.' });
  let review = buildReview(snapshot, policy, options);
  const finding = review.findings.find(item => item.id === 'portfolio-refinement-candidates');
  assert.deepEqual(finding.sources.map(item => item.number), [1566,47]);
  assert.equal(finding.release, '');
  snapshot.issues.find(item => item.number === 47).state = 'closed';
  snapshot.issues[0].body = '<details><summary>Historical</summary>**Decisions still needed:** obsolete decision</details>';
  review = buildReview(snapshot, policy, options);
  assert.ok(!review.findings.some(item => item.id === 'portfolio-refinement-candidates'));
  assert.ok(!review.findings.some(item => item.id === 'documented-decision-' + snapshot.issues[0].number));
});
