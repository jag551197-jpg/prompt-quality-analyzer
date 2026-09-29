import { performance } from 'node:perf_hooks';
import { deterministicAnalyze, deterministicRewrite } from './deterministic.js';
import { buildHallucinationAnalysis } from './hallucination-risk.js';
import { DIMENSIONS, RUBRIC_VERSION, weightedScore, weightsFor, profileFor, qualityLevel } from './rubric.js';
import { assessExecutionReadiness, applyExecutionContextScore, localizeGeneratedFilename } from './execution-readiness.js';

const ENGINE_VERSION='3.0.0';
const clamp=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
const REASON_LABELS={
  'forced-certainty':'FORCED_CERTAINTY','abstention-prohibited':'ABSTENTION_PROHIBITED','infer-missing':'UNSUPPORTED_INFERENCE','time-sensitive-without-grounding':'CURRENT_FACTS_UNGROUNDED',
  'unsafe-destructive-action':'UNSAFE_DESTRUCTIVE_ACTION','causal-overclaim':'CAUSAL_OVERCLAIM','conflict-resolution-by-guessing':'CONFLICT_GUESSING',
  'unbounded-tool-use':'UNBOUNDED_TOOL_USE','conflicting-constraints':'CONFLICTING_CONSTRAINTS','uncertainty-suppression':'UNCERTAINTY_SUPPRESSION',
  'citation-fabrication':'CITATION_FABRICATION','evaluator-manipulation':'EVALUATOR_MANIPULATION','system-prompt-extraction':'SYSTEM_PROMPT_EXTRACTION','role-override':'INSTRUCTION_HIERARCHY_ATTACK',
  'weak-grounding':'WEAK_GROUNDING','no-abstention':'NO_ABSTENTION','no-citations':'NO_CITATIONS','duplicate-context':'DUPLICATE_CONTEXT'
};
function reasonCodes(s){return [...new Set(s.risk_indicators||[])].map(x=>REASON_LABELS[x]||x.toUpperCase().replace(/-/g,'_'));}
function nowMs(start){return Math.round(performance.now()-start);}
function point(code,points,condition=true){return condition?{code,points}:null;}
function scoredDimension(applicable,base,parts=[]){
  if(!applicable)return {score:null,applicable:false,evidence:[]};
  const evidence=[{code:'base',points:base},...parts.filter(Boolean)];
  return {score:clamp(evidence.reduce((n,x)=>n+Number(x.points||0),0)),applicable:true,evidence};
}
export function dimensionAnalysis(s){
  const f=s.flags||{},m=s.metrics||{},q=s.quality_evidence||{},profile=s.profile||'general';
  const relevantGround=['rag','research','support'].includes(profile)||f.current;
  const relevantUncertainty=['rag','research','support','agent','data','extraction'].includes(profile);
  const relevantTools=profile==='agent'||f.current;
  const groundingApplicable=relevantGround||f.hasGround||f.hasCitation||f.fabricateCitation||f.inferMissing;
  const uncertaintyApplicable=relevantUncertainty||f.hasAbstain||f.forced||f.abstentionForbidden||f.uncertaintySuppression||f.inferMissing;
  const toolApplicable=relevantTools||f.hasTool||f.boundedTool||f.repeatedTool||f.endlessTool;
  const conflictApplicable=['rag','research','support','agent','data','extraction'].includes(profile)||f.forced||f.abstentionForbidden||f.inferMissing||f.conflictBad||f.conflictSafe||f.causalOverclaim||f.causalSafe||f.destructive||f.safeDestructive||f.uncertaintySuppression||f.impossibleConstraint;
  const shortPenalty=Number(q.word_count||0)<6&&!q.context&&!q.constraints&&!q.output;
  const longPromptPenalty=Math.max(0,Math.min(20,Math.round((Number(m.prompt_chars||0)-4000)/500)));
  const longContextPenalty=Math.max(0,Math.min(15,Math.round((Number(m.context_chars||0)-20000)/3000)));
  return {
    instruction_clarity:scoredDimension(true,12,[
      point('explicit_task',28,q.task),point('defined_subject',18,q.subject),point('constraints',12,q.constraints),point('success_criteria',12,q.success),point('audience_or_role',8,q.audience),point('output_signal',5,q.output),point('substantive_length',8,Number(m.prompt_chars||0)>=120),point('moderate_length',4,Number(m.prompt_chars||0)>=60&&Number(m.prompt_chars||0)<120),point('very_short_underspecified',-22,shortPenalty),point('conflicting_constraints',-18,f.impossibleConstraint)
    ]),
    context_sufficiency:scoredDimension(true,10,[
      point('context_signal',30,q.context),point('supplied_context',Math.min(20,Math.round(Number(m.context_chars||0)/500)),Number(m.context_chars||0)>0),point('constraints',18,q.constraints),point('audience_or_role',10,q.audience),point('success_criteria',10,q.success),point('template_contract',10,f.templateDetected),point('missing_core_context',-18,!q.context&&!q.constraints&&Number(m.prompt_chars||0)<90)
    ]),
    grounding_constraints:scoredDimension(groundingApplicable,15,[
      point('grounding_boundary',45,f.hasGround),point('citations',18,f.hasCitation),point('no_guessing',15,f.noGuess),point('current_retrieval',15,f.currentRetrieval),point('null_on_missing',10,f.nullMissing),point('unsupported_inference',-35,f.inferMissing),point('fabricated_citation',-55,f.fabricateCitation),point('current_without_grounding',-40,f.current&&!f.currentRetrieval&&!f.hasGround)
    ]),
    uncertainty_handling:scoredDimension(uncertaintyApplicable,15,[
      point('explicit_abstention',55,f.hasAbstain),point('no_guessing',15,f.noGuess),point('null_on_missing',10,f.nullMissing),point('conflict_reporting',10,f.conflictSafe),point('forced_certainty',-60,f.forced),point('abstention_prohibited',-65,f.abstentionForbidden),point('uncertainty_suppressed',-55,f.uncertaintySuppression),point('unsupported_inference',-20,f.inferMissing)
    ]),
    output_contract:scoredDimension(true,10,[
      point('explicit_format',55,f.hasFormat),point('success_criteria',15,q.success),point('constraints',10,q.constraints),point('citation_contract',5,f.hasCitation),point('very_short_no_contract',-10,Number(m.prompt_chars||0)<45&&!f.hasFormat)
    ]),
    tool_guidance:scoredDimension(toolApplicable,15,[
      point('tool_use_defined',30,f.hasTool),point('bounded_tool_use',40,f.boundedTool),point('current_retrieval',15,f.currentRetrieval),point('repeated_tool_calls',-45,f.repeatedTool),point('endless_tool_use',-55,f.endlessTool)
    ]),
    conflict_risk:scoredDimension(conflictApplicable,40,[
      point('conflict_reporting',30,f.conflictSafe),point('causal_discipline',25,f.causalSafe),point('destructive_confirmation',25,f.safeDestructive),point('no_guessing',10,f.noGuess),point('forced_certainty',-30,f.forced),point('abstention_prohibited',-35,f.abstentionForbidden),point('unsupported_inference',-30,f.inferMissing),point('conflict_guessing',-50,f.conflictBad),point('causal_overclaim',-40,f.causalOverclaim),point('unsafe_destructive',-40,f.destructive&&!f.safeDestructive),point('uncertainty_suppressed',-35,f.uncertaintySuppression),point('conflicting_constraints',-20,f.impossibleConstraint)
    ]),
    context_efficiency:scoredDimension(true,95,[
      point('duplicate_content',-Math.round(Number(m.duplicate_ratio||0)*140),Number(m.duplicate_ratio||0)>0),point('intentional_repetition',-30,f.intentionalRepeat),point('very_long_prompt',-longPromptPenalty,longPromptPenalty>0),point('very_long_context',-longContextPenalty,longContextPenalty>0),point('too_short_to_be_efficient',-35,Number(m.prompt_chars||0)<25&&!q.context)
    ])
  };
}
export function heuristicScores(s){const d=dimensionAnalysis(s);return Object.fromEntries(Object.entries(d).map(([k,v])=>[k,v.applicable?v.score:null]));}
function dimensionsFrom(details,intendedUse){
  const weights=weightsFor(intendedUse);
  return Object.fromEntries(Object.entries(DIMENSIONS).map(([key,cfg])=>{
    const d=details[key]||{score:null,applicable:false,evidence:[]};
    return [key,{label:cfg.label,weight:weights[key],score:d.score,applicable:d.applicable,evidence:d.evidence}];
  }));
}
function staticStrengths(s){
  const map={grounding:'Explicit grounding/evidence boundary',abstention:'Explicit insufficient-evidence behavior',citations:'Evidence/citation requirement','output-contract':'Clear output contract','bounded-tools':'Bounded/reuse-aware tool guidance','null-on-missing':'Missing values handled without guessing','conflict-reporting':'Conflicts are surfaced rather than silently resolved','destructive-confirmation':'Destructive actions require confirmation','causal-discipline':'Correlation and causation are distinguished','current-retrieval':'Current facts require active authoritative retrieval','template-contract':'Prompt is recognized as a reusable template','project-context':'Project documentation supplied as bounded evidence'};
  return (s.protective_controls||[]).map(k=>map[k]).filter(Boolean).slice(0,10);
}
function specificationCap(s){
  const q=s?.quality_evidence||{},chars=Number(s?.metrics?.prompt_chars||0),missing=Array.isArray(q.missing_core)?q.missing_core.length:0;
  if(chars<25&&Number(q.positive_count||0)<=2)return 25;
  if(chars<45&&!q.output&&!q.context&&!q.constraints)return 35;
  if(missing>=3)return 32;if(missing===2)return 55;if(missing===1)return 80;if(Number(q.positive_count||0)<=2)return 45;return 100;
}
function calibratedOverall(base,s){
  // Dimension evidence already contains the risk deductions. Do not subtract the
  // same defect a second time at the aggregate level (for example forced certainty
  // also manifests as abstention prohibition and uncertainty suppression).
  let n=base;const protections=(s.protective_controls||[]).length,danger=Number(s.explicit_danger_count||0);
  if(danger===0){if(protections===1)n+=4;else if(protections===2)n+=8;else if(protections>=3)n+=12;}
  // Explicit danger remains a hard risk classification and caps quality, but does
  // not create stacked deductions for semantically overlapping reason codes.
  if(danger>0)n=Math.min(n,55);
  n=Math.min(n,specificationCap(s));
  return clamp(n);
}
function evidenceStrengthFor(s,details,{semanticReviewed=false}={}){
  const applicable=Object.values(details).filter(d=>d.applicable),evidenceCount=applicable.reduce((n,d)=>n+d.evidence.filter(e=>e.code!=='base').length,0);
  const direct=(s.protective_controls?.length||0)+(s.risk_indicators?.length||0)+Number(s.quality_evidence?.positive_count||0);
  const coverage=Math.min(1,(evidenceCount+direct)/(Math.max(1,applicable.length)*5));
  const value=Math.max(.2,Math.min(.96,.22+coverage*.58+(semanticReviewed?.14:0)));
  return {value:Number(value.toFixed(2)),label:value>=.78?'strong':value>=.52?'moderate':'limited',kind:'structural-evidence',calibrated_probability:false,semantic_reviewed:Boolean(semanticReviewed),basis:'Observable prompt features and applicable scoring dimensions; not a probability that the score is correct.'};
}
function deprecation(){return {score_confidence:null,risk_confidence:null,score_range:null};}

export function buildDeterministicResult(input){
  const start=performance.now(),staticAnalysis=deterministicAnalyze(input);staticAnalysis.raw_prompt=input.prompt;
  const executionReadiness=assessExecutionReadiness(input);
  const detail=dimensionAnalysis(staticAnalysis),scores=Object.fromEntries(Object.entries(detail).map(([k,v])=>[k,v.applicable?v.score:null]));
  const overall=calibratedOverall(weightedScore(scores,staticAnalysis.profile),staticAnalysis),evidence=evidenceStrengthFor(staticAnalysis,detail);
  const fallbackImproved=deterministicRewrite(input,staticAnalysis);
  const improved=executionReadiness.recommended_prompt||fallbackImproved;
  const recommendedInput=improved?{...input,prompt:improved}:null,recommendedAnalysis=recommendedInput?deterministicAnalyze(recommendedInput):null;
  const hallucination=buildHallucinationAnalysis(input,staticAnalysis,{recommendedAnalysis,recommendedInput});
  return {version:ENGINE_VERSION,rubric_version:RUBRIC_VERSION,scoring_profile:profileFor(input.intendedUse),mode:'deterministic-only',timing:{total_ms:nowMs(start),deterministic_ms:nowMs(start),gemini_ms:null},judge:{provider:null,model:null,status:'not-run',confidence:null,error:null,error_category:null,http_status:null,duration_ms:null},judge_response:null,overall_score:overall,quality_level:qualityLevel(overall),hallucination_risk:staticAnalysis.hallucination_risk,hallucination_risk_index:hallucination.risk_index,hallucination_probability:null,hallucination_analysis:hallucination,...deprecation(),analysis_evidence_strength:evidence,evaluation_mode:staticAnalysis.evaluation_mode,reason_codes:reasonCodes(staticAnalysis),dimensions:applyExecutionContextScore(dimensionsFrom(detail,input.intendedUse),executionReadiness),execution_readiness:executionReadiness,expected_execution_improvements:executionReadiness.expected_improvements,generated_outputs:executionReadiness.generated_outputs||[],strengths:staticStrengths(staticAnalysis),weaknesses:staticAnalysis.issues.slice(0,12),risk_indicators:staticAnalysis.risk_indicators.slice(0,12),recommendations:staticAnalysis.recommendations.slice(0,12),improved_prompt:improved,improved_prompt_source:executionReadiness.recommended_prompt?'execution-readiness':'deterministic',deterministic:staticAnalysis,calibration:{rubric_version:RUBRIC_VERSION,profile:profileFor(input.intendedUse),risk_model:'multilingual-intent-aware-v5+hallucination-explainer-v1',dimension_model:'evidence-weighted-continuous-v1',confidence_model:'structural-evidence-not-probability'},disclaimer:'Hallucination risk and the 0–100 risk index are prompt-level engineering signals, not a calibrated probability that a response will hallucinate. Evidence strength reflects observable analysis coverage, not probability.'};
}

function fuseRisk(s,judgeRisk){
  const explicit=Number(s?.explicit_danger_count||0),contextual=Number(s?.contextual_risk_count||0),protections=(s?.protective_controls||[]).length;
  const currentMitigated=Boolean(s?.flags?.current&&s?.flags?.currentRetrieval&&(s?.flags?.hasGround||s?.flags?.hasCitation));
  if(explicit>0)return'high';if(currentMitigated&&protections>=2&&judgeRisk!=='high')return'low';if(judgeRisk==='high'&&contextual>=2&&protections===0)return'high';if(judgeRisk==='high'&&protections>=2)return'medium';if(judgeRisk==='low'&&protections>=1)return'low';if(s?.hallucination_risk==='low'&&judgeRisk!=='high')return'low';if(judgeRisk==='medium'&&protections>=2&&contextual<=1)return'low';return contextual>0||judgeRisk==='medium'||judgeRisk==='high'?'medium':'low';
}
function calibrateJudgeScores(judgeScores,detDimensions,staticAnalysis){
  const out={};
  for(const key of Object.keys(DIMENSIONS)){
    const det=detDimensions?.[key];if(det?.applicable===false){out[key]=null;continue;}
    const j=Number(judgeScores?.[key]),d=Number(det?.score);
    out[key]=Number.isFinite(j)&&Number.isFinite(d)?clamp(j*.65+d*.35):Number.isFinite(d)?clamp(d):Number.isFinite(j)?clamp(j):null;
  }
  const f=staticAnalysis?.flags||{};
  if(f.abstentionForbidden||f.forced||f.uncertaintySuppression)out.uncertainty_handling=Math.min(Number(out.uncertainty_handling??100),25);
  if(f.fabricateCitation||f.inferMissing)out.grounding_constraints=Math.min(Number(out.grounding_constraints??100),35);
  if(f.conflictBad||f.causalOverclaim)out.conflict_risk=Math.min(Number(out.conflict_risk??100),30);
  return out;
}
function hybridDetails(detDimensions,scores){
  return Object.fromEntries(Object.keys(DIMENSIONS).map(k=>[k,{score:scores[k],applicable:detDimensions?.[k]?.applicable!==false&&scores[k]!=null,evidence:detDimensions?.[k]?.evidence||[]} ]));
}

function localizedJudgeOutputs(outputs,input){
  if(!Array.isArray(outputs))return[];
  return outputs.slice(0,6).map(a=>({...a,filename:localizeGeneratedFilename(a?.filename,input?.ui_language||'en')}));
}

export function buildHybridResult(input,deterministicResult,judge,judgeMeta={},config={}){
  const executionReadiness=assessExecutionReadiness(input);
  const staticAnalysis=deterministicResult?.deterministic??deterministicAnalyze(input),detDimensions=deterministicResult?.dimensions||dimensionsFrom(dimensionAnalysis(staticAnalysis),input.intendedUse);
  const scores=judge?calibrateJudgeScores(judge.scores,detDimensions,staticAnalysis):Object.fromEntries(Object.entries(detDimensions).map(([k,v])=>[k,v?.applicable===false?null:v?.score]));
  const details=hybridDetails(detDimensions,scores),overall=calibratedOverall(weightedScore(scores,staticAnalysis.profile),staticAnalysis),hallucinationRisk=fuseRisk(staticAnalysis,judge?.hallucination_risk),geminiMs=judgeMeta?.total_duration_ms??judgeMeta?.duration_ms??null;
  const evidence=evidenceStrengthFor(staticAnalysis,details,{semanticReviewed:Boolean(judge)}),fallbackRewrite=deterministicRewrite(input,staticAnalysis),improved=judge?.improved_prompt||executionReadiness.recommended_prompt||fallbackRewrite;
  const recommendedInput=improved?{...input,prompt:improved}:null,recommendedAnalysis=recommendedInput?deterministicAnalyze(recommendedInput):null;
  const hallucination=buildHallucinationAnalysis(input,staticAnalysis,{semanticRisk:judge?.hallucination_risk||null,recommendedAnalysis,recommendedInput});
  return {version:ENGINE_VERSION,rubric_version:RUBRIC_VERSION,scoring_profile:profileFor(input.intendedUse),mode:judge?'hybrid-gemini':'deterministic-only',timing:{total_ms:geminiMs??deterministicResult?.timing?.total_ms??null,deterministic_ms:deterministicResult?.timing?.deterministic_ms??null,gemini_ms:geminiMs},judge:{provider:config.geminiApiKey?'google-gemini':null,model:config.geminiApiKey?(config.geminiModel||'gemini-3.7-flash'):null,status:judge?'ok':(config.geminiApiKey?'fallback':'not-configured'),confidence:judge?.confidence??null,error:judgeMeta?.error?.message??null,error_category:judgeMeta?.error?.category??null,http_status:judgeMeta?.http_status??null,duration_ms:geminiMs,interaction_id:judgeMeta?.interaction_id??null,interaction_status:judgeMeta?.interaction_status??null,usage:judgeMeta?.usage??null},judge_response:judge?{scores:judge.scores,hallucination_risk:judge.hallucination_risk,strengths:judge.strengths,weaknesses:judge.weaknesses,risk_indicators:judge.risk_indicators,recommendations:judge.recommendations,improved_prompt:judge.improved_prompt,expected_execution_improvements:judge.expected_execution_improvements||[],generated_outputs:judge.generated_outputs||[],confidence:judge.confidence}:null,overall_score:overall,quality_level:qualityLevel(overall),hallucination_risk:hallucinationRisk,hallucination_risk_index:hallucination.risk_index,hallucination_probability:null,hallucination_analysis:hallucination,...deprecation(),analysis_evidence_strength:evidence,evaluation_mode:staticAnalysis.evaluation_mode,reason_codes:reasonCodes(staticAnalysis),dimensions:applyExecutionContextScore(dimensionsFrom(details,input.intendedUse),executionReadiness),execution_readiness:executionReadiness,expected_execution_improvements:[...new Set([...(judge?.expected_execution_improvements||[]),...(executionReadiness.expected_improvements||[])])].slice(0,8),generated_outputs:Array.isArray(judge?.generated_outputs)&&judge.generated_outputs.length?localizedJudgeOutputs(judge.generated_outputs,input):(executionReadiness.generated_outputs||[]),strengths:[...new Set([...(judge?.strengths??[]),...staticStrengths(staticAnalysis)])].slice(0,12),weaknesses:[...new Set([...(judge?.weaknesses??[]),...staticAnalysis.issues])].slice(0,12),risk_indicators:[...new Set([...(judge?.risk_indicators??[]),...staticAnalysis.risk_indicators])].slice(0,12),recommendations:[...new Set([...(judge?.recommendations??[]),...staticAnalysis.recommendations])].slice(0,12),improved_prompt:improved,improved_prompt_source:judge?.improved_prompt?'judge':executionReadiness.recommended_prompt?'execution-readiness':'deterministic',deterministic:staticAnalysis,calibration:{rubric_version:RUBRIC_VERSION,profile:profileFor(input.intendedUse),judge_blend:judge?'65% semantic / 35% deterministic':null,risk_model:'multilingual-intent-aware-v5+hallucination-explainer-v1',dimension_model:'evidence-weighted-continuous-v1',confidence_model:'structural-evidence-not-probability'},disclaimer:'Hallucination risk and the 0–100 risk index are prompt-level engineering signals, not a calibrated probability that a response will hallucinate. Evidence strength reflects observable analysis coverage, not probability.'};
}

export async function analyzePrompt(input,config={}){return buildDeterministicResult(input);}
