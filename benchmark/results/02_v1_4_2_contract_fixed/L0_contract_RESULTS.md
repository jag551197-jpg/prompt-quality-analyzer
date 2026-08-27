# Prompt Quality Analyzer Benchmark Report

- **Generated:** 2026-08-26T23:50:07.402776+00:00
- **Benchmark:** `L0_contract.json`
- **API:** `https://dainty-croissant-88f7f5.netlify.app`
- **Runner:** v3.1 resilient sequential
- **Batch size:** 5
- **Checkpoint:** `L0_contract.checkpoint.json`

## Executive Summary

| Metric | Result |
|---|---:|
| Total cases | 10 |
| Cases returned | 10 |
| Completed cases | 10 |
| Completed batches | 2/2 |
| Expectation passes | 10 |
| Expectation failures | 0 |
| Pass rate | 100.0% |
| Average score | 27.9 |
| Result integrity rate | 100.0% |

## Batch Status

| Batch | Status | Benchmark ID | Completed | Total |
|---:|---|---|---:|---:|
| 1 | completed | 93d0e627-53f0-44c2-879c-6ae9888881bb | 5 | 5 |
| 2 | completed | d22fe36b-e9da-4500-b195-235949bee4f4 | 5 | 5 |

## Case Results

| Case | Category | Status | Score | Risk | Expectation |
|---|---|---|---:|---|---|
| L0-01 | Contract | completed | 33 | medium | PASS |
| L0-02 | Contract | completed | 25 | medium | PASS |
| L0-03 | Contract | completed | 37 | medium | PASS |
| L0-04 | Contract | completed | 20 | medium | PASS |
| L0-05 | Contract | completed | 27 | medium | PASS |
| L0-06 | Contract | completed | 28 | medium | PASS |
| L0-07 | Contract | completed | 20 | medium | PASS |
| L0-08 | Contract | completed | 27 | medium | PASS |
| L0-09 | Contract | completed | 31 | medium | PASS |
| L0-10 | Contract | completed | 31 | medium | PASS |

## Detailed Cases

### L0-01

- Status: `completed`
- Score: `33`
- Risk: `medium`

**Weaknesses**
- No code snippet or context is provided.
- Lacks specific review criteria (e.g., syntax, security, logic, performance).
- No output schema, format, or structure is specified.
- Lacks guidance for handling missing information or ambiguity.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the source code snippet or file to be reviewed.
- Specify the review criteria (e.g., security vulnerabilities, runtime bugs, performance, style).
- Define a structured output format (e.g., issue description, severity, suggested fix).
- Explicitly permit the model to ask for missing context or state if code is insufficient.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please review the following code for bugs, security vulnerabilities, logic errors, and performance issues. If the provided code is incomplete or context is missing, state what additional information is required instead of making assumptions.

Code:
```
[Paste your code here]
```

Format your response as follows:
- Summary of Findings
- Identified Issues (including severity, description, and suggested fix)
- Recommendations / Improved Code Snippet (if applicable)
```

### L0-02

- Status: `completed`
- Score: `25`
- Risk: `medium`

**Weaknesses**
- Severe underspecification: jurisdiction, tax types, target audience, and scope are missing.
- No output contract specifying structure, length, tone, or key topics to cover.
- No guidance on handling uncertainty or specifying geographical bounds (e.g., US federal vs. international).
- The prompt is very short and may underspecify the task.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Specify the target jurisdiction (e.g., United States, UK, general economic theory).
- Clarify the target audience and depth (e.g., beginner-friendly overview, corporate compliance, historical background).
- Define an explicit output schema or structure (e.g., bulleted list covering income tax, sales tax, property tax, and core filing principles).
- Include instructions on clarifying assumptions or noting regional variations.
- State the task, relevant constraints, and expected output explicitly.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide a comprehensive, beginner-friendly overview of taxation. Structure your response into the following sections:
1. Definition & Core Purpose: What taxes are and why governments levy them.
2. Common Types of Taxes: Brief descriptions of income tax, sales tax, property tax, and corporate tax.
3. Basic Mechanics: Key concepts such as progressive vs. regressive taxation, deductions, and tax returns.

Note: If discussing specific tax laws or brackets, clearly state which jurisdiction you are using as an example (e.g., US Federal) and note where regional variations apply.
```

### L0-03

- Status: `completed`
- Score: `37`
- Risk: `medium`

**Weaknesses**
- No specific question or document text is provided or structured via clear placeholders.
- Lacks strict negative constraints to prevent external knowledge use.
- No fallback instructions for when the document does not contain the answer.
- Lacks an output format specification or schema contract.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.
- Use explicit delimiters to separate instructions, source context, and the user question.

**Recommended prompt**

```text
Answer the question below strictly using only the provided document. If the document does not contain sufficient information to answer the question, state "The provided document does not contain enough information to answer this question." Do not rely on external assumptions or prior knowledge.

### Document:
[Insert document text here]

### Question:
[Insert question here]

### Response Format:
Provide a direct and concise answer followed by verbatim supporting quotes from the document.
```

### L0-04

- Status: `completed`
- Score: `20`
- Risk: `medium`

**Weaknesses**
- Missing the actual problem statement or task definition ('this' is undefined).
- No output format, structure, or validation contract specified.
- Lacks guidance on which tools to select or when to invoke them.
- No instructions on handling missing information or failure states.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- State the specific problem or task explicitly instead of using ambiguous demonstrative pronouns ('this').
- Define the expected output format, structure, and constraints (e.g., JSON schema, Markdown, step-by-step summary).
- Specify which tools are available, when to call them, and how tool outputs should be incorporated.
- Include uncertainty handling or abstention rules if required information is missing or tools fail.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please solve the following task: [INSERT SPECIFIC PROBLEM OR TASK DESCRIPTION HERE].

Instructions:
1. If additional information is required and appropriate tools are available, use the relevant tools to gather data before generating your solution.
2. If the problem cannot be resolved or necessary information is unavailable, explicitly state what is missing instead of assuming facts.
3. Format your response with a clear step-by-step explanation followed by the final answer.
```

### L0-05

- Status: `completed`
- Score: `27`
- Risk: `medium`

**Weaknesses**
- No input text or document context is provided to extract data from.
- The phrase 'important fields' is highly subjective and underspecified.
- Lacks an output format specification (e.g., JSON schema, key-value pairs, table).
- Missing instructions on how to handle missing or ambiguous fields.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the source text or document from which fields should be extracted.
- Explicitly name the required fields to extract instead of relying on subjective terms like 'important'.
- Define a strict output format, such as a JSON schema.
- Instruct the model to return null or state when information is absent rather than guessing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Extract the following target fields from the provided text:
- [Field 1]
- [Field 2]
- [Field 3]

Formatting requirements:
- Return the extracted data as a valid JSON object matching the requested field names.
- If a field is not mentioned or cannot be determined from the text, set its value to null.
- Do not include extra fields or assumptions not directly supported by the text.

Text:
"""
[Insert text here]
"""
```

### L0-06

- Status: `completed`
- Score: `28`
- Risk: `medium`

**Weaknesses**
- Lacks the actual customer question or placeholders for dynamic inputs.
- Provides no background context, reference documentation, or policy constraints.
- Lacks explicit output format, tone, length, or structural requirements.
- Does not specify fallback behavior when the question is ambiguous or lacks sufficient context.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Include placeholders for the customer question and any relevant reference documentation.
- Define a clear output structure, tone, and formatting constraints.
- Add explicit uncertainty guidelines instructing the model to ask for clarification or state insufficient information if details are missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
You are a customer support specialist. Answer the following customer question based strictly on the provided support guidelines and documentation.

### Customer Question:
[Insert customer question here]

### Reference Context / Support Guidelines:
[Insert relevant documentation or guidelines here]

### Instructions:
1. Provide a clear, professional, and concise response addressing the customer's inquiry.
2. Only use information provided in the Reference Context. If the context does not contain sufficient information to resolve the question, clearly state what information is missing and politely ask the customer for clarification.
3. Do not invent policies, dates, or specifications not found in the context.
```

### L0-07

- Status: `completed`
- Score: `20`
- Risk: `medium`

**Weaknesses**
- No data is provided in the prompt or context, creating dangling referential ambiguity ('this data').
- Lacks explicit analytical goals, target metrics, or interpretation criteria.
- Lacks an output format specification or schema contract.
- No guidance on handling missing, incomplete, or ambiguous data points.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Provide the dataset or data points to be analyzed directly in the context block or prompt.
- Define specific analysis objectives (e.g., summary statistics, trends, anomalies, business implications).
- Specify the desired output format, structure, or required sections.
- Allow the model to state if the data is insufficient or ambiguous rather than guessing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Analyze the following dataset based strictly on the provided information:

[INSERT DATA HERE]

Please provide your analysis structured under these sections:
1. Key Findings & Trends
2. Potential Implications
3. Anomalies or Limitations in the Data

If the data is missing, insufficient, or ambiguous for drawing definitive conclusions, explicitly state what is missing rather than speculating.
```

### L0-08

- Status: `completed`
- Score: `27`
- Risk: `medium`

**Weaknesses**
- Extremely brief and underspecified, leaving scope, jurisdictions, and focus areas undefined.
- Lacks an output format, schema, or structural requirements.
- Provides no grounding sources, temporal scope, or evidence constraints.
- Contains no instructions for handling uncertainty or missing information.
- The prompt is very short and may underspecify the task.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- State the specific jurisdictions, regulatory bodies, or key frameworks to analyze (e.g., EU AI Act, US Executive Orders).
- Specify the desired output format (e.g., structured overview, comparative table, bullet points).
- Define explicit grounding constraints or provide source materials to rely on.
- Instruct the model to indicate uncertainty or missing details when information is unavailable.
- State the task, relevant constraints, and expected output explicitly.
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Provide a comprehensive research overview of current and emerging AI regulations across major jurisdictions (e.g., European Union, United States, and international frameworks).

Organize your response using the following structure:
1. Key Regulatory Frameworks: Name, governing body, and status (enacted, proposed, guidance).
2. Scope & Risk Classification: Core compliance tiers, risk categories, or covered AI applications.
3. Compliance Requirements: Main developer/deployer obligations (e.g., transparency, auditing, data governance).
4. Enforcement & Penalties: Summary of oversight mechanisms and potential liabilities.

If specific regulatory provisions or enforcement dates remain uncertain or under debate, explicitly state the ambiguity rather than assuming an outcome.
```

### L0-09

- Status: `completed`
- Score: `31`
- Risk: `medium`

**Weaknesses**
- Refers to an attached document that is not provided in context.
- Lacks explicit grounding constraints instructing the model to rely solely on the provided text.
- Omits uncertainty handling or instructions for when the document is missing or ambiguous.
- Lacks an output format specification such as length, tone, structure, or key focus areas.
- Factual or document-oriented task lacks an explicit grounding constraint.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Include the document text directly within the context or prompt delimiters.
- Instruct the model to rely strictly on the provided document without extrapolating.
- Specify an abstention behavior if the document is missing, unreadable, or lacks necessary details.
- Define a concrete output structure (e.g., bullet points, executive summary, length limits).
- Tell the model which evidence it may rely on and what to do when evidence is missing.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Summarize the document provided below.

Instructions:
- Rely solely on the facts directly stated in the document; do not assume or extrapolate information.
- If the document is missing or does not contain sufficient information, state: "No document provided or content is insufficient to summarize."
- Structure the summary with a 2-3 sentence overview followed by 3-5 bullet points highlighting key takeaways.

[Insert Document Here]
```

### L0-10

- Status: `completed`
- Score: `31`
- Risk: `medium`

**Weaknesses**
- References criteria and alternatives that are not provided in the prompt or context.
- Lacks a defined output format or schema (e.g., table, matrix, specific fields).
- Missing uncertainty handling instructions if criteria or alternative data are incomplete.
- No explicit insufficient-evidence or uncertainty behavior was detected.
- No clear output contract was detected.

**Recommendations**
- Supply the explicit list of three alternatives and evaluation criteria, or include placeholders for them.
- Define an explicit output contract (e.g., Markdown comparison table with specific summary sections).
- Instruct the model on how to handle missing or ambiguous information about any alternative.
- Allow the model to state that evidence is insufficient rather than inventing an answer.
- Specify the desired format, length, fields, or schema.

**Recommended prompt**

```text
Please compare the following three alternatives based on the specified criteria.

Alternatives:
1. [Insert Alternative 1]
2. [Insert Alternative 2]
3. [Insert Alternative 3]

Evaluation Criteria:
- [Insert Criterion 1]
- [Insert Criterion 2]
- [Insert Criterion 3]

Output Format Requirements:
- Present the comparison in a Markdown table where rows represent criteria and columns represent the alternatives.
- Include a brief 'Summary of Trade-offs' section following the table.
- If information regarding a specific alternative or criterion is unavailable or ambiguous, explicitly state 'Insufficient information' rather than assuming or extrapolating details.
```
