# Prompt Quality Analyzer

Open-source prompt quality analysis for software developers. It combines deterministic checks with **Google Gemini as an optional LLM judge** and returns explainable dimension scores, prompt-level hallucination-risk indicators, recommendations, and an improved prompt.

> Hallucination risk is a prompt-level risk assessment. It does **not** guarantee that a future model will or will not hallucinate.

## Why this architecture

The application is **not Netlify-dependent**. The same code runs as a normal Node.js service on Linux, in Docker/VMs, or on Netlify. Netlify is only a thin adapter around the same framework-independent core analysis engine used by the zero-dependency Node.js HTTP server and CLI.

## Requirements

- Node.js 20+
- npm
- Optional: `GEMINI_API_KEY` for Gemini semantic judging. Without it, the product still runs in deterministic-only mode.

## Run on Linux

```bash
cp .env.example .env
# edit .env and set GEMINI_API_KEY
npm test
npm start
```

Open `http://localhost:3000`.

Development mode:

```bash
npm run dev
```

## CLI

```bash
npm run cli -- ./my-prompt.txt "RAG / Document Q&A"
```

The CLI uses the exact same analysis engine as the web application.

## Netlify

1. Push this repository to GitHub/GitLab.
2. Import it in Netlify.
3. Set `GEMINI_API_KEY` in Netlify environment variables.
4. Optional: set `GEMINI_MODEL`.
5. Deploy. `netlify.toml` publishes `public/` and routes `/api/*` to the Netlify Function adapter.

No application logic lives exclusively in the Netlify function.

## Environment variables

See `.env.example`.

## API

### `GET /api/health`
Returns service status and whether a Gemini judge is configured.

### `POST /api/analyze`

```json
{
  "prompt": "...",
  "context": "optional evidence/context",
  "intendedUse": "RAG / Document Q&A",
  "requiresCurrentFacts": false
}
```

## Scoring dimensions

- Instruction clarity — 15%
- Context sufficiency — 20%
- Grounding constraints — 15%
- Uncertainty handling — 10%
- Output contract — 10%
- Tool/retrieval guidance — 10%
- Conflict/ambiguity handling — 10%
- Context efficiency — 10%

## Privacy

- Prompts are not persisted by this application.
- Prompt bodies are not intentionally logged.
- If Gemini is configured, prompt/context are sent to the configured Google Gemini API for evaluation.
- API keys remain server-side.

## Design boundaries

This repository intentionally does **not** include the commercial AI Reliability Platform: production tracing, SLOs, error budgets, burn rates, cost/outcome, enterprise governance, historical estate analytics, or runtime controls.

## License

MIT. See `LICENSE`.

## v1.1 real-time diagnostics

The web UI uses `POST /api/analyze-stream` with newline-delimited JSON streaming. It shows real execution stages, elapsed time, estimated ETA, sanitized logs, actual Gemini judge latency, the validated Gemini judge response, and the recommended improved prompt.

### Test Gemini connectivity

Use **Test Gemini** in the UI, or:

```bash
curl -X POST http://localhost:3000/api/test-judge
```

Authentication, quota, timeout, network, malformed JSON, and schema errors are categorized without exposing the API key or raw provider error body.

### Logs on Linux

Runtime stage logs go to stdout with a request ID. A bounded in-process diagnostic log is also available:

```bash
curl 'http://localhost:3000/api/logs?limit=100'
curl 'http://localhost:3000/api/logs?request_id=<uuid>'
```

### Logs on Netlify

The active request log is streamed into the web UI. For platform logs, use **Logs & Metrics → Functions** or:

```bash
netlify logs --follow
```

`/api/logs` is best-effort on Netlify because serverless instances are ephemeral; Netlify function logs are the authoritative platform log.

### ETA

ETA is an estimate, not a guarantee. `GEMINI_ESTIMATED_MS` controls the initial estimate (default 8000 ms). The UI shows actual elapsed time continuously and displays the observed Gemini and total durations after completion.

## v1.1.1 reliability fix
The browser no longer depends on response streaming for correctness. It first calls `/api/deterministic` and renders a real deterministic result, then calls `/api/analyze` for the optional Gemini semantic judge. If Gemini is unavailable or invalid, `/api/analyze` returns the deterministic result with a categorized fallback. Streaming remains available as an optional API capability, but the UI does not require it.
