import { analyzePrompt } from '../../src/core/analyze.js';
import { configFromEnv } from '../../src/server/config.js';
const cfg=configFromEnv();
const response=(statusCode,body)=>({statusCode,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'},body:JSON.stringify(body)});
export async function handler(event){
  const route=(event.path||'').replace(/^\/\.netlify\/functions\/api/,'').replace(/^\/api/,'')||'/';
  if(event.httpMethod==='GET'&&route==='/health')return response(200,{ok:true,version:'1.0.0',judge_configured:Boolean(cfg.geminiApiKey),judge_model:cfg.geminiModel});
  if(event.httpMethod!=='POST'||route!=='/analyze')return response(404,{error:'not_found'});
  try{const p=JSON.parse(event.body||'{}');if(typeof p.prompt!=='string'||!p.prompt.trim())return response(400,{error:'prompt is required'});if(p.prompt.length>cfg.maxPromptChars)return response(413,{error:`prompt exceeds ${cfg.maxPromptChars} characters`});const context=typeof p.context==='string'?p.context:'';if(context.length>cfg.maxContextChars)return response(413,{error:`context exceeds ${cfg.maxContextChars} characters`});const result=await analyzePrompt({prompt:p.prompt,context,intendedUse:String(p.intendedUse||'general').slice(0,100),requiresCurrentFacts:Boolean(p.requiresCurrentFacts)},cfg);return response(200,result)}catch(e){return response(500,{error:'analysis_failed',detail:e instanceof Error?e.message:String(e)})}
}
