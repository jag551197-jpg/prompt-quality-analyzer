#!/usr/bin/env bash
set -euo pipefail
OWNER="${PQA_GITHUB_OWNER:-jag551197-jpg}"
REPO="prompt-quality-analyzer"
ZIP="${PQA_ZIP:-$HOME/Downloads/PQA_COMMUNITY_V1_7_1_CSP_SAFE_MULTILINGUAL.zip}"
WORK="${PQA_WORK:-$HOME/Downloads/pqa-community-v1.8.0-push}"
for x in gh git npm unzip rsync; do command -v "$x" >/dev/null || { echo "Missing $x"; exit 2; }; done
gh auth status >/dev/null || { echo "Run: gh auth login"; exit 2; }
rm -rf "$WORK"; mkdir -p "$WORK/src"; unzip -q "$ZIP" -d "$WORK/src"
SRC="$(dirname "$(find "$WORK/src" -name package.json -not -path '*/node_modules/*' -print -quit)")"
gh repo clone "$OWNER/$REPO" "$WORK/repo"
rsync -a --delete --exclude=.git "$SRC/" "$WORK/repo/"
cd "$WORK/repo"
npm run check
git add -A
if ! git diff --cached --quiet; then git commit -m "fix: PQA Community v1.8.0 CSP-safe multilingual UI"; git push origin HEAD:main; fi
if ! git rev-parse community-v1.8.0 >/dev/null 2>&1; then git tag -a community-v1.8.0 -m "PQA Community v1.8.0 — CSP-safe multilingual corrective release"; git push origin community-v1.8.0; fi
echo "DONE. Netlify pqa-community should deploy main automatically."
