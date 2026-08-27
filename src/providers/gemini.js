import { performance } from 'node:perf_hooks';
import { validateJudgeResult, judgeJsonSchema } from '../core/schema.js';

function buildJudgeInput({ prompt, context, intendedUse, requiresCurrentFacts, staticAnalysis, rubricVersion }) {
  return `You are a rigorous prompt-quality evaluator for software developers.\n\nEvaluate the PROMPT itself, not whether you personally can answer it. Be conservative and explainable. Scores are 0-100 where 100 is excellent. "conflict_risk" is scored positively: 100 means the prompt handles ambiguity/conflicts well and has low conflict risk. "context_efficiency" is also positive: 100 means concise, relevant, non-duplicative context.\n\nHallucination risk means prompt-level risk indicators only; do not claim certainty that a future model will hallucinate. Improve the prompt while preserving user intent. Do not add facts not supplied by the user.\n\nRubric version: ${rubricVersion}\nIntended use: ${intendedUse}\nRequires current facts: ${Boolean(requiresCurrentFacts)}\n\nDETERMINISTIC FINDINGS:\n${JSON.stringify(staticAnalysis)}\n\nPROMPT:\n---\n${prompt}\n---\n\nOPTIONAL CONTEXT:\n---\n${context || '(none)'}\n---`;
}

function providerError(message, { status = null, category = 'judge_unavailable' } = {}) {
  const e = new Error(message);
  e.status = status;
  e.category = category;
  return e;
}

function categoryForStatus(status) {
  if (status === 401 || status === 403) return 'authentication_failed';
  if (status === 429) return 'rate_limited';
  if (status >= 500) return 'provider_error';
  return 'request_rejected';
}

export async function judgeWithGemini(input, { apiKey, model, rubricVersion, timeoutMs = 30000, onEvent } = {}) {
  if (!apiKey) return { result: null, meta: { status: 'not-configured' } };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = performance.now();
  const emit = (stage, message, meta = {}) => onEvent?.({ stage, message, meta });
  try {
    emit('request_sent', 'Gemini request sent', { model });
    let response;
    try {
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          input: buildJudgeInput({ ...input, rubricVersion }),
          response_format: { type: 'text', mime_type: 'application/json', schema: judgeJsonSchema }
        })
      });
    } catch (e) {
      if (e?.name === 'AbortError') throw providerError('Gemini request timed out', { category: 'timeout' });
      throw providerError('Gemini network request failed', { category: 'network_error' });
    }
    const durationMs = Math.round(performance.now() - start);
    emit('response_received', `Gemini responded with HTTP ${response.status} in ${durationMs} ms`, { status: response.status, duration_ms: durationMs });
    if (!response.ok) {
      // Consume the body for diagnostics but never return raw provider text to the browser.
      await response.text().catch(() => '');
      throw providerError(`Gemini request failed with HTTP ${response.status}`, { status: response.status, category: categoryForStatus(response.status) });
    }
    const data = await response.json();
    const raw = data.output_text ?? data.outputs?.at?.(-1)?.text ?? data.steps?.filter(s => s.type === 'model_output')?.at?.(-1)?.content?.find(c => c.type === 'text')?.text;
    if (!raw) throw providerError('Gemini response did not contain structured output', { status: response.status, category: 'invalid_response' });
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { throw providerError('Gemini returned invalid JSON', { status: response.status, category: 'invalid_json' }); }
    let result;
    try { result = validateJudgeResult(parsed); }
    catch { throw providerError('Gemini response failed schema validation', { status: response.status, category: 'schema_validation_failed' }); }
    emit('response_validated', 'Gemini structured judge response validated', { status: response.status, duration_ms: durationMs });
    return { result, meta: { status: response.status, duration_ms: durationMs } };
  } finally { clearTimeout(timer); }
}

export async function testGeminiConnection({ apiKey, model, timeoutMs = 12000 } = {}) {
  if (!apiKey) return { ok: false, status: 'not-configured', category: 'missing_api_key', model, duration_ms: 0 };
  const start = performance.now();
  try {
    const judge = await judgeWithGemini({
      prompt: 'Return the word OK.', context: '', intendedUse: 'connection test', requiresCurrentFacts: false,
      staticAnalysis: { metrics: {}, flags: {}, issues: [], recommendations: [], risk_indicators: [], hallucination_risk: 'low' }
    }, { apiKey, model, rubricVersion: 'connection-test', timeoutMs });
    return { ok: true, status: judge.meta.status, category: null, model, duration_ms: Math.round(performance.now() - start) };
  } catch (e) {
    return { ok: false, status: e?.status || null, category: e?.category || 'judge_unavailable', model, duration_ms: Math.round(performance.now() - start) };
  }
}
