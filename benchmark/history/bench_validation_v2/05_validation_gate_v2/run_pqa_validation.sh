#!/usr/bin/env bash
set -euo pipefail

URL="${PQA_BASE_URL:-https://dainty-croissant-88f7f5.netlify.app}"
RUNNER="${PQA_RUNNER:-./pqa_benchmark_resilient.py}"
BENCH="${PQA_BENCHMARK:-./pqa_validation_gate_v2.json}"
OUT="${PQA_OUT:-PQA_VALIDATION_GATE_V2_RESULTS.md}"

if [[ -z "${PQA_API_TOKEN:-}" ]]; then
  echo "ERROR: PQA_API_TOKEN is not set."
  echo "Run: export PQA_API_TOKEN='YOUR_TOKEN'"
  exit 3
fi

if [[ ! -x "$RUNNER" ]]; then
  chmod +x "$RUNNER"
fi

"$RUNNER" "$BENCH" \
  --url "$URL" \
  --batch-size 5 \
  --poll 2 \
  --batch-timeout 1800 \
  --out "$OUT"
