# PQA Quality Engine 3.0

Quality Engine 3.0 removes the principal deterministic-analysis limitations identified in the 1.18.7 line.

## What changed

- **Multilingual deterministic risk detection:** English, Brazilian Portuguese, and French now share a common risk taxonomy for forced certainty, uncertainty suppression, unsupported inference, fabricated citations, destructive actions, tool overuse, causal overclaim, conflict guessing, evaluator manipulation, system-prompt extraction, and role override.
- **Intent-aware abstention handling:** phrases such as `never say you don't know`, `nunca diga que não sabe`, and `ne dites jamais que vous ne savez pas` are classified as prohibiting abstention rather than as positive uncertainty handling.
- **Deterministic recommended prompt:** a safe rule-based rewrite is produced even when Gemini is absent. Hybrid mode uses the Gemini rewrite when available and falls back to the deterministic rewrite otherwise.
- **Evidence Strength instead of pseudo-probability:** deterministic `score_confidence`, `risk_confidence`, and `score_range` are deprecated to `null`. `analysis_evidence_strength` reports observable structural evidence coverage and explicitly states that it is not a calibrated probability.
- **Evidence-based dimensions:** dimension scores are derived from visible positive/negative features and include point-level evidence. Non-applicable dimensions are `N/A` rather than receiving profile defaults. Overall weighting is renormalized across applicable dimensions only.
- **Public reproducibility suite:** `examples/benchmark-public-v3.json` contains 36 EN/PT/FR deterministic regression cases covering danger, safe-abstention, grounding, current retrieval, extraction, vague prompts, coding, bounded tools, and conflict handling.

## Run the public suite

```bash
npm run benchmark:public
```

The suite reports the score/risk for every case and exits non-zero if an expected score band, risk level, or required flag is violated.

The private Platform regression/calibration suite remains larger because it includes adversarial and commercial implementation cases, but Community users can now reproduce the core multilingual mechanism and published behavior locally without Gemini or a network connection.

## Output contract

New/changed deterministic result fields include:

```json
{
  "version": "3.0.0",
  "score_confidence": null,
  "risk_confidence": null,
  "score_range": null,
  "analysis_evidence_strength": {
    "value": 0.0,
    "label": "limited|moderate|strong",
    "kind": "structural-evidence",
    "calibrated_probability": false,
    "semantic_reviewed": false
  },
  "improved_prompt_source": "deterministic|judge"
}
```

Each dimension now contains `score`, `applicable`, and an `evidence` array. `score` is `null` when the dimension is not applicable.

## Hallucination Risk Explainer (v1)

The engine now emits an additive `hallucination_analysis` object. It does not alter the existing overall score, dimensions, or `hallucination_risk` categorical contract.

The explainer includes a 0–100 prompt-level risk index, answerability, grounding requirement, current-information dependency, abstention safety, hallucination pressure, risk categories, driver contributions, projected mitigations, execution-scenario sensitivity, and original-vs-recommended prompt comparison.

`hallucination_probability` remains `null`. The 0–100 risk index is not a calibrated probability. Probability reporting is reserved for a future outcome-calibrated model segmented by model/version, domain, retrieval state and execution settings.
