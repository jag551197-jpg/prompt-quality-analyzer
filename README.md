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

### `POST /api/deterministic`
Runs the local deterministic analyzer immediately.

### `POST /api/judge-submit`
Submits a true Gemini background interaction and returns `interaction_id` plus the initial Gemini status.

### `GET /api/judge-status?interaction_id=...`
Polls the stored Gemini interaction. This call does not start a new model generation.

### `POST /api/finalize`
Combines the persisted deterministic result with the completed Gemini structured judge result.

### `POST /api/test-judge`
Runs the same background-submit + polling path as production and verifies Gemini connectivity.

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


## v1.3 background Gemini architecture

Gemini generation is no longer held open inside `/api/analyze` and there is no `/api/analyze-stream` endpoint. The browser transaction ledger in IndexedDB performs this durable workflow:

1. Run `/api/deterministic` and persist/render the result immediately.
2. Submit `/api/judge-submit`. The server calls Gemini Interactions with `background: true` and `store: true`, then returns the Gemini Interaction ID.
3. Persist `gemini_interaction_id` in IndexedDB.
4. Poll `/api/judge-status` every second.
5. On `completed`, validate the structured Gemini output and call `/api/finalize`.
6. On refresh/reconnect, resume polling the existing Interaction ID rather than submitting duplicate Gemini work.
7. On permanent Gemini failure or maximum wait, preserve the deterministic result.

The UI displays the Gemini interaction status (`queued`, `in_progress`, `completed`, etc.), estimated progress, elapsed time, retries, local event history, and the final judge response/recommended prompt.

### Logs

Linux logs go to stdout and can also be queried through `/api/logs?request_id=<browser-transaction-uuid>`. On Netlify, use **Logs & Metrics → Functions** or `netlify logs --follow` for authoritative platform logs.

### Privacy

Refresh recovery requires the prompt/context to remain in browser IndexedDB until the user chooses **Clear History**. The application server does not intentionally persist prompts. Gemini Interactions are submitted with `store: true` because background execution requires stored interactions; retention is controlled by the Google project/tier.

## Automated benchmark API

v1.4.0 includes a stateless benchmark API suitable for Netlify, Linux, GitHub Actions, and other CI systems.

### Submit a batch

`POST /api/benchmark-submit`

The request contains up to 25 cases. Each case gets an immediate deterministic baseline and, when Gemini is configured, a background Gemini Interaction ID. The response is the benchmark manifest; clients should persist it.

### Poll a batch

`POST /api/benchmark-status`

Send the latest benchmark manifest back to the endpoint. The server polls only pending Gemini interactions, finalizes terminal cases, applies expected assertions, and returns an updated manifest plus aggregate summary.

This design is intentionally stateless: the API does not depend on Netlify function memory or a server-side database.

### Run from Linux / CI

```bash
npm run benchmark -- examples/benchmark-smoke.json http://localhost:3000
```

Set `PQA_BASE_URL` instead of passing the base URL when preferred. The runner exits with code `2` if any benchmark expectation fails, making it suitable for CI gates.

A case may declare expectations such as:

```json
{
  "expected": {
    "overall_min": 70,
    "overall_max": 95,
    "hallucination_risk": "low",
    "dimensions_min": {"grounding_constraints": 75}
  }
}
```

The benchmark API is for calibration and regression testing. Expected thresholds should be human-reviewed and versioned with the rubric; they are not probabilities of hallucination or correctness.
