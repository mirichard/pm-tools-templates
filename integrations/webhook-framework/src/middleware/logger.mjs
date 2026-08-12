export function logger(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`[webhook] request completed in ${ms}ms`)
  })
  next()
}
