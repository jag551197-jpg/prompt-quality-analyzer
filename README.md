# PQA Community Edition

A free, open-source **prompt checklist**. Paste a prompt (and any material it refers to) and get:
- a score: the share of applicable checks that pass, with **every check counting equally**;
- a quality level and a risk level;
- what to fix, check by check;
- an improved prompt you can copy;
- a security scan for prompt-injection and secret patterns.

Everything runs **in your browser**. Nothing is sent to a server. The interface is in English, Brazilian Portuguese and French.

## The eight checks
1. States a clear task.
2. Defines the expected output (format, length, structure).
3. Supplies the material it refers to.
4. Allows the model to say it is unsure.
5. Gives a source for current facts.
6. Asks for confirmation before risky actions (delete, send, pay).
7. Contains no instruction-override text.
8. Asks only for citations it can support.

A check that doesn't apply to your prompt is marked N/A and left out of the score.

**Risk** is *high* when check 4, 6 or 7 fails or three or more checks fail, *medium* when any check fails, and *low* otherwise.

## Use it
```bash
npm start                                 # http://localhost:3000
node src/cli.js "Summarise the notes below in 5 bullet points" --context notes.txt
node src/cli.js "Tell me today's exchange rate" --lang pt --json
```
`POST /api/analyze` with `{ "prompt": "...", "context": "...", "language": "en|pt|fr" }` returns the same result as JSON.

## Scope
This edition is a generic checklist of widely known good practices. It is independent of the commercial PQA platform ([promptquality.ai](https://promptquality.ai)), which uses a different, proprietary engine.

MIT licence. See `SECURITY.md` to report a vulnerability.
