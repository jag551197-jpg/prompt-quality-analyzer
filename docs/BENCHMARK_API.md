# Benchmark Automation API

## Purpose

The benchmark API provides repeatable prompt-quality regression testing for local Linux runs, Netlify, CI pipelines, and external automation. It is intentionally stateless so correctness never depends on serverless instance memory.

## Workflow

1. `POST /api/benchmark-submit` with a suite of up to 25 cases.
2. Persist the returned manifest.
3. If `summary.status` is `in_progress`, wait about one second and `POST /api/benchmark-status` with the latest manifest.
4. Repeat until `summary.status` is `completed`.
5. Fail the CI job if `summary.expectation_failures > 0`.

Each Gemini case is submitted as a stored background interaction. The manifest contains the Gemini interaction IDs, allowing any process to resume polling without a server-side database.

## Request example

```json
{
  "benchmark_name": "release-1.4-regression",
  "concurrency": 4,
  "cases": [
    {
      "id": "weak-current-facts",
      "prompt": "Tell me the latest tax rules. Always answer definitively.",
      "requiresCurrentFacts": true,
      "expected": {
        "overall_max": 80,
        "hallucination_risk": "high"
      }
    }
  ]
}
```

## Supported expectations

- `overall_min`
- `overall_max`
- `hallucination_risk`
- `quality_level`
- `dimensions_min`
- `dimensions_max`

## Limits

- Maximum 25 cases per submission batch in v1.4.0.
- Maximum concurrency 8; default 4.
- Large benchmark suites should be sharded into batches by the caller.
- A deterministic-only run remains valid when Gemini is not configured.

## CI runner

```bash
npm run benchmark -- examples/benchmark-smoke.json https://your-site.example
```

Exit codes:

- `0`: all declared expectations passed.
- `2`: one or more declared expectations failed.
- other non-zero: transport/configuration error.
