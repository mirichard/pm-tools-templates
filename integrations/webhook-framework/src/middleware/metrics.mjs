export function metrics(req, res, next) {
  const start = process.hrtime.bigint()
  res.on('finish', () => {
    const end = process.hrtime.bigint()
    const ms = Number(end - start) / 1e6
    const provider = req.params?.provider || 'unknown'
    const event = req.headers['x-github-event'] || req.headers['x-atlassian-webhook-event'] || 'unknown'
    // Simple console metrics; replace with real metrics sink later
    console.log(JSON.stringify({ type: 'metric', name: 'webhook_request', provider, event, ms }))
  })
  next()
}

