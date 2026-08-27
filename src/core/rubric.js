export const RUBRIC_VERSION = '1.0.0';

export const DIMENSIONS = {
  instruction_clarity: { label: 'Instruction Clarity', weight: 0.15 },
  context_sufficiency: { label: 'Context Sufficiency', weight: 0.20 },
  grounding_constraints: { label: 'Grounding Constraints', weight: 0.15 },
  uncertainty_handling: { label: 'Uncertainty Handling', weight: 0.10 },
  output_contract: { label: 'Output Contract', weight: 0.10 },
  tool_guidance: { label: 'Tool / Retrieval Guidance', weight: 0.10 },
  conflict_risk: { label: 'Conflict / Ambiguity Handling', weight: 0.10 },
  context_efficiency: { label: 'Context Efficiency', weight: 0.10 }
};

export function weightedScore(scores) {
  return Math.round(Object.entries(DIMENSIONS).reduce((sum, [key, cfg]) => sum + (Number(scores[key]) || 0) * cfg.weight, 0));
}
