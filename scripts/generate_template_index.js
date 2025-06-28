const fs = require('fs');
const { execSync } = require('child_process');

const files = execSync("git ls-files | grep -i 'template.md'").toString().trim().split('\n');
let lines = ['# Template Index', '', 'List of all template files with their paths.'];

files.sort();

for (const file of files) {
  lines.push(`- [${file}](${file})`);
}

fs.writeFileSync('TEMPLATE_INDEX.md', lines.join('\n'));
console.log('TEMPLATE_INDEX.md generated with', files.length, 'entries');
