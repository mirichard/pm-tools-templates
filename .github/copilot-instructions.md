# Project overview

This repository is primarily a content library of project-management templates plus several independent sub-applications. There is no single repo-wide app build; work only in the specific sub-app or content pipeline relevant to the task.

## Validation guidance

- For root JavaScript changes, run `npm run test:ci`.
- For webhook integration changes, run `npm run test:webhook`.
- For template metadata or path changes, run `node scripts/validate-canonical-paths.js --strict`.
- For Markdown link validation, run `python3 check_anchor_links_filtered.py`.
- Do not hand-edit `TEMPLATE_INDEX.md`; regenerate it from `templates/templates.json` when needed.

## Copilot cloud agent guidance

- Prefer the **Auto** model setting, or another currently supported cloud-agent model, when starting a Copilot cloud agent task for this repository.
- Do not select deprecated or unavailable model IDs such as `claude-sonnet-4.6`, because the agent job fails before it can inspect or modify the repository.
