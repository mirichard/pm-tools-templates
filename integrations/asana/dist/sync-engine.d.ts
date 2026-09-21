import { EventEmitter } from 'events';
import * as cron from 'node-cron';
import { SyncOptions, SyncConflict } from './connector';
export interface SyncJob {
    id: string;
    templateId: string;
    asanaProjectId: string;
    options: SyncOptions;
    status: 'running' | 'stopped' | 'error';
    lastSync?: Date;
    nextSync?: Date;
    cronJob?: cron.ScheduledTask;
    stats: {
        totalSyncs: number;
        successfulSyncs: number;
        failedSyncs: number;
        conflictsResolved: number;
    };
}
export interface ConflictResolution {
    taskId: string;
    fieldName: string;
    resolution: 'template_wins' | 'asana_wins' | 'merge' | 'skip';
    resolvedValue?: any;
    timestamp: Date;
}
export interface SyncState {
    lastSyncHash: string;
    lastModified: Date;
    fieldChecksums: Map<string, string>;
    taskStates: Map<string, TaskSyncState>;
}
export interface TaskSyncState {
    asanaGid: string;
    templateId: string;
    lastModified: {
        template: Date;
        asana: Date;
    };
    fieldStates: Map<string, FieldSyncState>;
}
export interface FieldSyncState {
    templateValue: any;
    asanaValue: any;
    lastSynced: Date;
    checksum: string;
}
export interface WebhookEvent {
    gid: string;
    resource: {
        gid: string;
        resource_type: string;
        resource_subtype?: string;
    };
    user: {
        gid: string;
        name: string;
    };
    created_at: string;
    type: string;
    action: string;
    parent?: {
        gid: string;
        resource_type: string;
    };
    change?: {
        field: string;
        new_value?: any;
        old_value?: any;
    };
}
/**
 * Bi-directional synchronization engine for Asana integration
 */
export declare class AsanaSyncEngine extends EventEmitter {
    private client;
    private syncJobs;
    private syncStates;
    private webhookSecret;
    private isRunning;
    constructor(client: any, webhookSecret: string);
    /**
     * Start bi-directional synchronization between template and Asana project
     */
    startBidirectionalSync(templateId: string, asanaProjectId: string, options: SyncOptions): Promise<string>;
    /**
     * Stop a running sync job
     */
    stopBidirectionalSync(jobId: string): Promise<void>;
    /**
     * Execute a single sync operation
     */
    private executeSyncJob;
    /**
     * Sync changes from template to Asana
     */
    private syncTemplateToAsana;
    /**
     * Sync changes from Asana to template
     */
    private syncAsanaToTemplate;
    /**
     * Handle Asana webhook events for real-time sync
     */
    handleAsanaWebhook(webhookData: WebhookEvent): Promise<void>;
    /**
     * Resolve sync conflicts based on resolution strategy
     */
    resolveConflicts(conflicts: SyncConflict[], strategy?: 'template_wins' | 'asana_wins' | 'manual'): Promise<ConflictResolution[]>;
    /**
     * Get sync job status and statistics
     */
    getSyncJobStatus(jobId: string): SyncJob | undefined;
    /**
     * Get all active sync jobs
     */
    getAllSyncJobs(): SyncJob[];
    private generateJobId;
    private intervalToCron;
    private initializeSyncState;
    private updateSyncState;
    private calculateChecksum;
    private detectConflict;
    private resolveConflict;
    private verifyWebhookSignature;
    private isWebhookRelevant;
    private findAsanaTaskForTemplate;
    private getTemplateFieldValue;
    private getAsanaFieldValue;
    private updateAsanaField;
    private updateTemplateField;
    private getAsanaProjectTasks;
    private getTemplateTasks;
    /**
     * Clean up resources
     */
    shutdown(): Promise<void>;
}
export default AsanaSyncEngine;
//# sourceMappingURL=sync-engine.d.ts.map