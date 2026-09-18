const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

async function addMetadataToTemplates() {
  console.log('🔄 Adding YAML metadata to all templates...');
  
  const patterns = [
    'templates/**/*template*.md',
    'project-lifecycle/**/*template*.md',
    'role-based-toolkits/**/*template*.md', 
    'business-stakeholder-suite/**/*template*.md',
    'industry-specializations/**/*template*.md',
    'methodology-frameworks/**/*template*.md',
    'project-assessment-suite/**/*template*.md'
  ];
  
  let processed = 0;
  let skipped = 0;
  
  for (const pattern of patterns) {
    const files = await glob(pattern);
    
    for (const file of files) {
      // Skip certain files that aren't actual templates
      if (file.includes('README') || file.includes('TODO') || file.includes('.github')) {
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Skip if already has metadata
      if (content.startsWith('---\n')) {
        console.log(`⏭️  Skipping ${file} (already has metadata)`);
        skipped++;
        continue;
      }
      
      // Generate metadata
      const metadata = generateMetadata(file, content);
      const updatedContent = `---
${metadata}
---

${content}`;
      
      // Write updated content
      fs.writeFileSync(file, updatedContent);
      console.log(`✅ Added metadata to ${file}`);
      processed++;
    }
  }
  
  console.log(`\n🎉 Metadata migration complete!`);
  console.log(`   - ${processed} templates updated`);
  console.log(`   - ${skipped} templates skipped (already had metadata)`);
}

function generateMetadata(filePath, content) {
  const title = extractTitleFromPath(filePath);
  const methodology = inferMethodology(filePath);
  const complexity = inferComplexity(content, filePath);
  const owner = 'mirichard';
  const updated = new Date().toISOString().split('T')[0];
  
  return `title: "${title}"
methodology: "${methodology.toLowerCase()}"
complexity: "${complexity.toLowerCase()}"
owner: "${owner}"
updated: "${updated}"`;
}

function extractTitleFromPath(filePath) {
  const fileName = path.basename(filePath, '.md');
  return fileName
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/template/gi, 'Template')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function inferMethodology(filePath) {
  if (filePath.includes('/agile/') || filePath.includes('scrum') || filePath.includes('sprint')) return 'agile';
  if (filePath.includes('/traditional/') || filePath.includes('waterfall')) return 'traditional';
  if (filePath.includes('/hybrid/')) return 'hybrid';
  return 'universal';
}

function inferComplexity(content, filePath) {
  const contentLength = content.length;
  const hasAdvancedConcepts = /integration|api|workflow|automation|governance|compliance|validation/i.test(content);
  const isBasicTemplate = /simple|basic|starter|quick/i.test(filePath);
  
  if (isBasicTemplate || contentLength < 2000) return 'starter';
  if (hasAdvancedConcepts || contentLength > 8000) return 'advanced';
  return 'intermediate';
}

addMetadataToTemplates().catch(console.error);
