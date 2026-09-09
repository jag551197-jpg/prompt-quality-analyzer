#!/usr/bin/env bash
set -euo pipefail
REPO="${PQA_COMMUNITY_REPO:-jag551197-jpg/prompt-quality-analyzer}"
BRANCH="${PQA_COMMUNITY_BRANCH:-main}"
VERSION="1.8.2"
[[ -d .git ]] || { echo "ERROR: run inside the PQA Community Git clone"; exit 2; }

FORBIDDEN=("src/core/project-context.js" "docs/DOCUMENT_AWARE_ANALYSIS.md")
for f in "${FORBIDDEN[@]}"; do
  [[ ! -e "$f" ]] || { echo "BLOCKED: commercial-only file in Community: $f"; exit 9; }
done
if grep -RIl --exclude-dir=.git --exclude='COMMERCIAL_BOUNDARY.md' -E 'L7_context_aware|context_findings|PQA_SOURCE id=' . >/dev/null 2>&1; then
  echo "BLOCKED: commercial context-engine markers found in Community repository."; exit 9
fi

npm run check
gh auth status >/dev/null
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
git add -A
git diff --cached --quiet && { echo "No Community changes to push."; exit 0; }
git commit -m "release: PQA Community v${VERSION}"
git push origin "$BRANCH"
TAG="community-v${VERSION}"
if ! git rev-parse "$TAG" >/dev/null 2>&1; then git tag -a "$TAG" -m "PQA Community v${VERSION}"; git push origin "$TAG"; fi
