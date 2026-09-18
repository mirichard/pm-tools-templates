# Tutorial: Automate Stakeholder Status Emails (Draft)

Prerequisites
- Node.js and npm installed
- Access to docs/site and role-based-toolkits templates

Steps
1. Select a status report template under role-based-toolkits/project-manager/.
2. Configure a weekly schedule using the existing weekly-status-email workflow (reference .github/workflows/weekly-status-email.yml).
3. Customize recipients and content blocks.
4. Validate locally by running the site build and checking email HTML output.

Expected Outcomes
- Weekly status emails sent with up-to-date metrics and highlights.

Validation Checks
- Links render correctly and pass link checks.
- Email HTML passes accessibility linting (basic).

