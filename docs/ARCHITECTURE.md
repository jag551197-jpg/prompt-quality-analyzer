# Architecture

`src/core` contains provider-independent analysis logic. `src/providers` contains LLM judge adapters. `src/server` is the standard Node/Express runtime. `netlify/functions` is a thin hosting adapter. `public` is a static browser client.

The system degrades safely to deterministic-only analysis if no Gemini key is configured or if the judge call fails. Judge errors are surfaced as metadata without preventing a basic analysis result.
