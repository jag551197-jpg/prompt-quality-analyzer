import { randomUUID } from 'node:crypto';
import { buildDeterministicResult, buildHybridResult } from './analyze.js';

export const BENCHMARK_VERSION = '1.0.0';
export const DEFAULT_MAX_CASES = 25;

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
    const id = String(c.id || `case-${idx + 1}`).slice(0, 120);
    if (seen.has(id)) throw Object.assign(new Error(`duplicate case id: ${id}`), { status: 400 });
    seen.add(id);
    const prompt = String(c.prompt || '');
    const context = String(c.context || '');
    if (!prompt.trim()) throw Object.assign(new Error(`case ${id}: prompt is required`), { status: 400 });
    if (prompt.length > maxPromptChars) throw Object.assign(new Error(`case ${id}: prompt exceeds ${maxPromptChars} characters`), { status: 413 });
    if (context.length > maxContextChars) throw Object.assign(new Error(`case ${id}: context exceeds ${maxContextChars} characters`), { status: 413 });
    return {
      id,
      payload: {
        prompt,
        context,
        intendedUse: String(c.intendedUse || c.intended_use || 'general').slice(0, 100),
        requiresCurrentFacts: Boolean(c.requiresCurrentFacts ?? c.requires_current_facts ?? false)
      },
      expected: normalizeExpected(c.expected || {})
    };
  });
  return {
    benchmark_name: String(body.benchmark_name || body.name || 'benchmark').slice(0, 160),
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

export function buildBenchmarkCaseBase(c) {
  const deterministic = buildDeterministicResult(c.payload);
  return {
    case_id: c.id,
    payload: c.payload,
    expected: c.expected,
    deterministic_result: deterministic,
    deterministic_expectations: evaluateExpectations(deterministic, c.expected),
    interaction_id: null,
    judge_status: 'not-submitted',
    submit_error: null
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
  const expectations = evaluateExpectations(finalResult, caseState.expected);
  return { ...caseState, judge_status: judgeStatus?.status || caseState.judge_status, final_result: finalResult, expectations };
}

export function summarizeBenchmark(run) {
  const cases = run.cases || [];
  const terminal = cases.filter(c => c.final_result || ['failed','cancelled','incomplete','budget_exceeded','not-configured','submit-failed'].includes(c.judge_status));
  const completed = cases.filter(c => c.final_result);
  const passed = completed.filter(c => c.expectations?.passed).length;
  const withExpectations = completed.filter(c => (c.expectations?.check_count || 0) > 0);
  const expectedPasses = withExpectations.filter(c=>c.expectations.passed).length;
  const scores = completed.map(c=>c.final_result?.overall_score).filter(Number.isFinite);
  const avg = scores.length ? Math.round((scores.reduce((a,b)=>a+b,0)/scores.length)*100)/100 : null;
  return {
    total_cases: cases.length,
    terminal_cases: terminal.length,
    completed_cases: completed.length,
    pending_cases: Math.max(0, cases.length-terminal.length),
    expectation_cases: withExpectations.length,
    expectation_passes: expectedPasses,
    expectation_failures: withExpectations.length-expectedPasses,
    expectation_pass_rate: withExpectations.length ? Math.round((expectedPasses/withExpectations.length)*10000)/100 : null,
    average_overall_score: avg,
    passed_cases: passed,
    status: terminal.length === cases.length ? 'completed' : 'in_progress'
  };
}

export function createBenchmarkRun(suite) {
  return {
    benchmark_id: randomUUID(),
    benchmark_version: BENCHMARK_VERSION,
    benchmark_name: suite.benchmark_name,
    tags: suite.tags,
    created_at: new Date().toISOString(),
    cases: suite.cases.map(buildBenchmarkCaseBase)
  };
}
