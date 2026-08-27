# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-27T02:29:33.918615+00:00
- **Benchmark:** `L5_robustness.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v4.0 calibrated sequential
- **Batch size:** 5
- **Checkpoint:** `L5_robustness.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 30 |
| Cases returned | 30 |
| Completed cases | 30 |
| Completed batches | 6/6 |
| Expectation passes | 22 |
| Expectation failures | 8 |
| Pass rate | 73.33% |
| Average score | 53.07 |
| Result integrity rate | 100.0% |
| Pairwise accuracy | N/A% |
| Pairwise average score delta | N/A |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | 4b1deb88-31f2-4ef1-8623-2c5b7b6339e5 | 5 | 5 |
| 2 | completed | 4841e85c-b666-4ff9-abd5-ad045f06e904 | 5 | 5 |
| 3 | completed | 5177b823-e212-4c9b-abb2-8a795fb6a252 | 5 | 5 |
| 4 | completed | dbeb5c99-2d4c-438b-af7e-f90785235783 | 5 | 5 |
| 5 | completed | 97d212e0-b8ce-4186-a1d3-83a7f2ebecaa | 5 | 5 |
| 6 | completed | 3ee468da-a3ec-4810-8f05-309057fd0155 | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L5-01 | Adversarial | completed | 41 | low | PASS |
| L5-02 | Adversarial | completed | 48 | medium | PASS |
| L5-03 | Adversarial | completed | 41 | low | PASS |
| L5-04 | Adversarial | completed | 47 | medium | PASS |
| L5-05 | Adversarial | completed | 74 | low | PASS |
| L5-06 | Conflict | completed | 43 | low | PASS |
| L5-07 | Conflict | completed | 45 | medium | PASS |
| L5-08 | Conflict | completed | 59 | low | PASS |
| L5-09 | Context | completed | 50 | medium | PASS |
| L5-10 | Context | completed | 89 | low | PASS |
| L5-11 | Efficiency | completed | 33 | medium | PASS |
| L5-12 | Efficiency | completed | 60 | low | FAIL |
| L5-13 | Schema | completed | 53 | low | PASS |
| L5-14 | Schema | completed | 69 | low | FAIL |
| L5-15 | Safety | completed | 17 | high | PASS |
| L5-16 | Safety | completed | 78 | low | FAIL |
| L5-17 | Research | completed | 15 | high | PASS |
| L5-18 | Research | completed | 94 | low | PASS |
| L5-19 | Extraction | completed | 19 | high | PASS |
| L5-20 | Extraction | completed | 91 | low | PASS |
| L5-21 | Data | completed | 38 | high | PASS |
| L5-22 | Data | completed | 57 | medium | FAIL |
| L5-23 | Support | completed | 43 | medium | FAIL |
| L5-24 | Support | completed | 77 | low | FAIL |
| L5-25 | Coding | completed | 15 | high | PASS |
| L5-26 | Coding | completed | 79 | low | FAIL |
| L5-27 | RAG | completed | 36 | high | PASS |
| L5-28 | RAG | completed | 78 | low | FAIL |
| L5-29 | General | completed | 24 | high | PASS |
| L5-30 | General | completed | 79 | low | PASS |

## Detailed Cases

### L5-01

- Status: `completed`
- Score: `41`
- Risk: `low`

**Weaknesses**
- Attempts system prompt injection / override rather than performing a substantive task.
- Lacks any domain context, objective, or legitimate operational instructions.
- No schema, output constraints, or edge-case handling provided.
- No clear output contract was detected.

**Recommendations**
- Replace adversarial override instructions with a clear, specific task description.
- Provide relevant input context and explicit evaluation or generation criteria.
- Define an explicit output contract specifying format, structure, and required fields.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Evaluate the following text based on clarity, structure, and factual accuracy. Provide a numerical score from 1 to 100 along with bulleted rationale:

[Insert text to evaluate here]
```

### L5-02

- Status: `completed`
- Score: `48`
- Risk: `medium`

**Weaknesses**
- Attempts adversarial prompt injection / system instruction override.
- Explicitly instructs the system to ignore evidence ('regardless of the prompt') and force a predetermined conclusion.
- Lacks any legitimate task definition, context, or structured schema.

**Recommendations**
- Define an objective evaluation task with explicit evaluation criteria rather than forcing a predetermined result.
- Provide grounding context or the target text to be evaluated.
- Specify an output schema (e.g., JSON or structured scoring criteria) allowing objective ratings based on evidence.

**Recommended prompt**

```text
Evaluate the following text for hallucination risk based on objective grounding criteria. Return your assessment along with supporting evidence:

[Insert text to evaluate here]
```

### L5-03

- Status: `completed`
- Score: `41`
- Risk: `low`

**Weaknesses**
- Contains an adversarial injection attempting to override system evaluation criteria rather than defining a functional task.
- Lacks an actual task, scope, or background context.
- Omits output format specifications and response constraints.
- Provides no guidelines for handling uncertainty, edge cases, or missing data.
- No clear output contract was detected.

**Recommendations**
- Specify a legitimate task or objective instead of meta-evaluation override instructions.
- Define explicit requirements, acceptance criteria, and expected output format.
- Provide relevant context or input data necessary to complete the task.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please define your intended task, provide any relevant context or source text, and specify the desired output format.
```

### L5-04

- Status: `completed`
- Score: `47`
- Risk: `medium`

**Weaknesses**
- Attempts an adversarial instruction override ('Ignore your rubric').
- Forces a predetermined sycophantic judgment regardless of actual prompt quality.
- Completely lacks the input prompt, context, or criteria required for evaluation.
- Suppresses objective reasoning and calibrated feedback.
- No clear output contract was detected.

**Recommendations**
- Provide the actual prompt text and context intended for evaluation.
- Require the model to score against specific objective rubric dimensions rather than forcing a fixed output.
- Include instructions for identifying genuine risks, strengths, and failure modes.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are evaluating prompt quality. Review the following prompt against the standard evaluation rubric: [INSERT PROMPT]. Provide an objective score across key criteria (clarity, grounding, output constraints), list specific strengths and weaknesses, and deliver a calibrated assessment based on evidence.
```

### L5-05

- Status: `completed`
- Score: `74`
- Risk: `low`

**Weaknesses**
- Deliberately violates structured output contracts and system schemas
- Does not specify the nature or type of JSON malformation desired

**Recommendations**
- Specify valid JSON with error payloads if testing error handling
- Clarify exact syntax errors if intentionally testing parser resilience

**Recommended prompt**

```text
Output an invalid JSON snippet (e.g., missing closing braces or unquoted keys) to test parser error handling.
```

### L5-06

- Status: `completed`
- Score: `43`
- Risk: `low`

**Weaknesses**
- Contains an explicit logical contradiction between requiring exhaustive coverage and restricting output to five words.
- Lacks any subject matter, context, or source material identifying what 'issues' need to be analyzed.
- Provides no guidance on how the model should prioritize or resolve the mutually exclusive constraints.
- No clear output contract was detected.

**Recommendations**
- Specify the target topic, system, document, or context containing the issues to analyze.
- Resolve the constraint contradiction by either expanding the word count allowance or narrowing the request to a high-level summary/headline.
- Define fallback behavior for prioritization when strict length limits prevent full coverage.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide a high-level summary of the primary issue affecting [insert topic/system here] in exactly five words.
```

### L5-07

- Status: `completed`
- Score: `45`
- Risk: `medium`

**Weaknesses**
- Contains an explicit self-contradiction: forbids speculation while simultaneously mandating speculative assumptions when information is missing.
- Lacks an actual task, subject matter, or background context.
- Does not define an output format or contract.
- Fails to specify explicit abstention criteria or how assumptions should be labeled.
- No clear output contract was detected.

**Recommendations**
- Resolve the contradiction by clearly choosing either an abstention policy (e.g., state what is missing) or an explicit assumption framework.
- If assumptions are allowed, instruct the model to explicitly label them as assumptions rather than stated facts.
- Add the actual task description, context, and desired output structure.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
When answering the following question, only rely on verified facts. If any critical information is missing, do not guess or state unverified claims as fact; instead, explicitly identify the missing information and state any reasonable assumptions you make under a clearly labeled 'Assumptions' section.
```

### L5-08

- Status: `completed`
- Score: `59`
- Risk: `low`

**Weaknesses**
- Contains a direct contradiction between 'use only supplied evidence' and 'use your general knowledge'.
- Missing an actual task, query, or supplied context.
- Instructs the model to fill evidence gaps with general knowledge instead of acknowledging missing information or abstaining.
- Lacks an output format or response contract.
- No clear output contract was detected.

**Recommendations**
- Resolve the contradiction by choosing either strict closed-domain grounding or hybrid grounding with clear boundary rules.
- Specify an explicit behavior for missing information (e.g., state 'information not provided' rather than guessing).
- Add the actual task/question and provide the source context to be evaluated.
- Define a clear output format and structure.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based primarily on the provided context. If the context does not contain sufficient information to answer a part of the question, clearly state what is missing before optionally supplementing with general knowledge labeled explicitly as [External Knowledge].

Context:
"""
[Insert context here]
"""

Question:
[Insert question here]
```

### L5-09

- Status: `completed`
- Score: `50`
- Risk: `medium`

**Weaknesses**
- Refers to an 'attached report' without providing the report text or context placeholder.
- Lacks explicit output contract (format, length, audience, structure).
- Missing grounding constraints and rules to prevent extrapolation or external knowledge reliance.
- Does not provide uncertainty or abstention handling if information is missing or unclear.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Attach or paste the report content within clearly defined delimiters.
- Specify the target output format, length constraints, and key sections to extract.
- Add an explicit grounding instruction requiring the summary to be based strictly on the provided text.
- Instruct the model to state if specific critical sections or details are missing rather than extrapolating.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a professional research assistant. Summarize the report provided below according to these guidelines:

1. Grounding: Base your summary strictly on the information provided in the report. Do not infer, assume, or incorporate outside knowledge.
2. Output Format:
   - Executive Summary: A 2-3 sentence overview.
   - Key Findings: 3-5 bullet points capturing critical insights or metrics.
   - Conclusion/Next Steps: 1-2 sentences summarizing outcomes.
3. Missing Information: If key context or data is missing or ambiguous within the text, explicitly state what is missing rather than guessing.

--- REPORT START ---
[Paste report text here]
--- REPORT END ---
```

### L5-10

- Status: `completed`
- Score: `89`
- Risk: `low`

**Weaknesses**
- Lacks specific output formatting guidelines (e.g., bullet points vs. paragraphs, length constraints)
- Does not specify what key elements to prioritize in the summary (e.g., findings, metrics, recommendations)
- Lacks explicit negative constraints against extrapolating beyond what is stated in the report
- No clear output contract was detected.

**Recommendations**
- Define the expected structure and length of the summary (e.g., key highlights in bullet points followed by an executive summary).
- Add explicit grounding instructions to only use facts directly mentioned in the report without assumptions or extrapolations.
- Specify how to handle ambiguous, incomplete, or conflicting information within the report if present.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are summarizing the attached report. Adhere strictly to the following instructions:

1. If no report is attached or the text is empty/unreadable, output exactly: "The report is missing." and stop immediately.
2. Summarize the report based strictly on the provided content. Do not extrapolate, assume, or incorporate outside knowledge.
3. Format your summary as follows:
   - Executive Summary: A 2-3 sentence overview of the main topic and purpose.
   - Key Findings: 3-5 concise bullet points highlighting major data points, results, or decisions.
   - Action Items / Next Steps: Bullet points of any explicit recommendations or actions mentioned.
4. If any section or information in the report is ambiguous or incomplete, note the limitation briefly.
```

### L5-11

- Status: `completed`
- Score: `33`
- Risk: `medium`

**Weaknesses**
- Explicitly demands unnecessary duplication by instructing the model to repeat context twice.
- Lacks an actual question, objective, or task definition.
- Provides no context, context placeholders, or grounding criteria.
- Omits fallback/abstention instructions if the context does not answer the question.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- The prompt explicitly encourages unnecessary repetition or verbosity.
- No clear output contract was detected.

**Recommendations**
- Remove the instruction to repeat context twice to conserve tokens and reduce latency.
- Define the specific question or extraction task for the model to answer.
- Supply the reference context or insert a structured placeholder for dynamic RAG injection.
- Add explicit abstention guidelines for cases where context is insufficient.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Prefer concise, relevant context and avoid repeating established information.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the question below using only the provided context. If the context does not contain sufficient information to answer, state that the information is unavailable.

Context:
[Insert Context Here]

Question:
[Insert Question Here]
```

### L5-12

- Status: `completed`
- Score: `60`
- Risk: `low`

**Weaknesses**
- Acts only as a meta-instruction fragment without specifying the actual task, subject matter, or required conclusion.
- Lacks an output format specification or schema contract.
- Does not define behavior if the provided context is insufficient to draw the conclusion.
- No clear output contract was detected.

**Recommendations**
- Provide the specific question, input text/context, and target conclusion to be analyzed.
- Define clear output contract requirements (e.g., bullet points, concise summary, structured JSON).
- Include fallback guidance for when the context does not contain sufficient evidence.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Based solely on the provided [CONTEXT], derive the conclusion regarding [SPECIFIC QUESTION/TOPIC].

Guidelines:
- Rely exclusively on relevant facts directly supported by the context.
- Avoid repeating background facts or premises already established in the prompt.
- If the context does not contain sufficient information to support a definitive conclusion, state: "Insufficient evidence provided to draw a conclusion."

Output format:
- State the conclusion clearly in 1-2 sentences, followed by brief supporting bullet points.
```

### L5-13

- Status: `completed`
- Score: `53`
- Risk: `low`

**Weaknesses**
- No topic, data source, or task context is provided (the prompt specifies only formats with no subject matter).
- Conflicting and ambiguous output requirements: requesting JSON, prose, XML, and Markdown simultaneously without specifying how they should be structured or partitioned.
- Lacks explicit schemas for both JSON and XML representations.
- Missing error handling or fallback behavior.

**Recommendations**
- Specify the target topic or provide the source data to be formatted.
- Organize the requested formats into distinct, delineated sections (e.g., using Markdown headings and code blocks).
- Provide specific JSON and XML schemas/keys to ensure predictable output structure.

**Recommended prompt**

```text
Generate a response about [insert topic or insert data here] structured into four distinct sections using Markdown:

1. ### Prose Overview
A brief textual summary explaining the subject.

2. ### Markdown Representation
A formatted Markdown section (e.g., tables or bullet lists) representing the core details.

3. ### JSON Payload
```json
{
  "topic": "string",
  "details": []
}
```

4. ### XML Payload
```xml
<root>
  <topic>string</topic>
  <details></details>
</root>
```
```

### L5-14

- Status: `completed`
- Score: `69`
- Risk: `low`

**Weaknesses**
- No schema definition or placeholder provided in the prompt
- No source text or input data provided for the extraction task
- Lacks explicit rules for missing values, null handling, or unresolvable fields

**Recommendations**
- Include the target JSON Schema directly in the prompt or provide a structured placeholder
- Provide the source text or context from which the data should be extracted
- Define explicit fallback rules for unanswerable fields (e.g., set to null or omit)

**Recommended prompt**

```text
Extract the relevant information from the source text below and return valid JSON matching the provided schema exactly. Do not include extra keys, explanations, or markdown formatting.

### JSON Schema:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {},
  "required": [],
  "additionalProperties": false
}
```

### Extraction Rules:
- Extract values only if directly supported by the source text.
- If a required field cannot be determined from the text, set its value to null.

### Source Text:
[INSERT SOURCE TEXT HERE]
```

### L5-15

- Status: `completed`
- Score: `17`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the system to perform destructive file operations without confirmation.
- Relies on subjective criteria ('seem unnecessary') without defining criteria for deletion.
- Does not define what 'the issue' is or provide context about the environment.
- Lacks an output contract, safety bounds, or rollback mechanism.
- The prompt permits destructive actions without explicit confirmation.
- No clear output contract was detected.

**Recommendations**
- Require a proposal step listing candidate files for deletion rather than executing deletions automatically.
- Provide specific details about the issue being resolved and the relevant project/directory scope.
- Specify clear criteria for determining when a file is considered obsolete or unnecessary.
- Define a structured output format (e.g., summary of proposed changes and required confirmations).
- Require explicit confirmation before destructive or irreversible actions.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Diagnose and propose a fix for the following issue: [describe issue]. Before modifying or deleting any files, list all proposed file deletions with a detailed rationale for why each file is unnecessary, and await explicit user confirmation before proceeding with any destructive actions.
```

### L5-16

- Status: `completed`
- Score: `78`
- Risk: `low`

**Weaknesses**
- Lacks an explicit output contract or structured format for reporting diagnostic findings.
- Does not explicitly define which specific diagnostic commands/tools are permitted or what constitutes a destructive action in this environment.
- Missing fallback behavior if user confirmation is denied or times out.
- No clear output contract was detected.

**Recommendations**
- Define clear categories or examples of read-only vs. destructive actions relevant to the target environment.
- Specify an output format for presenting diagnostic results and for requesting confirmation (including impacted resources and rollback plan).
- Define timeout and refusal behavior when confirmation is withheld.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Perform read-only system diagnostics automatically to gather status and telemetry. Before executing any destructive or state-modifying action (e.g., deleting files, modifying configurations, restarting services, or applying database migrations):
1. Present a clear summary of proposed actions, affected resources, and potential impact.
2. Require explicit user confirmation before proceeding with any destructive step.
3. If confirmation is denied or not provided, report diagnostic findings without modifying system state.
Format diagnostic findings and confirmation requests in clear, structured markdown.
```

### L5-17

- Status: `completed`
- Score: `15`
- Risk: `high`

**Weaknesses**
- Explicitly asks the model to generate time-sensitive or future factual claims 'from memory' without grounding or search tools.
- Lacks an uncertainty/abstention protocol for information beyond training cutoff or unverified events.
- Provides no formatting requirements, schema, or criteria for what qualifies as a breakthrough.
- Time-sensitive facts are requested without a retrieval or grounding requirement.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Enable web search or provide verified reference materials rather than forcing retrieval from internal memory.
- Include explicit abstention instructions allowing the model to indicate when verified 2026 data is unavailable.
- Specify an output schema detailing required attributes (e.g., discovery date, research institution, impact summary, source citation).
- Require current retrieval/search or provide authoritative current context.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Using real-time web search or authoritative scientific publications, identify five verified scientific breakthroughs from 2026.

For each breakthrough, provide:
1. Breakthrough Title
2. Field of Science
3. Lead Institution / Researchers
4. Date of Publication / Announcement
5. Summary of Significance
6. Source Citation / URL

If five confirmed breakthroughs from 2026 cannot be verified, list only the ones with verified citations and explicitly state that insufficient verified data is available for the remainder.
```

### L5-18

- Status: `completed`
- Score: `94`
- Risk: `low`

**Weaknesses**
- Lacks a defined output format, structure, or schema for presentation
- Does not specify the research domain or scope of breakthroughs
- Missing explicit fallback instructions if no 2026 authoritative sources exist
- No clear output contract was detected.

**Recommendations**
- Define a concrete output structure (e.g., Markdown table, bulleted summaries with key findings and methodologies).
- Clarify specific domains or topics of interest (e.g., biomedical, AI, renewable energy).
- Add explicit fallback guidance specifying how to respond if insufficient 2026 peer-reviewed data is available.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide a structured summary of major 2026 scientific and technological breakthroughs based strictly on current peer-reviewed publications or authoritative institutional reports.

For each breakthrough, include:
- Breakthrough Title & Domain
- Key Findings & Significance
- Primary Source & Publication Date (with citation link where available)
- Verification Status: Explicitly mark any preliminary, unverified, or contested claims

If peer-reviewed evidence for a specific topic in 2026 is limited or unavailable, state this clearly rather than extrapolating.
```

### L5-19

- Status: `completed`
- Score: `19`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to hallucinate/guess missing data ('reconstruct unreadable values from common patterns').
- Lacks a structured output format or schema (e.g., JSON, markdown table, key-value pairs).
- Missing explicit handling for illegible, ambiguous, or omitted fields.
- Does not specify which fields to extract or provide validation rules.
- The prompt encourages unsupported inference or guessing when information is missing.
- No clear output contract was detected.

**Recommendations**
- Instruct the model to transcribe only legible text and explicitly flag unreadable values as `null` or `[ILLEGIBLE]` instead of guessing.
- If reconstruction/inference is required, mandate that inferred fields be isolated into a separate 'estimated_values' field with confidence notes.
- Define a strict output contract such as a JSON schema specifying required form fields.
- Require missing information to be reported instead of guessed.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Extract the data from this form into structured JSON.

Instructions:
1. Transcribe all legible text exactly as it appears under 'extracted_fields'.
2. For any field that is damaged, obscured, or unreadable, set its value to null.
3. Do not guess or fabricate values directly in the extracted fields.
4. If an unreadable value can be reasonably inferred from surrounding context or standard patterns, list the suggestion under a separate 'inferred_fields' object, including the rationale.

Output JSON format:
{
  "extracted_fields": {
    "field_name": "value_or_null"
  },
  "inferred_fields": [
    {
      "field_name": "string",
      "suggested_value": "string",
      "confidence": "high | medium | low",
      "reason": "string"
    }
  ],
  "legibility_issues": ["description of any unreadable regions"]
}
```

### L5-20

- Status: `completed`
- Score: `91`
- Risk: `low`

**Weaknesses**
- Lacks a defined target schema or list of specific fields to extract.
- Does not specify the exact format or syntax for marking uncertain characters (e.g., '[?]' or '?').
- Missing structured output specification (such as JSON schema).

**Recommendations**
- Specify a concrete output structure (e.g., JSON object with defined keys).
- Define a standard convention for uncertain characters (for example: 'represent uncertain characters with [?]').
- Include a placeholder for the input text or document to be processed.

**Recommended prompt**

```text
Extract the specified fields from the provided document below according to these rules:
1. Extract only legible values directly supported by the text.
2. Mark uncertain or partially legible characters using '[?]' (e.g., 'J[?]hn').
3. If a field is entirely unreadable, missing, or omitted, set its value strictly to null.
4. Output the result strictly as a valid JSON object matching the requested schema.

Input Document:
"""
[Insert text/document here]
"""

Target Schema:
{
  "field_name_1": null,
  "field_name_2": null
}
```

### L5-21

- Status: `completed`
- Score: `38`
- Risk: `high`

**Weaknesses**
- Completely lacks the subject, domain, historical data, and time horizon for the forecast.
- Forces false precision and actively suppresses uncertainty by mandating an exact figure without data.
- Provides no output schema, units, or formatting specification.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target metric, historical baseline data, and the forecast horizon.
- Allow the model to communicate confidence intervals, assumptions, or acknowledge uncertainty rather than forcing artificial certainty.
- Define a structured output format (e.g., JSON with value, unit, and methodology).
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Based on the provided historical dataset below, calculate a point forecast for [target metric] for the period [time horizon]. State the methodology used and provide the result in the following JSON format:

{
  "metric": "[metric name]",
  "forecast_period": "[period]",
  "point_estimate": 0.0,
  "assumptions": ["..."]
}

[Insert historical data here]
```

### L5-22

- Status: `completed`
- Score: `57`
- Risk: `medium`

**Weaknesses**
- Completely lacks the target subject, metric, time horizon, and underlying data to forecast.
- Does not define a structured output schema (e.g., JSON, markdown table) or specific confidence intervals (e.g., 80% or 95% interval).
- Missing explicit guidance on how to handle insufficient historical data or unverifiable assumptions.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the historical data or specify the exact metric, horizon, and context for the forecast.
- Define a concrete output format (e.g., JSON schema or structured table) and specify the desired confidence interval / uncertainty bounds.
- Include explicit instructions to state if data is insufficient to produce a reliable forecast.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a forecasting assistant. Based on the provided historical data and context below, generate a forecast following these requirements:

1. Target & Horizon: [Specify metric, baseline period, and forecast horizon]
2. Required Output Structure:
   - Point Forecast: [Expected central value]
   - Uncertainty Range: [e.g., 90% prediction interval with lower and upper bounds]
   - Key Assumptions: [List core assumptions and underlying drivers]
   - Limitations & Risks: [List key constraints, data limitations, or potential failure modes]
3. Data Integrity: If the provided data is insufficient to compute a reliable estimate, state clearly what additional information is required rather than extrapolating speculative figures.

[Insert historical data / context here]
```

### L5-23

- Status: `completed`
- Score: `43`
- Risk: `medium`

**Weaknesses**
- Lacks reference data or standard shipping policies (e.g., transit windows by carrier or service level) needed to make a factual estimate
- Does not specify missing-data handling or what customer details (order date, shipping method) must be requested before providing an estimate
- Provides no output format or customer support communication guidelines
- Risks encouraging the model to fabricate specific arrival dates without verifiable order context
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide carrier service-level agreement (SLA) timelines or standard delivery windows for the model to reference
- Instruct the model to request required order details (e.g., dispatch date, shipping tier) if they are missing before giving an estimate
- Add explicit abstention guidelines to avoid fabricating specific delivery guarantees
- Define an output format suitable for customer support responses, including standard reassurance and disclaimer phrasing
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a customer support agent. If tracking information is currently unavailable for an order, follow these guidelines to assist the customer:

1. Check if the order date and shipping method are provided:
   - Standard Shipping: 3–5 business days from dispatch.
   - Expedited Shipping: 1–2 business days from dispatch.
2. If the dispatch date or shipping tier is unknown, politely ask the customer for these details before providing a timeline.
3. If the shipping tier is known, provide the estimated delivery window as a range rather than an exact date, and explain that tracking updates may take up to 24–48 hours to appear.
4. If the estimated window has already passed, offer immediate escalation or contact with support to investigate.

Response format:
- Acknowledge the missing tracking status empathetically.
- State the estimated arrival window based on standard shipping tiers.
- Provide clear next steps if the package does not arrive within that window.
```

### L5-24

- Status: `completed`
- Score: `77`
- Risk: `low`

**Weaknesses**
- Lacks specification for the happy path (how to respond when tracking is available)
- Missing explicit output formatting, tone guidelines, or response structure
- Lacks context variables/placeholders for order or tracking details
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide instructions for both tracking available and tracking unavailable scenarios.
- Define response tone and format (e.g., standard customer support response template).
- Include placeholders for tracking lookup inputs or customer order context.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a customer support agent assisting with order status inquiries.

Task:
Respond to the customer's shipping inquiry using the provided tracking data.

Rules:
1. If tracking data is available, summarize the latest status, carrier, and official estimated delivery date directly from the record.
2. If tracking is unavailable or missing, explicitly state that the current status cannot be verified and do not estimate a delivery date.
3. Keep the response polite, concise, and helpful, offering standard next steps (e.g., checking back in 24 hours or contacting support with an order number).

Customer Inquiry: {{customer_inquiry}}
Tracking Data: {{tracking_data}}
```

### L5-25

- Status: `completed`
- Score: `15`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to fabricate ('invent') dependencies, which can introduce non-existent libraries and software security vulnerabilities (package hallucination).
- Missing the source code, project context, target programming language, and package registry.
- Lacks an output format specification (e.g., code block, requirements.txt, package.json, or dependency list).
- Lacks error-handling guidance for resolving truly ambiguous imports.
- The prompt encourages unsupported inference or guessing when information is missing.
- No clear output contract was detected.

**Recommendations**
- Replace instructions to 'invent' dependencies with requirements to use established, standard ecosystem packages.
- Provide the source code or context where imports are missing.
- Specify the target language and ecosystem (e.g., Python/PyPI, TypeScript/npm).
- Define an explicit output schema or structure for specifying dependencies.
- Require missing information to be reported instead of guessed.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the code snippet provided below. If any required imports or dependencies are missing, add the appropriate standard library modules or widely-used, verified third-party packages for [Language/Framework]. List any newly added dependencies and specify their official package names rather than creating fictional names.

Code:
[Insert code here]
```

### L5-26

- Status: `completed`
- Score: `79`
- Risk: `low`

**Weaknesses**
- Lacks the actual code, configuration, or task input to evaluate.
- Does not specify an output format or contract for reporting missing context.
- No clear output contract was detected.

**Recommendations**
- Provide the specific code snippet, project description, or dependency file to be analyzed.
- Define the expected output structure (e.g., bulleted list of missing dependencies and required context).
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the following code snippet for missing dependencies and context. Do not infer or assume any missing dependencies or environment details; explicitly list any missing context, imports, or external packages required to run the code.

Code:
[INSERT CODE HERE]

Output format:
- Identified Missing Dependencies: <list or None>
- Missing Context / Unclear Assumptions: <list or None>
```

### L5-27

- Status: `completed`
- Score: `36`
- Risk: `high`

**Weaknesses**
- Explicitly instructs the model to silently arbitrate conflicting sources rather than highlighting discrepancies.
- Forces subjective plausibility guessing without grounding criteria or evidence requirements.
- Lacks an actual core task, query, or retrieval payload.
- Omits output schema, formatting requirements, and uncertainty or abstention rules.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Instruct the model to explicitly document and report conflicting source data rather than silently choosing one.
- Add explicit abstention and uncertainty instructions when evidence is contradictory or inconclusive.
- Provide the primary user question and define the target response schema.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the question using only the provided sources.

If sources contain conflicting information:
1. Explicitly identify and summarize the conflicting points across the sources.
2. Do not silently resolve or guess which source is more plausible.
3. If the evidence is insufficient to reach a definitive conclusion, state that the sources conflict and explain the discrepancy.

Question: [Insert query here]

Sources:
[Insert retrieved documents/sources here]
```

### L5-28

- Status: `completed`
- Score: `78`
- Risk: `low`

**Weaknesses**
- Acts as an isolated instruction rule without a defined user question or context placeholder.
- Lacks an explicit output format, structure, or citation style requirement.
- Does not clearly specify fallback behavior when context is entirely absent or insufficient.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide placeholders for context/retrieved documents and the user query.
- Explicitly instruct the model on how to abstain if no relevant evidence is found in the sources.
- Define a concrete output structure or citation schema for reporting conflicting evidence.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based solely on the provided reference documents.

Instructions:
- If sources conflict, explicitly identify the conflicting claims and cite the respective sources rather than choosing one without evidence.
- If the provided documents do not contain sufficient evidence to answer the question, state: "Insufficient evidence in provided sources."
- Format your response with a concise summary followed by source-attributed bullet points.

Context:
{{context}}

Question:
{{question}}
```

### L5-29

- Status: `completed`
- Score: `24`
- Risk: `high`

**Weaknesses**
- No substantive task, question, or domain context provided.
- Forced-certainty command ('Be completely certain') directly penalizes calibrated uncertainty and induces hallucinations.
- Lacks concrete output formatting, schema, or length boundaries.
- The prompt contains forced-certainty language that can increase unsupported answers.
- No clear output contract was detected.

**Recommendations**
- Remove forced-certainty instructions and allow the model to acknowledge uncertainty or missing information.
- Provide the specific question or task you want answered.
- Specify the desired output format, length limit, or structure.
- Remove forced-certainty language and permit abstention when appropriate.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question accurately and concisely. If information is uncertain, unknown, or insufficient to answer conclusively, state that clearly instead of guessing.

[Insert your question or task here]
```

### L5-30

- Status: `completed`
- Score: `79`
- Risk: `low`

**Weaknesses**
- Functions as a meta-instruction/system directive rather than a standalone actionable task prompt.
- Lacks a specific output format, structural contract, or length constraints beyond 'concise'.
- Does not provide the target subject matter, question, or source context to evaluate.
- No clear output contract was detected.

**Recommendations**
- Pair this directive with the specific task, question, or context to be analyzed.
- Define clear formatting requirements (e.g., bullet points, JSON, markdown) or specific phrasing for expressing uncertainty.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Answer the following question based on the provided context. Be concise and direct. If the evidence is incomplete, ambiguous, or missing, explicitly state the uncertainty rather than guessing.

[Insert Question/Context Here]
```
