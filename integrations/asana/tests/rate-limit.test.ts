import crypto from 'crypto';
import http from 'http';
import { AsanaWebhookServer } from '../src/webhook-server';

type FakeSyncEngine = {
  handleAsanaWebhook: jest.Mock;
  shutdown: jest.Mock;
};

function buildWebhookPayload() {
  return {
    gid: 'evt_123',
    resource: {
      gid: 'project_123',
      resource_type: 'project',
      resource_subtype: 'default_task',
    },
    user: {
      gid: 'user_123',
      name: 'Test User',
    },
    created_at: '2025-01-01T00:00:00.000Z',
    type: 'task',
    action: 'added',
    parent: {
      gid: 'project_123',
      resource_type: 'project',
    },
  };
}

function signPayload(body: Buffer, secret: string): string {
  return `sha256=${crypto.createHmac('sha256', secret).update(body).digest('hex')}`;
}

function makeRequest(
  app: any,
  method: string,
  pathname: string,
  body?: Buffer | string,
  extraHeaders: Record<string, string> = {}
): Promise<{ status: number | undefined; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      const req = http.request(
        {
          host: '127.0.0.1',
          port,
          path: pathname,
          method,
          headers: {
            'content-type': 'application/json',
            ...extraHeaders,
          },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          res.on('end', () => {
            const bodyText = Buffer.concat(chunks).toString('utf8');
            server.close(() => resolve({ status: res.statusCode, headers: res.headers, body: bodyText }));
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

describe('Asana webhook rate limiting', () => {
  const secret = 'asana-secret';

  function createServerWithLimit(overrides: Record<string, any> = {}) {
    const syncEngine: FakeSyncEngine = {
      handleAsanaWebhook: jest.fn().mockResolvedValue(undefined),
      shutdown: jest.fn().mockResolvedValue(undefined),
    };

    const server = new AsanaWebhookServer({
      port: 4567,
      webhookSecret: secret,
      syncEngine: syncEngine as any,
      connector: {} as any,
      rateLimit: { windowMs: 60000, maxRequests: 2 },
      ...overrides,
    });

    return { server, syncEngine };
  }

  test('valid webhook requests below the threshold stay accepted and 429 once exceeded', async () => {
    const { server } = createServerWithLimit();
    const payload = buildWebhookPayload();
    const body = Buffer.from(JSON.stringify(payload));
    const signature = signPayload(body, secret);

    const first = await makeRequest((server as any).app, 'POST', '/webhooks/asana', body, {
      'x-hook-signature': signature,
    });
    expect(first.status).toBe(200);

    const second = await makeRequest((server as any).app, 'POST', '/webhooks/asana', body, {
      'x-hook-signature': signature,
    });
    expect(second.status).toBe(200);

    const third = await makeRequest((server as any).app, 'POST', '/webhooks/asana', body, {
      'x-hook-signature': signature,
    });
    expect(third.status).toBe(429);
    expect(third.headers['retry-after']).toBeDefined();
    expect(String(third.headers['retry-after'])).toMatch(/^\d+$/);
  });

  test('explicit proxy trust gives separate clients separate counters', async () => {
    const { server } = createServerWithLimit({
      trustProxy: 1,
      rateLimit: { windowMs: 60000, maxRequests: 1 },
    });
    const body = Buffer.from(JSON.stringify(buildWebhookPayload()));
    const signature = signPayload(body, secret);

    const first = await makeRequest((server as any).app, 'POST', '/webhooks/asana', body, {
      'x-hook-signature': signature,
      'x-forwarded-for': '203.0.113.1',
    });
    const otherClient = await makeRequest((server as any).app, 'POST', '/webhooks/asana', body, {
      'x-hook-signature': signature,
      'x-forwarded-for': '203.0.113.2',
    });
    expect(first.status).toBe(200);
    expect(otherClient.status).toBe(200);
  });

  test('spoofed x-forwarded-for does not bypass the production limit', async () => {
    const { server } = createServerWithLimit({
      rateLimit: { windowMs: 60000, maxRequests: 1 },
    });
    const body = Buffer.from(JSON.stringify(buildWebhookPayload()));
    const signature = signPayload(body, secret);

    const first = await makeRequest((server as any).app, 'POST', '/webhooks/asana', body, {
      'x-hook-signature': signature,
      'x-forwarded-for': '203.0.113.1',
    });
    const blocked = await makeRequest((server as any).app, 'POST', '/webhooks/asana', body, {
      'x-hook-signature': signature,
      'x-forwarded-for': '203.0.113.2',
    });
    expect(first.status).toBe(200);
    expect(blocked.status).toBe(429);
  });

  test('health remains unprotected', async () => {
    const { server } = createServerWithLimit();
    const health = await makeRequest((server as any).app, 'GET', '/health');
    expect(health.status).toBe(200);
    expect(JSON.parse(health.body).status).toBe('healthy');
  });

  test('raw-body signature verification remains active', async () => {
    const { server } = createServerWithLimit();
    const body = Buffer.from(JSON.stringify(buildWebhookPayload()));
    const response = await makeRequest((server as any).app, 'POST', '/webhooks/asana', body, {
      'x-hook-signature': 'invalid',
    });
    expect(response.status).toBe(401);
  });
});
