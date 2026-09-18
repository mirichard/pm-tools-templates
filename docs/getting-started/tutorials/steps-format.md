# Tutorial Steps Format (Draft)

A simple, serial step format authors can use to define interactive tutorials.

Example (YAML):

---
id: automate-status-emails
version: 0.1
steps:
  - id: select-template
    title: Select a status report template
    action: "Open role-based-toolkits/project-manager/status-report.md and copy to your project"
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

