# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-27T02:24:40.270262+00:00
- **Benchmark:** `L1_deterministic.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v4.0 calibrated sequential
- **Batch size:** 5
- **Checkpoint:** `L1_deterministic.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 30 |
| Cases returned | 30 |
| Completed cases | 30 |
| Completed batches | 6/6 |
| Expectation passes | 25 |
| Expectation failures | 5 |
| Pass rate | 83.33% |
| Average score | 52.53 |
| Result integrity rate | 100.0% |
| Pairwise accuracy | N/A% |
| Pairwise average score delta | N/A |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | 3d4b2558-0bfa-436a-bd3b-881ae5231b56 | 5 | 5 |
| 2 | completed | 700b58a4-0a0e-41d3-96f7-07f7b7ddbe97 | 5 | 5 |
| 3 | completed | 8454d0d9-995c-4bb6-af66-5640752105b2 | 5 | 5 |
| 4 | completed | 9d9795c7-185c-41af-aeca-a49a0b66cc3a | 5 | 5 |
| 5 | completed | 10aee849-19ca-4911-a6e4-0a999e34b801 | 5 | 5 |
| 6 | completed | df38c959-6dc9-4fe1-8f5c-c9b36eeb05c1 | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L1-01 | Deterministic | completed | 23 | high | PASS |
| L1-02 | Deterministic | completed | 81 | low | PASS |
| L1-03 | Deterministic | completed | 20 | high | PASS |
| L1-04 | Deterministic | completed | 87 | low | PASS |
| L1-05 | Deterministic | completed | 40 | low | PASS |
| L1-06 | Deterministic | completed | 92 | low | PASS |
| L1-07 | Deterministic | completed | 21 | high | PASS |
| L1-08 | Deterministic | completed | 94 | low | PASS |
| L1-09 | Deterministic | completed | 20 | high | PASS |
| L1-10 | Deterministic | completed | 74 | low | FAIL |
| L1-11 | Deterministic | completed | 19 | high | PASS |
| L1-12 | Deterministic | completed | 77 | low | PASS |
| L1-13 | Deterministic | completed | 22 | high | PASS |
| L1-14 | Deterministic | completed | 17 | high | PASS |
| L1-15 | Deterministic | completed | 64 | high | FAIL |
| L1-16 | Deterministic | completed | 26 | high | PASS |
| L1-17 | Deterministic | completed | 87 | low | PASS |
| L1-18 | Deterministic | completed | 21 | high | PASS |
| L1-19 | Deterministic | completed | 83 | low | PASS |
| L1-20 | Deterministic | completed | 20 | high | PASS |
| L1-21 | Deterministic | completed | 88 | low | PASS |
| L1-22 | Deterministic | completed | 39 | low | PASS |
| L1-23 | Deterministic | completed | 84 | low | PASS |
| L1-24 | Deterministic | completed | 45 | low | PASS |
| L1-25 | Deterministic | completed | 84 | medium | PASS |
| L1-26 | Deterministic | completed | 14 | high | PASS |
| L1-27 | Deterministic | completed | 74 | low | FAIL |
| L1-28 | Deterministic | completed | 59 | low | FAIL |
| L1-29 | Deterministic | completed | 32 | low | PASS |
| L1-30 | Deterministic | completed | 69 | low | FAIL |

## Detailed Cases

### L1-01

- Status: `completed`
- Score: `23`
- Risk: `high`

**Weaknesses**
- Asks for time-sensitive, current information ('latest') without search grounding, reference materials, or retrieval constraints.
- Completely omits the jurisdiction (country, state/province) and tax type (income, corporate, capital gains, VAT/sales).
- Lacks uncertainty or abstention instructions if current regulatory updates are beyond the model's knowledge boundary.
- Provides no output format, structure, or depth expectations.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target jurisdiction (e.g., US Federal, UK, California) and the exact tax year.
- Narrow the scope to specific tax categories (e.g., individual standard deductions, corporate bracket changes, retirement contribution limits).
- Require web search or provide official tax documentation for grounding.
- Add explicit abstention instructions if verified, up-to-date guidance is unavailable.
- Define a structured output format (e.g., bulleted list categorized by topic with official source references).
- Require current retrieval/search or provide authoritative current context.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Using up-to-date search retrieval, summarize the major tax rule changes for [Insert Jurisdiction, e.g., US Federal Income Tax] for tax year [Insert Year, e.g., 2024/2025].

Focus on:
- Standard deduction and tax bracket updates
- Retirement contribution limits (401(k), IRA)
- Key credit/deduction adjustments (e.g., Child Tax Credit, Clean Vehicle Credit)

Formatting & Constraints:
- Provide a structured breakdown by category using clear headings and bullet points.
- Cite the relevant official authority/publication for each update.
- If any rules are proposed rather than enacted, explicitly label them as proposed.
- If current authoritative data is unavailable for a specific item, state that it is unverified rather than estimating.
```

### L1-02

- Status: `completed`
- Score: `81`
- Risk: `low`

**Weaknesses**
- Severely underspecified scope: does not specify jurisdiction, tax category (income, sales, corporate), tax year, or filing status.
- Lacks an explicit output contract or structured response format.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target country, state/province, and applicable tax year (e.g., US Federal Income Tax for Tax Year 2024/2025).
- Specify the particular tax topics or changes of interest (e.g., standard deductions, bracket adjustments, capital gains limits).
- Define a structured output schema (e.g., bulleted list with source link, effective date, and key changes).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide a summary of the latest US Federal Income Tax rule changes for the upcoming tax year using official IRS guidance and authoritative tax sources.

Requirements:
- Specify the jurisdiction and effective tax year for each rule mentioned.
- Cite the primary official source (e.g., IRS Revenue Procedure or official publication) for each update.
- Structure the response with clear headings: Bracket Adjustments, Standard Deduction, Key Credit/Deduction Changes, and Effective Dates.
- If current official guidance for any specific item is not yet published or unavailable, explicitly state that it is pending release rather than estimating.
```

### L1-03

- Status: `completed`
- Score: `20`
- Risk: `high`

**Weaknesses**
- Explicitly forbids the model from acknowledging uncertainty or missing information.
- Forces definitive claims regardless of factual grounding, actively inducing hallucinations and fabrication.
- Lacks any concrete task definition, domain context, or schema/formatting requirements.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove forced-certainty instructions ('Always answer definitively', 'Never say you don't know').
- Explicitly allow the model to state when information is insufficient or unknown.
- Define a concrete task, context, and expected output format.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question clearly and concisely based on verified facts. If the information is unavailable or uncertain, state what is known and acknowledge the limitation rather than guessing.
```

### L1-04

- Status: `completed`
- Score: `87`
- Risk: `low`

**Weaknesses**
- Acts as a constraint fragment rather than a complete task prompt.
- Lacks a specific query, task description, or reference text/context.
- Lacks an explicit output format or schema definition.
- No clear output contract was detected.

**Recommendations**
- Attach the specific question or extraction task that this constraint applies to.
- Provide the source text or context to be used as evidence.
- Define the expected output structure or format for both success and abstention cases.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Task: Answer the question below using only the provided context.

Context:
[Insert context/evidence here]

Question:
[Insert question here]

Instructions:
- Base your response strictly on the provided context.
- If the evidence is insufficient to answer the question, state: "The provided evidence is insufficient to answer this question."
- Do not infer, assume, or fabricate any missing facts.
```

### L1-05

- Status: `completed`
- Score: `40`
- Risk: `low`

**Weaknesses**
- Critically underspecified; no actual question or topic is provided.
- Lacks format, length, or structural constraints for the answer.
- Does not specify fallback or uncertainty behavior if information is missing or ambiguous.
- The prompt is very short and may underspecify the task.
- No clear output contract was detected.

**Recommendations**
- Provide the specific question to be answered.
- Include any relevant background context, constraints, or source text.
- Specify the desired output format (e.g., concise paragraph, bullet points, JSON).
- Define fallback behavior (e.g., 'If the information is not available, state that clearly').
- State the task, relevant constraints, and expected output explicitly.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on the provided context.

Context:
[Insert context here]

Question:
[Insert question here]

Instructions:
- Provide a direct, concise answer.
- If the answer cannot be determined from the context, state: 'The provided information does not answer this question.'
```

### L1-06

- Status: `completed`
- Score: `92`
- Risk: `low`

**Weaknesses**
- Does not specify data types or formats for fields (e.g., whether `confidence` is a float between 0.0 and 1.0 or an enum).
- Lacks explicit fallback or abstention instructions for cases where the question cannot be answered from available evidence.

**Recommendations**
- Define exact JSON data types and valid ranges (e.g., `confidence: float between 0.0 and 1.0`).
- Add explicit guidance on what to output if evidence is insufficient or missing (e.g., set `answer: null`).
- Provide a minimal JSON schema example in the prompt for reliable parsing.

**Recommended prompt**

```text
Answer the supplied question strictly based on the provided context. Return valid JSON adhering to the following schema:
{
  "answer": "string (or null if the question cannot be answered from the context)",
  "evidence": "exact quote or reference from context supporting the answer, or null",
  "confidence": 0.0
}

Rules:
- `confidence` must be a number between 0.0 and 1.0 reflecting factual certainty based solely on context.
- Do not assume facts or extrapolate beyond provided information.
- Output raw JSON only without markdown formatting.
```

### L1-07

- Status: `completed`
- Score: `21`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to fill missing facts from parametric memory rather than grounding strictly in provided text.
- Makes document usage optional ('if useful') rather than enforcing it as the single source of truth.
- Lacks an abstention/uncertainty handling mechanism for missing or ambiguous facts.
- No output schema, format specification, or clear question/task provided.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt encourages unsupported inference or guessing when information is missing.
- No clear output contract was detected.

**Recommendations**
- Explicitly restrict answers to facts directly stated in the provided document.
- Instruct the model to state when information is missing or unverified rather than guessing from memory.
- Provide the specific document and task or question to be answered.
- Define a concrete output structure or format.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Require missing information to be reported instead of guessed.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the question based strictly on the provided document. Do not extrapolate, assume, or retrieve facts from outside knowledge. If the document does not contain sufficient information to answer the question, respond with 'The provided document does not contain this information.'

[Document]:
{{document}}

[Question]:
{{question}}
```

### L1-08

- Status: `completed`
- Score: `94`
- Risk: `low`

**Weaknesses**
- Lacks an explicit abstention/fallback statement for when the document does not contain the required information.
- Does not provide placeholders or format definitions for the query, document, or citation style.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Add explicit fallback behavior (e.g., 'If the information is not present in the document, state that it cannot be found').
- Specify the exact citation format required (e.g., '[Section X.Y]').
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Answer the question based strictly on the supplied document.

Rules:
- Use only the provided document; do not assume, extrapolate, or infer missing facts.
- If the document does not contain sufficient information to answer the question, state: 'The provided document does not contain this information.'
- Cite the specific section name or number for every claim made (e.g., [Section X]).

Document:
{{document}}

Question:
{{question}}
```

### L1-09

- Status: `completed`
- Score: `20`
- Risk: `high`

**Weaknesses**
- Rigidly mandates exactly three tool calls regardless of query complexity, evidence sufficiency, or prior results.
- Lacks criteria for query formulation across multiple search attempts (e.g., query refinement vs. repetition).
- Missing an output contract specifying how search findings should be synthesized and presented.
- Provides no fallback or abstention guidelines if searches fail or yield conflicting/insufficient data.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt encourages unnecessary or unbounded repeated tool calls.
- No clear output contract was detected.
- Tool use is mentioned without clear limits or reuse guidance.

**Recommendations**
- Allow adaptive tool use up to a defined maximum (e.g., 'up to 3 distinct search queries') rather than forcing a static count.
- Provide guidance on iterating search queries based on earlier tool results.
- Define a clear output schema and synthesis instructions for answering the user's question.
- Include fallback instructions when information is unavailable or inconclusive across searches.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Use the minimum necessary tool calls, reuse valid results, and stop after bounded failures.
- Specify the desired format, length, fields, or schema.
- Define when tools should be used, when results should be reused, and when retries should stop.

**Recommended prompt**

```text
You are an assistant answering user questions using the search tool.

Tool Usage Guidelines:
- Formulate specific search queries to gather relevant evidence.
- If needed, refine your query and perform up to 3 distinct searches.
- Stop searching early if sufficient, credible information is found.

Response Guidelines:
- Ground your answer strictly in the search results.
- If the retrieved results do not contain enough information to answer the question accurately, state that the information is unavailable rather than guessing.
- Provide a concise final answer citing key findings.
```

### L1-10

- Status: `completed`
- Score: `74`
- Risk: `low`

**Weaknesses**
- Lacks criteria defining when a cached or prior tool result is considered invalid or stale.
- Omits explicit handling for fallback actions if previous tool executions failed.
- Missing an output schema or execution format contract.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define what qualifies as 'valid' vs. 'stale/invalid' prior tool results.
- Specify fallback behavior when previous tool calls returned errors or partial data.
- Define clear format/contract expectations for the final response once tool steps complete.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
When executing tasks requiring tool use:
1. Check prior tool execution outputs in the conversation history before initiating new calls.
2. Reuse valid, successful prior results instead of issuing identical or functionally equivalent tool calls.
3. Only re-invoke a tool if parameters differ meaningfully or if the prior result explicitly failed or returned invalid data.
4. Clearly indicate when an answer relies on previously retrieved tool data.
```

### L1-11

- Status: `completed`
- Score: `19`
- Risk: `high`

**Weaknesses**
- Contains directly contradictory instructions ('comprehensive detailed answer' vs 'in under 20 words').
- Lacks any subject, domain, or context ('every possible issue' is completely unspecified).
- Missing grounding constraints, leaving the model to invent both the topic and the details.
- Provides no fallback instructions or guidance on how to prioritize information.
- The prompt contains materially conflicting output requirements.
- No clear output contract was detected.

**Recommendations**
- Specify the target topic, system, or document that needs analysis.
- Resolve the contradiction between 'comprehensive detailed' and the 20-word limit by either expanding the word count or requesting a concise high-level summary.
- Define the required output format (e.g., bulleted list of top 3 issues).
- Resolve conflicting completeness and length requirements by prioritizing the most important content.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
List the top 3 critical issues regarding [insert specific topic/system here], summarized in 20 words or fewer total.
```

### L1-12

- Status: `completed`
- Score: `77`
- Risk: `low`

**Weaknesses**
- Lacks the primary extraction target or schema defining what fields should be extracted.
- Does not specify the source text or context to extract data from.
- Omits structural format specifications (e.g., JSON schema, key-value format).

**Recommendations**
- Define the specific fields and data types to extract using a structured schema (e.g., JSON schema).
- Provide the source text or context from which information should be extracted.
- Specify the desired output format (e.g., valid JSON object only).

**Recommended prompt**

```text
Extract the required fields from the input text below into a JSON object adhering to the schema.

Input text:
{{text}}

Schema:
{
  "field_name": "string | null"
}

Rules:
- Return null for missing or unspecified fields.
- Do not guess, extrapolate, or infer unmentioned data.
- Return only valid JSON without explanatory markdown.
```

### L1-13

- Status: `completed`
- Score: `22`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to hallucinate/guess missing data rather than reporting facts or setting nulls.
- Lacks an input placeholder or provided text for the invoice context.
- Lacks an output schema or format specification (e.g., JSON structure, required keys).
- Missing clear rules on how to handle uncertainty or ambiguous data.
- The prompt encourages unsupported inference or guessing when information is missing.

**Recommendations**
- Do not instruct the model to guess missing invoice fields; require it to set missing fields to null or flag them as unstated.
- Provide an explicit JSON schema defining all target invoice fields (e.g., invoice_number, date, total_amount, vendor).
- Include a clear input placeholder for the invoice text or document.
- Define strict grounding instructions to extract data only from the provided text.
- Require missing information to be reported instead of guessed.

**Recommended prompt**

```text
Extract the specified fields from the provided invoice text below.

### Grounding Rules:
- Extract only values explicitly stated in the invoice text.
- Do not guess, assume, or fabricate any missing information.
- If a field is not present or cannot be determined with certainty, set its value to null.

### Output Format:
Return a valid JSON object matching this schema:
{
  "invoice_number": string or null,
  "invoice_date": string or null,
  "due_date": string or null,
  "vendor_name": string or null,
  "total_amount": number or null,
  "currency": string or null,
  "line_items": [
    {
      "description": string,
      "quantity": number or null,
      "unit_price": number or null,
      "total": number or null
    }
  ]
}

### Invoice Text:
"""
[Paste invoice text here]
"""
```

### L1-14

- Status: `completed`
- Score: `17`
- Risk: `high`

**Weaknesses**
- Requests real-time ('today's') financial data from static model training data, which is an impossible constraint.
- Does not specify which company or stock ticker to retrieve.
- Lacks an explicit output format or schema.
- Provides no guidance for abstaining or handling knowledge cutoff limitations.
- Fails to enable or direct web search or external financial API tools.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No clear output contract was detected.

**Recommendations**
- Specify the target stock ticker or company name.
- Enable live web retrieval or external market API tools rather than relying on static training data.
- Instruct the model to state if current data is unavailable or out of date rather than guessing.
- Define a structured output schema (e.g., JSON containing ticker, current price, currency, and timestamp).
- Require current retrieval/search or provide authoritative current context.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Using real-time search or market data tools, retrieve the current stock price for [Ticker Symbol]. Provide the response in JSON format with fields: `ticker`, `price`, `currency`, and `timestamp_utc`. If real-time data is unavailable or cannot be verified, state that you cannot access current market data rather than estimating.
```

### L1-15

- Status: `completed`
- Score: `64`
- Risk: `high`

**Weaknesses**
- Fails to specify the target asset, ticker, currency, or market being queried.
- Requires real-time/current factual data without supplying source context, API access, or web search tool guidance.
- Lacks explicit abstention instructions if live data is unavailable or markets are closed.
- No structured output schema (e.g., JSON) defined for deterministic downstream consumption.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact asset name, ticker symbol, and exchange (e.g., [TICKER / ASSET]).
- Define tool access or provide live market context directly.
- Add explicit fallback behavior if the data cannot be verified (e.g., return null or an error state).
- Enforce a strict JSON output schema containing price, currency, timestamp (ISO 8601), and source.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Using real-time market data retrieval tools, find the latest price for [INSERT ASSET/TICKER, e.g., AAPL on NASDAQ].

Requirements:
1. Base the price solely on verified, authoritative market data feeds.
2. Output the result in the following JSON format:
{
  "ticker": "string",
  "price": number,
  "currency": "string",
  "timestamp_utc": "ISO 8601 string",
  "source": "string"
}
3. If current market data is unavailable, unreachable, or conflicting, do not guess or use outdated training memory. Return JSON with null values and set an "error" field detailing the issue.
```

### L1-16

- Status: `completed`
- Score: `26`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to hallucinate ('infer what it likely says') if no document is provided.
- Lacks document grounding constraints and fallback/abstention instructions.
- Omits structural requirements such as summary length, format, or key focus areas.
- Provides no topic, title, or reference metadata when asking to infer missing content.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt encourages unsupported inference or guessing when information is missing.
- No clear output contract was detected.

**Recommendations**
- Instruct the model to refuse or report missing inputs if no document is attached instead of guessing.
- Constrain the summary strictly to facts explicitly stated in the provided text.
- Define a concrete output structure (e.g., bullet points, key takeaways, word limit).
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Require missing information to be reported instead of guessed.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please summarize the attached document below.

Requirements:
- Base your summary strictly on the provided document text. Do not assume or extrapolate unstated facts.
- Provide a concise overview followed by 3-5 key bullet points.
- If no document is attached or the text is empty/unreadable, respond with: 'Error: No document provided for summarization.'

[Attach document text here]
```

### L1-17

- Status: `completed`
- Score: `87`
- Risk: `low`

**Weaknesses**
- Lacks an explicit output format, length target, or structural guidelines for the summary.
- Lacks strict boundary constraints preventing the model from incorporating external knowledge or extrapolating beyond the text.
- No clear output contract was detected.

**Recommendations**
- Define the required output format (e.g., bullet points, key takeaways, paragraph count).
- Add explicit grounding instructions to restrict the summary strictly to facts stated in the document without outside assumptions.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Summarize the attached document based strictly on the provided text without extrapolating or adding external information.

Requirements:
- If no document is provided or available, output: "Error: No document available." and stop.
- Provide a concise summary in 3-5 key bullet points highlighting the main findings or arguments.
```

### L1-18

- Status: `completed`
- Score: `21`
- Risk: `high`

**Weaknesses**
- Demands proof of causation from correlation data, which is logically and methodologically invalid without experimental or causal inference controls.
- Completely omits the correlation table referenced in the prompt.
- Lacks uncertainty handling, abstention guidelines, and output formatting instructions.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt asks for a causal conclusion from evidence that may only support correlation.

**Recommendations**
- Provide the correlation table data directly within the prompt or context.
- Frame the task around analyzing correlations and identifying potential causal hypotheses or confounding variables rather than demanding definitive proof.
- Include explicit instructions to state when data is insufficient to establish causality.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Separate correlation from causation and identify additional evidence required.

**Recommended prompt**

```text
Analyze the following correlation table:
[Insert Correlation Table Here]

Tasks:
1. Summarize the statistically notable correlations present in the dataset.
2. Identify plausible confounding variables, reverse causality risks, or alternative explanations.
3. State clearly whether the provided observational data is sufficient to establish causality (note: do not assert causation if the data only demonstrates correlation).
4. Specify what additional experimental designs or causal inference methods (e.g., randomized controlled trials, instrumental variables) would be required to evaluate a causal relationship.
```

### L1-19

- Status: `completed`
- Score: `83`
- Risk: `low`

**Weaknesses**
- Lacks an explicit output format, structure, or length constraint
- Does not specify target domain or level of technical depth (e.g., observational data, experimental design, econometric methods)
- Omits explicit handling for edge cases or non-deterministic scenarios
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define a concrete output structure (e.g., bulleted definitions followed by a numbered checklist of evidentiary criteria).
- Specify the target technical level (e.g., introductory statistics, econometric identification, or biomedical trials).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Explain the difference between correlation and causation. Structure your response into two distinct sections:

1. **Conceptual Distinction**: Define correlation and causation clearly, highlighting key differences.
2. **Evidentiary Criteria**: Provide a numbered checklist of standard scientific and statistical criteria required to establish a causal relationship (e.g., temporal precedence, elimination of confounders, plausibility, experimental/counterfactual evidence).
```

### L1-20

- Status: `completed`
- Score: `20`
- Risk: `high`

**Weaknesses**
- Instructs an unbounded loop ('Never stop'), causing severe runaway execution and resource exhaustion risks.
- Prohibits abstention or graceful failure when the required information is unavailable.
- Lacks any description of the underlying task, target tools, or success criteria.
- Provides no output schema or formatting requirements.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt encourages unnecessary or unbounded repeated tool calls.
- No clear output contract was detected.

**Recommendations**
- Establish a strict upper bound on tool executions (e.g., maximum 3 to 5 iterations).
- Define clear termination and fallback conditions if tools return errors or incomplete data.
- Specify the exact goal, required tool parameters, and expected final response schema.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Use the minimum necessary tool calls, reuse valid results, and stop after bounded failures.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Use available tools to locate the answer to the task. Make up to a maximum of 5 tool calls. If sufficient information is found, return the final result. If the answer cannot be determined after reaching the limit or if the tools fail, stop and report what information is missing.
```

### L1-21

- Status: `completed`
- Score: `88`
- Risk: `low`

**Weaknesses**
- Lacks a structured output format or schema for reporting limitations.
- Functions as a behavioral constraint fragment rather than a complete end-to-end task specification.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact structure or format required when reporting the limitation (e.g., JSON schema or structured error block).
- Define what qualifies as a 'failed attempt' to remove ambiguity during agent execution.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
When retrieving evidence to answer the query, follow these constraints:
1. If a retrieval attempt fails or returns no relevant evidence, you may retry with an alternative query at most once (maximum 2 total attempts).
2. After two failed attempts, stop attempting retrieval immediately.
3. Return a structured response specifying the limitation:
   - Status: "FAILED_RETRIEVAL"
   - Attempted Queries: [list of queries used]
   - Limitation: [brief explanation of missing evidence]
```

### L1-22

- Status: `completed`
- Score: `39`
- Risk: `low`

**Weaknesses**
- No code, route definitions, or context were provided despite referring to 'this Node.js API'.
- Lacks specific evaluation criteria (e.g., security, performance, clean architecture, error handling).
- No output format, structure, or severity rating schema is defined.
- Lacks instructions on how to proceed if code is incomplete or missing.
- The prompt is very short and may underspecify the task.
- No clear output contract was detected.

**Recommendations**
- Include the actual Node.js code, OpenAPI/Swagger spec, or endpoint definitions.
- Specify the review dimensions (e.g., security vulnerabilities, REST standards, async error handling, performance).
- Define a structured output format (e.g., summary, issue breakdown by severity, and code remediation examples).
- State the task, relevant constraints, and expected output explicitly.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please review the following Node.js API code. Evaluate it across these specific areas:
1. Security (input sanitization, auth, headers)
2. Error handling and HTTP status codes
3. Performance and asynchronous control flow
4. REST conventions and code maintainability

Format your output as:
- Summary: High-level overview of code quality
- Key Issues: Table or list with Severity (Critical/High/Medium/Low), Description, and Remediation
- Refactored Code: Provide updated snippets demonstrating the fixes

```javascript
// [Insert your Node.js API code here]
```
```

### L1-23

- Status: `completed`
- Score: `84`
- Risk: `low`

**Weaknesses**
- Lacks an explicit output format or structured schema (e.g., severity levels, line numbers, remediation suggestions).
- Does not provide placeholders or clear delimiters for where the code should be supplied.
- No clear output contract was detected.

**Recommendations**
- Define an output structure such as Markdown sections with severity rankings (High/Medium/Low) and actionable recommendations.
- Include a dedicated placeholder or delimiter (e.g., triple backticks or `<code_to_review>`) for the target Node.js source code.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are an expert code reviewer. Review the provided Node.js API implementation against four criteria: Correctness, Security, Performance, and Reliability.

### Instructions:
1. Base your review strictly on the provided code snippet.
2. For every finding, cite the exact code or line references as evidence.
3. Explicitly state any missing context (e.g., missing dependencies, database schemas, environment configs) that prevents a full assessment rather than making assumptions.
4. Format your output using the following structure for each finding:
   - **Category**: [Correctness | Security | Performance | Reliability]
   - **Severity**: [Critical | Major | Minor | Informational]
   - **Evidence**: `Exact code snippet`
   - **Issue Description**: Detailed explanation of the issue
   - **Recommended Fix**: Code or configuration change to resolve it

### Code to Review:
```javascript
[INSERT NODE.JS API CODE HERE]
```
```

### L1-24

- Status: `completed`
- Score: `45`
- Risk: `low`

**Weaknesses**
- Lacks an actual question, topic, or objective to answer.
- Omits the source context or reference corpus from which citations should be drawn.
- Does not specify citation formatting, schema, or granular output constraints.
- Lacks fallback or abstention guidelines for scenarios where sources do not contain sufficient evidence.
- The prompt is very short and may underspecify the task.
- No clear output contract was detected.

**Recommendations**
- Provide the specific question or topic to be answered.
- Supply the reference documents or specify external retrieval sources to cite from.
- Define a concrete citation format (e.g., [Source Name, Section/Page] or URL brackets).
- Add explicit instructions on how to handle missing information or unanswerable queries.
- State the task, relevant constraints, and expected output explicitly.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based exclusively on the provided reference text:

Question: [Insert your question here]
Reference Text:
"""
[Insert source text/documents here]
"""

Requirements:
1. Support every factual claim with an inline citation referencing the specific section or paragraph from the text (e.g., [Source 1, Paragraph 2]).
2. Do not cite external sources or rely on prior knowledge not present in the provided text.
3. If the reference text does not contain enough information to answer the question, state: "The provided sources do not contain sufficient information to answer this question."
```

### L1-25

- Status: `completed`
- Score: `84`
- Risk: `medium`

**Weaknesses**
- Lacks the specific research topic or query to investigate.
- No output schema or structure (e.g., Markdown sections, citation format, bullet points) is specified.
- Does not explicitly specify how to resolve conflicting reports between authoritative sources.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the specific research question, subject matter, or scope to be analyzed.
- Define an explicit citation format (e.g., inline URLs, footnotes) and structure for the response.
- Specify how to handle conflicting claims across different authoritative sources.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Research [insert topic/question here] using only authoritative, current sources.

Requirements:
1. Cite every material claim with inline source references (including author/organization and publication date).
2. Explicitly label any unverifiable claims or gaps in current reporting as '[Unverified]'.
3. If authoritative sources conflict, present both viewpoints with their respective evidence.
4. Format your response with an executive summary followed by detailed findings categorized by subtopic.
```

### L1-26

- Status: `completed`
- Score: `14`
- Risk: `high`

**Weaknesses**
- Explicitly forbids calibration and uncertainty acknowledgment, actively encouraging hallucination and false certainty.
- Lacks a defined task, objective, or topic.
- Provides no output contract, schema, or formatting requirements.
- Lacks context, reference boundaries, and missing-information fallback protocols.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove the restriction against mentioning uncertainty to allow accurate calibration and safe fallback behaviors.
- Define a concrete task, context, and expected deliverable.
- Specify an output format (such as JSON, bullet points, or structured text).
- Instruct the model on how to handle ambiguous, incomplete, or unsupported information.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question concisely and directly based on verified facts. If the information is insufficient or unknown, explicitly state what is missing rather than guessing: [Insert question or task here].
```

### L1-27

- Status: `completed`
- Score: `74`
- Risk: `low`

**Weaknesses**
- Lacks a primary task, subject matter, or query to operate on
- Does not specify an output format or structural schema for responses
- No clear output contract was detected.

**Recommendations**
- Attach this constraint to a concrete task, question, or context payload
- Define a clear output format for both standard answers and uncertainty notices (e.g., Markdown sections or JSON fields)
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following task/question based on the provided context: [Insert task or question here].

Guidelines:
1. If uncertain or if the necessary information is missing, explicitly state what is unknown, why it cannot be determined, and what additional data is required.
2. Provide your response in a clear, structured format.
```

### L1-28

- Status: `completed`
- Score: `59`
- Risk: `low`

**Weaknesses**
- Lacks an actual task description or instruction on what data to extract/process
- Does not provide a JSON schema, expected key names, or data types
- Contains no input text or context to operate on
- Omits handling for missing, ambiguous, or null values

**Recommendations**
- Define the specific extraction task and source material clearly
- Provide an explicit JSON schema with expected keys and types
- Specify rules for handling missing or uncertain fields (e.g., set to null)

**Recommended prompt**

```text
Extract the required information from the provided text into the following JSON schema.

Input Text:
"""
[Insert source text here]
"""

Schema:
{
  "field_name": "string (or null if not found)"
}

Instructions:
1. Extract only facts directly mentioned in the text.
2. Set field values to null if the information is missing or ambiguous.
3. Return valid JSON only. Do not include markdown code fences, prose, or extra keys.
```

### L1-29

- Status: `completed`
- Score: `32`
- Risk: `low`

**Weaknesses**
- Lacks an actual core task, question, or payload for the model to process.
- Actively degrades context efficiency by requesting deliberate repetition of all context.
- No structured output schema or clear boundaries beyond general verbosity.
- Lacks guidance on uncertainty handling, grounding, or missing information.
- The prompt explicitly encourages unnecessary repetition or verbosity.
- No clear output contract was detected.

**Recommendations**
- Provide the specific question, input text, or task to be solved.
- Focus responses on concise, actionable synthesis rather than repeating known context.
- Define a concrete output contract (e.g., specific sections, headers, or format constraints).
- Prefer concise, relevant context and avoid repeating established information.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Task: [Insert specific task or question here]
Context: [Insert relevant background or reference text here]

Instructions:
1. Provide a detailed, comprehensive response addressing all aspects of the task.
2. Summarize key background details from the context where necessary to support your explanation, avoiding verbatim repetition.
3. If any required information is missing from the context, explicitly state what is unknown.
```

### L1-30

- Status: `completed`
- Score: `69`
- Risk: `low`

**Weaknesses**
- Lacks an explicit abstention/fallback rule if the context does not contain sufficient information.
- Does not define an output format, schema, or structural contract.
- Omits conflict resolution instructions for contradictory context passages.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Add explicit fallback instructions (e.g., 'If the answer cannot be determined from the context, state that the information is unavailable.').
- Specify the desired output structure, formatting, or target response length.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the query using only the relevant supplied context. Avoid repeating information already established. If the context does not contain sufficient information to answer fully, explicitly state that the evidence is insufficient rather than guessing.
```
