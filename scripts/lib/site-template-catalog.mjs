import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));

/**
 * One canonical identity per catalog entry; basename IDs preserve existing favorites.
 * @returns {Array<{id: string, title: string, description: string, path: string, tags: string[], methodology: string, content: string}>}
 */
export function loadSiteTemplates(root = repositoryRoot) {
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'templates/templates.json'), 'utf8'));
  const ids = new Set();
  return catalog.templates.map(entry => {
    const filePath = entry.canonical_path || entry.path;
    const absolute = path.resolve(root, filePath);
    if (path.isAbsolute(filePath) || !absolute.startsWith(path.resolve(root) + path.sep)) {
      throw new Error(`Template path escapes repository: ${filePath}`);
    }
    if (path.extname(filePath) !== '.md') throw new Error(`Unsupported site template: ${filePath}`);
    const content = fs.readFileSync(absolute, 'utf8');
    if (/^\s*\*{0,2}Canonical location:?\*{0,2}\s*\[/im.test(content)) {
      throw new Error(`Catalog selects a legacy pointer: ${filePath}`);
    }
    const id = path.basename(filePath, '.md');
    if (ids.has(id)) throw new Error(`Duplicate site template ID: ${id}`);
    ids.add(id);
    return {
      id,
      title: entry.title || id,
      description: entry.description || 'No description available.',
      path: filePath,
      tags: entry.tags || [],
      methodology: entry.methodology || 'universal',
      content
    };
  });
}
