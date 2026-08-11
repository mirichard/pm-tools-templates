const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const { createStaticRequestHandler } = require('../backend/static-file-handler');

const REPO_ROOT = path.resolve(__dirname, '..');
const PACKAGE_MARKER = fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf-8');

const ENTRY_POINTS = [
    {
        name: 'backend',
        modulePath: path.join(REPO_ROOT, 'backend', 'server.js')
    },
    {
        name: 'curation-dashboard',
        modulePath: path.join(REPO_ROOT, 'curation-dashboard', 'backend', 'server.js')
    },
    {
        name: 'examples-backend-services',
        modulePath: path.join(REPO_ROOT, 'examples', 'backend-services', 'server.js')
    }
];

const TRAVERSAL_PATHS = [
    '/../package.json',
    '/../../package.json',
    '/public/../package.json',
    '/%2e%2e/package.json',
    '/public/%2e%2e/package.json',
    '/..%2fpackage.json',
    '/..\\\\package.json',
    '/public/..\\\\package.json'
];

function requestPath(port, requestPathValue) {
    return new Promise((resolve, reject) => {
        const req = http.request(
            {
                hostname: '127.0.0.1',
                port,
                path: requestPathValue,
                method: 'GET'
            },
            (res) => {
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: Buffer.concat(chunks).toString('utf-8')
                    });
                });
            }
        );

        req.on('error', reject);
        req.end();
    });
}

async function withStartedServer(modulePath, callback) {
    const serverModule = require(modulePath);
    const { server } = serverModule;

    await new Promise((resolve, reject) => {
        server.listen(0, '127.0.0.1', (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });

    try {
        const address = server.address();
        await callback(address.port);
    } finally {
        await new Promise((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
    }
}

for (const entryPoint of ENTRY_POINTS) {
    test(`${entryPoint.name}: dashboard query and public metrics are served`, async () => {
        await withStartedServer(entryPoint.modulePath, async (port) => {
            const dashboardResponse = await requestPath(port, '/?view=summary');
            assert.equal(dashboardResponse.statusCode, 200);
            assert.match(String(dashboardResponse.headers['content-type'] || ''), /text\/html/i);

            const metricsResponse = await requestPath(port, '/public/metrics/curation-metrics.json');
            assert.equal(metricsResponse.statusCode, 200);
            assert.match(String(metricsResponse.headers['content-type'] || ''), /application\/json/i);
        });
    });

    test(`${entryPoint.name}: traversal attempts are blocked and never expose package.json`, async () => {
        await withStartedServer(entryPoint.modulePath, async (port) => {
            for (const traversalPath of TRAVERSAL_PATHS) {
                const response = await requestPath(port, traversalPath);
                assert.equal(response.statusCode, 403, `${entryPoint.name} should block ${traversalPath}`);
                assert.equal(response.body.includes(PACKAGE_MARKER), false, `${entryPoint.name} leaked package content for ${traversalPath}`);
            }
        });
    });

    test(`${entryPoint.name}: malformed URL encoding returns 400`, async () => {
        await withStartedServer(entryPoint.modulePath, async (port) => {
            const response = await requestPath(port, '/%E0%A4%A');
            assert.equal(response.statusCode, 400);
        });
    });
}

test('symlink escape from allowed static root is blocked', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'static-containment-'));
    const externalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'static-containment-external-'));

    try {
        const curationRoot = path.join(tempRoot, 'curation-dashboard');
        const publicRoot = path.join(tempRoot, 'public');
        fs.mkdirSync(curationRoot, { recursive: true });
        fs.mkdirSync(publicRoot, { recursive: true });
        fs.writeFileSync(path.join(curationRoot, 'index.html'), '<!doctype html><html><body>ok</body></html>');

        const secretFile = path.join(externalRoot, 'secret.txt');
        const secretMarker = 'outside-secret-content';
        fs.writeFileSync(secretFile, secretMarker, 'utf-8');

        fs.symlinkSync(secretFile, path.join(publicRoot, 'leak.txt'));

        const requestHandler = createStaticRequestHandler({
            repoRoot: tempRoot,
            mimeTypes: {
                '.html': 'text/html',
                '.txt': 'text/plain'
            }
        });

        const server = http.createServer((req, res) => requestHandler(req, res));

        await new Promise((resolve, reject) => {
            server.listen(0, '127.0.0.1', (error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });

        try {
            const address = server.address();
            const response = await requestPath(address.port, '/public/leak.txt');
            assert.equal(response.statusCode, 403);
            assert.equal(response.body.includes(secretMarker), false);
        } finally {
            await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        }
    } finally {
        fs.rmSync(tempRoot, { recursive: true, force: true });
        fs.rmSync(externalRoot, { recursive: true, force: true });
    }
});
