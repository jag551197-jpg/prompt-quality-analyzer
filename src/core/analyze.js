import { deterministicAnalyze } from './deterministic.js';
import { DIMENSIONS, RUBRIC_VERSION, weightedScore } from './rubric.js';
import { judgeWithGemini } from '../providers/gemini.js';

function heuristicScores(s) {
  const f=s.flags, m=s.metrics;
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

export async function analyzePrompt(input, config = {}) {
  const staticAnalysis = deterministicAnalyze(input);
  let judge = null, judgeError = null;
  try {
    judge = await judgeWithGemini({ ...input, staticAnalysis }, {
      apiKey: config.geminiApiKey,
      model: config.geminiModel || 'gemini-3.7-flash',
      rubricVersion: RUBRIC_VERSION,
      timeoutMs: config.timeoutMs
    });
  } catch (e) { judgeError = e instanceof Error ? e.message : String(e); }

  const scores = judge?.scores ?? heuristicScores(staticAnalysis);
  const overall = weightedScore(scores);
  const riskOrder = { low:0, medium:1, high:2 };
  const risks = [staticAnalysis.hallucination_risk, judge?.hallucination_risk].filter(Boolean);
  const hallucinationRisk = risks.sort((a,b)=>riskOrder[b]-riskOrder[a])[0] || 'low';

  return {
    version: '1.0.0', rubric_version: RUBRIC_VERSION,
    mode: judge ? 'hybrid-gemini' : 'deterministic-only',
    judge: { provider: judge ? 'google-gemini' : null, model: judge ? (config.geminiModel || 'gemini-3.7-flash') : null, confidence: judge?.confidence ?? null, error: judgeError },
    overall_score: overall,
    quality_level: overall >= 85 ? 'excellent' : overall >= 70 ? 'good' : overall >= 55 ? 'needs-improvement' : 'poor',
    hallucination_risk: hallucinationRisk,
    dimensions: Object.fromEntries(Object.entries(DIMENSIONS).map(([key,cfg]) => [key,{ label:cfg.label, weight:cfg.weight, score:Math.round(scores[key]) }])),
    strengths: judge?.strengths ?? [],
    weaknesses: [...new Set([...(judge?.weaknesses ?? []), ...staticAnalysis.issues])].slice(0,10),
    risk_indicators: [...new Set([...(judge?.risk_indicators ?? []), ...staticAnalysis.risk_indicators])].slice(0,10),
    recommendations: [...new Set([...(judge?.recommendations ?? []), ...staticAnalysis.recommendations])].slice(0,10),
    improved_prompt: judge?.improved_prompt || null,
    deterministic: staticAnalysis,
    disclaimer: 'Hallucination risk identifies prompt-level risk factors; it does not predict with certainty whether a model will hallucinate.'
  };
}
