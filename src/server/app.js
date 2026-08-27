import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzePrompt } from '../core/analyze.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../../public');

export function createApp(config) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '256kb' }));
  app.use((req,res,next) => {
    if (!config.allowedOrigins?.length) return next();
    const origin=req.headers.origin;
    if (origin && config.allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
  app.get('/api/health', (_req,res) => res.json({ ok:true, version:'1.0.0', judge_configured:Boolean(config.geminiApiKey), judge_model:config.geminiModel }));
  app.post('/api/analyze', async (req,res) => {
    const { prompt, context='', intendedUse='general', requiresCurrentFacts=false } = req.body || {};
    if (typeof prompt !== 'string' || !prompt.trim()) return res.status(400).json({ error:'prompt is required' });
    if (prompt.length > config.maxPromptChars) return res.status(413).json({ error:`prompt exceeds ${config.maxPromptChars} characters` });
    if (typeof context !== 'string' || context.length > config.maxContextChars) return res.status(413).json({ error:`context exceeds ${config.maxContextChars} characters` });
    try {
      const result = await analyzePrompt({ prompt, context, intendedUse:String(intendedUse).slice(0,100), requiresCurrentFacts:Boolean(requiresCurrentFacts) }, config);
      res.setHeader('Cache-Control','no-store');
      return res.json(result);
    } catch (e) { return res.status(500).json({ error:'analysis_failed', detail: e instanceof Error ? e.message : String(e) }); }
  });
  app.use(express.static(publicDir, { extensions:['html'] }));
  app.get('*splat', (_req,res) => res.sendFile(path.join(publicDir,'index.html')));
  return app;
}
