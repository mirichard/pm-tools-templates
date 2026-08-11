const http = require('http');
const path = require('path');
const { createStaticRequestHandler } = require('../../backend/static-file-handler');

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

const requestHandler = createStaticRequestHandler({
    repoRoot: path.resolve(__dirname, '..', '..'),
    mimeTypes
});

const server = http.createServer((req, res) => {
    console.log('Request for:', req.url);

    requestHandler(req, res);
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
        console.log('Available endpoints:');
        console.log('  - Dashboard: http://localhost:8080/');
        console.log('  - Metrics API: http://localhost:8080/public/metrics/curation-metrics.json');
    });
}

module.exports = {
    server,
    requestHandler
};
