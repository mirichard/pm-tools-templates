import path from 'node:path';
import { loadSiteTemplates } from '../../../../scripts/lib/site-template-catalog.mjs';

export const templates = loadSiteTemplates(path.resolve(process.cwd(), '../..'));
export const templateCards = templates.map(({ content, ...card }) => card);
