#!/usr/bin/env node

/**
 * Template Validation Script
 * Comprehensive quality assurance checks for PM templates
 */

const fs = require('fs');
const path = require('path');

class TemplateValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.templateTypes = {
      'project-charter': ['objectives', 'scope', 'stakeholders', 'timeline'],
      'risk-register': ['risk-id', 'description', 'probability', 'impact', 'mitigation'],
      'status-report': ['executive-summary', 'accomplishments', 'issues', 'next-steps'],
      'meeting-minutes': ['attendees', 'agenda', 'decisions', 'action-items'],
      'project-plan': ['phases', 'milestones', 'resources', 'dependencies']
    };
  }

  /**
   * Validate a template file
   * @param {string} filePath - Path to template file
   * @returns {Object} Validation results
   */
  async validateTemplate(filePath) {
    console.log(`🔍 Validating template: ${filePath}`);
    
    // Reset validation state
    this.errors = [];
    this.warnings = [];
    this.passed = [];

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        this.errors.push(`File does not exist: ${filePath}`);
        return this.getResults();
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath, path.extname(filePath));
      
      // Run all validation checks
      await this.validateFileStructure(filePath, content);
      await this.validateContent(content, fileName);
      await this.validateMarkdownFormat(content);
      await this.validateTemplateSpecific(content, fileName);
      await this.validateAccessibility(content);
      await this.validateCompliance(content);

      return this.getResults();

    } catch (error) {
      this.errors.push(`Validation error: ${error.message}`);
      return this.getResults();
    }
  }

  /**
   * Validate file structure and naming conventions
   */
  async validateFileStructure(filePath, content) {
    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath);
    
    // Check file extension
    if (!['.md', '.markdown'].includes(fileExtension.toLowerCase())) {
      this.errors.push('Template must be in Markdown format (.md or .markdown)');
    } else {
      this.passed.push('✅ File format: Markdown');
    }

    // Check naming convention (lowercase, hyphens, descriptive)
    const namePattern = /^[a-z0-9-_]+\.(md|markdown)$/i;
    if (!namePattern.test(fileName)) {
      this.warnings.push('File name should use lowercase letters, hyphens, and be descriptive');
    } else {
      this.passed.push('✅ Naming convention: Valid');
    }

    // Check file size (reasonable limits)
    const stats = fs.statSync(filePath);
    const fileSizeKB = stats.size / 1024;
    
    if (fileSizeKB > 500) {
      this.warnings.push(`File size (${fileSizeKB.toFixed(1)}KB) is quite large. Consider breaking into smaller templates.`);
    } else if (fileSizeKB < 1) {
      this.warnings.push('File seems very small. Ensure template provides sufficient guidance.');
    } else {
      this.passed.push('✅ File size: Appropriate');
    }
  }

  /**
   * Validate content quality and completeness
   */
  async validateContent(content, fileName) {
    // Check for required sections
    const requiredSections = ['#', '##', '###']; // At least some headers
    const hasHeaders = requiredSections.some(header => content.includes(header));
    
    if (!hasHeaders) {
      this.errors.push('Template must include section headers (# ## ###)');
    } else {
      this.passed.push('✅ Structure: Headers present');
    }

    // Check for title
    const titleMatch = content.match(/^#\s+(.+)/m);
    if (!titleMatch) {
      this.errors.push('Template must have a main title (# Title)');
    } else {
      this.passed.push('✅ Title: Present');
      
      // Check title quality
      const title = titleMatch[1].trim();
      if (title.length < 10) {
        this.warnings.push('Title should be more descriptive');
      }
      if (!title.toLowerCase().includes('template') && !fileName.toLowerCase().includes('template')) {
        this.warnings.push('Consider including "Template" in title or filename for clarity');
      }
    }

    // Check for placeholder content
    const placeholders = [
      /\[.*?\]/g,  // [Placeholder]
      /\{.*?\}/g,  // {Placeholder}
      /TODO/gi,    // TODO items
      /TBD/gi,     // To Be Determined
      /XXX/g       // XXX markers
    ];

    let placeholderCount = 0;
    placeholders.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) placeholderCount += matches.length;
    });

    if (placeholderCount === 0) {
      this.warnings.push('No placeholders found. Template should include [Placeholder] text for user customization.');
    } else if (placeholderCount > 50) {
      this.warnings.push('Very high number of placeholders. Consider simplifying template.');
    } else {
      this.passed.push('✅ Placeholders: Appropriate amount');
    }

    // Check content length
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 100) {
      this.warnings.push('Template seems too brief. Consider adding more guidance.');
    } else if (wordCount > 2000) {
      this.warnings.push('Template is quite lengthy. Consider breaking into multiple templates.');
    } else {
      this.passed.push('✅ Content length: Appropriate');
    }

    // Check for instructions/guidance
    const instructionIndicators = [
      'instructions', 'guidance', 'how to', 'complete', 'fill out', 'replace', 'customize'
    ];
    
    const hasInstructions = instructionIndicators.some(indicator => 
      content.toLowerCase().includes(indicator)
    );

    if (!hasInstructions) {
      this.warnings.push('Consider adding usage instructions or guidance for users');
    } else {
      this.passed.push('✅ Instructions: Present');
    }
  }

  /**
   * Validate Markdown formatting
   */
  async validateMarkdownFormat(content) {
    const lines = content.split('\n');
    let lineNumber = 0;
    let hasTable = false;
    let hasCodeBlock = false;
    let hasLinks = false;

    for (const line of lines) {
      lineNumber++;

      // Check for malformed headers
      if (line.match(/^#{1,6}[^#\s]/)) {
        this.warnings.push(`Line ${lineNumber}: Header should have space after # symbols`);
      }

      // Check for tables
      if (line.includes('|')) {
        hasTable = true;
      }

      // Check for code blocks
      if (line.includes('```') || line.includes('`')) {
        hasCodeBlock = true;
      }

      // Check for links
      if (line.includes('[') && line.includes(']') && line.includes('(')) {
        hasLinks = true;
      }

      // Check for very long lines
      if (line.length > 120) {
        this.warnings.push(`Line ${lineNumber}: Very long line (${line.length} chars). Consider breaking up.`);
      }
    }

    // Validate formatting elements usage
    if (hasTable) {
      this.passed.push('✅ Formatting: Tables used effectively');
    }
    
    if (hasCodeBlock) {
      this.passed.push('✅ Formatting: Code examples included');
    }

    // Check for consistent formatting
    const headerCounts = {
      h1: (content.match(/^# /gm) || []).length,
      h2: (content.match(/^## /gm) || []).length,
      h3: (content.match(/^### /gm) || []).length
    };

    if (headerCounts.h1 > 1) {
      this.warnings.push('Multiple H1 headers found. Consider using H2 for main sections.');
    }

    if (headerCounts.h2 === 0 && headerCounts.h3 > 0) {
      this.warnings.push('H3 headers without H2. Check header hierarchy.');
    }
  }

  /**
   * Validate template-specific requirements
   */
  async validateTemplateSpecific(content, fileName) {
    const lowerFileName = fileName.toLowerCase();
    let templateType = null;

    // Determine template type
    for (const [type, requirements] of Object.entries(this.templateTypes)) {
      if (lowerFileName.includes(type) || content.toLowerCase().includes(type)) {
        templateType = type;
        break;
      }
    }

    if (!templateType) {
      this.passed.push('✅ Template type: Generic template');
      return;
    }

    this.passed.push(`✅ Template type: ${templateType} identified`);

    // Check for type-specific requirements
    const requirements = this.templateTypes[templateType];
    const missingRequirements = [];

    for (const requirement of requirements) {
      const variations = [
        requirement,
        requirement.replace('-', ' '),
        requirement.replace('-', '_'),
        requirement.charAt(0).toUpperCase() + requirement.slice(1)
      ];

      const found = variations.some(variation => 
        content.toLowerCase().includes(variation.toLowerCase())
      );

      if (!found) {
        missingRequirements.push(requirement);
      }
    }

    if (missingRequirements.length > 0) {
      this.warnings.push(`Template type '${templateType}' missing suggested sections: ${missingRequirements.join(', ')}`);
    } else {
      this.passed.push(`✅ Template completeness: All ${templateType} sections present`);
    }
  }

  /**
   * Validate accessibility and inclusivity
   */
  async validateAccessibility(content) {
    // Check for alternative text in images
    const imagePattern = /!\[([^\]]*)\]\([^)]+\)/g;
    const images = content.match(imagePattern) || [];
    
    let imagesWithoutAlt = 0;
    images.forEach(image => {
      const altMatch = image.match(/!\[([^\]]*)\]/);
      if (!altMatch || !altMatch[1].trim()) {
        imagesWithoutAlt++;
      }
    });

    if (imagesWithoutAlt > 0) {
      this.warnings.push(`${imagesWithoutAlt} images without alternative text. Add alt text for accessibility.`);
    } else if (images.length > 0) {
      this.passed.push('✅ Accessibility: Images have alternative text');
    }

    // Check for inclusive language
    const problematicTerms = [
      'guys', 'blacklist', 'whitelist', 'master/slave', 'sanity check', 'dummy'
    ];

    const foundProblematicTerms = [];
    problematicTerms.forEach(term => {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundProblematicTerms.push(term);
      }
    });

    if (foundProblematicTerms.length > 0) {
      this.warnings.push(`Consider more inclusive alternatives to: ${foundProblematicTerms.join(', ')}`);
    } else {
      this.passed.push('✅ Inclusivity: Language appears inclusive');
    }
  }

  /**
   * Validate compliance and legal considerations
   */
  async validateCompliance(content) {
    // Check for copyright/license information
    const copyrightPattern = /copyright|©|\(c\)|license|mit|apache|gpl/i;
    const hasLegalInfo = copyrightPattern.test(content);

    if (!hasLegalInfo) {
      this.warnings.push('Consider adding license or usage rights information');
    } else {
      this.passed.push('✅ Legal: License/copyright information present');
    }

    // Check for data privacy considerations
    const privacyTerms = ['personal data', 'pii', 'gdpr', 'privacy', 'confidential'];
    const mentionsPrivacy = privacyTerms.some(term => 
      content.toLowerCase().includes(term)
    );

    if (content.toLowerCase().includes('data') && !mentionsPrivacy) {
      this.warnings.push('Template mentions data but lacks privacy considerations');
    }

    // Check for security considerations in relevant templates
    if (content.toLowerCase().includes('password') || 
        content.toLowerCase().includes('authentication') ||
        content.toLowerCase().includes('security')) {
      
      const securityGuidance = ['encrypt', 'secure', 'protection', 'safety'];
      const hasSecurityGuidance = securityGuidance.some(term => 
        content.toLowerCase().includes(term)
      );

      if (!hasSecurityGuidance) {
        this.warnings.push('Security-related template should include security guidance');
      } else {
        this.passed.push('✅ Security: Security guidance present');
      }
    }
  }

  /**
   * Get validation results
   */
  getResults() {
    const totalChecks = this.errors.length + this.warnings.length + this.passed.length;
    const score = totalChecks > 0 ? Math.round((this.passed.length / totalChecks) * 100) : 0;

    return {
      score,
      status: this.errors.length === 0 ? (this.warnings.length === 0 ? 'EXCELLENT' : 'GOOD') : 'NEEDS_IMPROVEMENT',
      errors: this.errors,
      warnings: this.warnings,
      passed: this.passed,
      summary: {
        total: totalChecks,
        errors: this.errors.length,
        warnings: this.warnings.length,
        passed: this.passed.length
      }
    };
  }

  /**
   * Generate validation report
   */
  generateReport(results, filePath) {
    const fileName = path.basename(filePath);
    const statusEmoji = {
      'EXCELLENT': '🟢',
      'GOOD': '🟡', 
      'NEEDS_IMPROVEMENT': '🔴'
    };

    let report = `# Template Validation Report\n\n`;
    report += `**File:** ${fileName}\n`;
    report += `**Status:** ${statusEmoji[results.status]} ${results.status}\n`;
    report += `**Quality Score:** ${results.score}%\n\n`;

    if (results.errors.length > 0) {
      report += `## ❌ Errors (${results.errors.length})\n\n`;
      results.errors.forEach(error => {
        report += `- ${error}\n`;
      });
      report += '\n';
    }

    if (results.warnings.length > 0) {
      report += `## ⚠️ Warnings (${results.warnings.length})\n\n`;
      results.warnings.forEach(warning => {
        report += `- ${warning}\n`;
      });
      report += '\n';
    }

    if (results.passed.length > 0) {
      report += `## ✅ Passed Checks (${results.passed.length})\n\n`;
      results.passed.forEach(pass => {
        report += `- ${pass}\n`;
      });
      report += '\n';
    }

    report += `---\n\n`;
    report += `*Validation completed at ${new Date().toISOString()}*\n`;

    return report;
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node validate-template.js <template-file-path>');
    process.exit(1);
  }

  const validator = new TemplateValidator();
  const filePath = args[0];

  validator.validateTemplate(filePath)
    .then(results => {
      console.log('\n' + '='.repeat(50));
      console.log('TEMPLATE VALIDATION RESULTS');
      console.log('='.repeat(50));
      
      const report = validator.generateReport(results, filePath);
      console.log(report);

      // Exit with appropriate code
      process.exit(results.errors.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}

module.exports = TemplateValidator;
