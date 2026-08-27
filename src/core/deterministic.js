const RX = {
  current:/\b(today|current|currently|latest|recent|this week|this month|as of|now|202[5-9])\b/i,
  citation:/\b(cite|citation|source|reference|evidence|supporting section|supporting quote)\b/i,
  abstain:/\b(insufficient|don't know|do not know|cannot determine|cannot verify|not enough|abstain|uncertain|unverified|missing information|information unavailable|state what is missing|state.*missing)\b/i,
  ground:/\b(only (use|using)|use only|provided context|supplied (document|documents|code|data|policy)|retrieved|verified|approved sources?|authoritative|primary sources?|ground(ed|ing)|evidence|do not (infer|invent|fabricate|assume)|without evidence)\b/i,
  format:/\b(json|yaml|table|bullet|schema|format|return|respond with|output|sections?|fields?|severity|confidence)\b/i,
  tool:/\b(tool|search|retrieve|retrieval|database|api|function|browse|tracking|lookup)\b/i,
  boundedTool:/\b(reuse|avoid repeated|do not repeat|minimum.*tools?|only when needed|stop after|failed attempts?|do not call.*already|reuse prior)\b/i,
  certainty:/\b(always answer|never say (you )?(don't|do not) know|definitive answer|must answer|do not refuse|never mention uncertainty|be completely certain)\b/i,
  infer:/\b(fill(?: in)?[^.]{0,25}missing|guess|make reasonable (assumptions|guesses)|infer[^.]{0,25}(likely|missing)|estimate.*anyway|assume whatever|reconstruct unreadable|choose.*seems (right|likely|plausible)|invent realistic)\b/i,
  noGuess:/\b(do not|don't|never) (guess|infer|invent|fabricate|assume)|\bwithout (guessing|inferring)|\bnull for missing|\bleave .*null\b/i,
  repeatedTool:/\b(call|use).{0,20}(tool|search).{0,30}(three|3|multiple) times|\bevery question\b.{0,30}tool/i,
  endlessTool:/\bkeep calling|never stop|until you get an answer\b/i,
  impossibleConstraint:/\b(comprehensive|exhaustive|every possible|every important).{0,80}\b(under|exactly).{0,20}\b(\d+)\s*(word|words)\b|\b(under|exactly).{0,20}\b(\d+)\s*(word|words).{0,80}\b(comprehensive|exhaustive)\b/i,
  intentionalRepeat:/\brepeat (all|the).{0,30}(context|information)|\bextremely verbose\b/i,
  destructive:/\b(delete|remove|overwrite|destroy).*\b(without confirmation|do not ask|automatically)\b/i,
  safeDestructive:/\b(require explicit confirmation|before.*destructive|read-only diagnostics|irreversible.*confirmation)\b/i,
  causalOverclaim:/\b(prove[^.]{0,40}caus\w*|caused[^.]{0,40}correlation|correlation[^.]{0,40}proves?)\b/i,
  causalSafe:/\b(distinguish correlation from causation|confounders?|causal claim|additional evidence required)\b/i,
  nullMissing:/\b(return|null|leave).{0,20}\b(missing|unavailable|unreadable)\b|\bnull\b.{0,20}\bmissing\b/i,
  conflictSafe:/\b(if|when).{0,20}(sources?|documents?|evidence).{0,20}conflict|report the conflict|do not reconcile|mark.*ambiguous|all candidates/i,
  conflictBad:/\b(if|when).{0,20}(sources?|documents?|values?).{0,20}conflict.{0,40}(choose|pick)|choose.*seems (right|likely|plausible)/i,
};

function duplicateRatio(text){const lines=text.split(/\n+/).map(x=>x.trim().toLowerCase()).filter(x=>x.length>20);if(!lines.length)return 0;return 1-new Set(lines).size/lines.length;}
function intendedProfile(s='general',prompt=''){s=String(s).toLowerCase();const p=String(prompt).toLowerCase();if(s.includes('rag')||s.includes('document'))return'rag';if(s.includes('coding')||s.includes('software'))return'coding';if(s.includes('research'))return'research';if(s.includes('agent')||s.includes('tool use'))return'agent';if(s.includes('extract'))return'extraction';if(s.includes('customer')||s.includes('support'))return'support';if(s.includes('data'))return'data';if(/document|attached|supplied context/.test(p))return'rag';if(/node\.js|code|function|api/.test(p))return'coding';if(/tool|search|retrieve/.test(p))return'agent';if(/invoice|extract|fields|json only/.test(p))return'extraction';if(/correlation|causation|dataset|forecast/.test(p))return'data';if(/current|latest|authoritative sources?|market data|tax/.test(p))return'research';return'general';}

export function deterministicAnalyze({prompt,context='',intendedUse='general',requiresCurrentFacts=false}){
  const issues=[],recommendations=[],signals=[],protective=[];
  const p=prompt.trim(), all=`${p}\n${context}`, dup=duplicateRatio(all), profile=intendedProfile(intendedUse,p);
  const current=requiresCurrentFacts||RX.current.test(p);
  const hasGround=RX.ground.test(p), hasAbstain=RX.abstain.test(p), hasCitation=RX.citation.test(p), hasFormat=RX.format.test(p), hasTool=RX.tool.test(p), boundedTool=RX.boundedTool.test(p);
  const forced=RX.certainty.test(p), noGuess=RX.noGuess.test(p), inferMissing=RX.infer.test(p)&&!RX.noGuess.test(p), destructive=RX.destructive.test(p), safeDestructive=RX.safeDestructive.test(p), causalOverclaim=RX.causalOverclaim.test(p), causalSafe=RX.causalSafe.test(p), nullMissing=RX.nullMissing.test(p), conflictSafe=RX.conflictSafe.test(p), conflictBad=RX.conflictBad.test(p), repeatedTool=RX.repeatedTool.test(p), endlessTool=RX.endlessTool.test(p), impossibleConstraint=RX.impossibleConstraint.test(p), intentionalRepeat=RX.intentionalRepeat.test(p);

  if(p.length<25){issues.push('The prompt is very short and may underspecify the task.');recommendations.push('State the task, relevant constraints, and expected output explicitly.');}
  if(current&&!hasTool&&!hasGround){issues.push('Time-sensitive facts are requested without a retrieval or grounding requirement.');recommendations.push('Require current retrieval/search or provide authoritative current context.');signals.push('time-sensitive-without-grounding');}
  const factual=/\b(fact|policy|law|regulation|research|document|contract|medical|financial|tax|refund|tracking|current|latest)\b/i.test(all);
  const missingDocSafe=profile==='rag'&&hasAbstain&&/\b(summarize|extract)\b/i.test(p);
  if(!hasGround&&!missingDocSafe&&factual&&['rag','research','support'].includes(profile)){issues.push('Factual or document-oriented task lacks an explicit grounding constraint.');recommendations.push('Tell the model which evidence it may rely on and what to do when evidence is missing.');signals.push('weak-grounding');}
  if(!hasAbstain&&['rag','research','support','agent','data'].includes(profile)){issues.push('No explicit insufficient-evidence or uncertainty behavior was detected.');recommendations.push('Allow the model to state that evidence is insufficient rather than inventing an answer.');signals.push('no-abstention');}
  if(forced){issues.push('The prompt contains forced-certainty language that can increase unsupported answers.');recommendations.push('Remove forced-certainty language and permit abstention when appropriate.');signals.push('forced-certainty');}
  if(inferMissing){issues.push('The prompt encourages unsupported inference or guessing when information is missing.');recommendations.push('Require missing information to be reported instead of guessed.');signals.push('infer-missing');}
  if(destructive&&!safeDestructive){issues.push('The prompt permits destructive actions without explicit confirmation.');recommendations.push('Require explicit confirmation before destructive or irreversible actions.');signals.push('unsafe-destructive-action');}
  if(causalOverclaim&&!causalSafe){issues.push('The prompt asks for a causal conclusion from evidence that may only support correlation.');recommendations.push('Separate correlation from causation and identify additional evidence required.');signals.push('causal-overclaim');}
  if(conflictBad&&!conflictSafe){issues.push('The prompt asks the model to silently resolve conflicting evidence without support.');recommendations.push('Report conflicts or ambiguity rather than selecting an unsupported value.');signals.push('conflict-resolution-by-guessing');}
  if(repeatedTool||endlessTool){issues.push('The prompt encourages unnecessary or unbounded repeated tool calls.');recommendations.push('Use the minimum necessary tool calls, reuse valid results, and stop after bounded failures.');signals.push('unbounded-tool-use');}
  if(impossibleConstraint){issues.push('The prompt contains materially conflicting output requirements.');recommendations.push('Resolve conflicting completeness and length requirements by prioritizing the most important content.');signals.push('conflicting-constraints');}
  if(intentionalRepeat){issues.push('The prompt explicitly encourages unnecessary repetition or verbosity.');recommendations.push('Prefer concise, relevant context and avoid repeating established information.');signals.push('intentional-repetition');}
  if(!hasFormat&&p.length<180){issues.push('No clear output contract was detected.');recommendations.push('Specify the desired format, length, fields, or schema.');}
  const citationRelevant=context.length>0||/\b(answer|question|claim|conclusion|policy|legal|contract|compare)\b/i.test(p);
  if((profile==='rag'||context.length>0)&&citationRelevant&&!hasCitation){issues.push('Context is provided but factual claims are not explicitly tied to citations or evidence.');recommendations.push('Require factual claims to cite or point to the supplied evidence when appropriate.');signals.push('no-citations');}
  if(profile==='agent'&&hasTool&&!boundedTool){issues.push('Tool use is mentioned without clear limits or reuse guidance.');recommendations.push('Define when tools should be used, when results should be reused, and when retries should stop.');signals.push('unbounded-tool-use');}
  if(dup>0.20){issues.push('The prompt/context contains substantial repeated text.');recommendations.push('Remove duplicated instructions or context to reduce ambiguity and token waste.');signals.push('duplicate-context');}

  if(hasGround||missingDocSafe)protective.push('grounding'); if(hasAbstain||noGuess)protective.push('abstention'); if(hasCitation)protective.push('citations'); if(hasFormat)protective.push('output-contract'); if(boundedTool)protective.push('bounded-tools'); if(nullMissing)protective.push('null-on-missing'); if(conflictSafe)protective.push('conflict-reporting'); if(safeDestructive)protective.push('destructive-confirmation'); if(causalSafe)protective.push('causal-discipline');
  const explicitDanger=signals.filter(s=>['forced-certainty','infer-missing','time-sensitive-without-grounding','unsafe-destructive-action','causal-overclaim','conflict-resolution-by-guessing','unbounded-tool-use','conflicting-constraints'].includes(s));
  const contextualRisk=signals.filter(s=>['weak-grounding','no-abstention','no-citations','unbounded-tool-use'].includes(s));
  let risk='low';
  if(explicitDanger.length>0)risk='high';
  else if(contextualRisk.length>=2||(current&&contextualRisk.length))risk='medium';
  else if(contextualRisk.length===1&&protective.length===0)risk='medium';

  return {profile,metrics:{prompt_chars:p.length,context_chars:context.length,duplicate_ratio:Number(dup.toFixed(3))},flags:{current,hasGround,hasAbstain:hasAbstain||noGuess,hasCitation,hasFormat,hasTool,boundedTool,forced,inferMissing,noGuess,destructive,safeDestructive,causalOverclaim,causalSafe,nullMissing,conflictSafe,conflictBad,repeatedTool,endlessTool,impossibleConstraint,intentionalRepeat},issues:[...new Set(issues)],recommendations:[...new Set(recommendations)],risk_indicators:[...new Set(signals)],protective_controls:[...new Set(protective)],explicit_danger_count:explicitDanger.length,contextual_risk_count:contextualRisk.length,hallucination_risk:risk};
}
