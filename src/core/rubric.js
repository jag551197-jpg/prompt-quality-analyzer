export const RUBRIC_VERSION = '2.0.0';

export const DIMENSIONS = {
  instruction_clarity: { label: 'Instruction Clarity' },
  context_sufficiency: { label: 'Context Sufficiency' },
  grounding_constraints: { label: 'Grounding Constraints' },
  uncertainty_handling: { label: 'Uncertainty Handling' },
  output_contract: { label: 'Output Contract' },
  tool_guidance: { label: 'Tool / Retrieval Guidance' },
  conflict_risk: { label: 'Conflict / Ambiguity Handling' },
  context_efficiency: { label: 'Context Efficiency' }
};

export const WEIGHT_PROFILES = {
  general: {
    instruction_clarity:.16, context_sufficiency:.18, grounding_constraints:.08, uncertainty_handling:.14,
    output_contract:.16, tool_guidance:.05, conflict_risk:.13, context_efficiency:.10
  },
  coding: {
    instruction_clarity:.18, context_sufficiency:.18, grounding_constraints:.08, uncertainty_handling:.14,
    output_contract:.18, tool_guidance:.04, conflict_risk:.12, context_efficiency:.08
  },
  rag: {
    instruction_clarity:.10, context_sufficiency:.15, grounding_constraints:.22, uncertainty_handling:.14,
    output_contract:.14, tool_guidance:.05, conflict_risk:.10, context_efficiency:.10
  },
  research: {
    instruction_clarity:.12, context_sufficiency:.12, grounding_constraints:.20, uncertainty_handling:.14,
    output_contract:.12, tool_guidance:.12, conflict_risk:.10, context_efficiency:.08
  },
  agent: {
    instruction_clarity:.12, context_sufficiency:.12, grounding_constraints:.08, uncertainty_handling:.14,
    output_contract:.14, tool_guidance:.20, conflict_risk:.12, context_efficiency:.08
  },
  extraction: {
    instruction_clarity:.12, context_sufficiency:.16, grounding_constraints:.16, uncertainty_handling:.12,
    output_contract:.22, tool_guidance:.03, conflict_risk:.10, context_efficiency:.09
  },
  support: {
    instruction_clarity:.13, context_sufficiency:.15, grounding_constraints:.16, uncertainty_handling:.15,
    output_contract:.12, tool_guidance:.08, conflict_risk:.12, context_efficiency:.09
  },
  data: {
    instruction_clarity:.14, context_sufficiency:.16, grounding_constraints:.10, uncertainty_handling:.14,
    output_contract:.16, tool_guidance:.05, conflict_risk:.15, context_efficiency:.10
  }
};

export function profileFor(intendedUse='general') {
  const s=String(intendedUse).toLowerCase();
  if (s.includes('rag') || s.includes('document')) return 'rag';
  if (s.includes('coding') || s.includes('software')) return 'coding';
  if (s.includes('research')) return 'research';
  if (s.includes('agent') || s.includes('tool use')) return 'agent';
  if (s.includes('extract')) return 'extraction';
  if (s.includes('customer') || s.includes('support')) return 'support';
  if (s.includes('data')) return 'data';
  return 'general';
}

export function weightsFor(intendedUse='general') {
  return WEIGHT_PROFILES[profileFor(intendedUse)] || WEIGHT_PROFILES.general;
}

export function weightedScore(scores, intendedUse='general') {
  const weights=weightsFor(intendedUse);
  return Math.round(Object.entries(weights).reduce((sum,[key,w])=>sum+(Number(scores[key])||0)*w,0));
}

export function qualityLevel(score) {
  return score >= 85 ? 'excellent' : score >= 72 ? 'good' : score >= 55 ? 'needs-improvement' : 'poor';
}
