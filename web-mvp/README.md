# PM Tools Web MVP

This is a minimal React + TypeScript app to implement Epic #288 (Template Customization Web Interface – MVP) Week 1 deliverables:
- Schema-driven editors for 5 templates (Charter, Risk, Stakeholder, Sprint, Executive)
- Live Markdown preview
- "Download Markdown" action
- Basic versioning (save/list/restore) and diff view
- Experimental collaboration for Project Charter (Yjs) – requires local ws server
- Validation (Ajv) and completion percentage indicator

## Prerequisites
- Node.js 18+

## Install and run
```
cd web-mvp
npm install
npm run dev
```
Open http://localhost:5173

## Collaboration (experimental)
To test collaboration locally for Project Charter, run a websocket server (port 1234). For example:

- Option A: y-websocket binary if installed
- Option B: Docker or npx serve of y-websocket (future improvement)

Then enable the checkbox in the UI. Data will sync between two browser windows.

## Build
```
npm run build
npm run preview
```

## Notes
- Schemas are under `schemas/web-mvp/` (in the repo root). The app imports them.
- Export styles are defined in `docs/export/style-guide.md` and `export/pandoc/defaults.yaml`.
- Week 2 will add MD/DOCX/PDF export; Week 3–4 add versioning and collaboration.
