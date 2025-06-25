/**
 * Data Generator
 * Generates sample training data for ML models
 */

import { logger } from '../utils/logger.js';

export class DataGenerator {
  constructor() {
    this.projectTypes = ['web', 'mobile', 'api', 'desktop', 'data'];
    this.methodologies = ['agile', 'waterfall', 'hybrid'];
    this.complexities = ['low', 'medium', 'high'];
    this.industries = ['tech', 'finance', 'healthcare', 'education', 'retail'];
  }

  async generateTrainingData() {
    try {
      logger.info('📊 Generating sample training data...');
      
      const projects = this.generateProjectData(100);
      const risks = this.generateRiskData(200);
      const resources = this.generateResourceData(150);
      
      logger.info(`✅ Generated ${projects.length} projects, ${risks.length} risks, ${resources.length} resource records`);
      
      return {
        projects,
        risks,
        resources,
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
          purpose: 'AI model training'
        }
      };

    } catch (error) {
      logger.error('❌ Failed to generate training data:', error);
      throw error;
    }
  }

  generateProjectData(count) {
    const projects = [];
    
    for (let i = 0; i < count; i++) {
      const project = {
        id: `proj-${String(i + 1).padStart(3, '0')}`,
        name: `Project ${i + 1}`,
        type: this.randomChoice(this.projectTypes),
        methodology: this.randomChoice(this.methodologies),
        complexity: this.randomChoice(this.complexities),
        industry: this.randomChoice(this.industries),
        teamSize: this.randomInt(3, 12),
        duration: this.randomInt(30, 365),
        budget: this.randomInt(10000, 500000),
        stakeholders: this.randomInt(3, 20),
        requirements: this.randomInt(10, 100),
        features: this.randomInt(5, 50),
        teamExperience: this.randomFloat(0.3, 1.0),
        historicalData: {
          similarProjects: this.randomInt(0, 50),
          successRate: this.randomFloat(0.6, 0.95),
          avgDelay: this.randomFloat(0.0, 0.4)
        },
        outcome: {
          success: Math.random() > 0.3,
          actualDuration: this.randomInt(30, 400),
          actualBudget: this.randomInt(10000, 600000),
          qualityScore: this.randomFloat(60, 100),
          stakeholderSatisfaction: this.randomFloat(60, 100)
        }
      };
      
      projects.push(project);
    }
    
    return projects;
  }

  generateRiskData(count) {
    const riskTypes = [
      'technical', 'schedule', 'budget', 'resource', 'quality', 
      'scope', 'stakeholder', 'external', 'compliance', 'security'
    ];
    
    const risks = [];
    
    for (let i = 0; i < count; i++) {
      const risk = {
        id: `risk-${String(i + 1).padStart(3, '0')}`,
        projectId: `proj-${String(this.randomInt(1, 100)).padStart(3, '0')}`,
        type: this.randomChoice(riskTypes),
        severity: this.randomChoice(['low', 'medium', 'high', 'critical']),
        probability: this.randomFloat(0.1, 0.9),
        impact: this.randomFloat(0.1, 0.9),
        status: this.randomChoice(['open', 'mitigating', 'closed']),
        identifiedDate: this.randomDate(),
        resolvedDate: Math.random() > 0.5 ? this.randomDate() : null,
        description: `Risk ${i + 1} description`,
        owner: `Team Member ${this.randomInt(1, 10)}`,
        mitigation: `Mitigation strategy for risk ${i + 1}`
      };
      
      risks.push(risk);
    }
    
    return risks;
  }

  generateResourceData(count) {
    const roles = ['frontend', 'backend', 'fullstack', 'qa', 'devops', 'designer', 'pm', 'architect'];
    const skills = ['javascript', 'python', 'java', 'react', 'nodejs', 'docker', 'aws', 'testing'];
    
    const resources = [];
    
    for (let i = 0; i < count; i++) {
      const resource = {
        id: `res-${String(i + 1).padStart(3, '0')}`,
        name: `Resource ${i + 1}`,
        role: this.randomChoice(roles),
        experience: this.randomFloat(0.5, 10.0),
        utilization: this.randomFloat(0.5, 1.0),
        skills: this.randomSample(skills, this.randomInt(2, 5)),
        availability: this.randomFloat(0.7, 1.0),
        cost: this.randomInt(50, 200), // per hour
        productivity: this.randomFloat(0.6, 1.2),
        projectHistory: {
          projectsCompleted: this.randomInt(0, 20),
          averageRating: this.randomFloat(3.0, 5.0),
          onTimeDelivery: this.randomFloat(0.7, 1.0)
        }
      };
      
      resources.push(resource);
    }
    
    return resources;
  }

  // Utility methods
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  randomSample(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomFloat(min, max, decimals = 2) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
  }

  randomDate(start = new Date(2023, 0, 1), end = new Date()) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
}

