# PQA v1.5.2 Calibration Design

This release targets the residual errors found in v1.5.1 + Benchmark v4.0.

## Risk tiers
1. **Explicit danger**: forced certainty, unsupported guessing, citation fabrication, uncertainty suppression, silent conflict guessing, unsafe destructive action, causal overclaim, unbounded tools. These are HIGH.
2. **Contextual exposure**: current facts, external factual claims, diagnosis/root cause, RAG/document tasks. These require evidence-aware evaluation.
3. **Protective controls**: authoritative retrieval, grounding, citations, abstention, conflict reporting, bounded tools, null-on-missing, causal discipline.

Protective controls may mitigate contextual exposure but never cancel explicit dangerous instructions.

## Template mode
Reusable developer templates containing placeholders are evaluated as templates. The analyzer judges whether the template defines the input contract and safe behavior rather than treating placeholder values as absent runtime data.

## Result contract additions
- `score_confidence`
- `score_range`
- `risk_confidence`
- `evaluation_mode`
- `reason_codes`
