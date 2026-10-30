const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/dependabot-auto-maintenance.yml'), 'utf8');
const script = workflow.split('          script: |\n')[1].split('\n').map(line => line.replace(/^            /, '')).join('\n');

for (const updateFails of [false, true]) {
  test(`maintenance touches only Dependabot, including pagination and rebase fallback (${updateFails})`, async () => {
    const calls = [];
    const pr = (number, login, type = 'Bot') => ({number, node_id: `PR_${number}`, title: login, user: {login, type}});
    const firstPage = [pr(1, 'github-actions[bot]'), pr(2, 'dependabot[bot]'), pr(3, 'mirichard', 'User'),
      ...Array.from({length: 47}, (_, i) => pr(10 + i, 'another[bot]'))];
    const github = {
      rest: {
        pulls: {list: async ({page}) => ({data: page === 1 ? firstPage : [pr(100, 'dependabot[bot]'), pr(101, 'github-actions[bot]')]})},
        issues: {createComment: async ({pull_number, issue_number}) => calls.push(['comment', issue_number ?? pull_number])},
      },
      request: async (_, {pull_number}) => { calls.push(['update', pull_number]); if (updateFails) throw {status: 422}; },
      graphql: async (query, args) => {
        if (query.includes('mutation')) {
          calls.push(['merge', args.pullRequestId]);
          return {enablePullRequestAutoMerge: {pullRequest: {number: args.pullRequestId}}};
        }
        return {repository: {pullRequest: {id: args.number}}};
      },
    };
    await vm.runInNewContext(script, {github, context: {repo: {owner: 'owner', repo: 'repo'}},
      core: {info() {}, warning() {}, startGroup() {}, endGroup() {}, setFailed(message) {throw new Error(message);}}});
    assert.deepEqual(calls, updateFails
      ? [['update', 2], ['comment', 2], ['merge', 2], ['update', 100], ['comment', 100], ['merge', 100]]
      : [['update', 2], ['merge', 2], ['update', 100], ['merge', 100]]);
  });
}
