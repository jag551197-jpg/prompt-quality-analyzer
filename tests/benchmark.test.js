import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBenchmarkSuite, createBenchmarkRun, evaluateExpectations, finalizeBenchmarkCase, summarizeBenchmark } from '../src/core/benchmark.js';

test('benchmark suite validates and creates deterministic baselines',()=>{
  const suite=validateBenchmarkSuite({benchmark_name:'smoke',cases:[{id:'bad',prompt:'Tell me the latest tax rules. Always answer definitively.',requiresCurrentFacts:true,expected:{overall_max:80,hallucination_risk:'high'}}]});
  const run=createBenchmarkRun(suite);
  assert.equal(run.cases.length,1);
  assert.equal(run.cases[0].deterministic_result.mode,'deterministic-only');
  assert.equal(run.cases[0].case_id,'bad');
});

test('benchmark expectation checks work',()=>{
  const result={overall_score:90,hallucination_risk:'low',quality_level:'excellent',dimensions:{instruction_clarity:{score:92}}};
  const ev=evaluateExpectations(result,{overall_min:85,hallucination_risk:'low',dimensions_min:{instruction_clarity:90}});
  assert.equal(ev.passed,true);assert.equal(ev.check_count,3);
});

test('completed judge result finalizes and summarizes benchmark',()=>{
  const suite=validateBenchmarkSuite({cases:[{id:'x',prompt:'Summarize this code.',expected:{overall_min:70}}]});
  const run=createBenchmarkRun(suite);const c=run.cases[0];c.interaction_id='abc';
  const judge={status:'completed',interaction_id:'abc',duration_ms:5,result:{scores:{instruction_clarity:90,context_sufficiency:80,grounding_constraints:80,uncertainty_handling:80,output_contract:80,tool_guidance:80,conflict_risk:90,context_efficiency:90},hallucination_risk:'low',strengths:[],weaknesses:[],risk_indicators:[],recommendations:[],improved_prompt:'Better prompt',confidence:.9}};
  run.cases[0]=finalizeBenchmarkCase(c,judge,{geminiApiKey:'x',geminiModel:'test'});
  const sum=summarizeBenchmark(run);assert.equal(sum.completed_cases,1);assert.equal(sum.status,'completed');assert.equal(sum.expectation_passes,1);
});
