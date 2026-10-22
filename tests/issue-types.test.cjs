'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {allowed, classify, reconcile, run, ensureLabels} = require('../scripts/issue-types.cjs');

function fixture(labels = [], options = {}) {
  const issue = {number: 7, state: 'open', labels: labels.map(name => ({name})), ...options};
  const comments = [];
  const calls = [];
  const api = {
    get: async () => ({data: issue}),
    addLabels: async ({labels}) => {calls.push('add'); issue.labels.push(...labels.map(name => ({name})));},
    removeLabel: async ({name}) => {calls.push('remove'); issue.labels = issue.labels.filter(label => label.name !== name);},
    listComments: Symbol('comments'), listForRepo: Symbol('issues'),
    createComment: async ({body}) => {calls.push('comment'); comments.push({id: 9, body, user: {login: 'github-actions[bot]'}});},
    updateComment: async ({body}) => {calls.push('update'); comments[0].body = body;},
    getLabel: async () => ({}),
  };
  const github = {rest: {issues: api}, paginate: async method => method === api.listComments ? comments : [issue, {number: 8, pull_request: {}}]};
  const args = {github, repo: {owner: 'example', repo: 'repo'}, number: 7, preview: false};
  return {issue, comments, calls, api, github, args};
}

test('exactly one approved type; legacy/topical labels do not conflict', () => {
  for (const type of allowed) assert.equal(classify([type, 'epic', 'backlog']).valid, true);
  for (const labels of [[], ['bug'], ['type:bug', 'type:story'], ['type:unknown'], ['TYPE:bug'], ['type:bug', 'type:unknown']]) {
    assert.equal(classify(labels).valid, false);
  }
});
test('missing type is flagged once; corrected and recurring gaps update the same comment', async () => {
  const f = fixture(['documentation']);
  await reconcile(f.args); await reconcile(f.args);
  assert.deepEqual(f.calls, ['add', 'comment']);
  f.issue.labels.push({name: 'type:task'});
  await reconcile(f.args);
  assert.deepEqual(f.calls, ['add', 'comment', 'remove', 'update']);
  assert.match(f.comments[0].body, /resolved/);
  f.issue.labels = [{name: 'documentation'}];
  await reconcile(f.args);
  assert.equal(f.comments.length, 1);
  assert.match(f.comments[0].body, /requires exactly one/);
});
test('multiple types remain available for human resolution', async () => {
  const f = fixture(['type:bug', 'type:story', 'security']);
  await reconcile(f.args);
  assert.deepEqual(f.issue.labels.map(x => x.name), ['type:bug', 'type:story', 'security', 'needs-type']);
});
test('preview, closed issues and pull requests do not mutate', async () => {
  for (const options of [{state: 'closed'}, {pull_request: {}}, {}]) {
    const f = fixture([], options);
    await reconcile({...f.args, preview: !options.state && !options.pull_request});
    assert.deepEqual(f.calls, []);
  }
});
test('human-authored marker is never overwritten', async () => {
  const f = fixture();
  f.comments.push({id: 1, body: '<!-- issue-type-validation:v1 --> user content', user: {login: 'human'}});
  await reconcile(f.args);
  assert.equal(f.comments.length, 2);
  assert.equal(f.comments[0].body, '<!-- issue-type-validation:v1 --> user content');
});
test('API permission failures propagate', async () => {
  const f = fixture();
  f.api.addLabels = async () => {throw Object.assign(new Error('Forbidden'), {status: 403});};
  await assert.rejects(reconcile(f.args), /Forbidden/);
});
test('event validation uses current state, not stale event labels', async () => {
  const f = fixture(['type:bug']);
  const summary = {addHeading() {}, addRaw() {}, async write() {}};
  const results = await run({github: f.github, context: {repo: f.args.repo, eventName: 'issues', payload: {issue: {number: 7, labels: []}}}, core: {summary, setOutput() {}}, preview: false});
  assert.equal(results[0].valid, true);
  assert.deepEqual(f.calls, []);
});
test('scheduled sweep paginates open issues and excludes pull requests', async () => {
  const f = fixture();
  const results = await run({github: f.github, context: {repo: f.args.repo, eventName: 'schedule'}, core: {summary: {addHeading() {}, addRaw() {}, async write() {}}, setOutput() {}}, preview: true});
  assert.equal(results.length, 1);
  assert.equal(results[0].valid, false);
  assert.deepEqual(f.calls, []);
});
test('bootstrap creates missing labels without changing existing definitions', async () => {
  const f = fixture(); let created = 0;
  f.api.getLabel = async ({name}) => {if (name === 'needs-type') throw Object.assign(new Error(), {status: 404});};
  f.api.createLabel = async ({name}) => {assert.equal(name, 'needs-type'); created++;};
  await ensureLabels(f.github, f.args.repo);
  assert.equal(created, 1);
});

test('all intake templates supply one approved type', () => {
  for (const name of fs.readdirSync('.github/ISSUE_TEMPLATE')) {
    if (name === 'config.yml') continue;
    const text = fs.readFileSync(path.join('.github/ISSUE_TEMPLATE', name), 'utf8');
    // The intake convention is an inline labels array, or YAML block labels.
    const block = text.match(/^labels:.*(?:\n- .*|\n  - .*)*/m)?.[0] || '';
    const labels = block.match(/type:[a-z-]+/g) || [];
    assert.equal(classify(labels).valid, true, name);
  }
});

test('content submissions require public sanitized files and rights attestations', () => {
  const content = fs.readFileSync('.github/ISSUE_TEMPLATE/content_submission.yml', 'utf8');
  assert.match(content, /This issue and every attachment are public/);
  assert.match(content, /restricted transfer channel is not currently configured/);
  assert.match(content, /If you upload unsafe material by mistake/);
  assert.match(content, /do not re-upload or quote it/);
  assert.match(content, /type: upload[\s\S]*?required: true/);
  assert.match(content, /removed personal, confidential, proprietary, and identifying information/);
  assert.match(content, /later removal cannot guarantee erasure from Git history/);

  const improvement = fs.readFileSync('.github/ISSUE_TEMPLATE/template-improvement.yml', 'utf8');
  assert.match(improvement, /type: upload[\s\S]*?required: false/);
  assert.match(improvement, /Only upload sanitized\s+files/);
  assert.match(improvement, /Rights and public visibility/);
  assert.match(improvement, /have permission to share it/);
  assert.match(improvement, /attached files are sanitized/);
  assert.match(improvement, /Attribution preference if the correction is published/);
});

test('unsafe public uploads have a stop-and-escalate path and intake lifecycle is traceable', () => {
  const guide = fs.readFileSync('docs/community/submission-handling.md', 'utf8');
  assert.match(guide, /If unsafe content is uploaded publicly/);
  assert.match(guide, /Do not download, copy, quote,\s+reproduce, or link the content elsewhere/);
  assert.match(guide, /Privately alert the repository owner/);
  assert.match(guide, /GitHub's report-content mechanism/);
  assert.match(guide, /do not represent an\s+unrecorded state as complete/);
  const lowerGuide = guide.toLowerCase();
  for (const state of [
    'received', 'in review', 'changes requested', 'approved', 'published',
    'declined', 'duplicate', 'withdrawn', 'failed-publication',
    'under consideration', 'accepted', 'deferred', 'triaged', 'routed',
    'acknowledged', 'reviewed', 'linked to related work',
  ]) assert.ok(lowerGuide.includes(state), `missing route disposition: ${state}`);
  assert.match(guide, /maintainer-assisted\s+assessment/);
  assert.match(guide, /unreadable,[\s\S]*?encrypted, unsafe, or fidelity-compromised/);
  assert.match(guide, /Public file or PR path \| Actual file type \| Intended use/);
  assert.match(guide, /one row per submitted\s+file/);
  for (const field of [
    'Route / current disposition:',
    'Next responsible party:',
    'Next action:',
    'Decision and rationale:',
    'Related duplicate, issue, or PR:',
    'Outcome or verification evidence:',
  ]) assert.ok(guide.includes(field), `missing shared status field: ${field}`);
  assert.match(guide, /does not imply that the underlying problem was fixed/);
});

test('legacy contribution intake URL points to the no-Git browser contribution route', () => {
  assert.equal(fs.existsSync('.github/ISSUE_TEMPLATE/template_contribution.md'), false);
  const archive = fs.readFileSync('docs/archive/README-20250611.md', 'utf8');
  assert.match(archive, /issues\/new\?template=content_submission\.yml/);
  assert.doesNotMatch(archive, /issues\/new\?template=template_contribution\.md/);
  const contributing = fs.readFileSync('CONTRIBUTING.md', 'utf8');
  assert.match(contributing, /branch from the repository's default branch \(`main`\)/);
  assert.match(contributing, /pull request targeting `main`/);
  assert.doesNotMatch(contributing, /\bdevelop\b/i);
});

test('receipt workflow posts only an acknowledgement, not a disposition', async () => {
  const vm = require('node:vm');
  const workflow = fs.readFileSync('.github/workflows/automated-feedback-ack.yml', 'utf8');
  const scriptMatch = workflow.match(/          script: \|\n((?:(?: {12}[^\n]*|[ \t]*)\n)+)/);
  assert.ok(scriptMatch, 'receipt script exists');
  const script = scriptMatch[1].split('\n').map(line => line.slice(12)).join('\n');
  const comments = [];
  const github = {rest: {issues: {
    createComment: async args => comments.push(args),
  }}};
  const context = {repo: {owner: 'example', repo: 'repo'}, payload: {issue: {number: 42}}};
  await vm.runInNewContext(`(async () => {${script}})()`, {github, context});
  assert.equal(comments.length, 1);
  assert.equal(comments[0].issue_number, 42);
  assert.match(comments[0].body, /confirms receipt only/);
  assert.doesNotMatch(comments[0].body, /accepted|scheduled|published/i);
  assert.match(workflow, /!contains\(github\.event\.issue\.labels\.\*\.name, 'security'\)/);
});

test('request intake and receipt acknowledgement make no file or service promises', () => {
  const request = fs.readFileSync('.github/ISSUE_TEMPLATE/template_request.yml', 'utf8');
  assert.doesNotMatch(request, /type: upload/);
  assert.match(request, /Acceptance does not set a\s+delivery date/);
  assert.match(request, /What need are you trying to meet/);
  assert.match(request, /Existing template, workaround, or related request/);

  const receipt = fs.readFileSync('.github/workflows/automated-feedback-ack.yml', 'utf8');
  assert.match(receipt, /contains\(github\.event\.issue\.labels\.\*\.name, 'security'\)/);
  assert.match(receipt, /confirms receipt only/);
  assert.doesNotMatch(receipt, /will review and respond|soon|within \d+/i);

  for (const workflow of [
    'feedback-processor.yml',
    'feedback-analytics.yml',
    'community-voting.yml',
    'process-template-ratings.yml',
    'contributor-recognition.yml',
  ]) {
    assert.equal(fs.existsSync(path.join('.github/workflows', workflow)), false, workflow);
  }
});

test('existing automated creator sites explicitly supply an approved type', () => {
  const files = fs.readdirSync('.github/workflows').filter(name => /\.ya?ml$/.test(name)).map(name => `.github/workflows/${name}`);
  files.push('scripts/template-analytics.cjs');
  let checked = 0;
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const creators = [...text.matchAll(/github\.rest\.issues\.create\(\{[\s\S]*?labels:\s*\[([^\]]*)\]/g),
      ...text.matchAll(/gh issue create(?:(?!gh issue create)[\s\S])*?--label "([^"]*)"/g)];
    const count = [...text.matchAll(/github\.rest\.issues\.create\(|gh issue create/g)].length;
    assert.equal(creators.length, count, `${file}: unrecognized creator syntax requires validator coverage`);
    for (const match of creators) {
      assert.equal(classify(match[1].match(/type:[a-z-]+/g) || []).valid, true, file);
      checked++;
    }
  }
  assert.ok(checked > 0);
});

test('sweep targets include more than one page and omit PRs', async () => {
  const {targets} = require('../scripts/issue-types.cjs');
  const f = fixture();
  f.github.paginate = async (method, args) => {
    assert.equal(method, f.api.listForRepo);
    assert.equal(args.state, 'open');
    return [...Array.from({length: 110}, (_, i) => ({number: i + 1})), {number: 111, pull_request: {}}];
  };
  assert.equal((await targets({github: f.github, context: {repo: f.args.repo, eventName: 'schedule'}})).length, 110);
});
test('event and manual targets select the expected scope', async () => {
  const {targets} = require('../scripts/issue-types.cjs');
  const f = fixture();
  assert.deepEqual(await targets({github: f.github, context: {eventName: 'issues', payload: {issue: {number: 19}}}}), [19]);
  assert.deepEqual(await targets({github: f.github, context: {eventName: 'workflow_dispatch', repo: f.args.repo}}), [7]);
});

test('problem and feedback forms collect safe route-relevant details', () => {
  const bug = fs.readFileSync('.github/ISSUE_TEMPLATE/bug_report.yml', 'utf8');
  assert.match(bug, /Affected component or URL/);
  assert.match(bug, /Expected and observed behavior/);
  assert.match(bug, /Steps to reproduce/);
  assert.match(bug, /Sanitized evidence or public reference/);
  assert.match(bug, /private route in/);

  const rating = fs.readFileSync('.github/ISSUE_TEMPLATE/template-rating.yml', 'utf8');
  assert.match(rating, /not\s+verified evidence of adoption or template quality/);
  const feedback = fs.readFileSync('.github/ISSUE_TEMPLATE/community-feedback.md', 'utf8');
  assert.match(feedback, /communicate a disposition when available/);
  assert.match(feedback, /does not promise\s+implementation or a response time/);
});
test('matrix reconciliation cannot modify another issue', async () => {
  const f = fixture();
  f.api.get = async args => {assert.equal(args.issue_number, 7); return {data: f.issue};};
  const results = await run({github: f.github, context: {repo: f.args.repo, eventName: 'schedule'},
    core: {summary: {addHeading() {}, addRaw() {}, async write() {}}, setOutput() {}}, number: 7, preview: false, bootstrap: false});
  assert.equal(results.length, 1);
  assert.deepEqual(f.calls, ['add', 'comment']);
});
test('oversized sweeps fail explicitly instead of omitting backlog items', async () => {
  const {targets} = require('../scripts/issue-types.cjs');
  const f = fixture();
  f.github.paginate = async () => Array.from({length: 257}, (_, i) => ({number: i + 1}));
  await assert.rejects(targets({github: f.github, context: {eventName: 'schedule', repo: f.args.repo}}), /matrix limit/);
});

test('expert review requires a current explicit request; completion remains functional', async () => {
  const vm = require('node:vm');
  const workflow = fs.readFileSync('.github/workflows/expert-review.yml', 'utf8');
  const scripts = [...workflow.matchAll(/script: \|\n((?:(?: {12}[^\n]*|[ \t]*)\n)+)/g)]
    .map(match => match[1].split('\n').map(line => line.slice(12)).join('\n'));
  const assignment = scripts.find(script => script.includes('expertCategories'));
  const completion = scripts.find(script => script.includes('const comment ='));
  assert.ok(assignment && completion);
  const writes = [];
  let labels = [];
  const github = {rest: {issues: {
    get: async () => ({data: {state: 'open', labels: labels.map(name => ({name}))}}),
    createComment: async () => writes.push('comment'),
    addLabels: async args => writes.push(...args.labels),
    removeLabel: async () => writes.push('remove'),
  }}};
  const context = {repo: {owner: 'example', repo: 'repo'}, payload: {
    issue: {number: 7, body: '', title: '', labels: []}, comment: {body: '## Expert Review: Complete'}
  }};
  const execute = script => vm.runInNewContext(`(async () => {${script}})()`, {github, context, console});
  await execute(assignment);
  assert.deepEqual(writes, []);
  labels = ['expert-review-needed', 'expert-review-active'];
  await execute(assignment);
  assert.deepEqual(writes, []);
  labels = ['expert-review-needed'];
  await execute(assignment);
  assert.deepEqual(writes, ['comment', 'expert-review-active']);
  await execute(completion);
  assert.deepEqual(writes.slice(-2), ['expert-reviewed', 'remove']);
});
