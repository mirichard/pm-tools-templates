#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const CHANGELOG_DIR = './docs/site/public/changelog';
const TEMPLATES_DIR = './templates';

// Ensure changelog directory exists
if (!fs.existsSync(CHANGELOG_DIR)) {
  fs.mkdirSync(CHANGELOG_DIR, { recursive: true });
}

async function getTemplateFiles() {
  const patterns = [
    `${TEMPLATES_DIR}/**/*.md`,
    `${TEMPLATES_DIR}/**/*.docx`,
    `${TEMPLATES_DIR}/**/*.xlsx`,
    `${TEMPLATES_DIR}/**/*.pptx`
  ];
  
  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern);
    files.push(...matches);
  }
  
  return files;
}

function getTemplateChangelog(filePath) {
  try {
    // Use git log to get the history of the specific file
    const command = `git log --follow --pretty=format:'%H|%ad|%s' --date=short "${filePath}"`;
    const output = execSync(command, { encoding: 'utf8' });
    
    const changes = output
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [hash, date, message] = line.split('|');
        return { hash, date, message };
      })
      .filter(change => {
        // Filter out merge commits and generic messages
        return !change.message.toLowerCase().includes('merge') &&
               change.message.trim().length > 0;
      });
    
    return changes;
  } catch (error) {
    console.warn(`Could not get changelog for ${filePath}:`, error.message);
    return [];
  }
}

function getTemplateId(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

async function generateChangelogs() {
  console.log('🔍 Finding template files...');
  const templateFiles = await getTemplateFiles();
  console.log(`📄 Found ${templateFiles.length} template files`);

  let generated = 0;
  
  for (const filePath of templateFiles) {
    const templateId = getTemplateId(filePath);
    const changelogPath = path.join(CHANGELOG_DIR, `${templateId}.json`);
    
    console.log(`📝 Generating changelog for: ${templateId}`);
    
    const changes = getTemplateChangelog(filePath);
    
    const changelog = {
      templateId,
      filePath,
      lastUpdated: new Date().toISOString(),
      totalChanges: changes.length,
      changes
    };
    
    fs.writeFileSync(changelogPath, JSON.stringify(changelog, null, 2));
    generated++;
  }
  
  console.log(`✅ Generated ${generated} changelog files in ${CHANGELOG_DIR}`);
}

// Run the script
generateChangelogs().catch(error => {
  console.error('❌ Error generating changelogs:', error);
  process.exit(1);
});
