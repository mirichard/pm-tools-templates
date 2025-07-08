# Template Selector

This is a React-based UI for selecting project management templates. The application consists of a frontend React app and a backend API server that provides template data.

## Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

## Running the Application

**Important:** The template selector requires both a backend API server and frontend to be running simultaneously.

### Step 1: Start the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd "/Users/michael/pm-tools-templates/PM Tools Templates - Q3 2025 Delivery Cycle/Implementation/template-selector/backend"
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   
   The backend server will start on port 3001 and you should see:
   ```
   Template Selector API server running on port 3001
   Health check: http://localhost:3001/api/health
   ```

### Step 2: Start the Frontend (in a new terminal)

1. Navigate to the template selector directory:
   ```bash
   cd "/Users/michael/pm-tools-templates/PM Tools Templates - Q3 2025 Delivery Cycle/Implementation/template-selector"
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   
   The frontend will start on port 3000 and display:
   ```
   VITE v7.0.2  ready in 240 ms
   ➜  Local:   http://localhost:3000/
   ```

### Step 3: Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api/health](http://localhost:3001/api/health)

## API Endpoints

The backend provides the following endpoints:

- `GET /api/templates` - List all templates with pagination
- `POST /api/templates/search` - Search templates
- `GET /api/templates/:id` - Get specific template
- `GET /api/templates/metadata` - Get methodologies, categories, tags
- `GET /api/health` - Health check

## Troubleshooting

### Common Issues

1. **"Error: Failed to fetch templates"**
   - Make sure the backend server is running on port 3001
   - Check if the backend started successfully with `npm start` in the backend directory
   - Verify the backend is accessible: http://localhost:3001/api/health

2. **Port conflicts:**
   - Backend uses port 3001
   - Frontend uses port 3000 (will auto-increment if busy)
   - If ports are in use, stop existing processes:
     ```bash
     pkill -f "node server.js"
     pkill -f "vite"
     ```

3. **Frontend shows "Endpoint not found":**
   - Ensure both backend and frontend are running
   - Check that the frontend is configured to proxy API requests to port 3001
   - Verify the backend server logs for any errors

4. **Dependencies issues:**
   - Delete node_modules and reinstall:
     ```bash
     rm -rf node_modules package-lock.json
     npm install
     ```

### Starting from Scratch

```bash
# Terminal 1: Start backend
cd "/Users/michael/pm-tools-templates/PM Tools Templates - Q3 2025 Delivery Cycle/Implementation/template-selector/backend"
npm install
npm start

# Terminal 2: Start frontend (after backend is running)
cd "/Users/michael/pm-tools-templates/PM Tools Templates - Q3 2025 Delivery Cycle/Implementation/template-selector"
npm install
npm run dev
```

## Template Data

The application displays templates with the following methodologies:
- **Traditional**: Structured, phase-based project management templates
- **Agile**: Iterative, flexible project management templates  
- **Hybrid**: Mixed methodology templates combining traditional and agile approaches

All template data is currently served from the backend API with features like:
- Search and filtering by methodology, category, and complexity
- Template ratings and usage statistics
- Responsive design for all screen sizes
- Keyboard navigation support

## Features

- Template grid display with search and filtering
- Preview modal for template details
- Methodology and category filtering (Traditional, Agile, Hybrid)
- Responsive design for all screen sizes
- Keyboard navigation support
- Loading states and animations
- Real-time search with debouncing
- Template usage statistics and ratings

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Open command palette
- `Arrow Keys`: Navigate between templates
- `Enter`: Select template
- `Esc`: Close modals
- `Tab`: Navigate through interactive elements

## Development

### Backend Development

The backend server provides a REST API for template data:

```bash
# Start backend in development mode
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development

```bash
# Start frontend with hot reload
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **Styling**: CSS with CSS Grid and Flexbox
- **API**: RESTful API with JSON responses
- **Testing**: Jest + React Testing Library

---

**Note**: This application is part of the PM Tools Templates project and displays template data with proper Traditional/Agile/Hybrid methodology categorization.
