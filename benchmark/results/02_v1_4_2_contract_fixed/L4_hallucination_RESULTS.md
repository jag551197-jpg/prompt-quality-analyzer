# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-26T23:54:45.622331+00:00
- **Benchmark:** `L4_hallucination.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v3.1 resilient sequential
- **Batch size:** 5
- **Checkpoint:** `L4_hallucination.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 30 |
| Cases returned | 30 |
| Completed cases | 30 |
| Completed batches | 6/6 |
| Expectation passes | 15 |
| Expectation failures | 15 |
| Pass rate | 50.0% |
| Average score | 37.07 |
| Result integrity rate | 100.0% |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | e80aea9b-2185-4502-97cc-75464529db6a | 5 | 5 |
| 2 | completed | d7b86e7f-1c18-4a1a-90c9-3f588e976c86 | 5 | 5 |
| 3 | completed | 717756e3-acee-4c30-9359-da7b13d52410 | 5 | 5 |
| 4 | completed | f7a1e9af-a498-40cd-b2ae-bfb6bd2d13f7 | 5 | 5 |
| 5 | completed | 88b0bdae-c6d2-4ee3-ac3b-513e025cb5b1 | 5 | 5 |
| 6 | completed | 89af79ad-5904-471c-b3d5-343df846202f | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L4-H01 | Hallucination Risk | completed | 19 | high | PASS |
| L4-H02 | Hallucination Risk | completed | 16 | high | PASS |
| L4-H03 | Hallucination Risk | completed | 20 | high | PASS |
| L4-H04 | Hallucination Risk | completed | 16 | high | PASS |
| L4-H05 | Hallucination Risk | completed | 29 | high | PASS |
| L4-H06 | Hallucination Risk | completed | 22 | medium | FAIL |
| L4-H07 | Hallucination Risk | completed | 30 | medium | FAIL |
| L4-H08 | Hallucination Risk | completed | 34 | high | PASS |
| L4-H09 | Hallucination Risk | completed | 24 | high | PASS |
| L4-H10 | Hallucination Risk | completed | 22 | high | PASS |
| L4-H11 | Hallucination Risk | completed | 16 | high | PASS |
| L4-H12 | Hallucination Risk | completed | 24 | high | PASS |
| L4-H13 | Hallucination Risk | completed | 19 | high | PASS |
| L4-H14 | Hallucination Risk | completed | 14 | high | PASS |
| L4-H15 | Hallucination Risk | completed | 32 | medium | FAIL |
| L4-L01 | Hallucination Risk | completed | 74 | low | PASS |
| L4-L02 | Hallucination Risk | completed | 36 | medium | FAIL |
| L4-L03 | Hallucination Risk | completed | 66 | medium | FAIL |
| L4-L04 | Hallucination Risk | completed | 52 | medium | FAIL |
| L4-L05 | Hallucination Risk | completed | 47 | medium | FAIL |
| L4-L06 | Hallucination Risk | completed | 46 | medium | FAIL |
| L4-L07 | Hallucination Risk | completed | 30 | medium | FAIL |
| L4-L08 | Hallucination Risk | completed | 55 | medium | FAIL |
| L4-L09 | Hallucination Risk | completed | 34 | medium | FAIL |
| L4-L10 | Hallucination Risk | completed | 46 | high | FAIL |
| L4-L11 | Hallucination Risk | completed | 75 | low | PASS |
| L4-L12 | Hallucination Risk | completed | 39 | medium | FAIL |
| L4-L13 | Hallucination Risk | completed | 72 | medium | PASS |
| L4-L14 | Hallucination Risk | completed | 55 | medium | FAIL |
| L4-L15 | Hallucination Risk | completed | 48 | medium | FAIL |

## Detailed Cases

### L4-H01

- Status: `completed`
- Score: `19`
- Risk: `high`

**Weaknesses**
- Directly mandates fabrication by demanding answers when necessary information is missing.
- Lacks an actual task, subject matter, or domain constraint.
- Provides no output format, schema, or structural constraints.
- Explicitly prohibits abstention or reporting of insufficient evidence.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove forced-certainty language and allow the model to state when evidence or information is missing.
- Specify the target task or question to be answered.
- Define explicit ground rules for handling missing context or assumptions.
- Specify the desired output format and structure.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on available information. If necessary information is missing, explicitly identify what is missing and state any assumptions made rather than fabricating details:

[Insert question or task here]
```

### L4-H02

- Status: `completed`
- Score: `16`
- Risk: `high`

**Weaknesses**
- Explicitly forbids the model from acknowledging knowledge gaps or uncertainty.
- Lacks an actual core task, topic, or objective.
- Provides no grounding source material or reference constraints.
- Contains no output format or schema specifications.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove forced-certainty constraints and allow the model to state uncertainty or abstain when information is missing.
- Define the specific task, topic, or question to be addressed.
- Specify the desired output format, structure, and constraints.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question clearly and accurately based on verified knowledge. If you are uncertain or lack sufficient information to answer accurately, explicitly state what is missing rather than guessing: [Insert question here]
```

### L4-H03

- Status: `completed`
- Score: `20`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to guess missing information rather than verifying or stating uncertainty.
- Lacks an actual core task, objective, or topic.
- Provides no source context or grounding constraints.
- Lacks an output format specification.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Remove the instruction to guess missing facts to prevent fabrication.
- Instruct the model to explicitly state when evidence or information is missing.
- Define the specific task, questions, and relevant context to be processed.
- Specify the desired output format and structure.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based only on verified information. If any required facts or details are missing, explicitly state what is missing rather than guessing: [Insert task or question here]
```

### L4-H04

- Status: `completed`
- Score: `16`
- Risk: `high`

**Weaknesses**
- Asks for real-time/current data ('today's exact value') purely from memory, forcing speculation or stale recall.
- The target subject or metric ('exact value') is completely undefined.
- Lacks any grounding context, external tool/search integration, or reference data.
- Provides no uncertainty handling or abstention protocol when data is unavailable.
- Lacks a structured output format specification.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact metric, entity, or asset being queried along with the specific date.
- Provide authoritative reference context or enable retrieval/tool use for real-time information.
- Instruct the model to abstain or declare insufficient data if the value is not available in the provided context or current tools.
- Define a concrete output format or schema for the response.
- Require current retrieval/search or provide authoritative current context.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please provide the latest value for [insert specific asset/metric, e.g., S&P 500 closing price] as of [insert date, e.g., YYYY-MM-DD]. Use the provided context or search tools to locate this data. If the exact value for this date cannot be verified from the provided sources, state 'Information unavailable' rather than estimating.
```

### L4-H05

- Status: `completed`
- Score: `29`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to estimate/speculate without verification or bounding constraints.
- Lacks specification of the actual task, input parameters, or tool to be executed.
- Missing clear output format requirements and uncertainty disclosure standards.
- Does not provide instructions on how to handle complete absence of underlying data.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target task and expected tool inputs/outputs.
- Require the model to explicitly label any estimated values as estimates and state the estimation assumptions.
- Allow the model to abstain or report failure if estimation is not viable without data.
- Define a concrete output contract (e.g., JSON schema with status, data, and confidence fields).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Execute [tool_name] with [parameters]. If the tool succeeds, provide the result directly.

If the tool fails:
1. Clearly state that the tool call failed.
2. If a reliable estimate is feasible based only on provided context, provide the estimate and explicitly explain the methodology/assumptions used.
3. Clearly mark the response as [ESTIMATE].
4. If sufficient information is unavailable to estimate accurately, state that the answer cannot be determined.
```

### L4-H06

- Status: `completed`
- Score: `22`
- Risk: `medium`

**Weaknesses**
- Lacks a clear task definition, goal, or problem statement.
- Provides no architectural requirements, constraints, or technology stack preferences.
- Explicitly instructs the model to make ungrounded assumptions without boundary conditions.
- No output format, structure, or deliverables are specified.
- Lacks instructions on handling uncertainty or detailing the rationale behind chosen assumptions.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target application, problem domain, and functional requirements.
- Define concrete architectural parameters (e.g., cloud provider, throughput, scalability constraints, tech stack) instead of open-ended assumptions.
- Require the model to explicitly list and justify any assumptions it makes.
- Specify the desired output contract, such as a component diagram outline, trade-off analysis, or step-by-step design proposal.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please propose a software architecture solution for [insert specific system/application and key requirements]. 

Guidelines:
1. State any necessary architectural assumptions clearly before presenting the design.
2. Detail the core components, data flow, and technology choices.
3. List trade-offs and alternative approaches considered.
4. If requirements are missing or ambiguous, identify the key unknowns and present options based on common industry patterns.
```

### L4-H07

- Status: `completed`
- Score: `30`
- Risk: `medium`

**Weaknesses**
- Lacks the actual documents or data to be analyzed.
- Forces a speculative choice ('choose the most likely') without defining selection criteria (e.g., recency, source authority).
- Does not specify an output format or contract.
- Lacks uncertainty or abstention guidelines for unresolvable contradictions.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the source documents or clear placeholders for them.
- Define clear resolution heuristics (e.g., publication date, source credibility) or instruct the model to report conflicts rather than guessing.
- Include an explicit abstention path when evidence is insufficient or conflicts cannot be objectively resolved.
- Specify the expected output structure (e.g., extracted value, rationale, cited sources).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the provided documents below to extract the target value.

Documents:
[Insert documents here]

Instructions:
1. If the documents contain conflicting information, do not guess. Compare the sources based on explicit metadata (e.g., latest timestamp, authoritative source) if available.
2. If the conflict cannot be decisively resolved from the text, list each conflicting value along with its respective source.
3. Output your findings in the following format:
- Selected Value (or 'Unresolved Conflict'):
- Evidence/Sources:
- Conflict Resolution Rationale (if applicable):
```

### L4-H08

- Status: `completed`
- Score: `34`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to mask uncertainty, which strongly promotes ungrounded assertions and overconfidence.
- Lacks a specific task, topic, or source material to ground the response.
- No fallback or abstention guidelines for unsupported or unverified information.
- No explicit insufficient-evidence or uncertainty behavior was detected.

**Recommendations**
- Allow the model to state that evidence is insufficient rather than inventing or overstating an answer.
- Separate authoritative tone guidelines from factual calibration (e.g., maintain a professional, decisive tone while flagging low-confidence facts explicitly).
- Provide the source text or context to be summarized or rewritten.
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Rewrite the following input using a professional, authoritative, and confident tone. However, maintain factual accuracy based strictly on the provided text, and explicitly state any assumptions or insufficient information rather than guessing.

[Insert input text here]
```

### L4-H09

- Status: `completed`
- Score: `24`
- Risk: `high`

**Weaknesses**
- No schema, record, or dataset is provided for the missing fields.
- Lacks domain context and guidelines for what qualifies as 'realistic'.
- Does not specify output formatting or schema requirements.
- No rules or boundaries on which specific fields need synthesis versus preservation.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the input data or object containing the missing fields.
- Define explicit constraints, types, and acceptable ranges for each missing field.
- Specify the desired output format (e.g., JSON, CSV, table).
- Indicate which existing fields should be preserved untouched.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You will be provided with a record containing missing fields.

Task:
1. Identify any missing or null fields within the input.
2. Populate each missing field with realistic mock data matching the data types and context of the surrounding fields.
3. Do not modify existing, populated values.
4. Output the completed record in valid JSON format.

Input Record:
```json
{
  "field_name": null
}
```
```

### L4-H10

- Status: `completed`
- Score: `22`
- Risk: `high`

**Weaknesses**
- Explicitly prohibits expressing uncertainty or limitations, which forces the model to fabricate confidence or hallucinate answers when knowledge is incomplete.
- Lacks an actual task, topic, or objective to guide the model.
- Provides no context, reference material, or grounding constraints.
- Lacks any output contract regarding format, structure, or length.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Remove the restriction against stating uncertainty; explicitly permit the model to acknowledge unknowns or gaps in knowledge.
- Define the core objective or question for the model to answer.
- Provide relevant reference context or grounding constraints to anchor responses.
- Specify the desired output format, tone, and structural constraints.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please state your specific question or task. Answer directly based only on verified facts, and clearly identify any missing information or areas where evidence is insufficient instead of guessing.
```

### L4-H11

- Status: `completed`
- Score: `16`
- Risk: `high`

**Weaknesses**
- Explicitly forces the model to generate responses when information is missing, directly incentivizing hallucination.
- Lacks an actual core task, objective, or topic to address.
- Provides no context or reference material.
- Lacks an output format or response contract.
- Prohibits abstention or acknowledgement of uncertainty.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove forced-generation instructions that mandate answering without sufficient data.
- Explicitly permit the model to abstain, flag missing details, or express uncertainty.
- Provide the specific task, questions, and reference context.
- Define a concrete output structure or contract.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based only on verified information. If critical information is missing or uncertain, explicitly state what is missing rather than guessing: [Insert question here]
```

### L4-H12

- Status: `completed`
- Score: `24`
- Risk: `high`

**Weaknesses**
- Explicitly forbids the model from acknowledging knowledge gaps or uncertainty.
- Forces fabrication and speculative claims when factual data is unavailable.
- Lacks a defined task, domain, or contextual grounding.
- No output format or validation contract specified.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove forced-certainty language and explicitly permit abstention or stating confidence levels when information is unknown.
- Define a concrete task, objective, and domain scope.
- Provide relevant context or reference material against which the model should ground its answers.
- Specify an output schema or formatting requirements.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on verifiable facts. If the information is unknown, incomplete, or uncertain, clearly state the limitations and explain what is known versus what cannot be verified.

[Insert Task/Question Here]
```

### L4-H13

- Status: `completed`
- Score: `19`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to invent or guess missing information instead of citing verified sources or abstaining.
- Lacks any concrete task, topic, question, or source material.
- No output format, structural constraints, or boundary specifications provided.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Instruct the model to acknowledge missing facts or state 'insufficient information' rather than guessing.
- If estimation or hypothesis generation is necessary, require the model to explicitly label assumptions and state uncertainty levels.
- Define the specific question, task, or context to be evaluated.
- Specify an output format and structure.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on available factual knowledge. If any relevant facts are missing or uncertain, do not guess; instead, clearly state what information is unknown or missing, and clearly distinguish any reasonable hypotheses from established facts:

[Insert question or task here]
```

### L4-H14

- Status: `completed`
- Score: `14`
- Risk: `high`

**Weaknesses**
- Fails to specify the target entity, metric, or variable ('value' of what?).
- Demands real-time current data ('today's exact value') from static memory without grounding context or retrieval tools.
- Lacks instructions allowing the model to abstain or report insufficient information.
- Does not specify output format, precision, or constraints.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact metric, stock, date, or entity being requested.
- Provide authoritative real-time context or instruct the model to use search/tool retrieval.
- Add explicit fallback instructions allowing the model to abstain if current data is unavailable.
- Define a concrete output format (e.g., number, currency, date format, or structured JSON).
- Require current retrieval/search or provide authoritative current context.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please provide today's current [insert target entity/metric, e.g., closing stock price for AAPL / weather temperature in London]. If access to real-time tools or updated context is unavailable to determine the exact value for today, explicitly state that you cannot access current data rather than estimating from memory.
```

### L4-H15

- Status: `completed`
- Score: `32`
- Risk: `medium`

**Weaknesses**
- Directs the model to estimate without defining boundary conditions or grounding sources.
- Lacks an explicit output format distinguishing verified tool results from estimates.
- Does not define tool specifications, expected inputs, or error thresholds.
- Missing safe abstention guidelines if an estimate cannot be reliably calculated.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Require the model to explicitly mark fallback answers as estimates and state underlying assumptions.
- Specify the target tool, task objective, and acceptable estimation methodology.
- Provide an abstention protocol when insufficient baseline data prevents safe estimation.
- Define a structured output schema (e.g., JSON) with dedicated fields for tool status, result, and confidence.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Execute [insert specific tool/task]. If the tool fails or returns an error:
1. Explicitly state that the tool call failed and report the failure reason if available.
2. Provide an estimate based solely on [insert baseline parameters/context], clearly labeling the output as an unverified estimate.
3. Include the key assumptions and uncertainty bounds used to reach the estimate.
4. If available information is insufficient to formulate a reliable estimate, state that the answer cannot be determined rather than guessing.
```

### L4-L01

- Status: `completed`
- Score: `74`
- Risk: `low`

**Weaknesses**
- Lacks a specific base task, query, or reference material to evaluate.
- Omits an explicit output schema, structure, or formatting constraint.
- No clear output contract was detected.

**Recommendations**
- Specify the specific question or task to be answered alongside the evidence rule.
- Provide the reference context/evidence source to be evaluated.
- Define the expected response format or structure.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Based solely on the provided context, answer the following question. If the evidence in the context is insufficient to answer completely, state explicitly: "Insufficient evidence to answer." Do not infer or extrapolate beyond the text.

Context:
[Insert context here]

Question:
[Insert question here]
```

### L4-L02

- Status: `completed`
- Score: `36`
- Risk: `medium`

**Weaknesses**
- Lacks a specific query, question, or target topic.
- Does not define an explicit fallback or abstention behavior when reliable sources are unavailable.
- Does not specify an output format, schema, or citation structure.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target topic, question, or task to be addressed.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema for citations and responses.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on current, authoritative sources: [Insert specific topic or question here].

Requirements:
1. Provide direct citations (source title, organization/author, and publication year/URL where accessible) for all factual claims.
2. If authoritative or current evidence is unavailable, conflicting, or insufficient to answer fully, explicitly state the limitation rather than guessing.
3. Format your response with a concise summary followed by a bulleted list of supporting details and their respective citations.
```

### L4-L03

- Status: `completed`
- Score: `66`
- Risk: `medium`

**Weaknesses**
- Lacks a defined output schema or structured error format for failure reporting.
- Does not specify what specific task, tools, or inputs are being executed.
- Lacks fallback behavior for non-tool uncertainties or partial tool execution.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the desired format, length, fields, or schema.
- Define explicit error-reporting structure (e.g., error code, tool name, failure reason).
- Clarify whether the model should halt execution completely or attempt alternative non-tool actions.
- Allow the model to state that evidence is insufficient rather than inventing an answer.

**Recommended prompt**

```text
Execute the assigned task using the available tools. If any tool fails or returns an error:
1. Clearly state the tool name and report the failure.
2. Do not extrapolate, guess, or estimate any unsupported facts or missing data.
3. Return the response using the format:
- Status: [Success | Tool Failure]
- Details: [Failure message or verified results]
- Next Steps / Notes: [Explanation of missing information due to failure]
```

### L4-L04

- Status: `completed`
- Score: `52`
- Risk: `medium`

**Weaknesses**
- Lacks an active primary task or objective for the model to execute.
- Provides no code, architectural specifications, or context to evaluate.
- Lacks an explicit output format contract or schema.
- Does not specify how the model should behave when necessary information is missing (e.g., explicit abstention format).
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define the concrete task to perform alongside the negative constraint (e.g., review, analyze, document).
- Provide the relevant code snippets, design documents, or dependency lists.
- Specify an explicit abstention behavior (e.g., 'If dependencies or architecture are not explicitly defined, state: Information not provided').
- Specify the desired output format and structure.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Task: Analyze the provided system description or code.

Constraints:
1. Only use the explicitly supplied architecture and dependencies.
2. Do not assume or infer any architectural components, external services, or dependencies not stated in the input.
3. If required information about the architecture or dependencies is missing to complete an analysis, explicitly state: "Insufficient information provided for [topic]".

Input:
[Insert code or architecture details here]

Output Format:
- Explicitly Stated Dependencies: [List or None]
- Explicitly Stated Architecture: [List or None]
- Missing Information/Gaps: [List or None]
```

### L4-L05

- Status: `completed`
- Score: `47`
- Risk: `medium`

**Weaknesses**
- Lacks the actual documents or source text to analyze.
- Does not specify an actionable primary task or query beyond conflict reporting.
- Lacks clear formatting or schema constraints for how conflicts should be structured.
- Does not include explicit fallback/abstention rules for missing or insufficient information.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the reference documents or place a clear placeholder for them.
- Specify the primary objective alongside conflict detection (e.g., answering a question, summarizing).
- Define an output format for reported discrepancies (e.g., listing conflicting statements with source citations).
- Instruct the model to state if evidence is missing or insufficient to determine a conflict.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Based exclusively on the provided documents, answer the following question: [INSERT QUESTION].

Guidelines:
1. If the provided documents contain conflicting information, explicitly describe each conflicting claim and cite the respective sources.
2. Do not use outside knowledge or make assumptions beyond the text.
3. If the context does not contain sufficient evidence to answer or identify conflicts, respond with "Insufficient information."

Documents:
[INSERT DOCUMENTS]

Output Format:
- Summary/Answer:
- Identified Conflicts (if any):
- Missing Evidence (if applicable):
```

### L4-L06

- Status: `completed`
- Score: `46`
- Risk: `medium`

**Weaknesses**
- Missing the source text or context from which data should be extracted.
- Lacks specification of target fields, extraction schema, or overall output format (e.g., JSON).
- Does not explicitly restrict the model from inferring or guessing values not directly present in the source text.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the source text or context to extract information from.
- Specify the target schema, field names, and desired output format (e.g., JSON).
- Add explicit grounding constraints instructing the model to only extract explicitly stated facts and use `null` when information is absent.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Extract the requested fields from the provided context below into a JSON object.

Context:
"""
[Insert source text here]
"""

Target Fields:
- [field_1]
- [field_2]

Rules:
- Only extract information explicitly stated in the context; do not assume or extrapolate.
- If a value for any field is not explicitly mentioned in the text, use null for that field.
- Respond strictly with the valid JSON object.
```

### L4-L07

- Status: `completed`
- Score: `30`
- Risk: `medium`

**Weaknesses**
- No target text or dataset is provided to analyze.
- Lacks explicit criteria for what constitutes a 'verified fact' versus a 'hypothesis'.
- Missing output format constraints or schema.
- Lacks instructions on how to handle ambiguous, untestable, or unverified claims.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the source text or context to be evaluated.
- Specify clear criteria or definitions for categorizing claims.
- Define a structured output schema (e.g., bulleted lists or JSON with categories).
- Include instructions to flag claims with insufficient evidence rather than guessing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the following provided text and categorize each claim into one of two lists: 'Verified Facts' (claims directly supported by empirical evidence or explicit source verification) or 'Hypotheses' (unverified assertions, predictions, or theories).

Text to analyze:
"""
[INSERT TEXT HERE]
"""

Formatting requirements:
- List each claim under its corresponding category.
- If a statement is ambiguous or lacks sufficient detail to classify, place it under 'Uncertain / Insufficient Evidence'.
- Do not assume facts not explicitly mentioned in the text.
```

### L4-L08

- Status: `completed`
- Score: `55`
- Risk: `medium`

**Weaknesses**
- Lacks a specific task, topic, or source context on which to operate.
- Does not specify an abstention/fallback protocol when evidence is missing or inconclusive.
- Missing an explicit output format or citation schema.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Provide the source text or context from which the evidence should be extracted.

**Recommended prompt**

```text
Analyze the provided context and formulate your conclusions based strictly on the facts presented. For every material conclusion, cite the specific supporting evidence from the text. If the text does not provide sufficient evidence to support a conclusion, explicitly state that the evidence is insufficient rather than inferring or assuming details.

Format your response as follows:
- Conclusion: [Your finding]
- Supporting Evidence: [Direct citation or excerpt]

Context:
[Insert context here]
```

### L4-L09

- Status: `completed`
- Score: `34`
- Risk: `medium`

**Weaknesses**
- Lacks the source text or target statements to evaluate.
- Does not define what constitutes an 'unverified claim' versus a verified one.
- Omits output formatting, schema, or reporting structure.
- Lacks guidance for handling uncertainty or missing evidence.
- The prompt is very short and may underspecify the task.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the specific text or claims to be analyzed.
- Define the verification standard or supply reference source material to check claims against.
- Specify an output format (such as a list, table, or JSON) including label definitions (e.g., [Verified], [Unverified], [Needs More Context]).
- Include explicit instructions on how to handle ambiguous statements or insufficient information.
- State the task, relevant constraints, and expected output explicitly.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the text provided below and identify any factual claims that are unverified or unsupported by evidence.

Text to analyze:
[Insert text here]

Instructions:
1. Extract each factual statement from the text.
2. Label each claim as [VERIFIED], [UNVERIFIED], or [INSUFFICIENT CONTEXT] based strictly on the provided context/reference.
3. For each claim labeled [UNVERIFIED] or [INSUFFICIENT CONTEXT], briefly state why evidence is lacking.
4. Format your output as a markdown table with the columns: Claim, Label, Reason/Notes.
```

### L4-L10

- Status: `completed`
- Score: `46`
- Risk: `high`

**Weaknesses**
- Lacks a specific question, task, or topic for the model to address.
- Provides no grounding material or context to serve as evidence.
- Does not specify an explicit abstention behavior or output schema when evidence is unavailable.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Specify the target query, topic, or task to be answered.
- Provide the necessary reference text or evidence source to ground the response.
- Define explicit fallback behavior (e.g., 'If insufficient evidence is available, state: Evidence insufficient').
- Establish an output format constraint (e.g., bullet points, JSON, summary).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based only on verified, current evidence provided in the context. If the provided context lacks sufficient evidence to answer definitively, state 'Insufficient evidence available to provide a definitive answer.'

[Insert Question Here]

Context:
[Insert Reference Context/Evidence Here]
```

### L4-L11

- Status: `completed`
- Score: `75`
- Risk: `low`

**Weaknesses**
- Lacks a concrete task, query, or reference material to operate on.
- No specific output format, structure, or schema is defined.
- No clear output contract was detected.

**Recommendations**
- Provide the specific question or task alongside the source context to be evaluated.
- Specify the desired output format, structure, or fields.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question using only the provided context. If the evidence is insufficient to answer the question accurately, state explicitly: "Insufficient evidence." Do not make inferences or extrapolate beyond the provided text.

Context:
[Insert context here]

Question:
[Insert question here]
```

### L4-L12

- Status: `completed`
- Score: `39`
- Risk: `medium`

**Weaknesses**
- Lacks an actual task, topic, or question to answer.
- Does not specify what constitutes an authoritative source or how citations should be formatted.
- Lacks explicit abstention guidance if authoritative sources cannot be found or verified.
- No output schema or structure is defined.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact topic, question, or task to be addressed.
- Allow the model to state that evidence or authoritative sources are unavailable rather than guessing.
- Define a concrete citation format (e.g., URL, author/year, publication title) and output layout.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please answer the following question: [Insert Question/Topic Here]. Ground your response strictly in authoritative, reliable sources and provide clear citations (including source name and URL/publication date where applicable). If verified or authoritative information is unavailable or insufficient to answer the question accurately, explicitly state that you do not have enough information rather than speculating.
```

### L4-L13

- Status: `completed`
- Score: `72`
- Risk: `medium`

**Weaknesses**
- Lacks a defined output schema or format for failure reporting.
- Does not specify which tools, parameters, or primary task context are involved.
- Omits specific details on what information must be included in the failure report (e.g., error message, tool name).
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact output schema or format for failure messages (e.g., JSON with tool name and error reason).
- Define fallback steps or acceptable follow-up actions when a tool is unavailable.
- Clarify what details must accompany the failure report.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
If a tool execution fails, do not guess, extrapolate, or estimate unsupported facts. Instead, immediately report the failure by providing: 1) the name of the failed tool, 2) the reason or status of the failure, and 3) a clear statement that the requested information cannot be retrieved without valid tool output.
```

### L4-L14

- Status: `completed`
- Score: `55`
- Risk: `medium`

**Weaknesses**
- Lacks an active primary task or user objective to execute alongside the constraint.
- Does not provide the codebase, architectural documentation, or dependencies to evaluate.
- Missing explicit fallback instructions (e.g., how to respond when requested details are omitted).
- Lacks an output format specification (e.g., JSON, markdown list, specific fields).
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Provide the specific code snippet, architecture diagram, or dependency manifest to be analyzed.
- Clearly define the primary task (e.g., analyze, document, or review the provided components).

**Recommended prompt**

```text
Analyze only the supplied architecture and dependency information below.

Rules:
1. Base your answer strictly on the provided context.
2. Do not infer, assume, or extrapolate any architecture components, frameworks, or dependencies that are not explicitly mentioned.
3. If any required information is missing or unclear, explicitly state: "Insufficient information provided for [topic]".

Task: [Insert specific task, e.g., List all confirmed system dependencies and components]

Context:
[Insert architectural details / dependency manifest here]
```

### L4-L15

- Status: `completed`
- Score: `48`
- Risk: `medium`

**Weaknesses**
- Lacks the primary task or query to be performed on the documents.
- Provides no documents or reference context to analyze.
- Does not specify an output format or schema for how conflicts should be structured and reported.
- Missing explicit instructions on how to handle missing or insufficient information.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Include the target documents and specify the primary extraction, summarization, or comparison task.
- Define a clear output format (e.g., Markdown table, bulleted list, JSON) detailing how conflicting statements should be cited and presented.
- Provide explicit fallback instructions if no conflicts are found or if information is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You will be provided with a set of documents [insert documents here]. Analyze them to answer the following question: [insert question here].

Guidelines:
1. Base your answer strictly on the provided documents.
2. If the documents contain conflicting information regarding a topic, explicitly highlight the conflict by citing what each document states.
3. If the provided documents do not contain enough information to answer the question, state: "The provided documents do not contain sufficient information to answer this question."

Output Format:
- Summary of Findings:
- Identified Conflicts (if any, with citations):
- Final Answer / Conclusion:
```
