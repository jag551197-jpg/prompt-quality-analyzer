import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { assessExecutionReadiness } from '../src/core/execution-readiness.js';

const req=`<<<PQA_SOURCE id="DOC1" name="requirements.md">>>
# Requisitos
## Objetivo
Implementar relatório de estoque.
## Regras de negócio
Saldo Final = Saldo Inicial + Entradas - Saídas.
## Cenários de teste
Testar limites e transições.
<<<END_PQA_SOURCE>>>`;

test('requirements file is not mistaken for executable code',()=>{
 const a=assessExecutionReadiness({prompt:'Execute o código no arquivo MD anexado e implemente a solução.',context:req,ui_language:'pt'});
 assert.equal(a.has_requirements,true);assert.equal(a.has_code,false);
 assert.equal(a.status,'requirements_ready_codebase_missing');
 assert.ok(a.scores.implementation_context_sufficiency<50);
 assert.match(a.recommended_prompt,/Não há código\/repositório disponível/);
 assert.ok(a.generated_outputs.some(x=>x.filename==='IMPROVED_REQUIREMENTS.md'));
 assert.match(a.generated_outputs.find(x=>x.filename==='IMPROVED_REQUIREMENTS.md').content,/Saldo Final/);
});

test('supplied code prevents false missing-code conclusion',()=>{
 const ctx=req+`\n<<<PQA_SOURCE id="DOC2" name="report.sql">>>\nSELECT * FROM cattle;\n-- implementation code here with enough content to classify as code\n<<<END_PQA_SOURCE>>>`;
 const a=assessExecutionReadiness({prompt:'Implement the requirements using the supplied code.',context:ctx});
 assert.equal(a.has_code,true);assert.equal(a.status,'ready');assert.ok(a.scores.implementation_context_sufficiency>=80);
});

test('community starts clean and supports removable multi-file context',()=>{
 const html=fs.readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
 const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
 assert.match(html,/id="communityFile"[^>]*multiple/);
 assert.match(html,/id="communityResultPanel"[^>]*is-hidden|class="surface result-panel is-hidden" id="communityResultPanel"/);
 assert.match(html,/id="efficiencyWallet" class="surface efficiency-wallet is-hidden"/);
 assert.match(html,/id="communityOverview" class="metric-grid is-hidden"/);
 assert.match(html,/id="communityTrendPanel" class="trend-panel surface is-hidden"/);
 assert.match(html,/id="communityImprovedPanel" class="surface improved-panel is-hidden"/);
 assert.match(html,/id="communityExecutionPanel" class="surface execution-panel is-hidden"/);
 assert.match(html,/id="communityAuditGrid" class="audit-grid is-hidden"/);
 assert.doesNotMatch(html,/id="trendCount"[^>]*>0 analyses/);
 assert.match(app,/data-community-remove/);assert.match(app,/data-community-replace/);assert.match(app,/target>=0/);
});


test('repository URL is treated as an unverified pointer, not verified source code',()=>{
 const a=assessExecutionReadiness({prompt:'Implement from https://github.com/acme/cattle-app',context:req,ui_language:'en'});
 assert.equal(a.status,'repository_reference_requires_access');assert.equal(a.repository_contents_verified,false);
 assert.match(a.notice,/did not verify or retrieve/);assert.ok(a.access_requirements.length>0);
});

test('generated fallback artifacts follow selected language and preserve source requirements',()=>{
 const pt=assessExecutionReadiness({prompt:'Implemente os requisitos.',context:req,ui_language:'pt'});
 const fr=assessExecutionReadiness({prompt:'Implémentez les exigences.',context:req,ui_language:'fr'});
 assert.match(pt.generated_outputs.find(x=>x.filename==='README_EXECUTION.md').content,/Pacote de Execução PQA/);
 assert.match(fr.generated_outputs.find(x=>x.filename==='README_EXECUTION.md').content,/Dossier d’exécution PQA/);
 assert.match(pt.generated_outputs.find(x=>x.filename==='IMPROVED_REQUIREMENTS.md').content,/Saldo Final/);
});

test('artifact signing is authorized by generated-output manifest and secret stays off browser',()=>{
 const api=fs.readFileSync(new URL('../netlify/functions/api.mjs',import.meta.url),'utf8');
 const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
 assert.match(api,/route==='\/artifact-sign'/);assert.match(api,/artifactManifestReceipt/);assert.match(api,/verifyArtifactReceipt/);assert.match(api,/artifact_not_authorized/);assert.match(api,/route==='\/artifact-verify'/);
 assert.doesNotMatch(app,/process\.env\.PQA_ARTIFACT_SIGNING_SECRET/);
});
