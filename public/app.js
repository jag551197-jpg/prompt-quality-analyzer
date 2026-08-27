const $ = id => document.getElementById(id);
const btn = $('analyze');
let currentLogs = [];
let activeStart = 0;
let timer = null;
let currentEtaMs = null;

function list(el, items, empty) {
  el.innerHTML = '';
  (items?.length ? items : [empty]).forEach(x => { const li = document.createElement('li'); li.textContent = x; el.appendChild(li); });
}
function fmtMs(ms) { if (ms == null || !Number.isFinite(Number(ms))) return '—'; const n = Number(ms); return n < 1000 ? `${Math.round(n)}ms` : `${(n/1000).toFixed(1)}s`; }
function appendLog(evt) {
  const t = evt.elapsed_ms != null ? `+${fmtMs(evt.elapsed_ms)}` : new Date().toLocaleTimeString();
  const stage = evt.stage ? `[${evt.stage}]` : '';
  currentLogs.push(`${t} ${stage} ${evt.message || evt.type || 'event'}`.trim());
  if (currentLogs.length > 120) currentLogs = currentLogs.slice(-120);
  $('liveLog').textContent = currentLogs.join('\n');
  $('liveLog').scrollTop = $('liveLog').scrollHeight;
}
function setProgress({stage, message, progress, eta_ms, request_id}) {
  if (request_id) $('requestId').textContent = request_id.slice(0, 8);
  if (message || stage) $('stage').textContent = message || stage;
  if (Number.isFinite(progress)) {
    $('progressBar').style.width = `${Math.max(0, Math.min(100, progress))}%`;
    $('progressText').textContent = `${Math.round(progress)}%`;
  }
  if (eta_ms != null) currentEtaMs = Math.max(0, Number(eta_ms));
  appendLog({ stage, message, request_id });
}
function startClock() {
  activeStart = performance.now();
  currentEtaMs = null;
  clearInterval(timer);
  timer = setInterval(() => {
    const elapsed = performance.now() - activeStart;
    $('elapsed').textContent = fmtMs(elapsed);
    if (currentEtaMs != null) {
      currentEtaMs = Math.max(0, currentEtaMs - 250);
      $('eta').textContent = currentEtaMs <= 0 ? '<1s' : fmtMs(currentEtaMs);
    }
  }, 250);
}
function stopClock(totalMs) {
  clearInterval(timer); timer = null;
  if (totalMs != null) $('elapsed').textContent = fmtMs(totalMs);
  $('eta').textContent = '0s';
}
function resetRun() {
  currentLogs = [];
  $('liveLog').textContent = '';
  $('progressBar').style.width = '0%'; $('progressText').textContent = '0%'; $('stage').textContent = 'Starting'; $('requestId').textContent = '—';
  $('judgeResponse').textContent = 'Waiting for Gemini judge response…'; $('copyJudge').disabled = true;
}
function render(r) {
  $('score').textContent = r.overall_score;
  $('quality').textContent = r.quality_level.replaceAll('-', ' ').toUpperCase();
  $('risk').textContent = r.hallucination_risk.toUpperCase();
  $('mode').textContent = r.mode;
  $('judge').textContent = r.judge?.model || 'Not configured';
  $('judgeLatency').textContent = fmtMs(r.judge?.duration_ms);
  $('dimensions').innerHTML = Object.values(r.dimensions).map(d => `<div class="dim"><div class="dimline"><span>${d.label}</span><b>${d.score}</b></div><div class="bar"><i style="width:${d.score}%"></i></div></div>`).join('');
  list($('issues'), r.weaknesses, 'No major weaknesses identified.');
  list($('recs'), r.recommendations, 'No recommendations.');
  $('improved').value = r.improved_prompt || '';
  $('reanalyze').disabled = !r.improved_prompt;
  $('disclaimer').textContent = r.disclaimer + (r.judge?.error ? ` Judge fallback: ${r.judge.error}` : '');
  if (r.judge_response) {
    $('judgeResponse').textContent = JSON.stringify(r.judge_response, null, 2);
    $('copyJudge').disabled = false;
  } else {
    $('judgeResponse').textContent = r.judge?.error ? `No Gemini response.\nFallback reason: ${r.judge.error_category || 'judge_unavailable'}\n${r.judge.error}` : 'Gemini judge was not configured or has not run. Deterministic analysis was used.';
  }
}

async function postJson(url, payload) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.error || `Request failed (${res.status})`);
  return data;
}

/*
 * Portable two-phase execution:
 * 1) deterministic endpoint always returns first, so the user immediately sees a real result;
 * 2) full analysis endpoint adds Gemini when available and always fails open to deterministic.
 * This avoids making correctness dependent on streaming/CDN behavior.
 */
async function runAnalysis(payload) {
  setProgress({ stage: 'deterministic', message: 'Running deterministic prompt checks', progress: 8, eta_ms: 500 });
  const deterministic = await postJson('/api/deterministic', payload);
  setProgress({ stage: 'deterministic_complete', message: `Deterministic analysis complete (${fmtMs(deterministic.timing?.deterministic_ms)})`, progress: 30, eta_ms: 8000, request_id: deterministic.request_id });
  render(deterministic);
  appendLog({ stage: 'deterministic_result', message: `Preliminary score ${deterministic.overall_score}/100 • risk ${deterministic.hallucination_risk}` });

  setProgress({ stage: 'judge_request', message: 'Calling Gemini semantic judge', progress: 42, eta_ms: 8000 });
  const full = await postJson('/api/analyze', payload);
  appendLog({ stage: 'analysis_response', message: `Analysis API returned • request ${full.request_id?.slice(0,8) || '—'} • mode ${full.mode}` });
  setProgress({ stage: full.judge?.status === 'ok' ? 'judge_complete' : 'judge_fallback', message: full.judge?.status === 'ok' ? `Gemini judge complete (${fmtMs(full.judge?.duration_ms)})` : `Gemini unavailable; deterministic fallback (${full.judge?.error_category || full.judge?.status || 'unknown'})`, progress: 88, eta_ms: 250, request_id: full.request_id });
  render(full);
  setProgress({ stage: 'complete', message: `Analysis complete • score ${full.overall_score}/100`, progress: 100, eta_ms: 0, request_id: full.request_id });
  return full;
}

async function analyze(promptOverride) {
  const prompt = promptOverride ?? $('prompt').value;
  if (!prompt.trim()) return alert('Paste a prompt first.');
  btn.disabled = true; btn.textContent = 'Analyzing…'; resetRun(); startClock();
  try {
    const payload = { prompt, context: $('context').value, intendedUse: $('useCase').value, requiresCurrentFacts: $('current').checked };
    const result = await runAnalysis(payload);
    stopClock(result.timing?.total_ms);
  } catch (e) {
    stopClock();
    appendLog({ stage: 'error', message: e.message });
    alert(e.message);
  } finally { btn.disabled = false; btn.textContent = 'Analyze Prompt'; }
}

btn.addEventListener('click', () => analyze());
$('reanalyze').addEventListener('click', () => { $('prompt').value = $('improved').value; analyze($('improved').value); });
$('clearLog').addEventListener('click', () => { currentLogs = []; $('liveLog').textContent = 'Log cleared.'; });
$('copyJudge').addEventListener('click', async () => { try { await navigator.clipboard.writeText($('judgeResponse').textContent); $('copyJudge').textContent = 'Copied'; setTimeout(() => $('copyJudge').textContent = 'Copy JSON', 1200); } catch {} });
$('testJudge').addEventListener('click', async () => {
  const b = $('testJudge'); b.disabled = true; b.textContent = 'Testing…';
  try {
    const res = await fetch('/api/test-judge', { method: 'POST' });
    const data = await res.json();
    const msg = data.ok ? `Gemini connection OK • ${data.model} • ${fmtMs(data.duration_ms)}` : `Gemini unavailable • ${data.category || data.status}`;
    appendLog({ stage: 'connection_test', message: msg });
    alert(msg);
  } catch (e) { appendLog({ stage: 'connection_test', message: `Connection test failed: ${e.message}` }); alert(e.message); }
  finally { b.disabled = false; b.textContent = 'Test Gemini'; }
});
