import { AIInsightsClient } from '../aiInsightsClient.js';
const client = new AIInsightsClient({ baseURL: `${location.origin}/api/v1`, retries: 1 });
const form = document.querySelector('#project');
const output = document.querySelector('#results');
const status = document.querySelector('#status');
let version = 0;
const append = (parent, tag, text) => {
  const element = document.createElement(tag); element.textContent = text; parent.append(element); return element;
};
function clear() {
  version++; output.replaceChildren(); output.hidden = true;
  document.querySelector('#submit').disabled = false;
  status.textContent = 'No saved results are available. Submit a project to begin.';
}
document.querySelector('#clear').addEventListener('click', clear);
window.addEventListener('pageshow', clear);
document.querySelector('#fixture').addEventListener('click', () => {
  const values = { baselineId: 'synthetic-v1', evidenceBaseline: 'synthetic-v1', effort: 120, capacity: 80,
    assumptions: 'Synthetic qualified capacity after leave and competing assignments', reference: 'synthetic-plan-1',
    interfaceId: 'synthetic-interface', owner: 'Synthetic owner', readiness: 'blocked', issue: 'Synthetic compatibility test failed',
    skillId: 'integration testing', coverage: 'gap' };
  const localTime = date => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,16);
  values.assessedAt = localTime(new Date(Date.now() - 60000));
  values.reviewDue = localTime(new Date(Date.now() + 86400000));
  for (const [key,value] of Object.entries(values)) form.elements.namedItem(key).value = value;
  clear();
});
form.addEventListener('submit', async event => {
  event.preventDefault(); const request = ++version;
  output.replaceChildren(); output.hidden = true;
  document.querySelector('#submit').disabled = true;
  status.textContent = 'Requesting new insights…';
  try {
    const fields = Object.fromEntries(new FormData(form));
    const project = { name: fields.name, teamSize: Number(fields.teamSize), duration: Number(fields.duration),
      budget: Number(fields.budget), complexity: fields.complexity };
    const evidence = {};
    if (fields.baselineId) project.baselineId = fields.baselineId;
    if (fields.evidenceBaseline) evidence.baselineId = fields.evidenceBaseline;
    for (const field of ['assessedAt','reviewDue']) if (fields[field]) evidence[field] = new Date(fields[field]).toISOString();
    const schedule = {};
    if (fields.effort !== '') schedule.remainingEffortHours = Number(fields.effort);
    if (fields.capacity !== '') schedule.availableCapacityHours = Number(fields.capacity);
    if (fields.assumptions) schedule.assumptions = fields.assumptions;
    if (fields.reference) schedule.evidenceReferences = [fields.reference];
    if (Object.keys(schedule).length) evidence.schedule = schedule;
    const common = { ...(fields.owner ? { owner: fields.owner } : {}),
      ...(fields.reference ? { evidenceReferences: [fields.reference] } : {}) };
    if (fields.interfaceId) evidence.integrations = [{ ...common, id: fields.interfaceId, status: fields.readiness,
      ...(fields.issue ? { issue: fields.issue } : {}) }];
    if (fields.skillId) evidence.skills = [{ ...common, id: fields.skillId, coverage: fields.coverage }];
    if (Object.keys(evidence).length) project.planningAssessment = evidence;
    const response = await client.generateInsights(project);
    if (request !== version) return;
    const data = response.data;
    append(output, 'h2', project.name);
    append(output, 'p', `Received ${new Date().toLocaleString()}. Previous result once inputs or service state change. Not saved.`);
    append(output, 'p', `Submitted: team ${project.teamSize}; ${project.duration} days; USD ${project.budget}; ${project.complexity} complexity. Other model inputs use API defaults.`);
    const risk = data.riskPrediction;
    const riskCard = append(output, 'article', '');
    append(riskCard, 'h3', 'Risk model — untrained and unvalidated');
    append(riskCard, 'p', risk ? `Experimental label: ${risk.riskLevel}. This is not an accepted risk determination.` : 'Unavailable');
    const checks = risk?.planningAssessment?.checks;
    append(output, 'h3', 'Evidence-based planning checks');
    if (!checks?.length) append(output, 'p', 'Not assessed: planning checks unavailable.');
    for (const check of checks || []) {
      const card = append(output, 'article', '');
      append(card, 'h4', `${check.ruleId}${check.subject ? ` · ${check.subject}` : ''}: ${check.status.replaceAll('_',' ')}`);
      append(card, 'p', check.reason);
      if (check.recommendation) append(card, 'p', check.recommendation);
      for (const [key,value] of Object.entries(check.measurements || {})) {
        const label = { remainingEffortHours: 'Remaining effort (person-hours)', availableCapacityHours: 'Available capacity (person-hours)', shortfallHours: 'Shortfall (person-hours)', ratio: 'Effort / capacity' }[key] || key;
        append(card, 'p', `${label}: ${value ?? 'Not applicable'}`);
      }
      append(card, 'p', `Evidence: ${check.evidenceReferences.join(', ') || 'Missing'}`);
      append(card, 'p', `Rule ${check.ruleVersion}; assessed ${risk.planningAssessment.assessedAt}`);
    }
    for (const [key,label] of [['resourceOptimization','Resources'],['scheduleAnalysis','Schedule'],['qualityPrediction','Quality']]) {
      const card = append(output,'article',''); append(card,'h3',`${label} — simulated`);
      append(card,'p',data[key] ? 'Simulated output received; not validated for delivery decisions.' : 'Unavailable');
    }
    append(output,'p','Estimated benefit: unavailable for unvalidated results.');
    output.hidden = false; status.textContent = 'Request completed. Results below are unvalidated and are not saved.';
  } catch (error) {
    if (request !== version) return;
    status.textContent = `Request failed: ${error.message}. Correct the input or restore the service, then retry. No new result is available.`;
  } finally {
    if (request === version) document.querySelector('#submit').disabled = false;
  }
});
form.addEventListener('input', () => {
  if (!output.hidden) status.textContent = 'Previous results: inputs have changed. Submit again for a new assessment.';
});
