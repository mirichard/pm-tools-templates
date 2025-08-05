const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log('Request for:', req.url);
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    let filePath = '';
    
    if (req.url === '/') {
        filePath = path.join(__dirname, '..', 'curation-dashboard', 'index.html');
    } else if (req.url.startsWith('/public/')) {
        filePath = path.join(__dirname, '..', req.url);
    } else {
        filePath = path.join(__dirname, '..', 'curation-dashboard', req.url);
    }
    
    const extName = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extName] || 'application/octet-stream';
    
    console.log('Serving file:', filePath);
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            console.error('File not found:', filePath);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
    console.log('📊 Dashboard available at: http://localhost:8080/');
    console.log('📈 Metrics API: http://localhost:8080/public/metrics/curation-metrics.json');
    console.log('\nPress Ctrl+C to stop the server');
});
