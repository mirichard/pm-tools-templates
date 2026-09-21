import { describe, test, expect, vi, beforeEach } from 'vitest';
import { deployAsanaProject } from './index.js';
import { getMe, createProject, createTask } from './api.js';
import type { AsanaTemplate } from './types.js';

vi.mock('./api.js', () => ({
  getMe: vi.fn(),
  createProject: vi.fn(),
  createTask: vi.fn(),
}));

const mockGetMe = vi.mocked(getMe);
const mockCreateProject = vi.mocked(createProject);
const mockCreateTask = vi.mocked(createTask);

beforeEach(() => {
  mockGetMe.mockReset();
  mockCreateProject.mockReset();
  mockCreateTask.mockReset();
});

describe('deployAsanaProject', () => {
  const template: AsanaTemplate = {
    name: 'PM Tools Demo',
    notes: 'created by tests',
    tasks: [{ name: 'Kickoff' }, { name: 'Define Scope', notes: 'scope notes' }],
  };

  test('uses the given workspace directly, without calling getMe', async () => {
    mockCreateProject.mockResolvedValue({ data: { gid: 'proj-1' } });
    mockCreateTask.mockResolvedValue({ data: { gid: 'task-1' } });

    const result = await deployAsanaProject(template, { token: 'tok', workspace: 'ws-explicit' });

    expect(mockGetMe).not.toHaveBeenCalled();
    expect(mockCreateProject).toHaveBeenCalledWith('tok', 'ws-explicit', {
      name: 'PM Tools Demo',
      notes: 'created by tests',
    });
    expect(result).toEqual({ data: { gid: 'proj-1' } });
  });

  test('resolves the workspace from getMe when none is given', async () => {
    mockGetMe.mockResolvedValue({ data: { workspaces: [{ gid: 'ws-from-me' }] } });
    mockCreateProject.mockResolvedValue({ data: { gid: 'proj-1' } });
    mockCreateTask.mockResolvedValue({ data: { gid: 'task-1' } });

    await deployAsanaProject(template, { token: 'tok' });

    expect(mockGetMe).toHaveBeenCalledWith('tok');
    expect(mockCreateProject).toHaveBeenCalledWith('tok', 'ws-from-me', expect.any(Object));
  });

  test('throws when no workspace is given and getMe has no workspaces', async () => {
    mockGetMe.mockResolvedValue({ data: { workspaces: [] } });

    await expect(deployAsanaProject(template, { token: 'tok' })).rejects.toThrow(
      'No workspace available'
    );
    expect(mockCreateProject).not.toHaveBeenCalled();
  });

  test('creates one task per template task, referencing the new project gid', async () => {
    mockCreateProject.mockResolvedValue({ data: { gid: 'proj-1' } });
    mockCreateTask.mockResolvedValue({ data: { gid: 'task-1' } });

    await deployAsanaProject(template, { token: 'tok', workspace: 'ws-1' });

    expect(mockCreateTask).toHaveBeenCalledTimes(2);
    expect(mockCreateTask).toHaveBeenNthCalledWith(1, 'tok', {
      name: 'Kickoff',
      notes: undefined,
      projects: ['proj-1'],
    });
    expect(mockCreateTask).toHaveBeenNthCalledWith(2, 'tok', {
      name: 'Define Scope',
      notes: 'scope notes',
      projects: ['proj-1'],
    });
  });

  test('creates the project without any task calls when the template has no tasks', async () => {
    mockCreateProject.mockResolvedValue({ data: { gid: 'proj-1' } });

    await deployAsanaProject({ name: 'Empty Template' }, { token: 'tok', workspace: 'ws-1' });

    expect(mockCreateTask).not.toHaveBeenCalled();
  });
});
