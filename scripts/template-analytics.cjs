'use strict';

const fs = require('node:fs');
const CATEGORIES = ['Ease of Use', 'Effectiveness', 'Documentation', 'Customization', 'Professional Quality', 'Time Saving'];
const TRACKING_MARKER = '<!-- template-analytics:rating -->';

function field(body, heading) {
  const sections = body.replace(/\r\n/g, '\n').split(/^### /m).slice(1);
  const matches = sections.filter(section => section.split('\n')[0].trim() === heading);
  if (matches.length !== 1) return '';
  const value = matches[0].split('\n').slice(1).join('\n').trim();
  return value === '_No response_' ? '' : value;
}

function parseRating(issue) {
  const body = issue.body || '';
  const name = field(body, 'Template Name');
  const rating = field(body, 'Overall Rating').match(/^(⭐{1,5})\s*\(([1-5]) stars?\)(?:\s*- [^\n]+)?$/u);
  const valid = Boolean(name && !name.includes('\n') && rating && [...rating[1]].length === Number(rating[2]));
  const checked = field(body, 'Category Ratings').split('\n').filter(line => /^- \[[xX]\] /.test(line));
  return {
    valid, name, stars: valid ? Number(rating[2]) : null,
    categories: CATEGORIES.filter(category => checked.some(line => line.includes(`**${category}**`))),
    segment: field(body, 'Your Experience Level') || 'Not provided',
    project: field(body, 'Project Type') || 'Not provided',
  };
}

function aggregate(issues, now = new Date()) {
  const cutoff = new Date(now.getTime() - 30 * 86400000);
  const recent = issues.filter(issue => !issue.pull_request && new Date(issue.created_at) >= cutoff && new Date(issue.created_at) <= now);
  const valid = recent.map(parseRating).filter(rating => rating.valid);
  const templates = new Map();
  const categories = new Map(CATEGORIES.map(category => [category, 0]));
  const segments = new Map();
  const projects = new Map();
  const distribution = [0, 0, 0, 0, 0, 0];
  for (const rating of valid) {
    const stats = templates.get(rating.name) || {name: rating.name, count: 0, sum: 0};
    stats.count++;
    stats.sum += rating.stars;
    templates.set(rating.name, stats);
    distribution[rating.stars]++;
    for (const category of rating.categories) categories.set(category, categories.get(category) + 1);
    segments.set(rating.segment, (segments.get(rating.segment) || 0) + 1);
    projects.set(rating.project, (projects.get(rating.project) || 0) + 1);
  }
  const rows = [...templates.values()].map(stats => ({...stats, average: stats.sum / stats.count}));
  rows.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return {now, cutoff, submitted: recent.length, invalid: recent.length - valid.length,
    count: valid.length, average: valid.length ? valid.reduce((sum, r) => sum + r.stars, 0) / valid.length : null,
    distribution, rows, categories, segments, projects};
}

// Escape issue-supplied text so it cannot add report sections, links, or mentions.
function escape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/[\\`*_{}\[\]()|#!]/g, '\\$&').replace(/@/g, '&#64;').replace(/[\r\n]+/g, ' ');
}

function render(stats, candidatesOnly = false) {
  const marker = candidatesOnly ? 'candidates' : 'report';
  const candidates = stats.rows.filter(row => row.count >= 3 && row.average >= 4);
  const improvement = stats.rows.filter(row => row.average < 3);
  const table = rows => rows.length ? '| Template | Valid ratings | Average |\n|---|---:|---:|\n' +
    rows.map(row => `| ${escape(row.name)} | ${row.count} | ${row.average.toFixed(2)} |`).join('\n') : 'No matching templates in this window.';
  const percent = count => stats.count ? `${(100 * count / stats.count).toFixed(1)}%` : 'N/A';
  const summary = `<!-- template-analytics:${marker} -->\n# ${candidatesOnly ? 'Template Review Candidates' : 'Template Rating Analytics'}\n\n` +
    `Window: ${stats.cutoff.toISOString()} through ${stats.now.toISOString()} (issue creation time, UTC).\n\n` +
    `Labeled submissions: ${stats.submitted}. Valid ratings: ${stats.count}. Excluded malformed submissions: ${stats.invalid}.\n\n` +
    'These are self-reported issue submissions, not unique users, downloads, adoption, or verified template quality. Names are grouped as entered; repeat submissions are not deduplicated by author.\n\n';
  const shortlist = '## Candidates for human review (average ≥ 4, at least 3 valid ratings)\n\n' + table(candidates) +
    '\n\nThis is a rating-based shortlist only. It does not establish marketplace readiness, licensing clearance, or commercial suitability.\n';
  if (candidatesOnly) return summary + shortlist;
  return summary + `Average: ${stats.average === null ? 'N/A — no valid ratings' : stats.average.toFixed(2) + ' / 5'}.\n\n` +
    '## Rating distribution\n\n| Stars | Count | Share of valid ratings |\n|---|---:|---:|\n' +
    [5, 4, 3, 2, 1].map(star => `| ${star} | ${stats.distribution[star]} | ${percent(stats.distribution[star])} |`).join('\n') +
    '\n\n## Per-template ratings\n\n' + table(stats.rows) +
    '\n\n## Category selections\n\nUnchecked or missing boxes are not negative ratings. Percentages use all valid submissions; they are selection rates, not success rates.\n\n' +
    '| Category | Checked | Share of valid ratings |\n|---|---:|---:|\n' +
    [...stats.categories].map(([name, count]) => `| ${name} | ${count} | ${percent(count)} |`).join('\n') +
    '\n\n## Experience levels\n\n' + ([...stats.segments].map(([name, count]) => `- ${escape(name)}: ${count}`).join('\n') || 'No valid ratings.') +
    '\n\n## Reported project types\n\n' + ([...stats.projects].map(([name, count]) => `- ${escape(name)}: ${count}`).join('\n') || 'No valid ratings.') +
    '\n\n' + shortlist + '\n## Templates with averages below 3\n\n' + table(improvement) +
    '\n\nSmall samples are inconclusive. No matching low ratings does not demonstrate that all templates perform well.\n';
}

async function upsertReport(github, repo, {label, marker, title, body, legacyTitle}) {
  if (body.length > 60000) throw new Error('Report exceeds safe issue size; no truncated report will be published');
  const issues = await github.paginate(github.rest.issues.listForRepo, {...repo, labels: label, state: 'open', per_page: 100});
  const owned = issues.filter(issue => !issue.pull_request && issue.user?.type === 'Bot');
  const marked = owned.filter(issue => (issue.body || '').includes(marker));
  if (marked.length > 1) throw new Error(`Multiple current ${label} reports; resolve duplicates before publication`);
  // Reuse one legacy report deterministically without overwriting human issues.
  const existing = marked[0] || owned.filter(issue => (issue.title || '').startsWith(legacyTitle)).sort((a, b) => b.number - a.number)[0];
  if (existing) return github.rest.issues.update({...repo, issue_number: existing.number, title, body});
  return github.rest.issues.create({...repo, title, body, labels: [label, 'type:operational']});
}

async function reports({github, context, publish = false, now = new Date(), directory = 'analytics-reports'}) {
  const cutoff = new Date(now.getTime() - 30 * 86400000);
  // GitHub's `since` filters updated_at, so aggregate also filters created_at.
  const issues = await github.paginate(github.rest.issues.listForRepo, {...context.repo,
    labels: 'template-rating', state: 'all', since: cutoff.toISOString(), per_page: 100});
  const stats = aggregate(issues, now);
  const body = render(stats);
  const candidates = render(stats, true);
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(`${directory}/ratings.md`, body);
  fs.writeFileSync(`${directory}/candidates.md`, candidates);
  if (!publish) return stats;
  // Preflight both documents before the first write. API errors propagate.
  if (Math.max(body.length, candidates.length) > 60000) throw new Error('Report exceeds safe issue size');
  await upsertReport(github, context.repo, {label: 'analytics-report', marker: '<!-- template-analytics:report -->',
    title: '📊 Template Analytics Report', body, legacyTitle: '📊 Template Analytics Report'});
  await upsertReport(github, context.repo, {label: 'marketplace-candidates', marker: '<!-- template-analytics:candidates -->',
    title: '💎 Template Review Candidates', body: candidates, legacyTitle: '💎 Premium Template Marketplace Candidates'});
  return stats;
}

async function track({github, context}) {
  const issue = context.payload.issue;
  // Fetch current state so queued edits cannot restore stale ratings.
  const {data: current} = await github.rest.issues.get({...context.repo, issue_number: issue.number});
  if (current.pull_request || !current.labels.some(label => label.name === 'template-rating')) return;
  const rating = parseRating(current);
  const body = `${TRACKING_MARKER}\n## Template rating recorded\n\n` + (rating.valid ?
    `Template: ${escape(rating.name)}\n\nRating: ${rating.stars} / 5\n\nChecked categories: ${rating.categories.join(', ') || 'None'}. Unchecked categories are not negative ratings.` :
    'This submission is excluded from rating aggregates until Template Name and a valid Overall Rating are supplied using the rating form.');
  const comments = await github.paginate(github.rest.issues.listComments, {...context.repo, issue_number: issue.number, per_page: 100});
  const existing = comments.find(comment => comment.user?.type === 'Bot' &&
    ((comment.body || '').includes(TRACKING_MARKER) || (comment.body || '').includes('## 📊 Template Analytics Tracking')));
  if (existing) await github.rest.issues.updateComment({...context.repo, comment_id: existing.id, body});
  else await github.rest.issues.createComment({...context.repo, issue_number: issue.number, body});
  const desired = rating.valid ? ['analytics-tracked', `rating-${rating.stars}-star`] : ['analytics-invalid'];
  for (const label of current.labels.map(label => label.name)) {
    if ((/^rating-[1-5]-star$/.test(label) || ['analytics-tracked', 'analytics-invalid'].includes(label)) && !desired.includes(label)) {
      try { await github.rest.issues.removeLabel({...context.repo, issue_number: issue.number, name: label}); }
      catch (error) { if (error.status !== 404) throw error; }
    }
  }
  await github.rest.issues.addLabels({...context.repo, issue_number: issue.number, labels: desired});
}

function shouldPublish(context) {
  return context.eventName === 'schedule' ||
    (context.eventName === 'workflow_dispatch' && context.payload.inputs?.preview === 'false');
}

module.exports = {parseRating, aggregate, render, reports, track, upsertReport, shouldPublish};
