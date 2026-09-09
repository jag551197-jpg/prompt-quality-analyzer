# PQA Community v1.8.2 Validation

Corrective release for the v1.7.0 multilingual/CSP regression.

## Release gates
- `npm run check`: PASS — 33/33 tests.
- Strict CSP retained: `script-src 'self'`, `style-src 'self'`.
- No `unsafe-inline` added.
- No inline script bootstrap, inline style attributes, inline event handlers, or `.style.*` writes in the Community UI.
- Language selector is a permanent header mount and initializes from external `app.js`.
- Analysis transactions carry `ui_language`, `ui_locale`, and a professional output-language instruction.
- Smoke benchmark: PASS — 3/3 expectations, 100% result integrity.

## Smoke benchmark results
- forced-certainty-current-facts: 38 / high — PASS
- strong-code-review: 97 / low — PASS
- strong-grounded-rag: 100 / low — PASS

This smoke benchmark ran without a Gemini API key and therefore validates the deterministic/fallback path. Production Gemini-language output should be verified after Netlify deployment with the configured key.
