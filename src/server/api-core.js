// Shared API logic for the local server and the Netlify function. No storage, no logging of prompt text.
import { analyzePrompt, ENGINE_VERSION, scanText } from '../analyze.js';
export const LIMITS = Object.freeze({ promptChars: 20000, contextChars: 100000 });
export async function handleApi(method, route, rawBody){
  if (method === 'GET' && route === '/health') return { status: 200, body: { ok: true, engine: ENGINE_VERSION } };
  if (method === 'POST' && route === '/analyze') {
    let b; try { b = JSON.parse(rawBody || '{}'); } catch { return { status: 400, body: { error: 'invalid_json' } }; }
    const prompt = typeof b.prompt === 'string' ? b.prompt : '', context = typeof b.context === 'string' ? b.context : '';
    if (!prompt.trim()) return { status: 400, body: { error: 'prompt_required' } };
    if (prompt.length > LIMITS.promptChars || context.length > LIMITS.contextChars) return { status: 413, body: { error: 'too_large' } };
    return { status: 200, body: { ...analyzePrompt({ prompt, context, language: b.language }), security: scanText(`${prompt}\n${context}`) } };
  }
  return { status: 404, body: { error: 'not_found' } };
}
