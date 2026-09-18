/*
 * Simple exponential backoff with jitter for API rate limiting and transient errors.
 */
export type RetryOptions = {
  retries?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
  onRetry?: (attempt: number, error: unknown, delayMs: number) => void;
  shouldRetry?: (error: unknown) => boolean;
};

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function withRetry<T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> {
  const {
    retries = 5,
    minDelayMs = 200,
    maxDelayMs = 8000,
    jitter = true,
    onRetry,
    shouldRetry,
  } = opts;

  let attempt = 0;
  for (;;) {
    try {
      return await fn();
    } catch (err) {
      const canRetry = attempt < retries && (shouldRetry ? shouldRetry(err) : true);
      if (!canRetry) throw err;
      const baseDelay = Math.min(maxDelayMs, minDelayMs * Math.pow(2, attempt));
      const delay = jitter ? Math.floor(baseDelay * (0.5 + Math.random())) : baseDelay;
      onRetry?.(attempt + 1, err, delay);
      await sleep(delay);
      attempt++;
    }
  }
}

export function isRateLimitError(err: unknown): boolean {
  // Basic detectors for common SDKs/HTTP clients
  const anyErr = err as any;
  const status = anyErr?.status || anyErr?.statusCode || anyErr?.response?.status;
  if (status === 429) return true;
  // Retry for some transient errors
  if ([502, 503, 504].includes(status)) return true;
  // Network-level errors from libraries like axios/fetch
  const code = anyErr?.code || anyErr?.cause?.code;
  if (typeof code === 'string' && ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'].includes(code)) return true;
  return false;
}
