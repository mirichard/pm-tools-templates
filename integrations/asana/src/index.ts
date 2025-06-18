/**
 * PM Tools Templates - Asana Integration
 * 
 * Main entry point for the Asana integration module providing:
 * - Bi-directional synchronization between templates and Asana
 * - Project creation from methodology templates (PMBOK, Agile, Hybrid)
 * - Real-time webhook integration for instant updates
 * - CLI tools for easy management and automation
 * 
 * @version 1.0.0
 * @author PM Tools Templates
 */

// Core Components
export { 
  AsanaConnector,
  type AsanaConnectorConfig,
  type PMTemplate,
  type TemplateField,
  type TemplateTask,
  type TaskDependency,
  type FieldMapping,
  type AsanaProject,
  type AsanaTask,
  type AsanaCustomField,
  type WorkspaceConfig,
  type SyncOptions,
  type SyncResult,
  type SyncError,
  type SyncConflict
} from './connector';

// Sync Engine
export {
  AsanaSyncEngine,
  type SyncJob,
  type ConflictResolution,
  type SyncState,
  type TaskSyncState,
  type FieldSyncState,
  type WebhookEvent
} from './sync-engine';

// Webhook Server
export {
  AsanaWebhookServer,
  type WebhookServerConfig,
  type WebhookSubscription
} from './webhook-server';

// CLI Tool
export { default as AsanaCLI } from './cli';

// Utility Functions
export const AsanaIntegrationUtils = {
  /**
   * Validate template structure
   */
  validateTemplate: (template: any): boolean => {
    const requiredFields = ['id', 'name', 'methodology', 'version', 'fields', 'tasks', 'dependencies', 'metadata'];
    return requiredFields.every(field => field in template);
  },

  /**
   * Generate field mapping suggestions
   */
  suggestFieldMappings: (templateFields: any[], asanaFields: any[]): any[] => {
    const mappings: any[] = [];
    
    templateFields.forEach(templateField => {
      const matchingAsanaField = asanaFields.find(asanaField => {
        const templateName = templateField.name.toLowerCase().replace(/[_\s]/g, '');
        const asanaName = asanaField.name.toLowerCase().replace(/[_\s]/g, '');
        return templateName === asanaName || 
               templateName.includes(asanaName) || 
               asanaName.includes(templateName);
      });

      if (matchingAsanaField) {
        mappings.push({
          templateField: templateField.name,
          asanaField: matchingAsanaField.name,
          asanaFieldGid: matchingAsanaField.gid,
          dataType: matchingAsanaField.type,
          required: templateField.required,
          confidence: 'high'
        });
      }
    });

    return mappings;
  },

  /**
   * Convert template complexity to Asana priority
   */
  complexityToPriority: (complexity: string): string => {
    switch (complexity.toLowerCase()) {
      case 'basic': return 'Low';
      case 'intermediate': return 'Medium';
      case 'advanced': return 'High';
      default: return 'Medium';
    }
  },

  /**
   * Calculate project health score based on sync metrics
   */
  calculateProjectHealth: (syncResult: any): number => {
    if (!syncResult || syncResult.totalSyncs === 0) return 100;
    
    const successRate = (syncResult.successfulSyncs / syncResult.totalSyncs) * 100;
    const errorPenalty = syncResult.errors.length * 5;
    const conflictPenalty = syncResult.conflicts.length * 3;
    
    return Math.max(0, Math.min(100, successRate - errorPenalty - conflictPenalty));
  },

  /**
   * Generate project timeline based on template tasks
   */
  generateTimeline: (tasks: any[], startDate: Date, workingDaysPerWeek: number = 5): any[] => {
    const timeline: any[] = [];
    const msPerDay = 24 * 60 * 60 * 1000;
    const msPerWorkingDay = msPerDay * (7 / workingDaysPerWeek);
    
    let currentDate = new Date(startDate);
    
    tasks.forEach(task => {
      const estimatedDays = Math.ceil((task.estimatedHours || 8) / 8);
      const durationMs = estimatedDays * msPerWorkingDay;
      
      timeline.push({
        taskId: task.id,
        taskName: task.name,
        startDate: new Date(currentDate),
        endDate: new Date(currentDate.getTime() + durationMs),
        duration: estimatedDays,
        dependencies: task.dependencies || []
      });
      
      currentDate = new Date(currentDate.getTime() + durationMs);
    });
    
    return timeline;
  },

  /**
   * Validate Asana workspace configuration
   */
  validateWorkspaceConfig: (config: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!config.workspaceId) {
      errors.push('Workspace ID is required');
    }
    
    if (!config.defaultProjectSettings) {
      errors.push('Default project settings are required');
    } else {
      const validLayouts = ['list', 'board', 'timeline', 'calendar'];
      if (!validLayouts.includes(config.defaultProjectSettings.layout)) {
        errors.push('Invalid project layout');
      }
      
      const validPrivacySettings = ['public_to_workspace', 'public_to_team', 'private'];
      if (!validPrivacySettings.includes(config.defaultProjectSettings.privacy_setting)) {
        errors.push('Invalid privacy setting');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// Version and metadata
export const VERSION = '1.0.0';
export const SUPPORTED_METHODOLOGIES = ['PMBOK', 'Agile', 'Hybrid'] as const;
export const DEFAULT_SYNC_FIELDS = ['name', 'completed', 'due_date', 'assignee', 'priority'] as const;

/**
 * Quick setup function for basic Asana integration
 */
export async function quickSetup(options: {
  accessToken: string;
  workspaceId: string;
  webhookSecret?: string;
}): Promise<{
  connector: AsanaConnector;
  syncEngine: AsanaSyncEngine;
  webhookServer?: AsanaWebhookServer;
}> {
  const { accessToken, workspaceId, webhookSecret } = options;
  
  // Initialize connector
  const connector = new AsanaConnector({
    accessToken,
    defaultWorkspace: workspaceId
  });
  
  // Configure workspace
  await connector.configureWorkspace(workspaceId, {
    defaultProjectSettings: {
      layout: 'list',
      privacy_setting: 'public_to_team'
    }
  });
  
  // Initialize sync engine
  const { Client } = await import('asana');
  const client = Client.create().useAccessToken(accessToken);
  const syncEngine = new AsanaSyncEngine(client, webhookSecret || 'default-secret');
  
  let webhookServer: AsanaWebhookServer | undefined;
  
  // Initialize webhook server if secret provided
  if (webhookSecret) {
    webhookServer = new AsanaWebhookServer({
      port: 3000,
      webhookSecret,
      syncEngine,
      connector,
      enableLogging: true
    });
  }
  
  return {
    connector,
    syncEngine,
    webhookServer
  };
}

/**
 * Load template from file
 */
export async function loadTemplate(templatePath: string): Promise<PMTemplate> {
  const fs = await import('fs');
  const path = await import('path');
  
  const fullPath = path.resolve(templatePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Template file not found: ${fullPath}`);
  }
  
  try {
    const templateContent = fs.readFileSync(fullPath, 'utf8');
    const template = JSON.parse(templateContent);
    
    if (!AsanaIntegrationUtils.validateTemplate(template)) {
      throw new Error('Invalid template structure');
    }
    
    return template as PMTemplate;
  } catch (error) {
    throw new Error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create project from template with minimal configuration
 */
export async function createProjectFromTemplate(
  connector: AsanaConnector,
  templatePath: string,
  projectData: {
    name: string;
    workspaceId: string;
    description?: string;
    teamId?: string;
  }
): Promise<AsanaProject> {
  const template = await loadTemplate(templatePath);
  
  // Configure workspace if not already configured
  await connector.configureWorkspace(projectData.workspaceId, {
    defaultProjectSettings: {
      layout: 'list',
      privacy_setting: 'public_to_team'
    }
  });
  
  return connector.createProjectFromTemplate(template, projectData.workspaceId, {
    teamId: projectData.teamId,
    projectData: {
      name: projectData.name,
      description: projectData.description
    }
  });
}

// Export default object for convenience
export default {
  AsanaConnector,
  AsanaSyncEngine,
  AsanaWebhookServer,
  AsanaCLI,
  AsanaIntegrationUtils,
  quickSetup,
  loadTemplate,
  createProjectFromTemplate,
  VERSION,
  SUPPORTED_METHODOLOGIES,
  DEFAULT_SYNC_FIELDS
};

