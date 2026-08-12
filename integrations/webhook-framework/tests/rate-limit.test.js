const crypto = require('crypto');
const http = require('http');

async function loadServerModule() {
  return import('../src/server.mjs');
}

describe('Webhook framework rate limiting', () => {
  let now = 0;

  function sign(payload, secret) {
    return `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
  }

  function makeRequest(app, method, pathname, body, headers = {}) {
    return new Promise((resolve, reject) => {
      const server = app.listen(0, '127.0.0.1', () => {
        const { port } = server.address();
        const req = http.request(
          {
            host: '127.0.0.1',
            port,
            path: pathname,
            method,
            headers: {
              'content-type': 'application/json',
              ...headers,
            },
          },
          (res) => {
            const chunks = [];
            res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            res.on('end', () => {
              const responseBody = Buffer.concat(chunks).toString('utf8');
              server.close(() => resolve({ status: res.statusCode, headers: res.headers, body: responseBody }));
            });
          }
        );

        req.on('error', (error) => {
          server.close(() => reject(error));
        });
        req.end(body);
      });
    });
  }

  test('valid signed requests work under the threshold and 429 after the threshold', async () => {
    const { createApp } = await loadServerModule();
    const secret = 'test-secret';
    process.env.WEBHOOK_SECRET = secret;
    const app = createApp({
      rateLimit: { windowMs: 1000, maxRequests: 2, maxEntries: 20, now: () => now },
    });

    const payload = JSON.stringify({ foo: 'bar' });
    const body = Buffer.from(payload);
    const signature = sign(body, secret);

    const first = await makeRequest(app, 'POST', '/webhook/github', body, { 'x-signature': signature });
    expect(first.status).toBe(202);

    const second = await makeRequest(app, 'POST', '/webhook/github', body, { 'x-signature': signature });
    expect(second.status).toBe(202);

    const third = await makeRequest(app, 'POST', '/webhook/github', body, { 'x-signature': signature });
    expect(third.status).toBe(429);
    expect(third.headers['retry-after']).toBeDefined();
    expect(String(third.headers['retry-after'])).toMatch(/^\d+$/);
  });

  test('spoofed X-Forwarded-For values do not bypass the limit', async () => {
    const { createApp } = await loadServerModule();
    const secret = 'test-secret';
    process.env.WEBHOOK_SECRET = secret;
    const app = createApp({
      rateLimit: { windowMs: 1000, maxRequests: 1, maxEntries: 10, now: () => now },
    });
    const payload = JSON.stringify({ foo: 'bar' });
    const signature = sign(Buffer.from(payload), secret);

    const first = await makeRequest(app, 'POST', '/webhook/github', payload, {
      'x-signature': signature,
      'x-forwarded-for': '203.0.113.9',
    });
    expect(first.status).toBe(202);

    const second = await makeRequest(app, 'POST', '/webhook/github', payload, {
      'x-signature': signature,
      'x-forwarded-for': '203.0.113.9',
    });
    expect(second.status).toBe(429);
  });

  test('stale entries expire and the store stays bounded', async () => {
    const { createRateLimiter } = await loadServerModule();
    const limiter = createRateLimiter({
      windowMs: 1000,
      maxRequests: 2,
      maxEntries: 2,
      now: () => now,
    });

    const first = { socket: { remoteAddress: '127.0.0.1' }, ip: '127.0.0.1' };
    const second = { socket: { remoteAddress: '127.0.0.2' }, ip: '127.0.0.2' };
    const third = { socket: { remoteAddress: '127.0.0.3' }, ip: '127.0.0.3' };

    const res = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
    limiter(first, res, jest.fn());
    limiter(second, res, jest.fn());
    limiter(third, res, jest.fn());
    expect(res.status).not.toHaveBeenCalledWith(429);

    now = 2000;
    const expiredRes = { set: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() };
    limiter(first, expiredRes, jest.fn());
    expect(expiredRes.status).not.toHaveBeenCalledWith(429);
  });
});
