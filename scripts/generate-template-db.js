const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { glob } = require('glob');

async function generateTemplateDatabase() {
  console.log('🔄 Generating template database...');
  
  const patterns = [
    'templates/**/*template*.md',
    'project-lifecycle/**/*template*.md',
    'role-based-toolkits/**/*template*.md', 
    'business-stakeholder-suite/**/*template*.md',
    'industry-specializations/**/*template*.md',
    'methodology-frameworks/**/*template*.md',
    'project-assessment-suite/**/*template*.md'
  ];
  
  let templates = [];
  
  for (const pattern of patterns) {
    const files = await glob(pattern);
    
    for (const file of files) {
      // Skip certain files that aren't actual templates
      if (file.includes('README') || file.includes('TODO') || file.includes('.github')) {
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf8');
      let templateData = {
        path: file,
        title: extractTitleFromPath(file),
        methodology: 'universal',
        complexity: 'intermediate',
        owner: 'mirichard',
        updated: '2025-08-05',
        description: extractDescription(content),
        tags: extractTags(file, content),
        size: content.length,
        lastModified: fs.statSync(file).mtime.toISOString().split('T')[0]
      };
      
      // Try to extract metadata
      if (content.startsWith('---\n')) {
        const yamlEnd = content.indexOf('\n---\n', 4);
        if (yamlEnd !== -1) {
          try {
            const yamlContent = content.substring(4, yamlEnd);
            const metadata = yaml.load(yamlContent);
            templateData = { ...templateData, ...metadata };
          } catch (e) {
            console.warn(`Warning: Invalid YAML in ${file}`);
          }
        }
      }
      
      templates.push(templateData);
    }
  }
  
  // Sort templates alphabetically
  templates.sort((a, b) => a.title.localeCompare(b.title));
  
  // Generate JSON database
  const database = {
    generated: new Date().toISOString(),
    totalTemplates: templates.length,
    templates: templates,
    statistics: generateStatistics(templates)
  };
  
  fs.writeFileSync('templates/templates.json', JSON.stringify(database, null, 2));
  console.log(`✅ Template database generated: ${templates.length} templates`);
  console.log(`   - JSON file: templates/templates.json`);
}

function extractTitleFromPath(filePath) {
  const fileName = path.basename(filePath, '.md');
  return fileName
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/template/gi, 'Template')
    .replace(/\b\w/g, l => l.toUpperCase());
}

function extractDescription(content) {
  // Extract first paragraph after the title
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('-') && line.length > 20) {
      return line.substring(0, 200) + (line.length > 200 ? '...' : '');
    }
  }
  return 'Project management template';
}

function extractTags(filePath, content) {
  const tags = [];
  
  // Extract tags from path
  if (filePath.includes('agile')) tags.push('agile');
  if (filePath.includes('traditional')) tags.push('traditional');
  if (filePath.includes('hybrid')) tags.push('hybrid');
  if (filePath.includes('scrum')) tags.push('scrum');
  if (filePath.includes('kanban')) tags.push('kanban');
  if (filePath.includes('healthcare')) tags.push('healthcare');
  if (filePath.includes('it') || filePath.includes('software')) tags.push('technology');
  if (filePath.includes('financial')) tags.push('finance');
  
  // Extract tags from content
  if (/risk/i.test(content)) tags.push('risk-management');
  if (/stakeholder/i.test(content)) tags.push('stakeholder-management');
  if (/communication/i.test(content)) tags.push('communication');
  if (/planning/i.test(content)) tags.push('planning');
  if (/monitoring/i.test(content)) tags.push('monitoring');
  if (/quality/i.test(content)) tags.push('quality');
  
  return [...new Set(tags)]; // Remove duplicates
}

function generateStatistics(templates) {
  const stats = {
    byMethodology: {},
    byComplexity: {},
    byTags: {},
    recentlyUpdated: templates.filter(t => {
      const daysSinceUpdate = (new Date() - new Date(t.updated)) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate <= 30;
    }).length
  };
  
  templates.forEach(template => {
    // Methodology stats
    stats.byMethodology[template.methodology] = (stats.byMethodology[template.methodology] || 0) + 1;
    
    // Complexity stats
    stats.byComplexity[template.complexity] = (stats.byComplexity[template.complexity] || 0) + 1;
    
    // Tag stats
    template.tags.forEach(tag => {
      stats.byTags[tag] = (stats.byTags[tag] || 0) + 1;
    });
  });
  
  return stats;
}

generateTemplateDatabase().catch(console.error);
