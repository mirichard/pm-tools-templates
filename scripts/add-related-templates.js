const fs = require('fs');

function calculateSimilarity(template1, template2) {
  let similarity = 0;
  
  // Methodology match (high weight)
  if (template1.methodology === template2.methodology) {
    similarity += 0.4;
  }
  
  // Tag overlap (high weight)
  const tags1 = new Set(template1.tags);
  const tags2 = new Set(template2.tags);
  const intersection = new Set([...tags1].filter(x => tags2.has(x)));
  const union = new Set([...tags1, ...tags2]);
  
  if (union.size > 0) {
    similarity += (intersection.size / union.size) * 0.5;
  }
  
  // Complexity similarity (low weight)
  if (template1.complexity === template2.complexity) {
    similarity += 0.1;
  }
  
  return similarity;
}

function findRelatedTemplates(targetTemplate, allTemplates, maxResults = 5) {
  const similarities = allTemplates
    .filter(template => template.path !== targetTemplate.path)
    .map(template => ({
      template,
      similarity: calculateSimilarity(targetTemplate, template)
    }))
    .filter(item => item.similarity > 0.2) // Only include templates with meaningful similarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults);
  
  return similarities.map(item => ({
    path: item.template.path,
    title: item.template.title,
    methodology: item.template.methodology,
    tags: item.template.tags,
    similarity: Math.round(item.similarity * 100)
  }));
}

function addRelatedTemplates() {
  console.log('🔄 Calculating related templates...');
  const dbPath = 'templates/templates.json';
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  db.templates.forEach(template => {
    template.relatedTemplates = findRelatedTemplates(template, db.templates);
  });

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('✅ Related templates added to template database');
  
  // Log some examples
  const exampleTemplate = db.templates.find(t => t.relatedTemplates.length > 0);
  if (exampleTemplate) {
    console.log(`\n📋 Example: "${exampleTemplate.title}" is related to:`);
    exampleTemplate.relatedTemplates.forEach(related => {
      console.log(`  - ${related.title} (${related.similarity}% similar)`);
    });
  }
}

addRelatedTemplates();
