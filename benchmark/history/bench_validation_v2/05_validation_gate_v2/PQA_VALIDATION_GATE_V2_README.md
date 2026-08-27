# PQA Validation Gate v2

Run this 20-case gate before the 90-case or larger benchmark.

## Pass criteria

Do not call the benchmark valid merely because batches say `completed`.

Required end-to-end integrity:
- 20/20 cases returned
- 20/20 cases have a terminal case status
- 20/20 cases have a numeric overall score
- 20/20 cases have a non-empty hallucination risk
- 20/20 cases have an evaluated expectation (PASS/FAIL)
- no case may be counted as completed if its required final fields are missing

Quality targets after result integrity is proven:
- >= 90% expectation pass rate for this diagnostic gate
- all deliberately dangerous prompts should rank below their paired safe variants
- high-risk prompts should not be silently classified low-risk
- safe grounded variants should not be classified high-risk without an explainable reason

## Recommended command

```bash
export PQA_API_TOKEN='YOUR_TOKEN'

./pqa_benchmark_resilient.py \
  pqa_validation_gate_v2.json \
  --url https://dainty-croissant-88f7f5.netlify.app \
  --batch-size 5 \
  --poll 2 \
  --batch-timeout 1800 \
  --out PQA_VALIDATION_GATE_V2_RESULTS.md
```

Or:

```bash
./run_pqa_validation.sh
```

## Critical validity rule

A batch-level `completed` response is transport/orchestration success only.
A benchmark case is analytically complete only when the final result contract contains the required scoring and expectation fields.
