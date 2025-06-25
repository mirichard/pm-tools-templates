# Analytics Platform API Documentation

## Overview

The Analytics Platform API provides comprehensive endpoints for accessing project management analytics, metrics, and reporting capabilities. This RESTful API supports data retrieval, real-time analytics, custom report generation, and dashboard management.

## Base Information

- **Base URL:** `https://api.analytics.pmtools.com/v1`
- **Authentication:** Bearer Token (JWT)
- **Content Type:** `application/json`
- **API Version:** v1.2

## Authentication

### JWT Token Authentication
```bash
# Include token in request headers
curl -H "Authorization: Bearer <your-jwt-token>" \
     -H "Content-Type: application/json" \
     https://api.analytics.pmtools.com/v1/projects
```

### Token Structure
```json
{
  "user_id": 12345,
  "username": "john.doe@company.com",
  "roles": ["analyst", "viewer"],
  "permissions": ["read:analytics", "write:reports"],
  "exp": 1640995200,
  "iat": 1640908800
}
```

## Core Endpoints

### Projects Analytics

#### Get Project Metrics
```http
GET /projects/{project_id}/metrics
```

**Parameters:**
- `project_id` (required): Project identifier
- `start_date` (optional): Start date for metrics (ISO 8601)
- `end_date` (optional): End date for metrics (ISO 8601)
- `metrics` (optional): Comma-separated list of specific metrics

**Response:**
```json
{
  "status": "success",
  "data": {
    "project_id": "proj_123",
    "metrics": {
      "budget_variance": -0.15,
      "schedule_variance": 0.08,
      "team_velocity": 42.5,
      "quality_score": 87.3,
      "risk_score": 23.1
    },
    "time_series": [
      {
        "timestamp": "2024-01-01T00:00:00Z",
        "budget_spent": 125000,
        "tasks_completed": 45,
        "team_size": 8
      }
    ]
  }
}
```

#### Get Project Dashboard Data
```http
GET /projects/{project_id}/dashboard
```

**Response:**
```json
{
  "status": "success", 
  "data": {
    "summary": {
      "total_budget": 500000,
      "budget_utilized": 425000,
      "completion_percentage": 85,
      "days_remaining": 15
    },
    "charts": {
      "budget_trend": [...],
      "velocity_chart": [...],
      "risk_distribution": [...]
    },
    "alerts": [
      {
        "type": "warning",
        "message": "Budget variance exceeds threshold",
        "severity": "medium"
      }
    ]
  }
}
```

### Portfolio Analytics

#### Get Portfolio Overview
```http
GET /portfolio/overview
```

**Parameters:**
- `portfolio_id` (optional): Specific portfolio identifier
- `include_inactive` (optional): Include inactive projects (default: false)

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_projects": 24,
    "active_projects": 18,
    "total_budget": 12500000,
    "projects_on_track": 15,
    "projects_at_risk": 3,
    "average_completion": 67.5,
    "portfolio_health_score": 78.2
  }
}
```

#### Get Portfolio Performance Metrics
```http
GET /portfolio/performance
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "performance_metrics": {
      "on_time_delivery_rate": 0.83,
      "budget_adherence_rate": 0.91,
      "quality_achievement_rate": 0.87,
      "stakeholder_satisfaction": 4.2
    },
    "trend_analysis": {
      "delivery_trend": "improving",
      "budget_trend": "stable", 
      "quality_trend": "improving"
    }
  }
}
```

### Team Analytics

#### Get Team Performance
```http
GET /teams/{team_id}/performance
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "team_id": "team_456",
    "metrics": {
      "average_velocity": 38.5,
      "sprint_completion_rate": 0.92,
      "code_quality_score": 85.7,
      "team_satisfaction": 4.1,
      "knowledge_sharing_index": 72.3
    },
    "member_contributions": [
      {
        "member_id": "usr_789",
        "tasks_completed": 23,
        "story_points": 89,
        "quality_score": 91.2
      }
    ]
  }
}
```

### Reports

#### Generate Custom Report
```http
POST /reports/generate
```

**Request Body:**
```json
{
  "report_type": "project_summary",
  "parameters": {
    "project_ids": ["proj_123", "proj_456"],
    "date_range": {
      "start": "2024-01-01",
      "end": "2024-03-31"
    },
    "metrics": ["budget", "schedule", "quality"],
    "format": "pdf"
  },
  "delivery": {
    "method": "email",
    "recipients": ["manager@company.com"]
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "report_id": "rpt_789",
    "status": "generating",
    "estimated_completion": "2024-01-01T10:05:00Z",
    "download_url": null
  }
}
```

#### Get Report Status
```http
GET /reports/{report_id}/status
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "report_id": "rpt_789",
    "status": "completed",
    "download_url": "https://api.analytics.pmtools.com/v1/reports/rpt_789/download",
    "expires_at": "2024-01-08T10:05:00Z",
    "file_size": 2457600
  }
}
```

### Real-time Analytics

#### WebSocket Connection
```javascript
// Connect to real-time analytics
const ws = new WebSocket('wss://api.analytics.pmtools.com/v1/ws/analytics');

ws.onopen = function() {
  // Subscribe to project updates
  ws.send(JSON.stringify({
    type: 'subscribe',
    channels: ['project.proj_123.metrics', 'team.team_456.activity']
  }));
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  // Handle real-time updates
  console.log('Analytics update:', data);
};
```

#### Real-time Metrics Stream
```http
GET /stream/metrics
```

**Server-Sent Events Response:**
```
data: {"type": "metric_update", "project_id": "proj_123", "metric": "velocity", "value": 42.5, "timestamp": "2024-01-01T10:00:00Z"}

data: {"type": "alert", "severity": "warning", "message": "Budget variance threshold exceeded", "project_id": "proj_123"}
```

## Data Models

### Project Metrics Model
```json
{
  "project_id": "string",
  "timestamp": "ISO8601",
  "budget_metrics": {
    "total_budget": "number",
    "spent_to_date": "number",
    "variance_percentage": "number",
    "burn_rate": "number"
  },
  "schedule_metrics": {
    "planned_duration": "number",
    "actual_duration": "number", 
    "completion_percentage": "number",
    "schedule_performance_index": "number"
  },
  "quality_metrics": {
    "defect_rate": "number",
    "test_coverage": "number",
    "code_quality_score": "number",
    "customer_satisfaction": "number"
  },
  "team_metrics": {
    "team_size": "number",
    "velocity": "number",
    "productivity_index": "number",
    "collaboration_score": "number"
  }
}
```

### Dashboard Configuration Model
```json
{
  "dashboard_id": "string",
  "name": "string",
  "layout": {
    "grid_size": [12, 8],
    "widgets": [
      {
        "id": "widget_1",
        "type": "chart",
        "position": [0, 0],
        "size": [6, 4],
        "config": {
          "chart_type": "line",
          "data_source": "/projects/proj_123/metrics",
          "metrics": ["budget_spent", "budget_planned"]
        }
      }
    ]
  },
  "filters": {
    "date_range": "30d",
    "project_status": ["active", "planning"]
  },
  "refresh_interval": 300
}
```

## Rate Limits

### Standard Limits
- **Analytics Queries:** 1000 requests per hour per user
- **Report Generation:** 50 reports per day per user  
- **Real-time Connections:** 10 concurrent connections per user
- **Dashboard Requests:** 5000 requests per hour per user

### Enterprise Limits
- **Analytics Queries:** 10000 requests per hour per user
- **Report Generation:** 500 reports per day per user
- **Real-time Connections:** 100 concurrent connections per user
- **Dashboard Requests:** 50000 requests per hour per user

## Error Handling

### Error Response Format
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date range specified",
    "details": {
      "field": "start_date",
      "reason": "Start date cannot be in the future",
      "provided_value": "2025-01-01"
    },
    "request_id": "req_12345"
  }
}
```

### Common Error Codes
- `BAD_REQUEST` (400): Invalid request parameters
- `UNAUTHORIZED` (401): Invalid or expired authentication token
- `FORBIDDEN` (403): Insufficient permissions for resource
- `NOT_FOUND` (404): Requested resource does not exist
- `RATE_LIMITED` (429): Rate limit exceeded
- `INTERNAL_ERROR` (500): Server-side processing error
- `SERVICE_UNAVAILABLE` (503): Analytics service temporarily unavailable

## SDK Examples

### Python SDK
```python
from pmtools_analytics import AnalyticsClient

client = AnalyticsClient(api_key='your-api-key')

# Get project metrics
metrics = client.projects.get_metrics('proj_123', 
                                     start_date='2024-01-01',
                                     end_date='2024-01-31')

# Generate report
report = client.reports.generate({
    'report_type': 'project_summary',
    'parameters': {
        'project_ids': ['proj_123'],
        'format': 'pdf'
    }
})

# Real-time metrics
def handle_update(data):
    print(f"Metric update: {data}")

client.stream.subscribe(['project.proj_123.metrics'], handle_update)
```

### JavaScript SDK
```javascript
import { AnalyticsClient } from '@pmtools/analytics-sdk';

const client = new AnalyticsClient({ apiKey: 'your-api-key' });

// Get project dashboard data
const dashboard = await client.projects.getDashboard('proj_123');

// Real-time updates
const stream = client.stream.connect();
stream.subscribe('project.proj_123.metrics', (data) => {
  console.log('Metric update:', data);
});
```

## Webhooks

### Webhook Configuration
```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/analytics",
  "events": [
    "metric.threshold_exceeded",
    "report.completed", 
    "alert.created"
  ],
  "secret": "your-webhook-secret",
  "active": true
}
```

### Webhook Payload Example
```json
{
  "event": "metric.threshold_exceeded",
  "timestamp": "2024-01-01T10:00:00Z",
  "data": {
    "project_id": "proj_123",
    "metric": "budget_variance",
    "current_value": -0.25,
    "threshold": -0.20,
    "severity": "warning"
  },
  "webhook_id": "whk_456"
}
```

---

## Related Resources

- [Development Guide](./development.md)
- [Dashboard Configuration](./dashboard.md)
- [Privacy Guidelines](./privacy.md)
- [Authentication Setup](../auth/README.md)

---

**Last Updated:** {{ current_date }}
**API Version:** 1.2
**Next Review:** {{ next_quarter }}

