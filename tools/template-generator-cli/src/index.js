#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

const MethodologyRecommender = require('./recommender');
const TemplateGenerator = require('./generator');

// CLI Header
console.log(chalk.blue.bold(`
┌─────────────────────────────────────────────────────────────┐
│               PM Template Generator CLI                     │
│         Intelligent Project Setup Automation               │
└─────────────────────────────────────────────────────────────┘
`));

program
  .name('pm-template')
  .description('Interactive CLI for intelligent PM template generation')
  .version('1.0.0');

program
  .command('generate')
  .description('Start interactive project assessment and template generation')
  .action(async () => {
    await runInteractiveAssessment();
  });

program
  .command('list')
  .description('List available templates')
  .action(() => {
    console.log(chalk.yellow('Available Template Categories:'));
    console.log('• Traditional/Waterfall (Traditional-aligned)');
    console.log('• Agile/Scrum');
    console.log('• Hybrid Methodologies');
    console.log('• Industry-Specific Templates');
    console.log('• Role-Based Toolkits');
  });

async function runInteractiveAssessment() {
  console.log(chalk.green('🚀 Let\\'s set up your project with the perfect templates!\\n'));
  
  const assessment = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      validate: input => input.length > 0 || 'Project name is required'
    },
    {
      type: 'list',
      name: 'industry',
      message: 'What industry is this project for?',
      choices: [
        { name: '🏗️  Construction', value: 'construction' },
        { name: '💰 Financial Services', value: 'financial_services' },
        { name: '🏥 Healthcare/Pharmaceutical', value: 'healthcare_pharmaceutical' },
        { name: '💻 Information Technology', value: 'information_technology' },
        { name: '⚡ Software Development', value: 'software_development' },
        { name: '🌐 Other/General', value: 'general' }
      ]
    },
    {
      type: 'list',
      name: 'teamSize',
      message: 'What is your team size?',
      choices: [
        { name: 'Small (1-5 people)', value: 'small' },
        { name: 'Medium (6-20 people)', value: 'medium' },
        { name: 'Large (21-50 people)', value: 'large' },
        { name: 'Enterprise (50+ people)', value: 'enterprise' }
      ]
    },
    {
      type: 'list',
      name: 'duration',
      message: 'What is your project duration?',
      choices: [
        { name: 'Short (< 3 months)', value: 'short' },
        { name: 'Medium (3-12 months)', value: 'medium' },
        { name: 'Long (1-2 years)', value: 'long' },
        { name: 'Ongoing (> 2 years)', value: 'ongoing' }
      ]
    },
    {
      type: 'list',
      name: 'complexity',
      message: 'How complex is your project?',
      choices: [
        { name: 'Simple - Clear requirements, minimal risk', value: 'simple' },
        { name: 'Moderate - Some unknowns, moderate risk', value: 'moderate' },
        { name: 'Complex - Many unknowns, high risk', value: 'complex' },
        { name: 'Highly Complex - Research/innovation project', value: 'highly_complex' }
      ]
    },
    {
      type: 'list',
      name: 'changeFrequency',
      message: 'How often do you expect requirements to change?',
      choices: [
        { name: 'Rarely - Requirements are well-defined', value: 'rarely' },
        { name: 'Occasionally - Some changes expected', value: 'occasionally' },
        { name: 'Frequently - Requirements evolve regularly', value: 'frequently' },
        { name: 'Constantly - Very dynamic environment', value: 'constantly' }
      ]
    },
    {
      type: 'checkbox',
      name: 'stakeholderTypes',
      message: 'What types of stakeholders are involved? (Select all that apply)',
      choices: [
        { name: 'Executive Leadership', value: 'executive' },
        { name: 'Business Users', value: 'business' },
        { name: 'Technical Teams', value: 'technical' },
        { name: 'External Clients', value: 'external' },
        { name: 'Regulatory Bodies', value: 'regulatory' },
        { name: 'Vendors/Partners', value: 'vendors' }
      ]
    },
    {
      type: 'list',
      name: 'experience',
      message: 'What is your project management experience level?',
      choices: [
        { name: 'Beginner - New to PM', value: 'beginner' },
        { name: 'Intermediate - Some PM experience', value: 'intermediate' },
        { name: 'Advanced - Experienced PM', value: 'advanced' },
        { name: 'Expert - Senior PM/PMO', value: 'expert' }
      ]
    }
  ]);

  // Process assessment and recommend methodology
  const spinner = ora('Analyzing your project requirements...').start();
  
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const recommender = new MethodologyRecommender();
  const recommendation = recommender.recommend(assessment);
  
  spinner.succeed('Analysis complete!');
  
  // Display recommendation
  console.log(chalk.cyan('\\n📊 Assessment Results:'));
  console.log(chalk.white(`Project: ${assessment.projectName}`));
  console.log(chalk.white(`Industry: ${assessment.industry}`));
  console.log(chalk.white(`Team Size: ${assessment.teamSize}`));
  console.log(chalk.white(`Complexity: ${assessment.complexity}`));
  
  console.log(chalk.green('\\n🎯 Recommended Methodology:'));
  console.log(chalk.bold.green(`${recommendation.methodology.toUpperCase()}`));
  console.log(chalk.white(`Confidence: ${recommendation.confidence}%`));
  console.log(chalk.white(`Reasoning: ${recommendation.reasoning}`));
  
  // Ask for confirmation
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Would you like to generate templates based on this recommendation?',
      default: true
    }
  ]);
  
  if (confirmed) {
    const generator = new TemplateGenerator();
    await generator.generateTemplates(assessment, recommendation);
  } else {
    console.log(chalk.yellow('Template generation cancelled. Run the command again to restart.'));
  }
}

// Handle default command
if (process.argv.length === 2) {
  program.commands[0].action();
} else {
  program.parse();
}

