# Link Maintenance Guide

## Overview
This document outlines the practices for maintaining links in the PM Tools Templates repository.

## Link Quality Standards

### Current Status
- **Link Health Score:** Run `./analyze-all-links.sh` to get current score
- **Target:** Maintain >95% link health score
- **Review Frequency:** Weekly automated checks, monthly manual reviews

## Link Types & Standards

### Internal Links (Preferred)
```markdown
✅ Good: [Project Charter](../../project-lifecycle/01-initiation/project-charter/)
✅ Good: [Risk Management](../risk-management/)
❌ Avoid: [Project Charter](https://github.com/org/repo/tree/main/project-lifecycle/01-initiation/project-charter/)
```

### External Links
```markdown
✅ Good: [Traditional Guide 7th Edition (2021)](https://www.pmi.org/traditional-guide-standards)
❌ Avoid: [Traditional Guide](https://www.pmi.org/traditional-guide-standards)
```

## Directory Structure Rules

### README.md Requirements
- Every directory MUST have a README.md file
- README.md files MUST include navigation links to subdirectories
- Use consistent heading structure

### Naming Conventions
- Use kebab-case for directories: `project-lifecycle`, `risk-management`
- Use descriptive names that won't change
- Avoid version numbers in directory names

## Link Checking Process

### Automated Checks
```bash
# Run full link analysis
./analyze-all-links.sh

# Quick check for specific directory
./test-one-file.sh path/to/README.md
```

### Manual Review Process
1. **Weekly:** Review link checker results
2. **Before major releases:** Full manual link review
3. **When restructuring:** Update all affected links

## Common Link Issues & Solutions

### Issue: Template File Links
**Problem:** README files link to template files that don't exist
```markdown
❌ [Template](template-file.md)  # File doesn't exist
```

**Solution:** Create placeholder templates or remove links
```markdown
✅ [Template](template-file.md)  # After creating the file
✅ Coming soon: Template file    # If not ready yet
```

### Issue: Cross-Section Links
**Problem:** Links between major sections break when restructuring
```markdown
❌ [Business Suite](../../business-stakeholder-suite/specific-feature/)
```

**Solution:** Use directory-level links when possible
```markdown
✅ [Business Stakeholder Suite](../../business-stakeholder-suite/)
```

### Issue: External Link Rot
**Problem:** External links become invalid over time

**Solution:** Regular external link validation
```bash
# Check external links monthly
curl -I "https://external-site.com/resource" --fail
```

## Best Practices

### When Creating New Content
1. Create directory structure first
2. Add README.md files to all directories
3. Use relative links for internal references
4. Test links before committing

### When Restructuring
1. Plan link impact assessment
2. Update links systematically
3. Use search/replace for bulk updates
4. Run link checker before and after

### When Removing Content
1. Search for incoming links to content being removed
2. Update or remove referring links
3. Consider adding redirects for important content

## Tools & Automation

### Link Checking Scripts
- `analyze-all-links.sh` - Comprehensive link analysis
- `check-links.sh` - Detailed broken link reporting
- `test-one-file.sh` - Single file testing

### CI/CD Integration
Consider adding to GitHub Actions:
```yaml
- name: Check Links
  run: ./analyze-all-links.sh
- name: Fail on low link health
  run: |
    HEALTH=$(./analyze-all-links.sh | grep "Link Health Score" | grep -o '[0-9]*%' | tr -d '%')
    if [ "$HEALTH" -lt 95 ]; then exit 1; fi
```

## Maintenance Schedule

### Daily
- Automated link checking in CI/CD

### Weekly
- Review link checker reports
- Fix critical broken links (missing README files)

### Monthly
- Full manual link review
- External link validation
- Update this maintenance guide

### Quarterly
- Link strategy review
- Tool and process improvements
- Training updates for contributors

## Metrics & Monitoring

### Key Performance Indicators
- **Link Health Score:** Target >95%
- **Broken Link Discovery Time:** <24 hours
- **Broken Link Resolution Time:** <1 week
- **External Link Validity:** >98%

### Reporting
- Weekly automated reports
- Monthly trend analysis
- Quarterly link maintenance review

## Contributing Guidelines

### For Contributors
1. Always test links in your content
2. Use relative links for internal references
3. Include descriptive link text
4. Run link checker before submitting PRs

### For Reviewers
1. Verify all links in new content
2. Check that new directories have README.md files
3. Ensure link formatting follows standards
4. Run link checker on changed areas

## Emergency Procedures

### High-Priority Link Failures
1. **Missing critical navigation:** Fix within 4 hours
2. **Broken external links:** Update within 1 week
3. **Template file links:** Create placeholder within 2 days

### Bulk Link Failures (after restructuring)
1. Assess scope of impact
2. Prioritize by content importance
3. Fix systematically, highest priority first
4. Communicate timeline to users

---

**Last Updated:** [Current Date]
**Next Review:** [Monthly Review Date]
**Owner:** Documentation Team

