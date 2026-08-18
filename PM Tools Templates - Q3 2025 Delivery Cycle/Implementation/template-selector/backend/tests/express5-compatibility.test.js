const request = require('supertest');

process.env.NODE_ENV = 'test';

const app = require('../server');

describe('Express 5 backend compatibility', () => {
  test('uses the backend Express 5 and Supertest 7 installations', () => {
    expect(require('express/package.json').version).toBe('5.2.1');
    expect(require('supertest/package.json').version).toBe('7.2.2');
  });

  test('serves the health endpoint', async () => {
    const response = await request(app).get('/api/health').expect(200);

    expect(response.body.status).toBe('healthy');
  });

  test('handles query parameters on a representative GET route', async () => {
    const response = await request(app)
      .get('/api/templates')
      .query({ page: 1, limit: 2, methodology: 'Agile' })
      .expect(200);

    expect(response.body.currentPage).toBe(1);
    expect(response.body.templates.length).toBeLessThanOrEqual(2);
    response.body.templates.forEach((template) => {
      expect(template.methodology).toBe('Agile');
    });
  });

  test('parses JSON on a representative POST route', async () => {
    const response = await request(app)
      .post('/api/templates/search')
      .send({ query: 'agile', page: 1, pageSize: 2 })
      .expect(200);

    expect(response.body.currentPage).toBe(1);
    expect(response.body.templates.length).toBeLessThanOrEqual(2);
  });

  test('handles route parameters', async () => {
    const response = await request(app).get('/api/templates/1').expect(200);

    expect(response.body.id).toBe('1');
  });

  test('preserves the unknown-route 404 response', async () => {
    const response = await request(app).get('/api/unknown').expect(404);

    expect(response.body).toEqual({ error: 'Endpoint not found' });
  });

  test('preserves the existing malformed JSON response', async () => {
    const response = await request(app)
      .post('/api/templates/search')
      .set('Content-Type', 'application/json')
      .send('{invalid json')
      .expect(500);

    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});
