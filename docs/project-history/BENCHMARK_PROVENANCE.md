# Benchmark Provenance and Reproducibility Policy

Everything that materially influences a published benchmark claim must be public in the repository.

For every run preserve:
- application version and commit SHA
- benchmark suite version
- runner version
- every benchmark prompt/case ID/category
- expected checks and pair definitions
- deterministic rules and task-specific scoring weights
- hallucination-risk rules/fusion logic
- Gemini judge system instructions and structured-output schema
- judge provider/model identifier and configurable generation parameters
- batch size, poll interval, timeout/retry behavior
- raw or lossless case results where available
- generated Markdown report
- execution timestamp
- result-integrity rate
- known benchmark defects or methodology changes

## Never hide benchmark evolution
If a benchmark bug is discovered, retain the old results, mark the methodology limitation, fix it in a new benchmark version, and rerun. The correction itself is useful engineering evidence.

## Metrics to publish separately
Do not collapse everything into one accuracy number. Publish result integrity, deterministic expectation agreement, semantic judge agreement, pairwise ranking accuracy and average delta, hallucination-risk detection/false-positive behavior, robustness agreement, latency/retry/timeout statistics, and human/PQA agreement when human labels are added.
