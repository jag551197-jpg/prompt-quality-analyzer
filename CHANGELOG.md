# Changelog

## 1.4.2

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
