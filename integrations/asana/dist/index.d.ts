/**
 * PM Tools Templates - Asana Integration
 *
 * Main entry point for the Asana integration module providing:
 * - Bi-directional synchronization between templates and Asana
 * - Project creation from methodology templates (Traditional, Agile, Hybrid)
 * - Real-time webhook integration for instant updates
 * - CLI tools for easy management and automation
 *
 * @version 1.0.0
 * @author PM Tools Templates
 */
export { AsanaConnector, type AsanaConnectorConfig, type PMTemplate, type TemplateField, type TemplateTask, type TaskDependency, type FieldMapping, type AsanaProject, type AsanaTask, type AsanaCustomField, type WorkspaceConfig, type SyncOptions, type SyncResult, type SyncError, type SyncConflict } from './connector';
export { AsanaSyncEngine, type SyncJob, type ConflictResolution, type SyncState, type TaskSyncState, type FieldSyncState, type WebhookEvent } from './sync-engine';
export { AsanaWebhookServer, type WebhookServerConfig, type WebhookSubscription } from './webhook-server';
export { default as AsanaCLI } from './cli';
export declare const AsanaIntegrationUtils: {
    /**
     * Validate template structure
     */
    validateTemplate: (template: any) => boolean;
    /**
     * Generate field mapping suggestions
     */
    suggestFieldMappings: (templateFields: any[], asanaFields: any[]) => any[];
    /**
     * Convert template complexity to Asana priority
     */
    complexityToPriority: (complexity: string) => string;
    /**
     * Calculate project health score based on sync metrics
     */
    calculateProjectHealth: (syncResult: any) => number;
    /**
     * Generate project timeline based on template tasks
     */
    generateTimeline: (tasks: any[], startDate: Date, workingDaysPerWeek?: number) => any[];
    /**
     * Validate Asana workspace configuration
     */
    validateWorkspaceConfig: (config: any) => {
        valid: boolean;
        errors: string[];
    };
};
export declare const VERSION = "1.0.0";
export declare const SUPPORTED_METHODOLOGIES: readonly ["Traditional", "Agile", "Hybrid"];
export declare const DEFAULT_SYNC_FIELDS: readonly ["name", "completed", "due_date", "assignee", "priority"];
/**
 * Quick setup function for basic Asana integration
 */
export declare function quickSetup(options: {
    accessToken: string;
    workspaceId: string;
    webhookSecret?: string;
}): Promise<{
    connector: AsanaConnector;
    syncEngine: AsanaSyncEngine;
    webhookServer?: AsanaWebhookServer;
}>;
/**
 * Load template from file
 */
export declare function loadTemplate(templatePath: string): Promise<PMTemplate>;
/**
 * Create project from template with minimal configuration
 */
export declare function createProjectFromTemplate(connector: AsanaConnector, templatePath: string, projectData: {
    name: string;
    workspaceId: string;
    description?: string;
    teamId?: string;
}): Promise<AsanaProject>;
declare const _default: {
    AsanaConnector: any;
    AsanaSyncEngine: any;
    AsanaWebhookServer: any;
    AsanaCLI: any;
    AsanaIntegrationUtils: {
        /**
         * Validate template structure
         */
        validateTemplate: (template: any) => boolean;
        /**
         * Generate field mapping suggestions
         */
        suggestFieldMappings: (templateFields: any[], asanaFields: any[]) => any[];
        /**
         * Convert template complexity to Asana priority
         */
        complexityToPriority: (complexity: string) => string;
        /**
         * Calculate project health score based on sync metrics
         */
        calculateProjectHealth: (syncResult: any) => number;
        /**
         * Generate project timeline based on template tasks
         */
        generateTimeline: (tasks: any[], startDate: Date, workingDaysPerWeek?: number) => any[];
        /**
         * Validate Asana workspace configuration
         */
        validateWorkspaceConfig: (config: any) => {
            valid: boolean;
            errors: string[];
        };
    };
    quickSetup: typeof quickSetup;
    loadTemplate: typeof loadTemplate;
    createProjectFromTemplate: typeof createProjectFromTemplate;
    VERSION: string;
    SUPPORTED_METHODOLOGIES: readonly ["Traditional", "Agile", "Hybrid"];
    DEFAULT_SYNC_FIELDS: readonly ["name", "completed", "due_date", "assignee", "priority"];
};
export default _default;
//# sourceMappingURL=index.d.ts.map