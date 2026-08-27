import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { configFromEnv } from './config.js';
import { buildDeterministicResult, buildHybridResult } from '../core/analyze.js';
import { submitGeminiJudge, getGeminiJudgeStatus, testGeminiConnection } from '../providers/gemini.js';
import { getLogs, logEvent } from './log-store.js';
import { validateBenchmarkSuite, createBenchmarkRun, finalizeBenchmarkCase, summarizeBenchmark } from '../core/benchmark.js';
import { requireBearer } from './auth.js';

try{const text=fs.readFileSync('.env','utf8');for(const line of text.split(/\r?\n/)){const m=line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);if(m&&process.env[m[1]]===undefined)process.env[m[1]]=m[2].replace(/^['"]|['"]$/g,'');}}catch{}
const cfg=configFromEnv();
const publicDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../public');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function json(res,status,payload){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(payload));}
async function readBody(req){let size=0,chunks=[];for await(const c of req){size+=c.length;if(size>524288)throw Object.assign(new Error('request too large'),{status:413});chunks.push(c);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}');}catch{throw Object.assign(new Error('invalid JSON body'),{status:400});}}
function validate(payload){const{prompt,context='',intendedUse='general',requiresCurrentFacts=false}=payload||{};if(typeof prompt!=='string'||!prompt.trim())throw Object.assign(new Error('prompt is required'),{status:400});if(prompt.length>cfg.maxPromptChars)throw Object.assign(new Error(`prompt exceeds ${cfg.maxPromptChars} characters`),{status:413});if(typeof context!=='string'||context.length>cfg.maxContextChars)throw Object.assign(new Error(`context exceeds ${cfg.maxContextChars} characters`),{status:413});return{prompt,context,intendedUse:String(intendedUse).slice(0,100),requiresCurrentFacts:Boolean(requiresCurrentFacts)};}
function requestIdFor(req){const v=String(req.headers['x-pqa-transaction-id']||'');return /^[0-9a-f-]{36}$/i.test(v)?v:randomUUID();}

const server=http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://localhost'); const requestId=requestIdFor(req);
  if(req.method==='GET'&&url.pathname==='/api/health')return json(res,200,{ok:true,version:'1.4.1',architecture:'gemini-background-polling',judge_configured:Boolean(cfg.geminiApiKey),judge_model:cfg.geminiModel,api_token_configured:Boolean(cfg.pqaApiToken),analysis_protected:Boolean(cfg.protectAnalysis)});
  if(req.method==='GET'&&url.pathname==='/api/logs'){const auth=requireBearer(req.headers,cfg);if(!auth.ok)return json(res,auth.status,auth.body);return json(res,200,{logs:getLogs({limit:url.searchParams.get('limit'),requestId:url.searchParams.get('request_id')}),note:'In-process diagnostic log.'});}
  if(req.method==='POST'&&url.pathname==='/api/test-judge'){logEvent({level:'INFO',request_id:requestId,stage:'connection_test',message:'Testing Gemini background submit + polling'});const result=await testGeminiConnection({apiKey:cfg.geminiApiKey,model:cfg.geminiModel,timeoutMs:Math.min(cfg.timeoutMs||30000,12000)});return json(res,result.ok?200:503,{request_id:requestId,...result});}
  if(req.method==='POST'&&url.pathname==='/api/deterministic'){if(cfg.protectAnalysis){const auth=requireBearer(req.headers,cfg);if(!auth.ok)return json(res,auth.status,auth.body);}const input=validate(await readBody(req));logEvent({level:'INFO',request_id:requestId,stage:'deterministic',message:'Running deterministic prompt checks'});const result=buildDeterministicResult(input);logEvent({level:'INFO',request_id:requestId,stage:'deterministic_complete',message:'Deterministic analysis complete',elapsed_ms:result.timing.total_ms});return json(res,200,{request_id:requestId,...result});}
  if(req.method==='POST'&&url.pathname==='/api/judge-submit'){
    if(cfg.protectAnalysis){const auth=requireBearer(req.headers,cfg);if(!auth.ok)return json(res,auth.status,auth.body);}
    const input=validate(await readBody(req)); const deterministic=buildDeterministicResult(input);
    logEvent({level:'INFO',request_id:requestId,stage:'judge_submit',message:`Submitting Gemini background interaction (${cfg.geminiModel})`});
    const sub=await submitGeminiJudge({...input,staticAnalysis:deterministic.deterministic},{apiKey:cfg.geminiApiKey,model:cfg.geminiModel,rubricVersion:deterministic.rubric_version,timeoutMs:Math.min(cfg.timeoutMs||30000,10000)});
    logEvent({level:'INFO',request_id:requestId,stage:'judge_submitted',message:`Gemini interaction ${sub.interaction_id} accepted with status ${sub.status}`,elapsed_ms:sub.duration_ms});
    return json(res,202,{request_id:requestId,...sub});
  }
  if(req.method==='GET'&&url.pathname==='/api/judge-status'){
    if(cfg.protectAnalysis){const auth=requireBearer(req.headers,cfg);if(!auth.ok)return json(res,auth.status,auth.body);}
    const interactionId=url.searchParams.get('interaction_id'); if(!interactionId)return json(res,400,{error:'interaction_id_required'});
    const st=await getGeminiJudgeStatus(interactionId,{apiKey:cfg.geminiApiKey,timeoutMs:Math.min(cfg.timeoutMs||30000,10000)});
    logEvent({level:st.error?'WARN':'INFO',request_id:requestId,stage:'judge_poll',message:`Gemini interaction status: ${st.status}`,interaction_id:interactionId});
    return json(res,200,{request_id:requestId,...st});
  }

  if(req.method==='POST'&&url.pathname==='/api/benchmark-submit'){
    const auth=requireBearer(req.headers,cfg);if(!auth.ok)return json(res,auth.status,auth.body);
    const suite=validateBenchmarkSuite(await readBody(req),{maxCases:25,maxPromptChars:cfg.maxPromptChars,maxContextChars:cfg.maxContextChars});
    const run=createBenchmarkRun(suite);
    logEvent({level:'INFO',request_id:requestId,stage:'benchmark_submit',message:`Submitting benchmark ${run.benchmark_id} with ${run.cases.length} cases`});
    const queue=[...run.cases];
    const workers=Array.from({length:Math.min(suite.concurrency,queue.length)},async()=>{
      while(queue.length){
        const c=queue.shift();
        try{
          if(!cfg.geminiApiKey){c.judge_status='not-configured';continue;}
          const sub=await submitGeminiJudge({...c.payload,staticAnalysis:c.deterministic_result.deterministic},{apiKey:cfg.geminiApiKey,model:cfg.geminiModel,rubricVersion:c.deterministic_result.rubric_version,timeoutMs:Math.min(cfg.timeoutMs||30000,10000)});
          c.interaction_id=sub.interaction_id;c.judge_status=sub.status;c.submit_meta={duration_ms:sub.duration_ms,http_status:sub.http_status,model:sub.model};
        }catch(e){c.judge_status='submit-failed';c.submit_error={category:e.category||'judge_unavailable',message:e.message,http_status:e.status||null};}
      }
    });
    await Promise.all(workers);
    run.cases=run.cases.map(c=>(c.judge_status==='not-configured'||c.judge_status==='submit-failed')?finalizeBenchmarkCase(c,{status:c.judge_status,error:c.submit_error||null},cfg):c);
    const summary=summarizeBenchmark(run);
    return json(res,202,{request_id:requestId,...run,summary,next:'POST /api/benchmark-status with this manifest'});
  }
  if(req.method==='POST'&&url.pathname==='/api/benchmark-status'){
    const auth=requireBearer(req.headers,cfg);if(!auth.ok)return json(res,auth.status,auth.body);
    const body=await readBody(req); if(!body?.benchmark_id||!Array.isArray(body?.cases))return json(res,400,{error:'benchmark_manifest_required'});
    const run={...body,cases:body.cases.map(c=>({...c}))};
    const queue=run.cases.filter(c=>c.interaction_id&&!c.final_result&&!['failed','cancelled','incomplete','budget_exceeded','submit-failed','not-configured'].includes(c.judge_status));
    const workers=Array.from({length:Math.min(8,Math.max(1,queue.length))},async()=>{while(queue.length){const c=queue.shift();try{const st=await getGeminiJudgeStatus(c.interaction_id,{apiKey:cfg.geminiApiKey,timeoutMs:10000});c.judge_status=st.status;c.last_poll={http_status:st.http_status,duration_ms:st.duration_ms,updated:st.updated};if(st.terminal)c.__judge_status=st;}catch(e){c.last_poll_error={category:e.category||'judge_unavailable',message:e.message,http_status:e.status||null};}}});
    await Promise.all(workers);
    run.cases=run.cases.map(c=>c.__judge_status?finalizeBenchmarkCase(c,c.__judge_status,cfg):(c.judge_status==='not-configured'||c.judge_status==='submit-failed'?finalizeBenchmarkCase(c,{status:c.judge_status,error:c.submit_error||null},cfg):c));
    for(const c of run.cases)delete c.__judge_status;
    run.updated_at=new Date().toISOString();run.summary=summarizeBenchmark(run);
    return json(res,200,{request_id:requestId,...run});
  }
  if(req.method==='POST'&&url.pathname==='/api/finalize'){
    if(cfg.protectAnalysis){const auth=requireBearer(req.headers,cfg);if(!auth.ok)return json(res,auth.status,auth.body);}
    const body=await readBody(req); const input=validate(body.payload); const det=body.deterministic_result || buildDeterministicResult(input);
    const result=buildHybridResult(input,det,body.judge_result||null,body.judge_meta||{},cfg);
    logEvent({level:'INFO',request_id:requestId,stage:'complete',message:`Analysis complete: ${result.overall_score}/100`});
    return json(res,200,{request_id:requestId,...result});
  }
  if(url.pathname.startsWith('/api/'))return json(res,404,{error:'not_found'});
  let rel=url.pathname==='/'?'index.html':url.pathname.slice(1);let target=path.resolve(publicDir,rel);if(!target.startsWith(publicDir))return json(res,403,{error:'forbidden'});if(!fs.existsSync(target)||fs.statSync(target).isDirectory())target=path.join(publicDir,'index.html');res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});fs.createReadStream(target).pipe(res);
}catch(e){json(res,e.status||500,{error:e.status?'bad_request':'analysis_failed',category:e.category||null,detail:e.message});}});
server.listen(cfg.port,'0.0.0.0',()=>console.log(`Prompt Quality Analyzer v1.4.1 listening on http://0.0.0.0:${cfg.port} (${cfg.geminiApiKey?'Gemini background judge enabled':'deterministic-only'})`));
