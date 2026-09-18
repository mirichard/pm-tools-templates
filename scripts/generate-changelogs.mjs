#!/usr/bin/env node

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { loadSiteTemplates } from './lib/site-template-catalog.mjs';

const CHANGELOG_DIR = process.env.CHANGELOG_OUTPUT_DIR || './docs/site/public/changelog';


function getTemplateChangelog(filePath) {
  try {
    // Use git log to get the history of the specific file
    const output = execFileSync(
      'git',
      ['log', '--follow', '--pretty=format:%H|%ad|%s', '--date=short', '--', filePath],
      { encoding: 'utf8' }
    );
    
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

export async function generateChangelogs({ outputDirectory = CHANGELOG_DIR, history = getTemplateChangelog } = {}) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  console.log('🔍 Finding template files...');
  const templateFiles = loadSiteTemplates().map(template => template.path);
  console.log(`📄 Found ${templateFiles.length} template files`);

  let generated = 0;
  
  for (const filePath of templateFiles) {
    const templateId = getTemplateId(filePath);
    const changelogPath = path.join(outputDirectory, `${templateId}.json`);
    
    console.log(`📝 Generating changelog for: ${templateId}`);
    
    const changes = history(filePath);
    
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
  
  console.log(`✅ Generated ${generated} changelog files in ${outputDirectory}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateChangelogs().catch(error => {
    console.error('❌ Error generating changelogs:', error);
    process.exitCode = 1;
  });
}
