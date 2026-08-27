#!/usr/bin/env node
import fs from 'node:fs/promises';
import { analyzePrompt } from './core/analyze.js';
import { configFromEnv } from './server/config.js';
const args=process.argv.slice(2);
if (!args.length) { console.error('Usage: npm run cli -- <prompt-file> [use-case]'); process.exit(2); }
const prompt=await fs.readFile(args[0],'utf8');
const result=await analyzePrompt({ prompt, intendedUse:args[1] || 'general' }, configFromEnv());
console.log(JSON.stringify(result,null,2));
