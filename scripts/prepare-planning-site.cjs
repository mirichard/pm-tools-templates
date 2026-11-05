'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const { compareReviews, validateReview, reviewUrl } = require('./planning-review-model.cjs');

const workflowFiles = ['weekly-triage-automation.yml', 'sprint-management.yml', 'verify-completion-claims.yml'];
const repository = 'mirichard/pm-tools-templates';
const dataFile = path.join(__dirname, '../docs/site/public/planning-review/data.json');

async function requestJson(url, token, fetcher = fetch) {
  const headers = { Accept: 'application/vnd.github+json' };
  if (token) {
    if (new URL(url).origin !== 'https://api.github.com') throw new Error('Refusing to send credential outside GitHub API');
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetcher(url, { headers, signal: AbortSignal.timeout(30000) });
  if (response.status === 404 && !token) return null;
  if (!response.ok) throw new Error(`Planning data request failed with HTTP ${response.status}`);
  return response.json();
}

function eligibleRun(run) {
  return run.repository?.full_name === repository && run.head_branch === 'main' &&
    workflowFiles.some(file => run.path === `.github/workflows/${file}`) &&
    ['schedule', 'workflow_dispatch'].includes(run.event) && run.status === 'completed';
}

function readReviewArchive(bytes) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'planning-review-'));
  const archive = path.join(directory, 'review.zip');
  try {
    fs.writeFileSync(archive, bytes);
    const result = spawnSync('unzip', ['-p', archive, 'review.json'], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
    if (result.status === 11) return null;
    if (result.status !== 0) throw new Error('Cannot read planning review artifact');
    return JSON.parse(result.stdout);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

async function prepare({ token, fetcher = fetch, destination = dataFile, now = new Date() }) {
  if (!token) throw new Error('Repository Actions read token is required');
  const api = `https://api.github.com/repos/${repository}`;
  const bootstrap = validateReview(JSON.parse(fs.readFileSync(destination, 'utf8')), repository);
  // The website receives only this deliberately published model, never the raw collection snapshot.
  const previous = await requestJson(reviewUrl(repository) + 'data.json', null, fetcher);
  if (previous) validateReview(previous, repository);
  const responses = await Promise.all(workflowFiles.map(file => requestJson(`${api}/actions/workflows/${file}/runs?branch=main&status=completed&per_page=30`, token, fetcher)));
  const runs = responses.flatMap(response => response.workflow_runs).filter(eligibleRun).sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const latest = runs[0];
  let current = previous || bootstrap;
  let foundPublished = false;
  for (const run of runs.filter(item => item.conclusion === 'success')) {
    if (Date.parse(run.created_at) < Date.parse(current.generatedAt) - 5 * 60 * 1000) break;
    const response = await requestJson(`${api}/actions/runs/${run.id}/artifacts?per_page=100`, token, fetcher);
    const artifact = response.artifacts.find(item => item.name === `planning-preview-${run.id}` && !item.expired);
    if (!artifact) continue;
    const archiveResponse = await fetcher(`${api}/actions/artifacts/${artifact.id}/zip`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(30000)
    });
    if (!archiveResponse.ok) throw new Error(`Planning artifact download failed with HTTP ${archiveResponse.status}`);
    const bytes = Buffer.from(await archiveResponse.arrayBuffer());
    if (bytes.length > 5 * 1024 * 1024) throw new Error('Planning artifact exceeds publication size limit');
    const candidate = readReviewArchive(bytes);
    if (!candidate) continue; // Legacy artifacts predate the public model and are not publication input.
    validateReview(candidate, repository);
    if (candidate.sourceRunId !== run.id || candidate.sourceRevision !== run.head_sha) throw new Error('Planning artifact provenance mismatch');
    if (!candidate.publishRequested) continue;
    current = candidate;
    foundPublished = true;
    break;
  }
  if (previous && Date.parse(previous.generatedAt) > Date.parse(current.generatedAt)) current = previous;
  const output = compareReviews(current, previous);
  output.latestAttempt = latest ? {
    at: latest.updated_at, conclusion: latest.conclusion,
    url: `https://github.com/${repository}/actions/runs/${latest.id}`,
    checkedAt: now.toISOString()
  } : null;
  validateReview(output, repository);
  fs.writeFileSync(destination, JSON.stringify(output, null, 2) + '\n');
  console.log(`Planning review prepared from run ${output.sourceRunId}; ${output.findings.length} findings; ${foundPublished ? 'published workflow output' : 'retained verified edition'}`);
  return output;
}

if (require.main === module) {
  prepare({ token: process.env.GITHUB_TOKEN }).catch(() => {
    console.error('Planning review publication preparation failed; the previous deployed website remains the last published edition.');
    process.exitCode = 1;
  });
}

module.exports = { prepare, eligibleRun, readReviewArchive, requestJson };
