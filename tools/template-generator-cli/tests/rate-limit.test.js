const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { DashboardServer } = require('../src/dashboard-server.js');

function makeRequest(app, method, pathname, headers = {}) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const req = http.request({ host: '127.0.0.1', port, path: pathname, method, headers }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => server.close(() => resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks).toString('utf8'),
        })));
      });
      req.on('error', (error) => server.close(() => reject(error)));
      req.end();
    });
  });
}

test('production dashboard route allows the limit and then returns 429 with Retry-After', async () => {
  const dashboard = new DashboardServer({ readRateLimit: { windowMs: 60000, maxRequests: 1 } });
  dashboard.app.response.sendFile = function sendDashboardForTest() {
    return this.type('html').send('<!doctype html><title>Dashboard</title>');
  };
  const first = await makeRequest(dashboard.app, 'GET', '/');
  assert.equal(first.status, 200);

  const second = await makeRequest(dashboard.app, 'GET', '/');
  assert.equal(second.status, 429);
  assert.match(String(second.headers['retry-after']), /^\d+$/);
});

test('production dashboard limiter isolates clients only when proxy trust is explicit', async () => {
  const previous = process.env.DASHBOARD_TRUST_PROXY;
  process.env.DASHBOARD_TRUST_PROXY = 'true';
  try {
    const dashboard = new DashboardServer({ readRateLimit: { windowMs: 60000, maxRequests: 1 } });
    const first = await makeRequest(dashboard.app, 'GET', '/api/dashboard/overview', {
      'x-forwarded-for': '203.0.113.1',
    });
    const otherClient = await makeRequest(dashboard.app, 'GET', '/api/dashboard/overview', {
      'x-forwarded-for': '203.0.113.2',
    });
    assert.equal(first.status, 200);
    assert.equal(otherClient.status, 200);
  } finally {
    if (previous === undefined) delete process.env.DASHBOARD_TRUST_PROXY;
    else process.env.DASHBOARD_TRUST_PROXY = previous;
  }
});

test('dashboard health route remains exempt from the production limiter', async () => {
  const dashboard = new DashboardServer({ readRateLimit: { windowMs: 60000, maxRequests: 1 } });
  await makeRequest(dashboard.app, 'GET', '/api/dashboard/overview');
  const blocked = await makeRequest(dashboard.app, 'GET', '/api/dashboard/overview');
  assert.equal(blocked.status, 429);

  const health = await makeRequest(dashboard.app, 'GET', '/api/dashboard/health');
  assert.equal(health.status, 200);
  assert.equal(JSON.parse(health.body).status, 'healthy');
});
