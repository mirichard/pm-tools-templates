import http from 'k6/http';
import { check, sleep } from 'k6';

// Test configuration
export const options = {
  stages: [
    { duration: '10s', target: 5 },  // Ramp up to 5 users
    { duration: '30s', target: 10 }, // Stay at 10 users
    { duration: '10s', target: 20 }, // Ramp up to 20 users
    { duration: '30s', target: 20 }, // Stay at 20 users
    { duration: '10s', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete in under 200ms
    http_req_failed: ['rate<0.1'],    // Error rate must be under 10%
  },
};

const BASE_URL = 'http://localhost:3001';

export default function() {
  // Test health endpoint
  let response = http.get(`${BASE_URL}/api/health`);
  check(response, {
    'Health check status is 200': (r) => r.status === 200,
    'Health check response time < 50ms': (r) => r.timings.duration < 50,
  });

  // Test templates endpoint
  response = http.get(`${BASE_URL}/api/templates`);
  check(response, {
    'Templates list status is 200': (r) => r.status === 200,
    'Templates response time < 200ms': (r) => r.timings.duration < 200,
    'Templates returns valid JSON': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.hasOwnProperty('templates') && Array.isArray(data.templates);
      } catch (e) {
        return false;
      }
    },
  });

  // Test search endpoint
  response = http.get(`${BASE_URL}/api/templates/search?q=project`);
  check(response, {
    'Search status is 200': (r) => r.status === 200,
    'Search response time < 200ms': (r) => r.timings.duration < 200,
    'Search returns valid results': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.hasOwnProperty('templates') && Array.isArray(data.templates);
      } catch (e) {
        return false;
      }
    },
  });

  // Test metadata endpoint
  response = http.get(`${BASE_URL}/api/templates/metadata`);
  check(response, {
    'Metadata status is 200': (r) => r.status === 200,
    'Metadata response time < 100ms': (r) => r.timings.duration < 100,
    'Metadata returns valid structure': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.hasOwnProperty('methodologies') && 
               data.hasOwnProperty('categories') && 
               data.hasOwnProperty('tags');
      } catch (e) {
        return false;
      }
    },
  });

  // Test template details endpoint
  response = http.get(`${BASE_URL}/api/templates/traditional-project-charter`);
  check(response, {
    'Template details status is 200': (r) => r.status === 200,
    'Template details response time < 150ms': (r) => r.timings.duration < 150,
  });

  // Test analytics tracking
  const analyticsPayload = JSON.stringify({
    eventType: 'template_view',
    templateId: 'traditional-project-charter',
    timestamp: new Date().toISOString(),
    metadata: {
      userAgent: 'k6-load-test',
      sessionId: 'load-test-session'
    }
  });

  response = http.post(`${BASE_URL}/api/analytics/track`, analyticsPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  check(response, {
    'Analytics tracking status is 200': (r) => r.status === 200,
    'Analytics response time < 100ms': (r) => r.timings.duration < 100,
  });

  // Simulate user thinking time
  sleep(1);
}

// Setup and teardown functions
export function setup() {
  console.log('Starting performance benchmarking tests...');
  console.log('Target: <200ms response time for 95% of requests');
  console.log('Target: <10% error rate');
  
  // Check if the backend is running
  const response = http.get(`${BASE_URL}/api/health`);
  if (response.status !== 200) {
    throw new Error('Backend server is not running. Please start the server on port 3001');
  }
}

export function teardown(data) {
  console.log('Performance benchmarking tests completed.');
}
