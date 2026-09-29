import test from 'node:test';
import assert from 'node:assert/strict';
import { assessExecutionReadiness } from '../src/core/execution-readiness.js';

const context=`<<<PQA_SOURCE id="REQ" name="requirements.md">>>
# Requirements
The implementation must expose \`calculateBalance\`, preserve \`MAX_RETRIES\`, and validate \`requestToken\`.
Regression tests are required.
<<<END_PQA_SOURCE>>>
<<<PQA_SOURCE id="SRC" name="service.js">>>
export const MAX_RETRIES = 3;
export function calculateBalance(a,b,c){ return a+b-c; }
<<<END_PQA_SOURCE>>>
<<<PQA_SOURCE id="TEST" name="service.test.js">>>
import { calculateBalance } from './service.js';
// calculateBalance regression coverage
<<<END_PQA_SOURCE>>>`;

test('requirement coverage graph maps requirement to code, tests, runtime and gaps',()=>{
  const a=assessExecutionReadiness({prompt:'Implement the supplied requirements and verify with tests.',context,ui_language:'en'});
  const g=a.requirement_coverage_graph;
  assert.equal(g.available,true);
  assert.ok(g.metrics.requirements>=3);
  assert.ok(g.metrics.code_covered>=2);
  assert.ok(g.metrics.test_covered>=1);
  assert.ok(g.metrics.gaps>=1);
  assert.equal(g.metrics.runtime_verified,0);
  assert.ok(g.nodes.some(n=>n.type==='requirement'));
  assert.ok(g.nodes.some(n=>n.type==='code'));
  assert.ok(g.nodes.some(n=>n.type==='test'));
  assert.ok(g.edges.some(e=>e.type==='implementation'));
  assert.ok(a.generated_outputs.some(x=>x.filename==='REQUIREMENT_COVERAGE_GRAPH.md'));
});

test('coverage graph output filename follows Portuguese interface language',()=>{
  const a=assessExecutionReadiness({prompt:'Implemente os requisitos fornecidos e valide com testes.',context,ui_language:'pt-BR'});
  assert.ok(a.generated_outputs.some(x=>x.filename==='GRAFO_DE_COBERTURA_DE_REQUISITOS.md'));
  const artifact=a.generated_outputs.find(x=>x.filename==='GRAFO_DE_COBERTURA_DE_REQUISITOS.md');
  assert.match(artifact.content,/Grafo de Cobertura de Requisitos/);
  assert.match(artifact.content,/Matriz de evidências/);
});
