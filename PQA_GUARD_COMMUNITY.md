# PQA Guard Community

PQA Guard Community is a defensive, pre-execution scanner for prompt and text-file inputs. It is designed to catch common prompt-injection and unsafe-input indicators before content is passed into the analyzer.

## Community limits

- 1 file per analysis
- 256 KB maximum file size
- 40,000 extracted characters maximum from the uploaded file
- allow-listed text/code extensions only
- executable, macro-enabled, archive and binary content is blocked

## Signals

The scanner checks for instruction override/prompt injection, role/policy manipulation, requests to expose secrets or system prompts, destructive/tool-abuse language, large encoded payloads, credential/private-key patterns, and active-script indicators.

## Security boundary

This is a heuristic content scanner. It is not antivirus, YARA, a sandbox, or proof that a file is safe. A future PQA Guard service can layer antivirus/YARA/sandbox integrations server-side without shipping private commercial scoring logic to the browser.
