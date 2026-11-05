const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { prepare, eligibleRun, requestJson, readReviewArchive } = require('../scripts/prepare-planning-site.cjs');
const repository = 'mirichard/pm-tools-templates';
function model(id, publishRequested = true) {
  return { schemaVersion: 1, repository, release: '2.5.0', generatedAt: `2026-11-05T12:0${id}:00Z`, sourceRunId: id, sourceRevision: 'a'.repeat(40), sourceUrl: `https://github.com/${repository}/actions/runs/${id}`, publishRequested,
    comparison: { available: false, baselineAt: null, baselineUrl: null }, changes: [], coverage: [], research: { available: true, active: 0, prioritized: 0, activeLimit: 2 }, sprints: [], findings: [], inventory: [] };
}
function archive(review) {
  const result = spawnSync('python3', ['-c', 'import sys,zipfile,io; b=io.BytesIO(); z=zipfile.ZipFile(b,"w"); z.writestr("review.json",sys.stdin.read()); z.close(); sys.stdout.buffer.write(b.getvalue())'], { input: JSON.stringify(review), maxBuffer: 8 * 1024 * 1024 });
  assert.equal(result.status, 0);
  return result.stdout;
}
function run(id, conclusion = 'success') {
  return { id, conclusion, status: 'completed', event: 'schedule', head_branch: 'main', head_sha: 'a'.repeat(40), path: '.github/workflows/weekly-triage-automation.yml', repository: { full_name: repository }, created_at: `2026-11-05T12:0${id}:00Z`, updated_at: `2026-11-05T12:0${id}:30Z` };
}
async function scenario(review, latest, mutateFetch) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'planning-publication-test-'));
  const destination = path.join(directory, 'data.json');
  const previous = model(1);
  fs.writeFileSync(destination, JSON.stringify(previous));
  const requests = [];
  const fetcher = async (url, options) => {
    requests.push({ url, options });
    if (mutateFetch) return mutateFetch(url);
    if (url.includes('github.io')) return { ok: true, status: 200, json: async () => previous };
    if (url.includes('/runs?')) return { ok: true, status: 200, json: async () => ({ workflow_runs: [latest] }) };
    if (url.includes('/artifacts?')) return { ok: true, status: 200, json: async () => ({ artifacts: [{ id: 20, name: `planning-preview-${latest.id}`, expired: false }] }) };
    return { ok: true, status: 200, arrayBuffer: async () => archive(review) };
  };
  try {
    const output = await prepare({ token: 'synthetic-repository-token', fetcher, destination, now: new Date('2026-11-05T12:03:00Z') });
    for (const request of requests.filter(item => item.url.includes('github.io'))) assert.equal(request.options.headers.Authorization, undefined);
    return output;
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}

test('publishes verified output and compares against the prior published edition', async () => {
  const output = await scenario(model(2), run(2));
  assert.equal(output.sourceRunId, 2);
  assert.equal(output.comparison.available, true);
});
test('preview output cannot replace the published edition', async () => {
  const output = await scenario(model(2, false), run(2));
  assert.equal(output.sourceRunId, 1);
});
test('failed refresh retains the successful edition and reports the failed attempt', async () => {
  const output = await scenario(null, run(2, 'failure'));
  assert.equal(output.sourceRunId, 1);
  assert.equal(output.latestAttempt.conclusion, 'failure');
});
test('invalid provenance and download failures stop publication preparation', async () => {
  const wrong = model(2); wrong.sourceRevision = 'b'.repeat(40);
  await assert.rejects(scenario(wrong, run(2)), /provenance/);
  await assert.rejects(scenario(model(2), run(2), async () => ({ ok: false, status: 503 })), /HTTP 503/);
});
test('untrusted upstream runs and credential destinations are rejected', async () => {
  assert.equal(eligibleRun({ ...run(2), event: 'pull_request' }), false);
  assert.equal(eligibleRun({ ...run(2), head_branch: 'feature' }), false);
  assert.equal(eligibleRun({ ...run(2), repository: { full_name: 'other/repo' } }), false);
  await assert.rejects(requestJson('https://example.com', 'secret'), /outside GitHub API/);
});

test('archive reader rejects malformed and oversized models without extracting paths', () => {
  assert.throws(() => readReviewArchive(Buffer.from('invalid zip')), /Cannot read/);
  assert.throws(() => readReviewArchive(archive('x'.repeat(2 * 1024 * 1024))), /Cannot read/);
  const result = spawnSync('python3', ['-c', 'import sys,zipfile,io; b=io.BytesIO(); z=zipfile.ZipFile(b,"w"); z.writestr("../review.json","{}"); z.close(); sys.stdout.buffer.write(b.getvalue())']);
  assert.equal(readReviewArchive(result.stdout), null);
});

test('publication rejects unexpected nested data', async () => {
  const untrusted = model(2);
  untrusted.research.raw = { body: 'must never publish' };
  await assert.rejects(scenario(untrusted, run(2)), /Unexpected nested/);
});

test('cross-run artifact access is confined to a trusted default-branch publication job', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/build-deploy-site.yml'), 'utf8');
  const publication = workflow.split('  planning-data:\n')[1].split('  build:\n')[0];
  const build = workflow.split('  build:\n')[1].split('  deploy:\n')[0];
  assert.match(publication, /github.event_name != 'pull_request'/);
  assert.match(publication, /github.ref == 'refs\/heads\/main'/);
  assert.match(publication, /actions: read/);
  assert.doesNotMatch(build, /actions: read|ROADMAP_PROJECT_TOKEN/);
  assert.match(build, /Download validated planning publication data/);
});
