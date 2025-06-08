# Contributing to PM Tools & Templates

**Welcome to the PM Tools & Templates community!** 🎉

We're excited to have you contribute to the leading open-source project management template library. This guide will help you contribute safely and effectively.

## 🔒 Security First

**Before contributing, please read our [Security Policy](SECURITY.md) and [Code of Conduct](CODE_OF_CONDUCT.md)**

### Security Checklist for Contributors

- [ ] ✅ No real credentials, API keys, or sensitive data included
- [ ] ✅ All example data uses placeholders (e.g., `[YOUR_API_KEY]`)
- [ ] ✅ No personal information in templates or examples
- [ ] ✅ External links verified as safe and appropriate
- [ ] ✅ Content appropriate for professional environments
- [ ] ✅ Templates tested before submission

---

## 🚀 Quick Start

### For First-Time Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your contribution
4. **Review our templates** and [Progressive Complexity Guide](docs/getting-started/progressive-complexity.md)
5. **Make your changes** following our guidelines
6. **Test your templates** thoroughly
7. **Submit a pull request** with clear description

### For Experienced Contributors

- Check our [Strategic Issues List](docs/implementation/strategic-issues-list.md) for priority items
- Review [Template Feedback](docs/feedback/template-feedback.md) for improvement opportunities
- Consider contributing to [Community Programs](#community-programs)

---

## 📋 Types of Contributions

### 1. Template Contributions

#### New Templates
- **Original templates** you've created and tested in real projects
- **Industry-specific adaptations** of existing templates
- **Methodology-specific versions** (Agile, Traditional, Hybrid)
- **Role-based specializations** (PM, Scrum Master, Product Owner, etc.)

#### Template Improvements
- **Enhanced existing templates** with additional features
- **Better examples and explanations**
- **Improved formatting and usability**
- **Bug fixes and corrections**

#### Quality Standards for Templates

✅ **Must Have:**
- Clear purpose and usage instructions
- Placeholder data only (no real/sensitive information)
- Professional formatting and appearance
- Tested in real project scenarios
- Compatible with stated software versions
- Proper licensing and attribution

✅ **Should Have:**
- Examples demonstrating usage
- Customization guidance
- Integration instructions with other templates
- Success metrics or validation criteria

✅ **Could Have:**
- Multiple format versions (Excel, Word, PowerPoint)
- Automation features (macros, formulas)
- Advanced customization options
- Industry-specific variations

### 2. Documentation Contributions

#### Getting Started Guides
- **Methodology selection help**
- **Template usage tutorials**
- **Best practice guides**
- **Common pitfalls and solutions**

#### Process Documentation
- **Implementation guides**
- **Integration instructions**
- **Troubleshooting guides**
- **FAQ updates**

#### Examples and Case Studies
- **Success stories** (anonymized)
- **Before/after comparisons**
- **Industry-specific examples**
- **Lessons learned**

### 3. Community Contributions

#### Content Review and Testing
- **Template testing and validation**
- **Documentation review**
- **Quality assurance**
- **Accessibility testing**

#### Community Support
- **Answering questions** in discussions
- **Helping new contributors**
- **Mentoring and guidance**
- **Community event participation**

#### Translation and Localization
- **Template translations**
- **Documentation translations**
- **Cultural adaptations**
- **Regional compliance guidance**

---

## 📁 Repository Structure

Understand our organization following user preference rules for methodology-focused structure:

```
pm-tools-templates/
├── quick-start-kits/           # Beginner-friendly template bundles
├── project-lifecycle/          # Universal project phases
├── role-based-toolkits/        # Curated collections by role
├── business-stakeholder-suite/ # Executive-ready tools
├── methodology-frameworks/     # PMBOK, Agile, Hybrid approaches
├── industry-specializations/   # Industry-specific adaptations
├── integration-toolkits/       # Tool integration guides
├── organizational-frameworks/  # Change management and training
└── docs/                      # Documentation and guides
```

### Where to Add Your Contribution

| Contribution Type | Location | Notes |
|-------------------|----------|-------|
| **Beginner Template** | `quick-start-kits/` | Simple, easy-to-use templates |
| **Universal Template** | `project-lifecycle/` | Methodology-agnostic |
| **Role-Specific Template** | `role-based-toolkits/` | For specific PM roles |
| **Executive Template** | `business-stakeholder-suite/` | Business stakeholder focus |
| **Methodology Template** | `methodology-frameworks/` | Specific to PMBOK/Agile/Hybrid |
| **Industry Template** | `industry-specializations/` | Industry-specific adaptations |
| **Integration Guide** | `integration-toolkits/` | Tool integration instructions |
| **Process Guide** | `organizational-frameworks/` | Change management, training |
| **Documentation** | `docs/` | Guides, tutorials, references |

---

## 🔧 Development Setup

### Prerequisites

- **Git** installed and configured
- **GitHub account** with 2FA enabled
- **Text editor** with Markdown support
- **Office software** (for template testing)

### Local Development

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/pm-tools-templates.git
cd pm-tools-templates

# 3. Add upstream remote
git remote add upstream https://github.com/mirichard/pm-tools-templates.git

# 4. Create a feature branch
git checkout -b feature/your-contribution-name

# 5. Make your changes
# (Edit files, add templates, update documentation)

# 6. Test your changes
# (Open templates, verify formatting, test functionality)

# 7. Commit your changes
git add .
git commit -m "Add: Description of your contribution"

# 8. Push to your fork
git push origin feature/your-contribution-name

# 9. Create a Pull Request on GitHub
```

### Branch Naming Conventions

- **feature/template-name** - New templates
- **improvement/existing-template** - Template improvements
- **docs/section-name** - Documentation updates
- **fix/issue-description** - Bug fixes
- **security/vulnerability-fix** - Security-related fixes

---

## 📝 Submission Guidelines

### Pull Request Process

#### 1. Pre-Submission Checklist

- [ ] **Security Review**: No sensitive data included
- [ ] **Quality Check**: Template meets our standards
- [ ] **Testing**: Template tested in target software
- [ ] **Documentation**: Clear usage instructions provided
- [ ] **Formatting**: Consistent with repository style
- [ ] **Licensing**: Proper attribution and licensing
- [ ] **Links**: All external links verified

#### 2. Pull Request Template

When creating a pull request, include:

```markdown
## Description
[Brief description of your contribution]

## Type of Contribution
- [ ] New template
- [ ] Template improvement
- [ ] Documentation update
- [ ] Bug fix
- [ ] Security fix

## Template Information (if applicable)
- **Template Name**: 
- **Target Role**: 
- **Methodology**: 
- **Industry**: 
- **Complexity Level**: Beginner/Intermediate/Advanced
- **Software Requirements**: 

## Testing Performed
- [ ] Template opens correctly in target software
- [ ] All formulas/macros function properly
- [ ] Examples are clear and helpful
- [ ] No sensitive data included
- [ ] Links verified and appropriate

## Documentation
- [ ] Usage instructions provided
- [ ] Examples included
- [ ] Integration guidance (if applicable)
- [ ] Customization notes

## Security Verification
- [ ] No real credentials or API keys
- [ ] All example data uses placeholders
- [ ] No personal information included
- [ ] External links verified as safe
- [ ] Content appropriate for professional use

## Additional Notes
[Any additional information reviewers should know]
```

#### 3. Review Process

1. **Automated Checks**: Security scanning and format validation
2. **Community Review**: Fellow contributors provide feedback
3. **Maintainer Review**: Core team technical and security review
4. **Testing**: Independent testing of templates and instructions
5. **Approval**: Final approval and merge

**Timeline**: Most pull requests are reviewed within 7 days

### Commit Message Guidelines

Use clear, descriptive commit messages:

```
# Format
<type>: <short description>

<longer description if needed>

# Types
Add: New template or feature
Improve: Enhancement to existing template
Fix: Bug fix or correction
Docs: Documentation update
Security: Security-related change
Style: Formatting or style change
Refactor: Code reorganization
Test: Adding or updating tests
```

**Examples:**
```
Add: SAFe Program Increment planning template

Improve: Enhanced stakeholder register with RACI matrix

Fix: Corrected formula error in budget tracking template

Docs: Updated getting started guide with security checklist

Security: Removed example API keys from integration guide
```

---

## 🛡️ Security Guidelines

### Template Security

#### ✅ Safe Practices
- Use placeholder text: `[YOUR_API_KEY]`, `[PROJECT_NAME]`
- Example emails: `example@company.com`, `user@domain.com`
- Generic company names: `Acme Corp`, `Example Industries`
- Fake phone numbers: `(555) 123-4567`
- Test IP addresses: `192.0.2.1` (reserved for documentation)

#### ❌ Unsafe Practices
- Real API keys or credentials
- Actual email addresses or phone numbers
- Real company or personal names
- Proprietary information or trade secrets
- Copyrighted content without permission

### Content Security

#### External Links
- **Verify all URLs** before including
- **Use HTTPS** when available
- **Avoid shortened URLs** (bit.ly, tinyurl)
- **Link to official sources** when possible
- **Include link descriptions** for context

#### File Security
- **Scan files** for malware before submission
- **Remove metadata** from Office documents
- **Avoid macros** unless absolutely necessary
- **Test in sandbox** environment first

### Privacy Protection

#### Personal Information
- **Never include** real personal data
- **Use fictional names** consistently
- **Avoid identifying information**
- **Respect contributor privacy**

#### Organizational Information
- **No proprietary methods** or trade secrets
- **Generic examples** only
- **Avoid competitor references**
- **Respect NDAs** and confidentiality

---

## 🎯 Quality Standards

### Template Quality Criteria

#### Technical Quality
- **Functionality**: All features work as intended
- **Compatibility**: Works in stated software versions
- **Performance**: Loads quickly and responds well
- **Reliability**: Consistent behavior across uses
- **Maintainability**: Easy to update and modify

#### Content Quality
- **Accuracy**: Information is correct and current
- **Completeness**: All necessary elements included
- **Clarity**: Easy to understand and follow
- **Relevance**: Meets stated purpose and audience
- **Professionalism**: Appropriate tone and presentation

#### Usability
- **Ease of Use**: Intuitive interface and workflow
- **Documentation**: Clear instructions and examples
- **Accessibility**: Usable by people with disabilities
- **Customization**: Easy to adapt for specific needs
- **Integration**: Works well with other templates

### Review Criteria

Templates are evaluated on:

| Criteria | Weight | Description |
|----------|--------|-------------|
| **Functionality** | 25% | Does it work correctly? |
| **Security** | 25% | Is it safe to use and share? |
| **Usability** | 20% | Is it easy to use and understand? |
| **Quality** | 15% | Is it professionally presented? |
| **Documentation** | 10% | Are instructions clear and complete? |
| **Innovation** | 5% | Does it offer unique value? |

**Minimum Score**: 80% for acceptance

---

## 🤝 Community Programs

### Recognition Programs

#### Contributor Levels
- **Newcomer**: First contribution
- **Regular**: 5+ accepted contributions
- **Expert**: 15+ contributions + community involvement
- **Maintainer**: Core team member with administrative access

#### Recognition Benefits
- **GitHub badges** and profile recognition
- **Contributor highlights** in release notes
- **Early access** to new features and templates
- **Speaking opportunities** at community events
- **Mentorship opportunities** with newcomers

### Expert Programs

#### Template Reviewers
- **Responsibility**: Review and test submitted templates
- **Requirements**: Proven expertise and 10+ contributions
- **Benefits**: Early access, recognition, influence on roadmap

#### Community Moderators
- **Responsibility**: Help maintain community standards
- **Requirements**: Strong community involvement and judgment
- **Benefits**: Moderation tools, direct communication with maintainers

#### Methodology Experts
- **Responsibility**: Provide expertise on specific methodologies
- **Requirements**: Professional certification and practical experience
- **Benefits**: Input on methodology-specific developments

### Mentorship Program

#### For New Contributors
- **Pairing** with experienced contributors
- **Guidance** on contribution process
- **Support** with first submissions
- **Community integration** assistance

#### For Experienced Contributors
- **Leadership development** opportunities
- **Skill sharing** with others
- **Recognition** for mentoring contributions
- **Network building** within community

---

## 📞 Getting Help

### Support Channels

#### Questions and Discussion
- **GitHub Discussions**: General questions and community chat
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Check [docs/](docs/) for guides and FAQs

#### Direct Support
- **Community Help**: [help@pm-tools-templates.org]
- **Security Issues**: [security@pm-tools-templates.org] (private)
- **Code of Conduct**: [conduct@pm-tools-templates.org]

### Common Questions

#### "Where should I put my template?"
Use our [Template Selector](docs/getting-started/template-selector.md) or check the [Repository Structure](#repository-structure) guide.

#### "How do I test my template?"
1. Open in target software (Excel, Word, PowerPoint)
2. Test all functionality (formulas, formatting, etc.)
3. Have someone else try using it
4. Check for any error messages or issues

#### "What if my template uses proprietary software?"
That's fine! Just clearly document:
- Required software and versions
- License requirements
- Alternative open-source options (if available)

#### "Can I contribute templates from my workplace?"
Only if:
- You have explicit permission from your employer
- Templates contain no proprietary information
- Content is appropriate for public sharing
- You comply with any relevant NDAs or policies

#### "How do I handle feedback on my contribution?"
- **Be responsive** to reviewer comments
- **Ask questions** if feedback is unclear
- **Make requested changes** promptly
- **Thank reviewers** for their time and input

---

## 📜 Legal and Licensing

### License Agreement

By contributing to this repository, you agree that:

1. **Your contributions** are your original work or you have rights to share them
2. **You grant** the project a perpetual, irrevocable license to use your contributions
3. **You understand** contributions become part of the open-source project
4. **You comply** with all applicable laws and regulations

### Intellectual Property

#### What You Can Contribute
- **Original work** you created
- **Modifications** of existing open-source templates
- **Public domain** content
- **Properly licensed** third-party content

#### What You Cannot Contribute
- **Copyrighted material** without permission
- **Proprietary templates** from employers
- **Trade secrets** or confidential information
- **Patented methods** without proper licensing

### Attribution

- **Original authors** will be credited in template documentation
- **Significant contributors** recognized in project acknowledgments
- **Modification history** maintained in version control
- **License information** preserved with all content

---

## 🔄 Maintenance and Updates

### Template Lifecycle

1. **Submission**: Initial contribution and review
2. **Acceptance**: Merged into repository
3. **Maintenance**: Regular updates and improvements
4. **Evolution**: Enhanced based on user feedback
5. **Retirement**: Deprecated if no longer relevant

### Update Process

#### Regular Updates
- **Bug fixes** as discovered
- **Feature enhancements** based on feedback
- **Compatibility updates** for new software versions
- **Security improvements** as needed

#### Community Involvement
- **Feedback collection** through various channels
- **User testing** of updates
- **Community voting** on major changes
- **Contributor input** on roadmap priorities

---

## 🎉 Welcome to the Community!

Thank you for your interest in contributing to the PM Tools & Templates project! Your contributions help thousands of project managers worldwide improve their practice and deliver better outcomes.

### Next Steps

1. **Read** our [Security Policy](SECURITY.md) and [Code of Conduct](CODE_OF_CONDUCT.md)
2. **Explore** the repository and understand our structure
3. **Choose** your first contribution opportunity
4. **Join** our community discussions
5. **Start contributing** and help build the future of project management!

### Stay Connected

- **GitHub**: Watch this repository for updates
- **Discussions**: Participate in community conversations
- **Issues**: Help solve problems and add features
- **Reviews**: Provide feedback on contributions

**Happy contributing!** 🚀

---

*This contributing guide is a living document. If you have suggestions for improvement, please let us know!*

**Last Updated**: June 2025  
**Next Review**: December 2025

