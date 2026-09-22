import { createServer, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { createAsanaClient } from '../src/asana-client';

describe('installed Asana SDK transport', () => {
  let server: Server;
  let client: ReturnType<typeof createAsanaClient>;
  let status: number;
  let responseData: unknown;
  let requests: {
    method: string | undefined;
    url: string | undefined;
    body: any;
    authorization: string | undefined;
  }[];

  beforeEach(async () => {
    status = 200;
    responseData = { gid: '123', name: 'Fixture' };
    requests = [];
    server = createServer(async (request, response) => {
      let body = '';
      for await (const chunk of request) body += chunk;
      requests.push({
        method: request.method,
        url: request.url,
        body: body ? JSON.parse(body) : null,
        authorization: request.headers.authorization,
      });
      response.writeHead(status, { 'Content-Type': 'application/json', 'Retry-After': '0' });
      response.end(
        JSON.stringify(
          status === 200 ? { data: responseData } : { errors: [{ message: 'Fixture error' }] }
        )
      );
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    client = createAsanaClient({
      accessToken: 'fixture-token',
      rateLimitRetries: 1,
      requestTimeout: 1000,
    });
    client.apiClient.basePath = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve()))
    );
  });

  it('constructs a real SDK client and authenticates workspace requests', async () => {
    expect(client.apiClient.timeout).toBe(1000);
    expect(await client.workspaces.getWorkspace('123')).toMatchObject({
      gid: '123',
      name: 'Fixture',
    });
    expect(requests[0]).toMatchObject({
      method: 'GET',
      url: '/workspaces/123',
      authorization: 'Bearer fixture-token',
    });
  });

  it('preserves list envelopes and query options', async () => {
    responseData = [{ gid: '123', name: 'Fixture' }];
    expect((await client.workspaces.getWorkspaces()).data).toHaveLength(1);
    expect((await client.customFields.getCustomFieldsForWorkspace('123')).data).toHaveLength(1);
    expect(
      (await client.tasks.getTasksForProject('123', { opt_fields: 'name,completed' })).data
    ).toHaveLength(1);
    expect(requests[2]?.url).toContain('/projects/123/tasks?opt_fields=name%2Ccompleted');
  });

  it('uses v2 body envelopes and argument order for mutations', async () => {
    const data = { name: 'Fixture' };
    expect(await client.projects.createProject(data)).toMatchObject({ gid: '123' });
    expect(await client.tasks.createTask(data)).toMatchObject({ gid: '123' });
    expect(await client.tasks.updateTask('123', data)).toMatchObject({ gid: '123' });
    expect(await client.customFields.createCustomField(data)).toMatchObject({ gid: '123' });
    await client.projects.addCustomFieldSettingForProject('123', { custom_field: '456' });
    expect(requests.map((r) => [r.method, r.url, r.body])).toEqual([
      ['POST', '/projects', { data }],
      ['POST', '/tasks', { data }],
      ['PUT', '/tasks/123', { data }],
      ['POST', '/custom_fields', { data }],
      ['POST', '/projects/123/addCustomFieldSetting', { data: { custom_field: '456' } }],
    ]);
    expect(await client.customFields.getCustomField('123')).toMatchObject({ gid: '123' });
  });

  it('propagates authentication errors without retrying', async () => {
    status = 401;
    await expect(client.workspaces.getWorkspace('123')).rejects.toMatchObject({ status: 401 });
    expect(requests).toHaveLength(1);
  });

  it('limits rate-limit retries and propagates exhaustion', async () => {
    status = 429;
    await expect(client.workspaces.getWorkspace('123')).rejects.toMatchObject({ status: 429 });
    expect(requests).toHaveLength(2);
  });

  it('allows zero retries', async () => {
    const noRetry = createAsanaClient({ accessToken: 'fixture-token', rateLimitRetries: 0 });
    noRetry.apiClient.basePath = client.apiClient.basePath;
    status = 429;
    await expect(noRetry.workspaces.getWorkspace('123')).rejects.toMatchObject({ status: 429 });
    expect(requests).toHaveLength(1);
  });
});
