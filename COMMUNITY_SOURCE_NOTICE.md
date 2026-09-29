# Community Edition public-source boundary — v1.12.0

PQA Platform v1.18.29 ships a deliberately separated `01-community-public` tree so Community Edition can be maintained and deployed independently without publishing the proprietary commercial engine.

Community v1.12.0 includes public-safe artifact inventory/classification, execution-readiness gating, multi-file text/code upload, PQA Guard scanning, generated execution-package support, and signed-download plumbing. These capabilities are implemented without exposing the private commercial scoring/calibration engine, private token-efficiency coefficients, billing implementation, private benchmarks, or other proprietary server-side calibration logic.

Community files remain subject to the central private security-control-plane preflight before their content enters analysis. The browser does not receive server signing keys or control-plane secrets.

Keep `02-commercial-platform-private` in a private repository. The Community deployment script targets `jag551197-jpg/prompt-quality-analyzer` by default and retains public/private boundary checks before publishing.
