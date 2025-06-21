#!/usr/bin/env node

/**
 * PM Tools Templates - Ecosystem Startup Script
 * 
 * Launches the complete AI-powered project management ecosystem:
 * - AI Service (port 3001)
 * - Executive Dashboard (port 3000) 
 * - Health Monitor (port 3002)
 * - Main CLI Gateway
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

class EcosystemManager {
  constructor() {
    this.services = [];
    this.isShuttingDown = false;
    
    // Service configurations
    this.serviceConfigs = [
      {
        name: 'AI Service',
        command: 'node',
        args: ['src/ai-service.js'],
        port: 3001,
        color: 'blue',
        icon: '🧠'
      },
      {
        name: 'Executive Dashboard',
        command: 'node', 
        args: ['src/dashboard-server.js'],
        port: 3000,
        color: 'green',
        icon: '📊'
      },
      {
        name: 'Health Monitor',
        command: 'node',
        args: ['src/health-monitor.js'],
        port: 3002,
        color: 'yellow',
        icon: '🔍'
      }
    ];
    
    this.setupSignalHandlers();
  }

  async start() {
    this.displayWelcome();
    
    // Check prerequisites
    await this.checkPrerequisites();
    
    // Install dependencies if needed
    await this.ensureDependencies();
    
    // Create necessary directories
    await this.setupDirectories();
    
    // Start all services
    await this.startServices();
    
    // Display status
    this.displayStatus();
    
    // Start CLI gateway
    this.startCLIGateway();
  }

  displayWelcome() {
    console.log(chalk.cyan.bold(`
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    🚀 PM Tools Templates - AI Ecosystem Starting...        │
│                                                             │
│    Enterprise-Grade Project Management Intelligence        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`));
    
    console.log(chalk.white('Starting AI-powered project management ecosystem...\n'));
  }

  async checkPrerequisites() {
    console.log(chalk.blue('🔍 Checking prerequisites...'));
    
    // Check Node.js version
    const nodeVersion = process.version;
    const requiredVersion = 'v16.0.0';
    
    if (nodeVersion < requiredVersion) {
      console.error(chalk.red(`❌ Node.js ${requiredVersion} or higher required. Current: ${nodeVersion}`));
      process.exit(1);
    }
    
    console.log(chalk.green(`✅ Node.js ${nodeVersion} detected`));
    
    // Check package.json
    const packagePath = path.join(__dirname, 'package.json');
    if (!await fs.pathExists(packagePath)) {
      console.error(chalk.red('❌ package.json not found'));
      process.exit(1);
    }
    
    console.log(chalk.green('✅ Package configuration found'));
  }

  async ensureDependencies() {
    console.log(chalk.blue('📦 Checking dependencies...'));
    
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    if (!await fs.pathExists(nodeModulesPath)) {
      console.log(chalk.yellow('Installing dependencies...'));
      
      const npmInstall = spawn('npm', ['install'], {
        stdio: 'inherit',
        cwd: __dirname
      });
      
      await new Promise((resolve, reject) => {
        npmInstall.on('close', (code) => {
          if (code === 0) {
            console.log(chalk.green('✅ Dependencies installed'));
            resolve();
          } else {
            console.error(chalk.red('❌ Failed to install dependencies'));
            reject(new Error(`npm install failed with code ${code}`));
          }
        });
      });
    } else {
      console.log(chalk.green('✅ Dependencies available'));
    }
  }

  async setupDirectories() {
    console.log(chalk.blue('📁 Setting up directories...'));
    
    const directories = [
      'analytics',
      'health-data', 
      'dashboard-data',
      'logs',
      'models'
    ];
    
    for (const dir of directories) {
      await fs.ensureDir(path.join(__dirname, dir));
    }
    
    console.log(chalk.green('✅ Directory structure ready'));
  }

  async startServices() {
    console.log(chalk.blue('🚀 Starting ecosystem services...\n'));
    
    for (const config of this.serviceConfigs) {
      await this.startService(config);
      // Wait a moment between service starts
      await this.delay(1000);
    }
  }

  async startService(config) {
    return new Promise((resolve) => {
      console.log(chalk[config.color](`${config.icon} Starting ${config.name}...`));
      
      // Validate command and args to prevent injection
      const allowedCommands = ['node', 'npm', 'npx', 'python3', 'python'];
      if (!allowedCommands.includes(config.command)) {
        console.error(chalk.red(`Command not allowed: ${config.command}`));
        resolve();
        return;
      }
      
      // Validate args
      const safeArgs = config.args.filter(arg => 
        typeof arg === 'string' && 
        !arg.includes(';') && 
        !arg.includes('|') &&
        !arg.includes('&&')
      );
      
      const service = spawn(config.command, safeArgs, {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        detached: false,
        shell: false // Disable shell to prevent command injection
      });
      
      service.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(chalk[config.color](`[${config.name}] ${output}`));
        }
      });
      
      service.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(chalk.red(`[${config.name}] ${output}`));
        }
      });
      
      service.on('close', (code) => {
        if (!this.isShuttingDown) {
          console.log(chalk.red(`${config.icon} ${config.name} exited with code ${code}`));
          if (code !== 0) {
            console.log(chalk.yellow(`Attempting to restart ${config.name}...`));
            setTimeout(() => this.startService(config), 5000);
          }
        }
      });
      
      service.on('error', (error) => {
        console.error(chalk.red(`${config.icon} Failed to start ${config.name}: ${error.message}`));
      });
      
      // Store service reference
      this.services.push({
        ...config,
        process: service
      });
      
      // Give service time to start
      setTimeout(() => {
        console.log(chalk.green(`✅ ${config.name} started`));
        resolve();
      }, 2000);
    });
  }

  displayStatus() {
    console.log(chalk.cyan('\n📋 Ecosystem Status:'));
    console.log(chalk.cyan('=' .repeat(60)));
    
    this.serviceConfigs.forEach(config => {
      console.log(chalk.white(`${config.icon} ${config.name.padEnd(20)} → http://localhost:${config.port}`));
    });
    
    console.log(chalk.cyan('=' .repeat(60)));
    console.log(chalk.green('\n🌟 Ecosystem fully operational!'));
    console.log(chalk.white('\nKey URLs:'));
    console.log(chalk.blue('  📊 Executive Dashboard: http://localhost:3000'));
    console.log(chalk.blue('  🧠 AI Service Health:   http://localhost:3001/api/ai/health'));
    console.log(chalk.blue('  🔍 System Health:       http://localhost:3002/health'));
    console.log(chalk.white('\nPress Ctrl+C to shutdown the ecosystem'));
  }

  startCLIGateway() {
    console.log(chalk.magenta('\n🎯 CLI Gateway ready for commands!'));
    console.log(chalk.white('Run: npm start generate    # Start project assessment'));
    console.log(chalk.white('Run: npm start list        # List available templates'));
    console.log(chalk.white('Run: npm test             # Run ecosystem tests\n'));
  }

  setupSignalHandlers() {
    const shutdown = async (signal) => {
      if (this.isShuttingDown) return;
      
      this.isShuttingDown = true;
      console.log(chalk.yellow(`\n🛑 Received ${signal}. Shutting down ecosystem...`));
      
      // Gracefully shutdown all services
      const shutdownPromises = this.services.map(service => {
        return new Promise((resolve) => {
          if (service.process && !service.process.killed) {
            console.log(chalk.dim(`Stopping ${service.name}...`));
            
            service.process.kill('SIGTERM');
            
            setTimeout(() => {
              if (!service.process.killed) {
                console.log(chalk.red(`Force killing ${service.name}...`));
                service.process.kill('SIGKILL');
              }
              resolve();
            }, 5000);
            
            service.process.on('close', () => {
              console.log(chalk.green(`✅ ${service.name} stopped`));
              resolve();
            });
          } else {
            resolve();
          }
        });
      });
      
      await Promise.all(shutdownPromises);
      
      console.log(chalk.green('\n✅ Ecosystem shutdown complete'));
      console.log(chalk.cyan('Thank you for using PM Tools Templates!'));
      process.exit(0);
    };
    
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error(chalk.red('❌ Uncaught Exception:'), error);
      shutdown('EXCEPTION');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error(chalk.red('❌ Unhandled Rejection at:'), promise, 'reason:', reason);
      shutdown('REJECTION');
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Enhanced command line argument handling
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: 'full', // full, minimal, development
    services: [], // specific services to start
    port: null,   // custom port offset
    help: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--mode':
      case '-m':
        options.mode = args[++i] || 'full';
        break;
      case '--services':
      case '-s':
        options.services = (args[++i] || '').split(',');
        break;
      case '--port':
      case '-p':
        options.port = parseInt(args[++i]) || null;
        break;
    }
  }
  
  return options;
}

function displayHelp() {
  console.log(chalk.cyan.bold('\nPM Tools Templates - Ecosystem Manager\n'));
  console.log(chalk.white('Usage: node start-ecosystem.js [options]\n'));
  console.log(chalk.white('Options:'));
  console.log(chalk.white('  -h, --help              Show this help message'));
  console.log(chalk.white('  -m, --mode <mode>       Startup mode (full|minimal|development)'));
  console.log(chalk.white('  -s, --services <list>   Start specific services (ai,dashboard,health)'));
  console.log(chalk.white('  -p, --port <offset>     Port offset for services\n'));
  console.log(chalk.white('Examples:'));
  console.log(chalk.blue('  node start-ecosystem.js                    # Start full ecosystem'));
  console.log(chalk.blue('  node start-ecosystem.js --mode minimal     # Start minimal services'));
  console.log(chalk.blue('  node start-ecosystem.js --services ai,dash # Start AI and Dashboard only'));
  console.log(chalk.blue('  node start-ecosystem.js --port 4000        # Start with port offset\n'));
}

// Main execution
async function main() {
  const options = parseArgs();
  
  if (options.help) {
    displayHelp();
    return;
  }
  
  try {
    const manager = new EcosystemManager();
    
    // Apply options to manager
    if (options.port) {
      manager.serviceConfigs.forEach(config => {
        config.port += options.port - 3000;
      });
    }
    
    if (options.mode === 'minimal') {
      manager.serviceConfigs = manager.serviceConfigs.slice(0, 2); // Only AI and Dashboard
    } else if (options.services.length > 0) {
      const serviceMap = {
        ai: 'AI Service',
        dashboard: 'Executive Dashboard', 
        health: 'Health Monitor'
      };
      
      manager.serviceConfigs = manager.serviceConfigs.filter(config => 
        options.services.some(s => serviceMap[s] === config.name)
      );
    }
    
    await manager.start();
  } catch (error) {
    console.error(chalk.red('❌ Failed to start ecosystem:'), error.message);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { EcosystemManager };
