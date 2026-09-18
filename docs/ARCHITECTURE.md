# Architecture Documentation

## Phase 3: Advanced Template Browser

This document outlines the architecture for the advanced template browser with preview capabilities, saved searches, and version history.

### Overview

The Phase 3 implementation introduces:
- **Astro-based static site generator** for optimal performance
- **React components** for interactive features
- **Client-side favorites** using localStorage
- **Git-based version history** for each template
- **Multi-format template previews** (Markdown, Office docs)

### Tech Stack

- **Frontend Framework**: Astro 4.x with React integration
- **Styling**: CSS custom properties with Tufte-inspired design
- **Build System**: Vite (via Astro)
- **Deployment**: GitHub Pages
- **Version Control**: Git log parsing for changelogs

### Directory Structure

```
docs/site/
├── package.json              # Dependencies and scripts
├── astro.config.mjs          # Astro configuration
├── tsconfig.json             # TypeScript configuration
├── src/
│   ├── layouts/
│   │   └── Layout.astro      # Main page layout
│   ├── pages/
│   │   ├── index.astro       # Template browser
│   │   ├── favorites.astro   # Favorites page
│   │   └── templates/
│   │       └── [id].astro    # Individual template view
│   └── components/
│       ├── TemplateBrowser.tsx    # Main browser component
│       ├── TemplateViewer.tsx     # Template preview & history
│       └── FavoritesPage.tsx      # Favorites display
├── public/
│   ├── favicon.svg           # Site icon
│   └── changelog/            # Generated changelog files
│       └── *.json
└── dist/                     # Built static files
```

### Key Components

#### 1. TemplateBrowser.tsx
- **Purpose**: Main interface for browsing and filtering templates
- **Features**:
  - Real-time search across titles and descriptions
  - Methodology filtering
  - Favorites toggle using localStorage
  - Responsive grid layout

#### 2. TemplateViewer.tsx
- **Purpose**: Individual template display with preview and history
- **Features**:
  - Tabbed interface (Preview / Version History)
  - Multi-format file support detection
  - Timeline-based changelog visualization
  - Graceful fallback for unsupported formats

#### 3. FavoritesPage.tsx
- **Purpose**: Dedicated page for user's saved templates
- **Features**:
  - LocalStorage persistence
  - Empty state handling
  - Quick unfavorite functionality

### Changelog Generation

The `scripts/generate-changelogs.js` script:
1. Scans all template files (MD, DOCX, XLSX, PPTX)
2. Uses `git log --follow` to track file history
3. Filters out merge commits and generic messages
4. Generates JSON files in `/public/changelog/`

### LocalStorage Schema

Favorites are stored client-side using the key `pmtt_favs`:

```json
["template-id-1", "template-id-2", "template-id-3"]
```

### Build Process

1. **Pre-build**: Generate changelog JSON files
2. **Astro Build**: Static site generation with React hydration
3. **Post-build**: Copy assets and prepare for deployment

### Performance Considerations

- **Code Splitting**: Office viewer libraries loaded on-demand
- **Static Generation**: All pages pre-built at build time
- **Minimal JS**: Only interactive components hydrated
- **Bundle Size**: Target <200KB total JavaScript

### Accessibility

- **WCAG 2.2 AA**: Keyboard navigation and screen reader support
- **Color Contrast**: Minimum 4.5:1 ratio maintained
- **Progressive Enhancement**: Works without JavaScript
- **Download Fallbacks**: Always provide original file access

### Deployment

GitHub Actions workflow (`.github/workflows/build-deploy-site.yml`):
1. Checkout with full git history
2. Install dependencies
3. Generate changelogs
4. Build Astro site
5. Deploy to GitHub Pages

### Future Enhancements

- **Office Document Previews**: Integrate docx-preview, xlsx-js
- **Advanced Search]: Fuzzy matching and tag-based filtering
- **Template Ratings**: Community feedback integration
- **Export Features**: Bulk download and custom collections
