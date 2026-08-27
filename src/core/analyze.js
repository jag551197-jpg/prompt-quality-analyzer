import { performance } from 'node:perf_hooks';
import { deterministicAnalyze } from './deterministic.js';
import { DIMENSIONS, RUBRIC_VERSION, weightedScore } from './rubric.js';

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
    version: '1.3.0',
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

/** Combine a previously persisted deterministic result with a completed Gemini judge result. */
export function buildHybridResult(input, deterministicResult, judge, judgeMeta = {}, config = {}) {
  const staticAnalysis = deterministicResult?.deterministic ?? deterministicAnalyze(input);
  const scores = judge?.scores ?? heuristicScores(staticAnalysis);
  const overall = weightedScore(scores);
  const riskOrder = { low:0, medium:1, high:2 };
  const risks=[staticAnalysis.hallucination_risk, judge?.hallucination_risk].filter(Boolean);
  const hallucinationRisk=risks.sort((a,b)=>riskOrder[b]-riskOrder[a])[0]||'low';
  const geminiMs=judgeMeta?.total_duration_ms ?? judgeMeta?.duration_ms ?? null;
  return {
    version:'1.3.0', rubric_version:RUBRIC_VERSION,
    mode:judge?'hybrid-gemini':'deterministic-only',
    timing:{ total_ms:geminiMs ?? deterministicResult?.timing?.total_ms ?? null, deterministic_ms:deterministicResult?.timing?.deterministic_ms ?? null, gemini_ms:geminiMs },
    judge:{
      provider: config.geminiApiKey ? 'google-gemini' : null,
      model: config.geminiApiKey ? (config.geminiModel||'gemini-3.7-flash') : null,
      status:judge?'ok':(config.geminiApiKey?'fallback':'not-configured'),
      confidence:judge?.confidence??null,
      error:judgeMeta?.error?.message??null,
      error_category:judgeMeta?.error?.category??null,
      http_status:judgeMeta?.http_status??null,
      duration_ms:geminiMs,
      interaction_id:judgeMeta?.interaction_id??null,
      interaction_status:judgeMeta?.interaction_status??null,
      usage:judgeMeta?.usage??null
    },
    judge_response:judge?{
      scores:judge.scores,hallucination_risk:judge.hallucination_risk,
      strengths:judge.strengths,weaknesses:judge.weaknesses,
      risk_indicators:judge.risk_indicators,recommendations:judge.recommendations,
      improved_prompt:judge.improved_prompt,confidence:judge.confidence
    }:null,
    overall_score:overall,
    quality_level:overall>=85?'excellent':overall>=70?'good':overall>=55?'needs-improvement':'poor',
    hallucination_risk:hallucinationRisk,
    dimensions:Object.fromEntries(Object.entries(DIMENSIONS).map(([key,cfg])=>[key,{label:cfg.label,weight:cfg.weight,score:Math.round(scores[key])}])),
    strengths:judge?.strengths??[],
    weaknesses:[...new Set([...(judge?.weaknesses??[]),...staticAnalysis.issues])].slice(0,10),
    risk_indicators:[...new Set([...(judge?.risk_indicators??[]),...staticAnalysis.risk_indicators])].slice(0,10),
    recommendations:[...new Set([...(judge?.recommendations??[]),...staticAnalysis.recommendations])].slice(0,10),
    improved_prompt:judge?.improved_prompt||null,
    deterministic:staticAnalysis,
    disclaimer:'Hallucination risk identifies prompt-level risk factors; it does not predict with certainty whether a model will hallucinate.'
  };
}

/** Compatibility helper: v1.3 deliberately does not hold open an HTTP request for Gemini. */
export async function analyzePrompt(input, config = {}) {
  return buildDeterministicResult(input);
}
