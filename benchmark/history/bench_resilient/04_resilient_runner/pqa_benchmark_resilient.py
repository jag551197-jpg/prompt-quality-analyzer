#!/usr/bin/env python3
import argparse, json, os, sys, time, urllib.request, urllib.error
from datetime import datetime, timezone
from pathlib import Path

TERMINAL={"complete","completed","failed","cancelled"}

def now(): return datetime.now(timezone.utc).isoformat()

def post(url,payload,token=None,timeout=30):
    data=json.dumps(payload).encode()
    h={"Content-Type":"application/json","Accept":"application/json","User-Agent":"pqa-benchmark-cli/3.0"}
    if token: h["Authorization"]=f"Bearer {token}"
    req=urllib.request.Request(url,data=data,headers=h,method="POST")
    try:
        with urllib.request.urlopen(req,timeout=timeout) as r:
            raw=r.read().decode(); return r.status,(json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode(errors='replace')}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error: {e.reason}")

def cases_of(s):
    for k in ("cases","results","benchmark_cases"):
        if isinstance(s.get(k),list): return s[k]
    return []

def flatten(c):
    r=c.get("result") or c.get("analysis") or {}
    if isinstance(r.get("analysis"),dict): r=r["analysis"]
    e=c.get("expectation") or c.get("expectation_result") or {}
    ep=e.get("pass") if isinstance(e,dict) else c.get("passed")
    return {"id":c.get("id") or c.get("case_id") or c.get("name") or "unnamed",
            "category":c.get("category",""),"status":c.get("status",""),
            "score":r.get("overall_score",c.get("overall_score")),
            "risk":r.get("hallucination_risk",c.get("hallucination_risk")),
            "quality":r.get("quality_level",c.get("quality_level")),
            "pass":ep,"prompt":c.get("prompt",""),
            "weaknesses":r.get("weaknesses") or [],"recommendations":r.get("recommendations") or [],
            "improved_prompt":r.get("improved_prompt")}

def summary(s):
    if isinstance(s.get("summary"),dict): return s["summary"]
    cs=cases_of(s); done=pa=fa=0; scores=[]
    for c in cs:
        f=flatten(c)
        if str(f["status"]).lower() in TERMINAL: done+=1
        if f["pass"] is True: pa+=1
        elif f["pass"] is False: fa+=1
        if isinstance(f["score"],(int,float)): scores.append(f["score"])
    return {"total_cases":len(cs),"completed_cases":done,"expectation_passes":pa,"expectation_failures":fa,
            "expectation_pass_rate":round(pa/max(1,pa+fa)*100,2) if pa+fa else None,
            "average_overall_score":round(sum(scores)/len(scores),2) if scores else None}

def done(s):
    if str(s.get("status","")).lower() in TERMINAL: return True
    x=summary(s); return (x.get("total_cases") or 0)>0 and (x.get("completed_cases") or 0)>=(x.get("total_cases") or 0)

def atomic(path,obj):
    tmp=Path(str(path)+".tmp"); tmp.write_text(json.dumps(obj,indent=2)); tmp.replace(path)

def chunk(items,n): return [items[i:i+n] for i in range(0,len(items),n)]

def cp_path(src): return src.with_name(src.stem+".checkpoint.json")

def esc(v): return str(v).replace("|","\\|").replace("\n"," ")

def merged(cp):
    cs=[]; batches=[]
    for b in cp["batches"]:
        st=b.get("state") or {}; cs.extend(cases_of(st)); batches.append({"index":b["index"],"status":b["status"],"id":st.get("benchmark_id"),"summary":summary(st)})
    pa=fa=donec=0; scores=[]
    for c in cs:
        f=flatten(c)
        if str(f["status"]).lower() in TERMINAL: donec+=1
        if f["pass"] is True: pa+=1
        elif f["pass"] is False: fa+=1
        if isinstance(f["score"],(int,float)): scores.append(f["score"])
    return {"cases":cs,"batches":batches,"summary":{"total_cases":cp["total_cases"],"reported_cases":len(cs),"completed_cases":donec,
            "expectation_passes":pa,"expectation_failures":fa,"expectation_pass_rate":round(pa/max(1,pa+fa)*100,2) if pa+fa else None,
            "average_overall_score":round(sum(scores)/len(scores),2) if scores else None,
            "batch_count":len(cp["batches"]),"completed_batches":sum(1 for b in cp["batches"] if b["status"]=="completed")}}

def render(cp,src,base):
    m=merged(cp); s=m["summary"]; L=["# Prompt Quality Analyzer Benchmark Report","",f"- **Generated:** {now()}",f"- **Benchmark:** `{src}`",f"- **API:** `{base}`",f"- **Runner:** v3 resilient sequential",f"- **Batch size:** {cp['batch_size']}",f"- **Checkpoint:** `{cp['checkpoint_file']}`","","## Executive Summary","","| Metric | Result |","|---|---:|",
        f"| Total cases | {s['total_cases']} |",f"| Cases returned | {s['reported_cases']} |",f"| Completed cases | {s['completed_cases']} |",f"| Completed batches | {s['completed_batches']}/{s['batch_count']} |",f"| Expectation passes | {s['expectation_passes']} |",f"| Expectation failures | {s['expectation_failures']} |",f"| Pass rate | {s['expectation_pass_rate'] if s['expectation_pass_rate'] is not None else 'N/A'}% |",f"| Average score | {s['average_overall_score'] if s['average_overall_score'] is not None else 'N/A'} |","","## Batch Status","","| Batch | Status | Benchmark ID | Completed | Total |","|---:|---|---|---:|---:|"]
    for b in m["batches"]:
        bs=b["summary"]; L.append(f"| {b['index']} | {b['status']} | {esc(b['id'] or 'N/A')} | {bs.get('completed_cases',0)} | {bs.get('total_cases',0)} |")
    L += ["","## Case Results","","| Case | Category | Status | Score | Risk | Expectation |","|---|---|---|---:|---|---|"]
    for raw in m["cases"]:
        f=flatten(raw); ep="PASS" if f["pass"] is True else "FAIL" if f["pass"] is False else "N/A"
        L.append(f"| {esc(f['id'])} | {esc(f['category'] or 'N/A')} | {esc(f['status'])} | {f['score'] if f['score'] is not None else 'N/A'} | {esc(f['risk'] or 'N/A')} | {ep} |")
    L += ["","## Detailed Cases",""]
    for raw in m["cases"]:
        f=flatten(raw); L += [f"### {f['id']}","",f"- Status: `{f['status']}`",f"- Score: `{f['score'] if f['score'] is not None else 'N/A'}`",f"- Risk: `{f['risk'] or 'N/A'}`"]
        if f["weaknesses"]: L += ["","**Weaknesses**"]+[f"- {x}" for x in f["weaknesses"][:10]]
        if f["recommendations"]: L += ["","**Recommendations**"]+[f"- {x}" for x in f["recommendations"][:10]]
        if f["improved_prompt"]: L += ["","**Recommended prompt**","","```text",str(f["improved_prompt"]),"```"]
        L.append("")
    return "\n".join(L)

def write_report(cp,src,base,out): out.write_text(render(cp,src,base)); return merged(cp)

def main():
    a=argparse.ArgumentParser(description="Resilient PQA benchmark runner")
    a.add_argument("benchmark"); a.add_argument("--url",default=os.getenv("PQA_BASE_URL","http://localhost:3000")); a.add_argument("--token",default=os.getenv("PQA_API_TOKEN")); a.add_argument("--out"); a.add_argument("--batch-size",type=int,default=5); a.add_argument("--poll",type=float,default=2.0); a.add_argument("--batch-timeout",type=int,default=1800); a.add_argument("--overall-timeout",type=int,default=0); a.add_argument("--http-timeout",type=int,default=30); a.add_argument("--resume",action="store_true"); a.add_argument("--restart-timeout-batch",action="store_true")
    args=a.parse_args(); src=Path(args.benchmark)
    if not src.exists(): print(f"ERROR: {src} not found",file=sys.stderr); return 3
    if not 1<=args.batch_size<=25: print("ERROR: batch-size must be 1..25",file=sys.stderr); return 3
    try: payload=json.loads(src.read_text())
    except Exception as e: print(f"ERROR invalid JSON: {e}",file=sys.stderr); return 3
    if not isinstance(payload.get("cases"),list) or not payload["cases"]: print("ERROR: cases[] required",file=sys.stderr); return 3
    cpf=cp_path(src); out=Path(args.out) if args.out else src.with_name(src.stem+"-results.md"); base=args.url.rstrip("/")
    if args.resume:
        if not cpf.exists(): print(f"ERROR: no checkpoint {cpf}",file=sys.stderr); return 3
        cp=json.loads(cpf.read_text()); print(f"Resuming {cpf}")
    else:
        batches=chunk(payload["cases"],args.batch_size); cp={"runner_version":"3.0","benchmark_file":str(src),"benchmark_name":payload.get("benchmark_name",src.stem),"benchmark_version":payload.get("benchmark_version"),"total_cases":len(payload["cases"]),"batch_size":args.batch_size,"checkpoint_file":str(cpf),"created_at":now(),"updated_at":now(),"batches":[]}
        for i,b in enumerate(batches,1): cp["batches"].append({"index":i,"cases":b,"status":"pending","state":None,"attempts":0,"last_error":None})
        atomic(cpf,cp)
    start=time.monotonic(); print(f"API: {base}\nCases: {cp['total_cases']}\nBatches: {len(cp['batches'])}\nBatch size: {cp['batch_size']}\nCheckpoint: {cpf}\nReport: {out}")
    for b in cp["batches"]:
        i=b["index"]
        if b["status"]=="completed": print(f"\nBatch {i}: completed, skipping"); continue
        if b["status"]=="timed_out" and not args.restart_timeout_batch: print(f"\nBatch {i}: previously timed out; use --restart-timeout-batch to resubmit"); continue
        if args.overall_timeout and time.monotonic()-start>args.overall_timeout: write_report(cp,src,base,out); return 4
        print(f"\n=== Batch {i}/{len(cp['batches'])} | {len(b['cases'])} cases ===")
        if b.get("state") and b["status"] in ("submitted","polling") and b["state"].get("benchmark_id"):
            st=b["state"]; print(f"Resuming benchmark ID {st.get('benchmark_id')}")
        else:
            bp={k:v for k,v in payload.items() if k!="cases"}; bp["benchmark_name"]=f"{payload.get('benchmark_name',src.stem)} — batch {i}/{len(cp['batches'])}"; bp["cases"]=b["cases"]
            try: code,st=post(base+"/api/benchmark-submit",bp,args.token,args.http_timeout)
            except Exception as e: b["status"]="submit_error"; b["last_error"]=str(e); atomic(cpf,cp); write_report(cp,src,base,out); print(f"ERROR submit: {e}",file=sys.stderr); return 3
            b["state"]=st; b["status"]="submitted"; b["attempts"]+=1; atomic(cpf,cp); print(f"Accepted HTTP {code}; benchmark ID={st.get('benchmark_id','N/A')}")
        bstart=time.monotonic(); errs=0
        while True:
            s=summary(st); elapsed=time.monotonic()-bstart; print(f"[batch {i} | {elapsed:6.1f}s] {s.get('completed_cases',0)}/{s.get('total_cases',len(b['cases']))} complete | pass={s.get('expectation_passes',0)} fail={s.get('expectation_failures',0)}")
            b["state"]=st; b["status"]="polling"; cp["updated_at"]=now(); atomic(cpf,cp); write_report(cp,src,base,out)
            if done(st): b["status"]="completed"; atomic(cpf,cp); write_report(cp,src,base,out); print(f"Batch {i} complete"); break
            if elapsed>args.batch_timeout: b["status"]="timed_out"; b["last_error"]=f"batch exceeded {args.batch_timeout}s"; atomic(cpf,cp); write_report(cp,src,base,out); print(f"WARNING batch {i} timed out; checkpoint preserved",file=sys.stderr); break
            if args.overall_timeout and time.monotonic()-start>args.overall_timeout: atomic(cpf,cp); write_report(cp,src,base,out); return 4
            time.sleep(max(.5,args.poll))
            try: _,st=post(base+"/api/benchmark-status",st,args.token,args.http_timeout); errs=0
            except Exception as e: errs+=1; b["last_error"]=str(e); print(f"WARNING poll error {errs}: {e}",file=sys.stderr); time.sleep(min(10,errs*2))
    m=write_report(cp,src,base,out); incomplete=[b for b in cp["batches"] if b["status"]!="completed"]
    print(f"\nCompleted batches: {m['summary']['completed_batches']}/{m['summary']['batch_count']}\nCompleted cases: {m['summary']['completed_cases']}/{m['summary']['total_cases']}\nReport: {out}\nCheckpoint: {cpf}")
    if incomplete:
        print("Incomplete batches:")
        for b in incomplete: print(f"  batch {b['index']}: {b['status']} ({b.get('last_error') or 'no detail'})")
        print(f"Resume: {sys.argv[0]} {src} --url {base} --resume")
        print(f"Retry timed-out batch(es): {sys.argv[0]} {src} --url {base} --resume --restart-timeout-batch")
        return 4
    fails=m["summary"]["expectation_failures"] or 0; print("Result:","PASS" if fails==0 else "FAIL"); return 0 if fails==0 else 2

if __name__=="__main__": raise SystemExit(main())
