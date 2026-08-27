import { performance } from 'node:perf_hooks';
import { deterministicAnalyze } from './deterministic.js';
import { DIMENSIONS, RUBRIC_VERSION, weightedScore } from './rubric.js';
import { judgeWithGemini } from '../providers/gemini.js';

export function heuristicScores(s) {
  const f = s.flags, m = s.metrics;
  return {
    instruction_clarity: m.prompt_chars >= 80 ? 72 : 52,
    context_sufficiency: m.context_chars > 0 ? 72 : 58,
    grounding_constraints: f.hasGround ? 85 : 42,
    uncertainty_handling: f.hasAbstain ? 90 : 38,
    output_contract: f.hasFormat ? 86 : 48,
    tool_guidance: f.hasTool ? 82 : 55,
    conflict_risk: f.forced ? 40 : 78,
    context_efficiency: Math.max(35, Math.round(92 - m.duplicate_ratio * 100))
  };
}

function nowMs(start) { return Math.round(performance.now() - start); }

export function buildDeterministicResult(input) {
  const start = performance.now();
  const staticAnalysis = deterministicAnalyze(input);
  const scores = heuristicScores(staticAnalysis);
  const overall = weightedScore(scores);
  return {
    version: '1.1.1',
    rubric_version: RUBRIC_VERSION,
    mode: 'deterministic-only',
    timing: { total_ms: nowMs(start), deterministic_ms: nowMs(start), gemini_ms: null },
    judge: { provider: null, model: null, status: 'not-run', confidence: null, error: null, error_category: null, http_status: null, duration_ms: null },
    judge_response: null,
    overall_score: overall,
    quality_level: overall >= 85 ? 'excellent' : overall >= 70 ? 'good' : overall >= 55 ? 'needs-improvement' : 'poor',
    hallucination_risk: staticAnalysis.hallucination_risk,
    dimensions: Object.fromEntries(Object.entries(DIMENSIONS).map(([key, cfg]) => [key, { label: cfg.label, weight: cfg.weight, score: Math.round(scores[key]) }])),
    strengths: [],
    weaknesses: staticAnalysis.issues.slice(0, 10),
    risk_indicators: staticAnalysis.risk_indicators.slice(0, 10),
    recommendations: staticAnalysis.recommendations.slice(0, 10),
    improved_prompt: null,
    deterministic: staticAnalysis,
    disclaimer: 'Hallucination risk identifies prompt-level risk factors; it does not predict with certainty whether a model will hallucinate.'
  };
}

/** Full analysis. Deterministic evaluation always runs first and Gemini is optional/fail-open. */
export async function analyzePrompt(input, config = {}, hooks = {}) {
  const start = performance.now();
  const estimatedJudgeMs = Number(config.estimatedJudgeMs || 8000);
  const emit = (stage, message, progress, etaMs = null, extra = {}) => {
    const event = { type: 'progress', stage, message, progress, elapsed_ms: nowMs(start), eta_ms: etaMs, ...extra };
    hooks.onEvent?.(event);
    hooks.onLog?.({ level: 'INFO', ...event });
  };

  emit('received', 'Analysis request received', 2, config.geminiApiKey ? estimatedJudgeMs + 500 : 400);
  emit('deterministic', 'Running deterministic prompt checks', 10, config.geminiApiKey ? estimatedJudgeMs + 300 : 250);
  const deterministicStart = performance.now();
  const staticAnalysis = deterministicAnalyze(input);
  const deterministicMs = Math.round(performance.now() - deterministicStart);
  emit('deterministic_complete', `Deterministic checks complete in ${deterministicMs} ms`, 25, config.geminiApiKey ? estimatedJudgeMs : 150, { deterministic_ms: deterministicMs, risk: staticAnalysis.hallucination_risk });

  let judge = null, judgeError = null, judgeMeta = null;
  if (!config.geminiApiKey) {
    emit('judge_skipped', 'Gemini judge is not configured; using deterministic scoring', 70, 120, { fallback: 'missing_api_key' });
  } else {
    emit('judge_request', `Calling Gemini judge (${config.geminiModel || 'gemini-3.7-flash'})`, 32, estimatedJudgeMs);
    try {
      const judgeResult = await judgeWithGemini({ ...input, staticAnalysis }, {
        apiKey: config.geminiApiKey,
        model: config.geminiModel || 'gemini-3.7-flash',
        rubricVersion: RUBRIC_VERSION,
        timeoutMs: config.timeoutMs,
        onEvent: (evt) => {
          judgeMeta = { ...(judgeMeta || {}), ...(evt.meta || {}) };
          const mappedProgress = evt.stage === 'response_received' ? 72 : evt.stage === 'response_validated' ? 82 : 45;
          emit(`gemini_${evt.stage}`, evt.message, mappedProgress, evt.eta_ms ?? Math.max(500, estimatedJudgeMs - nowMs(start)), evt.meta || {});
        }
      });
      judge = judgeResult.result;
      judgeMeta = { ...(judgeMeta || {}), ...judgeResult.meta };
    } catch (e) {
      judgeError = e instanceof Error ? e.message : String(e);
      const category = e?.category || 'judge_unavailable';
      judgeMeta = { ...(judgeMeta || {}), category, status: e?.status || null };
      emit('judge_fallback', `Gemini judge unavailable (${category}); continuing with deterministic scoring`, 72, 160, { fallback: category, http_status: e?.status || null });
    }
  }

  emit('scoring', 'Calculating prompt quality scores and risk level', 88, 100);
  const scores = judge?.scores ?? heuristicScores(staticAnalysis);
  const overall = weightedScore(scores);
  const riskOrder = { low: 0, medium: 1, high: 2 };
  const risks = [staticAnalysis.hallucination_risk, judge?.hallucination_risk].filter(Boolean);
  const hallucinationRisk = risks.sort((a, b) => riskOrder[b] - riskOrder[a])[0] || 'low';

  const result = {
    version: '1.1.1', rubric_version: RUBRIC_VERSION,
    mode: judge ? 'hybrid-gemini' : 'deterministic-only',
    timing: { total_ms: nowMs(start), deterministic_ms: deterministicMs, gemini_ms: judgeMeta?.duration_ms ?? null },
    judge: {
      provider: config.geminiApiKey ? 'google-gemini' : null,
      model: config.geminiApiKey ? (config.geminiModel || 'gemini-3.7-flash') : null,
      status: judge ? 'ok' : (config.geminiApiKey ? 'fallback' : 'not-configured'),
      confidence: judge?.confidence ?? null,
      error: judgeError,
      error_category: judgeMeta?.category ?? null,
      http_status: judgeMeta?.status ?? null,
      duration_ms: judgeMeta?.duration_ms ?? null
    },
    judge_response: judge ? {
      scores: judge.scores, hallucination_risk: judge.hallucination_risk,
      strengths: judge.strengths, weaknesses: judge.weaknesses,
      risk_indicators: judge.risk_indicators, recommendations: judge.recommendations,
      improved_prompt: judge.improved_prompt, confidence: judge.confidence
    } : null,
    overall_score: overall,
    quality_level: overall >= 85 ? 'excellent' : overall >= 70 ? 'good' : overall >= 55 ? 'needs-improvement' : 'poor',
    hallucination_risk: hallucinationRisk,
    dimensions: Object.fromEntries(Object.entries(DIMENSIONS).map(([key, cfg]) => [key, { label: cfg.label, weight: cfg.weight, score: Math.round(scores[key]) }])),
    strengths: judge?.strengths ?? [],
    weaknesses: [...new Set([...(judge?.weaknesses ?? []), ...staticAnalysis.issues])].slice(0, 10),
    risk_indicators: [...new Set([...(judge?.risk_indicators ?? []), ...staticAnalysis.risk_indicators])].slice(0, 10),
    recommendations: [...new Set([...(judge?.recommendations ?? []), ...staticAnalysis.recommendations])].slice(0, 10),
    improved_prompt: judge?.improved_prompt || null,
    deterministic: staticAnalysis,
    disclaimer: 'Hallucination risk identifies prompt-level risk factors; it does not predict with certainty whether a model will hallucinate.'
  };
  emit('complete', `Analysis complete in ${result.timing.total_ms} ms`, 100, 0, { mode: result.mode, overall_score: result.overall_score });
  return result;
}
