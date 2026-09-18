// GitHub handler unit test (isolated)
function toBuf(s){ return Buffer.from(s, 'utf8') }

test('handleGitHub returns summary with repository full_name', async () => {
  const { handleGitHub } = await import('../src/handlers/github.mjs')
  const event = 'push'
  const payload = { repository: { full_name: 'mirichard/pm-tools-templates' } }
  const res = handleGitHub(event, payload)
  expect(res).toEqual({ handled: true, provider: 'github', event, summary: 'mirichard/pm-tools-templates' })
})

