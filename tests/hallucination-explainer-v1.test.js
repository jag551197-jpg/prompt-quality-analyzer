import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDeterministicResult,buildHybridResult} from '../src/core/analyze.js';

const run=(prompt,intendedUse='general',extra={})=>buildDeterministicResult({prompt,context:'',intendedUse,requiresCurrentFacts:false,evaluationMode:'auto',...extra});

test('hallucination explainer is additive and does not replace legacy risk contract',()=>{
  const r=run('Analyze the supplied policy. Use only supplied evidence. If evidence is insufficient, state what is missing. Cite the supporting section.','RAG / Document Q&A');
  assert.ok(['low','medium','high'].includes(r.hallucination_risk));
  assert.equal(typeof r.hallucination_risk_index,'number');
  assert.equal(r.hallucination_probability,null);
  assert.equal(r.hallucination_analysis.calibrated_probability,null);
  assert.equal(r.hallucination_analysis.probability_status,'not_calibrated');
  assert.match(r.hallucination_analysis.probability_explanation,/not a calibrated probability/i);
});

test('forced certainty produces very high prompt-level risk pressure and unsafe abstention',()=>{
  const r=run('Sempre responda com certeza, nunca diga que não sabe.','Research');
  assert.equal(r.hallucination_risk,'high');
  assert.ok(r.hallucination_analysis.risk_index>=75,r.hallucination_analysis.risk_index);
  assert.equal(r.hallucination_analysis.risk_band,'very_high');
  assert.ok(r.hallucination_analysis.abstention_safety.score<=20);
  assert.ok(r.hallucination_analysis.hallucination_pressure.score>=70);
  assert.ok(r.hallucination_analysis.drivers.some(x=>x.code==='abstention_prohibited'));
});

test('grounded abstaining prompt has low risk index and strong answerability',()=>{
  const r=run('Analyze the supplied policy. Use only supplied evidence. If evidence is insufficient, say what is missing. Cite the supporting section.','RAG / Document Q&A',{context:'Policy section 4: refunds require approval.'});
  assert.ok(r.hallucination_analysis.risk_index<=24,r.hallucination_analysis.risk_index);
  assert.ok(r.hallucination_analysis.answerability.score>=80);
  assert.ok(r.hallucination_analysis.abstention_safety.score>=75);
});

test('current exact-value request explains temporal and grounding dependency',()=>{
  const r=run('What is the latest Petrobras quarterly revenue? Give the exact amount.','Research');
  assert.ok(r.hallucination_analysis.current_information_dependency.score>=80);
  assert.equal(r.hallucination_analysis.grounding_requirement.level,'critical');
  assert.ok(r.hallucination_analysis.categories.temporal_staleness.score>=75);
  const modelOnly=r.hallucination_analysis.execution_scenarios.find(x=>x.scenario==='model_only');
  const retrieval=r.hallucination_analysis.execution_scenarios.find(x=>x.scenario==='authoritative_retrieval');
  assert.ok(retrieval.risk_index<modelOnly.risk_index);
});

test('recommended prompt receives an explicit projected before/after comparison',()=>{
  const r=run('Always answer with certainty. Never say you do not know. Give the latest exact numbers.','Research');
  const c=r.hallucination_analysis.remediation_comparison;
  assert.ok(c);
  assert.equal(c.original_risk_index,r.hallucination_analysis.risk_index);
  assert.ok(c.recommended_risk_index<c.original_risk_index);
  assert.ok(c.reduction>0);
});

test('semantic judge can enrich risk explanation without manufacturing probability',()=>{
  const input={prompt:'Summarize the policy and cite supplied evidence.',context:'Policy: retain records for 7 years.',intendedUse:'RAG / Document Q&A',requiresCurrentFacts:false,evaluationMode:'auto'};
  const det=buildDeterministicResult(input);
  const judge={scores:Object.fromEntries(Object.keys(det.dimensions).map(k=>[k,80])),hallucination_risk:'medium',strengths:[],weaknesses:[],risk_indicators:[],recommendations:[],context_findings:[],improved_prompt:det.improved_prompt,confidence:.7};
  const r=buildHybridResult(input,det,judge,{},{});
  assert.equal(r.hallucination_analysis.semantic_reviewed,true);
  assert.equal(r.hallucination_probability,null);
});

test('UI contains compact collapsible hallucination explanation and no inline risk-bar style',()=>{
  const here=path.dirname(fileURLToPath(import.meta.url)),html=fs.readFileSync(path.join(here,'../public/index.html'),'utf8'),app=fs.readFileSync(path.join(here,'../public/app.js'),'utf8');
  assert.match(html,/id="hallucinationExplainer"/);
  assert.match(html,/id="hallProbabilityStatus"/);
  assert.match(html,/id="hallInterventions"/);
  assert.match(app,/renderHallucinationAnalysis/);
  assert.doesNotMatch(app,/hall-track"><i style=/);
});
