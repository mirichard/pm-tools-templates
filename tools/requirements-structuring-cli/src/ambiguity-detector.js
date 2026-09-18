/**
 * Ambiguity Detector
 *
 * Phase 0 of the pipeline. Scans raw NL requirements for language that will
 * cause misalignment between business intent and what engineers build.
 * Runs before structuring so issues can be resolved with stakeholders first.
 */

const LLMClient = require('./llm-client');
const chalk = require('chalk');

class AmbiguityDetector {
  constructor() {
    this.llm = new LLMClient();
  }

  /**
   * Scan raw requirements text for ambiguities
   * @param {string} rawContent - The full markdown content of the requirements input
   * @returns {object} { findings, summary }
   */
  async detect(rawContent) {
    const prompt = await this.llm.loadPrompt('00-detect-ambiguity.md');

    const result = await this.llm.chatJSON({
      systemPrompt: prompt,
      userPrompt: rawContent,
      mode: 'creative',
    });

    return {
      findings: result.findings || [],
      summary: result.summary || { blockers: 0, warnings: 0, readinessScore: 'ready' },
    };
  }

  /**
   * Format findings for terminal display
   * @param {object} result - Output from detect()
   * @returns {string} Formatted string for console output
   */
  formatFindings(result) {
    const { findings, summary } = result;
    const lines = [];

    // Readiness badge
    const badges = {
      ready: chalk.green.bold('✅ READY — Requirements are clear enough to begin development'),
      needs_clarification: chalk.yellow.bold('⚠️  NEEDS CLARIFICATION — Some questions should be answered before sprint planning'),
      not_ready: chalk.red.bold('🛑 NOT READY — Requirements need significant rework before the team can plan'),
    };
    lines.push(badges[summary.readinessScore] || badges.needs_clarification);
    lines.push(`   ${summary.blockers} blocker(s), ${summary.warnings} warning(s)`);
    lines.push('');

    if (findings.length === 0) {
      lines.push(chalk.green('  No ambiguities detected.'));
      return lines.join('\n');
    }

    // Group by severity
    const blockers = findings.filter((f) => f.severity === 'blocker');
    const warnings = findings.filter((f) => f.severity === 'warning');

    if (blockers.length > 0) {
      lines.push(chalk.red.bold('  Blockers (must resolve before development):'));
      lines.push('');
      for (const f of blockers) {
        lines.push(chalk.red(`  🛑 [${f.category}] "${f.phrase}"`));
        lines.push(chalk.dim(`     Section: ${f.section}`));
        lines.push(chalk.white(`     Issue: ${f.issue}`));
        lines.push(chalk.cyan(`     → Ask: ${f.question}`));
        lines.push('');
      }
    }

    if (warnings.length > 0) {
      lines.push(chalk.yellow.bold('  Warnings (document assumptions or confirm):'));
      lines.push('');
      for (const f of warnings) {
        lines.push(chalk.yellow(`  ⚠️  [${f.category}] "${f.phrase}"`));
        lines.push(chalk.dim(`     Section: ${f.section}`));
        lines.push(chalk.white(`     Issue: ${f.issue}`));
        lines.push(chalk.cyan(`     → Ask: ${f.question}`));
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  /**
   * Format findings as Markdown for the report
   * @param {object} result - Output from detect()
   * @returns {string} Markdown document
   */
  formatMarkdown(result) {
    const { findings, summary } = result;
    const lines = [];

    lines.push('# Ambiguity Analysis Report');
    lines.push('');

    // Readiness
    const badges = {
      ready: '**Status: ✅ READY** — Requirements are clear enough to begin development.',
      needs_clarification: '**Status: ⚠️ NEEDS CLARIFICATION** — Some questions should be answered before sprint planning.',
      not_ready: '**Status: 🛑 NOT READY** — Requirements need significant rework before the team can plan.',
    };
    lines.push(badges[summary.readinessScore] || badges.needs_clarification);
    lines.push('');
    lines.push(`Blockers: **${summary.blockers}** | Warnings: **${summary.warnings}**`);
    lines.push('');

    if (findings.length === 0) {
      lines.push('No ambiguities detected. Requirements are ready for structuring.');
      return lines.join('\n');
    }

    // Blockers
    const blockers = findings.filter((f) => f.severity === 'blocker');
    if (blockers.length > 0) {
      lines.push('## Blockers');
      lines.push('');
      lines.push('These must be resolved with the PO/business stakeholder before development can begin.');
      lines.push('');
      for (let i = 0; i < blockers.length; i++) {
        const f = blockers[i];
        lines.push(`### ${i + 1}. "${f.phrase}"`);
        lines.push('');
        lines.push(`**Section:** ${f.section}`);
        lines.push(`**Category:** ${f.category.replace(/_/g, ' ')}`);
        lines.push(`**Issue:** ${f.issue}`);
        lines.push(`**Question for stakeholder:** ${f.question}`);
        lines.push('');
      }
    }

    // Warnings
    const warnings = findings.filter((f) => f.severity === 'warning');
    if (warnings.length > 0) {
      lines.push('## Warnings');
      lines.push('');
      lines.push('These should be confirmed or documented as assumptions before sprint planning.');
      lines.push('');
      for (let i = 0; i < warnings.length; i++) {
        const f = warnings[i];
        lines.push(`### ${i + 1}. "${f.phrase}"`);
        lines.push('');
        lines.push(`**Section:** ${f.section}`);
        lines.push(`**Category:** ${f.category.replace(/_/g, ' ')}`);
        lines.push(`**Issue:** ${f.issue}`);
        lines.push(`**Question for stakeholder:** ${f.question}`);
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}

module.exports = AmbiguityDetector;
