# ⚡ Workflow Performance Report


**Generated:** 2025-06-22T19:55:29.183260
**Repository:** mirichard/pm-tools-templates
**Analysis Period:** Last 24 hours

## 📊 Performance Summary

| Metric | Value | Score | Status |
|--------|-------|-------|--------|
| Overall Performance | 100.0/100 | 100.0 | 🟢 Good |
| Queue Performance | 100.0/100 | 100.0 | 🟢 Fast |
| Execution Performance | 100/100 | 100 | 🟢 Efficient |

## ⏱️ Timing Analysis

- **Average Queue Time:** 0.0 minutes
- **Average Execution Time:** 0.7 minutes
- **Maximum Queue Time:** 0.0 minutes
- **Maximum Execution Time:** 6.02 minutes
- **Total Runs Analyzed:** 741

## 🔍 Per-Workflow Performance

| Workflow | Avg Queue Time | Avg Execution Time | Runs |
|----------|----------------|-------------------|------|
| 🏥 Workflow Health Monitor | 0.0 min | 1.79 min | 53 |
| 📧 Stakeholder Notification System | 0.0 min | 0.25 min | 129 |
| Infrastructure Security Test | 0.0 min | 0.14 min | 24 |
| 🔍 Static Application Security Testing (SAST) | 0.0 min | 0.8 min | 43 |
| Link Health Check | 0.0 min | 0.37 min | 41 |
| CodeQL Security Analysis | 0.0 min | 4.56 min | 41 |
| Quality Checks | 0.0 min | 0.38 min | 40 |
| Infrastructure Security Analysis | 0.0 min | 0.15 min | 22 |
| 🚨 Risk Management Automation | 0.0 min | 0.23 min | 51 |
| ✅ Quality Gate Enforcement | 0.0 min | 0.2 min | 51 |
| 📊 Project Health Dashboard Generator | 0.0 min | 0.36 min | 129 |
| .github/workflows/api-integration-testing.yml | 0.0 min | 0.0 min | 1 |
| 🔌 API Integration Testing | 0.0 min | 0.01 min | 8 |
| .github/workflows/risk-management.yml | 0.0 min | 0.0 min | 2 |
| 👁️ Visual Regression Testing | 0.0 min | 5.6 min | 4 |
| 🔒 Dependency Security Scan | 0.0 min | 0.61 min | 4 |
| Anchor Link Check | 0.0 min | 0.29 min | 7 |
| 🎯 Enhanced Template Validation | 0.0 min | 0.17 min | 6 |
| .github/workflows/welcome-new-contributors.yml | 0.0 min | 0.0 min | 1 |
| pages build and deployment | 0.0 min | 0.51 min | 63 |
| 📦 Artifact Lifecycle Manager | 0.0 min | 0.53 min | 2 |
| Welcome New Contributors | 0.0 min | 0.12 min | 1 |
| SAST Security Test | 0.0 min | 0.23 min | 1 |
| .github/workflows/infrastructure-security.yml | 0.0 min | 0.0 min | 17 |


## 🎯 Performance Recommendations

### Queue Time Optimization
- **Good (< 2 min):** Workflows start quickly
- **Fair (2-5 min):** Acceptable queue times
- **Poor (> 5 min):** Consider runner scaling or peak time scheduling

### Execution Time Optimization
- **Monitor long-running workflows** for optimization opportunities
- **Implement caching** for dependency installations
- **Use parallel jobs** where possible
- **Consider workflow splitting** for complex pipelines

### Infrastructure Recommendations
- **Runner Scaling:** Increase concurrent runners during peak times
- **Caching Strategy:** Implement comprehensive caching for all workflows
- **Dependency Optimization:** Use lock files and cached installations
- **Resource Allocation:** Monitor resource usage patterns

