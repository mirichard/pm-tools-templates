const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

class IntegrationManager {
  constructor() {
    this.supportedIntegrations = {
      github: {
        name: 'GitHub Projects',
        description: 'Integrate with GitHub Issues and Projects',
        configFields: ['repository', 'project_id', 'github_token']
      },
      jira: {
        name: 'Jira Software',
        description: 'Integrate with Jira issues and boards',
        configFields: ['jira_url', 'project_key', 'username', 'api_token']
      },
      azure: {
        name: 'Azure DevOps',
        description: 'Integrate with Azure DevOps work items',
        configFields: ['organization', 'project', 'personal_access_token']
      }
    };
  }

  async setupIntegrations(projectPath, assessment, recommendation) {
    console.log(chalk.blue('\\n🔗 Setting up tool integrations...'));

    const { selectedIntegrations } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedIntegrations',
        message: 'Which tools would you like to integrate with?',
        choices: Object.entries(this.supportedIntegrations).map(([key, integration]) => ({
          name: `${integration.name} - ${integration.description}`,
          value: key,
          checked: key === 'github' // Default to GitHub
        }))
      }
    ]);

    if (selectedIntegrations.length === 0) {
      console.log(chalk.yellow('No integrations selected. You can set these up later.'));
      return;
    }

    // Create integrations directory
    await fs.ensureDir(path.join(projectPath, 'integrations'));

    for (const integration of selectedIntegrations) {
      await this.setupIntegration(integration, projectPath, assessment, recommendation);
    }
  }

  async setupIntegration(integrationType, projectPath, assessment, recommendation) {
    const integration = this.supportedIntegrations[integrationType];
    console.log(chalk.green(`\\n⚙️ Setting up ${integration.name}...`));

    if (integrationType === 'github') {
      await this.setupGitHubIntegration(projectPath, assessment, recommendation);
    } else if (integrationType === 'jira') {
      await this.setupJiraIntegration(projectPath, assessment, recommendation);
    } else if (integrationType === 'azure') {
      await this.setupAzureDevOpsIntegration(projectPath, assessment, recommendation);
    }
  }

  async setupGitHubIntegration(projectPath, assessment, recommendation) {
    // Create GitHub Actions workflow for the project
    const workflowsPath = path.join(projectPath, '.github', 'workflows');
    await fs.ensureDir(workflowsPath);

    // Generate project-specific workflow based on methodology
    let workflowContent = '';
    
    if (recommendation.methodology === 'agile') {
      workflowContent = this.generateAgileGitHubWorkflow(assessment);
    } else if (recommendation.methodology === 'traditional') {
      workflowContent = this.generateTraditionalGitHubWorkflow(assessment);
    } else {
      workflowContent = this.generateHybridGitHubWorkflow(assessment);
    }

    await fs.writeFile(
      path.join(workflowsPath, 'project-automation.yml'),
      workflowContent
    );

    // Create GitHub issue templates
    const issueTemplatesPath = path.join(projectPath, '.github', 'ISSUE_TEMPLATE');
    await fs.ensureDir(issueTemplatesPath);

    // Bug report template
    await fs.writeFile(
      path.join(issueTemplatesPath, 'bug_report.yml'),
      this.generateBugReportTemplate(assessment)
    );

    // Feature request template
    await fs.writeFile(
      path.join(issueTemplatesPath, 'feature_request.yml'),
      this.generateFeatureRequestTemplate(assessment)
    );

    // Create project board configuration
    await fs.writeFile(
      path.join(projectPath, 'integrations', 'github-setup.md'),
      this.generateGitHubSetupGuide(assessment, recommendation)
    );

    console.log(chalk.green('✅ GitHub integration configured'));
  }

  generateAgileGitHubWorkflow(assessment) {
    return `name: Agile Project Automation

on:
  issues:
    types: [opened, closed, labeled]
  schedule:
    # Sprint planning every 2 weeks on Monday
    - cron: '0 9 * * 1'
  workflow_dispatch:

jobs:
  agile-automation:
    runs-on: ubuntu-latest
    steps:
      - name: Sprint Management
        uses: actions/github-script@v7
        with:
          script: |
            // Auto-assign sprint labels based on project timeline
            const sprintDuration = 14; // days
            const currentDate = new Date();
            const projectStart = new Date('${new Date().toISOString().split('T')[0]}');
            const daysSinceStart = Math.floor((currentDate - projectStart) / (1000 * 60 * 60 * 24));
            const currentSprint = Math.floor(daysSinceStart / sprintDuration) + 1;
            
            if (context.eventName === 'issues' && context.payload.action === 'opened') {
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.issue.number,
                labels: [\`sprint-\${currentSprint}\`]
              });
            }

      - name: Velocity Tracking
        if: github.event_name == 'schedule'
        run: |
          echo "Sprint velocity tracking for ${assessment.projectName}"
          echo "Team size: ${assessment.teamSize}"
          echo "Complexity: ${assessment.complexity}"
`;
  }

  generateTraditionalGitHubWorkflow(assessment) {
    return `name: Traditional PM Automation

on:
  issues:
    types: [opened, closed, labeled]
  milestone:
    types: [created, closed]
  workflow_dispatch:

jobs:
  traditional-pm:
    runs-on: ubuntu-latest
    steps:
      - name: Phase Management
        uses: actions/github-script@v7
        with:
          script: |
            // Auto-categorize issues by project phase
            const phases = ['initiation', 'planning', 'execution', 'monitoring', 'closure'];
            
            if (context.eventName === 'issues' && context.payload.action === 'opened') {
              const issueBody = context.payload.issue.body.toLowerCase();
              
              // Auto-assign phase labels based on content
              for (const phase of phases) {
                if (issueBody.includes(phase)) {
                  await github.rest.issues.addLabels({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: context.payload.issue.number,
                    labels: [\`phase-\${phase}\`]
                  });
                  break;
                }
              }
            }

      - name: Milestone Tracking
        run: |
          echo "Milestone tracking for ${assessment.projectName}"
          echo "Duration: ${assessment.duration}"
          echo "Industry: ${assessment.industry}"
`;
  }

  generateHybridGitHubWorkflow(assessment) {
    return `name: Hybrid PM Automation

on:
  issues:
    types: [opened, closed, labeled]
  schedule:
    - cron: '0 9 * * 1,3,5' # Mon, Wed, Fri
  workflow_dispatch:

jobs:
  hybrid-management:
    runs-on: ubuntu-latest
    steps:
      - name: Adaptive Management
        uses: actions/github-script@v7
        with:
          script: |
            // Hybrid approach: combine agile iterations with traditional phases
            const currentDate = new Date();
            const isSprintDay = currentDate.getDay() === 1; // Monday
            const isMilestoneReview = currentDate.getDate() <= 7 && currentDate.getDay() === 5; // First Friday
            
            if (context.eventName === 'issues' && context.payload.action === 'opened') {
              const labels = ['hybrid-approach'];
              
              // Add iteration or phase labels based on timing
              if (isSprintDay) {
                labels.push('iteration-planning');
              }
              if (isMilestoneReview) {
                labels.push('milestone-review');
              }
              
              await github.rest.issues.addLabels({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.payload.issue.number,
                labels: labels
              });
            }
`;
  }

  generateBugReportTemplate(assessment) {
    return `name: 🐛 Bug Report
description: Report a bug in ${assessment.projectName}
title: "[BUG] "
labels: ["bug", "needs-triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report for **${assessment.projectName}**!
        
  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: A clear description of what the bug is
      placeholder: Tell us what you see!
    validations:
      required: true
      
  - type: textarea
    id: expected
    attributes:
      label: Expected behavior
      description: What did you expect to happen?
    validations:
      required: true
      
  - type: textarea
    id: steps
    attributes:
      label: Steps to reproduce
      description: Steps to reproduce the behavior
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true
      
  - type: dropdown
    id: priority
    attributes:
      label: Priority
      description: How critical is this issue?
      options:
        - Low
        - Medium
        - High
        - Critical
    validations:
      required: true
      
  - type: checkboxes
    id: terms
    attributes:
      label: Code of Conduct
      description: By submitting this issue, you agree to follow our Code of Conduct
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true`;
  }

  generateFeatureRequestTemplate(assessment) {
    return `name: 🚀 Feature Request
description: Suggest a new feature for ${assessment.projectName}
title: "[FEATURE] "
labels: ["enhancement", "needs-review"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for suggesting a feature for **${assessment.projectName}**!
        
  - type: textarea
    id: problem
    attributes:
      label: Problem Statement
      description: What problem does this feature solve?
      placeholder: Describe the problem or need this feature addresses
    validations:
      required: true
      
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: Describe your proposed solution
      placeholder: How would you like this feature to work?
    validations:
      required: true
      
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Any alternative solutions you've considered?
      
  - type: dropdown
    id: complexity
    attributes:
      label: Implementation Complexity
      description: How complex do you think this feature would be?
      options:
        - Simple (1-2 days)
        - Medium (1 week)
        - Complex (2-4 weeks)
        - Major (1+ months)
        
  - type: checkboxes
    id: acceptance
    attributes:
      label: Acceptance Criteria
      description: What needs to be true for this feature to be complete?
      options:
        - label: Feature works as described
        - label: Documentation is updated
        - label: Tests are included
        - label: Backwards compatibility maintained`;
  }

  generateGitHubSetupGuide(assessment, recommendation) {
    return `# GitHub Integration Setup Guide

## Project: ${assessment.projectName}

### Overview
This guide helps you set up GitHub integration for your ${recommendation.methodology} project.

### 1. Repository Setup

1. **Create Repository**
   \`\`\`bash
   gh repo create ${assessment.projectName.toLowerCase().replace(/\\s+/g, '-')} --public
   cd ${assessment.projectName.toLowerCase().replace(/\\s+/g, '-')}
   git init
   git add .
   git commit -m "Initial project setup"
   git push -u origin main
   \`\`\`

2. **Enable GitHub Actions**
   - Go to repository Settings > Actions
   - Enable "Allow all actions and reusable workflows"

### 2. Project Board Setup

Create a ${recommendation.methodology} project board:

${recommendation.methodology === 'agile' ? `
**Agile Board Columns:**
- 📋 Product Backlog
- 🚀 Sprint Backlog  
- 🔄 In Progress
- 👀 In Review
- ✅ Done
- 🚫 Blocked

**Sprint Setup:**
- Create sprints as milestones (2-week duration)
- Use labels for story points (1, 2, 3, 5, 8, 13)
- Set up automated sprint workflows
` : recommendation.methodology === 'traditional' ? `
**Traditional Board Columns:**
- 📋 Requirements
- 📝 Planning
- 🔨 Development
- 🧪 Testing
- 📦 Deployment
- ✅ Complete

**Phase Setup:**
- Create phases as milestones
- Use labels for deliverable types
- Set up approval workflows
` : `
**Hybrid Board Columns:**
- 📋 Backlog
- 📅 Release Planning
- 🔄 Current Iteration
- 🧪 Testing
- 📦 Ready for Release
- ✅ Released

**Hybrid Setup:**
- Combine iteration milestones with release phases
- Use both story points and traditional estimates
- Set up flexible workflows
`}

### 3. Labels Setup

Create these labels for ${assessment.projectName}:

**Priority Labels:**
- \`priority-critical\` (red) - Critical issues
- \`priority-high\` (orange) - High priority
- \`priority-medium\` (yellow) - Medium priority  
- \`priority-low\` (green) - Low priority

**Type Labels:**
- \`type-bug\` (red) - Bug reports
- \`type-feature\` (blue) - New features
- \`type-enhancement\` (green) - Improvements
- \`type-documentation\` (purple) - Documentation

**Status Labels:**
- \`status-blocked\` (red) - Blocked issues
- \`status-in-progress\` (yellow) - Work in progress
- \`status-review\` (orange) - Needs review
- \`status-ready\` (green) - Ready for work

### 4. Automation Features

The generated workflow provides:
- Automatic issue labeling
- ${recommendation.methodology === 'agile' ? 'Sprint assignment and velocity tracking' : recommendation.methodology === 'traditional' ? 'Phase management and milestone tracking' : 'Hybrid iteration and phase management'}
- Integration with project methodology

### 5. Team Configuration

**Required Permissions:**
- Team members: Write access
- Project managers: Admin access
- Stakeholders: Read access

**Notification Setup:**
- Watch repository for all team members
- Configure email notifications
- Set up Slack/Teams integration if needed

---

**Next Steps:**
1. Run the automation workflow
2. Create your first ${recommendation.methodology === 'agile' ? 'sprint milestone' : 'project phase milestone'}
3. Start adding issues to populate the board
4. Test the automated workflows

For questions, refer to the main PM Tools Templates documentation.`;
  }

  async setupJiraIntegration(projectPath, assessment, recommendation) {
    await fs.writeFile(
      path.join(projectPath, 'integrations', 'jira-setup.md'),
      this.generateJiraSetupGuide(assessment, recommendation)
    );
    
    console.log(chalk.green('✅ Jira integration guide created'));
  }

  async setupAzureDevOpsIntegration(projectPath, assessment, recommendation) {
    await fs.writeFile(
      path.join(projectPath, 'integrations', 'azure-setup.md'),
      this.generateAzureSetupGuide(assessment, recommendation)
    );
    
    console.log(chalk.green('✅ Azure DevOps integration guide created'));
  }

  generateJiraSetupGuide(assessment, recommendation) {
    return `# Jira Integration Setup Guide

## Project: ${assessment.projectName}

### Jira Project Configuration

**Project Type:** ${recommendation.methodology === 'agile' ? 'Scrum' : 'Kanban'}
**Project Key:** ${assessment.projectName.replace(/\\s+/g, '').substring(0, 10).toUpperCase()}

### Board Setup
${recommendation.methodology === 'agile' ? `
- Sprint duration: 2 weeks
- Story point estimation: Fibonacci (1,2,3,5,8,13)
- Velocity tracking enabled
` : `
- Workflow: To Do → In Progress → Review → Done
- SLA tracking for deliverables
- Approval gates for phase transitions
`}

### Custom Fields
- Priority: Critical, High, Medium, Low
- Component: Based on ${assessment.industry} requirements
- Story Points: For estimation
- Business Value: For prioritization

### Automation Rules
1. Auto-assign issues based on component
2. Move to "In Progress" when work starts
3. Notify stakeholders on status changes
4. Generate sprint/phase reports

For detailed setup instructions, see Jira documentation.`;
  }

  generateAzureSetupGuide(assessment, recommendation) {
    return `# Azure DevOps Integration Setup Guide

## Project: ${assessment.projectName}

### Azure DevOps Project Setup

**Process Template:** ${recommendation.methodology === 'agile' ? 'Agile' : 'CMMI'}
**Work Item Types:** Epic, Feature, User Story, Task, Bug

### Board Configuration
${recommendation.methodology === 'agile' ? `
- Sprint planning with capacity planning
- Burndown charts and velocity tracking
- Automated sprint ceremonies
` : `
- Feature timeline with dependencies
- Milestone tracking and reporting
- Deliverable management
`}

### Build and Release Pipelines
- CI/CD pipeline templates
- Quality gates and approvals
- Deployment automation

### Dashboards
- Project health overview
- ${recommendation.methodology} metrics
- Risk and issue tracking

For detailed setup, refer to Azure DevOps documentation.`;
  }
}

module.exports = IntegrationManager;

