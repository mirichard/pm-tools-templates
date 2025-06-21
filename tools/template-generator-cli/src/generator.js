const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const IntegrationManager = require('./integrations');

class TemplateGenerator {
  constructor() {
    this.rootPath = path.resolve(__dirname, '../../..');
    this.outputPath = process.cwd();
  }

  async generateTemplates(assessment, recommendation) {
    console.log(chalk.blue('\\n📁 Setting up your project templates...'));
    
    // Ask for output directory
    const { outputDir } = await inquirer.prompt([
      {
        type: 'input',
        name: 'outputDir',
        message: 'Where would you like to create the project directory?',
        default: `./${assessment.projectName.toLowerCase().replace(/\\s+/g, '-')}`
      }
    ]);

    const projectPath = path.resolve(this.outputPath, outputDir);
    
    // Create project directory structure
    await this.createProjectStructure(projectPath, assessment, recommendation);
    
    // Copy and customize templates
    await this.copyTemplates(projectPath, assessment, recommendation);
    
    // Generate project README
    await this.generateProjectReadme(projectPath, assessment, recommendation);
    
    // Generate setup instructions
    await this.generateSetupInstructions(projectPath, assessment, recommendation);
    
    // Setup integrations
    const integrationManager = new IntegrationManager();
    await integrationManager.setupIntegrations(projectPath, assessment, recommendation);
    
    console.log(chalk.green('\n✅ Project setup complete!'));
    console.log(chalk.white(`📁 Project created at: ${projectPath}`));
    console.log(chalk.white(`📋 See ${path.join(outputDir, 'README.md')} for next steps`));
    console.log(chalk.white(`🔗 Check integrations/ folder for tool setup guides`));
  }

  async createProjectStructure(projectPath, assessment, recommendation) {
    const spinner = ora('Creating project structure...').start();
    
    const directories = [
      'templates',
      'docs',
      'planning',
      'reports',
      'meetings'
    ];

    // Add methodology-specific directories
    if (recommendation.methodology === 'agile') {
      directories.push('sprints', 'backlog', 'retrospectives');
    } else if (recommendation.methodology === 'traditional') {
      directories.push('phases', 'deliverables', 'approvals');
    } else if (recommendation.methodology === 'hybrid') {
      directories.push('iterations', 'milestones', 'releases');
    }

    // Add industry-specific directories
    if (assessment.industry === 'software_development') {
      directories.push('architecture', 'testing', 'deployment');
    } else if (assessment.industry === 'construction') {
      directories.push('permits', 'inspections', 'materials');
    } else if (assessment.industry === 'healthcare_pharmaceutical') {
      directories.push('compliance', 'validation', 'regulatory');
    }

    for (const dir of directories) {
      await fs.ensureDir(path.join(projectPath, dir));
    }
    
    spinner.succeed('Project structure created');
  }

  async copyTemplates(projectPath, assessment, recommendation) {
    const spinner = ora('Copying and customizing templates...').start();
    
    const templateMap = this.getTemplateSourceMap(recommendation.methodology);
    let copiedCount = 0;
    
    for (const template of recommendation.templates) {
      const sourcePath = this.findTemplateSource(template, templateMap);
      if (sourcePath && await fs.pathExists(sourcePath)) {
        const targetPath = path.join(projectPath, 'templates', template);
        
        // Read template content
        let content = await fs.readFile(sourcePath, 'utf8');
        
        // Customize template content
        content = this.customizeTemplate(content, assessment, recommendation);
        
        // Write customized template
        await fs.writeFile(targetPath, content);
        copiedCount++;
      }
    }
    
    spinner.succeed(`${copiedCount} templates copied and customized`);
  }

  getTemplateSourceMap(methodology) {
    return {
      agile: 'role-based-toolkits/scrum-master/agile-ceremonies',
      traditional: 'Traditional/Templates',
      hybrid: 'Hybrid/Templates'
    }[methodology] || 'Traditional/Templates';
  }

  findTemplateSource(templateName, templateMap) {
    // Try multiple possible locations
    const possiblePaths = [
      path.join(this.rootPath, templateMap, templateName),
      path.join(this.rootPath, 'Waterfall/Templates', templateName),
      path.join(this.rootPath, 'Agile/Templates', templateName),
      path.join(this.rootPath, 'Hybrid/Templates', templateName),
      path.join(this.rootPath, 'industry_templates', templateName.split('_')[0], templateName)
    ];

    for (const possiblePath of possiblePaths) {
      if (fs.pathExistsSync(possiblePath)) {
        return possiblePath;
      }
    }
    
    return null;
  }

  customizeTemplate(content, assessment, recommendation) {
    // Replace placeholders with project-specific information
    const replacements = {
      '{{PROJECT_NAME}}': assessment.projectName,
      '{{METHODOLOGY}}': recommendation.methodology.toUpperCase(),
      '{{INDUSTRY}}': assessment.industry.replace('_', ' ').toUpperCase(),
      '{{TEAM_SIZE}}': assessment.teamSize.toUpperCase(),
      '{{COMPLEXITY}}': assessment.complexity.replace('_', ' ').toUpperCase(),
      '{{CHANGE_FREQUENCY}}': assessment.changeFrequency.toUpperCase(),
      '{{DURATION}}': assessment.duration.toUpperCase(),
      '{{CURRENT_DATE}}': new Date().toISOString().split('T')[0],
      '{{STAKEHOLDERS}}': assessment.stakeholderTypes ? assessment.stakeholderTypes.join(', ') : 'TBD'
    };

    let customizedContent = content;
    for (const [placeholder, value] of Object.entries(replacements)) {
      customizedContent = customizedContent.replace(new RegExp(placeholder, 'g'), value);
    }

    // Add methodology-specific customizations
    if (recommendation.methodology === 'agile') {
      customizedContent = this.addAgileCustomizations(customizedContent, assessment);
    } else if (recommendation.methodology === 'traditional') {
      customizedContent = this.addTraditionalCustomizations(customizedContent, assessment);
    } else if (recommendation.methodology === 'hybrid') {
      customizedContent = this.addHybridCustomizations(customizedContent, assessment);
    }

    return customizedContent;
  }

  addAgileCustomizations(content, assessment) {
    // Add agile-specific sections if not present
    if (!content.includes('Sprint Duration') && assessment.teamSize === 'small') {
      content += '\\n\\n## Sprint Configuration\\n- **Sprint Duration:** 2 weeks (recommended for small teams)\\n- **Sprint Planning:** 2 hours\\n- **Daily Standups:** 15 minutes\\n- **Sprint Review:** 1 hour\\n- **Sprint Retrospective:** 1 hour';
    }
    return content;
  }

  addTraditionalCustomizations(content, assessment) {
    // Add traditional PM phases if not present
    if (!content.includes('Project Phases') && assessment.complexity !== 'simple') {
      content += '\\n\\n## Project Phases\\n1. **Initiation:** Project charter and stakeholder identification\\n2. **Planning:** Detailed project planning and resource allocation\\n3. **Execution:** Project work and deliverable creation\\n4. **Monitoring:** Progress tracking and control\\n5. **Closure:** Project completion and lessons learned';
    }
    return content;
  }

  addHybridCustomizations(content, assessment) {
    // Add hybrid approach explanations
    if (!content.includes('Hybrid Approach')) {
      content += '\\n\\n## Hybrid Approach\\n- **Traditional Elements:** Comprehensive planning and documentation\\n- **Agile Elements:** Iterative development and regular feedback\\n- **Integration Points:** Regular milestone reviews with agile delivery cycles';
    }
    return content;
  }

  async generateProjectReadme(projectPath, assessment, recommendation) {
    const readmeContent = `# ${assessment.projectName}

## Project Overview

**Methodology:** ${recommendation.methodology.toUpperCase()}  
**Industry:** ${assessment.industry.replace('_', ' ')}  
**Team Size:** ${assessment.teamSize}  
**Duration:** ${assessment.duration}  
**Complexity:** ${assessment.complexity.replace('_', ' ')}  

## Recommendation Summary

**Confidence:** ${recommendation.confidence}%  
**Reasoning:** ${recommendation.reasoning}

## Project Structure

\`\`\`
${assessment.projectName.toLowerCase().replace(/\\s+/g, '-')}/
├── templates/          # Customized PM templates
├── docs/              # Project documentation
├── planning/          # Planning documents
├── reports/           # Status and progress reports
├── meetings/          # Meeting notes and agendas
${recommendation.methodology === 'agile' ? '├── sprints/           # Sprint artifacts\\n├── backlog/           # Product backlog\\n└── retrospectives/    # Sprint retrospectives' : ''}
${recommendation.methodology === 'traditional' ? '├── phases/            # Project phase documents\\n├── deliverables/      # Project deliverables\\n└── approvals/         # Approval documents' : ''}
${recommendation.methodology === 'hybrid' ? '├── iterations/        # Iteration planning\\n├── milestones/        # Milestone reviews\\n└── releases/          # Release planning' : ''}
\`\`\`

## Getting Started

1. **Review Templates:** Check the \`templates/\` directory for customized templates
2. **Project Setup:** Use the project charter template to formalize project initiation
3. **Team Setup:** Share this structure with your team members
4. **Tool Integration:** Consider integrating with your preferred PM tools

## Recommended Templates

${recommendation.templates.map(template => `- ${template}`).join('\\n')}

## Next Steps

${this.getNextSteps(recommendation.methodology, assessment)}

---

*Generated by PM Template Generator CLI v1.0.0*
*Recommendation confidence: ${recommendation.confidence}%*
`;

    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
  }

  getNextSteps(methodology, assessment) {
    if (methodology === 'agile') {
      return `1. **Product Backlog:** Create initial product backlog items
2. **Sprint 0:** Set up development environment and team processes  
3. **Sprint Planning:** Plan your first sprint
4. **Team Formation:** Establish team roles (Scrum Master, Product Owner)
5. **Definition of Done:** Agree on completion criteria`;
    } else if (methodology === 'traditional') {
      return `1. **Project Charter:** Complete and get approval for project charter
2. **Stakeholder Analysis:** Identify and analyze all stakeholders
3. **Project Plan:** Develop detailed project management plan
4. **Resource Planning:** Secure necessary resources and team members
5. **Risk Assessment:** Conduct initial risk identification and assessment`;
    } else {
      return `1. **Hybrid Framework:** Define your specific hybrid approach
2. **Phase Planning:** Plan traditional phases with agile iterations
3. **Stakeholder Alignment:** Ensure all stakeholders understand the approach
4. **Tool Setup:** Configure tools to support both methodologies
5. **Team Training:** Train team on hybrid practices and processes`;
    }
  }

  async generateSetupInstructions(projectPath, assessment, recommendation) {
    const instructions = `# Project Setup Instructions

## Quick Start Guide

### 1. Immediate Actions
- [ ] Review and customize the project charter template
- [ ] Set up team communication channels
- [ ] Schedule project kick-off meeting
- [ ] Identify key stakeholders

### 2. Methodology-Specific Setup

${this.getMethodologyInstructions(recommendation.methodology)}

### 3. Industry-Specific Considerations

${this.getIndustryInstructions(assessment.industry)}

### 4. Tool Recommendations

Based on your assessment, consider these tools:
- **Project Management:** ${this.getToolRecommendations(assessment, recommendation)}

### 5. Team Roles

${this.getTeamRoles(recommendation.methodology, assessment.teamSize)}

---

*For questions about templates or methodology, refer to the main repository documentation.*
`;

    await fs.writeFile(path.join(projectPath, 'docs', 'SETUP_INSTRUCTIONS.md'), instructions);
  }

  getMethodologyInstructions(methodology) {
    const instructions = {
      agile: `- [ ] Set up product backlog management tool
- [ ] Define sprint duration (recommended: 2 weeks)
- [ ] Schedule recurring ceremonies (daily standups, sprint planning, review, retrospective)
- [ ] Establish Definition of Done criteria
- [ ] Set up sprint board (Kanban/Scrum board)`,
      traditional: `- [ ] Complete project charter and get approval
- [ ] Develop detailed work breakdown structure (WBS)
- [ ] Create project schedule with critical path
- [ ] Set up change control process
- [ ] Establish progress reporting cadence`,
      hybrid: `- [ ] Define hybrid framework specifics for your project
- [ ] Plan traditional phases with agile iterations
- [ ] Set up both waterfall milestones and agile ceremonies
- [ ] Establish integration points between methodologies
- [ ] Create hybrid governance structure`
    };
    return instructions[methodology] || '';
  }

  getIndustryInstructions(industry) {
    const instructions = {
      construction: '- Consider regulatory compliance requirements\\n- Plan for inspection checkpoints\\n- Factor in weather and environmental constraints',
      healthcare_pharmaceutical: '- Ensure FDA/regulatory compliance\\n- Plan for validation activities\\n- Consider patient safety requirements',
      software_development: '- Set up development environment\\n- Plan for continuous integration/deployment\\n- Consider security and scalability requirements',
      financial_services: '- Ensure regulatory compliance (SOX, etc.)\\n- Plan for security and audit requirements\\n- Consider market timing constraints',
      information_technology: '- Plan for system integration requirements\\n- Consider cybersecurity implications\\n- Factor in user training and adoption'
    };
    return instructions[industry] || 'Consider industry-specific regulations and requirements';
  }

  getToolRecommendations(assessment, recommendation) {
    if (recommendation.methodology === 'agile') {
      return 'Jira, Azure DevOps, Trello';
    } else if (recommendation.methodology === 'traditional') {
      return 'Microsoft Project, Smartsheet, Monday.com';
    } else {
      return 'Asana, Notion, Microsoft Project + Jira integration';
    }
  }

  getTeamRoles(methodology, teamSize) {
    if (methodology === 'agile') {
      return `**Core Agile Roles:**
- Product Owner: Defines requirements and priorities
- Scrum Master: Facilitates process and removes blockers
- Development Team: Creates the product increment
${teamSize === 'large' || teamSize === 'enterprise' ? '\\n**Additional Roles:**\\n- Release Train Engineer (for scaled agile)\\n- Product Manager\\n- Architect' : ''}`;
    } else if (methodology === 'traditional') {
      return `**Core PM Roles:**
- Project Manager: Overall project leadership
- Business Analyst: Requirements gathering and analysis
- Team Leads: Technical and functional leadership
- Stakeholder Representatives: Business guidance
${teamSize === 'large' || teamSize === 'enterprise' ? '\\n**Additional Roles:**\\n- Program Manager\\n- PMO Support\\n- Quality Assurance Lead' : ''}`;
    } else {
      return `**Hybrid Roles:**
- Project Manager/Scrum Master: Dual methodology leadership
- Product Owner/Business Analyst: Requirements and priorities
- Technical Lead: Architecture and development guidance
- Process Coach: Methodology integration support`;
    }
  }
}

module.exports = TemplateGenerator;

