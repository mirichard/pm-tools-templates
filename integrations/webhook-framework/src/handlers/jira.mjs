// Jira webhook handler (stub)
export function handleJira(event, payload) {
  // event examples: issue_created, issue_updated
  return {
    handled: true,
    provider: 'jira',
    event,
    summary: payload?.issue?.key || 'n/a'
  }
}

