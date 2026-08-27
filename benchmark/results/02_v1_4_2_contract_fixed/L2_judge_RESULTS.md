# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-26T23:51:28.859747+00:00
- **Benchmark:** `L2_judge.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v3.1 resilient sequential
- **Batch size:** 5
- **Checkpoint:** `L2_judge.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 20 |
| Cases returned | 20 |
| Completed cases | 20 |
| Completed batches | 4/4 |
| Expectation passes | 8 |
| Expectation failures | 12 |
| Pass rate | 40.0% |
| Average score | 45.5 |
| Result integrity rate | 100.0% |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | 9d9f4bf0-2e11-4f24-8c9f-6ed57783d3c9 | 5 | 5 |
| 2 | completed | f11562ad-ec27-46a2-ac22-86e879328f9c | 5 | 5 |
| 3 | completed | ef9f32be-8444-4281-81a4-fee9ffdc20c5 | 5 | 5 |
| 4 | completed | e03c5fe1-5d8d-43ad-95db-42706d420a05 | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L2-01 | Coding / Software Development | completed | 23 | high | PASS |
| L2-02 | Coding / Software Development | completed | 74 | medium | FAIL |
| L2-03 | RAG / Document Q&A | completed | 28 | high | FAIL |
| L2-04 | RAG / Document Q&A | completed | 81 | low | FAIL |
| L2-05 | Research | completed | 26 | high | FAIL |
| L2-06 | Research | completed | 67 | medium | FAIL |
| L2-07 | Agent / Tool Use | completed | 24 | high | PASS |
| L2-08 | Agent / Tool Use | completed | 71 | medium | FAIL |
| L2-09 | Data Analysis | completed | 21 | medium | PASS |
| L2-10 | Data Analysis | completed | 56 | medium | FAIL |
| L2-11 | Customer Support | completed | 32 | high | PASS |
| L2-12 | Customer Support | completed | 71 | medium | FAIL |
| L2-13 | Structured Extraction | completed | 25 | high | PASS |
| L2-14 | Structured Extraction | completed | 61 | medium | FAIL |
| L2-15 | General | completed | 21 | medium | PASS |
| L2-16 | General | completed | 64 | medium | FAIL |
| L2-17 | Coding / Software Development | completed | 22 | high | PASS |
| L2-18 | Coding / Software Development | completed | 64 | medium | FAIL |
| L2-19 | Research | completed | 32 | high | PASS |
| L2-20 | Research | completed | 47 | high | FAIL |

## Detailed Cases

### L2-01

- Status: `completed`
- Score: `23`
- Risk: `high`

**Weaknesses**
- No code snippet or repository context is provided for review.
- The term 'production ready' is ambiguous and lacks specific criteria (e.g., performance, security, style, test coverage).
- Lacks an output format specification (e.g., diff, annotated code, list of suggestions).
- Missing instructions on how to handle missing context or assumptions.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Include the target code snippet or specify where the model should find it.
- Define concrete criteria for 'production ready' (e.g., error handling, logging, type hints, security checks, tests).
- Specify the desired output format (e.g., categorized findings followed by refactored code).
- Instruct the model to ask clarifying questions or state assumptions if critical context is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please review the following code snippet to make it production ready:

```[language]
// [Paste your code here]
```

Evaluation Criteria:
1. Robust error handling and input validation
2. Security considerations and edge cases
3. Code readability, type safety, and adherence to standard style conventions
4. Performance and resource management

Output Format:
- Summary of Key Issues: Bullet points detailing identified bugs, vulnerabilities, or anti-patterns.
- Refactored Code: The complete, updated production-ready code with inline comments explaining key changes.
- Assumptions / Recommendations: Any remaining dependencies or deployment requirements not evident in the snippet.
```

### L2-02

- Status: `completed`
- Score: `74`
- Risk: `medium`

**Weaknesses**
- Lacks an explicit uncertainty/abstention directive for ambiguous code paths or missing context.
- Does not specify an exact structured output format (e.g., Markdown table, JSON schema, or specific severity levels).
- Does not specify expected behavior when no issues are identified.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Define standardized severity levels (e.g., Critical, High, Medium, Low) and provide a fallback message if no bugs or issues are found.

**Recommended prompt**

```text
Review the supplied production code below across five dimensions: Correctness, Security, Performance, Reliability, and Maintainability.

Rules:
1. Rely strictly on the provided code. Do not assume or infer unshown components or external dependencies.
2. If evidence is insufficient to verify an issue or behavior, explicitly state that context is insufficient rather than guessing.
3. If no issues are found, state: "No issues identified."

For each finding, format your response using the following template:
- Dimension: [Correctness | Security | Performance | Reliability | Maintainability]
- Severity: [Critical | High | Medium | Low]
- Evidence: [Exact line number(s) and snippet from the supplied code]
- Production Impact: [Specific risk or failure mode]
- Concrete Correction: [Fixed code snippet and brief explanation]

[INSERT PRODUCTION CODE HERE]
```

### L2-03

- Status: `completed`
- Score: `28`
- Risk: `high`

**Weaknesses**
- Does not provide the actual document context or a specific question to answer.
- Lacks explicit grounding constraints to forbid external knowledge or unverified assumptions.
- Lacks an abstention/fallback policy for when the document does not contain the required information.
- Provides no output format, schema, or length requirements.
- Does not require citations or evidence mapping.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.
- Context is provided but factual claims are not explicitly tied to citations or evidence.

**Recommendations**
- Include the target question and document context placeholders.
- Instruct the model to rely solely on the provided document and forbid outside knowledge.
- Define a clear fallback phrase (e.g., 'Information not found in document') when evidence is missing.
- Specify an output schema or format (e.g., markdown summary, key takeaways, citations).
- Require citations or direct quotes from the document to support factual claims.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Require factual claims to cite or point to the supplied evidence when appropriate.

**Recommended prompt**

```text
Answer the following question based strictly on the provided document.

### Rules:
1. Use only explicit facts directly mentioned in the document. Do not assume or extrapolate.
2. If the document does not contain sufficient information to answer the question, state: "The provided document does not contain enough information to answer this question."
3. Include supporting quotes or page/section references for each factual claim.

### Document:
[INSERT DOCUMENT TEXT HERE]

### Question:
[INSERT QUESTION HERE]

### Output Format:
- **Direct Answer:** [Summary answer]
- **Evidence/Citations:** [Direct quotes or references from the document]
```

### L2-04

- Status: `completed`
- Score: `81`
- Risk: `low`

**Weaknesses**
- Lacks an explicit output format contract or schema (e.g., JSON, markdown bullet points, structure).
- Missing placeholder/structure for the actual user query or specific task definition.
- No clear output contract was detected.

**Recommendations**
- Define a concrete output contract specifying required formatting (e.g., Markdown headers, citation syntax such as `[Doc 1, Section A]`, or JSON schema).
- Add explicit placeholders for the target question/task and context documents.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the user's question using ONLY the provided documents. Follow these constraints strictly:
1. Base every factual claim strictly on the text and cite the supporting section/document using the format `[Source: <Document Name>, Section: <Section Name>]`.
2. If documents contain contradictory information, explicitly highlight and describe the conflict.
3. If the provided documents do not contain sufficient evidence to answer the question, state: "The provided documents do not contain sufficient information to answer this question."
4. Format your final response with a clear summary followed by bullet points detailing the supporting evidence.

[CONTEXT DOCUMENTS]:
{{context_documents}}

[QUESTION]:
{{user_question}}
```

### L2-05

- Status: `completed`
- Score: `26`
- Risk: `high`

**Weaknesses**
- Lacks geographic scope or jurisdiction boundaries (e.g., EU, US, global).
- Requires current, rapidly evolving legal facts without search guidance or source constraints.
- Provides no formatting, structure, or length requirements for the summary.
- Omits fallback or abstention instructions for missing, uncertain, or out-of-date information.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target jurisdictions and timeframe for the regulatory research.
- Instruct the model to use search/retrieval tools or provide authoritative reference context.
- Define a concrete output structure (e.g., key laws by region, status, impact).
- Include explicit instructions to note uncertainty or state when information is unavailable.
- Require current retrieval/search or provide authoritative current context.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Using up-to-date search tools or authoritative sources, research the current status of AI regulation across key jurisdictions (e.g., European Union, United States, and international frameworks).

Structure your summary with the following sections for each jurisdiction:
1. Key Legislation / Framework (name and current status: enacted, proposed, or under review)
2. Primary Requirements and Compliance Obligations
3. Notable Dates / Implementation Timelines

Guidelines:
- Base all statements on verified, current regulatory sources and cite the relevant acts or governing bodies.
- If the regulatory status for a jurisdiction is uncertain, evolving, or unverified in your available sources, explicitly state the limitation rather than inferring details.
```

### L2-06

- Status: `completed`
- Score: `67`
- Risk: `medium`

**Weaknesses**
- Lacks an explicit abstention instruction if authoritative primary sources cannot be located.
- Lacks a defined output schema or structured format (e.g., table, markdown sections).
- Does not specify geographical jurisdiction scope or search tool constraints.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Define the target jurisdictions (e.g., EU, US, UK) and specific timeframe.

**Recommended prompt**

```text
Research current AI regulations (including jurisdictions such as the EU, US, and UK) using authoritative primary sources.

Structure the response using the following format for each jurisdiction:
- Regulation / Policy Name
- Status: [Enacted Requirement / Active Proposal / Unverified]
- Primary Source & Date of Enactment/Introduction
- Key Mandates or Proposed Provisions

Constraints:
- Cite exact primary source names and dates.
- Explicitly distinguish between legally binding requirements and proposed drafts.
- Clearly label any unverified or speculative claims.
- If primary source documentation for a specific jurisdiction or claim is unavailable or ambiguous, state 'Insufficient primary evidence' rather than estimating.
```

### L2-07

- Status: `completed`
- Score: `24`
- Risk: `high`

**Weaknesses**
- No specific task, question, or goal is defined.
- Lacks guidance on which tools to select or how to use them.
- Missing termination conditions, maximum iteration bounds, or error-handling guidelines.
- No output format, schema, or reporting contract specified.
- Lacks abstention or uncertainty protocols if tools fail to provide sufficient evidence.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define the specific question, objective, or task the agent must solve.
- Set explicit stopping criteria and tool iteration limits to prevent infinite execution loops.
- Define handling for cases where tools return errors, conflicting data, or insufficient evidence.
- Specify the expected output structure (e.g., summary, JSON schema, citation format).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are an agent equipped with tools to solve the user's task.

Task: [Insert specific task or question here]

Instructions:
1. Plan your tool calls sequentially to gather the necessary data.
2. Stop calling tools once you have collected sufficient information to answer the task, or after a maximum of [N] tool calls.
3. If the tools return errors or cannot find relevant information, state that the evidence is insufficient rather than guessing.
4. Provide the final answer in the following format:
   - Findings Summary
   - Tool Evidence / Citations
   - Final Answer
```

### L2-08

- Status: `completed`
- Score: `71`
- Risk: `medium`

**Weaknesses**
- Lacks explicit instructions on how to handle uncertainty or report failure when tools repeatedly fail.
- Does not specify an output format or contract for conveying tool outcomes to the user.
- Does not define a specific task or boundary conditions for when to fall back to asking the user.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Define a clear fallback/abstention protocol specifying what the agent should report if tools fail repeatedly or evidence is insufficient.
- Specify the expected output structure when returning answers after tool execution.
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Use the minimum necessary tools to fulfill the request. Reuse prior valid results where available. If a tool call fails repeatedly, stop retrying, explicitly state the failure and insufficient information to the user, and do not fabricate tool outputs or assumptions.
```

### L2-09

- Status: `completed`
- Score: `21`
- Risk: `medium`

**Weaknesses**
- No data payload or dataset reference is provided.
- The analytical criteria ('what matters') are completely subjective and undefined.
- Lacks an explicit output format, structure, or length requirement.
- Lacks instructions for handling missing, incomplete, or ambiguous data points.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the dataset or data sample within the prompt context.
- Define specific business questions, target metrics, or key dimensions of interest instead of 'what matters'.
- Specify the desired output contract (e.g., bulleted executive summary, structured JSON table, key statistical findings).
- Instruct the model to explicitly state if data is missing, anomalous, or insufficient to draw conclusions.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the provided dataset below. Identify the top 3-5 key trends, statistical anomalies, and significant business insights based strictly on the data.

### Data:
[Insert Data Here]

### Requirements:
1. Executive Summary: High-level overview of findings (2-3 sentences).
2. Key Insights: Bulleted list detailing observed patterns and their data-backed significance.
3. Data Limitations/Anomalies: Note any missing, ambiguous, or incomplete data points rather than assuming values.
4. Grounding: Do not extrapolate or assume facts not supported by the provided data.
```

### L2-10

- Status: `completed`
- Score: `56`
- Risk: `medium`

**Weaknesses**
- No dataset or data schema was supplied in the prompt or context to analyze.
- Lacks an explicit output format, structured schema, or section layout.
- Lacks explicit abstention instructions if provided data is insufficient or invalid.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the dataset or schema placeholder (e.g., in a dedicated data block).
- Define a clear output contract (e.g., Markdown headers or JSON schema for descriptive stats, inference, and limitations).
- Add explicit fallback instructions to state when data is insufficient for robust inference.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the dataset provided below according to these guidelines:

1. Descriptive Analysis: Summarize distributions, central tendencies, and missingness rates.
2. Statistical Inference: Report inferential tests, test statistics, and explicit confidence intervals/p-values. Clearly state underlying assumptions.
3. Guardrails: Do not infer causation from correlation. If the sample size or data quality is insufficient for any test, explicitly state the limitation rather than drawing speculative conclusions.
4. Limitations & Uncertainty: List key risks of bias, confounding variables, and data gaps.

Output Format:
- ## Executive Summary
- ## Descriptive Findings & Missingness
- ## Statistical Inference & Assumptions
- ## Limitations & Uncertainty

Dataset:
```
[INSERT DATASET OR SUMMARY TABLE HERE]
```
```

### L2-11

- Status: `completed`
- Score: `32`
- Risk: `high`

**Weaknesses**
- Completely lacks refund policy guidelines or qualification rules.
- Provides no customer details, purchase date, or transaction context.
- Lacks instructions on how to handle missing information or edge cases.
- Does not specify output format, tone, or required support response components.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the refund policy terms and relevant customer order details in the context.
- Instruct the model to request missing information if essential details are absent.
- Define a clear output format (e.g., eligibility status, reasoning, and next steps).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a customer support agent. Determine whether the customer qualifies for a refund based on the provided Refund Policy and Customer Details below.

### Refund Policy
[Insert Refund Policy Here, e.g., 30-day window, item condition requirements]

### Customer Details
[Insert Customer Order and Request Details Here]

### Instructions
1. Evaluate the customer's request strictly against the Refund Policy.
2. If key information is missing to make a determination, ask the customer specific clarifying questions.
3. Respond in a polite and professional tone.
4. Format your response with: Decision/Status, Explanation referencing policy terms, and Next Steps for the customer.
```

### L2-12

- Status: `completed`
- Score: `71`
- Risk: `medium`

**Weaknesses**
- Lacks explicit context placeholders for the policy text and transaction payload.
- Missing a structured output contract (e.g., JSON schema, key-value pairs, or defined status codes).
- Does not specify exact criteria or format for escalation.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define explicit placeholders for `[Policy Data]` and `[Transaction Data]`.
- Specify a structured output format (e.g., JSON) with fields like `eligibility_status`, `reason`, `missing_fields`, and `escalation_required`.
- Clarify exact escalation steps or routing codes if required by downstream systems.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a customer support refund evaluation assistant.

### TASK
Evaluate whether a customer is eligible for a refund strictly using the provided policy and transaction records.

### CONSTRAINTS
- Rely solely on the provided `[Policy Data]` and `[Transaction Data]`. Do not assume, extrapolate, or invent facts.
- If either `[Policy Data]` or `[Transaction Data]` is absent, incomplete, or unverified, set `escalation_required` to true and specify the missing elements in `missing_data`.

### INPUTS
[Policy Data]:
{{POLICY_DATA}}

[Transaction Data]:
{{TRANSACTION_DATA}}

### OUTPUT FORMAT
Respond strictly in valid JSON format:
```json
{
  "eligibility_status": "ELIGIBLE" | "INELIGIBLE" | "UNKNOWN",
  "reasoning": "Brief explanation grounded strictly in the provided data.",
  "missing_data": ["list of any missing required data points, or empty if complete"],
  "escalation_required": true | false
}
```
```

### L2-13

- Status: `completed`
- Score: `25`
- Risk: `high`

**Weaknesses**
- No target invoice text or document context is provided.
- Lacks specification of which fields to extract (e.g., invoice number, date, line items, total amount).
- Missing an output schema or format contract (e.g., JSON, key-value pairs).
- Contains no instructions on how to handle missing or ambiguous fields.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the source invoice text or document as context.
- Explicitly enumerate the required fields to extract.
- Define a strict output format, such as a JSON schema.
- Instruct the model to return null or omit fields if the information is not present in the source text.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Extract the specified fields from the invoice text below.

Target fields:
- Invoice Number
- Invoice Date
- Due Date
- Vendor Name
- Billing Name/Address
- Line Items (description, quantity, unit price, total)
- Subtotal
- Tax Amount
- Total Amount Due

Extraction Rules:
- Ground all extracted values strictly in the provided invoice text.
- Do not extrapolate or guess values.
- If any field is not found in the text, set its value to null.

Output format:
Return a valid JSON object matching the target fields schema.

[INVOICE TEXT]
{{insert invoice text here}}
```

### L2-14

- Status: `completed`
- Score: `61`
- Risk: `medium`

**Weaknesses**
- Does not specify which invoice fields to extract.
- Lacks the input invoice document or context to extract from.
- Does not define the expected JSON schema or the exact structure for marking ambiguous candidates.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Attach the target invoice text or document payload in a dedicated context block.
- Specify the exact JSON schema, listing required field keys and expected data types.
- Define a concrete convention for ambiguous fields (e.g., returning an array of candidate values or an object with an `ambiguous: true` flag).
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Extract the specified fields from the provided invoice text into valid JSON matching the schema below.

Rules:
1. Extract only facts directly stated in the text; do not assume or infer any values.
2. If a field is missing, set its value to `null`.
3. If multiple conflicting candidates exist for a field, output them as an array under `candidate_values` with `"status": "ambiguous"`.
4. Output valid JSON only, with no surrounding markdown or explanation.

JSON Schema:
{
  "invoice_number": "string | null",
  "invoice_date": "string | null",
  "vendor_name": "string | null",
  "total_amount": "number | null",
  "currency": "string | null"
}

Invoice Text:
[INSERT INVOICE TEXT HERE]
```

### L2-15

- Status: `completed`
- Score: `21`
- Risk: `medium`

**Weaknesses**
- Lacks specification of which three alternatives are to be compared
- Does not define evaluation criteria, domain, or context for comparison
- Missing expected output format, structure, or length constraints
- No fallback instructions for handling missing context or requesting clarification
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact three alternatives to compare or provide the relevant source context.
- Define clear comparison criteria (e.g., pros/cons, cost, performance, trade-offs).
- Specify the desired output format (e.g., Markdown table, bulleted summary, structured JSON).
- Instruct the model to ask for clarification or state insufficient information if the alternatives are unspecified.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please compare the following three alternatives based on [insert criteria, e.g., features, cost, pros/cons]:
1. [Alternative A]
2. [Alternative B]
3. [Alternative C]

Provide the comparison as a structured Markdown table summarizing key differences, followed by a brief summary of trade-offs for each. If the alternatives or criteria are not provided, ask for clarification before proceeding.
```

### L2-16

- Status: `completed`
- Score: `64`
- Risk: `medium`

**Weaknesses**
- Lacks placeholders or inputs for the actual alternatives to compare.
- Lacks the specific evaluation criteria referenced in the prompt.
- Does not specify the exact column structure or format required for the comparison table.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Provide explicit placeholders or input sections for the three alternatives and the evaluation criteria.
- Define the required table columns (e.g., Criteria, Option A, Option B, Option C, Notes).
- Specify the format of the recommendation section (e.g., markdown headers, bullet points).
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Compare the three alternatives below against the specified criteria.

### Inputs
- **Alternatives:** [Insert Alternative 1, Alternative 2, Alternative 3]
- **Evaluation Criteria:** [Insert list of criteria]

### Instructions
1. Populate a markdown comparison table with columns: `Criteria`, `Alternative 1`, `Alternative 2`, `Alternative 3`.
2. If information for any alternative against a criterion is unavailable or ambiguous in the provided data, explicitly write `Unknown` in that cell.
3. Provide a final recommendation section justified solely by the criteria and the data in the table.
```

### L2-17

- Status: `completed`
- Score: `22`
- Risk: `high`

**Weaknesses**
- Explicitly forces a definitive conclusion even when data is missing or incomplete, actively penalizing honest uncertainty.
- Provides no logs, system context, error messages, or environment details.
- Lacks an output format, schema, or structured analytical criteria.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Allow the model to qualify findings with confidence levels or explicitly state when evidence is insufficient.
- Provide the relevant log excerpts, stack traces, and system architecture context.
- Define a structured output schema (e.g., primary hypothesis, supporting evidence, missing data required for confirmation).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the provided logs below to identify the most probable root cause. If the logs are incomplete or inconclusive, provide your best-supported hypothesis along with a clear explanation of what missing data or additional logging is required to confirm it.

### Logs / Context
[Paste logs, error traces, and relevant system details here]

### Desired Output Format
1. **Most Likely Root Cause:** (Summary and rationale)
2. **Confidence Level:** (High / Medium / Low)
3. **Evidence from Logs:** (Direct log references supporting this conclusion)
4. **Gaps & Recommended Next Steps:** (Missing info or diagnostic steps needed to confirm)
```

### L2-18

- Status: `completed`
- Score: `64`
- Risk: `medium`

**Weaknesses**
- No target logs or system context are provided for analysis.
- Lacks a structured output format (e.g., Markdown table, JSON, or ranked list template).
- Does not specify ranking criteria (e.g., probability, severity, ease of verification).
- Missing explicit guidance for when logs provide zero support for any hypothesis.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Attach or define placeholder tags for the relevant log snippets and system context.
- Define a concrete output structure specifying rank, hypothesis, supporting log evidence, confidence level, and required verification steps.
- Specify ranking criteria (e.g., likelihood based solely on log signals).
- Include explicit instructions to abstain from inventing hypotheses unsupported by the provided logs.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the provided system logs below to identify the root cause of the issue.

[LOGS]
{{insert_logs_here}}
[/LOGS]

Instructions:
1. If the logs definitively confirm a single root cause, explain the root cause and cite the exact log lines as evidence.
2. If the logs are inconclusive or do not prove a root cause:
   - List only hypotheses that are directly supported by patterns or anomalies in the provided logs. Do not speculate beyond the log data.
   - Rank the hypotheses by likelihood based on available evidence.
   - For each hypothesis, provide the specific follow-up evidence, telemetry, or diagnostic steps required to verify or disprove it.
3. If the logs provide insufficient signal to form any supported hypothesis, explicitly state that the evidence is insufficient.

Format your response using the following structure for inconclusive cases:

### Hypothesis 1: [Brief Description]
- **Likelihood / Rank Justification**: [Reasoning based on logs]
- **Supporting Log Excerpts**: [Exact log citations]
- **Required Verification Evidence**: [Specific logs, metrics, or diagnostic steps needed]
```

### L2-19

- Status: `completed`
- Score: `32`
- Risk: `high`

**Weaknesses**
- Demands a single 'exact' figure for an industry metric where market research estimates naturally vary by methodology, source, and scope.
- Requires current factual/time-sensitive market data without providing reference context or enabling retrieval tools.
- Lacks an abstention or uncertainty clause allowing the model to state if recent or authoritative figures are unavailable.
- Does not specify source attribution, currency, measurement year, or scoping criteria.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Require current retrieval/search or provide authoritative current context.
- Allow the model to state that evidence is insufficient or report a range if analyst estimates conflict.
- Require explicit source citations, base year/forecast period, and methodology definitions.
- Specify the desired format, length, fields, or schema.
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Using reputable market research sources, provide the current estimated market size for AI observability. If estimates vary across sources (e.g., Gartner, IDC, industry reports), state the range or specific cited estimates rather than a single fabricated number. Include:
- The estimated market value (with currency and year of measurement/forecast)
- The specific source/analyst firm and publication year
- How AI observability is bounded in that estimate

If current reliable data is not available in your knowledge base or retrieval tools, explicitly state that the data is unavailable rather than estimating.
```

### L2-20

- Status: `completed`
- Score: `47`
- Risk: `high`

**Weaknesses**
- Omits the specific industry, market, or geographic region being evaluated.
- Requires current/time-sensitive market data without providing source context or web retrieval instructions.
- Lacks a structured output format (e.g., Markdown table, JSON schema) and explicit length/schema boundaries.
- Does not specify fallback behavior if insufficient verifiable market estimates are found.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact target market, sector, and geographic region to analyze.
- Provide authoritative source context or specify retrieval/search tool constraints for fetching up-to-date data.
- Define an explicit output structure, such as a Markdown table or structured JSON template.
- Add an explicit abstention policy directing the model to report insufficient evidence if verified estimates are unavailable.
- Require current retrieval/search or provide authoritative current context.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
For the [insert specific industry/market and geographic region], provide multiple current market-size estimates from authoritative sources.

Instructions:
1. For each estimate, provide:
   - Source name and publication date
   - Estimated market size and currency/unit
   - Scope and segment covered (e.g., global, regional, specific sub-sector)
   - Research methodology (e.g., top-down, bottom-up, survey-based)
2. Analyze and explain the primary drivers behind any discrepancies among the estimates.
3. Format the response as a Markdown table followed by a comparative analysis section.
4. If verifiable, cited estimates are unavailable or conflicting without clear methodology, explicitly state that evidence is insufficient rather than estimating or extrapolating figures.
```
