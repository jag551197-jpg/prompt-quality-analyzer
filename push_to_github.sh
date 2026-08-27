#!/usr/bin/env bash
set -euo pipefail
REPO="${PQA_GITHUB_REPO:-jag551197-jpg/prompt-quality-analyzer}"
BRANCH="${PQA_GITHUB_BRANCH:-main}"
VERSION="1.5.2"
BENCHMARK_VERSION="4.1"

command -v git >/dev/null || { echo "git is required"; exit 1; }
command -v gh >/dev/null || { echo "GitHub CLI (gh) is required"; exit 1; }
gh auth status >/dev/null

if [[ ! -d .git ]]; then
  echo "Run this script from a clone of $REPO"
  exit 1
fi

git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
git add -A
git diff --cached --quiet && { echo "No changes staged."; exit 0; }

git commit -m "release: PQA v${VERSION} evidence-aware calibration

- evidence-aware risk fusion
- hard hallucination triggers
- current-source mitigation
- template-aware evaluation
- score/risk confidence and reason codes
- Benchmark v${BENCHMARK_VERSION} compatibility"

git tag -a "v${VERSION}" -m "PQA v${VERSION}"
git push origin "$BRANCH"
git push origin "v${VERSION}"

echo "Pushed PQA v${VERSION} to https://github.com/${REPO}"
