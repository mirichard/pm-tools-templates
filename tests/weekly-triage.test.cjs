const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/weekly-triage-automation.yml'), 'utf8');

// Execute the actual inline action scripts, so regressions in either consumer are covered.
function script(name) {
  const step = workflow.split(`      - name: ${name}\n`)[1]?.split('\n      - name: ')[0];
  assert.ok(step, `Missing step: ${name}`);
  return step.split('          script: |\n')[1].split('\n')
    .map(line => line.replace(/^            /, '')).join('\n')
    .replace('${{ steps.date.outputs.date }}', '2026-10-28');
}
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
async function run(name, github) {
  return new AsyncFunction('require', 'github', 'context', script(name))(
    require, github, { repo: { owner: 'fixture', repo: 'triage' } });
}

if (process.argv[2] === '--consume') {
  const requests = [];
  const github = { rest: { issues: {
    create: async request => { requests.push({ kind: 'create', ...request }); return { data: { number: 123 } }; },
    addLabels: async request => { requests.push({ kind: 'label', ...request }); }
  } } };
  (async () => {
    await run('Create triage preparation issue', github);
    await run('Label stale issues', github);
    fs.writeFileSync(path.join(process.env.RUNNER_TEMP, 'requests.json'), JSON.stringify(requests));
  })().catch(error => { console.error(error); process.exitCode = 1; });
} else {
  test('workflow never interpolates triage data into an action input', () => {
    assert.doesNotMatch(workflow, /\$\{\{\s*steps\.triage-data\.outputs\./);
  });

  for (const count of [0, 100]) {
    test(`file handoff creates the report and labels stale issues (${count} issues)`, async () => {
      const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'weekly-triage-'));
      const previous = process.env.RUNNER_TEMP;
      process.env.RUNNER_TEMP = temp;
      try {
        const issues = Array.from({ length: count }, (_, i) => ({
          number: i + 1, title: `Issue ${i + 1}: quotes ' \" backtick \` and Unicode 🧪`,
          updated_at: '2020-01-01T00:00:00Z', body: 'x'.repeat(200000),
          user: { login: 'fixture', metadata: 'y'.repeat(10000) }
        }));
        const github = { rest: {
          issues: { listForRepo: async () => ({ data: issues }) },
          search: { issuesAndPullRequests: async () => ({ data: { total_count: 21 } }) }
        } };
        assert.equal(await run('Gather triage data', github), undefined);
        const data = JSON.parse(fs.readFileSync(path.join(temp, 'weekly-triage-data.json')));
        assert.equal(data.newIssues, count);
        assert.equal(data.untriagedCount, count);
        assert.equal(data.staleCount, count);
        assert.equal(data.oversizedEpics.length, count);
        for (const key of ['newIssuesList', 'untriagedList', 'staleList']) {
          assert.equal(data[key].length, Math.min(count, 10));
          for (const issue of data[key]) assert.deepEqual(Object.keys(issue).sort(), ['number', 'title', 'updated_at']);
        }
        if (count) assert.ok(Buffer.byteLength(JSON.stringify(issues.slice(0, 10))) > 2_000_000);
        // A fresh process receives only the file location, never the large JSON payload.
        const child = spawnSync(process.execPath, [__filename, '--consume'], {
          env: { ...process.env, RUNNER_TEMP: temp }, encoding: 'utf8'
        });
        assert.equal(child.status, 0, child.stderr);
        const requests = JSON.parse(fs.readFileSync(path.join(temp, 'requests.json')));
        const created = requests.filter(r => r.kind === 'create');
        assert.equal(created.length, 1);
        assert.equal(created[0].title, '📋 Weekly Triage Preparation - 2026-10-28');
        assert.deepEqual(created[0].labels, ['type:operational', 'triage-preparation', 'process', 'weekly-automation']);
        assert.match(created[0].body, /Triage Meeting Agenda/);
        assert.match(created[0].body, /Post-Meeting Actions Checklist/);
        assert.doesNotMatch(created[0].body, /x{100}/);
        assert.ok(created[0].body.length < 65536);
        if (count) {
          assert.ok(created[0].body.includes(issues[0].title));
          assert.match(created[0].body, /and 90 more/);
          assert.match(created[0].body, /21 issues/);
        } else assert.match(created[0].body, /No oversized epics found/);
        assert.deepEqual(requests.filter(r => r.kind === 'label').map(r => r.issue_number),
          issues.slice(0, 10).map(i => i.number));
      } finally {
        if (previous === undefined) delete process.env.RUNNER_TEMP;
        else process.env.RUNNER_TEMP = previous;
        fs.rmSync(temp, { recursive: true, force: true });
      }
    });
  }
}
