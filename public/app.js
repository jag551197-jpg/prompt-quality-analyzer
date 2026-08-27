import { clearTransactions, getTransaction, listTransactions } from './idb.js';
import { cancelTransaction, createAnalysisTransaction, executeTransaction, getEstimatedProgress, resumePendingTransactions, subscribeTransactionUpdates, TERMINAL_STATES } from './job-manager.js';

const $ = id => document.getElementById(id);
const btn = $('analyze');
let activeId = null;
let pollTimer = null;
let elapsedTimer = null;
let lastRenderedUpdate = 0;

function list(el, items, empty) {
  el.innerHTML='';
  (items?.length ? items : [empty]).forEach(x => { const li=document.createElement('li'); li.textContent=x; el.appendChild(li); });
}
function fmtMs(ms) { if (ms == null || !Number.isFinite(Number(ms))) return '—'; const n=Number(ms); return n<1000?`${Math.round(n)}ms`:`${(n/1000).toFixed(1)}s`; }
function esc(s='') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function stateLabel(s='') { return s.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()); }

function renderResult(r) {
  if (!r) return;
  $('score').textContent=r.overall_score ?? '—';
  $('quality').textContent=(r.quality_level || 'ready').replaceAll('-',' ').toUpperCase();
  $('risk').textContent=(r.hallucination_risk || '—').toUpperCase();
  $('mode').textContent=r.mode || '—';
  $('judge').textContent=r.judge?.model || 'Not configured';
  $('judgeLatency').textContent=fmtMs(r.judge?.duration_ms);
  $('dimensions').innerHTML=Object.values(r.dimensions || {}).map(d=>`<div class="dim"><div class="dimline"><span>${esc(d.label)}</span><b>${d.score}</b></div><div class="bar"><i style="width:${Math.max(0,Math.min(100,d.score))}%"></i></div></div>`).join('');
  list($('issues'),r.weaknesses,'No major weaknesses identified.');
  list($('recs'),r.recommendations,'No recommendations.');
  $('improved').value=r.improved_prompt || '';
  $('reanalyze').disabled=!r.improved_prompt;
  $('disclaimer').textContent=(r.disclaimer || '') + (r.judge?.error ? ` Judge fallback: ${r.judge.error}` : '');
  if (r.judge_response) { $('judgeResponse').textContent=JSON.stringify(r.judge_response,null,2); $('copyJudge').disabled=false; }
  else { $('judgeResponse').textContent=r.judge?.error ? `No Gemini response.\nFallback reason: ${r.judge.error_category || 'judge_unavailable'}\n${r.judge.error}` : 'Gemini judge has not completed. Deterministic analysis is available.'; }
}

function renderEvents(tx) {
  $('liveLog').textContent=(tx?.events || []).map(e=>`${new Date(e.timestamp).toLocaleTimeString()} [${e.stage}] ${e.message}`).join('\n') || 'No events yet.';
  $('liveLog').scrollTop=$('liveLog').scrollHeight;
}

async function renderTransaction(tx) {
  if (!tx) return;
  lastRenderedUpdate=tx.updated_at || Date.now();
  const p=await getEstimatedProgress(tx);
  $('requestId').textContent=tx.id.slice(0,8);
  $('stage').textContent=stateLabel(tx.stage || tx.state);
  $('progressBar').style.width=`${p.progress}%`;
  $('progressText').textContent=`${p.progress}%`;
  $('eta').textContent=tx.state==='judge_running' ? fmtMs(p.eta_ms) : tx.state==='retry_wait' ? `retry ${fmtMs(p.eta_ms)}` : TERMINAL_STATES.has(tx.state) ? '—' : fmtMs(p.eta_ms);
  $('attempts').textContent=`${tx.attempts || 0}/3`;
  $('dbState').textContent=stateLabel(tx.state);
  renderEvents(tx);
  renderResult(tx.final_result || tx.deterministic_result);
  $('cancel').disabled=TERMINAL_STATES.has(tx.state);
  if (TERMINAL_STATES.has(tx.state)) { btn.disabled=false; btn.textContent='Analyze Prompt'; }
}

async function refreshHistory() {
  const txs=await listTransactions(12);
  $('history').innerHTML=txs.length ? txs.map(t=>`<button class="history-item" data-id="${t.id}"><span><b>${esc(t.payload?.intendedUse || 'General')}</b><small>${new Date(t.created_at).toLocaleString()}</small></span><span class="history-state">${esc(stateLabel(t.state))}</span></button>`).join('') : '<p class="privacy">No local transactions yet.</p>';
  $('history').querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',async()=>{ activeId=b.dataset.id; await renderTransaction(await getTransaction(activeId)); }));
}

async function pollActive() {
  if (!activeId) return;
  const tx=await getTransaction(activeId);
  if (!tx) return;
  await renderTransaction(tx);
  if (TERMINAL_STATES.has(tx.state)) await refreshHistory();
}

function startPolling() {
  clearInterval(pollTimer); clearInterval(elapsedTimer);
  pollTimer=setInterval(()=>pollActive().catch(console.error),500);
  elapsedTimer=setInterval(async()=>{
    if (!activeId) { $('elapsed').textContent='0.0s'; return; }
    const tx=await getTransaction(activeId);
    if (!tx?.started_at) return;
    const end=tx.completed_at || Date.now();
    $('elapsed').textContent=fmtMs(end-tx.started_at);
  },250);
}

async function startAnalysis(promptOverride) {
  const prompt=promptOverride ?? $('prompt').value;
  if (!prompt.trim()) return alert('Paste a prompt first.');
  btn.disabled=true; btn.textContent='Queued…';
  const payload={ prompt, context:$('context').value, intendedUse:$('useCase').value, requiresCurrentFacts:$('current').checked };
  const tx=await createAnalysisTransaction(payload);
  activeId=tx.id;
  await renderTransaction(tx); await refreshHistory();
  btn.textContent='Running asynchronously…';
  // Intentionally do not await. UI correctness comes from IndexedDB polling.
  void executeTransaction(tx.id);
}

btn.addEventListener('click',()=>startAnalysis().catch(e=>alert(e.message)));
$('reanalyze').addEventListener('click',()=>{ $('prompt').value=$('improved').value; startAnalysis($('improved').value).catch(e=>alert(e.message)); });
$('cancel').addEventListener('click',async()=>{ if(activeId){ await cancelTransaction(activeId); await pollActive(); }});
$('clearLog').addEventListener('click',async()=>{ if(!activeId)return; const tx=await getTransaction(activeId); if(tx){ tx.events=[]; const { putTransaction }=await import('./idb.js'); await putTransaction(tx); await pollActive(); }});
$('fetchServerLogs').addEventListener('click',async()=>{ if(!activeId)return alert('Select a transaction first.'); const b=$('fetchServerLogs'); b.disabled=true; b.textContent='Loading…'; try{ const res=await fetch(`/api/logs?request_id=${encodeURIComponent(activeId)}&limit=200`); const d=await res.json(); if(!res.ok) throw new Error(d.detail||d.error||`HTTP ${res.status}`); const lines=(d.logs||[]).map(e=>`${new Date(e.timestamp).toLocaleTimeString()} [SERVER:${e.stage||'event'}] ${e.message||''}`); const tx=await getTransaction(activeId); $('liveLog').textContent=[...(tx?.events||[]).map(e=>`${new Date(e.timestamp).toLocaleTimeString()} [BROWSER:${e.stage}] ${e.message}`),'',...lines].join('\n'); }catch(e){ alert(e.message); }finally{ b.disabled=false;b.textContent='Server Logs'; }});
$('clearHistory').addEventListener('click',async()=>{ if(confirm('Clear browser transaction history?')){ await clearTransactions(); activeId=null; await refreshHistory(); $('liveLog').textContent='History cleared.'; }});
$('copyJudge').addEventListener('click',async()=>{ try{ await navigator.clipboard.writeText($('judgeResponse').textContent); $('copyJudge').textContent='Copied'; setTimeout(()=>$('copyJudge').textContent='Copy JSON',1200);}catch{} });
$('testJudge').addEventListener('click',async()=>{ const b=$('testJudge'); b.disabled=true; b.textContent='Testing…'; try { const res=await fetch('/api/test-judge',{method:'POST'}); const d=await res.json(); alert(d.ok?`Gemini connection OK • ${d.model} • ${fmtMs(d.duration_ms)}`:`Gemini unavailable • ${d.category || d.status}`); } catch(e){ alert(e.message); } finally{ b.disabled=false;b.textContent='Test Gemini'; }});

subscribeTransactionUpdates(async msg=>{ if(msg?.id===activeId) await pollActive(); await refreshHistory(); });
startPolling();
await resumePendingTransactions();
const recent=await listTransactions(1); if(recent[0]) { activeId=recent[0].id; await renderTransaction(recent[0]); }
await refreshHistory();
