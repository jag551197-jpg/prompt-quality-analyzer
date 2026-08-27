# Prompt Quality Analyzer

Open-source prompt quality analysis for software developers. It combines deterministic checks with **Google Gemini as an optional LLM judge** and returns explainable dimension scores, prompt-level hallucination-risk indicators, recommendations, and an improved prompt.

> Hallucination risk is a prompt-level risk assessment. It does **not** guarantee that a future model will or will not hallucinate.

## Why this architecture

The application is **not Netlify-dependent**. The same code runs as a normal Node.js service on Linux, in Docker/VMs, or on Netlify. Netlify is only an adapter around the standard Express application.

## Requirements

- Node.js 20+
- npm
- Optional: `GEMINI_API_KEY` for Gemini semantic judging. Without it, the product still runs in deterministic-only mode.

## Run on Linux

```bash
cp .env.example .env
# edit .env and set GEMINI_API_KEY
npm install
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
