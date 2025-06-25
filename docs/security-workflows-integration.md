# 🔒 Security Workflows Integration Guide

Complete integration documentation for the three-phase enterprise security workflow system.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Phase-by-Phase Setup](#phase-by-phase-setup)
- [Configuration](#configuration)
- [Integration Patterns](#integration-patterns)
- [Monitoring & Alerting](#monitoring-alerting)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Advanced Configuration](#advanced-configuration)

## 🎯 Overview

The enterprise security workflow system consists of three complementary phases that provide comprehensive security coverage:

### Phase 1: Dependency Security Scanning
- **File:** `.github/workflows/dependency-security.yml`
- **Purpose:** Scan dependencies for vulnerabilities and security issues
- **Coverage:** npm, Python, Composer, Go, Rust packages
- **Tools:** GitHub Dependency Review, npm audit, Safety, pip-audit, Semgrep, TruffleHog

### Phase 2: Static Application Security Testing (SAST)
- **File:** `.github/workflows/sast-security.yml`
- **Purpose:** Static code analysis for security vulnerabilities
- **Coverage:** 9+ programming languages and frameworks
- **Tools:** CodeQL, Semgrep, TruffleHog, Git-secrets, Hadolint, Checkov

### Phase 3: Infrastructure Security Analysis
- **File:** `.github/workflows/infrastructure-security.yml`
- **Purpose:** Infrastructure as Code and container security
- **Coverage:** Terraform, Kubernetes, Docker, Helm, CloudFormation
- **Tools:** Checkov, Terrascan, TFLint, TFSec, Trivy, KICS, Kubesec

## 🚀 Quick Start

### Prerequisites

1. **Repository Requirements:**
   - GitHub repository with Actions enabled
   - Appropriate permissions for security events
   - Branch protection rules (recommended)

2. **GitHub Settings:**
   ```bash
   # Required repository permissions
   - Contents: Read
   - Security events: Write
   - Actions: Read
   - Pull requests: Write
   - Issues: Write
   ```

### Installation

1. **Copy Workflow Files:**
   ```bash
   # Create workflows directory
   mkdir -p .github/workflows
   
   # Copy the three workflow files
   cp dependency-security.yml .github/workflows/
   cp sast-security.yml .github/workflows/
   cp infrastructure-security.yml .github/workflows/
   ```

2. **Commit and Push:**
   ```bash
   git add .github/workflows/
   git commit -m "Add enterprise security workflows"
   git push origin main
   ```

3. **Verify Installation:**
   - Navigate to your repository's Actions tab
   - Verify all three workflows appear in the workflow list
   - Check the first run completes successfully

## 📁 Phase-by-Phase Setup

### Phase 1: Dependency Security Setup

#### Automatic Triggers
- **Schedule:** Weekly Monday 6 AM UTC
- **Pull Requests:** On dependency file changes
- **Push:** On main branch dependency changes

#### Required Files
The workflow automatically detects and scans:
```
package.json, package-lock.json    # Node.js
requirements.txt, Pipfile         # Python
composer.json                     # PHP
go.mod                           # Go
Cargo.toml                       # Rust
```

#### Configuration
```yaml
env:
  VULNERABILITY_THRESHOLD: 'moderate'  # moderate, high, critical
  LICENSE_ALLOWLIST: 'MIT,Apache-2.0,BSD-3-Clause,ISC'
```

#### Manual Trigger Options
```yaml
workflow_dispatch:
  inputs:
    scan_type:
      - comprehensive
      - vulnerability-only
      - license-only
      - outdated-packages
```

### Phase 2: SAST Security Setup

#### Automatic Triggers
- **Schedule:** Daily 2 AM UTC
- **Push/PR:** On main and develop branches
- **Manual:** Workflow dispatch with options

#### Language Detection
Automatically detects and analyzes:
```
JavaScript/TypeScript  → CodeQL + Semgrep
Python                → CodeQL + Semgrep
Java                  → CodeQL + Semgrep
C#                    → CodeQL + Semgrep
Go                    → CodeQL + Semgrep
Ruby                  → CodeQL + Semgrep
Rust                  → Semgrep
PHP                   → Semgrep
```

#### Configuration
```yaml
env:
  SEMGREP_TIMEOUT: 1800
  CODEQL_TIMEOUT: 3600
  SECURITY_SEVERITY_THRESHOLD: 'medium'
```

#### Manual Trigger Options
```yaml
workflow_dispatch:
  inputs:
    analysis_depth:
      - quick
      - comprehensive
      - deep
      - custom
    include_experimental: boolean
    target_languages: string
```

### Phase 3: Infrastructure Security Setup

#### Automatic Triggers
- **Schedule:** Daily 3 AM UTC
- **Push/PR:** On infrastructure file changes
- **Manual:** Workflow dispatch with options

#### Infrastructure Detection
Automatically detects and analyzes:
```
Terraform         → Checkov, Terrascan, TFLint, TFSec
Kubernetes        → KICS, Kubesec, kubectl validation
Docker           → Trivy, Hadolint
Helm             → Security analysis
CloudFormation   → Checkov, cfn-lint
ARM Templates    → Security analysis
GitHub Actions   → Checkov
```

#### Configuration
```yaml
env:
  SEVERITY_THRESHOLD: 'medium'
  COMPLIANCE_FRAMEWORKS: 'CIS,NIST,SOC2,PCI'
```

#### Manual Trigger Options
```yaml
workflow_dispatch:
  inputs:
    scan_scope:
      - comprehensive
      - terraform-only
      - containers-only
      - kubernetes-only
      - cloud-config-only
      - compliance-only
    compliance_frameworks: string
    severity_threshold: low|medium|high|critical
```

## ⚙️ Configuration

### Global Configuration

#### Repository Secrets (if needed)
```bash
# Optional: Custom security tool configurations
SEMGREP_APP_TOKEN          # For Semgrep Cloud features
SNYK_TOKEN                 # If using Snyk integration
SECURITY_NOTIFICATION_WEBHOOK  # Custom notification endpoint
```

#### Branch Protection Rules
```yaml
# Recommended branch protection settings
required_status_checks:
  - "Dependency Security Analysis"
  - "CodeQL Analysis"
  - "Infrastructure Discovery"
  
dismiss_stale_reviews: true
require_code_owner_reviews: true
restrict_pushes: true
```

### Environment-Specific Configuration

#### Development Environment
```yaml
# .github/workflows/dev-security.yml
on:
  pull_request:
    branches: [develop]
env:
  SEVERITY_THRESHOLD: 'low'
  QUICK_SCAN: 'true'
```

#### Production Environment
```yaml
# .github/workflows/prod-security.yml
on:
  push:
    branches: [main]
env:
  SEVERITY_THRESHOLD: 'high'
  COMPLIANCE_REQUIRED: 'true'
  BLOCK_ON_CRITICAL: 'true'
```

### Custom Workflow Configurations

#### Dependency Security Customization
```yaml
# Custom package managers
env:
  CUSTOM_PACKAGE_MANAGERS: 'yarn,pnpm,poetry'
  
# Custom vulnerability databases
env:
  VULN_DATABASES: 'github,snyk,osv'
  
# Custom license policies
env:
  LICENSE_POLICIES: 'strict,permissive,copyleft-limited'
```

#### SAST Customization
```yaml
# Custom CodeQL configuration
codeql-config: |
  queries:
    - uses: security-and-quality
    - uses: security-experimental
  paths-ignore:
    - "**/test/**"
    - "**/vendor/**"

# Custom Semgrep rules
semgrep-config: |
  rules:
    - p/security-audit
    - p/owasp-top-ten
    - p/secrets
    - ./custom-rules.yml
```

#### Infrastructure Security Customization
```yaml
# Custom Terraform validation
terraform-config: |
  required_version: ">= 1.0"
  required_providers:
    aws: ">= 4.0"
    
# Custom Kubernetes policies
k8s-policies: |
  - pod-security-standards
  - network-policies-required
  - resource-limits-required
```

## 🔗 Integration Patterns

### Sequential Integration (Recommended)
```yaml
# Workflow dependencies for sequential execution
jobs:
  dependency-security:
    uses: ./.github/workflows/dependency-security.yml
    
  sast-security:
    needs: dependency-security
    uses: ./.github/workflows/sast-security.yml
    
  infrastructure-security:
    needs: [dependency-security, sast-security]
    uses: ./.github/workflows/infrastructure-security.yml
```

### Parallel Integration (Fast)
```yaml
# All workflows run in parallel
jobs:
  security-analysis:
    strategy:
      matrix:
        workflow: 
          - dependency-security
          - sast-security
          - infrastructure-security
    uses: ./.github/workflows/${{ matrix.workflow }}.yml
```

### Conditional Integration (Smart)
```yaml
# Conditional execution based on changes
jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      dependencies: ${{ steps.changes.outputs.dependencies }}
      code: ${{ steps.changes.outputs.code }}
      infrastructure: ${{ steps.changes.outputs.infrastructure }}
    steps:
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            dependencies:
              - '**/package*.json'
              - '**/requirements*.txt'
            code:
              - '**/*.js'
              - '**/*.py'
              - '**/*.java'
            infrastructure:
              - '**/*.tf'
              - '**/Dockerfile*'
              - '**/*.yaml'

  dependency-security:
    needs: changes
    if: needs.changes.outputs.dependencies == 'true'
    uses: ./.github/workflows/dependency-security.yml

  sast-security:
    needs: changes
    if: needs.changes.outputs.code == 'true'
    uses: ./.github/workflows/sast-security.yml

  infrastructure-security:
    needs: changes
    if: needs.changes.outputs.infrastructure == 'true'
    uses: ./.github/workflows/infrastructure-security.yml
```

### Integration with External Systems

#### Slack Notifications
```yaml
# Add to each workflow's summary job
- name: Slack Notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#security-alerts'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
```

#### Jira Integration
```yaml
# Create Jira issues for critical findings
- name: Create Jira Issue
  if: failure()
  uses: atlassian/gajira-create@v2
  with:
    project: SEC
    issuetype: Bug
    summary: "Critical Security Issues - ${{ github.repository }}"
    description: |
      Critical security issues detected in ${{ github.repository }}
      
      Workflow: ${{ github.workflow }}
      Run: ${{ github.run_id }}
      Branch: ${{ github.ref }}
```

#### Microsoft Teams Integration
```yaml
# Teams webhook notification
- name: Teams Notification
  if: failure()
  uses: skitionek/notify-microsoft-teams@master
  with:
    webhook_url: ${{ secrets.TEAMS_WEBHOOK }}
    needs: ${{ toJson(needs) }}
    job: ${{ toJson(job) }}
    steps: ${{ toJson(steps) }}
```

## 📊 Monitoring & Alerting

### Security Metrics Dashboard

#### Key Performance Indicators (KPIs)
```yaml
# Metrics to track
Security Coverage:
  - Code coverage percentage
  - Dependency scan coverage
  - Infrastructure coverage

Vulnerability Metrics:
  - Critical vulnerabilities count
  - High severity issues count
  - Time to resolution (TTR)
  - Mean time to detection (MTTD)

Compliance Metrics:
  - Compliance framework adherence
  - Policy violations count
  - Security control effectiveness
```

#### GitHub Actions Monitoring
```yaml
# Custom monitoring workflow
name: Security Metrics Collection
on:
  schedule:
    - cron: '0 0 * * *'  # Daily metrics collection

jobs:
  collect-metrics:
    runs-on: ubuntu-latest
    steps:
      - name: Collect Security Metrics
        run: |
          # Collect workflow run data
          gh api repos/${{ github.repository }}/actions/runs \
            --jq '.workflow_runs[] | select(.name | contains("Security"))' \
            > security-metrics.json
          
          # Generate metrics report
          python3 scripts/generate-security-metrics.py
```

### Alert Configuration

#### Critical Alert Rules
```yaml
# Alert thresholds
Critical Alerts:
  - workflow_failure: immediate
  - critical_vulnerability: immediate
  - compliance_violation: 1 hour
  - secrets_exposed: immediate

High Priority Alerts:
  - high_severity_vulnerability: 4 hours
  - security_policy_violation: 8 hours
  - dependency_risk: 24 hours

Medium Priority Alerts:
  - medium_severity_issues: 48 hours
  - configuration_drift: 72 hours
```

#### Notification Channels
```yaml
# Multi-channel notifications
notification_matrix:
  critical:
    - slack: "#security-critical"
    - email: "security-team@company.com"
    - pagerduty: "security-oncall"
    
  high:
    - slack: "#security-alerts"
    - email: "dev-team@company.com"
    
  medium:
    - slack: "#security-notifications"
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Workflow Fails to Start
```yaml
# Issue: Workflow doesn't trigger
Symptoms:
  - No workflow runs in Actions tab
  - Events not triggering workflows

Solutions:
  1. Check file paths (.github/workflows/)
  2. Verify YAML syntax
  3. Check branch protection rules
  4. Verify repository permissions

# Debug command
name: Debug Workflow
on: [push]
jobs:
  debug:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Event: ${{ github.event_name }}"
          echo "Ref: ${{ github.ref }}"
          echo "Actor: ${{ github.actor }}"
```

#### Permission Errors
```yaml
# Issue: Permission denied errors
Symptoms:
  - "Resource not accessible by integration"
  - Failed to create security events

Solutions:
  1. Update repository permissions
  2. Check GITHUB_TOKEN scope
  3. Verify organization settings

# Required permissions
permissions:
  contents: read
  security-events: write
  actions: read
  pull-requests: write
  issues: write
  checks: write
```

#### Tool Installation Failures
```yaml
# Issue: Security tools fail to install
Symptoms:
  - Tool download failures
  - Installation timeouts
  - Command not found errors

Solutions:
  1. Check network connectivity
  2. Use alternative installation methods
  3. Add retry logic
  4. Use cached tool versions

# Example with retry logic
- name: Install Tool with Retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: |
      curl -sSL https://tool-url | bash
```

#### Large Repository Timeouts
```yaml
# Issue: Workflows timeout on large repositories
Symptoms:
  - Workflow cancelled after 6 hours
  - Tool timeouts during analysis

Solutions:
  1. Increase timeout values
  2. Use path filters
  3. Optimize scan scope
  4. Use incremental scanning

# Optimized configuration
env:
  SEMGREP_TIMEOUT: 3600
  CODEQL_TIMEOUT: 7200
paths:
  include:
    - 'src/**'
  exclude:
    - 'node_modules/**'
    - 'vendor/**'
    - 'test/**'
```

#### False Positive Management
```yaml
# Issue: Too many false positives
Symptoms:
  - Noise in security alerts
  - Team ignoring alerts
  - Workflow always failing

Solutions:
  1. Tune severity thresholds
  2. Add suppressions
  3. Customize rule sets
  4. Implement triage process

# Suppression configuration
semgrep-ignore: |
  # Ignore test files
  test/
  # Ignore specific rules
  rules:
    - id: rule-id
      paths:
        - "path/to/ignore"
```

### Debug Mode

#### Enable Verbose Logging
```yaml
# Add to workflow for debugging
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
  
steps:
  - name: Debug Information
    run: |
      echo "::group::Environment Variables"
      env | sort
      echo "::endgroup::"
      
      echo "::group::Runner Information"
      uname -a
      which docker
      docker --version
      echo "::endgroup::"
```

#### Test Workflow Components
```yaml
# Minimal test workflow
name: Security Tools Test
on:
  workflow_dispatch:
    
jobs:
  test-tools:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Test Semgrep
        run: |
          pip install semgrep
          semgrep --version
          
      - name: Test CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: javascript
          
      - name: Test Trivy
        run: |
          curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
          trivy --version
```

## 📖 Best Practices

### Security Configuration

#### Least Privilege Access
```yaml
# Minimize workflow permissions
permissions:
  contents: read        # Only read repository contents
  security-events: write # Write security findings
  pull-requests: write  # Comment on PRs
  issues: write        # Create security issues
  # Avoid: write-all or admin permissions
```

#### Secure Secret Management
```yaml
# Use GitHub secrets for sensitive data
steps:
  - name: Configure Tool
    env:
      API_KEY: ${{ secrets.SECURITY_TOOL_API_KEY }}
      WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
    run: |
      # Never echo secrets
      # Never log secrets
      tool configure --api-key="$API_KEY"
```

#### Input Validation
```yaml
# Validate workflow inputs
steps:
  - name: Validate Inputs
    run: |
      # Validate severity threshold
      if [[ ! "${{ inputs.severity_threshold }}" =~ ^(low|medium|high|critical)$ ]]; then
        echo "Invalid severity threshold"
        exit 1
      fi
      
      # Validate scan scope
      VALID_SCOPES="comprehensive terraform-only containers-only"
      if [[ ! "$VALID_SCOPES" =~ "${{ inputs.scan_scope }}" ]]; then
        echo "Invalid scan scope"
        exit 1
      fi
```

### Performance Optimization

#### Efficient Caching
```yaml
# Cache dependencies and tools
steps:
  - name: Cache Node Dependencies
    uses: actions/cache@v3
    with:
      path: ~/.npm
      key: node-${{ hashFiles('**/package-lock.json') }}
      
  - name: Cache Security Tools
    uses: actions/cache@v3
    with:
      path: |
        /usr/local/bin/semgrep
        /usr/local/bin/trivy
      key: security-tools-${{ runner.os }}-v1
```

#### Parallel Execution
```yaml
# Use matrix strategy for parallel scanning
strategy:
  matrix:
    include:
      - tool: semgrep
        config: p/security-audit
      - tool: semgrep
        config: p/owasp-top-ten
      - tool: trivy
        type: fs
```

#### Smart Triggering
```yaml
# Use path filters to avoid unnecessary runs
on:
  pull_request:
    paths:
      - '**/*.js'
      - '**/*.py'
      - '**/*.java'
      - '!**/test/**'
      - '!**/docs/**'
```

### Team Integration

#### Clear Communication
```yaml
# Informative PR comments
- name: Security Analysis Summary
  uses: actions/github-script@v7
  with:
    script: |
      const summary = `## 🔒 Security Analysis Complete
      
      ### Results Summary
      - **Dependency Scan**: ✅ Passed
      - **SAST Analysis**: ⚠️ 3 medium issues found
      - **Infrastructure**: ✅ Passed
      
      ### Next Steps
      1. Review medium severity findings
      2. Apply recommended fixes
      3. Re-run analysis to verify
      
      📊 [View detailed results](${context.payload.repository.html_url}/actions/runs/${context.runId})`;
      
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: summary
      });
```

#### Developer Education
```yaml
# Add educational content to security reports
- name: Generate Security Guide
  run: |
    cat > security-guide.md << 'EOF'
    # Security Issues Found
    
    ## Understanding the Issues
    
    ### SQL Injection (High Severity)
    **What it is**: Occurs when user input is directly included in SQL queries
    **Why it matters**: Attackers can access or modify database data
    **How to fix**: Use parameterized queries or prepared statements
    
    ### Cross-Site Scripting (Medium Severity)
    **What it is**: Occurs when user input is displayed without proper escaping
    **Why it matters**: Attackers can execute malicious scripts in users' browsers
    **How to fix**: Sanitize and escape all user input before display
    
    ## Resources
    - [OWASP Top 10](https://owasp.org/www-project-top-ten/)
    - [Secure Coding Practices](https://wiki.sei.cmu.edu/confluence/display/seccode)
    EOF
```

#### Gradual Rollout
```yaml
# Phase rollout strategy
Phase 1: Dependency Security (Week 1-2)
  - Enable dependency scanning
  - Train team on vulnerability management
  - Establish triage process

Phase 2: SAST Integration (Week 3-4)
  - Add static analysis
  - Configure rule sets
  - Integrate with development workflow

Phase 3: Infrastructure Security (Week 5-6)
  - Enable IaC scanning
  - Configure compliance frameworks
  - Establish infrastructure security policies

Phase 4: Full Integration (Week 7-8)
  - Enable all workflows
  - Configure notifications
  - Establish metrics and monitoring
```

## 🔧 Advanced Configuration

### Custom Rule Development

#### Semgrep Custom Rules
```yaml
# custom-rules.yml
rules:
  - id: custom-sql-injection
    pattern: |
      db.query($USER_INPUT)
    message: "Direct user input in SQL query detected"
    languages: [python, javascript]
    severity: ERROR
    metadata:
      category: security
      cwe: "CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')"
```

#### CodeQL Custom Queries
```ql
/**
 * @name Custom security query
 * @description Finds potential security issues
 * @kind problem
 * @problem.severity error
 * @security-severity 8.0
 * @tags security
 */

import javascript

from CallExpr call
where call.getCalleeName() = "eval"
select call, "Use of eval() function detected"
```

### Integration with CI/CD Pipelines

#### GitLab CI Integration
```yaml
# .gitlab-ci.yml
stages:
  - security

github_security_scan:
  stage: security
  script:
    - gh workflow run dependency-security.yml
    - gh workflow run sast-security.yml
    - gh workflow run infrastructure-security.yml
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

#### Jenkins Integration
```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Security Scan') {
            parallel {
                stage('Dependency Security') {
                    steps {
                        sh 'gh workflow run dependency-security.yml --ref $BRANCH_NAME'
                    }
                }
                stage('SAST Security') {
                    steps {
                        sh 'gh workflow run sast-security.yml --ref $BRANCH_NAME'
                    }
                }
                stage('Infrastructure Security') {
                    steps {
                        sh 'gh workflow run infrastructure-security.yml --ref $BRANCH_NAME'
                    }
                }
            }
        }
    }
}
```

#### Azure DevOps Integration
```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
      - develop

stages:
- stage: SecurityScan
  jobs:
  - job: GitHubSecurity
    steps:
    - task: GitHubCLI@0
      inputs:
        command: 'workflow run dependency-security.yml'
    - task: GitHubCLI@0
      inputs:
        command: 'workflow run sast-security.yml'
    - task: GitHubCLI@0
      inputs:
        command: 'workflow run infrastructure-security.yml'
```

### Enterprise Features

#### Multi-Repository Management
```yaml
# Organization-level workflow template
name: Enterprise Security Scan
on:
  repository_dispatch:
    types: [security-scan]

jobs:
  scan-repositories:
    strategy:
      matrix:
        repo: ${{ fromJson(github.event.client_payload.repositories) }}
    steps:
      - name: Trigger Security Scan
        run: |
          gh workflow run security-scan.yml \
            --repo ${{ matrix.repo }} \
            --ref main
```

#### Compliance Reporting
```yaml
# Generate compliance reports
- name: Generate Compliance Report
  run: |
    python3 - << 'EOF'
    import json
    import datetime
    
    # Collect security scan results
    compliance_report = {
        "report_date": datetime.datetime.now().isoformat(),
        "repository": "${{ github.repository }}",
        "compliance_frameworks": ["SOC2", "PCI", "NIST"],
        "scan_results": {
            "dependency_security": {
                "status": "passed",
                "vulnerabilities": 0,
                "compliance_score": 100
            },
            "sast_analysis": {
                "status": "passed",
                "issues": 2,
                "compliance_score": 95
            },
            "infrastructure_security": {
                "status": "passed",
                "misconfigurations": 0,
                "compliance_score": 100
            }
        },
        "overall_score": 98.3,
        "recommendations": [
            "Address remaining SAST findings",
            "Implement additional security controls"
        ]
    }
    
    with open('compliance-report.json', 'w') as f:
        json.dump(compliance_report, f, indent=2)
    EOF
```

#### Security Metrics API
```yaml
# Expose security metrics via API
- name: Publish Security Metrics
  run: |
    curl -X POST "${{ secrets.METRICS_API_ENDPOINT }}" \
      -H "Authorization: Bearer ${{ secrets.METRICS_API_TOKEN }}" \
      -H "Content-Type: application/json" \
      -d '{
        "repository": "${{ github.repository }}",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
        "metrics": {
          "vulnerabilities_found": 0,
          "issues_resolved": 5,
          "compliance_score": 98.3,
          "scan_duration": 1800
        }
      }'
```

---

## 📚 Additional Resources

### Documentation Links
- [GitHub Actions Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [GitHub Security Features](https://docs.github.com/en/code-security)
- [OWASP DevSecOps Guidelines](https://owasp.org/www-project-devsecops-guideline/)

### Tool Documentation
- [Semgrep Rules](https://semgrep.dev/rules)
- [CodeQL Documentation](https://codeql.github.com/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Checkov Documentation](https://www.checkov.io/2.Basics/CLI%20Command%20Reference.html)

### Community Resources
- [Security Workflow Examples](https://github.com/github/super-linter)
- [DevSecOps Community](https://www.devsecops.org/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

*This integration guide provides comprehensive coverage for implementing enterprise-grade security workflows. For additional support, consult the individual tool documentation or reach out to your security team.*
