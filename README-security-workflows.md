# 🔒 Enterprise Security Workflows

**Complete three-phase security analysis system for GitHub repositories with enterprise-grade scanning, reporting, and compliance features.**

![Security Workflow Phases](https://img.shields.io/badge/Phases-3-blue) ![Coverage](https://img.shields.io/badge/Coverage-Dependencies%20%7C%20SAST%20%7C%20Infrastructure-green) ![Languages](https://img.shields.io/badge/Languages-9%2B-orange) ![Tools](https://img.shields.io/badge/Tools-15%2B-red)

## 🎯 Overview

This security workflow system provides comprehensive automated security analysis across three critical phases:

| Phase | Focus Area | Coverage | Key Tools |
|-------|------------|----------|-----------|
| **Phase 1** | Dependencies | Package vulnerabilities, licenses | GitHub Dependency Review, npm audit, Safety, Semgrep |
| **Phase 2** | Source Code | SAST, secrets, code analysis | CodeQL, Semgrep, TruffleHog, Git-secrets |
| **Phase 3** | Infrastructure | IaC, containers, cloud config | Checkov, Terrascan, Trivy, KICS |

## ✨ Key Features

### 🛡️ **Comprehensive Security Coverage**
- **15+ Security Tools** integrated across three phases
- **Multi-language Support** for JavaScript, Python, Java, C#, Go, Ruby, Rust, PHP
- **Infrastructure as Code** security for Terraform, Kubernetes, Docker, Helm
- **Compliance Frameworks** support (CIS, NIST, SOC2, PCI)

### ⚙️ **Smart Automation**
- **Auto-detection** of languages, frameworks, and infrastructure components
- **Intelligent scheduling** with daily/weekly scans
- **Conditional execution** based on file changes
- **Progressive severity** thresholds

### 📊 **Enterprise Reporting**
- **Comprehensive reports** with actionable remediation guidance
- **PR integration** with automatic comments and status checks
- **Security metrics** collection and trending
- **Compliance reporting** for audit trails

### 🔄 **Developer-Friendly Integration**
- **Zero-configuration** setup for most projects
- **PR-based scanning** with immediate feedback
- **Educational content** with security guidance
- **Flexible customization** options

## 🚀 Quick Start

### 1. **Installation** (2 minutes)
```bash
# Copy workflow files to your repository
mkdir -p .github/workflows
cp dependency-security.yml .github/workflows/
cp sast-security.yml .github/workflows/
cp infrastructure-security.yml .github/workflows/

# Commit and activate
git add .github/workflows/
git commit -m "Add enterprise security workflows"
git push origin main
```

### 2. **Verification**
- Navigate to your repository's **Actions** tab
- Verify all three workflows appear in the list
- Watch the first automated run complete successfully

### 3. **Configuration** (Optional)
```yaml
# Adjust security thresholds in workflow files
env:
  VULNERABILITY_THRESHOLD: 'moderate'     # low, moderate, high, critical
  SECURITY_SEVERITY_THRESHOLD: 'medium'  # low, medium, high, critical
  SEVERITY_THRESHOLD: 'medium'           # low, medium, high, critical
```

## 📁 Workflow Files

### Phase 1: Dependency Security (`dependency-security.yml`)
**Automated vulnerability scanning for project dependencies**

```yaml
🔍 What it scans:
├── Node.js packages (package.json, package-lock.json)
├── Python packages (requirements.txt, Pipfile)
├── PHP packages (composer.json)
├── Go modules (go.mod)
└── Rust crates (Cargo.toml)

🛡️ Security tools:
├── GitHub Dependency Review
├── npm audit
├── Safety (Python)
├── pip-audit
├── Semgrep (secrets)
└── TruffleHog (secrets)

⏰ Schedule: Weekly Monday 6 AM UTC + PR triggers
```

### Phase 2: SAST Security (`sast-security.yml`)
**Static application security testing for source code**

```yaml
🔍 What it scans:
├── JavaScript/TypeScript → CodeQL + Semgrep
├── Python → CodeQL + Semgrep
├── Java → CodeQL + Semgrep
├── C# → CodeQL + Semgrep
├── Go → CodeQL + Semgrep
├── Ruby → CodeQL + Semgrep
├── Rust → Semgrep
└── PHP → Semgrep

🛡️ Security tools:
├── GitHub CodeQL (semantic analysis)
├── Semgrep (rule-based SAST)
├── TruffleHog (advanced secrets)
├── Git-secrets (AWS credentials)
├── Hadolint (Dockerfile security)
└── Checkov (container configs)

⏰ Schedule: Daily 2 AM UTC + push/PR triggers
```

### Phase 3: Infrastructure Security (`infrastructure-security.yml`)
**Infrastructure as Code and container security analysis**

```yaml
🔍 What it scans:
├── Terraform → Checkov, Terrascan, TFLint, TFSec
├── Kubernetes → KICS, Kubesec, kubectl validation
├── Docker → Trivy, Hadolint
├── Helm → Security analysis
├── CloudFormation → Checkov, cfn-lint
├── ARM Templates → Security analysis
└── GitHub Actions → Checkov

🛡️ Security tools:
├── Checkov (policy-as-code)
├── Terrascan (IaC analysis)
├── TFLint (Terraform linting)
├── TFSec (Terraform security)
├── Trivy (vulnerability scanning)
├── KICS (infrastructure security)
└── Kubesec (Kubernetes risk analysis)

⏰ Schedule: Daily 3 AM UTC + infrastructure file changes
```

## 🎛️ Manual Control

### Trigger Individual Scans
```bash
# Run specific workflow
gh workflow run dependency-security.yml
gh workflow run sast-security.yml
gh workflow run infrastructure-security.yml

# Run with custom options
gh workflow run dependency-security.yml -f scan_type=vulnerability-only
gh workflow run sast-security.yml -f include_experimental=true
gh workflow run infrastructure-security.yml -f scan_scope=terraform-only
```

### Workflow Dispatch Options

#### Dependency Security Options
- `scan_type`: comprehensive, vulnerability-only, license-only, outdated-packages

#### SAST Security Options
- `analysis_depth`: quick, comprehensive, deep, custom
- `include_experimental`: true/false
- `target_languages`: comma-separated list

#### Infrastructure Security Options
- `scan_scope`: comprehensive, terraform-only, containers-only, kubernetes-only
- `compliance_frameworks`: CIS,NIST,SOC2,PCI
- `severity_threshold`: low, medium, high, critical

## 📊 Results & Reporting

### Automatic Outputs

#### GitHub Security Tab
- **Code scanning alerts** from CodeQL and Semgrep
- **Dependency alerts** from vulnerability scanning
- **Secret scanning alerts** from TruffleHog

#### Pull Request Integration
- **Automated comments** with scan summaries
- **Status checks** for security approval
- **Educational content** for security issues

#### Workflow Artifacts
- **Detailed reports** in Markdown format
- **Raw scan results** in JSON format
- **Compliance reports** for audit trails

### Sample Report Structure
```
📋 Security Reports/
├── 🔒 Dependency Security Report
│   ├── Vulnerability summary
│   ├── License compliance
│   └── Remediation guidance
├── 🔍 SAST Security Report
│   ├── Code analysis results
│   ├── Language coverage matrix
│   └── Security best practices
└── 🏗️ Infrastructure Security Report
    ├── IaC security findings
    ├── Container security analysis
    └── Compliance framework results
```

## ⚙️ Configuration Options

### Environment-Specific Settings

#### Development Environment
```yaml
env:
  VULNERABILITY_THRESHOLD: 'low'
  SECURITY_SEVERITY_THRESHOLD: 'low'
  QUICK_SCAN: 'true'
```

#### Production Environment
```yaml
env:
  VULNERABILITY_THRESHOLD: 'critical'
  SECURITY_SEVERITY_THRESHOLD: 'high'
  BLOCK_ON_CRITICAL: 'true'
```

### Integration Patterns

#### Sequential Execution (Recommended)
```yaml
dependency-security → sast-security → infrastructure-security
```

#### Parallel Execution (Fastest)
```yaml
dependency-security ∥ sast-security ∥ infrastructure-security
```

#### Conditional Execution (Smart)
```yaml
File changes trigger → Relevant workflows only
```

## 🔔 Notifications & Alerting

### Built-in Notifications
- **PR Comments** with scan results
- **GitHub Issues** for critical findings
- **Security Tab** alerts

### External Integrations
- **Slack** notifications
- **Microsoft Teams** alerts
- **Jira** issue creation
- **Email** summaries

## 📈 Performance & Optimization

### Efficiency Features
- **Intelligent caching** of tools and dependencies
- **Path-based filtering** to avoid unnecessary scans
- **Parallel job execution** for faster results
- **Incremental scanning** for large repositories

### Typical Execution Times
| Phase | Small Repo | Medium Repo | Large Repo |
|-------|------------|-------------|------------|
| Dependency | 2-5 min | 5-10 min | 10-15 min |
| SAST | 5-15 min | 15-30 min | 30-60 min |
| Infrastructure | 3-8 min | 8-15 min | 15-25 min |

## 🔧 Troubleshooting

### Common Issues & Quick Fixes

#### Workflow Won't Start
- ✅ Check `.github/workflows/` file location
- ✅ Validate YAML syntax
- ✅ Verify repository permissions

#### Permission Errors
- ✅ Enable security events write permission
- ✅ Check organization settings
- ✅ Verify GITHUB_TOKEN scope

#### Too Many False Positives
- ✅ Increase severity thresholds
- ✅ Add path exclusions for test files
- ✅ Customize rule configurations

### Debug Mode
```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

## 📚 Documentation

### Comprehensive Guides
- **[Integration Guide](docs/security-workflows-integration.md)** - Complete setup and configuration
- **[Quick Reference](docs/security-workflows-quick-reference.md)** - Common tasks and troubleshooting

### Tool Documentation
- [Semgrep Rules](https://semgrep.dev/rules)
- [CodeQL Documentation](https://codeql.github.com/)
- [Trivy Documentation](https://aquasecurity.github.io/trivy/)
- [Checkov Documentation](https://www.checkov.io/)

### Security Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## 🎯 Use Cases

### DevSecOps Integration
- **Shift-left security** with early vulnerability detection
- **Automated compliance** checking for regulatory requirements
- **Security metrics** collection for continuous improvement

### Enterprise Security
- **Multi-repository** deployment across organization
- **Compliance reporting** for SOC2, PCI, NIST frameworks
- **Executive dashboards** with security metrics

### Open Source Projects
- **Community transparency** with public security scanning
- **Contributor education** with security best practices
- **Dependency management** for maintainer awareness

## 📊 Security Metrics

### Key Performance Indicators
- **Vulnerability Detection Rate**: Critical/High issues found per scan
- **Time to Resolution**: Average time to fix security issues
- **Coverage Metrics**: Percentage of code/dependencies scanned
- **Compliance Score**: Adherence to security frameworks

### Reporting Capabilities
- **Daily/Weekly/Monthly** security summaries
- **Trend analysis** for security improvement tracking
- **Compliance dashboards** for audit readiness

## 🤝 Contributing

### Customization Guidelines
1. **Fork** the workflows for your specific needs
2. **Maintain** core security coverage
3. **Document** any custom configurations
4. **Test** thoroughly before deployment

### Best Practices
- **Gradual rollout** across teams/repositories
- **Team training** on security workflow usage
- **Regular review** of security thresholds and rules
- **Incident response** procedures for critical findings

## 📄 License

This security workflow system is provided under the **MIT License**. See individual tool licenses for their respective terms.

## 🆘 Support

### Getting Help
- **Documentation**: Check the comprehensive integration guide
- **Issues**: Create GitHub issues for bugs or feature requests
- **Community**: Join DevSecOps community discussions

### Emergency Response
For critical security vulnerabilities:
1. **Immediate**: Review GitHub Security alerts
2. **Assess**: Determine impact and scope
3. **Fix**: Apply patches or mitigations
4. **Verify**: Re-run security scans
5. **Document**: Update incident logs

---

## 🎉 Getting Started

Ready to enhance your repository security? Start with the [Quick Start](#quick-start) section above, then explore the [comprehensive integration guide](docs/security-workflows-integration.md) for advanced configuration options.

**Your security journey begins with a single commit! 🚀**

---

*Built with ❤️ for secure software development*
