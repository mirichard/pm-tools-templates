// Jira handler unit test (isolated)

test('handleJira returns summary with issue key', async () => {
  const { handleJira } = await import('../src/handlers/jira.mjs')
  const event = 'issue_updated'
  const payload = { issue: { key: 'JIRA-123', fields: {} } }
  const res = handleJira(event, payload)
  expect(res).toEqual({ handled: true, provider: 'jira', event, summary: 'JIRA-123' })
})

