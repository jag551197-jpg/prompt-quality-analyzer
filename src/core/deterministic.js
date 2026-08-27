const CURRENT = /\b(today|current|currently|latest|recent|this week|this month|as of|now)\b/i;
const CITATION = /\b(cite|citation|source|reference|evidence)\b/i;
const ABSTAIN = /\b(insufficient|don't know|do not know|cannot determine|not enough|abstain|uncertain)\b/i;
const GROUND = /\b(only (use|using)|provided context|retrieved|approved sources?|authoritative|ground(ed|ing)|evidence)\b/i;
const FORMAT = /\b(json|yaml|table|bullet|schema|format|return|respond with|output)\b/i;
const TOOL = /\b(tool|search|retrieve|retrieval|database|api|function|browse)\b/i;
const CERTAINTY = /\b(always answer|never say (you )?(don't|do not) know|definitive answer|must answer|do not refuse)\b/i;

function duplicateRatio(text) {
  const lines = text.split(/\n+/).map(x => x.trim().toLowerCase()).filter(x => x.length > 20);
  if (!lines.length) return 0;
  return 1 - new Set(lines).size / lines.length;
}

export function deterministicAnalyze({ prompt, context = '', intendedUse = 'general', requiresCurrentFacts = false }) {
  const issues = [], recommendations = [], signals = [];
  const p = prompt.trim();
  const all = `${p}\n${context}`;
  const dup = duplicateRatio(all);
  const current = requiresCurrentFacts || CURRENT.test(p);
  const hasGround = GROUND.test(p);
  const hasAbstain = ABSTAIN.test(p);
  const hasCitation = CITATION.test(p);
  const hasFormat = FORMAT.test(p);
  const hasTool = TOOL.test(p);
  const forced = CERTAINTY.test(p);

  if (p.length < 25) { issues.push('The prompt is very short and may underspecify the task.'); recommendations.push('State the task, relevant constraints, and expected output explicitly.'); }
  if (current && !hasTool && !hasGround) { issues.push('Time-sensitive facts are requested without a retrieval or grounding requirement.'); recommendations.push('Require current retrieval/search or provide authoritative current context.'); signals.push('time-sensitive-without-grounding'); }
  if (!hasGround && /\b(fact|policy|law|regulation|research|document|contract|medical|financial|tax)\b/i.test(all)) { issues.push('Factual or document-oriented task lacks an explicit grounding constraint.'); recommendations.push('Tell the model which evidence it may rely on and what to do when evidence is missing.'); signals.push('weak-grounding'); }
  if (!hasAbstain) { issues.push('No explicit insufficient-evidence or uncertainty behavior was detected.'); recommendations.push('Allow the model to state that evidence is insufficient rather than inventing an answer.'); signals.push('no-abstention'); }
  if (forced) { issues.push('The prompt contains forced-certainty language that can increase unsupported answers.'); recommendations.push('Remove forced-certainty language and permit abstention when appropriate.'); signals.push('forced-certainty'); }
  if (!hasFormat) { issues.push('No clear output contract was detected.'); recommendations.push('Specify the desired format, length, fields, or schema.'); }
  if ((intendedUse.toLowerCase().includes('rag') || context.length > 0) && !hasCitation) { issues.push('Context is provided but factual claims are not explicitly tied to citations or evidence.'); recommendations.push('Require factual claims to cite or point to the supplied evidence when appropriate.'); signals.push('no-citations'); }
  if (dup > 0.20) { issues.push('The prompt/context contains substantial repeated text.'); recommendations.push('Remove duplicated instructions or context to reduce ambiguity and token waste.'); signals.push('duplicate-context'); }

  const risk = signals.some(s => ['forced-certainty','time-sensitive-without-grounding'].includes(s)) || signals.length >= 3 ? 'high' : signals.length ? 'medium' : 'low';
  return {
    metrics: { prompt_chars: p.length, context_chars: context.length, duplicate_ratio: Number(dup.toFixed(3)) },
    flags: { current, hasGround, hasAbstain, hasCitation, hasFormat, hasTool, forced },
    issues: [...new Set(issues)], recommendations: [...new Set(recommendations)], risk_indicators: signals, hallucination_risk: risk
  };
}
