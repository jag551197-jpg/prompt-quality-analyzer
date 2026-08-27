# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-26T23:50:55.525978+00:00
- **Benchmark:** `L1_deterministic.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v3.1 resilient sequential
- **Batch size:** 5
- **Checkpoint:** `L1_deterministic.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 30 |
| Cases returned | 30 |
| Completed cases | 30 |
| Completed batches | 6/6 |
| Expectation passes | 16 |
| Expectation failures | 14 |
| Pass rate | 53.33% |
| Average score | 42.2 |
| Result integrity rate | 100.0% |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | dd3294d6-184e-41eb-b493-80e80dabea61 | 5 | 5 |
| 2 | completed | 036691c3-933f-4d01-a9e8-dc421049cdc4 | 5 | 5 |
| 3 | completed | 48332add-d316-4010-9588-df15fee8d6ce | 5 | 5 |
| 4 | completed | aed080ac-9011-49bf-a6bc-fea10a954a31 | 5 | 5 |
| 5 | completed | cb633182-bded-4e57-855d-9e2a53d1b8ae | 5 | 5 |
| 6 | completed | 1bab1d3e-d277-45c7-9988-1886d5ee52d0 | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L1-01 | Deterministic | completed | 25 | high | PASS |
| L1-02 | Deterministic | completed | 48 | medium | FAIL |
| L1-03 | Deterministic | completed | 26 | high | PASS |
| L1-04 | Deterministic | completed | 72 | low | PASS |
| L1-05 | Deterministic | completed | 15 | medium | PASS |
| L1-06 | Deterministic | completed | 72 | medium | PASS |
| L1-07 | Deterministic | completed | 26 | high | PASS |
| L1-08 | Deterministic | completed | 61 | medium | FAIL |
| L1-09 | Deterministic | completed | 39 | medium | PASS |
| L1-10 | Deterministic | completed | 60 | medium | FAIL |
| L1-11 | Deterministic | completed | 21 | medium | PASS |
| L1-12 | Deterministic | completed | 60 | medium | FAIL |
| L1-13 | Deterministic | completed | 29 | medium | FAIL |
| L1-14 | Deterministic | completed | 13 | high | PASS |
| L1-15 | Deterministic | completed | 39 | medium | FAIL |
| L1-16 | Deterministic | completed | 31 | high | PASS |
| L1-17 | Deterministic | completed | 72 | medium | FAIL |
| L1-18 | Deterministic | completed | 24 | high | PASS |
| L1-19 | Deterministic | completed | 73 | medium | FAIL |
| L1-20 | Deterministic | completed | 20 | high | PASS |
| L1-21 | Deterministic | completed | 65 | medium | FAIL |
| L1-22 | Deterministic | completed | 26 | medium | PASS |
| L1-23 | Deterministic | completed | 65 | medium | FAIL |
| L1-24 | Deterministic | completed | 24 | medium | PASS |
| L1-25 | Deterministic | completed | 61 | medium | FAIL |
| L1-26 | Deterministic | completed | 23 | high | PASS |
| L1-27 | Deterministic | completed | 63 | low | FAIL |
| L1-28 | Deterministic | completed | 39 | medium | FAIL |
| L1-29 | Deterministic | completed | 37 | medium | PASS |
| L1-30 | Deterministic | completed | 37 | medium | FAIL |

## Detailed Cases

### L1-01

- Status: `completed`
- Score: `25`
- Risk: `high`

**Weaknesses**
- Fails to specify the jurisdiction (e.g., country, state, or municipality).
- Fails to specify the tax year or effective date range.
- Omits the tax category (e.g., individual income, corporate, capital gains, sales tax).
- Lacks external grounding or retrieval requirements for time-sensitive legal facts.
- Contains no instructions for handling uncertainty or missing information.
- Lacks an output format specification.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target jurisdiction (e.g., US Federal, UK, California).
- Specify the exact tax year or applicable filing period.
- Define the specific tax categories or rules of interest.
- Require citation of official sources or require the use of real-time search/retrieval tools.
- Instruct the model to abstain or declare lack of data if current statutory guidance is unavailable.
- Define the required output structure (e.g., bulleted list categorized by deduction, bracket, and credit changes).
- Require current retrieval/search or provide authoritative current context.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please provide a summary of the latest tax rules for [insert jurisdiction, e.g., US Federal] for the [insert tax year, e.g., 2024] tax year. Focus specifically on [insert tax category, e.g., individual income tax brackets, standard deduction, and contribution limits]. If up-to-date authoritative tax regulations are unavailable or ambiguous, state the limitations clearly instead of estimating. Format the output with clear category headings and bullet points.
```

### L1-02

- Status: `completed`
- Score: `48`
- Risk: `medium`

**Weaknesses**
- Fails to specify the jurisdiction, tax year, or tax category (e.g., individual income, corporate, sales).
- Requires current facts without providing reference material or search tool parameters.
- Lacks an output contract regarding format, structure, or required fields.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target jurisdiction (e.g., US Federal, California state, UK HMRC), tax category, and tax year.
- Define a concrete output format (e.g., bulleted summary, citation table, JSON schema).
- Specify web search or retrieval tool instructions if dynamic real-time data is required.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide a summary of the latest tax rules for [specify jurisdiction, e.g., US Federal / State] for the [specify tax year] tax year regarding [specify tax topic, e.g., standard deduction and capital gains].

Requirements:
1. Base the response strictly on current authoritative sources (e.g., official tax authority publications or statutory code).
2. Format the response with bulleted key updates followed by a 'Citations' section listing the source title and URL/statute reference.
3. If current authoritative information is unavailable or unverified, explicitly state that the evidence is insufficient rather than estimating.
```

### L1-03

- Status: `completed`
- Score: `26`
- Risk: `high`

**Weaknesses**
- Explicitly forbids the model from acknowledging uncertainty or missing information.
- Lacks an actual task, domain context, or topic to address.
- Omits structural requirements or output formatting specifications.
- Forces definitive responses regardless of factual support, severely inflating hallucination potential.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove forced-certainty instructions that forbid acknowledging unknown information.
- Define the specific question, task, or subject matter to be addressed.
- Specify explicit grounding constraints or references for the answer.
- Add an output format specification (e.g., length, schema, or structural layout).
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide direct and concise answers based strictly on verifiable facts. If the information required to answer accurately is unavailable or ambiguous, clearly state what information is missing instead of guessing.
```

### L1-04

- Status: `completed`
- Score: `72`
- Risk: `low`

**Weaknesses**
- Does not include an actionable task, query, or context placeholder.
- Lacks an explicit output format, schema, or length contract.
- No clear output contract was detected.

**Recommendations**
- Specify the primary task or question along with the input context to be analyzed.
- Define a clear output format (e.g., specific wording for abstention, structured JSON, or concise plain text).
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based solely on the provided context.

Context:
[Insert context here]

Question:
[Insert question here]

Instructions:
- If the evidence in the context is insufficient to answer the question, state exactly: "Insufficient evidence provided."
- Do not assume, extrapolate, or infer any facts not directly supported by the context.
- Provide a direct and concise response.
```

### L1-05

- Status: `completed`
- Score: `15`
- Risk: `medium`

**Weaknesses**
- The actual question to be answered is missing entirely.
- No output format, length, or structural constraints are defined.
- Lacks instructions on handling ambiguity or missing context.
- Provides no grounding or source boundaries.
- The prompt is very short and may underspecify the task.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Include the specific question to be answered.
- Specify the desired output format, tone, and constraints (e.g., bullet points, JSON, or concise paragraph).
- Instruct the model to abstain or request clarification if the necessary details are missing.
- State the task, relevant constraints, and expected output explicitly.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please answer the following question clearly and concisely: [Insert question here]. If there is insufficient information to provide a factual answer, state that explicitly.
```

### L1-06

- Status: `completed`
- Score: `72`
- Risk: `medium`

**Weaknesses**
- Lacks explicit abstention or uncertainty-handling instructions if evidence is absent or insufficient.
- Does not specify JSON types, valid ranges for confidence (e.g., 0.0 to 1.0), or formatting constraints.
- Does not explicitly bind the answer strictly to provided context versus general knowledge.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Define the expected data types and scale for the confidence score (e.g., float between 0.0 and 1.0).
- Specify fallback values for answer and evidence when the information is unavailable.

**Recommended prompt**

```text
Answer the supplied question using only verifiable facts from the provided text.

Respond strictly in valid JSON with the following structure:
{
  "answer": "string (or 'Insufficient evidence' if the context does not contain the answer)",
  "evidence": "exact quote or reference from the text supporting the answer, or null if unknown",
  "confidence": 0.0 to 1.0
}

Do not include any conversational text or markdown formatting outside the JSON object.
```

### L1-07

- Status: `completed`
- Score: `26`
- Risk: `high`

**Weaknesses**
- Lacks a specific question, task, or target topic to answer.
- Explicitly instructs the model to hallucinate or speculate by filling missing facts from memory rather than verifying or stating uncertainty.
- No target document or context was provided.
- Does not specify output format, length, or structural expectations.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the core task, question, or analysis to be performed.
- Provide the reference document or context text.
- Establish clear grounding rules specifying whether the model should prioritize the document or parametric memory.
- Instruct the model to explicitly state when evidence is insufficient or missing rather than fabricating facts.
- Define the required output format and schema.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on the provided document: [Insert Question/Task].

Context:
"""
[Insert Document Here]
"""

Instructions:
1. Base your answer strictly on the provided context where applicable.
2. If the document does not contain sufficient information to answer the question, clearly state that the information is missing from the document before noting any general knowledge.
3. Format your response clearly with concise bullet points.
```

### L1-08

- Status: `completed`
- Score: `61`
- Risk: `medium`

**Weaknesses**
- Lacks an actual query, task instruction, or document input placeholder.
- Does not specify an exact fallback behavior/phrase when information is missing or unverified.
- Lacks a defined output format or response structure beyond requesting citations.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target question or task to be performed on the document.
- Provide an explicit placeholder for the document text.
- Add a concrete abstention instruction (e.g., 'If the document does not contain the answer, respond with "Information not found in document."').
- Define the expected output structure (e.g., bullet points, JSON, or direct answer followed by citation format).
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Based strictly on the provided document below, answer the following question. Do not assume or extrapolate any facts not explicitly stated.

Document:
[INSERT DOCUMENT HERE]

Question:
[INSERT QUESTION HERE]

Instructions:
1. Use only information directly stated in the document.
2. Cite the specific section or heading for each claim made.
3. If the document does not contain sufficient information to answer the question, state: "The provided document does not contain sufficient information to answer this question."
4. Format your response with a concise answer followed by "Citation: [Section Name]".
```

### L1-09

- Status: `completed`
- Score: `39`
- Risk: `medium`

**Weaknesses**
- Lacks guidance on search query formulation, diversity, and parameter specifications.
- Does not define how to synthesize or ground the final response using the search results.
- Omits fallback behavior if search results are contradictory, unhelpful, or fail.
- No output schema or formatting contract is defined.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify tool parameter requirements and strategies for varying search queries.
- Define an explicit output contract for presenting the synthesized search results.
- Include instructions on handling conflicting or missing search evidence.
- Instruct the model to strictly ground answers on retrieved tool outputs.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
For any user question, perform exactly three distinct searches using the search tool, varying search terms across attempts to cover different aspects of the topic.

Guidelines:
1. Base the final answer strictly on the information returned by the three search calls.
2. If the search results contain conflicting information or insufficient evidence to answer the question, explicitly state the limitation rather than inferring facts.
3. Present the response with a concise summary followed by key findings organized as bullet points, citing which search attempt supported each point.
```

### L1-10

- Status: `completed`
- Score: `60`
- Risk: `medium`

**Weaknesses**
- Lacks an explicit output format or schema specifying how the final response should be structured.
- Does not define operational criteria for what constitutes an 'equivalent' call or an invalid tool result.
- Missing instructions on how to handle uncertainty or scenarios where prior tool outputs are missing or ambiguous.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define criteria for identifying 'equivalent' calls and verifying if prior tool results remain valid.
- Specify a fallback or abstention policy if required data cannot be found in previous tool outputs.
- Provide a concrete output format or response contract for reporting results.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Before invoking any tool, check the conversation history for prior valid tool results. If an existing result answers the query or if an identical/equivalent call has already succeeded, reuse that result instead of issuing duplicate requests. If prior results are invalid, incomplete, or absent, execute the necessary tool call. If the required information remains unavailable after checking results, explicitly report that evidence is insufficient.
```

### L1-11

- Status: `completed`
- Score: `21`
- Risk: `medium`

**Weaknesses**
- Contains a direct logical contradiction between requesting a 'comprehensive detailed answer about every possible issue' and restricting length to 'under 20 words'.
- Fails to specify what domain, system, topic, or context the issues pertain to.
- Lacks guidance on prioritization or handling missing context/insufficient evidence.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define the specific topic, system, or scenario being analyzed.
- Resolve the contradiction between 'comprehensive detailed' and the 20-word limit by prioritizing key issues or removing the word restriction.
- Specify an explicit output format and allow abstention if context is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Identify the top 3 critical issues regarding [specify topic/system]. Summarize each issue in one concise sentence (maximum 20 words total). If information is insufficient, state that context is missing.
```

### L1-12

- Status: `completed`
- Score: `60`
- Risk: `medium`

**Weaknesses**
- Lacks the core task instruction specifying what data to process or extract.
- Omits the target output schema or data format structure.
- Provides no input text or context for extraction.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Specify the target schema or fields to extract.
- Provide the source text or context to evaluate.
- Explicitly define the expected output format (e.g., JSON object).
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Extract the requested fields from the provided input data into a JSON object.

Target fields:
- [Insert field 1]
- [Insert field 2]

Rules:
1. Base all values strictly on the provided input.
2. Return `null` for any missing, ambiguous, or unspecified fields.
3. Do not guess or extrapolate information.

Input Data:
[Insert input data here]
```

### L1-13

- Status: `completed`
- Score: `29`
- Risk: `medium`

**Weaknesses**
- Explicitly instructs the model to guess rather than verify or flag missing data.
- Lacks context, input data, or schema specifying which invoice fields are being evaluated.
- Provides no output contract, schema, or format constraints (e.g., JSON, list, key-value).
- Missing uncertainty handling or criteria for when a field cannot be safely inferred.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target invoice schema and which specific fields are acceptable to infer versus strictly required.
- Define a structured output format (e.g., JSON) with confidence flags or reasoning for inferred values.
- Allow the model to abstain or mark fields as 'UNKNOWN' when context is insufficient rather than unconstrained guessing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Given the provided invoice text or data below, extract all present invoice fields. For any missing fields, infer reasonable values only if supported by adjacent context (e.g., calculating subtotal or tax rates based on available line items). If a field cannot be reliably inferred, mark it as null or "UNKNOWN".

Return the result in JSON format with the following schema:
{
  "fields": {
    "[field_name]": {
      "value": "string or null",
      "status": "extracted | inferred | unknown",
      "reasoning": "string"
    }
  }
}

[INVOICE DATA]:
{{insert invoice text or data here}}
```

### L1-14

- Status: `completed`
- Score: `13`
- Risk: `high`

**Weaknesses**
- Fails to specify the target company name or stock ticker symbol.
- Requests real-time ('today\'s') data from static model training data, creating a temporal contradiction.
- Lacks external grounding, tool integration, or retrieval mechanisms required for financial data.
- Does not define output formatting requirements or schema.
- Contains no instructions on handling uncertainty or abstaining when information is inaccessible.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact company name or stock ticker symbol.
- Require real-time tool use or search instead of querying static training data for current prices.
- Add explicit abstention instructions if market data cannot be retrieved.
- Define a structured output format (e.g., price, currency, timestamp, exchange).
- Require current retrieval/search or provide authoritative current context.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Using real-time financial market search tools, retrieve the current stock price for [specify Stock Ticker / Company Name].

Output format:
- Ticker/Company: [Name]
- Current Price: [Price + Currency]
- Timestamp/Date: [Date & Time]

If the ticker is unrecognized, market data is unavailable, or real-time tools cannot access the current price, explicitly state that the information cannot be retrieved instead of guessing.
```

### L1-15

- Status: `completed`
- Score: `39`
- Risk: `medium`

**Weaknesses**
- Does not specify the target asset, ticker symbol, or instrument.
- Lacks an explicit output contract or structured format schema.
- Missing fallback instructions or abstention handling when current data is unavailable or ambiguous.
- No guidance on tool usage or retrieval mechanism for fetching real-time data.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact asset, ticker symbol, or market instrument to look up.
- Define a strict output format (e.g., JSON schema with fields for price, currency, timestamp, and source).
- Explicitly instruct the model to report insufficient data or abstain if authoritative market data cannot be retrieved.
- Provide guidelines or integration specs for real-time market data retrieval tools if applicable.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Using current authoritative market data for [INSERT ASSET/TICKER SYMBOL], retrieve and provide the latest market price and corresponding source timestamp.

Output format:
```json
{
  "asset": "[Asset/Ticker]",
  "price": 0.00,
  "currency": "USD",
  "source": "[Source Name/Exchange]",
  "timestamp": "YYYY-MM-DDTHH:MM:SSZ"
}
```

If current authoritative data is unavailable or ambiguous, respond with:
```json
{
  "error": "Insufficient or unavailable authoritative data",
  "details": "[Reason]"
}
```
```

### L1-16

- Status: `completed`
- Score: `31`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to hallucinate and invent content if no document is attached.
- Lacks grounding constraints and source context.
- Provides no formatting, structure, or length constraints for the summary.
- Does not permit abstention or proper missing-context handling.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Remove the instruction to guess or infer unprovided document contents.
- Instruct the model to halt or request the document if none is supplied.
- Define a clear output format (e.g., bullet points, key takeaways, length).
- Require the summary to be strictly grounded in the provided document text.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please summarize the attached document below.

Instructions:
- Rely solely on the text provided in the document. Do not extrapolate, infer unmentioned facts, or invent details.
- If no document is provided or attached, do not attempt to guess or infer its contents; respond only with: "No document attached. Please provide the document text to summarize."
- Format the summary as 3–5 bullet points covering the main ideas.
```

### L1-17

- Status: `completed`
- Score: `72`
- Risk: `medium`

**Weaknesses**
- Lacks explicit grounding constraints directing the model to rely solely on the document contents without outside extrapolation.
- Lacks an output contract regarding summary format, target length, structure (e.g., bullet points vs. paragraphs), or tone.
- Does not specify handling for partial, unreadable, or ambiguous content within the document.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify strict grounding by directing the model to extract and summarize only facts directly stated in the text.
- Define a concrete output structure (e.g., bulleted key takeaways, summary length, or JSON schema).
- Clarify how to handle internal ambiguity or missing details within the attached document.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please summarize the attached document below following these guidelines:
- Rely solely on the facts directly stated in the attached text; do not extrapolate or assume outside context.
- Structure your response with a 2-3 sentence overview followed by 3-5 bulleted key takeaways.
- If no document is provided or attached, respond strictly with: "Document is missing."
- If the document is partially missing or ambiguous on a point, note the ambiguity explicitly.
```

### L1-18

- Status: `completed`
- Score: `24`
- Risk: `high`

**Weaknesses**
- No correlation table or dataset was provided in the prompt or context.
- Forces a logically flawed conclusion ('prove causation from correlation') without allowing for standard causal inference limitations or uncertainty handling.
- Lacks format, length, and methodological constraints for analysis.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Attach the actual correlation matrix/table data to be analyzed.
- Permit the model to identify confounding variables, limitations, and alternative causal mechanisms rather than forcing definitive proof of causation.
- Define a structured output schema (e.g., summary of correlations, causal hypothesis generation, required validation experiments).
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Analyze the following correlation table [INSERT TABLE HERE]. Identify potential causal relationships indicated by strong correlations, describe potential confounding variables or alternative explanations, and outline what additional experimental or longitudinal data would be required to establish causality. If causality cannot be established from the provided data alone, explicitly state why.
```

### L1-19

- Status: `completed`
- Score: `73`
- Risk: `medium`

**Weaknesses**
- Lacks an explicit output format, structure, or length constraint.
- Does not specify domain context or whether examples should be included.
- Lacks uncertainty or boundary guidance for handling complex/edge cases.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the desired output structure (e.g., bullet points, comparison table, or defined sections).
- State target length and whether illustrative examples or specific frameworks (e.g., Bradford Hill criteria) are expected.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Explain the difference between correlation and causation. In your response, provide:
1. A clear definition distinguishing the two concepts.
2. A concrete example illustrating correlation without causation (including potential confounding variables).
3. A structured list of criteria and empirical evidence required to establish a causal relationship (e.g., temporal precedence, experimental controls, plausibility).
```

### L1-20

- Status: `completed`
- Score: `20`
- Risk: `high`

**Weaknesses**
- Lacks a specific task, objective, or question to resolve.
- Contains an open-ended 'Never stop' instruction that risks infinite execution loops or recursive failure.
- Provides no termination criteria, tool usage constraints, or error-handling guidelines.
- Omits any defined output format or schema.
- Lacks instructions for handling uncertainty or missing data.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target objective or question the tools should answer.
- Define clear termination conditions and maximum iteration limits for tool execution.
- Allow the model to report failure or insufficient evidence rather than looping indefinitely.
- Specify the expected output schema or format upon task completion.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Execute the necessary tool calls sequentially to resolve the following task: [insert task/question].

Guidelines:
- Continue calling tools until the required data is retrieved or a maximum of [N] attempts is reached.
- If the required information cannot be found after attempting all relevant tools, stop and explain what was tried and what is missing.
- Present the final answer in the following format: [insert desired format/schema].
```

### L1-21

- Status: `completed`
- Score: `65`
- Risk: `medium`

**Weaknesses**
- Lacks a structured output format for reporting the limitation.
- Does not specify what constitutes a 'failed attempt' (e.g., empty result, error code, irrelevant evidence).
- Missing the primary task or query context to which this rule applies.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define what qualifies as a failed retrieval attempt (e.g., empty payload, low relevance score, network error).
- Specify the output format for the limitation report (e.g., JSON schema or structured Markdown error report).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
If an attempt to retrieve specific evidence fails or returns no relevant data, retry at most once (maximum of two attempts total for the same evidence). If retrieval fails on both attempts, immediately stop further retrieval queries for that item and report the limitation using the following format:
- Missing Evidence:
- Retrieval Attempts Made: 2
- Cause/Error Observed:
- Impact on Final Response:
```

### L1-22

- Status: `completed`
- Score: `26`
- Risk: `medium`

**Weaknesses**
- Missing the source code, API specification, or endpoints to review.
- Lacks specific review criteria (e.g., security, performance, code style, architecture, error handling).
- No output format, structure, or depth of response specified.
- No guidance on how to handle missing information or context.
- The prompt is very short and may underspecify the task.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the Node.js API code, schema, or route handlers to be reviewed.
- Specify the review dimensions (e.g., security vulnerabilities, performance bottlenecks, REST best practices).
- Define an output contract specifying structure (e.g., findings table, severity levels, suggested code fixes).
- Explicitly instruct the model to ask clarifying questions or note missing context if relevant details are absent.
- State the task, relevant constraints, and expected output explicitly.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please review the following Node.js API code: [INSERT CODE OR SPECIFICATION HERE].

Focus the review on:
1. Security vulnerabilities and input validation
2. Performance and asynchronous error handling
3. Adherence to RESTful design best practices

Format your output with:
- Summary of Findings
- Critical Issues & Recommendations (with code snippets where applicable)
- Minor Improvements

If the provided code is incomplete or lacks necessary context, note the missing details before proceeding.
```

### L1-23

- Status: `completed`
- Score: `65`
- Risk: `medium`

**Weaknesses**
- No structured output contract or format specification provided.
- Lacks explicit abstention instructions if the provided code is incomplete or non-viable.
- No placeholder or attachment provided for the target Node.js API code.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema for the review report.
- Include a designated delimiter or placeholder where the Node.js API code should be pasted.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Review the following Node.js API code across four criteria: Correctness, Security, Performance, and Reliability.

Code to review:
```javascript
[INSERT NODE.JS API CODE HERE]
```

Instructions:
1. For each issue identified, specify the category, describe the problem, provide exact line/code citations as evidence, and suggest a remediation.
2. Explicitly list any missing context or dependencies needed for a complete review.
3. If there is insufficient evidence to determine an issue, state 'Insufficient evidence' rather than speculating.
4. Format your response using clear markdown headings corresponding to each category.
```

### L1-24

- Status: `completed`
- Score: `24`
- Risk: `medium`

**Weaknesses**
- Lacks an actual question, topic, or objective to answer.
- Provides no reference text, documentation, or source material from which to cite.
- Does not specify citation style, format, or schema.
- Missing instructions on how to handle missing or ambiguous source evidence.
- The prompt is very short and may underspecify the task.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- State the task, relevant constraints, and expected output explicitly.
- Provide the source text or specify the target reference domain to ground citations.
- Specify the desired citation format (e.g., bracketed numbers, inline URLs, source excerpts).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please answer the following question based solely on the provided reference text. Include inline citations (e.g., [Source 1]) for every factual claim. If the provided context does not contain enough information to answer, state 'Insufficient evidence'.

Question: [Insert your question here]

Reference Material:
[Insert source text or documents here]
```

### L1-25

- Status: `completed`
- Score: `61`
- Risk: `medium`

**Weaknesses**
- Lacks explicit fallback or abstention instructions when authoritative sources are missing or inconclusive.
- Does not specify a concrete output format, schema, or citation structure.
- Does not define operational criteria for what qualifies as an authoritative current source.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Allow the model to explicitly state when evidence is insufficient or unavailable rather than guessing.
- Specify the desired output format, schema, or structured citation style (e.g., inline links, footnotes, or JSON).
- Provide clear guidance on handling conflicting sources or retrieving current data if tools are available.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the query using only verifiable, authoritative current sources.

Requirements:
1. Cite every material claim with its supporting source.
2. Explicitly label any claims that cannot be verified against authoritative sources.
3. If sufficient authoritative evidence is unavailable or sources conflict, state clearly: "Insufficient evidence to determine [claim/topic]" rather than inferring.
4. Format your response with clear headings, followed by a dedicated "Sources and Verifications" section.
```

### L1-26

- Status: `completed`
- Score: `23`
- Risk: `high`

**Weaknesses**
- Explicitly forbids expressing uncertainty, strongly encouraging fabricated or overconfident statements.
- Lacks an actual core task or objective to execute.
- Provides no context, background information, or source grounding.
- Missing output schema, format guidelines, or constraints.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target task, subject matter, and intended output format.
- Allow the model to abstain, express confidence levels, or report missing information rather than suppressing uncertainty.
- Provide relevant source documents or reference facts to ground responses if accurate domain knowledge is needed.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide a factual and direct response regarding [insert topic/question here]. Present confirmed facts clearly and concisely without unnecessary hedging phrases, but if required information is missing or cannot be verified from the provided context, state that explicitly.
```

### L1-27

- Status: `completed`
- Score: `63`
- Risk: `low`

**Weaknesses**
- Lacks a primary task or question to apply the uncertainty instruction to.
- Lacks an explicit output format or schema definition.
- No clear output contract was detected.

**Recommendations**
- Attach the specific question, task, or context to which this constraint applies.
- Specify the desired output format, structure, or schema for both normal responses and uncertainty disclosures.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
[Insert primary question or task here]. If uncertain, explicitly state what is unknown and why in a dedicated 'Uncertainties' section.
```

### L1-28

- Status: `completed`
- Score: `39`
- Risk: `medium`

**Weaknesses**
- Lacks an actual core task or subject matter to process.
- Does not provide an expected JSON schema, keys, or data types.
- Contains no instructions for handling missing data or uncertainty.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Define the specific task or data transformation to be performed.
- Specify the exact JSON schema, including required keys and value types.
- Include instructions on how to handle unknown values or missing input data.
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Perform [insert task] on the following input: [insert input data].

Return JSON only. Do not include markdown formatting, prose, or extra keys.

Required JSON schema:
{
  "result": "<string>",
  "status": "<success|error>"
}

If the information is insufficient or missing, return:
{
  "result": null,
  "status": "error"
}
```

### L1-29

- Status: `completed`
- Score: `37`
- Risk: `medium`

**Weaknesses**
- Lacks a specific task, topic, or question to be answered.
- Provides no context or grounding source material despite asking to repeat relevant context.
- Does not define an explicit output format or schema beyond general verbosity.
- Contains no instructions for handling uncertainty, missing context, or unanswerable queries.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the primary question or task alongside the source context to be referenced.
- Allow the model to state when context or evidence is insufficient rather than fabricating answers.
- Specify the desired output structure (e.g., sections for Context Summary, Analysis, and Final Answer).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Task: [Insert specific question or objective]

Context:
"""
[Insert relevant context or source text]
"""

Instructions:
1. First, provide a thorough summary of all relevant facts from the provided context.
2. Then, provide a detailed, comprehensive answer to the task based strictly on the provided context.
3. If the context does not contain sufficient information to answer the question, explicitly state: "The provided context does not contain sufficient evidence to answer."
```

### L1-30

- Status: `completed`
- Score: `37`
- Risk: `medium`

**Weaknesses**
- No primary task, question, or payload is defined beyond meta-instructions.
- Referenced context is missing from the prompt.
- Lacks an explicit abstention policy when context lacks required details.
- No clear output schema, structure, or formatting constraints provided.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the specific question or task alongside the context to be analyzed.
- Include an explicit abstention instruction (e.g., 'State that the information is unavailable if not found in the context').
- Specify the desired output format, length, or schema.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Based only on the context provided below, answer the following question. Do not repeat information already established, and do not introduce external facts or assumptions. If the context does not provide sufficient information to answer the question, state: 'Insufficient context provided.'

Context:
[Insert context here]

Question / Task:
[Insert question or task here]

Output Format:
- Provide a concise summary followed by key points.
```
