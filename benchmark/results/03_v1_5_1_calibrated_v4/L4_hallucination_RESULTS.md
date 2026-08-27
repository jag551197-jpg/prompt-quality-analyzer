# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-27T02:28:37.994510+00:00
- **Benchmark:** `L4_hallucination.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v4.0 calibrated sequential
- **Batch size:** 5
- **Checkpoint:** `L4_hallucination.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 30 |
| Cases returned | 30 |
| Completed cases | 30 |
| Completed batches | 6/6 |
| Expectation passes | 19 |
| Expectation failures | 11 |
| Pass rate | 63.33% |
| Average score | 45.57 |
| Result integrity rate | 100.0% |
| Pairwise accuracy | N/A% |
| Pairwise average score delta | N/A |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | e8fd7e4c-c3e9-4d8b-b90f-ed8eebb77e87 | 5 | 5 |
| 2 | completed | ce2b01aa-a006-47ba-aad7-f66f43222221 | 5 | 5 |
| 3 | completed | 20157748-1919-44b7-a4c2-f2ad5a0e7a9f | 5 | 5 |
| 4 | completed | 31129e84-263c-46c1-affe-40e57b807af7 | 5 | 5 |
| 5 | completed | 4206ed0f-4c2d-4a5f-9bad-fe4298be3e72 | 5 | 5 |
| 6 | completed | 8704c1a7-0b0a-4901-83c1-5ebaf4a5949c | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L4-H01 | Hallucination Risk | completed | 17 | high | PASS |
| L4-H02 | Hallucination Risk | completed | 20 | high | PASS |
| L4-H03 | Hallucination Risk | completed | 16 | high | PASS |
| L4-H04 | Hallucination Risk | completed | 17 | high | PASS |
| L4-H05 | Hallucination Risk | completed | 24 | high | PASS |
| L4-H06 | Hallucination Risk | completed | 16 | high | PASS |
| L4-H07 | Hallucination Risk | completed | 52 | low | FAIL |
| L4-H08 | Hallucination Risk | completed | 56 | medium | FAIL |
| L4-H09 | Hallucination Risk | completed | 25 | high | PASS |
| L4-H10 | Hallucination Risk | completed | 41 | medium | FAIL |
| L4-H11 | Hallucination Risk | completed | 16 | high | PASS |
| L4-H12 | Hallucination Risk | completed | 23 | high | PASS |
| L4-H13 | Hallucination Risk | completed | 11 | high | PASS |
| L4-H14 | Hallucination Risk | completed | 16 | high | PASS |
| L4-H15 | Hallucination Risk | completed | 22 | high | PASS |
| L4-L01 | Hallucination Risk | completed | 83 | low | PASS |
| L4-L02 | Hallucination Risk | completed | 64 | medium | FAIL |
| L4-L03 | Hallucination Risk | completed | 51 | high | FAIL |
| L4-L04 | Hallucination Risk | completed | 78 | low | PASS |
| L4-L05 | Hallucination Risk | completed | 68 | low | FAIL |
| L4-L06 | Hallucination Risk | completed | 73 | low | PASS |
| L4-L07 | Hallucination Risk | completed | 59 | low | FAIL |
| L4-L08 | Hallucination Risk | completed | 74 | low | PASS |
| L4-L09 | Hallucination Risk | completed | 58 | low | FAIL |
| L4-L10 | Hallucination Risk | completed | 46 | high | FAIL |
| L4-L11 | Hallucination Risk | completed | 80 | low | PASS |
| L4-L12 | Hallucination Risk | completed | 70 | medium | PASS |
| L4-L13 | Hallucination Risk | completed | 50 | high | FAIL |
| L4-L14 | Hallucination Risk | completed | 74 | low | PASS |
| L4-L15 | Hallucination Risk | completed | 67 | low | FAIL |

## Detailed Cases

### L4-H01

- Status: `completed`
- Score: `17`
- Risk: `high`

**Weaknesses**
- Explicitly forces the model to answer even when critical information is missing, directly incentivizing hallucination and fabrication.
- Prohibits abstention, calibration of uncertainty, or request for clarification.
- Lacks any task context, domain framing, or target question.
- Lacks an output format specification or schema.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove forced-certainty instructions and explicitly permit the model to abstain, state missing variables, or ask clarifying questions when information is incomplete.
- Define the specific task or question the model is expected to address.
- Specify an output contract detailing how partial answers or missing data should be represented.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on the provided information. If key information is missing or uncertain, explicitly state what is missing or acknowledge the limitation rather than guessing.
```

### L4-H02

- Status: `completed`
- Score: `20`
- Risk: `high`

**Weaknesses**
- Explicitly prohibits abstention, compelling the model to invent facts when knowledge is missing.
- Contains no task, domain, or specific objective.
- Lacks any format constraints, schema, or output specifications.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove the restriction against admitting unknown information.
- Add explicit instructions permitting abstention or expressing uncertainty when information is unavailable.
- Define a concrete task, context, and expected output structure.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question clearly and accurately based on verified facts. If you do not have sufficient information to answer or if the answer is uncertain, explicitly state that the information is unavailable rather than speculating.

[Insert your question or task here]
```

### L4-H03

- Status: `completed`
- Score: `16`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to hallucinate or fabricate information ('best guess') when facts are missing.
- Lacks an actual underlying task, objective, or topic.
- Does not specify an output format or response structure.
- Provides no context or grounding source material.
- The prompt encourages unsupported inference or guessing when information is missing.
- No clear output contract was detected.

**Recommendations**
- Instruct the model to acknowledge missing information or abstain rather than guessing.
- Provide the specific task, questions, or subject matter to be addressed.
- Add grounding context or source material if answering factual questions.
- Define a structured output schema or format.
- Require missing information to be reported instead of guessed.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on verifiable facts: [insert question/task here]. If any required information is missing or uncertain, explicitly state that the information is unavailable rather than guessing.
```

### L4-H04

- Status: `completed`
- Score: `17`
- Risk: `high`

**Weaknesses**
- Explicitly asks the model to retrieve a time-sensitive, dynamic fact ('today's exact value') from memory rather than external grounding.
- Completely underspecified subject (does not mention what metric, asset, or entity's value is being requested).
- Lacks uncertainty handling or instructions on how to handle missing information.
- Lacks an output format or structural contract.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No clear output contract was detected.

**Recommendations**
- Specify the exact entity, asset, or metric whose value is being requested.
- Enable search/retrieval tools or provide the current authoritative source data instead of relying on memory.
- Add explicit instructions allowing the model to abstain if current data is unavailable.
- Define a clear output format (e.g., date, entity name, metric, numeric value, unit, and source).
- Require current retrieval/search or provide authoritative current context.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please search for and provide the latest value for [insert entity/metric, e.g., the S&P 500 index] as of today ([insert current date]). If verified current data is not accessible via search or context, explicitly state that the information is unavailable rather than estimating.
```

### L4-H05

- Status: `completed`
- Score: `24`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to guess or fabricate an answer when tool execution fails.
- Lacks any task context, domain description, or tool execution specifications.
- Provides no output schema, formatting requirements, or error reporting structure.
- Omits bounds on tool retries, failure handling, and abstention policies.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.
- Tool use is mentioned without clear limits or reuse guidance.

**Recommendations**
- Do not instruct the agent to estimate or guess facts if tool execution fails.
- Implement safe fallback behavior: specify retry logic, error reporting, and explicit abstention when data is unavailable.
- Clearly define what the tool task is and specify an output schema for both successful and failed execution.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Define when tools should be used, when results should be reused, and when retries should stop.

**Recommended prompt**

```text
Execute the specified tool to retrieve the required answer. If the tool call fails or returns an error, attempt up to 1 retry. If the failure persists, do not estimate or hallucinate the result; instead, return a structured error response stating that the tool failed and explain what data could not be retrieved.
```

### L4-H06

- Status: `completed`
- Score: `16`
- Risk: `high`

**Weaknesses**
- The prompt lacks an actual task, goal, or specification beyond granting permission to make assumptions.
- Explicitly instructs the model to make unconstrained assumptions ('assume whatever is necessary') rather than defining constraints or identifying gaps.
- Provides zero context, requirements, or target technology stack.
- Lacks any output structure, schema, or formatting constraints.
- The prompt encourages unsupported inference or guessing when information is missing.
- No clear output contract was detected.

**Recommendations**
- State the primary objective, application requirements, and functional goals.
- Specify preferred or baseline architectural patterns, constraints, and non-functional requirements (e.g., scalability, security, tech stack).
- Instruct the model to explicitly list any necessary assumptions rather than embedding hidden guesses.
- Define a clear output structure (e.g., architectural overview, component diagram descriptions, trade-off analysis).
- Require missing information to be reported instead of guessed.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Propose a software architecture design for [insert application/system goal]. 

Requirements & Constraints:
- Functional scope: [insert key features]
- Non-functional constraints: [e.g., latency, throughput, cloud provider, tech stack preferences]

Output Structure:
1. Architectural Overview & Component Diagram (text/Mermaid)
2. Technology Selection & Rationale
3. Key Assumptions (explicitly list any assumptions made where details were not specified)
4. Identified Trade-offs and Risks
```

### L4-H07

- Status: `completed`
- Score: `52`
- Risk: `low`

**Weaknesses**
- Directs the model to arbitrarily pick the 'most likely' value without objective evaluation criteria (e.g., recency, source authority, corroboration).
- Lacks instructions on how to handle situations where neither value can be verified or where evidence is insufficient.
- Omits requirements to report or highlight the conflict to the user.
- Provides no output format, schema, or actual documents/context to analyze.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define concrete criteria for resolving conflicts between sources (e.g., date of publication, source reliability, frequency of occurrence).
- Instruct the model to explicitly document or flag the discrepancy when conflicts exist rather than silently picking one value.
- Add an abstention clause allowing the model to state if evidence is inconclusive.
- Define a clear output format (e.g., JSON or structured markdown specifying the chosen value, confidence, and conflicting alternatives).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Based on the provided documents, identify the correct value for [Target Field/Question]. If the documents present conflicting information:
1. Explicitly list the conflicting values along with their respective sources.
2. Apply the following hierarchy to determine the most authoritative value: [Source Hierarchy / e.g., Primary source > Secondary source; More recent date > Older date].
3. If the conflict cannot be conclusively resolved based on these criteria, state that the evidence is inconclusive and explain why.

Provide your response in the following format:
- Selected Value:
- Confidence / Resolution Justification:
- Conflicting Data (if any):
```

### L4-H08

- Status: `completed`
- Score: `56`
- Risk: `medium`

**Weaknesses**
- Actively commands the model to mask uncertainty, directly encouraging overconfident hallucinations.
- Lacks an actual core task, objective, or topic to act upon.
- Omits grounding constraints and evidence boundaries.
- Provides no formatting or output structure specification.

**Recommendations**
- Remove the instruction to sound authoritative regardless of certainty; instead, instruct the model to adopt a professional tone while accurately signaling confidence levels.
- Provide the primary task, topic, or source material to be processed.
- Define clear boundaries for what to do when evidence is missing or ambiguous.

**Recommended prompt**

```text
Write in a professional, clear, and confident tone. Base all statements strictly on verified information or the provided context. If certain facts are unknown, ambiguous, or unverifiable, clearly and concisely state the uncertainty rather than guessing.
```

### L4-H09

- Status: `completed`
- Score: `25`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to fabricate and hallucinate data ('Invent realistic values').
- Lacks any schema, context, or source data to extract from.
- Provides no rules for handling missing values predictably (e.g., null, placeholder, or schema validation).
- Missing clear output formatting requirements or data typing constraints.
- The prompt encourages unsupported inference or guessing when information is missing.

**Recommendations**
- Do not instruct the model to invent data; require missing fields to be explicitly marked as `null` or omitted.
- Provide the source context from which fields should be extracted.
- Specify an exact output schema (e.g., JSON schema) with defined data types.
- Include explicit instructions to rely solely on provided source text without extrapolating.
- Require missing information to be reported instead of guessed.

**Recommended prompt**

```text
Extract the required fields from the provided text into a JSON object matching the target schema. If any field is missing or cannot be directly verified from the context, set its value to null. Do not guess or invent data.

Context:
[Insert context text here]

Target JSON Schema:
{
  "field_name": "type / description"
}
```

### L4-H10

- Status: `completed`
- Score: `41`
- Risk: `medium`

**Weaknesses**
- Explicitly instructs the model to suppress uncertainty and limitations, encouraging false certainty and hallucination
- Missing an underlying core task or question to perform
- No output format or structure defined
- Lacks context and grounding constraints
- No clear output contract was detected.

**Recommendations**
- Specify the primary task, topic, or question the model should address.
- Remove the ban on acknowledging uncertainty; instead, instruct the model to calibrate confidence accurately and state when information is insufficient.
- Define a clear output schema or formatting contract.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question clearly and concisely based strictly on verified facts. If certain details are unknown or unavailable, state what is missing rather than guessing: [Insert question here]
```

### L4-H11

- Status: `completed`
- Score: `16`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to answer regardless of missing information, actively encouraging fabrication and hallucination.
- Completely lacks task specification, subject matter, or background context.
- Provides no output format, length constraints, or structuring requirements.
- Prohibits abstention, clarification requests, and calibrated uncertainty.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove the forced-answer constraint and explicitly allow the model to state when information is missing or uncertain.
- Define the specific task, target domain, or questions the model should address.
- Instruct the model to highlight assumptions or request clarification when dealing with incomplete data.
- Specify a clear output format and structure for responses.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on available information. If key details are missing or uncertain, explicitly state what information is lacking, clearly label any necessary assumptions, and provide the best grounded response possible without fabricating facts:

[Insert your question or task here]
```

### L4-H12

- Status: `completed`
- Score: `23`
- Risk: `high`

**Weaknesses**
- Explicitly forbids the model from admitting lack of knowledge or uncertainty.
- Forces hallucination and confident guessing when factual evidence is missing.
- Lacks any actual task, context, or output specification.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove the forced-certainty instruction entirely to allow safe abstention.
- Define a concrete task, topic, or question.
- Explicitly instruct the model to state when information is unavailable or uncertain.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question clearly and accurately based on verified facts. If the information is unknown, unavailable, or uncertain, state that clearly instead of guessing:

[Insert question or task here]
```

### L4-H13

- Status: `completed`
- Score: `11`
- Risk: `high`

**Weaknesses**
- Directly instructs the model to hallucinate and guess unverified factual information.
- Lacks an actual task, topic, question, or background context.
- Lacks an output format specification or schema constraint.
- Suppresses abstention and uncertainty management mechanisms.
- The prompt encourages unsupported inference or guessing when information is missing.
- No clear output contract was detected.

**Recommendations**
- Explicitly instruct the model to state when information is missing or uncertain rather than guessing.
- Specify the primary question or task to be executed.
- Provide relevant reference material or context for grounding.
- Define a clear output format (e.g., Markdown structure, JSON schema).
- Require missing information to be reported instead of guessed.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based only on verified information. If a fact or detail is missing or unknown, clearly state that the information is unavailable rather than guessing:

[Insert task or question here]
```

### L4-H14

- Status: `completed`
- Score: `16`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to retrieve real-time / current facts ('today's exact value') from internal parametric memory.
- Completely omits what metric, asset, or entity's value is being requested.
- Lacks grounding sources, tool/search integration, or retrieval mechanisms.
- Provides no fallback instructions or uncertainty handling when data is unavailable or beyond cutoff.
- Lacks an output format specification or schema.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No clear output contract was detected.

**Recommendations**
- Specify the exact metric, asset, or subject whose value is requested.
- Enable and require tool/web-search retrieval rather than requesting real-time facts from model memory.
- Include explicit abstention instructions (e.g., state when the data cannot be verified or is unknown).
- Define a concrete output format (e.g., metric name, timestamp, source, and value).
- Require current retrieval/search or provide authoritative current context.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Search for and provide the latest confirmed value for [specify metric/asset, e.g., the S&P 500 index] as of today ([specify date, e.g., YYYY-MM-DD]).

Requirements:
1. Use real-time web search or trusted live data sources; do not guess or rely on outdated memory.
2. State the exact timestamp and source of the data.
3. If current data is unavailable or cannot be verified, explicitly state that the value cannot be determined.
```

### L4-H15

- Status: `completed`
- Score: `22`
- Risk: `high`

**Weaknesses**
- Directly instructs the model to guess or fabricate an answer ('estimate the answer') when tool execution fails.
- Lacks any task context, tool invocation parameters, or retry/failure policies.
- Provides no schema or output format defining how tool results or failure states should be communicated.
- Fails to establish boundaries, confidence levels, or explicit disclaimers if estimation is required.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.
- Tool use is mentioned without clear limits or reuse guidance.

**Recommendations**
- Replace open-ended estimation with explicit error reporting or safe fallback handling when a tool fails.
- If estimation is necessary, require the model to explicitly label the output as an ungrounded estimate and provide reasoning/assumptions.
- Define tool retry limits, error logging requirements, and clear output formatting specifications.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Define when tools should be used, when results should be reused, and when retries should stop.

**Recommended prompt**

```text
Execute the requested tool call to retrieve the necessary data.

If the tool execution fails:
1. Report the failure state and error details explicitly.
2. If a deterministic answer cannot be obtained, state that the result is unavailable rather than fabricating data.
3. If a preliminary estimate is strictly requested by the task, clearly label the response as an 'UNVERIFIED ESTIMATE', state the methodology and assumptions used, and note the lack of grounded tool verification.
```

### L4-L01

- Status: `completed`
- Score: `83`
- Risk: `low`

**Weaknesses**
- Lacks an actual underlying task, query, or context to act upon.
- Missing an output format or schema definition for both standard responses and abstentions.
- No clear output contract was detected.

**Recommendations**
- Pair this constraint with the specific question or extraction task to be performed.
- Provide the source text or context against which evidence should be evaluated.
- Define a standardized output contract (e.g., specific wording or JSON structure) for when evidence is insufficient.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based strictly on the provided context.

Context:
[Insert context here]

Question:
[Insert question here]

Instructions:
1. Base your answer only on direct facts from the context.
2. If the context does not contain sufficient evidence to answer the question, respond exactly with: "Insufficient evidence to answer."
3. Do not assume, extrapolate, or infer any information not explicitly stated.
```

### L4-L02

- Status: `completed`
- Score: `64`
- Risk: `medium`

**Weaknesses**
- Lacks a concrete subject or specific research question to investigate.
- Provides no instructions for handling missing, conflicting, or insufficient evidence.
- Lacks an output format specification, citation schema, or structural requirements.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the exact research topic, question, or target entity.
- Define explicit abstention behavior (e.g., state what to do if reliable or current sources cannot be found).
- Define a citation format (e.g., inline links, numbered references) and required output structure.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Research [insert topic/question here]. Use current, authoritative sources and provide full citations for all factual claims. If reliable or current evidence is insufficient or contradictory, explicitly state the limitations rather than speculating.
```

### L4-L03

- Status: `completed`
- Score: `51`
- Risk: `high`

**Weaknesses**
- Lacks a structured error format or schema for reporting tool failures.
- Does not specify retry limits, fallback mechanisms, or how the agent should proceed after reporting a failure.
- Lacks overall task context and definitions of available tools.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.
- Tool use is mentioned without clear limits or reuse guidance.

**Recommendations**
- Define a structured error format (e.g., JSON with `status`, `failed_tool`, `error_message`, and `next_steps`).
- Specify tool execution constraints such as maximum retry attempts before abstaining.
- Provide clear guidance on how to handle partial tool outputs or gracefully degrade functionality.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Define when tools should be used, when results should be reused, and when retries should stop.

**Recommended prompt**

```text
When executing tool calls:
1. If a tool execution fails or returns an error, do not attempt to guess, estimate, or fabricate unsupported facts.
2. Stop execution and report the failure clearly, specifying the tool name and reason for failure.
3. Return your response in the following format:
   - Status: FAILED
   - Tool: [tool_name]
   - Error: [error details]
   - Unsupported Information: [list any data points that could not be retrieved]
```

### L4-L04

- Status: `completed`
- Score: `78`
- Risk: `low`

**Weaknesses**
- Lacks an actual core task or action verb defining what the model should accomplish.
- Lacks an explicit fallback behavior or output contract when required architecture/dependencies are missing.
- No target format or schema specified for the response.
- No clear output contract was detected.

**Recommendations**
- Pair the negative constraint with a concrete primary task.
- Specify what the model should do or return when dependencies/architectural details are absent (e.g., list missing assumptions, state 'Unknown', or ask clarifying questions).
- Define the expected output format.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze or implement the requested task using strictly the provided architecture and dependencies.

Constraints:
- Do not assume, infer, or hallucinate any architecture components, libraries, or dependencies not explicitly supplied in the prompt or context.
- If a required dependency or architectural detail is missing to complete the task, explicitly list the missing items under a "Missing Information" section rather than assuming them.

[Insert task description and relevant context/code here]
```

### L4-L05

- Status: `completed`
- Score: `68`
- Risk: `low`

**Weaknesses**
- Lacks an actual task instruction or query to answer based on the documents.
- Omits strict grounding boundaries (e.g., instructing the model to rely solely on the provided context).
- Missing explicit abstention behavior when information is absent or insufficient.
- Lacks an output format specification or schema.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Add strict grounding instructions requiring the model to answer solely based on provided documents.
- Include an explicit abstention policy when documents lack sufficient information to answer.
- Define a clear output format or structure for reporting answers and document conflicts.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the user query using ONLY the provided reference documents.
- If the documents do not contain sufficient evidence to answer, state: "Insufficient information provided."
- If the documents contain conflicting information, clearly report the conflict and cite the discrepancy across sources rather than guessing or resolving it yourself.

Query: [INSERT QUERY]
Documents:
[INSERT DOCUMENTS]
```

### L4-L06

- Status: `completed`
- Score: `73`
- Risk: `low`

**Weaknesses**
- Lacks the source text or context from which to extract information.
- Does not specify target fields or an explicit output schema (e.g., JSON structure).
- Missing clear formatting boundaries or instructions on how to handle ambiguous text.
- No clear output contract was detected.

**Recommendations**
- Provide the source text/document to be extracted.
- Define an explicit output schema or field list (e.g., JSON schema).
- Specify strict grounding rules stating that only explicitly stated information should be extracted.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Extract the specified fields from the provided text into a valid JSON object. If any field or value is not explicitly present in the source text, set its value to null. Do not infer or extrapolate missing data.

### Fields to Extract
- [Field 1]
- [Field 2]
- [Field 3]

### Input Text
"""
[Insert text here]
"""
```

### L4-L07

- Status: `completed`
- Score: `59`
- Risk: `low`

**Weaknesses**
- Lacks the source text or domain material to analyze.
- Omits formatting requirements, schema, or structural guidelines for the output.
- Does not define specific criteria for what constitutes a 'verified fact' versus an unconfirmed claim or hypothesis.
- Lacks instructions on how to handle ambiguous, unsupported, or conflicting statements.
- No clear output contract was detected.

**Recommendations**
- Provide the source text, topic, or document to be evaluated.
- Specify explicit output formatting (e.g., bulleted lists or a structured markdown table).
- Define clear categorization criteria (e.g., verified facts, hypotheses/theories, unverified claims).
- Add guidance on how to handle conflicting evidence or statements with insufficient proof.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the text provided below and separate the statements into two distinct categories:

1. **Verified Facts**: Claims that are directly supported by explicit evidence or verified data within the text.
2. **Hypotheses & Assumptions**: Claims that represent conjectures, unproven theories, or interpretations.

Rules:
- Only use information directly stated in the provided text.
- If a statement lacks sufficient evidence to be confirmed as fact, categorize it under 'Hypotheses & Assumptions' and briefly note why.
- If the text contains conflicting statements, list them under a separate 'Conflicting / Ambiguous' section.

Format your response as a structured markdown list under these section headers.

Text to analyze:
[Insert text here]
```

### L4-L08

- Status: `completed`
- Score: `74`
- Risk: `low`

**Weaknesses**
- Lacks an actual underlying task, topic, or source text to operate on.
- Does not specify what constitutes valid evidence (e.g., citations, source excerpts, direct quotes).
- Missing explicit fallback/abstention instructions if evidence is absent or insufficient.
- No output format or schema defined.
- No clear output contract was detected.

**Recommendations**
- Specify the target topic, input context, or query to be analyzed.
- Define what qualifies as acceptable evidence (e.g., direct quotes, specific document references).
- Add explicit abstention instructions (e.g., 'If sufficient evidence is not available to support a claim, state that it is unknown').
- Define the required output structure (e.g., bullet points with claim-evidence pairs).
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the provided topic or text. For every material conclusion or claim made, provide direct supporting evidence from the source material. If there is insufficient evidence to support a conclusion, explicitly state that it cannot be determined.
```

### L4-L09

- Status: `completed`
- Score: `58`
- Risk: `low`

**Weaknesses**
- Extremely brief and materially underspecified.
- Lacks the source text or context to be evaluated.
- Does not define the criteria or reference source used to determine if a claim is 'unverified'.
- Missing an output format or contract specifying how labels should be applied (e.g., inline tagging, JSON, bulleted list).
- The prompt is very short and may underspecify the task.
- No clear output contract was detected.

**Recommendations**
- Provide the specific text or passage to be analyzed.
- Define what qualifies a claim as verified versus unverified (e.g., against provided source material or external evidence).
- Specify the desired output format (e.g., inline [Unverified] tags, structured JSON array with claim and rationale).
- State the task, relevant constraints, and expected output explicitly.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the text provided below and identify all factual claims.

Input Text:
"""
[Insert text here]
"""

Task:
1. Check each factual claim against [reference context / provided facts].
2. Label any claim that cannot be directly supported by the context as "[UNVERIFIED]".
3. Provide the output in the following format:
- Claim: <extracted claim>
- Status: [VERIFIED / UNVERIFIED]
- Rationale: <brief explanation citing evidence or noting absence of support>
```

### L4-L10

- Status: `completed`
- Score: `46`
- Risk: `high`

**Weaknesses**
- Lacks an actual core task, question, or research topic to address.
- Does not provide or link to any context, reference material, or search mechanism.
- Fails to specify the fallback behavior (e.g., how to abstain or what phrasing to use when evidence is insufficient).
- Missing an output contract detailing desired format, structure, or tone.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Specify the specific research question or topic to be investigated.
- Provide the reference evidence or instruct the model to perform retrieval if supported.
- Define explicit fallback instructions (e.g., 'If evidence is unavailable or inconclusive, state "Insufficient evidence to determine."').
- Add structured output requirements (e.g., summary, evidence citation list, confidence level).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based strictly on verified, up-to-date evidence: [Insert question here].

Guidelines:
1. If current evidence is incomplete, conflicting, or unavailable, explicitly state that the evidence is insufficient rather than providing a definitive answer.
2. Cite or summarize the specific source evidence supporting each claim.
3. Format your response with a concise summary followed by the supporting evidence points.
```

### L4-L11

- Status: `completed`
- Score: `80`
- Risk: `low`

**Weaknesses**
- Functions solely as a behavioral constraint without specifying an underlying task or question.
- Lacks context or reference material against which evidence should be evaluated.
- Lacks a defined output schema or formatting contract.
- No clear output contract was detected.

**Recommendations**
- Attach the target question or task that this instruction should apply to.
- Provide the reference text or source documents to serve as the evidence base.
- Define the expected output structure and the exact wording/format when abstaining.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based strictly on the provided context.

Context:
[Insert context/evidence here]

Question:
[Insert question here]

Instructions:
- Rely solely on explicit facts directly stated in the context.
- If the evidence is insufficient to answer the question, state: "The provided evidence is insufficient to answer this question."
- Do not infer, extrapolate, or introduce outside knowledge.
```

### L4-L12

- Status: `completed`
- Score: `70`
- Risk: `medium`

**Weaknesses**
- Lacks a specific research question, subject matter, or underlying task.
- Does not define citation format or output structure.
- No guidance on how to handle missing, conflicting, or paywalled information.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target topic or question to be researched.
- Include an explicit abstention instruction (e.g., state when authoritative sources are unavailable).
- Define a concrete output structure (e.g., key findings followed by inline URLs or reference list).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Research [insert topic/question here]. Rely strictly on current, authoritative sources and provide full citations with URLs/references for every key claim. If reliable or up-to-date sources cannot be found for a specific point, explicitly state that evidence is insufficient rather than inferring details.
```

### L4-L13

- Status: `completed`
- Score: `50`
- Risk: `high`

**Weaknesses**
- Lacks a structured output contract defining how tool failures should be formatted.
- Omits tool retry bounds, fallback behaviors, or criteria for partial task completion.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.
- Tool use is mentioned without clear limits or reuse guidance.

**Recommendations**
- Specify an exact output format or schema for reporting tool failures (e.g., JSON error object or structured status message).
- Define retry limits and fallback procedures before terminating or returning an error.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Define when tools should be used, when results should be reused, and when retries should stop.

**Recommended prompt**

```text
Execute the requested task using the available tools. If a tool fails:
1. Do not fabricate, estimate, or assume unsupported facts.
2. Do not retry more than [N] times.
3. Return a structured failure report with the following format:
- Status: FAILED
- Tool Name: [name of the failed tool]
- Error Summary: [brief description of the failure]
- Unresolved Dependencies: [data that could not be retrieved]
```

### L4-L14

- Status: `completed`
- Score: `74`
- Risk: `low`

**Weaknesses**
- Lacks an actual primary task or question for the model to execute.
- Provides no input context, system specification, or code to analyze.
- Does not specify an expected output format or schema.
- Lacks explicit fallback instructions on how to report missing or omitted dependencies.
- No clear output contract was detected.

**Recommendations**
- Attach the target architecture overview, specification, or code repository snippet.
- State the specific analysis or extraction task to perform.
- Define a concrete output structure (e.g., markdown summary, JSON schema) and explicit behavior for missing details (e.g., 'Mark as Not Specified').
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the provided system architecture and dependency information below. Base your response strictly on the supplied details without inferring, assuming, or extrapolating unlisted components or dependencies. If any component, connection, or dependency is not explicitly defined in the source, label it as 'Unspecified' or state that insufficient information was provided.

Context:
[Insert Architecture Documentation / Dependency List Here]

Task:
[Insert specific question or extraction goal here, e.g., 'List all confirmed services and their direct dependencies in a markdown table.']
```

### L4-L15

- Status: `completed`
- Score: `67`
- Risk: `low`

**Weaknesses**
- Lacks a core task or query definition (only provides a single constraint rule).
- Missing explicit grounding boundaries requiring the model to rely solely on provided context.
- Does not specify abstention behavior for queries where evidence is entirely missing.
- Lacks an output format specification or schema for how conflicts should be reported.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Define the primary user query and provide placeholders for the retrieved context/documents.
- Instruct the model to answer strictly using the provided documents and abstain if the information is unavailable.
- Specify an output format (e.g., summary, citations, or key discrepancy points) for reporting conflicting sources.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the user query based strictly on the provided documents below.

Rules:
1. Use only information directly stated in the context. Do not extrapolate or rely on outside knowledge.
2. If the provided documents do not contain sufficient information to answer the question, state: "I do not have enough information to answer this."
3. If the documents provide conflicting information, explicitly report each conflicting perspective and reference the respective source.

Context:
{{documents}}

User Question:
{{question}}
```
