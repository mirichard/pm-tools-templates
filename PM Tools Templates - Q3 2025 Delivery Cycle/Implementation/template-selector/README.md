# Template Selector

This is a React-based UI for selecting project management templates.

## Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

## Running the Application

1. Navigate to the template selector directory:
   ```bash
   cd /Users/michael/pm-tools-templates/PM Tools Templates - Q3 2025 Delivery Cycle/Implementation/template-selector
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx vite --port 3001 --host
   ```

4. Access the application:
   - Local: [http://localhost:3001](http://localhost:3001)
   - Network: The network URL will be displayed in the terminal output

## Troubleshooting

If the application doesn't load:

1. Make sure port 3001 is available. If not, try a different port:
   ```bash
   npx vite --port 3002 --host
   ```

2. Check for errors in the browser's developer tools:
   - Open browser developer tools (F12 or right-click and select "Inspect")
   - Check the Console tab for any error messages

3. If the server doesn't start:
   - Kill any existing Vite processes:
     ```bash
     pkill -f vite
     ```
   - Try starting the server again

## Features

- Template grid display with search and filtering
- Preview modal for template details
- Methodology and category filtering
- Responsive design for all screen sizes
- Keyboard navigation support
- Loading states and animations

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Open command palette
- `Arrow Left/Right`: Navigate between templates
- `Enter`: Select template
- `Esc`: Close modals

## Notes

- The application uses mock data for templates
- All templates are grouped by methodology (Traditional, Agile, Hybrid)
- The UI follows the wireframe specifications provided in the project documentation
