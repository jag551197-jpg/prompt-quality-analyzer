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
  if (currentLogs.length > 100) currentLogs = currentLogs.slice(-100);
  $('liveLog').textContent = currentLogs.join('\n');
  $('liveLog').scrollTop = $('liveLog').scrollHeight;
}
function setProgress(evt) {
  if (evt.request_id) $('requestId').textContent = evt.request_id.slice(0, 8);
  if (evt.stage) $('stage').textContent = evt.message || evt.stage;
  if (Number.isFinite(evt.progress)) {
    $('progressBar').style.width = `${Math.max(0, Math.min(100, evt.progress))}%`;
    $('progressText').textContent = `${Math.round(evt.progress)}%`;
  }
  if (evt.eta_ms != null) currentEtaMs = Math.max(0, Number(evt.eta_ms));
  appendLog(evt);
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
    $('judgeResponse').textContent = r.judge?.error ? `No Gemini response.\nFallback reason: ${r.judge.error_category || 'judge_unavailable'}\n${r.judge.error}` : 'Gemini judge was not configured. Deterministic analysis was used.';
  }
}

async function streamAnalysis(payload) {
  const res = await fetch('/api/analyze-stream', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' }, body: JSON.stringify(payload) });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || data.error || `Analysis failed (${res.status})`);
  }
  if (!res.body) throw new Error('Streaming response is not available in this browser.');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalResult = null;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n'); buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.trim()) continue;
      const evt = JSON.parse(line);
      if (evt.type === 'progress') setProgress(evt);
      else if (evt.type === 'meta') { $('requestId').textContent = evt.request_id?.slice(0,8) || '—'; appendLog({ message: `Request ${evt.request_id} started` }); }
      else if (evt.type === 'result') finalResult = evt.result;
      else if (evt.type === 'error') throw new Error(evt.detail || evt.error || 'Analysis failed');
    }
  }
  if (buffer.trim()) {
    const evt = JSON.parse(buffer);
    if (evt.type === 'result') finalResult = evt.result;
  }
  if (!finalResult) throw new Error('Analysis stream ended without a result.');
  return finalResult;
}

async function analyze(promptOverride) {
  const prompt = promptOverride ?? $('prompt').value;
  if (!prompt.trim()) return alert('Paste a prompt first.');
  btn.disabled = true; btn.textContent = 'Analyzing…'; resetRun(); startClock();
  try {
    const payload = { prompt, context: $('context').value, intendedUse: $('useCase').value, requiresCurrentFacts: $('current').checked };
    const result = await streamAnalysis(payload);
    render(result); stopClock(result.timing?.total_ms);
  } catch (e) {
    stopClock(); appendLog({ stage: 'error', message: e.message }); alert(e.message);
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
