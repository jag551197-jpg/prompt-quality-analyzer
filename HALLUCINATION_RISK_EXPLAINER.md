# PQA Hallucination Risk Explainer

PQA distinguishes **risk estimation** from **probability estimation**.

## What PQA reports now
- `hallucination_risk`: compatible categorical signal (`low`, `medium`, `high`).
- `hallucination_risk_index`: explainable 0–100 prompt-level engineering index.
- `hallucination_probability`: `null` until empirically calibrated.
- `hallucination_analysis`: detailed answerability, grounding, temporal, abstention, pressure, category, driver, mitigation, scenario, and remediation evidence.

## What the index means
The index summarizes observable conditions that make unsupported output more likely: forced certainty, prohibition of abstention, guessing, citation fabrication, current facts without retrieval, missing context, ambiguity, exactness pressure, and conflicting evidence. Explicit grounding, safe abstention, citations, retrieval, supplied context, and conflict-reporting reduce the index.

It is **not** the probability that the next response will hallucinate.

## Why probability remains unavailable
A defensible probability requires response-level labeled outcomes and calibration by at least:
1. model and model version;
2. domain/use case;
3. retrieval/tool availability;
4. supplied evidence state;
5. execution settings and system instructions.

Until that data exists, PQA fails honestly: probability is `null` and the UI says **NOT CALIBRATED**.

## Scenario sensitivity
PQA can still explain how risk changes under execution assumptions such as model-only, authoritative retrieval, or sufficient supplied evidence. These are projected engineering indices, not empirical probabilities.
