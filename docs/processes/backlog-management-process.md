# Backlog Management Process

**Version:** 1.0  
**Effective Date:** July 24, 2025  
**Review Cycle:** Quarterly  
**Process Owner:** Product Owner  

## 📖 Overview

This document establishes standardized backlog management practices for the pm-tools-templates repository, fully aligned with:
- **PMI PMBOK® Guide 7th Edition** - Work Performance Information and Monitoring processes
- **PMI Agile Practice Guide** - Backlog preparation and refinement practices  
- **Scrum Alliance** - Product Backlog Management and Sprint Planning guidelines
- **Modern Open Source Standards** - Transparency, community involvement, and continuous improvement

## 🎯 Process Objectives

### Primary Goals
1. **Maintain Healthy Backlog** - Ensure backlog remains manageable, prioritized, and actionable
2. **Enable Predictable Planning** - Support sprint planning and release forecasting
3. **Promote Transparency** - Provide clear visibility into work priorities and progress
4. **Support Continuous Improvement** - Regular retrospectives and process refinement

### Alignment with Standards
- **PMI PMBOK® 4.5.2.3** - Work Performance Information for decision-making
- **PMI Agile Practice Guide 5.2.8** - Backlog preparation and refinement
- **Scrum Guide** - Product Backlog Management and Definition of Ready

---

## 🗓️ Weekly Triage Process

### **Frequency & Timing**
- **Schedule:** Every Tuesday, 10:00 AM EST
- **Duration:** 60 minutes maximum
- **Format:** Synchronous video call + asynchronous GitHub review

*Rationale: PMI Agile Practice Guide emphasizes regular cadence for backlog refinement (typically weekly), ensuring work remains relevant and prioritized.*

### **Roles & Responsibilities**

#### **Product Owner** (Primary Decision Maker)
- **PMI Alignment:** Responsible for Work Performance Information analysis and priority decisions
- **Responsibilities:**
  - Final prioritization decisions
  - Accept/reject issue proposals
  - Validate Definition of Ready criteria
  - Approve epic sizing and breakdown

#### **Project Manager/Scrum Master** (Process Facilitator)
- **Scrum Alliance Alignment:** Facilitates backlog refinement and removes impediments
- **Responsibilities:**
  - Facilitate triage meetings
  - Ensure process adherence
  - Track metrics and health indicators
  - Escalate process issues

#### **Contributors** (Technical Input)
- **Responsibilities:**
  - Provide effort estimates
  - Technical feasibility assessment
  - Implementation approach recommendations
  - Dependency identification

### **Weekly Triage Agenda**

#### **Pre-Meeting Preparation (15 minutes)**
1. **Automated Report Review** - Review backlog health dashboard
2. **New Issues Assessment** - Review issues created since last triage
3. **Stale Issue Identification** - Issues >30 days without activity

#### **Meeting Structure (45 minutes)**

##### **Phase 1: Health Check (10 minutes)**
- Review backlog metrics dashboard
- Identify process issues or blockers
- Confirm agenda priorities

*PMI Reference: PMBOK® 4.5 Monitor and Control Project Work - Regular performance reviews*

##### **Phase 2: New Issue Triage (20 minutes)**
- Apply **Definition of Ready** criteria:
  - [ ] Clear, actionable description
  - [ ] Acceptance criteria defined
  - [ ] Effort estimate provided
  - [ ] Dependencies identified
  - [ ] Appropriate theme/epic assignment

*Scrum Alliance Reference: Product Backlog refinement ensures items are "Ready" for Sprint Planning*

##### **Phase 3: Epic Size Review (10 minutes)**
- Identify epics exceeding 15-20 issue limit
- Plan epic breakdown or closure
- Validate epic scope alignment

*PMI Reference: PMBOK® 5.4 Create WBS - Decomposition to manageable work components*

##### **Phase 4: Priority Adjustment (5 minutes)**
- Reorder high-priority items
- Confirm next sprint candidates
- Address urgent escalations

### **Decision Criteria Matrix**

| Criterion | Weight | PMI/Scrum Reference |
|-----------|--------|-------------------|
| Strategic Alignment | 30% | PMBOK® 1.2.6.3 - Strategic alignment |
| User Value | 25% | Agile Practice Guide - Value delivery |
| Technical Feasibility | 20% | PMBOK® 11.2 - Risk assessment |
| Resource Availability | 15% | PMBOK® 9.2 - Resource management |
| Dependencies | 10% | Scrum Guide - Sprint Planning |

### **Post-Meeting Actions (Within 24 hours)**
1. **Update Issue Labels** - Apply triage decisions
2. **Epic Breakdown** - Create child issues for oversized epics
3. **Communication** - Notify stakeholders of priority changes
4. **Metrics Update** - Record triage outcomes

---

## 📏 Epic Size Guidelines

### **Size Limits & Rationale**

#### **Maximum Epic Size: 15-20 Issues**
- **PMI Justification:** PMBOK® 5.4.2.1 - Work packages should be manageable and measurable
- **Scrum Alliance Justification:** Large backlog items should be broken down for Sprint Planning effectiveness
- **Practical Benefits:**
  - Enables accurate progress tracking
  - Supports sprint planning predictability
  - Reduces cognitive overhead
  - Facilitates parallel development

#### **Recommended Epic Breakdown**
```
Epic (15-20 issues max)
├── User Stories (3-5 issues each)
│   ├── Implementation tasks
│   ├── Testing requirements
│   └── Documentation needs
└── Technical enablers (2-3 issues max)
```

### **Epic Lifecycle Management**

#### **Epic Creation Standards**
- **Definition of Ready for Epics:**
  - [ ] Clear business value statement
  - [ ] Success criteria defined
  - [ ] Initial size estimate (T-shirt sizing)
  - [ ] Theme alignment confirmed
  - [ ] Dependencies mapped

#### **Epic Refinement Process**
1. **Weekly Size Check** - Automated monitoring via GitHub Actions
2. **Monthly Epic Review** - Product Owner assessment
3. **Quarterly Epic Cleanup** - Archive completed or obsolete epics

#### **Epic Breakdown Triggers**
- **Automatic:** Epic exceeds 20 issues
- **Manual:** Product Owner discretion
- **Quality-based:** Epic scope becomes unclear

---

## 🏥 Backlog Health Standards

### **Health Metrics & Thresholds**

#### **Primary Health Indicators**
| Metric | Target Range | Action Threshold | PMI/Scrum Reference |
|--------|--------------|------------------|-------------------|
| Total Open Issues | 50-100 | >150 or <25 | PMBOK® - Manageable scope |
| Stale Issues (>30 days) | <10% | >20% | Agile Practice Guide - Regular refinement |
| Issues without Epic/Theme | <5% | >15% | Scrum Guide - Organized backlog |
| Oversize Epics (>20 issues) | 0 | >2 | PMBOK® WBS - Appropriate decomposition |
| Issues Ready for Sprint | 20-30 | <15 or >50 | Scrum Alliance - Sprint Planning readiness |

#### **Secondary Health Indicators**
- Average issue age
- Epic completion rate
- Community contribution ratio
- Label consistency score

### **Definition of Ready (Issues)**
Based on Scrum Alliance standards and PMI quality criteria:

- [ ] **Title:** Clear, actionable, and specific
- [ ] **Description:** Comprehensive with acceptance criteria
- [ ] **Labels:** Theme, priority, and type labels applied
- [ ] **Epic Assignment:** Linked to appropriate epic or theme
- [ ] **Effort Estimate:** T-shirt sizing or story points
- [ ] **Dependencies:** Identified and documented
- [ ] **Acceptance Criteria:** Testable conditions defined

### **Definition of Done (Issues)**
Aligned with PMI deliverable acceptance and Scrum Definition of Done:

- [ ] **Implementation:** Code/content completed and reviewed
- [ ] **Testing:** Appropriate testing completed
- [ ] **Documentation:** Updated as needed
- [ ] **Review:** Peer review completed
- [ ] **Integration:** Successfully merged/deployed

---

## 🤖 Automation & Workflows

### **GitHub Actions Integration**
The process is supported by automated workflows:

1. **Weekly Triage Reminder** - Automated agenda preparation
2. **Epic Size Monitor** - Continuous size limit enforcement
3. **Backlog Health Dashboard** - Daily metrics collection and reporting
4. **Stale Issue Detection** - Automated identification and labeling

### **Workflow Triggers**
- **Schedule-based:** Daily/weekly automated runs
- **Event-based:** Issue creation, epic updates, label changes
- **Manual:** On-demand reporting and analysis

---

## 🔄 Continuous Improvement

### **Process Review Cycle**

#### **Monthly Process Check (15 minutes)**
- Review triage effectiveness metrics
- Identify process friction points
- Adjust meeting cadence or format as needed

*PMI Reference: PMBOK® 4.6 - Continuous improvement and lessons learned*

#### **Quarterly Process Retrospective (60 minutes)**
Following Scrum Alliance retrospective format:
1. **What went well?** - Process successes and improvements
2. **What could be improved?** - Pain points and inefficiencies
3. **What will we try next?** - Specific process experiments

#### **Annual Process Review (120 minutes)**
- Comprehensive process assessment
- Benchmark against industry standards
- Major process redesign if needed
- Training needs assessment

### **Metrics-Driven Improvement**
- **Quantitative:** Backlog health trends, triage duration, epic completion rates
- **Qualitative:** Contributor satisfaction, stakeholder feedback, process friction

### **Process Experimentation**
- **A/B Testing:** Try process variations for specific periods
- **Pilot Programs:** Test new tools or techniques with subset of work
- **Community Feedback:** Regular surveys and feedback collection

---

## 📚 Training & Onboarding

### **Role-Specific Training**

#### **Product Owner Training**
- PMI Agile Practice Guide - Product Owner responsibilities
- Scrum Alliance - Product Backlog Management certification
- Repository-specific: Theme structure, priority frameworks

#### **Contributors Training**
- Issue creation best practices
- Definition of Ready understanding
- Estimation techniques and standards

### **Process Documentation**
- **Quick Reference Cards** - One-page summaries for each role
- **Video Walkthroughs** - Process demonstrations
- **FAQs** - Common questions and answers

---

## 📖 References & Standards

### **Primary References**
1. **PMI PMBOK® Guide 7th Edition** - Project Management Institute
2. **PMI Agile Practice Guide** - Project Management Institute
3. **Scrum Guide 2020** - Scrum Alliance
4. **GitHub Flow** - GitHub best practices for open source

### **Additional Resources**
- [Scrum Alliance Product Backlog Management](https://www.scrumalliance.org/about-agile/overview)
- [PMI Agile Certified Practitioner Handbook](https://www.pmi.org/certifications/agile-acp)
- [GitHub Issues Best Practices](https://guides.github.com/features/issues/)

---

## 📈 Success Metrics

### **Process KPIs**
- **Triage Meeting Attendance:** >80% for required roles
- **Decision Velocity:** <24 hours for triage follow-up actions
- **Backlog Health Score:** >85% (weighted composite of health metrics)
- **Epic Completion Rate:** >70% within planned timeframe
- **Contributor Satisfaction:** >4.0/5.0 in quarterly survey

### **Business Impact Metrics**
- **Time-to-Value:** Reduced issue resolution time
- **Predictability:** Sprint commitment accuracy
- **Quality:** Reduced defect escape rate
- **Engagement:** Increased community contribution

---

*This process document is a living document and will be updated based on retrospective findings and changing needs. All updates will maintain alignment with PMI and Scrum Alliance standards.*

**Document Approval:**
- Process Owner: Product Owner
- Technical Review: Development Team Lead  
- Standards Review: PMI/Scrum Alliance alignment verification

**Change History:**
| Version | Date | Changes | Approver |
|---------|------|---------|----------|
| 1.0 | 2025-07-24 | Initial creation | Product Owner |
