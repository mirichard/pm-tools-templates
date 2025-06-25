# Story Writing Checklist

## User Story Quality Checklist

### Pre-Writing Preparation
- [ ] **User Research Complete**: Understand target users and their needs
- [ ] **Acceptance Criteria Defined**: Clear definition of done
- [ ] **Value Proposition Clear**: Understand business and user value
- [ ] **Dependencies Identified**: Know what this story depends on
- [ ] **Technical Feasibility Confirmed**: Basic technical approach understood

### INVEST Criteria Check

#### Independent
- [ ] **Self-Contained**: Story can be delivered independently
- [ ] **Minimal Dependencies**: Limited dependencies on other stories
- [ ] **Testable Isolation**: Can be tested without waiting for other stories
- [ ] **Deployment Ready**: Can be deployed separately if needed

#### Negotiable
- [ ] **Flexible Implementation**: Multiple ways to implement the solution
- [ ] **Open to Discussion**: Details can be refined through conversation
- [ ] **Not Over-Specified**: Doesn't dictate specific UI or technical implementation
- [ ] **Collaborative**: Written to encourage team discussion

#### Valuable
- [ ] **User Value Clear**: Obvious benefit to end users
- [ ] **Business Value Defined**: Measurable business impact
- [ ] **Priority Justified**: Clear reason for priority level
- [ ] **Outcome Focused**: Describes desired outcome, not just output

#### Estimable
- [ ] **Well Understood**: Team understands the scope and complexity
- [ ] **Appropriately Sized**: Not too big or too small for estimation
- [ ] **Technical Approach Known**: Basic implementation approach clear
- [ ] **Unknowns Identified**: Any uncertainties documented and addressed

#### Small
- [ ] **Completable in Sprint**: Can be finished within one sprint
- [ ] **2-5 Day Effort**: Typically takes 2-5 person-days
- [ ] **Single Feature Focus**: Focused on one specific capability
- [ ] **Not Epic-Sized**: Broken down from larger epics

#### Testable
- [ ] **Clear Acceptance Criteria**: Specific, measurable criteria defined
- [ ] **Testable Conditions**: Conditions that can be verified
- [ ] **Demo-able**: Can be demonstrated to stakeholders
- [ ] **Acceptance Test Ready**: Ready for acceptance testing

### Story Structure Quality

#### User Story Format
- [ ] **Follows Template**: "As a [user], I want [goal] so that [benefit]"
- [ ] **Specific User Role**: Clear, specific user persona identified
- [ ] **Clear Goal**: Unambiguous description of what user wants
- [ ] **Explicit Benefit**: Clear value or benefit statement

#### Example Quality Check:
```
✅ Good: "As a sales manager, I want to view my team's quarterly performance dashboard so that I can identify coaching opportunities."

❌ Poor: "As a user, I want reports so that I can see data."
```

### Acceptance Criteria Quality

#### Criteria Structure
- [ ] **Given-When-Then Format**: Uses BDD format where appropriate
- [ ] **Specific Conditions**: Clear, specific conditions defined
- [ ] **Measurable Outcomes**: Results that can be measured or verified
- [ ] **Edge Cases Covered**: Important edge cases addressed
- [ ] **Negative Cases Included**: What should NOT happen

#### Acceptance Criteria Template:
```
Acceptance Criteria:
1. Given [context/precondition]
   When [action/event]
   Then [expected outcome]

2. Given [context/precondition]
   When [action/event]
   Then [expected outcome]

Additional Considerations:
- [Performance requirements]
- [Security requirements]
- [Accessibility requirements]
- [Browser/device compatibility]
```

### Content Quality Checklist

#### Clarity and Completeness
- [ ] **No Ambiguity**: Language is clear and unambiguous
- [ ] **Complete Information**: All necessary information provided
- [ ] **Context Provided**: Sufficient background and context
- [ ] **Assumptions Stated**: Key assumptions documented

#### Technical Considerations
- [ ] **Non-Functional Requirements**: Performance, security, etc. addressed
- [ ] **Integration Points**: External system interactions defined
- [ ] **Data Requirements**: Data needs clearly specified
- [ ] **Error Handling**: Error conditions and handling specified

#### User Experience Focus
- [ ] **User Journey Mapped**: Fits within broader user journey
- [ ] **Usability Considered**: User experience implications thought through
- [ ] **Accessibility Included**: Accessibility requirements addressed
- [ ] **Mobile Responsive**: Mobile experience considered

### Definition of Ready Checklist

#### Story Readiness
- [ ] **User Story Written**: Complete user story with clear format
- [ ] **Acceptance Criteria Defined**: Detailed acceptance criteria
- [ ] **Estimated by Team**: Team has provided story point estimate
- [ ] **Dependencies Resolved**: Blocking dependencies addressed
- [ ] **Mockups/Wireframes**: Visual designs available if needed

#### Business Readiness
- [ ] **Business Value Clear**: Value proposition articulated
- [ ] **Priority Assigned**: Priority level determined
- [ ] **Stakeholder Buy-in**: Key stakeholders aligned
- [ ] **Success Metrics Defined**: How success will be measured

#### Technical Readiness
- [ ] **Technical Approach**: Basic technical approach discussed
- [ ] **Architecture Impact**: Impact on system architecture considered
- [ ] **Test Strategy**: Testing approach outlined
- [ ] **Performance Criteria**: Performance requirements specified

### Story Enhancement Checklist

#### Supporting Documentation
- [ ] **User Personas**: Relevant personas referenced
- [ ] **User Journey Maps**: Journey context provided
- [ ] **Wireframes/Mockups**: Visual designs attached
- [ ] **API Specifications**: Technical specifications included
- [ ] **Research Findings**: User research referenced

#### Risk Assessment
- [ ] **Technical Risks**: Technical risks identified
- [ ] **Business Risks**: Business risks documented
- [ ] **Mitigation Strategies**: Risk mitigation approaches defined
- [ ] **Contingency Plans**: Backup plans if story fails

#### Validation Planning
- [ ] **Success Metrics**: KPIs and metrics defined
- [ ] **Testing Strategy**: How story will be validated
- [ ] **User Feedback Plan**: How user feedback will be collected
- [ ] **Analytics Setup**: Tracking and measurement plan

## Story Writing Best Practices

### Writing Effective User Stories

#### User-Centric Language
✅ **Do:**
- Use specific user roles (not just "user")
- Focus on user goals and outcomes
- Include emotional and functional benefits
- Use active voice

❌ **Don't:**
- Write from system perspective
- Focus on features instead of benefits
- Use technical jargon
- Make assumptions about user knowledge

#### Example Transformations:
```
Before: "The system needs a login feature"
After: "As a returning customer, I want to log in to my account so that I can access my order history and saved preferences"

Before: "Add shopping cart functionality"
After: "As an online shopper, I want to add items to a cart so that I can review my purchases before checkout"
```

### Common Story Writing Mistakes

#### Overly Technical Stories
❌ **Problem**: "As a developer, I want to implement OAuth 2.0 authentication"
✅ **Solution**: "As a user, I want to securely log in using my Google account so that I don't need to remember another password"

#### Too Large/Epic-sized
❌ **Problem**: "As a user, I want a complete e-commerce experience"
✅ **Solution**: Break into smaller stories like:
- "As a customer, I want to search for products by category"
- "As a customer, I want to add items to my shopping cart"
- "As a customer, I want to complete checkout with my credit card"

#### Missing User Value
❌ **Problem**: "As a user, I want to see a dashboard"
✅ **Solution**: "As a sales manager, I want to see my team's performance dashboard so that I can identify who needs additional support"

#### Vague Acceptance Criteria
❌ **Problem**: "The feature should work well"
✅ **Solution**: "Given I'm on the search page, when I enter 'red shoes' and click search, then I see results filtered to red-colored shoes with page load time under 2 seconds"

### Story Refinement Process

#### Continuous Improvement
- [ ] **Regular Review**: Review stories for quality improvements
- [ ] **Team Feedback**: Collect feedback from development team
- [ ] **User Feedback**: Incorporate feedback from actual users
- [ ] **Retrospective Learnings**: Apply retrospective insights

#### Refinement Activities
- [ ] **Story Splitting**: Break large stories into smaller ones
- [ ] **Criteria Enhancement**: Improve acceptance criteria based on learnings
- [ ] **Context Addition**: Add missing context and background
- [ ] **Risk Mitigation**: Address identified risks and dependencies

### Collaboration Checklist

#### Stakeholder Engagement
- [ ] **User Involvement**: Real users consulted in story creation
- [ ] **Business Stakeholder Review**: Business stakeholders validate stories
- [ ] **Development Team Input**: Technical team provides feasibility input
- [ ] **UX Designer Collaboration**: UX considerations incorporated

#### Team Alignment
- [ ] **Shared Understanding**: Team has common understanding
- [ ] **Questions Answered**: All team questions addressed
- [ ] **Assumptions Validated**: Key assumptions confirmed
- [ ] **Conflicts Resolved**: Any conflicting requirements resolved

## Quality Gates

### Story Approval Process

#### Level 1: Basic Quality
- [ ] Story follows INVEST criteria
- [ ] Acceptance criteria are clear
- [ ] User value is evident
- [ ] Story is appropriately sized

#### Level 2: Enhanced Quality
- [ ] Supporting documentation complete
- [ ] Dependencies identified and managed
- [ ] Risk assessment completed
- [ ] Success metrics defined

#### Level 3: Ready for Development
- [ ] Team has estimated the story
- [ ] Technical approach is clear
- [ ] All questions have been answered
- [ ] Stakeholders have approved

### Red Flags to Avoid

#### Content Red Flags
🚩 **Vague language**: "Enhance," "improve," "better"
🚩 **Technical focus**: Written from system perspective
🚩 **No clear user**: Generic "user" without specificity
🚩 **Missing value**: No clear benefit stated
🚩 **Too large**: Story that takes weeks to complete

#### Process Red Flags
🚩 **Written in isolation**: No team or stakeholder input
🚩 **Never refined**: No refinement or improvement over time
🚩 **No validation**: No plan for measuring success
🚩 **Conflicting requirements**: Contradictory acceptance criteria
🚩 **Blockers ignored**: Dependencies not addressed

## Tools and Templates

### Story Template
```
Title: [Concise, action-oriented title]

User Story:
As a [specific user role]
I want [clear goal/capability]
So that [specific benefit/value]

Background:
[Context and background information]

Acceptance Criteria:
1. Given [context] when [action] then [outcome]
2. Given [context] when [action] then [outcome]
3. [Additional criteria as needed]

Notes:
- [Additional context, constraints, or considerations]
- [Links to mockups, research, or related stories]

Definition of Done:
- [ ] [Specific completion criteria]
- [ ] [Testing requirements]
- [ ] [Documentation requirements]
```

### Review Checklist Summary
```
□ INVEST Criteria Met
□ Clear User Story Format
□ Specific Acceptance Criteria
□ Appropriate Size
□ Clear Value Proposition
□ Dependencies Identified
□ Team Understanding
□ Stakeholder Approval
□ Ready for Development
```

---

**Template Owner**: [Product Owner Name]  
**Last Updated**: [Date]  
**Review Cycle**: Monthly  
**Team Training**: [Date of last training]

*Ensuring high-quality user stories for successful product development*

