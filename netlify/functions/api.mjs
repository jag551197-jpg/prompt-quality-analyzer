import { randomUUID } from 'node:crypto';
import { analyzePrompt, buildDeterministicResult } from '../../src/core/analyze.js';
import { testGeminiConnection } from '../../src/providers/gemini.js';
import { configFromEnv } from '../../src/server/config.js';
import { getLogs, logEvent } from '../../src/server/log-store.js';

const cfg = configFromEnv();
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

function routeFor(req) {
  const u = new URL(req.url);
  return u.pathname.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '') || '/';
}

function validatePayload(body) {
  const { prompt, context = '', intendedUse = 'general', requiresCurrentFacts = false } = body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) return { error: json({ error: 'prompt is required' }, 400) };
  if (prompt.length > cfg.maxPromptChars) return { error: json({ error: `prompt exceeds ${cfg.maxPromptChars} characters` }, 413) };
  if (typeof context !== 'string' || context.length > cfg.maxContextChars) return { error: json({ error: `context exceeds ${cfg.maxContextChars} characters` }, 413) };
  return { input: { prompt, context, intendedUse: String(intendedUse).slice(0, 100), requiresCurrentFacts: Boolean(requiresCurrentFacts) } };
}

function requestIdFor(req) { const v=String(req.headers.get('x-pqa-transaction-id')||''); return /^[0-9a-f-]{36}$/i.test(v) ? v : randomUUID(); }

export default async (req) => {
  const route = routeFor(req);
  if (req.method === 'GET' && route === '/health') return json({ ok: true, version: '1.2.0', judge_configured: Boolean(cfg.geminiApiKey), judge_model: cfg.geminiModel });
  if (req.method === 'GET' && route === '/logs') {
    const u = new URL(req.url);
    return json({ logs: getLogs({ limit: u.searchParams.get('limit'), requestId: u.searchParams.get('request_id') }), note: 'Best-effort instance-local log. For Netlify production diagnostics use Logs & Metrics > Functions or `netlify logs --follow`.' });
  }
  if (req.method === 'POST' && route === '/test-judge') {
    const requestId = requestIdFor(req);
    logEvent({ level: 'INFO', request_id: requestId, stage: 'connection_test', message: 'Testing Gemini judge connection' });
    const result = await testGeminiConnection({ apiKey: cfg.geminiApiKey, model: cfg.geminiModel, timeoutMs: Math.min(cfg.timeoutMs || 30000, 12000) });
    logEvent({ level: result.ok ? 'INFO' : 'WARN', request_id: requestId, stage: 'connection_test_complete', message: result.ok ? 'Gemini judge connection test passed' : `Gemini judge connection test failed (${result.category})`, elapsed_ms: result.duration_ms });
    return json({ request_id: requestId, ...result }, result.ok ? 200 : 503);
  }
  if (req.method === 'POST' && route === '/deterministic') {
    let body;
    try { body = await req.json(); } catch { return json({ error: 'invalid_json' }, 400); }
    const checked = validatePayload(body);
    if (checked.error) return checked.error;
    const requestId = requestIdFor(req);
    logEvent({ level: 'INFO', request_id: requestId, stage: 'deterministic', message: 'Running deterministic prompt checks' });
    const result = buildDeterministicResult(checked.input);
    logEvent({ level: 'INFO', request_id: requestId, stage: 'deterministic_complete', message: 'Deterministic analysis complete', elapsed_ms: result.timing.total_ms });
    return json({ request_id: requestId, ...result });
  }

  if (req.method !== 'POST' || !['/analyze', '/analyze-stream'].includes(route)) return json({ error: 'not_found' }, 404);

  let body;
  try { body = await req.json(); }
  catch { return json({ error: 'invalid_json' }, 400); }
  const checked = validatePayload(body);
  if (checked.error) return checked.error;
  const requestId = requestIdFor(req);
  const onLog = (event) => logEvent({ request_id: requestId, ...event });

  if (route === '/analyze') {
    try {
      const result = await analyzePrompt(checked.input, cfg, { onLog });
      return json({ request_id: requestId, ...result });
    } catch (e) {
      onLog({ level: 'ERROR', stage: 'failed', message: 'Analysis failed' });
      return json({ error: 'analysis_failed', request_id: requestId, detail: e instanceof Error ? e.message : String(e) }, 500);
    }
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload) => controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      const onEvent = (event) => send({ request_id: requestId, ...event });
      try {
        send({ type: 'meta', request_id: requestId, version: '1.2.0' });
        const result = await analyzePrompt(checked.input, cfg, { onEvent, onLog });
        send({ type: 'result', request_id: requestId, result: { request_id: requestId, ...result } });
      } catch (e) {
        onLog({ level: 'ERROR', stage: 'failed', message: 'Streaming analysis failed' });
        send({ type: 'error', request_id: requestId, error: 'analysis_failed', detail: e instanceof Error ? e.message : String(e) });
      } finally { controller.close(); }
    }
  });
  return new Response(stream, { status: 200, headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store, no-transform' } });
};
