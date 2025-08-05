const fs = require('fs');
const path = require('path');

function calculateQualityScore(template) {
  let score = 0;
  let maxScore = 100;
  let issues = [];

  // Metadata completeness (40%)
  const requiredFields = ['title', 'methodology', 'complexity', 'owner', 'updated'];
  const missingFields = requiredFields.filter(field => !template[field]);
  if (missingFields.length === 0) {
    score += 40;
  } else {
    issues.push(`Missing metadata fields: ${missingFields.join(', ')}`);
  }

  // Update freshness (30%)
  const daysSinceUpdate = (new Date() - new Date(template.updated)) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate <= 90) {
    score += 30;
  } else if (daysSinceUpdate <= 365) {
    score += 15;
  } else {
    issues.push('Template is over a year old');
  }

  // Description quality (15%)
  if (template.description && template.description.length > 50) {
    score += 15;
  } else {
    issues.push('Description is too short or missing');
  }

  // Tag richness (15%)
  if (template.tags && template.tags.length >= 3) {
    score += 15;
  } else {
    issues.push('Not enough tags for good discoverability');
  }

  return { score: Math.round(score), issues };
}

function addQualityScores() {
  console.log('🔄 Calculating template quality scores...');
  const dbPath = 'templates/templates.json';
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  db.templates.forEach(template => {
    const { score, issues } = calculateQualityScore(template);
    template.qualityScore = score;
    template.qualityIssues = issues;
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('✅ Quality scores added to template database');
}

addQualityScores();
