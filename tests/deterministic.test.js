import test from 'node:test'; import assert from 'node:assert/strict';
import { deterministicAnalyze } from '../src/core/deterministic.js';
import { weightedScore } from '../src/core/rubric.js';
test('flags current factual prompt without grounding',()=>{ const r=deterministicAnalyze({prompt:'Give me the latest tax regulation and always answer definitively.',requiresCurrentFacts:true}); assert.equal(r.hallucination_risk,'high'); assert.ok(r.risk_indicators.includes('time-sensitive-without-grounding')); });
test('weighted score is stable',()=>{ const scores=Object.fromEntries(['instruction_clarity','context_sufficiency','grounding_constraints','uncertainty_handling','output_contract','tool_guidance','conflict_risk','context_efficiency'].map(k=>[k,80])); assert.equal(weightedScore(scores),80); });
