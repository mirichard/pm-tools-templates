# AGILE GITHUB TEMPLATES

## Repository Setup Templates

### .github/ISSUE_TEMPLATE/epic.md
```markdown
---
name: Epic
about: Large feature or initiative spanning multiple sprints
title: '[EPIC] '
labels: 'epic, needs-triage'
assignees: ''
---

## Epic Overview
**Epic Title:** [Brief, descriptive title]
**Business Value:** [Why is this epic important?]
**Target Audience:** [Who benefits from this epic?]

## Epic Description
[Detailed description of the epic and its business value. Include the problem being solved and the expected outcome.]

## Acceptance Criteria
- [ ] [High-level criterion 1]
- [ ] [High-level criterion 2]
- [ ] [High-level criterion 3]
- [ ] [High-level criterion 4]

## User Stories
*List the user stories that make up this epic. Update as stories are created.*
- [ ] #[issue_number] - [User story title]
- [ ] #[issue_number] - [User story title]
- [ ] #[issue_number] - [User story title]

## Success Metrics
- **Metric 1:** [Description] - Target: [value]
- **Metric 2:** [Description] - Target: [value]
- **Metric 3:** [Description] - Target: [value]

## Dependencies
- **Internal Dependencies:** [Other teams, systems, or features]
- **External Dependencies:** [Third-party services, vendors, etc.]
- **Technical Dependencies:** [Infrastructure, tools, etc.]

## Timeline
- **Estimated Start:** [Sprint/Date]
- **Estimated Completion:** [Sprint/Date]
- **Key Milestones:** [Major checkpoints]

## Risks and Assumptions
**Risks:**
- Risk 1: [Description] - Impact: [High/Medium/Low]
- Risk 2: [Description] - Impact: [High/Medium/Low]

**Assumptions:**
- Assumption 1: [Description]
- Assumption 2: [Description]

## Notes
[Additional context, constraints, research findings, or considerations]
```

### .github/ISSUE_TEMPLATE/user-story.md
```markdown
---
name: User Story
about: Feature request from user perspective
title: '[STORY] As a [user type], I want [functionality] so that [benefit]'
labels: 'story, needs-triage'
assignees: ''
---

## User Story
**As a** [type of user]
**I want** [some goal or functionality]
**So that** [some reason or benefit]

## Acceptance Criteria
*Define specific, testable criteria that must be met for this story to be considered complete.*

- [ ] **Given** [context/precondition], **when** [action], **then** [expected outcome]
- [ ] **Given** [context/precondition], **when** [action], **then** [expected outcome]
- [ ] **Given** [context/precondition], **when** [action], **then** [expected outcome]

## Story Points
**Estimated Effort:** [1, 2, 3, 5, 8, 13, 21]

**Estimation Notes:**
- Complexity: [Simple/Medium/Complex]
- Effort: [Low/Medium/High]
- Risk: [Low/Medium/High]

## Definition of Done
- [ ] Code implemented and follows coding standards
- [ ] Unit tests written and passing
- [ ] Code reviewed and approved
- [ ] Integration tests passing
- [ ] Acceptance criteria verified
- [ ] Documentation updated
- [ ] Feature deployed to staging environment
- [ ] Product Owner acceptance

## Design and Technical Notes
**UI/UX Considerations:**
[Wireframes, mockups, user experience considerations]

**Technical Approach:**
[High-level technical implementation notes]

**API Changes:**
[Any API modifications or new endpoints]

## Testing Notes
**Test Scenarios:**
- Scenario 1: [Description]
- Scenario 2: [Description]

**Edge Cases:**
- Edge case 1: [Description]
- Edge case 2: [Description]

**Browser/Platform Support:**
[Specific browser or platform requirements]

## Dependencies
- **Related Stories:** #[issue] - [description]
- **Technical Dependencies:** [Infrastructure, tools, etc.]
- **External Dependencies:** [Third-party services, etc.]

## Questions and Assumptions
**Questions:**
- Q1: [Question that needs answering]
- Q2: [Question that needs answering]

**Assumptions:**
- A1: [Assumption being made]
- A2: [Assumption being made]
```

### .github/ISSUE_TEMPLATE/bug-report.md
```markdown
---
name: Bug Report
about: Report a defect or issue
title: '[BUG] '
labels: 'bug, needs-triage'
assignees: ''
---

## Bug Summary
**Brief Description:** [One-sentence summary of the bug]
**Severity:** [Critical/High/Medium/Low]
**Priority:** [Critical/High/Medium/Low]

## Environment
- **Browser/Platform:** [Chrome 91, iOS 14.6, etc.]
- **Version:** [Application version]
- **Environment:** [Production/Staging/Development]
- **User Type:** [Admin/Regular User/Guest]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

## Expected Behavior
[Describe what should happen]

## Actual Behavior
[Describe what actually happens]

## Screenshots/Videos
[Attach any relevant screenshots or screen recordings]

## Additional Information
**Error Messages:**
```
[Paste any error messages here]
```

**Console Logs:**
```
[Paste relevant console output here]
```

**Network Activity:**
[Any relevant network requests/responses]

## Impact Assessment
**User Impact:** [How many users are affected?]
**Business Impact:** [Revenue, operations, reputation impact]
**Frequency:** [How often does this occur?]

## Workaround
[Is there a temporary workaround? Describe it here]

## Related Issues
- Related to: #[issue_number]
- Duplicate of: #[issue_number]
- Blocks: #[issue_number]
```

### .github/ISSUE_TEMPLATE/task.md
```markdown
---
name: Task
about: General task or chore not tied to user functionality
title: '[TASK] '
labels: 'task, needs-triage'
assignees: ''
---

## Task Description
[Clear, detailed description of what needs to be done]

## Objective
[Why is this task necessary? What goal does it support?]

## Acceptance Criteria
- [ ] [Specific outcome 1]
- [ ] [Specific outcome 2]
- [ ] [Specific outcome 3]

## Task Category
- [ ] Technical Debt
- [ ] Documentation
- [ ] Infrastructure
- [ ] Process Improvement
- [ ] Research/Investigation
- [ ] Configuration
- [ ] Maintenance
- [ ] Other: [specify]

## Effort Estimate
**Time Required:** [Hours/Days]
**Complexity:** [Simple/Medium/Complex]
**Skills Required:** [List necessary skills or expertise]

## Definition of Done
- [ ] Task completed as described
- [ ] Quality review performed
- [ ] Documentation updated (if applicable)
- [ ] Testing completed (if applicable)
- [ ] Stakeholders notified of completion

## Dependencies
- **Prerequisite Tasks:** #[issue] - [description]
- **Dependent Tasks:** #[issue] - [description]
- **External Dependencies:** [Third-party, infrastructure, etc.]

## Resources
**Documentation:**
- [Link 1: Description]
- [Link 2: Description]

**Tools/Access Required:**
- Tool/System 1: [Access level needed]
- Tool/System 2: [Access level needed]

## Notes
[Additional context, considerations, or constraints]
```

### .github/ISSUE_TEMPLATE/spike.md
```markdown
---
name: Research Spike
about: Investigation or research task with time-boxed effort
title: '[SPIKE] '
labels: 'spike, research, needs-triage'
assignees: ''
---

## Research Question
[What specific question or problem are we trying to answer/solve?]

## Background
[Context and background information leading to this research need]

## Objectives
- [ ] [Research objective 1]
- [ ] [Research objective 2]
- [ ] [Research objective 3]

## Scope
**In Scope:**
- [What will be investigated]
- [What approaches will be tried]

**Out of Scope:**
- [What will not be investigated]
- [Boundaries of the research]

## Time Box
**Allocated Time:** [Hours/Days]
**Target Completion:** [Date]
**Review Meeting:** [Date/Time for findings review]

## Research Approach
**Methods:**
- [ ] Literature review
- [ ] Prototype development
- [ ] Performance testing
- [ ] Technical analysis
- [ ] User interviews
- [ ] Market research
- [ ] Other: [specify]

**Success Criteria:**
- [ ] Research question answered
- [ ] Recommendations provided
- [ ] Findings documented
- [ ] Next steps identified

## Expected Deliverables
- [ ] Research findings document
- [ ] Proof of concept (if applicable)
- [ ] Recommendations report
- [ ] Risk assessment
- [ ] Effort estimates for implementation

## Resources
**Documentation:**
- [Existing docs to review]
- [External resources]

**People to Consult:**
- [Subject matter experts]
- [Stakeholders to interview]

## Questions to Answer
1. [Research question 1]
2. [Research question 2]
3. [Research question 3]

## Findings
*[To be completed during/after research]*

**Key Insights:**
- [Finding 1]
- [Finding 2]

**Recommendations:**
- [Recommendation 1]
- [Recommendation 2]

**Next Steps:**
- [ ] [Action item 1]
- [ ] [Action item 2]
```

## GitHub Actions Workflows

### .github/workflows/sprint-automation.yml
```yaml
name: Sprint Automation

on:
  schedule:
    # Run every Monday at 9 AM UTC
    - cron: '0 9 * * MON'
  workflow_dispatch:
    inputs:
      sprint_duration:
        description: 'Sprint duration in days'
        required: false
        default: '14'
        type: string

jobs:
  sprint-management:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    
    steps:
      - name: Create New Sprint Milestone
        uses: actions/github-script@v7
        with:
          script: |
            const sprintDuration = parseInt('${{ github.event.inputs.sprint_duration || "14" }}');
            const startDate = new Date();
            const endDate = new Date(startDate.getTime() + sprintDuration * 24 * 60 * 60 * 1000);
            
            // Format sprint title
            const sprintNumber = Math.ceil((Date.now() - new Date('2024-01-01').getTime()) / (sprintDuration * 24 * 60 * 60 * 1000));
            const sprintTitle = `Sprint ${sprintNumber} - ${startDate.toISOString().slice(0, 10)}`;
            
            try {
              // Create new sprint milestone
              const { data: milestone } = await github.rest.issues.createMilestone({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: sprintTitle,
                description: `Sprint ${sprintNumber} running from ${startDate.toDateString()} to ${endDate.toDateString()}`,
                due_on: endDate.toISOString()
              });
              
              console.log(`Created milestone: ${milestone.title}`);
              
              // Get issues ready for sprint
              const { data: readyIssues } = await github.rest.issues.listForRepo({
                owner: context.repo.owner,
                repo: context.repo.repo,
                labels: 'ready-for-sprint',
                state: 'open',
                per_page: 100
              });
              
              // Move top priority issues to sprint
              const sprintCapacity = 10; // Adjust based on team capacity
              const issuesToMove = readyIssues.slice(0, sprintCapacity);
              
              for (const issue of issuesToMove) {
                await github.rest.issues.update({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: issue.number,
                  milestone: milestone.number,
                  labels: issue.labels.map(l => l.name)
                    .filter(l => l !== 'ready-for-sprint')
                    .concat(['in-sprint', 'status:sprint-backlog'])
                });
                
                console.log(`Moved issue #${issue.number} to sprint`);
              }
              
              // Create sprint planning issue
              await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: `Sprint Planning - ${sprintTitle}`,
                body: `
                # Sprint Planning - ${sprintTitle}
                
                ## Sprint Goal
                [Define the sprint goal here]
                
                ## Sprint Backlog
                ${issuesToMove.map(issue => `- [ ] #${issue.number} - ${issue.title}`).join('\n')}
                
                ## Team Capacity
                - Team Member 1: [Available hours]
                - Team Member 2: [Available hours]
                
                ## Sprint Events
                - **Sprint Planning:** ${startDate.toDateString()}
                - **Daily Standups:** Every day at [time]
                - **Sprint Review:** ${endDate.toDateString()}
                - **Sprint Retrospective:** ${endDate.toDateString()}
                
                ## Notes
                [Planning notes and decisions]
                `,
                labels: ['sprint-planning', 'meeting'],
                milestone: milestone.number
              });
              
            } catch (error) {
              console.error('Error in sprint automation:', error);
              throw error;
            }
```

### .github/workflows/definition-of-done.yml
```yaml
name: Definition of Done Check

on:
  pull_request:
    types: [opened, synchronize, reopened]
  issue_comment:
    types: [created]

jobs:
  check-definition-of-done:
    if: contains(github.event.issue.labels.*.name, 'story') || contains(github.event.pull_request.labels.*.name, 'story')
    runs-on: ubuntu-latest
    permissions:
      issues: write
      pull-requests: write
      contents: read
    
    steps:
      - name: Check Story Completion
        uses: actions/github-script@v7
        with:
          script: |
            const definitionOfDone = [
              'Code implemented and follows coding standards',
              'Unit tests written and passing',
              'Code reviewed and approved',
              'Integration tests passing',
              'Acceptance criteria verified',
              'Documentation updated',
              'Feature deployed to staging environment',
              'Product Owner acceptance'
            ];
            
            let issueNumber, issueBody;
            
            if (context.eventName === 'pull_request') {
              issueNumber = context.payload.pull_request.number;
              issueBody = context.payload.pull_request.body || '';
            } else {
              issueNumber = context.payload.issue.number;
              issueBody = context.payload.issue.body || '';
            }
            
            // Check which DoD items are completed
            const completedItems = definitionOfDone.filter(item => 
              issueBody.includes(`- [x] ${item}`) || issueBody.includes(`- [X] ${item}`)
            );
            
            const completionPercentage = Math.round((completedItems.length / definitionOfDone.length) * 100);
            
            // Create status comment
            const statusComment = `
            ## 📋 Definition of Done Status: ${completionPercentage}%
            
            ${definitionOfDone.map(item => {
              const isCompleted = completedItems.includes(item);
              return `${isCompleted ? '✅' : '⏳'} ${item}`;
            }).join('\n')}
            
            ${completionPercentage === 100 ? 
              '🎉 **All Definition of Done criteria completed!** This story is ready for closure.' : 
              `📝 **${definitionOfDone.length - completedItems.length} items remaining** to complete this story.`
            }
            `;
            
            if (context.eventName === 'pull_request') {
              await github.rest.pulls.createReview({
                owner: context.repo.owner,
                repo: context.repo.repo,
                pull_number: issueNumber,
                body: statusComment,
                event: completionPercentage === 100 ? 'APPROVE' : 'COMMENT'
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issueNumber,
                body: statusComment
              });
            }
```

## Pull Request Template

### .github/PULL_REQUEST_TEMPLATE.md
```markdown
## 📝 Description
[Provide a brief description of what this PR accomplishes]

## 🔗 Related Issues
- Closes #[issue_number]
- Related to #[issue_number]

## 🧪 Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement
- [ ] Test updates

## ✅ Testing
**Test Coverage:**
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

**Test Scenarios:**
- [ ] Happy path tested
- [ ] Error conditions tested
- [ ] Edge cases tested
- [ ] Regression testing completed

**Testing Notes:**
[Describe specific testing performed]

## 📱 Screenshots/Demo
[Include screenshots or GIFs demonstrating the changes, especially for UI changes]

## 🔍 Code Review Checklist
**For Reviewer:**
- [ ] Code follows project conventions and style guidelines
- [ ] Logic is clear and well-commented
- [ ] No obvious performance issues
- [ ] Security considerations addressed
- [ ] Tests are comprehensive and meaningful
- [ ] Documentation is updated as needed

**For Author:**
- [ ] Self-review completed
- [ ] Code is ready for production
- [ ] All acceptance criteria met
- [ ] No temporary debug code included
- [ ] Commit messages are clear and descriptive

## 🚀 Deployment Notes
**Database Changes:**
- [ ] No database changes
- [ ] Database migrations included
- [ ] Data migration required

**Configuration Changes:**
- [ ] No configuration changes
- [ ] Environment variables updated
- [ ] Feature flags configured

**Dependencies:**
- [ ] No new dependencies
- [ ] New dependencies documented
- [ ] Security scan completed

## 📋 Definition of Done
- [ ] Code implemented and follows coding standards
- [ ] Unit tests written and passing
- [ ] Code reviewed and approved
- [ ] Integration tests passing
- [ ] Acceptance criteria verified
- [ ] Documentation updated
- [ ] Feature deployed to staging environment
- [ ] Product Owner acceptance

## 🔄 Post-Merge Actions
- [ ] Update project board
- [ ] Close related issues
- [ ] Update release notes
- [ ] Notify stakeholders
- [ ] Monitor production deployment
```

## Project Board Configuration

### Agile Scrum Board Setup
```yaml
Board Name: "Agile Development - Scrum"
Board Type: "Team Planning"

Custom Fields:
  story_points:
    type: "single_select"
    options: ["1", "2", "3", "5", "8", "13", "21"]
  
  sprint_goal:
    type: "text"
    description: "Current sprint goal or objective"
  
  priority:
    type: "single_select"
    options: ["Critical", "High", "Medium", "Low"]
  
  component:
    type: "single_select"
    options: ["Frontend", "Backend", "Database", "DevOps", "Documentation", "Testing"]
  
  team_member:
    type: "single_select"
    options: ["Developer 1", "Developer 2", "Developer 3", "QA Engineer", "Designer"]

Columns:
  - name: "📋 Product Backlog"
    description: "All identified work items"
  
  - name: "🎯 Sprint Backlog"
    description: "Items committed for current sprint"
  
  - name: "🔄 In Progress"
    description: "Work currently being developed"
    wip_limit: 5
  
  - name: "👀 Code Review"
    description: "Code complete, awaiting review"
    wip_limit: 3
  
  - name: "🧪 Testing"
    description: "Under QA testing"
    wip_limit: 2
  
  - name: "✅ Done"
    description: "Completed and accepted work"

Automation Rules:
  - trigger: "issue opened with label 'story'"
    action: "add to Product Backlog"
  
  - trigger: "issue labeled 'in-sprint'"
    action: "move to Sprint Backlog"
  
  - trigger: "pull request opened"
    action: "move linked issues to Code Review"
  
  - trigger: "issue closed"
    action: "move to Done"
```

### Agile Kanban Board Setup
```yaml
Board Name: "Agile Development - Kanban"
Board Type: "Feature Planning"

Custom Fields:
  priority:
    type: "single_select"
    options: ["Critical", "High", "Medium", "Low"]
  
  size:
    type: "single_select"
    options: ["XS", "S", "M", "L", "XL"]
  
  lead_time:
    type: "number"
    description: "Days from request to completion"
  
  cycle_time:
    type: "number"
    description: "Days from start to completion"

Columns:
  - name: "📥 Backlog"
    description: "All identified work items"
  
  - name: "📋 Ready"
    description: "Refined and ready to start"
    wip_limit: 5
  
  - name: "🔄 In Progress"
    description: "Work currently being developed"
    wip_limit: 3
  
  - name: "👀 Review"
    description: "Code complete, awaiting review"
    wip_limit: 2
  
  - name: "✅ Done"
    description: "Completed work"

Automation Rules:
  - trigger: "issue labeled 'ready'"
    action: "move to Ready column"
  
  - trigger: "issue assigned"
    action: "move to In Progress"
  
  - trigger: "pull request opened"
    action: "move linked issues to Review"
  
  - trigger: "issue closed"
    action: "move to Done"
```

---

*These Agile GitHub templates provide a complete setup for managing Agile projects using GitHub's native features. Customize the templates, workflows, and board configurations to match your team's specific needs and processes.*

