/**
 * Requirements Parser
 *
 * Reads natural language requirements from the markdown template format.
 * Extracts structured sections: use case metadata, actors, flows, etc.
 */

const fs = require('fs-extra');
const path = require('path');

class RequirementsParser {
  /**
   * Parse a requirements input markdown file
   * @param {string} filePath - Path to the requirements markdown file
   * @returns {object} Parsed requirement data
   */
  async parse(filePath) {
    const resolvedPath = path.resolve(filePath);
    if (!(await fs.pathExists(resolvedPath))) {
      throw new Error(`Requirements file not found: ${resolvedPath}`);
    }

    const content = await fs.readFile(resolvedPath, 'utf8');
    return this.parseContent(content);
  }

  /**
   * Parse raw markdown content into structured sections
   * @param {string} content - Raw markdown text
   * @returns {object} Parsed requirement sections
   */
  parseContent(content) {
    const sections = this._extractSections(content);

    const usedIds = new Set();
    const flows = Object.fromEntries([['basicFlow', 'basic flow', 'BF'],
      ['alternativeFlows', 'alternative flows', 'AF'], ['exceptionFlows', 'exception flows', 'EF']]
      .map(([name, section, prefix]) => [name, this._extractFlow(sections, section, prefix, usedIds)]));

    return {
      useCaseId: this._extractField(sections, 'use case id') || null,
      useCaseName: this._extractField(sections, 'use case name') || null,
      actors: this._extractList(sections, 'actors'),
      preconditions: this._extractList(sections, 'preconditions'),
      postconditions: this._extractList(sections, 'postconditions'),
      ...flows,
      businessObjects: this._extractList(sections, 'business objects'),
      relatedUseCases: this._extractList(sections, 'related use cases'),
      rawText: content,
    };
  }

  /**
   * Extract markdown sections by heading
   */
  _extractSections(content) {
    const sections = {};
    // Line endings delimit source lines; rawText still retains the full input.
    const lines = content.split(/\r?\n/);
    let currentHeading = null;
    let currentContent = [];

    for (const line of lines) {
      const headingMatch = line.match(/^#{1,3}\s+(.+)/);
      if (headingMatch) {
        if (currentHeading) {
          sections[currentHeading] = currentContent.join('\n');
        }
        currentHeading = headingMatch[1].trim().toLowerCase();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentHeading) {
      sections[currentHeading] = currentContent.join('\n');
    }

    return sections;
  }

  /**
   * Extract a single-value field from a section
   */
  _extractField(sections, key) {
    const content = sections[key];
    if (!content) return null;
    // Strip markdown formatting, return first non-empty line
    const lines = content
      .split('\n')
      .map((l) => l.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);
    return lines[0] || null;
  }

  /** Retain source lines separately from normalized prompt text. Positional IDs
   * are stable for unchanged input; explicit labels survive reordering. */
  _extractFlow(sections, key, prefix, usedIds) {
    return (sections[key] || '').split('\n').filter((line) => line.trim())
      .map((originalText, index) => {
        const text = originalText.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim();
        const label = text.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*/);
        const id = label ? label[1] : `${prefix}-${index + 1}`;
        if (usedIds.has(id)) throw new Error(`Duplicate source requirement ID "${id}" in ${key}. Use unique labels.`);
        usedIds.add(id);
        return { id, originalText, text };
      });
  }

  /**
   * Extract a list of items from a section (numbered or bulleted)
   */
  _extractList(sections, key) {
    const content = sections[key];
    if (!content) return [];

    return content
      .split('\n')
      .map((line) => line.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);
  }
}

module.exports = RequirementsParser;
