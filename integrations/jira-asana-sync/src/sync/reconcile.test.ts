import { describe, it, expect } from 'vitest';
import { reconcilePreview } from './reconcile';
import { defaultMapping } from './mapping';

describe('reconcilePreview', () => {
  it('computes creates, updates, noops, and deletes', () => {
    const source = [
      { id: 'tpl-1', type: 'TaskType' as const, name: 'Story' },
      { id: 'tpl-2', type: 'Field' as const, name: 'Priority', values: ['High','Medium','Low'] },
    ];
    const target = [
      { externalId: 'jira-x', type: 'TaskType' as const, name: 'Story' }, // noop
      { externalId: 'jira-y', type: 'Field' as const, name: 'Priority', values: ['High','Low'] }, // update
      { externalId: 'jira-z', type: 'Workflow' as const, name: 'Unused WF' }, // delete
    ];

    const report = reconcilePreview(source as any, target as any, defaultMapping);
    expect(report.summary.creates).toBe(0);
    expect(report.summary.updates).toBe(1);
    expect(report.summary.noops).toBe(1);
    expect(report.summary.deletes).toBe(1);
  });
});
