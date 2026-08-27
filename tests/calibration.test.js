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
