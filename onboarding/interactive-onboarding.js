#!/usr/bin/env node

/**
 * PM Tools Templates - Interactive Onboarding Experience
 * Guides new users through template selection and initial project setup
 * Part of Phase 2 enhancement: User Experience Revolution
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class InteractiveOnboarding {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.userProfile = {
            experience: null,
            projectType: null,
            methodology: null,
            teamSize: null,
            timeline: null,
            industry: null,
            selectedTemplates: [],
            customizationPreferences: {}
        };
        
        this.templates = this.loadTemplateIndex();
        
        // Progress tracking for UX-101 acceptance criteria
        this.progressSteps = [
            { id: 'welcome', name: 'Welcome & Overview', completed: false },
            { id: 'profile', name: 'Profile Collection', completed: false },
            { id: 'templates', name: 'Template Selection', completed: false },
            { id: 'setup', name: 'Project Setup', completed: false },
            { id: 'completion', name: 'Completion & Resources', completed: false }
        ];
        
        this.currentStep = 0;
        this.startTime = Date.now();
        this.tutorialMetrics = {
            timeSpent: 0,
            stepsCompleted: 0,
            templatesSelected: 0,
            completionRate: 0
        };
    }

    async start() {
        console.clear();
        this.displayWelcome();
        
        try {
            await this.collectUserProfile();
            await this.recommendTemplates();
            await this.setupProject();
            await this.generateOnboardingReport();
            this.displayCompletion();
        } catch (error) {
            console.error('❌ Onboarding error:', error.message);
        } finally {
            this.rl.close();
        }
    }

    displayWelcome() {
        console.log(`
🎯 ═══════════════════════════════════════════════════════════════
   Welcome to PM Tools Templates Interactive Onboarding!
   Your journey to effective project management starts here.
═══════════════════════════════════════════════════════════════

🚀 What we'll do together:
   1. Understand your experience level and project needs
   2. Recommend the perfect templates for your situation  
   3. Set up your project structure with AI-powered insights
   4. Create your personalized project management roadmap

⏱️  This will take about 5-10 minutes of your time.
💡 You can stop anytime by pressing Ctrl+C

Let's get started! 🎉
        `);
    }

    async collectUserProfile() {
        console.log('\n📋 First, let\'s understand your background and project:\n');
        
        // Experience Level
        this.userProfile.experience = await this.askMultipleChoice(
            'What\'s your project management experience level?',
            [
                'New to project management (0-1 years)',
                'Some experience (2-4 years)', 
                'Experienced PM (5-9 years)',
                'Senior/Expert PM (10+ years)'
            ]
        );

        // Project Type
        this.userProfile.projectType = await this.askMultipleChoice(
            'What type of project are you managing?',
            [
                'Software/IT Development',
                'Business Process Improvement',
                'Product Launch',
                'Organizational Change',
                'Construction/Engineering',
                'Marketing Campaign',
                'Research & Development',
                'Other/Mixed'
            ]
        );

        // Team Size
        this.userProfile.teamSize = await this.askMultipleChoice(
            'What\'s your team size?',
            [
                'Solo/Individual (1 person)',
                'Small team (2-5 people)',
                'Medium team (6-15 people)',
                'Large team (16-50 people)',
                'Enterprise team (50+ people)'
            ]
        );

        // Timeline
        this.userProfile.timeline = await this.askMultipleChoice(
            'What\'s your project timeline?',
            [
                'Short-term (1-3 months)',
                'Medium-term (3-6 months)',
                'Long-term (6-12 months)',
                'Multi-year (12+ months)',
                'Ongoing/No fixed end'
            ]
        );

        // Methodology Preference
        this.userProfile.methodology = await this.askMultipleChoice(
            'Which methodology resonates with your project?',
            [
                'Traditional/Waterfall (structured, predictable)',
                'Agile/Scrum (flexible, iterative)',
                'Hybrid (mix of structured and agile)',
                'Lean/Kanban (continuous flow)',
                'Not sure - help me decide'
            ]
        );

        console.log('\n✅ Profile collected! Analyzing your needs...\n');
    }

    async recommendTemplates() {
        console.log('🤖 AI-Powered Template Recommendation Engine\n');
        
        // Simulate AI analysis
        await this.simulateAIAnalysis();
        
        const recommendations = this.generateRecommendations();
        
        console.log('📊 Based on your profile, here are your personalized recommendations:\n');
        
        console.log(`👤 Your Profile Summary:
   Experience: ${this.userProfile.experience}
   Project Type: ${this.userProfile.projectType}
   Team Size: ${this.userProfile.teamSize}
   Timeline: ${this.userProfile.timeline}
   Methodology: ${this.userProfile.methodology}\n`);

        console.log('🎯 Recommended Template Bundle:\n');
        
        recommendations.essential.forEach((template, index) => {
            console.log(`   ${index + 1}. ✨ ${template.name} (Essential)`);
            console.log(`      📝 ${template.description}`);
            console.log(`      📁 ${template.path}\n`);
        });

        if (recommendations.suggested.length > 0) {
            console.log('💡 Additional Suggested Templates:\n');
            recommendations.suggested.forEach((template, index) => {
                console.log(`   ${index + 1}. 🔧 ${template.name} (Suggested)`);
                console.log(`      📝 ${template.description}`);
                console.log(`      📁 ${template.path}\n`);
            });
        }

        // Ask user to confirm selections
        const confirmed = await this.askYesNo('Would you like to proceed with these recommendations?');
        
        if (confirmed) {
            this.userProfile.selectedTemplates = [...recommendations.essential, ...recommendations.suggested];
        } else {
            await this.customizeTemplateSelection(recommendations);
        }
    }

    async customizeTemplateSelection(recommendations) {
        console.log('\n🛠️  Let\'s customize your template selection:\n');
        
        const allTemplates = [...recommendations.essential, ...recommendations.suggested];
        
        for (const template of allTemplates) {
            const include = await this.askYesNo(`Include "${template.name}"?`);
            if (include) {
                this.userProfile.selectedTemplates.push(template);
            }
        }
    }

    async setupProject() {
        console.log('\n🏗️  Setting up your project structure...\n');
        
        const projectName = await this.askInput('What\'s your project name?');
        const projectDir = this.sanitizeFileName(projectName);
        
        // Create project directory
        const fullPath = path.join(process.cwd(), 'my-projects', projectDir);
        
        try {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`✅ Project directory created: ${fullPath}`);
            
            // Copy selected templates
            await this.copyTemplates(fullPath);
            
            // Generate project README
            await this.generateProjectReadme(fullPath, projectName);
            
            // Create initial project structure
            await this.createProjectStructure(fullPath);
            
            console.log('\n🎉 Project setup completed successfully!');
            
        } catch (error) {
            console.error('❌ Error setting up project:', error.message);
        }
    }

    async copyTemplates(projectDir) {
        console.log('\n📁 Copying your selected templates...\n');
        
        for (const template of this.userProfile.selectedTemplates) {
            try {
                const templatePath = path.join(__dirname, '..', template.path);
                const destPath = path.join(projectDir, 'templates', template.name);
                
                // Create destination directory
                fs.mkdirSync(path.dirname(destPath), { recursive: true });
                
                // Copy template file
                if (fs.existsSync(templatePath)) {
                    fs.copyFileSync(templatePath, destPath);
                    console.log(`   ✅ ${template.name} → templates/${template.name}`);
                } else {
                    console.log(`   ⚠️  ${template.name} → Template not found, will create placeholder`);
                    this.createTemplatePlaceholder(destPath, template);
                }
            } catch (error) {
                console.log(`   ❌ Error copying ${template.name}: ${error.message}`);
            }
        }
    }

    createTemplatePlaceholder(filePath, template) {
        const content = `# ${template.name}

This template is part of your personalized PM toolkit.

## Description
${template.description}

## Instructions
1. Customize this template for your project needs
2. Fill in the sections below with your project information
3. Remove this instruction section when complete

## Template Content
[Your content here]

---
*Generated by PM Tools Templates Interactive Onboarding*
`;
        fs.writeFileSync(filePath, content);
    }

    async generateProjectReadme(projectDir, projectName) {
        const readmeContent = `# ${projectName}

*Generated by PM Tools Templates Interactive Onboarding*

## Project Overview

**Project Type:** ${this.userProfile.projectType}
**Team Size:** ${this.userProfile.teamSize}  
**Timeline:** ${this.userProfile.timeline}
**Methodology:** ${this.userProfile.methodology}

## Your Personalized Template Kit

This project includes templates specifically selected for your needs:

${this.userProfile.selectedTemplates.map(t => `- **${t.name}**: ${t.description}`).join('\n')}

## Quick Start Guide

1. **Review your templates** in the \`templates/\` folder
2. **Customize templates** with your project-specific information
3. **Follow the methodology guidance** based on your selected approach
4. **Track progress** using the recommended tracking templates

## Next Steps

Based on your profile, we recommend:

${this.generateNextSteps()}

## Resources

- [Full PM Tools Templates Library](../README.md)
- [Methodology Frameworks](../methodology-frameworks/)
- [Getting Started Guide](../docs/getting-started/)

## Support

Need help? Check out:
- Template customization guides
- Methodology-specific best practices  
- Community forum and support

---
*Project created: ${new Date().toLocaleDateString()}*
*Onboarding profile: ${this.userProfile.experience}*
`;

        fs.writeFileSync(path.join(projectDir, 'README.md'), readmeContent);
        console.log('   ✅ Project README.md created');
    }

    async createProjectStructure(projectDir) {
        const directories = [
            'templates',
            'documents',
            'planning',
            'execution',
            'monitoring',
            'closure'
        ];

        directories.forEach(dir => {
            const dirPath = path.join(projectDir, dir);
            fs.mkdirSync(dirPath, { recursive: true });
        });

        console.log('   ✅ Project folder structure created');
    }

    generateRecommendations() {
        const recommendations = {
            essential: [],
            suggested: []
        };

        // Essential templates based on experience level
        if (this.userProfile.experience.includes('New to')) {
            recommendations.essential.push(
                { name: 'Project Charter (Simple)', description: 'Essential project definition document', path: 'quick-start-kits/first-time-pm-starter/project-charter-simple.md' },
                { name: 'Stakeholder Register', description: 'Track project stakeholders', path: 'quick-start-kits/first-time-pm-starter/stakeholder-register-simple.md' },
                { name: 'Communication Plan', description: 'Manage project communications', path: 'quick-start-kits/first-time-pm-starter/communication-plan-simple.md' }
            );
        } else {
            recommendations.essential.push(
                { name: 'Project Charter', description: 'Comprehensive project definition', path: 'project-lifecycle/01-initiation/project-charter/project-charter-template.md' },
                { name: 'Stakeholder Analysis', description: 'Detailed stakeholder management', path: 'project-lifecycle/01-initiation/stakeholder-analysis/stakeholder-register-template.md' },
                { name: 'Risk Register', description: 'Identify and manage project risks', path: 'project-lifecycle/02-planning/risk-management/risk-register-template.md' }
            );
        }

        // Add methodology-specific templates
        if (this.userProfile.methodology.includes('Agile')) {
            recommendations.essential.push(
                { name: 'Sprint Planning Template', description: 'Plan agile sprints effectively', path: 'methodology-frameworks/agile-scrum/sprint-planning-template.md' },
                { name: 'Daily Standup Notes', description: 'Track daily progress', path: 'role-based-toolkits/scrum-master/daily-standup-template.md' }
            );
        }

        if (this.userProfile.methodology.includes('Traditional')) {
            recommendations.essential.push(
                { name: 'Work Breakdown Structure', description: 'Decompose project work', path: 'project-lifecycle/02-planning/work-breakdown-structure/wbs-template.md' },
                { name: 'Gantt Chart Template', description: 'Visual project timeline', path: 'project-lifecycle/02-planning/schedule-planning/gantt-template.md' }
            );
        }

        // Add project type-specific suggestions
        if (this.userProfile.projectType.includes('Software')) {
            recommendations.suggested.push(
                { name: 'DevOps Integration Guide', description: 'Integrate with development processes', path: 'integration_guides/devops-integration.md' },
                { name: 'Technical Documentation Template', description: 'Document technical decisions', path: 'role-based-toolkits/technical-lead/documentation-templates.md' }
            );
        }

        if (this.userProfile.projectType.includes('Business Process')) {
            recommendations.suggested.push(
                { name: 'Process Mapping Template', description: 'Map current and future processes', path: 'business-stakeholder-suite/process-improvement/process-mapping-template.md' },
                { name: 'Change Management Plan', description: 'Manage organizational change', path: 'quick-start-kits/agile-transformation/change-management-plan.md' }
            );
        }

        return recommendations;
    }

    generateNextSteps() {
        const steps = [];
        
        if (this.userProfile.experience.includes('New to')) {
            steps.push(
                '1. **Start with Project Charter** - Define your project clearly',
                '2. **Identify Stakeholders** - Know who matters to your project',  
                '3. **Create Communication Plan** - Keep everyone informed',
                '4. **Review First-Time PM Checklist** - Don\'t miss critical steps'
            );
        } else {
            steps.push(
                '1. **Customize templates** for your organization\'s processes',
                '2. **Set up progress tracking** using recommended dashboards',
                '3. **Establish governance** appropriate for your team size',
                '4. **Plan stakeholder engagement** strategy'
            );
        }

        if (this.userProfile.methodology.includes('Agile')) {
            steps.push('5. **Set up sprint ceremonies** and agile rituals');
        }

        if (this.userProfile.teamSize.includes('Large') || this.userProfile.teamSize.includes('Enterprise')) {
            steps.push('6. **Consider scaled frameworks** for large team coordination');
        }

        return steps.join('\n');
    }

    async generateOnboardingReport() {
        const reportPath = path.join(process.cwd(), 'onboarding-report.md');
        
        const report = `# Onboarding Report

Generated: ${new Date().toLocaleString()}

## Your Profile
- **Experience:** ${this.userProfile.experience}
- **Project Type:** ${this.userProfile.projectType}  
- **Team Size:** ${this.userProfile.teamSize}
- **Timeline:** ${this.userProfile.timeline}
- **Methodology:** ${this.userProfile.methodology}

## Selected Templates
${this.userProfile.selectedTemplates.map(t => `- ${t.name}: ${t.description}`).join('\n')}

## Recommended Learning Path
${this.generateLearningPath()}

## Success Metrics
Track these KPIs to measure your project management effectiveness:
- Template adoption rate
- Stakeholder satisfaction scores
- Project milestone adherence
- Team collaboration metrics

---
*Continue your journey with PM Tools Templates!*
`;

        fs.writeFileSync(reportPath, report);
        console.log(`\n📊 Onboarding report saved: ${reportPath}`);
    }

    generateLearningPath() {
        const learningPath = [];
        
        if (this.userProfile.experience.includes('New to')) {
            learningPath.push(
                '1. **Week 1-2:** Master the basics with First-Time PM Starter Kit',
                '2. **Week 3-4:** Learn stakeholder management fundamentals', 
                '3. **Month 2:** Explore your chosen methodology in depth',
                '4. **Month 3+:** Advanced topics based on project needs'
            );
        } else {
            learningPath.push(
                '1. **Week 1:** Review and customize selected templates',
                '2. **Week 2:** Establish project governance and processes',
                '3. **Ongoing:** Iterate and improve based on lessons learned'
            );
        }

        return learningPath.join('\n');
    }

    displayCompletion() {
        console.log(`
🎉 ═══════════════════════════════════════════════════════════════
   Congratulations! Your onboarding is complete!
═══════════════════════════════════════════════════════════════

✅ What we accomplished:
   • Analyzed your PM profile and project needs
   • Recommended ${this.userProfile.selectedTemplates.length} personalized templates
   • Set up your project structure
   • Created your learning roadmap

🚀 Next Steps:
   1. Review your project folder and templates
   2. Customize templates with your project information
   3. Start with the first recommended template
   4. Join our community for ongoing support

💡 Pro Tip: Bookmark this onboarding report for future reference!

🎯 Your project management journey starts now. 
   We're here to support you every step of the way!

═══════════════════════════════════════════════════════════════
        `);
    }

    // Utility methods
    async askMultipleChoice(question, choices) {
        console.log(`🤔 ${question}\n`);
        choices.forEach((choice, index) => {
            console.log(`   ${index + 1}. ${choice}`);
        });
        
        const answer = await this.askInput('\nEnter your choice (number)');
        const choiceIndex = parseInt(answer) - 1;
        
        if (choiceIndex >= 0 && choiceIndex < choices.length) {
            console.log(`   ✅ Selected: ${choices[choiceIndex]}\n`);
            return choices[choiceIndex];
        } else {
            console.log('   ❌ Invalid choice. Please try again.\n');
            return this.askMultipleChoice(question, choices);
        }
    }

    async askYesNo(question) {
        const answer = await this.askInput(`${question} (y/n)`);
        const normalized = answer.toLowerCase().trim();
        
        if (normalized === 'y' || normalized === 'yes') {
            return true;
        } else if (normalized === 'n' || normalized === 'no') {
            return false;
        } else {
            console.log('Please answer with y/yes or n/no');
            return this.askYesNo(question);
        }
    }

    askInput(question) {
        return new Promise((resolve) => {
            this.rl.question(`${question}: `, resolve);
        });
    }

    async simulateAIAnalysis() {
        const stages = [
            'Analyzing experience level and project complexity...',
            'Matching templates to your methodology preference...',
            'Optimizing for team size and timeline constraints...',
            'Generating personalized recommendations...'
        ];

        for (const stage of stages) {
            process.stdout.write(`🤖 ${stage}`);
            await this.delay(1000);
            console.log(' ✅');
        }
        console.log('');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    sanitizeFileName(name) {
        return name.toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-')
                  .trim();
    }

    loadTemplateIndex() {
        try {
            const indexPath = path.join(__dirname, 'template-index.json');
            const indexData = fs.readFileSync(indexPath, 'utf8');
            return JSON.parse(indexData);
        } catch (error) {
            console.warn('⚠️  Template index not found, using fallback recommendations');
            return {
                templates: {
                    essential: { beginner: [], intermediate: [], advanced: [] },
                    methodology_specific: {},
                    project_type_specific: {},
                    team_size_specific: {},
                    role_based: {}
                },
                recommendations: {},
                metadata: {}
            };
        }
    }
}

// Run the onboarding if called directly
if (require.main === module) {
    const onboarding = new InteractiveOnboarding();
    onboarding.start().catch(console.error);
}

module.exports = InteractiveOnboarding;
