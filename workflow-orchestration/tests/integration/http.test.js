import http from 'node:http';
import { once } from 'node:events';
import request from 'supertest';
import { jest } from '@jest/globals';
import { createWorkflowEngine, HttpRequestAction } from '../../src/index.js';

let server, url, engine;
beforeAll(async () => {
  server = http.createServer(async (req, res) => {
    if (req.url === '/slow') return;
    if (req.url === '/error') { res.writeHead(503); res.end('unavailable'); return; }
    let body = '';
    for await (const chunk of req) body += chunk;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ method: req.method, body: body ? JSON.parse(body) : null }));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  url = `http://127.0.0.1:${server.address().port}`;
});
beforeEach(async () => {
  for (const method of ['log', 'warn', 'error']) jest.spyOn(console, method).mockImplementation(() => {});
  engine = await createWorkflowEngine();
});
afterEach(async () => { await engine.shutdown(); jest.restoreAllMocks(); });
afterAll(async () => {
  server.closeAllConnections();
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test('executes an actual HTTP workflow and serializes its request body', async () => {
  await request(server).get('/').expect(200).expect({ method: 'GET', body: null });
  const result = await engine.executeWorkflow({ id: 'http', name: 'HTTP', version: '1.0.0', steps: [
    { name: 'post', type: 'http-request', parameters: { url, method: 'POST', body: { message: 'hello' } } },
  ] });
  expect(result.status).toBe('completed');
  expect(result.result[0]).toMatchObject({ status: 200, data: { method: 'POST', body: { message: 'hello' } } });
});
test('propagates HTTP errors and records failed workflow status', async () => {
  await expect(engine.executeWorkflow({ id: 'error', name: 'Error', version: '1.0.0', steps: [
    { name: 'get', type: 'http-request', parameters: { url: `${url}/error` } },
  ] })).rejects.toThrow('503');
  expect(engine.activeWorkflows.size).toBe(0);
  expect([...engine.executionHistory.values()][0].status).toBe('failed');
});
test('aborts an HTTP request that exceeds its timeout', async () => {
  await expect(new HttpRequestAction().execute({ url: `${url}/slow`, timeout: 25 })).rejects.toThrow(/abort/i);
});
