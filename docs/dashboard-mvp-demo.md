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

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/mirichard/pm-tools-templates.git

=======


   cd pm-tools-templates
   ```
2. **Start the demo** using the provided script or npm command
   ```bash
   npm run dashboard-demo
   # or
   ./scripts/start-dashboard-demo.sh
   ```
   The script automatically installs dependencies on first run and creates `.env.local` if needed.
   Visit [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Production build
Run these commands inside the `dashboard-mvp` folder:
```bash
cd dashboard-mvp

=======
=======
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
4. **Create environment file**
   ```bash
   cp .env.example .env.local
   # Update NEXT_PUBLIC_API_BASE_URL as needed
   ```
5. **Start the development server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Production build
```bash


npm run build
npm start
```

For more details see [dashboard-mvp/README.md](../dashboard-mvp/README.md).
