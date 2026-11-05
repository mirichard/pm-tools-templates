import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFilters, selectFindings, selectInventory, viewSearch } from '../docs/site/public/planning-review/review-view.mjs';

const data = {
  release: '2.5.0', comparison: { available: true }, sprints: [{ title: 'Sprint 4' }],
  inventory: [{ number: 49, title: 'Product owner toolkit', stream: 'discovery', stage: 'Decision needed', sprint: '', release: '2.5.0' }, { number: 1559, title: 'Search definition', stream: 'delivery', sprint: 'Sprint 4', stage: '', release: '2.5.0' }],
  changes: [{ number: 49 }],
  findings: [
    { id: 'research-49', title: 'Review toolkit', stream: 'discovery', stage: 'Decision needed', sprint: '', release: '2.5.0', roles: ['product-owner'], facts: ['Evidence available'], recommendation: 'Review evidence', sources: [{ number: 49, title: 'Product owner toolkit' }], severity: 'review', decisionRequired: true, changed: true },
    { id: 'readiness-sprint-4', title: 'Search entry gaps', stream: 'delivery', stage: '', sprint: 'Sprint 4', release: '2.5.0', roles: ['product-owner','project-manager','scrum-master'], facts: ['Missing record'], recommendation: 'Reconcile', sources: [{ number: 1559, title: 'Search definition' }], severity: 'attention', decisionRequired: true, changed: false }
  ]
};
test('role, work type, sprint and issue filters select relevant findings', () => {
  assert.equal(selectFindings(data, readFilters('?role=project-manager', data)).length, 1);
  assert.equal(selectFindings(data, readFilters('?stream=discovery&stage=Decision+needed', data))[0].id, 'research-49');
  assert.equal(selectFindings(data, readFilters('?sprint=Sprint+4&q=%231559', data))[0].id, 'readiness-sprint-4');
  assert.equal(selectFindings(data, readFilters('?q=unmatched', data)).length, 0);
});
test('shared URLs preserve every supported filter and a selected finding', () => {
  const state = readFilters('?role=scrum-master&focus=blocked&stream=delivery&sprint=Sprint+4&release=2.5.0&q=search&finding=readiness-sprint-4', data);
  assert.deepEqual(readFilters('?' + viewSearch(state), data), state);
  assert.equal(readFilters('?role=unknown&focus=wrong&stage=unknown', data).role, 'product-owner');
});
test('changed-only view requires a baseline and filters supporting inventory consistently', () => {
  const state = readFilters('?focus=changed', data);
  const findings = selectFindings(data, state);
  assert.deepEqual(findings.map(item => item.id), ['research-49']);
  assert.deepEqual(selectInventory(data, state, findings).map(item => item.number), [49]);
  const firstEdition = { ...data, comparison: { available: false } };
  assert.equal(selectFindings(firstEdition, state).length, 0);
});
