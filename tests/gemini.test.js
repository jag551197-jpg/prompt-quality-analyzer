import test from 'node:test';
import assert from 'node:assert/strict';
import { submitGeminiJudge, getGeminiJudgeStatus, testGeminiConnection } from '../src/providers/gemini.js';

const validJudge={scores:{instruction_clarity:90,context_sufficiency:80,grounding_constraints:70,uncertainty_handling:75,output_contract:85,tool_guidance:70,conflict_risk:90,context_efficiency:88},hallucination_risk:'low',strengths:['clear'],weaknesses:[],risk_indicators:[],recommendations:['keep it clear'],improved_prompt:'Improved prompt',confidence:.9};
const input={prompt:'x',context:'',intendedUse:'general',requiresCurrentFacts:false,staticAnalysis:{metrics:{},flags:{},issues:[],recommendations:[],risk_indicators:[],hallucination_risk:'low'}};

test('background submit sends background and returns interaction id',async()=>{const old=globalThis.fetch;let body;globalThis.fetch=async(_u,o)=>{body=JSON.parse(o.body);return new Response(JSON.stringify({id:'int_1',status:'queued',model:'test'}),{status:200});};try{const out=await submitGeminiJudge(input,{apiKey:'ok',model:'test',rubricVersion:'1'});assert.equal(out.interaction_id,'int_1');assert.equal(body.background,true);assert.equal(body.store,true);}finally{globalThis.fetch=old;}});

test('poll parses completed structured output',async()=>{const old=globalThis.fetch;globalThis.fetch=async()=>new Response(JSON.stringify({id:'int_1',status:'completed',steps:[{type:'model_output',content:[{type:'text',text:JSON.stringify(validJudge)}]}]}),{status:200});try{const out=await getGeminiJudgeStatus('int_1',{apiKey:'ok'});assert.equal(out.status,'completed');assert.equal(out.result.confidence,.9);}finally{globalThis.fetch=old;}});

test('invalid key is categorized',async()=>{const old=globalThis.fetch;globalThis.fetch=async()=>new Response('secret',{status:401});try{await assert.rejects(()=>submitGeminiJudge(input,{apiKey:'bad',model:'test',rubricVersion:'1'}),e=>e.category==='authentication_failed'&&e.status===401&&!e.message.includes('secret'));}finally{globalThis.fetch=old;}});

test('connection test uses submit and poll',async()=>{const old=globalThis.fetch;let n=0;globalThis.fetch=async(url,o)=>{if(o?.method==='POST')return new Response(JSON.stringify({id:'int_1',status:'queued',model:'test'}),{status:200});n++;return new Response(JSON.stringify({id:'int_1',status:n>1?'completed':'in_progress',steps:n>1?[{type:'model_output',content:[{type:'text',text:JSON.stringify(validJudge)}]}]:[]}),{status:200});};try{const out=await testGeminiConnection({apiKey:'ok',model:'test',timeoutMs:4000});assert.equal(out.ok,true);}finally{globalThis.fetch=old;}});
