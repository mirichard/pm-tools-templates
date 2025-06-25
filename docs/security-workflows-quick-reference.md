# 🚀 Security Workflows Quick Reference

Fast reference guide for common security workflow tasks and configurations.

## 📋 Quick Setup Checklist

### ✅ Installation (5 minutes)
```bash
# 1. Copy workflow files
mkdir -p .github/workflows
cp *.yml .github/workflows/

# 2. Commit and push
git add .github/workflows/
git commit -m "Add security workflows"
git push origin main

# 3. Verify in GitHub Actions tab
```

### ✅ Essential Configuration
```yaml
# Repository Settings → Actions → General
permissions:
  contents: read
  security-events: write
  actions: read
  pull-requests: write
  issues: write
```

## 🔧 Common Configuration Changes

### Adjust Severity Thresholds
```yaml
# In each workflow file, modify env section:
env:
  VULNERABILITY_THRESHOLD: 'high'        # dependency-security.yml
  SECURITY_SEVERITY_THRESHOLD: 'high'   # sast-security.yml  
  SEVERITY_THRESHOLD: 'high'            # infrastructure-security.yml
```

### Change Schedule Timing
```yaml
# Modify cron schedules:
schedule:
  - cron: '0 6 * * 1'    # Weekly Monday 6 AM UTC (dependency)
  - cron: '0 2 * * *'    # Daily 2 AM UTC (SAST)
  - cron: '0 3 * * *'    # Daily 3 AM UTC (infrastructure)
```

### Add Branch Filters
```yaml
# Add to 'on' section:
push:
  branches: [main, develop, staging]
pull_request:
  branches: [main, develop]
```

## 🎯 Manual Triggers

### Run All Security Scans
```bash
# Via GitHub CLI
gh workflow run dependency-security.yml
gh workflow run sast-security.yml
gh workflow run infrastructure-security.yml

# Via GitHub Web UI
Actions → Choose workflow → Run workflow
```

### Custom Scan Options
```bash
# Dependency scan with specific type
gh workflow run dependency-security.yml -f scan_type=vulnerability-only

# SAST with experimental rules
gh workflow run sast-security.yml -f include_experimental=true

# Infrastructure scan for specific component
gh workflow run infrastructure-security.yml -f scan_scope=terraform-only
```

## 🔍 Workflow Status & Results

### Check Workflow Status
```bash
# List recent workflow runs
gh run list --workflow=dependency-security.yml

# View specific run
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

### View Security Results
- **GitHub Security Tab**: Repository → Security → Code scanning alerts
- **Workflow Artifacts**: Actions → Workflow run → Artifacts
- **PR Comments**: Automatic comments on pull requests

## ⚙️ Environment-Specific Configs

### Development Environment
```yaml
# .github/workflows/dev-security.yml
on:
  pull_request:
    branches: [develop]
env:
  VULNERABILITY_THRESHOLD: 'low'
  SECURITY_SEVERITY_THRESHOLD: 'low'
  SEVERITY_THRESHOLD: 'low'
  QUICK_SCAN: 'true'
```

### Production Environment
```yaml
# .github/workflows/prod-security.yml
on:
  push:
    branches: [main]
env:
  VULNERABILITY_THRESHOLD: 'critical'
  SECURITY_SEVERITY_THRESHOLD: 'high'
  SEVERITY_THRESHOLD: 'high'
  BLOCK_ON_CRITICAL: 'true'
```

## 🚨 Troubleshooting Quick Fixes

### Workflow Won't Start
```bash
# Check file locations
ls -la .github/workflows/

# Validate YAML syntax
yamllint .github/workflows/*.yml

# Check branch protection rules
gh api repos/:owner/:repo/branches/main/protection
```

### Permission Errors
```yaml
# Add to workflow file:
permissions:
  contents: read
  security-events: write
  actions: read
  pull-requests: write
  issues: write
  checks: write
```

### Tool Installation Fails
```yaml
# Add retry logic:
- name: Install Tool with Retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: curl -sSL https://tool-url | bash
```

### Too Many False Positives
```yaml
# Increase thresholds:
env:
  VULNERABILITY_THRESHOLD: 'high'
  SECURITY_SEVERITY_THRESHOLD: 'high'

# Add path exclusions:
paths-ignore:
  - "**/test/**"
  - "**/vendor/**"
  - "**/node_modules/**"
```

## 📊 Integration Patterns

### Sequential Execution
```yaml
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

### Parallel Execution
```yaml
jobs:
  security-analysis:
    strategy:
      matrix:
        workflow: [dependency-security, sast-security, infrastructure-security]
    uses: ./.github/workflows/${{ matrix.workflow }}.yml
```

### Conditional Execution
```yaml
jobs:
  changes:
    outputs:
      dependencies: ${{ steps.changes.outputs.dependencies }}
      code: ${{ steps.changes.outputs.code }}
      infrastructure: ${{ steps.changes.outputs.infrastructure }}
    steps:
      - uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            dependencies: ['**/package*.json', '**/requirements*.txt']
            code: ['**/*.js', '**/*.py', '**/*.java']
            infrastructure: ['**/*.tf', '**/Dockerfile*', '**/*.yaml']

  dependency-security:
    needs: changes
    if: needs.changes.outputs.dependencies == 'true'
    uses: ./.github/workflows/dependency-security.yml
```

## 🔔 Notification Setup

### Slack Integration
```yaml
# Add to workflow summary jobs:
- name: Slack Notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    channel: '#security-alerts'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications
```yaml
# Repository Settings → Notifications
# Enable: Actions workflow notifications
```

### Teams Integration
```yaml
- name: Teams Notification
  if: failure()
  uses: skitionek/notify-microsoft-teams@master
  with:
    webhook_url: ${{ secrets.TEAMS_WEBHOOK }}
```

## 📈 Performance Optimization

### Enable Caching
```yaml
- name: Cache Security Tools
  uses: actions/cache@v3
  with:
    path: |
      /usr/local/bin/semgrep
      /usr/local/bin/trivy
      ~/.npm
    key: security-tools-${{ runner.os }}-v1
```

### Path Filtering
```yaml
on:
  pull_request:
    paths:
      - '**/*.js'
      - '**/*.py'
      - '**/*.tf'
      - '!**/test/**'
      - '!**/docs/**'
```

### Timeout Configuration
```yaml
env:
  SEMGREP_TIMEOUT: 1800   # 30 minutes
  CODEQL_TIMEOUT: 3600    # 60 minutes
  TRIVY_TIMEOUT: 1200     # 20 minutes
```

## 🔐 Security Best Practices

### Minimal Permissions
```yaml
permissions:
  contents: read          # Read code only
  security-events: write  # Write security findings
  pull-requests: write    # Comment on PRs
  issues: write          # Create issues
  # Never use: write-all
```

### Secret Management
```yaml
steps:
  - name: Configure Tool
    env:
      API_KEY: ${{ secrets.TOOL_API_KEY }}
    run: |
      # ✅ Good: Use environment variable
      tool configure --api-key="$API_KEY"
      
      # ❌ Bad: Never echo secrets
      # echo "API key: $API_KEY"
```

### Input Validation
```yaml
- name: Validate Inputs
  run: |
    if [[ ! "${{ inputs.severity }}" =~ ^(low|medium|high|critical)$ ]]; then
      echo "Invalid severity level"
      exit 1
    fi
```

## 📋 Monitoring Checklist

### Daily Checks
- [ ] Review security alerts in GitHub Security tab
- [ ] Check failed workflow runs
- [ ] Review dependency vulnerability reports

### Weekly Checks
- [ ] Review compliance reports
- [ ] Update security thresholds if needed
- [ ] Check tool version updates

### Monthly Checks
- [ ] Review security metrics trends
- [ ] Update team security training
- [ ] Review and update suppression lists

## 🔗 Quick Links

### GitHub Repository Settings
- **Actions**: Settings → Actions → General
- **Security**: Settings → Security & analysis
- **Branches**: Settings → Branches

### Security Resources
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CIS Benchmarks**: https://www.cisecurity.org/cis-benchmarks/
- **NIST Framework**: https://www.nist.gov/cyberframework

### Tool Documentation
- **Semgrep**: https://semgrep.dev/docs/
- **CodeQL**: https://codeql.github.com/docs/
- **Trivy**: https://aquasecurity.github.io/trivy/
- **Checkov**: https://www.checkov.io/

---

## 🆘 Emergency Procedures

### Critical Vulnerability Found
1. **Immediate**: Check GitHub Security alerts
2. **Assess**: Review vulnerability details and impact
3. **Prioritize**: Focus on critical and high severity issues
4. **Fix**: Apply patches or updates
5. **Verify**: Re-run security scans
6. **Document**: Update incident response log

### Workflow Completely Broken
1. **Disable**: Temporarily disable failing workflows
2. **Debug**: Check recent changes and error logs
3. **Rollback**: Revert to last known good configuration
4. **Test**: Verify fix in feature branch first
5. **Re-enable**: Gradually re-enable workflows

### False Positive Storm
1. **Immediate**: Increase severity thresholds temporarily
2. **Analyze**: Identify root cause of false positives
3. **Suppress**: Add specific suppressions for false positives
4. **Tune**: Adjust rules and configurations
5. **Monitor**: Watch for similar issues

---

*Keep this reference handy for quick security workflow management!*
