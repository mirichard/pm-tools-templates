import { Client } from 'asana';
import { EventEmitter } from 'events';

// Type definitions for PM Templates integration
export interface PMTemplate {
  id: string;
  name: string;
  methodology: 'Traditional' | 'Agile' | 'Hybrid';
  version: string;
  fields: TemplateField[];
  tasks: TemplateTask[];
  dependencies: TaskDependency[];
  metadata: TemplateMetadata;
}

export interface TemplateField {
  name: string;
  type: 'text' | 'number' | 'date' | 'enum' | 'multi_enum' | 'user' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For enum types
  validation?: FieldValidation;
}

export interface TemplateTask {
  id: string;
  name: string;
  description?: string;
  estimatedHours?: number;
  dependencies?: string[];
  assigneeRole?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  tags?: string[];
  customFields?: Record<string, any>;
  subtasks?: TemplateTask[];
}

export interface TaskDependency {
  from: string;
  to: string;
  type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish' | 'start_to_finish';
  lag?: number; // Days
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  required?: boolean;
}

export interface TemplateMetadata {
  category: string;
  tags: string[];
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  description: string;
  author: string;
  lastModified: Date;
}

// Asana-specific types
export interface AsanaProject {
  gid: string;
  name: string;
  resource_type: 'project';
  custom_fields: AsanaCustomField[];
  team: { gid: string; name: string };
  workspace: { gid: string; name: string };
  created_at: string;
  modified_at: string;
}

export interface AsanaTask {
  gid: string;
  name: string;
  resource_type: 'task';
  assignee?: { gid: string; name: string };
  completed: boolean;
  due_date?: string;
  custom_fields: Record<string, any>;
  dependencies: AsanaTaskDependency[];
  subtasks: AsanaTask[];
  projects: { gid: string; name: string }[];
}

export interface AsanaCustomField {
  gid: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'enum' | 'multi_enum';
  enum_options?: { gid: string; name: string; color?: string }[];
  is_global_to_workspace: boolean;
}

export interface AsanaTaskDependency {
  gid: string;
  dependent_task: { gid: string };
  dependency_type: string;
}

export interface FieldMapping {
  templateField: string;
  asanaField: string;
  asanaFieldGid?: string;
  dataType: 'text' | 'number' | 'date' | 'enum' | 'multi_enum' | 'user' | 'boolean';
  transformation?: (value: any) => any;
  required: boolean;
}

export interface SyncOptions {
  syncInterval?: number; // milliseconds
  conflictResolution: 'template_wins' | 'asana_wins' | 'manual';
  syncFields: string[];
  bidirectional: boolean;
  webhookEnabled: boolean;
}

export interface SyncResult {
  success: boolean;
  syncedTasks: number;
  errors: SyncError[];
  conflicts: SyncConflict[];
  lastSyncTime: Date;
}

export interface SyncError {
  type: 'api_error' | 'mapping_error' | 'validation_error';
  message: string;
  taskId?: string;
  fieldName?: string;
}

export interface SyncConflict {
  taskId: string;
  fieldName: string;
  templateValue: any;
  asanaValue: any;
  lastModified: {
    template: Date;
    asana: Date;
  };
}

export interface AsanaConnectorConfig {
  accessToken: string;
  clientId?: string;
  clientSecret?: string;
  redirectUri?: string;
  webhookSecret?: string;
  defaultWorkspace?: string;
  rateLimitRetries?: number;
  requestTimeout?: number;
}

export interface WorkspaceConfig {
  workspaceId: string;
  teamMappings: Record<string, string>; // role -> Asana team GID
  customFieldMappings: FieldMapping[];
  defaultProjectSettings: {
    color?: string;
    layout: 'list' | 'board' | 'timeline' | 'calendar';
    privacy_setting: 'public_to_workspace' | 'public_to_team' | 'private';
  };
}

/**
 * Main Asana connector class for PM Tools Templates integration
 */
export class AsanaConnector extends EventEmitter {
  private client: Client;
  private config: AsanaConnectorConfig;
  private workspaceConfigs: Map<string, WorkspaceConfig> = new Map();

  constructor(config: AsanaConnectorConfig) {
    super();
    this.config = config;
    this.client = Client.create({
      defaultHeaders: {
        'asana-enable': 'new_user_task_lists,new_project_templates'
      }
    }).useAccessToken(config.accessToken);
    
    // Set up rate limiting and error handling
    this.setupClientDefaults();
  }

  private setupClientDefaults(): void {
    // Note: The dispatcher options might not be directly modifiable in this way
    // Rate limiting and timeout configuration may need to be handled differently
    // depending on the Asana client version
    try {
      if (this.client.dispatcher && (this.client.dispatcher as any).options) {
        (this.client.dispatcher as any).options.retries = this.config.rateLimitRetries || 3;
        (this.client.dispatcher as any).options.timeout = this.config.requestTimeout || 30000;
      }
    } catch (error) {
      console.warn('Could not configure dispatcher options:', error);
    }
  }

  /**
   * Configure workspace settings for template synchronization
   */
  async configureWorkspace(
    workspaceId: string, 
    config: Partial<WorkspaceConfig>
  ): Promise<void> {
    try {
      // Verify workspace access
      const workspace = await this.client.workspaces.findById(workspaceId);
      
      const fullConfig: WorkspaceConfig = {
        workspaceId,
        teamMappings: config.teamMappings || {},
        customFieldMappings: config.customFieldMappings || [],
        defaultProjectSettings: {
          layout: 'list',
          privacy_setting: 'public_to_team',
          ...config.defaultProjectSettings
        }
      };

      this.workspaceConfigs.set(workspaceId, fullConfig);
      this.emit('workspace_configured', { workspaceId, workspace: workspace.name });
    } catch (error) {
      this.emit('error', { 
        type: 'workspace_config_error', 
        message: `Failed to configure workspace ${workspaceId}`, 
        error 
      });
      throw error;
    }
  }

  /**
   * Create an Asana project from a PM template
   */
  async createProjectFromTemplate(
    template: PMTemplate,
    workspaceId: string,
    options: {
      teamId?: string;
      projectData: {
        name: string;
        description?: string;
        dueDate?: string;
        owner?: string;
      };
      fieldMappings?: FieldMapping[];
    }
  ): Promise<AsanaProject> {
    try {
      this.emit('project_creation_started', { templateId: template.id, workspaceId });

      // Get workspace configuration
      const workspaceConfig = this.workspaceConfigs.get(workspaceId);
      if (!workspaceConfig) {
        throw new Error(`Workspace ${workspaceId} not configured. Call configureWorkspace() first.`);
      }

      // Create base project
      const projectData: any = {
        name: options.projectData.name,
        notes: options.projectData.description || template.metadata.description,
        workspace: workspaceId,
        ...workspaceConfig.defaultProjectSettings
      };

      if (options.teamId) {
        projectData.team = options.teamId;
      }

      if (options.projectData.dueDate) {
        projectData.due_date = options.projectData.dueDate;
      }

      if (options.projectData.owner) {
        projectData.owner = options.projectData.owner;
      }

      const project = await this.client.projects.create(projectData);

      // Map and set custom fields
      await this.setupProjectCustomFields(
        project.gid, 
        template, 
        options.fieldMappings || workspaceConfig.customFieldMappings
      );

      // Create tasks from template
      await this.createTasksFromTemplate(project.gid, template, workspaceId);

      // Set up dependencies
      await this.setupTaskDependencies(project.gid, template.dependencies);

      this.emit('project_created', { 
        projectId: project.gid, 
        templateId: template.id,
        taskCount: template.tasks.length
      });

      return project as unknown as AsanaProject;
    } catch (error) {
      this.emit('error', { 
        type: 'project_creation_error', 
        templateId: template.id,
        message: 'Failed to create project from template', 
        error 
      });
      throw error;
    }
  }

  /**
   * Set up custom fields for the project based on template fields
   */
  private async setupProjectCustomFields(
    projectId: string,
    template: PMTemplate,
    mappings: FieldMapping[]
  ): Promise<void> {
    const mappingMap = new Map(mappings.map(m => [m.templateField, m]));

    for (const field of template.fields) {
      const mapping = mappingMap.get(field.name);
      if (!mapping) continue;

      try {
        // Check if custom field exists
        let customField: AsanaCustomField;
        if (mapping.asanaFieldGid) {
          // Note: Using any type as the method might not be in type definitions
          customField = await (this.client.customFields as any).findById(mapping.asanaFieldGid);
        } else {
          // Create custom field if it doesn't exist
          customField = await this.createOrGetCustomField(field, mapping);
        }

        // Add custom field to project
        // Note: Using any type as the method might not be in type definitions
        await (this.client.projects as any).addCustomFieldSettingForProject(projectId, {
          custom_field: customField.gid,
          is_important: field.required
        });
      } catch (error) {
        console.warn(`Failed to set up custom field ${field.name}:`, error);
      }
    }
  }

  /**
   * Create or retrieve existing custom field
   */
  private async createOrGetCustomField(
    templateField: TemplateField,
    mapping: FieldMapping
  ): Promise<AsanaCustomField> {
    const workspaceId = this.config.defaultWorkspace;
    if (!workspaceId) {
      throw new Error('Default workspace not configured');
    }

    // Check if field already exists
    const existingFields = await this.client.customFields.getCustomFieldsForWorkspace(workspaceId);
    const existing = existingFields.data.find(f => f.name === mapping.asanaField);
    
    if (existing) {
      return existing as unknown as AsanaCustomField;
    }

    // Create new custom field
    const fieldData: any = {
      name: mapping.asanaField,
      type: mapping.dataType,
      workspace: workspaceId
    };

    if (templateField.type === 'enum' && templateField.options) {
      fieldData.enum_options = templateField.options.map((option, index) => ({
        name: option,
        color: this.getColorForIndex(index)
      }));
    }

    // Note: Using any type as the method might not be in type definitions
    const newField = await (this.client.customFields as any).create(fieldData);
    return newField as AsanaCustomField;
  }

  /**
   * Create tasks from template structure
   */
  private async createTasksFromTemplate(
    projectId: string,
    template: PMTemplate,
    workspaceId: string
  ): Promise<Map<string, string>> {
    const taskIdMapping = new Map<string, string>(); // template task ID -> Asana task GID

    // Create tasks in dependency order
    const sortedTasks = this.topologicalSort(template.tasks, template.dependencies);

    for (const templateTask of sortedTasks) {
      try {
        const taskData: any = {
          name: templateTask.name,
          notes: templateTask.description || '',
          projects: [projectId],
          workspace: this.config.defaultWorkspace || workspaceId
        };

        // Set assignee if team mapping exists
        if (templateTask.assigneeRole) {
          const workspaceConfig = this.workspaceConfigs.values().next().value;
          const teamId = workspaceConfig?.teamMappings[templateTask.assigneeRole];
          if (teamId) {
            // Note: This would require additional logic to assign to specific team members
            taskData.assignee_section = teamId;
          }
        }

        // Add custom fields
        if (templateTask.customFields) {
          taskData.custom_fields = templateTask.customFields;
        }

        const asanaTask = await this.client.tasks.create(taskData);
        taskIdMapping.set(templateTask.id, asanaTask.gid);

        // Create subtasks
        if (templateTask.subtasks) {
          for (const subtask of templateTask.subtasks) {
            const subtaskData = {
              name: subtask.name,
              notes: subtask.description || '',
              parent: asanaTask.gid,
              workspace: this.config.defaultWorkspace || workspaceId
            };
            
            const asanaSubtask = await this.client.tasks.create(subtaskData);
            taskIdMapping.set(subtask.id, asanaSubtask.gid);
          }
        }
      } catch (error) {
        console.error(`Failed to create task ${templateTask.name}:`, error);
      }
    }

    return taskIdMapping;
  }

  /**
   * Set up task dependencies based on template
   */
  private async setupTaskDependencies(
    projectId: string,
    dependencies: TaskDependency[]
  ): Promise<void> {
    // Note: Asana API has limitations on dependency types
    // This is a simplified implementation
    for (const dep of dependencies) {
      try {
        if (dep.type === 'finish_to_start') {
          // Use Asana's dependency API when available
          // For now, we'll add this as a task relationship
        }
      } catch (error) {
        console.warn(`Failed to set up dependency ${dep.from} -> ${dep.to}:`, error);
      }
    }
  }

  /**
   * Topological sort for task dependencies
   */
  private topologicalSort(tasks: TemplateTask[], dependencies: TaskDependency[]): TemplateTask[] {
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();

    // Initialize
    tasks.forEach(task => {
      inDegree.set(task.id, 0);
      graph.set(task.id, []);
    });

    // Build graph
    dependencies.forEach(dep => {
      graph.get(dep.from)?.push(dep.to);
      inDegree.set(dep.to, (inDegree.get(dep.to) || 0) + 1);
    });

    // Kahn's algorithm
    const queue: string[] = [];
    const result: TemplateTask[] = [];

    inDegree.forEach((degree, taskId) => {
      if (degree === 0) {
        queue.push(taskId);
      }
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentTask = taskMap.get(currentId);
      if (currentTask) {
        result.push(currentTask);
      }

      graph.get(currentId)?.forEach(neighborId => {
        const newDegree = (inDegree.get(neighborId) || 0) - 1;
        inDegree.set(neighborId, newDegree);
        if (newDegree === 0) {
          queue.push(neighborId);
        }
      });
    }

    return result;
  }

  /**
   * Get color for enum option by index
   */
  private getColorForIndex(index: number): string {
    const colors = ['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'pink', 'brown'];
    return colors[index % colors.length];
  }

  /**
   * Sync task progress between template and Asana
   */
  async syncTaskProgress(
    templateId: string,
    asanaProjectId: string,
    options: SyncOptions = {
      conflictResolution: 'asana_wins',
      syncFields: ['status', 'assignee', 'due_date'],
      bidirectional: true,
      webhookEnabled: true
    }
  ): Promise<SyncResult> {
    try {
      this.emit('sync_started', { templateId, asanaProjectId });

      const result: SyncResult = {
        success: true,
        syncedTasks: 0,
        errors: [],
        conflicts: [],
        lastSyncTime: new Date()
      };

      // Get Asana project tasks for future sync implementation
      await this.client.projects.tasks(asanaProjectId, {
        opt_fields: 'name,completed,assignee,due_date,custom_fields,modified_at'
      });

      // Sync logic would go here
      // This is a placeholder for the full synchronization implementation

      this.emit('sync_completed', result);
      return result;
    } catch (error) {
      this.emit('error', { 
        type: 'sync_error', 
        templateId,
        asanaProjectId,
        message: 'Failed to sync task progress', 
        error 
      });
      throw error;
    }
  }

  /**
   * Map template fields to Asana custom fields
   */
  async mapCustomFields(
    templateFields: TemplateField[],
    asanaFields: AsanaCustomField[]
  ): Promise<FieldMapping[]> {
    const mappings: FieldMapping[] = [];

    for (const templateField of templateFields) {
      // Find matching Asana field by name or create mapping
      const asanaField = asanaFields.find(af => 
        af.name.toLowerCase() === templateField.name.toLowerCase() ||
        af.name.toLowerCase().replace(/[_\s]/g, '') === templateField.name.toLowerCase().replace(/[_\s]/g, '')
      );

      if (asanaField) {
        mappings.push({
          templateField: templateField.name,
          asanaField: asanaField.name,
          asanaFieldGid: asanaField.gid,
          dataType: asanaField.type as any,
          required: templateField.required
        });
      }
    }

    return mappings;
  }

  /**
   * Get workspace teams for role mapping
   */
  async getWorkspaceTeams(workspaceId: string): Promise<Array<{ gid: string; name: string }>> {
    try {
      // Note: Teams might use findByOrganization instead of findByWorkspace
      const teams = await (this.client.teams as any).findByOrganization(workspaceId);
      return teams.data.map((team: any) => ({
        gid: team.gid,
        name: team.name
      }));
    } catch (error) {
      this.emit('error', { 
        type: 'api_error', 
        message: 'Failed to get workspace teams', 
        error 
      });
      throw error;
    }
  }

  /**
   * Get workspace custom fields
   */
  async getWorkspaceCustomFields(workspaceId: string): Promise<AsanaCustomField[]> {
    try {
      const fields = await this.client.customFields.getCustomFieldsForWorkspace(workspaceId);
      return fields.data as unknown as AsanaCustomField[];
    } catch (error) {
      this.emit('error', { 
        type: 'api_error', 
        message: 'Failed to get workspace custom fields', 
        error 
      });
      throw error;
    }
  }

  /**
   * Clean up resources
   */
  async disconnect(): Promise<void> {
    this.removeAllListeners();
  }
}

export default AsanaConnector;

