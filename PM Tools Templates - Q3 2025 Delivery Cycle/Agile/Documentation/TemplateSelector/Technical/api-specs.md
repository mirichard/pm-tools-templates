# API Specification: Template Selector
## PM Tools Templates - Q3 2025 Delivery Cycle

### Overview
This document outlines the API endpoints required for the Template Selector component, providing template discovery, search, and metadata management capabilities.

### Base URL
```
/api/v1/templates
```

### Authentication
All endpoints require authentication using GitHub OAuth tokens:
```http
Authorization: Bearer <github_token>
```

### Endpoints

#### 1. List Templates
```http
GET /templates
```

Query Parameters:
```json
{
  "methodology": "string",
  "category": "string",
  "complexity": "string",
  "page": "number",
  "limit": "number",
  "sort": "string"
}
```

Response:
```json
{
  "templates": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "methodology": "string",
      "category": "string",
      "complexity": "string",
      "tags": ["string"],
      "lastUpdated": "string",
      "author": "string",
      "rating": "number",
      "usageCount": "number",
      "previewUrl": "string"
    }
  ],
  "totalCount": "number",
  "pageCount": "number",
  "currentPage": "number"
}
```

#### 2. Search Templates
```http
POST /templates/search
```

Request Body:
```json
{
  "query": "string",
  "filters": {
    "methodology": ["string"],
    "category": ["string"],
    "complexity": ["string"],
    "tags": ["string"]
  },
  "page": "number",
  "limit": "number",
  "sort": {
    "field": "string",
    "direction": "asc|desc"
  }
}
```

Response:
```json
{
  "results": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "methodology": "string",
      "category": "string",
      "relevance": "number",
      "preview": "string"
    }
  ],
  "totalResults": "number",
  "pageCount": "number",
  "currentPage": "number"
}
```

#### 3. Get Template Details
```http
GET /templates/{id}
```

Response:
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "methodology": "string",
  "category": "string",
  "complexity": "string",
  "content": "string",
  "metadata": {
    "author": "string",
    "lastUpdated": "string",
    "version": "string",
    "rating": "number",
    "usageCount": "number"
  },
  "examples": [
    {
      "name": "string",
      "description": "string",
      "url": "string"
    }
  ],
  "relatedTemplates": [
    {
      "id": "string",
      "name": "string",
      "relationship": "string"
    }
  ]
}
```

#### 4. Get Template Preview
```http
GET /templates/{id}/preview
```

Response:
```json
{
  "id": "string",
  "name": "string",
  "preview": {
    "html": "string",
    "plainText": "string",
    "thumbnail": "string"
  }
}
```

#### 5. Get Template Metadata
```http
GET /templates/metadata
```

Response:
```json
{
  "methodologies": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "templateCount": "number"
    }
  ],
  "categories": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "templateCount": "number"
    }
  ],
  "tags": [
    {
      "id": "string",
      "name": "string",
      "count": "number"
    }
  ]
}
```

#### 6. Get Recommended Templates
```http
POST /templates/recommended
```

Request Body:
```json
{
  "methodology": "string",
  "category": "string",
  "userPreferences": {
    "complexity": "string",
    "recentSearches": ["string"],
    "usedTemplates": ["string"]
  }
}
```

Response:
```json
{
  "recommendations": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "relevanceScore": "number",
      "reason": "string"
    }
  ]
}
```

### Error Responses

#### 1. Standard Error Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

#### 2. Common Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

### Rate Limiting
```http
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1625097600
```

### Caching
```http
Cache-Control: public, max-age=3600
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

### Versioning
All endpoints are versioned using URL prefixing (e.g., `/api/v1/`).

### Security Requirements

#### 1. Authentication
- GitHub OAuth 2.0
- JWT tokens
- Rate limiting

#### 2. Data Protection
- HTTPS only
- Input validation
- Output sanitization

#### 3. Access Control
- Role-based access
- Resource ownership
- Action auditing

### Performance Requirements

#### 1. Response Times
- Search: < 200ms
- List: < 100ms
- Preview: < 300ms

#### 2. Caching Strategy
- Redis for metadata
- CDN for previews
- Browser caching

#### 3. Rate Limits
- 5000 requests/hour
- Burst protection
- Retry handling

### Implementation Guidelines

#### 1. Error Handling
- Consistent format
- Detailed messages
- Status codes

#### 2. Validation
- Input sanitization
- Type checking
- Size limits

#### 3. Monitoring
- Request logging
- Error tracking
- Performance metrics

### Testing Requirements

#### 1. Unit Tests
- Endpoint validation
- Error handling
- Data formatting

#### 2. Integration Tests
- API workflows
- Cache behavior
- Error scenarios

#### 3. Performance Tests
- Load testing
- Stress testing
- Scalability

### Documentation

#### 1. OpenAPI/Swagger
- Full API spec
- Example requests
- Response schemas

#### 2. Implementation Guide
- Setup instructions
- Best practices
- Common issues

#### 3. SDK Examples
- Node.js
- Python
- Java
