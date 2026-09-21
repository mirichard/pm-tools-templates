"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SYNC_FIELDS = exports.SUPPORTED_METHODOLOGIES = exports.VERSION = exports.AsanaIntegrationUtils = exports.AsanaCLI = exports.AsanaWebhookServer = exports.AsanaSyncEngine = exports.AsanaConnector = void 0;
exports.quickSetup = quickSetup;
exports.loadTemplate = loadTemplate;
exports.createProjectFromTemplate = createProjectFromTemplate;
const connector_1 = require("./connector");
const sync_engine_1 = require("./sync-engine");
const webhook_server_1 = require("./webhook-server");
const cli_1 = __importDefault(require("./cli"));
// Core Components
var connector_2 = require("./connector");
Object.defineProperty(exports, "AsanaConnector", { enumerable: true, get: function () { return connector_2.AsanaConnector; } });
// Sync Engine
var sync_engine_2 = require("./sync-engine");
Object.defineProperty(exports, "AsanaSyncEngine", { enumerable: true, get: function () { return sync_engine_2.AsanaSyncEngine; } });
// Webhook Server
var webhook_server_2 = require("./webhook-server");
Object.defineProperty(exports, "AsanaWebhookServer", { enumerable: true, get: function () { return webhook_server_2.AsanaWebhookServer; } });
// CLI Tool
var cli_2 = require("./cli");
Object.defineProperty(exports, "AsanaCLI", { enumerable: true, get: function () { return __importDefault(cli_2).default; } });
// Utility Functions
exports.AsanaIntegrationUtils = {
    /**
     * Validate template structure
     */
    validateTemplate: (template) => {
        const requiredFields = ['id', 'name', 'methodology', 'version', 'fields', 'tasks', 'dependencies', 'metadata'];
        return requiredFields.every(field => field in template);
    },
    /**
     * Generate field mapping suggestions
     */
    suggestFieldMappings: (templateFields, asanaFields) => {
        const mappings = [];
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
    complexityToPriority: (complexity) => {
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
    calculateProjectHealth: (syncResult) => {
        if (!syncResult || syncResult.totalSyncs === 0)
            return 100;
        const successRate = (syncResult.successfulSyncs / syncResult.totalSyncs) * 100;
        const errorPenalty = syncResult.errors.length * 5;
        const conflictPenalty = syncResult.conflicts.length * 3;
        return Math.max(0, Math.min(100, successRate - errorPenalty - conflictPenalty));
    },
    /**
     * Generate project timeline based on template tasks
     */
    generateTimeline: (tasks, startDate, workingDaysPerWeek = 5) => {
        const timeline = [];
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
    validateWorkspaceConfig: (config) => {
        const errors = [];
        if (!config.workspaceId) {
            errors.push('Workspace ID is required');
        }
        if (!config.defaultProjectSettings) {
            errors.push('Default project settings are required');
        }
        else {
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
exports.VERSION = '1.0.0';
exports.SUPPORTED_METHODOLOGIES = ['Traditional', 'Agile', 'Hybrid'];
exports.DEFAULT_SYNC_FIELDS = ['name', 'completed', 'due_date', 'assignee', 'priority'];
/**
 * Quick setup function for basic Asana integration
 */
async function quickSetup(options) {
    const { accessToken, workspaceId, webhookSecret } = options;
    // Initialize connector
    const connector = new connector_1.AsanaConnector({
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
    const { Client } = await Promise.resolve().then(() => __importStar(require('asana')));
    const client = Client.create().useAccessToken(accessToken);
    const syncEngine = new sync_engine_1.AsanaSyncEngine(client, webhookSecret || 'default-secret');
    let webhookServer;
    // Initialize webhook server if secret provided
    if (webhookSecret) {
        webhookServer = new webhook_server_1.AsanaWebhookServer({
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
        ...(webhookServer !== undefined ? { webhookServer } : {})
    };
}
/**
 * Load template from file
 */
async function loadTemplate(templatePath) {
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    const path = await Promise.resolve().then(() => __importStar(require('path')));
    const fullPath = path.resolve(templatePath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`Template file not found: ${fullPath}`);
    }
    try {
        const templateContent = fs.readFileSync(fullPath, 'utf8');
        const template = JSON.parse(templateContent);
        if (!exports.AsanaIntegrationUtils.validateTemplate(template)) {
            throw new Error('Invalid template structure');
        }
        return template;
    }
    catch (error) {
        throw new Error(`Failed to load template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
/**
 * Create project from template with minimal configuration
 */
async function createProjectFromTemplate(connector, templatePath, projectData) {
    const template = await loadTemplate(templatePath);
    // Configure workspace if not already configured
    await connector.configureWorkspace(projectData.workspaceId, {
        defaultProjectSettings: {
            layout: 'list',
            privacy_setting: 'public_to_team'
        }
    });
    return connector.createProjectFromTemplate(template, projectData.workspaceId, {
        ...(projectData.teamId !== undefined ? { teamId: projectData.teamId } : {}),
        projectData: {
            name: projectData.name,
            ...(projectData.description !== undefined ? { description: projectData.description } : {})
        }
    });
}
// Export default object for convenience
exports.default = {
    AsanaConnector: connector_1.AsanaConnector,
    AsanaSyncEngine: sync_engine_1.AsanaSyncEngine,
    AsanaWebhookServer: webhook_server_1.AsanaWebhookServer,
    AsanaCLI: cli_1.default,
    AsanaIntegrationUtils: exports.AsanaIntegrationUtils,
    quickSetup,
    loadTemplate,
    createProjectFromTemplate,
    VERSION: exports.VERSION,
    SUPPORTED_METHODOLOGIES: exports.SUPPORTED_METHODOLOGIES,
    DEFAULT_SYNC_FIELDS: exports.DEFAULT_SYNC_FIELDS
};
//# sourceMappingURL=index.js.map