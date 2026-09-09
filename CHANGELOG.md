# Changelog

## 1.8.2 — i18n runtime partial-load hotfix
- Prevented the live localization `MutationObserver` from retriggering itself on unchanged translated text.
- Preserved translation of application-driven counters/status text while allowing new dynamic source text to replace stale cached text.
- Added an i18n runtime-safety regression test.

## 1.8.2 — Visible language controls
- Replaced dynamically generated language selector with permanent HTML buttons.
- Added visible/clickable 🇺🇸 EN, 🇧🇷 PT and 🇫🇷 FR controls.
- Added CSP-safe event listeners and explicit mobile/desktop interaction styling.
- Added syntax checks for `public/i18n.js` and regression tests for the physical controls.

## 1.8.2 — Complete Brazilian Portuguese/French localization
- Replaced partial translation with full user-facing locale catalogs.
- Added live translation for dynamic UI through MutationObserver.
- Added professional Brazilian Portuguese terminology throughout the product.
- Added release-blocking PT-BR static UI coverage audit.
- Stable machine/audit identifiers remain unchanged.

## 1.8.2 — Estimated Efficiency Wallet
- Added PQA Savings Model v1.0.
- Added local Estimated Efficiency Wallet with token, AI-cost and retry savings.
- Added Today / This Month / All Time filters and reset.
- Savings are explicitly labeled estimates and include a methodology disclosure.

## 1.8.2 — CSP-safe multilingual corrective release
- Removed inline JavaScript bootstrap blocked by production CSP.
- Removed dynamic inline style writes and replaced them with CSP-safe CSS classes.
- Made the 🇺🇸 EN / 🇧🇷 PT / 🇫🇷 FR selector a permanent header control.
- Added locale and professional output-language instructions to every analysis transaction.
- Added favicon and CSP regression tests.
- Preserved strict `script-src 'self'` and `style-src 'self'`; no `unsafe-inline`.


## 1.8.2 — Community security hardening
- Added evaluator-manipulation, system-prompt extraction, and instruction-hierarchy detection.
- Explicitly isolates analyzed prompt/context as untrusted data in the Gemini judge.
- Added anonymous hosted Gemini daily/rate/concurrency limits.
- Added deterministic endpoint burst limits.
- Added CSP, HSTS, anti-framing, referrer and permissions headers.
- Added supply-chain provenance and threat-model documentation.
- Added security regression tests.
- Community remains prompt-only; commercial context features are absent.

## 1.8.2 — Enterprise reliability portal UX

### Added
- Dark engineering navigation shell with white professional analysis surfaces.
- Reliability scorecards for quality, hallucination risk, confidence, and local trend.
- Real local trend visualization sourced only from the browser transaction ledger; no synthetic enterprise metrics.
- Severity badges tied to the current hallucination-risk result.
- Machine-readable reason-code display.
- Evidence/protective-control panel and detected risk-evidence panel.
- Visible benchmark, engine, rubric, scoring-profile, risk-model, judge, request ID, and timestamp provenance.
- Audit-oriented transaction history showing score and risk for each local analysis.
- Explicit product positioning as **PQA — AI Instruction Reliability**.

### Changed
- Reorganized the analyzer around developer reliability rather than a demo-style three-column layout.
- Moved execution telemetry into a dedicated lifecycle panel.
- Made diagnostic logs and structured Gemini output secondary engineering evidence rather than primary UI.
- Updated all visible/runtime package version references to 1.8.2.

### Evaluation behavior
- No scoring, deterministic-rule, Gemini-judge, benchmark-contract, or risk-fusion behavior changed from 1.5.2.
- Benchmark Suite v4.1 remains the required validation corpus.
- Per release policy, L0–L6 must still be rerun against the deployed 1.8.2 build before new performance claims are published.

## 1.5.2 — Evidence-aware calibration

### Added
- Evidence-aware hallucination risk fusion (`evidence-tiered-v3`).
- Hard HIGH-risk triggers for uncertainty suppression, fabricated citations, and silent conflict guessing.
- Explicit mitigation for current/latest requests that require authoritative retrieval and citations.
- Template-vs-instantiated prompt detection for common placeholder forms.
- Score confidence, risk confidence, score range, evaluation mode, and machine-readable reason codes.
- Regression tests for current research, diagnostic/root-cause reasoning, templates, and hard hallucination triggers.

### Changed
- Current-information risk no longer treats explicit retrieval/grounding as equivalent to ungrounded current facts.
- Risk fusion distinguishes active dangerous instructions from missing optional safeguards.

### Benchmark compatibility
- Designed for PQA Complete Validation Suite v4.1.
- v4.1 preserves the v4.0 200-case regression corpus and adds 100 focused boundary cases.

## 1.5.1 — UI version consistency hotfix
- Corrected stale visible UI version labels.
- Synchronized UI, API health, startup, package metadata, and cache-busting version identifiers.

## 1.5.0 — Task-aware calibration
- Added task-aware scoring profiles for coding, RAG, research, agent/tool use, extraction, customer support, data analysis, and general prompts.
- Added tiered risk concepts and positive-control recognition.
- Added deterministic/Gemini score calibration and true pairwise benchmark metrics.

## 1.4.2 — Benchmark result-contract repair
- Preserved case metadata and canonical final-result lifecycle.
- Added result integrity validation and runner-compatible aliases.
- Fixed the mismatch that allowed completed batches to yield unusable case-level reports.
