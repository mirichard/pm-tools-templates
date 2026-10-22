#!/usr/bin/env node

/**
 * PM Tools Templates - Ecosystem Gateway
 * AI-Powered Project Intelligence Ecosystem with Interactive Onboarding
 * Part of Phase 2 Enhancement: User Experience Revolution
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class EcosystemGateway {
    constructor() {
        this.version = '2.0.0';
        this.features = {
            onboarding: true,
            aiInsights: false,
            workflowOrchestration: true,
            dashboards: true,
            analytics: false // Phase 2 upcoming
        };
    }

    displayWelcome() {
        console.clear();
        console.log(`
🎯 ═══════════════════════════════════════════════════════════════
   PM Tools Templates - AI-Powered Ecosystem Gateway v${this.version}
   Revolutionary Project Management Intelligence Platform
═══════════════════════════════════════════════════════════════

🚀 Next-Generation Features:
   ✨ Interactive Onboarding Experience
   🤖 AI-Powered Template Recommendations 
   🏗️  Automated Project Setup
   📊 Dashboard Generation (MVP)
   🔄 Workflow Orchestration

📋 What would you like to do?
`);
    }

    displayMenu() {
        console.log(`1. 🎯 Start Interactive Onboarding (New Users)
2. 📚 Browse Template Library
3. 🚀 Quick Project Setup
4. 📊 Generate Dashboard
5. 🔍 Search Templates
6. 📈 View Implementation Status
7. ❓ Help & Documentation
8. 🚪 Exit
`);
    }

    async startOnboarding() {
        console.log('\n🎯 Launching Interactive Onboarding Experience...\n');
        
        try {
            const onboardingPath = path.join(__dirname, 'onboarding', 'interactive-onboarding.js');
            
            if (fs.existsSync(onboardingPath)) {
                const onboarding = spawn('node', [onboardingPath], {
                    stdio: 'inherit'
                });
                
                onboarding.on('close', (code) => {
                    if (code === 0) {
                        console.log('\n✅ Onboarding completed successfully!');
                        console.log('🎉 Welcome to your PM journey!');
                    } else {
                        console.log('\n⚠️  Onboarding process interrupted.');
                    }
                    this.showReturnMenu();
                });
            } else {
                console.log('❌ Onboarding system not found. Please check installation.');
                this.showReturnMenu();
            }
        } catch (error) {
            console.error('❌ Error starting onboarding:', error.message);
            this.showReturnMenu();
        }
    }

    browseTemplates() {
        console.log(`
📚 Template Library Overview:

🎯 By Methodology:
   • Traditional/Waterfall: project-lifecycle/
   • Agile/Scrum: methodology-frameworks/agile-scrum/
   • Hybrid Approaches: methodology-frameworks/hybrid-approaches/

👥 By Role:
   • Project Manager: role-based-toolkits/project-manager/
   • Scrum Master: role-based-toolkits/scrum-master/
   • Product Owner: role-based-toolkits/product-owner/

🚀 Quick Start Kits:
   • First-Time PM: quick-start-kits/first-time-pm-starter/
   • Agile Transformation: quick-start-kits/agile-transformation/
   • Executive Reporting: quick-start-kits/executive-reporting/

💼 Business Stakeholders:
   • Executive Dashboards: business-stakeholder-suite/
   • Governance Templates: business-stakeholder-suite/governance/
   • Process Improvement: business-stakeholder-suite/process-improvement/

📁 Total Templates: 80+ professional templates
🎯 Coverage: All major PM methodologies and frameworks
`);
        this.showReturnMenu();
    }

    quickProjectSetup() {
        console.log(`
🚀 Quick Project Setup Options:

1. **For New PMs**: Use First-Time PM Starter Kit
   📁 Location: quick-start-kits/first-time-pm-starter/
   ⏱️  Setup time: 15 minutes

2. **For Agile Teams**: Agile/Scrum Framework
   📁 Location: methodology-frameworks/agile-scrum/
   ⏱️  Setup time: 30 minutes

3. **For Traditional Projects**: Complete Project Lifecycle
   📁 Location: project-lifecycle/
   ⏱️  Setup time: 45 minutes

4. **For Enterprise**: Business Stakeholder Suite
   📁 Location: business-stakeholder-suite/
   ⏱️  Setup time: 60 minutes

💡 Recommendation: Use Interactive Onboarding (Option 1) for personalized setup!
`);
        this.showReturnMenu();
    }

    generateDashboard() {
        console.log(`
📊 Dashboard Generation (MVP Phase):

✅ Available Dashboards:
   • Project Health Dashboard: dashboards/project-health/
   • Executive Summary: dashboards/executive-summary/
   • Team Performance: dashboards/team-performance/
   • Risk Overview: dashboards/risk-overview/

🔄 In Development (Phase 2):
   • Real-time Analytics
   • AI insights — withdrawn pending validation
   • Predictive Dashboards
   • Custom Dashboard Builder

📝 Current Status: Static templates available
🚀 Next Release: Interactive dashboard generation
`);
        this.showReturnMenu();
    }

    searchTemplates() {
        console.log(`
🔍 Template Search & Discovery:

🎯 Search by Category:
   • Project Phase: initiation, planning, execution, monitoring, closure
   • Methodology: traditional, agile, hybrid, lean
   • Industry: software, construction, healthcare, finance
   • Team Size: solo, small, medium, large, enterprise

🤖 AI-Powered Search (Coming in Phase 2):
   • Natural language queries
   • Semantic template matching
   • Smart recommendations
   • Auto-complete suggestions

📝 Current: Manual browsing via directory structure
🚀 Next: Unified Search & Discovery System
`);
        this.showReturnMenu();
    }

    viewImplementationStatus() {
        console.log(`
📈 Implementation Status - Phase 2 Progress:

✅ COMPLETED (Phase 1):
   • 80+ Professional Templates
   • Quick Start Kits
   • Role-Based Toolkits
   • Getting Started Guides
   • Progressive Complexity System

🔄 IN PROGRESS (Phase 2):
   • ✅ Interactive Onboarding Experience
   • 🔄 Unified Search & Discovery System
   • 📋 Enhanced Template Examples
   • 📊 Usage Analytics Platform

📋 PLANNED (Phase 2 Remaining):
   • Advanced AI Insights
   • Tool Integrations (Jira, Slack, etc.)
   • Template Marketplace Foundation
   • Community Platform MVP

🎯 Current Focus: User Experience Revolution
📅 Phase 2 Target: Enhanced UX and Intelligence Features
`);
        this.showReturnMenu();
    }

    showHelp() {
        console.log(`
❓ Help & Documentation:

📖 Getting Started:
   • docs/getting-started/README.md - Complete getting started guide
   • docs/getting-started/template-selector.md - Find the right templates
   • docs/getting-started/methodology-selector.md - Choose your approach

🎯 Quick References:
   • TEMPLATE_SELECTION_CHECKLIST.md - Template selection guide
   • GUIDE.md - Comprehensive user guide  
   • README.md - Project overview and features

💡 Pro Tips:
   • Start with Interactive Onboarding for personalized guidance
   • Use Progressive Complexity (Beginner → Intermediate → Advanced)
   • Join community discussions for best practices

🆘 Need Support?
   • Check troubleshooting guides
   • Visit community forum
   • Review implementation status
`);
        this.showReturnMenu();
    }

    showReturnMenu() {
        console.log('\n' + '═'.repeat(65));
        console.log('Press any key to return to main menu...');
        
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once('data', () => {
            process.stdin.setRawMode(false);
            this.start();
        });
    }

    async getUserChoice() {
        return new Promise((resolve) => {
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.once('data', (data) => {
                const choice = data.toString().trim();
                process.stdin.setRawMode(false);
                resolve(choice);
            });
        });
    }

    async start() {
        this.displayWelcome();
        this.displayMenu();
        
        console.log('Enter your choice (1-8): ');
        const choice = await this.getUserChoice();
        
        switch (choice) {
            case '1':
                await this.startOnboarding();
                break;
            case '2':
                this.browseTemplates();
                break;
            case '3':
                this.quickProjectSetup();
                break;
            case '4':
                this.generateDashboard();
                break;
            case '5':
                this.searchTemplates();
                break;
            case '6':
                this.viewImplementationStatus();
                break;
            case '7':
                this.showHelp();
                break;
            case '8':
                console.log('\n👋 Thank you for using PM Tools Templates!');
                console.log('🚀 Keep building amazing projects!\n');
                process.exit(0);
                break;
            default:
                console.log('\n❌ Invalid choice. Please try again.\n');
                this.start();
                break;
        }
    }
}

// Run the gateway if called directly
if (require.main === module) {
    const gateway = new EcosystemGateway();
    gateway.start().catch(console.error);
}

module.exports = EcosystemGateway;
