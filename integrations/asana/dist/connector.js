"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsanaConnector = void 0;
const asana_1 = require("asana");
const events_1 = require("events");
/**
 * Main Asana connector class for PM Tools Templates integration
 */
class AsanaConnector extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.workspaceConfigs = new Map();
        this.config = config;
        this.client = asana_1.Client.create({
            defaultHeaders: {
                'asana-enable': 'new_user_task_lists,new_project_templates'
            }
        }).useAccessToken(config.accessToken);
        // Set up rate limiting and error handling
        this.setupClientDefaults();
    }
    setupClientDefaults() {
        // Configure default request options
        this.client.dispatcher.options.retries = this.config.rateLimitRetries || 3;
        this.client.dispatcher.options.timeout = this.config.requestTimeout || 30000;
    }
    /**
     * Configure workspace settings for template synchronization
     */
    async configureWorkspace(workspaceId, config) {
        try {
            // Verify workspace access
            const workspace = await this.client.workspaces.getWorkspace(workspaceId);
            const fullConfig = {
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
        }
        catch (error) {
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
    async createProjectFromTemplate(template, workspaceId, options) {
        try {
            this.emit('project_creation_started', { templateId: template.id, workspaceId });
            // Get workspace configuration
            const workspaceConfig = this.workspaceConfigs.get(workspaceId);
            if (!workspaceConfig) {
                throw new Error(`Workspace ${workspaceId} not configured. Call configureWorkspace() first.`);
            }
            // Create base project
            const projectData = {
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
            const project = await this.client.projects.createProject(projectData);
            // Map and set custom fields
            await this.setupProjectCustomFields(project.gid, template, options.fieldMappings || workspaceConfig.customFieldMappings);
            // Create tasks from template
            await this.createTasksFromTemplate(project.gid, template);
            // Set up dependencies
            await this.setupTaskDependencies(project.gid, template.dependencies);
            this.emit('project_created', {
                projectId: project.gid,
                templateId: template.id,
                taskCount: template.tasks.length
            });
            return project;
        }
        catch (error) {
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
    async setupProjectCustomFields(projectId, template, mappings) {
        const mappingMap = new Map(mappings.map(m => [m.templateField, m]));
        for (const field of template.fields) {
            const mapping = mappingMap.get(field.name);
            if (!mapping)
                continue;
            try {
                // Check if custom field exists
                let customField;
                if (mapping.asanaFieldGid) {
                    customField = await this.client.customFields.getCustomField(mapping.asanaFieldGid);
                }
                else {
                    // Create custom field if it doesn't exist
                    customField = await this.createOrGetCustomField(field, mapping);
                }
                // Add custom field to project
                await this.client.projects.addCustomFieldSettingForProject(projectId, {
                    custom_field: customField.gid,
                    is_important: field.required
                });
            }
            catch (error) {
                console.warn(`Failed to set up custom field ${field.name}:`, error);
            }
        }
    }
    /**
     * Create or retrieve existing custom field
     */
    async createOrGetCustomField(templateField, mapping) {
        const workspaceId = this.config.defaultWorkspace;
        if (!workspaceId) {
            throw new Error('Default workspace not configured');
        }
        // Check if field already exists
        const existingFields = await this.client.customFields.getCustomFieldsForWorkspace(workspaceId);
        const existing = existingFields.data.find((f) => f.name === mapping.asanaField);
        if (existing) {
            return existing;
        }
        // Create new custom field
        const fieldData = {
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
        const newField = await this.client.customFields.createCustomField(fieldData);
        return newField;
    }
    /**
     * Create tasks from template structure
     */
    async createTasksFromTemplate(projectId, template) {
        const taskIdMapping = new Map(); // template task ID -> Asana task GID
        // Create tasks in dependency order
        const sortedTasks = this.topologicalSort(template.tasks, template.dependencies);
        for (const templateTask of sortedTasks) {
            try {
                const taskData = {
                    name: templateTask.name,
                    notes: templateTask.description || '',
                    projects: [projectId]
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
                const asanaTask = await this.client.tasks.createTask(taskData);
                taskIdMapping.set(templateTask.id, asanaTask.gid);
                // Create subtasks
                if (templateTask.subtasks) {
                    for (const subtask of templateTask.subtasks) {
                        const subtaskData = {
                            name: subtask.name,
                            notes: subtask.description || '',
                            parent: asanaTask.gid
                        };
                        const asanaSubtask = await this.client.tasks.createTask(subtaskData);
                        taskIdMapping.set(subtask.id, asanaSubtask.gid);
                    }
                }
            }
            catch (error) {
                console.error(`Failed to create task ${templateTask.name}:`, error);
            }
        }
        return taskIdMapping;
    }
    /**
     * Set up task dependencies based on template
     */
    async setupTaskDependencies(projectId, dependencies) {
        // Note: Asana API has limitations on dependency types
        // This is a simplified implementation
        for (const dep of dependencies) {
            try {
                if (dep.type === 'finish_to_start') {
                    // Use Asana's dependency API when available
                    // For now, we'll add this as a task relationship
                }
            }
            catch (error) {
                console.warn(`Failed to set up dependency ${dep.from} -> ${dep.to}:`, error);
            }
        }
    }
    /**
     * Topological sort for task dependencies
     */
    topologicalSort(tasks, dependencies) {
        const taskMap = new Map(tasks.map(t => [t.id, t]));
        const inDegree = new Map();
        const graph = new Map();
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
        const queue = [];
        const result = [];
        inDegree.forEach((degree, taskId) => {
            if (degree === 0) {
                queue.push(taskId);
            }
        });
        while (queue.length > 0) {
            const currentId = queue.shift();
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
    getColorForIndex(index) {
        const colors = ['blue', 'green', 'red', 'yellow', 'orange', 'purple', 'pink', 'brown'];
        return colors[index % colors.length];
    }
    /**
     * Sync task progress between template and Asana
     */
    async syncTaskProgress(templateId, asanaProjectId, options = {
        conflictResolution: 'asana_wins',
        syncFields: ['status', 'assignee', 'due_date'],
        bidirectional: true,
        webhookEnabled: true
    }) {
        try {
            this.emit('sync_started', { templateId, asanaProjectId });
            const result = {
                success: true,
                syncedTasks: 0,
                errors: [],
                conflicts: [],
                lastSyncTime: new Date()
            };
            // Get Asana project tasks for future sync implementation
            await this.client.tasks.getTasksForProject(asanaProjectId, {
                opt_fields: 'name,completed,assignee,due_date,custom_fields,modified_at'
            });
            // Sync logic would go here
            // This is a placeholder for the full synchronization implementation
            this.emit('sync_completed', result);
            return result;
        }
        catch (error) {
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
    async mapCustomFields(templateFields, asanaFields) {
        const mappings = [];
        for (const templateField of templateFields) {
            // Find matching Asana field by name or create mapping
            const asanaField = asanaFields.find(af => af.name.toLowerCase() === templateField.name.toLowerCase() ||
                af.name.toLowerCase().replace(/[_\s]/g, '') === templateField.name.toLowerCase().replace(/[_\s]/g, ''));
            if (asanaField) {
                mappings.push({
                    templateField: templateField.name,
                    asanaField: asanaField.name,
                    asanaFieldGid: asanaField.gid,
                    dataType: asanaField.type,
                    required: templateField.required
                });
            }
        }
        return mappings;
    }
    /**
     * Get workspace teams for role mapping
     */
    async getWorkspaceTeams(workspaceId) {
        try {
            const teams = await this.client.teams.getTeamsForWorkspace(workspaceId);
            return teams.data.map((team) => ({
                gid: team.gid,
                name: team.name
            }));
        }
        catch (error) {
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
    async getWorkspaceCustomFields(workspaceId) {
        try {
            const fields = await this.client.customFields.getCustomFieldsForWorkspace(workspaceId);
            return fields.data;
        }
        catch (error) {
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
    async disconnect() {
        this.removeAllListeners();
    }
}
exports.AsanaConnector = AsanaConnector;
exports.default = AsanaConnector;
//# sourceMappingURL=connector.js.map