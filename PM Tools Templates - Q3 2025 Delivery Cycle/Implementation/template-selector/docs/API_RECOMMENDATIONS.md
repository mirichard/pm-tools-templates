# Recommendation API Documentation

## Base URL

```
http://localhost:3001/api/recommendations
```

## Authentication

All endpoints are currently anonymous. Session management is handled through `sessionId` parameter.

## Endpoints

### 1. Track User Interaction

Track user interactions with templates for recommendation learning.

**Endpoint:** `POST /api/recommendations/track`

**Request Body:**
```json
{
  "sessionId": "string (required)",
  "templateId": "string (required)",
  "interactionType": "string (required)",
  "metadata": "object (optional)"
}
```

**Interaction Types:**
- `view`: User viewed template
- `download`: User downloaded template
- `favorite`: User favorited template
- `share`: User shared template
- `rate`: User rated template

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/recommendations/track \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1642089600000_abc123",
    "templateId": "template_project_charter",
    "interactionType": "view",
    "metadata": {
      "source": "search",
      "timestamp": "2025-07-15T09:32:47Z"
    }
  }'
```

**Response:**
```json
{
  "message": "Interaction tracked successfully"
}
```

**Error Responses:**
- `400`: Missing required fields
- `500`: Internal server error

---

### 2. Get Hybrid Recommendations

Get personalized recommendations using multiple algorithms.

**Endpoint:** `POST /api/recommendations/hybrid`

**Request Body:**
```json
{
  "sessionId": "string (required)",
  "limit": "number (optional, default: 10)",
  "options": {
    "includeContentBased": "boolean (optional, default: true)",
    "includeCollaborative": "boolean (optional, default: true)",
    "includePopularity": "boolean (optional, default: true)",
    "includeProgressive": "boolean (optional, default: true)",
    "weights": {
      "contentBased": "number (optional, default: 0.3)",
      "collaborative": "number (optional, default: 0.3)",
      "popularity": "number (optional, default: 0.2)",
      "progressive": "number (optional, default: 0.2)"
    }
  }
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/recommendations/hybrid \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1642089600000_abc123",
    "limit": 5,
    "options": {
      "includeContentBased": true,
      "includeCollaborative": true,
      "includePopularity": false,
      "includeProgressive": true,
      "weights": {
        "contentBased": 0.4,
        "collaborative": 0.4,
        "progressive": 0.2
      }
    }
  }'
```

**Response:**
```json
[
  {
    "template": {
      "id": "template_project_charter",
      "name": "Project Charter Template",
      "description": "Comprehensive project charter for agile projects",
      "methodology": "Agile",
      "category": "Planning",
      "complexity": "intermediate",
      "tags": ["project", "charter", "agile"],
      "lastUpdated": "2025-07-15T09:32:47Z",
      "author": "PM Tools Team",
      "rating": 4.5,
      "usageCount": 1250,
      "previewUrl": "/templates/project-charter/preview"
    },
    "score": 0.85,
    "reason": "Similar to your recent agile template selections",
    "confidence": 0.92,
    "types": ["content-based", "collaborative"]
  }
]
```

**Error Responses:**
- `400`: sessionId is required
- `500`: Failed to get recommendations

---

### 3. Get Content-Based Recommendations

Get recommendations similar to a specific template.

**Endpoint:** `POST /api/recommendations/content-based`

**Request Body:**
```json
{
  "templateId": "string (required)",
  "limit": "number (optional, default: 5)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/recommendations/content-based \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "template_project_charter",
    "limit": 3
  }'
```

**Response:**
```json
[
  {
    "template": {
      "id": "template_stakeholder_analysis",
      "name": "Stakeholder Analysis Template",
      "description": "Identify and analyze project stakeholders",
      "methodology": "Agile",
      "category": "Planning",
      "complexity": "intermediate",
      "rating": 4.2,
      "usageCount": 890
    },
    "similarity": 0.78,
    "reason": "Similar methodology and category"
  }
]
```

**Error Responses:**
- `400`: templateId is required
- `500`: Failed to get recommendations

---

### 4. Get Collaborative Recommendations

Get recommendations based on similar users' preferences.

**Endpoint:** `POST /api/recommendations/collaborative`

**Request Body:**
```json
{
  "sessionId": "string (required)",
  "limit": "number (optional, default: 5)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/recommendations/collaborative \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1642089600000_abc123",
    "limit": 3
  }'
```

**Response:**
```json
[
  {
    "template": {
      "id": "template_risk_register",
      "name": "Risk Register Template",
      "description": "Track and manage project risks",
      "methodology": "Agile",
      "category": "Planning",
      "complexity": "intermediate",
      "rating": 4.3,
      "usageCount": 1150
    },
    "score": 0.72,
    "reason": "Users with similar interests also liked this template"
  }
]
```

**Error Responses:**
- `400`: sessionId is required
- `500`: Failed to get recommendations

---

### 5. Get Popularity Recommendations

Get recommendations based on template popularity.

**Endpoint:** `POST /api/recommendations/popularity`

**Request Body:**
```json
{
  "sessionId": "string (required)",
  "limit": "number (optional, default: 5)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/recommendations/popularity \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1642089600000_abc123",
    "limit": 5
  }'
```

**Response:**
```json
[
  {
    "template": {
      "id": "template_sprint_planning",
      "name": "Sprint Planning Template",
      "description": "Plan your agile sprints effectively",
      "methodology": "Agile",
      "category": "Planning",
      "complexity": "beginner",
      "rating": 4.7,
      "usageCount": 2340
    },
    "score": 0.94,
    "reason": "Popular template with 4.7 star rating and 2340 uses"
  }
]
```

**Error Responses:**
- `400`: sessionId is required
- `500`: Failed to get recommendations

---

### 6. Get Progressive Recommendations

Get recommendations based on user experience level.

**Endpoint:** `POST /api/recommendations/progressive`

**Request Body:**
```json
{
  "sessionId": "string (required)",
  "limit": "number (optional, default: 5)"
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3001/api/recommendations/progressive \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session_1642089600000_abc123",
    "limit": 4
  }'
```

**Response:**
```json
[
  {
    "template": {
      "id": "template_basic_kanban",
      "name": "Basic Kanban Board Template",
      "description": "Simple kanban board for beginners",
      "methodology": "Agile",
      "category": "Execution",
      "complexity": "beginner",
      "rating": 4.1,
      "usageCount": 1680
    },
    "score": 4.1,
    "reason": "Recommended for beginner users"
  }
]
```

**Error Responses:**
- `400`: sessionId is required
- `500`: Failed to get recommendations

---

### 7. Get Recommendation Analytics

Get analytics data for the recommendation system.

**Endpoint:** `GET /api/recommendations/analytics`

**Example Request:**
```bash
curl -X GET http://localhost:3001/api/recommendations/analytics
```

**Response:**
```json
{
  "totalSessions": 1247,
  "totalViews": 15623,
  "totalDownloads": 3456,
  "mostViewed": [
    {
      "template": "Project Charter Template",
      "views": 856
    },
    {
      "template": "Sprint Planning Template",
      "views": 743
    },
    {
      "template": "Risk Register Template",
      "views": 689
    }
  ],
  "mostDownloaded": [
    {
      "template": "Risk Register Template",
      "downloads": 234
    },
    {
      "template": "Project Charter Template",
      "downloads": 189
    },
    {
      "template": "Stakeholder Analysis Template",
      "downloads": 156
    }
  ],
  "averageInteractionsPerSession": 3.2
}
```

**Error Responses:**
- `500`: Failed to fetch recommendation analytics

---

## Rate Limiting

- **Tracking endpoint**: 100 requests per minute per session
- **Recommendation endpoints**: 20 requests per minute per session
- **Analytics endpoint**: 10 requests per minute per IP

## Caching

- **Hybrid recommendations**: 5-minute cache
- **Content-based recommendations**: 10-minute cache
- **Collaborative recommendations**: 5-minute cache
- **Popularity recommendations**: 10-minute cache
- **Progressive recommendations**: 5-minute cache

## Response Time SLA

- **Target**: <200ms for all recommendation endpoints
- **Monitoring**: Automatic alerts if response time exceeds 500ms
- **Optimization**: Responses are cached and pre-computed when possible

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "timestamp": "2025-07-15T09:32:47Z"
}
```

### Common Error Codes

- `MISSING_REQUIRED_FIELDS`: Required parameters not provided
- `INVALID_SESSION_ID`: Session ID format is invalid
- `TEMPLATE_NOT_FOUND`: Referenced template does not exist
- `RECOMMENDATION_ENGINE_ERROR`: Internal recommendation algorithm error
- `CACHE_ERROR`: Caching system error
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Session Management

### Session ID Format

Session IDs follow the pattern: `session_{timestamp}_{random_string}`

Example: `session_1642089600000_abc123def456`

### Session Lifecycle

1. **Creation**: Automatically created on first interaction
2. **Duration**: Sessions expire after 24 hours of inactivity
3. **Storage**: Stored in browser sessionStorage
4. **Privacy**: No personally identifiable information stored

### Session Data

Each session tracks:
- Interaction history
- Preference patterns
- User experience level
- Methodology preferences
- Category interests

## Testing

### Unit Tests

```bash
# Test individual recommendation algorithms
npm test -- --grep "recommendationService"

# Test API endpoints
npm test -- --grep "recommendation endpoints"

# Test caching behavior
npm test -- --grep "recommendation caching"
```

### Integration Tests

```bash
# Test full recommendation flow
npm test -- --grep "recommendation integration"

# Test performance benchmarks
npm test -- --grep "recommendation performance"
```

### Load Testing

```bash
# Test recommendation endpoint performance
npm run test:load -- --target=recommendations

# Test with multiple concurrent users
npm run test:load -- --users=100 --duration=60s
```

## Monitoring

### Metrics Tracked

- **Response times**: Average, P95, P99 response times
- **Cache hit rates**: Percentage of requests served from cache
- **Recommendation quality**: Click-through rates, conversion rates
- **Error rates**: Percentage of failed requests
- **User engagement**: Session duration, interactions per session

### Alerting

Alerts are triggered for:
- Response time > 500ms for 5 consecutive minutes
- Error rate > 5% for 2 consecutive minutes
- Cache hit rate < 80% for 10 consecutive minutes

### Dashboards

- **Performance Dashboard**: Response times, throughput, error rates
- **Business Dashboard**: User engagement, recommendation effectiveness
- **System Dashboard**: Cache performance, resource utilization

## Security

### Data Protection

- **No PII**: Personal information is never stored
- **Session-based**: All data tied to temporary session IDs
- **Encryption**: All data transmitted over HTTPS
- **Anonymization**: User behavior patterns are anonymized

### Input Validation

All endpoints validate:
- Required fields presence
- Data type correctness
- Value range constraints
- Malicious input detection

### Rate Limiting

Rate limits protect against:
- Abuse and spam
- Excessive resource consumption
- Denial of service attacks

## Deployment

### Environment Variables

```bash
# Recommendation system configuration
RECOMMENDATION_CACHE_TTL=300
RECOMMENDATION_MAX_SESSIONS=10000
RECOMMENDATION_DEBUG=false

# Performance tuning
RECOMMENDATION_BATCH_SIZE=100
RECOMMENDATION_WORKER_THREADS=4
```

### Health Checks

```bash
# Check recommendation system health
curl http://localhost:3001/api/health

# Check specific recommendation endpoints
curl http://localhost:3001/api/recommendations/analytics
```

### Scaling

The recommendation system can be scaled by:
- **Horizontal scaling**: Multiple server instances
- **Caching**: Redis cluster for shared caching
- **Database**: Read replicas for template data
- **Load balancing**: Distribute requests across instances

## Migration

### From Basic Recommendations

If migrating from basic popularity-based recommendations:

1. **Gradual rollout**: Enable ML recommendations for subset of users
2. **A/B testing**: Compare performance against existing system
3. **Monitoring**: Track user satisfaction and engagement metrics
4. **Fallback**: Keep basic system as fallback option

### Data Migration

No data migration required - system learns from new user interactions.
