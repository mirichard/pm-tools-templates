const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { glob } = require('glob');

async function generateTemplateIndex() {
  // If curated JSON exists, prefer it and use canonical_path when present
  const curatedJsonPath = path.resolve('templates/templates.json');
  let templates = [];

  if (fs.existsSync(curatedJsonPath)) {
    const db = JSON.parse(fs.readFileSync(curatedJsonPath, 'utf8'));
    // Support either { templates: [...] } or a raw array
    const list = Array.isArray(db) ? db : (db.templates || []);
    templates = list.map(t => ({
      title: t.title || t.name || path.basename((t.canonical_path || t.path || ''), '.md'),
      methodology: t.methodology || 'universal',
      complexity: t.complexity || '',
      owner: t.owner || '',
      updated: t.updated || t.lastModified || '',
      path: t.canonical_path || t.path || '',
    }));
  } else {
    // Fallback: scan markdown with YAML front matter
    const patterns = [
      'templates/**/*.md',
    ];

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
  }
  
  // Generate Markdown table
  let markdown = '# Template Index\n\n';
  markdown += '| Template | Methodology | Complexity | Owner | Last Updated |\n';
  markdown += '|---|---|---|---|---|\n';
  
  for (const template of templates) {
    const linkPath = template.path || '';
    const title = template.title || linkPath;
    markdown += `| [${title}](${linkPath}) | ${template.methodology || ''} | ${template.complexity || ''} | ${template.owner || ''} | ${template.updated || ''} |\n`;
  }
  
  fs.writeFileSync('TEMPLATE_INDEX.md', markdown);
  console.log('✅ Template index generated successfully!');
}

generateTemplateIndex().catch(console.error);

