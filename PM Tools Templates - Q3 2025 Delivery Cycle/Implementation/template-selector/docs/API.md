# API Documentation

## Base URL
- **Development**: `http://localhost:3001`
- **Staging**: `https://staging-api-template-selector.example.com`
- **Production**: `https://api-template-selector.example.com`

## Authentication
Currently, the API does not require authentication. Future versions will implement JWT-based authentication.

## Rate Limiting
- **Development**: No rate limiting
- **Staging**: 1000 requests per hour per IP
- **Production**: 500 requests per hour per IP

## Endpoints

### Health Check
**GET** `/api/health`

Returns the health status of the API server.

#### Response
```json
{
  "status": "OK",
  "timestamp": "2025-07-08T21:27:30.123Z",
  "version": "1.0.0",
  "uptime": 12345
}
```

### List Templates
**GET** `/api/templates`

Retrieves a paginated list of all templates.

#### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Number of results per page |
| `methodology` | string | - | Filter by methodology |
| `category` | string | - | Filter by category |
| `complexity` | string | - | Filter by complexity |

#### Response
```json
{
  "templates": [
    {
      "id": "1",
      "name": "Agile Sprint Planning",
      "description": "Comprehensive sprint planning template",
      "methodology": "Agile",
      "category": "Planning",
      "complexity": "intermediate",
      "tags": ["scrum", "planning", "sprint"],
      "lastUpdated": "2025-07-08",
      "author": "PM Tools Team",
      "rating": 4.5,
      "usageCount": 1250
    }
  ],
  "totalCount": 45,
  "pageCount": 5,
  "currentPage": 1,
  "hasNext": true,
  "hasPrev": false
}
```

### Search Templates
**POST** `/api/templates/search`

Search templates with advanced filtering and full-text search.

#### Request Body
```json
{
  "query": "sprint planning",
  "methodology": "Agile",
  "category": "Planning",
  "complexity": "intermediate",
  "page": 1,
  "pageSize": 10
}
```

#### Response
```json
{
  "templates": [
    {
      "id": "1",
      "name": "Agile Sprint Planning",
      "description": "Comprehensive sprint planning template",
      "methodology": "Agile",
      "category": "Planning",
      "complexity": "intermediate",
      "tags": ["scrum", "planning", "sprint"],
      "lastUpdated": "2025-07-08",
      "author": "PM Tools Team",
      "rating": 4.5,
      "usageCount": 1250,
      "relevanceScore": 0.95
    }
  ],
  "totalCount": 12,
  "pageCount": 2,
  "currentPage": 1,
  "hasNext": true,
  "hasPrev": false,
  "searchTime": "0.045s"
}
```

### Get Template by ID
**GET** `/api/templates/:id`

Retrieves a specific template by its ID.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Template ID |

#### Response
```json
{
  "id": "1",
  "name": "Agile Sprint Planning",
  "description": "Comprehensive sprint planning template for agile teams",
  "methodology": "Agile",
  "category": "Planning",
  "complexity": "intermediate",
  "tags": ["scrum", "planning", "sprint"],
  "lastUpdated": "2025-07-08",
  "author": "PM Tools Team",
  "rating": 4.5,
  "usageCount": 1250,
  "content": "Template content goes here...",
  "sections": [
    {
      "title": "Sprint Goals",
      "content": "Define clear sprint objectives..."
    }
  ],
  "relatedTemplates": ["2", "3", "4"]
}
```

### Get Template Metadata
**GET** `/api/templates/metadata`

Retrieves metadata for filtering templates.

#### Response
```json
{
  "methodologies": [
    { "value": "Agile", "label": "Agile", "count": 18 },
    { "value": "Traditional", "label": "Traditional", "count": 15 },
    { "value": "Hybrid", "label": "Hybrid", "count": 12 }
  ],
  "categories": [
    { "value": "Planning", "label": "Planning", "count": 12 },
    { "value": "Execution", "label": "Execution", "count": 8 },
    { "value": "Monitoring", "label": "Monitoring", "count": 6 }
  ],
  "complexities": [
    { "value": "beginner", "label": "Beginner", "count": 15 },
    { "value": "intermediate", "label": "Intermediate", "count": 20 },
    { "value": "advanced", "label": "Advanced", "count": 10 }
  ],
  "tags": [
    { "value": "scrum", "label": "Scrum", "count": 8 },
    { "value": "kanban", "label": "Kanban", "count": 6 },
    { "value": "planning", "label": "Planning", "count": 12 }
  ]
}
```

### Get Template Recommendations
**GET** `/api/templates/recommendations`

Get personalized template recommendations based on usage patterns.

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of recommendations (default: 5) |
| `methodology` | string | Preferred methodology |
| `category` | string | Preferred category |

#### Response
```json
{
  "recommendations": [
    {
      "id": "1",
      "name": "Agile Sprint Planning",
      "description": "Comprehensive sprint planning template",
      "methodology": "Agile",
      "category": "Planning",
      "complexity": "intermediate",
      "rating": 4.5,
      "usageCount": 1250,
      "recommendationScore": 0.87,
      "reason": "Popular among users with similar preferences"
    }
  ],
  "totalCount": 5
}
```

### Rate Template
**POST** `/api/templates/:id/rate`

Submit a rating for a template.

#### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Template ID |

#### Request Body
```json
{
  "rating": 5,
  "feedback": "Excellent template, very helpful!"
}
```

#### Response
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "newRating": 4.6,
  "totalRatings": 156
}
```

### Get Template Statistics
**GET** `/api/templates/stats`

Get overall template statistics.

#### Response
```json
{
  "totalTemplates": 45,
  "totalDownloads": 12500,
  "averageRating": 4.3,
  "mostPopular": {
    "id": "1",
    "name": "Agile Sprint Planning",
    "usageCount": 1250
  },
  "recentlyAdded": [
    {
      "id": "43",
      "name": "Hybrid Project Charter",
      "addedDate": "2025-07-05"
    }
  ],
  "topCategories": [
    { "category": "Planning", "count": 12 },
    { "category": "Execution", "count": 8 }
  ]
}
```

### Track Analytics
**POST** `/api/analytics/track`

Track user interactions for analytics.

#### Request Body
```json
{
  "event": "template_viewed",
  "templateId": "1",
  "userId": "user123",
  "metadata": {
    "source": "search",
    "query": "sprint planning"
  }
}
```

#### Response
```json
{
  "success": true,
  "message": "Event tracked successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid query parameters",
  "details": {
    "page": "Must be a positive integer"
  }
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Template not found",
  "templateId": "invalid-id"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": 3600
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "requestId": "req-123456"
}
```

## Response Headers

All responses include these headers:
- `Content-Type: application/json`
- `X-RateLimit-Limit: 1000`
- `X-RateLimit-Remaining: 999`
- `X-RateLimit-Reset: 1625097600`
- `X-Response-Time: 0.045s`

## Webhook Events

The API supports webhook events for real-time notifications:

### template.created
```json
{
  "event": "template.created",
  "timestamp": "2025-07-08T21:27:30.123Z",
  "data": {
    "id": "46",
    "name": "New Template",
    "methodology": "Agile"
  }
}
```

### template.updated
```json
{
  "event": "template.updated",
  "timestamp": "2025-07-08T21:27:30.123Z",
  "data": {
    "id": "1",
    "name": "Updated Template",
    "changes": ["name", "description"]
  }
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const TemplateAPI = require('@pm-tools/template-selector-sdk');

const client = new TemplateAPI({
  baseURL: 'https://api-template-selector.example.com',
  apiKey: 'your-api-key'
});

// Search templates
const results = await client.searchTemplates({
  query: 'sprint planning',
  methodology: 'Agile'
});

// Get template by ID
const template = await client.getTemplate('1');
```

### Python
```python
from pm_tools import TemplateSelector

client = TemplateSelector(
    base_url='https://api-template-selector.example.com',
    api_key='your-api-key'
)

# Search templates
results = client.search_templates(
    query='sprint planning',
    methodology='Agile'
)

# Get template by ID
template = client.get_template('1')
```

## Testing

### Test Data
The API provides test data endpoints in development and staging environments:

**POST** `/api/test/reset`
Resets the database to initial test data.

**POST** `/api/test/seed`
Seeds the database with sample templates.

### Mock Responses
Mock responses are available for testing:

**GET** `/api/mock/templates`
Returns mock template data for testing.

## Version History

### v1.0.0
- Initial API release
- Basic CRUD operations
- Search functionality
- Analytics tracking

### v1.1.0 (Planned)
- Authentication system
- Advanced filtering
- Bulk operations
- Webhook support

---

For questions about the API, please contact the development team or create an issue in the GitHub repository.
