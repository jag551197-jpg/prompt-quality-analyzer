# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-27T02:25:14.123235+00:00
- **Benchmark:** `L2_judge.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v4.0 calibrated sequential
- **Batch size:** 5
- **Checkpoint:** `L2_judge.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 20 |
| Cases returned | 20 |
| Completed cases | 20 |
| Completed batches | 4/4 |
| Expectation passes | 14 |
| Expectation failures | 6 |
| Pass rate | 70.0% |
| Average score | 61.55 |
| Result integrity rate | 100.0% |
| Pairwise accuracy | N/A% |
| Pairwise average score delta | N/A |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | cd8d6fd6-4e0f-4edd-8c90-a1f76ff31919 | 5 | 5 |
| 2 | completed | 9c20f465-2f0c-4ee3-bf9c-f0ce16b47f83 | 5 | 5 |
| 3 | completed | 3aa37bf5-6df5-46d1-8f87-f2554e59506c | 5 | 5 |
| 4 | completed | 7d4c284c-a9ff-44d0-afbf-3247812a0e72 | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L2-01 | Coding / Software Development | completed | 49 | low | PASS |
| L2-02 | Coding / Software Development | completed | 99 | low | PASS |
| L2-03 | RAG / Document Q&A | completed | 42 | medium | FAIL |
| L2-04 | RAG / Document Q&A | completed | 100 | low | PASS |
| L2-05 | Research | completed | 15 | high | FAIL |
| L2-06 | Research | completed | 95 | low | PASS |
| L2-07 | Agent / Tool Use | completed | 33 | medium | PASS |
| L2-08 | Agent / Tool Use | completed | 94 | low | PASS |
| L2-09 | Data Analysis | completed | 44 | medium | PASS |
| L2-10 | Data Analysis | completed | 78 | medium | FAIL |
| L2-11 | Customer Support | completed | 42 | medium | PASS |
| L2-12 | Customer Support | completed | 93 | low | PASS |
| L2-13 | Structured Extraction | completed | 51 | low | PASS |
| L2-14 | Structured Extraction | completed | 97 | low | PASS |
| L2-15 | General | completed | 45 | low | PASS |
| L2-16 | General | completed | 88 | low | PASS |
| L2-17 | Coding / Software Development | completed | 38 | medium | FAIL |
| L2-18 | Coding / Software Development | completed | 65 | high | FAIL |
| L2-19 | Research | completed | 17 | high | PASS |
| L2-20 | Research | completed | 46 | high | FAIL |

## Detailed Cases

### L2-01

- Status: `completed`
- Score: `49`
- Risk: `low`

**Weaknesses**
- No target code or code snippet was provided.
- Lacks definition of 'production ready' (e.g., error handling, typing, performance, security, logging, test coverage).
- Missing output structure specifications (e.g., explanation of changes, diff vs. full refactored code, list of findings).
- No clear output contract was detected.

**Recommendations**
- Provide the source code or a placeholder block for the code to be reviewed.
- Specify the target language/framework standards, runtime environment, or specific production criteria (e.g., error handling, type annotations, concurrency, security).
- Define a clear output format, such as separating the response into issues found, recommendations, and the refactored code.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please review the following [Language/Framework] code to make it production-ready.

```[language]
// Paste your code here
```

### Requirements:
1. Identify bugs, edge cases, security risks, and performance bottlenecks.
2. Ensure robust error handling, input validation, and proper typing/documentation.
3. Follow best practices for maintainability and logging.

### Output Format:
- **Issues & Analysis**: Bullet points detailing specific vulnerabilities or areas for improvement.
- **Refactored Code**: The complete, updated production-ready code with explanatory comments.
```

### L2-02

- Status: `completed`
- Score: `99`
- Risk: `low`

**Weaknesses**
- Lacks a defined severity taxonomy (e.g., Critical, High, Medium, Low).
- Output formatting style (e.g., Markdown headers, table, or structured JSON) is not explicitly formalized.
- Does not specify expected behavior when no issues or findings are detected.

**Recommendations**
- Define a standardized severity rating scale (e.g., Critical / High / Medium / Low).
- Specify an output structure or template format (e.g., Markdown sectioning or structured schema) for consistent reporting.
- Add explicit handling for clean code (e.g., state clearly if no findings are discovered).

**Recommended prompt**

```text
Review the supplied production code below for correctness, security, performance, reliability, and maintainability.

Instructions:
1. Base findings strictly on the provided code; do not infer or assume components not shown.
2. If no issues are identified in a category, state that no findings were detected.
3. Format each finding using the following structure:
   - Finding Title:
   - Dimension: [Correctness | Security | Performance | Reliability | Maintainability]
   - Severity: [Critical | High | Medium | Low | Informational]
   - Evidence: Exact line numbers, code snippets, or specific logic
   - Production Impact: Concrete failure mode or operational risk
   - Concrete Correction: Specific revised code or implementation fix

```[language]
<insert code here>
```
```

### L2-03

- Status: `completed`
- Score: `42`
- Risk: `medium`

**Weaknesses**
- Lacks explicit boundaries defining whether information outside the document is permitted.
- Does not provide an abstention or fallback behavior when the document lacks the necessary answer.
- Omits the specific question, context placeholders, or document structure.
- Lacks any output format, length constraints, or citation instructions.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.
- Context is provided but factual claims are not explicitly tied to citations or evidence.

**Recommendations**
- Explicitly restrict answers strictly to the provided document context.
- Add an abstention rule instructing the model to state if the answer cannot be found in the document.
- Define placeholders for both the document context and the user query.
- Specify the desired output format and style (e.g., concise summary, bullet points, citations).
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Require factual claims to cite or point to the supplied evidence when appropriate.

**Recommended prompt**

```text
Answer the following question based strictly on the provided context.

Context:
"""
{{DOCUMENT_TEXT}}
"""

Question:
{{QUESTION}}

Instructions:
- Rely solely on information directly stated in the context. Do not extrapolate, assume, or use external knowledge.
- If the context does not contain sufficient information to answer the question completely and accurately, respond with: "The provided document does not contain sufficient information to answer this question."
- Keep your answer clear, concise, and grounded in the text.
```

### L2-04

- Status: `completed`
- Score: `100`
- Risk: `low`

**Weaknesses**
- Lacks explicit citation syntax or structure (e.g., [Doc X, Sec Y] or inline markdown tags).
- Does not define standard placeholder boundaries for where documents and the user query will be injected.

**Recommendations**
- Specify a precise citation format (e.g., `[Document Name, Section/Page]`) to ensure predictable citation structure.
- Provide clear document/context demarcation tags (e.g., `<documents>...</documents>`) and specify formatting rules for the final response.

**Recommended prompt**

```text
Answer the question using only the supplied documents below. Adhere strictly to the following rules:
1. Grounding: Rely solely on the provided text. Do not assume or extrapolate beyond direct statements.
2. Citations: Cite supporting sections for every material factual claim using the format [Document: Section/Page].
3. Conflicts: If documents contain conflicting information, explicitly report and contrast the differences.
4. Insufficient Evidence: If the documents do not provide enough information to answer the question completely, explicitly state: "The provided evidence is insufficient to answer this question."

<documents>
{{DOCUMENTS}}
</documents>

Question: {{QUESTION}}
```

### L2-05

- Status: `completed`
- Score: `15`
- Risk: `high`

**Weaknesses**
- Requests time-sensitive, rapidly changing factual information without requiring search/retrieval or providing reference documents.
- Lacks geographical, legal, or jurisdictional scope (e.g., EU AI Act, US Executive Orders, China regulations).
- Missing grounding constraints and citation requirements for regulatory claims.
- Omits uncertainty handling or instructions for handling outdated/conflicting knowledge.
- Lacks an explicit output format, structure, or length constraint.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target jurisdictions and time period for the regulatory overview.
- Require the model to use search/retrieval tools and provide primary source citations.
- Define an explicit output structure (e.g., jurisdiction, key provisions, enforcement dates, compliance impact).
- Add explicit abstention and uncertainty guidelines for pending or unverified legislation.
- Require current retrieval/search or provide authoritative current context.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Perform a research summary of current AI regulations across major jurisdictions (e.g., European Union, United States, and China).

Requirements:
1. Scope: Focus on enacted laws and major pending regulatory frameworks as of the current date.
2. Sourcing: Use web search/retrieval to find authoritative government and legal sources. Include direct source citations for each regulatory measure mentioned.
3. Structure:
   - Jurisdiction & Legislation Name
   - Key Provisions & Risk Categories
   - Current Status and Compliance Deadlines
   - Core Implications for Developers/Enterprises
4. Uncertainty Handling: Clearly distinguish between enacted legislation and proposed drafts. If regulatory guidance on a specific point is unsettled or unavailable, state that explicitly rather than extrapolating.
```

### L2-06

- Status: `completed`
- Score: `95`
- Risk: `low`

**Weaknesses**
- Lacks a structured output format or schema (e.g., markdown tables, specific section headings).
- Open-ended geographical and regulatory scope (no specified jurisdictions or industries).
- No clear output contract was detected.

**Recommendations**
- Specify target jurisdictions or frameworks (e.g., EU AI Act, US Executive Orders/State laws, China CAC rules).
- Define a concrete output structure or schema with designated fields for dates, status, key provisions, and citation URLs.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Research current AI regulation across key jurisdictions (e.g., EU, US Federal/State, China) using authoritative primary sources. For each framework, present the findings in a structured format containing:
- Regulation Name & Governing Body
- Regulatory Status (Enacted Law vs. Proposed Bill/Draft)
- Key Requirements and Scope of Application
- Effective Dates and Timeline
- Primary Source Citations

Clearly flag and label any unverified claims or areas of legal ambiguity.
```

### L2-07

- Status: `completed`
- Score: `33`
- Risk: `medium`

**Weaknesses**
- Lacks an objective, target query, or task description.
- Does not specify which tools to use or bounds on tool execution (e.g., maximum iterations).
- Encourages potentially unbounded loops by commanding tool use 'until you have an answer' without exit conditions.
- Omits error handling, failure states, or instructions on what to do when information cannot be found.
- No output format, structure, or final response contract provided.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define the specific goal, question, or task the agent should solve.
- Set maximum iteration limits or specific stop conditions for tool calls.
- Provide clear guidance on tool selection, parameter constraints, and handling failed tool executions.
- Specify an explicit output format and a graceful fallback if the answer cannot be determined.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are an assistant with access to tools. Solve the following task: [insert task/question here].

Guidelines for tool use:
1. Select and invoke appropriate tools step-by-step to gather necessary evidence.
2. Do not exceed [N] tool calls. If an error occurs or necessary data is unavailable after trying, explain what information is missing.
3. Stop tool execution as soon as sufficient evidence is found.
4. Provide the final response structured with: 
   - Summary of findings
   - Final answer
   - Sources/tool results referenced
```

### L2-08

- Status: `completed`
- Score: `94`
- Risk: `low`

**Weaknesses**
- Lacks explicit fallback or abstention instructions when tool calls repeatedly fail.
- Does not define an output contract or final response format for reporting results or errors.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Add explicit fallback guidance specifying what the agent should report to the user if a tool call fails or cannot fulfill the request.
- Define a concrete output structure for the final response once tool execution concludes.
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Use the minimum necessary tools to complete the task. Reuse prior valid results rather than re-querying. If a tool call fails repeatedly, stop retrying, explain the failure, and state what information is missing rather than guessing. Never fabricate or assume tool outputs.
```

### L2-09

- Status: `completed`
- Score: `44`
- Risk: `medium`

**Weaknesses**
- No data or context was provided despite referring to 'this data'.
- Lacks definition of analytical goals, key metrics, or audience context for what 'matters'.
- Missing an output contract specifying desired format, structure, or depth.
- Lacks instructions on handling anomalies, uncertainty, or missing data points.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Attach the relevant dataset, schema, or summary tables directly in the context.
- Define specific analytical questions or business objectives (e.g., trend detection, outlier analysis, KPI performance).
- Specify the desired output format (e.g., executive summary, bullet points, key metrics table).
- Instruct the model to note any data quality issues, limitations, or ambiguities rather than making assumptions.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please analyze the dataset provided below with respect to [insert primary business objective or key question].

Dataset:
```
[Insert data or summary here]
```

Please structure your findings as follows:
1. Executive Summary: The top 3-5 key takeaways and why they matter.
2. Trend & Outlier Analysis: Significant patterns, anomalies, or metric changes observed.
3. Data Limitations & Uncertainties: Any missing data, potential caveats, or areas requiring further investigation.
4. Recommended Next Steps: Actionable suggestions based strictly on the provided numbers.
```

### L2-10

- Status: `completed`
- Score: `78`
- Risk: `medium`

**Weaknesses**
- Does not provide the actual dataset or a designated placeholder for the data payload.
- Lacks a formal output structure or schema (e.g., Markdown headers, JSON) for reporting findings.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Provide the dataset or insert an explicit placeholder where the data/schema should be supplied.
- Specify an organized output template with dedicated sections or structured formatting.
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Analyze the dataset provided below according to these guidelines:

1. Descriptive Analysis: Summarize key descriptive statistics and observe patterns without inferring broader population traits.
2. Statistical Inference: Present inferential findings separately, clearly stating sample size and statistical assumptions.
3. Data Quality & Missingness: Document missing values, anomalies, and how they impact validity.
4. Uncertainty & Limitations: Explicitly state confidence bounds, uncertainty, potential biases, and alternative explanations.
5. Causal Discipline: Do not claim or imply causation from correlational findings.

[Insert Dataset / Data Summary Here]
```

### L2-11

- Status: `completed`
- Score: `42`
- Risk: `medium`

**Weaknesses**
- Provides no refund policy rules, criteria, or guidelines for evaluation.
- Lacks customer transaction details, dates, or purchase circumstances.
- Omits fallback and uncertainty handling for missing customer information.
- Lacks an output format, tone guidelines, or specific structure for customer communication.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the explicit refund policy rules and the customer's specific purchase details as input variables.
- Instruct the model to request missing information or explain ineligibility rather than assuming criteria.
- Specify the desired communication tone (e.g., empathetic, professional) and structure (e.g., decision, rationale, next steps).
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a customer support agent. Determine whether the customer qualifies for a refund based strictly on the provided Refund Policy and Customer Case details.

### Refund Policy
{{refund_policy}}

### Customer Case Details
{{customer_case}}

### Instructions:
1. Evaluate the customer's case against the policy rules.
2. If key information is missing to make a determination, politely ask the customer for the specific missing details.
3. If they qualify, clearly state that the refund is approved and outline the next steps.
4. If they do not qualify, empathetically explain the policy reason and offer any relevant alternatives.
5. Maintain a professional, helpful, and empathetic tone.
```

### L2-12

- Status: `completed`
- Score: `93`
- Risk: `low`

**Weaknesses**
- Lacks a formal output format or response structure (e.g., status, eligibility decision, explanation, escalation message).
- Missing explicit placeholders/delimiters for policy and transaction inputs.
- No clear output contract was detected.

**Recommendations**
- Define a structured output schema (e.g., JSON or clear key-value sections) including Decision, Reason, and Escalation Details if applicable.
- Add explicit template slots for the policy text and transaction data.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a customer support agent evaluating refund eligibility.

Input Context:
- Policy: [INSERT REFUND POLICY]
- Transaction Data: [INSERT TRANSACTION DATA]

Instructions:
1. Determine refund eligibility strictly using only the supplied policy and verified transaction data.
2. If either the policy or transaction data is missing or incomplete, do not guess. State exactly what information is missing and specify an escalation path.

Output Format:
- Status: [Eligible / Ineligible / Escalation Required]
- Reason: [Brief explanation cited directly from the policy and transaction data]
- Missing Information / Escalation Notes: [Details of missing fields or 'N/A']
```

### L2-13

- Status: `completed`
- Score: `51`
- Risk: `low`

**Weaknesses**
- No target fields or schema are defined (e.g., invoice number, dates, line items, totals).
- Missing explicit output format specifications (such as JSON, key-value pairs, or a schema definition).
- Lacks missing-value and null-handling rules for absent fields.
- Does not include source text or clear instructions on strict grounding to avoid hallucinated values.

**Recommendations**
- Define a concrete list of fields or a JSON schema for the extraction output.
- Specify fallback behavior for missing or unreadable fields (e.g., set to null).
- Add explicit grounding instructions requiring extraction strictly from the provided text without extrapolation.

**Recommended prompt**

```text
Extract the following invoice fields from the text provided below:
- Invoice Number
- Invoice Date
- Due Date
- Vendor Name & Address
- Customer/Client Name & Address
- Line Items (description, quantity, unit price, total)
- Subtotal, Tax Amount, and Total Amount Due

Rules:
1. Extract information strictly from the provided text; do not infer or assume unstated values.
2. Return the output as a valid JSON object matching this schema.
3. If any field is not present in the invoice text, set its value to `null`.

[INVOICE TEXT]:
"""
{{invoice_text}}
"""
```

### L2-14

- Status: `completed`
- Score: `97`
- Risk: `low`

**Weaknesses**
- Does not specify the exact target JSON schema or key names to be extracted.
- Does not specify the exact format or structure for marking ambiguous candidates.
- No target invoice text or placeholder context was provided.

**Recommendations**
- Provide an explicit JSON schema or list of target keys with expected types.
- Define a concrete convention for ambiguous fields (e.g., set field to an array of candidates or use an 'ambiguities' object).
- Include a placeholder for the input invoice text (e.g., `Invoice Context: {{{invoice_text}}}`).

**Recommended prompt**

```text
Extract the specified invoice fields from the text below into a single valid JSON object.

Input Text:
[INSERT INVOICE TEXT HERE]

Target Schema:
{
  "invoice_number": "string or null",
  "invoice_date": "string or null",
  "vendor_name": "string or null",
  "total_amount": "number or null",
  "tax_amount": "number or null"
}

Extraction Rules:
1. Output valid JSON only, without markdown formatting or preamble.
2. Use strictly null for any field not present in the text.
3. Do not infer, calculate, or extrapolate unstated values.
4. If multiple conflicting candidates exist for a single field, set the field value to null and document the candidate list under an "_ambiguities" object.
```

### L2-15

- Status: `completed`
- Score: `45`
- Risk: `low`

**Weaknesses**
- Critically underspecified: does not state what alternatives, domain, or problem are being compared.
- Lacks comparison criteria, evaluation dimensions, or decision context.
- Provides no output structure or formatting contract (e.g., table, pros/cons list, summary).
- Missing instructions on how to handle ambiguity or missing context.
- No clear output contract was detected.

**Recommendations**
- Specify the target problem, domain, or explicit list of three alternatives to evaluate.
- Define explicit comparison criteria (e.g., cost, performance, maintainability, scalability).
- Define a clear output format, such as a structured Markdown table followed by a recommendation.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please compare three alternatives for [insert topic/technology/option names]:
1. [Alternative 1]
2. [Alternative 2]
3. [Alternative 3]

Evaluate them across the following criteria:
- [Criterion 1, e.g., Cost/Complexity]
- [Criterion 2, e.g., Performance/Efficiency]
- [Criterion 3, e.g., Ease of Implementation]

Output your analysis as a Markdown comparison table followed by a brief summary of the pros, cons, and recommended choice for [target use case]. If specific requirements are unclear, state the underlying assumptions.
```

### L2-16

- Status: `completed`
- Score: `88`
- Risk: `low`

**Weaknesses**
- Assumes external input for alternatives and criteria without explicit placeholders or structural delimiters.
- Table column/row format and criteria weighting rules are left somewhat open-ended.

**Recommendations**
- Add explicit placeholder slots (e.g., [Alternatives], [Criteria]) so inputs are clearly delimited.
- Specify the exact table schema (e.g., Columns: Criterion, Alternative A, Alternative B, Alternative C) to ensure consistent formatting.

**Recommended prompt**

```text
Evaluate the following three alternatives based solely on the provided criteria.

### Alternatives:
1. [Alternative 1]
2. [Alternative 2]
3. [Alternative 3]

### Criteria:
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

### Instructions:
1. Create a comparison table where rows are criteria and columns are the alternatives.
2. If any piece of information is missing or unverified, explicitly label it as "Unknown" rather than inferring or estimating.
3. Conclude with a final recommendation directly justified by the criteria-based comparison.
```

### L2-17

- Status: `completed`
- Score: `38`
- Risk: `medium`

**Weaknesses**
- Explicitly forces false certainty by demanding a definitive root cause on incomplete logs.
- Completely lacks the logs, error messages, system context, or code to analyze.
- Prohibits proper abstention, confidence calibration, and uncertainty handling.
- Lacks any output contract, structure, or formatting requirements.
- No clear output contract was detected.

**Recommendations**
- Instruct the model to rank probable hypotheses and state confidence levels when data is incomplete.
- Ask for missing diagnostic information or next investigative steps rather than forcing a definitive answer.
- Attach the relevant log excerpts, stack traces, and environment details.
- Specify an output schema (e.g., Primary Hypothesis, Supporting Evidence, Confidence Level, Recommended Next Steps).
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the following logs and system context to diagnose the issue.

Logs / Context:
[Insert logs, error traces, or environment details here]

Instructions:
1. Identify the most probable root cause(s) supported by the available data.
2. If the logs are incomplete or inconclusive, explicitly state what information is missing and assign a confidence level to each candidate hypothesis.
3. Provide concrete diagnostic steps or additional log sources needed to definitively verify the root cause.
```

### L2-18

- Status: `completed`
- Score: `65`
- Risk: `high`

**Weaknesses**
- Lacks an explicit output format or structured schema (e.g., Markdown table, JSON, or template).
- Assumes logs/context will be provided alongside the prompt, but includes no placeholder or context boundary.
- The prompt asks for a causal conclusion from evidence that may only support correlation.
- No clear output contract was detected.

**Recommendations**
- Add a structured output schema specifying fields (e.g., hypothesis, supporting log snippets, likelihood rank, missing verification evidence).
- Include a designated context placeholder (e.g., `<logs>...</logs>`) for supplying log artifacts.
- Separate correlation from causation and identify additional evidence required.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the provided logs below to identify the root cause of the issue.

Logs:
```
[INSERT LOGS HERE]
```

Instructions:
1. If the logs definitively confirm a root cause, explain it with direct log references.
2. If the logs do not conclusively prove a root cause, do not guess. Instead:
   - Rank the most plausible hypotheses based strictly on available evidence.
   - For each hypothesis, cite the relevant log lines and state the exact telemetry, logs, or diagnostic steps required to verify or falsify it.

Format your response as follows:
- **Definitive Root Cause** (or 'Inconclusive')
- **Ranked Hypotheses** (Rank, Description, Supporting Evidence from Logs, Verification Required)
```

### L2-19

- Status: `completed`
- Score: `17`
- Risk: `high`

**Weaknesses**
- Demands an 'exact' current market size figure for a market where estimates vary widely across analyst reports.
- Lacks external grounding, reference documents, or web search/retrieval instructions for time-sensitive data.
- Provides no uncertainty handling or abstention guidelines when conflicting or outdated figures exist.
- Does not specify source attribution requirements (e.g., firm, publication year, currency, projection period).
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Enable retrieval/web search or provide analyst source material to ground the market size figure.
- Ask for a range or specific reputable analyst estimate (e.g., Gartner, IDC) rather than forcing an 'exact' single number.
- Require publication year, source citation, and forecast period.
- Instruct the model to acknowledge uncertainty or report conflicting estimates across major sources.
- Require current retrieval/search or provide authoritative current context.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Search for current market research reports on the AI observability market. Provide the estimated market size along with the authoritative source (e.g., Gartner, IDC, MarketsandMarkets), publication year, currency/valuation, and the forecast period or methodology. If estimates vary significantly across sources or data is unavailable, summarize the range of estimates and note any discrepancies.
```

### L2-20

- Status: `completed`
- Score: `46`
- Risk: `high`

**Weaknesses**
- Lacks specification of the target market, industry, or domain being researched.
- Requests current factual estimates without grounding context, web retrieval instructions, or tool access rules.
- Lacks an explicit output schema or structured format (e.g., Markdown table, JSON) to organize multi-source comparisons.
- Missing a formal abstention instruction for cases where verified market reports or methodology details are unavailable.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target market, geographical region, and reference timeframe to bound the research scope.
- Require the model to search live authoritative market research sources or ground its output strictly in provided documents.
- Define a structured output schema (such as a comparison table) with fields for Source Name, Publication Date, Market Size, CAGR/Forecast Period, Scope/Definition, and Methodology.
- Add an explicit abstention policy instructing the model to state when reputable estimates or methodology details are not publicly accessible.
- Require current retrieval/search or provide authoritative current context.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Research and report current market-size estimates for [insert target market/industry and geographic region, e.g., Global Enterprise LLM Solutions in 2024–2030]. Use live search across reputable market intelligence and analyst reports.

Requirements:
1. Provide multiple independent estimates, specifying for each:
   - Source name and publication date
   - Market size figure (current baseline and projected forecast with CAGR)
   - Scope and market definition (segments included/excluded, geographic boundaries)
   - Methodology (e.g., primary executive surveys, secondary data, bottom-up/top-down modeling)
2. Analyze and explain the primary drivers behind any variance or disagreement among the estimates (e.g., differing segment definitions, base years, or assumptions) rather than averaging or inventing a single exact number.
3. Format the comparison as a structured Markdown table followed by an analysis section.
4. If methodology details or current estimates are unavailable from verified sources, explicitly state the lack of data rather than estimating.
```
