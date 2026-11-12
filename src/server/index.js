// Local server: serves public/ and POST /api/analyze. Usage: npm start (PORT, default 3000).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApi } from './api-core.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    let body = ''; for await (const c of req) { body += c; if (body.length > 300000) break; }
    const out = await handleApi(req.method, url.pathname.replace(/^\/api/, ''), body);
    res.writeHead(out.status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); return res.end(JSON.stringify(out.body));
  }
  const file = path.join(root, path.normalize(url.pathname === '/' ? '/index.html' : url.pathname));
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'x-content-type-options': 'nosniff' }); fs.createReadStream(file).pipe(res);
}).listen(Number(process.env.PORT || 3000), () => console.log(`PQA Community on http://localhost:${process.env.PORT || 3000}`));
