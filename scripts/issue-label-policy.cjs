'use strict';

// Types come from maintainer/form classification; descriptions are not evidence
// that an issue is a bug, documentation change, or template contribution.
function topicLabels(issue) {
  const names = (issue.labels || []).map(label => typeof label === 'string' ? label : label.name);
  const types = names.filter(name => name.startsWith('type:'));
  const title = issue.title || '';
  const labels = [];
  if (types.length === 1 && types[0] === 'type:bug') labels.push('bug');
  if (/^(?:Task:\s*)?(?:\[docs?\]|docs?:|documentation:)/i.test(title)) labels.push('documentation');
  if (/^(?:\[template (?:request|improvement)\]|template (?:request|improvement):)/i.test(title)) {
    labels.push('template-related');
  }
  if (/^(?:\[(?:feature|enhancement)(?: request)?\]|(?:feature request|enhancement):)/i.test(title)) {
    labels.push('enhancement');
  }
  return labels.filter(label => !names.includes(label));
}

async function labelTopics({github, repo, number}) {
  const {data: issue} = await github.rest.issues.get({...repo, issue_number: number});
  if (issue.state !== 'open' || issue.pull_request) return [];
  const labels = topicLabels(issue);
  if (labels.length) await github.rest.issues.addLabels({...repo, issue_number: number, labels});
  return labels;
}

async function openChildCount(github, repo, number) {
  const children = await github.paginate('GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues', {
    ...repo, issue_number: number, per_page: 100,
  });
  // Closed children and textual references do not contribute to remaining scope.
  return children.filter(child => child.state === 'open').length;
}

function sizeLabel(count) {
  if (!Number.isInteger(count) || count < 0) throw new Error('Invalid open child count');
  return count > 20 ? 'epic-oversized' : count >= 15 ? 'epic-large' : count >= 8 ? 'epic-medium' : 'epic-small';
}

module.exports = {topicLabels, labelTopics, openChildCount, sizeLabel};
