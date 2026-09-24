'use strict';

const {types} = require('../.github/issue-types.json');
const allowed = Object.keys(types).map(type => `type:${type}`);
const marker = '<!-- issue-type-validation:v1 -->';
const flag = 'needs-type';

function classify(labels = []) {
  const names = labels.map(label => typeof label === 'string' ? label : label.name);
  const selected = names.filter(name => /^type:/i.test(name));
  return {valid: selected.length === 1 && allowed.includes(selected[0]), selected};
}

async function ensureLabels(github, repo) {
  const definitions = [...Object.entries(types).map(([type, description]) => ({
    name: `type:${type}`, color: '1d76db', description,
  })), {name: flag, color: 'd93f0b', description: 'Issue needs exactly one approved type label.'}];
  for (const definition of definitions) {
    try {
      await github.rest.issues.getLabel({...repo, name: definition.name});
    } catch (error) {
      if (error.status !== 404) throw error;
      try {
        await github.rest.issues.createLabel({...repo, ...definition});
      } catch (creationError) {
        if (creationError.status !== 422) throw creationError;
        // Another run may have created the same label; verify before continuing.
        await github.rest.issues.getLabel({...repo, name: definition.name});
      }
    }
  }
}

async function reconcile({github, repo, number, preview}) {
  // Read current labels instead of applying a queued event's stale snapshot.
  const {data: issue} = await github.rest.issues.get({...repo, issue_number: number});
  if (issue.pull_request || issue.state !== 'open') return {number, skipped: true};
  const result = classify(issue.labels);
  if (preview) return {number, ...result};
  const args = {...repo, issue_number: number};
  const flagged = issue.labels.some(label => (typeof label === 'string' ? label : label.name) === flag);
  if (!result.valid && !flagged) await github.rest.issues.addLabels({...args, labels: [flag]});
  if (result.valid && flagged) {
    try {
      await github.rest.issues.removeLabel({...args, name: flag});
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
  // Avoid scanning comments on clean issues during every daily sweep.
  if (result.valid && !flagged) return {number, ...result};
  const comments = await github.paginate(github.rest.issues.listComments, {...args, per_page: 100});
  const existing = comments.find(comment => comment.user?.login === 'github-actions[bot]' &&
    comment.body?.startsWith(marker));
  const body = result.valid
    ? `${marker}\nType classification resolved. Delivery readiness and parent linkage require separate review.`
    : `${marker}\nThis issue requires exactly one approved type label before delivery planning.\n\n` +
      `Choose one: ${allowed.map(label => '`' + label + '`').join(', ')}.\n\n` +
      'A maintainer must resolve missing, multiple or unrecognized types. Other labels may remain. ' +
      `See [issue management](https://github.com/${repo.owner}/${repo.repo}/blob/HEAD/docs/issues-management.md) for definitions. ` +
      'Classification does not assign priority, scheduling or a parent.';
  if (existing && existing.body !== body) {
    await github.rest.issues.updateComment({...repo, comment_id: existing.id, body});
  } else if (!existing && !result.valid) {
    await github.rest.issues.createComment({...args, body});
  }
  return {number, ...result};
}

async function run({github, context, core, preview = true, number, bootstrap = true}) {
  if (!preview && bootstrap) await ensureLabels(github, context.repo);
  const candidates = number ? [{number}] : context.eventName === 'issues'
    ? [context.payload.issue]
    : await github.paginate(github.rest.issues.listForRepo, {...context.repo, state: 'open', per_page: 100});
  const results = [];
  for (const issue of candidates) {
    if (issue.pull_request) continue;
    results.push(await reconcile({github, repo: context.repo, number: issue.number, preview}));
  }
  const invalid = results.filter(result => !result.skipped && !result.valid);
  core.summary.addHeading('Issue type validation');
  core.summary.addRaw(`${preview ? 'Preview: no changes.' : 'Labels reconciled.'} ${invalid.length} issue(s) need classification.\n`);
  for (const result of invalid) core.summary.addRaw(`- #${result.number}\n`);
  await core.summary.write();
  core.setOutput('invalid_count', invalid.length);
  return results;
}

async function targets({github, context}) {
  const issues = context.eventName === 'issues' ? [context.payload.issue] :
    await github.paginate(github.rest.issues.listForRepo, {...context.repo, state: 'open', per_page: 100});
  const numbers = issues.filter(issue => !issue.pull_request).map(issue => issue.number);
  if (numbers.length > 256) throw new Error('Issue sweep exceeds the matrix limit; batch targets before expanding coverage.');
  return numbers;
}

module.exports = {allowed, classify, ensureLabels, reconcile, run, targets};
