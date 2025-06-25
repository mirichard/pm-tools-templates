import { EventEmitter } from 'events';
import { Client } from 'asana';
import * as cron from 'node-cron';
import { createHash } from 'crypto';
import { 
  SyncOptions, 
  SyncResult, 
  SyncConflict,
  AsanaTask,
  TemplateTask
} from './connector';

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
export class AsanaSyncEngine extends EventEmitter {
  private client: Client;
  private syncJobs: Map<string, SyncJob> = new Map();
  private syncStates: Map<string, SyncState> = new Map();
  private webhookSecret: string;
  private isRunning: boolean = false;

  constructor(
    client: Client,
    webhookSecret: string
  ) {
    super();
    this.client = client;
    this.webhookSecret = webhookSecret;
  }

  /**
   * Start bi-directional synchronization between template and Asana project
   */
  async startBidirectionalSync(
    templateId: string,
    asanaProjectId: string,
    options: SyncOptions
  ): Promise<string> {
    try {
      const jobId = this.generateJobId(templateId, asanaProjectId);
      
      // Check if job already exists
      if (this.syncJobs.has(jobId)) {
        throw new Error(`Sync job ${jobId} already exists`);
      }

      // Create sync job
      const syncJob: SyncJob = {
        id: jobId,
        templateId,
        asanaProjectId,
        options,
        status: 'stopped',
        stats: {
          totalSyncs: 0,
          successfulSyncs: 0,
          failedSyncs: 0,
          conflictsResolved: 0
        }
      };

      // Set up cron job for scheduled sync if interval is specified
      if (options.syncInterval && options.syncInterval > 0) {
        const cronExpression = this.intervalToCron(options.syncInterval);
        syncJob.cronJob = cron.schedule(cronExpression, async () => {
          await this.executeSyncJob(jobId);
        }, { scheduled: false });
      }

      // Perform initial sync
      await this.initializeSyncState(templateId, asanaProjectId);
      const initialResult = await this.executeSyncJob(jobId);

      // Start scheduled sync if configured
      if (syncJob.cronJob) {
        syncJob.cronJob.start();
        syncJob.status = 'running';
        syncJob.nextSync = syncJob.cronJob.getNextDates().next().value;
      }

      this.syncJobs.set(jobId, syncJob);

      this.emit('sync_job_started', {
        jobId,
        templateId,
        asanaProjectId,
        initialResult
      });

      return jobId;
    } catch (error) {
      this.emit('error', {
        type: 'sync_job_error',
        message: 'Failed to start bidirectional sync',
        templateId,
        asanaProjectId,
        error
      });
      throw error;
    }
  }

  /**
   * Stop a running sync job
   */
  async stopBidirectionalSync(jobId: string): Promise<void> {
    const syncJob = this.syncJobs.get(jobId);
    if (!syncJob) {
      throw new Error(`Sync job ${jobId} not found`);
    }

    if (syncJob.cronJob) {
      syncJob.cronJob.stop();
    }

    syncJob.status = 'stopped';
    this.syncJobs.set(jobId, syncJob);

    this.emit('sync_job_stopped', { jobId });
  }

  /**
   * Execute a single sync operation
   */
  private async executeSyncJob(jobId: string): Promise<SyncResult> {
    const syncJob = this.syncJobs.get(jobId);
    if (!syncJob) {
      throw new Error(`Sync job ${jobId} not found`);
    }

    const result: SyncResult = {
      success: true,
      syncedTasks: 0,
      errors: [],
      conflicts: [],
      lastSyncTime: new Date()
    };

    try {
      this.emit('sync_started', { jobId });

      // Get current Asana project state
      const asanaTasks = await this.getAsanaProjectTasks(syncJob.asanaProjectId);
      
      // Get current template state (this would interface with your template system)
      const templateTasks = await this.getTemplateTasks(syncJob.templateId);

      // Perform bidirectional sync
      const syncState = this.syncStates.get(jobId);
      if (!syncState) {
        throw new Error(`Sync state not found for job ${jobId}`);
      }

      // Sync from template to Asana
      if (syncJob.options.bidirectional) {
        const templateToAsanaResult = await this.syncTemplateToAsana(
          templateTasks,
          asanaTasks,
          syncJob.options,
          syncState
        );
        result.syncedTasks += templateToAsanaResult.syncedTasks;
        result.errors.push(...templateToAsanaResult.errors);
        result.conflicts.push(...templateToAsanaResult.conflicts);
      }

      // Sync from Asana to template
      if (syncJob.options.bidirectional) {
        const asanaToTemplateResult = await this.syncAsanaToTemplate(
          asanaTasks,
          templateTasks,
          syncJob.options,
          syncState
        );
        result.syncedTasks += asanaToTemplateResult.syncedTasks;
        result.errors.push(...asanaToTemplateResult.errors);
        result.conflicts.push(...asanaToTemplateResult.conflicts);
      }

      // Update sync statistics
      syncJob.stats.totalSyncs++;
      if (result.errors.length === 0) {
        syncJob.stats.successfulSyncs++;
      } else {
        syncJob.stats.failedSyncs++;
      }
      syncJob.stats.conflictsResolved += result.conflicts.length;
      syncJob.lastSync = result.lastSyncTime;

      // Update sync state
      await this.updateSyncState(jobId, syncState);

      this.emit('sync_completed', { jobId, result });
      return result;

    } catch (error) {
      result.success = false;
      result.errors.push({
        type: 'api_error',
        message: 'Sync execution failed',
        taskId: undefined,
        fieldName: undefined
      });

      syncJob.stats.failedSyncs++;

      this.emit('sync_error', { jobId, error });
      throw error;
    }
  }

  /**
   * Sync changes from template to Asana
   */
  private async syncTemplateToAsana(
    templateTasks: TemplateTask[],
    asanaTasks: AsanaTask[],
    options: SyncOptions,
    syncState: SyncState
  ): Promise<Partial<SyncResult>> {
    const result: Partial<SyncResult> = {
      syncedTasks: 0,
      errors: [],
      conflicts: []
    };

    const asanaTaskMap = new Map(asanaTasks.map(t => [t.gid, t]));

    for (const templateTask of templateTasks) {
      try {
        const taskState = syncState.taskStates.get(templateTask.id);
        if (!taskState) continue;

        const asanaTask = asanaTaskMap.get(taskState.asanaGid);
        if (!asanaTask) continue;

        // Check for field changes
        for (const fieldName of options.syncFields) {
          const fieldState = taskState.fieldStates.get(fieldName);
          if (!fieldState) continue;

          const templateValue = this.getTemplateFieldValue(templateTask, fieldName);
          const asanaValue = this.getAsanaFieldValue(asanaTask, fieldName);

          // Check if template value has changed
          const templateChecksum = this.calculateChecksum(templateValue);
          if (fieldState.checksum !== templateChecksum) {
            // Template value has changed, sync to Asana
            const conflict = this.detectConflict(
              templateValue,
              asanaValue,
              fieldState,
              taskState.lastModified
            );

            if (conflict) {
              result.conflicts!.push(conflict);
              const resolution = await this.resolveConflict(conflict, options.conflictResolution);
              if (resolution.resolution === 'template_wins') {
                await this.updateAsanaField(asanaTask.gid, fieldName, templateValue);
                result.syncedTasks!++;
              }
            } else {
              await this.updateAsanaField(asanaTask.gid, fieldName, templateValue);
              result.syncedTasks!++;
            }

            // Update field state
            fieldState.templateValue = templateValue;
            fieldState.asanaValue = asanaValue;
            fieldState.lastSynced = new Date();
            fieldState.checksum = templateChecksum;
          }
        }

      } catch (error) {
        result.errors!.push({
          type: 'sync_error',
          message: `Failed to sync template task ${templateTask.id}`,
          taskId: templateTask.id
        });
      }
    }

    return result;
  }

  /**
   * Sync changes from Asana to template
   */
  private async syncAsanaToTemplate(
    asanaTasks: AsanaTask[],
    templateTasks: TemplateTask[],
    options: SyncOptions,
    syncState: SyncState
  ): Promise<Partial<SyncResult>> {
    const result: Partial<SyncResult> = {
      syncedTasks: 0,
      errors: [],
      conflicts: []
    };

    const templateTaskMap = new Map(templateTasks.map(t => [t.id, t]));

    for (const asanaTask of asanaTasks) {
      try {
        // Find corresponding template task
        const taskState = Array.from(syncState.taskStates.values())
          .find(ts => ts.asanaGid === asanaTask.gid);
        
        if (!taskState) continue;

        const templateTask = templateTaskMap.get(taskState.templateId);
        if (!templateTask) continue;

        // Check for field changes
        for (const fieldName of options.syncFields) {
          const fieldState = taskState.fieldStates.get(fieldName);
          if (!fieldState) continue;

          const asanaValue = this.getAsanaFieldValue(asanaTask, fieldName);
          const templateValue = this.getTemplateFieldValue(templateTask, fieldName);

          // Check if Asana value has changed
          const asanaChecksum = this.calculateChecksum(asanaValue);
          if (fieldState.checksum !== asanaChecksum) {
            // Asana value has changed, sync to template
            const conflict = this.detectConflict(
              templateValue,
              asanaValue,
              fieldState,
              taskState.lastModified
            );

            if (conflict) {
              result.conflicts!.push(conflict);
              const resolution = await this.resolveConflict(conflict, options.conflictResolution);
              if (resolution.resolution === 'asana_wins') {
                await this.updateTemplateField(templateTask.id, fieldName, asanaValue);
                result.syncedTasks!++;
              }
            } else {
              await this.updateTemplateField(templateTask.id, fieldName, asanaValue);
              result.syncedTasks!++;
            }

            // Update field state
            fieldState.templateValue = templateValue;
            fieldState.asanaValue = asanaValue;
            fieldState.lastSynced = new Date();
            fieldState.checksum = asanaChecksum;
          }
        }

      } catch (error) {
        result.errors!.push({
          type: 'sync_error',
          message: `Failed to sync Asana task ${asanaTask.gid}`,
          taskId: asanaTask.gid
        });
      }
    }

    return result;
  }

  /**
   * Handle Asana webhook events for real-time sync
   */
  async handleAsanaWebhook(webhookData: WebhookEvent): Promise<void> {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(webhookData)) {
        throw new Error('Invalid webhook signature');
      }

      // Find relevant sync jobs
      const relevantJobs = Array.from(this.syncJobs.values())
        .filter(job => job.options.webhookEnabled && job.status === 'running');

      for (const job of relevantJobs) {
        // Check if this webhook event is relevant to the job
        if (this.isWebhookRelevant(webhookData, job)) {
          // Trigger immediate sync for this job
          await this.executeSyncJob(job.id);
        }
      }

      this.emit('webhook_processed', { webhookData });

    } catch (error) {
      this.emit('error', {
        type: 'webhook_error',
        message: 'Failed to process webhook',
        error
      });
      throw error;
    }
  }

  /**
   * Resolve sync conflicts based on resolution strategy
   */
  async resolveConflicts(
    conflicts: SyncConflict[],
    strategy: 'template_wins' | 'asana_wins' | 'manual' = 'manual'
  ): Promise<ConflictResolution[]> {
    const resolutions: ConflictResolution[] = [];

    for (const conflict of conflicts) {
      const resolution = await this.resolveConflict(conflict, strategy);
      resolutions.push(resolution);
    }

    return resolutions;
  }

  /**
   * Get sync job status and statistics
   */
  getSyncJobStatus(jobId: string): SyncJob | undefined {
    return this.syncJobs.get(jobId);
  }

  /**
   * Get all active sync jobs
   */
  getAllSyncJobs(): SyncJob[] {
    return Array.from(this.syncJobs.values());
  }

  // Private helper methods

  private generateJobId(templateId: string, asanaProjectId: string): string {
    return createHash('sha256')
      .update(`${templateId}:${asanaProjectId}`)
      .digest('hex')
      .substring(0, 16);
  }

  private intervalToCron(intervalMs: number): string {
    const minutes = Math.floor(intervalMs / 60000);
    if (minutes < 60) {
      return `*/${minutes} * * * *`;
    }
    const hours = Math.floor(minutes / 60);
    return `0 */${hours} * * *`;
  }

  private async initializeSyncState(
    templateId: string,
    asanaProjectId: string
  ): Promise<void> {
    const jobId = this.generateJobId(templateId, asanaProjectId);
    
    const syncState: SyncState = {
      lastSyncHash: '',
      lastModified: new Date(),
      fieldChecksums: new Map(),
      taskStates: new Map()
    };

    // Initialize task states
    const asanaTasks = await this.getAsanaProjectTasks(asanaProjectId);
    const templateTasks = await this.getTemplateTasks(templateId);

    // Map template tasks to Asana tasks (this would use your mapping logic)
    for (const templateTask of templateTasks) {
      const asanaTask = asanaTasks.find(at => 
        this.findAsanaTaskForTemplate(at, templateTask)
      );

      if (asanaTask) {
        const taskState: TaskSyncState = {
          asanaGid: asanaTask.gid,
          templateId: templateTask.id,
          lastModified: {
            template: new Date(),
            asana: new Date(asanaTask.modified_at || Date.now())
          },
          fieldStates: new Map()
        };

        // Initialize field states
        const syncFields = ['name', 'completed', 'due_date', 'assignee']; // Default fields
        for (const fieldName of syncFields) {
          const templateValue = this.getTemplateFieldValue(templateTask, fieldName);
          const asanaValue = this.getAsanaFieldValue(asanaTask, fieldName);

          taskState.fieldStates.set(fieldName, {
            templateValue,
            asanaValue,
            lastSynced: new Date(),
            checksum: this.calculateChecksum(templateValue)
          });
        }

        syncState.taskStates.set(templateTask.id, taskState);
      }
    }

    this.syncStates.set(jobId, syncState);
  }

  private async updateSyncState(jobId: string, syncState: SyncState): Promise<void> {
    syncState.lastModified = new Date();
    this.syncStates.set(jobId, syncState);
  }

  private calculateChecksum(value: any): string {
    return createHash('md5')
      .update(JSON.stringify(value))
      .digest('hex');
  }

  private detectConflict(
    templateValue: any,
    asanaValue: any,
    fieldState: FieldSyncState,
    lastModified: { template: Date; asana: Date }
  ): SyncConflict | null {
    // If values are the same, no conflict
    if (JSON.stringify(templateValue) === JSON.stringify(asanaValue)) {
      return null;
    }

    // If both have changed since last sync, it's a conflict
    const templateChanged = JSON.stringify(templateValue) !== JSON.stringify(fieldState.templateValue);
    const asanaChanged = JSON.stringify(asanaValue) !== JSON.stringify(fieldState.asanaValue);

    if (templateChanged && asanaChanged) {
      return {
        taskId: '', // Would be filled by caller
        fieldName: '', // Would be filled by caller
        templateValue,
        asanaValue,
        lastModified
      };
    }

    return null;
  }

  private async resolveConflict(
    conflict: SyncConflict,
    strategy: 'template_wins' | 'asana_wins' | 'manual'
  ): Promise<ConflictResolution> {
    const resolution: ConflictResolution = {
      taskId: conflict.taskId,
      fieldName: conflict.fieldName,
      resolution: strategy === 'manual' ? 'skip' : strategy,
      timestamp: new Date()
    };

    if (strategy === 'template_wins') {
      resolution.resolvedValue = conflict.templateValue;
    } else if (strategy === 'asana_wins') {
      resolution.resolvedValue = conflict.asanaValue;
    }

    this.emit('conflict_resolved', resolution);
    return resolution;
  }

  private verifyWebhookSignature(webhookData: any): boolean {
    // Implement webhook signature verification
    // This would use the webhook secret to verify the incoming request
    return true; // Placeholder
  }

  private isWebhookRelevant(webhookData: WebhookEvent, job: SyncJob): boolean {
    // Check if the webhook event is related to the job's Asana project
    return webhookData.resource.resource_type === 'task' || 
           webhookData.resource.resource_type === 'project';
  }

  private findAsanaTaskForTemplate(asanaTask: AsanaTask, templateTask: TemplateTask): boolean {
    // This would implement your logic for matching Asana tasks to template tasks
    // Could be based on name, custom fields, or stored mappings
    return asanaTask.name === templateTask.name;
  }

  private getTemplateFieldValue(task: TemplateTask, fieldName: string): any {
    // Extract field value from template task
    switch (fieldName) {
      case 'name': return task.name;
      case 'description': return task.description;
      case 'completed': return false; // Templates don't have completion status
      case 'assigneeRole': return task.assigneeRole;
      case 'priority': return task.priority;
      default: return task.customFields?.[fieldName];
    }
  }

  private getAsanaFieldValue(task: AsanaTask, fieldName: string): any {
    // Extract field value from Asana task
    switch (fieldName) {
      case 'name': return task.name;
      case 'completed': return task.completed;
      case 'due_date': return task.due_date;
      case 'assignee': return task.assignee?.gid;
      default: return task.custom_fields[fieldName];
    }
  }

  private async updateAsanaField(taskGid: string, fieldName: string, value: any): Promise<void> {
    // Update field in Asana
    const updateData: any = {};
    updateData[fieldName] = value;
    await this.client.tasks.updateTask(taskGid, updateData);
  }

  private async updateTemplateField(taskId: string, fieldName: string, value: any): Promise<void> {
    // Update field in template system
    // This would interface with your template storage/management system
    this.emit('template_field_updated', { taskId, fieldName, value });
  }

  private async getAsanaProjectTasks(projectId: string): Promise<AsanaTask[]> {
    const response = await this.client.tasks.getTasksForProject(projectId, {
      opt_fields: 'name,completed,assignee,due_date,custom_fields,modified_at,parent'
    });
    return response.data as AsanaTask[];
  }

  private async getTemplateTasks(templateId: string): Promise<TemplateTask[]> {
    // This would interface with your template system to get current task state
    // For now, return empty array
    return [];
  }

  /**
   * Clean up resources
   */
  async shutdown(): Promise<void> {
    // Stop all cron jobs
    for (const job of this.syncJobs.values()) {
      if (job.cronJob) {
        job.cronJob.stop();
      }
    }

    this.syncJobs.clear();
    this.syncStates.clear();
    this.removeAllListeners();
  }
}

export default AsanaSyncEngine;

