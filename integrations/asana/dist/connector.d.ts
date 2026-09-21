import { EventEmitter } from 'events';
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
    options?: string[];
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
    lag?: number;
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
export interface AsanaProject {
    gid: string;
    name: string;
    resource_type: 'project';
    custom_fields: AsanaCustomField[];
    team: {
        gid: string;
        name: string;
    };
    workspace: {
        gid: string;
        name: string;
    };
    created_at: string;
    modified_at: string;
}
export interface AsanaTask {
    gid: string;
    name: string;
    resource_type: 'task';
    assignee?: {
        gid: string;
        name: string;
    };
    completed: boolean;
    due_date?: string;
    modified_at?: string;
    custom_fields: Record<string, any>;
    dependencies: AsanaTaskDependency[];
    subtasks: AsanaTask[];
    projects: {
        gid: string;
        name: string;
    }[];
}
export interface AsanaCustomField {
    gid: string;
    name: string;
    type: 'text' | 'number' | 'date' | 'enum' | 'multi_enum';
    enum_options?: {
        gid: string;
        name: string;
        color?: string;
    }[];
    is_global_to_workspace: boolean;
}
export interface AsanaTaskDependency {
    gid: string;
    dependent_task: {
        gid: string;
    };
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
    syncInterval?: number;
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
    type: 'api_error' | 'mapping_error' | 'validation_error' | 'sync_error';
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
    teamMappings: Record<string, string>;
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
export declare class AsanaConnector extends EventEmitter {
    private client;
    private config;
    private workspaceConfigs;
    constructor(config: AsanaConnectorConfig);
    private setupClientDefaults;
    /**
     * Configure workspace settings for template synchronization
     */
    configureWorkspace(workspaceId: string, config: Partial<WorkspaceConfig>): Promise<void>;
    /**
     * Create an Asana project from a PM template
     */
    createProjectFromTemplate(template: PMTemplate, workspaceId: string, options: {
        teamId?: string;
        projectData: {
            name: string;
            description?: string;
            dueDate?: string;
            owner?: string;
        };
        fieldMappings?: FieldMapping[];
    }): Promise<AsanaProject>;
    /**
     * Set up custom fields for the project based on template fields
     */
    private setupProjectCustomFields;
    /**
     * Create or retrieve existing custom field
     */
    private createOrGetCustomField;
    /**
     * Create tasks from template structure
     */
    private createTasksFromTemplate;
    /**
     * Set up task dependencies based on template
     */
    private setupTaskDependencies;
    /**
     * Topological sort for task dependencies
     */
    private topologicalSort;
    /**
     * Get color for enum option by index
     */
    private getColorForIndex;
    /**
     * Sync task progress between template and Asana
     */
    syncTaskProgress(templateId: string, asanaProjectId: string, options?: SyncOptions): Promise<SyncResult>;
    /**
     * Map template fields to Asana custom fields
     */
    mapCustomFields(templateFields: TemplateField[], asanaFields: AsanaCustomField[]): Promise<FieldMapping[]>;
    /**
     * Get workspace teams for role mapping
     */
    getWorkspaceTeams(workspaceId: string): Promise<Array<{
        gid: string;
        name: string;
    }>>;
    /**
     * Get workspace custom fields
     */
    getWorkspaceCustomFields(workspaceId: string): Promise<AsanaCustomField[]>;
    /**
     * Clean up resources
     */
    disconnect(): Promise<void>;
}
export default AsanaConnector;
//# sourceMappingURL=connector.d.ts.map