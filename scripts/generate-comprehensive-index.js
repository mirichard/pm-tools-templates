const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { glob } = require('glob');

async function generateTemplateIndex() {
  console.log('🔍 Finding templates...');
  
  // Find all template files
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
  let templatesWithoutMetadata = [];
  
  for (const pattern of patterns) {
    const files = await glob(pattern);
    
    for (const file of files) {
      // Skip certain files that aren't actual templates
      if (file.includes('README') || file.includes('TODO') || file.includes('.github')) {
        continue;
      }
      
      const content = fs.readFileSync(file, 'utf8');
      let title = extractTitleFromPath(file);
      let methodology = inferMethodology(file);
      let complexity = 'Not specified';
      let owner = 'mirichard';
      let updated = 'Not specified';
      
      // Try to extract metadata
      if (content.startsWith('---\n')) {
        const yamlEnd = content.indexOf('\n---\n', 4);
        if (yamlEnd !== -1) {
          try {
            const yamlContent = content.substring(4, yamlEnd);
            const metadata = yaml.load(yamlContent);
            title = metadata.title || title;
            methodology = metadata.methodology || methodology;
            complexity = metadata.complexity || complexity;
            owner = metadata.owner || owner;
            updated = metadata.updated || updated;
            
            templates.push({ title, path: file, methodology, complexity, owner, updated, hasMetadata: true });
          } catch (e) {
            templatesWithoutMetadata.push({ title, path: file, methodology, complexity, owner, updated, hasMetadata: false });
          }
        } else {
          templatesWithoutMetadata.push({ title, path: file, methodology, complexity, owner, updated, hasMetadata: false });
        }
      } else {
        templatesWithoutMetadata.push({ title, path: file, methodology, complexity, owner, updated, hasMetadata: false });
      }
    }
  }
  
  // Sort templates
  templates.sort((a, b) => a.title.localeCompare(b.title));
  templatesWithoutMetadata.sort((a, b) => a.title.localeCompare(b.title));
  
  // Generate comprehensive template index
  let markdown = generateMarkdown(templates, templatesWithoutMetadata);
  
  fs.writeFileSync('TEMPLATE_INDEX.md', markdown);
  console.log(`✅ Template index generated: ${templates.length + templatesWithoutMetadata.length} templates found`);
  console.log(`   - ${templates.length} with metadata`);
  console.log(`   - ${templatesWithoutMetadata.length} without metadata`);
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
  if (filePath.includes('/agile/') || filePath.includes('scrum') || filePath.includes('sprint')) return 'Agile';
  if (filePath.includes('/traditional/') || filePath.includes('waterfall')) return 'Traditional';
  if (filePath.includes('/hybrid/')) return 'Hybrid';
  return 'Universal';
}

function generateMarkdown(templatesWithMetadata, templatesWithoutMetadata) {
  let markdown = `# Template Index

> A comprehensive directory of all project management templates in this repository.

**Quick Stats:**
- 📊 **Total Templates:** ${templatesWithMetadata.length + templatesWithoutMetadata.length}
- ✅ **With Metadata:** ${templatesWithMetadata.length}
- ⚠️ **Needs Metadata:** ${templatesWithoutMetadata.length}

---

## 🔍 Search & Filter

**Filter by Methodology:**
- [Traditional](#traditional-templates) • [Agile](#agile-templates) • [Hybrid](#hybrid-templates) • [Universal](#universal-templates)

**Filter by Complexity:**
- [Beginner](#beginner-templates) • [Intermediate](#intermediate-templates) • [Advanced](#advanced-templates)

---

## 📋 All Templates

| Template | Methodology | Complexity | Updated | Link |
|----------|-------------|------------|---------|------|
`;

  // Add templates with metadata first
  for (const template of templatesWithMetadata) {
    markdown += `| ${template.title} | ${template.methodology} | ${template.complexity} | ${template.updated} | [View](${template.path}) |\n`;
  }
  
  // Add templates without metadata
  for (const template of templatesWithoutMetadata) {
    markdown += `| ${template.title} | ${template.methodology} | ${template.complexity} | ${template.updated} | [View](${template.path}) |\n`;
  }

  markdown += `\n---

## 📁 Templates by Category

### Traditional Templates
Templates following the traditional/waterfall project management approach.

`;

  // Group by methodology
  const traditional = [...templatesWithMetadata, ...templatesWithoutMetadata].filter(t => t.methodology === 'Traditional');
  for (const template of traditional) {
    markdown += `- [${template.title}](${template.path})${template.hasMetadata ? '' : ' ⚠️'}\n`;
  }

  markdown += `\n### Agile Templates
Templates for iterative and incremental project management.

`;

  const agile = [...templatesWithMetadata, ...templatesWithoutMetadata].filter(t => t.methodology === 'Agile');
  for (const template of agile) {
    markdown += `- [${template.title}](${template.path})${template.hasMetadata ? '' : ' ⚠️'}\n`;
  }

  markdown += `\n### Hybrid Templates
Templates that combine traditional and agile approaches.

`;

  const hybrid = [...templatesWithMetadata, ...templatesWithoutMetadata].filter(t => t.methodology === 'Hybrid');
  for (const template of hybrid) {
    markdown += `- [${template.title}](${template.path})${template.hasMetadata ? '' : ' ⚠️'}\n`;
  }

  markdown += `\n### Universal Templates
Templates that work across all methodologies.

`;

  const universal = [...templatesWithMetadata, ...templatesWithoutMetadata].filter(t => t.methodology === 'Universal');
  for (const template of universal) {
    markdown += `- [${template.title}](${template.path})${template.hasMetadata ? '' : ' ⚠️'}\n`;
  }

  markdown += `\n---

## 🏷️ Legend

- ✅ **Template has metadata** - Fully catalogued with YAML front matter
- ⚠️ **Template needs metadata** - Will be enhanced in future updates

---

*This index is automatically generated. Last updated: ${new Date().toISOString().split('T')[0]}*
`;

  return markdown;
}

generateTemplateIndex().catch(console.error);
