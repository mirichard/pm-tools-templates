#!/usr/bin/env node

/**
 * Template Selection Wizard Script
 * Guides users through template selection based on project needs
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

class TemplateSelectionWizard {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        this.userProfile = {
            projectType: null,
            methodology: null,
            teamSize: null
        };

        this.templates = this.loadTemplateIndex();
    }

    async start() {
        console.clear();
        this.displayWelcome();

        try {
            await this.collectUserProfile();
            const recommendations = this.recommendTemplates();
            this.displayRecommendations(recommendations);
        } catch (error) {
            console.error('❌ Error during template selection:', error.message);
        } finally {
            this.rl.close();
        }
    }

    displayWelcome() {
        console.log(`
🎯 Welcome to the Template Selection Wizard!
Let's find the perfect template for your project needs.
`);
    }

    async collectUserProfile() {
        this.userProfile.projectType = await this.askMultipleChoice('What type of project are you managing?', [
            'Software/IT Development',
            'Business Process Improvement',
            'Product Launch',
            'Organizational Change',
            'Construction/Engineering'
        ]);

        this.userProfile.methodology = await this.askMultipleChoice('Which methodology resonates with your project?', [
            'Traditional/Waterfall (structured, predictable)',
            'Agile/Scrum (flexible, iterative)',
            'Hybrid (mix of structured and agile)',
            'Not sure - help me decide'
        ]);

        this.userProfile.teamSize = await this.askMultipleChoice('What is your team size?', [
            'Solo/Individual (1 person)',
            'Small team (2-5 people)',
            'Medium team (6-15 people)',
            'Large team (16-50 people)'
        ]);
    }

    recommendTemplates() {
        const { projectType, methodology, teamSize } = this.userProfile;
        const recommendations = [];

        for (const category in this.templates.methodology_specific) {
            const templates = this.templates.methodology_specific[category];
            templates.forEach(template => {
                if (template.methodology.includes(methodology) &&
                    template.projectTypes.includes(projectType) &&
                    template.teamSizes.includes(teamSize)) {
                    recommendations.push(template);
                }
            });
        }

        return recommendations;
    }

    displayRecommendations(recommendations) {
        console.log('\nRecommended Templates:');
        recommendations.forEach(template => {
            console.log(`- ${template.name}: ${template.description} (${template.path})`);
        });
    }

    askMultipleChoice(question, choices) {
        return new Promise(resolve => {
            console.log(`\n${question}`);
            choices.forEach((choice, index) => {
                console.log(`   ${index + 1}. ${choice}`);
            });

            this.rl.question('Enter your choice: ', answer => {
                const index = parseInt(answer) - 1;
                if (index >= 0 && index < choices.length) {
                    resolve(choices[index]);
                } else {
                    console.log('Invalid choice, please try again.');
                    resolve(this.askMultipleChoice(question, choices));
                }
            });
        });
    }

    loadTemplateIndex() {
        try {
            const indexPath = path.join(__dirname, 'template-index.json');
            const indexData = fs.readFileSync(indexPath, 'utf8');
            return JSON.parse(indexData);
        } catch (error) {
            console.error('⚠️ Template index not found.', error.message);
            return { methodology_specific: {} };
        }
    }
}

// Run the selection wizard if called directly
if (require.main === module) {
    const wizard = new TemplateSelectionWizard();
    wizard.start().catch(console.error);
}

module.exports = TemplateSelectionWizard;

