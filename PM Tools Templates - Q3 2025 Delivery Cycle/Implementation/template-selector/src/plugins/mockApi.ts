import { Plugin } from 'vite';
import { mockTemplates } from '../mocks/templates';

export function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/templates') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(mockTemplates));
          return;
        }
        next();
      });
    },
  };
}
