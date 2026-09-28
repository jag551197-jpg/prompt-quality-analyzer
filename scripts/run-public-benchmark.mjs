import fs from 'node:fs/promises';
import { validateBenchmarkSuite, createBenchmarkRun, evaluateExpectations } from '../src/core/benchmark.js';
const file=process.argv[2]||'examples/benchmark-public-v3.json';
const suite=validateBenchmarkSuite(JSON.parse(await fs.readFile(file,'utf8')),{maxCases:50});
const run=createBenchmarkRun(suite);let failed=0;
for(const c of run.cases){const ev=evaluateExpectations(c.deterministic_result,c.expected);const state=ev.passed?'PASS':'FAIL';if(!ev.passed)failed++;console.log(`${state} ${c.case_id}: score=${c.deterministic_result.overall_score} risk=${c.deterministic_result.hallucination_risk}${ev.passed?'':` failed=${ev.checks.filter(x=>!x.pass).map(x=>x.name).join(',')}`}`);}
console.log(`\nPublic deterministic benchmark: ${run.cases.length-failed}/${run.cases.length} passed`);process.exitCode=failed?2:0;
