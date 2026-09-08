# PQA Community Supply-Chain Provenance

## Runtime provenance
- PQA application source: project-authored JavaScript/HTML/CSS/Python in this repository.
- Node.js runtime primitives: `node:http`, `node:fs`, `node:path`, `node:crypto`, `node:url`.
- Browser primitives: DOM, Fetch, IndexedDB.
- Semantic evaluator: Google Gemini API when configured by the host or self-hosting user.
- Netlify: optional hosting/runtime adapter.

## Third-party npm packages
The current Community package declares **zero runtime npm dependencies**.

## Prohibited patterns checked before release
- `eval(`
- `new Function`
- `child_process`
- shell/process spawning
- remote script loaders
- encoded executable payloads
- committed API keys/secrets

Static review reduces risk but is not a proof that software is defect- or malware-free.
