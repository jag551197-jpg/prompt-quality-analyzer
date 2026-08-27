#!/usr/bin/env python3
"""
Prompt Quality Analyzer Benchmark Runner v2
- Python 3 standard library only
- Linux/macOS compatible
- Automatically chunks benchmark files into sequential batches
- Default max batch size: 25
- Submits each batch asynchronously
- Polls until each batch completes
- Merges all batch results into one Markdown report
- Uses PQA_API_TOKEN from environment unless --token is provided

Exit codes:
  0 = all benchmark expectations passed
  2 = benchmark completed but one or more expectations failed
  3 = API/auth/config/network failure
  4 = timeout
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone
from pathlib import Path


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def post_json(url, payload, token=None, timeout=30):
    data = json.dumps(payload).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "pqa-benchmark-cli/2.0",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {e.code}: {raw}")
    except urllib.error.URLError as e:
        raise RuntimeError(f"Network error: {e.reason}")


def cases_of(state):
    for key in ("cases", "results", "benchmark_cases"):
        value = state.get(key)
        if isinstance(value, list):
            return value
    return []


def summary_of(state):
    summary = state.get("summary")
    if isinstance(summary, dict):
        return summary

    cases = cases_of(state)
    completed = passed = failed = 0
    scores = []

    for case in cases:
        status = str(case.get("status", "")).lower()
        if status in ("complete", "completed", "failed", "cancelled"):
            completed += 1

        exp = case.get("expectation") or case.get("expectation_result") or {}
        ep = exp.get("pass") if isinstance(exp, dict) else case.get("passed")
        if ep is True:
            passed += 1
        elif ep is False:
            failed += 1

        result = case.get("result") or case.get("analysis") or {}
        if isinstance(result.get("analysis"), dict):
            result = result["analysis"]

        score = result.get("overall_score")
        if isinstance(score, (int, float)):
            scores.append(score)

    return {
        "total_cases": len(cases),
        "completed_cases": completed,
        "expectation_passes": passed,
        "expectation_failures": failed,
        "expectation_pass_rate": (
            round((passed / max(1, passed + failed)) * 100, 2)
            if passed + failed else None
        ),
        "average_overall_score": (
            round(sum(scores) / len(scores), 2) if scores else None
        ),
    }


def is_done(state):
    status = str(state.get("status", "")).lower()
    if status in ("complete", "completed", "failed", "cancelled"):
        return True

    summary = summary_of(state)
    total = summary.get("total_cases") or 0
    completed = summary.get("completed_cases") or 0
    return total > 0 and completed >= total


def flatten_case(case):
    result = case.get("result") or case.get("analysis") or {}
    if isinstance(result.get("analysis"), dict):
        result = result["analysis"]

    exp = case.get("expectation") or case.get("expectation_result") or {}
    exp_pass = exp.get("pass") if isinstance(exp, dict) else case.get("passed")

    return {
        "id": case.get("id") or case.get("case_id") or case.get("name") or "unnamed",
        "category": case.get("category", ""),
        "status": case.get("status", ""),
        "score": result.get("overall_score", case.get("overall_score")),
        "risk": result.get("hallucination_risk", case.get("hallucination_risk")),
        "quality": result.get("quality_level", case.get("quality_level")),
        "expectation_pass": exp_pass,
        "prompt": case.get("prompt", ""),
        "weaknesses": result.get("weaknesses") or [],
        "recommendations": result.get("recommendations") or [],
        "improved_prompt": result.get("improved_prompt"),
    }


def md_escape(value):
    return str(value).replace("|", "\\|").replace("\n", " ")


def merge_batch_states(original_payload, batch_states):
    merged_cases = []
    batch_meta = []

    for index, state in enumerate(batch_states, start=1):
        merged_cases.extend(cases_of(state))
        batch_meta.append({
            "batch": index,
            "benchmark_id": state.get("benchmark_id"),
            "benchmark_name": state.get("benchmark_name"),
            "status": state.get("status"),
            "summary": summary_of(state),
        })

    passed = failed = completed = 0
    scores = []

    for case in merged_cases:
        flat = flatten_case(case)
        if str(flat["status"]).lower() in ("complete", "completed", "failed", "cancelled"):
            completed += 1
        if flat["expectation_pass"] is True:
            passed += 1
        elif flat["expectation_pass"] is False:
            failed += 1
        if isinstance(flat["score"], (int, float)):
            scores.append(flat["score"])

    total = len(merged_cases)

    return {
        "benchmark_name": original_payload.get("benchmark_name", "benchmark"),
        "benchmark_version": original_payload.get("benchmark_version"),
        "status": "completed",
        "cases": merged_cases,
        "batches": batch_meta,
        "summary": {
            "total_cases": total,
            "completed_cases": completed,
            "expectation_passes": passed,
            "expectation_failures": failed,
            "expectation_pass_rate": (
                round((passed / max(1, passed + failed)) * 100, 2)
                if passed + failed else None
            ),
            "average_overall_score": (
                round(sum(scores) / len(scores), 2) if scores else None
            ),
            "batch_count": len(batch_states),
        },
    }


def render_md(state, source, base, started, ended, batch_size):
    summary = summary_of(state)
    cases = [flatten_case(c) for c in cases_of(state)]

    lines = [
        "# Prompt Quality Analyzer Benchmark Report",
        "",
        f"- **Generated:** {ended}",
        f"- **Benchmark source:** `{source}`",
        f"- **API:** `{base}`",
        f"- **Started:** {started}",
        f"- **Completed:** {ended}",
        f"- **Sequential batch size:** {batch_size}",
        f"- **Total batches:** {summary.get('batch_count', 'N/A')}",
    ]

    if state.get("benchmark_name"):
        lines.append(f"- **Benchmark name:** {state['benchmark_name']}")
    if state.get("benchmark_version"):
        lines.append(f"- **Benchmark version:** {state['benchmark_version']}")

    lines += [
        "",
        "## Executive Summary",
        "",
        "| Metric | Result |",
        "|---|---:|",
    ]

    metrics = [
        ("Total cases", summary.get("total_cases")),
        ("Completed cases", summary.get("completed_cases")),
        ("Expectation passes", summary.get("expectation_passes")),
        ("Expectation failures", summary.get("expectation_failures")),
        (
            "Expectation pass rate",
            f"{summary.get('expectation_pass_rate')}%"
            if summary.get("expectation_pass_rate") is not None
            else "N/A",
        ),
        (
            "Average overall score",
            summary.get("average_overall_score")
            if summary.get("average_overall_score") is not None
            else "N/A",
        ),
        ("Batches executed", summary.get("batch_count")),
    ]

    for key, value in metrics:
        lines.append(f"| {key} | {value} |")

    lines += [
        "",
        "## Batch Summary",
        "",
        "| Batch | Benchmark ID | Cases | Passes | Failures | Pass Rate |",
        "|---:|---|---:|---:|---:|---:|",
    ]

    for batch in state.get("batches", []):
        s = batch.get("summary") or {}
        lines.append(
            f"| {batch.get('batch')} | "
            f"{md_escape(batch.get('benchmark_id') or 'N/A')} | "
            f"{s.get('total_cases', 0)} | "
            f"{s.get('expectation_passes', 0)} | "
            f"{s.get('expectation_failures', 0)} | "
            f"{s.get('expectation_pass_rate', 'N/A')}% |"
        )

    lines += [
        "",
        "## Case Results",
        "",
        "| Case | Category | Status | Score | Risk | Quality | Expectation |",
        "|---|---|---|---:|---|---|---|",
    ]

    for case in cases:
        ep = (
            "PASS" if case["expectation_pass"] is True
            else "FAIL" if case["expectation_pass"] is False
            else "N/A"
        )
        lines.append(
            f"| {md_escape(case['id'])} | "
            f"{md_escape(case['category'] or 'N/A')} | "
            f"{md_escape(case['status'])} | "
            f"{case['score'] if case['score'] is not None else 'N/A'} | "
            f"{md_escape(case['risk'] or 'N/A')} | "
            f"{md_escape(case['quality'] or 'N/A')} | "
            f"{ep} |"
        )

    failures = [c for c in cases if c["expectation_pass"] is False]
    if failures:
        lines += ["", "## Failed Expectations", ""]
        for case in failures:
            lines += [
                f"### {case['id']}",
                "",
                f"- **Category:** {case['category'] or 'N/A'}",
                f"- **Score:** {case['score'] if case['score'] is not None else 'N/A'}",
                f"- **Hallucination risk:** {case['risk'] or 'N/A'}",
                "",
            ]

    lines += ["", "## Detailed Cases", ""]

    for case in cases:
        lines += [f"### {case['id']}", ""]

        if case["prompt"]:
            lines += [
                "**Prompt**",
                "",
                "```text",
                case["prompt"],
                "```",
                "",
            ]

        lines += [
            f"- Status: `{case['status']}`",
            f"- Overall score: `{case['score'] if case['score'] is not None else 'N/A'}`",
            f"- Hallucination risk: `{case['risk'] or 'N/A'}`",
            f"- Quality: `{case['quality'] or 'N/A'}`",
        ]

        if case["weaknesses"]:
            lines += ["", "**Weaknesses**"]
            lines.extend(f"- {x}" for x in case["weaknesses"][:10])

        if case["recommendations"]:
            lines += ["", "**Recommendations**"]
            lines.extend(f"- {x}" for x in case["recommendations"][:10])

        if case["improved_prompt"]:
            lines += [
                "",
                "**Recommended prompt**",
                "",
                "```text",
                str(case["improved_prompt"]),
                "```",
            ]

        lines.append("")

    failures_n = summary.get("expectation_failures") or 0
    lines += [
        "## Machine Result",
        "",
        f"**Benchmark result:** {'PASS' if failures_n == 0 else 'FAIL'}",
        "",
    ]

    return "\n".join(lines)


def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]


def run_batch(batch_num, total_batches, payload, base, token, poll_interval,
              overall_deadline, http_timeout):
    submit_url = base + "/api/benchmark-submit"
    status_url = base + "/api/benchmark-status"

    print("")
    print(f"=== Batch {batch_num}/{total_batches} | {len(payload['cases'])} cases ===")

    try:
        code, state = post_json(submit_url, payload, token, http_timeout)
    except Exception as e:
        raise RuntimeError(f"batch {batch_num} submit failed: {e}")

    print(f"Accepted HTTP {code}")
    if state.get("benchmark_id"):
        print(f"Benchmark ID: {state['benchmark_id']}")

    batch_start = time.monotonic()
    last_print = None

    while True:
        summary = summary_of(state)
        elapsed = time.monotonic() - batch_start
        total = summary.get("total_cases") or len(payload["cases"])
        completed = summary.get("completed_cases") or 0
        passes = summary.get("expectation_passes") or 0
        failures = summary.get("expectation_failures") or 0

        line = (
            f"[batch {batch_num} | {elapsed:6.1f}s] "
            f"{completed}/{total} complete | pass={passes} fail={failures}"
        )
        if line != last_print:
            print(line)
            last_print = line

        if is_done(state):
            return state

        if time.monotonic() > overall_deadline:
            raise TimeoutError("overall benchmark timeout exceeded")

        time.sleep(max(0.2, poll_interval))

        try:
            _, state = post_json(status_url, state, token, http_timeout)
        except Exception as e:
            print(f"WARNING batch {batch_num} poll failed: {e}", file=sys.stderr)
            # Continue polling until overall timeout.


def main():
    parser = argparse.ArgumentParser(
        description="Run PQA benchmark sequentially in API-safe batches and write one Markdown report"
    )
    parser.add_argument("benchmark", help="Path to benchmark JSON")
    parser.add_argument(
        "--url",
        default=os.getenv("PQA_BASE_URL", "http://localhost:3000"),
        help="PQA base URL",
    )
    parser.add_argument(
        "--token",
        default=os.getenv("PQA_API_TOKEN"),
        help="Bearer token; defaults to PQA_API_TOKEN",
    )
    parser.add_argument("--out", help="Markdown output path")
    parser.add_argument(
        "--batch-size",
        type=int,
        default=25,
        help="Cases per API submission. Default: 25",
    )
    parser.add_argument(
        "--poll",
        type=float,
        default=1.0,
        help="Polling interval seconds. Default: 1",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=3600,
        help="Overall timeout seconds for all batches. Default: 3600",
    )
    parser.add_argument(
        "--http-timeout",
        type=int,
        default=30,
        help="Per-request HTTP timeout seconds. Default: 30",
    )
    args = parser.parse_args()

    source = Path(args.benchmark)
    if not source.exists():
        print(f"ERROR: benchmark file not found: {source}", file=sys.stderr)
        return 3

    try:
        payload = json.loads(source.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"ERROR: invalid JSON: {e}", file=sys.stderr)
        return 3

    cases = payload.get("cases")
    if not isinstance(cases, list) or not cases:
        print("ERROR: benchmark JSON must contain a non-empty 'cases' array", file=sys.stderr)
        return 3

    if args.batch_size < 1 or args.batch_size > 25:
        print("ERROR: --batch-size must be between 1 and 25", file=sys.stderr)
        return 3

    base = args.url.rstrip("/")
    output = (
        Path(args.out)
        if args.out
        else source.with_name(
            source.stem
            + "-results-"
            + datetime.now().strftime("%Y%m%d-%H%M%S")
            + ".md"
        )
    )

    all_batches = list(chunks(cases, args.batch_size))
    total_batches = len(all_batches)
    started = now_iso()
    t0 = time.monotonic()
    overall_deadline = t0 + args.timeout

    print(f"Benchmark: {source}")
    print(f"API: {base}")
    print(f"Cases: {len(cases)}")
    print(f"Batch size: {args.batch_size}")
    print(f"Sequential batches: {total_batches}")

    batch_states = []

    for idx, batch_cases in enumerate(all_batches, start=1):
        batch_payload = {
            key: value
            for key, value in payload.items()
            if key != "cases"
        }
        base_name = payload.get("benchmark_name", source.stem)
        batch_payload["benchmark_name"] = f"{base_name} — batch {idx}/{total_batches}"
        batch_payload["cases"] = batch_cases

        try:
            state = run_batch(
                idx,
                total_batches,
                batch_payload,
                base,
                args.token,
                args.poll,
                overall_deadline,
                args.http_timeout,
            )
            batch_states.append(state)
        except TimeoutError as e:
            print(f"ERROR: {e}", file=sys.stderr)
            return 4
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            return 3

    merged = merge_batch_states(payload, batch_states)
    ended = now_iso()

    output.write_text(
        render_md(
            merged,
            str(source),
            base,
            started,
            ended,
            args.batch_size,
        ),
        encoding="utf-8",
    )

    summary = merged["summary"]
    failures = summary.get("expectation_failures") or 0

    print("")
    print("=== COMPLETE ===")
    print(f"Cases: {summary.get('completed_cases')}/{summary.get('total_cases')}")
    print(f"Batches: {summary.get('batch_count')}")
    print(f"Passes: {summary.get('expectation_passes')}")
    print(f"Failures: {summary.get('expectation_failures')}")
    print(f"Pass rate: {summary.get('expectation_pass_rate')}%")
    print(f"Average score: {summary.get('average_overall_score')}")
    print(f"Report: {output}")
    print(f"Result: {'PASS' if failures == 0 else 'FAIL'}")

    return 0 if failures == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
