#!/usr/bin/env python3
import argparse, json, os, sys, time, urllib.request, urllib.error
from datetime import datetime, timezone
from pathlib import Path

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def post_json(url, payload, token=None, timeout=30):
    data = json.dumps(payload).encode()
    headers = {"Content-Type":"application/json","Accept":"application/json","User-Agent":"pqa-benchmark-cli/1.0"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read().decode()
            return r.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode(errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {raw}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error: {e.reason}")

def cases_of(state):
    for k in ("cases","results","benchmark_cases"):
        if isinstance(state.get(k), list):
            return state[k]
    return []

def summary_of(state):
    s = state.get("summary")
    if isinstance(s, dict):
        return s
    cases = cases_of(state)
    done = passed = failed = 0
    scores = []
    for c in cases:
        if str(c.get("status","")).lower() in ("complete","completed","failed","cancelled"):
            done += 1
        exp = c.get("expectation") or c.get("expectation_result") or {}
        ep = exp.get("pass") if isinstance(exp, dict) else c.get("passed")
        if ep is True: passed += 1
        elif ep is False: failed += 1
        result = c.get("result") or c.get("analysis") or {}
        if isinstance(result.get("analysis"), dict): result = result["analysis"]
        sc = result.get("overall_score")
        if isinstance(sc,(int,float)): scores.append(sc)
    total = len(cases)
    return {
        "total_cases": total,
        "completed_cases": done,
        "expectation_passes": passed,
        "expectation_failures": failed,
        "expectation_pass_rate": round((passed/max(1,passed+failed))*100,2) if passed+failed else None,
        "average_overall_score": round(sum(scores)/len(scores),2) if scores else None,
    }

def is_done(state):
    if str(state.get("status","")).lower() in ("complete","completed","failed","cancelled"):
        return True
    s = summary_of(state)
    return (s.get("total_cases") or 0) > 0 and (s.get("completed_cases") or 0) >= (s.get("total_cases") or 0)

def flatten_case(c):
    result = c.get("result") or c.get("analysis") or {}
    if isinstance(result.get("analysis"), dict): result = result["analysis"]
    exp = c.get("expectation") or c.get("expectation_result") or {}
    exp_pass = exp.get("pass") if isinstance(exp, dict) else c.get("passed")
    return {
        "id": c.get("id") or c.get("case_id") or c.get("name") or "unnamed",
        "status": c.get("status",""),
        "score": result.get("overall_score", c.get("overall_score")),
        "risk": result.get("hallucination_risk", c.get("hallucination_risk")),
        "quality": result.get("quality_level", c.get("quality_level")),
        "expectation_pass": exp_pass,
        "prompt": c.get("prompt",""),
        "weaknesses": result.get("weaknesses") or [],
        "recommendations": result.get("recommendations") or [],
        "improved_prompt": result.get("improved_prompt"),
    }

def esc(v): return str(v).replace("|","\\|").replace("\n"," ")

def render_md(state, source, base, started, ended):
    s = summary_of(state)
    cases = [flatten_case(c) for c in cases_of(state)]
    lines = [
        "# Prompt Quality Analyzer Benchmark Report","",
        f"- **Generated:** {ended}",
        f"- **Benchmark source:** `{source}`",
        f"- **API:** `{base}`",
        f"- **Started:** {started}",
        f"- **Completed:** {ended}",
    ]
    if state.get("benchmark_id"): lines.append(f"- **Benchmark ID:** `{state['benchmark_id']}`")
    if state.get("benchmark_name"): lines.append(f"- **Benchmark name:** {state['benchmark_name']}")
    lines += ["","## Executive Summary","","| Metric | Result |","|---|---:|"]
    metrics = [
        ("Total cases", s.get("total_cases")),
        ("Completed cases", s.get("completed_cases")),
        ("Expectation passes", s.get("expectation_passes")),
        ("Expectation failures", s.get("expectation_failures")),
        ("Expectation pass rate", f"{s.get('expectation_pass_rate')}%" if s.get("expectation_pass_rate") is not None else "N/A"),
        ("Average overall score", s.get("average_overall_score") if s.get("average_overall_score") is not None else "N/A"),
    ]
    for k,v in metrics: lines.append(f"| {k} | {v} |")
    lines += ["","## Case Results","","| Case | Status | Score | Risk | Quality | Expectation |","|---|---|---:|---|---|---|"]
    for c in cases:
        ep = "PASS" if c["expectation_pass"] is True else "FAIL" if c["expectation_pass"] is False else "N/A"
        lines.append(f"| {esc(c['id'])} | {esc(c['status'])} | {c['score'] if c['score'] is not None else 'N/A'} | {esc(c['risk'] or 'N/A')} | {esc(c['quality'] or 'N/A')} | {ep} |")
    lines += ["","## Detailed Cases",""]
    for c in cases:
        lines += [f"### {c['id']}",""]
        if c["prompt"]:
            lines += ["**Prompt**","","```text",c["prompt"],"```",""]
        lines += [
            f"- Status: `{c['status']}`",
            f"- Overall score: `{c['score'] if c['score'] is not None else 'N/A'}`",
            f"- Hallucination risk: `{c['risk'] or 'N/A'}`",
            f"- Quality: `{c['quality'] or 'N/A'}`",
        ]
        if c["weaknesses"]:
            lines += ["","**Weaknesses**"]
            lines += [f"- {x}" for x in c["weaknesses"][:10]]
        if c["recommendations"]:
            lines += ["","**Recommendations**"]
            lines += [f"- {x}" for x in c["recommendations"][:10]]
        if c["improved_prompt"]:
            lines += ["","**Recommended prompt**","","```text",str(c["improved_prompt"]),"```"]
        lines.append("")
    lines += ["## Machine Result","",f"**Benchmark result:** {'PASS' if (s.get('expectation_failures') or 0)==0 else 'FAIL'}",""]
    return "\n".join(lines)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("benchmark")
    ap.add_argument("--url", default=os.getenv("PQA_BASE_URL","http://localhost:3000"))
    ap.add_argument("--token", default=os.getenv("PQA_API_TOKEN"))
    ap.add_argument("--out")
    ap.add_argument("--poll", type=float, default=1.0)
    ap.add_argument("--timeout", type=int, default=600)
    ap.add_argument("--http-timeout", type=int, default=30)
    args = ap.parse_args()

    src = Path(args.benchmark)
    if not src.exists():
        print(f"ERROR: {src} not found", file=sys.stderr); return 3
    try:
        payload = json.loads(src.read_text())
    except Exception as e:
        print(f"ERROR: invalid JSON: {e}", file=sys.stderr); return 3

    base = args.url.rstrip("/")
    out = Path(args.out) if args.out else src.with_name(src.stem + "-results-" + datetime.now().strftime("%Y%m%d-%H%M%S") + ".md")
    started = now_iso()
    t0 = time.monotonic()

    print(f"Submitting {src} -> {base}")
    try:
        code, state = post_json(base+"/api/benchmark-submit", payload, args.token, args.http_timeout)
    except Exception as e:
        print(f"ERROR submit: {e}", file=sys.stderr); return 3
    print(f"Accepted HTTP {code}")

    while True:
        s = summary_of(state)
        print(f"[{time.monotonic()-t0:6.1f}s] {s.get('completed_cases',0)}/{s.get('total_cases',0)} complete | pass={s.get('expectation_passes',0)} fail={s.get('expectation_failures',0)}")
        if is_done(state): break
        if time.monotonic()-t0 > args.timeout:
            print("ERROR: benchmark timeout", file=sys.stderr); return 4
        time.sleep(max(.2,args.poll))
        try:
            _, state = post_json(base+"/api/benchmark-status", state, args.token, args.http_timeout)
        except Exception as e:
            print(f"WARNING poll failed: {e}", file=sys.stderr)

    ended = now_iso()
    out.write_text(render_md(state, src, base, started, ended))
    s = summary_of(state)
    print(f"\nReport: {out}")
    print(f"Pass rate: {s.get('expectation_pass_rate','N/A')}%")
    print(f"Average score: {s.get('average_overall_score','N/A')}")
    result = 0 if (s.get("expectation_failures") or 0)==0 else 2
    print("Result:", "PASS" if result == 0 else "FAIL")
    return result

if __name__ == "__main__":
    raise SystemExit(main())
