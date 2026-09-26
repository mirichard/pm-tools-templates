'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');
const config = require('../.github/roadmap-sync.json');
const files = ['ROADMAP.md', 'backlog/roadmap-status.md'];
const marker = '<!-- roadmap-sync:v1 -->';
const start = '<!-- roadmap-sync:start -->';
const end = '<!-- roadmap-sync:end -->';
const message = 'docs(roadmap): refresh generated status';

function cell(value) {
  return String(value ?? '—').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/\|/g, '&#124;').replace(/[\r\n]+/g, ' ')
    .replace(/\[/g, '&#91;').replace(/\]/g, '&#93;').replace(/`/g, '&#96;');
}

function replaceBlock(text, content) {
  if (text.split(start).length !== 2 || text.split(end).length !== 2 ||
      text.indexOf(end) < text.indexOf(start)) throw new Error('Invalid roadmap generated markers');
  return text.slice(0, text.indexOf(start) + start.length) + '\n' + content + '\n' +
    text.slice(text.indexOf(end));
}

async function projectItems(graphql, number) {
  const items = [];
  let cursor = null;
  do {
    const result = await graphql(`query($owner:String!,$number:Int!,$cursor:String) {
      user(login:$owner) { projectV2(number:$number) { items(first:100,after:$cursor) {
        pageInfo { hasNextPage endCursor }
        nodes { isArchived content { __typename ... on Issue { number repository { nameWithOwner } } }
          fieldValues(first:100) { pageInfo { hasNextPage } nodes {
            ... on ProjectV2ItemFieldSingleSelectValue { name field { ... on ProjectV2SingleSelectField { name } } }
            ... on ProjectV2ItemFieldIterationValue { title field { ... on ProjectV2IterationField { name } } }
          } }
        }
      } } }
    }`, {owner: config.projectOwner, number, cursor});
    const connection = result.user?.projectV2?.items;
    if (!connection) throw new Error(`Project ${number} unavailable; refusing partial synchronization`);
    for (const item of connection.nodes) {
      if (item.fieldValues.pageInfo.hasNextPage) throw new Error('Project field values truncated');
      if (item.content?.__typename !== 'Issue' || item.content.repository.nameWithOwner !== config.repository) continue;
      const fields = Object.fromEntries(item.fieldValues.nodes.filter(v => v.field).map(v => [v.field.name, v.name ?? v.title]));
      items.push({number: item.content.number, archived: item.isArchived, ...fields});
    }
    cursor = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
    if (connection.pageInfo.hasNextPage && !cursor) throw new Error('Missing Project pagination cursor');
  } while (cursor);
  if (!items.length) throw new Error(`Project ${number} returned no repository issues`);
  return items;
}

async function collect(github, graphql) {
  const [owner, repo] = config.repository.split('/');
  const roadmap = await projectItems(graphql, config.roadmapProject);
  const sprint = await projectItems(graphql, config.sprintProject);
  const open = await github.paginate(github.rest.issues.listForRepo, {owner, repo, state: 'open', per_page: 100});
  const numbers = new Set([...open.filter(x => !x.pull_request).map(x => x.number),
    ...roadmap.map(x => x.number), ...sprint.map(x => x.number), ...config.retainedIssues]);
  const issues = [];
  for (const number of [...numbers].sort((a, b) => a - b)) {
    const {data} = await github.rest.issues.get({owner, repo, issue_number: number});
    if (data.pull_request) throw new Error(`Expected issue #${number}, received PR`);
    issues.push({number, title: data.title, state: data.state, reason: data.state_reason,
      parent: data.parent_issue_url ? Number(data.parent_issue_url.split('/').pop()) : null,
      types: data.labels.map(x => x.name).filter(x => x.startsWith('type:')).sort()});
  }
  return {issues, roadmap, sprint};
}

function render(snapshot) {
  const roadmap = new Map(snapshot.roadmap.map(x => [x.number, x]));
  const sprint = new Map(snapshot.sprint.map(x => [x.number, x]));
  const issues = [...snapshot.issues].sort((a, b) => a.number - b.number);
  const canonical = {issues, roadmap: [...snapshot.roadmap].sort((a,b) => a.number-b.number),
    sprint: [...snapshot.sprint].sort((a,b) => a.number-b.number)};
  const digest = crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
  const warnings = [];
  const rows = [];
  const commitments = [];
  const link = n => `[#${n}](https://github.com/${config.repository}/issues/${n})`;
  for (const issue of issues) {
    const r = roadmap.get(issue.number), s = sprint.get(issue.number);
    if (issue.state === 'open' && (!r || r.archived)) warnings.push(`#${issue.number}: missing or archived roadmap item`);
    if (issue.state === 'open' && (!r?.Outcome || !r?.Horizon)) warnings.push(`#${issue.number}: missing Outcome or Horizon`);
    if (issue.types.length !== 1) warnings.push(`#${issue.number}: expected exactly one type label`);
    for (const [name, item] of [['Roadmap', r], ['Sprint', s]]) {
      if (!item) continue;
      if (!item.Status) warnings.push(`#${issue.number}: ${name} Status missing`);
      if (issue.state === 'closed' && item.Status !== 'Done') warnings.push(`#${issue.number}: closed issue / ${name} ${item.Status || 'unset'}`);
      if (issue.state === 'open' && item.Status === 'Done') warnings.push(`#${issue.number}: open issue / ${name} Done; acceptance review required`);
    }
    if (r && s && r.Status !== s.Status) warnings.push(`#${issue.number}: board statuses differ (${r.Status || 'unset'} / ${s.Status || 'unset'})`);
    const state = issue.state === 'closed' ? `Closed (${issue.reason || 'unspecified'})` : 'Open';
    rows.push(`| ${link(issue.number)} — ${cell(issue.title)} | ${cell(state)} | ${issue.parent ? link(issue.parent) : 'Standalone'} | ${cell(r?.Outcome)} | ${cell(r?.Horizon)} | ${cell(r?.Status)} | ${cell(s?.Sprint)} | ${cell(s?.Status)} |`);
    if (s?.Sprint && !s.archived) commitments.push(`| ${cell(s.Sprint)} | ${link(issue.number)} — ${cell(issue.title)} | ${cell(state)} | ${cell(s.Status)} |`);
  }
  const note = `Snapshot fingerprint: \`${digest}\`. Values are copied from issues and Projects, not inferred acceptance or release claims.\n\n`;
  const alerts = warnings.length ? warnings.map(x => `- ${cell(x)}`).join('\n') : 'No issue/Project state or mapping gaps detected. This does not validate acceptance evidence or narrative decisions.';
  const summary = note + '| Sprint | Issue | Issue state | Board status |\n| --- | --- | --- | --- |\n' +
    (commitments.join('\n') || '| — | No assigned sprint items | — | — |') +
    `\n\n[Full status and drift report](backlog/roadmap-status.md). ${warnings.length} drift flag(s) require review.\n`;
  const register = '# Current roadmap status\n\nGenerated; do not edit by hand. [Policy](../docs/roadmap-sync.md) · [Decision register](roadmap-alignment.md).\n\n' + note +
    '## Drift requiring review\n\n' + alerts + '\n\n## Issue and Project values\n\n' +
    '| Issue | Issue state | Parent | Outcome | Horizon | Roadmap status | Sprint | Sprint status |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n' + rows.join('\n') + '\n';
  return {summary, register, warnings, digest};
}

async function publish(github, contents, report, baseSha) {
  const [owner, repo] = config.repository.split('/');
  const args = {owner, repo};
  let ref;
  try { ref = (await github.rest.git.getRef({...args, ref: `heads/${config.branch}`})).data; }
  catch (error) { if (error.status !== 404) throw error; }
  if (ref) {
    const head = (await github.rest.git.getCommit({...args, commit_sha: ref.object.sha})).data;
    // Never overwrite a maintainer's edits on the reserved automation branch.
    if (head.message !== message) throw new Error('Automation branch has an unrecognized commit; manual reconciliation required');
  }
  const prs = await github.paginate(github.rest.pulls.list, {...args, state: 'open', head: `${owner}:${config.branch}`, base: config.defaultBranch, per_page: 100});
  if (prs.length > 1) throw new Error('Multiple synchronization PRs; manual reconciliation required');
  if (prs.length && !prs[0].body?.startsWith(marker)) throw new Error('Reserved branch PR is not owned by this workflow');
  if (ref) {
    let identical = true;
    for (const path of files) {
      const data = (await github.rest.repos.getContent({...args, path, ref: ref.object.sha})).data;
      identical &&= data.encoding === 'base64' && Buffer.from(data.content, 'base64').toString('utf8') === contents[path];
    }
    // A pending PR with the same content needs no new commit or PR update.
    if (identical && prs.length) return prs[0].html_url;
  }
  const base = (await github.rest.git.getCommit({...args, commit_sha: baseSha})).data;
  const tree = (await github.rest.git.createTree({...args, base_tree: base.tree.sha,
    tree: files.map(path => ({path, mode: '100644', type: 'blob', content: contents[path]}))})).data;
  const parents = ref && ref.object.sha !== baseSha ? [ref.object.sha, baseSha] : [baseSha];
  const commit = (await github.rest.git.createCommit({...args, message, tree: tree.sha, parents})).data;
  if (ref) await github.rest.git.updateRef({...args, ref: `heads/${config.branch}`, sha: commit.sha, force: false});
  else await github.rest.git.createRef({...args, ref: `refs/heads/${config.branch}`, sha: commit.sha});
  const body = `${marker}\nRefresh generated issue/Project values. ${report.warnings.length} drift flag(s); review backlog/roadmap-status.md.\n\nHuman review must resolve conflicts and assess changed scope, acceptance and residual work. This PR does not change issues, planning fields or priorities.\n\nSnapshot: \`${report.digest}\`. Read [the operating policy](https://github.com/${config.repository}/blob/${config.defaultBranch}/docs/roadmap-sync.md).\n\nChecks on token-created PRs may require maintainer approval; do not merge without required checks.`;
  if (prs.length) {
    await github.rest.pulls.update({...args, pull_number: prs[0].number, body});
    return prs[0].html_url;
  }
  return (await github.rest.pulls.create({...args, base: config.defaultBranch, head: config.branch,
    title: 'docs(roadmap): synchronize issue and project status', body})).data.html_url;
}

// Reuse the capture time for identical source data, including an unmerged proposal.
function snapshotTime(digest, candidates, now = new Date().toISOString()) {
  for (const text of candidates) {
    if (!text.includes(`Snapshot fingerprint: \`${digest}\``)) continue;
    const match = text.match(/^Snapshot updated at: (\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) \(UTC\)\.$/m);
    if (match && !Number.isNaN(Date.parse(match[1]))) return match[1];
  }
  return now;
}

async function run({github, graphql, core, preview = true}) {
  const snapshot = await collect(github, graphql);
  const report = render(snapshot);
  const [owner, repo] = config.repository.split('/');
  // Read one immutable main commit; do not publish from an arbitrary dispatched branch.
  const baseSha = (await github.rest.repos.getBranch({owner, repo, branch: config.defaultBranch})).data.commit.sha;
  const originals = {};
  for (const path of files) {
    const data = (await github.rest.repos.getContent({owner, repo, path, ref: baseSha})).data;
    if (data.type !== 'file' || data.encoding !== 'base64') throw new Error(`Cannot read ${path}`);
    originals[path] = Buffer.from(data.content, 'base64').toString('utf8');
  }
  const candidates = [originals['backlog/roadmap-status.md']];
  // A pending PR must retain its timestamp across unchanged runs before merge.
  try {
    const data = (await github.rest.repos.getContent({owner, repo,
      path: 'backlog/roadmap-status.md', ref: config.branch})).data;
    if (data.type !== 'file' || data.encoding !== 'base64') throw new Error('Cannot read pending snapshot');
    candidates.push(Buffer.from(data.content, 'base64').toString('utf8'));
  } catch (error) { if (error.status !== 404) throw error; }
  const updatedAt = snapshotTime(report.digest, candidates);
  const freshness = `Snapshot updated at: ${updatedAt} (UTC).\n\n` +
    `[Latest synchronization checks](https://github.com/${config.repository}/actions/workflows/roadmap-sync.yml) — includes successful checks with no data changes. A check does not publish to main until its PR is merged.\n\n`;
  report.summary = freshness + report.summary;
  report.register = report.register.replace('Snapshot fingerprint:', freshness + 'Snapshot fingerprint:');
  const contents = {
    'ROADMAP.md': replaceBlock(originals['ROADMAP.md'], report.summary),
    'backlog/roadmap-status.md': report.register
  };
  const changed = files.some(path => contents[path] !== originals[path]);
  fs.mkdirSync('roadmap-sync-preview', {recursive: true});
  fs.writeFileSync('roadmap-sync-preview/roadmap.md', contents['ROADMAP.md']);
  fs.writeFileSync('roadmap-sync-preview/status.md', report.register);
  await core.summary.addRaw(`Roadmap reconciliation: ${report.warnings.length} drift flag(s). Changed: ${changed}. Preview: ${preview}.\n\n${report.warnings.map(cell).join('\n')}`).write();
  if (!preview && !changed) {
    const prs = await github.paginate(github.rest.pulls.list, {owner, repo, state: 'open', head: `${owner}:${config.branch}`, base: config.defaultBranch, per_page: 100});
    if (prs.length > 1 || prs.some(pr => !pr.body?.startsWith(marker))) throw new Error('Unrecognized synchronization PR');
    for (const pr of prs) await github.rest.pulls.update({owner, repo, pull_number: pr.number, state: 'closed'});
  }
  if (!preview && changed) {
    const url = await publish(github, contents, report, baseSha);
    core.info(`Synchronization PR: ${url}`);
  }
  return {changed, warnings: report.warnings};
}

module.exports = {snapshotTime, cell, replaceBlock, projectItems, collect, render, publish, run};
