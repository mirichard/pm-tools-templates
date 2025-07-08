import { mockTemplates } from './templates';
import type { Connect } from 'vite';

export function apiMiddleware(req: Connect.IncomingMessage, res: Connect.ServerResponse, next: Connect.NextFunction) {
  console.log(`[API Middleware] Received request for: ${req.url}`);
  
  if (req.url === '/api/templates') {
    console.log('[API Middleware] Serving mock templates');
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(mockTemplates));
    console.log('[API Middleware] Response sent');
    return;
  }
  
  console.log('[API Middleware] Passing to next middleware');
  next();
}
