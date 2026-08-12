const crypto = require('crypto');
const http = require('http');

async function loadServerModule() {
  return import('../src/server.mjs');
}

function sign(payload, secret) {
  return `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
}

function makeRequest(app, pathname, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const req = http.request({
        host: '127.0.0.1', port, path: pathname, method: 'POST',
        headers: { 'content-type': 'application/json', ...headers },
      }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        res.on('end', () => server.close(() => resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        })));
      });
      req.on('error', (error) => server.close(() => reject(error)));
      req.end(body);
    });
  });
}

describe('Webhook framework production route rate limiting', () => {
  const secret = 'test-secret';
  const payload = Buffer.from(JSON.stringify({ foo: 'bar' }));

  beforeEach(() => { process.env.WEBHOOK_SECRET = secret; });

  test('signed requests pass below the limit and then return 429 with Retry-After', async () => {
    const { createApp } = await loadServerModule();
    const app = createApp({ rateLimit: { windowMs: 60000, maxRequests: 2 } });
    const headers = { 'x-signature': sign(payload, secret) };

    expect((await makeRequest(app, '/webhook/github', payload, headers)).status).toBe(202);
    expect((await makeRequest(app, '/webhook/github', payload, headers)).status).toBe(202);
    const blocked = await makeRequest(app, '/webhook/github', payload, headers);
    expect(blocked.status).toBe(429);
    expect(String(blocked.headers['retry-after'])).toMatch(/^\d+$/);
  });

  test('raw-body signature verification still rejects invalid signatures', async () => {
    const { createApp } = await loadServerModule();
    const app = createApp({ rateLimit: { windowMs: 60000, maxRequests: 2 } });
    const response = await makeRequest(app, '/webhook/github', payload, { 'x-signature': 'invalid' });
    expect(response.status).toBe(401);
  });

  test('explicit proxy trust gives separate clients separate counters', async () => {
    const { createApp } = await loadServerModule();
    const app = createApp({ trustProxy: 1, rateLimit: { windowMs: 60000, maxRequests: 1 } });
    const signature = sign(payload, secret);
    const first = await makeRequest(app, '/webhook/github', payload, {
      'x-signature': signature, 'x-forwarded-for': '203.0.113.1',
    });
    const otherClient = await makeRequest(app, '/webhook/github', payload, {
      'x-signature': signature, 'x-forwarded-for': '203.0.113.2',
    });
    expect(first.status).toBe(202);
    expect(otherClient.status).toBe(202);
  });

  test('forwarding headers do not bypass the limit without proxy trust', async () => {
    const { createApp } = await loadServerModule();
    const app = createApp({ rateLimit: { windowMs: 60000, maxRequests: 1 } });
    const signature = sign(payload, secret);
    expect((await makeRequest(app, '/webhook/github', payload, {
      'x-signature': signature, 'x-forwarded-for': '203.0.113.1',
    })).status).toBe(202);
    expect((await makeRequest(app, '/webhook/github', payload, {
      'x-signature': signature, 'x-forwarded-for': '203.0.113.2',
    })).status).toBe(429);
  });
});
