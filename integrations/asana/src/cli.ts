#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { AsanaConnector, PMTemplate } from './connector';
import { AsanaSyncEngine } from './sync-engine';
import { AsanaWebhookServer } from './webhook-server';
import { Client } from 'asana';

// Load environment variables
dotenv.config();

const program = new Command();

interface CLIConfig {
  asanaAccessToken?: string;
  defaultWorkspace?: string;
  webhookSecret?: string;
  serverPort?: number;
}

class AsanaCLI {
  private config: CLIConfig = {};
  private connector?: AsanaConnector;
  private syncEngine?: AsanaSyncEngine;
  private webhookServer?: AsanaWebhookServer;

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    try {
      const configPath = path.join(process.cwd(), '.asana-config.json');
      if (fs.existsSync(configPath)) {
        const configFile = fs.readFileSync(configPath, 'utf8');
        this.config = JSON.parse(configFile);
      }

      // Override with environment variables
      this.config.asanaAccessToken = process.env.ASANA_ACCESS_TOKEN || this.config.asanaAccessToken;
      this.config.defaultWorkspace = process.env.ASANA_DEFAULT_WORKSPACE || this.config.defaultWorkspace;
      this.config.webhookSecret = process.env.ASANA_WEBHOOK_SECRET || this.config.webhookSecret;
      this.config.serverPort = parseInt(process.env.SERVER_PORT || '3000') || this.config.serverPort || 3000;

    } catch (error) {
      console.warn(chalk.yellow('Warning: Could not load configuration file'));
    }
  }

  private saveConfig(): void {
    try {
      const configPath = path.join(process.cwd(), '.asana-config.json');
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
      console.log(chalk.green('✓ Configuration saved'));
    } catch (error) {
      console.error(chalk.red('✗ Failed to save configuration'));
    }
  }

  private async initializeConnector(): Promise<AsanaConnector> {
    if (!this.config.asanaAccessToken) {
      throw new Error('Asana access token is required. Run "asana-cli configure" first.');
    }

    if (!this.connector) {
      this.connector = new AsanaConnector({
        accessToken: this.config.asanaAccessToken,
        defaultWorkspace: this.config.defaultWorkspace
      });
    }

    return this.connector;
  }

  private async initializeSyncEngine(): Promise<AsanaSyncEngine> {
    if (!this.syncEngine) {
      const client = Client.create().useAccessToken(this.config.asanaAccessToken!);
      this.syncEngine = new AsanaSyncEngine(client, this.config.webhookSecret || 'default-secret');
    }

    return this.syncEngine;
  }

  async configure(): Promise<void> {
    console.log(chalk.blue('🔧 Configuring Asana Integration'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'asanaAccessToken',
        message: 'Asana Access Token:',
        default: this.config.asanaAccessToken,
        validate: (input: string) => input.length > 0 || 'Access token is required'
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
        validate: (input: string) => input.length > 0 || 'Webhook secret is required'
      },
      {
        type: 'number',
        name: 'serverPort',
        message: 'Webhook Server Port:',
        default: this.config.serverPort || 3000,
        validate: (input: number) => (input > 0 && input < 65536) || 'Port must be between 1 and 65535'
      }
    ]);

    this.config = { ...this.config, ...answers };
    this.saveConfig();

    // Test connection
    try {
      const connector = await this.initializeConnector();
      console.log(chalk.green('✓ Configuration saved and connection verified'));
    } catch (error) {
      console.error(chalk.red('✗ Failed to verify connection:'), error instanceof Error ? error.message : error);
    }
  }

  async listWorkspaces(): Promise<void> {
    try {
      const connector = await this.initializeConnector();
      const client = Client.create().useAccessToken(this.config.asanaAccessToken!);
      
      console.log(chalk.blue('📋 Available Workspaces:'));
      
      const workspaces = await client.workspaces.getWorkspaces();
      
      workspaces.data.forEach((workspace: any, index: number) => {
        console.log(`${index + 1}. ${chalk.cyan(workspace.name)} (${workspace.gid})`);
      });

    } catch (error) {
      console.error(chalk.red('✗ Failed to list workspaces:'), error instanceof Error ? error.message : error);
    }
  }

  async listTeams(workspaceId?: string): Promise<void> {
    try {
      const connector = await this.initializeConnector();
      
      const targetWorkspace = workspaceId || this.config.defaultWorkspace;
      if (!targetWorkspace) {
        throw new Error('Workspace ID is required. Provide it as an argument or set a default workspace.');
      }

      console.log(chalk.blue(`👥 Teams in Workspace ${targetWorkspace}:`));
      
      const teams = await connector.getWorkspaceTeams(targetWorkspace);
      
      teams.forEach((team, index) => {
        console.log(`${index + 1}. ${chalk.cyan(team.name)} (${team.gid})`);
      });

    } catch (error) {
      console.error(chalk.red('✗ Failed to list teams:'), error instanceof Error ? error.message : error);
    }
  }

  async listTemplates(): Promise<void> {
    try {
      const templatesDir = path.join(__dirname, '..', 'examples', 'templates');
      
      if (!fs.existsSync(templatesDir)) {
        throw new Error('Templates directory not found');
      }

      console.log(chalk.blue('📄 Available Templates:'));
      
      const templateFiles = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'));
      
      templateFiles.forEach((file, index) => {
        const filePath = path.join(templatesDir, file);
        const templateData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        console.log(`${index + 1}. ${chalk.cyan(templateData.name)} (${templateData.methodology})`);
        console.log(`   ${chalk.gray(templateData.metadata.description)}`);
        console.log(`   ${chalk.yellow(`Complexity: ${templateData.metadata.complexity}, Duration: ${templateData.metadata.estimatedDuration}`)}`);
        console.log();
      });

    } catch (error) {
      console.error(chalk.red('✗ Failed to list templates:'), error instanceof Error ? error.message : error);
    }
  }

  async createProject(): Promise<void> {
    try {
      const connector = await this.initializeConnector();
      
      // List available templates
      const templatesDir = path.join(__dirname, '..', 'examples', 'templates');
      const templateFiles = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'));
      
      const templateChoices = templateFiles.map(file => {
        const templateData = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf8'));
        return {
          name: `${templateData.name} (${templateData.methodology})`,
          value: file
        };
      });

      const answers = await inquirer.prompt([
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
          validate: (input: string) => input.length > 0 || 'Project name is required'
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
          validate: (input: string) => input.length > 0 || 'Workspace ID is required'
        },
        {
          type: 'input',
          name: 'teamId',
          message: 'Team ID (optional):'
        }
      ]);

      // Load template
      const templatePath = path.join(templatesDir, answers.template);
      const template: PMTemplate = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

      console.log(chalk.blue('🚀 Creating project...'));

      // Configure workspace if not already done
      await connector.configureWorkspace(answers.workspaceId, {
        defaultProjectSettings: {
          layout: 'list',
          privacy_setting: 'public_to_team'
        }
      });

      // Create project
      const project = await connector.createProjectFromTemplate(
        template,
        answers.workspaceId,
        {
          teamId: answers.teamId || undefined,
          projectData: {
            name: answers.projectName,
            description: answers.description
          }
        }
      );

      console.log(chalk.green('✓ Project created successfully!'));
      console.log(`Project ID: ${chalk.cyan(project.gid)}`);
      console.log(`Project Name: ${chalk.cyan(project.name)}`);

    } catch (error) {
      console.error(chalk.red('✗ Failed to create project:'), error instanceof Error ? error.message : error);
    }
  }

  async startSync(): Promise<void> {
    try {
      const syncEngine = await this.initializeSyncEngine();
      
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'templateId',
          message: 'Template ID:',
          validate: (input: string) => input.length > 0 || 'Template ID is required'
        },
        {
          type: 'input',
          name: 'asanaProjectId',
          message: 'Asana Project ID:',
          validate: (input: string) => input.length > 0 || 'Asana Project ID is required'
        },
        {
          type: 'number',
          name: 'syncInterval',
          message: 'Sync Interval (minutes):',
          default: 15,
          validate: (input: number) => input > 0 || 'Sync interval must be positive'
        },
        {
          type: 'list',
          name: 'conflictResolution',
          message: 'Conflict Resolution Strategy:',
          choices: ['asana_wins', 'template_wins', 'manual']
        }
      ]);

      console.log(chalk.blue('🔄 Starting synchronization...'));

      const jobId = await syncEngine.startBidirectionalSync(
        answers.templateId,
        answers.asanaProjectId,
        {
          syncInterval: answers.syncInterval * 60 * 1000, // Convert to milliseconds
          conflictResolution: answers.conflictResolution,
          syncFields: ['name', 'completed', 'due_date', 'assignee'],
          bidirectional: true,
          webhookEnabled: true
        }
      );

      console.log(chalk.green('✓ Synchronization started!'));
      console.log(`Job ID: ${chalk.cyan(jobId)}`);

    } catch (error) {
      console.error(chalk.red('✗ Failed to start synchronization:'), error instanceof Error ? error.message : error);
    }
  }

  async listSyncJobs(): Promise<void> {
    try {
      const syncEngine = await this.initializeSyncEngine();
      
      console.log(chalk.blue('🔄 Active Sync Jobs:'));
      
      const jobs = syncEngine.getAllSyncJobs();
      
      if (jobs.length === 0) {
        console.log(chalk.gray('No active sync jobs'));
        return;
      }

      jobs.forEach((job, index) => {
        console.log(`${index + 1}. ${chalk.cyan(job.id)}`);
        console.log(`   Template: ${job.templateId}`);
        console.log(`   Asana Project: ${job.asanaProjectId}`);
        console.log(`   Status: ${this.getStatusColor(job.status)(job.status)}`);
        console.log(`   Last Sync: ${job.lastSync ? job.lastSync.toLocaleString() : 'Never'}`);
        console.log(`   Stats: ${job.stats.successfulSyncs}/${job.stats.totalSyncs} successful`);
        console.log();
      });

    } catch (error) {
      console.error(chalk.red('✗ Failed to list sync jobs:'), error instanceof Error ? error.message : error);
    }
  }

  async startWebhookServer(): Promise<void> {
    try {
      const connector = await this.initializeConnector();
      const syncEngine = await this.initializeSyncEngine();

      console.log(chalk.blue('🌐 Starting webhook server...'));

      this.webhookServer = new AsanaWebhookServer({
        port: this.config.serverPort!,
        webhookSecret: this.config.webhookSecret!,
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
        console.log(chalk.green('✓ Webhook processed:'), event.webhookEvent.gid);
      });

      this.webhookServer.on('webhook_error', (event) => {
        console.error(chalk.red('✗ Webhook error:'), event.error);
      });

      await this.webhookServer.start();
      
      console.log(chalk.green(`✓ Webhook server started on port ${this.config.serverPort}`));
      console.log(chalk.gray('Press Ctrl+C to stop the server'));

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log(chalk.yellow('\n📡 Shutting down webhook server...'));
        await this.webhookServer?.shutdown();
      });

    } catch (error) {
      console.error(chalk.red('✗ Failed to start webhook server:'), error instanceof Error ? error.message : error);
    }
  }

  private getStatusColor(status: string): (text: string) => string {
    switch (status) {
      case 'running': return chalk.green;
      case 'stopped': return chalk.yellow;
      case 'error': return chalk.red;
      default: return chalk.gray;
    }
  }

  async generateTemplate(): Promise<void> {
    console.log(chalk.blue('📄 Generate New Template'));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Template Name:',
        validate: (input: string) => input.length > 0 || 'Template name is required'
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
        validate: (input: string) => input.length > 0 || 'Description is required'
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

    const templatesDir = path.join(__dirname, '..', 'examples', 'templates');
    const templatePath = path.join(templatesDir, `${templateId}.json`);

    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }

    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));

    console.log(chalk.green('✓ Template generated successfully!'));
    console.log(`Template saved to: ${chalk.cyan(templatePath)}`);
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
  console.error(chalk.red('CLI Error:'), error.message);
  process.exit(1);
});

export default AsanaCLI;

