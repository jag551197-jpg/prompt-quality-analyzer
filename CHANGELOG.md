# Changelog

## 1.5.0

Benchmark result-lifecycle repair.

- Preserves case metadata (`id`, `case_id`, `category`, tags, pair metadata).
- Adds explicit per-case lifecycle `status`.
- Emits canonical `final_result` plus runner-compatible `result` and `analysis` aliases.
- Emits canonical `expectations` plus compatible `expectation.pass` / `expectation.passed`.
- Adds a final-result integrity validator; `completed` now requires a numeric score, valid risk, recommendations array, and dimensions.
- Adds `result_integrity_rate`, `analytically_complete_cases`, and `invalid_result_cases` to benchmark summaries.
- Updates resilient Python runner to consume `final_result` / `expectations` and fail hard on terminal cases with missing analytic results.
- Preserves deterministic-only fallback as a valid finalized benchmark result.
- Adds API/runner contract regression tests.

## 1.5.0 — Calibration release
- Added task-aware scoring profiles for coding, RAG, research, agent/tool use, extraction, customer support, data analysis, and general prompts.
- Replaced worst-of risk fusion with tiered evidence-aware risk fusion.
- Added explicit-danger detection for forced certainty, guessing/inference, unbounded tools, causal overclaims, conflicting constraints, destructive actions, and unsupported conflict resolution.
- Added positive-control recognition for grounding, abstention, citations, output contracts, bounded tools, null-on-missing, conflict reporting, destructive confirmation, and causal discipline.
- Reworked Gemini judge instructions to score task-relevant quality and distinguish missing best practices from active hallucination risk.
- Added deterministic/Gemini score calibration and task-relevant floors for non-applicable dimensions.
- Added canonical pairwise metrics to benchmark summaries.
- Added calibration regression tests. L1 deterministic validation suite passes 30/30 locally.
