import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { configFromEnv } from './config.js';
import { analyzePrompt } from '../core/analyze.js';
import { testGeminiConnection } from '../providers/gemini.js';
import { getLogs, logEvent } from './log-store.js';

try {
  const text = fs.readFileSync('.env', 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
} catch {}

const cfg = configFromEnv();
const publicDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
  res.end(JSON.stringify(payload));
}
async function readBody(req) {
  let size = 0, chunks = [];
  for await (const c of req) {
    size += c.length;
    if (size > 262144) throw Object.assign(new Error('request too large'), { status:413 });
    chunks.push(c);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); }
  catch { throw Object.assign(new Error('invalid JSON body'), { status:400 }); }
}
function validate(payload) {
  const { prompt, context='', intendedUse='general', requiresCurrentFacts=false } = payload || {};
  if (typeof prompt !== 'string' || !prompt.trim()) throw Object.assign(new Error('prompt is required'), { status:400 });
  if (prompt.length > cfg.maxPromptChars) throw Object.assign(new Error(`prompt exceeds ${cfg.maxPromptChars} characters`), { status:413 });
  if (typeof context !== 'string' || context.length > cfg.maxContextChars) throw Object.assign(new Error(`context exceeds ${cfg.maxContextChars} characters`), { status:413 });
  return { prompt, context, intendedUse:String(intendedUse).slice(0,100), requiresCurrentFacts:Boolean(requiresCurrentFacts) };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok:true, version:'1.1.0', judge_configured:Boolean(cfg.geminiApiKey), judge_model:cfg.geminiModel });
    if (req.method === 'GET' && url.pathname === '/api/logs') return json(res, 200, { logs:getLogs({ limit:url.searchParams.get('limit'), requestId:url.searchParams.get('request_id') }), note:'In-process diagnostic log.' });
    if (req.method === 'POST' && url.pathname === '/api/test-judge') {
      const requestId = randomUUID();
      logEvent({ level:'INFO', request_id:requestId, stage:'connection_test', message:'Testing Gemini judge connection' });
      const result = await testGeminiConnection({ apiKey:cfg.geminiApiKey, model:cfg.geminiModel, timeoutMs:Math.min(cfg.timeoutMs || 30000, 12000) });
      logEvent({ level:result.ok?'INFO':'WARN', request_id:requestId, stage:'connection_test_complete', message:result.ok?'Gemini judge connection test passed':`Gemini judge connection test failed (${result.category})`, elapsed_ms:result.duration_ms });
      return json(res, result.ok ? 200 : 503, { request_id:requestId, ...result });
    }
    if (req.method === 'POST' && ['/api/analyze','/api/analyze-stream'].includes(url.pathname)) {
      const input = validate(await readBody(req));
      const requestId = randomUUID();
      const onLog = event => logEvent({ request_id:requestId, ...event });
      if (url.pathname === '/api/analyze') {
        const result = await analyzePrompt(input, cfg, { onLog });
        return json(res, 200, { request_id:requestId, ...result });
      }
      res.writeHead(200, { 'Content-Type':'application/x-ndjson; charset=utf-8', 'Cache-Control':'no-store, no-transform', 'X-Content-Type-Options':'nosniff', 'X-Accel-Buffering':'no' });
      const send = payload => res.write(`${JSON.stringify(payload)}\n`);
      const onEvent = event => send({ request_id:requestId, ...event });
      send({ type:'meta', request_id:requestId, version:'1.1.0' });
      try {
        const result = await analyzePrompt(input, cfg, { onEvent, onLog });
        send({ type:'result', request_id:requestId, result:{ request_id:requestId, ...result } });
      } catch (e) {
        onLog({ level:'ERROR', stage:'failed', message:'Streaming analysis failed' });
        send({ type:'error', request_id:requestId, error:'analysis_failed', detail:e instanceof Error?e.message:String(e) });
      }
      return res.end();
    }
    if (url.pathname.startsWith('/api/')) return json(res, 404, { error:'not_found' });

    let rel = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    let target = path.resolve(publicDir, rel);
    if (!target.startsWith(publicDir)) return json(res, 403, { error:'forbidden' });
    if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) target = path.join(publicDir, 'index.html');
    res.writeHead(200, { 'Content-Type':mime[path.extname(target)] || 'application/octet-stream', 'X-Content-Type-Options':'nosniff' });
    fs.createReadStream(target).pipe(res);
  } catch (e) {
    json(res, e.status || 500, { error:e.status?'bad_request':'analysis_failed', detail:e.message });
  }
});

server.listen(cfg.port, '0.0.0.0', () => console.log(`Prompt Quality Analyzer v1.1.0 listening on http://0.0.0.0:${cfg.port} (${cfg.geminiApiKey ? 'Gemini judge enabled' : 'deterministic-only'})`));
