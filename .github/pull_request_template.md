---
title: "Pull Request"
methodology: "universal"
complexity: "basic"
process_group: "universal"
industry: "universal"
role: "pm"
tags:
  - "communication"
  - "quality"
version: "1.1.0"
owner: "mirichard"
updated: "2025-08-11"
estimated_completion_time: "10-20 minutes"
---

# Pull Request

## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New template (new template addition)
- [ ] Template enhancement (improvement to existing template)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Template Changes Checklist
- [ ] YAML front matter is present and complete (`title`, `methodology`, `complexity`, `owner`, `updated`)
- [ ] `updated` field reflects current date (YYYY-MM-DD format)
- [ ] Template follows established naming conventions
- [ ] Content is clear and actionable for project managers
- [ ] All links within the template are valid
- [ ] Template has been tested in a real project scenario (if applicable)

## Governance Advisory Checklist (non-blocking)
Reference templates in docs/governance:
- [ ] Tests passed as applicable (unit/integration/regression)
- [ ] Rollback plan prepared and linked (docs/governance/rollback-plan-template.md)
- [ ] User acceptance evidence linked
- [ ] Documentation updated and linked
- [ ] Change log entry added
- [ ] RCA performed if applicable (docs/governance/rca-template.md)
- [ ] Peer review recorded (docs/governance/peer-review-log.md)
- [ ] Stakeholder notifications captured (docs/governance/stakeholder-comm-plan.md)
- [ ] Security & compliance checks noted (docs/governance/security-compliance-checklist.md)
- [ ] Lessons learned captured (docs/governance/lessons-learned-template.md)

## Testing
- [ ] I have tested these changes locally
- [ ] Template metadata passes linting
- [ ] All existing links still work
- [ ] New content follows repository standards

## Documentation
- [ ] Updated relevant documentation
- [ ] Added/updated examples if needed
- [ ] Verified backward compatibility

## Additional Notes
Any additional information that would be helpful for reviewers.

---

Reminder: This repository is public-facing and intended for templates and tools only. Working notes should be kept outside the repo.
