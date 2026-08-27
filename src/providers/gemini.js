import { validateJudgeResult, judgeJsonSchema } from '../core/schema.js';

function buildJudgeInput({ prompt, context, intendedUse, requiresCurrentFacts, staticAnalysis, rubricVersion }) {
  return `You are a rigorous prompt-quality evaluator for software developers.\n\nEvaluate the PROMPT itself, not whether you personally can answer it. Be conservative and explainable. Scores are 0-100 where 100 is excellent. "conflict_risk" is scored positively: 100 means the prompt handles ambiguity/conflicts well and has low conflict risk. "context_efficiency" is also positive: 100 means concise, relevant, non-duplicative context.\n\nHallucination risk means prompt-level risk indicators only; do not claim certainty that a future model will hallucinate. Improve the prompt while preserving user intent. Do not add facts not supplied by the user.\n\nRubric version: ${rubricVersion}\nIntended use: ${intendedUse}\nRequires current facts: ${Boolean(requiresCurrentFacts)}\n\nDETERMINISTIC FINDINGS:\n${JSON.stringify(staticAnalysis)}\n\nPROMPT:\n---\n${prompt}\n---\n\nOPTIONAL CONTEXT:\n---\n${context || '(none)'}\n---`;
}

export async function judgeWithGemini(input, { apiKey, model, rubricVersion, timeoutMs = 30000 } = {}) {
  if (!apiKey) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        input: buildJudgeInput({ ...input, rubricVersion }),
        response_format: { type: 'text', mime_type: 'application/json', schema: judgeJsonSchema }
      })
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini API ${response.status}: ${body.slice(0, 500)}`);
    }
    const data = await response.json();
    const raw = data.output_text ?? data.outputs?.at?.(-1)?.text ?? data.steps?.filter(s => s.type === 'model_output')?.at?.(-1)?.content?.find(c => c.type === 'text')?.text;
    if (!raw) throw new Error('Gemini response did not contain output_text.');
    return validateJudgeResult(JSON.parse(raw));
  } finally { clearTimeout(timer); }
}
