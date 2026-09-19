import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Migration hashes remain immutable. Reviewed repairs bind that original hash
// to one exact current body; arbitrary or subsequent edits still fail closed.
export function loadContentRepairs(root, inventory) {
  const file = path.join(root, 'meta/content-repairs.json');
  if (!fs.existsSync(file)) return new Map();
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (manifest.version !== 1 || !Array.isArray(manifest.repairs)) throw new Error('Invalid content-repair manifest');
  const moves = new Map(inventory.moves.map(move => [move.destination, move]));
  const records = new Map();
  const hash = value => typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
  for (const record of manifest.repairs) {
    const move = moves.get(record.path);
    if (!move || move.action !== 'executed-move-with-legacy-pointer' || records.has(record.path)) {
      throw new Error(`Unknown or duplicate content repair: ${record.path}`);
    }
    if (!hash(record.original_sha256) || !hash(record.current_sha256)
        || record.original_sha256 !== move.execution?.pre_move_source_sha256
        || record.original_sha256 === record.current_sha256
        || typeof record.reason !== 'string' || !record.reason.trim()
        || !/^[0-9a-f]{40}$/.test(record.base_commit || '')) {
      throw new Error(`Invalid content-repair evidence: ${record.path}`);
    }
    records.set(record.path, record);
  }
  return records;
}

export function contentHashMatches(content, file, originalHash, repairs, allowNormalized = false) {
  const digest = value => crypto.createHash('sha256').update(value).digest('hex');
  const repair = repairs.get(file);
  if (repair) return repair.original_sha256 === originalHash && digest(content) === repair.current_sha256;
  return digest(content) === originalHash || (allowNormalized
    && digest(content.toString().replace(/\s+/g, ' ').trim()) === originalHash);
}
