'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {topicLabels, labelTopics, openChildCount, sizeLabel} = require('../scripts/issue-label-policy.cjs');

test('SIT, UAT and research descriptions do not create unrelated labels', () => {
  for (const [title, type] of [
    ['Task: AI recovery SIT for model, API and dashboard contracts', 'task'],
    ['Task: Define AI recovery UAT scenarios and acceptance ownership', 'task'],
    ['[Research candidate][AI Insights] Establish planning-review value', 'candidate'],
  ]) {
    assert.deepEqual(topicLabels({title, labels: [`type:${type}`],
      body: 'Test errors and broken input; supply an evidence template; document improvements and documentation.'}), []);
  }
});

test('explicit topics remain supported without overriding issue type', () => {
  assert.deepEqual(topicLabels({title: 'Bug: repair', labels: ['type:bug']}), ['bug']);
  assert.deepEqual(topicLabels({title: 'Bug: repair', labels: ['type:task']}), []);
  assert.deepEqual(topicLabels({title: 'Bug: repair', labels: ['type:bug', 'type:task']}), []);
  for (const [title, label] of [['Docs: explain inputs', 'documentation'],
    ['[Template Request] Plan', 'template-related'], ['[FEATURE] New view', 'enhancement']]) {
    assert.deepEqual(topicLabels({title}), [label]);
    assert.deepEqual(topicLabels({title, labels: [{name: label}]}), []);
  }
});

test('topic mutation reads current state and preserves existing labels', async () => {
  let issue = {state: 'open', title: 'Bug: repair', labels: [{name: 'type:task'}, {name: 'security'}]};
  const writes = [];
  const github = {rest: {issues: {
    get: async () => ({data: issue}),
    addLabels: async args => writes.push(args.labels),
  }}};
  const args = {github, repo: {owner: 'o', repo: 'r'}, number: 1};
  await labelTopics(args);
  assert.deepEqual(writes, []);
  issue.labels = [{name: 'type:bug'}, {name: 'security'}];
  await labelTopics(args);
  assert.deepEqual(writes, [['bug']]);
  issue.state = 'closed';
  await labelTopics(args);
  assert.equal(writes.length, 1);
  github.rest.issues.get = async () => {throw new Error('Forbidden');};
  await assert.rejects(labelTopics(args), /Forbidden/);
});

test('child count requests native paginated children, includes child epics and excludes closed children', async () => {
  const children = [...Array.from({length: 101}, (_, i) => ({number: i, state: 'open'})),
    {number: 102, state: 'open', labels: [{name: 'type:epic'}]}, {number: 103, state: 'closed'}];
  const github = {paginate: async (route, args) => {
    assert.equal(route, 'GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues');
    assert.deepEqual(args, {owner: 'o', repo: 'r', issue_number: 7, per_page: 100});
    return children;
  }};
  assert.equal(await openChildCount(github, {owner: 'o', repo: 'r'}, 7), 102);
  github.paginate = async () => [];
  assert.equal(await openChildCount(github, {}, 7), 0);
  github.paginate = async () => {throw new Error('API failed');};
  await assert.rejects(openChildCount(github, {}, 7), /API failed/);
});

test('existing size thresholds apply to open direct children', () => {
  for (const [count, expected] of [[0, 'small'], [7, 'small'], [8, 'medium'], [14, 'medium'],
    [15, 'large'], [20, 'large'], [21, 'oversized']]) assert.equal(sizeLabel(count), `epic-${expected}`);
  for (const count of [-1, 0.5, NaN]) assert.throws(() => sizeLabel(count));
});

test('actual epic workflow corrects stale sizes without treating references as children', async () => {
  const text = fs.readFileSync('.github/workflows/epic-size-monitor.yml', 'utf8');
  const script = text.split('          script: |\n')[1].split('\n').map(line => line.slice(12)).join('\n');
  const writes = [];
  const failures = [];
  const repo = {owner: 'o', repo: 'r'};
  const github = {rest: {issues: {
    listForRepo: Symbol('epics'),
    removeLabel: async args => writes.push(['remove', args.name]),
    addLabels: async args => writes.push(['add', ...args.labels]),
    createLabel: async () => {throw Object.assign(new Error('Exists'), {status: 422});},
  }}, paginate: async route => route === github.rest.issues.listForRepo
    ? [{number: 7, labels: [{name: 'epic-medium'}]}]
    : Array.from({length: 7}, () => ({state: 'open'}))};
  const execute = () => vm.runInNewContext(`(async () => {${script}})()`, {
    github, context: {repo}, core: {setFailed: message => failures.push(message)}, console: {log() {}},
    require: name => {assert.equal(name, './scripts/issue-label-policy.cjs'); return {openChildCount, sizeLabel};},
  });
  await execute();
  assert.deepEqual(writes, [['remove', 'epic-medium'], ['add', 'epic-small']]);
  assert.deepEqual(failures, []);
  writes.length = 0;
  github.paginate = async route => {
    if (typeof route === 'string') throw new Error('Permission denied');
    return [{number: 7, labels: []}];
  };
  await execute();
  assert.deepEqual(writes, []);
  assert.match(failures[0], /Permission denied/);
});
