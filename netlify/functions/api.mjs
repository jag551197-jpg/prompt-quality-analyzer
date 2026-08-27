import { randomUUID } from 'node:crypto';
import { buildDeterministicResult, buildHybridResult } from '../../src/core/analyze.js';
import { submitGeminiJudge, getGeminiJudgeStatus, testGeminiConnection } from '../../src/providers/gemini.js';
import { configFromEnv } from '../../src/server/config.js';
import { getLogs, logEvent } from '../../src/server/log-store.js';
import { validateBenchmarkSuite, createBenchmarkRun, finalizeBenchmarkCase, summarizeBenchmark } from '../../src/core/benchmark.js';
const cfg=configFromEnv();
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
function routeFor(req){const u=new URL(req.url);return u.pathname.replace(/^\/\.netlify\/functions\/api/,'').replace(/^\/api/,'')||'/';}
function validatePayload(body){const{prompt,context='',intendedUse='general',requiresCurrentFacts=false}=body||{};if(typeof prompt!=='string'||!prompt.trim())return{error:json({error:'prompt is required'},400)};if(prompt.length>cfg.maxPromptChars)return{error:json({error:`prompt exceeds ${cfg.maxPromptChars} characters`},413)};if(typeof context!=='string'||context.length>cfg.maxContextChars)return{error:json({error:`context exceeds ${cfg.maxContextChars} characters`},413)};return{input:{prompt,context,intendedUse:String(intendedUse).slice(0,100),requiresCurrentFacts:Boolean(requiresCurrentFacts)}};}
function requestIdFor(req){const v=String(req.headers.get('x-pqa-transaction-id')||'');return /^[0-9a-f-]{36}$/i.test(v)?v:randomUUID();}
export default async(req)=>{try{
  const route=routeFor(req), requestId=requestIdFor(req), u=new URL(req.url);
  if(req.method==='GET'&&route==='/health')return json({ok:true,version:'1.4.0',architecture:'gemini-background-polling',judge_configured:Boolean(cfg.geminiApiKey),judge_model:cfg.geminiModel});
  if(req.method==='GET'&&route==='/logs')return json({logs:getLogs({limit:u.searchParams.get('limit'),requestId:u.searchParams.get('request_id')}),note:'Best-effort instance-local log; use Netlify function logs for authoritative production diagnostics.'});
  if(req.method==='POST'&&route==='/test-judge'){const result=await testGeminiConnection({apiKey:cfg.geminiApiKey,model:cfg.geminiModel,timeoutMs:Math.min(cfg.timeoutMs||30000,12000)});return json({request_id:requestId,...result},result.ok?200:503);}
  if(req.method==='POST'&&route==='/deterministic'){let body;try{body=await req.json();}catch{return json({error:'invalid_json'},400)}const c=validatePayload(body);if(c.error)return c.error;const result=buildDeterministicResult(c.input);return json({request_id:requestId,...result});}
  if(req.method==='POST'&&route==='/judge-submit'){let body;try{body=await req.json();}catch{return json({error:'invalid_json'},400)}const c=validatePayload(body);if(c.error)return c.error;const det=buildDeterministicResult(c.input);logEvent({level:'INFO',request_id:requestId,stage:'judge_submit',message:`Submitting Gemini background interaction (${cfg.geminiModel})`});const sub=await submitGeminiJudge({...c.input,staticAnalysis:det.deterministic},{apiKey:cfg.geminiApiKey,model:cfg.geminiModel,rubricVersion:det.rubric_version,timeoutMs:10000});return json({request_id:requestId,...sub},202);}
  if(req.method==='GET'&&route==='/judge-status'){const interactionId=u.searchParams.get('interaction_id');if(!interactionId)return json({error:'interaction_id_required'},400);const st=await getGeminiJudgeStatus(interactionId,{apiKey:cfg.geminiApiKey,timeoutMs:10000});return json({request_id:requestId,...st});}

  if(req.method==='POST'&&route==='/benchmark-submit'){
    let body;try{body=await req.json();}catch{return json({error:'invalid_json'},400)}
    let suite;try{suite=validateBenchmarkSuite(body,{maxCases:25,maxPromptChars:cfg.maxPromptChars,maxContextChars:cfg.maxContextChars});}catch(e){return json({error:'bad_request',detail:e.message},e.status||400)}
    const run=createBenchmarkRun(suite);const queue=[...run.cases];
    const workers=Array.from({length:Math.min(suite.concurrency,queue.length)},async()=>{while(queue.length){const c=queue.shift();try{if(!cfg.geminiApiKey){c.judge_status='not-configured';continue;}const sub=await submitGeminiJudge({...c.payload,staticAnalysis:c.deterministic_result.deterministic},{apiKey:cfg.geminiApiKey,model:cfg.geminiModel,rubricVersion:c.deterministic_result.rubric_version,timeoutMs:10000});c.interaction_id=sub.interaction_id;c.judge_status=sub.status;c.submit_meta={duration_ms:sub.duration_ms,http_status:sub.http_status,model:sub.model};}catch(e){c.judge_status='submit-failed';c.submit_error={category:e.category||'judge_unavailable',message:e.message,http_status:e.status||null};}}});
    await Promise.all(workers);run.cases=run.cases.map(c=>(c.judge_status==='not-configured'||c.judge_status==='submit-failed')?finalizeBenchmarkCase(c,{status:c.judge_status,error:c.submit_error||null},cfg):c);return json({request_id:requestId,...run,summary:summarizeBenchmark(run),next:'POST /api/benchmark-status with this manifest'},202);
  }
  if(req.method==='POST'&&route==='/benchmark-status'){
    let body;try{body=await req.json();}catch{return json({error:'invalid_json'},400)}if(!body?.benchmark_id||!Array.isArray(body?.cases))return json({error:'benchmark_manifest_required'},400);
    const run={...body,cases:body.cases.map(c=>({...c}))};const queue=run.cases.filter(c=>c.interaction_id&&!c.final_result&&!['failed','cancelled','incomplete','budget_exceeded','submit-failed','not-configured'].includes(c.judge_status));
    const workers=Array.from({length:Math.min(8,Math.max(1,queue.length))},async()=>{while(queue.length){const c=queue.shift();try{const st=await getGeminiJudgeStatus(c.interaction_id,{apiKey:cfg.geminiApiKey,timeoutMs:10000});c.judge_status=st.status;c.last_poll={http_status:st.http_status,duration_ms:st.duration_ms,updated:st.updated};if(st.terminal)c.__judge_status=st;}catch(e){c.last_poll_error={category:e.category||'judge_unavailable',message:e.message,http_status:e.status||null};}}});await Promise.all(workers);
    run.cases=run.cases.map(c=>c.__judge_status?finalizeBenchmarkCase(c,c.__judge_status,cfg):(c.judge_status==='not-configured'||c.judge_status==='submit-failed'?finalizeBenchmarkCase(c,{status:c.judge_status,error:c.submit_error||null},cfg):c));for(const c of run.cases)delete c.__judge_status;run.updated_at=new Date().toISOString();run.summary=summarizeBenchmark(run);return json({request_id:requestId,...run});
  }
  if(req.method==='POST'&&route==='/finalize'){let body;try{body=await req.json();}catch{return json({error:'invalid_json'},400)}const c=validatePayload(body.payload);if(c.error)return c.error;const det=body.deterministic_result||buildDeterministicResult(c.input);const result=buildHybridResult(c.input,det,body.judge_result||null,body.judge_meta||{},cfg);return json({request_id:requestId,...result});}
  return json({error:'not_found'},404);
}catch(e){return json({error:'analysis_failed',category:e.category||null,detail:e.message},e.status||500);}};
