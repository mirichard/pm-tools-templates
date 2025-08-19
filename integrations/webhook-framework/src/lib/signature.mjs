import crypto from 'crypto'

export function verifySignature(provider, secret, rawBody, signatureHeader) {
  if (!secret || !signatureHeader) return false
  // For demo purposes we use a simple HMAC; real providers may use different schemes
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  const expected = hmac.digest('hex')
  return String(signatureHeader).includes(expected)
}

