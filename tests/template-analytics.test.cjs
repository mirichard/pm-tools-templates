'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {parseRating, aggregate, render, reports, track, upsertReport} = require('../scripts/template-analytics.cjs');
const now = new Date('2026-09-21T06:00:00Z');
const body = (name = 'Template', stars = 5) => `### Template Name\n\n${name}\n\n### Overall Rating\n\n${'⭐'.repeat(stars)} (${stars} ${stars === 1 ? 'star' : 'stars'}) - Rating\n\n### Category Ratings\n\n- [ ] ✅ **Ease of Use** - Easy\n- [x] 🎯 **Effectiveness** - Effective\n- [X] 📚 **Documentation** - Clear\n\n### Your Experience Level\n\nSenior PM (7+ years)\n\n### Project Type\n\n_No response_`;
const issue = (name, stars, extra = {}) => ({number: 1, body: body(name, stars), created_at: now.toISOString(), labels: [{name: 'template-rating'}], ...extra});
const repo = {owner: 'owner', repo: 'repo'};
function mock(issues = [], comments = []) {
  const calls = [];
  const api = Object.fromEntries(['listForRepo', 'listComments', 'get', 'create', 'update', 'createComment', 'updateComment', 'addLabels', 'removeLabel'].map(name => [name,
    async args => { calls.push([name, args]); return {data: name === 'get' ? issues[0] : {number: 9}}; }]));
  return {calls, rest: {issues: api}, paginate: async (method, args) => {
    calls.push(['paginate', args]);
    return method === api.listComments ? comments : issues;
  }};
}

test('parses all form ratings and only checked emoji-prefixed categories', () => {
  for (let stars = 1; stars <= 5; stars++) {
    const rating = parseRating(issue('Template', stars));
    assert.equal(rating.stars, stars);
    assert.deepEqual(rating.categories, ['Effectiveness', 'Documentation']);
    assert.equal(rating.project, 'Not provided');
  }
});

test('rejects missing, out-of-range, duplicate and contradictory rating fields', () => {
  for (const value of ['', '### Overall Rating\n⭐ (0 stars)', body('', 4), body('Template', 4).replace('(4 stars)', '(5 stars)'), body() + '\n### Overall Rating\n⭐ (1 star)']) {
    assert.equal(parseRating({body: value}).valid, false);
  }
});

test('creation window excludes old updated issues, future submissions and PRs', () => {
  const cutoff = new Date(now.getTime() - 30 * 86400000).toISOString();
  const stats = aggregate([issue('Included', 5, {created_at: cutoff}), issue('Old', 1, {created_at: '2020-01-01', updated_at: now.toISOString()}), issue('Future', 1, {created_at: '2099-01-01'}), issue('PR', 1, {pull_request: {}})], now);
  assert.equal(stats.count, 1);
  assert.equal(stats.average, 5);
});

test('invalid submissions are excluded from denominators, never treated as one star', () => {
  const stats = aggregate([issue('A', 5), issue('A', 3), issue('Bad', 1, {body: ''})], now);
  assert.equal(stats.count, 2);
  assert.equal(stats.invalid, 1);
  assert.equal(stats.average, 4);
  assert.equal(stats.distribution[1], 0);
  assert.match(render(stats), /50\.0%/);
});

test('per-template averages drive both review shortlists and improvement results', () => {
  const stats = aggregate([1, 1, 1].map(stars => issue('Low', stars)).concat([4, 4, 5].map(stars => issue('Good', stars))), now);
  const candidates = render(stats, true);
  assert.match(candidates, /Good/);
  assert.doesNotMatch(candidates, /\| Low \|/);
  assert.match(render(stats), /Templates with averages below 3\n\n[^]*\| Low \| 3 \| 1\.00 \|/);
});

test('empty dataset reports unavailable average, not success', () => {
  const report = render(aggregate([], now));
  assert.match(report, /N\/A — no valid ratings/);
  assert.doesNotMatch(report, /All templates performing well|Marketplace ready/);
});

test('untrusted names cannot create mentions, links, tables or HTML', () => {
  const report = render(aggregate([issue('@person | [link](url) <script>', 5)], now));
  assert.doesNotMatch(report, /@person|<script>|\[link\]\(url\)/);
  assert.match(report, /&#64;person/);
});

test('preview consumes paginated result beyond 100 records and makes no writes', async t => {
  const github = mock(Array.from({length: 130}, () => issue('A', 4)));
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'analytics-test-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  const stats = await reports({github, context: {repo}, now, directory});
  assert.equal(stats.count, 130);
  assert.equal(github.calls.length, 1);
  assert.equal(github.calls[0][0], 'paginate');
  assert.equal(github.calls[0][1].per_page, 100);
  assert.ok(fs.existsSync(path.join(directory, 'ratings.md')));
});

test('publication updates stable bot-owned reports and does not overwrite human issues', async () => {
  const github = mock([{number: 1, user: {type: 'User'}, body: '<!-- marker -->'}, {number: 2, user: {type: 'Bot'}, body: '<!-- marker -->'}]);
  await upsertReport(github, repo, {label: 'report', marker: '<!-- marker -->', title: 'Report', body: 'Report', legacyTitle: 'Legacy'});
  assert.equal(github.calls.at(-1)[0], 'update');
  assert.equal(github.calls.at(-1)[1].issue_number, 2);
});

test('publication reuses latest legacy report, refuses ambiguous current reports', async () => {
  const github = mock([1, 2].map(number => ({number, user: {type: 'Bot'}, title: 'Legacy report', body: ''})));
  const options = {label: 'report', marker: '<!-- marker -->', title: 'Report', body: 'Report', legacyTitle: 'Legacy'};
  await upsertReport(github, repo, options);
  assert.equal(github.calls.at(-1)[1].issue_number, 2);
  const duplicate = mock([1, 2].map(number => ({number, user: {type: 'Bot'}, body: '<!-- marker -->'})));
  await assert.rejects(upsertReport(duplicate, repo, options), /Multiple current/);
});

test('edited malformed rating updates tracking and removes stale star label', async () => {
  const github = mock([issue('A', 5, {body: '', labels: [{name: 'template-rating'}, {name: 'rating-5-star'}, {name: 'analytics-tracked'}]})],
    [{id: 42, user: {type: 'Bot'}, body: '<!-- template-analytics:rating -->'}]);
  await track({github, context: {repo, payload: {issue: {number: 1}}}});
  assert.ok(github.calls.some(([name]) => name === 'updateComment'));
  assert.deepEqual(github.calls.filter(([name]) => name === 'removeLabel').map(([, args]) => args.name), ['rating-5-star', 'analytics-tracked']);
  assert.deepEqual(github.calls.at(-1)[1].labels, ['analytics-invalid']);
});

test('API failures propagate instead of claiming publication', async t => {
  const github = mock();
  github.paginate = async () => { throw new Error('API unavailable'); };
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'analytics-test-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  await assert.rejects(reports({github, context: {repo}, now, directory, publish: true}), /API unavailable/);
});

test('manual dispatch fails closed unless publication is explicitly selected', () => {
  const {shouldPublish} = require('../scripts/template-analytics.cjs');
  for (const preview of [undefined, null, true, false, '', 'true', 'yes']) {
    assert.equal(shouldPublish({eventName: 'workflow_dispatch', payload: {inputs: {preview}}}), false);
  }
  assert.equal(shouldPublish({eventName: 'workflow_dispatch', payload: {inputs: {preview: 'false'}}}), true);
  assert.equal(shouldPublish({eventName: 'schedule', payload: {}}), true);
  assert.equal(shouldPublish({eventName: 'pull_request', payload: {inputs: {preview: 'false'}}}), false);
});

test('repeat publication updates both reports, including an empty candidate shortlist', async t => {
  const stored = [];
  const github = mock();
  github.paginate = async (_, args) => args.labels === 'template-rating' ? [] : stored.filter(i => i.labels.includes(args.labels));
  github.rest.issues.create = async args => stored.push({...args, number: stored.length + 1, user: {type: 'Bot'}});
  github.rest.issues.update = async args => Object.assign(stored.find(i => i.number === args.issue_number), args);
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'analytics-test-'));
  t.after(() => fs.rmSync(directory, {recursive: true, force: true}));
  for (let run = 0; run < 2; run++) await reports({github, context: {repo}, now, directory, publish: true});
  assert.equal(stored.length, 2);
  assert.match(stored[1].body, /No matching templates/);
});

test('tracking rechecks current labels and does not process removed rating labels', async () => {
  const github = mock([issue('A', 5, {labels: []})]);
  await track({github, context: {repo, payload: {issue: {number: 1}}}});
  assert.deepEqual(github.calls.map(([name]) => name), ['get']);
});

test('tracking corrects rating labels and propagates permission failures', async () => {
  const github = mock([issue('A', 4, {labels: [{name: 'template-rating'}, {name: 'rating-1-star'}]})]);
  github.rest.issues.removeLabel = async () => { throw Object.assign(new Error('Forbidden'), {status: 403}); };
  await assert.rejects(track({github, context: {repo, payload: {issue: {number: 1}}}}), /Forbidden/);
});
