#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const connector_1 = require("./connector");
const sync_engine_1 = require("./sync-engine");
const webhook_server_1 = require("./webhook-server");
const asana_client_1 = require("./asana-client");
// Load environment variables
dotenv_1.default.config();
const program = new commander_1.Command();
class AsanaCLI {
    constructor() {
        this.config = {};
        this.loadConfig();
    }
    loadConfig() {
        try {
            const configPath = path_1.default.join(process.cwd(), '.asana-config.json');
            if (fs_1.default.existsSync(configPath)) {
                const configFile = fs_1.default.readFileSync(configPath, 'utf8');
                this.config = JSON.parse(configFile);
            }
            // Override with environment variables
            const asanaAccessToken = process.env.ASANA_ACCESS_TOKEN || this.config.asanaAccessToken;
            if (asanaAccessToken !== undefined)
                this.config.asanaAccessToken = asanaAccessToken;
            const defaultWorkspace = process.env.ASANA_DEFAULT_WORKSPACE || this.config.defaultWorkspace;
            if (defaultWorkspace !== undefined)
                this.config.defaultWorkspace = defaultWorkspace;
            const webhookSecret = process.env.ASANA_WEBHOOK_SECRET || this.config.webhookSecret;
            if (webhookSecret !== undefined)
                this.config.webhookSecret = webhookSecret;
            this.config.serverPort = parseInt(process.env.SERVER_PORT || '3000') || this.config.serverPort || 3000;
        }
        catch (error) {
            console.warn(chalk_1.default.yellow('Warning: Could not load configuration file'));
        }
    }
    saveConfig() {
        try {
            const configPath = path_1.default.join(process.cwd(), '.asana-config.json');
            fs_1.default.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
            console.log(chalk_1.default.green('✓ Configuration saved'));
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to save configuration'));
        }
    }
    async initializeConnector() {
        if (!this.config.asanaAccessToken) {
            throw new Error('Asana access token is required. Run "asana-cli configure" first.');
        }
        if (!this.connector) {
            this.connector = new connector_1.AsanaConnector({
                accessToken: this.config.asanaAccessToken,
                ...(this.config.defaultWorkspace !== undefined ? { defaultWorkspace: this.config.defaultWorkspace } : {})
            });
        }
        return this.connector;
    }
    async initializeSyncEngine() {
        if (!this.syncEngine) {
            const client = (0, asana_client_1.createAsanaClient)({ accessToken: this.config.asanaAccessToken });
            this.syncEngine = new sync_engine_1.AsanaSyncEngine(client, this.config.webhookSecret || 'default-secret');
        }
        return this.syncEngine;
    }
    async configure() {
        console.log(chalk_1.default.blue('🔧 Configuring Asana Integration'));
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'asanaAccessToken',
                message: 'Asana Access Token:',
                default: this.config.asanaAccessToken,
                validate: (input) => input.length > 0 || 'Access token is required'
            },
            {
                type: 'input',
                name: 'defaultWorkspace',
                message: 'Default Workspace ID (optional):',
                default: this.config.defaultWorkspace
            },
            {
                type: 'input',
                name: 'webhookSecret',
                message: 'Webhook Secret:',
                default: this.config.webhookSecret || 'pm-tools-webhook-secret',
                validate: (input) => input.length > 0 || 'Webhook secret is required'
            },
            {
                type: 'number',
                name: 'serverPort',
                message: 'Webhook Server Port:',
                default: this.config.serverPort || 3000,
                validate: (input) => (input > 0 && input < 65536) || 'Port must be between 1 and 65535'
            }
        ]);
        this.config = { ...this.config, ...answers };
        this.saveConfig();
        // Test connection
        try {
            await this.initializeConnector();
            console.log(chalk_1.default.green('✓ Configuration saved and connection verified'));
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to verify connection:'), error instanceof Error ? error.message : error);
        }
    }
    async listWorkspaces() {
        try {
            await this.initializeConnector();
            const client = (0, asana_client_1.createAsanaClient)({ accessToken: this.config.asanaAccessToken });
            console.log(chalk_1.default.blue('📋 Available Workspaces:'));
            const workspaces = await client.workspaces.getWorkspaces();
            workspaces.data.forEach((workspace, index) => {
                console.log(`${index + 1}. ${chalk_1.default.cyan(workspace.name)} (${workspace.gid})`);
            });
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to list workspaces:'), error instanceof Error ? error.message : error);
        }
    }
    async listTeams(workspaceId) {
        try {
            const connector = await this.initializeConnector();
            const targetWorkspace = workspaceId || this.config.defaultWorkspace;
            if (!targetWorkspace) {
                throw new Error('Workspace ID is required. Provide it as an argument or set a default workspace.');
            }
            console.log(chalk_1.default.blue(`👥 Teams in Workspace ${targetWorkspace}:`));
            const teams = await connector.getWorkspaceTeams(targetWorkspace);
            teams.forEach((team, index) => {
                console.log(`${index + 1}. ${chalk_1.default.cyan(team.name)} (${team.gid})`);
            });
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to list teams:'), error instanceof Error ? error.message : error);
        }
    }
    async listTemplates() {
        try {
            const templatesDir = path_1.default.join(__dirname, '..', 'examples', 'templates');
            if (!fs_1.default.existsSync(templatesDir)) {
                throw new Error('Templates directory not found');
            }
            console.log(chalk_1.default.blue('📄 Available Templates:'));
            const templateFiles = fs_1.default.readdirSync(templatesDir).filter(file => file.endsWith('.json'));
            templateFiles.forEach((file, index) => {
                const filePath = path_1.default.join(templatesDir, file);
                const templateData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
                console.log(`${index + 1}. ${chalk_1.default.cyan(templateData.name)} (${templateData.methodology})`);
                console.log(`   ${chalk_1.default.gray(templateData.metadata.description)}`);
                console.log(`   ${chalk_1.default.yellow(`Complexity: ${templateData.metadata.complexity}, Duration: ${templateData.metadata.estimatedDuration}`)}`);
                console.log();
            });
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to list templates:'), error instanceof Error ? error.message : error);
        }
    }
    async createProject() {
        try {
            const connector = await this.initializeConnector();
            // List available templates
            const templatesDir = path_1.default.join(__dirname, '..', 'examples', 'templates');
            const templateFiles = fs_1.default.readdirSync(templatesDir).filter(file => file.endsWith('.json'));
            const templateChoices = templateFiles.map(file => {
                const templateData = JSON.parse(fs_1.default.readFileSync(path_1.default.join(templatesDir, file), 'utf8'));
                return {
                    name: `${templateData.name} (${templateData.methodology})`,
                    value: file
                };
            });
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'template',
                    message: 'Select a template:',
                    choices: templateChoices
                },
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'Project Name:',
                    validate: (input) => input.length > 0 || 'Project name is required'
                },
                {
                    type: 'input',
                    name: 'description',
                    message: 'Project Description (optional):'
                },
                {
                    type: 'input',
                    name: 'workspaceId',
                    message: 'Workspace ID:',
                    default: this.config.defaultWorkspace,
                    validate: (input) => input.length > 0 || 'Workspace ID is required'
                },
                {
                    type: 'input',
                    name: 'teamId',
                    message: 'Team ID (optional):'
                }
            ]);
            // Load template
            const templatePath = path_1.default.join(templatesDir, answers.template);
            const template = JSON.parse(fs_1.default.readFileSync(templatePath, 'utf8'));
            console.log(chalk_1.default.blue('🚀 Creating project...'));
            // Configure workspace if not already done
            await connector.configureWorkspace(answers.workspaceId, {
                defaultProjectSettings: {
                    layout: 'list',
                    privacy_setting: 'public_to_team'
                }
            });
            // Create project
            const project = await connector.createProjectFromTemplate(template, answers.workspaceId, {
                teamId: answers.teamId || undefined,
                projectData: {
                    name: answers.projectName,
                    description: answers.description
                }
            });
            console.log(chalk_1.default.green('✓ Project created successfully!'));
            console.log(`Project ID: ${chalk_1.default.cyan(project.gid)}`);
            console.log(`Project Name: ${chalk_1.default.cyan(project.name)}`);
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to create project:'), error instanceof Error ? error.message : error);
        }
    }
    async startSync() {
        try {
            const syncEngine = await this.initializeSyncEngine();
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'templateId',
                    message: 'Template ID:',
                    validate: (input) => input.length > 0 || 'Template ID is required'
                },
                {
                    type: 'input',
                    name: 'asanaProjectId',
                    message: 'Asana Project ID:',
                    validate: (input) => input.length > 0 || 'Asana Project ID is required'
                },
                {
                    type: 'number',
                    name: 'syncInterval',
                    message: 'Sync Interval (minutes):',
                    default: 15,
                    validate: (input) => input > 0 || 'Sync interval must be positive'
                },
                {
                    type: 'list',
                    name: 'conflictResolution',
                    message: 'Conflict Resolution Strategy:',
                    choices: ['asana_wins', 'template_wins', 'manual']
                }
            ]);
            console.log(chalk_1.default.blue('🔄 Starting synchronization...'));
            const jobId = await syncEngine.startBidirectionalSync(answers.templateId, answers.asanaProjectId, {
                syncInterval: answers.syncInterval * 60 * 1000, // Convert to milliseconds
                conflictResolution: answers.conflictResolution,
                syncFields: ['name', 'completed', 'due_date', 'assignee'],
                bidirectional: true,
                webhookEnabled: true
            });
            console.log(chalk_1.default.green('✓ Synchronization started!'));
            console.log(`Job ID: ${chalk_1.default.cyan(jobId)}`);
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to start synchronization:'), error instanceof Error ? error.message : error);
        }
    }
    async listSyncJobs() {
        try {
            const syncEngine = await this.initializeSyncEngine();
            console.log(chalk_1.default.blue('🔄 Active Sync Jobs:'));
            const jobs = syncEngine.getAllSyncJobs();
            if (jobs.length === 0) {
                console.log(chalk_1.default.gray('No active sync jobs'));
                return;
            }
            jobs.forEach((job, index) => {
                console.log(`${index + 1}. ${chalk_1.default.cyan(job.id)}`);
                console.log(`   Template: ${job.templateId}`);
                console.log(`   Asana Project: ${job.asanaProjectId}`);
                console.log(`   Status: ${this.getStatusColor(job.status)(job.status)}`);
                console.log(`   Last Sync: ${job.lastSync ? job.lastSync.toLocaleString() : 'Never'}`);
                console.log(`   Stats: ${job.stats.successfulSyncs}/${job.stats.totalSyncs} successful`);
                console.log();
            });
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to list sync jobs:'), error instanceof Error ? error.message : error);
        }
    }
    async startWebhookServer() {
        try {
            const connector = await this.initializeConnector();
            const syncEngine = await this.initializeSyncEngine();
            console.log(chalk_1.default.blue('🌐 Starting webhook server...'));
            this.webhookServer = new webhook_server_1.AsanaWebhookServer({
                port: this.config.serverPort,
                webhookSecret: this.config.webhookSecret,
                syncEngine,
                connector,
                enableLogging: true,
                logLevel: 'info',
                rateLimit: {
                    windowMs: 15 * 60 * 1000, // 15 minutes
                    maxRequests: 100
                }
            });
            // Set up event listeners
            this.webhookServer.on('webhook_processed', (event) => {
                const sanitizedGid = this.sanitizeLogInput(event.webhookEvent.gid);
                console.log(chalk_1.default.green('✓ Webhook processed:'), sanitizedGid);
            });
            this.webhookServer.on('webhook_error', (event) => {
                console.error(chalk_1.default.red('✗ Webhook error:'), event.error);
            });
            await this.webhookServer.start();
            console.log(chalk_1.default.green(`✓ Webhook server started on port ${this.config.serverPort}`));
            console.log(chalk_1.default.gray('Press Ctrl+C to stop the server'));
            // Handle graceful shutdown
            process.on('SIGINT', async () => {
                console.log(chalk_1.default.yellow('\n📡 Shutting down webhook server...'));
                await this.webhookServer?.shutdown();
            });
        }
        catch (error) {
            console.error(chalk_1.default.red('✗ Failed to start webhook server:'), error instanceof Error ? error.message : error);
        }
    }
    getStatusColor(status) {
        switch (status) {
            case 'running': return chalk_1.default.green;
            case 'stopped': return chalk_1.default.yellow;
            case 'error': return chalk_1.default.red;
            default: return chalk_1.default.gray;
        }
    }
    /**
     * Sanitize input for log output to prevent log injection attacks
     */
    sanitizeLogInput(input) {
        if (typeof input !== 'string') {
            input = String(input);
        }
        // Remove control characters and newlines that could be used for log injection
        return input.replace(/[\r\n\x00-\x1f\x7f-\x9f]/g, '');
    }
    async generateTemplate() {
        console.log(chalk_1.default.blue('📄 Generate New Template'));
        const answers = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Template Name:',
                validate: (input) => input.length > 0 || 'Template name is required'
            },
            {
                type: 'list',
                name: 'methodology',
                message: 'Methodology:',
                choices: ['Traditional', 'Agile', 'Hybrid']
            },
            {
                type: 'list',
                name: 'complexity',
                message: 'Complexity:',
                choices: ['Basic', 'Intermediate', 'Advanced']
            },
            {
                type: 'input',
                name: 'description',
                message: 'Description:',
                validate: (input) => input.length > 0 || 'Description is required'
            }
        ]);
        const templateId = answers.name.toLowerCase().replace(/\s+/g, '-');
        const template = {
            id: `${templateId}-v1.0`,
            name: answers.name,
            methodology: answers.methodology,
            version: '1.0.0',
            fields: [],
            tasks: [],
            dependencies: [],
            metadata: {
                category: `${answers.methodology} Templates`,
                tags: [answers.methodology, 'Generated'],
                complexity: answers.complexity,
                estimatedDuration: 'TBD',
                description: answers.description,
                author: 'PM Tools Templates',
                lastModified: new Date().toISOString()
            }
        };
        const templatesDir = path_1.default.join(__dirname, '..', 'examples', 'templates');
        const templatePath = path_1.default.join(templatesDir, `${templateId}.json`);
        if (!fs_1.default.existsSync(templatesDir)) {
            fs_1.default.mkdirSync(templatesDir, { recursive: true });
        }
        fs_1.default.writeFileSync(templatePath, JSON.stringify(template, null, 2));
        console.log(chalk_1.default.green('✓ Template generated successfully!'));
        console.log(`Template saved to: ${chalk_1.default.cyan(templatePath)}`);
    }
}
// CLI Command Setup
const cli = new AsanaCLI();
program
    .name('asana-cli')
    .description('CLI tool for PM Tools Templates Asana Integration')
    .version('1.0.0');
program
    .command('configure')
    .description('Configure Asana integration settings')
    .action(() => cli.configure());
program
    .command('workspaces')
    .description('List available Asana workspaces')
    .action(() => cli.listWorkspaces());
program
    .command('teams')
    .description('List teams in a workspace')
    .argument('[workspace-id]', 'Workspace ID (optional if default is set)')
    .action((workspaceId) => cli.listTeams(workspaceId));
program
    .command('templates')
    .description('List available project templates')
    .action(() => cli.listTemplates());
program
    .command('create-project')
    .description('Create a new Asana project from a template')
    .action(() => cli.createProject());
program
    .command('start-sync')
    .description('Start bidirectional synchronization')
    .action(() => cli.startSync());
program
    .command('list-sync')
    .description('List active synchronization jobs')
    .action(() => cli.listSyncJobs());
program
    .command('webhook-server')
    .description('Start the webhook server for real-time synchronization')
    .action(() => cli.startWebhookServer());
program
    .command('generate-template')
    .description('Generate a new template scaffold')
    .action(() => cli.generateTemplate());
// Error handling
program.parseAsync(process.argv).catch((error) => {
    console.error(chalk_1.default.red('CLI Error:'), error.message);
    process.exit(1);
});
exports.default = AsanaCLI;
//# sourceMappingURL=cli.js.map