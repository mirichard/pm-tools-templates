# PMBOK GITHUB TEMPLATES

## Repository Setup Templates

### .github/ISSUE_TEMPLATE/work-package.md
```markdown
---
name: Work Package
about: Defined work component with specific deliverable
title: '[WP] [Work Package Name]'
labels: 'work-package, needs-planning'
assignees: ''
---

## Work Package Overview
**WBS Code:** [1.2.3]
**Work Package Name:** [Descriptive name]
**Process Group:** [Initiating/Planning/Executing/Monitoring/Closing]
**Knowledge Area:** [Integration/Scope/Schedule/Cost/Quality/Resource/Communication/Risk/Procurement/Stakeholder]
**Phase:** [Phase Number/Name]
**Responsible Organization:** [Department/Team]

## Work Package Description
[Detailed description of the work to be performed, including scope and boundaries]

## Deliverables
**Primary Deliverable:**
- [ ] [Main deliverable name and description]

**Supporting Deliverables:**
- [ ] [Supporting deliverable 1]
- [ ] [Supporting deliverable 2]
- [ ] [Supporting deliverable 3]

## Acceptance Criteria
- [ ] [Specific, measurable criterion 1]
- [ ] [Specific, measurable criterion 2]
- [ ] [Specific, measurable criterion 3]
- [ ] [Quality standards met]
- [ ] [Stakeholder approval obtained]

## Resource Requirements
**Human Resources:**
- **Project Manager:** [Hours/percentage]
- **Subject Matter Expert:** [Hours/percentage]
- **Technical Specialist:** [Hours/percentage]
- **Quality Reviewer:** [Hours/percentage]

**Estimated Effort:** [Total hours/days]
**Duration:** [Calendar days]
**Skills Required:** 
- [Skill 1: Level required]
- [Skill 2: Level required]
- [Skill 3: Level required]

**Equipment/Tools:**
- [Tool/Equipment 1]
- [Tool/Equipment 2]

## Dependencies
**Predecessor Work Packages:**
- [ ] #[issue] - [WP name] (Finish-to-Start)
- [ ] #[issue] - [WP name] (Start-to-Start)

**Successor Work Packages:**
- [ ] #[issue] - [WP name]
- [ ] #[issue] - [WP name]

**External Dependencies:**
- [External team/vendor dependency]
- [Infrastructure/system dependency]
- [Approval/decision dependency]

## Quality Requirements
**Quality Standards:**
- [Standard 1: ISO, IEEE, etc.]
- [Standard 2: Company standard]

**Review Requirements:**
- [ ] Peer review required
- [ ] SME review required
- [ ] Management review required
- [ ] Customer review required

**Testing Requirements:**
- [ ] Unit testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Performance testing

## Risk Assessment
**Identified Risks:**
- **Risk 1:** [Description] - Probability: [High/Medium/Low] - Impact: [High/Medium/Low]
- **Risk 2:** [Description] - Probability: [High/Medium/Low] - Impact: [High/Medium/Low]

**Mitigation Strategies:**
- [Mitigation for Risk 1]
- [Mitigation for Risk 2]

## Cost Information
**Budget Allocation:** $[amount]
**Cost Category:** [Labor/Equipment/Materials/Other]
**Cost Account:** [Account code]
**Approved by:** [Budget approver]

## Timeline
**Planned Start Date:** [Date]
**Planned End Date:** [Date]
**Key Milestones:**
- [Milestone 1]: [Date]
- [Milestone 2]: [Date]

**Critical Path:** [Yes/No]
**Float/Slack:** [Days]

## Communication Plan
**Status Reporting:**
- Frequency: [Weekly/Bi-weekly/Monthly]
- Recipients: [Stakeholder list]
- Format: [Email/Dashboard/Meeting]

**Stakeholder Notifications:**
- Start notification: [Recipients]
- Milestone notifications: [Recipients]
- Completion notification: [Recipients]

## Change Control
**Change Threshold:** [Percentage or amount that triggers formal change request]
**Change Approval Authority:** [Role/Person]
**Change Documentation:** [Required documentation for changes]

## Work Authorization
**Authorized by:** [Project Manager/Sponsor]
**Authorization Date:** [Date]
**Budget Authorization:** [Amount]
**Resource Authorization:** [Resources approved]

## Notes and Assumptions
**Assumptions:**
- [Assumption 1]
- [Assumption 2]

**Constraints:**
- [Constraint 1]
- [Constraint 2]

**Additional Notes:**
[Any additional context or considerations]
```

### .github/ISSUE_TEMPLATE/deliverable.md
```markdown
---
name: Deliverable
about: Specific output or result from project work
title: '[DELIVERABLE] [Deliverable Name]'
labels: 'deliverable, needs-review'
assignees: ''
---

## Deliverable Overview
**Deliverable Name:** [Full descriptive name]
**Deliverable Type:** [Document/System/Training/Process/Product]
**WBS Code:** [1.2.3.4]
**Related Work Package:** #[work_package_issue]
**Process Group:** [Initiating/Planning/Executing/Monitoring/Closing]
**Knowledge Area:** [Relevant PMBOK knowledge area]

## Deliverable Description
[Comprehensive description of what the deliverable is and its purpose within the project]

## Deliverable Specifications
**Format:** [Document type, file format, system type, etc.]
**Size/Scope:** [Pages, features, components, etc.]
**Version:** [Version number/naming convention]
**Language:** [English, multilingual, etc.]
**Template/Standard:** [If following specific template or standard]

## Acceptance Criteria
- [ ] [Specific criterion 1 - must be measurable]
- [ ] [Specific criterion 2 - must be measurable]
- [ ] [Specific criterion 3 - must be measurable]
- [ ] [Quality standards compliance verified]
- [ ] [All required reviews completed]
- [ ] [Stakeholder acceptance obtained]
- [ ] [Documentation complete and accessible]

## Quality Requirements
**Quality Standards:**
- [Standard 1: Specific requirement]
- [Standard 2: Specific requirement]

**Quality Metrics:**
- [Metric 1]: Target: [value]
- [Metric 2]: Target: [value]

**Quality Assurance:**
- [ ] Quality plan followed
- [ ] Quality checkpoints completed
- [ ] Quality audit performed (if required)

## Review and Approval Process
**Review Sequence:**
1. **Author Review:** [Self-review checklist]
2. **Peer Review:** [Peer reviewer name/role]
3. **Technical Review:** [SME reviewer name/role]
4. **Management Review:** [Manager name/role]
5. **Stakeholder Review:** [Stakeholder name/role]
6. **Final Approval:** [Approver name/role]

**Review Criteria:**
- [ ] Completeness against requirements
- [ ] Technical accuracy
- [ ] Clarity and readability
- [ ] Compliance with standards
- [ ] Fitness for purpose

**Approval Authority:** [Name and role of final approver]
**Approval Date Target:** [Date]

## Dependencies
**Input Dependencies:**
- [ ] [Input 1 from #issue]
- [ ] [Input 2 from #issue]
- [ ] [External input/approval]

**Output Dependencies:**
- [ ] [Deliverable feeds into #issue]
- [ ] [Required for milestone #milestone]

## Resource Requirements
**Development Resources:**
- [Role 1]: [Hours/effort]
- [Role 2]: [Hours/effort]

**Review Resources:**
- [Reviewer 1]: [Hours for review]
- [Reviewer 2]: [Hours for review]

**Tools/Software Required:**
- [Tool 1]: [Purpose]
- [Tool 2]: [Purpose]

## Timeline
**Development Start:** [Date]
**Development Complete:** [Date]
**Review Period:** [Date range]
**Final Approval:** [Date]
**Delivery Date:** [Date]

**Milestones:**
- [Milestone 1]: [Date]
- [Milestone 2]: [Date]

## Distribution and Access
**Primary Location:** [Repository, shared drive, system location]
**Access Control:** [Who has access, permission levels]
**Distribution List:**
- [Stakeholder 1]: [Access level]
- [Stakeholder 2]: [Access level]

**Version Control:**
- [ ] Version control system identified
- [ ] Naming convention established
- [ ] Archive procedures defined

## Success Criteria
- [ ] Deliverable meets all acceptance criteria
- [ ] All reviews completed satisfactorily
- [ ] Stakeholder approval obtained
- [ ] Quality standards met
- [ ] Delivered on time and within budget
- [ ] Properly stored and accessible

## Risk Factors
**Delivery Risks:**
- [Risk 1]: [Mitigation strategy]
- [Risk 2]: [Mitigation strategy]

**Quality Risks:**
- [Risk 1]: [Mitigation strategy]
- [Risk 2]: [Mitigation strategy]

## Post-Delivery
**Maintenance:** [Who maintains, update frequency]
**Support:** [Support contact, procedures]
**Future Versions:** [Planned updates, enhancement process]

## Notes
[Additional context, special requirements, or considerations]
```

### .github/ISSUE_TEMPLATE/risk.md
```markdown
---
name: Risk
about: Identify and track project risks
title: '[RISK] [Risk Description]'
labels: 'risk, needs-assessment'
assignees: ''
---

## Risk Identification
**Risk ID:** [Unique identifier, e.g., R001]
**Risk Title:** [Concise risk description]
**Risk Category:** [Technical/Schedule/Cost/Quality/Resource/External/Organizational]
**Knowledge Area:** [PMBOK knowledge area most affected]
**Risk Source:** [How was this risk identified?]
**Date Identified:** [Date]
**Identified By:** [Person/role who identified the risk]

## Risk Description
**Risk Event:** [What might happen?]
**Risk Cause:** [What could cause this risk to occur?]
**Risk Effect:** [What would be the impact if this risk occurs?]

**Detailed Description:**
[Comprehensive description of the risk, including context and background]

## Risk Assessment
**Probability:** [Very Low (5%) / Low (25%) / Medium (50%) / High (75%) / Very High (95%)]
**Impact on Objectives:**
- **Schedule Impact:** [Very Low/Low/Medium/High/Very High] - [Description]
- **Cost Impact:** [Very Low/Low/Medium/High/Very High] - [Description/Amount]
- **Quality Impact:** [Very Low/Low/Medium/High/Very High] - [Description]
- **Scope Impact:** [Very Low/Low/Medium/High/Very High] - [Description]

**Overall Risk Score:** [Probability × Impact = Score]
**Risk Level:** [Low (1-4) / Medium (5-14) / High (15-25)]
**Risk Ranking:** [Priority relative to other risks]

## Risk Response Strategy
**Response Type:** [Avoid/Transfer/Mitigate/Accept/Exploit/Share/Enhance]

**Response Actions:**
- [ ] [Specific action 1]
- [ ] [Specific action 2]
- [ ] [Specific action 3]

**Response Owner:** [Person responsible for managing this risk]
**Target Response Date:** [When response should be implemented]
**Response Budget:** [Cost of response actions]

## Risk Monitoring
**Risk Triggers:** [Early warning signs that risk is materializing]
- [Trigger 1]
- [Trigger 2]

**Risk Indicators:** [Metrics to monitor risk status]
- [Indicator 1]: Current value [X], Threshold [Y]
- [Indicator 2]: Current value [X], Threshold [Y]

**Monitoring Frequency:** [How often to review this risk]
**Monitoring Owner:** [Who monitors this risk]

## Contingency Planning
**Contingency Plan:** [What to do if risk occurs]
1. [Immediate action 1]
2. [Immediate action 2]
3. [Recovery action 1]
4. [Recovery action 2]

**Contingency Budget:** [Reserved funds for this risk]
**Contingency Trigger:** [Condition that activates contingency plan]
**Fallback Plan:** [Alternative if contingency plan fails]

## Dependencies and Relationships
**Related Risks:** 
- #[risk_id] - [Relationship description]
- #[risk_id] - [Relationship description]

**Affected Work Packages:**
- #[work_package] - [How it's affected]
- #[work_package] - [How it's affected]

**Stakeholder Impact:**
- [Stakeholder 1]: [Impact description]
- [Stakeholder 2]: [Impact description]

## Risk History
**Status Changes:**
- [Date]: [Status] - [Reason for change]
- [Date]: [Status] - [Reason for change]

**Assessment Updates:**
- [Date]: Probability [X], Impact [Y] - [Reason for change]
- [Date]: Probability [X], Impact [Y] - [Reason for change]

## Risk Closure
**Closure Criteria:**
- [ ] Risk no longer applicable
- [ ] Risk successfully mitigated
- [ ] Risk transferred to operations
- [ ] Risk accepted and documented

**Lessons Learned:**
[What was learned from managing this risk?]

**Closure Date:** [Date risk was closed]
**Closed By:** [Person who closed the risk]

## Risk Communication
**Stakeholder Notifications:**
- [Stakeholder group]: [Notification frequency/trigger]

**Escalation Criteria:**
- Risk score increases above [threshold]
- Risk triggers are activated
- Response actions are ineffective

**Escalation Path:**
1. [Role/Person 1]
2. [Role/Person 2]
3. [Role/Person 3]

## Notes and Updates
[Use this section for ongoing notes and updates about the risk]

**Latest Update:** [Date] - [Update description]
```

### .github/ISSUE_TEMPLATE/change-request.md
```markdown
---
name: Change Request
about: Request modification to project scope, schedule, or budget
title: '[CR] [Change Description]'
labels: 'change-request, needs-review'
assignees: ''
---

## Change Request Overview
**Change Request ID:** [Unique identifier, e.g., CR001]
**Submission Date:** [Date]
**Submitted By:** [Name and role]
**Priority:** [Low/Medium/High/Critical]
**Category:** [Scope/Schedule/Cost/Quality/Resource/Risk]
**Status:** [Submitted/Under Review/Approved/Rejected/Implemented]

## Change Description
**Current State:** [Describe what currently exists]
**Proposed Change:** [Describe what is being requested]
**Justification:** [Why is this change needed?]

**Detailed Description:**
[Comprehensive description of the requested change, including background and context]

## Business Case
**Business Need:** [What business need does this change address?]
**Benefits:** [What benefits will be realized?]
- [Benefit 1]: [Description and quantification]
- [Benefit 2]: [Description and quantification]

**Risks of Not Implementing:**
- [Risk 1]: [Description and impact]
- [Risk 2]: [Description and impact]

**Alternatives Considered:**
1. [Alternative 1]: [Description and reason for rejection]
2. [Alternative 2]: [Description and reason for rejection]

## Impact Analysis
**Scope Impact:**
- [ ] No scope impact
- [ ] Scope addition: [Description]
- [ ] Scope reduction: [Description]
- [ ] Scope modification: [Description]

**Schedule Impact:**
- [ ] No schedule impact
- [ ] Schedule acceleration: [Days saved]
- [ ] Schedule delay: [Days added]
- **Critical Path Impact:** [Yes/No]
- **Milestones Affected:** [List affected milestones]

**Cost Impact:**
- [ ] No cost impact
- [ ] Cost increase: $[amount]
- [ ] Cost decrease: $[amount]
- **Budget Category:** [Which budget line items affected]
- **Funding Source:** [Where additional funding comes from]

**Quality Impact:**
- [ ] No quality impact
- [ ] Quality improvement: [Description]
- [ ] Quality reduction: [Description]
- **Quality Standards Affected:** [List any standards affected]

**Resource Impact:**
- [ ] No resource impact
- [ ] Additional resources needed: [Description]
- [ ] Resource reduction: [Description]
- **Skills Required:** [Any new skills needed]

**Risk Impact:**
- [ ] No new risks
- [ ] New risks introduced: [List new risks]
- [ ] Existing risks affected: [How existing risks change]

## Stakeholder Impact
**Affected Stakeholders:**
- [Stakeholder 1]: [Impact description]
- [Stakeholder 2]: [Impact description]

**Stakeholder Approval Required:**
- [ ] Project Sponsor
- [ ] Customer/Client
- [ ] End Users
- [ ] Technical Authority
- [ ] Other: [Specify]

## Implementation Plan
**Implementation Approach:** [How will the change be implemented?]

**Implementation Steps:**
1. [ ] [Step 1]
2. [ ] [Step 2]
3. [ ] [Step 3]

**Implementation Timeline:**
- **Start Date:** [Date]
- **End Date:** [Date]
- **Key Milestones:** [List implementation milestones]

**Resources Required:**
- [Resource 1]: [Hours/effort]
- [Resource 2]: [Hours/effort]

## Dependencies
**Prerequisites:**
- [ ] [Prerequisite 1]
- [ ] [Prerequisite 2]

**Dependent Changes:**
- [ ] [Related change 1]
- [ ] [Related change 2]

**External Dependencies:**
- [External dependency 1]
- [External dependency 2]

## Approval Process
**Review Sequence:**
1. **Technical Review:** [Reviewer] - [Date]
2. **Impact Assessment:** [Assessor] - [Date]
3. **Stakeholder Review:** [Stakeholders] - [Date]
4. **Change Control Board:** [Board] - [Date]
5. **Final Approval:** [Approver] - [Date]

**Approval Criteria:**
- [ ] Business case justified
- [ ] Impact assessment complete
- [ ] Stakeholder agreement obtained
- [ ] Resources available
- [ ] Risks acceptable

**Decision Authority:** [Who makes final decision]
**Decision Date:** [Target date for decision]

## Risk Assessment
**Implementation Risks:**
- [Risk 1]: [Description] - Mitigation: [Strategy]
- [Risk 2]: [Description] - Mitigation: [Strategy]

**Project Risks:**
- [Risk 1]: [How this change affects existing risks]
- [Risk 2]: [How this change affects existing risks]

## Communication Plan
**Notification Recipients:**
- [Stakeholder group 1]: [When/how to notify]
- [Stakeholder group 2]: [When/how to notify]

**Communication Timeline:**
- [Date]: [Milestone] - [Who to notify]
- [Date]: [Milestone] - [Who to notify]

## Baseline Updates
**Documents to Update:**
- [ ] Project Charter
- [ ] Project Management Plan
- [ ] Work Breakdown Structure
- [ ] Schedule
- [ ] Budget
- [ ] Risk Register
- [ ] Other: [Specify]

**Update Responsibility:** [Who updates each document]
**Update Timeline:** [When updates will be completed]

## Decision and Closure
**Decision:** [Approved/Rejected/Deferred]
**Decision Date:** [Date]
**Decision Rationale:** [Why this decision was made]
**Decision Authority:** [Who made the decision]

**If Approved:**
- [ ] Implementation plan executed
- [ ] Baselines updated
- [ ] Stakeholders notified
- [ ] Lessons learned captured

**If Rejected:**
- [ ] Rejection reason documented
- [ ] Requestor notified
- [ ] Alternative solutions identified

## Lessons Learned
[What was learned from this change request process?]

## Notes and Comments
[Additional notes, comments, or updates about this change request]
```

## GitHub Actions Workflows

### .github/workflows/gate-review.yml
```yaml
name: Phase Gate Review

on:
  milestone:
    types: [closed]
  workflow_dispatch:
    inputs:
      milestone_title:
        description: 'Milestone title for manual gate review'
        required: true
        type: string

jobs:
  gate-review:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    
    steps:
      - name: Generate Gate Review Report
        uses: actions/github-script@v7
        with:
          script: |
            let milestone;
            
            if (context.eventName === 'milestone') {
              milestone = context.payload.milestone;
            } else {
              // Manual trigger - find milestone by title
              const { data: milestones } = await github.rest.issues.listMilestones({
                owner: context.repo.owner,
                repo: context.repo.repo,
                state: 'all'
              });
              
              milestone = milestones.find(m => m.title === '${{ github.event.inputs.milestone_title }}');
              if (!milestone) {
                throw new Error(`Milestone '${context.event.inputs.milestone_title}' not found`);
              }
            }
            
            // Get all issues in milestone
            const { data: issues } = await github.rest.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              milestone: milestone.number,
              state: 'all',
              per_page: 100
            });
            
            // Categorize issues by type
            const workPackages = issues.filter(issue => 
              issue.labels.some(label => label.name === 'work-package')
            );
            const deliverables = issues.filter(issue => 
              issue.labels.some(label => label.name === 'deliverable')
            );
            const risks = issues.filter(issue => 
              issue.labels.some(label => label.name === 'risk')
            );
            
            // Calculate completion statistics
            const totalIssues = issues.length;
            const completedIssues = issues.filter(i => i.state === 'closed').length;
            const completionRate = totalIssues > 0 ? (completedIssues / totalIssues * 100).toFixed(1) : 0;
            
            const workPackageCompletion = workPackages.length > 0 ? 
              (workPackages.filter(wp => wp.state === 'closed').length / workPackages.length * 100).toFixed(1) : 0;
            
            const deliverableCompletion = deliverables.length > 0 ? 
              (deliverables.filter(d => d.state === 'closed').length / deliverables.length * 100).toFixed(1) : 0;
            
            // Assess gate readiness
            const gateStatus = completionRate >= 95 ? '🟢 READY TO PROCEED' : 
                              completionRate >= 80 ? '🟡 PROCEED WITH CAUTION' : 
                              '🔴 NOT READY - CORRECTIVE ACTION REQUIRED';
            
            // Generate comprehensive report
            const reportBody = `
            # Phase Gate Review Report
            
            **Milestone:** ${milestone.title}
            **Review Date:** ${new Date().toDateString()}
            **Gate Status:** ${gateStatus}
            **Overall Completion:** ${completionRate}% (${completedIssues}/${totalIssues})
            
            ## Executive Summary
            ${completionRate >= 95 ? 
              'All phase objectives have been substantially completed. The project is ready to proceed to the next phase.' :
              completionRate >= 80 ?
              'Most phase objectives have been completed. Minor issues remain but the project can proceed with management attention.' :
              'Significant work remains incomplete. Corrective action is required before proceeding to the next phase.'
            }
            
            ## Completion Status by Category
            
            ### Work Packages: ${workPackageCompletion}% Complete
            ${workPackages.map(wp => `- ${wp.state === 'closed' ? '✅' : '⏳'} #${wp.number} - ${wp.title}`).join('\n')}
            
            ### Deliverables: ${deliverableCompletion}% Complete
            ${deliverables.map(d => `- ${d.state === 'closed' ? '✅' : '⏳'} #${d.number} - ${d.title}`).join('\n')}
            
            ### Active Risks
            ${risks.filter(r => r.state === 'open').map(r => `- ⚠️ #${r.number} - ${r.title}`).join('\n')}
            
            ## Outstanding Work Items
            ${issues.filter(i => i.state === 'open').map(i => {
              const labels = i.labels.map(l => l.name).join(', ');
              return `- [ ] #${i.number} - ${i.title} (${labels})`;
            }).join('\n')}
            
            ## Quality Assessment
            - **Deliverable Quality:** ${deliverableCompletion >= 90 ? '✅ Acceptable' : '⚠️ Needs Review'}
            - **Risk Management:** ${risks.filter(r => r.state === 'open').length <= 3 ? '✅ Acceptable' : '⚠️ High Risk Count'}
            - **Schedule Performance:** ${completionRate >= 90 ? '✅ On Track' : '⚠️ Behind Schedule'}
            
            ## Recommendations
            ${completionRate >= 95 ?
              '✅ **RECOMMENDATION: PROCEED TO NEXT PHASE**\n\nAll criteria met for phase completion.' :
              completionRate >= 80 ?
              '⚠️ **RECOMMENDATION: CONDITIONAL PROCEED**\n\nAddress outstanding items with increased management oversight.' :
              '🛑 **RECOMMENDATION: DO NOT PROCEED**\n\nComplete all critical work items before advancing to next phase.'
            }
            
            ## Action Items
            ${issues.filter(i => i.state === 'open').slice(0, 5).map(i => 
              `- [ ] Complete #${i.number} - ${i.title}`
            ).join('\n')}
            
            ${issues.filter(i => i.state === 'open').length > 5 ? 
              `\n*... and ${issues.filter(i => i.state === 'open').length - 5} additional items*` : ''}
            
            ---
            
            **Next Gate Review:** [Schedule next review date]
            **Review Board:** [List review board members]
            **Report Generated:** ${new Date().toISOString()}
            `;
            
            // Create gate review issue
            const { data: gateIssue } = await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Gate Review: ${milestone.title} - ${gateStatus.split(' ')[1]}`,
              body: reportBody,
              labels: ['gate-review', 'pmbok:monitoring', 
                       completionRate >= 95 ? 'approved' : 
                       completionRate >= 80 ? 'conditional' : 'rejected'
                      ]
            });
            
            console.log(`Created gate review issue #${gateIssue.number}`);
            
            // If gate is not ready, create follow-up actions
            if (completionRate < 95) {
              const outstandingIssues = issues.filter(i => i.state === 'open');
              
              for (const issue of outstandingIssues.slice(0, 3)) { // Top 3 priority items
                await github.rest.issues.createComment({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: issue.number,
                  body: `⚠️ **GATE REVIEW ATTENTION REQUIRED**\n\nThis item is blocking phase gate approval. Please prioritize completion.\n\nRelated Gate Review: #${gateIssue.number}`
                });
              }
            }
```

### .github/workflows/deliverable-approval.yml
```yaml
name: Deliverable Approval Workflow

on:
  issues:
    types: [labeled]
  issue_comment:
    types: [created]

jobs:
  deliverable-workflow:
    if: contains(github.event.issue.labels.*.name, 'deliverable')
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    
    steps:
      - name: Handle Deliverable Workflow
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.payload.issue || context.payload.issue;
            const comment = context.payload.comment;
            
            // Define approval workflow stages
            const approvalStages = [
              'needs-review',
              'peer-review',
              'technical-review', 
              'management-review',
              'stakeholder-review',
              'approved'
            ];
            
            // Get current labels
            const currentLabels = issue.labels.map(l => l.name);
            const currentStage = approvalStages.find(stage => currentLabels.includes(stage));
            
            // Handle label addition (stage progression)
            if (context.eventName === 'issues' && context.payload.action === 'labeled') {
              const newLabel = context.payload.label.name;
              
              if (approvalStages.includes(newLabel)) {
                const stageIndex = approvalStages.indexOf(newLabel);
                const stageName = newLabel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                // Create stage transition comment
                await github.rest.issues.createComment({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: issue.number,
                  body: `## 📋 Deliverable Stage Transition\n\n**New Stage:** ${stageName}\n**Date:** ${new Date().toDateString()}\n\n${getStageInstructions(newLabel)}`
                });
                
                // If approved, close the issue
                if (newLabel === 'approved') {
                  await github.rest.issues.update({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: issue.number,
                    state: 'closed',
                    labels: currentLabels.concat(['completed'])
                  });
                  
                  // Create approval notification
                  await github.rest.issues.createComment({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: issue.number,
                    body: `🎉 **DELIVERABLE APPROVED**\n\nThis deliverable has completed all review stages and is now approved for release.\n\n**Final Approval Date:** ${new Date().toDateString()}\n**Status:** Completed`
                  });
                }
              }
            }
            
            // Handle approval comments
            if (context.eventName === 'issue_comment' && comment) {
              const commentBody = comment.body.toLowerCase();
              
              // Check for approval keywords
              if (commentBody.includes('/approve') || commentBody.includes('approved')) {
                const currentStageIndex = approvalStages.indexOf(currentStage);
                
                if (currentStageIndex >= 0 && currentStageIndex < approvalStages.length - 1) {
                  const nextStage = approvalStages[currentStageIndex + 1];
                  
                  // Remove current stage label and add next stage
                  const newLabels = currentLabels.filter(l => l !== currentStage).concat([nextStage]);
                  
                  await github.rest.issues.update({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: issue.number,
                    labels: newLabels
                  });
                  
                  // Add progression comment
                  await github.rest.issues.createComment({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    issue_number: issue.number,
                    body: `✅ **Stage Approved by ${comment.user.login}**\n\nProgressing to: ${nextStage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                  });
                }
              }
              
              // Check for rejection keywords
              if (commentBody.includes('/reject') || commentBody.includes('rejected')) {
                await github.rest.issues.update({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: issue.number,
                  labels: currentLabels.filter(l => !approvalStages.includes(l)).concat(['needs-rework'])
                });
                
                await github.rest.issues.createComment({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  issue_number: issue.number,
                  body: `❌ **Deliverable Rejected by ${comment.user.login}**\n\nReason: Please see review comments above.\n\nStatus: Returned for rework`
                });
              }
            }
            
            function getStageInstructions(stage) {
              const instructions = {
                'needs-review': 'This deliverable is ready for initial review. Please assign reviewers.',
                'peer-review': 'Peer review in progress. Peer reviewer should examine for completeness and accuracy.',
                'technical-review': 'Technical review in progress. SME should validate technical content.',
                'management-review': 'Management review in progress. Manager should approve business alignment.',
                'stakeholder-review': 'Stakeholder review in progress. Stakeholders should validate requirements satisfaction.',
                'approved': 'All reviews complete. Deliverable approved for release.'
              };
              
              return instructions[stage] || 'Review stage instructions not defined.';
            }
```

## Project Board Configuration

### PMBOK Project Board Setup
```yaml
Board Name: "PMBOK Traditional Project Management"
Board Type: "Feature Planning"

Custom Fields:
  process_group:
    type: "single_select"
    options: ["Initiating", "Planning", "Executing", "Monitoring", "Closing"]
  
  knowledge_area:
    type: "single_select"
    options: ["Integration", "Scope", "Schedule", "Cost", "Quality", "Resource", "Communication", "Risk", "Procurement", "Stakeholder"]
  
  work_package:
    type: "text"
    description: "WBS code for work package"
  
  deliverable_type:
    type: "single_select"
    options: ["Document", "System", "Training", "Process", "Product"]
  
  phase:
    type: "single_select"
    options: ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5"]
  
  risk_level:
    type: "single_select"
    options: ["Low", "Medium", "High", "Critical"]
  
  approval_status:
    type: "single_select"
    options: ["Draft", "Review", "Approved", "Rejected"]

Columns:
  - name: "📋 Project Backlog"
    description: "All identified project work"
  
  - name: "📝 Planning"
    description: "Work being planned and designed"
  
  - name: "🔄 In Progress"
    description: "Work being executed"
  
  - name: "👀 Review/QA"
    description: "Work under review or quality assurance"
  
  - name: "⏳ Waiting"
    description: "Work waiting for dependencies or approvals"
  
  - name: "✅ Completed"
    description: "Completed and approved work"

Automation Rules:
  - trigger: "issue opened with label 'work-package'"
    action: "add to Project Backlog"
  
  - trigger: "issue labeled 'in-progress'"
    action: "move to In Progress"
  
  - trigger: "issue labeled 'needs-review'"
    action: "move to Review/QA"
  
  - trigger: "issue labeled 'approved'"
    action: "move to Completed"
  
  - trigger: "issue labeled 'blocked'"
    action: "move to Waiting"
```

---

*These PMBOK GitHub templates provide a structured approach to traditional project management using GitHub's features. The templates support the full PMBOK framework with proper work breakdown, risk management, and formal approval processes.*

