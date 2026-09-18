const fs = require('fs');
const path = require('path');

const SAFE_SEGMENT_REGEX = /^[A-Za-z0-9._-]+$/;

function isContained(parentPath, childPath) {
    const relativePath = path.relative(parentPath, childPath);
    return relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath) || relativePath === '';
}

function validateSegments(relativePath) {
    const rawSegments = relativePath.split('/');
    const validatedSegments = [];

    for (const segment of rawSegments) {
        if (segment === '' || segment === '.' || segment === '..') {
            return null;
        }

        if (segment.includes('\0')) {
            return null;
        }

        if (segment.includes('/') || segment.includes('\\')) {
            return null;
        }

        if (path.basename(segment) !== segment) {
            return null;
        }

        if (!SAFE_SEGMENT_REGEX.test(segment)) {
            return null;
        }

        validatedSegments.push(segment);
    }

    return validatedSegments;
}

function resolveRequestTarget(repoRoot, normalizedPathname) {
    const curationRoot = path.resolve(repoRoot, 'curation-dashboard');
    const publicRoot = path.resolve(repoRoot, 'public');

    if (normalizedPathname === '/') {
        return {
            staticRoot: curationRoot,
            relativePath: 'index.html'
        };
    }

    if (normalizedPathname.startsWith('/public/')) {
        return {
            staticRoot: publicRoot,
            relativePath: normalizedPathname.slice('/public/'.length)
        };
    }

    if (normalizedPathname.startsWith('/curation-dashboard/')) {
        return {
            staticRoot: curationRoot,
            relativePath: normalizedPathname.slice('/curation-dashboard/'.length)
        };
    }

    return {
        staticRoot: curationRoot,
        relativePath: normalizedPathname.replace(/^\/+/, '')
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

        const normalizedPathname = decodedPathname.replace(/\\/g, '/');
        const { staticRoot, relativePath } = resolveRequestTarget(repoRoot, normalizedPathname);
        const validatedSegments = validateSegments(relativePath);

        if (!validatedSegments) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Forbidden');
            return;
        }

        const resolvedFilePath = path.resolve(staticRoot, ...validatedSegments);

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