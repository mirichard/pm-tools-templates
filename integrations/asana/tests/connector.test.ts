import { AsanaConnector, PMTemplate, AsanaConnectorConfig, WorkspaceConfig } from '../src/connector';
import { Client } from 'asana';

// Mock the Asana client
jest.mock('asana');

describe('AsanaConnector', () => {
  let connector: AsanaConnector;
  let mockClient: jest.Mocked<any>;
  let config: AsanaConnectorConfig;

  const mockTemplate: PMTemplate = {
    id: 'test-template-1',
    name: 'Test Project Template',
    methodology: 'Agile',
    version: '1.0.0',
    fields: [
      {
        name: 'Priority',
        type: 'enum',
        required: true,
        options: ['Low', 'Medium', 'High', 'Critical']
      },
      {
        name: 'Estimated Hours',
        type: 'number',
        required: false
      }
    ],
    tasks: [
      {
        id: 'task-1',
        name: 'Initial Setup',
        description: 'Set up project infrastructure',
        estimatedHours: 8,
        priority: 'High',
        tags: ['setup', 'infrastructure']
      },
      {
        id: 'task-2',
        name: 'Development',
        description: 'Core development work',
        estimatedHours: 40,
        dependencies: ['task-1'],
        priority: 'Medium'
      }
    ],
    dependencies: [
      {
        from: 'task-1',
        to: 'task-2',
        type: 'finish_to_start'
      }
    ],
    metadata: {
      category: 'Software Development',
      tags: ['agile', 'development'],
      complexity: 'Intermediate',
      estimatedDuration: '2 weeks',
      description: 'A test template for software development projects',
      author: 'Test Author',
      lastModified: new Date('2024-01-01')
    }
  };

  beforeEach(() => {
    config = {
      accessToken: 'test-access-token',
      defaultWorkspace: 'test-workspace-id',
      rateLimitRetries: 3,
      requestTimeout: 30000
    };

    // Create mock client with all required methods
    mockClient = {
      useAccessToken: jest.fn().mockReturnThis(),
      dispatcher: {
        options: {}
      },
      workspaces: {
        findById: jest.fn()
      },
      projects: {
        create: jest.fn(),
        addCustomFieldSettingForProject: jest.fn()
      },
      customFields: {
        findById: jest.fn(),
        getCustomFieldsForWorkspace: jest.fn(),
        create: jest.fn()
      },
      tasks: {
        create: jest.fn(),
        addDependenciesForTask: jest.fn()
      }
    };

    // Mock the Client.create method
    (Client.create as jest.Mock).mockReturnValue(mockClient);

    connector = new AsanaConnector(config);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(Client.create).toHaveBeenCalledWith({
        defaultHeaders: {
          'asana-enable': 'new_user_task_lists,new_project_templates'
        }
      });
      expect(mockClient.useAccessToken).toHaveBeenCalledWith('test-access-token');
      expect(mockClient.dispatcher.options.retries).toBe(3);
      expect(mockClient.dispatcher.options.timeout).toBe(30000);
    });
  });

  describe('configureWorkspace', () => {
    it('should configure workspace successfully', async () => {
      const workspaceId = 'test-workspace-id';
      const mockWorkspace = { gid: workspaceId, name: 'Test Workspace' };
      
      mockClient.workspaces.findById.mockResolvedValue(mockWorkspace);

      const workspaceConfig: Partial<WorkspaceConfig> = {
        teamMappings: { 'developer': 'team-123' },
        customFieldMappings: []
      };

      const eventSpy = jest.fn();
      connector.on('workspace_configured', eventSpy);

      await connector.configureWorkspace(workspaceId, workspaceConfig);

      expect(mockClient.workspaces.findById).toHaveBeenCalledWith(workspaceId);
      expect(eventSpy).toHaveBeenCalledWith({
        workspaceId,
        workspace: 'Test Workspace'
      });
    });

    it('should handle workspace configuration errors', async () => {
      const workspaceId = 'invalid-workspace';
      const error = new Error('Workspace not found');
      
      mockClient.workspaces.findById.mockRejectedValue(error);

      const errorSpy = jest.fn();
      connector.on('error', errorSpy);

      await expect(connector.configureWorkspace(workspaceId, {}))
        .rejects.toThrow('Workspace not found');

      expect(errorSpy).toHaveBeenCalledWith({
        type: 'workspace_config_error',
        message: `Failed to configure workspace ${workspaceId}`,
        error
      });
    });
  });

  describe('createProjectFromTemplate', () => {
    beforeEach(async () => {
      // Set up workspace configuration
      const mockWorkspace = { gid: 'test-workspace-id', name: 'Test Workspace' };
      mockClient.workspaces.findById.mockResolvedValue(mockWorkspace);
      
      await connector.configureWorkspace('test-workspace-id', {
        teamMappings: { 'developer': 'team-123' },
        customFieldMappings: [
          {
            templateField: 'Priority',
            asanaField: 'Priority Level',
            dataType: 'enum',
            required: true
          }
        ]
      });
    });

    it('should create project from template successfully', async () => {
      const mockProject = {
        gid: 'project-123',
        name: 'Test Project',
        resource_type: 'project'
      };

      const mockCustomField = {
        gid: 'field-123',
        name: 'Priority Level',
        type: 'enum'
      };

      const mockTask1 = { gid: 'task-123', name: 'Initial Setup' };
      const mockTask2 = { gid: 'task-456', name: 'Development' };

      mockClient.projects.create.mockResolvedValue(mockProject);
      mockClient.customFields.getCustomFieldsForWorkspace.mockResolvedValue({
        data: [mockCustomField]
      });
      mockClient.tasks.create
        .mockResolvedValueOnce(mockTask1)
        .mockResolvedValueOnce(mockTask2);

      const eventSpy = jest.fn();
      connector.on('project_created', eventSpy);

      const result = await connector.createProjectFromTemplate(
        mockTemplate,
        'test-workspace-id',
        {
          projectData: {
            name: 'My New Project',
            description: 'A test project',
            owner: 'user-123'
          }
        }
      );

      expect(result).toEqual(mockProject);
      expect(mockClient.projects.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My New Project',
          notes: 'A test project',
          workspace: 'test-workspace-id',
          owner: 'user-123'
        })
      );

      expect(eventSpy).toHaveBeenCalledWith({
        projectId: 'project-123',
        templateId: 'test-template-1',
        taskCount: 2
      });
    });

    it('should handle missing workspace configuration', async () => {
      const unconfiguredConnector = new AsanaConnector(config);

      await expect(unconfiguredConnector.createProjectFromTemplate(
        mockTemplate,
        'unconfigured-workspace',
        {
          projectData: { name: 'Test Project' }
        }
      )).rejects.toThrow('Workspace unconfigured-workspace not configured');
    });

    it('should handle project creation errors', async () => {
      const error = new Error('API Error');
      mockClient.projects.create.mockRejectedValue(error);

      const errorSpy = jest.fn();
      connector.on('error', errorSpy);

      await expect(connector.createProjectFromTemplate(
        mockTemplate,
        'test-workspace-id',
        {
          projectData: { name: 'Test Project' }
        }
      )).rejects.toThrow('API Error');

      expect(errorSpy).toHaveBeenCalledWith({
        type: 'project_creation_error',
        templateId: 'test-template-1',
        message: 'Failed to create project from template',
        error
      });
    });
  });

  describe('event handling', () => {
    it('should emit events during operations', async () => {
      const workspaceId = 'test-workspace-id';
      const mockWorkspace = { gid: workspaceId, name: 'Test Workspace' };
      
      mockClient.workspaces.findById.mockResolvedValue(mockWorkspace);

      const events: any[] = [];
      connector.on('workspace_configured', (data) => events.push({ type: 'workspace_configured', data }));
      connector.on('project_creation_started', (data) => events.push({ type: 'project_creation_started', data }));
      connector.on('error', (data) => events.push({ type: 'error', data }));

      await connector.configureWorkspace(workspaceId, {});

      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({
        type: 'workspace_configured',
        data: { workspaceId, workspace: 'Test Workspace' }
      });
    });
  });

  describe('error handling', () => {
    it('should handle rate limiting gracefully', () => {
      // Test that the connector is configured with proper retry settings
      expect(mockClient.dispatcher.options.retries).toBe(3);
      expect(mockClient.dispatcher.options.timeout).toBe(30000);
    });

    it('should handle invalid access token', async () => {
      const invalidConfig = { ...config, accessToken: 'invalid-token' };
      const invalidConnector = new AsanaConnector(invalidConfig);

      expect(mockClient.useAccessToken).toHaveBeenCalledWith('invalid-token');
    });
  });
});
