# Security Policy

## Supported Versions

This repository is a continuously updated content library, not a versioned software release. There is no parallel-maintained "old version" branch — the content on `main` is the only supported version. Named releases (e.g. `vNext`, listed under [Releases](https://github.com/mirichard/pm-tools-templates/releases)) mark delivery milestones, not separate maintenance tracks.

Several sub-applications (`dashboard-mvp/`, `web-mvp/`, `analytics-platform/`, etc.) carry their own independent `package.json` versions and dependency trees. A vulnerability in one is scoped and patched within that sub-app and does not imply the same issue exists elsewhere in the repository.

Legacy file paths from the ongoing content reorganization remain reachable per the [domain navigation and legacy-path compatibility policy](docs/domain-navigation-and-legacy-paths.md) — that is a navigation guarantee, not a security-support guarantee for unmaintained code.

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities to us privately:

### How to Report

1. **GitHub Security Advisory (preferred):** Use GitHub's [private vulnerability reporting feature](https://github.com/mirichard/pm-tools-templates/security/advisories/new). It reaches the maintainer directly and keeps the report private until a fix is available.
2. **Email:** If you can't use GitHub, use the security contact listed in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md#community-resources).

### What to Include

Please include the following information in your report:

- **Description:** Clear description of the vulnerability
- **Impact:** Potential impact and affected components
- **Reproduction:** Step-by-step instructions to reproduce
- **Environment:** Operating system, browser, and version details
- **Evidence:** Screenshots, logs, or proof-of-concept code
- **Suggested Fix:** If you have ideas for resolution

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Critical issues within 30 days, others within 90 days
- **Disclosure:** Coordinated disclosure after fix is available

## Security Considerations for Templates

### Template Security Guidelines

#### For Contributors
- **No Sensitive Data:** Never include real credentials, API keys, or personal information
- **Safe Examples:** Use placeholder text like `[YOUR_API_KEY]` or `example@company.com`
- **Code Review:** All templates undergo security review before acceptance
- **Documentation:** Include security considerations in template documentation

#### For Users
- **Review Templates:** Always review templates before using in production
- **Customize Safely:** Replace all placeholder data with actual values
- **Validate Content:** Ensure templates meet your organization's security standards
- **Report Issues:** Report any security concerns immediately

### Common Security Risks

#### Template Content
- **Data Exposure:** Inadvertent inclusion of sensitive information
- **Malicious Content:** Links to harmful websites or resources
- **Social Engineering:** Templates designed to collect sensitive information
- **Compliance Violations:** Content that violates regulatory requirements

#### Repository Security
- **Supply Chain:** Ensuring template integrity and authenticity
- **Access Control:** Proper permissions and review processes
- **Version Control:** Maintaining audit trail of all changes
- **Dependency Security:** Monitoring for vulnerable dependencies

## Security Best Practices

### For Repository Maintainers

1. **Two-Factor Authentication (2FA)**
   - Required for all maintainers
   - Use hardware keys when possible
   - Regular security key rotation

2. **Branch Protection**
   - Require pull request reviews
   - Require status checks
   - Restrict push access to main branch
   - Require signed commits

3. **Dependency Management**
   - Regular dependency updates
   - Security scanning for vulnerabilities
   - Pin dependency versions
   - Monitor security advisories

4. **Access Control**
   - Principle of least privilege
   - Regular access reviews
   - Immediate revocation for departing team members
   - Audit logging for administrative actions

### For Contributors

1. **Secure Development**
   - Keep local systems updated
   - Use secure communication channels
   - Follow coding best practices
   - Verify template content before submission

2. **Authentication**
   - Enable 2FA on GitHub account
   - Use SSH keys for repository access
   - Keep credentials secure and private
   - Regular password updates

3. **Content Security**
   - Review all content for sensitive information
   - Use placeholder data only
   - Validate external links and references
   - Include security warnings where appropriate

## Compliance and Privacy

**This repository is a static content library and does not itself hold ISO 27001, SOC 2, NIST CSF, or GDPR certification.** The points below describe how the *templates* support teams operating under these frameworks — they are not a claim about this project's own security posture.

- Several templates (e.g. in [`industry-specializations/`](industry-specializations/) and [`business-stakeholder-suite/`](business-stakeholder-suite/README.md)) include fields for data classification, consent, and retention that teams can adapt to their own GDPR, ISO 27001, NIST CSF, or SOC 2 programs.
- Templates are a starting point, not legal or compliance advice. Verify applicability with your organization's compliance function before use.

## Security Automation

- **Dependency updates:** [Dependabot](.github/dependabot.yml) checks GitHub Actions, npm, and pip dependencies weekly and opens PRs labeled `security`.
- **Static analysis:** [CodeQL](.github/workflows/codeql.yml) scans JavaScript/TypeScript on every push and pull request. (Python source is not currently covered.)
- **Document and secret scanning:** [`doc-sec-check.yml`](.github/workflows/doc-sec-check.yml) and [`scripts/detect-sensitive.sh`](scripts/detect-sensitive.sh) scan Markdown, scripts, and config files for leaked secrets and internal hostnames on every pull request that touches them; wrap an intentional example in `<!-- doc-sec-allow -->` to bypass a false positive.
- **Additional scans:** [`security-scan.yml`](.github/workflows/security-scan.yml), [`sast-security.yml`](.github/workflows/sast-security.yml), and [`dependency-security.yml`](.github/workflows/dependency-security.yml) run further checks; see each workflow for scope.
- **GitHub Secret Scanning:** enabled at the repository level (a GitHub platform feature, not configured in this repo's own files).

## Incident Response

### Security Incident Types

1. **Data Breach:** Unauthorized access to sensitive information
2. **Malicious Content:** Harmful templates or documentation
3. **Account Compromise:** Unauthorized access to contributor accounts
4. **Supply Chain Attack:** Compromised dependencies or tools

### Response Process

1. **Detection and Analysis**
   - Immediate investigation of reported issues
   - Impact assessment and classification
   - Evidence collection and preservation

2. **Containment**
   - Immediate removal of malicious content
   - Temporary access restrictions if needed
   - Communication to affected users

3. **Recovery**
   - Fix implementation and testing
   - Restoration of normal operations
   - Enhanced monitoring and validation

4. **Post-Incident**
   - Root cause analysis
   - Process improvements
   - Community communication
   - Documentation updates

## Community Security

### Safe Contribution Environment
- **Code of Conduct:** Professional and respectful interactions
- **Moderation:** Active community moderation and support
- **Reporting Mechanisms:** Multiple channels for security concerns
- **Education:** Ongoing security awareness and training

### Trust and Verification
- **Contributor Verification:** Identity verification for regular contributors
- **Content Review:** Multi-level review process for all submissions
- **Reputation System:** Track record of quality contributions
- **Community Feedback:** User ratings and feedback mechanisms

## Acknowledgments

We appreciate the security research community and responsible disclosure. Contributors who report valid security issues will be:

- Acknowledged in our security advisories (with permission)
- Listed in our Hall of Fame
- Eligible for recognition rewards (when program is established)

---

**Last Updated:** September 2026  
**Next Review:** Quarterly

*This security policy is a living document and will be updated as our security posture evolves.*
