import express from 'express'
import crypto from 'crypto'

const app = express()
app.use(express.json({ limit: '1mb' }))

function verifySignature(provider, secret, rawBody, signatureHeader) {
  if (!secret || !signatureHeader) return false
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  const expected = hmac.digest('hex')
  return signatureHeader.includes(expected)
}

app.post('/webhook/:provider', express.raw({ type: '*/*' }), (req, res) => {
  const provider = req.params.provider
  const secret = process.env.WEBHOOK_SECRET || ''
  const sig = req.headers['x-signature'] || req.headers['x-hub-signature-256']
  const raw = req.body
  const ok = verifySignature(provider, secret, raw, String(sig || ''))
  if (!ok) return res.status(401).json({ error: 'invalid signature' })
  // TODO: route to handlers by provider/event type
  return res.status(202).json({ accepted: true, provider })
})

const port = process.env.PORT || 8787
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Webhook framework listening on :${port}`)
  })
}

export default app

