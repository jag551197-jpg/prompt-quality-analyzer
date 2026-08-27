export const judgeJsonSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    scores: { type: 'object', additionalProperties: false, properties: Object.fromEntries(['instruction_clarity','context_sufficiency','grounding_constraints','uncertainty_handling','output_contract','tool_guidance','conflict_risk','context_efficiency'].map(k => [k,{type:'number',minimum:0,maximum:100}])), required:['instruction_clarity','context_sufficiency','grounding_constraints','uncertainty_handling','output_contract','tool_guidance','conflict_risk','context_efficiency'] },
    hallucination_risk:{type:'string',enum:['low','medium','high']}, strengths:{type:'array',items:{type:'string'},maxItems:8}, weaknesses:{type:'array',items:{type:'string'},maxItems:8}, risk_indicators:{type:'array',items:{type:'string'},maxItems:10}, recommendations:{type:'array',items:{type:'string'},maxItems:10}, improved_prompt:{type:'string'}, confidence:{type:'number',minimum:0,maximum:1}
  }, required:['scores','hallucination_risk','strengths','weaknesses','risk_indicators','recommendations','improved_prompt','confidence']
};
const keys=['instruction_clarity','context_sufficiency','grounding_constraints','uncertainty_handling','output_contract','tool_guidance','conflict_risk','context_efficiency'];
export function validateJudgeResult(v){
  if(!v||typeof v!=='object'||!v.scores) throw new Error('Invalid judge result');
  for(const k of keys) if(typeof v.scores[k]!=='number'||v.scores[k]<0||v.scores[k]>100) throw new Error(`Invalid judge score: ${k}`);
  if(!['low','medium','high'].includes(v.hallucination_risk)) throw new Error('Invalid hallucination risk');
  for(const k of ['strengths','weaknesses','risk_indicators','recommendations']) if(!Array.isArray(v[k])||v[k].some(x=>typeof x!=='string')) throw new Error(`Invalid ${k}`);
  if(typeof v.improved_prompt!=='string'||typeof v.confidence!=='number'||v.confidence<0||v.confidence>1) throw new Error('Invalid judge metadata');
  return v;
}
