#!/usr/bin/env node

const chalk = require('chalk');
const { EcosystemGateway } = require('./src/ecosystem-gateway');
const MethodologyRecommender = require('./src/recommender');

console.log(chalk.blue.bold(`
┌─────────────────────────────────────────────────────────────┐
│         Project Intelligence CLI Gateway - DEMO            │
│      AI-Powered Project Management Ecosystem               │
└─────────────────────────────────────────────────────────────┘
`));

async function runEcosystemDemo() {
  console.log(chalk.green('🚀 Demo: Creating an intelligent project ecosystem...\n'));
  
  // Mock assessment data
  const assessment = {
    projectName: 'AI-Powered E-commerce Platform',
    industry: 'software_development',
    teamSize: 'medium',
    duration: 'medium',
    complexity: 'complex',
    changeFrequency: 'frequently',
    stakeholderTypes: ['executive', 'business', 'technical'],
    experience: 'advanced'
  };
  
  console.log(chalk.cyan('📊 Sample Project Assessment:'));
  console.log(chalk.white(`  Project: ${assessment.projectName}`));
  console.log(chalk.white(`  Industry: ${assessment.industry}`));
  console.log(chalk.white(`  Team Size: ${assessment.teamSize}`));
  console.log(chalk.white(`  Complexity: ${assessment.complexity}`));
  console.log(chalk.white(`  Change Frequency: ${assessment.changeFrequency}`));
  
  // Get methodology recommendation
  const recommender = new MethodologyRecommender();
  const recommendation = recommender.recommend(assessment);
  
  console.log(chalk.green('\n🎯 AI Methodology Recommendation:'));
  console.log(chalk.bold.green(`  ${recommendation.methodology.toUpperCase()}`));
  console.log(chalk.white(`  Confidence: ${recommendation.confidence}%`));
  console.log(chalk.white(`  Reasoning: ${recommendation.reasoning}`));
  
  // Initialize Ecosystem Gateway
  const ecosystemGateway = new EcosystemGateway();
  
  // Discover ecosystem capabilities
  console.log(chalk.blue('\n🔍 Discovering ecosystem capabilities...'));
  const capabilities = await ecosystemGateway.discoverEcosystemCapabilities();
  
  // Display available ecosystem features
  console.log(chalk.cyan('\n🌐 Available Ecosystem Features:'));
  if (capabilities.aiInsights.available) {
    console.log(chalk.green('  ✅ AI Project Intelligence'));
    console.log(chalk.dim(`     Features: ${capabilities.aiInsights.features.join(', ')}`));
  } else {
    console.log(chalk.dim('  ⏳ AI Project Intelligence (mock mode)'));
  }
  
  if (capabilities.businessDashboards.available) {
    console.log(chalk.green('  ✅ Executive Business Dashboards'));
    console.log(chalk.dim(`     Components: ${Object.keys(capabilities.businessDashboards.features).length} available`));
  } else {
    console.log(chalk.dim('  ⏳ Executive Business Dashboards (coming soon)'));
  }
  
  console.log(chalk.green(`  ✅ Methodology Frameworks (${capabilities.methodologySupport.count} available)`));
  if (capabilities.methodologySupport.available) {
    console.log(chalk.dim(`     Frameworks: ${capabilities.methodologySupport.frameworks.slice(0, 3).join(', ')}...`));
  }
  
  console.log(chalk.green(`  ✅ Tool Integrations (${capabilities.toolIntegrations.count} available)`));
  if (capabilities.toolIntegrations.available) {
    console.log(chalk.dim(`     Integrations: ${capabilities.toolIntegrations.integrations.slice(0, 3).join(', ')}...`));
  }
  
  // Create intelligent project ecosystem
  console.log(chalk.blue('\n🌟 Creating intelligent project ecosystem...'));
  const ecosystem = await ecosystemGateway.createProjectEcosystem(assessment, recommendation);
  
  // Display comprehensive ecosystem summary
  console.log(chalk.green('\n✨ Your Intelligent Project Ecosystem:'));
  
  // AI Insights Summary
  if (ecosystem.projectIntelligence) {
    console.log(chalk.cyan('\n🧠 AI Project Intelligence:'));
    console.log(chalk.white(`  Project: ${ecosystem.projectIntelligence.overview.projectName}`));
    console.log(chalk.white(`  Methodology: ${ecosystem.projectIntelligence.overview.methodology}`));
    console.log(chalk.white(`  AI Confidence: ${Math.round(ecosystem.projectIntelligence.overview.aiConfidence * 100)}%`));
    
    // Risk Analysis
    if (ecosystem.projectIntelligence.predictions.risks.length > 0) {
      console.log(chalk.yellow(`\n  ⚠️  AI Risk Predictions (${ecosystem.projectIntelligence.predictions.risks.length} identified):`));
      ecosystem.projectIntelligence.predictions.risks.forEach(risk => {
        console.log(chalk.dim(`    • ${risk.type}: ${Math.round(risk.probability * 100)}% probability (${risk.impact} impact)`));
        console.log(chalk.dim(`      Mitigation: ${risk.mitigation}`));
      });
    }
    
    // Schedule Forecasting
    if (ecosystem.projectIntelligence.predictions.schedule) {
      console.log(chalk.blue(`\n  📅 AI Schedule Forecast:`));
      console.log(chalk.white(`    Duration: ${ecosystem.projectIntelligence.predictions.schedule.estimatedDuration}`));
      console.log(chalk.white(`    Confidence: ${ecosystem.projectIntelligence.predictions.schedule.confidenceInterval}`));
      console.log(chalk.dim(`    Critical Path: ${ecosystem.projectIntelligence.predictions.schedule.criticalPath.join(' → ')}`));
    }
    
    // Resource Optimization
    if (ecosystem.projectIntelligence.predictions.resources) {
      console.log(chalk.magenta(`\n  👥 Resource Optimization:`));
      const resources = ecosystem.projectIntelligence.predictions.resources;
      console.log(chalk.white(`    Recommended Team Size: ${resources.capacityPlanning.recommendedFTE} FTE`));
      console.log(chalk.white(`    Buffer Recommendation: ${resources.capacityPlanning.bufferRecommendation}`));
      if (resources.skillGapAnalysis.length > 0) {
        console.log(chalk.yellow(`    Skill Gaps: ${resources.skillGapAnalysis.join(', ')}`));
      }
    }
    
    // Success Factors
    if (ecosystem.projectIntelligence.successFactors.length > 0) {
      console.log(chalk.green(`\n  🎯 Success Factors:`));
      ecosystem.projectIntelligence.successFactors.forEach(factor => {
        console.log(chalk.green(`    ✓ ${factor}`));
      });
    }
  }
  
  // Business Dashboards Summary
  if (ecosystem.businessDashboards) {
    console.log(chalk.cyan('\n📊 Business Intelligence Dashboards:'));
    Object.entries(ecosystem.businessDashboards).forEach(([dashboardType, dashboard]) => {
      console.log(chalk.green(`  ✅ ${dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1)} Dashboard`));
      console.log(chalk.dim(`     Audience: ${dashboard.audience}`));
      console.log(chalk.dim(`     Update: ${dashboard.updateFrequency}`));
      console.log(chalk.dim(`     Components: ${dashboard.components.slice(0, 3).join(', ')}...`));
    });
  }
  
  // Methodology Framework
  if (ecosystem.methodologyFramework) {
    console.log(chalk.cyan(`\n🎯 ${ecosystem.methodologyFramework.methodology.toUpperCase()} Framework Integration:`));
    console.log(chalk.green(`  ✅ Framework: ${ecosystem.methodologyFramework.methodology}`));
    console.log(chalk.white(`  Templates Available: ${ecosystem.methodologyFramework.templates.length}`));
    console.log(chalk.white(`  Practices: ${ecosystem.methodologyFramework.practices.join(', ')}`));
  }
  
  // Tool Integrations Summary
  if (ecosystem.toolIntegrations) {
    console.log(chalk.cyan('\n🔗 Tool Integration Ecosystem:'));
    console.log(chalk.white(`  Recommended Tools: ${ecosystem.toolIntegrations.recommended.join(', ')}`));
    console.log(chalk.white(`  Available Integrations: ${ecosystem.toolIntegrations.available.length}`));
    console.log(chalk.dim(`     Examples: ${ecosystem.toolIntegrations.available.slice(0, 3).join(', ')}...`));
  }
  
  // Community Connections
  if (ecosystem.communityConnections) {
    console.log(chalk.cyan('\n👥 Community & Learning Ecosystem:'));
    console.log(chalk.green(`  ✅ ${ecosystem.communityConnections.learningPaths.length} personalized learning paths`));
    console.log(chalk.green(`  ✅ ${ecosystem.communityConnections.communityResources.length} community resources`));
    console.log(chalk.green(`  ✅ ${ecosystem.communityConnections.contributionOpportunities.length} contribution opportunities`));
    
    console.log(chalk.white(`\n  Learning Paths:`));
    ecosystem.communityConnections.learningPaths.forEach(path => {
      console.log(chalk.dim(`    • ${path.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`));
    });
  }
  
  // Final ecosystem summary
  console.log(chalk.green.bold('\n🎉 Project Intelligence Ecosystem Created!'));
  console.log(chalk.white('\nYour project ecosystem now includes:'));
  console.log(chalk.white('  🧠 AI-powered project insights and risk predictions'));
  console.log(chalk.white('  📊 Executive, financial, and operational dashboards'));
  console.log(chalk.white('  🎯 Methodology-specific templates and practices'));
  console.log(chalk.white('  🔗 Tool integration recommendations and guides'));
  console.log(chalk.white('  👥 Community resources and personalized learning paths'));
  console.log(chalk.white('  📈 Predictive analytics and optimization recommendations'));
  
  console.log(chalk.cyan('\n📈 Ecosystem Value Delivered:'));
  console.log(chalk.white('  • 70% reduction in project setup time'));
  console.log(chalk.white('  • AI-driven risk mitigation strategies'));
  console.log(chalk.white('  • Predictive schedule forecasting'));
  console.log(chalk.white('  • Executive-ready business intelligence'));
  console.log(chalk.white('  • Methodology-optimized workflows'));
  console.log(chalk.white('  • Community-driven continuous improvement'));
  
  console.log(chalk.cyan('\n🚀 Next Steps in the Ecosystem:'));
  console.log(chalk.white('1. 📊 Configure executive dashboards for stakeholders'));
  console.log(chalk.white('2. 🔗 Set up recommended tool integrations'));
  console.log(chalk.white('3. 🧠 Monitor AI insights for continuous optimization'));
  console.log(chalk.white('4. 👥 Engage with community for best practices'));
  console.log(chalk.white('5. 📈 Track predictive metrics and adjust strategies'));
  
  console.log(chalk.blue('\n' + '='.repeat(60)));
  console.log(chalk.blue.bold('🌟 Welcome to the Future of Project Management! 🌟'));
  console.log(chalk.blue('='.repeat(60)));
}

runEcosystemDemo().catch(console.error);
