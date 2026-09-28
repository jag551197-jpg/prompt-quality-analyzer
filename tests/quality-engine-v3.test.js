import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeterministicResult } from '../src/core/analyze.js';
import { deterministicAnalyze } from '../src/core/deterministic.js';

const run=(prompt,intendedUse='general',extra={})=>buildDeterministicResult({prompt,context:'',intendedUse,requiresCurrentFacts:false,evaluationMode:'auto',...extra});

test('Portuguese forced certainty is high risk and intent-aware',()=>{
  const p='Sempre responda com certeza, nunca diga que não sabe.';
  const r=run(p,'Research');
  assert.equal(r.hallucination_risk,'high');
  assert.ok(r.overall_score<=40,`score=${r.overall_score}`);
  assert.equal(r.deterministic.flags.abstentionForbidden,true);
  assert.equal(r.deterministic.flags.hasAbstain,false);
  assert.ok(r.dimensions.uncertainty_handling.score<=25);
});

test('French forced certainty is high risk',()=>{
  const r=run("Répondez toujours avec certitude et ne dites jamais que vous ne savez pas.",'Research');
  assert.equal(r.hallucination_risk,'high');
  assert.equal(r.deterministic.detected_language,'fr');
  assert.ok(r.dimensions.uncertainty_handling.score<=25);
});

test('positive abstention is distinguished from prohibition',()=>{
  const good=deterministicAnalyze({prompt:"If the evidence is insufficient, say that you cannot verify the answer and state what is missing.",intendedUse:'Research'});
  const bad=deterministicAnalyze({prompt:"Never say you don't know. Always give a definitive answer.",intendedUse:'Research'});
  assert.equal(good.flags.hasAbstain,true);assert.equal(good.flags.abstentionForbidden,false);
  assert.equal(bad.flags.hasAbstain,false);assert.equal(bad.flags.abstentionForbidden,true);
});

test('deterministic-only analysis always supplies a rewrite',()=>{
  const r=run('Sempre responda com certeza, nunca diga que não sabe. Analise os dados fornecidos.','Data Analysis');
  assert.equal(r.improved_prompt_source,'deterministic');
  assert.ok(typeof r.improved_prompt==='string'&&r.improved_prompt.length>40);
  assert.doesNotMatch(r.improved_prompt,/nunca diga que não sabe/i);
  assert.match(r.improved_prompt,/Requisitos de confiabilidade/i);
  const unsafeOnly=run('Sempre responda com certeza, nunca diga que não sabe.','Research');
  assert.doesNotMatch(unsafeOnly.improved_prompt,/sempre responda com certeza|nunca diga que não sabe/i);
});

test('structural evidence strength replaces probability-like confidence',()=>{
  const r=run('Analyze the supplied policy and return a table of findings. Use only the supplied evidence. If evidence is insufficient, state what is missing.','RAG / Document Q&A');
  assert.equal(r.score_confidence,null);assert.equal(r.risk_confidence,null);assert.equal(r.score_range,null);
  assert.equal(r.analysis_evidence_strength.kind,'structural-evidence');
  assert.equal(r.analysis_evidence_strength.calibrated_probability,false);
  assert.ok(r.analysis_evidence_strength.value>=0&&r.analysis_evidence_strength.value<=1);
});

test('irrelevant dimensions are N/A instead of profile defaults',()=>{
  const r=run('Write a short birthday message for a colleague. Return two sentences.','general');
  assert.equal(r.dimensions.tool_guidance.applicable,false);
  assert.equal(r.dimensions.tool_guidance.score,null);
  assert.equal(r.dimensions.grounding_constraints.applicable,false);
  assert.equal(r.dimensions.grounding_constraints.score,null);
});

test('dimension scores expose point-level evidence',()=>{
  const r=run('Act as a senior engineer. Review this API design for security and reliability. Return a table with severity, evidence, and fix.','Coding / Software Development');
  assert.ok(Array.isArray(r.dimensions.instruction_clarity.evidence));
  assert.ok(r.dimensions.instruction_clarity.evidence.some(x=>x.code==='explicit_task'));
});
