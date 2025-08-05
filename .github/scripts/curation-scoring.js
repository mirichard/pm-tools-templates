#!/usr/bin/env node

/**
 * Template Curation Scoring Algorithm
 * Calculates quality scores for template marketplace curation
 */

class TemplateCurationScorer {
  constructor() {
    this.weights = {
      quality: 0.25,        // Validation and review scores
      community: 0.30,      // Ratings and usage statistics
      engagement: 0.20,     // Comments, contributions, discussions
      maintenance: 0.15,    // Update frequency, issue resolution
      innovation: 0.10      // Uniqueness, methodology advancement
    };
  }

  /**
   * Calculate overall curation score for a template
   * @param {Object} templateData - Template metrics and data
   * @returns {Object} Scoring results with breakdown
   */
  calculateScore(templateData) {
    const scores = {
      quality: this.calculateQualityScore(templateData),
      community: this.calculateCommunityScore(templateData),
      engagement: this.calculateEngagementScore(templateData),
      maintenance: this.calculateMaintenanceScore(templateData),
      innovation: this.calculateInnovationScore(templateData)
    };

    // Calculate weighted overall score
    const overallScore = Object.keys(scores).reduce((total, category) => {
      return total + (scores[category] * this.weights[category]);
    }, 0);

    // Determine tier based on score
    const tier = this.determineTier(overallScore);

    return {
      overallScore: Math.round(overallScore * 100) / 100,
      tier,
      categoryScores: scores,
      weights: this.weights,
      recommendations: this.generateRecommendations(scores, overallScore)
    };
  }

  /**
   * Calculate quality score (0-100)
   */
  calculateQualityScore(data) {
    let score = 0;
    let factors = 0;

    // Validation score (automated checks)
    if (data.validation) {
      score += this.normalizeScore(data.validation.score || 0, 100);
      factors++;
    }

    // Expert review scores
    if (data.expertReviews && data.expertReviews.length > 0) {
      const avgExpertScore = data.expertReviews.reduce((sum, review) => {
        return sum + this.convertReviewToScore(review);
      }, 0) / data.expertReviews.length;
      score += avgExpertScore;
      factors++;
    }

    // Peer review scores
    if (data.peerReviews && data.peerReviews.length > 0) {
      const avgPeerScore = data.peerReviews.reduce((sum, review) => {
        return sum + this.convertReviewToScore(review);
      }, 0) / data.peerReviews.length;
      score += avgPeerScore * 0.8; // Slightly lower weight than expert reviews
      factors++;
    }

    // Documentation quality
    if (data.documentation) {
      const docScore = this.assessDocumentationQuality(data.documentation);
      score += docScore;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate community score (0-100)
   */
  calculateCommunityScore(data) {
    let score = 0;
    let factors = 0;

    // Star ratings from community
    if (data.ratings && data.ratings.length > 0) {
      const avgRating = data.ratings.reduce((sum, rating) => sum + rating.stars, 0) / data.ratings.length;
      score += (avgRating / 5) * 100;
      factors++;

      // Bonus for number of ratings (credibility)
      const ratingBonus = Math.min(data.ratings.length / 10, 1) * 10;
      score += ratingBonus;
      factors++;
    }

    // Usage statistics
    if (data.usage) {
      const usageScore = Math.min((data.usage.downloads || 0) / 100, 1) * 80;
      score += usageScore;
      factors++;

      // Completion rate (how many people complete the template)
      if (data.usage.completionRate) {
        score += data.usage.completionRate;
        factors++;
      }
    }

    // Community feedback sentiment
    if (data.feedback) {
      const sentimentScore = this.analyzeSentiment(data.feedback);
      score += sentimentScore;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate engagement score (0-100)
   */
  calculateEngagementScore(data) {
    let score = 0;
    let factors = 0;

    // GitHub engagement (issues, discussions, PRs)
    if (data.github) {
      const issueActivity = Math.min((data.github.issues || 0) / 5, 1) * 30;
      const discussionActivity = Math.min((data.github.discussions || 0) / 10, 1) * 40;
      const prActivity = Math.min((data.github.pullRequests || 0) / 3, 1) * 30;
      
      score += issueActivity + discussionActivity + prActivity;
      factors++;
    }

    // Community contributions
    if (data.contributions) {
      const contributorScore = Math.min(data.contributions.length / 5, 1) * 60;
      score += contributorScore;
      factors++;

      // Quality of contributions
      const contributionQuality = data.contributions.reduce((sum, contrib) => {
        return sum + this.assessContributionQuality(contrib);
      }, 0) / data.contributions.length;
      score += contributionQuality * 40;
      factors++;
    }

    // Social sharing and mentions
    if (data.social) {
      const shareScore = Math.min((data.social.shares || 0) / 20, 1) * 50;
      const mentionScore = Math.min((data.social.mentions || 0) / 10, 1) * 50;
      score += shareScore + mentionScore;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate maintenance score (0-100)
   */
  calculateMaintenanceScore(data) {
    let score = 0;
    let factors = 0;

    // Update frequency
    if (data.maintenance && data.maintenance.lastUpdated) {
      const daysSinceUpdate = (Date.now() - new Date(data.maintenance.lastUpdated)) / (1000 * 60 * 60 * 24);
      const freshnessScore = Math.max(100 - (daysSinceUpdate / 30) * 10, 0);
      score += freshnessScore;
      factors++;
    }

    // Issue resolution rate
    if (data.issues) {
      const resolutionRate = (data.issues.resolved || 0) / Math.max(data.issues.total || 1, 1);
      score += resolutionRate * 100;
      factors++;

      // Average resolution time
      if (data.issues.avgResolutionTime) {
        const timeScore = Math.max(100 - (data.issues.avgResolutionTime / 7) * 10, 0);
        score += timeScore;
        factors++;
      }
    }

    // Version history and stability
    if (data.versions) {
      const versionScore = Math.min(data.versions.length / 5, 1) * 60;
      score += versionScore;
      factors++;

      // Stability (fewer major version changes)
      const stabilityScore = Math.max(100 - (data.versions.majorChanges || 0) * 10, 0);
      score += stabilityScore * 0.4;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate innovation score (0-100)
   */
  calculateInnovationScore(data) {
    let score = 0;
    let factors = 0;

    // Uniqueness (how different from existing templates)
    if (data.uniqueness) {
      score += data.uniqueness.score || 0;
      factors++;
    }

    // Methodology advancement
    if (data.methodology) {
      const methodologyScore = this.assessMethodologyInnovation(data.methodology);
      score += methodologyScore;
      factors++;
    }

    // Feature innovation
    if (data.features) {
      const featureScore = data.features.innovative || 0;
      score += featureScore;
      factors++;
    }

    // Industry impact
    if (data.impact) {
      const impactScore = this.assessIndustryImpact(data.impact);
      score += impactScore;
      factors++;
    }

    return factors > 0 ? score / factors : 50; // Default to average if no innovation data
  }

  /**
   * Helper methods
   */
  
  convertReviewToScore(review) {
    const ratings = {
      'high': 100,
      'medium': 75,
      'good': 85,
      'excellent': 100,
      'low': 50,
      'poor': 25
    };

    let score = 0;
    let count = 0;

    // Convert various review fields to scores
    ['technical_feasibility', 'community_value', 'strategic_alignment'].forEach(field => {
      if (review[field]) {
        const fieldValue = review[field].toLowerCase();
        Object.keys(ratings).forEach(key => {
          if (fieldValue.includes(key)) {
            score += ratings[key];
            count++;
          }
        });
      }
    });

    return count > 0 ? score / count : 75; // Default to good
  }

  assessDocumentationQuality(documentation) {
    let score = 0;

    // Completeness
    if (documentation.completeness) {
      score += documentation.completeness * 0.4;
    }

    // Clarity
    if (documentation.clarity) {
      score += documentation.clarity * 0.3;
    }

    // Examples and usage
    if (documentation.examples) {
      score += Math.min(documentation.examples * 10, 30);
    }

    return Math.min(score, 100);
  }

  analyzeSentiment(feedback) {
    // Simplified sentiment analysis
    const positive = feedback.filter(f => f.sentiment === 'positive').length;
    const negative = feedback.filter(f => f.sentiment === 'negative').length;
    const total = feedback.length;

    if (total === 0) return 50;

    return (positive / total) * 100;
  }

  assessContributionQuality(contribution) {
    // Assess quality of community contributions
    let score = 50; // Base score

    if (contribution.type === 'improvement') score += 20;
    if (contribution.type === 'bug_fix') score += 15;
    if (contribution.type === 'documentation') score += 10;
    if (contribution.approved) score += 15;

    return Math.min(score, 100);
  }

  assessMethodologyInnovation(methodology) {
    // Assess how innovative the methodology approach is
    const innovationFactors = {
      'hybrid': 80,
      'novel': 95,
      'traditional': 40,
      'improved': 70,
      'adapted': 60
    };

    return innovationFactors[methodology.type] || 50;
  }

  assessIndustryImpact(impact) {
    // Assess the template's impact on the industry
    let score = 0;

    if (impact.adoptionRate) score += impact.adoptionRate * 0.3;
    if (impact.casesStudies) score += Math.min(impact.casesStudies * 10, 30);
    if (impact.citations) score += Math.min(impact.citations * 5, 40);

    return Math.min(score, 100);
  }

  normalizeScore(value, max) {
    return Math.min((value / max) * 100, 100);
  }

  determineTier(score) {
    if (score >= 90) return 'PREMIUM';
    if (score >= 80) return 'FEATURED';  
    if (score >= 70) return 'RECOMMENDED';
    if (score >= 60) return 'STANDARD';
    return 'COMMUNITY';
  }

  generateRecommendations(scores, overallScore) {
    const recommendations = [];

    // Quality recommendations
    if (scores.quality < 70) {
      recommendations.push({
        category: 'Quality',
        priority: 'High',
        action: 'Improve template validation scores and address review feedback'
      });
    }

    // Community recommendations
    if (scores.community < 60) {
      recommendations.push({
        category: 'Community',
        priority: 'Medium',
        action: 'Encourage more user ratings and improve usage statistics'
      });
    }

    // Engagement recommendations
    if (scores.engagement < 50) {
      recommendations.push({
        category: 'Engagement',
        priority: 'Medium',
        action: 'Foster community discussions and encourage contributions'
      });
    }

    // Maintenance recommendations
    if (scores.maintenance < 60) {
      recommendations.push({
        category: 'Maintenance',
        priority: 'High',
        action: 'Update template more frequently and improve issue resolution'
      });
    }

    // Overall recommendations
    if (overallScore >= 90) {
      recommendations.push({
        category: 'Marketplace',
        priority: 'Low',
        action: 'Promote to Premium tier and feature in marketplace'
      });
    } else if (overallScore >= 80) {
      recommendations.push({
        category: 'Marketplace',
        priority: 'Low',
        action: 'Consider for Featured tier promotion'
      });
    }

    return recommendations;
  }

  /**
   * Generate detailed scoring report
   */
  generateReport(templateName, scoringResult) {
    const { overallScore, tier, categoryScores, recommendations } = scoringResult;

    let report = `# Template Curation Score Report\n\n`;
    report += `**Template:** ${templateName}\n`;
    report += `**Overall Score:** ${overallScore}/100\n`;
    report += `**Tier:** ${tier}\n`;
    report += `**Generated:** ${new Date().toISOString()}\n\n`;

    report += `## Category Breakdown\n\n`;
    Object.keys(categoryScores).forEach(category => {
      const score = categoryScores[category];
      const weight = this.weights[category];
      const weightedScore = score * weight;
      const emoji = score >= 80 ? '🟢' : score >= 60 ? '🟡' : '🔴';
      
      report += `- **${category.charAt(0).toUpperCase() + category.slice(1)}:** ${emoji} ${Math.round(score)}/100 (Weight: ${weight * 100}%, Weighted: ${Math.round(weightedScore * 100)/100})\n`;
    });

    if (recommendations.length > 0) {
      report += `\n## Recommendations\n\n`;
      recommendations.forEach((rec, index) => {
        const priorityEmoji = rec.priority === 'High' ? '🔴' : rec.priority === 'Medium' ? '🟡' : '🟢';
        report += `${index + 1}. **${rec.category}** ${priorityEmoji} ${rec.priority}\n`;
        report += `   ${rec.action}\n\n`;
      });
    }

    return report;
  }
}

// CLI usage
if (require.main === module) {
  const scorer = new TemplateCurationScorer();
  
  // Example template data
  const exampleData = {
    validation: { score: 85 },
    ratings: [
      { stars: 5 }, { stars: 4 }, { stars: 5 }, { stars: 4 }, { stars: 5 }
    ],
    usage: { downloads: 150, completionRate: 78 },
    expertReviews: [
      { technical_feasibility: 'high', community_value: 'high', strategic_alignment: 'excellent' }
    ],
    maintenance: { 
      lastUpdated: '2025-01-15',
      issues: { total: 10, resolved: 8, avgResolutionTime: 3 }
    },
    github: { issues: 12, discussions: 8, pullRequests: 5 }
  };

  const result = scorer.calculateScore(exampleData);
  const report = scorer.generateReport('Example Template', result);
  
  console.log(report);
}

module.exports = TemplateCurationScorer;
