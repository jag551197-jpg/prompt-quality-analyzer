import { performance } from 'node:perf_hooks';
import { validateJudgeResult, judgeJsonSchema } from '../core/schema.js';

const BASE='https://generativelanguage.googleapis.com/v1beta/interactions';

export function buildJudgeInput({ prompt, context, intendedUse, requiresCurrentFacts, staticAnalysis, rubricVersion }) {
  return `You are a rigorous prompt-quality evaluator for software developers.\n\nEvaluate the PROMPT itself, not whether you personally can answer it. Be conservative and explainable. Scores are 0-100 where 100 is excellent. "conflict_risk" is scored positively: 100 means the prompt handles ambiguity/conflicts well and has low conflict risk. "context_efficiency" is also positive: 100 means concise, relevant, non-duplicative context.\n\nHallucination risk means prompt-level risk indicators only; do not claim certainty that a future model will hallucinate. Improve the prompt while preserving user intent. Do not add facts not supplied by the user.\n\nRubric version: ${rubricVersion}\nIntended use: ${intendedUse}\nRequires current facts: ${Boolean(requiresCurrentFacts)}\n\nDETERMINISTIC FINDINGS:\n${JSON.stringify(staticAnalysis)}\n\nPROMPT:\n---\n${prompt}\n---\n\nOPTIONAL CONTEXT:\n---\n${context || '(none)'}\n---`;
}

function providerError(message,{status=null,category='judge_unavailable'}={}){const e=new Error(message);e.status=status;e.category=category;return e;}
function categoryForStatus(status){if(status===401||status===403)return'authentication_failed';if(status===404)return'interaction_not_found';if(status===429)return'rate_limited';if(status>=500)return'provider_error';return'request_rejected';}
async function fetchJson(url,{apiKey,method='GET',body,timeoutMs=12000}={}){
  const c=new AbortController(); const timer=setTimeout(()=>c.abort(),timeoutMs);
  try{
    let r;
    try{r=await fetch(url,{method,headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},body:body?JSON.stringify(body):undefined,signal:c.signal});}
    catch(e){if(e?.name==='AbortError')throw providerError('Gemini request timed out',{category:'timeout'});throw providerError('Gemini network request failed',{category:'network_error'});}
    if(!r.ok){await r.text().catch(()=> '');throw providerError(`Gemini request failed with HTTP ${r.status}`,{status:r.status,category:categoryForStatus(r.status)});}
    return {data:await r.json(),status:r.status};
  }finally{clearTimeout(timer);}
}
function rawOutput(data){return data.output_text ?? data.outputs?.at?.(-1)?.text ?? data.steps?.filter?.(s=>s.type==='model_output')?.at?.(-1)?.content?.find?.(c=>c.type==='text')?.text ?? null;}
function parseCompleted(data){
  const raw=rawOutput(data); if(!raw)throw providerError('Completed Gemini interaction did not contain structured output',{category:'invalid_response'});
  let parsed; try{parsed=JSON.parse(raw);}catch{throw providerError('Gemini returned invalid JSON',{category:'invalid_json'});}
  try{return validateJudgeResult(parsed);}catch{throw providerError('Gemini response failed schema validation',{category:'schema_validation_failed'});}
}

/** Submit true Gemini background work. Returns quickly with an interaction id. */
export async function submitGeminiJudge(input,{apiKey,model,rubricVersion,timeoutMs=12000}={}){
  if(!apiKey) return {interaction_id:null,status:'not-configured',http_status:null};
  const start=performance.now();
  const {data,status}=await fetchJson(BASE,{apiKey,method:'POST',timeoutMs,body:{
    model,store:true,background:true,steps_enabled:true,
    input:[{type:'user_input',content:[{type:'text',text:buildJudgeInput({...input,rubricVersion})}]}],
    response_format:{type:'text',mime_type:'application/json',schema:judgeJsonSchema}
  }});
  if(!data?.id) throw providerError('Gemini did not return an interaction id',{status,category:'invalid_response'});
  return {interaction_id:data.id,status:data.status||'queued',http_status:status,duration_ms:Math.round(performance.now()-start),model:data.model||model};
}

/** Poll a stored Gemini interaction. No model generation is performed by this call. */
export async function getGeminiJudgeStatus(interactionId,{apiKey,timeoutMs=10000}={}){
  if(!apiKey) throw providerError('Gemini API key is not configured',{category:'missing_api_key'});
  if(!interactionId) throw providerError('interaction id is required',{category:'invalid_interaction_id'});
  const start=performance.now();
  const {data,status}=await fetchJson(`${BASE}/${encodeURIComponent(interactionId)}`,{apiKey,timeoutMs});
  const state=data?.status||'unknown';
  const terminal=['completed','failed','cancelled','incomplete','budget_exceeded'].includes(state);
  let result=null, error=null;
  if(state==='completed') result=parseCompleted(data);
  else if(terminal) error={category:`interaction_${state}`,message:`Gemini interaction finished with status ${state}`};
  return {interaction_id:interactionId,status:state,terminal,result,error,http_status:status,duration_ms:Math.round(performance.now()-start),usage:data?.usage||null,updated:data?.updated||null};
}

/** Connectivity test uses background submit + bounded polling, matching production. */
export async function testGeminiConnection({apiKey,model,timeoutMs=12000}={}){
  if(!apiKey)return{ok:false,status:'not-configured',category:'missing_api_key',model,duration_ms:0};
  const started=performance.now();
  try{
    const sub=await submitGeminiJudge({prompt:'Evaluate this simple prompt: Say hello.',context:'',intendedUse:'connection test',requiresCurrentFacts:false,staticAnalysis:{metrics:{},flags:{},issues:[],recommendations:[],risk_indicators:[],hallucination_risk:'low'}},{apiKey,model,rubricVersion:'connection-test',timeoutMs:Math.min(timeoutMs,8000)});
    const deadline=Date.now()+timeoutMs;
    let cur;
    while(Date.now()<deadline){cur=await getGeminiJudgeStatus(sub.interaction_id,{apiKey,timeoutMs:5000});if(cur.terminal)break;await new Promise(r=>setTimeout(r,750));}
    if(cur?.status==='completed')return{ok:true,status:'completed',category:null,model,duration_ms:Math.round(performance.now()-started),interaction_id:sub.interaction_id};
    return{ok:false,status:cur?.status||'in_progress',category:cur?.error?.category||'connection_test_timeout',model,duration_ms:Math.round(performance.now()-started),interaction_id:sub.interaction_id};
  }catch(e){return{ok:false,status:e?.status||null,category:e?.category||'judge_unavailable',model,duration_ms:Math.round(performance.now()-started)};}
}
