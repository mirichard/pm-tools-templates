/**
 * Consistency Checker
 *
 * Implements the paper's three formal consistency rules via two algorithms:
 *
 * Algorithm 2 (ValidateCybyP) — Rules 1 & 2 against Activity Diagrams:
 *   Rule 1 (Semantic): BOs in activity diagram must appear in associated UCS flows
 *   Rule 2 (Process): Input BOs must precede output BOs in UCS step sequence
 *
 * Algorithm 3 (ValidateCybyState) — Rule 3 against State Machines:
 *   Rule 3 (State): State-triggering actions must appear in UCS in consistent order
 *
 * Both algorithms are deterministic — no LLM needed.
 */

const { UCSTemplate } = require('./ucs-template');

class ConsistencyChecker {
  /**
   * Algorithm 2: ValidateCybyP
   * Validates UCS consistency with a Business Process Model (activity diagram).
   *
   * @param {UCSTemplate|object} ucsTemplate - The use case specification
   * @param {object} bpm - Business Process Model conforming to business-process.schema.json
   * @returns {object} { abnormalSteps: [], abnormalBOs: [], violations: [] }
   */
  validateWithProcess(ucsTemplate, bpm) {
    const ucs =
      ucsTemplate instanceof UCSTemplate
        ? ucsTemplate
        : UCSTemplate.fromJSON(ucsTemplate);

    const violations = [];
    const abnormalSteps = new Set();
    const abnormalBOs = new Set();

    // Collect all steps from basic + alternative + exception flows
    const allSteps = this._collectAllSteps(ucs);

    // Collect all BO names referenced in the BPM
    const bpmBOs = new Set(
      (bpm.objectNodes || []).map((on) => on.businessObjectType)
    );

    // Build lookup: activity nodeId → associated use case ID
    const activityUseCaseMap = {};
    for (const activity of bpm.activityNodes || []) {
      if (activity.associatedUseCaseId) {
        activityUseCaseMap[activity.nodeId] = activity.associatedUseCaseId;
      }
    }

    // Build lookup: activity nodeId → { incoming BOs, outgoing BOs }
    const activityBOs = {};
    for (const edge of bpm.objectEdges || []) {
      const sourceIsObject = (bpm.objectNodes || []).some(
        (on) => on.nodeId === edge.sourceNodeId
      );
      const targetIsObject = (bpm.objectNodes || []).some(
        (on) => on.nodeId === edge.targetNodeId
      );

      if (sourceIsObject) {
        // Object → Activity (input)
        const activityId = edge.targetNodeId;
        const objNode = (bpm.objectNodes || []).find(
          (on) => on.nodeId === edge.sourceNodeId
        );
        if (!activityBOs[activityId]) activityBOs[activityId] = { incoming: [], outgoing: [] };
        activityBOs[activityId].incoming.push(objNode.businessObjectType);
      }

      if (targetIsObject) {
        // Activity → Object (output)
        const activityId = edge.sourceNodeId;
        const objNode = (bpm.objectNodes || []).find(
          (on) => on.nodeId === edge.targetNodeId
        );
        if (!activityBOs[activityId]) activityBOs[activityId] = { incoming: [], outgoing: [] };
        activityBOs[activityId].outgoing.push(objNode.businessObjectType);
      }
    }

    // --- Rule 1: Semantic Consistency ---
    // For each activity associated with this UCS, check that its BOs appear in UCS steps
    const stepsBoSet = new Set(allSteps.map((s) => s.businessObject).filter(Boolean));

    for (const [activityId, bos] of Object.entries(activityBOs)) {
      const assocUC = activityUseCaseMap[activityId];
      if (assocUC && assocUC !== ucs.useCaseId) continue; // Skip activities for other UCs

      const allActivityBOs = [...new Set([...bos.incoming, ...bos.outgoing])];
      for (const boName of allActivityBOs) {
        if (!stepsBoSet.has(boName)) {
          abnormalBOs.add(boName);
          violations.push({
            rule: 1,
            ruleLabel: 'Semantic Consistency',
            severity: 'error',
            activityId,
            businessObject: boName,
            message: `Business object "${boName}" is referenced in activity diagram but does not appear in any UCS flow step.`,
          });
        }
      }
    }

    // --- Rule 2: Process Consistency ---
    // For each activity with both input and output BOs, check ordering in UCS
    for (const [activityId, bos] of Object.entries(activityBOs)) {
      const assocUC = activityUseCaseMap[activityId];
      if (assocUC && assocUC !== ucs.useCaseId) continue;

      for (const inputBO of bos.incoming) {
        for (const outputBO of bos.outgoing) {
          if (inputBO === outputBO) continue;

          const inputIndex = this._findFirstBOIndex(allSteps, inputBO);
          const outputIndex = this._findFirstBOIndex(allSteps, outputBO);

          if (inputIndex >= 0 && outputIndex >= 0 && outputIndex < inputIndex) {
            const flaggedStep = allSteps[outputIndex];
            abnormalSteps.add(flaggedStep.stepId);
            violations.push({
              rule: 2,
              ruleLabel: 'Process Consistency',
              severity: 'error',
              activityId,
              inputBO,
              outputBO,
              message: `Output BO "${outputBO}" (step ${flaggedStep.stepId}) appears before input BO "${inputBO}" in UCS, contradicting the activity diagram flow.`,
            });
          }
        }
      }
    }

    return {
      abnormalSteps: Array.from(abnormalSteps),
      abnormalBOs: Array.from(abnormalBOs),
      violations,
    };
  }

  /**
   * Algorithm 3: ValidateCybyState
   * Validates UCS consistency with a State Model (state machine diagram).
   *
   * @param {UCSTemplate|object} ucsTemplate - The use case specification
   * @param {object} stateModel - State Model conforming to state-model.schema.json
   * @returns {object} { abnormalStepPairs: [], violations: [] }
   */
  validateWithState(ucsTemplate, stateModel) {
    const ucs =
      ucsTemplate instanceof UCSTemplate
        ? ucsTemplate
        : UCSTemplate.fromJSON(ucsTemplate);

    const violations = [];
    const abnormalStepPairs = [];

    const allSteps = this._collectAllSteps(ucs);

    // Collect all trigger actions from the state model → A
    const stateActions = new Set(
      (stateModel.transitions || []).map((tr) => tr.triggerAction.toLowerCase())
    );

    // Line 2-4: Find UCS steps that correspond to state-triggering actions
    const matchedSteps = [];
    for (const step of allSteps) {
      const stepAction = (step.action || '').toLowerCase();
      if (stateActions.has(stepAction)) {
        matchedSteps.push(step);
      }
    }

    if (matchedSteps.length === 0) {
      return { abnormalStepPairs: [], violations: [] };
    }

    // Build action ordering from state model transitions
    const actionOrder = this._buildActionOrder(stateModel.transitions);

    // Line 6-8: For each pair of matched steps, check ordering
    for (let i = 0; i < matchedSteps.length; i++) {
      for (let j = i + 1; j < matchedSteps.length; j++) {
        const stepA = matchedSteps[i];
        const stepB = matchedSteps[j];
        const actionA = stepA.action.toLowerCase();
        const actionB = stepB.action.toLowerCase();

        // step_i precedes step_j in UCS (by array position)
        // Check if step_j precedes step_i in state model
        if (this._actionPrecedes(actionOrder, actionB, actionA)) {
          abnormalStepPairs.push({
            step1: stepA.stepId,
            step2: stepB.stepId,
            action1: stepA.action,
            action2: stepB.action,
          });
          violations.push({
            rule: 3,
            ruleLabel: 'State Consistency',
            severity: 'error',
            businessObject: stateModel.businessObjectName,
            step1: stepA.stepId,
            step2: stepB.stepId,
            message: `Action "${stepA.action}" (step ${stepA.stepId}) precedes "${stepB.action}" (step ${stepB.stepId}) in UCS, but the state machine requires the opposite order.`,
          });
        }
      }
    }

    return { abnormalStepPairs, violations };
  }

  /**
   * Run both validation algorithms and merge results
   */
  validateAll(ucsTemplate, { bpm, stateModels } = {}) {
    const results = {
      processViolations: null,
      stateViolations: [],
      totalViolations: 0,
    };

    if (bpm) {
      results.processViolations = this.validateWithProcess(ucsTemplate, bpm);
      results.totalViolations += results.processViolations.violations.length;
    }

    if (stateModels) {
      for (const sm of stateModels) {
        const stateResult = this.validateWithState(ucsTemplate, sm);
        results.stateViolations.push({
          businessObject: sm.businessObjectName,
          ...stateResult,
        });
        results.totalViolations += stateResult.violations.length;
      }
    }

    return results;
  }

  /**
   * Collect all steps from basic + alternative + exception flows in order
   */
  _collectAllSteps(ucs) {
    const steps = [...ucs.basicFlow.steps];
    for (const flow of [...ucs.alternativeFlows, ...ucs.exceptionFlows]) {
      steps.push(...flow.steps);
    }
    return steps;
  }

  /**
   * Find the index of the first step referencing a given BO
   */
  _findFirstBOIndex(steps, boName) {
    return steps.findIndex((s) => s.businessObject === boName);
  }

  /**
   * Build a partial ordering of actions from state machine transitions
   * Returns a Map: action → Set of actions that must come AFTER it
   */
  _buildActionOrder(transitions) {
    const order = new Map();

    // Build adjacency from state graph
    const stateToAction = {};
    const actionToTargetState = {};
    for (const tr of transitions) {
      const action = tr.triggerAction.toLowerCase();
      stateToAction[tr.sourceStateId] = stateToAction[tr.sourceStateId] || [];
      stateToAction[tr.sourceStateId].push(action);
      actionToTargetState[action] = tr.targetStateId;
    }

    // For each pair of transitions where one's target is the other's source,
    // the first action must precede the second
    for (const tr1 of transitions) {
      const a1 = tr1.triggerAction.toLowerCase();
      if (!order.has(a1)) order.set(a1, new Set());

      for (const tr2 of transitions) {
        if (tr1 === tr2) continue;
        const a2 = tr2.triggerAction.toLowerCase();
        // If tr1's target state is tr2's source state, then a1 → a2
        if (tr1.targetStateId === tr2.sourceStateId) {
          order.get(a1).add(a2);
        }
      }
    }

    return order;
  }

  /**
   * Check if actionA must precede actionB in the state model ordering
   */
  _actionPrecedes(actionOrder, actionA, actionB) {
    const successors = actionOrder.get(actionA);
    if (!successors) return false;
    if (successors.has(actionB)) return true;
    // Transitive check (limited depth)
    for (const mid of successors) {
      const midSuccessors = actionOrder.get(mid);
      if (midSuccessors && midSuccessors.has(actionB)) return true;
    }
    return false;
  }

  /**
   * Format violations as a readable report
   */
  formatReport(results) {
    const lines = [];

    if (results.processViolations) {
      const pv = results.processViolations;
      lines.push('=== Activity Diagram Consistency (Rules 1 & 2) ===');
      if (pv.violations.length === 0) {
        lines.push('  ✓ No violations found');
      } else {
        for (const v of pv.violations) {
          lines.push(`  ✗ Rule ${v.rule} (${v.ruleLabel}): ${v.message}`);
        }
      }
    }

    for (const sv of results.stateViolations || []) {
      lines.push(`\n=== State Machine Consistency: ${sv.businessObject} (Rule 3) ===`);
      if (sv.violations.length === 0) {
        lines.push('  ✓ No violations found');
      } else {
        for (const v of sv.violations) {
          lines.push(`  ✗ Rule ${v.rule} (${v.ruleLabel}): ${v.message}`);
        }
      }
    }

    lines.push(`\nTotal violations: ${results.totalViolations}`);
    return lines.join('\n');
  }
}

module.exports = ConsistencyChecker;
