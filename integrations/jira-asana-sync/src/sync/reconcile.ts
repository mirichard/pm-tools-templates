export type EntityType = 'TaskType' | 'Field' | 'Workflow' | string;

export interface SourceEntity {
  id: string;
  type: EntityType;
  name: string;
  values?: string[];
}

export interface TargetEntity {
  externalId: string;
  type: EntityType;
  name: string;
  values?: string[];
}

export type OperationType = 'create' | 'update' | 'delete' | 'noop';

export interface Operation {
  op: OperationType;
  type: EntityType;
  source?: SourceEntity;
  target?: TargetEntity;
}

export interface MappingRule {
  // Return true if entities are considered the "same" identity (match key)
  isSame(a: SourceEntity, b: TargetEntity): boolean;
  // Return true if entities are equivalent (no update needed)
  isEqual(a: SourceEntity, b: TargetEntity): boolean;
}

export interface Mapping {
  // Rules keyed by entity type; a default rule is used if not present
  rules: Record<string, MappingRule>;
  defaultRule: MappingRule;
}

export interface ReconcileReport {
  operations: Operation[];
  summary: { creates: number; updates: number; deletes: number; noops: number };
}

export function reconcilePreview(source: SourceEntity[], target: TargetEntity[], mapping: Mapping): ReconcileReport {
  const ops: Operation[] = [];
  const matchedTarget = new Set<TargetEntity>();

  function ruleFor(type: EntityType): MappingRule {
    return mapping.rules[type] || mapping.defaultRule;
  }

  for (const s of source) {
    const candidates = target.filter(t => t.type === s.type);
    const rule = ruleFor(s.type);
    const match = candidates.find(t => rule.isSame(s, t));

    if (!match) {
      ops.push({ op: 'create', type: s.type, source: s });
      continue;
    }

    matchedTarget.add(match);
    if (rule.isEqual(s, match)) {
      ops.push({ op: 'noop', type: s.type, source: s, target: match });
    } else {
      ops.push({ op: 'update', type: s.type, source: s, target: match });
    }
  }

  // Deletes: any targets that were not matched
  for (const t of target) {
    if (!matchedTarget.has(t)) {
      ops.push({ op: 'delete', type: t.type, target: t });
    }
  }

  const summary = {
    creates: ops.filter(o => o.op === 'create').length,
    updates: ops.filter(o => o.op === 'update').length,
    noops: ops.filter(o => o.op === 'noop').length,
    deletes: ops.filter(o => o.op === 'delete').length,
  };

  return { operations: ops, summary };
}
