import type { Operation } from './reconcile';

export interface ApplyOptions {
  dryRun: boolean;
  allowTypes?: Array<Operation['type']>;
  maxCreates?: number;
  maxUpdates?: number;
  maxDeletes?: number;
}

export interface ApplyResult {
  applied: number;
  skipped: number;
  errors: { opIndex: number; message: string }[];
}

export async function applyOperations(ops: Operation[], opts: ApplyOptions): Promise<ApplyResult> {
  const summary = ops.reduce((acc, o) => { acc[o.op] = (acc[o.op] || 0) + 1; return acc; }, {} as Record<string, number>);

  // Type and count guards
  const filtered: Operation[] = ops.filter(o => !opts.allowTypes || opts.allowTypes.includes(o.type));
  const plannedCreates = filtered.filter(o => o.op === 'create').length;
  const plannedUpdates = filtered.filter(o => o.op === 'update').length;
  const plannedDeletes = filtered.filter(o => o.op === 'delete').length;

  if (opts.maxCreates !== undefined && plannedCreates > opts.maxCreates) {
    throw new Error(`Create operations exceed maxCreates (${plannedCreates} > ${opts.maxCreates})`);
  }
  if (opts.maxUpdates !== undefined && plannedUpdates > opts.maxUpdates) {
    throw new Error(`Update operations exceed maxUpdates (${plannedUpdates} > ${opts.maxUpdates})`);
  }
  if (opts.maxDeletes !== undefined && plannedDeletes > opts.maxDeletes) {
    throw new Error(`Delete operations exceed maxDeletes (${plannedDeletes} > ${opts.maxDeletes})`);
  }

  // For now, we do not execute writes even in write mode; return plan summary to stdout
  if (opts.dryRun !== false) {
    // eslint-disable-next-line no-console
    console.log('Plan (dry-run):', summary);
    return { applied: 0, skipped: ops.length, errors: [] };
  }

  // WRITE MODE PLACEHOLDER: not implemented by design; refuse to mutate
  // eslint-disable-next-line no-console
  console.log('WRITE MODE requested, but writes are not yet implemented. No changes were made.');
  return { applied: 0, skipped: ops.length, errors: [] };
}
