# Schedule Intelligence API Documentation

## Overview

The Schedule Intelligence API provides AI-powered project scheduling optimization, critical path analysis, and schedule risk assessment. This API helps project managers create realistic schedules, identify potential delays, and optimize project timelines using machine learning algorithms.

## API Endpoints

### Base URL
```
https://api.pm-insights.com/v1/schedule-intelligence
```

### Authentication
```
Authorization: Bearer <your-api-key>
```

## Core Endpoints

### 1. Schedule Optimization

**Endpoint:** `POST /optimize-schedule`

**Description:** Analyzes project tasks and constraints to generate optimized schedule recommendations.

#### Request Body
```json
{
  "project": {
    "id": "string",
    "name": "string",
    "start_date": "ISO8601",
    "target_end_date": "ISO8601",
    "priority": "string" // "low", "medium", "high", "critical"
  },
  "tasks": [
    {
      "id": "string",
      "name": "string",
      "duration": "number", // hours
      "effort": "number", // person-hours
      "dependencies": ["string"], // task IDs
      "constraints": {
        "earliest_start": "ISO8601",
        "latest_finish": "ISO8601",
        "fixed_duration": "boolean"
      },
      "resources": [
        {
          "role": "string",
          "count": "number",
          "skills_required": ["string"]
        }
      ]
    }
  ],
  "optimization_criteria": {
    "primary_objective": "string", // "minimize_duration", "balance_resources", "minimize_cost"
    "buffer_preferences": {
      "critical_path_buffer": "number", // percentage
      "resource_buffer": "number", // percentage
      "milestone_buffer": "number" // percentage
    }
  }
}
```

#### Response
```json
{
  "optimization_id": "string",
  "optimized_schedule": {
    "project_duration": "number", // days
    "critical_path": ["string"], // task IDs
    "schedule_risk": "number", // 0-1
    "resource_utilization": "number", // 0-1
    "optimization_score": "number" // 0-1
  },
  "task_schedule": [
    {
      "task_id": "string",
      "start_date": "ISO8601",
      "end_date": "ISO8601",
      "float": "number", // days
      "criticality": "number", // 0-1
      "resource_assignments": ["string"]
    }
  ],
  "recommendations": [
    "string"
  ]
}
```

### 2. Critical Path Analysis

**Endpoint:** `POST /analyze-critical-path`

**Description:** Identifies critical path and analyzes schedule flexibility.

### 3. Schedule Risk Assessment

**Endpoint:** `POST /assess-schedule-risk`

**Description:** Evaluates schedule risks and provides mitigation recommendations.

### 4. Progress Tracking Intelligence

**Endpoint:** `POST /track-progress`

**Description:** Analyzes schedule progress and predicts completion dates.

## Integration Support

### Popular PM Tools
- Microsoft Project
- Jira
- Asana
- Monday.com
- Smartsheet

---

**Last Updated:** {{ current_date }}
**API Version:** 1.0

