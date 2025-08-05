import { Client } from 'asana';

// Mock the Asana client
jest.mock('asana');

describe('Basic Asana Integration', () => {
  let mockClient: jest.Mocked<any>;

  beforeEach(() => {
    // Create mock client with basic methods
    mockClient = {
      useAccessToken: jest.fn().mockReturnThis(),
      dispatcher: {
        options: {}
      },
      workspaces: {
        findById: jest.fn()
      },
      projects: {
        create: jest.fn()
      },
      tasks: {
        create: jest.fn()
      }
    };

    // Mock the Client.create method
    (Client.create as jest.Mock).mockReturnValue(mockClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create Asana client with access token', () => {
    const client = Client.create().useAccessToken('test-token');
    
    expect(Client.create).toHaveBeenCalled();
    expect(mockClient.useAccessToken).toHaveBeenCalledWith('test-token');
    expect(client).toBe(mockClient);
  });

  it('should mock workspace operations', async () => {
    const client = Client.create().useAccessToken('test-token');
    const mockWorkspace = { gid: 'workspace-123', name: 'Test Workspace' };
    
    mockClient.workspaces.findById.mockResolvedValue(mockWorkspace);
    
    const workspace = await client.workspaces.findById('workspace-123');
    
    expect(workspace).toEqual(mockWorkspace);
    expect(mockClient.workspaces.findById).toHaveBeenCalledWith('workspace-123');
  });

  it('should mock project operations', async () => {
    const client = Client.create().useAccessToken('test-token');
    const mockProject = { gid: 'project-123', name: 'Test Project' };
    
    mockClient.projects.create.mockResolvedValue(mockProject);
    
    const project = await client.projects.create({
      name: 'Test Project',
      workspace: 'workspace-123'
    });
    
    expect(project).toEqual(mockProject);
    expect(mockClient.projects.create).toHaveBeenCalledWith({
      name: 'Test Project',
      workspace: 'workspace-123'
    });
  });

  it('should mock task operations', async () => {
    const client = Client.create().useAccessToken('test-token');
    const mockTask = { gid: 'task-123', name: 'Test Task' };
    
    mockClient.tasks.create.mockResolvedValue(mockTask);
    
    const task = await client.tasks.create({
      name: 'Test Task',
      workspace: 'workspace-123'
    });
    
    expect(task).toEqual(mockTask);
    expect(mockClient.tasks.create).toHaveBeenCalledWith({
      name: 'Test Task',
      workspace: 'workspace-123'
    });
  });
});
