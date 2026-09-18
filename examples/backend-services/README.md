# 📊 Template Curation Backend

This directory contains the backend services for the Template Curation Dashboard and Community Platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start the dashboard (extracts metrics + serves UI)
npm run dev

# Access dashboard at: http://localhost:8080
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the full system (extract metrics + serve dashboard) |
| `npm run extract` | Extract template metrics only |
| `npm run serve` | Serve dashboard only (requires existing metrics) |

## What This Does

### Template Metrics Extraction
- Scans 200+ templates across 7 directories
- Extracts metadata and generates quality scores
- Creates `../public/metrics/curation-metrics.json`

### Dashboard Server
- Serves interactive analytics dashboard
- Provides CORS-enabled API endpoints
- Hosts frontend at `localhost:8080`

## File Structure

```
backend/
├── extract-metrics.js    # Template scanning and scoring
├── server.js            # Web server and API
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## Template Scoring

Templates are scored across three dimensions:
- **UX Score** (1-10): User experience and ease of use
- **Functionality Score** (1-10): Completeness and effectiveness
- **Docs Score** (1-10): Documentation quality

Scores are generated based on template location and characteristics:
- Premium templates: 8.5-10 range
- Featured templates: 7.5-9 range
- Standard templates: 6-8 range

## Tier Classification

| Tier | Criteria | Score Range |
|------|----------|-------------|
| **Premium** | High-value, enterprise-ready | 8.5-10 |
| **Featured** | Community favorites, proven | 7.5-9 |
| **Recommended** | Solid quality, well-tested | 6.5-8 |
| **Standard** | Good baseline quality | 5.5-7 |
| **Community** | User-contributed, emerging | 4-6 |

## Troubleshooting

**Port 8080 in use?**
```bash
# Kill existing process
lsof -ti:8080 | xargs kill

# Or use different port
PORT=3000 npm run dev
```

**Metrics not updating?**
```bash
npm run extract
```

**CORS issues?**
Ensure you're accessing from `localhost:8080` (not `127.0.0.1` or file://)
