// Simple retry with exponential backoff
export async function retry(fn, { retries = 3, baseMs = 200, factor = 2 } = {}) {
  let attempt = 0
  let lastError
  while (attempt < retries) {
    try {
      return await fn()
    } catch (e) {
      lastError = e
      const delay = baseMs * Math.pow(factor, attempt)
      await new Promise(r => setTimeout(r, delay))
      attempt++
    }
  }
  throw lastError
}

