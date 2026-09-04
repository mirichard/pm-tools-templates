#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const EXIT_CODES = Object.freeze({
  clean: 0,
  scannerError: 1,
  relevanceFindings: 2,
  securityFindings: 3,
  mixedFindings: 4
});

// Generated dependencies, build products, test artifacts, and scanner outputs
// are not source documentation and must not influence repository findings.
const SCAN_IGNORE_PATTERNS = Object.freeze([
  '**/node_modules/**',
  '**/.git/**',
  '**/coverage/**',
  '**/dist/**',
  '**/build/**',
  '**/cypress/screenshots/**',
  '**/cypress/reports/**',
  '**/.lighthouseci/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/.astro/**',
  '**/.DS_Store',
  '**/*.min.js',
  '**/package-lock.json',
  '**/yarn.lock',
  'doc-sec-allowlist.txt',
  'relevance-blocklist.txt',
  'doc-scan.sarif',
  'scan-stats.json'
]);

// Security detection patterns
const SECURITY_PATTERNS = {
  privateIP: {
    regex: /\b(?:10|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/g,
    description: "Private IP address detected",
    severity: "high"
  },
  corpFQDN: {
    regex: /[A-Za-z0-9_-]+\.corp\.[a-z]{2,6}/gi,
    description: "Corporate domain detected",
    severity: "high"
  },
  envHosts: {
    regex: /\b(dev|stg|stage|staging|uat|prod|production)\b[^ \n]{0,60}\.[A-Za-z0-9.-]+/gi,
    description: "Environment-specific hostname detected",
    severity: "medium"
  },
  credentials: {
    regex: /(password|token|secret|apikey|api_key|passphrase|auth_token).*?=.{1,120}/gi,
    description: "Credential pattern detected",
    severity: "critical"
  },
  awsSecrets: {
    regex: /(AWS_SECRET_ACCESS_KEY|AWS_ACCESS_KEY_ID|AKIA[0-9A-Z]{16})/gi,
    description: "AWS credential detected",
    severity: "critical"
  }
};

// Relevance detection patterns
const PROJECT_KEYWORDS = [
  'pm-tools-templates',
  'project management templates',
  'pmt',
  'mirichard',
  'template',
  'project management',
  'agile',
  'waterfall',
  'hybrid methodology'
];

const RELEVANCE_BLOCKLIST = [
  'companyX',
  'clientY',
  'internalAppZ',
  'secretProduct',
  'confidential-project',
  'acme-corp'
];

// RFC-5737 test IP ranges (allowed)
const TEST_IP_RANGES = [
  /\b192\.0\.2\.\d{1,3}\b/g,
  /\b198\.51\.100\.\d{1,3}\b/g,
  /\b203\.0\.113\.\d{1,3}\b/g
];

class DocumentScanner {
  constructor() {
    this.issues = [];
    this.stats = {
      filesScanned: 0,
      securityIssues: 0,
      relevanceIssues: 0,
      scanErrors: 0
    };
    this.allowlistPatterns = this.loadAllowlist();
    this.blocklistTerms = this.loadBlocklist();
  }

  loadAllowlist() {
    try {
      const content = fs.readFileSync('doc-sec-allowlist.txt', 'utf8');
      return content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(pattern => new RegExp(pattern, 'gi'));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      console.log('No allowlist file found, using defaults');
      return [];
    }
  }

  loadBlocklist() {
    try {
      const content = fs.readFileSync('relevance-blocklist.txt', 'utf8');
      return content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      console.log('No blocklist file found, using defaults');
      return RELEVANCE_BLOCKLIST;
    }
  }

  isAllowedByBypass(content, lineNumber) {
    const lines = content.split('\n');
    const startCheck = Math.max(0, lineNumber - 2);
    const endCheck = Math.min(lines.length - 1, lineNumber + 2);
    
    for (let i = startCheck; i <= endCheck; i++) {
      if (lines[i] && lines[i].includes('<!-- doc-sec-allow -->')) {
        return true;
      }
    }
    return false;
  }

  isTestExample(content) {
    const first25Lines = content.split('\n').slice(0, 25).join('\n').toLowerCase();
    return first25Lines.includes('demo') || 
           first25Lines.includes('example') || 
           first25Lines.includes('test');
  }

  isTestIPRange(match) {
    return TEST_IP_RANGES.some(pattern => pattern.test(match));
  }

  isAllowlisted(match) {
    return this.allowlistPatterns.some(pattern => pattern.test(match));
  }

  hasCommandProximity(content, match, matchIndex) {
    const contextRadius = 200; // characters
    const start = Math.max(0, matchIndex - contextRadius);
    const end = Math.min(content.length, matchIndex + contextRadius);
    const context = content.substring(start, end);
    
    const commandPattern = /\b(ssh|kubectl|helm|docker\s+login|psql|mysql|mongo)\b/gi;
    return commandPattern.test(context);
  }

  scanSecurity(filePath, content) {
    const issues = [];
    
    // Skip if marked as test/demo example
    if (this.isTestExample(content)) {
      return issues;
    }

    Object.entries(SECURITY_PATTERNS).forEach(([key, pattern]) => {
      let match;
      while ((match = pattern.regex.exec(content)) !== null) {
        const matchText = match[0];
        const matchIndex = match.index;
        
        // Skip test IP ranges
        if (key === 'privateIP' && this.isTestIPRange(matchText)) {
          continue;
        }
        
        // Skip if allowlisted
        if (this.isAllowlisted(matchText)) {
          continue;
        }
        
        // Find line number
        const beforeMatch = content.substring(0, matchIndex);
        const lineNumber = beforeMatch.split('\n').length;
        
        // Skip if has bypass comment
        if (this.isAllowedByBypass(content, lineNumber - 1)) {
          continue;
        }
        
        // Enhanced severity for command proximity
        let severity = pattern.severity;
        if (key === 'privateIP' && this.hasCommandProximity(content, matchText, matchIndex)) {
          severity = 'critical';
        }
        
        issues.push({
          type: 'security',
          file: filePath,
          line: lineNumber,
          column: matchIndex - beforeMatch.lastIndexOf('\n'),
          message: `${pattern.description}: ${matchText}`,
          severity: severity,
          ruleId: `doc-sec-${key}`
        });
      }
    });

    return issues;
  }

  scanRelevance(filePath, content) {
    const issues = [];
    const contentLower = content.toLowerCase();
    
    // Check for project keywords
    const hasProjectKeyword = PROJECT_KEYWORDS.some(keyword => 
      contentLower.includes(keyword.toLowerCase())
    );
    
    if (!hasProjectKeyword) {
      issues.push({
        type: 'relevance',
        file: filePath,
        line: 1,
        column: 1,
        message: 'Document appears unrelated to pm-tools-templates project - missing project keywords',
        severity: 'medium',
        ruleId: 'doc-relevance-keywords'
      });
    }
    
    // Check for blocked terms
    this.blocklistTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        const matchIndex = match.index;
        const beforeMatch = content.substring(0, matchIndex);
        const lineNumber = beforeMatch.split('\n').length;
        
        issues.push({
          type: 'relevance',
          file: filePath,
          line: lineNumber,
          column: matchIndex - beforeMatch.lastIndexOf('\n'),
          message: `Unauthorized reference detected: ${match[0]}`,
          severity: 'high',
          ruleId: 'doc-relevance-blocklist'
        });
      }
    });
    
    return issues;
  }

  extractCodeComments(content, filePath) {
    const comments = [];
    const ext = path.extname(filePath);
    
    let commentPatterns = [];
    
    if (['.js', '.ts', '.java', '.c', '.cpp', '.cs'].includes(ext)) {
      commentPatterns = [
        /\/\*[\s\S]*?\*\//g,  // /* */ comments
        /\/\/.*$/gm           // // comments
      ];
    } else if (['.py', '.sh', '.yml', '.yaml'].includes(ext)) {
      commentPatterns = [/^[ \t]*#.*$/gm]; // # comments
    }
    
    commentPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        comments.push(match[0]);
      }
    });
    
    return comments.join('\n');
  }

  async scanFile(filePath) {
    const fileStats = fs.statSync(filePath);
    if (!fileStats.isFile()) {
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath);
    
    let scanContent = content;
    
    // For code files, extract comments only
    if (!['.md', '.txt', '.adoc', '.rst'].includes(ext)) {
      scanContent = this.extractCodeComments(content, filePath);
      if (!scanContent.trim()) {
        return; // No comments to scan
      }
    }
    
    const securityIssues = this.scanSecurity(filePath, scanContent);
    const relevanceIssues = this.scanRelevance(filePath, scanContent);
    
    this.issues.push(...securityIssues, ...relevanceIssues);
    this.stats.securityIssues += securityIssues.length;
    this.stats.relevanceIssues += relevanceIssues.length;
    this.stats.filesScanned++;
  }

  generateSARIF() {
    const sarif = {
      version: "2.1.0",
      $schema: "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
      runs: [{
        tool: {
          driver: {
            name: "doc-sec-scanner",
            version: "1.0.0",
            informationUri: "https://github.com/mirichard/pm-tools-templates",
            rules: [
              {
                id: "doc-sec-privateIP",
                shortDescription: { text: "Private IP Address" },
                fullDescription: { text: "Private IP address detected in documentation" },
                defaultConfiguration: { level: "error" }
              },
              {
                id: "doc-sec-corpFQDN",
                shortDescription: { text: "Corporate Domain" },
                fullDescription: { text: "Corporate domain detected in documentation" },
                defaultConfiguration: { level: "error" }
              },
              {
                id: "doc-sec-envHosts",
                shortDescription: { text: "Environment Hostname" },
                fullDescription: { text: "Environment-specific hostname detected" },
                defaultConfiguration: { level: "warning" }
              },
              {
                id: "doc-sec-credentials",
                shortDescription: { text: "Credential Pattern" },
                fullDescription: { text: "Potential credential detected in documentation" },
                defaultConfiguration: { level: "error" }
              },
              {
                id: "doc-relevance-keywords",
                shortDescription: { text: "Missing Project Keywords" },
                fullDescription: { text: "Document missing project-related keywords" },
                defaultConfiguration: { level: "warning" }
              },
              {
                id: "doc-relevance-blocklist",
                shortDescription: { text: "Unauthorized Reference" },
                fullDescription: { text: "Document contains unauthorized external references" },
                defaultConfiguration: { level: "error" }
              }
            ]
          }
        },
        results: this.issues.map(issue => ({
          ruleId: issue.ruleId,
          message: { text: issue.message },
          level: issue.severity === 'critical' ? 'error' : issue.severity === 'high' ? 'error' : 'warning',
          locations: [{
            physicalLocation: {
              artifactLocation: { uri: issue.file },
              region: {
                startLine: issue.line,
                startColumn: issue.column
              }
            }
          }]
        }))
      }]
    };
    
    fs.writeFileSync('doc-scan.sarif', JSON.stringify(sarif, null, 2));
  }

  async scan() {
    console.log('🔍 Starting documentation security and relevance scan...');
    
    const patterns = [
      '**/*.md',
      '**/*.txt',
      '**/*.adoc',
      '**/*.rst',
      '**/*.js',
      '**/*.py',
      '**/*.yml',
      '**/*.yaml',
      '**/*.json'
    ];
    
    const files = await glob(patterns, {
      ignore: SCAN_IGNORE_PATTERNS,
      nodir: true,
      dot: false,
      followSymlinkedDirectories: false
    });
    
    console.log(`📁 Found ${files.length} files to scan`);
    
    for (const file of files) {
      try {
        await this.scanFile(file);
      } catch (error) {
        console.error(`Error scanning ${file}:`, error.message);
        this.stats.scanErrors++;
      }
    }
    
    // Write stats
    fs.writeFileSync('scan-stats.json', JSON.stringify(this.stats, null, 2));
    
    // Generate SARIF
    this.generateSARIF();
    
    console.log(`📊 Scan completed:`);
    console.log(`   Files scanned: ${this.stats.filesScanned}`);
    console.log(`   Security issues: ${this.stats.securityIssues}`);
    console.log(`   Relevance issues: ${this.stats.relevanceIssues}`);
    
    // Determine exit code
    if (this.stats.scanErrors > 0) {
      console.log('❌ Scanner failed to read one or more candidate files');
      return EXIT_CODES.scannerError;
    }

    if (this.stats.securityIssues > 0 && this.stats.relevanceIssues > 0) {
      console.log('❌ Security and relevance checks failed');
      return EXIT_CODES.mixedFindings;
    }

    if (this.stats.relevanceIssues > 0) {
      console.log('❌ Relevance check failed');
      return EXIT_CODES.relevanceFindings;
    }
    
    if (this.stats.securityIssues > 0) {
      console.log('❌ Security check failed');
      return EXIT_CODES.securityFindings;
    }
    
    console.log('✅ All checks passed');
    return EXIT_CODES.clean;
  }
}

// Main execution
async function main() {
  try {
    const scanner = new DocumentScanner();
    const exitCode = await scanner.scan();
    process.exit(exitCode);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { DocumentScanner, EXIT_CODES, SCAN_IGNORE_PATTERNS };
