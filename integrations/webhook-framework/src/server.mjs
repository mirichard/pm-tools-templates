import express from 'express'
import { fileURLToPath } from 'url'

function getClientKey(req, trustProxy) {
  if (trustProxy !== undefined) return req.ip || req.socket?.remoteAddress || 'unknown'
  return req.socket?.remoteAddress || req.ip || 'unknown'
}

export function createRateLimiter({ windowMs = 60000, maxRequests = 30, maxEntries = 10000, now = Date.now, trustProxy } = {}) {
  const rateLimitStore = new Map()
  return (req, res, next) => {
    const currentTime = now()
    for (const [key, entry] of rateLimitStore) {
      if (entry.resetAt <= currentTime) rateLimitStore.delete(key)
    }

    const clientKey = getClientKey(req, trustProxy)
    let entry = rateLimitStore.get(clientKey)
    if (!entry || entry.resetAt <= currentTime) {
      if (rateLimitStore.size >= Math.max(1, maxEntries) && !rateLimitStore.has(clientKey)) {
        rateLimitStore.delete(rateLimitStore.keys().next().value)
      }
      entry = { count: 0, resetAt: currentTime + windowMs }
      rateLimitStore.set(clientKey, entry)
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - currentTime) / 1000))
      res.set('Retry-After', String(retryAfter))
      return res.status(429).json({ error: 'Too many requests', retryAfter })
    }

    entry.count += 1
    next()
  }
}

import { logger } from './middleware/logger.mjs'
import { metrics } from './middleware/metrics.mjs'
import { handleJira } from './handlers/jira.mjs'
import { handleGitHub } from './handlers/github.mjs'
import { verifySignature } from './lib/signature.mjs'

export function createApp({ rateLimit, trustProxy } = {}) {
  const app = express()
  if (trustProxy !== undefined) app.set('trust proxy', trustProxy)
  app.use('/webhook/:provider', express.raw({ type: '*/*' }))
  app.use(express.json({ limit: '1mb' }))
  app.use('/webhook/:provider', logger, metrics)
  app.post('/webhook/:provider', createRateLimiter({ ...rateLimit, trustProxy }), (req, res) => {
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
  return app
}

const app = createApp()

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = process.env.PORT || 8787
  app.listen(port, () => {
    console.log(`Webhook framework listening on :${port}`)
  })
}

export default app

