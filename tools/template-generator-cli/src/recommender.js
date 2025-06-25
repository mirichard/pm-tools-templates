class MethodologyRecommender {
  constructor() {
    // Scoring weights for different methodology factors
    this.weights = {
      changeFrequency: 0.3,
      complexity: 0.25,
      teamSize: 0.2,
      duration: 0.15,
      industry: 0.1
    };
  }

  recommend(assessment) {
    const scores = {
      agile: this.calculateAgileScore(assessment),
      traditional: this.calculateTraditionalScore(assessment), 
      hybrid: this.calculateHybridScore(assessment)
    };

    // Find the methodology with the highest score
    const recommended = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    );

    const methodology = recommended[0];
    const confidence = Math.round(recommended[1] * 100);

    return {
      methodology,
      confidence,
      reasoning: this.generateReasoning(assessment, methodology, scores),
      scores,
      templates: this.getRecommendedTemplates(methodology, assessment)
    };
  }

  calculateAgileScore(assessment) {
    let score = 0;

    // Change frequency (30% weight)
    const changeScores = {
      constantly: 1.0,
      frequently: 0.9,
      occasionally: 0.6,
      rarely: 0.2
    };
    score += (changeScores[assessment.changeFrequency] || 0.5) * this.weights.changeFrequency;

    // Complexity (25% weight) - Agile works well for complex innovation projects
    const complexityScores = {
      highly_complex: 0.9,
      complex: 0.8,
      moderate: 0.7,
      simple: 0.4
    };
    score += (complexityScores[assessment.complexity] || 0.5) * this.weights.complexity;

    // Team size (20% weight) - Agile works best with smaller teams
    const teamSizeScores = {
      small: 1.0,
      medium: 0.8,
      large: 0.5,
      enterprise: 0.3
    };
    score += (teamSizeScores[assessment.teamSize] || 0.5) * this.weights.teamSize;

    // Duration (15% weight) - Agile works well for shorter durations
    const durationScores = {
      short: 0.9,
      medium: 0.8,
      long: 0.6,
      ongoing: 0.7
    };
    score += (durationScores[assessment.duration] || 0.5) * this.weights.duration;

    // Industry (10% weight) - Software development strongly favors Agile
    const industryScores = {
      software_development: 1.0,
      information_technology: 0.9,
      general: 0.7,
      financial_services: 0.6,
      healthcare_pharmaceutical: 0.5,
      construction: 0.3
    };
    score += (industryScores[assessment.industry] || 0.5) * this.weights.industry;

    return score;
  }

  calculateTraditionalScore(assessment) {
    let score = 0;

    // Change frequency (30% weight) - Traditional works best with stable requirements
    const changeScores = {
      rarely: 1.0,
      occasionally: 0.8,
      frequently: 0.4,
      constantly: 0.1
    };
    score += (changeScores[assessment.changeFrequency] || 0.5) * this.weights.changeFrequency;

    // Complexity (25% weight) - Traditional works well for well-defined complex projects
    const complexityScores = {
      simple: 0.9,
      moderate: 0.8,
      complex: 0.7,
      highly_complex: 0.3
    };
    score += (complexityScores[assessment.complexity] || 0.5) * this.weights.complexity;

    // Team size (20% weight) - Traditional can handle larger teams well
    const teamSizeScores = {
      enterprise: 1.0,
      large: 0.9,
      medium: 0.7,
      small: 0.5
    };
    score += (teamSizeScores[assessment.teamSize] || 0.5) * this.weights.teamSize;

    // Duration (15% weight) - Traditional works well for longer projects
    const durationScores = {
      long: 1.0,
      ongoing: 0.9,
      medium: 0.7,
      short: 0.4
    };
    score += (durationScores[assessment.duration] || 0.5) * this.weights.duration;

    // Industry (10% weight) - Construction and regulated industries favor Traditional
    const industryScores = {
      construction: 1.0,
      healthcare_pharmaceutical: 0.9,
      financial_services: 0.8,
      general: 0.6,
      information_technology: 0.4,
      software_development: 0.2
    };
    score += (industryScores[assessment.industry] || 0.5) * this.weights.industry;

    return score;
  }

  calculateHybridScore(assessment) {
    // Hybrid methodology gets a moderate baseline score
    let score = 0.5; // Reduced base score to be less dominant

    // Calculate agile and traditional scores to determine if hybrid is truly needed
    const agileScore = this.calculateAgileScore(assessment);
    const traditionalScore = this.calculateTraditionalScore(assessment);
    
    // Hybrid is most valuable when agile and traditional scores are close
    const scoreDifference = Math.abs(agileScore - traditionalScore);
    
    // If scores are very close (within 0.15), hybrid gets a bonus
    if (scoreDifference <= 0.15) {
      score += 0.2; // Bonus for balanced characteristics
    }
    
    // Small bonus for truly mixed conditions (but not excessive)
    if (assessment.complexity === 'moderate' || assessment.complexity === 'complex') {
      score += 0.05;
    }

    if (assessment.teamSize === 'medium' || assessment.teamSize === 'large') {
      score += 0.05;
    }

    if (assessment.changeFrequency === 'occasionally') {
      score += 0.1; // Only for truly middle-ground change frequency
    }

    if (assessment.duration === 'medium' || assessment.duration === 'long') {
      score += 0.05;
    }

    // Bonus for genuinely mixed stakeholder types (4+ types suggests hybrid need)
    if (assessment.stakeholderTypes && assessment.stakeholderTypes.length >= 4) {
      score += 0.1;
    }

    return Math.min(score, 0.85); // Cap at 85% to avoid always winning
  }

  generateReasoning(assessment, methodology, scores) {
    const reasons = [];

    if (methodology === 'agile') {
      if (assessment.changeFrequency === 'frequently' || assessment.changeFrequency === 'constantly') {
        reasons.push('high change frequency suits iterative development');
      }
      if (assessment.teamSize === 'small' || assessment.teamSize === 'medium') {
        reasons.push('team size is optimal for agile collaboration');
      }
      if (assessment.industry === 'software_development' || assessment.industry === 'information_technology') {
        reasons.push('industry strongly benefits from agile practices');
      }
      if (assessment.complexity === 'complex' || assessment.complexity === 'highly_complex') {
        reasons.push('complex projects benefit from iterative discovery');
      }
    } else if (methodology === 'traditional') {
      if (assessment.changeFrequency === 'rarely' || assessment.changeFrequency === 'occasionally') {
        reasons.push('stable requirements suit sequential planning');
      }
      if (assessment.teamSize === 'large' || assessment.teamSize === 'enterprise') {
        reasons.push('large teams benefit from structured processes');
      }
      if (assessment.industry === 'construction' || assessment.industry === 'healthcare_pharmaceutical') {
        reasons.push('industry requires detailed documentation and compliance');
      }
      if (assessment.duration === 'long' || assessment.duration === 'ongoing') {
        reasons.push('long duration projects benefit from comprehensive planning');
      }
    } else if (methodology === 'hybrid') {
      reasons.push('mixed project characteristics benefit from flexible approach');
      if (assessment.stakeholderTypes && assessment.stakeholderTypes.length >= 3) {
        reasons.push('diverse stakeholders require both agile and traditional elements');
      }
      reasons.push('balanced methodology provides structured flexibility');
    }

    return reasons.join(', ');
  }

  getRecommendedTemplates(methodology, assessment) {
    const baseTemplates = {
      agile: [
        'product_backlog_template.md',
        'sprint_planning_template.md',
        'sprint_retrospective_template.md',
        'user_story_template.md'
      ],
      traditional: [
        'project_charter_template.md',
        'project_management_plan_template.md',
        'work_breakdown_structure_template.md',
        'status_report_template.md'
      ],
      hybrid: [
        'hybrid_project_charter_template.md',
        'hybrid_release_planning_template.md',
        'integrated_change_strategy_template.md',
        'progressive_acceptance_plan_template.md'
      ]
    };

    let templates = [...(baseTemplates[methodology] || [])];

    // Add industry-specific templates
    if (assessment.industry !== 'general') {
      templates.push(`${assessment.industry}_project_charter.md`);
      templates.push(`${assessment.industry}_risk_register.md`);
    }

    // Add role-based templates based on team size
    if (assessment.teamSize === 'large' || assessment.teamSize === 'enterprise') {
      templates.push('stakeholder_communication_planning.md');
      templates.push('team_performance_assessment_template.md');
    }

    // Add complexity-based templates
    if (assessment.complexity === 'complex' || assessment.complexity === 'highly_complex') {
      templates.push('risk_register_template.md');
      templates.push('change_request_template.md');
    }

    return templates;
  }
}

module.exports = MethodologyRecommender;

