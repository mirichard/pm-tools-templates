# User Guide: Template Customization Web Interface (MVP)

This guide explains how to use the web interface to customize templates, preview outputs, download markdown, manage versions, and (optionally) demo collaboration.

Open the app
- Start: `cd web-mvp && npm install && npm run dev`
- Open: http://localhost:5173

Pick a template
- Use the Template selector to choose: Project Charter, Risk Register, Stakeholder Plan, Sprint Planning, or Executive Status.

Fill out fields
- Required fields show a `*`
- Validation errors appear below fields and are announced to screen readers
- Completion % indicates how many required fields are filled

Preview and download
- The Live Preview updates as you type
- Click “Download Markdown” to save the current content as a .md file

Versioning & diff
- Enter a Version name and click “Save Version” to capture a snapshot
- Use Load to restore a saved version
- Choose two versions in Diff A/B and click “Show Diff” to see changes highlighted

Experimental collaboration (Charter only)
- Start a websocket server at ws://localhost:1234 (y-websocket)
- In the app, choose “Project Charter” and enable “Enable Collaboration (experimental)”
- Open the app in two browser windows to see edits sync in real-time

Keyboard accessibility
- Press Tab to reveal “Skip to main content”, then Enter
- Navigate form controls with Tab/Shift+Tab; use Enter/Space to activate buttons

Troubleshooting
- If the app doesn’t load, ensure Node.js 18+ is installed and no other service is using port 5173
- If collaboration doesn’t sync, confirm the websocket server is running and accessible on ws://localhost:1234

Next steps (post-MVP)
- DOCX/PDF export using Pandoc defaults
- Optional OAuth save-to-repo
- Additional templates and advanced collaboration features
