# PQA Community Edition v1.12.0 — Artifact-Grounded Execution Readiness

Community Edition now supports a production-oriented multi-file execution-readiness workflow while keeping the public engine boundary intact.

- Up to 5 supported text/code files may be uploaded.
- Every uploaded file must pass PQA Guard and central server-side scanning before entering analysis context.
- Files can be removed or explicitly replaced.
- Requirements files are classified from content rather than assumed to be code.
- Coding requests without source code or an accessible repository/archive reference are explicitly gated.
- A repository URL is treated as an unverified pointer, not proof that repository contents were inspected.
- Recommended prompts and generated execution packages require grounding, traceability, tests and complete outputs.
- Community starts clean: analysis metrics/results remain hidden until processing begins.
- Generated Markdown downloads carry PQA authoring/integrity metadata and can receive an HMAC-SHA256 authenticity signature when `PQA_ARTIFACT_SIGNING_SECRET` is configured server-side.
- Deterministic execution package templates support EN, PT-BR and FR.

See the top-level `EXECUTION_READINESS_GUIDE_V1_18_29.md` in the product-family release for deployment and verification guidance.
