# GitHub Projects Integration Guide

## Overview

This guide provides instructions for integrating the PM Tools Templates with GitHub Projects, GitHub's built-in project management solution. By combining structured project management templates with GitHub Projects' flexible workflow capabilities, teams can manage projects efficiently while maintaining connection to code, pull requests, and issues.

## Table of Contents

1. [GitHub Projects Overview](#github-projects-overview)
2. [Template to GitHub Projects Mapping](#template-to-github-projects-mapping)
3. [Implementation Guide](#implementation-guide)
4. [Automation Capabilities](#automation-capabilities)
5. [Best Practices](#best-practices)
6. [Advanced Configuration](#advanced-configuration)
7. [Limitations and Workarounds](#limitations-and-workarounds)

---

## GitHub Projects Overview

GitHub Projects is a flexible project management tool integrated with GitHub repositories. It offers:

### Key Features

- **Project Boards**: Customizable boards (tables, kanban, roadmap views)
- **Issues Integration**: Direct connection to GitHub Issues
- **Custom Fields**: Define and track additional metadata
- **Automation**: Built-in workflow automation
- **Filtering & Sorting**: Dynamic views of project items
- **Multiple Views**: Switch between table, board, and roadmap views
- **Team Management**: Assign tasks and track progress
- **Timeline Tracking**: Schedule and milestone visualization

### Project Types

GitHub Projects offers two versions:

1. **Classic Projects**: Repository-specific project boards with basic kanban functionality
2. **Projects (next generation)**: Organization-wide or user-owned projects with enhanced features, custom fields, and multiple views

This guide focuses on the newer **Projects** version, which offers more flexibility for implementing PM methodologies.

---

## Template to GitHub Projects Mapping

Below is a mapping of how key project management elements from our templates can be implemented in GitHub Projects:

| PM Template Element | GitHub Projects Implementation |
|---------------------|--------------------------------|
| **Project Charter** | Repository README.md and/or project description |
| **WBS / Scope** | Issues with parent-child relationships using task lists |
| **Task Lists** | Issues with checkboxes or custom fields |
| **Schedule** | Issues with milestone assignments and due dates |
| **Gantt Chart** | Roadmap view with timeline |
| **Risk Register** | Issues with "Risk" label and custom fields for probability/impact |
| **Status Reports** | Project board views with filters or separate status repository |
| **Team Assignments** | Assignees on issues |
| **Stakeholder Register** | Custom fields for stakeholder information |
| **Meeting Notes** | Discussions or wiki pages linked to project |
| **Change Requests** | Issues with "Change Request" label and custom fields |
| **Decision Log** | Issues with "Decision" label or wiki pages |

### Custom Field Mapping

Create custom fields in GitHub Projects to track project management metadata:

| Custom Field Name | Type | Purpose | Template Alignment |
|------------------|------|---------|-------------------|
| Priority | Single select (High, Medium, Low) | Track item priority | All methodologies |
| Status | Single select (Not Started, In Progress, Blocked, Complete) | Track progress status | All methodologies |
| Effort/Story Points | Number | Track estimated effort | Agile templates |
| Sprint | Iteration | Group items into sprints | Agile templates |
| Phase | Single select | Group by project phase | PMBOK templates |
| Risk Level | Single select | Risk classification | Risk register |
| Due Date | Date | Deadline for completion | All methodologies |
| Department | Single select | Organizational ownership | All methodologies |
| Epic | Single select | Group items into epics | Agile templates |

---

## Implementation Guide

### Step 1: Set Up Your GitHub Environment

1. **Create a GitHub Repository**
   - Create a new repository for your project
   - Initialize with a README.md
   - Use the README to document project charter information
   - Create appropriate repository folders (documentation, meeting-notes, etc.)

2. **Configure Repository Settings**
   - Define appropriate collaborators/teams
   - Set up branch protection rules if needed
   - Configure issue templates for different item types

### Step 2: Create a New Project

1. **Navigate to Projects**
   - From your repository, click "Projects" tab
   - Click "New project"
   - Select "Board" template for kanban-style management
   
2. **Configure Basic Project Settings**
   - Name your project
   - Add a meaningful description
   - Link to relevant repositories

### Step 3: Configure Custom Fields

1. **Add Standard Fields**
   - Click "+" in the column header area to add fields
   - Add the following basic fields:
     - Status (single select)
     - Priority (single select)
     - Due date (date)
     - Assignees (people)
     
2. **Add Methodology-Specific Fields**
   - For Agile: Sprint, Story Points, Epic
   - For PMBOK: Phase, Process Group, Knowledge Area
   - For Hybrid: Methodology Type, Delivery Increment

### Step 4: Configure Views

1. **Set Up Kanban Board View**
   - Create columns: Backlog, To Do, In Progress, Review, Done
   - Configure column automation (e.g., auto-move items when they're closed)

2. **Set Up Table View**
   - Include all relevant fields
   - Configure grouping (e.g., by Epic or Phase)
   - Set up default sorting

3. **Set Up Roadmap View**
   - Configure date field for timeline
   - Group items as appropriate (e.g., by Epic)

### Step 5: Import Template Content

1. **Create Issues for Work Items**
   - Create issues for each work package/user story
   - Use parent-child relationships for WBS hierarchy
   - Assign appropriate metadata through custom fields
   
2. **Import Documentation**
   - Add template documentation to wiki or docs folder
   - Reference documentation in issue descriptions

3. **Set Up Templates**
   - Create issue templates for common items (tasks, risks, changes)
   - Set up project workflows to match methodology phases

---

## Specific Template Implementation Examples

### Implementing an Agile Sprint Planning Template

1. **Create a Sprint Planning Issue Template**
   ```
   ---
   name: Sprint Planning
   about: Template for Sprint Planning documentation
   title: 'Sprint Planning: Sprint [NUMBER]'
   labels: 'meeting, sprint-planning'
   assignees: ''
   ---

   ## Sprint [NUMBER] Planning

   **Sprint Goal:**
   [Clearly define the sprint goal]

   **Sprint Duration:**
   [Start Date] to [End Date]

   **Sprint Capacity:**
   - Team Member 1: [X] days
   - Team Member 2: [X] days
   [...]

   **Sprint Backlog Items:**
   - [ ] #[issue-number] [Issue Title]
   - [ ] #[issue-number] [Issue Title]
   [...]

   **Risks and Dependencies:**
   - [List any risks or dependencies]
   ```

2. **Create Sprint Custom Field**
   - Add an "Iteration" field type in Project settings
   - Define sprint dates in iteration configuration

3. **Configure Sprint View**
   - Create a board view filtered by current sprint iteration
   - Group by assignee or status

### Implementing a PMBOK Risk Register

1. **Create Risk Issue Template**
   ```
   ---
   name: Risk Item
   about: Template for documenting a project risk
   title: 'RISK: [Brief description]'
   labels: 'risk'
   assignees: ''
   ---

   ## Risk Description
   [Detailed description of the risk]

   ## Risk Category
   [Select appropriate category]

   ## Probability (1-5)
   [Rating]

   ## Impact (1-5)
   [Rating]

   ## Risk Score
   [Probability × Impact]

   ## Response Strategy
   - [ ] Avoid
   - [ ] Transfer
   - [ ] Mitigate
   - [ ] Accept

   ## Response Actions
   - [ ] [Action 1]
   - [ ] [Action 2]
   [...]

   ## Risk Owner
   @[username]

   ## Due Date
   [Date for risk response implementation]
   ```

2. **Create Risk-Specific Custom Fields**
   - Probability (single select: 1-5)
   - Impact (single select: 1-5)
   - Risk Score (number, calculated if possible)
   - Risk Category (single select)
   - Response Strategy (single select)

3. **Create Risk Register View**
   - Table view filtered by "risk" label
   - Sort by Risk Score (descending)
   - Group by Risk Category

---

## Automation Capabilities

GitHub Projects offers several automation capabilities to streamline project management:

### Built-in Workflow Automations

- **Status Transitions**: Automatically move items when status changes
- **Pull Request Linkage**: Connect PRs to issues for tracking
- **Closed Item Handling**: Auto-move closed items

### GitHub Actions Integration

Create custom workflows with GitHub Actions:

1. **Sprint Management Workflow**
   - Automatically create sprint planning and review issues
   - Move backlog items to sprint when sprint starts
   - Generate sprint reports when sprint ends

2. **Risk Management Workflow**
   - Calculate risk scores based on probability and impact
   - Flag high-risk items for review
   - Send notifications for risk review deadlines

3. **Status Reporting Workflow**
   - Generate weekly status reports based on project progress
   - Create burndown/burnup charts from project data
   - Post summaries to Discussions or Slack

### Sample GitHub Action Workflow

```yaml
name: Weekly Status Report

on:
  schedule:
    - cron: '0 9 * * MON'  # 9am every Monday

jobs:
  generate-status-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Get project data
        uses: octokit/graphql-action@v2.0
        id: project_data
        with:
          query: |
            query($org: String!, $projectNumber: Int!) {
              organization(login: $org) {
                projectV2(number: $projectNumber) {
                  items(first: 100) {
                    nodes {
                      id
                      fieldValues {
                        nodes {
                          ... on ProjectV2ItemFieldTextValue {
                            text
                            field {
                              ... on ProjectV2FieldCommon {
                                name
                              }
                            }
                          }
                          ... on ProjectV2ItemFieldDateValue {
                            date
                            field {
                              ... on ProjectV2FieldCommon {
                                name
                              }
                            }
                          }
                          ... on ProjectV2ItemFieldSingleSelectValue {
                            name
                            field {
                              ... on ProjectV2FieldCommon {
                                name
                              }
                            }
                          }
                        }
                      }
                      content {
                        ... on Issue {
                          title
                          state
                          assignees(first: 10) {
                            nodes {
                              login
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          org: ${{ github.repository_owner }}
          projectNumber: 1  # Replace with your project number
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Generate status report
        run: |
          echo "# Project Status Report: $(date +"%Y-%m-%d")" > status_report.md
          echo "" >> status_report.md
          echo "## Summary" >> status_report.md
          # Process the JSON data to create a report
          # [Add your processing script here]
          
      - name: Create issue with status report
        uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const fs = require('fs');
            const reportContent = fs.readFileSync('status_report.md', 'utf8');
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Status Report: ${new Date().toISOString().split('T')[0]}`,
              body: reportContent,
              labels: ['status-report']
            });
```

---

## Best Practices

### General Best Practices

1. **Consistent Naming Conventions**
   - Use prefixes for different item types (TASK-, RISK-, etc.)
   - Maintain consistent labeling schemes
   - Document naming conventions in repository README

2. **Keep Hierarchy Manageable**
   - Limit hierarchy depth to 2-3 levels
   - Use epics/features/tasks or phases/work packages/activities
   - Link rather than nest when relationships are complex

3. **Regular Maintenance**
   - Review and update project board weekly
   - Archive completed items regularly
   - Refine workflow as project evolves

4. **Documentation Linking**
   - Link issues to relevant documentation
   - Reference repository files in issue descriptions
   - Use wiki for extended documentation

### Methodology-Specific Best Practices

#### Agile Implementation

1. **Sprint Structure**
   - Create iteration field with sprint dates
   - Use labels for story, task, bug, epic
   - Configure views by sprint and status

2. **Ceremonies**
   - Create Discussion threads for sprint planning, review, and retrospective
   - Use issue templates for capturing meeting outcomes
   - Link ceremony discussions to sprint issues

#### PMBOK Implementation

1. **Process Groups**
   - Use custom field for process groups
   - Create separate views for each process group
   - Track progress through process groups with status transitions

2. **Knowledge Areas**
   - Use labels or custom fields for knowledge areas
   - Filter views by knowledge area for focused management
   - Assign knowledge area owners as reviewers

#### Hybrid Implementation

1. **Methodology Designation**
   - Use custom field to indicate methodology (Agile, Waterfall, Hybrid)
   - Apply appropriate workflow based on methodology
   - Allow mixed approaches for different work streams

---

## Advanced Configuration

### Project-to-Project Integration

Link multiple GitHub Projects together for program management:

1. **Portfolio Management**
   - Create high-level portfolio project
   - Reference child projects through links
   - Aggregate key metrics across projects

2. **Program Management**
   - Create summary issues in program-level project
   - Link to detailed issues in project-level boards
   - Use custom rollup fields for status tracking

### Integration with External Tools

Connect GitHub Projects with other tools:

1. **GitHub API Integration**
   - Use GitHub API to extract project data
   - Build custom dashboards with project information
   - Integrate with reporting tools

2. **Third-Party Integrations**
   - Configure Slack notifications for project updates
   - Connect to time tracking tools
   - Integrate with document management systems

---

## Limitations and Workarounds

### Current GitHub Projects Limitations

1. **Limited Calculation Fields**
   - **Limitation**: No formula/calculated fields
   - **Workaround**: Use GitHub Actions to update fields with calculated values

2. **No Built-in Time Tracking**
   - **Limitation**: No hour logging capability
   - **Workaround**: Use label with time estimate or integrate third-party time tracking

3. **Limited Reporting**
   - **Limitation**: No built-in reporting or charts
   - **Workaround**: Use GitHub Actions to generate reports, or export data to external tools

4. **WBS Hierarchy Limitations**
   - **Limitation**: Limited hierarchy visualization
   - **Workaround**: Use indentation in issue titles, or maintain WBS in separate document linked to issues

---

## Conclusion

GitHub Projects provides a flexible platform for implementing project management templates while maintaining close integration with code and development workflows. By following this guide, you can map the structured approaches from our PM templates to GitHub's collaborative environment, creating a system that combines methodology rigor with the benefits of modern development practices.

For additional help, consider the following resources:

- [GitHub Projects Documentation](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub GraphQL API Documentation](https://docs.github.com/en/graphql)

---

*This guide is part of the PM Tools and Templates collection. For methodology guidance, please refer to the main GUIDE.md document in the repository root.*

