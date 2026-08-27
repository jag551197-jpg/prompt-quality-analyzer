# PQA Full Benchmark v1 — Methodology

**Total cases:** 90

## Category Distribution

| Category | Cases |
|---|---:|
| agent | 12 |
| coding | 15 |
| customer_support | 10 |
| data_analysis | 8 |
| extraction | 10 |
| general | 8 |
| rag | 15 |
| research | 12 |

## Design Principles

- Includes deliberately weak, average, strong, contradictory, and hallucination-prone prompts.
- Covers prompt types commonly used by software-development teams: coding, RAG/document Q&A, research, agent/tool use, structured extraction, customer support, data analysis, and general prompts.
- Expected thresholds are intentionally broad enough to tolerate judge variability while still detecting obvious scoring regressions.
- Hallucination-risk assertions are used only where prompt-level risk is intentionally obvious.
- The benchmark evaluates prompt-quality behavior, not whether the underlying factual task can actually be answered.
- A benchmark failure should trigger review, not automatic conclusion that the analyzer is wrong; some cases are intentionally ambiguous.

## Recommended Run

```bash
export PQA_API_TOKEN='YOUR_TOKEN'
./pqa_benchmark.py pqa_full_benchmark_v1.json \
  --url https://your-site.netlify.app \
  --poll 1 \
  --timeout 1800 \
  --out PQA_FULL_BENCHMARK_V1_RESULTS.md
```

## Interpretation

- **Expectation pass rate:** primary regression indicator.
- **Average score:** descriptive only; the benchmark intentionally mixes weak and strong prompts.
- **Per-category failures:** more useful than global average because rules may over- or under-penalize a specific prompt class.
- **Judge stability:** for calibration, repeat the full suite 3 times and compare score variance by case.
- **False positives/negatives:** manually inspect all failed expectations before changing weights or rubric.

## Suggested Publication Standard

For a public methodology report, publish:
- benchmark JSON
- exact analyzer version
- Gemini judge model/version
- rubric version
- run timestamp
- pass rate
- per-category pass rates
- score variance across repeated runs
- known limitations
- examples where the judge disagreed with human review