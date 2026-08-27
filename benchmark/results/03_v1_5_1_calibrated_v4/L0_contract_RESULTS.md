# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-27T02:23:48.731736+00:00
- **Benchmark:** `L0_contract.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v4.0 calibrated sequential
- **Batch size:** 5
- **Checkpoint:** `L0_contract.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 10 |
| Cases returned | 10 |
| Completed cases | 10 |
| Completed batches | 2/2 |
| Expectation passes | 0 |
| Expectation failures | 0 |
| Pass rate | N/A% |
| Average score | 48.8 |
| Result integrity rate | 100.0% |
| Pairwise accuracy | N/A% |
| Pairwise average score delta | N/A |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | ca61d132-5e35-49c0-bea1-ea83ee65c8c3 | 5 | 5 |
| 2 | completed | 24971d63-4fc3-482b-af0a-76af96ae64db | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L0-01 | Contract | completed | 48 | low | N/A |
| L0-02 | Contract | completed | 49 | medium | N/A |
| L0-03 | Contract | completed | 52 | medium | N/A |
| L0-04 | Contract | completed | 47 | medium | N/A |
| L0-05 | Contract | completed | 52 | low | N/A |
| L0-06 | Contract | completed | 47 | low | N/A |
| L0-07 | Contract | completed | 40 | low | N/A |
| L0-08 | Contract | completed | 47 | medium | N/A |
| L0-09 | Contract | completed | 55 | medium | N/A |
| L0-10 | Contract | completed | 51 | low | N/A |

## Detailed Cases

### L0-01

- Status: `completed`
- Score: `48`
- Risk: `low`

**Weaknesses**
- Missing the actual code snippet or context to be reviewed.
- Lacks specification of review scope (e.g., syntax errors, performance bottlenecks, security vulnerabilities, or code style).
- No output format or schema defined (e.g., issue severity, line-by-line breakdown, proposed fixes).
- Does not specify programming language, framework, or target runtime environment.
- Lacks instructions on how to handle ambiguous, incomplete, or functionally correct code.
- No clear output contract was detected.

**Recommendations**
- Provide the target code snippet along with relevant language/framework version information.
- Define clear review dimensions (e.g., logic bugs, security, performance, best practices).
- Specify an output contract detailing issue descriptions, severity ratings, and refactored code snippets.
- Include instructions on what to do if no bugs are found or if context is missing.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please review the following [Language/Framework] code snippet for bugs, security vulnerabilities, edge-case failures, and performance bottlenecks.

### Code Snippet
```[language]
// Paste your code here
```

### Review Instructions
1. Identify any syntax, logic, or runtime errors.
2. Note potential security issues or unhandled edge cases.
3. If no significant issues are found, state that the code appears functional and suggest optional optimizations.

### Output Format
Provide your response using the following structure for each identified issue:
- **Issue:** Concise summary of the problem
- **Severity:** [Critical | Warning | Suggestion]
- **Location:** Line number(s) or function name
- **Explanation:** Why this is problematic
- **Recommended Fix:** Corrected code snippet
```

### L0-02

- Status: `completed`
- Score: `49`
- Risk: `medium`

**Weaknesses**
- Critically underspecified with no definition of scope, target jurisdiction, or key concepts.
- Lacks any format, structure, length, or audience constraints.
- Does not provide instructions for handling jurisdiction-specific variations or uncertainty.
- The prompt is very short and may underspecify the task.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target jurisdiction (e.g., US federal, UK, general economics).
- Define the specific angle or subtopics (e.g., history, major types of taxes, basic calculation principles).
- Define an explicit output structure or target length (e.g., bulleted overview, comprehensive guide).
- State the task, relevant constraints, and expected output explicitly.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide a structured overview of taxation. Specifically:
1. Define what taxes are and their primary economic purposes (e.g., revenue generation, redistribution).
2. Explain the common types of taxes (e.g., income, sales/VAT, property, corporate).
3. Briefly outline standard tax structures (progressive, proportional, regressive).

If discussing specific legal rules or rates, clarify which jurisdiction they apply to or note if standard rules vary globally.
```

### L0-03

- Status: `completed`
- Score: `52`
- Risk: `medium`

**Weaknesses**
- Lacks strict boundary constraints (e.g., relying exclusively on the provided text).
- Missing fallback or abstention guidelines when the document lacks the necessary information.
- No output schema, format, or tone requirements specified.
- Does not include placeholders or structure for the document and question.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.
- Context is provided but factual claims are not explicitly tied to citations or evidence.

**Recommendations**
- Explicitly restrict answers to information directly supported by the provided document.
- Define fallback behavior instructing the model to state if the document does not contain the answer.
- Specify the expected output structure (e.g., concise summary, direct quote, JSON).
- Include explicit delimiters/placeholders for the document and question.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Require factual claims to cite or point to the supplied evidence when appropriate.

**Recommended prompt**

```text
You are a factual assistant. Based solely on the provided document below, answer the user's question.

Rules:
- Rely only on clear facts directly mentioned in the document; do not assume or extrapolate.
- If the document does not contain sufficient information to answer the question, respond with: "The provided document does not contain this information."
- Keep your answer clear, concise, and grounded in the source text.

Document:
```
{{DOCUMENT_TEXT}}
```

Question: {{QUESTION}}
```

### L0-04

- Status: `completed`
- Score: `47`
- Risk: `medium`

**Weaknesses**
- Extremely vague instruction ('solve this') with no target problem, objective, or input data specified.
- Lacks guidance on which tools to use, when to invoke them, or how to handle tool errors.
- No output schema, format specification, or clear completion criteria.
- Lacks uncertainty handling or rules for handling insufficient information.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Explicitly define the specific problem, goal, and input parameters.
- Specify available tools, usage criteria, and failure/retry boundaries.
- Define a concrete output structure (e.g., JSON schema or structured report) for the final response.
- Add explicit instructions on how to handle missing data, uncertainty, or unrecoverable tool failures.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are an autonomous problem-solving agent. Your goal is to solve the following problem:

[INSERT PROBLEM DESCRIPTION OR INPUT DATA HERE]

Tool Usage Guidelines:
- Available tools: [LIST TOOLS]
- Use tools sequentially when external calculation, lookup, or validation is required.
- If a tool returns an error or empty result, retry with refined parameters or report the failure rather than guessing.
- If required information is missing or cannot be retrieved, explicitly state what is missing.

Output Format:
Provide your response in the following format:
- Summary of Plan: Brief explanation of the steps taken.
- Tool Executions & Findings: Key data retrieved or computed.
- Final Solution / Outcome: Concrete answer to the problem.
```

### L0-05

- Status: `completed`
- Score: `52`
- Risk: `low`

**Weaknesses**
- No target schema or list of specific fields to extract.
- No source text or document placeholder provided.
- Lacks output format specifications (e.g., JSON schema, key-value pairs).
- Missing instructions for handling missing, ambiguous, or unstated values.
- Subjective phrasing ('important fields') leads to inconsistent and non-deterministic results.

**Recommendations**
- Specify the exact fields to extract (e.g., party names, effective date, term, governing law, termination clauses).
- Define a strict structured output schema (e.g., JSON schema).
- Provide explicit instructions to set missing or unmentioned fields to null rather than inferring them.
- Include a designated placeholder where the contract text should be passed.

**Recommended prompt**

```text
Extract the key contract terms from the text below into a valid JSON object matching the following schema:

```json
{
  "parties": ["string"],
  "effective_date": "YYYY-MM-DD or null",
  "expiration_date": "YYYY-MM-DD or null",
  "governing_law": "string or null",
  "payment_terms": "string or null",
  "termination_notice_period_days": "integer or null"
}
```

Rules:
- Rely strictly on the text provided. Do not assume or extrapolate values.
- If a field is not explicitly mentioned in the contract, set its value to `null`.

Contract Text:
[INSERT CONTRACT TEXT HERE]
```

### L0-06

- Status: `completed`
- Score: `47`
- Risk: `low`

**Weaknesses**
- Lacks placeholders for the customer's question and relevant reference material or context.
- Omits formatting, length, and tone guidelines for the customer response.
- Provides no fallback instructions or escalation path if the requested information is unavailable or ambiguous.
- No clear output contract was detected.

**Recommendations**
- Include explicit placeholders for both the customer query and the source documentation/knowledge base.
- Define tone, style, and structure constraints (e.g., professional, concise, bullet points).
- Specify an abstention/escalation policy for queries that cannot be resolved with available information.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a customer support assistant. Answer the customer's question accurately and politely based only on the provided context.

Context / Knowledge Base:
[Insert relevant documentation/policy context here]

Customer Question:
[Insert customer question here]

Instructions:
1. Maintain a helpful and professional tone.
2. If the answer is directly supported by the context, provide a clear, concise response.
3. If the context does not contain enough information to answer the question, state that the information is unavailable and offer to escalate the request to human support.
4. Do not invent policies, dates, or terms not mentioned in the context.
```

### L0-07

- Status: `completed`
- Score: `40`
- Risk: `low`

**Weaknesses**
- References 'this data' without providing any dataset or context.
- Lacks specific analytical goals, key questions, or evaluation criteria.
- Omits output formatting, schema, or structural requirements.
- Does not specify how to handle missing, ambiguous, or anomalous values.
- No clear output contract was detected.

**Recommendations**
- Provide the target dataset or paste it within explicit context delimiters.
- Define specific analytical objectives (e.g., trend analysis, anomaly detection, statistical summary).
- Specify the desired output format (e.g., structured JSON, executive summary, bulleted key findings).
- Include instructions on how to handle missing or ambiguous data points.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a data analyst. Analyze the dataset provided below and extract key actionable insights.

### Data:
```
[Insert dataset or table here]
```

### Analysis Objectives:
1. Provide a high-level summary of the data.
2. Identify primary trends, significant patterns, and notable anomalies.
3. State the core implications of these findings.

### Constraints & Formatting:
- Ground all findings strictly in the provided data; do not speculate or extrapolate beyond the numbers.
- If data points are missing or ambiguous, explicitly note the limitations.
- Present the response with clear headings: Summary, Key Trends & Anomalies, and Business Implications.
```

### L0-08

- Status: `completed`
- Score: `47`
- Risk: `medium`

**Weaknesses**
- Extremely brief and open-ended, lacking scope, target jurisdictions, or specific regulatory frameworks.
- Lacks an output contract, structural guidelines, or length constraints.
- Provides no tool usage bounds or research methodology for an agentic workflow.
- Missing instructions for handling uncertain, evolving, or conflicting regulatory policies.
- The prompt is very short and may underspecify the task.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define specific jurisdictions or regulatory frameworks to focus on (e.g., EU AI Act, US Executive Orders, NIST frameworks).
- Specify tool usage parameters, iteration limits, and acceptable source types.
- Define an explicit output schema or structured report format.
- Include guidance on handling jurisdictional conflicts and rapidly evolving legal developments.
- State the task, relevant constraints, and expected output explicitly.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Conduct research on current AI regulation frameworks. Focus specifically on major regulatory frameworks (e.g., EU AI Act, US federal and state initiatives, and international standards).

Provide a structured overview with the following sections for each major framework:
1. Jurisdiction & Framework Name
2. Key Objectives & Scope of Application
3. High-Risk Classifications & Compliance Obligations
4. Enforcement Mechanisms & Penalties
5. Current Implementation Timeline / Status

Guidelines:
- Base findings on authoritative primary and secondary legal sources.
- Clearly note areas where regulations are proposed vs. enacted.
- If details on enforcement or specifics are not finalized in published texts, explicitly state that the status remains unfinalized rather than inferring outcomes.
```

### L0-09

- Status: `completed`
- Score: `55`
- Risk: `medium`

**Weaknesses**
- Lacks explicit grounding constraints restricting the summary strictly to the provided text.
- Omits output formatting requirements such as target length, structure, or key focus areas.
- Does not define uncertainty or abstention behavior for missing, unreadable, or ambiguous details.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Add explicit grounding instructions requiring the model to use only the text within the document.
- Specify an output structure (e.g., key points, executive summary, bullet points) and desired length.
- Instruct the model on how to handle ambiguous terms, missing sections, or unreadable content.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please summarize the attached document following these guidelines:
1. Base your summary strictly on the information contained directly within the document; do not assume or extrapolate facts not present.
2. Structure the summary with:
   - An Executive Summary (2-3 sentences)
   - Key Provisions / Core Points (bullet list)
   - Notable Deadlines, Terms, or Action Items (if applicable)
3. If any critical details are missing, ambiguous, or unstated in the text, explicitly note them as "Not specified in document" rather than guessing.
```

### L0-10

- Status: `completed`
- Score: `51`
- Risk: `low`

**Weaknesses**
- Fails to provide the actual three alternatives and evaluation criteria referenced in the prompt.
- Lacks an output contract (no requested schema, format, markdown table, or scoring structure).
- Missing instructions on how to handle missing attributes, trade-offs, or uncertain data across alternatives.
- No clear output contract was detected.

**Recommendations**
- Provide the specific alternatives and evaluation criteria explicitly or define structured placeholders.
- Specify a clear output format, such as a Markdown comparison matrix followed by trade-off summaries.
- Include explicit handling for missing data or conflicting criteria.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Compare the following three alternatives based on the criteria provided below.

Alternatives:
1. [Alternative A]
2. [Alternative B]
3. [Alternative C]

Evaluation Criteria:
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

Output Requirements:
1. Provide a Markdown comparison table scoring or evaluating each alternative against each criterion.
2. Summarize key strengths, weaknesses, and primary trade-offs for each option.
3. State any assumptions or unknowns explicitly if information for a criterion is missing.
```
