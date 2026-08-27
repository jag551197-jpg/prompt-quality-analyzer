import { performance } from 'node:perf_hooks';
import { deterministicAnalyze } from './deterministic.js';
import { DIMENSIONS, RUBRIC_VERSION, weightedScore, weightsFor, profileFor, qualityLevel } from './rubric.js';

const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));

export function heuristicScores(s) {
  const f=s.flags,m=s.metrics,profile=s.profile;
  const explicitTask=m.prompt_chars>=45;
  const detailed=m.prompt_chars>=120;
  const relevantGround=['rag','research','support'].includes(profile)||f.current;
  const relevantTools=profile==='agent'||f.current;
  const relevantFormat=['coding','rag','extraction','support','data','agent'].includes(profile);

  const clarity=explicitTask?(detailed?82:72):(m.prompt_chars>=25?58:38);
  let context=profile==='general'?70:64;
  if(m.context_chars>0)context=86;
  if(/\b(supplied|provided|attached|following|below)\b/i.test(String(s.raw_prompt||'')))context=Math.max(context,76);

  let grounding=relevantGround?(f.hasGround?92:42):78;
  if(!relevantGround&&f.hasGround)grounding=90;
  let uncertainty=['rag','research','support','agent','data'].includes(profile)?(f.hasAbstain?94:48):(f.hasAbstain?92:76);
  let output=relevantFormat?(f.hasFormat?90:54):(f.hasFormat?88:70);
  let tools=relevantTools?(f.hasTool?(f.boundedTool?94:76):52):(f.hasTool?(f.boundedTool?90:72):82);
  let conflict=f.forced||f.inferMissing||f.conflictBad||f.causalOverclaim?28:(f.conflictSafe||f.causalSafe?94:84);
  let efficiency=Math.max(42,Math.round(94-m.duplicate_ratio*120));

  if(f.nullMissing&&profile==='extraction'){uncertainty=Math.max(uncertainty,94);grounding=Math.max(grounding,90);}
  if(f.safeDestructive&&profile==='agent')conflict=Math.max(conflict,94);
  if(f.boundedTool&&profile==='agent')tools=Math.max(tools,95);
  if(f.causalSafe&&profile==='data')conflict=Math.max(conflict,95);
  if(f.current&&f.hasGround)grounding=Math.max(grounding,94);
  if(f.current&&f.hasTool)tools=Math.max(tools,92);
  return {instruction_clarity:clamp(clarity),context_sufficiency:clamp(context),grounding_constraints:clamp(grounding),uncertainty_handling:clamp(uncertainty),output_contract:clamp(output),tool_guidance:clamp(tools),conflict_risk:clamp(conflict),context_efficiency:clamp(efficiency)};
}

function nowMs(start){return Math.round(performance.now()-start);}
function dimensionsFrom(scores,intendedUse){const weights=weightsFor(intendedUse);return Object.fromEntries(Object.entries(DIMENSIONS).map(([key,cfg])=>[key,{label:cfg.label,weight:weights[key],score:Math.round(scores[key])}]));}
function staticStrengths(s){const map={grounding:'Explicit grounding/evidence boundary','abstention':'Explicit insufficient-evidence behavior','citations':'Evidence/citation requirement','output-contract':'Clear output contract','bounded-tools':'Bounded/reuse-aware tool guidance','null-on-missing':'Missing values handled without guessing','conflict-reporting':'Conflicts are surfaced rather than silently resolved','destructive-confirmation':'Destructive actions require confirmation','causal-discipline':'Correlation and causation are distinguished'};return (s.protective_controls||[]).map(k=>map[k]).filter(Boolean).slice(0,8);}
function calibratedOverall(base,s,{hybrid=false}={}){let n=base;const protections=(s.protective_controls||[]).length;const danger=Number(s.explicit_danger_count||0);if(protections===1)n+=5;else if(protections===2)n+=10;else if(protections>=3)n+=12;if(danger>0)n-=Math.min(34,22+Math.max(0,danger-1)*8);if(!hybrid&&(s.metrics?.prompt_chars||0)<25&&protections===0)n=Math.min(n,60);if(s.flags?.intentionalRepeat)n-=12;return clamp(n);}

export function buildDeterministicResult(input){
  const start=performance.now();const staticAnalysis=deterministicAnalyze(input);staticAnalysis.raw_prompt=input.prompt;
  const scores=heuristicScores(staticAnalysis);const overall=calibratedOverall(weightedScore(scores,staticAnalysis.profile),staticAnalysis);
  return {version:'1.5.0',rubric_version:RUBRIC_VERSION,scoring_profile:profileFor(input.intendedUse),mode:'deterministic-only',timing:{total_ms:nowMs(start),deterministic_ms:nowMs(start),gemini_ms:null},judge:{provider:null,model:null,status:'not-run',confidence:null,error:null,error_category:null,http_status:null,duration_ms:null},judge_response:null,overall_score:overall,quality_level:qualityLevel(overall),hallucination_risk:staticAnalysis.hallucination_risk,dimensions:dimensionsFrom(scores,input.intendedUse),strengths:staticStrengths(staticAnalysis),weaknesses:staticAnalysis.issues.slice(0,10),risk_indicators:staticAnalysis.risk_indicators.slice(0,10),recommendations:staticAnalysis.recommendations.slice(0,10),improved_prompt:null,deterministic:staticAnalysis,calibration:{rubric_version:RUBRIC_VERSION,profile:profileFor(input.intendedUse),risk_model:'tiered-v2'},disclaimer:'Hallucination risk identifies prompt-level risk factors; it does not predict with certainty whether a model will hallucinate.'};
}

function fuseRisk(staticAnalysis,judgeRisk){
  const explicit=Number(staticAnalysis?.explicit_danger_count||0);
  const contextual=Number(staticAnalysis?.contextual_risk_count||0);
  const protections=(staticAnalysis?.protective_controls||[]).length;
  if(explicit>0)return'high';
  if(judgeRisk==='high'&&contextual>=1)return'high';
  if(judgeRisk==='low'&&protections>=1)return'low';
  if(staticAnalysis?.hallucination_risk==='low'&&judgeRisk!=='high')return'low';
  if(judgeRisk==='medium'&&protections>=2&&contextual===0)return'low';
  return contextual>0||judgeRisk==='medium'||judgeRisk==='high'?'medium':'low';
}

function calibrateJudgeScores(judgeScores,detScores,intendedUse){
  const profile=profileFor(intendedUse);
  const out={};
  for(const key of Object.keys(DIMENSIONS)){
    const j=Number(judgeScores?.[key]);const d=Number(detScores?.[key]);
    if(Number.isFinite(j)&&Number.isFinite(d)) out[key]=clamp(j*.72+d*.28);
    else out[key]=clamp(Number.isFinite(j)?j:d);
  }
  // Context-aware floors prevent irrelevant dimensions from dominating the result.
  if(profile==='coding'){out.tool_guidance=Math.max(out.tool_guidance,72);out.grounding_constraints=Math.max(out.grounding_constraints,68);}
  if(profile==='extraction'){out.tool_guidance=Math.max(out.tool_guidance,78);}
  if(profile==='data'){out.tool_guidance=Math.max(out.tool_guidance,75);out.grounding_constraints=Math.max(out.grounding_constraints,70);}
  if(profile==='general'){out.tool_guidance=Math.max(out.tool_guidance,78);out.grounding_constraints=Math.max(out.grounding_constraints,72);}
  return out;
}

export function buildHybridResult(input,deterministicResult,judge,judgeMeta={},config={}){
  const staticAnalysis=deterministicResult?.deterministic??deterministicAnalyze(input);
  const detScores=Object.fromEntries(Object.entries(deterministicResult?.dimensions||{}).map(([k,v])=>[k,v.score]));
  const scores=judge?calibrateJudgeScores(judge.scores,detScores,input.intendedUse):(Object.keys(detScores).length?detScores:heuristicScores(staticAnalysis));
  const overall=calibratedOverall(weightedScore(scores,staticAnalysis.profile),staticAnalysis,{hybrid:Boolean(judge)});const hallucinationRisk=fuseRisk(staticAnalysis,judge?.hallucination_risk);
  const geminiMs=judgeMeta?.total_duration_ms??judgeMeta?.duration_ms??null;
  return {version:'1.5.0',rubric_version:RUBRIC_VERSION,scoring_profile:profileFor(input.intendedUse),mode:judge?'hybrid-gemini':'deterministic-only',timing:{total_ms:geminiMs??deterministicResult?.timing?.total_ms??null,deterministic_ms:deterministicResult?.timing?.deterministic_ms??null,gemini_ms:geminiMs},judge:{provider:config.geminiApiKey?'google-gemini':null,model:config.geminiApiKey?(config.geminiModel||'gemini-3.7-flash'):null,status:judge?'ok':(config.geminiApiKey?'fallback':'not-configured'),confidence:judge?.confidence??null,error:judgeMeta?.error?.message??null,error_category:judgeMeta?.error?.category??null,http_status:judgeMeta?.http_status??null,duration_ms:geminiMs,interaction_id:judgeMeta?.interaction_id??null,interaction_status:judgeMeta?.interaction_status??null,usage:judgeMeta?.usage??null},judge_response:judge?{scores:judge.scores,hallucination_risk:judge.hallucination_risk,strengths:judge.strengths,weaknesses:judge.weaknesses,risk_indicators:judge.risk_indicators,recommendations:judge.recommendations,improved_prompt:judge.improved_prompt,confidence:judge.confidence}:null,overall_score:overall,quality_level:qualityLevel(overall),hallucination_risk:hallucinationRisk,dimensions:dimensionsFrom(scores,input.intendedUse),strengths:[...new Set([...(judge?.strengths??[]),...staticStrengths(staticAnalysis)])].slice(0,10),weaknesses:[...new Set([...(judge?.weaknesses??[]),...staticAnalysis.issues])].slice(0,10),risk_indicators:[...new Set([...(judge?.risk_indicators??[]),...staticAnalysis.risk_indicators])].slice(0,10),recommendations:[...new Set([...(judge?.recommendations??[]),...staticAnalysis.recommendations])].slice(0,10),improved_prompt:judge?.improved_prompt||null,deterministic:staticAnalysis,calibration:{rubric_version:RUBRIC_VERSION,profile:profileFor(input.intendedUse),judge_blend:'72% semantic / 28% deterministic',risk_model:'tiered-v2'},disclaimer:'Hallucination risk identifies prompt-level risk factors; it does not predict with certainty whether a model will hallucinate.'};
}

export async function analyzePrompt(input,config={}){return buildDeterministicResult(input);}
