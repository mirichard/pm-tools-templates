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

## 🌿 Branching Strategy

### Branch Creation
- Create branches from `develop`
- Use naming convention: `feat/<ticket-id>-slug`, `fix/<ticket-id>-slug`, or `chore/<task>`

### Workflow
1. Push immediately and open a Draft PR to `develop`
2. Ensure CI passes
3. Squash-merge; branch auto-deletes
4. Nightly job promotes `develop` → `staging` → `main`

> **Note:** as of 2026-09-21, `develop` had drifted thousands of commits
> behind `main`, and at least one active PR (#1287, this CI-infrastructure
> work) was retargeted to `main` directly for that reason, at the
> maintainer's direction. That is a stated exception for that PR, not a
> change to the policy above — new contributions should still branch from
> and target `develop` unless a maintainer says otherwise. If `develop` stays
> the primary integration branch going forward, it should be resynced with
> `main`; if `main`-targeting becomes the norm instead, this section should
> be rewritten rather than left inconsistent with actual practice.

## 🚀 Submission Process

### Step 1: Prepare Your Contribution

1. **Fork the Repository**
   ```bash
   gh repo fork mirichard/pm-tools-templates
   cd pm-tools-templates
   ```

2. **Create a Feature Branch from Develop**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/your-template-name
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

### For Code / Sub-App Contributors

This repo's CI is internal infrastructure for contributors and maintainers — it
has no effect on template content or the docs site's user-facing behavior.

**Runtime:** Node 24 (current Active LTS) for every sub-app's CI checks and for
the Q3 2025 template-selector Docker image. Use the same
version locally (`nvm use 24` or equivalent) to reproduce a CI result.

**What CI covers, and how:** `.github/ci-coverage.json` is the single source
of truth for which code projects get checked, what each one's real
lint/build/test/audit commands are, and any currently-tolerated, tracked
exception for a known pre-existing failure (each exception links to a GitHub
issue and has an expiry date — it does not exempt unrelated new failures in
that check). `scripts/ci-coverage.mjs` and `scripts/run-app-check.mjs`
consume that file; nothing about app coverage is duplicated in workflow YAML.

**Running a check locally**, from the repo root — install the app's own
dependencies first (`npm ci` in the app directory itself; `run-app-check.mjs`
does not do this for you, unlike CI's separate install step):
```bash
npm ci --prefix <app-directory>
node scripts/run-app-check.mjs <app-key> <lint|build|test|audit>
# e.g.
npm ci --prefix dashboard-mvp
node scripts/run-app-check.mjs dashboard-mvp test
```
`node scripts/ci-coverage.mjs list-apps` prints every valid app key;
`node scripts/ci-coverage.mjs app-path <app-key>` prints its directory.

**Interpreting a result:** `passed` and `failed` mean what they say.
`waived` means the check cannot execute meaningfully at all (a missing
config file, a missing module, etc.) — it does not claim to protect against
any other regression in that check, only that this specific, already-known,
whole-command failure is expected. `tolerated` means a genuinely
independent, per-test failure matched a specific permitted set recorded in
`ci-coverage.json` — any failure outside that exact set is treated as real.
Both are tied to a linked issue with an expiry date (the thing to actually
go fix, and removed once it's fixed); any failure that doesn't match its
recorded exception is treated as real and fails CI regardless of an
exception being present. `not_implemented` means no real check exists yet
for that app/check pair; it is never silently counted as passing.

**Adding a new sub-app:** every `package.json` **tracked in git** (found via
`git ls-files`, so an untracked file won't be seen — stage it first) must be
reconciled in `.github/ci-coverage.json` — added to `apps` with its real
check commands, pointed at existing coverage in `covered_elsewhere` if
another workflow already checks it, or listed in `excluded` with a reason.
`node_modules` is excluded categorically regardless of tracking status.
`node scripts/ci-coverage.mjs validate-inventory` runs on every PR and fails
if a new manifest is unaccounted for, or if the contract itself is
malformed (missing exception fields, bad dates, duplicate paths); run it
locally before opening a PR that adds a new sub-app or exception.

**Fork PRs:** these workflows use only the default `GITHUB_TOKEN` (scoped
read-only per job — see `permissions:` in `.github/workflows/ci.yml`) and no
repository secrets, so a fork's automatically-reduced token is sufficient to
run every check. GitHub's own first-time-contributor gate still applies (a
maintainer must approve a first-time contributor's workflow run before it
executes), and Dependabot PRs run under GitHub's separate, similarly
restricted default token — see [GitHub's docs on workflows in forked
repositories](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflows-in-forked-repositories).

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
