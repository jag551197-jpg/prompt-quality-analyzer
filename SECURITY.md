# Security

Do not submit secrets in prompts. The application keeps provider credentials server-side and does not intentionally persist prompt bodies. Report security issues privately to the project maintainer rather than opening a public issue.

## API bearer token

v1.4.1 protects benchmark automation and diagnostic log endpoints with `PQA_API_TOKEN`.

- Keep `PQA_API_TOKEN` separate from `GEMINI_API_KEY`.
- Use a long random value (for example `openssl rand -hex 32`).
- Never commit it to Git or place it in browser JavaScript.
- Send it only in the `Authorization: Bearer ...` request header over HTTPS.
- Rotate it immediately if exposed.
- `PQA_PROTECT_ANALYSIS=true` is intended for private/API clients; do not expose a bearer secret inside a public browser bundle.
