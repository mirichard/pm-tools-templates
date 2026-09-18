# 🚀 Community Platform: Deployment & User Guide

**Last Updated:** August 2025

This guide provides comprehensive instructions for deploying, using, and participating in the Community Engagement Platform.

---

## Table of Contents
- [Deployment \u0026 Setup](#deployment-setup)
  - [Prerequisites](#prerequisites)
  - [Running the Backend Services](#running-the-backend-services)
  - [Accessing the Dashboard](#accessing-the-dashboard)
- [Curation Dashboard User Guide](#curation-dashboard-user-guide)
- [Key Metrics \u0026 Visualizations](#key-metrics-visualizations)
  - [Interpreting Template Scores](#interpreting-template-scores)
  - [Using Filters and Search](#using-filters-and-search)
- [Community Engagement Guide](#community-engagement-guide)
- [Gamification \u0026 Recognition](#gamification-recognition)
  - [Community Events Program](#community-events-program)
- [Feedback \u0026 Contributions](#feedback-contributions)
- [Template Marketplace Guide](#template-marketplace-guide)
  - [Monetization Framework](#monetization-framework)
  - [Quality Assurance Process](#quality-assurance-process)
  - [Becoming a Premium Contributor](#becoming-a-premium-contributor)
- [Troubleshooting](#troubleshooting)

---

## Deployment & Setup

### Prerequisites
- **Node.js & npm**: Required for running the backend services. [Install Node.js](https://nodejs.org/)
- **Git**: For cloning the repository.

### Running the Backend Services

1. **Clone the Repository**
   ```bash
   git clone https://github.com/mirichard/pm-tools-templates.git
   cd pm-tools-templates/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   - This command starts the backend server on `http://localhost:8080`.
   - It also automatically extracts the latest template metrics.

### Accessing the Dashboard
- Open your web browser and navigate to **http://localhost:8080**.
- The dashboard will load with real-time analytics.

---

## Curation Dashboard User Guide

### Key Metrics & Visualizations
- **Template Tier Distribution**: Pie chart showing the percentage of templates in each tier (Premium, Featured, etc.).
- **Score Distribution**: Bar chart showing the distribution of UX, Functionality, and Documentation scores.
- **Template Analytics Table**: A detailed, filterable table of all templates with their scores and tiers.

### Interpreting Template Scores
- **UX Score**: User experience and ease of use.
- **Functionality Score**: Completeness and effectiveness of the template.
- **Docs Score**: Quality and clarity of the documentation.
- **Overall Score**: A weighted average of the three scores.

### Using Filters and Search
- **Search**: Use the search bar to find templates by name.
- **Tier Filters**: Click the tier buttons to filter the table by classification.

---

## Community Engagement Guide

### Gamification & Recognition
- **Points & Badges**: Earn points and badges for contributions (e.g., submitting templates, providing feedback).
- **Leaderboard**: See how you rank among community contributors.
- **Contribution Tiers**: Unlock new roles and responsibilities as you contribute.

*Reference: [Community Gamification System](gamification-system.md)*

### Community Events Program
- **Monthly Calls**: Join our monthly community calls to discuss new features and provide feedback.
- **Workshops**: Participate in workshops to learn new skills and collaborate on projects.
- **Expert Office Hours**: Get one-on-one help from experienced community members.

*Reference: [Community Events Program](community-events-program.md)*

### Feedback & Contributions
- **Submit Feedback**: Use the issue templates to submit feedback on templates and features.
- **Contribute Templates**: Follow our [Contributing Guidelines](CONTRIBUTING.md) to submit new templates.

---

## Template Marketplace Guide

### Monetization Framework
- **Pricing Models**: Templates are categorized into Free, Basic, Pro, and Enterprise tiers.
- **Revenue Sharing**: Premium contributors receive a 70% share of the revenue from their templates.
- **Subscription Tiers**: Users can subscribe to access premium templates and features.

*Reference: [Monetization Framework](docs/marketplace/monetization-framework.md)*

### Quality Assurance Process
- **Automated Validation**: All templates are automatically validated for compliance and quality.
- **Peer Review**: Community experts review and approve new templates.
- **Curation Scoring**: Templates are scored based on multiple quality dimensions.

### Becoming a Premium Contributor
- **Contribute High-Quality Templates**: Submit templates that meet our quality standards.
- **Engage with the Community**: Participate in discussions and provide feedback.
- **Apply for Premium Status**: Contact us to apply for premium contributor status.

---

## Troubleshooting
- **Dashboard Not Loading**: Ensure the backend server is running and that you are on the correct URL (http://localhost:8080).
- **Metrics Not Updating**: Run `npm run extract` in the `backend` directory to manually refresh the metrics.
- **CORS Errors**: The backend server is configured with CORS support, but if you encounter issues, ensure you are accessing the dashboard from localhost.
