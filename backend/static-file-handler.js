const fs = require('fs');
const path = require('path');

function isContained(parentPath, childPath) {
    const relativePath = path.relative(parentPath, childPath);
    return relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath) || relativePath === '';
}

function resolveRequestTarget(repoRoot, decodedPathname) {
    const curationRoot = path.resolve(repoRoot, 'curation-dashboard');
    const publicRoot = path.resolve(repoRoot, 'public');

    if (decodedPathname === '/') {
        return {
            staticRoot: curationRoot,
            relativeFilePath: 'index.html'
        };
    }

    if (decodedPathname.startsWith('/public/')) {
        return {
            staticRoot: publicRoot,
            relativeFilePath: decodedPathname.slice('/public/'.length)
        };
    }

    if (decodedPathname.startsWith('/curation-dashboard/')) {
        return {
            staticRoot: curationRoot,
            relativeFilePath: decodedPathname.slice('/curation-dashboard/'.length)
        };
    }

    return {
        staticRoot: curationRoot,
        relativeFilePath: decodedPathname.replace(/^\/+/, '')
    };
}

function createStaticRequestHandler(options) {
    const { repoRoot, mimeTypes } = options;

    return (req, res) => {
        let decodedPathname;

        try {
            const rawUrl = typeof req.url === 'string' ? req.url : '/';
            const pathOnly = rawUrl.split('?')[0].split('#')[0] || '/';
            const pathname = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
            decodedPathname = decodeURIComponent(pathname);
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad request');
            return;
        }

        const normalizedForTraversalCheck = decodedPathname.replace(/\\/g, '/');
        const segments = normalizedForTraversalCheck.split('/');
        if (segments.includes('..')) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }

        const { staticRoot, relativeFilePath } = resolveRequestTarget(repoRoot, decodedPathname);
        const resolvedFilePath = path.resolve(staticRoot, relativeFilePath);

        if (!isContained(staticRoot, resolvedFilePath)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }

        const extName = path.extname(resolvedFilePath).toLowerCase();
        const contentType = mimeTypes[extName] || 'application/octet-stream';

        fs.realpath(staticRoot, (rootError, realStaticRoot) => {
            if (rootError) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }

            fs.realpath(resolvedFilePath, (fileError, realFilePath) => {
                if (fileError) {
                    if (fileError.code === 'ENOENT') {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('File not found');
                        return;
                    }

                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal server error');
                    return;
                }

                if (!isContained(realStaticRoot, realFilePath)) {
                    res.writeHead(403, { 'Content-Type': 'text/plain' });
                    res.end('Forbidden');
                    return;
                }

                fs.readFile(realFilePath, (readError, content) => {
                    if (readError) {
                        if (readError.code === 'ENOENT') {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('File not found');
                            return;
                        }

                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal server error');
                        return;
                    }

                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                });
            });
        });
    };
}

module.exports = {
    createStaticRequestHandler
};