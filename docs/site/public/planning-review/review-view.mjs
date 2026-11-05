export const roles = ['product-owner', 'project-manager', 'scrum-master'];
export const defaults = { role: 'product-owner', focus: 'all', stream: 'all', sprint: 'all', release: 'all', stage: 'all', q: '', finding: '' };

export function readFilters(search, data) {
  const query = new URLSearchParams(search);
  const state = { ...defaults };
  for (const key of Object.keys(state)) if (query.has(key)) state[key] = query.get(key);
  if (!roles.includes(state.role)) state.role = defaults.role;
  if (!['all','decision','changed','blocked'].includes(state.focus)) state.focus = 'all';
  if (!['all','delivery','backlog','discovery'].includes(state.stream)) state.stream = 'all';
  if (state.sprint !== 'all' && !data.sprints.some(item => item.title === state.sprint)) state.sprint = 'all';
  const releases = new Set([data.release, ...data.inventory.map(item => item.release).filter(Boolean)]);
  if (state.release !== 'all' && !releases.has(state.release)) state.release = 'all';
  if (state.stage !== 'all' && !data.inventory.some(item => item.stage === state.stage)) state.stage = 'all';
  state.q = state.q.slice(0, 200);
  if (!data.findings.some(item => item.id === state.finding)) state.finding = '';
  return state;
}

export function viewSearch(state) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) if (value && value !== defaults[key]) query.set(key, value);
  return query.toString();
}

function matches(item, state, searchable) {
  return ['stream','sprint','release','stage'].every(key => state[key] === 'all' || item[key] === state[key]) &&
    searchable.toLowerCase().includes(state.q.toLowerCase().replace(/^#/, ''));
}

export function selectFindings(data, state) {
  const priority = { critical: 0, attention: 1, review: 2 };
  return data.findings.filter(item => item.roles.includes(state.role) &&
    matches(item, state, [item.title, ...item.facts, item.recommendation, ...item.sources.map(source => `${source.number} ${source.title}`)].join(' ')) &&
    (state.focus !== 'decision' || item.decisionRequired) &&
    (state.focus !== 'changed' || data.comparison.available && item.changed) &&
    (state.focus !== 'blocked' || item.severity === 'critical' || item.id.startsWith('readiness-') || item.facts.some(fact => /acceptance record/.test(fact)))
  ).sort((a, b) => {
    const roleWeight = item => state.role === 'product-owner' ? Number(!item.decisionRequired) : state.role === 'scrum-master' ? Number(!item.id.startsWith('blocked-') && item.id !== 'discovery-wip') : Number(item.stream !== 'delivery');
    return priority[a.severity] - priority[b.severity] || roleWeight(a) - roleWeight(b) || (a.sprint || '\uffff').localeCompare(b.sprint || '\uffff') || a.id.localeCompare(b.id);
  });
}

export function selectChanges(data, state) {
  if (!data.comparison.available) return [];
  return data.changes.filter(item => matches(item, state, `${item.number} ${item.title} ${item.details.join(' ')}`));
}

export function selectInventory(data, state, findings) {
  const selectedNumbers = new Set(findings.flatMap(item => item.sources.map(source => source.number)));
  const changedNumbers = new Set(data.changes.map(item => item.number));
  return data.inventory.filter(item => matches(item, state, `${item.number} ${item.title}`) &&
    (state.focus !== 'decision' && state.focus !== 'blocked' || selectedNumbers.has(item.number)) &&
    (state.focus !== 'changed' || data.comparison.available && changedNumbers.has(item.number))
  ).sort((a, b) => a.number - b.number);
}
