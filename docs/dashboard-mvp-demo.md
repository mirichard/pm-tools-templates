# Dashboard MVP Demo

**Experience the interactive project health dashboard**

The `dashboard-mvp` project provides a production-ready Next.js dashboard for monitoring KPIs, risks, and team performance. Use this demo to explore its features locally.

## 🎯 Features
- Real-time KPI and risk visualization
- Customizable widgets and themes
- Mobile-friendly responsive layout

## 🚀 Running the Demo

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick start
1. **Clone the repository**
   ```bash
   git clone https://github.com/mirichard/pm-tools-templates.git
   cd pm-tools-templates
   ```
2. **Start the demo** from the repository root
   ```bash
   npm run dashboard-demo
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Manual setup
Use this path if you want to run lint or tests, or control each step yourself.

1. **Change into the dashboard directory**
   ```bash
   cd pm-tools-templates/dashboard-mvp
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Optional: run ESLint**
   ```bash
   npm run lint
   ```
4. **Optional: configure environment variables**
   Create `dashboard-mvp/.env.local` and set `NEXT_PUBLIC_API_BASE_URL` if you
   need to point the dashboard at a non-default API host. The demo runs without it.
5. **Start the development server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Production build
Run these commands inside the `dashboard-mvp` folder:
```bash
cd dashboard-mvp
npm run build
npm start
```

For more details see [dashboard-mvp/README.md](../dashboard-mvp/README.md).
