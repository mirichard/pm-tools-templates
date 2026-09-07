#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validateWavePlan } from './lib/migration-wave.mjs';

const index = process.argv.indexOf('--manifest');
if (index < 0 || !process.argv[index + 1]) throw new Error('--manifest <path> is required');
const root = process.cwd();
const manifestPath = process.argv[index + 1];
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'meta/migration-inventory.json'), 'utf8'));
const plan = JSON.parse(fs.readFileSync(path.join(root, manifestPath), 'utf8'));
const errors = validateWavePlan({ root, inventory, plan });
if (errors.length > 0) {
  console.error(`Migration wave ${plan.wave_id || '<unknown>'} failed validation:`);
  errors.forEach(error => console.error(` - ${error}`));
  process.exit(1);
}
console.log(`PASS: ${plan.wave_id} ${plan.phase} manifest has ${plan.asset_count} assets (limit ${plan.max_assets}).`);
