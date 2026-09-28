# PQA Community

Open-source AI instruction reliability for developers.

PQA Community evaluates prompt quality and hallucination exposure before an instruction is executed by a coding assistant or LLM. It is deliberately prompt-only and requires no repository access.

PQA Platform is the private commercial edition for project-document context, evidence verification, workspace/repository context and enterprise controls.


## Community v1.10.0 additions

- One local text-file upload per analysis, maximum 256 KB.
- Accepted text/code formats are explicitly allow-listed; executable, macro-enabled and binary files are blocked.
- PQA Guard Community performs a local heuristic scan for prompt injection, instruction override, secret-exfiltration requests, encoded payloads, credential material and active-script indicators before analysis.
- File content is decoded locally in the browser and added to the optional context field; the Community scanner is not antivirus or a malware sandbox.
- Commercial scoring/calibration logic is not included. Community remains based on the previously disclosed public engine.
