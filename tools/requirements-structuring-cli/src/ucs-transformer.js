/**
 * UCS Transformer (Phase 2)
 *
 * Converts the formal structure (output of Phase 1) into a full
 * Use Case Specification template with intent, role, pre/post-conditions,
 * basic flow, alternative flows, and exception flows.
 *
 * This is a separate phase because the paper treats structuring and
 * template generation as distinct steps — the formal structure is the
 * intermediate representation that other modules also consume directly.
 */

const LLMClient = require('./llm-client');
const UCS_PROMPT_VERSION = '1.0.0';
const { UCSTemplate } = require('./ucs-template');

class UCSTransformer {
  constructor() {
    this.llm = new LLMClient();
  }

  /**
   * Transform formal structure into a UCS template
   * @param {object} formalStructure - Output from RequirementsStructurer (Eq. 1 format)
   * @returns {UCSTemplate} Complete UCS template
   */
  async transform(formalStructure) {
    const prompt = await this.llm.loadPrompt('03-generate-ucs-template.md');

    const userContent = [
      'When sourceRequirements is supplied, echo its originating sourceRequirementId on every step.',
      'Transform the following structured requirements into a complete UCS template.',
      'The structured requirements follow the formal structure:',
      '<Pre-conditions [Previous Step]; Actor; Action; Business Objects; [To actor]; [Post-conditions]>',
      '',
      '```json',
      JSON.stringify(formalStructure, null, 2),
      '```',
    ].join('\n');

    const ucsData = await this.llm.chatJSON({
      systemPrompt: prompt,
      userPrompt: userContent,
      mode: 'structure',
    });

    ucsData.sourceRequirements = formalStructure.sourceRequirements;
    return UCSTemplate.fromJSON(ucsData);
  }

  /**
   * Transform without LLM — deterministic conversion for cases
   * where the formal structure already contains enough detail.
   * Falls back to this when no API key is available.
   */
  transformDeterministic(formalStructure) {
    const basicSteps = (formalStructure.steps || []).filter(
      (s) => !s.flowType || s.flowType === 'basic'
    );
    const altSteps = (formalStructure.steps || []).filter(
      (s) => s.flowType === 'alternative'
    );
    const excSteps = (formalStructure.steps || []).filter(
      (s) => s.flowType === 'exception'
    );

    // Group alternative/exception steps by deviation point
    const altFlows = this._groupByDeviation(altSteps);
    const excFlows = this._groupByDeviation(excSteps);

    return UCSTemplate.fromJSON({
      sourceRequirements: formalStructure.sourceRequirements,
      useCaseId: formalStructure.useCaseId,
      intent: formalStructure.useCaseName,
      role: basicSteps.length > 0 ? basicSteps[0].actor : 'Unknown',
      preconditions: basicSteps
        .filter((s) => s.precondition)
        .map((s) => s.precondition)
        .filter((v, i, a) => a.indexOf(v) === i),
      postconditions: basicSteps
        .filter((s) => s.postcondition)
        .map((s) => s.postcondition)
        .filter((v, i, a) => a.indexOf(v) === i),
      basicFlow: { steps: basicSteps },
      alternativeFlows: altFlows,
      exceptionFlows: excFlows,
      businessObjects: formalStructure.businessObjects || [],
    });
  }

  /**
   * Group steps by their deviation point into AlternativeFlow structures
   */
  _groupByDeviation(steps) {
    const groups = {};
    for (const step of steps) {
      const dp = step.deviationPoint || 'unknown';
      if (!groups[dp]) {
        groups[dp] = {
          flowId: step.stepId ? step.stepId.replace(/\d+$/, '') : dp,
          deviationPoint: dp,
          triggerCondition: step.precondition || 'Condition not specified',
          steps: [],
          rejoinPoint: step.rejoinPoint || null,
        };
      }
      groups[dp].steps.push(step);
    }
    return Object.values(groups);
  }
}

module.exports = UCSTransformer;

module.exports.UCS_PROMPT_VERSION = UCS_PROMPT_VERSION;
