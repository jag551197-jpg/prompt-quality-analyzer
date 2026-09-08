# Community Threat Model

Primary threats:
1. prompt/judge injection;
2. API-cost abuse and bots;
3. secret exposure;
4. XSS/content injection;
5. log leakage;
6. supply-chain compromise;
7. benchmark endpoint abuse.

Controls:
- deterministic evaluator independent from semantic judge;
- explicit untrusted-input isolation in judge policy;
- injection reason codes;
- anonymous rate/quota/concurrency limits;
- protected benchmark API;
- server-side Gemini key only;
- CSP/HSTS/frame/no-sniff headers;
- no prompt bodies in server diagnostic events;
- zero npm runtime dependencies;
- release hashes and automated tests.
