import { describe, test, expect, vi, beforeEach } from 'vitest';
import fetch from 'node-fetch';
import { getMe, createProject, createTask } from './api.js';

vi.mock('node-fetch', () => ({ default: vi.fn() }));

const mockFetch = vi.mocked(fetch);

beforeEach(() => {
  mockFetch.mockReset();
});

function okResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as any;
}

function errorResponse(status: number, statusText: string, body: string) {
  return {
    ok: false,
    status,
    statusText,
    text: async () => body,
  } as any;
}

describe('getMe', () => {
  test('returns the parsed response on success', async () => {
    mockFetch.mockResolvedValue(okResponse({ data: { gid: 'me-1' } }));
    const result = await getMe('tok');
    expect(result).toEqual({ data: { gid: 'me-1' } });
    expect(mockFetch).toHaveBeenCalledWith(
      'https://app.asana.com/api/1.0/users/me',
      expect.objectContaining({ headers: { Authorization: 'Bearer tok' } })
    );
  });

  test('throws with the status code when the request fails', async () => {
    mockFetch.mockResolvedValue(errorResponse(401, 'Unauthorized', ''));
    await expect(getMe('bad-tok')).rejects.toThrow('whoami failed: 401');
  });
});

describe('createProject', () => {
  test('merges workspace into the request body and returns the created project', async () => {
    mockFetch.mockResolvedValue(okResponse({ data: { gid: 'proj-1' } }));
    const result = await createProject('tok', 'ws-1', { name: 'My Project' });

    expect(result).toEqual({ data: { gid: 'proj-1' } });
    const [, init] = mockFetch.mock.calls[0];
    const body = JSON.parse((init as any).body);
    expect(body).toEqual({ data: { name: 'My Project', workspace: 'ws-1' } });
  });

  test('throws with status, statusText, and a truncated error body on failure', async () => {
    mockFetch.mockResolvedValue(errorResponse(422, 'Unprocessable Entity', 'x'.repeat(300)));
    await expect(createProject('tok', 'ws-1', { name: 'x' })).rejects.toThrow(
      /create project failed: 422 Unprocessable Entity x{200}$/
    );
  });
});

describe('createTask', () => {
  test('sends the task body and returns the created task', async () => {
    mockFetch.mockResolvedValue(okResponse({ data: { gid: 'task-1' } }));
    const result = await createTask('tok', { name: 'Kickoff', projects: ['proj-1'] });

    expect(result).toEqual({ data: { gid: 'task-1' } });
    const [, init] = mockFetch.mock.calls[0];
    expect(JSON.parse((init as any).body)).toEqual({
      data: { name: 'Kickoff', projects: ['proj-1'] },
    });
  });

  test('throws on a non-ok response', async () => {
    mockFetch.mockResolvedValue(errorResponse(500, 'Internal Server Error', 'boom'));
    await expect(createTask('tok', { name: 'x' })).rejects.toThrow(
      'create task failed: 500 Internal Server Error boom'
    );
  });
});
