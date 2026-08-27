# Prompt Quality Analyzer — Engineering Evolution

This archive preserves the development sequence from the first open-source MVP through the calibrated benchmark release. The intent is to make the public Git history reproducible, transparent, and suitable as evidence of technical depth for a Google Developer Expert (GDE) journey.

## Application sequence

1. **v1.0.0 — Initial MVP**: deterministic analysis + Gemini judge + portable server/CLI/Netlify foundation.
2. **v1.1.0 — Observability**: richer Gemini integration, logging, UI and architecture documentation.
3. **v1.1.1 — Reliability refinement**: analysis/server and UI reliability improvements.
4. **v1.2.0 — Browser job persistence**: IndexedDB/job manager and asynchronous recovery model.
5. **v1.3.0 — Gemini async hardening**: stronger request/poll lifecycle after stream-ending failures.
6. **v1.4.0 — Benchmark API**: machine-driven benchmark submit/status automation and examples.
7. **v1.4.1 — API security**: bearer token protection for benchmark/log APIs.
8. **v1.4.2 — Result-contract fix**: canonical case schema and analytical completion semantics.
9. **v1.5.0 — Calibration**: task-aware weights, evidence-tiered risk fusion, genuine pairwise metrics.
10. **v1.5.1 — UI version hotfix**: visible/runtime version consistency; no scoring change.

## Benchmark sequence

The benchmark evolved separately from the application and should be versioned independently. The folders under `02_BENCHMARK_EVOLUTION/` preserve that history.

A key engineering lesson was that orchestration completion is not analytical completion. Early validation runs exposed a schema mismatch where batches were terminal but final scores/risk values were not surfaced. v1.4.2 introduced a canonical result contract. Later validation then exposed calibration rather than plumbing defects, leading to v1.5.0 task-aware scoring and v4.0 true pairwise metrics.

## Integrity rule
Never rewrite historical benchmark outputs after changing scoring or benchmark logic. Publish a new application version and/or benchmark version, retain the previous result, and explain the reason for the change.
