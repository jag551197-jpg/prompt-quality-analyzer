const clamp=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
const band=n=>n>=75?'very_high':n>=50?'high':n>=25?'moderate':'low';
const level=(n,levels)=>levels.find(x=>n<=x.max)?.label||levels.at(-1).label;
const has=(arr,code)=>Array.isArray(arr)&&arr.includes(code);

function textSignals(input={}){
  const p=String(input.prompt||'');
  const exactNumeric=/\b(exact|precise|specific|exactly|number|percentage|percent|date|amount|price|rate|estat[ií]stica|exat[oa]|precis[oa]|n[uú]mero|percentual|porcentagem|data|valor|pre[cç]o|taxa|exact|pr[eé]cis|nombre|pourcentage|date|montant|prix|taux)\b/i.test(p)||/\b\d+(?:[.,]\d+)?%\b/.test(p);
  const ambiguousPronoun=/\b(it|this|that|they|them|isso|isto|ele|ela|eles|elas|ceci|cela|il|elle|ils|elles)\b/i.test(p);
  const citationDemand=/\b(cite|citation|source|reference|url|paper|fonte|cita[cç][aã]o|refer[eê]ncia|artigo|citation|source|r[eé]f[eé]rence|article)\b/i.test(p);
  const factual=/\b(fact|policy|law|regulation|research|medical|financial|tax|price|market|statistic|document|contract|fato|pol[ií]tica|lei|regulamento|pesquisa|m[eé]dic|financeir|imposto|pre[cç]o|mercado|estat[ií]stica|documento|contrato|fait|politique|loi|r[eè]glement|recherche|m[eé]dical|financier|imp[oô]t|prix|march[eé]|statistique|document|contrat)\b/i.test(p);
  return {exactNumeric,ambiguousPronoun,citationDemand,factual};
}

function driver(code,label,points,category,condition=true){return condition?{code,label,points,category}:null;}
function category(score){const n=clamp(score);return {score:n,band:band(n)};}

export function hallucinationRiskIndex(input,analysis,{semanticRisk=null}={}){
  const f=analysis?.flags||{},q=analysis?.quality_evidence||{},signals=analysis?.risk_indicators||[],t=textSignals(input);
  const missingCore=Array.isArray(q.missing_core)?q.missing_core.length:0;
  const hasContext=Number(analysis?.metrics?.context_chars||0)>0||Boolean(q.context);
  const drivers=[
    driver('forced_certainty','Forced certainty',22,'factual_fabrication',f.forced),
    driver('abstention_prohibited','Abstention is prohibited',22,'factual_fabrication',f.abstentionForbidden),
    driver('uncertainty_suppressed','Uncertainty/limitations are suppressed',16,'factual_fabrication',f.uncertaintySuppression),
    driver('unsupported_inference','Prompt encourages guessing or unsupported inference',18,'unsupported_inference',f.inferMissing),
    driver('citation_fabrication','Prompt permits fabricated citations or sources',28,'citation_fabrication',f.fabricateCitation),
    driver('current_ungrounded','Current facts requested without retrieval/grounding',20,'temporal_staleness',f.current&&!f.currentRetrieval&&!f.hasGround),
    driver('weak_grounding','Factual task has weak grounding requirements',12,'factual_fabrication',has(signals,'weak-grounding')),
    driver('no_abstention','No safe insufficient-evidence behavior detected',8,'factual_fabrication',has(signals,'no-abstention')),
    driver('no_citations','Evidence is supplied but claims are not tied to it',8,'citation_fabrication',has(signals,'no-citations')),
    driver('conflict_guessing','Conflicting evidence may be silently guessed through',12,'unsupported_inference',f.conflictBad),
    driver('causal_overclaim','Prompt encourages causal overclaiming',10,'unsupported_inference',f.causalOverclaim),
    driver('exact_claim_pressure','Exact numbers/dates are requested',7,'factual_fabrication',t.exactNumeric),
    driver('missing_core_context','Core task context is missing',Math.min(18,missingCore*6),'entity_ambiguity',missingCore>0),
    driver('ambiguous_entity_reference','Potentially ambiguous entity/reference language',6,'entity_ambiguity',t.ambiguousPronoun&&!q.subject),
    driver('current_dependency','Prompt depends on time-sensitive information',8,'temporal_staleness',f.current),
    driver('semantic_high','Semantic judge also identified high hallucination risk',10,'semantic_review',semanticRisk==='high'),
    driver('semantic_medium','Semantic judge identified medium hallucination risk',4,'semantic_review',semanticRisk==='medium'),
    driver('grounded','Explicit grounding boundary reduces hallucination pressure',-14,'protection',f.hasGround),
    driver('safe_abstention','Explicit abstention/no-guessing behavior reduces hallucination pressure',-12,'protection',f.hasAbstain||f.noGuess),
    driver('verified_citations','Verifiable citation requirements reduce source fabrication pressure',-7,'protection',f.hasCitation&&!f.fabricateCitation),
    driver('current_retrieval','Authoritative current retrieval reduces staleness risk',-15,'protection',f.current&&f.currentRetrieval),
    driver('supplied_context','Supplied context improves answerability',-5,'protection',hasContext),
    driver('conflict_reporting','Explicit conflict reporting reduces unsupported resolution',-6,'protection',f.conflictSafe),
    driver('semantic_low','Semantic judge identified low hallucination risk',-4,'semantic_review',semanticRisk==='low')
  ].filter(Boolean).filter(x=>x.points!==0);
  const raw=12+drivers.reduce((n,x)=>n+x.points,0);
  return {risk_index:clamp(raw),risk_band:band(clamp(raw)),drivers};
}

function answerability(input,analysis){
  const f=analysis?.flags||{},q=analysis?.quality_evidence||{},m=analysis?.metrics||{};
  const missing=Array.isArray(q.missing_core)?q.missing_core.length:0;
  let n=92-missing*14;
  if(!q.task)n-=18;if(!q.subject)n-=15;if(Number(m.prompt_chars||0)<30)n-=15;
  if(f.current&&!f.currentRetrieval&&!f.hasGround)n-=22;
  if(f.inferMissing)n-=18;if(f.conflictBad)n-=12;if(f.impossibleConstraint)n-=10;
  if(Number(m.context_chars||0)>0)n+=8;if(f.hasGround)n+=6;if(f.hasAbstain||f.noGuess)n+=6;if(f.current&&f.currentRetrieval)n+=8;
  n=clamp(n);
  return {score:n,label:level(n,[{max:24,label:'very_low'},{max:49,label:'low'},{max:74,label:'moderate'},{max:89,label:'good'},{max:100,label:'strong'}]),basis:'How completely the prompt supplies or authorizes access to the information needed for a supported answer.'};
}

function groundingRequirement(input,analysis){
  const f=analysis?.flags||{},p=analysis?.profile||'general',t=textSignals(input);let n=10;
  if(['rag','research','support'].includes(p))n+=35;
  if(['data','extraction'].includes(p))n+=18;
  if(f.current)n+=32;
  if(t.factual)n+=18;
  if(t.exactNumeric)n+=10;
  if(t.citationDemand)n+=12;
  n=clamp(n);
  return {score:n,level:level(n,[{max:14,label:'none'},{max:34,label:'helpful'},{max:54,label:'recommended'},{max:79,label:'required'},{max:100,label:'critical'}]),basis:'How strongly reliable execution depends on supplied evidence or authoritative retrieval.'};
}

function currentDependency(analysis){
  const f=analysis?.flags||{};let n=0;
  if(f.current)n=85;
  if(f.current&&f.currentRetrieval)n=95;
  return {score:n,level:n>=80?'critical':n>=50?'high':n>=20?'moderate':'low',retrieval_present:Boolean(f.currentRetrieval),basis:'Whether correctness materially depends on information that can change over time.'};
}

function abstentionSafety(analysis){
  const f=analysis?.flags||{};let n=45;
  if(f.hasAbstain)n+=35;if(f.noGuess)n+=20;if(f.nullMissing)n+=8;if(f.conflictSafe)n+=5;
  if(f.forced)n-=35;if(f.abstentionForbidden)n-=55;if(f.uncertaintySuppression)n-=40;if(f.inferMissing)n-=20;
  n=clamp(n);
  return {score:n,label:level(n,[{max:24,label:'unsafe'},{max:49,label:'weak'},{max:74,label:'moderate'},{max:89,label:'good'},{max:100,label:'strong'}]),basis:'Whether the model is allowed and instructed to surface insufficient evidence instead of inventing an answer.'};
}

function hallucinationPressure(input,analysis){
  const f=analysis?.flags||{},q=analysis?.quality_evidence||{},t=textSignals(input);let n=8;
  if(f.forced)n+=24;if(f.abstentionForbidden)n+=26;if(f.uncertaintySuppression)n+=20;if(f.inferMissing)n+=18;if(f.fabricateCitation)n+=25;
  if(f.current)n+=10;if(f.current&&!f.currentRetrieval)n+=14;if(t.exactNumeric)n+=8;
  if(Array.isArray(q.missing_core))n+=Math.min(15,q.missing_core.length*5);
  if(f.hasAbstain||f.noGuess)n-=16;if(f.hasGround)n-=12;if(f.currentRetrieval)n-=12;if(f.conflictSafe)n-=6;
  n=clamp(n);
  return {score:n,band:band(n),basis:'How strongly the instruction pressures a model to produce an answer when evidence may be missing, stale, ambiguous, or conflicting.'};
}

function categories(input,analysis){
  const f=analysis?.flags||{},q=analysis?.quality_evidence||{},signals=analysis?.risk_indicators||[],t=textSignals(input),missing=Array.isArray(q.missing_core)?q.missing_core.length:0;
  let factual=12+(f.forced?24:0)+(f.abstentionForbidden?22:0)+(f.uncertaintySuppression?18:0)+(f.inferMissing?18:0)+(has(signals,'weak-grounding')?14:0)+(t.exactNumeric?8:0)-((f.hasGround)?15:0)-((f.hasAbstain||f.noGuess)?12:0);
  let inference=8+(f.inferMissing?42:0)+(f.conflictBad?28:0)+(f.causalOverclaim?24:0)+(f.impossibleConstraint?10:0)-(f.conflictSafe?15:0)-(f.noGuess?12:0);
  let citation=t.citationDemand||f.hasCitation||f.fabricateCitation||has(signals,'no-citations')?10:0;citation+=(f.fabricateCitation?70:0)+(has(signals,'no-citations')?20:0)-(f.hasCitation&&!f.fabricateCitation?15:0);
  let temporal=f.current?35:0;temporal+=(f.current&&!f.currentRetrieval?50:0)-(f.currentRetrieval?25:0)-(f.hasGround?10:0);
  let entity=5+missing*15+(t.ambiguousPronoun&&!q.subject?25:0)+(q.subject? -5:0)+(Number(analysis?.metrics?.context_chars||0)>0?-8:0);
  return {factual_fabrication:category(factual),unsupported_inference:category(inference),citation_fabrication:category(citation),temporal_staleness:category(temporal),entity_ambiguity:category(entity)};
}

function projectedInterventions(input,analysis,currentIndex){
  const f=analysis?.flags||{},q=analysis?.quality_evidence||{},t=textSignals(input),items=[];
  const add=(code,label,reduction,condition=true)=>{if(condition){const projected=clamp(currentIndex-reduction);items.push({code,label,reduction:currentIndex-projected,projected_risk_index:projected,projected_band:band(projected)});}};
  add('permit_uncertainty','Permit explicit uncertainty/abstention',Math.min(28,(f.forced||f.abstentionForbidden||f.uncertaintySuppression)?28:12),!(f.hasAbstain||f.noGuess));
  add('authoritative_retrieval','Require authoritative retrieval for current facts',22,f.current&&!f.currentRetrieval);
  add('grounding_boundary','Add an explicit evidence/grounding boundary',18,!f.hasGround&&(t.factual||['rag','research','support'].includes(analysis?.profile)));
  add('supply_context','Supply missing task/entity context',Math.min(20,(Array.isArray(q.missing_core)?q.missing_core.length:0)*7),Array.isArray(q.missing_core)&&q.missing_core.length>0);
  add('verified_citations','Require verifiable citations and forbid invented sources',20,f.fabricateCitation||has(analysis?.risk_indicators,'no-citations'));
  add('conflict_policy','Require conflicts to be surfaced rather than guessed through',16,f.conflictBad||f.impossibleConstraint);
  add('remove_exactness_pressure','Allow ranges/uncertainty when exact values cannot be supported',10,t.exactNumeric&&!f.hasGround);
  return items.filter(x=>x.reduction>0).sort((a,b)=>b.reduction-a.reduction).slice(0,6);
}

function executionScenarios(index,input,analysis){
  const f=analysis?.flags||{},ground=groundingRequirement(input,analysis).score;
  const modelOnly=index;
  const retrieval=clamp(index-(f.current?22:ground>=55?14:8));
  const evidence=clamp(index-(ground>=55?24:14));
  return [
    {scenario:'model_only',label:'Model only',risk_index:modelOnly,risk_band:band(modelOnly),assumption:'No external retrieval or supplied authoritative evidence.'},
    {scenario:'authoritative_retrieval',label:'With authoritative retrieval',risk_index:retrieval,risk_band:band(retrieval),assumption:'Execution can retrieve current authoritative sources and cite them.'},
    {scenario:'supplied_evidence',label:'With supplied evidence',risk_index:evidence,risk_band:band(evidence),assumption:'Execution is constrained to sufficient, relevant supplied evidence.'}
  ];
}

export function buildHallucinationAnalysis(input,analysis,{semanticRisk=null,recommendedAnalysis=null,recommendedInput=null}={}){
  const base=hallucinationRiskIndex(input,analysis,{semanticRisk});
  const answer=answerability(input,analysis),ground=groundingRequirement(input,analysis),current=currentDependency(analysis),abstain=abstentionSafety(analysis),pressure=hallucinationPressure(input,analysis),cats=categories(input,analysis);
  const recommended=recommendedAnalysis?hallucinationRiskIndex(recommendedInput||input,recommendedAnalysis):null;
  return {
    risk_index:base.risk_index,
    risk_band:base.risk_band,
    calibrated_probability:null,
    probability_status:'not_calibrated',
    probability_explanation:'PQA reports a prompt-level risk index, not a calibrated probability that a model response will hallucinate. A true probability requires outcome calibration by model, retrieval state, domain, and execution settings.',
    answerability:answer,
    grounding_requirement:ground,
    current_information_dependency:current,
    abstention_safety:abstain,
    hallucination_pressure:pressure,
    categories:cats,
    drivers:base.drivers.filter(x=>x.category!=='protection'),
    protective_factors:base.drivers.filter(x=>x.category==='protection'||(x.category==='semantic_review'&&x.points<0)),
    interventions:projectedInterventions(input,analysis,base.risk_index),
    execution_scenarios:executionScenarios(base.risk_index,input,analysis),
    remediation_comparison:recommended?{original_risk_index:base.risk_index,recommended_risk_index:recommended.risk_index,reduction:Math.max(0,base.risk_index-recommended.risk_index),original_band:base.risk_band,recommended_band:recommended.risk_band}:null,
    semantic_reviewed:Boolean(semanticRisk),
    methodology:'deterministic-prompt-risk-v1',
    disclaimer:'Risk index and projected reductions are engineering decision-support signals, not empirical probabilities or guarantees of model behavior.'
  };
}
