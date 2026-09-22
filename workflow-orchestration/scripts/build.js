import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'src');
const output = path.join(root, 'dist');

async function checkSources(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await checkSources(filename);
    else if (entry.name.endsWith('.js')) {
      execFileSync(process.execPath, ['--check', filename], { stdio: 'inherit' });
    }
  }
}

// Native ESM needs no transpilation. Validate and stage a runnable distribution.
await rm(output, { recursive: true, force: true });
try {
  await checkSources(source);
  await mkdir(output, { recursive: true });
  await cp(source, output, { recursive: true });
  await writeFile(path.join(output, 'package.json'), JSON.stringify({ type: 'module' }) + '\n');
  execFileSync(process.execPath, ['--input-type=module', '-e',
    'await import(process.argv[1])', new URL('../dist/index.js', import.meta.url).href],
  { stdio: 'inherit' });
  console.log('Built and verified dist/index.js');
} catch (error) {
  await rm(output, { recursive: true, force: true });
  throw error;
}
