import express from 'express'
import crypto from 'crypto'

const app = express()
app.use(express.json({ limit: '1mb' }))

import { logger } from './middleware/logger.mjs'
import { metrics } from './middleware/metrics.mjs'
app.use('/webhook/:provider', logger, metrics)

// moved to lib/signature.mjs for reuse and testing

import { handleJira } from './handlers/jira.mjs'
import { handleGitHub } from './handlers/github.mjs'
import { verifySignature } from './lib/signature.mjs'

app.post('/webhook/:provider', express.raw({ type: '*/*' }), (req, res) => {
  const provider = req.params.provider
  const secret = process.env.WEBHOOK_SECRET || ''
  const sig = req.headers['x-signature'] || req.headers['x-hub-signature-256']
  const raw = req.body
  const ok = verifySignature(provider, secret, raw, String(sig || ''))
  if (!ok) return res.status(401).json({ error: 'invalid signature' })
  let result
  try {
    const event = req.headers['x-github-event'] || req.headers['x-atlassian-webhook-event'] || 'unknown'
    const payload = JSON.parse(raw.toString('utf8') || '{}')
    if (provider === 'jira') result = handleJira(String(event), payload)
    else if (provider === 'github') result = handleGitHub(String(event), payload)
    else result = { handled: false, provider, event }
  } catch (e) {
    return res.status(400).json({ error: 'invalid payload', details: e?.message })
  }
  return res.status(202).json({ accepted: true, ...result })
})

const port = process.env.PORT || 8787
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Webhook framework listening on :${port}`)
  })
}

export default app

