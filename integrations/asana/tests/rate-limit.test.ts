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
  let now = 0;

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
      rateLimit: { windowMs: 1000, maxRequests: 2 },
      rateLimitClock: () => now,
      rateLimitMaxEntries: 4,
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

  test('separate clients have separate counters and stale entries expire', () => {
    const { server } = createServerWithLimit();
    const rateLimit = (server as any).webhookRateLimit.bind(server);

    const reqA = { socket: { remoteAddress: '127.0.0.1' }, ip: '127.0.0.1', headers: {} } as any;
    const reqB = { socket: { remoteAddress: '127.0.0.2' }, ip: '127.0.0.2', headers: {} } as any;
    const resA = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const resB = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const nextA = jest.fn();
    const nextB = jest.fn();

    rateLimit(reqA, resA, nextA);
    rateLimit(reqA, resA, nextA);
    rateLimit(reqB, resB, nextB);
    expect(nextB).toHaveBeenCalledTimes(1);

    now = 2000;
    const freshRes = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    rateLimit(reqA, freshRes, jest.fn());
    expect(freshRes.status).not.toHaveBeenCalledWith(429);
  });

  test('spoofed x-forwarded-for does not bypass the limit', () => {
    const { server } = createServerWithLimit();
    const rateLimit = (server as any).webhookRateLimit.bind(server);

    const req = {
      socket: { remoteAddress: '127.0.0.1' },
      ip: '127.0.0.1',
      headers: { 'x-forwarded-for': '203.0.113.44' },
    } as any;
    const res1 = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const res2 = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next1 = jest.fn();
    const next2 = jest.fn();

    rateLimit(req, res1, next1);
    rateLimit(req, res2, next2);
    expect(next2).toHaveBeenCalledTimes(1);
    expect(res2.status).not.toHaveBeenCalledWith(429);
  });

  test('health remains unprotected', async () => {
    const { server } = createServerWithLimit();
    const health = await makeRequest((server as any).app, 'GET', '/health');
    expect(health.status).toBe(200);
    expect(JSON.parse(health.body).status).toBe('healthy');
  });

  test('storage remains bounded', () => {
    const { server } = createServerWithLimit({ rateLimitMaxEntries: 2 });
    const rateLimit = (server as any).webhookRateLimit.bind(server);
    const res = { setHeader: jest.fn(), status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    rateLimit({ socket: { remoteAddress: '10.0.0.1' }, ip: '10.0.0.1', headers: {} }, res, jest.fn());
    rateLimit({ socket: { remoteAddress: '10.0.0.2' }, ip: '10.0.0.2', headers: {} }, res, jest.fn());
    rateLimit({ socket: { remoteAddress: '10.0.0.3' }, ip: '10.0.0.3', headers: {} }, res, jest.fn());
    expect((server as any).webhookRateLimitStore.size).toBeLessThanOrEqual(2);
  });
});
