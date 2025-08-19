function toBuf(s){ return Buffer.from(s, 'utf8') }

test('verifySignature returns false without secret or header', async () => {
  const { verifySignature } = await import('../src/lib/signature.mjs')
  expect(verifySignature('github', '', toBuf('x'), '')).toBe(false)
})

test('verifySignature matches simple HMAC in header', async () => {
  const { verifySignature } = await import('../src/lib/signature.mjs')
  const secret = 'test-secret'
  const raw = toBuf('payload')
  // Expected simple sha256 hex
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(raw)
  const expected = hmac.digest('hex')
  const header = `sha256=${expected}`
  expect(verifySignature('github', secret, raw, header)).toBe(true)
})

