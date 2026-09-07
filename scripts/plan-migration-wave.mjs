#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildWavePlan, DEFAULT_WAVE_ASSETS } from './lib/migration-wave.mjs';

function argumentsFrom(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const name = argv[index];
    const value = argv[index + 1];
    if (!name?.startsWith('--') || value === undefined) throw new Error(`Invalid argument near ${name || '<end>'}`);
    options[name.slice(2)] = value;
  }
  return options;
}

const root = process.cwd();
const args = argumentsFrom(process.argv.slice(2));
for (const required of ['wave-id', 'batch', 'domain', 'rollback-owner']) {
  if (!args[required]) throw new Error(`--${required} is required`);
}
if (args.inventory && args.inventory !== 'meta/migration-inventory.json') {
  throw new Error('--inventory currently supports only meta/migration-inventory.json');
}
const inventory = JSON.parse(fs.readFileSync(path.join(root, args.inventory || 'meta/migration-inventory.json'), 'utf8'));
const preBatchSha = args['pre-batch-sha'] || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const plan = buildWavePlan({
  root,
  inventory,
  waveId: args['wave-id'],
  sourceBatch: Number(args.batch),
  primaryDomain: args.domain,
  maxAssets: Number(args['max-assets'] || DEFAULT_WAVE_ASSETS),
  preBatchSha,
  rollbackOwner: args['rollback-owner']
});
const output = `${JSON.stringify(plan, null, 2)}\n`;
if (args.output) {
  fs.mkdirSync(path.dirname(path.join(root, args.output)), { recursive: true });
  fs.writeFileSync(path.join(root, args.output), output);
  console.log(`Wrote ${plan.wave_id}: ${plan.asset_count} assets to ${args.output}`);
} else {
  process.stdout.write(output);
}
