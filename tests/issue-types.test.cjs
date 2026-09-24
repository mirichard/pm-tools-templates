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
