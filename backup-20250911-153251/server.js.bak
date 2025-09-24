import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import morgan from 'morgan';
import etag from 'etag';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import hljs from 'highlight.js';
import rateLimit from 'express-rate-limit';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5173;

app.use(morgan('dev'));
app.use(express.json());

// Rate limiter for expensive endpoints
const previewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
});
// Configure marked
marked.setOptions({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

// Root of templates is repo root
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(__dirname, 'src');

function listMarkdownFiles() {
  const allowedRoots = [
    'Agile', 'Hybrid', 'PMBOK', 'Waterfall', 'business-stakeholder-suite',
    'docs', 'examples', 'industry_templates', 'integration_guides', 'project-lifecycle', 'quick-start-kits', 'role-based-toolkits'
  ];
  const results = [];
  for (const ar of allowedRoots) {
    const root = path.join(REPO_ROOT, ar);
    if (!fs.existsSync(root)) continue;
    const stack = [root];
    while (stack.length) {
      const d = stack.pop();
      const ents = fs.readdirSync(d, { withFileTypes: true });
      for (const e of ents) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) stack.push(p);
        else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
          results.push(path.relative(REPO_ROOT, p));
        }
      }
    }
  }
  results.sort();
  return results;
}

function getFileETag(absPath) {
  try {
    const stat = fs.statSync(absPath);
    // Include size+mtime for weak validation, plus hash for strong changes
    const content = fs.readFileSync(absPath);
    const hash = crypto.createHash('sha1').update(content).digest('hex');
    return etag(`${stat.size}-${stat.mtimeMs}-${hash}`);
  } catch (e) {
    return null;
  }
}

app.get('/api/index', (req, res) => {
  const files = listMarkdownFiles();
  res.json({ files });
});

app.get('/api/preview', previewLimiter, (req, res) => {
  const rel = req.query.path;
  if (!rel || typeof rel !== 'string') return res.status(400).json({ error: 'path required' });
  const abs = path.resolve(REPO_ROOT, rel);
  if (!abs.startsWith(REPO_ROOT)) return res.status(400).json({ error: 'invalid path' });
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return res.status(404).json({ error: 'not found' });
  const et = getFileETag(abs);
  if (et && req.headers['if-none-match'] === et) {
    res.status(304).end();
    return;
  }
  const raw = fs.readFileSync(abs, 'utf-8');
  const html = marked.parse(raw);
  res.setHeader('ETag', et || '');
  res.json({ path: rel, html });
});

// Simple opt-in telemetry (privacy-first)
// Stores anonymous counters in-memory only; deletion clears client id
const telemetry = {
  events: {},
  last: {},
};

app.post('/api/telemetry', (req, res) => {
  const { event, path: mdPath, ts } = req.body || {};
  if (!event) return res.status(400).json({ ok: false });
  const key = `${event}:${mdPath || ''}`;
  telemetry.events[key] = (telemetry.events[key] || 0) + 1;
  telemetry.last[key] = ts || new Date().toISOString();
  res.json({ ok: true });
});

app.get('/api/dashboard', (req, res) => {
  res.json({ events: telemetry.events, last: telemetry.last });
});

// Static client
app.use('/', express.static(PUBLIC_DIR));

// Provide a tiny favicon to avoid 404s in logs and best-practices checks
app.get('/favicon.ico', (req, res) => {
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=='; // 1x1 transparent PNG
  const buf = Buffer.from(b64, 'base64');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.send(buf);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Demo server running on http://localhost:${PORT}`);
});
