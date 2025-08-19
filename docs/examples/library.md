# Examples and Sample Artifacts Library

Purpose
- Provide quick, high-quality reference artifacts that show how to use templates in realistic contexts.
- Accelerate onboarding and reduce ambiguity by pairing templates with completed examples.

Scope and structure
- Examples live in the repository under:
  - examples/ ... starter examples by methodology
  - demos/ ... interactive demo apps that render or manipulate templates
  - PM Tools Templates - Q3 2025 Delivery Cycle/... implementation artifacts for the Template Selector MVP
  - examples/backend-services ... runnable service samples used by some workflows

How to use
- Browse examples/ for quick copy-and-adapt artifacts
- Use demos/ to preview user flows and template rendering
- Read example READMEs for context, assumptions, and limitations

Highlighted examples
- examples/agile/sprint_planning_example.md — shows completed sprint planning doc using Agile templates
- examples/traditional/project_management_plan_example.md — completed PMP with traceability to base template
- examples/completed-templates/project-charter-software-example.md — end-to-end example with acceptance criteria
- demos/288-template-customization — interactive demo for customizing templates with a UI
- demo/288 — Template customization MVP with tests (a11y, interaction, UAT)

Contributing examples
- Prefer small, focused examples that demonstrate one concept clearly
- Include at the top:
  - Source template(s)
  - Scenario summary
  - Assumptions, constraints, dependencies
  - Validation steps (how to verify the example)
- Add links back to the base template and any related tutorials under docs/getting-started

Quality and governance
- Run link checks (docs/workflows run nightly); avoid external links without permalinks
- Avoid secrets or proprietary data; use synthetic or anonymized content
- Aim for accessibility (headings, alt text for images) and clear, scannable structure

Maintenance
- When templates change, update paired examples in the same PR where feasible
- Track updates via docs/site public changelog entries when examples materially change

