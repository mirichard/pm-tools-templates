---
title: "HYBRID GITHUB TEMPLATES"
methodology: "agile"
complexity: "advanced"
process_group: "planning"
industry: "financial"
role: "po"
tags:
  - "agile"
  - "communication"
  - "planning"
  - "quality"
  - "reporting"
  - "risk-management"
  - "stakeholder-management"
version: "1.0.0"
owner: "mirichard"
updated: "2025-08-06"
estimated_completion_time: "90-120 minutes"
---

# HYBRID GITHUB TEMPLATES

## Repository Setup Templates

### .github/ISSUE_TEMPLATE/hybrid-epic.md
```markdown
---
name: Hybrid Epic
about: Large initiative combining agile and traditional approaches
title: '[HYBRID-EPIC] '
labels: 'hybrid-epic, needs-planning'
assignees: ''
---

## Epic Overview
**Epic Name:** [Descriptive epic title]
**Epic Type:** [Feature Epic/Infrastructure Epic/Compliance Epic]
**Business Value:** [Clear business value proposition]
**Target Audience:** [Primary beneficiaries]
**Methodology Mix:** [Agile-heavy/Traditional-heavy/Balanced]
**Phase Alignment:** [Which traditional phase(s) this epic spans]

## Epic Description
[Comprehensive description of the epic, including business context and strategic alignment]

## Hybrid Approach Rationale
**Why Hybrid?** [Explanation of why hybrid approach is needed]
**Agile Components:** [What will be handled with agile practices]
**Traditional Components:** [What requires traditional project management]
**Integration Points:** [How agile and traditional components connect]

## Success Criteria
**Business Outcomes:**
- [ ] [Measurable business outcome 1]
- [ ] [Measurable business outcome 2]
- [ ] [Measurable business outcome 3]

**Technical Outcomes:**
- [ ] [Technical deliverable 1]
- [ ] [Technical deliverable 2]

**Process Outcomes:**
- [ ] [Process improvement 1]
- [ ] [Process improvement 2]

## User Stories and Work Packages
**Agile User Stories:**
- [ ] #[issue] - [User story title]
- [ ] #[issue] - [User story title]

**Traditional Work Packages:**
- [ ] #[issue] - [Work package title]
- [ ] #[issue] - [Work package title]

**Integration Work:**
- [ ] #[issue] - [Integration activity]

## Timeline and Phases
**Traditional Phase Gates:**
- **Phase Gate 1:** [Date] - [Gate criteria]
- **Phase Gate 2:** [Date] - [Gate criteria]
- **Phase Gate 3:** [Date] - [Gate criteria]

**Agile Iterations:**
- **Sprint Duration:** [Duration]
- **Number of Sprints:** [Count]
- **Sprint Goals aligned with:** [Phase milestones]

**Hybrid Milestones:**
- [Milestone 1]: [Date] - [Combines sprint demo + phase deliverable]
- [Milestone 2]: [Date] - [Combines sprint demo + phase deliverable]

## Governance Model
**Traditional Governance:**
- **Steering Committee:** [Members and meeting frequency]
- **Change Control Board:** [Process for scope changes]
- **Phase Gate Reviews:** [Approval authority and criteria]

**Agile Governance:**
- **Product Owner:** [Name/Role]
- **Scrum Master:** [Name/Role]
- **Sprint Reviews:** [Stakeholder participation]
- **Retrospectives:** [Process improvement focus]

**Integration Governance:**
- **Hybrid Review Board:** [Combined traditional/agile oversight]
- **Escalation Path:** [How conflicts between methodologies are resolved]

## Risk Management
**Methodology Risks:**
- **Risk:** [Conflict between agile and traditional approaches]
  - **Mitigation:** [Clear role definitions and integration protocols]
- **Risk:** [Traditional stakeholders resist agile practices]
  - **Mitigation:** [Education and gradual introduction]

**Project Risks:**
- **Risk 1:** [Description] - Impact: [High/Medium/Low]
- **Risk 2:** [Description] - Impact: [High/Medium/Low]

## Success Metrics
**Agile Metrics:**
- Velocity: [Target story points per sprint]
- Sprint Goal Achievement: [Target percentage]
- Team Satisfaction: [Target score]

**Traditional Metrics:**
- Schedule Performance: [SPI target]
- Budget Performance: [CPI target]
- Quality Gates: [Percentage passed first time]

**Hybrid Metrics:**
- Phase-Sprint Alignment: [Percentage of sprints that contribute to phase goals]
- Stakeholder Satisfaction: [Combined agile and traditional stakeholder feedback]
- Value Delivery Frequency: [How often business value is delivered]

## Dependencies and Constraints
**External Dependencies:**
- [Dependency 1]: [Traditional/Agile impact]
- [Dependency 2]: [Traditional/Agile impact]

**Methodology Constraints:**
- [Constraint 1]: [How it affects agile/traditional work]
- [Constraint 2]: [How it affects agile/traditional work]

**Integration Constraints:**
- [Constraint affecting both methodologies]

## Communication Plan
**Traditional Stakeholders:**
- Format: [Formal reports, presentations]
- Frequency: [Monthly, at phase gates]
- Content: [Status, risks, budget, schedule]

**Agile Stakeholders:**
- Format: [Sprint demos, informal updates]
- Frequency: [Sprint reviews, daily standups for key stakeholders]
- Content: [Working software, user feedback, team health]

**Integrated Communication:**
- Format: [Hybrid dashboards showing both perspectives]
- Frequency: [Bi-weekly integration reviews]
- Content: [Progress toward both sprint and phase goals]

## Notes and Assumptions
**Assumptions:**
- [Assumption 1 about methodology integration]
- [Assumption 2 about stakeholder acceptance]

**Constraints:**
- [Organizational constraint affecting approach]
- [Technical constraint affecting approach]

**Integration Notes:**
[Specific notes about how agile and traditional elements will work together]
```

### .github/ISSUE_TEMPLATE/hybrid-work-item.md
```markdown
---
name: Hybrid Work Item
about: Work item that may use agile or traditional approach
title: '[HYBRID] '
labels: 'hybrid-work, needs-classification'
assignees: ''
---

## Work Item Classification
**Item Type:** [User Story/Work Package/Spike/Task]
**Methodology Recommendation:** [Agile/Traditional/Mixed]
**Reasoning:** [Why this methodology is recommended]
**Epic/Parent:** #[parent_epic_or_work_package]
**Phase Alignment:** [Which traditional phase this supports]
**Sprint Consideration:** [Can this be completed in a sprint?]

## Work Item Description
[Clear description of what needs to be accomplished]

## Business Value
**Value Statement:** [How this contributes to business objectives]
**User Impact:** [Who benefits and how]
**Strategic Alignment:** [How this aligns with project strategy]

## Approach Determination
**Agile Characteristics Present:**
- [ ] Can be delivered incrementally
- [ ] Benefits from rapid feedback
- [ ] Requirements may evolve
- [ ] Creative/innovative solution needed
- [ ] User collaboration important

**Traditional Characteristics Present:**
- [ ] Requires extensive planning
- [ ] Fixed requirements and scope
- [ ] Regulatory/compliance requirements
- [ ] Dependencies on external vendors
- [ ] Formal documentation required

**Recommended Approach:** [Based on characteristics above]

## Agile Elements (if applicable)
**User Story Format:**
As a [user type]
I want [functionality]
So that [benefit]

**Acceptance Criteria:**
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]
- [ ] [Testable criterion 3]

**Story Points:** [1, 2, 3, 5, 8, 13, 21 or 'Too Large']
**Sprint Goal Contribution:** [How this supports current sprint goal]

## Traditional Elements (if applicable)
**Work Package Details:**
- **WBS Code:** [1.2.3.4]
- **Process Group:** [Initiating/Planning/Executing/Monitoring/Closing]
- **Knowledge Area:** [Traditional knowledge area]
- **Deliverable:** [Specific output expected]

**Effort Estimation:**
- **Hours:** [Estimated hours]
- **Duration:** [Calendar time]
- **Resources:** [Required skills/roles]

## Hybrid Coordination
**Sprint Integration:**
- **Sprint Assignment:** [Which sprint(s) will address this]
- **Phase Milestone Impact:** [How this affects phase milestones]
- **Gate Review Relevance:** [Will this be reviewed at phase gates?]

**Traditional Integration:**
- **Documentation Requirements:** [What formal docs are needed]
- **Approval Requirements:** [Who needs to approve]
- **Compliance Considerations:** [Regulatory or policy requirements]

## Quality Requirements
**Agile Quality:**
- [ ] Definition of Done criteria met
- [ ] Acceptance criteria validated
- [ ] User feedback incorporated
- [ ] Technical debt minimized

**Traditional Quality:**
- [ ] Quality standards compliance
- [ ] Formal review completed
- [ ] Documentation standards met
- [ ] Audit trail maintained

## Dependencies
**Agile Dependencies:**
- User availability: [When needed]
- Technical dependencies: [Other stories/features]
- Team dependencies: [Skills or people needed]

**Traditional Dependencies:**
- Approval dependencies: [What approvals are needed]
- Vendor dependencies: [External suppliers]
- Infrastructure dependencies: [Systems or tools]

**Cross-Methodology Dependencies:**
- [How this agile work depends on traditional work]
- [How traditional deliverables depend on this work]

## Risk Assessment
**Agile Risks:**
- [Risk related to iterative approach]
- [Risk related to changing requirements]

**Traditional Risks:**
- [Risk related to planning assumptions]
- [Risk related to fixed scope/timeline]

**Integration Risks:**
- [Risk of methodology conflict]
- [Risk of communication gaps]

## Success Metrics
**Agile Success:**
- User satisfaction: [Target score]
- Feature adoption: [Target percentage]
- Team velocity impact: [Positive/neutral/negative]

**Traditional Success:**
- On-time delivery: [Target date]
- Budget compliance: [Within X% of estimate]
- Quality metrics: [Defect rate, review pass rate]

**Hybrid Success:**
- Stakeholder alignment: [Both agile and traditional stakeholders satisfied]
- Integration effectiveness: [Smooth handoffs between methodologies]

## Communication Plan
**Sprint Level:**
- Daily standup participation: [Yes/No]
- Sprint review demonstration: [What will be shown]
- Sprint retrospective input: [Process improvement ideas]

**Phase Level:**
- Status reporting: [What formal status is needed]
- Phase gate presentation: [Will this be part of gate review]
- Stakeholder updates: [How traditional stakeholders are informed]

## Completion Criteria
**Agile Completion:**
- [ ] All acceptance criteria met
- [ ] Product Owner acceptance
- [ ] Definition of Done satisfied
- [ ] User feedback positive

**Traditional Completion:**
- [ ] Deliverable approved
- [ ] Quality standards met
- [ ] Documentation complete
- [ ] Formal sign-off obtained

**Integration Completion:**
- [ ] Both methodologies' requirements satisfied
- [ ] Handoff to next work item smooth
- [ ] Lessons learned captured

## Notes
[Additional context, special considerations, or methodology-specific notes]
```

### .github/ISSUE_TEMPLATE/phase-gate-sprint-review.md
```markdown
---
name: Phase Gate Sprint Review
about: Combined review for phase gates and sprint outcomes
title: '[GATE-SPRINT] Phase [X] Sprint [Y] Review'
labels: 'phase-gate, sprint-review, hybrid-governance'
assignees: ''
---

## Review Overview
**Phase:** [Phase number/name]
**Sprint:** [Sprint number]
**Review Date:** [Date]
**Review Type:** [Regular/Milestone/Gate Decision]
**Phase Gate Status:** [Approaching/At Gate/Post Gate]

## Sprint Review Summary
**Sprint Goal:** [What was the sprint goal?]
**Sprint Duration:** [Start date - End date]
**Team Velocity:** [Story points completed]
**Sprint Goal Achievement:** [Fully/Partially/Not Achieved]

### Sprint Deliverables
**Completed User Stories:**
- [✅] #[issue] - [Story title] ([points] pts)
- [✅] #[issue] - [Story title] ([points] pts)
- [✅] #[issue] - [Story title] ([points] pts)

**Incomplete Items:**
- [⏳] #[issue] - [Story title] - Reason: [explanation]
- [⏳] #[issue] - [Story title] - Reason: [explanation]

**Technical Debt Addressed:**
- [Item 1]: [Description and impact]
- [Item 2]: [Description and impact]

## Phase Gate Assessment
**Phase Objectives Progress:**
- [ ] Objective 1: [Status and percentage complete]
- [ ] Objective 2: [Status and percentage complete]
- [ ] Objective 3: [Status and percentage complete]

**Phase Deliverables Status:**
- [✅] Deliverable 1: [Complete/In Progress/Not Started]
- [⏳] Deliverable 2: [Complete/In Progress/Not Started]
- [❌] Deliverable 3: [Complete/In Progress/Not Started]

**Gate Criteria Evaluation:**
- [ ] Technical criteria met
- [ ] Business criteria met
- [ ] Quality criteria met
- [ ] Risk criteria acceptable
- [ ] Stakeholder approval obtained

## Sprint-to-Phase Alignment
**How Sprint Contributed to Phase:**
- [Contribution 1]: [Specific deliverable or progress]
- [Contribution 2]: [Specific deliverable or progress]
- [Contribution 3]: [Specific deliverable or progress]

**Phase Milestone Impact:**
- [Milestone 1]: [Impact description - accelerated/on track/delayed]
- [Milestone 2]: [Impact description - accelerated/on track/delayed]

**Integration Success:**
- Sprint deliverables aligned with phase requirements: [Yes/No/Partially]
- Traditional stakeholders satisfied with agile output: [Yes/No/Partially]
- Agile team contributing effectively to phase goals: [Yes/No/Partially]

## Stakeholder Feedback
**Product Owner Feedback:**
- Satisfaction with sprint output: [Score/Comments]
- Business value delivered: [Assessment]
- Concerns or issues: [Any concerns]

**Traditional Stakeholders:**
- Phase progress satisfaction: [Score/Comments]
- Deliverable quality assessment: [Assessment]
- Governance compliance: [Assessment]

**Team Feedback:**
- Sprint experience: [Score/Comments]
- Phase pressure impact: [Assessment]
- Process improvement suggestions: [Suggestions]

## Metrics and Performance
**Agile Metrics:**
- Velocity: [Current] vs [Target] vs [Trend]
- Sprint Goal Achievement Rate: [Percentage]
- Story Points Burned Down: [Chart reference or description]
- Team Happiness Index: [Score]

**Traditional Metrics:**
- Schedule Performance Index (SPI): [Value]
- Cost Performance Index (CPI): [Value]
- Phase Completion Percentage: [Percentage]
- Quality Gate Pass Rate: [Percentage]

**Hybrid Metrics:**
- Sprint-to-Phase Alignment Score: [Custom metric]
- Stakeholder Satisfaction (Combined): [Score]
- Methodology Integration Effectiveness: [Assessment]

## Risk and Issue Management
**Sprint-Level Risks:**
- [Risk 1]: [Status and mitigation]
- [Risk 2]: [Status and mitigation]

**Phase-Level Risks:**
- [Risk 1]: [Status and mitigation]
- [Risk 2]: [Status and mitigation]

**Integration Risks:**
- [Risk related to methodology coordination]
- [Risk related to stakeholder alignment]

**Issues Escalated:**
- [Issue 1]: [Description and escalation path]
- [Issue 2]: [Description and escalation path]

## Quality Assessment
**Sprint Quality:**
- Definition of Done compliance: [Percentage]
- Defect rate: [Number/rate]
- User acceptance: [Feedback score]
- Technical debt added: [Assessment]

**Phase Quality:**
- Deliverable review status: [Pass/fail rates]
- Compliance verification: [Status]
- Audit readiness: [Assessment]
- Documentation quality: [Assessment]

## Decisions and Actions
**Phase Gate Decision:**
- [ ] Proceed to next phase
- [ ] Proceed with conditions
- [ ] Repeat phase activities
- [ ] Project review required

**Sprint Decisions:**
- Next sprint planning adjustments: [Changes needed]
- Team composition changes: [If any]
- Process improvements: [Retrospective outcomes]

**Integration Decisions:**
- Methodology balance adjustments: [More agile/more traditional]
- Stakeholder engagement changes: [Communication adjustments]
- Governance process updates: [Process changes]

## Action Items
**Immediate Actions (Next Sprint):**
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

**Phase Actions (Longer Term):**
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

**Process Improvement Actions:**
- [ ] [Improvement 1] - Owner: [Name] - Due: [Date]
- [ ] [Improvement 2] - Owner: [Name] - Due: [Date]

## Next Steps
**Sprint Planning:**
- Next sprint capacity: [Team availability]
- Priority adjustments: [Based on phase needs]
- Sprint goal proposal: [Alignment with phase objectives]

**Phase Planning:**
- Phase timeline adjustments: [Any changes needed]
- Resource reallocation: [If required]
- Stakeholder communication: [Updates needed]

**Integration Planning:**
- Methodology balance review: [Next review date]
- Process refinement: [Areas for improvement]
- Success metric updates: [Metric adjustments]

## Approvals
**Sprint Review Approval:**
- Product Owner: [Name] - [Approved/Conditional/Rejected] - [Date]
- Scrum Master: [Name] - [Comments] - [Date]

**Phase Gate Approval:**
- Phase Manager: [Name] - [Approved/Conditional/Rejected] - [Date]
- Steering Committee: [Status] - [Date]

**Hybrid Integration Approval:**
- Integration Lead: [Name] - [Comments] - [Date]
- PMO Review: [Status] - [Date]

## Lessons Learned
**Sprint Lessons:**
- [What worked well in the sprint]
- [What could be improved in future sprints]

**Phase Lessons:**
- [What worked well for phase progression]
- [What could be improved in phase management]

**Integration Lessons:**
- [What worked well in combining methodologies]
- [What could be improved in methodology integration]

## Attachments and References
- Sprint Burndown Chart: [Link or attachment]
- Phase Progress Dashboard: [Link or attachment]
- Demo Recording: [Link if available]
- Detailed Metrics Report: [Link or attachment]
- Stakeholder Feedback Summary: [Link or attachment]
```

## GitHub Actions Workflows

### .github/workflows/hybrid-automation.yml
```yaml
name: Hybrid Project Automation

on:
  schedule:
    # Run every Monday for sprint/phase coordination
    - cron: '0 8 * * MON'
  issues:
    types: [opened, labeled, closed]
  milestone:
    types: [created, closed]
  workflow_dispatch:
    inputs:
      action_type:
        description: 'Type of hybrid automation to run'
        required: true
        type: choice
        options:
        - sprint-planning
        - phase-review
        - integration-check

jobs:
  hybrid-coordination:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    
    steps:
      - name: Hybrid Project Coordination
        uses: actions/github-script@v7
        with:
          script: |
            const actionType = '${{ github.event.inputs.action_type }}' || 'auto';
            
            // Get all open issues with methodology labels
            const { data: allIssues } = await github.rest.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open',
              per_page: 100
            });
            
            // Categorize issues by methodology
            const agileIssues = allIssues.filter(issue => 
              issue.labels.some(label => 
                ['story', 'epic', 'sprint'].some(agileLabel => label.name.includes(agileLabel))
              )
            );
            
            const traditionalIssues = allIssues.filter(issue => 
              issue.labels.some(label => 
                ['work-package', 'deliverable', 'phase'].some(tradLabel => label.name.includes(tradLabel))
              )
            );
            
            const hybridIssues = allIssues.filter(issue => 
              issue.labels.some(label => label.name.includes('hybrid'))
            );
            
            // Get current milestones (both sprints and phases)
            const { data: milestones } = await github.rest.issues.listMilestones({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open'
            });
            
            const sprintMilestones = milestones.filter(m => m.title.toLowerCase().includes('sprint'));
            const phaseMilestones = milestones.filter(m => m.title.toLowerCase().includes('phase'));
            
            // Perform coordination based on action type
            if (actionType === 'sprint-planning' || (actionType === 'auto' && new Date().getDay() === 1)) {
              await performSprintPlanning();
            }
            
            if (actionType === 'phase-review' || context.eventName === 'milestone') {
              await performPhaseReview();
            }
            
            if (actionType === 'integration-check' || actionType === 'auto') {
              await performIntegrationCheck();
            }
            
            async function performSprintPlanning() {
              console.log('Performing hybrid sprint planning...');
              
              // Find current sprint
              const currentSprint = sprintMilestones.find(m => 
                new Date(m.due_on) > new Date() && 
                new Date() > new Date(new Date(m.due_on).getTime() - 14 * 24 * 60 * 60 * 1000)
              );
              
              if (!currentSprint) {
                console.log('No current sprint found');
                return;
              }
              
              // Get sprint issues
              const { data: sprintIssues } = await github.rest.issues.listForRepo({
                owner: context.repo.owner,
                repo: context.repo.repo,
                milestone: currentSprint.number,
                state: 'open'
              });
              
              // Check sprint-phase alignment
              const phaseAlignment = await checkSprintPhaseAlignment(sprintIssues, phaseMilestones);
              
              // Create sprint planning issue if needed
              if (sprintIssues.length > 0) {
                await github.rest.issues.create({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  title: `Sprint Planning - ${currentSprint.title} (Hybrid)`,
                  body: generateSprintPlanningBody(currentSprint, sprintIssues, phaseAlignment),
                  labels: ['sprint-planning', 'hybrid-governance', 'meeting'],
                  milestone: currentSprint.number
                });
              }
            }
            
            async function performPhaseReview() {
              console.log('Performing hybrid phase review...');
              
              // Find recently closed or approaching milestones
              const reviewMilestones = phaseMilestones.filter(m => {
                const dueDate = new Date(m.due_on);
                const now = new Date();
                const daysDiff = (dueDate - now) / (1000 * 60 * 60 * 24);
                return daysDiff <= 7 && daysDiff >= -7; // Within a week either direction
              });
              
              for (const milestone of reviewMilestones) {
                const { data: milestoneIssues } = await github.rest.issues.listForRepo({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  milestone: milestone.number,
                  state: 'all'
                });
                
                // Analyze phase completion
                const completion = analyzePhaseMilestone(milestoneIssues);
                
                // Create phase review issue
                await github.rest.issues.create({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  title: `Phase Review: ${milestone.title} (Hybrid)`,
                  body: generatePhaseReviewBody(milestone, milestoneIssues, completion),
                  labels: ['phase-review', 'hybrid-governance', 'gate-review']
                });
              }
            }
            
            async function performIntegrationCheck() {
              console.log('Performing hybrid integration check...');
              
              // Check for methodology conflicts
              const conflicts = await identifyMethodologyConflicts();
              
              // Check stakeholder alignment
              const alignment = await checkStakeholderAlignment();
              
              // Generate integration health report
              if (conflicts.length > 0 || alignment.issues.length > 0) {
                await github.rest.issues.create({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  title: `Hybrid Integration Health Check - ${new Date().toISOString().slice(0, 10)}`,
                  body: generateIntegrationHealthBody(conflicts, alignment),
                  labels: ['integration-check', 'hybrid-governance', 'health-check']
                });
              }
            }
            
            async function checkSprintPhaseAlignment(sprintIssues, phaseMilestones) {
              // Logic to check how sprint work aligns with phase objectives
              const alignment = {
                totalIssues: sprintIssues.length,
                phaseAligned: 0,
                pureAgile: 0,
                conflicts: []
              };
              
              sprintIssues.forEach(issue => {
                const isPhaseAligned = issue.labels.some(label => 
                  label.name.includes('phase') || label.name.includes('deliverable')
                );
                
                if (isPhaseAligned) {
                  alignment.phaseAligned++;
                } else {
                  alignment.pureAgile++;
                }
              });
              
              return alignment;
            }
            
            function analyzePhaseMilestone(issues) {
              const total = issues.length;
              const completed = issues.filter(i => i.state === 'closed').length;
              const agileWork = issues.filter(i => 
                i.labels.some(l => ['story', 'epic'].some(agileLabel => l.name.includes(agileLabel)))
              ).length;
              const traditionalWork = issues.filter(i => 
                i.labels.some(l => ['work-package', 'deliverable'].some(tradLabel => l.name.includes(tradLabel)))
              ).length;
              
              return {
                completionRate: total > 0 ? (completed / total * 100).toFixed(1) : 0,
                agileWorkPercentage: total > 0 ? (agileWork / total * 100).toFixed(1) : 0,
                traditionalWorkPercentage: total > 0 ? (traditionalWork / total * 100).toFixed(1) : 0,
                totalIssues: total,
                completedIssues: completed
              };
            }
            
            async function identifyMethodologyConflicts() {
              // Logic to identify potential conflicts between agile and traditional approaches
              const conflicts = [];
              
              // Check for issues with conflicting methodology labels
              const conflictIssues = allIssues.filter(issue => {
                const hasAgileLabel = issue.labels.some(l => ['story', 'epic', 'sprint'].some(al => l.name.includes(al)));
                const hasTraditionalLabel = issue.labels.some(l => ['work-package', 'deliverable', 'phase'].some(tl => l.name.includes(tl)));
                return hasAgileLabel && hasTraditionalLabel && !issue.labels.some(l => l.name.includes('hybrid'));
              });
              
              if (conflictIssues.length > 0) {
                conflicts.push({
                  type: 'methodology-labeling',
                  description: `${conflictIssues.length} issues have conflicting methodology labels`,
                  issues: conflictIssues.map(i => `#${i.number}`)
                });
              }
              
              return conflicts;
            }
            
            async function checkStakeholderAlignment() {
              // Logic to check stakeholder alignment between agile and traditional approaches
              return {
                status: 'healthy', // This would be more sophisticated in real implementation
                issues: [],
                recommendations: []
              };
            }
            
            function generateSprintPlanningBody(sprint, issues, alignment) {
              return `
              # Sprint Planning - ${sprint.title} (Hybrid Approach)
              
              ## Sprint Overview
              - **Duration:** ${sprint.description}
              - **Total Issues:** ${issues.length}
              - **Phase Alignment:** ${alignment.phaseAligned}/${alignment.totalIssues} issues aligned with phase objectives
              
              ## Hybrid Coordination
              **Agile Work (${alignment.pureAgile} items):**
              ${issues.filter(i => !i.labels.some(l => l.name.includes('phase'))).map(i => `- [ ] #${i.number} - ${i.title}`).join('\n')}
              
              **Phase-Aligned Work (${alignment.phaseAligned} items):**
              ${issues.filter(i => i.labels.some(l => l.name.includes('phase'))).map(i => `- [ ] #${i.number} - ${i.title}`).join('\n')}
              
              ## Sprint-Phase Integration
              - This sprint contributes to: [Phase objectives]
              - Traditional stakeholder touchpoints: [List meetings/reviews]
              - Agile ceremonies schedule: [Sprint planning, daily standups, review, retro]
              
              ## Success Criteria
              - [ ] Sprint goal achieved
              - [ ] Phase milestone progress maintained
              - [ ] Both agile and traditional stakeholders satisfied
              `;
            }
            
            function generatePhaseReviewBody(milestone, issues, completion) {
              return `
              # Phase Review: ${milestone.title} (Hybrid Approach)
              
              ## Phase Completion Summary
              - **Overall Completion:** ${completion.completionRate}%
              - **Total Work Items:** ${completion.totalIssues}
              - **Completed Items:** ${completion.completedIssues}
              
              ## Methodology Breakdown
              - **Agile Work:** ${completion.agileWorkPercentage}% of phase work
              - **Traditional Work:** ${completion.traditionalWorkPercentage}% of phase work
              
              ## Outstanding Work
              ${issues.filter(i => i.state === 'open').map(i => `- [ ] #${i.number} - ${i.title}`).join('\n')}
              
              ## Hybrid Integration Assessment
              - Methodology coordination: [Assessment]
              - Stakeholder satisfaction: [Both agile and traditional]
              - Process effectiveness: [Lessons learned]
              
              ## Recommendations
              ${completion.completionRate >= 90 ? 
                '✅ Phase ready for gate review' : 
                '⚠️ Additional work needed before gate review'
              }
              `;
            }
            
            function generateIntegrationHealthBody(conflicts, alignment) {
              return `
              # Hybrid Integration Health Check
              
              ## Methodology Conflicts
              ${conflicts.map(c => `- **${c.type}:** ${c.description}`).join('\n')}
              
              ## Stakeholder Alignment
              - **Status:** ${alignment.status}
              - **Issues:** ${alignment.issues.join(', ') || 'None identified'}
              
              ## Recommendations
              ${alignment.recommendations.map(r => `- ${r}`).join('\n')}
              
              ## Action Items
              - [ ] Review methodology labeling
              - [ ] Stakeholder alignment check
              - [ ] Process adjustment if needed
              `;
            }
```

### .github/workflows/phase-gate-sprint.yml
```yaml
name: Phase Gate Sprint Integration

on:
  milestone:
    types: [closed]
  schedule:
    # Run every Friday for weekly integration check
    - cron: '0 17 * * FRI'
  workflow_dispatch:
    inputs:
      integration_type:
        description: 'Type of integration check'
        required: true
        type: choice
        options:
        - phase-gate-review
        - sprint-phase-alignment
        - stakeholder-integration

jobs:
  phase-sprint-integration:
    runs-on: ubuntu-latest
    permissions:
      issues: write
      contents: read
    
    steps:
      - name: Phase Gate Sprint Integration
        uses: actions/github-script@v7
        with:
          script: |
            const integrationType = '${{ github.event.inputs.integration_type }}' || 'auto';
            
            // Get milestone information
            let targetMilestone;
            if (context.eventName === 'milestone') {
              targetMilestone = context.payload.milestone;
            }
            
            // Get all issues and milestones
            const { data: allIssues } = await github.rest.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'all',
              per_page: 100
            });
            
            const { data: milestones } = await github.rest.issues.listMilestones({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'all'
            });
            
            // Separate sprints and phases
            const sprints = milestones.filter(m => m.title.toLowerCase().includes('sprint'));
            const phases = milestones.filter(m => m.title.toLowerCase().includes('phase'));
            
            if (integrationType === 'phase-gate-review' || context.eventName === 'milestone') {
              await performPhaseGateReview();
            }
            
            if (integrationType === 'sprint-phase-alignment' || integrationType === 'auto') {
              await checkSprintPhaseAlignment();
            }
            
            if (integrationType === 'stakeholder-integration' || integrationType === 'auto') {
              await assessStakeholderIntegration();
            }
            
            async function performPhaseGateReview() {
              if (!targetMilestone) return;
              
              console.log(`Performing phase gate review for ${targetMilestone.title}`);
              
              // Get all issues in the milestone
              const { data: milestoneIssues } = await github.rest.issues.listForRepo({
                owner: context.repo.owner,
                repo: context.repo.repo,
                milestone: targetMilestone.number,
                state: 'all'
              });
              
              // Analyze completion by methodology
              const analysis = analyzeHybridCompletion(milestoneIssues);
              
              // Generate comprehensive gate review
              const gateReviewBody = `
              # Hybrid Phase Gate Review: ${targetMilestone.title}
              
              ## Gate Review Summary
              **Review Date:** ${new Date().toDateString()}
              **Gate Status:** ${analysis.gateStatus}
              **Overall Completion:** ${analysis.completionRate}%
              
              ## Methodology Performance
              
              ### Agile Component (${analysis.agileItems} items)
              - **Completed:** ${analysis.agileCompleted}/${analysis.agileItems} (${analysis.agileCompletionRate}%)
              - **Sprint Integration:** ${analysis.sprintIntegration}
              - **User Value Delivered:** ${analysis.userValueAssessment}
              
              ### Traditional Component (${analysis.traditionalItems} items)
              - **Completed:** ${analysis.traditionalCompleted}/${analysis.traditionalItems} (${analysis.traditionalCompletionRate}%)
              - **Deliverable Quality:** ${analysis.deliverableQuality}
              - **Compliance Status:** ${analysis.complianceStatus}
              
              ### Hybrid Integration (${analysis.hybridItems} items)
              - **Integration Effectiveness:** ${analysis.integrationEffectiveness}
              - **Cross-methodology Dependencies:** ${analysis.dependencyStatus}
              - **Stakeholder Alignment:** ${analysis.stakeholderAlignment}
              
              ## Gate Decision Factors
              
              **Ready to Proceed If:**
              - [ ] Overall completion ≥ 95%
              - [ ] Critical agile features delivered
              - [ ] Traditional deliverables approved
              - [ ] Stakeholder acceptance obtained
              - [ ] Integration risks mitigated
              
              **Current Status:**
              ${analysis.recommendations.map(r => `- ${r}`).join('\n')}
              
              ## Next Phase Preparation
              **Agile Readiness:**
              - Sprint capacity for next phase: [Assessment]
              - Product backlog refinement: [Status]
              - Team composition: [Any changes needed]
              
              **Traditional Readiness:**
              - Next phase planning: [Status]
              - Resource allocation: [Confirmed/Pending]
              - Vendor coordination: [Status]
              
              **Integration Readiness:**
              - Hybrid process refinements: [Lessons learned applied]
              - Stakeholder engagement model: [Updates needed]
              - Success metrics adjustment: [Any changes]
              
              ## Decision
              **Gate Decision:** ${analysis.gateDecision}
              **Conditions (if any):** ${analysis.conditions || 'None'}
              **Next Review Date:** ${analysis.nextReviewDate}
              `;
              
              // Create gate review issue
              await github.rest.issues.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                title: `Phase Gate Review: ${targetMilestone.title} - ${analysis.gateDecision}`,
                body: gateReviewBody,
                labels: ['phase-gate', 'hybrid-governance', 'gate-review', analysis.gateDecision.toLowerCase()]
              });
            }
            
            async function checkSprintPhaseAlignment() {
              console.log('Checking sprint-phase alignment...');
              
              // Find current/recent sprints and their phase alignment
              const recentSprints = sprints.filter(s => {
                const dueDate = new Date(s.due_on);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return dueDate > weekAgo;
              });
              
              for (const sprint of recentSprints) {
                const { data: sprintIssues } = await github.rest.issues.listForRepo({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  milestone: sprint.number,
                  state: 'all'
                });
                
                const alignment = assessSprintPhaseAlignment(sprintIssues, phases);
                
                if (alignment.needsAttention) {
                  await github.rest.issues.create({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    title: `Sprint-Phase Alignment Review: ${sprint.title}`,
                    body: generateAlignmentReviewBody(sprint, alignment),
                    labels: ['alignment-review', 'hybrid-governance', 'process-improvement']
                  });
                }
              }
            }
            
            async function assessStakeholderIntegration() {
              console.log('Assessing stakeholder integration...');
              
              // This would assess how well agile and traditional stakeholders are integrated
              // For now, create a placeholder assessment
              const assessment = {
                agileStakeholderSatisfaction: 'Good',
                traditionalStakeholderSatisfaction: 'Good',
                integrationChallenges: [],
                recommendations: [
                  'Continue current integration approach',
                  'Monitor stakeholder feedback closely'
                ]
              };
              
              // Only create issue if there are challenges
              if (assessment.integrationChallenges.length > 0) {
                await github.rest.issues.create({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  title: `Stakeholder Integration Assessment - ${new Date().toISOString().slice(0, 10)}`,
                  body: generateStakeholderAssessmentBody(assessment),
                  labels: ['stakeholder-assessment', 'hybrid-governance', 'communication']
                });
              }
            }
            
            function analyzeHybridCompletion(issues) {
              const total = issues.length;
              const completed = issues.filter(i => i.state === 'closed').length;
              
              const agileIssues = issues.filter(i => 
                i.labels.some(l => ['story', 'epic'].some(al => l.name.includes(al)))
              );
              const traditionalIssues = issues.filter(i => 
                i.labels.some(l => ['work-package', 'deliverable'].some(tl => l.name.includes(tl)))
              );
              const hybridIssues = issues.filter(i => 
                i.labels.some(l => l.name.includes('hybrid'))
              );
              
              const agileCompleted = agileIssues.filter(i => i.state === 'closed').length;
              const traditionalCompleted = traditionalIssues.filter(i => i.state === 'closed').length;
              const hybridCompleted = hybridIssues.filter(i => i.state === 'closed').length;
              
              const completionRate = total > 0 ? (completed / total * 100).toFixed(1) : 0;
              const agileCompletionRate = agileIssues.length > 0 ? (agileCompleted / agileIssues.length * 100).toFixed(1) : 0;
              const traditionalCompletionRate = traditionalIssues.length > 0 ? (traditionalCompleted / traditionalIssues.length * 100).toFixed(1) : 0;
              
              const gateDecision = completionRate >= 95 ? 'APPROVED' : 
                                 completionRate >= 80 ? 'CONDITIONAL' : 'REJECTED';
              
              return {
                completionRate,
                agileItems: agileIssues.length,
                traditionalItems: traditionalIssues.length,
                hybridItems: hybridIssues.length,
                agileCompleted,
                traditionalCompleted,
                hybridCompleted,
                agileCompletionRate,
                traditionalCompletionRate,
                gateStatus: completionRate >= 95 ? '🟢 READY' : 
                           completionRate >= 80 ? '🟡 CAUTION' : '🔴 NOT READY',
                gateDecision,
                sprintIntegration: agileCompletionRate >= 80 ? 'Effective' : 'Needs Improvement',
                deliverableQuality: traditionalCompletionRate >= 90 ? 'Acceptable' : 'Needs Review',
                integrationEffectiveness: 'Good', // Simplified
                stakeholderAlignment: 'Aligned', // Simplified
                recommendations: generateRecommendations(completionRate, agileCompletionRate, traditionalCompletionRate),
                conditions: completionRate >= 80 && completionRate < 95 ? 'Complete remaining critical items' : null,
                nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
              };
            }
            
            function generateRecommendations(overall, agile, traditional) {
              const recommendations = [];
              
              if (overall >= 95) {
                recommendations.push('✅ All criteria met - proceed to next phase');
              } else if (overall >= 80) {
                recommendations.push('⚠️ Address outstanding items before proceeding');
                if (agile < 80) recommendations.push('⚠️ Focus on completing agile user stories');
                if (traditional < 90) recommendations.push('⚠️ Focus on traditional deliverable approval');
              } else {
                recommendations.push('🛑 Significant work remaining - do not proceed');
                recommendations.push('📋 Conduct detailed review of incomplete items');
                recommendations.push('🔄 Consider process improvements');
              }
              
              return recommendations;
            }
            
            function assessSprintPhaseAlignment(sprintIssues, phases) {
              // Simplified alignment assessment
              const phaseAlignedIssues = sprintIssues.filter(issue => 
                issue.labels.some(label => label.name.includes('phase'))
              );
              
              const alignmentPercentage = sprintIssues.length > 0 ? 
                (phaseAlignedIssues.length / sprintIssues.length * 100).toFixed(1) : 0;
              
              return {
                alignmentPercentage,
                totalSprintItems: sprintIssues.length,
                phaseAlignedItems: phaseAlignedIssues.length,
                needsAttention: alignmentPercentage < 50,
                recommendations: alignmentPercentage < 50 ? 
                  ['Increase phase alignment in sprint planning', 'Review sprint goals against phase objectives'] : 
                  ['Maintain current alignment approach']
              };
            }
            
            function generateAlignmentReviewBody(sprint, alignment) {
              return `
              # Sprint-Phase Alignment Review: ${sprint.title}
              
              ## Alignment Analysis
              - **Sprint Items:** ${alignment.totalSprintItems}
              - **Phase-Aligned Items:** ${alignment.phaseAlignedItems}
              - **Alignment Percentage:** ${alignment.alignmentPercentage}%
              
              ## Recommendations
              ${alignment.recommendations.map(r => `- ${r}`).join('\n')}
              
              ## Action Items
              - [ ] Review sprint planning process
              - [ ] Improve phase objective communication
              - [ ] Update sprint goal alignment
              `;
            }
            
            function generateStakeholderAssessmentBody(assessment) {
              return `
              # Stakeholder Integration Assessment
              
              ## Satisfaction Levels
              - **Agile Stakeholders:** ${assessment.agileStakeholderSatisfaction}
              - **Traditional Stakeholders:** ${assessment.traditionalStakeholderSatisfaction}
              
              ## Integration Challenges
              ${assessment.integrationChallenges.map(c => `- ${c}`).join('\n') || 'None identified'}
              
              ## Recommendations
              ${assessment.recommendations.map(r => `- ${r}`).join('\n')}
              `;
            }
```

## Project Board Configuration

### Hybrid Project Board Setup
```yaml
Board Name: "Hybrid Project Management"
Board Type: "Team Planning"

Custom Fields:
  methodology:
    type: "single_select"
    options: ["Agile", "Traditional", "Hybrid"]
  
  story_points:
    type: "single_select"
    options: ["1", "2", "3", "5", "8", "13", "21"]
  
  process_group:
    type: "single_select"
    options: ["Initiating", "Planning", "Executing", "Monitoring", "Closing"]
  
  phase_gate:
    type: "single_select"
    options: ["Gate 1", "Gate 2", "Gate 3", "Gate 4", "Gate 5"]
  
  sprint_alignment:
    type: "single_select"
    options: ["High", "Medium", "Low", "Not Applicable"]
  
  stakeholder_type:
    type: "single_select"
    options: ["Agile Stakeholder", "Traditional Stakeholder", "Both"]
  
  integration_complexity:
    type: "single_select"
    options: ["Simple", "Moderate", "Complex"]

Columns:
  - name: "📋 Hybrid Backlog"
    description: "All work items (agile and traditional)"
  
  - name: "🎯 Sprint/Phase Planning"
    description: "Items being planned for sprints or phases"
  
  - name: "🔄 In Progress (Agile)"
    description: "Agile work in current sprint"
    wip_limit: 8
  
  - name: "📝 In Progress (Traditional)"
    description: "Traditional work packages being executed"
    wip_limit: 5
  
  - name: "🔗 Integration Work"
    description: "Work requiring both methodologies"
    wip_limit: 3
  
  - name: "👀 Review/Approval"
    description: "Work under review (any methodology)"
    wip_limit: 6
  
  - name: "⏳ Waiting/Blocked"
    description: "Work waiting for dependencies"
  
  - name: "✅ Done"
    description: "Completed work (any methodology)"

Automation Rules:
  - trigger: "issue opened with label 'story'"
    action: "add to Hybrid Backlog and set methodology to Agile"
  
  - trigger: "issue opened with label 'work-package'"
    action: "add to Hybrid Backlog and set methodology to Traditional"
  
  - trigger: "issue opened with label 'hybrid'"
    action: "add to Integration Work"
  
  - trigger: "issue labeled 'in-sprint'"
    action: "move to In Progress (Agile)"
  
  - trigger: "issue labeled 'in-progress' and has 'work-package' label"
    action: "move to In Progress (Traditional)"
  
  - trigger: "issue labeled 'needs-review'"
    action: "move to Review/Approval"
  
  - trigger: "issue labeled 'blocked'"
    action: "move to Waiting/Blocked"
  
  - trigger: "issue closed"
    action: "move to Done"
```

---

*These Hybrid GitHub templates provide a sophisticated approach to managing projects that combine agile and traditional methodologies. The templates support seamless integration between approaches while maintaining the benefits of both methodologies.*

