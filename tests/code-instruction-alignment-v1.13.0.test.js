import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeCodeInstructionAlignment } from '../src/core/code-instruction-alignment.js';
import { assessExecutionReadiness } from '../src/core/execution-readiness.js';

const ctx=`<<<PQA_SOURCE id="DOC1" name="requirements.md">>>
# Requirements
The implementation must expose \`calculateBalance\` and preserve \`MAX_RETRIES\` = 3.
It must validate the request and include regression tests.
<<<END_PQA_SOURCE>>>
<<<PQA_SOURCE id="DOC2" name="service.js">>>
export const MAX_RETRIES = 5;
export function calculateBalance(initial, entries, exits){ return initial + entries - exits; }
// TODO: add request validation
<<<END_PQA_SOURCE>>>`;

test('code alignment compares instruction/requirements against supplied source',()=>{
 const a=analyzeCodeInstructionAlignment({prompt:'Implement the requirements in the supplied source code and add tests.',context:ctx,ui_language:'en'});
 assert.equal(a.verified,true);
 assert.ok(a.code_sources.some(x=>x.name==='service.js'));
 assert.ok(a.matched_identifiers.some(x=>x.identifier==='calculateBalance'));
 assert.ok(a.incomplete_markers.length>=1);
 assert.equal(a.test_evidence.required,true);
 assert.equal(a.test_evidence.present,false);
 assert.ok(a.numeric_mismatch_candidates.some(x=>x.identifier==='MAX_RETRIES'));
});

test('execution readiness incorporates code alignment and produces localized report',()=>{
 const a=assessExecutionReadiness({prompt:'Implemente os requisitos no código fornecido e adicione testes.',context:ctx,ui_language:'pt'});
 assert.equal(a.code_alignment.verified,true);
 assert.ok(Number.isFinite(a.code_alignment.score));
 assert.ok(a.generated_outputs.some(x=>x.filename==='RELATORIO_DE_ALINHAMENTO_CODIGO_INSTRUCAO.md'));
 assert.match(a.recommended_prompt,/ALINHAMENTO CÓDIGO × INSTRUÇÃO/);
});

test('no code never claims conformance verification',()=>{
 const a=analyzeCodeInstructionAlignment({prompt:'Implement these requirements.',context:'<<<PQA_SOURCE id="DOC1" name="requirements.md">>>\nThe system must validate requests.\n<<<END_PQA_SOURCE>>>',ui_language:'en'});
 assert.equal(a.verified,false);assert.equal(a.score,null);assert.match(a.findings[0].message,/cannot be verified/);
});
