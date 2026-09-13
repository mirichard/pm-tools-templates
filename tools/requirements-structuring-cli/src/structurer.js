/**
 * Requirements Structurer (Phase 1)
 *
 * Converts natural language requirements into the formal structure
 * defined in Li & Zheng (2025) Equation 1:
 * <Pre-conditions [Previous Step]; Actor; Action; Business Objects; [To actor]; [Post-conditions]>
 *
 * Two-pass process:
 * 1. NL → formal structure via prompt 01-structure-requirements.md
 * 2. BO correction pass via prompt 02-correct-business-objects.md
 */

const LLMClient = require('./llm-client');
const STRUCTURE_PROMPT_VERSION = '1.0.0';
const CORRECTION_PROMPT_VERSION = '1.0.0';

class RequirementsStructurer {
  constructor() {
    this.llm = new LLMClient();
  }

  /**
   * Structure natural language requirements into formal format (Eq. 1)
   * @param {object} parsedRequirements - Output from RequirementsParser
   * @returns {object} Formal structure conforming to formal-structure.schema.json
   */
  async structure(parsedRequirements) {
    // Pass 1: NL → formal structure
    const structurePrompt = await this.llm.loadPrompt('01-structure-requirements.md');
    const userContent = this._buildUserPrompt(parsedRequirements);

    const structured = await this.llm.chatJSON({
      systemPrompt: structurePrompt,
      userPrompt: userContent,
      mode: 'structure',
    });

    // This catalog is parser-owned, never copied from a model response.
    const sourceRequirements = [...parsedRequirements.basicFlow, ...parsedRequirements.alternativeFlows,
      ...parsedRequirements.exceptionFlows].map(({ id, originalText }) => ({ id, originalText }));
    structured.sourceRequirements = sourceRequirements;

    // Pass 2: BO correction — fix attribute/entity confusion
    const corrected = await this._correctBusinessObjects(structured);

    corrected.sourceRequirements = sourceRequirements;
    return corrected;
  }

  /**
   * Run the BO correction pass.
   * The paper notes LLMs sometimes identify attributes (e.g., "buyer's name")
   * as business objects instead of the entity they belong to (e.g., "Buyer").
   */
  async _correctBusinessObjects(structured) {
    const correctionPrompt = await this.llm.loadPrompt('02-correct-business-objects.md');

    const userContent = [
      'Preserve sourceRequirementId on every step; the supplied sourceRequirements catalog defines valid IDs.',
      'Review the following structured requirements and correct any business object misidentifications.',
      'If a "businessObject" field contains an attribute (e.g., "buyer\'s name", "order total")',
      'rather than a true business entity, replace it with the entity it belongs to.',
      '',
      '```json',
      JSON.stringify(structured, null, 2),
      '```',
    ].join('\n');

    const corrected = await this.llm.chatJSON({
      systemPrompt: correctionPrompt,
      userPrompt: userContent,
      mode: 'structure',
    });

    corrected.sourceRequirements = structured.sourceRequirements;
    return corrected;
  }

  /**
   * Build the user prompt from parsed requirements
   */
  _buildUserPrompt(parsed) {
    const parts = [];

    if (parsed.useCaseId) parts.push(`Use Case ID: ${parsed.useCaseId}`);
    if (parsed.useCaseName) parts.push(`Use Case Name: ${parsed.useCaseName}`);

    if (parsed.actors.length > 0) {
      parts.push(`\nActors: ${parsed.actors.join(', ')}`);
    }

    if (parsed.preconditions.length > 0) {
      parts.push(`\nPreconditions:\n${parsed.preconditions.map((p) => `- ${p}`).join('\n')}`);
    }

    if (parsed.basicFlow.length > 0) {
      parts.push(`\nBasic Flow:\n${parsed.basicFlow.map((s, i) => `${i + 1}. [${s.id}] ${s.text}`).join('\n')}`);
    }

    if (parsed.alternativeFlows.length > 0) {
      parts.push(`\nAlternative Flows:\n${parsed.alternativeFlows.map((s) => `- [${s.id}] ${s.text}`).join('\n')}`);
    }

    if (parsed.exceptionFlows.length > 0) {
      parts.push(`\nException Flows:\n${parsed.exceptionFlows.map((s) => `- [${s.id}] ${s.text}`).join('\n')}`);
    }

    if (parsed.postconditions.length > 0) {
      parts.push(`\nPostconditions:\n${parsed.postconditions.map((p) => `- ${p}`).join('\n')}`);
    }

    if (parsed.businessObjects.length > 0) {
      parts.push(`\nKnown Business Objects: ${parsed.businessObjects.join(', ')}`);
    }

    // Also include raw text for context the LLM can use for disambiguation
    if (parsed.rawText) {
      parts.push(`\n--- Original Raw Text ---\n${parsed.rawText}`);
    }

    return parts.join('\n');
  }
}

module.exports = RequirementsStructurer;

module.exports.STRUCTURE_PROMPT_VERSION = STRUCTURE_PROMPT_VERSION;
module.exports.CORRECTION_PROMPT_VERSION = CORRECTION_PROMPT_VERSION;
