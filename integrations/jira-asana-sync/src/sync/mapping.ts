import type { Mapping, MappingRule, SourceEntity, TargetEntity } from './reconcile';

function normalizeValues(values?: string[]) {
  return (values || []).map(v => v.trim().toLowerCase()).sort();
}

const nameMatchRule: MappingRule = {
  isSame(a: SourceEntity, b: TargetEntity) {
    return a.name.trim().toLowerCase() === b.name.trim().toLowerCase();
  },
  isEqual(a: SourceEntity, b: TargetEntity) {
    const aVals = normalizeValues(a.values);
    const bVals = normalizeValues(b.values);
    return a.name.trim() === b.name.trim() && JSON.stringify(aVals) === JSON.stringify(bVals);
  }
};

export const defaultMapping: Mapping = {
  rules: {
    TaskType: nameMatchRule,
    Field: nameMatchRule,
    Workflow: nameMatchRule,
  },
  defaultRule: nameMatchRule,
};

export type { Mapping, MappingRule };
