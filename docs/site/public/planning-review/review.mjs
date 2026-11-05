import { defaults, readFilters, selectFindings, selectInventory, selectChanges, viewSearch } from './review-view.mjs';

const byId = id => document.getElementById(id);
const purpose = {
  'product-owner': 'Prioritization, scope decisions and evidence-backed backlog candidates.',
  'project-manager': 'Delivery windows, dependencies, unresolved decisions and acceptance evidence.',
  'scrum-master': 'Blocked work, investigation limits and the entry gaps to resolve before planning.'
};
const labels = { delivery: 'Delivery', backlog: 'Backlog', discovery: 'Discovery' };
const date = value => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}
function link(text, url) {
  const element = node('a', text);
  element.href = url;
  return element;
}
function options(id, values) {
  const select = byId(id);
  for (const value of [...new Set(values)].filter(Boolean).sort()) {
    const option = node('option', value);
    option.value = value;
    select.append(option);
  }
}

function findingCard(finding, role, state, render) {
  const card = node('article', undefined, `finding ${finding.severity}`);
  card.id = finding.id;
  const top = node('div', undefined, 'finding-top');
  top.append(node('span', `${labels[finding.stream]}${finding.sprint ? ' · ' + finding.sprint : ''}${finding.changed ? ' · Changed' : ''}`, 'finding-kind'));
  const permalink = link('Link to finding', '?' + viewSearch({ ...state, finding: finding.id }) + '#' + finding.id);
  permalink.addEventListener('click', event => {
    event.preventDefault(); state.finding = finding.id; render(true);
  });
  top.append(permalink);
  card.append(top, node('h3', finding.title), node('p', finding.impact));
  const recommendation = node('p', undefined, 'recommendation');
  recommendation.append(node('strong', finding.decisionRequired ? 'Recommended decision' : 'Recommended action'), document.createTextNode(' — ' + (finding.roleActions?.[role] || finding.recommendation)));
  card.append(recommendation);
  const evidence = node('details');
  evidence.open = state.finding === finding.id;
  evidence.append(node('summary', 'Observed facts and source evidence'));
  const facts = node('ul');
  for (const fact of finding.facts) facts.append(node('li', fact));
  evidence.append(facts);
  const sources = node('ul', undefined, 'evidence-list');
  for (const source of finding.sources) {
    const item = node('li'); item.append(link(`#${source.number} ${source.title}`, source.url)); sources.append(item);
  }
  if (finding.sources.length) evidence.append(sources);
  else evidence.append(node('p', 'See collection coverage and the source workflow run below.'));
  card.append(evidence);
  return card;
}

async function start() {
  const response = await fetch('./data.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Review output is unavailable');
  const data = await response.json();
  if (data.schemaVersion !== 1 || data.repository !== 'mirichard/pm-tools-templates' || !Array.isArray(data.findings) || !Array.isArray(data.inventory)) throw new Error('Review output is incomplete');
  let state = readFilters(location.search, data);
  options('sprint', data.sprints.map(item => item.title));
  options('release', [data.release, ...data.inventory.map(item => item.release)]);
  options('stage', data.inventory.map(item => item.stage));
  if (['sprint','release','stage'].some(key => state[key] !== 'all')) byId('more-filters').open = true;
  byId('edition').textContent = `Release ${data.release} · Reviewed ${date(data.generatedAt)}${data.publishRequested ? '' : ' · Verified preview baseline'}`;
  byId('source-run').href = data.sourceUrl;
  byId('coverage').textContent = data.coverage.map(item => `${labels[item.name]} — ${item.available ? item.count + ' collected items' : 'coverage unavailable'}`).join(' · ') + (data.comparison.available ? '' : '. Change comparisons begin after the next published review.');
  const unavailable = data.coverage.filter(item => !item.available);
  const failed = data.latestAttempt && !['success','skipped'].includes(data.latestAttempt.conclusion);
  const stale = Date.now() - Date.parse(data.generatedAt) > 72 * 60 * 60 * 1000;
  byId('health').className = 'health' + (failed ? ' error' : unavailable.length || stale ? ' warning' : '');
  byId('health').textContent = failed ? `The latest automation attempt ${data.latestAttempt.conclusion} at ${date(data.latestAttempt.at)}. This page retains the successful review from ${date(data.generatedAt)}.` : unavailable.length ? `Limited coverage — ${unavailable.map(item => labels[item.name]).join(', ')} checks were unavailable. Recommendations using that data are withheld.` : stale ? `This review is more than 72 hours old. Check the source workflow before relying on current status.` : 'Collection complete — backlog, delivery and discovery checked.';
  if (failed) byId('health').append(document.createTextNode(' '), link('Inspect the failed attempt', data.latestAttempt.url));

  function render(updateUrl = false) {
    if (updateUrl) history.replaceState(null, '', location.pathname + (viewSearch(state) ? '?' + viewSearch(state) : '') + (state.finding ? '#' + state.finding : ''));
    for (const id of ['focus','stream','sprint','release','stage','q']) byId(id).value = state[id];
    for (const button of document.querySelectorAll('[data-role]')) button.setAttribute('aria-pressed', String(button.dataset.role === state.role));
    byId('role-purpose').textContent = purpose[state.role];
    const findings = selectFindings(data, state);
    byId('brief-text').textContent = findings.length ? `${findings[0].title}. ${findings[0].impact}` : state.focus === 'changed' && !data.comparison.available ? 'Change comparisons begin after the next published review.' : 'No findings match these filters. Clear filters to review the broader scope.';
    byId('research-signal').hidden = ['delivery','backlog'].includes(state.stream);
    byId('research-signal').textContent = data.research.available ? `Research flow — ${data.research.active} open epic/candidate records in progress; ${data.research.prioritized} prioritized. The policy permits ${data.research.activeLimit} active investigations; rollups require interpretation.` : 'Research flow is unverified because collection coverage is incomplete.';
    byId('result-count').textContent = `${findings.length} finding${findings.length === 1 ? '' : 's'}`;
    const cards = findings.map(finding => findingCard(finding, state.role, state, render));
    byId('finding-list').replaceChildren(...(cards.length ? cards : [node('p', 'No matching findings.', 'empty')]));
    byId('comparison').textContent = data.comparison.available ? `Compared with the successful review at ${date(data.comparison.baselineAt)}. Changes describe source records; they do not infer acceptance or owner approval.` : 'This is the initial comparison baseline. No change or trend is inferred without an earlier published edition.';
    byId('changes-section').hidden = !data.comparison.available;
    const advancedCount = ['sprint','release','stage'].filter(key => state[key] !== 'all').length;
    byId('more-filters-label').textContent = 'Sprint, release and stage filters' + (advancedCount ? ` (${advancedCount} active)` : '');
    const inventory = selectInventory(data, state, findings);
    const changes = selectChanges(data, state);
    byId('changes').replaceChildren(...changes.map(change => {
      const item = node('li'); item.append(link(`#${change.number} ${change.title}`, change.url), node('small', change.details.join(' · '))); return item;
    }));
    if (data.comparison.available && !changes.length) byId('changes').append(node('li', 'No recorded state, stage, sprint or disposition changes match this view.'));
    byId('inventory-summary').textContent = `Supporting work inventory (${inventory.length} item${inventory.length === 1 ? '' : 's'})`;
    byId('inventory').replaceChildren(...inventory.map(item => {
      const row = node('tr'); const title = node('td'); title.append(link(`#${item.number} ${item.title}`, item.url));
      if (item.state === 'closed') title.append(node('small', `Closed — ${item.stateReason || 'reason unrecorded'}`));
      row.append(title, node('td', labels[item.stream]), node('td', [item.status,item.stage].filter(Boolean).join(' / ') || 'Unrecorded'), node('td', item.sprint || 'Unscheduled')); return row;
    }));
    if (state.finding) requestAnimationFrame(() => document.getElementById(state.finding)?.scrollIntoView({ block: 'start' }));
  }
  for (const button of document.querySelectorAll('[data-role]')) button.addEventListener('click', () => { state.role = button.dataset.role; state.finding = ''; render(true); });
  for (const id of ['focus','stream','sprint','release','stage']) byId(id).addEventListener('change', event => { state[id] = event.target.value; state.finding = ''; render(true); });
  byId('q').addEventListener('input', event => { state.q = event.target.value; state.finding = ''; render(true); });
  byId('reset').addEventListener('click', () => { state = { ...defaults, role: state.role }; render(true); });
  byId('share').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); byId('share-status').textContent = 'View link copied.'; }
    catch { byId('share-url').hidden = false; byId('share-url').value = location.href; byId('share-url').select(); byId('share-status').textContent = 'Copy the selected view link.'; }
  });
  addEventListener('popstate', () => { state = readFilters(location.search, data); render(); });
  render();
}

start().catch(() => {
  byId('edition').textContent = 'The published review could not be loaded.';
  byId('health').className = 'health error';
  byId('health').replaceChildren(document.createTextNode('Review output is unavailable. '), link('Open the digest record', 'https://github.com/mirichard/pm-tools-templates/issues/1629'));
  byId('brief-text').textContent = 'Current findings and collection coverage are unverified.';
  byId('finding-list').replaceChildren();
});
