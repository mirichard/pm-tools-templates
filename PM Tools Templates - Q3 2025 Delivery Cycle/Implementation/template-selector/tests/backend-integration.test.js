const request = require('supertest');

// Set test environment
process.env.NODE_ENV = 'test';

const app = require('../backend/server');

describe('Backend API Integration Tests', () => {
  // No need to start server manually - supertest handles it
  
  beforeAll(() => {
    // Set up test environment
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    // Clean up
    delete process.env.NODE_ENV;
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Template Endpoints', () => {
    it('should get templates with pagination', async () => {
      const response = await request(app)
        .get('/api/templates?page=1&limit=5')
        .expect(200);

      expect(response.body).toHaveProperty('templates');
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('pageCount');
      expect(response.body).toHaveProperty('currentPage', 1);
      expect(response.body).toHaveProperty('hasNext');
      expect(response.body).toHaveProperty('hasPrev');
      expect(Array.isArray(response.body.templates)).toBe(true);
      expect(response.body.templates.length).toBeLessThanOrEqual(5);
    });

    it('should filter templates by methodology', async () => {
      const response = await request(app)
        .get('/api/templates?methodology=Agile')
        .expect(200);

      expect(response.body.templates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            methodology: 'Agile'
          })
        ])
      );
    });

    it('should filter templates by category', async () => {
      const response = await request(app)
        .get('/api/templates?category=Planning')
        .expect(200);

      expect(response.body.templates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: 'Planning'
          })
        ])
      );
    });

    it('should get single template by ID', async () => {
      const response = await request(app)
        .get('/api/templates/1')
        .expect(200);

      expect(response.body).toHaveProperty('id', '1');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('methodology');
      expect(response.body).toHaveProperty('category');
    });

    it('should return 404 for non-existent template', async () => {
      const response = await request(app)
        .get('/api/templates/999')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Template not found');
    });
  });

  describe('Search Endpoints', () => {
    it('should search templates with query', async () => {
      const response = await request(app)
        .post('/api/templates/search')
        .send({
          query: 'agile',
          page: 1,
          pageSize: 10
        })
        .expect(200);

      expect(response.body).toHaveProperty('templates');
      expect(response.body).toHaveProperty('totalCount');
      expect(response.body).toHaveProperty('pageCount');
      expect(response.body).toHaveProperty('currentPage', 1);
      expect(Array.isArray(response.body.templates)).toBe(true);
      
      // Check that results contain the search term
      response.body.templates.forEach(template => {
        const searchableText = [
          template.name,
          template.description,
          template.methodology,
          template.category,
          ...template.tags
        ].join(' ').toLowerCase();
        expect(searchableText).toContain('agile');
      });
    });

    it('should search templates with filters', async () => {
      const response = await request(app)
        .post('/api/templates/search')
        .send({
          methodology: 'Agile',
          page: 1,
          pageSize: 10
        })
        .expect(200);

      expect(response.body.templates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            methodology: 'Agile'
          })
        ])
      );
      expect(response.body.templates.length).toBeGreaterThan(0);
    });

    it('should handle empty search results', async () => {
      const response = await request(app)
        .post('/api/templates/search')
        .send({
          query: 'nonexistentquery12345',
          page: 1,
          pageSize: 10
        })
        .expect(200);

      expect(response.body.templates).toHaveLength(0);
      expect(response.body.totalCount).toBe(0);
    });
  });

  describe('Metadata Endpoints', () => {
    it('should get template metadata', async () => {
      const response = await request(app)
        .get('/api/templates/metadata')
        .expect(200);

      expect(response.body).toHaveProperty('methodologies');
      expect(response.body).toHaveProperty('categories');
      expect(response.body).toHaveProperty('tags');
      expect(Array.isArray(response.body.methodologies)).toBe(true);
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(Array.isArray(response.body.tags)).toBe(true);
      
      // Check that expected methodologies are present
      expect(response.body.methodologies).toContain('Agile');
      expect(response.body.methodologies).toContain('Traditional');
      expect(response.body.methodologies).toContain('Hybrid');
    });
  });

  describe('Recommendation Endpoints', () => {
    it('should get recommended templates', async () => {
      const response = await request(app)
        .post('/api/templates/recommended')
        .send({
          methodology: 'Agile',
          category: 'Planning'
        })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
      
      // Check that recommendations match the criteria
      response.body.forEach(template => {
        expect(template.methodology).toBe('Agile');
        expect(template.category).toBe('Planning');
      });
    });

    it('should handle recommendations without filters', async () => {
      const response = await request(app)
        .post('/api/templates/recommended')
        .send({})
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Rating Endpoints', () => {
    it('should accept template rating', async () => {
      const response = await request(app)
        .post('/api/templates/1/rate')
        .send({
          rating: 5,
          feedback: 'Great template!'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Rating submitted successfully');
    });

    it('should validate rating range', async () => {
      await request(app)
        .post('/api/templates/1/rate')
        .send({
          rating: 6, // Invalid rating
          feedback: 'Too high!'
        })
        .expect(400);

      await request(app)
        .post('/api/templates/1/rate')
        .send({
          rating: 0, // Invalid rating
          feedback: 'Too low!'
        })
        .expect(400);
    });

    it('should get template statistics', async () => {
      const response = await request(app)
        .get('/api/templates/1/stats')
        .expect(200);

      expect(response.body).toHaveProperty('usageCount');
      expect(response.body).toHaveProperty('averageRating');
      expect(response.body).toHaveProperty('ratingCount');
      expect(typeof response.body.usageCount).toBe('number');
      expect(typeof response.body.averageRating).toBe('number');
      expect(typeof response.body.ratingCount).toBe('number');
    });
  });

  describe('Analytics Endpoints', () => {
    it('should get analytics data', async () => {
      const response = await request(app)
        .get('/api/analytics')
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('topEndpoints');
      expect(response.body).toHaveProperty('topSearchQueries');
      expect(response.body).toHaveProperty('performanceStats');
      expect(response.body).toHaveProperty('trends');
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 for unknown endpoints', async () => {
      await request(app)
        .get('/api/unknown')
        .expect(404);
    });

    it('should handle malformed JSON in POST requests', async () => {
      const response = await request(app)
        .post('/api/templates/search')
        .send('invalid json')
        .set('Content-Type', 'application/json')
        .expect(500); // Express middleware handles JSON parsing errors as 500
    });
  });

  describe('Performance Tests', () => {
    it('should respond to health check within 50ms', async () => {
      const start = Date.now();
      await request(app)
        .get('/api/health')
        .expect(200);
      const end = Date.now();
      
      expect(end - start).toBeLessThan(50);
    });

    it('should respond to template listing within 200ms', async () => {
      const start = Date.now();
      await request(app)
        .get('/api/templates')
        .expect(200);
      const end = Date.now();
      
      expect(end - start).toBeLessThan(200);
    });

    it('should respond to search within 200ms', async () => {
      const start = Date.now();
      await request(app)
        .post('/api/templates/search')
        .send({
          query: 'test',
          page: 1,
          pageSize: 10
        })
        .expect(200);
      const end = Date.now();
      
      expect(end - start).toBeLessThan(200);
    });
  });
});
