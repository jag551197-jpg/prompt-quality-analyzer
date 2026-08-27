import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBenchmarkSuite, createBenchmarkRun, finalizeBenchmarkCase, summarizeBenchmark, validateFinalResult } from '../src/core/benchmark.js';

test('benchmark preserves metadata and emits compatibility aliases',()=>{
  const suite=validateBenchmarkSuite({cases:[{id:'case-1',category:'Coding',tags:['x'],pair:'P1',prompt:'Review this code.',expected:{overall_min:1}}]});
  const run=createBenchmarkRun(suite);
  const c=run.cases[0];
  assert.equal(c.case_id,'case-1');
  assert.equal(c.id,'case-1');
  assert.equal(c.category,'Coding');
  assert.equal(c.prompt,'Review this code.');
  assert.equal(c.status,'deterministic-complete');
});

test('finalized case is analytically complete and runner-compatible',()=>{
  const suite=validateBenchmarkSuite({cases:[{id:'x',category:'RAG',prompt:'Use only the document.',expected:{overall_min:1}}]});
  const run=createBenchmarkRun(suite);
  const c=run.cases[0];
  const judge={status:'completed',interaction_id:'abc',result:{scores:{instruction_clarity:90,context_sufficiency:80,grounding_constraints:90,uncertainty_handling:90,output_contract:80,tool_guidance:80,conflict_risk:90,context_efficiency:90},hallucination_risk:'low',strengths:[],weaknesses:[],risk_indicators:[],recommendations:['x'],improved_prompt:'Better',confidence:.9}};
  const f=finalizeBenchmarkCase(c,judge,{geminiApiKey:'x',geminiModel:'test'});
  assert.equal(f.status,'completed');
  assert.equal(f.result_contract.valid,true);
  assert.equal(f.result,f.final_result);
  assert.equal(f.analysis,f.final_result);
  assert.equal(f.expectation.pass,true);
  assert.equal(f.expectations.passed,true);
  assert.ok(Number.isFinite(f.final_result.overall_score));
  assert.equal(validateFinalResult(f.final_result).valid,true);
  run.cases=[f];
  const sum=summarizeBenchmark(run);
  assert.equal(sum.completed_cases,1);
  assert.equal(sum.result_integrity_rate,100);
  assert.equal(sum.status,'completed');
});
