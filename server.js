const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static('.'));

// API endpoint for templates
app.get('/api/templates', (req, res) => {
  try {
    const data = fs.readFileSync('templates/templates.json', 'utf8');
    const templateData = JSON.parse(data);
    
    const { search, methodology, complexity, tags, limit } = req.query;
    let templates = templateData.templates;
    
    // Apply filters
    if (search) {
      const searchTerm = search.toLowerCase();
      templates = templates.filter(t => 
        t.title.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm) ||
        t.tags.some(tag => tag.includes(searchTerm))
      );
    }
    
    if (methodology && methodology !== 'all') {
      templates = templates.filter(t => t.methodology === methodology);
    }
    
    if (complexity && complexity !== 'all') {
      templates = templates.filter(t => t.complexity === complexity);
    }
    
    if (tags) {
      const tagList = tags.split(',');
      templates = templates.filter(t => 
        tagList.some(tag => t.tags.includes(tag))
      );
    }
    
    // Apply limit
    if (limit) {
      templates = templates.slice(0, parseInt(limit));
    }
    
    res.json({\n      templates,\n      total: templates.length,\n      statistics: templateData.statistics\n    });\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to load templates' });\n  }\n});\n\n// API endpoint for template statistics\napp.get('/api/stats', (req, res) => {\n  try {\n    const data = fs.readFileSync('templates/templates.json', 'utf8');\n    const templateData = JSON.parse(data);\n    res.json(templateData.statistics);\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to load statistics' });\n  }\n});\n\n// API endpoint for individual template\napp.get('/api/template/:path(*)', (req, res) => {\n  try {\n    const templatePath = req.params.path;\n    const fullPath = path.join(__dirname, templatePath);\n    \n    if (!fs.existsSync(fullPath)) {\n      return res.status(404).json({ error: 'Template not found' });\n    }\n    \n    const content = fs.readFileSync(fullPath, 'utf8');\n    res.json({ path: templatePath, content });\n  } catch (error) {\n    res.status(500).json({ error: 'Failed to load template' });\n  }\n});\n\napp.listen(port, () => {\n  console.log(`Template server running at http://localhost:${port}`);\n  console.log(`API endpoints:`);\n  console.log(`  - GET /api/templates - List templates with optional filters`);\n  console.log(`  - GET /api/stats - Template statistics`);\n  console.log(`  - GET /api/template/:path - Get specific template content`);\n});
