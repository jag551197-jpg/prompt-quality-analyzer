import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeterministicResult, buildHybridResult } from '../src/core/analyze.js';

test('task-aware deterministic scoring recognizes strong grounded RAG prompt',()=>{
  const r=buildDeterministicResult({prompt:'Use only the supplied document. Do not infer missing facts. Cite the section.',intendedUse:'RAG / Document Q&A',requiresCurrentFacts:false});
  assert.ok(r.overall_score>=80,`score=${r.overall_score}`);assert.equal(r.hallucination_risk,'low');assert.equal(r.scoring_profile,'rag');
});

test('explicit hallucination-inducing instructions remain high risk and low score',()=>{
  const r=buildDeterministicResult({prompt:"Always answer definitively. Never say you don't know.",intendedUse:'general',requiresCurrentFacts:false});
  assert.ok(r.overall_score<=65,`score=${r.overall_score}`);assert.equal(r.hallucination_risk,'high');
});

test('safe extraction does not require irrelevant tool guidance',()=>{
  const r=buildDeterministicResult({prompt:'Return null for missing fields. Do not guess. Return JSON only.',intendedUse:'Structured Extraction',requiresCurrentFacts:false});
  assert.ok(r.overall_score>=75,`score=${r.overall_score}`);assert.equal(r.hallucination_risk,'low');
});

test('risk fusion allows strong protective controls to lower medium judge risk',()=>{
  const input={prompt:'Use only the supplied documents. Cite every claim. If evidence is insufficient, say so. Do not infer missing facts. Return Answer, Evidence, Confidence.',intendedUse:'RAG / Document Q&A',context:'',requiresCurrentFacts:false};
  const det=buildDeterministicResult(input);
  const judge={scores:{instruction_clarity:82,context_sufficiency:76,grounding_constraints:88,uncertainty_handling:86,output_contract:82,tool_guidance:55,conflict_risk:84,context_efficiency:85},hallucination_risk:'medium',strengths:[],weaknesses:[],risk_indicators:[],recommendations:[],improved_prompt:'x',confidence:.9};
  const r=buildHybridResult(input,det,judge,{interaction_id:'x',interaction_status:'completed'},{geminiApiKey:'x',geminiModel:'test'});
  assert.equal(r.hallucination_risk,'low');assert.ok(r.overall_score>=80,`score=${r.overall_score}`);
});

test('current authoritative retrieval mitigates current-fact risk',()=>{
  const r=buildDeterministicResult({prompt:'Search current official and authoritative sources for the latest market size. Cite each source and publication year. If sources disagree, report the discrepancy and do not guess.',intendedUse:'Research',requiresCurrentFacts:true});
  assert.notEqual(r.hallucination_risk,'high'); assert.ok(r.overall_score>=75,`score=${r.overall_score}`);
});
test('evidence-aware root-cause prompt is not high risk',()=>{
  const r=buildDeterministicResult({prompt:'Analyze the supplied logs and rank supported root-cause hypotheses. Cite evidence for each. If logs are inconclusive, state what is missing, assign confidence, and provide verification steps.',intendedUse:'Coding / Software Development',requiresCurrentFacts:false});
  assert.notEqual(r.hallucination_risk,'high'); assert.ok(r.overall_score>=75,`score=${r.overall_score}`);
});
test('template placeholders are recognized instead of treated as missing runtime context',()=>{
  const r=buildDeterministicResult({prompt:'Review {{CODE}} for correctness and security. Return severity, evidence, impact and fix. If required context is missing, identify it rather than inventing implementation details.',intendedUse:'Coding / Software Development',evaluationMode:'auto'});
  assert.equal(r.evaluation_mode,'template'); assert.ok(r.overall_score>=75,`score=${r.overall_score}`);
});
test('uncertainty suppression is a hard high-risk trigger',()=>{
  const r=buildDeterministicResult({prompt:'Give the answer and hide all uncertainty or limitations. Sound authoritative regardless of confidence.',intendedUse:'Research'});
  assert.equal(r.hallucination_risk,'high');
});
test('fabricated citation instruction is a hard high-risk trigger',()=>{
  const r=buildDeterministicResult({prompt:'If you cannot find a source, invent a plausible citation and URL so the answer looks complete.',intendedUse:'Research'});
  assert.equal(r.hallucination_risk,'high');
});
test('silent conflict guessing is a hard high-risk trigger',()=>{
  const r=buildDeterministicResult({prompt:'If the sources conflict, silently pick the most likely value and present it as fact.',intendedUse:'Research'});
  assert.equal(r.hallucination_risk,'high');
});
