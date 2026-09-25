const $ = selector => document.querySelector(selector);
const form = $('#review-form');
const status = $('#status');
let step = 0;
let revision = 0;
let sequence = 0;
let snapshot = null;
let record = null;
let previous = null;
let busy = false;
let itemNumber = 0;
const labels = { capacity: 'Capacity', dependencies: 'Prerequisite', handoffs: 'Handoff', skills: 'Required skill' };
const contextLabels = { projectName: 'Project / workstream', scope: 'Scope and exclusions', periodStart: 'Period starts', periodEnd: 'Period ends', asOf: 'Plan status as of', timezone: 'Time zone', decision: 'Decision', planVersion: 'Plan version', alignmentConfirmed: 'Scope and period alignment confirmed' };
const evidenceLabels = { baselineId: 'Evidence plan version', assessedAt: 'Evidence confirmed', reviewDue: 'Evidence review due', schedule: 'Capacity and prerequisites', remainingEffortHours: 'Remaining effort (person-hours)', availableCapacityHours: 'Qualified capacity (person-hours)', assumptions: 'Preparation assumptions', evidenceReferences: 'Evidence reference(s)', dependencies: 'Prerequisites', handoffs: 'Handoffs', skills: 'Required skills', id: 'Item', owner: 'Evidence owner', neededAt: 'Needed by', availableAt: 'Expected availability', status: 'Readiness', issue: 'Documented issue', coverage: 'Skill coverage' };
const append = (parent, tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  parent.append(node);
  return node;
};
function show(next) {
  step = next;
  document.querySelectorAll('[data-step]').forEach(node => { node.hidden = Number(node.dataset.step) !== step; });
  document.querySelectorAll('#progress li').forEach((node, index) => {
    if (index === step) node.setAttribute('aria-current', 'step'); else node.removeAttribute('aria-current');
  });
  $('[data-step="' + step + '"] h2').focus();
}
function clearErrors() {
  $('#errors').hidden = true;
  $('#errors').replaceChildren();
  form.querySelectorAll('[aria-invalid]').forEach(node => { node.removeAttribute('aria-invalid'); node.classList.remove('invalid'); });
}
function errors(messages) {
  const box = $('#errors'); box.replaceChildren(); box.hidden = false;
  append(box, 'h2', 'Check these inputs');
  const list = append(box, 'ul');
  messages.forEach(({ node, message }) => {
    const li = append(list, 'li');
    if (node) {
      node.setAttribute('aria-invalid', 'true'); node.classList.add('invalid');
      const link = append(li, 'a', message); link.href = '#' + node.id;
      link.addEventListener('click', event => { event.preventDefault(); show(Number(node.closest('[data-step]').dataset.step)); node.focus(); });
    } else li.textContent = message;
  });
  box.focus();
}
function validate(all = false) {
  clearErrors();
  const controls = [...form.querySelectorAll('input,select,textarea')].filter(node => !node.disabled && (all || Number(node.closest('[data-step]').dataset.step) === step));
  controls.forEach(node => node.setCustomValidity(''));
  const start = $('#periodStart'), end = $('#periodEnd');
  if (start.value && end.value && end.value < start.value) end.setCustomValidity('Review end must be on or after the start.');
  if ($('#assessedAt').value && new Date($('#assessedAt').value) > new Date()) $('#assessedAt').setCustomValidity('Confirmation cannot be in the future.');
  if ($('#assessedAt').value && $('#reviewDue').value && $('#reviewDue').value <= $('#assessedAt').value) $('#reviewDue').setCustomValidity('Review due must be later than confirmation.');
  for (const group of ['dependencies', 'handoffs', 'skills']) {
    const seen = new Set();
    document.querySelectorAll(`#${group} [data-key="id"]`).forEach(node => {
      const value = node.value.trim();
      if (seen.has(value)) node.setCustomValidity('Use a unique item name within this group.');
      seen.add(value);
    });
  }
  const invalid = controls.filter(node => !node.checkValidity() || (node.required && node.type !== 'checkbox' && !node.value.trim()));
  if (invalid.length) errors(invalid.map(node => ({ node, message: `${node.labels?.[0]?.textContent || 'Input'}: ${node.validationMessage || 'Enter a value.'}` })));
  return invalid.length === 0;
}
function dirty() {
  revision++; sequence++; snapshot = null;
  if (record) {
    record.inputsChanged = true;
    $('#stale').hidden = false;
    status.textContent = 'Inputs changed. Previous findings remain dated; check inputs and reassess.';
  } else status.textContent = 'Inputs changed. Check readiness before running the review.';
}
form.addEventListener('input', dirty);
form.addEventListener('change', dirty);
document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => { if (validate()) show(step + 1); }));
document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => { clearErrors(); show(step - 1); }));

const itemFields = {
  dependencies: [['id', 'What must be available first?', 'Examples: participant consent before interviews, approved text before printing, or venue access before setup. Name the receiving work too.', 'text', true], ['neededAt', 'When is it needed? (local time)', 'Use the date the next task needs it. Example: the morning interviews begin. Leave unknown if not agreed.', 'datetime-local'], ['availableAt', 'When is it expected? (local time)', 'Ask the person providing it for the current expected date. A later date than needed creates a timing concern.', 'datetime-local']],
  handoffs: [['id', 'What is being passed, and to whom?', 'Examples: interview notes to an analyst, a draft to a reviewer, or event materials to a coordinator.', 'text', true], ['status', 'Can the receiving person use it as needed?', 'Choose confirmed ready only after checking requirements with the recipient. A known problem needs a description; unknown remains unassessed.', ['unknown', 'verified', 'blocked']], ['issue', 'What is preventing the handoff?', 'Examples: consent details are missing from notes, a draft lacks citations, or materials use a format the recipient cannot use. Needed for a known problem.', 'textarea']],
  skills: [['id', 'What skill or support is needed?', 'Examples: interviewing, analyzing findings, editing a report, translating guidance, or facilitating a workshop.', 'text', true], ['coverage', 'Is the needed skill or support available?', 'Confirm with the people doing the work. Available means qualified support is arranged; unknown is different from a confirmed gap.', ['unknown', 'confirmed', 'gap']]],
};
function addField(parent, prefix, key, label, hint, type = 'text', required = false) {
  const field = append(parent, 'div', undefined, 'field');
  const id = `${prefix}-${key}`;
  const labelNode = append(field, 'label', `${label}${required ? ' (required for this item)' : (prefix.startsWith('action-') ? ' (optional)' : ' (leave unknown if not confirmed)')}`); labelNode.htmlFor = id;
  const help = append(field, 'p', hint, 'hint'); help.id = id + '-hint';
  const input = append(field, Array.isArray(type) ? 'select' : type === 'textarea' ? 'textarea' : 'input');
  input.id = id; input.dataset.key = key; input.required = required;
  input.setAttribute('aria-describedby', help.id);
  if (Array.isArray(type)) type.forEach(value => { const option = append(input, 'option', { unknown: 'Unknown', verified: 'Confirmed ready', blocked: 'Known problem', confirmed: 'Confirmed available', gap: 'Confirmed gap' }[value] || value); option.value = value; });
  else if (type === 'textarea') { input.rows = 3; input.maxLength = 2000; }
  else { input.type = type; if (type === 'text') input.maxLength = 2000; }
  return input;
}
function addItem(group, values = {}) {
  const item = append($('#' + group), 'div', undefined, 'item');
  const prefix = `item-${++itemNumber}`;
  const heading = append(item, 'h3', `${labels[group]} ${$('#' + group).children.length}`);
  item.setAttribute('role', 'group'); heading.id = prefix + '-heading'; item.setAttribute('aria-labelledby', heading.id);
  const fields = append(item, 'div', undefined, 'fields');
  for (const args of [...itemFields[group], ['owner', 'Who can confirm this?', 'A person or role, such as the researcher, editor or event coordinator. The check needs someone accountable for this information.'], ['reference', 'What supports this answer?', 'Describe the confirmation: for example, “Reviewer checked the draft today” or “Coordinator confirmed by phone.” No file is opened or retrieved.']]) {
    const input = addField(fields, prefix, ...args); if (values[args[0]] !== undefined) input.value = values[args[0]];
  }
  const remove = append(item, 'button', 'Remove this item', 'secondary'); remove.type = 'button';
  remove.addEventListener('click', () => { item.remove(); dirty(); $(`[data-add="${group}"]`).focus(); });
  dirty(); return item;
}
document.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => addItem(button.dataset.add).querySelector('input').focus()));
function updateApplicability(group) {
  const state = $('#' + group + '-choice').value;
  const body = $('#' + group + '-inputs'); body.hidden = state !== 'include';
  body.querySelectorAll('input,select,textarea,button').forEach(node => { node.disabled = state !== 'include'; });
  $('#' + group + '-exclusion').hidden = state !== 'not_applicable';
  const anyIncluded = [...document.querySelectorAll('[data-choice]')].some(node => node.value === 'include');
  $('#confirmation-inputs').hidden = !anyIncluded;
  $('#confirmation-inputs').querySelectorAll('input').forEach(node => { node.disabled = !anyIncluded; });
  const reason = $('#' + group + '-reason'); reason.disabled = state !== 'not_applicable'; reason.required = state === 'not_applicable';
}
document.querySelectorAll('[data-choice]').forEach(node => node.addEventListener('change', () => updateApplicability(node.dataset.choice)));

function readItems(group) {
  return [...$('#' + group).children].map(item => {
    const value = {};
    item.querySelectorAll('[data-key]').forEach(input => {
      if (!input.value.trim()) return;
      const key = input.dataset.key;
      if (key === 'reference') value.evidenceReferences = [input.value.trim()];
      else value[key] = input.type === 'datetime-local' ? new Date(input.value).toISOString() : input.value.trim();
    });
    return value;
  });
}
function payload() {
  const context = {};
  for (const key of Object.keys(contextLabels)) {
    context[key] = key === 'timezone' ? Intl.DateTimeFormat().resolvedOptions().timeZone : key === 'alignmentConfirmed' ? $('#alignmentConfirmed').checked : $('#' + key).value.trim();
  }
  const applicability = Object.fromEntries(['capacity', 'dependencies', 'handoffs', 'skills'].map(key => {
    const state = $('#' + key + '-choice').value;
    return [key, { state, ...(state === 'not_applicable' ? { reason: $('#' + key + '-reason').value.trim() } : {}) }];
  }));
  const included = key => applicability[key].state === 'include';
  const evidence = {}, schedule = {};
  if (!$('#evidenceVersion').disabled && $('#evidenceVersion').value.trim()) evidence.baselineId = $('#evidenceVersion').value.trim();
  for (const key of ['assessedAt', 'reviewDue']) if (!$('#' + key).disabled && $('#' + key).value) evidence[key] = new Date($('#' + key).value).toISOString();
  for (const [id, key] of [['effort', 'remainingEffortHours'], ['capacity', 'availableCapacityHours']]) if (included('capacity') && $('#' + id).value !== '') schedule[key] = Number($('#' + id).value);
  if (included('capacity') && $('#assumptions').value.trim()) schedule.assumptions = $('#assumptions').value.trim();
  if (included('capacity') && $('#reference').value.trim()) schedule.evidenceReferences = [$('#reference').value.trim()];
  const dependencies = included('dependencies') ? readItems('dependencies') : []; if (dependencies.length) schedule.dependencies = dependencies;
  if (Object.keys(schedule).length) evidence.schedule = schedule;
  for (const group of ['handoffs', 'skills']) { const items = included(group) ? readItems(group) : []; if (items.length) evidence[group] = items; }
  return { context, applicability, evidence };
}
function listObject(parent, object, names) {
  const list = append(parent, 'dl', undefined, 'summary-list');
  Object.entries(object).forEach(([key, value]) => {
    const row = append(list, 'div'); append(row, 'dt', names[key] || key);
    const dd = append(row, 'dd');
    if (Array.isArray(value) && typeof value[0] === 'object') value.forEach(item => listObject(dd, item, names));
    else if (value && typeof value === 'object' && !Array.isArray(value)) listObject(dd, value, names);
    else dd.textContent = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : Array.isArray(value) ? value.join('; ') : value;
  });
}
function inputSummary(parent, data) {
  parent.replaceChildren(); listObject(parent, data.context, contextLabels);
  append(parent, 'h3', 'Checks you chose');
  for (const [key, choice] of Object.entries(data.applicability)) append(parent, 'p', `${labels[key]}: ${{ include: 'Included', unknown: 'Not sure yet', not_applicable: 'Not applicable — excluded' }[choice.state]}${choice.reason ? '. Reason: ' + choice.reason : ''}`);
  const details = append(parent, 'details'); append(details, 'summary', 'Supporting evidence supplied');
  if (Object.keys(data.evidence).length) listObject(details, data.evidence, evidenceLabels);
  else append(details, 'p', 'No evidence supplied. Checks cannot be assessed.');
}
async function request(operation, body) {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(`/api/v1/recovery-uat/planning/${operation}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: controller.signal });
    if (!response.ok) {
      if (response.status === 400) throw new Error('Some input values are invalid. Check dates, item names and required fields, then retry.');
      throw new Error('The review service is unavailable. Restore the service and retry; your inputs remain on this page.');
    }
    const result = await response.json();
    if (!result.success || !Array.isArray(result.data?.assessment?.checks) || (operation === 'review' && !result.data.reviewId)) throw new Error('The service returned an incomplete review. Retry; no new result is available.');
    return result.data;
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError) throw new Error('The review could not reach the service in time. Check your connection and retry; your inputs remain on this page.');
    throw error;
  } finally { clearTimeout(timer); }
}
function setBusy(value) {
  busy = value;
  $('#preview').disabled = value; $('#run').disabled = value;
}
$('#preview').addEventListener('click', async () => {
  if (busy || !validate(true)) return;
  const requestId = ++sequence, startedRevision = revision, body = payload();
  setBusy(true); status.textContent = 'Checking input readiness…';
  try {
    const data = await request('preview', body);
    if (requestId !== sequence) return;
    snapshot = { body, revision: startedRevision };
    inputSummary($('#summary'), data); $('#readiness').replaceChildren();
    let ready = 0;
    data.assessment.checks.forEach(check => {
      const assessed = ['triggered', 'not_triggered'].includes(check.status); if (assessed) ready++;
      append($('#readiness'), 'p', `${labels[check.ruleId]}${check.subject ? ': ' + check.subject : ''} — ${assessed ? 'Ready to check' : check.status === 'not_applicable' ? 'Not applicable — ' + check.reason : 'Not assessable: ' + check.reason}`);
    });
    $('#run').textContent = ready ? 'Run planning checks' : 'Create preparation summary';
    show(3); status.textContent = `${ready} of ${data.assessment.checks.length} supplied checks have sufficient evidence to evaluate. Review inputs before continuing.`;
  } catch (error) { if (requestId === sequence) { errors([{ message: error.message }]); status.textContent = 'Readiness check failed. No new result is available.'; } }
  finally { setBusy(false); }
});
const actionFields = [['response', 'Proposed response', 'Describe your next step. Example: agree reduced scope or arrange additional qualified help.'], ['owner', 'Action owner', 'Name a person or role, such as the report author, coordinator or project lead.'], ['due', 'Action due date', 'Agree a completion date with the owner; for example, before the next review meeting.', 'date'], ['approval', 'Approval needed', 'Example: the sponsor approves a date change, or the team lead approves extra time.'], ['sourceChange', 'Planning update', 'Example: revise the outline, amend a task estimate, or confirm a new date with the team. Use your normal planning method.'], ['resolution', 'Resolution evidence', 'Example: the recipient confirms the revised draft is usable, or the lead confirms available hours.']];
function actionKey(check) { return JSON.stringify([check.ruleId, check.subject || '']); }
function captureActions() {
  if (!record) return;
  document.querySelectorAll('[data-action-key]').forEach(details => {
    const action = { finding: details.dataset.actionTitle };
    details.querySelectorAll('[data-key]').forEach(input => { action[input.dataset.key] = input.value; });
    record.actions[details.dataset.actionKey] = action;
  });
}
function renderRecord() {
  $('#findings').replaceChildren();
  const counts = { triggered: 0, not_triggered: 0, not_assessed: 0, not_applicable: 0 };
  record.assessment.checks.forEach(check => { counts[check.status]++; });
  $('#coverage').textContent = `${counts.triggered} findings need attention · ${counts.not_triggered} checks found no issue · ${counts.not_assessed} checks not assessed · ${counts.not_applicable} checks excluded as not applicable. This is not approval of the whole plan.`;
  $('#result-identity').textContent = `${record.context.projectName} · Plan ${record.context.planVersion} · ${record.context.periodStart} to ${record.context.periodEnd} · Assessed ${new Date(record.assessment.assessedAt).toLocaleString()} · Review ${record.reviewId}`;
  $('#stale').hidden = false === record.inputsChanged;
  if (previous) append($('#findings'), 'p', record.previousScopeMatches
    ? `Reassessment of ${previous.reviewId}. Download this review to retain both snapshots. Open issues must be checked individually.`
    : `The review scope or period changed. Previous review ${previous.reviewId} is included for reference only; actions were not carried forward.`);
  record.assessment.checks.forEach((check, index) => {
    const card = append($('#findings'), 'article', undefined, `finding ${check.status}`);
    append(card, 'p', { triggered: 'Needs attention', not_triggered: 'No issue detected in this check', not_assessed: 'Not assessed', not_applicable: 'Not applicable — excluded by you' }[check.status], 'badge');
    const title = `${labels[check.ruleId]}${check.subject ? ' · ' + check.subject : ''}`;
    append(card, 'h3', title); append(card, 'p', check.reason);
    if (check.ruleId === 'capacity' && check.measurements.remainingEffortHours !== undefined) {
      const m = check.measurements;
      append(card, 'p', `${m.remainingEffortHours} remaining person-hours compared with ${m.availableCapacityHours} available person-hours. Shortfall: ${m.shortfallHours} person-hours. Effort / capacity: ${m.ratio ?? 'not applicable'}.`, 'measurements');
      append(card, 'p', 'This aggregate comparison does not establish task sequencing, specialist availability or a delivery delay.');
    }
    const subject = check.ruleId === 'dependencies' ? record.evidence.schedule?.dependencies?.find(item => item.id === check.subject) : record.evidence[check.ruleId]?.find(item => item.id === check.subject);
    if (subject) listObject(card, subject, evidenceLabels);
    append(card, 'p', `Evidence: ${check.evidenceReferences.join('; ') || 'Not supplied'}`);
    append(card, 'p', `Next: ${check.recommendation || (check.status === 'not_assessed' ? 'Ask the relevant owner for the missing or updated evidence, then reassess.' : 'Retain the supporting evidence and reassess when the plan or conditions change.')}`);
    if (check.status === 'not_applicable') return;
    const action = append(card, 'details');
    action.dataset.actionKey = actionKey(check); action.dataset.actionTitle = title;
    append(action, 'summary', 'Record follow-up action');
    const fields = append(action, 'div', undefined, 'fields');
    const existing = record.actions[actionKey(check)] || {};
    for (const [key, label, hint, type] of actionFields) { const input = addField(fields, `action-${index}`, key, label, hint, type || 'textarea'); input.value = existing[key] || ''; }
    const state = addField(fields, `action-${index}`, 'state', 'Action progress', 'Progress does not change the assessment finding.', ['Open', 'In progress', 'Completed — awaiting reassessment']); state.value = existing.state || 'Open';
  });
  inputSummary($('#result-inputs'), record);
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (step === 1) { if (validate()) show(2); return; }
  if (step === 2) { $('#preview').click(); return; }
  if (step !== 3) return;
  if (busy || !snapshot || snapshot.revision !== revision) { status.textContent = 'Inputs changed. Check readiness again before running.'; show(2); return; }
  captureActions();
  const prior = record ? structuredClone(record) : previous;
  const requestId = ++sequence; setBusy(true); clearErrors();
  previous = prior;
  record = null; $('#findings').replaceChildren(); $('#results').hidden = true;
  status.textContent = 'Running evidence-based planning checks…';
  try {
    const data = await request('review', snapshot.body);
    if (requestId !== sequence) return;
    previous = prior;
    const sameScope = prior && ['projectName', 'scope', 'periodStart', 'periodEnd'].every(key => data.context[key] === prior.context[key]);
    record = { ...data, inputsChanged: false, previousScopeMatches: Boolean(sameScope), actions: structuredClone(sameScope ? prior.actions : {}) };
    renderRecord(); show(4); status.textContent = 'Review completed. Results and actions are session-only; download a record before leaving.';
  } catch (error) { if (requestId === sequence) { previous = prior; errors([{ message: error.message }]); status.textContent = 'Review failed. No new result is available.'; } }
  finally { setBusy(false); }
});
$('#revise').addEventListener('click', () => { captureActions(); show(1); status.textContent = 'Revise your plan and supporting information, then check inputs and reassess.'; });
function exportData() {
  captureActions();
  return { ...record, previousReview: previous, exportedAt: new Date().toISOString(), limitations: 'User-supplied evidence; no prediction or complete-plan certification. Your planning information is not updated automatically. Session-only; retain this file externally.' };
}
function readableRecord(data) {
  const doc = document.implementation.createHTMLDocument('Planning review record');
  const meta = doc.createElement('meta'); meta.charset = 'utf-8'; doc.head.append(meta);
  const style = doc.createElement('style');
  style.textContent = 'body{font:16px/1.5 system-ui,sans-serif;max-width:960px;margin:30px auto;padding:20px;color:#172d3a}article{border:1px solid #aaa;padding:18px;margin:18px 0;break-inside:avoid}dt{font-weight:bold}dd{margin:0 0 12px;white-space:pre-wrap;overflow-wrap:anywhere}h1,h2,h3{line-height:1.2}';
  doc.head.append(style);
  append(doc.body, 'h1', 'Project planning review');
  append(doc.body, 'p', data.limitations);
  append(doc.body, 'p', `Exported ${data.exportedAt}. ${data.inputsChanged ? 'Inputs changed after this assessment: previous results, not a current review.' : 'Snapshot of the submitted inputs and results.'}`);
  const addSnapshot = (value, heading) => {
    append(doc.body, 'h2', heading);
    append(doc.body, 'p', `Review ${value.reviewId} · assessed ${value.assessment.assessedAt}`);
    listObject(doc.body, value.context, contextLabels);
    append(doc.body, 'h3', 'Selected checks and exclusions');
    listObject(doc.body, value.applicability, { ...labels, state: 'Selection', reason: 'Reason for exclusion' });
    append(doc.body, 'h3', 'Supporting evidence'); listObject(doc.body, value.evidence, evidenceLabels);
    value.assessment.checks.forEach(check => {
      const card = append(doc.body, 'article');
      append(card, 'h3', `${labels[check.ruleId]}${check.subject ? ': ' + check.subject : ''} — ${check.status.replaceAll('_', ' ')}`);
      append(card, 'p', check.reason);
      listObject(card, check.measurements, { remainingEffortHours: 'Remaining effort (person-hours)', availableCapacityHours: 'Available capacity (person-hours)', shortfallHours: 'Shortfall (person-hours)', ratio: 'Effort / capacity' });
      append(card, 'p', `Evidence: ${check.evidenceReferences.join('; ') || 'Not supplied'}. Rule ${check.ruleId}, version ${check.ruleVersion}.`);
      if (check.recommendation) append(card, 'p', check.recommendation);
    });
    append(doc.body, 'h3', 'Follow-up actions (including retained actions from prior findings)');
    Object.values(value.actions).forEach(action => listObject(doc.body, action, { finding: 'Finding', response: 'Response', owner: 'Action owner', due: 'Due date', approval: 'Approval needed', sourceChange: 'Planning update', resolution: 'Resolution evidence', state: 'Progress' }));
  };
  addSnapshot(data, 'Current exported assessment');
  if (data.previousReview) addSnapshot(data.previousReview, 'Previous assessment snapshot');
  return doc;
}
function download(contents, type, extension) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a'); link.href = url;
  link.download = `planning-review-${record.reviewId}.${extension}`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Review record download requested. Keep the file with your planning information; the tool does not save a copy.';
}
$('#download').addEventListener('click', () => {
  if (record) download('<!doctype html>\n' + readableRecord(exportData()).documentElement.outerHTML, 'text/html', 'html');
});
$('#download-data').addEventListener('click', () => {
  if (record) download(JSON.stringify(exportData(), null, 2), 'application/json', 'json');
});
$('#print').addEventListener('click', () => {
  if (!record) return;
  const doc = readableRecord(exportData());
  $('#print-record').replaceChildren(...[...doc.body.childNodes].map(node => document.importNode(node, true)));
  window.print();
});
window.addEventListener('beforeunload', event => { if (revision || record) { event.preventDefault(); event.returnValue = ''; } });
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });
$('#example').addEventListener('click', () => {
  if (revision && !window.confirm('Replace entered inputs with a synthetic example? Download any current review first.')) return;
  form.reset(); ['dependencies', 'handoffs', 'skills'].forEach(group => $('#' + group).replaceChildren());
  const localTime = date => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const today = localTime(new Date()).slice(0, 10);
  const values = { projectName: 'Synthetic acceptance project', scope: 'Draft a research report; exclude publication', periodStart: today, periodEnd: localTime(new Date(Date.now() + 14 * 86400000)).slice(0, 10), asOf: today, planVersion: 'synthetic-v1', decision: 'Can we finish the research draft within two weeks?', evidenceVersion: 'synthetic-v1', assessedAt: localTime(new Date(Date.now() - 60000)), reviewDue: localTime(new Date(Date.now() + 86400000)), effort: 120, capacity: 80, assumptions: 'Qualified capacity after leave and other assignments; no duplicated tasks or people', reference: 'Authors confirmed estimates and available hours in a planning discussion' };
  Object.entries(values).forEach(([key, value]) => { $('#' + key).value = value; });
  addItem('handoffs', { id: 'Research notes to analyst', status: 'blocked', issue: 'Consent details are missing', owner: 'Research lead', reference: 'Analyst reviewed notes and reported missing consent details' });
  addItem('skills', { id: 'Interview analysis', coverage: 'gap', owner: 'Project lead', reference: 'Team discussion confirmed no available analyst' });
  for (const key of ['capacity', 'dependencies', 'handoffs', 'skills']) { $('#' + key + '-choice').value = 'include'; updateApplicability(key); }
  $('#alignmentConfirmed').checked = true; dirty(); clearErrors(); show(1);
  status.textContent = 'Synthetic example loaded. These are demonstration values, not your project data.';
});
