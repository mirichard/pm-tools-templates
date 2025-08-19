// GitHub webhook handler (stub)
export function handleGitHub(event, payload) {
  // event examples: push, issues, pull_request
  return {
    handled: true,
    provider: 'github',
    event,
    summary: payload?.repository?.full_name || 'n/a'
  }
}

