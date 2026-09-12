---
title: "Problem Management Process Template"
methodology: "universal"
complexity: "advanced"
owner: "mirichard"
updated: "2025-08-05"
---

# Problem Management Process Template

## Document Control

| Field | Details |
|---|---|
| **Document Owner** | [e.g., Head of IT Operations] |
| **Process Manager** | [e.g., Lead Problem Manager] |
| **Version** | 1.0 |
| **Status** | Draft |
| **Approval Date** | [Date] |
| **Next Review Date** | [Date] |

---

## 1. Purpose and Scope

### 1.1 Purpose
The purpose of the Problem Management process is to minimize the adverse impact of Incidents and Problems on the business caused by errors within the IT infrastructure, and to prevent the recurrence of Incidents related to these errors.

To achieve this, Problem Management seeks to:
- Identify the root cause of Incidents.
- Implement permanent solutions or workarounds.
- Document and manage Known Errors.
- Proactively prevent future Incidents.

### 1.2 Scope
This process applies to all IT services and infrastructure components managed by [Your Organization Name]. It is triggered by one or more of the following:
- A major Incident.
- Recurring Incidents with a similar theme.
- Proactive analysis of trends in Incident data.
- Notification from technical teams about a potential underlying issue.

This process is integrated with, but distinct from, Incident Management (which focuses on immediate restoration) and Change Management (which governs the implementation of fixes).

---

## 2. Roles and Responsibilities

| Role | Responsibilities |
|---|---|
| **Problem Manager** | - Owns and governs the Problem Management process.<br>- Chairs Problem Review meetings.<br>- Ensures all Problems are logged, prioritized, and investigated.<br>- Manages the Known Error Database (KEDB).<br>- Coordinates with technical teams and other process managers. |
| **Technical Teams / SMEs** | - Participate in root cause analysis (RCA).<br>- Develop and test workarounds and permanent solutions.<br>- Implement fixes via the Change Management process.<br>- Provide specialist knowledge for investigation. |
| **Incident Manager** | - Identifies and escalates potential Problems from Incidents.<br>- Collaborates with the Problem Manager on major Incidents. |
| **Change Manager** | - Reviews and approves Requests for Change (RFCs) raised to fix Problems.<br>- Coordinates implementation of fixes. |
| **Service Desk** | - Logs Incidents and identifies trends.<br>- Applies documented workarounds from the KEDB to resolve Incidents. |

---

## 3. Problem Management Process Flow

### Stage 1: Problem Detection & Logging
1.  **Detection**: A problem is identified through:
    -   Analysis of recurring Incidents.
    -   A Major Incident review.
    -   Proactive trend analysis by technical teams.
2.  **Logging**: A formal Problem Record is created in the IT Service Management (ITSM) tool. All related Incidents are linked to the Problem Record.

### Stage 2: Categorization & Prioritization
1.  **Categorization**: The Problem is categorized based on the affected service, technology, and impact area (e.g., "Networking," "Database," "Application A").
2.  **Prioritization**: Priority is assigned based on a matrix of **Impact** (number of users affected, financial loss, reputational damage) and **Urgency** (how quickly the business needs a resolution).

| | **High Impact** | **Medium Impact** | **Low Impact** |
|---|---|---|---|
| **High Urgency** | Priority 1 | Priority 2 | Priority 3 |
| **Medium Urgency** | Priority 2 | Priority 3 | Priority 4 |
| **Low Urgency** | Priority 3 | Priority 4 | Priority 5 |

### Stage 3: Investigation & Diagnosis (Root Cause Analysis)
1.  **Assign Investigation**: The Problem Manager assigns the Problem Record to the appropriate technical team or Subject Matter Expert (SME).
2.  **Conduct RCA**: The assigned team investigates the Problem to identify the underlying root cause. Common techniques include:
    -   The "5 Whys"
    -   Fishbone (Ishikawa) Diagram
    -   Kepner-Tregoe Analysis
3.  **Document Findings**: The root cause is documented in the Problem Record.

### Stage 4: Workaround & Known Error Identification
1.  **Identify Workaround**: If a permanent fix is not immediately available, the team develops a temporary workaround to restore service or mitigate business impact for future Incidents.
2.  **Document Known Error**: Once the root cause and a workaround are identified, the Problem is reclassified as a **Known Error**. A record is created in the Known Error Database (KEDB), detailing the symptoms, root cause, and workaround steps. This allows the Service Desk to resolve future Incidents more quickly.

### Stage 5: Resolution & Change Implementation
1.  **Propose Fix**: The technical team proposes a permanent solution to eliminate the root cause.
2.  **Raise RFC**: A formal Request for Change (RFC) is raised to implement the permanent fix. The RFC must be linked to the Problem Record.
3.  **Implement Change**: The fix is implemented following the standard Change Management process.

### Stage 6: Problem Closure & Review
1.  **Confirm Fix**: After the change is implemented, the Problem Manager monitors the system to confirm that the fix has been effective and that no new Incidents related to the root cause are occurring.
2.  **Close Problem Record**: Once the fix is confirmed, the Problem Record and any associated Incident records are formally closed.
3.  **Post-Problem Review**: For major problems, a review is conducted to document lessons learned and identify opportunities for process improvement.

---

## 4. Key Metrics and KPIs

| Metric | Description | Target |
|---|---|---|
| **Number of Recurring Incidents** | Count of Incidents linked to the same root cause before a Problem is resolved. | < [Target #] per month |
| **Time to Identify Root Cause** | Average time from Problem creation to RCA completion. | < [Target Hours/Days] |
| **Time to Implement Workaround** | Average time from Problem creation to KEDB entry. | < [Target Hours/Days] |
| **Problem Backlog** | Number of open Problem records, aged by priority. | < [Target #] older than 30 days |
| **Reduction in Major Incidents** | Percentage decrease in P1/P2 Incidents year-over-year. | > [Target %] reduction |

---

## 5. Process Integration

-   **Incident Management**: Provides the primary input for reactive Problem Management. Workarounds from the KEDB are used by Incident Management to improve first-call resolution rates.
-   **Change Management**: Provides the mechanism for implementing permanent fixes for Problems. All changes to resolve problems must go through formal Change Management.
-   **Configuration Management**: The Configuration Management Database (CMDB) provides critical information about CIs (Configuration Items) to aid in root cause analysis.
-   **Knowledge Management**: The Known Error Database (KEDB) is a key output of Problem Management and a subset of the overall knowledge base.

---

## 6. Appendix: Problem Record Template

A standard Problem Record in the ITSM tool should contain the following fields:
-   Problem ID
-   Date Logged
-   Problem Submitter
-   Problem Description
-   Category & Priority
-   Affected Service(s) / CI(s)
-   Linked Incident(s)
-   Assigned Team/Owner
-   Root Cause Analysis Details
-   Workaround Details
-   Known Error Status (Yes/No)
-   Resolution Details
-   Linked RFC ID
-   Date Closed

