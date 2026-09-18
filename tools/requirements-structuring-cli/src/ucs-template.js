/**
 * Use Case Specification Template Model
 *
 * Implements Definitions 1-2 from Li & Zheng (2025):
 * - Definition 1 (Basic Flow): BF = [step1, ..., stepn]
 * - Definition 2 (Alternative Flow): altF = {altFi | 1 ≤ i ≤ n}
 */

class UCSStep {
  /**
   * @param {object} params
   * @param {string} params.stepId - Step identifier (e.g., '1', '3a1')
   * @param {string} params.actor - Entity initiating the action
   * @param {string} params.action - Verb describing the action
   * @param {string} params.businessObject - Real-world entity being acted upon
   * @param {string} [params.toActor] - Recipient of the action
   * @param {string} [params.precondition] - Required state before this step
   * @param {string} [params.postcondition] - Resulting state after this step
   * @param {string} [params.refUseCaseId] - Pointer to existing use case (Eq. 2)
   * @param {string} [params.description] - Human-readable description
   */
  constructor(params) {
    this.stepId = params.stepId;
    this.sourceRequirementId = params.sourceRequirementId;
    this.sourceText = params.sourceText;
    this.actor = params.actor;
    this.action = params.action;
    this.businessObject = params.businessObject;
    this.toActor = params.toActor || null;
    this.precondition = params.precondition || null;
    this.postcondition = params.postcondition || null;
    this.refUseCaseId = params.refUseCaseId || null;
    this.description = params.description || null;
  }

  static fromJSON(obj) {
    return new UCSStep(obj);
  }

  toJSON() {
    const result = {
      stepId: this.stepId,
      actor: this.actor,
      action: this.action,
      businessObject: this.businessObject,
    };
    if (this.sourceText !== undefined) result.sourceText = this.sourceText;
    if (this.sourceRequirementId !== undefined) result.sourceRequirementId = this.sourceRequirementId;
    if (this.toActor) result.toActor = this.toActor;
    if (this.precondition) result.precondition = this.precondition;
    if (this.postcondition) result.postcondition = this.postcondition;
    if (this.refUseCaseId) result.refUseCaseId = this.refUseCaseId;
    if (this.description) result.description = this.description;
    return result;
  }
}

class AlternativeFlow {
  /**
   * @param {object} params
   * @param {string} params.flowId - Flow identifier (e.g., '3a', '4b')
   * @param {string} params.deviationPoint - Basic flow step ID this branches from
   * @param {string} params.triggerCondition - Condition triggering this flow
   * @param {UCSStep[]} params.steps - Steps in this alternative/exception flow
   * @param {string} [params.rejoinPoint] - Basic flow step ID to rejoin
   */
  constructor(params) {
    this.flowId = params.flowId;
    this.deviationPoint = params.deviationPoint;
    this.triggerCondition = params.triggerCondition;
    this.steps = (params.steps || []).map((s) =>
      s instanceof UCSStep ? s : UCSStep.fromJSON(s)
    );
    this.rejoinPoint = params.rejoinPoint || null;
  }

  static fromJSON(obj) {
    return new AlternativeFlow(obj);
  }

  toJSON() {
    const result = {
      flowId: this.flowId,
      deviationPoint: this.deviationPoint,
      triggerCondition: this.triggerCondition,
      steps: this.steps.map((s) => s.toJSON()),
    };
    if (this.rejoinPoint) result.rejoinPoint = this.rejoinPoint;
    return result;
  }
}

class UCSTemplate {
  /**
   * @param {object} params
   * @param {string} params.useCaseId
   * @param {string} params.intent
   * @param {string} params.role - Primary actor
   * @param {string[]} params.preconditions
   * @param {string[]} params.postconditions
   * @param {UCSStep[]} params.basicFlow - Definition 1: BF = [step1, ..., stepn]
   * @param {AlternativeFlow[]} [params.alternativeFlows] - Definition 2
   * @param {AlternativeFlow[]} [params.exceptionFlows]
   * @param {string[]} [params.businessObjects]
   * @param {string[]} [params.relatedUseCases]
   */
  constructor(params) {
    this.sourceRequirements = params.sourceRequirements;
    this.useCaseId = params.useCaseId;
    this.intent = params.intent;
    this.role = params.role;
    this.preconditions = params.preconditions || [];
    this.postconditions = params.postconditions || [];
    this.basicFlow = {
      steps: (params.basicFlow?.steps || params.basicFlow || []).map((s) =>
        s instanceof UCSStep ? s : UCSStep.fromJSON(s)
      ),
    };
    this.alternativeFlows = (params.alternativeFlows || []).map((f) =>
      f instanceof AlternativeFlow ? f : AlternativeFlow.fromJSON(f)
    );
    this.exceptionFlows = (params.exceptionFlows || []).map((f) =>
      f instanceof AlternativeFlow ? f : AlternativeFlow.fromJSON(f)
    );
    this.businessObjects = params.businessObjects || [];
    this.relatedUseCases = params.relatedUseCases || [];
  }

  /**
   * Get all alternative and exception flows that deviate from a given basic flow step.
   * This implements the lookup altFi from Definition 2.
   */
  getFlowsAtStep(stepId) {
    const altFlows = this.alternativeFlows.filter(
      (f) => f.deviationPoint === stepId
    );
    const excFlows = this.exceptionFlows.filter(
      (f) => f.deviationPoint === stepId
    );
    return [...altFlows, ...excFlows];
  }

  /**
   * Collect all unique business object names referenced across all flows
   */
  extractBusinessObjects() {
    const bos = new Set();
    const collectFromSteps = (steps) => {
      for (const step of steps) {
        if (step.businessObject) bos.add(step.businessObject);
      }
    };
    collectFromSteps(this.basicFlow.steps);
    for (const flow of [...this.alternativeFlows, ...this.exceptionFlows]) {
      collectFromSteps(flow.steps);
    }
    return Array.from(bos);
  }

  static fromJSON(obj) {
    return new UCSTemplate(obj);
  }

  toJSON() {
    return {
      ...(this.sourceRequirements === undefined ? {} : { sourceRequirements: this.sourceRequirements }),
      useCaseId: this.useCaseId,
      intent: this.intent,
      role: this.role,
      preconditions: this.preconditions,
      postconditions: this.postconditions,
      basicFlow: { steps: this.basicFlow.steps.map((s) => s.toJSON()) },
      alternativeFlows: this.alternativeFlows.map((f) => f.toJSON()),
      exceptionFlows: this.exceptionFlows.map((f) => f.toJSON()),
      businessObjects: this.businessObjects,
      relatedUseCases: this.relatedUseCases,
    };
  }
}

module.exports = { UCSStep, AlternativeFlow, UCSTemplate };
