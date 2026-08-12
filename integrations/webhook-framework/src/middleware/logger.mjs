export function sanitizeLogValue(value) {
  return String(value ?? 'unknown').replace(/[\r\n\u2028\u2029]/g, ' ')
}

export function logger(req, res, next) {
  const start = Date.now()
  const provider = req.params?.provider
  const event = req.headers['x-github-event'] || req.headers['x-atlassian-webhook-event'] || 'unknown'
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`[webhook] provider=${sanitizeLogValue(provider)} event=${sanitizeLogValue(event)} ms=${ms}`)
  })
  next()
}
