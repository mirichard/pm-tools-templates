# Contributing to PM Tools & Templates Library

🎉 **Thank you for your interest in contributing to the PM Tools & Templates Library!** 

This repository serves project managers worldwide, and your contributions help improve project success rates across industries. Whether you're sharing a template that saved your project, suggesting improvements, or reporting issues, every contribution matters.

## 🤝 Ways to Contribute

### 📝 Template Contributions
- **New Templates**: Share proven templates from your projects
- **Template Improvements**: Enhance existing templates with real-world experience
- **Industry Adaptations**: Customize templates for specific industries
- **Tool Integrations**: Add automation or tool-specific versions

### 📚 Documentation
- **Usage Examples**: Add case studies or implementation stories
- **How-to Guides**: Create step-by-step implementation guides
- **Best Practices**: Share lessons learned and success patterns
- **Translation**: Help make templates accessible in other languages

### 🐛 Quality Improvements
- **Bug Reports**: Report broken links, formatting issues, or unclear instructions
- **Accessibility**: Improve template accessibility and usability
- **Testing**: Help validate templates in different project contexts

## 📋 Before You Start

### 1. Check Existing Content
- Browse the [Template Index](docs/getting-started/template-selector.md) to avoid duplicates
- Review open [Issues](https://github.com/mirichard/pm-tools-templates/issues) and [Pull Requests](https://github.com/mirichard/pm-tools-templates/pulls)
- Check our [Repository Status](REPOSITORY_STATUS.md) for ongoing reorganization

### 2. Understand Our Organization
We organize content around **how PMs actually work**:
- **[Project Lifecycle](project-lifecycle/)**: Universal phases, methodology-agnostic
- **[Role-Based Toolkits](role-based-toolkits/)**: Curated for specific PM roles
- **[Business Stakeholder Suite](business-stakeholder-suite/)**: Executive-ready tools
- **[Methodology Frameworks](methodology-frameworks/)**: Deep methodology-specific content

### 3. Follow Our Principles
- **Practical over Perfect**: Templates should work in real projects
- **User-Centric**: Organized by user needs, not theoretical frameworks
- **Methodology-Agnostic**: Core templates work across Agile, Waterfall, and Hybrid
- **Immediately Useful**: No extensive setup or learning curve required

## 📝 Template Contribution Guidelines

### Template Quality Standards

**✅ Good Templates:**
- ✅ **Proven in Practice**: Used successfully in real projects
- ✅ **Clear Purpose**: Obvious when and why to use it
- ✅ **Complete**: All necessary sections and guidance included
- ✅ **Adaptable**: Easy to customize for different contexts
- ✅ **Professional**: Business-ready formatting and language

**❌ Avoid:**
- ❌ **Theoretical Only**: Never tested in real projects
- ❌ **Tool-Specific**: Locked to one specific software platform
- ❌ **Overly Complex**: Requires extensive training to use
- ❌ **Incomplete**: Missing key sections or instructions
- ❌ **Copy-Paste**: Direct copies from other sources without permission

### File Structure Requirements

Each template should include:

```
template-name/
├── README.md              # Template overview and instructions
├── template.docx          # Main template file (if applicable)
├── template.xlsx          # Excel version (if applicable)
├── example-filled.pdf     # Completed example (anonymized)
└── customization-guide.md # How to adapt for different contexts
```

### Content Requirements

**README.md Structure:**
```markdown
# [Template Name]

## Purpose
[What this template accomplishes]

## When to Use
[Project phase, methodology, team size, etc.]

## How to Use
[Step-by-step instructions]

## Customization Options
[How to adapt for different contexts]

## Related Templates
[Links to complementary templates]

## Success Metrics
[How to measure template effectiveness]
```

## 🚀 Submission Process

### Step 1: Prepare Your Contribution

1. **Fork the Repository**
   ```bash
   gh repo fork mirichard/pm-tools-templates
   cd pm-tools-templates
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-template-name
   ```

3. **Choose the Right Location**
   - **New PM Role?** → `role-based-toolkits/[role-name]/`
   - **Project Phase Template?** → `project-lifecycle/[phase]/`
   - **Executive Tool?** → `business-stakeholder-suite/`
   - **Methodology-Specific?** → `methodology-frameworks/[methodology]/`

### Step 2: Create Your Content

1. **Follow Naming Conventions**
   - Use lowercase with hyphens: `risk-register-template`
   - Be descriptive but concise: `stakeholder-communication-plan`
   - Include template type: `project-charter-template`

2. **Test Your Template**
   - Use it in a real or simulated project scenario
   - Get feedback from colleagues or team members
   - Ensure all links and references work

3. **Document Everything**
   - Include clear usage instructions
   - Provide context for when to use the template
   - Add customization guidance
   - Include a filled example (with sensitive data removed)

### Step 3: Submit Your Pull Request

1. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add [template name] for [use case]"
   git push origin feature/your-template-name
   ```

2. **Create Pull Request**
   ```bash
   gh pr create --title "Add [Template Name]" --body "Brief description of the template and its value"
   ```

3. **Include in PR Description:**
   - Template purpose and target audience
   - How you've tested it
   - Any industry-specific considerations
   - Links to related templates or documentation

## 📋 Review Process

### What We Review

**Content Quality:**
- ✅ Clear purpose and usage instructions
- ✅ Professional formatting and language
- ✅ Complete and actionable content
- ✅ Appropriate for target audience

**Technical Quality:**
- ✅ Proper file structure and naming
- ✅ Working links and references
- ✅ Consistent formatting with existing templates
- ✅ No sensitive or proprietary information

**Community Value:**
- ✅ Fills a gap in existing templates
- ✅ Applicable to multiple organizations
- ✅ Follows established best practices
- ✅ Enhances overall library value

### Review Timeline
- **Simple Updates**: 2-3 days
- **New Templates**: 5-7 days
- **Major Additions**: 1-2 weeks

### Feedback and Iteration
We may request changes to:
- Improve clarity or completeness
- Better align with library organization
- Enhance universal applicability
- Fix technical or formatting issues

## 🎯 High-Priority Contribution Areas

### Currently Needed:

**Templates:**
- [ ] Remote team management templates
- [ ] DevOps integration for PM workflows
- [ ] Vendor management and procurement
- [ ] Change management for digital transformation
- [ ] AI/ML project management adaptations

**Documentation:**
- [ ] Industry-specific implementation guides
- [ ] Tool integration tutorials
- [ ] Template combination workflows
- [ ] Scaling guidance for enterprise adoption

**Examples:**
- [ ] Case studies from successful implementations
- [ ] Before/after template effectiveness stories
- [ ] Cross-industry adaptation examples
- [ ] Integration with popular PM tools

## 🔧 Development Setup

### For Documentation Contributors

```bash
# Clone the repository
git clone https://github.com/mirichard/pm-tools-templates.git
cd pm-tools-templates

# Install markdown linting (optional)
npm install -g markdownlint-cli

# Validate your changes
markdownlint .
```

### For Template Contributors

**Required Tools:**
- Microsoft Office or compatible suite (for .docx/.xlsx templates)
- PDF editor for example creation
- Markdown editor for documentation

**Recommended Tools:**
- [Pandoc](https://pandoc.org/) for format conversion
- [Draw.io](https://draw.io/) for diagrams
- [Canva](https://canva.com/) for visual templates

## 📜 Legal and Licensing

### Intellectual Property
- **Original Work**: Contribute only content you've created or have rights to share
- **Attribution**: Credit sources for adapted content (where legally permissible)
- **No Proprietary Content**: Don't include company-specific or confidential information
- **Open Source**: All contributions become part of the MIT-licensed repository

### Content Guidelines
- **Professional Language**: Business-appropriate tone and terminology
- **Inclusive Content**: Accessible to diverse audiences and organizations
- **No Personal Information**: Remove all personal, company, or project-specific data
- **Universal Applicability**: Avoid region-specific legal or regulatory content

## 🆘 Getting Help

### Questions About Contributing?

1. **Check Documentation**: Start with this guide and [Repository Status](REPOSITORY_STATUS.md)
2. **Search Issues**: Look for similar questions in [existing issues](https://github.com/mirichard/pm-tools-templates/issues)
3. **Create an Issue**: Ask questions using our [Question template](https://github.com/mirichard/pm-tools-templates/issues/new/choose)
4. **Join Discussions**: Participate in [GitHub Discussions](https://github.com/mirichard/pm-tools-templates/discussions)

### Support Channels

- **🐛 Bug Reports**: [Create an Issue](https://github.com/mirichard/pm-tools-templates/issues/new)
- **💡 Feature Requests**: [Discussion Board](https://github.com/mirichard/pm-tools-templates/discussions)
- **❓ Questions**: [Q&A Discussions](https://github.com/mirichard/pm-tools-templates/discussions/categories/q-a)
- **🚀 Show and Tell**: [Share Your Success](https://github.com/mirichard/pm-tools-templates/discussions/categories/show-and-tell)

## 🏆 Recognition

### Contributor Recognition

We celebrate contributors through:
- **[Contributors Page](docs/contributors.md)**: Highlighting community members
- **Template Attribution**: Crediting template creators
- **GitHub Stars**: Recommending active contributors for profile recognition
- **Community Spotlights**: Featuring successful implementations

### Hall of Fame

Significant contributors earn recognition for:
- **Template Pioneer**: First to contribute in a new category
- **Quality Champion**: Consistently high-quality submissions
- **Community Helper**: Active in discussions and reviews
- **Documentation Master**: Exceptional documentation contributions

---

## 🎉 Thank You!

Every contribution helps project managers worldwide deliver better outcomes. Whether you're sharing a single template or becoming a regular contributor, you're making a difference in how projects succeed.

**Together, we're building the most comprehensive, practical project management resource library available.**

---

*For questions about this contributing guide, please [create an issue](https://github.com/mirichard/pm-tools-templates/issues/new) or start a [discussion](https://github.com/mirichard/pm-tools-templates/discussions).*

**Happy Contributing! 🚀**
