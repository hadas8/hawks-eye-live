// Zero-dependency static server for local testing.
//
// The app has no build step and no backend, so this only needs to hand back
// files with the right Content-Type — ES modules will not load over file://
// or with the wrong MIME type. Nothing here ships: GitHub Pages serves the
// same files directly.
//
//   node tools/dev-server.js [port]

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 5173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ico':  'image/x-icon'
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';

    // Keep the served tree inside the project directory.
    const path = join(ROOT, normalize(rel));
    if (!path.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) {
      res.writeHead(403).end('403');
      return;
    }

    const info = await stat(path);
    const file = info.isDirectory() ? join(path, 'index.html') : path;
    const body = await readFile(file);

    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      // Never cache during a test session: a stale module is a confusing bug.
      'Cache-Control': 'no-store'
    }).end(body);
  } catch (err) {
    const code = err.code === 'ENOENT' ? 404 : 500;
    res.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8' }).end(String(code));
  }
});

server.listen(PORT, () => {
  console.log(`עין הנץ  →  http://localhost:${PORT}/`);
  console.log(`dev strip →  http://localhost:${PORT}/?dev`);
});
