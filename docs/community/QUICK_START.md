# 🚀 Community Platform Quick Start

**Get the Template Curation Dashboard running in 5 minutes**

## TL;DR
```bash
git clone https://github.com/mirichard/pm-tools-templates.git
cd pm-tools-templates/backend
npm install
npm run dev
# Open http://localhost:8080
```

## Step-by-Step Setup

### 1. **Prerequisites**
- [Node.js](https://nodejs.org/) (v14 or higher)
- Git
- Web browser

### 2. **Clone & Setup**
```bash
# Clone the repository
git clone https://github.com/mirichard/pm-tools-templates.git
cd pm-tools-templates

# Navigate to backend
cd backend

# Install dependencies
npm install
```

### 3. **Launch the Platform**
```bash
# Start everything (extracts metrics + serves dashboard)
npm run dev
```

**You should see:**
```
✓ Template metrics extracted successfully!
✓ 224 templates processed
✓ Server running on http://localhost:8080
✓ Dashboard ready!
```

### 4. **Access the Dashboard**
- Open your browser
- Go to **http://localhost:8080**
- Explore the interactive analytics!

## What You'll See

### 📊 **Dashboard Features**
- **Template Tier Distribution**: Pie chart showing Premium, Featured, etc.
- **Score Analysis**: Bar charts of UX, Functionality, Documentation scores
- **Template Table**: Searchable list of all 200+ templates
- **Filters**: Click tier buttons to filter by classification

### 🎯 **Key Metrics**
- **200+ Templates** processed from 7 directories
- **5-Tier Classification** (Premium → Community)
- **Multi-dimensional Scoring** (UX, Functionality, Docs)
- **Real-time Analytics** with interactive charts

## Next Steps

### 🤝 **Join the Community**
- **Events**: [Community Events Program](community-events-program.md)
- **Gamification**: [Recognition System](gamification-system.md)
- **Contributions**: [Contributing Guidelines](../../CONTRIBUTING.md)

### 💰 **Explore Monetization**
- **Marketplace**: [Monetization Framework](../marketplace/monetization-framework.md)
- **Premium Content**: Learn about subscription tiers
- **Revenue Sharing**: 70/30 split for contributors

### 🔧 **Customize & Extend**
- **Backend**: [Backend README](../../backend/README.md)
- **Dashboard**: [Dashboard README](../../curation-dashboard/README.md)
- **Community Guide**: [Full Platform Guide](community-platform-guide.md)

## Troubleshooting

**Dashboard won't load?**
- Ensure backend is running: `npm run dev` in `/backend`
- Check URL is `localhost:8080` (not 127.0.0.1)

**Port 8080 busy?**
```bash
PORT=3000 npm run dev
```

**Metrics outdated?**
```bash
npm run extract
```

**Need help?**
- [Open an issue](https://github.com/mirichard/pm-tools-templates/issues)
- [Join discussions](https://github.com/mirichard/pm-tools-templates/discussions)

---

**Ready to explore?** 🎉 The Template Curation Dashboard is your gateway to understanding our 200+ project management templates and joining our thriving community!
