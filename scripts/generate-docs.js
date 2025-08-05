const fs = require('fs');
const path = require('path');

function generateDocs() {
  console.log('🔄 Generating documentation site...');
  
  const db = JSON.parse(fs.readFileSync('templates/templates.json', 'utf8'));
  
  // Generate main documentation page
  let mainPage = `# Project Management Templates Documentation

> Complete documentation for all templates, including usage analytics and quality scoring.

## 📊 Repository Statistics

| Metric | Value |
|---|---|
| **Total Templates** | ${db.totalTemplates} |
| **Recently Updated** | ${db.statistics.recentlyUpdated} templates in last 30 days |
| **Most Common Tag** | ${Object.keys(db.statistics.byTags).reduce((a, b) => db.statistics.byTags[a] > db.statistics.byTags[b] ? a : b)} |

## 📈 Template Analytics

### By Methodology

`;
  for (const [methodology, count] of Object.entries(db.statistics.byMethodology)) {
    mainPage += `- **${methodology.charAt(0).toUpperCase() + methodology.slice(1)}**: ${count} templates\n`;
  }

  mainPage += `\n### By Complexity\n\n`;
  for (const [complexity, count] of Object.entries(db.statistics.byComplexity)) {
    mainPage += `- **${complexity.charAt(0).toUpperCase() + complexity.slice(1)}**: ${count} templates\n`;
  }
  
  mainPage += `\n### Top 10 Tags\n\n`;
  const topTags = Object.entries(db.statistics.byTags).sort((a, b) => b[1] - a[1]).slice(0, 10);
  for (const [tag, count] of topTags) {
    mainPage += `- **${tag}**: ${count} templates\n`;
  }

  fs.writeFileSync('docs/index.md', mainPage);
  console.log('✅ Main documentation page generated');

  // Generate individual template documentation
  db.templates.forEach(template => {
    let templateDoc = `# ${template.title}

## 📄 Template Details

| Attribute | Value |
|---|---|
| **Methodology** | ${template.methodology} |
| **Complexity** | ${template.complexity} |
| **Owner** | ${template.owner} |
| **Last Updated** | ${template.updated} |
| **Tags** | ${template.tags.join(', ')} |
| **File Size** | ${template.size} bytes |

## 💡 Usage

${template.description}

[**➡️ View Template File**](/${template.path})

## 📈 Quality Score

*This section will be populated by future analytics tools.*

## 💬 Community Feedback

*This section will be populated by future feedback integration.*
`;
    
    const docPath = `docs/templates/${path.basename(template.path)}`;
    fs.mkdirSync(path.dirname(docPath), { recursive: true });
    fs.writeFileSync(docPath, templateDoc);
  });

  console.log(`✅ Individual documentation generated for ${db.totalTemplates} templates`);
  console.log('🎉 Documentation generation complete!');
}

generateDocs();
