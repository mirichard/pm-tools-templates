const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { glob } = require('glob');

async function generateTemplateIndex() {
  const patterns = [
    'templates/**/*.md',
  ];
  
  let templates = [];
  
  for (const pattern of patterns) {
    const files = await glob(pattern);
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.startsWith('---\n')) {
        const yamlEnd = content.indexOf('\n---\n', 4);
        if (yamlEnd !== -1) {
          const yamlContent = content.substring(4, yamlEnd);
          const metadata = yaml.load(yamlContent);
          templates.push({ ...metadata, path: file });
        }
      }
    }
  }
  
  // Generate Markdown table
  let markdown = '# Template Index\n\n';
  markdown += '| Template | Methodology | Complexity | Owner | Last Updated |\n';
  markdown += '|---|---|---|---|---|\n';
  
  for (const template of templates) {
    markdown += `| [${template.title}](${template.path}) | ${template.methodology} | ${template.complexity} | ${template.owner} | ${template.updated} |\n`;
  }
  
  fs.writeFileSync('TEMPLATE_INDEX.md', markdown);
  console.log('✅ Template index generated successfully!');
}

generateTemplateIndex().catch(console.error);

