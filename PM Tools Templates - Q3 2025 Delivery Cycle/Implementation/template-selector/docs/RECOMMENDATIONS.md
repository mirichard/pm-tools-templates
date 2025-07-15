# ML-Powered Template Recommendations

## Overview

The Template Selector now includes an advanced ML-powered recommendation engine that provides personalized template suggestions based on user behavior, template characteristics, and community preferences. This system implements multiple recommendation algorithms to deliver highly relevant template suggestions.

## Features

### 🤖 **Hybrid Recommendation Engine**
- **Content-Based Filtering**: Recommends templates similar to those you've interacted with
- **Collaborative Filtering**: Suggests templates liked by users with similar preferences
- **Popularity-Based**: Highlights trending and highly-rated templates
- **Progressive Disclosure**: Adapts recommendations based on user experience level

### 📊 **User Behavior Tracking**
- **Interaction Tracking**: Monitors views, downloads, favorites, and shares
- **Preference Learning**: Builds user profiles based on methodology and category preferences
- **Session Management**: Maintains user context across browsing sessions
- **Privacy-First**: GDPR-compliant data collection with user control

### 🎯 **Smart Personalization**
- **Experience-Based**: Adapts to beginner, intermediate, and advanced users
- **Context-Aware**: Considers project type, methodology, and complexity
- **Real-Time Learning**: Updates recommendations based on ongoing interactions
- **Confidence Scoring**: Provides reliability metrics for each recommendation

## API Endpoints

### Track User Interactions

```http
POST /api/recommendations/track
Content-Type: application/json

{
  "sessionId": "session_123",
  "templateId": "template_456",
  "interactionType": "view|download|favorite|share",
  "metadata": {
    "timestamp": "2025-07-15T09:32:47Z",
    "source": "search|browse|recommendation"
  }
}
```

### Get Hybrid Recommendations

```http
POST /api/recommendations/hybrid
Content-Type: application/json

{
  "sessionId": "session_123",
  "limit": 10,
  "options": {
    "includeContentBased": true,
    "includeCollaborative": true,
    "includePopularity": true,
    "includeProgressive": true,
    "weights": {
      "contentBased": 0.3,
      "collaborative": 0.3,
      "popularity": 0.2,
      "progressive": 0.2
    }
  }
}
```

**Response:**
```json
[
  {
    "template": {
      "id": "template_456",
      "name": "Project Charter Template",
      "description": "Comprehensive project charter...",
      "methodology": "Agile",
      "category": "Planning",
      "complexity": "intermediate",
      "rating": 4.5,
      "usageCount": 1250
    },
    "score": 0.85,
    "reason": "Similar to your recent selections",
    "confidence": 0.92,
    "types": ["content-based", "collaborative"]
  }
]
```

### Get Content-Based Recommendations

```http
POST /api/recommendations/content-based
Content-Type: application/json

{
  "templateId": "template_456",
  "limit": 5
}
```

### Get Collaborative Recommendations

```http
POST /api/recommendations/collaborative
Content-Type: application/json

{
  "sessionId": "session_123",
  "limit": 5
}
```

### Get Popularity Recommendations

```http
POST /api/recommendations/popularity
Content-Type: application/json

{
  "sessionId": "session_123",
  "limit": 5
}
```

### Get Progressive Recommendations

```http
POST /api/recommendations/progressive
Content-Type: application/json

{
  "sessionId": "session_123",
  "limit": 5
}
```

### Get Recommendation Analytics

```http
GET /api/recommendations/analytics
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
    }
  ],
  "mostDownloaded": [
    {
      "template": "Risk Register Template",
      "downloads": 234
    }
  ],
  "averageInteractionsPerSession": 3.2
}
```

## Frontend Integration

### React Hooks

#### useRecommendations Hook

```typescript
import { useRecommendations } from '../hooks/useRecommendations';

const MyComponent = () => {
  const {
    recommendations,
    loading,
    error,
    trackInteraction,
    getHybridRecommendations,
    clearRecommendations
  } = useRecommendations();

  // Track user interaction
  const handleTemplateClick = (templateId: string) => {
    trackInteraction(templateId, 'view', { source: 'recommendation' });
  };

  // Get personalized recommendations
  const loadRecommendations = async () => {
    await getHybridRecommendations({
      limit: 8,
      weights: {
        contentBased: 0.4,
        collaborative: 0.3,
        popularity: 0.2,
        progressive: 0.1
      }
    });
  };

  return (
    <div>
      {loading && <div>Loading recommendations...</div>}
      {error && <div>Error: {error}</div>}
      {recommendations.map(rec => (
        <div key={rec.template.id}>
          <h3>{rec.template.name}</h3>
          <p>{rec.reason}</p>
          <small>Confidence: {Math.round(rec.confidence * 100)}%</small>
        </div>
      ))}
    </div>
  );
};
```

#### useTemplateRecommendations Hook

```typescript
import { useTemplateRecommendations } from '../hooks/useRecommendations';

const TemplateDetailPage = ({ templateId }: { templateId: string }) => {
  const { recommendations, loading, error } = useTemplateRecommendations(templateId);

  return (
    <div>
      <h3>Similar Templates</h3>
      {loading && <div>Loading...</div>}
      {recommendations.map(rec => (
        <div key={rec.template.id}>
          <h4>{rec.template.name}</h4>
          <p>{rec.reason}</p>
        </div>
      ))}
    </div>
  );
};
```

#### useProgressiveDisclosure Hook

```typescript
import { useProgressiveDisclosure } from '../hooks/useRecommendations';

const ProgressiveLearning = () => {
  const {
    recommendations,
    loading,
    userLevel,
    handleUserProgression,
    refreshRecommendations
  } = useProgressiveDisclosure();

  const onTemplateCompleted = (templateId: string, complexity: string) => {
    handleUserProgression(templateId, complexity);
  };

  return (
    <div>
      <h3>Recommended for {userLevel} users</h3>
      {recommendations.map(rec => (
        <div key={rec.template.id}>
          <h4>{rec.template.name}</h4>
          <p>Complexity: {rec.template.complexity}</p>
          <button onClick={() => onTemplateCompleted(rec.template.id, rec.template.complexity)}>
            Complete Template
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Recommendation Algorithms

### 1. Content-Based Filtering

**How it works:**
- Analyzes template characteristics (methodology, category, complexity, tags)
- Finds templates similar to those the user has interacted with
- Weights similarities: methodology (40%), category (30%), tags (20%), complexity (10%)

**Use case:** "Users who liked this template also liked..."

**Example:**
```javascript
// If user liked "Agile Sprint Planning" template
// Recommends: "Agile Retrospective", "Sprint Review Template", "User Story Template"
```

### 2. Collaborative Filtering

**How it works:**
- Identifies users with similar preferences and behaviors
- Recommends templates liked by similar users
- Considers methodology preferences, category interests, and interaction patterns

**Use case:** "Users similar to you also liked..."

**Example:**
```javascript
// If user prefers Agile methodology and Planning category
// Finds other users with similar preferences
// Recommends their favorite templates
```

### 3. Popularity-Based Recommendations

**How it works:**
- Scores templates based on views, downloads, ratings, and usage count
- Formula: (views × 0.1) + (downloads × 0.3) + (rating × 0.4) + (usage × 0.2)
- Filters out templates user has already interacted with

**Use case:** "Trending templates" or "Most popular"

### 4. Progressive Disclosure

**How it works:**
- Determines user experience level based on interaction history
- Beginner: Shows beginner and intermediate templates
- Intermediate: Shows intermediate and advanced templates
- Advanced: Shows all templates

**Experience Level Calculation:**
- <3 interactions: Beginner
- >30% advanced templates: Advanced
- >50% intermediate templates: Intermediate
- Default: Beginner

## Performance Optimization

### Caching Strategy

- **Hybrid recommendations**: 5-minute cache
- **Content-based recommendations**: 10-minute cache
- **Popularity recommendations**: 10-minute cache
- **Progressive recommendations**: 5-minute cache

### Response Times

- **Target**: <200ms for recommendation API calls
- **Optimization**: In-memory caching, pre-computed similarity matrices
- **Monitoring**: Performance metrics tracked in analytics

## Privacy & Compliance

### Data Collection

- **Anonymous by default**: No personal information stored
- **Session-based**: Uses temporary session IDs
- **Opt-in analytics**: Enhanced tracking requires explicit consent
- **GDPR compliant**: Right to deletion and data export

### User Controls

- **Session management**: Clear session data anytime
- **Interaction tracking**: Can be disabled per user
- **Data transparency**: Full visibility into collected data

## Testing

### Unit Tests

```bash
# Run recommendation service tests
npm test services/recommendationService.test.js

# Run recommendation API tests
npm test api/recommendations.test.js

# Run frontend hook tests
npm test hooks/useRecommendations.test.ts
```

### Integration Tests

```bash
# Test full recommendation flow
npm test integration/recommendations.test.js

# Test performance benchmarks
npm test performance/recommendations.test.js
```

## Analytics & Monitoring

### Key Metrics

- **Recommendation CTR**: Click-through rate on recommendations
- **Conversion Rate**: Percentage of recommendations that lead to downloads
- **User Satisfaction**: Rating of recommendation relevance
- **Performance**: API response times and cache hit rates

### Dashboard

Access recommendation analytics at:
```
GET /api/recommendations/analytics
```

## Troubleshooting

### Common Issues

1. **Empty Recommendations**
   - **Cause**: New user with no interaction history
   - **Solution**: Falls back to popularity-based recommendations

2. **Slow Response Times**
   - **Cause**: Cold cache or heavy computation
   - **Solution**: Pre-warming cache, optimized algorithms

3. **Poor Recommendation Quality**
   - **Cause**: Insufficient user data or algorithm tuning
   - **Solution**: Increase interaction tracking, adjust weights

### Debug Mode

Enable debug logging:
```javascript
// In backend
process.env.DEBUG_RECOMMENDATIONS = 'true';

// In frontend
localStorage.setItem('debugRecommendations', 'true');
```

## Future Enhancements

### Planned Features

1. **Deep Learning Integration**: Neural networks for better pattern recognition
2. **Cross-Platform Learning**: Learn from user behavior across different tools
3. **Time-Based Recommendations**: Consider seasonal and temporal patterns
4. **Social Recommendations**: Learn from team and organization preferences
5. **Explanation Interface**: Show why specific templates were recommended

### Performance Improvements

1. **Real-time processing**: Stream processing for instant recommendations
2. **Distributed computing**: Scale recommendation engine horizontally
3. **Advanced caching**: Redis cluster with intelligent invalidation
4. **ML model optimization**: Faster inference with optimized models

## Contributing

### Adding New Recommendation Types

1. **Backend**: Implement new algorithm in `recommendationService.js`
2. **API**: Add new endpoint in `server.js`
3. **Frontend**: Update hooks in `useRecommendations.ts`
4. **Tests**: Add comprehensive test coverage
5. **Documentation**: Update this documentation

### Performance Optimization

1. **Profiling**: Use built-in performance monitoring
2. **Caching**: Implement strategic caching layers
3. **Algorithms**: Optimize recommendation algorithms
4. **Database**: Consider database indexing for faster queries

For questions or contributions, please refer to the main project documentation or create an issue in the GitHub repository.
