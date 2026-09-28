# PQA Community v1.9.1 — Hallucination Risk Explainer

Community v1.9.1 adds the explainable prompt-level hallucination risk model used by Platform v1.18.9 while preserving Quality Engine 3.0 scoring behavior.

It adds a 0–100 risk index, answerability, grounding requirement, current-fact dependency, abstention safety, hallucination pressure, category breakdowns, risk drivers, projected mitigations, execution scenarios, and original-vs-recommended comparison. PQA explicitly reports that this index is **not a calibrated probability**.

No hosted judge is required for the deterministic explanation. No database migration is required.
