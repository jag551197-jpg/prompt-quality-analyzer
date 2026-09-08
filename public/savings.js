const MODEL_VERSION='PQA-SAVINGS-1.0';
const DEFAULT_PRICING={provider:'Google',model:'gemini-3.7-flash',input_per_million_usd:0.75,output_per_million_usd:3.75,effective_label:'Planning profile — configurable; verify provider pricing before financial reporting'};
const TASK_MULT={General:2.2,'RAG / Document Q&A':2.4,'Customer Support':1.8,'Coding / Software Development':3.2,Research:3.0,'Data Analysis':2.8,'Agent / Tool Use':2.6,'Structured Extraction':1.5};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const estimateTextTokens=text=>Math.max(1,Math.ceil(String(text||'').length/4));
export function loadPricing(){try{return {...DEFAULT_PRICING,...JSON.parse(localStorage.getItem('pqa_savings_pricing')||'{}')}}catch{return {...DEFAULT_PRICING}}}
export function savePricing(p){localStorage.setItem('pqa_savings_pricing',JSON.stringify({...DEFAULT_PRICING,...p}))}
function attempts(score,risk){
 const gap=(100-clamp(Number(score)||50,0,100))/100;
 const ra=String(risk||'').toLowerCase()==='high'?.65:String(risk||'').toLowerCase()==='medium'?.30:.08;
 return clamp(1+gap*.9+ra,1,2.75);
}
export function estimateSavings({prompt='',improvedPrompt='',score=50,risk='medium',intendedUse='General',reasonCodes=[],pricing=loadPricing(),correctionCycleMinutes=12,hourlyRateUsd=60}={}){
 const pTok=estimateTextTokens(prompt), iTok=estimateTextTokens(improvedPrompt||prompt);
 const mult=TASK_MULT[intendedUse]||TASK_MULT.General;
 const outputPerAttempt=Math.max(300,Math.round(Math.max(pTok,iTok)*mult));
 const beforeAttempts=attempts(score,risk);
 const lift=improvedPrompt?clamp(10+(reasonCodes?.length||0)*2,10,28):0;
 const projectedScore=clamp(Number(score||50)+lift,0,96);
 const projectedRisk=String(risk).toLowerCase()==='high'?(lift>=18?'medium':'high'):String(risk).toLowerCase()==='medium'?(lift>=14?'low':'medium'):'low';
 const afterAttempts=attempts(projectedScore,projectedRisk);
 const beforeInput=Math.round(pTok*beforeAttempts), afterInput=Math.round(iTok*afterAttempts);
 const beforeOutput=Math.round(outputPerAttempt*beforeAttempts), afterOutput=Math.round(outputPerAttempt*afterAttempts);
 const tokenSavings=Math.max(0,(beforeInput+beforeOutput)-(afterInput+afterOutput));
 const retrySavings=Math.max(0,beforeAttempts-afterAttempts);
 const inputSaved=Math.max(0,beforeInput-afterInput), outputSaved=Math.max(0,beforeOutput-afterOutput);
 const aiCostSaved=(inputSaved/1e6)*Number(pricing.input_per_million_usd||0)+(outputSaved/1e6)*Number(pricing.output_per_million_usd||0);
 const hoursSaved=retrySavings*(Number(correctionCycleMinutes||0)/60);
 const productivityValue=hoursSaved*Number(hourlyRateUsd||0);
 const confidence=reasonCodes?.length>=3?'medium':reasonCodes?.length>=1?'low-medium':'low';
 return {model_version:MODEL_VERSION,classification:'ESTIMATED',token_savings:Math.round(tokenSavings),input_tokens_saved:Math.round(inputSaved),output_tokens_saved:Math.round(outputSaved),retry_savings:Number(retrySavings.toFixed(2)),ai_cost_saved_usd:Number(aiCostSaved.toFixed(6)),hours_saved:Number(hoursSaved.toFixed(3)),productivity_value_usd:Number(productivityValue.toFixed(2)),total_estimated_value_usd:Number((aiCostSaved+productivityValue).toFixed(2)),before_attempts:Number(beforeAttempts.toFixed(2)),after_attempts:Number(afterAttempts.toFixed(2)),projected_score:Math.round(projectedScore),confidence,pricing:{...pricing},assumptions:{chars_per_token:4,task_output_multiplier:mult,correction_cycle_minutes:Number(correctionCycleMinutes),hourly_rate_usd:Number(hourlyRateUsd)},generated_at:new Date().toISOString()};
}
const KEY='pqa_efficiency_wallet_v1';
export function loadWallet(){try{return JSON.parse(localStorage.getItem(KEY)||'{"events":[]}')}catch{return {events:[]}}}
export function saveWallet(w){localStorage.setItem(KEY,JSON.stringify(w))}
export function recordSavings(id,meta,estimate){
 const w=loadWallet(); if(w.events.some(e=>e.id===id))return false;
 w.events.push({id,time:new Date().toISOString(),...meta,estimate}); if(w.events.length>1000)w.events=w.events.slice(-1000);saveWallet(w);return true;
}
export function resetWallet(){saveWallet({events:[]})}
export function walletSummary(period='all'){
 const w=loadWallet(),now=new Date(); let start=0;
 if(period==='today')start=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
 if(period==='month')start=new Date(now.getFullYear(),now.getMonth(),1).getTime();
 if(period==='30d')start=Date.now()-30*86400000;
 if(period==='7d')start=Date.now()-7*86400000;
 const events=w.events.filter(e=>new Date(e.time).getTime()>=start);
 const sum=k=>events.reduce((a,e)=>a+Number(e.estimate?.[k]||0),0);
 return {period,events,count:events.length,token_savings:Math.round(sum('token_savings')),retry_savings:Number(sum('retry_savings').toFixed(2)),ai_cost_saved_usd:Number(sum('ai_cost_saved_usd').toFixed(4)),hours_saved:Number(sum('hours_saved').toFixed(2)),productivity_value_usd:Number(sum('productivity_value_usd').toFixed(2)),total_estimated_value_usd:Number(sum('total_estimated_value_usd').toFixed(2))};
}
export function exportWallet(){return JSON.stringify({exported_at:new Date().toISOString(),model_version:MODEL_VERSION,wallet:loadWallet()},null,2)}
export {DEFAULT_PRICING,MODEL_VERSION};
