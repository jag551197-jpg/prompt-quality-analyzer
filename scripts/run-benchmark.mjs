import fs from 'node:fs/promises';

const [,, file='examples/benchmark-smoke.json', base=process.env.PQA_BASE_URL||'http://localhost:3000'] = process.argv;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const apiToken=process.env.PQA_API_TOKEN||'';
async function jfetch(path,opts={}){
  const r=await fetch(new URL(path,base),{...opts,headers:{'content-type':'application/json',...(apiToken?{authorization:`Bearer ${apiToken}`}:{ } ),...(opts.headers||{})}});
  const body=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(`${r.status} ${path}: ${JSON.stringify(body)}`);
  return body;
}
const suite=JSON.parse(await fs.readFile(file,'utf8'));
let run=await jfetch('/api/benchmark-submit',{method:'POST',body:JSON.stringify(suite)});
console.log(`Benchmark ${run.benchmark_id} submitted: ${run.summary.total_cases} cases`);
while(run.summary?.status!=='completed'){
  await sleep(1000);
  run=await jfetch('/api/benchmark-status',{method:'POST',body:JSON.stringify(run)});
  console.log(`progress ${run.summary.terminal_cases}/${run.summary.total_cases} | pending ${run.summary.pending_cases}`);
}
console.log(JSON.stringify(run.summary,null,2));
for(const c of run.cases){
  const result=c.final_result;
  console.log(`${c.case_id}: ${result?.overall_score ?? 'n/a'} | ${result?.hallucination_risk ?? 'n/a'} | ${c.expectations?.passed ? 'PASS':'FAIL'}`);
}
const fail=run.summary.expectation_failures>0;
process.exitCode=fail?2:0;
