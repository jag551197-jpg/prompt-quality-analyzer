# Requirement Coverage Graph — v1.18.31 / Community v1.14.0

## Purpose

PQA maps explicit requirements and instruction identifiers to evidence found in supplied source code, tests, and runtime-verification status. The graph is an engineering evidence map, not a substitute for executing the application.

## Evidence states

- **Requirement** — explicit identifier extracted from the instruction or supplied requirement artifacts.
- **Source code** — file/line where the identifier is present.
- **Test evidence** — test/spec source where the same identifier is present.
- **Gap** — required identifier was not found in supplied source.
- **Runtime evidence** — remains unverified unless an execution system provides observed evidence. Static analysis does not fabricate runtime proof.

## Metrics

The UI reports code coverage, test-evidence coverage, runtime-verified coverage, and unresolved gaps. Metrics are limited to explicit requirements that PQA can identify precisely; prose-only semantic requirements are not converted into false-precision coverage counts.

## Output

A localized Markdown artifact is generated with a Mermaid graph and evidence matrix. Filenames and content follow the selected interface language. Existing PQA artifact authorship, SHA-256 integrity, and optional HMAC signature controls apply.
