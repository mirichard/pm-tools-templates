# Trello Integration Guide

## Overview

This guide provides instructions for implementing PM Tools Templates within Trello, a flexible and visual project management tool. By mapping our standardized project management templates to Trello's intuitive card-based system, teams can maintain methodological consistency while benefiting from Trello's simplicity and visual workflow.

## Table of Contents

1. [Trello Overview](#trello-overview)
2. [Template to Trello Feature Mapping](#template-to-trello-feature-mapping)
3. [Board Setup and Organization](#board-setup-and-organization)
4. [Automation and Power-Ups](#automation-and-power-ups)
5. [Methodology-Specific Implementations](#methodology-specific-implementations)
6. [Reporting and Visibility](#reporting-and-visibility)
7. [Best Practices](#best-practices)
8. [Limitations and Workarounds](#limitations-and-workarounds)

---

## Trello Overview

Trello is a web-based, kanban-style list-making application that provides a visual way to manage projects and organize anything. It uses the concept of boards, lists, and cards to create a highly visual and intuitive system.

### Key Capabilities

- **Visual Workflow**: Kanban-style boards with customizable lists and cards
- **Flexible Organization**: Hierarchical structure with boards, lists, and cards
- **Card Details**: Rich information storage with descriptions, checklists, attachments, and comments
- **Customization**: Custom fields, labels, and card covers for enhanced information display
- **Collaboration**: Real-time updates, comments, and notifications for team communication
- **Automation**: Built-in automation with Butler and third-party integrations
- **Power-Ups**: Extensibility through add-ons for enhanced functionality
- **Mobile Access**: Full-featured mobile apps for on-the-go management
- **Templates**: Pre-built and custom templates for quick setup

### Core Concepts

- **Boards**: Represent projects or work areas (e.g., "Website Redesign Project")
- **Lists**: Represent stages in a workflow or categories (e.g., "To Do", "In Progress", "Done")
- **Cards**: Represent individual tasks or items of work
- **Labels**: Color-coded categories for visual organization
- **Checklists**: Sub-tasks or detailed steps within a card
- **Custom Fields**: Additional structured data fields for cards
- **Power-Ups**: Add-ons that extend Trello's functionality
- **Automation**: Rules and buttons that automate repetitive actions

---

## Template to Trello Feature Mapping

Below is a mapping of PM Tools Templates elements to their corresponding Trello features:

| PM Template Element | Trello Feature | Configuration Notes |
|---------------------|----------------|---------------------|
| **Project Charter** | Board description, pinned card, or attached document | Create a dedicated card with charter info; pin to top of first list |
| **WBS / Scope** | Board structure with multiple connected boards | Use main board for high-level items; link to sub-boards for details |
| **Task Lists** | Cards with checklists | Create cards for major tasks; use checklists for subtasks |
| **Schedule** | Due dates, Calendar Power-Up | Set due dates on cards; use Calendar view for timeline |
| **Risk Register** | Dedicated list or board with custom fields | Create a "Risks" list; use custom fields for probability/impact |
| **Status Reports** | Dedicated board or regular snapshot | Use automation to generate status summaries |
| **Team Assignments** | Card members | Assign team members to cards |
| **Stakeholder Register** | Dedicated list or custom fields | Create cards for key stakeholders with contact info |
| **Meeting Notes** | Card comments or attachments | Store meeting notes in card comments or attach documents |
| **Change Requests** | Dedicated list with template | Create a "Change Requests" list with standardized card format |
| **Decision Log** | Dedicated list with template | Create a "Decisions" list with standardized card format |

### Custom Field Mapping

Create custom fields in Trello to track project management metadata:

| PM Template Field | Trello Custom Field Type | Purpose | Usage Notes |
|------------------|--------------------------|---------|-------------|
| Priority | Dropdown | Track item priority | Values: High, Medium, Low |
| Status | Dropdown | Track item status | Values depend on methodology |
| Story Points | Number | Track estimated effort | For Agile implementations |
| Risk Probability | Dropdown | Track risk likelihood | Values: 1-5 scale |
| Risk Impact | Dropdown | Track risk consequence | Values: 1-5 scale |
| Risk Score | Calculated (via automation) | Calculate Risk Priority Number | Formula: Probability × Impact |
| Process Group | Dropdown | PMBOK process group | For traditional projects |
| Knowledge Area | Dropdown | PMBOK knowledge area | For traditional projects |
| Epic | Dropdown | Group user stories | For Agile implementations |
| Phase | Dropdown | Project lifecycle phase | For traditional/hybrid projects |

---

## Board Setup and Organization

### Single-Board Setup

Best for smaller projects or pure Agile implementations:

1. **Create a New Board**
   - Name it after your project
   - Choose a relevant background
   - Add a detailed description including project charter elements

2. **Set Up Basic Lists**
   - **Project Info**: For charter, scope, and key documents
   - **Backlog**: For upcoming work
   - **To Do**: For current sprint/phase work
   - **In Progress**: For active tasks
   - **Review**: For tasks awaiting review/approval
   - **Done**: For completed tasks
   - **Issues/Risks**: For tracking problems and risks
   - **Decisions**: For documenting decisions

3. **Configure Labels**
   - Create color-coded labels for categories (e.g., Frontend, Backend, Documentation)
   - Create priority labels (High, Medium, Low)
   - Create type labels (Task, Bug, User Story, etc.)

4. **Set Up Custom Fields**
   - Add relevant custom fields from mapping table
   - Configure dropdown options
   - Make key fields visible on card front

### Multi-Board Setup

Better for larger projects or those following formal methodologies:

1. **Create a Workspace**
   - Dedicated workspace for the project
   - Add team members with appropriate permissions

2. **Create Main Project Board**
   - Overview board with high-level items
   - Links to other boards
   - Project documentation

3. **Create Supporting Boards**
   - **Planning Board**: Charter, WBS, schedule
   - **Execution Board**: Task tracking with workflow lists
   - **Risk Management Board**: Risk register and mitigation tracking
   - **Documentation Board**: Meeting notes, decisions, changes

4. **Link Boards Together**
   - Use "Board" custom field to link related cards
   - Use "Link" power-up to connect boards
   - Create consistent naming conventions

### Card Structure

For effective information organization within cards:

1. **Card Title Format**
   - Clear, action-oriented titles
   - Include identifier if applicable (e.g., "US-01: User Login Feature")
   - Keep under 50 characters for readability

2. **Card Description Template**
   ```
   ## Objective
   [Clear statement of the goal]

   ## Details
   [Comprehensive description]

   ## Acceptance Criteria
   - [Criterion 1]
   - [Criterion 2]
   - [Criterion 3]

   ## Resources
   - [Link to relevant documents/resources]

   ## Notes
   [Additional information]
   ```

3. **Checklists**
   - Use for subtasks or step-by-step processes
   - Create reusable checklist templates for common processes
   - Keep items specific and actionable

4. **Attachments**
   - Attach relevant documents, images, or files
   - Use clear file naming conventions
   - Consider using cloud storage links for large files

---

## Automation and Power-Ups

### Essential Power-Ups

1. **Calendar**
   - View cards with due dates in calendar format
   - Plan and track deadlines visually
   - Export calendar to external tools

2. **Custom Fields**
   - Add structured data to cards
   - Create project-specific fields
   - Use for filtering and organization

3. **Card Repeater**
   - Create recurring tasks automatically
   - Use for regular meetings or reviews
   - Set frequency and timing

4. **Advanced Checklists**
   - Enhanced checklist functionality
   - Assigned checklist items
   - Due dates for individual items

5. **Reporting Power-Ups**
   - **Dashcards**: Create visual dashboards
   - **Burndown**: Track sprint/project progress
   - **Chart**: Visualize project data

### Butler Automation Examples

1. **Status Update Automation**
   ```
   Trigger: When a card is moved to "In Progress"
   Action: Add current date to "Start Date" custom field
          Add the comment "Work started on {date}"
          Assign to member who moved the card
   ```

2. **Due Date Management**
   ```
   Trigger: When a card is marked as overdue
   Action: Add "OVERDUE" label
          Move card to top of list
          Notify assigned members
   ```

3. **Risk Management**
   ```
   Trigger: When "Risk Probability" AND "Risk Impact" custom fields are both set
   Action: Calculate Risk Score (Probability × Impact)
          Set "Risk Score" custom field
          If Risk Score > 15, add "High Risk" label
   ```

4. **Weekly Status Report**
   ```
   Trigger: Every Friday at 3 PM
   Action: Create a card in "Status Reports" list
          Add summary of cards completed this week
          Add list of cards in progress
          Add count of cards by label
   ```

### Zapier Integrations

1. **Google Drive Integration**
   - Automatically create Google Docs for new cards
   - Attach meeting notes to relevant cards
   - Create project folders for new boards

2. **Email Integration**
   - Create cards from emails
   - Send email notifications for card updates
   - Generate email reports of board status

3. **Calendar Integration**
   - Sync due dates with Google Calendar or Outlook
   - Create calendar events from cards
   - Remind team of upcoming deadlines

4. **Slack Integration**
   - Post card updates to relevant Slack channels
   - Create cards from Slack messages
   - Daily/weekly status updates in Slack

---

## Methodology-Specific Implementations

### Agile Implementation

1. **Board Structure**
   - **Backlog**: All user stories/tasks not in current sprint
   - **Sprint Planning**: Items being considered for next sprint
   - **Sprint Backlog**: Items committed for current sprint
   - **In Progress**: Items actively being worked on
   - **Review/QA**: Items ready for testing/review
   - **Done**: Completed items for current sprint
   - **Impediments**: Blockers and issues

2. **Card Configuration**
   - Use labels for user story types (feature, bug, technical debt)
   - Use custom fields for story points and acceptance criteria
   - Use checklists for task breakdown
   - Assign team members to cards

3. **Sprint Management**
   - Create a "Sprint" custom field with sprint number
   - Use card covers to show story point values
   - Archive completed sprint cards to Sprint Results board
   - Use burndown chart Power-Up for progress tracking

4. **Ceremonies Support**
   - Create template cards for Sprint Planning, Review, and Retrospective
   - Use Card Repeater to create ceremony cards automatically
   - Document outcomes in card comments or attachments

### PMBOK Implementation

1. **Board Structure**
   - Organize main board by Process Groups:
     - **Initiating**: Charter, stakeholder identification
     - **Planning**: Plans, requirements, WBS
     - **Executing**: Work execution, team management
     - **Monitoring & Controlling**: Performance tracking, changes
     - **Closing**: Deliverable acceptance, lessons learned

2. **Card Configuration**
   - Use custom fields for Process Group and Knowledge Area
   - Use labels for deliverable types
   - Use due dates for schedule tracking
   - Create dedicated board for Risk Register

3. **Knowledge Area Management**
   - Create separate boards for complex Knowledge Areas
   - Use consistent labels across boards for Knowledge Areas
   - Link related cards across boards

4. **Progress Tracking**
   - Create milestone cards with "Milestone" label
   - Use percentage complete custom field
   - Create status report automation
   - Document variances in card comments

### Hybrid Implementation

1. **Board Structure**
   - **Project Planning**: Traditional approach for planning
   - **Sprint Execution**: Agile approach for execution
   - **Milestones & Deliverables**: Traditional tracking of key outcomes
   - **Risks & Issues**: Formal risk management
   - **Documentation**: Formal documentation storage

2. **Card Configuration**
   - Combine relevant custom fields from both methodologies
   - Use "Methodology Type" custom field to indicate approach
   - Create clear visual distinction between agile and traditional elements

3. **Phase-Sprint Connection**
   - Define phases with traditional approach
   - Execute each phase with sprints
   - Track progress at both levels
   - Link sprint boards to phase cards

4. **Reporting**
   - Create dual reporting (traditional and agile)
   - Track progress against plan and within sprints
   - Use automation to generate combined reports

---

## Reporting and Visibility

### Board Level Visibility

1. **Card Counts and Distribution**
   - Enable "Card Counts" on lists
   - Use label filtering to see cards by category
   - Create custom filters for common views

2. **Card Display Enhancements**
   - Show custom fields on card front
   - Use color-coded labels consistently
   - Add card covers for visual distinction

3. **List Organization**
   - Order lists to reflect workflow
   - Use collapsed lists for reference information
   - Pin important cards to list tops

### Dashboards and Reports

1. **Dashboard Board**
   - Create a dedicated dashboard board
   - Use Butler automation to maintain real-time data
   - Include key metrics and status information

2. **Regular Reports**
   - Generate automated weekly status reports
   - Create sprint/phase summary cards
   - Use Card Aging Power-Up to identify stalled work

3. **External Reporting**
   - Export data to spreadsheets for custom reporting
   - Use Dashcards Power-Up for visual dashboards
   - Share reports via PDF or collaborative tools

### Progress Tracking

1. **Milestone Tracking**
   - Create milestone cards with due dates
   - Track milestone completion
   - Visualize on Calendar Power-Up

2. **Burn Charts (Agile)**
   - Use Burndown Power-Up for sprint tracking
   - Track story point completion
   - Analyze team velocity

3. **Timeline Tracking**
   - Use Timeline Power-Up for Gantt visualization
   - Track actual vs. planned dates
   - Identify schedule variances

---

## Best Practices

### General Best Practices

1. **Board Organization**
   - Keep board layouts consistent across projects
   - Archive completed cards regularly
   - Use board collections for related boards

2. **Card Management**
   - Write clear, actionable card titles
   - Include all relevant information in card description
   - Keep cards updated with current status

3. **Collaboration**
   - Use comments for discussions
   - @mention team members for attention
   - Add relevant members to cards

4. **Trello Maintenance**
   - Archive completed cards regularly
   - Review and update automations
   - Clean up unused labels and custom fields

### Agile Best Practices

1. **Backlog Management**
   - Regularly groom and prioritize backlog
   - Keep user stories properly sized
   - Use clear acceptance criteria

2. **Sprint Management**
   - Keep sprint boards focused on current sprint
   - Move completed stories to Done
   - Hold regular ceremonies and document outcomes

3. **Team Collaboration**
   - Daily updates via comments or stand-up
   - Clear ownership of cards
   - Transparent impediment resolution

### PMBOK Best Practices

1. **Process Compliance**
   - Create templates for required documents
   - Use checklists for process steps
   - Document approval workflows

2. **Documentation**
   - Attach formal documents to appropriate cards
   - Version control important attachments
   - Create traceability between related cards

3. **Governance**
   - Document decision points
   - Track approvals via checklists
   - Maintain change log

### Hybrid Best Practices

1. **Clear Boundaries**
   - Clearly define which aspects use which methodology
   - Document hybrid approach in main board description
   - Train team on approach

2. **Consistent Terminology**
   - Create glossary of terms
   - Use consistent language across boards
   - Label cards by methodology

3. **Flexible Structure**
   - Allow methodology to adapt as project progresses
   - Regular review of process effectiveness
   - Document lessons learned

---

## Limitations and Workarounds

### Hierarchical Structure Limitations

**Limitation**: Trello's flat structure doesn't naturally support deep WBS hierarchies.

**Workaround**:
- Use board hierarchies (main board with links to sub-boards)
- Use naming conventions to indicate hierarchy
- Use custom fields to track WBS codes
- Consider "Attachments" Power-Up for attaching sub-cards to parent cards

### Resource Management Limitations

**Limitation**: Limited resource allocation and capacity planning features.

**Workaround**:
- Create a separate Resource Management board
- Use "Team Table" Power-Up to track allocation
- Use custom fields to track estimated hours
- Create automation to sum up assigned work per member

### Formal Reporting Limitations

**Limitation**: Limited built-in reporting capabilities for formal project reporting.

**Workaround**:
- Use reporting Power-Ups
- Export data to spreadsheets for custom reports
- Create automated summary cards
- Use external reporting tools with Trello API

### Complex Dependency Management

**Limitation**: No built-in dependency management.

**Workaround**:
- Use "Dependency" custom field to reference card IDs
- Create a dedicated Dependencies list
- Use "Card Relation" Power-Up if available
- Create Butler automations to link dependent cards

---

## Integration with Other Tools

### Document Management

1. **Google Drive Integration**
   - Attach Google Docs to cards
   - View Google Drive files within Trello
   - Create template documents

2. **OneDrive/SharePoint Integration**
   - Connect with Microsoft ecosystem
   - Attach Office documents
   - Collaborative editing

### Communication Tools

1. **Slack Integration**
   - Card notifications in Slack channels
   - Create cards from Slack messages
   - Link Trello searches to Slack commands

2. **Microsoft Teams Integration**
   - Add Trello boards to Teams tabs
   - Get notifications in Teams channels
   - Manage Trello from within Teams

### Development Tools

1. **GitHub Integration**
   - Link cards to GitHub issues
   - View pull requests within Trello
   - Automate card movements based on GitHub actions

2. **Bitbucket Integration**
   - Connect commits to cards
   - View branch status
   - Automate development workflow

---

## Conclusion

Trello provides a flexible and visual platform for implementing project management templates. While it has some limitations for complex project management, its simplicity, extensive Power-Up ecosystem, and automation capabilities make it a strong choice for teams seeking a lightweight, adaptable solution.

By following this guide, you can successfully map our PM templates to Trello's features and implement effective project management processes tailored to your methodology of choice.

For additional help, consider these resources:

- [Trello Help Documentation](https://help.trello.com/)
- [Trello Blog](https://blog.trello.com/)
- [Trello Community](https://community.atlassian.com/t5/Trello/ct-p/trello)

---

*This guide is part of the PM Tools and Templates collection. For methodology guidance, please refer to the main GUIDE.md document in the repository root.*

