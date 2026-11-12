#!/usr/bin/env node
// Usage: node src/cli.js "your prompt" [--context file.txt] [--lang en|pt|fr] [--json]
import fs from 'node:fs';
import { analyzePrompt } from './analyze.js';
const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const prompt = args.find((a, i) => !a.startsWith('--') && !['--context', '--lang'].includes(args[i - 1])) || '';
if (!prompt) { console.error('Usage: node src/cli.js "your prompt" [--context file.txt] [--lang en|pt|fr] [--json]'); process.exit(2); }
const r = analyzePrompt({ prompt, context: opt('--context') ? fs.readFileSync(opt('--context'), 'utf8') : '', language: opt('--lang') || 'en' });
if (args.includes('--json')) console.log(JSON.stringify(r, null, 2));
else { console.log(`Score ${r.score}/100 · ${r.quality} · risk ${r.risk}`); for (const c of r.checks) console.log(`${c.status === 'pass' ? '✓' : c.status === 'fail' ? '✗' : '–'} ${c.label}${c.advice ? `\n    ${c.advice}` : ''}`); }
