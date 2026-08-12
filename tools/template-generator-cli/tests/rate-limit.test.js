const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const express = require('express');
const { createRateLimiter } = require('../src/dashboard-server.js');

function makeRequest(app, method, pathname, headers = {}) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const req = http.request(
        {
          host: '127.0.0.1',
          port,
          path: pathname,
          method,
          headers,
        },
        (res) => {
          const chunks = [];
          res.on('data', (chunk) => chunks.push(chunk));
          res.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf8');
            server.close(() => resolve({ status: res.statusCode, headers: res.headers, body }));
          });
        }
      );

      req.on('error', (error) => {
        server.close(() => reject(error));
      });
      req.end();
    });
  });
}

test('dashboard GET / stays available below its threshold and then 429s', async () => {
  let now = 0;
  const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 1, maxEntries: 10, now: () => now });
  const app = express();
  app.get('/', limiter.middleware, (req, res) => {
    res.type('html').send('<!doctype html><title>Dashboard</title>');
  });

  const first = await makeRequest(app, 'GET', '/', { 'x-forwarded-for': '203.0.113.55' });
  assert.equal(first.status, 200);
  assert.match(first.headers['content-type'], /text\/html/);

  const second = await makeRequest(app, 'GET', '/', { 'x-forwarded-for': '203.0.113.55' });
  assert.equal(second.status, 429);
  assert.ok(second.headers['retry-after']);
  assert.match(String(second.headers['retry-after']), /^\d+$/);
});

test('dashboard limiter keeps separate client counters and expires stale states', () => {
  let now = 0;
  const limiter = createRateLimiter({
    windowMs: 1000,
    maxRequests: 2,
    maxEntries: 5,
    now: () => now,
  });

  const makeFakeReq = (address) => ({ socket: { remoteAddress: address }, ip: address });
  const makeRes = () => {
    const headers = {};
    return {
      headers,
      statusCode: 200,
      set(name, value) { headers[name] = String(value); },
      status(code) { this.statusCode = code; return this; },
      json(payload) { this.payload = payload; return this; },
    };
  };

  const resA = makeRes();
  limiter.middleware(makeFakeReq('127.0.0.1'), resA, () => {});
  limiter.middleware(makeFakeReq('127.0.0.1'), resA, () => {});
  const blocked = makeRes();
  limiter.middleware(makeFakeReq('127.0.0.1'), blocked, () => {});
  assert.equal(blocked.statusCode, 429);

  const allowedFromOtherClient = makeRes();
  limiter.middleware(makeFakeReq('127.0.0.2'), allowedFromOtherClient, () => {});
  assert.equal(allowedFromOtherClient.statusCode, 200);

  now = 2000;
  const expired = makeRes();
  limiter.middleware(makeFakeReq('127.0.0.1'), expired, () => {});
  assert.equal(expired.statusCode, 200);
});

test('dashboard root ignores spoofed forwarding headers when proxy trust is not configured', async () => {
  let now = 0;
  const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 1, maxEntries: 10, now: () => now });
  const app = express();
  app.get('/', limiter.middleware, (req, res) => {
    res.type('html').send('<!doctype html><title>Dashboard</title>');
  });

  const first = await makeRequest(app, 'GET', '/', { 'x-forwarded-for': '203.0.113.55' });
  assert.equal(first.status, 200);

  const second = await makeRequest(app, 'GET', '/', { 'x-forwarded-for': '203.0.113.55' });
  assert.equal(second.status, 429);
});
