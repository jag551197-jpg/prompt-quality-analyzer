import { randomUUID } from 'node:crypto';
import { buildDeterministicResult, buildHybridResult } from './analyze.js';

export const BENCHMARK_VERSION = '1.1.0';
export const DEFAULT_MAX_CASES = 25;
const TERMINAL_FAILURES = new Set(['failed','cancelled','incomplete','budget_exceeded','not-configured','submit-failed','invalid-result']);

function clampInt(v, fallback, min, max) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
}

export function validateBenchmarkSuite(body, { maxCases = DEFAULT_MAX_CASES, maxPromptChars = 20000, maxContextChars = 50000 } = {}) {
  if (!body || typeof body !== 'object') throw Object.assign(new Error('benchmark body is required'), { status: 400 });
  const cases = body.cases;
  if (!Array.isArray(cases) || cases.length === 0) throw Object.assign(new Error('cases must be a non-empty array'), { status: 400 });
  if (cases.length > maxCases) throw Object.assign(new Error(`benchmark batch exceeds ${maxCases} cases`), { status: 413 });
  const seen = new Set();
  const normalized = cases.map((c, idx) => {
    if (!c || typeof c !== 'object') throw Object.assign(new Error(`case ${idx} must be an object`), { status: 400 });
    const id = String(c.id || c.case_id || `case-${idx + 1}`).slice(0, 120);
    if (seen.has(id)) throw Object.assign(new Error(`duplicate case id: ${id}`), { status: 400 });
    seen.add(id);
    const prompt = String(c.prompt || c.payload?.prompt || '');
    const context = String(c.context || c.payload?.context || '');
    if (!prompt.trim()) throw Object.assign(new Error(`case ${id}: prompt is required`), { status: 400 });
    if (prompt.length > maxPromptChars) throw Object.assign(new Error(`case ${id}: prompt exceeds ${maxPromptChars} characters`), { status: 413 });
    if (context.length > maxContextChars) throw Object.assign(new Error(`case ${id}: context exceeds ${maxContextChars} characters`), { status: 413 });
    return {
      id,
      category: String(c.category || c.intendedUse || c.intended_use || 'general').slice(0, 120),
      tags: Array.isArray(c.tags) ? c.tags.map(x => String(x).slice(0, 80)).slice(0, 20) : [],
      pair: c.pair == null ? null : String(c.pair).slice(0, 120),
      notes: c.notes == null ? null : String(c.notes).slice(0, 1000),
      payload: {
        prompt,
        context,
        intendedUse: String(c.intendedUse || c.intended_use || c.category || 'general').slice(0, 100),
        requiresCurrentFacts: Boolean(c.requiresCurrentFacts ?? c.requires_current_facts ?? false)
      },
      expected: normalizeExpected(c.expected || {})
    };
  });
  return {
    benchmark_name: String(body.benchmark_name || body.name || 'benchmark').slice(0, 160),
    benchmark_version: String(body.benchmark_version || '').slice(0, 80) || null,
    description: String(body.description || '').slice(0, 2000),
    tags: Array.isArray(body.tags) ? body.tags.map(x => String(x).slice(0, 80)).slice(0, 20) : [],
    cases: normalized,
    concurrency: clampInt(body.concurrency, 4, 1, 8)
  };
}

function normalizeExpected(x) {
  if (!x || typeof x !== 'object') return {};
  const out = {};
  if (x.overall_min != null) out.overall_min = Number(x.overall_min);
  if (x.overall_max != null) out.overall_max = Number(x.overall_max);
  if (x.hallucination_risk != null) out.hallucination_risk = String(x.hallucination_risk).toLowerCase();
  if (x.quality_level != null) out.quality_level = String(x.quality_level).toLowerCase();
  if (x.dimensions_min && typeof x.dimensions_min === 'object') out.dimensions_min = Object.fromEntries(Object.entries(x.dimensions_min).map(([k,v])=>[k,Number(v)]));
  if (x.dimensions_max && typeof x.dimensions_max === 'object') out.dimensions_max = Object.fromEntries(Object.entries(x.dimensions_max).map(([k,v])=>[k,Number(v)]));
  return out;
}

export function evaluateExpectations(result, expected = {}) {
  const checks = [];
  const add = (name, pass, actual, expectedValue) => checks.push({ name, pass: Boolean(pass), actual, expected: expectedValue });
  if (expected.overall_min != null) add('overall_min', result.overall_score >= expected.overall_min, result.overall_score, expected.overall_min);
  if (expected.overall_max != null) add('overall_max', result.overall_score <= expected.overall_max, result.overall_score, expected.overall_max);
  if (expected.hallucination_risk) add('hallucination_risk', result.hallucination_risk === expected.hallucination_risk, result.hallucination_risk, expected.hallucination_risk);
  if (expected.quality_level) add('quality_level', result.quality_level === expected.quality_level, result.quality_level, expected.quality_level);
  for (const [dim,min] of Object.entries(expected.dimensions_min || {})) {
    const actual = result.dimensions?.[dim]?.score;
    add(`dimension_min:${dim}`, Number.isFinite(actual) && actual >= min, actual ?? null, min);
  }
  for (const [dim,max] of Object.entries(expected.dimensions_max || {})) {
    const actual = result.dimensions?.[dim]?.score;
    add(`dimension_max:${dim}`, Number.isFinite(actual) && actual <= max, actual ?? null, max);
  }
  return { passed: checks.every(c => c.pass), checks, check_count: checks.length, failed_checks: checks.filter(c=>!c.pass).length };
}

export function validateFinalResult(result) {
  const errors = [];
  if (!result || typeof result !== 'object') errors.push('final_result_missing');
  if (!Number.isFinite(result?.overall_score)) errors.push('overall_score_missing_or_non_numeric');
  if (!['low','medium','high'].includes(result?.hallucination_risk)) errors.push('hallucination_risk_invalid');
  if (!Array.isArray(result?.recommendations)) errors.push('recommendations_missing');
  if (!result?.dimensions || typeof result.dimensions !== 'object') errors.push('dimensions_missing');
  return { valid: errors.length === 0, errors };
}

function compatibilityExpectation(expectations) {
  return {
    pass: expectations?.passed ?? null,
    passed: expectations?.passed ?? null,
    evaluated: (expectations?.check_count || 0) > 0,
    checks: expectations?.checks || [],
    failed_checks: expectations?.failed_checks || 0,
    check_count: expectations?.check_count || 0
  };
}

export function buildBenchmarkCaseBase(c) {
  const deterministic = buildDeterministicResult(c.payload);
  const deterministicExpectations = evaluateExpectations(deterministic, c.expected);
  return {
    // Canonical identity/metadata
    case_id: c.id,
    id: c.id,
    category: c.category,
    tags: c.tags,
    pair: c.pair,
    notes: c.notes,
    status: 'deterministic-complete',
    payload: c.payload,
    prompt: c.payload.prompt,
    context: c.payload.context,
    intendedUse: c.payload.intendedUse,
    requiresCurrentFacts: c.payload.requiresCurrentFacts,
    expected: c.expected,

    // Analysis lifecycle
    deterministic_result: deterministic,
    deterministic_expectations: deterministicExpectations,
    interaction_id: null,
    judge_status: 'not-submitted',
    submit_error: null,
    final_result: null,
    result: null,
    analysis: null,
    expectations: null,
    expectation: null,
    result_contract: { valid: false, errors: ['final_result_missing'] }
  };
}

export function finalizeBenchmarkCase(caseState, judgeStatus, config) {
  const judge = judgeStatus?.status === 'completed' ? judgeStatus.result : null;
  const judgeMeta = {
    interaction_id: caseState.interaction_id || judgeStatus?.interaction_id || null,
    interaction_status: judgeStatus?.status || caseState.judge_status || null,
    usage: judgeStatus?.usage || null,
    duration_ms: judgeStatus?.duration_ms || null,
    total_duration_ms: judgeStatus?.total_duration_ms || null,
    error: judgeStatus?.error || caseState.submit_error || null,
    http_status: judgeStatus?.http_status || null
  };
  const finalResult = buildHybridResult(caseState.payload, caseState.deterministic_result, judge, judgeMeta, config);
  const contract = validateFinalResult(finalResult);
  const expectations = contract.valid ? evaluateExpectations(finalResult, caseState.expected) : null;
  const status = contract.valid ? 'completed' : 'invalid-result';
  return {
    ...caseState,
    status,
    judge_status: judgeStatus?.status || caseState.judge_status,
    final_result: finalResult,
    result: finalResult,
    analysis: finalResult,
    expectations,
    expectation: expectations ? compatibilityExpectation(expectations) : null,
    result_contract: contract,
    completed_at: contract.valid ? new Date().toISOString() : null
  };
}

function pairwiseMetrics(cases) {
  const groups=new Map();
  for(const c of cases){if(!c.pair)continue;const a=groups.get(c.pair)||[];a.push(c);groups.set(c.pair,a);}
  const order={low:0,medium:1,high:2};
  const details=[];
  for(const [pair,items] of groups){
    if(items.length<2)continue;
    const good=items.find(c=>c.tags?.includes('good')||/-B$/.test(c.case_id||c.id||''));
    const bad=items.find(c=>c.tags?.includes('bad')||/-A$/.test(c.case_id||c.id||''));
    if(!good||!bad||!good.final_result||!bad.final_result)continue;
    const scorePass=good.final_result.overall_score>bad.final_result.overall_score;
    const riskPass=(order[good.final_result.hallucination_risk]??9)<=(order[bad.final_result.hallucination_risk]??-1);
    details.push({pair,good_case:good.case_id,bad_case:bad.case_id,good_score:good.final_result.overall_score,bad_score:bad.final_result.overall_score,delta:good.final_result.overall_score-bad.final_result.overall_score,good_risk:good.final_result.hallucination_risk,bad_risk:bad.final_result.hallucination_risk,score_pass:scorePass,risk_pass:riskPass,passed:scorePass&&riskPass});
  }
  const passes=details.filter(x=>x.passed).length;
  return {total_pairs:details.length,passes,failures:details.length-passes,accuracy:details.length?Math.round(passes/details.length*10000)/100:null,average_score_delta:details.length?Math.round(details.reduce((a,b)=>a+b.delta,0)/details.length*100)/100:null,details};
}

export function summarizeBenchmark(run) {
  const cases = run.cases || [];
  const completed = cases.filter(c => c.status === 'completed' && c.result_contract?.valid === true);
  const invalid = cases.filter(c => c.status === 'invalid-result' || (c.final_result && c.result_contract?.valid !== true));
  const terminalFailures = cases.filter(c => TERMINAL_FAILURES.has(c.judge_status) && c.status !== 'completed');
  const terminal = new Set([...completed, ...invalid, ...terminalFailures]);
  const withExpectations = completed.filter(c => (c.expectations?.check_count || 0) > 0);
  const expectedPasses = withExpectations.filter(c => c.expectations.passed).length;
  const scores = completed.map(c => c.final_result?.overall_score).filter(Number.isFinite);
  const avg = scores.length ? Math.round((scores.reduce((a,b)=>a+b,0)/scores.length)*100)/100 : null;
  const resultIntegrityRate = cases.length ? Math.round((completed.length / cases.length) * 10000) / 100 : 100;
  return {
    total_cases: cases.length,
    terminal_cases: terminal.size,
    completed_cases: completed.length,
    analytically_complete_cases: completed.length,
    invalid_result_cases: invalid.length,
    pending_cases: Math.max(0, cases.length-terminal.size),
    expectation_cases: withExpectations.length,
    expectation_passes: expectedPasses,
    expectation_failures: withExpectations.length-expectedPasses,
    expectation_pass_rate: withExpectations.length ? Math.round((expectedPasses/withExpectations.length)*10000)/100 : null,
    average_overall_score: avg,
    result_integrity_rate: resultIntegrityRate,
    pairwise: pairwiseMetrics(cases),
    status: terminal.size === cases.length ? (invalid.length ? 'invalid' : 'completed') : 'in_progress'
  };
}

export function createBenchmarkRun(suite) {
  return {
    benchmark_id: randomUUID(),
    benchmark_version: BENCHMARK_VERSION,
    suite_version: suite.benchmark_version,
    benchmark_name: suite.benchmark_name,
    description: suite.description,
    tags: suite.tags,
    created_at: new Date().toISOString(),
    cases: suite.cases.map(buildBenchmarkCaseBase)
  };
}
