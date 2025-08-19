# Tutorial: Status Emails Walkthrough (Steps Format)

Refer to steps-format.md for the structure.

---
id: automate-status-emails-demo
version: 0.1
steps:
  - id: select-template
    title: Select a status report template
    action: "Open role-based-toolkits/project-manager/essential-templates/status-report.md (or canonical equivalent) and copy to project-docs/"
    validate:
      - "File exists in project-docs/"
  - id: configure-workflow
    title: Configure weekly status workflow
    action: "Review .github/workflows/weekly-status-email.yml and adjust recipients"
    validate:
      - "Recipients configured"
  - id: dry-run
    title: Dry run email output
    action: "Build docs/site and preview email HTML output"
    validate:
      - "Links pass link-check"
---

