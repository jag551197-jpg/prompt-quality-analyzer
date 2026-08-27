# GDE Documentation Guide — Prompt Quality Analyzer

## Purpose
Use this repository as evidence of a sustained engineering and community contribution around **Prompt Reliability Engineering with Google Gemini**. The strongest story is not that the project became perfect in one attempt; it is that you built an open, measurable system, discovered failures through validation, corrected the architecture, published the benchmark methodology, and improved calibration while preserving reproducibility.

## Suggested public narrative

### 1. Problem
LLM application teams often evaluate prompts by trial and error. Prompt Quality Analyzer (PQA) explores a more engineering-oriented approach: deterministic checks plus Gemini as an LLM judge, with explainable scoring, hallucination-risk indicators, recommended prompt improvements, asynchronous execution and reproducible benchmarks.

### 2. Google technology depth
Document where Gemini is used, why deterministic analysis is retained, the structured judge contract, asynchronous request/poll lifecycle, failure handling, and how provider credentials remain server-side. When a Vertex AI adapter/reference is published, document it separately rather than implying it existed in earlier releases.

### 3. Engineering evolution
Use `HISTORY.md` and the release commits to show the progression from MVP → observability → resilient async browser jobs → benchmark API → API auth → canonical result contract → task-aware calibration.

### 4. Benchmark transparency
Link directly to the benchmark cases, runner, methodology, scoring/risk logic and immutable results. Explicitly document the early benchmark-contract defect and the later pairwise-metric correction. This demonstrates scientific/engineering integrity rather than weakness.

### 5. Evidence to highlight
For the calibrated run, highlight only claims directly supported by the preserved results, including 100% result integrity and 100% pairwise ranking accuracy in the 40-pair validation set with a large average strong-vs-weak score separation. Present L1/L2/L4/L5 results as ongoing calibration work rather than overstating them.

### 6. Community contribution package
From this repository create:
- flagship technical article: *Prompt Reliability Engineering: Building an Explainable Prompt Quality Analyzer with Gemini as an LLM Judge*
- reproducible tutorial
- architecture/benchmark video walkthrough
- GDG/DevFest talk proposal
- GitHub discussions/issues requesting critique of the rubric and benchmark
- release notes documenting how community feedback changed later versions

### 7. GDE submission evidence checklist
Keep links for:
- GitHub repository and tagged releases
- live demo
- benchmark methodology and result history
- technical articles/tutorials
- video/demo recording
- talks/submissions and attendance evidence
- GitHub issues/PRs/community feedback
- examples of developers using or discussing the project

## What not to claim
Do not claim benchmark-grade absolute accuracy until human-labeled calibration and repeated-run stability are measured. Do not present the early flawed pairwise pass metric as valid; use v4.0 true pairwise accuracy. Do not hide failed cases—use them to show the improvement process.

## Recommended repository landing-page sections
1. What PQA solves
2. Live demo
3. Architecture
4. Prompt-quality dimensions
5. Gemini-as-judge design
6. Deterministic safeguards
7. Benchmark methodology
8. Latest reproducible results
9. Version evolution
10. Limitations and research questions
11. Run locally / deploy on Netlify
12. Contributing

## GDE framing sentence
> PQA is an open-source Prompt Reliability Engineering project that combines deterministic safeguards with Google Gemini as an explainable LLM judge, backed by a versioned, fully published validation methodology and an auditable engineering history.
