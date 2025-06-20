# 🚀 Asana Integration - Quick Start Guide

Get up and running with PM Tools Templates Asana Integration in minutes!

## Prerequisites

- **Node.js 16+** and npm
- **Asana account** with API access
- **Asana Personal Access Token** ([Get one here](https://app.asana.com/0/developer-console))

## 🎯 1-Minute Setup

### Step 1: Install Dependencies
```bash
cd integrations/asana
npm install
```

### Step 2: Build the Project
```bash
npm run build
```

### Step 3: Configure Integration
```bash
# Interactive configuration
npx ts-node src/cli.ts configure

# Or set environment variables
export ASANA_ACCESS_TOKEN="your_access_token_here"
export ASANA_DEFAULT_WORKSPACE="your_workspace_id"
export ASANA_WEBHOOK_SECRET="your_webhook_secret"
```

### Step 4: Test Connection
```bash
# List your workspaces
npx ts-node src/cli.ts workspaces

# List teams in your workspace
npx ts-node src/cli.ts teams
```

## 🏗️ Create Your First Project

### Using the CLI
```bash
# Interactive project creation
npx ts-node src/cli.ts create-project

# Choose from available templates:
# 1. Traditional Project Charter
# 2. Agile Sprint Planning  
# 3. Hybrid Project Plan
```

### Using Code
```typescript
import { quickSetup, loadTemplate } from './src/index';

async function createProject() {
  // Quick setup
  const { connector } = await quickSetup({
    accessToken: 'your_token',
    workspaceId: 'your_workspace_id'
  });

  // Load a template
  const template = await loadTemplate('./examples/templates/pmbok-project-charter.json');

  // Create project
  const project = await connector.createProjectFromTemplate(
    template,
    'your_workspace_id',
    {
      projectData: {
        name: 'My New Project',
        description: 'Created from PM template'
      }
    }
  );

  console.log('Project created:', project.gid);
}
```

## 🔄 Set Up Bi-Directional Sync

### Start Synchronization
```bash
# Interactive sync setup
npx ts-node src/cli.ts start-sync

# Monitor sync jobs
npx ts-node src/cli.ts list-sync
```

### Start Webhook Server (Real-time)
```bash
# Start webhook server for real-time sync
npx ts-node src/cli.ts webhook-server

# Server starts on port 3000 by default
# Webhook endpoint: http://localhost:3000/webhooks/asana
```

## 📋 Available Templates

| Template | Methodology | Complexity | Duration |
|----------|-------------|------------|----------|
| **Traditional Project Charter** | Traditional | Intermediate | 2-4 weeks |
| **Agile Sprint Planning** | Agile | Intermediate | 2-3 days |
| **Hybrid Project Plan** | Hybrid | Advanced | 4-6 months |

### List All Templates
```bash
npx ts-node src/cli.ts templates
```

### Generate New Template
```bash
npx ts-node src/cli.ts generate-template
```

## 🔧 Configuration Options

### Environment Variables
```bash
# Required
ASANA_ACCESS_TOKEN=your_personal_access_token

# Optional
ASANA_DEFAULT_WORKSPACE=workspace_gid
ASANA_WEBHOOK_SECRET=your_webhook_secret
SERVER_PORT=3000
```

### Configuration File (`.asana-config.json`)
```json
{
  "asanaAccessToken": "your_token",
  "defaultWorkspace": "workspace_id",
  "webhookSecret": "your_secret",
  "serverPort": 3000
}
```

## 📊 Sync Features

### What Gets Synchronized
- ✅ **Task Names** and descriptions
- ✅ **Completion Status** (done/not done)
- ✅ **Due Dates** and deadlines
- ✅ **Assignees** and team members
- ✅ **Custom Fields** (methodology-specific)
- ✅ **Dependencies** and relationships
- ✅ **Progress Updates** and comments

### Conflict Resolution
- **Asana Wins**: Asana changes override template
- **Template Wins**: Template changes override Asana
- **Manual**: Conflicts require manual resolution

## 🌐 Webhook Integration

### Set Up Asana Webhooks
1. **Start the webhook server**:
   ```bash
   npx ts-node src/cli.ts webhook-server
   ```

2. **Configure Asana webhook** (via Asana API or Developer Console):
   ```
   URL: https://your-domain.com/webhooks/asana
   Secret: your_webhook_secret
   ```

3. **Test webhook**:
   ```bash
   curl -X POST http://localhost:3000/health
   ```

## 🎛️ CLI Commands Reference

| Command | Description |
|---------|-------------|
| `configure` | Set up integration settings |
| `workspaces` | List Asana workspaces |
| `teams [workspace-id]` | List teams in workspace |
| `templates` | Show available templates |
| `create-project` | Create project from template |
| `start-sync` | Start bidirectional sync |
| `list-sync` | Show active sync jobs |
| `webhook-server` | Start webhook server |
| `generate-template` | Create new template |

## 📈 Advanced Usage

### Custom Field Mapping
```typescript
import { AsanaConnector } from './src/connector';

const connector = new AsanaConnector({
  accessToken: 'your_token'
});

// Get workspace custom fields
const customFields = await connector.getWorkspaceCustomFields('workspace_id');

// Create custom mappings
const mappings = await connector.mapCustomFields(
  templateFields,
  customFields
);
```

### Programmatic Sync Control
```typescript
import { AsanaSyncEngine } from './src/sync-engine';

const syncEngine = new AsanaSyncEngine(client, 'webhook_secret');

// Start sync with custom options
const jobId = await syncEngine.startBidirectionalSync(
  'template_id',
  'asana_project_id',
  {
    syncInterval: 900000, // 15 minutes
    conflictResolution: 'asana_wins',
    syncFields: ['name', 'completed', 'due_date'],
    bidirectional: true,
    webhookEnabled: true
  }
);

// Monitor sync job
const job = syncEngine.getSyncJobStatus(jobId);
console.log('Sync stats:', job.stats);
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Access token invalid"**
- Verify your Asana Personal Access Token
- Check token hasn't expired
- Ensure token has correct permissions

**❌ "Workspace not found"**
- Verify workspace ID is correct
- Ensure you have access to the workspace
- Check if workspace is active

**❌ "Template validation failed"**
- Verify template JSON structure
- Check all required fields are present
- Validate field types and values

**❌ "Webhook not receiving events"**
- Verify webhook URL is accessible
- Check webhook secret matches
- Ensure Asana webhook is configured correctly

### Debug Mode
```bash
# Enable debug logging
DEBUG=asana:* npx ts-node src/cli.ts webhook-server

# Check webhook server health
curl http://localhost:3000/health
```

## 📚 Next Steps

1. **Explore Templates**: Try different methodology templates
2. **Custom Templates**: Create your own templates for specific workflows
3. **Team Setup**: Configure team mappings for automatic assignments
4. **Automation**: Set up scheduled sync jobs for continuous integration
5. **Dashboard**: Monitor sync performance and project health

## 🆘 Need Help?

- **Documentation**: Check the main [README.md](./README.md)
- **Examples**: Browse [examples/templates/](./examples/templates/)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/pm-tools/templates/issues)
- **Community**: Join discussions in the project repository

---

**Happy Project Managing! 🎯**

